// rules/rain.js
// 雨に関するルール

import { THRESHOLDS } from '../config/thresholds.js';
import { isRainCode } from '../utils/helpers.js';

/**
 * 雨に関する会話ルール（基本）
 * - 昨日の雨
 * - 今日の雨
 */
export const rainRulesBase = [
  // --- 昨日の雨: 10mm以上 ---
  {
    id: "rain.yesterday.heavy",
    topic: "rain",
    weight: 68,
    when: ({ yesterday }) => 
      (yesterday?.rain ?? 0) >= THRESHOLDS.heavyRainYday,
    say: () => "昨日の雨、けっこう強かったですね",
  },

  // --- 今日の雨: 確率60%以上 or weathercodeが雨 ---
  {
    id: "rain.today.probable",
    topic: "rain",
    weight: 65,
    when: ({ today }) => 
      (today?.rainProb ?? 0) >= THRESHOLDS.rainProbToday || 
      isRainCode(today?.code ?? 0),
    say: (tod) => ({
      morning: "今日は雨降るみたいですね",
      noon: "午後から雨降るみたいですね",
      evening: "これから雨降るみたいですね",
    }[tod]),
  },
];

/**
 * 雨に関する会話ルール（拡張）
 * - 明日の雨予報
 */
export const rainRulesExtension = [
  // --- 明日の雨: 確率50%以上 ---
  {
    id: "rain.tomorrow.probable",
    topic: "rain",
    weight: 55,
    when: ({ tomorrow }) => 
      (tomorrow?.rainProb ?? 0) >= THRESHOLDS.rainProbTomorrow || 
      isRainCode(tomorrow?.code ?? 0),
    say: () => "明日は雨降るらしいですよ",
  },
];