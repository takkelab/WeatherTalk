// utils/helpers.js
// 共通ユーティリティ関数

/**
 * 小数第1位で四捨五入
 * @param {number} n - 数値
 * @returns {number} 四捨五入された値
 */
export const round1 = (n) => Math.round(n * 10) / 10;

/**
 * 符号付きで表示（+/-）
 * @param {number} n - 数値
 * @returns {string} 符号付き文字列
 */
export const sign1 = (n) => (n > 0 ? `+${round1(n)}` : `${round1(n)}`);

/**
 * 現在の時間帯を取得
 * @param {Date} d - 日付オブジェクト（デフォルト: 現在時刻）
 * @returns {"morning"|"noon"|"evening"} 時間帯
 */
export function timeOfDay(d = new Date()) {
  const h = d.getHours();
  if (h < 10) return "morning";
  if (h < 17) return "noon";
  return "evening";
}

/**
 * WMO weather code から雨かどうか判定
 * @param {number} code - WMO weather code
 * @returns {boolean} 雨の場合true
 */
export function isRainCode(code) {
  // 51–67: 霧雨/雨、80–82: にわか雨
  return (code >= 51 && code <= 67) || (code >= 80 && code <= 82);
}

/**
 * ISO時刻文字列から時刻（分）を取得
 * @param {string} isoString - ISO8601形式の時刻文字列（例: "2024-03-15T17:30:00"）
 * @returns {number} その日の0時からの経過分数（例: 17:30 → 1050分）
 */
export function getMinutesFromISOTime(isoString) {
  if (!isoString) return null;
  const date = new Date(isoString);
  return date.getHours() * 60 + date.getMinutes();
}

/**
 * 平均気温を計算
 * @param {number} max - 最高気温
 * @param {number} min - 最低気温
 * @returns {number} 平均気温
 */
export function getMeanTemp(max, min) {
  if (max == null || min == null) return null;
  return (max + min) / 2;
}

/**
 * WMO weather code から晴天かどうか判定
 * @param {number} code - WMO weather code
 * @returns {boolean} 晴天の場合true
 */
export function isClearSky(code) {
  // 0-2: 晴れ、快晴、一部曇り
  return code >= 0 && code <= 2;
}

/**
 * WMO weather code から曇天かどうか判定
 * @param {number} code - WMO weather code
 * @returns {boolean} 曇天の場合true
 */
export function isCloudySky(code) {
  // 3: 曇り
  return code === 3;
}