// rules/feel.js
// 体感（風・湿度）に関するルール

import { THRESHOLDS } from '../config/thresholds.js';

/**
 * 体感に関する会話ルール
 * ① 風の強さ（段階分け）
 * ② 気温×風の組み合わせ
 * ③ 湿度（じめじめ/乾燥）
 */
export const feelRules = [
  // ===== ① 風の強さ：段階分け =====
  
  // --- やや強い風（8-12m/s） ---
  {
    id: "feel.wind.moderate",
    topic: "feel",
    weight: 48,
    when: ({ today }) => {
      const wind = today.windMax ?? 0;
      const gust = today.gustMax ?? 0;
      return (wind >= THRESHOLDS.windModerate && wind < THRESHOLDS.windStrong) ||
             (gust >= THRESHOLDS.gustModerate && gust < THRESHOLDS.gustStrong);
    },
    say: (tod) => ({
      morning: "今日はちょっと風が吹きそうですね",
      noon: "風が出てきましたね",
      evening: "今日は風があったみたいですね",
    }[tod]),
  },

  // --- 強い風（12m/s以上） ---
  {
    id: "feel.wind.strong",
    topic: "feel",
    weight: 58,
    when: ({ today }) => {
      const wind = today.windMax ?? 0;
      const gust = today.gustMax ?? 0;
      return wind >= THRESHOLDS.windStrong || gust >= THRESHOLDS.gustStrong;
    },
    say: (tod) => ({
      morning: "今日は風強いらしいですよ",
      noon: "風強そうですね",
      evening: "今日は風強かったらしいですね",
    }[tod]),
  },

  // ===== ② 気温×風の組み合わせ =====
  
  // --- 寒い日の強風（最高気温12℃以下 + 風8m/s以上） ---
  {
    id: "feel.wind.cold-windy",
    topic: "feel",
    weight: 62,
    when: ({ today }) => {
      const isCold = today.max <= THRESHOLDS.coldMax;
      const isWindy = (today.windMax ?? 0) >= THRESHOLDS.windModerate;
      return isCold && isWindy;
    },
    say: (tod) => ({
      morning: "寒い上に風も強いみたいですね",
      noon: "風が冷たくて寒いですね",
      evening: "今日は風も冷たかったですね",
    }[tod]),
  },

  // ===== ③ 湿度：じめじめ =====
  
  // --- 高湿度でじめじめ（湿度75%以上 + 気温20℃以上） ---
  {
    id: "feel.humidity.muggy",
    topic: "feel",
    weight: 55,
    when: ({ today }) => {
      const humidity = today.humidityMean ?? 0;
      const temp = today.max ?? 0;
      return humidity >= THRESHOLDS.humidityHigh && temp >= THRESHOLDS.humidityMuggyTemp;
    },
    say: (tod, { today }) => {
      const month = new Date(today.date).getMonth() + 1;
      const isRainySeason = month >= 6 && month <= 7; // 6-7月（梅雨）
      
      if (isRainySeason) {
        return {
          morning: "今日はじめじめしそうですね",
          noon: "湿気がすごいですね",
          evening: "今日は湿気が多かったですね",
        }[tod];
      } else {
        return {
          morning: "今日は蒸し暑そうですね",
          noon: "蒸し暑いですね",
          evening: "今日は蒸し暑かったですね",
        }[tod];
      }
    },
  },

  // ===== ③ 湿度：乾燥 =====
  
  // --- 低湿度で乾燥（湿度40%以下 + 気温15℃以下） ---
  {
    id: "feel.humidity.dry",
    topic: "feel",
    weight: 52,
    when: ({ today }) => {
      const humidity = today.humidityMean ?? 0;
      const temp = today.max ?? 0;
      return humidity > 0 && humidity <= THRESHOLDS.humidityLow && temp <= THRESHOLDS.humidityDryTemp;
    },
    say: (tod) => ({
      morning: "今日は乾燥しそうですね",
      noon: "空気が乾燥してますね",
      evening: "今日は乾燥してましたね",
    }[tod]),
  },
];