// rules/season.js
// 季節に関するルール

import { THRESHOLDS } from '../config/thresholds.js';
import {
  round1,
  getMinutesFromISOTime,
  getMeanTemp,
  isClearSky,
  isCloudySky
} from '../utils/helpers.js';

/**
 * 季節に関する会話ルール
 * ① 日の長さ（日没時刻）
 * ② 季節感（夏っぽい/冬っぽい/春秋らしい）
 * ③ 季節変わり目
 * ④ 梅雨
 */
export const seasonRules = [
  // ===== ① 日の長さ =====

  // --- 日が短い（日没が早い：17時前） ---
  {
    id: "season.daylight.sunset-early",
    topic: "season",
    weight: 55,
    when: ({ today }) => {
      const sunsetMin = getMinutesFromISOTime(today.sunset);
      return sunsetMin != null && sunsetMin < THRESHOLDS.sunsetEarly;
    },
    say: () => "日が短くなりましたね",
  },

  // --- 日が長い（日没が遅い：18時半以降） ---
  {
    id: "season.daylight.sunset-late",
    topic: "season",
    weight: 55,
    when: ({ today }) => {
      const sunsetMin = getMinutesFromISOTime(today.sunset);
      return sunsetMin != null && sunsetMin > THRESHOLDS.sunsetLate;
    },
    say: () => "日が長くなりましたね",
  },

  // ===== ② 季節感 =====

  // --- 夏っぽい（平均気温25℃以上） ---
  {
    id: "season.feel.summer-like",
    topic: "season",
    weight: 60,
    when: ({ today }) => {
      const meanTemp = getMeanTemp(today.max, today.min);
      return meanTemp != null && meanTemp >= THRESHOLDS.summerLike;
    },
    say: () => "夏っぽいですね",
  },

  // --- 冬っぽい（平均気温10℃以下） ---
  {
    id: "season.feel.winter-like",
    topic: "season",
    weight: 60,
    when: ({ today }) => {
      const meanTemp = getMeanTemp(today.max, today.min);
      return meanTemp != null && meanTemp <= THRESHOLDS.winterLike;
    },
    say: () => "冬っぽいですね",
  },

  // --- 春・秋らしい（平均気温10〜18℃ & 日照そこそこ） ---
  {
    id: "season.feel.spring-autumn",
    topic: "season",
    weight: 52,
    when: ({ today }) => {
      const meanTemp = getMeanTemp(today.max, today.min);
      const pleasantTemp = meanTemp != null &&
        meanTemp >= THRESHOLDS.springAutumnMin &&
        meanTemp <= THRESHOLDS.springAutumnMax;
      const decentSunshine = (today.sunshineSec ?? 0) > THRESHOLDS.sunshineModerate;
      return pleasantTemp && decentSunshine;
    },
    say: (tod, { today }) => {
      const month = new Date(today.date).getMonth() + 1;
      const isSpringSeason = month >= 2 && month <= 4; // 3-5月
      return isSpringSeason ? "春らしいですね" : "秋らしいですね";
    },
  },

  // ===== ③ 季節変わり目 =====

  // --- 季節の変わり目（前日比 + 週次変動5℃以上） ---
  {
    id: "season.transition.seasonal-shift",
    topic: "season",
    weight: 58,
    when: ({ today, yesterday, last7 }) => {
      const dayChange = Math.abs(today.max - yesterday.max);
      if (dayChange < THRESHOLDS.deltaDay) return false;

      if (last7.length < 7) return false;
      const recent7 = last7.slice(-7);
      const temps = recent7.map(d => d.max).filter(t => t != null);
      if (temps.length < 5) return false;

      const maxTemp = Math.max(...temps);
      const minTemp = Math.min(...temps);
      return (maxTemp - minTemp) >= THRESHOLDS.weeklyTempChange;
    },
    say: (tod, { today }) => {
      const month = new Date(today.date).getMonth() + 1;
      const season = month >= 2 && month <= 4 ? "春" :
          month >= 5 && month <= 7 ? "夏" :
          month >= 8 && month <= 10 ? "秋" : "冬";
      return `${season}の気配がしますね`;
    },
  },

  // ===== ④ 梅雨 =====

  // --- 梅雨の長雨（3日連続で雨 & 6-7月） ---
  {
    id: "season.rainy-season",
    topic: "season",
    weight: 56,
    when: ({ last7, today }) => {
      const month = new Date(today.date).getMonth() + 1;
      if (month < 6 || month > 7) return false; // 6-7月のみ

      if (last7.length < 3) return false;
      const recent3 = last7.slice(-3);

      // 3日連続で降水量1mm以上
      const consecutiveRain = recent3.every(d => (d.rain ?? 0) >= THRESHOLDS.consecutiveRainMin);
      return consecutiveRain;
    },
    say: () => "雨続きですね",
  },
];