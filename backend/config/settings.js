// config/settings.js
// アプリケーション設定

/**
 * Open-Meteo API設定
 */
export const API_CONFIG = {
  LAT: 35.6769,      // 緯度（東京）
  LON: 139.65,       // 経度（東京）
  DAYS_PAST: 6,      // 過去何日分取得するか
  FORECAST_DAYS: 2,  // 予報何日分取得するか（今日+明日）
  TIMEZONE: "auto",  // タイムゾーン
};

/**
 * トピックの表示順序
 * この配列の順番で会話候補が並びます
 */
export const TOPIC_ORDER = ["temp", "rain", "feel", "season", "comparison", "fallback"];

/**
 * 各トピックの最大表示件数
 * UIで表示する際の上限数
 */
export const LIMIT_BY_TOPIC = {
  temp: 2,
  rain: 2,
  feel: 2,
  season: 2,
  comparison: 2,
  fallback: 1,
};

/**
 * トピック名の日本語表示
 */
export const TOPIC_HEADERS = {
  temp: "気温",
  rain: "雨",
  feel: "体感",
  season: "季節",
  comparison: "例年比較",
  fallback: "その他",
};