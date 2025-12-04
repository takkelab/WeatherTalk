// rules/temp.js
// 気温に関するルール

import { THRESHOLDS } from '../config/thresholds.js';
import { round1 } from '../utils/helpers.js';

/**
 * 気温に関する会話ルール
 * - 絶対温度（暑い/寒い）
 * - 前日比
 * - 一日の寒暖差
 */
export const tempRules = [
  // --- 絶対温度: 暑い ---
  {
    id: "temp.absolute.hot",
    topic: "temp",
    weight: 65,
    when: ({ today }) => today.max >= THRESHOLDS.hotMax,
    say: (tod) => ({
      morning: "朝から暑いですね",
      noon: "もう夏みたいな暑さですね",
      evening: "夜でも暑いですね",
    }[tod]),
  },

  // --- 絶対温度: 寒い ---
  {
    id: "temp.absolute.cold",
    topic: "temp",
    weight: 65,
    when: ({ today }) => today.max <= THRESHOLDS.coldMax,
    say: (tod) => ({
      morning: "今朝は冷えますね",
      noon: "昼でも寒いですね",
      evening: "夜は冷えますね",
    }[tod]),
  },

  // --- 前日比: ±3℃以上の変化 ---
  {
    id: "temp.delta",
    topic: "temp",
    weight: 50,
    when: ({ today, yesterday }) => 
      Math.abs(today.max - yesterday.max) >= THRESHOLDS.deltaDay,
    say: (tod, { today, yesterday }) => {
      const d = today.max - yesterday.max;
      
      if (d >= THRESHOLDS.deltaDay) {
        // 気温が上がった場合
        return yesterday.max >= 20
          ? "昨日より暑いですね"
          : "昨日より暖かいですね";
      } else {
        // 気温が下がった場合
        return yesterday.max >= 20
          ? "昨日より涼しいですね"
          : "昨日より寒いですね";
      }
    },
  },

  // --- 一日の寒暖差: 7℃以上 ---
  {
    id: "temp.diurnal",
    topic: "temp",
    weight: 45,
    when: ({ today }) => 
      (today.max - today.min) >= THRESHOLDS.diurnal,
    say: (tod) => ({
      morning: "昼くらいから暖かくなるらしいですね",
      noon: "朝は寒かったけど、暖かくなってきましたね",
      evening: "夜になって急に寒くなりましたね",
    }[tod]),
  },
];