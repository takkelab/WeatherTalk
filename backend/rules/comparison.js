// rules/comparison.js
// 例年比較型ルール

import { THRESHOLDS } from '../config/thresholds.js';
import { getClimatologyFromDate } from '../config/climatology.js';
import { round1 } from '../utils/helpers.js';

/**
 * 例年比較型の会話ルール
 * ① 平年比（例年より暑い・寒い）
 * ② 季節外れ（異常気象）
 */
export const comparisonRules = [
  // ===== ① 平年比：例年より暖かい =====
  
  {
    id: "comparison.normal.warmer",
    topic: "comparison",
    weight: 54,
    when: ({ today }) => {
      const climatology = getClimatologyFromDate(today.date);
      if (!climatology) return false;
      
      const diff = today.max - climatology.avgMax;
      return diff >= THRESHOLDS.normalDiffWarm;
    },
    say: () => "この時期にしては暖かいですね",
  },

  // ===== ① 平年比：例年より寒い =====
  
  {
    id: "comparison.normal.colder",
    topic: "comparison",
    weight: 54,
    when: ({ today }) => {
      const climatology = getClimatologyFromDate(today.date);
      if (!climatology) return false;
      
      const diff = today.max - climatology.avgMax;
      return diff <= THRESHOLDS.normalDiffCold;
    },
    say: () => "この時期にしては寒いですね",
  },

  // ===== ② 季節外れ：異常に暖かい =====
  
  {
    id: "comparison.unseasonable.warm",
    topic: "comparison",
    weight: 68,
    when: ({ today }) => {
      const climatology = getClimatologyFromDate(today.date);
      if (!climatology) return false;
      
      const diff = today.max - climatology.avgMax;
      return diff >= THRESHOLDS.unseasonableWarm;
    },
    say: () => "季節外れに暖かいですね",
  },

  // ===== ② 季節外れ：異常に寒い =====
  
  {
    id: "comparison.unseasonable.cold",
    topic: "comparison",
    weight: 68,
    when: ({ today }) => {
      const climatology = getClimatologyFromDate(today.date);
      if (!climatology) return false;
      
      const diff = today.max - climatology.avgMax;
      return diff <= THRESHOLDS.unseasonableCold;
    },
    say: () => "季節外れに寒いですね",
  },
];