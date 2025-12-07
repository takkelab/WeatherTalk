// components/DetailSection.jsx
import { useState } from 'react'
import { formatTime } from '../utils/weatherUtils'

/**
 * 詳細データセクション
 * @param {Object} props
 * @param {Object} props.details - 詳細データ
 */
function DetailSection({ details }) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <section className="section-collapsible">
      <h2
        className="section-header"
        onClick={() => setShowDetails(!showDetails)}
      >
        <span>詳細データ</span>
        <span className="toggle-icon">{showDetails ? '▼' : '▶'}</span>
      </h2>

      {showDetails && (
        <div className="section-content">
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">最高気温</span>
              <span className="detail-value">{details.maxTemp}℃</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">最低気温</span>
              <span className="detail-value">{details.minTemp}℃</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">昨日比</span>
              <span className="detail-value">{details.yesterdayDiff}℃</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">降水確率(今日)</span>
              <span className="detail-value">{details.rainProbToday}%</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">降水確率(明日)</span>
              <span className="detail-value">{details.rainProbTomorrow}%</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">湿度</span>
              <span className="detail-value">{details.humidity}%</span>
            </div>
            {details.sunrise && (
              <div className="detail-item">
                <span className="detail-label">日の出</span>
                <span className="detail-value">{formatTime(details.sunrise)}</span>
              </div>
            )}
            {details.sunset && (
              <div className="detail-item">
                <span className="detail-label">日没</span>
                <span className="detail-value">{formatTime(details.sunset)}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

export default DetailSection