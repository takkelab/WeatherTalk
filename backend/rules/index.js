// rules/index.js
// すべてのルールをまとめる

import { tempRules } from './temp.js';
import { rainRulesBase, rainRulesExtension } from './rain.js';
import { feelRules } from './feel.js';
import { seasonRules } from './season.js';
import { comparisonRules } from './comparison.js';

/**
 * オプションに応じてルールを組み立てる
 * @param {Object} options - 有効化オプション
 * @param {boolean} options.enableTomorrowRain - 明日の雨予報ルールを有効化
 * @param {boolean} options.enableSunBreak - 晴れ間ルールを有効化
 * @returns {Array} 有効化されたルールの配列
 */
export function buildRules(options = {}) {
  const {
    enableTomorrowRain = true,
    enableSunBreak = true,
    // 将来: enablePressure = false, enableHumidity = false, ...
  } = options;

  // 基本ルール（常時有効）
  const baseRules = [
    ...tempRules,
    ...rainRulesBase,
    ...feelRules,
    ...seasonRules,
    ...comparisonRules,
  ];

  // 拡張ルール（オプションでON/OFF）
  const extensionRules = [];
  
  if (enableTomorrowRain || enableSunBreak) {
    // 必要な拡張ルールだけをフィルタリング
    const selectedExtensions = rainRulesExtension.filter(rule => {
      if (rule.id === 'rain.tomorrow.probable') return enableTomorrowRain;
      if (rule.id === 'rain.sun-break') return enableSunBreak;
      return false;
    });
    extensionRules.push(...selectedExtensions);
  }

  return [...baseRules, ...extensionRules];
}

// デフォルト設定でルールをエクスポート（後方互換性のため）
export const allRules = buildRules();