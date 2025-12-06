// talk_weather.js — JSON出力版

// ===== インポート =====
import { THRESHOLDS } from './config/thresholds.js';
import { API_CONFIG, TOPIC_ORDER, LIMIT_BY_TOPIC, TOPIC_HEADERS } from './config/settings.js';
import { buildRules } from './rules/index.js';
import { round1, sign1, timeOfDay } from './utils/helpers.js';
import fs from 'fs';
import path from 'path';

// トピック優先度マップ（内部処理用）
const topicPriority = Object.fromEntries(TOPIC_ORDER.map((t, i) => [t, i]));

// ===== データ取得（dailyのみ） =====
async function fetchDaily() {
  const daily = [
    "temperature_2m_max",
    "temperature_2m_min",
    "apparent_temperature_max",
    "apparent_temperature_min",
    "precipitation_sum",
    "precipitation_probability_max",
    "wind_speed_10m_max",
    "wind_gusts_10m_max",
    "weathercode",
    "sunshine_duration",
    "sunrise",
    "sunset",
    "daylight_duration",
    "relative_humidity_2m_mean",
  ].join(",");

  const params = new URLSearchParams({
    latitude: String(API_CONFIG.LAT),
    longitude: String(API_CONFIG.LON),
    timezone: API_CONFIG.TIMEZONE,
    past_days: String(API_CONFIG.DAYS_PAST),
    forecast_days: String(API_CONFIG.FORECAST_DAYS),
    daily,
  });

  const url = `https://api.open-meteo.com/v1/forecast?${params}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}`);
  return res.json();
}

// ===== 整形 =====
function buildSeries(json) {
  const t = json.daily;
  const len = t.time.length;
  const idxTomorrow = len - 1;
  const idxToday = len - 2;
  const idxYesterday = len - 3;

  const at = (arr, i) => (arr ? arr[i] : undefined);
  const dayObj = (i) => ({
    date: at(t.time, i),
    max: at(t.temperature_2m_max, i),
    min: at(t.temperature_2m_min, i),
    appMax: at(t.apparent_temperature_max, i),
    appMin: at(t.apparent_temperature_min, i),
    rain: at(t.precipitation_sum, i),
    rainProb: at(t.precipitation_probability_max, i),
    windMax: at(t.wind_speed_10m_max, i),
    gustMax: at(t.wind_gusts_10m_max, i),
    code: at(t.weathercode, i),
    sunshineSec: at(t.sunshine_duration, i),
    sunrise: at(t.sunrise, i),
    sunset: at(t.sunset, i),
    daylightSec: at(t.daylight_duration, i),
    humidityMean: at(t.relative_humidity_2m_mean, i),
  });

  const today = dayObj(idxToday);
  const yesterday = dayObj(idxYesterday);
  const tomorrow = dayObj(idxTomorrow);
  const last7 = Array.from({ length: idxTomorrow + 1 }, (_, i) => dayObj(i));
  return { today, yesterday, tomorrow, last7 };
}

// ===== 評価：フラット＋区画（byTopic）を返す =====
function evaluateAll(ctx, options = {}) {
  const rules = buildRules(options);
  const tod = timeOfDay();
  const hits = [];
  
  for (const r of rules) {
    try {
      if (r.when(ctx)) {
        const text = r.say(tod, ctx);
        if (text) hits.push({ id: r.id, topic: r.topic, weight: r.weight, text });
      }
    } catch { /* 続行 */ }
  }

  // 【安定型】何もルールが発動しなかった場合
  if (hits.length === 0) {
    const fallbackPhrases = {
      morning: [
        "穏やかな朝ですね",
        "過ごしやすい朝ですね",
        "いい天気が続いてますね",
      ],
      noon: [
        "過ごしやすい一日ですね",
        "安定した天気が続いてますね",
        "今日も穏やかな天気ですね",
      ],
      evening: [
        "平和な一日でしたね",
        "穏やかな一日でしたね",
        "いい天気が続いてますね",
      ],
    };
    
    const phrases = fallbackPhrases[tod];
    const randomIndex = Math.floor(Math.random() * phrases.length);
    const fallbackText = phrases[randomIndex];
    
    hits.push({
      id: "fallback.stable",
      topic: "fallback",
      weight: 1,
      text: fallbackText,
    });
  }

  // ① フラット：トピック順 → weight降順 → id安定
  const flat = hits.sort((a, b) => {
    const ta = topicPriority[a.topic] ?? 999;
    const tb = topicPriority[b.topic] ?? 999;
    if (ta !== tb) return ta - tb;
    if (b.weight !== a.weight) return b.weight - a.weight;
    return a.id.localeCompare(b.id);
  });

  // ② 区画：トピック別まとめ
  const byTopic = {};
  for (const h of flat) (byTopic[h.topic] ??= []).push(h);

  // ③ 件数制限
  const cappedByTopic = {};
  for (const [topic, list] of Object.entries(byTopic)) {
    const limit = LIMIT_BY_TOPIC[topic] ?? Infinity;
    cappedByTopic[topic] = list.slice(0, limit);
  }

  return { flat, byTopic: cappedByTopic };
}

