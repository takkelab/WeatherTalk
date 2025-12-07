// components/Header.jsx
import { formatDate, timeOfDayJP } from '../utils/weatherUtils'

/**
 * ヘッダーコンポーネント
 * @param {Object} props
 * @param {Object} props.weatherInfo - 天気情報 { icon, text }
 * @param {string} props.date - 日付文字列
 * @param {string} props.timeOfDay - 時間帯 (morning|noon|evening)
 */
function Header({ weatherInfo, date, timeOfDay }) {
  return (
    <header className="header">
      <h1>{weatherInfo.icon} 今日の天気フレーズ</h1>
      <div className="meta-info">
        <span className="date">{formatDate(date)}</span>
        <span className="time-of-day">{timeOfDayJP[timeOfDay]}</span>
        <span className="weather-type">{weatherInfo.text}</span>
      </div>
    </header>
  )
}

export default Header