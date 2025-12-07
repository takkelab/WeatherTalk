// utils/weatherUtils.js
// 天気に関するユーティリティ関数

/**
 * 天気コードから天気タイプを判定
 * @param {number} code - WMO weather code
 * @returns {string} 天気タイプ (clear|cloudy|rain|snow|storm)
 */
export const getWeatherType = (code) => {
  if (code === 0 || code === 1) return 'clear'  // 快晴・晴れ
  if (code === 2 || code === 3) return 'cloudy' // 一部曇り・曇り
  if (code >= 51 && code <= 67) return 'rain'   // 霧雨・雨
  if (code >= 71 && code <= 77) return 'snow'   // 雪
  if (code >= 80 && code <= 82) return 'rain'   // にわか雨
  if (code >= 85 && code <= 86) return 'snow'   // にわか雪
  if (code >= 95 && code <= 99) return 'storm'  // 雷雨
  return 'cloudy' // デフォルト
}

/**
 * 天気コードから天気情報（アイコン・テキスト）を取得
 * @param {number} code - WMO weather code
 * @returns {Object} { icon, text }
 */
export const getWeatherInfo = (code) => {
  if (code === 0 || code === 1) return { icon: '☀️', text: '晴れ' }
  if (code === 2) return { icon: '🌤️', text: '晴れ時々曇り' }
  if (code === 3) return { icon: '☁️', text: '曇り' }
  if (code >= 51 && code <= 67) return { icon: '🌧️', text: '雨' }
  if (code >= 71 && code <= 77) return { icon: '❄️', text: '雪' }
  if (code >= 80 && code <= 82) return { icon: '🌧️', text: 'にわか雨' }
  if (code >= 85 && code <= 86) return { icon: '❄️', text: 'にわか雪' }
  if (code >= 95 && code <= 99) return { icon: '⚡', text: '雷雨' }
  return { icon: '☁️', text: '曇り' }
}

/**
 * 日付をフォーマット
 * @param {string} dateString - ISO8601形式の日付文字列
 * @returns {string} フォーマットされた日付 (例: "12月7日(土)")
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekdays = ['日', '月', '火', '水', '木', '金', '土']
  const weekday = weekdays[date.getDay()]
  return `${month}月${day}日(${weekday})`
}

/**
 * ISO時刻文字列から時:分を取得
 * @param {string} isoString - ISO8601形式の時刻文字列
 * @returns {string|null} フォーマットされた時刻 (例: "17:30")
 */
export const formatTime = (isoString) => {
  if (!isoString) return null
  const date = new Date(isoString)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

/**
 * 時間帯を日本語に変換
 */
export const timeOfDayJP = {
  morning: '朝',
  noon: '昼',
  evening: '夜'
}

/**
 * 背景クラスを取得
 * @param {Object} weatherData - 天気データ
 * @returns {string} 背景クラス名
 */
export const getBackgroundClass = (weatherData) => {
  if (!weatherData) return 'bg-default'

  const weatherType = getWeatherType(weatherData.details.code)
  const timeOfDay = weatherData.timeOfDay

  return `bg-${weatherType}-${timeOfDay}`
}