// ===== 実行 =====
(async () => {
  try {
    const json = await fetchDaily();
    const ctx = buildSeries(json);

    // 拡張ルールのON/OFFはここで
    const options = {
      enableTomorrowRain: true,
      enableSunBreak: true,
    };

    // ★ 日本時刻（JST）を取得
    const now = new Date();
    const jstOffset = 9 * 60; // 9時間（分単位）
    const jstTime = new Date(now.getTime() + jstOffset * 60 * 1000);

    const { flat, byTopic } = evaluateAll(ctx, options);

    // 体感差
    const apparentDeltaMax =
      ctx.today.appMax != null && ctx.today.max != null ? ctx.today.appMax - ctx.today.max : null;
    const apparentDeltaMin =
      ctx.today.appMin != null && ctx.today.min != null ? ctx.today.appMin - ctx.today.min : null;

    // 詳細データ
    const details = {
      maxTemp: round1(ctx.today.max),
      minTemp: round1(ctx.today.min),
      yesterdayDiff: sign1(ctx.today.max - ctx.yesterday.max),
      apparentMax: round1(ctx.today.appMax),
      apparentMin: round1(ctx.today.appMin),
      apparentDeltaMax: apparentDeltaMax != null ? sign1(apparentDeltaMax) : null,
      apparentDeltaMin: apparentDeltaMin != null ? sign1(apparentDeltaMin) : null,
      rain: round1(ctx.today.rain),
      rainProbToday: round1(ctx.today.rainProb),
      rainProbTomorrow: round1(ctx.tomorrow.rainProb),
      windMax: round1(ctx.today.windMax),
      gustMax: round1(ctx.today.gustMax),
      humidity: ctx.today.humidityMean != null ? round1(ctx.today.humidityMean) : null,
      sunrise: ctx.today.sunrise,
      sunset: ctx.today.sunset,
    };

    // JSON出力用データ
    const output = {
      updatedAt: now.toISOString(),  // UTC時刻（システム記録用）
      updatedAtJST: jstTime.toISOString().replace('Z', '+09:00'),  // JST時刻（表示用）
      date: ctx.today.date,
      timeOfDay: timeOfDay(jstTime),  // ★ JST時刻で判定
      topPhrases: flat.slice(0, 3).map(p => ({
        id: p.id,
        topic: p.topic,
        text: p.text,
        weight: p.weight,
      })),
      byTopic: Object.fromEntries(
        TOPIC_ORDER.map(topic => [
          topic,
          {
            header: TOPIC_HEADERS[topic] || topic,
            phrases: (byTopic[topic] || []).map(p => ({
              id: p.id,
              text: p.text,
              weight: p.weight,
            })),
          },
        ])
      ),
      details,
    };

    // JSONファイルとして出力
    const outputDir = path.join(process.cwd(), '../frontend/public/data');
    const outputPath = path.join(outputDir, 'weather.json');
    
    // ディレクトリがなければ作成
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');
    console.log(`✅ 天気データを生成しました: ${outputPath}`);
    console.log(`📅 日付: ${ctx.today.date}`);
    console.log(`⏰ 時間帯: ${timeOfDay(jstTime)}`);  // ★ JST時刻で表示
    console.log(`💬 フレーズ数: ${flat.length}件`);
    
  } catch (e) {
    console.error("❌ エラー:", e.message);
    process.exit(1);
  }
})();