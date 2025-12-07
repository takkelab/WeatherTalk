// utils/evidenceUtils.js
// フレーズの根拠を生成するユーティリティ

import { formatTime } from './weatherUtils'

/**
 * フレーズIDから根拠を生成
 * @param {Object} phrase - フレーズオブジェクト
 * @param {Object} details - 詳細データ
 * @returns {string|null} 根拠テキスト
 */
export const getEvidence = (phrase, details) => {
  const id = phrase.id

  // 気温系
  if (id.includes('temp.absolute.hot')) {
    return `最高気温: ${details.maxTemp}℃`
  }
  if (id.includes('temp.absolute.cold')) {
    return `最高気温: ${details.maxTemp}℃`
  }
  if (id.includes('temp.delta')) {
    return `昨日比: ${details.yesterdayDiff}℃`
  }
  if (id.includes('temp.diurnal')) {
    const range = (details.maxTemp - details.minTemp).toFixed(1)
    return `寒暖差: ${range}℃`
  }

  // 雨系
  if (id.includes('rain.yesterday')) {
    return `昨日の降水量: ${details.rain}mm`
  }
  if (id.includes('rain.today')) {
    return `降水確率: ${details.rainProbToday}%`
  }
  if (id.includes('rain.tomorrow')) {
    return `明日の降水確率: ${details.rainProbTomorrow}%`
  }

  // 風系
  if (id.includes('wind.moderate')) {
    return `最大風速: ${details.windMax}m/s / 突風: ${details.gustMax}m/s`
  }
  if (id.includes('wind.strong')) {
    return `突風: ${details.gustMax}m/s`
  }
  if (id.includes('wind.cold-windy')) {
    return `最高気温: ${details.maxTemp}℃ / 突風: ${details.gustMax}m/s`
  }

  // 湿度系
  if (id.includes('humidity.muggy')) {
    return `湿度: ${details.humidity}% / 気温: ${details.maxTemp}℃`
  }
  if (id.includes('humidity.dry')) {
    return `湿度: ${details.humidity}%`
  }

  // 季節系
  if (id.includes('sunset-early')) {
    const sunsetTime = formatTime(details.sunset)
    return sunsetTime ? `日没: ${sunsetTime}` : null
  }
  if (id.includes('sunset-late')) {
    const sunsetTime = formatTime(details.sunset)
    return sunsetTime ? `日没: ${sunsetTime}` : null
  }
  if (id.includes('summer-like')) {
    const avgTemp = ((details.maxTemp + details.minTemp) / 2).toFixed(1)
    return `平均気温: ${avgTemp}℃`
  }
  if (id.includes('winter-like')) {
    const avgTemp = ((details.maxTemp + details.minTemp) / 2).toFixed(1)
    return `平均気温: ${avgTemp}℃`
  }
  if (id.includes('spring-autumn')) {
    const avgTemp = ((details.maxTemp + details.minTemp) / 2).toFixed(1)
    return `平均気温: ${avgTemp}℃`
  }

  // 例年比較系
  if (id.includes('comparison.normal.warmer')) {
    return `最高気温: ${details.maxTemp}℃`
  }
  if (id.includes('comparison.normal.colder')) {
    return `最高気温: ${details.maxTemp}℃`
  }
  if (id.includes('comparison.unseasonable')) {
    return `最高気温: ${details.maxTemp}℃`
  }

  // デフォルト: 基本情報
  return `最高: ${details.maxTemp}℃ / 最低: ${details.minTemp}℃`
}