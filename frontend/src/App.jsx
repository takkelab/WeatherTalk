import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCategories, setShowCategories] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    fetch('/data/weather.json')
      .then(res => {
        if (!res.ok) throw new Error('データの読み込みに失敗しました')
        return res.json()
      })
      .then(data => {
        setWeatherData(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="container">
        <div className="loading">読み込み中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">❌ {error}</div>
      </div>
    )
  }

  if (!weatherData) {
    return null
  }

  // 日付をフォーマット
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const month = date.getMonth() + 1
    const day = date.getDate()
    const weekdays = ['日', '月', '火', '水', '木', '金', '土']
    const weekday = weekdays[date.getDay()]
    return `${month}月${day}日(${weekday})`
  }

  // 時間帯を日本語に
  const timeOfDayJP = {
    morning: '朝',
    noon: '昼',
    evening: '夜'
  }

  // ISO時刻から時:分を取得
  const formatTime = (isoString) => {
    if (!isoString) return null
    const date = new Date(isoString)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  // フレーズIDから根拠を生成
  const getEvidence = (phrase, details) => {
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

  // コピー機能
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('コピーしました！')
      })
      .catch(() => {
        alert('コピーに失敗しました')
      })
  }

  return (
    <div className="container">
      <header className="header">
        <h1>🌤️ 今日の天気フレーズ</h1>
        <div className="update-info">
          {formatDate(weatherData.date)} {timeOfDayJP[weatherData.timeOfDay]} 更新
        </div>
      </header>

      <main className="main">
        {/* TOP3フレーズ */}
        <section className="top-phrases">
          <h2>💬 おすすめフレーズ TOP3</h2>
          
          {weatherData.topPhrases.length === 0 ? (
            <div className="no-data">今日は特に話すことがないですね...</div>
          ) : (
            <div className="phrases-list">
              {weatherData.topPhrases.map((phrase, index) => {
                const evidence = getEvidence(phrase, weatherData.details)
                
                return (
                  <div key={phrase.id} className="phrase-item">
                    <div className="phrase-number">{index + 1}</div>
                    <div className="phrase-content">
                      <div className="phrase-text">「{phrase.text}」</div>
                      {evidence && (
                        <div className="phrase-evidence">💡 {evidence}</div>
                      )}
                      <button 
                        className="copy-button"
                        onClick={() => handleCopy(phrase.text)}
                      >
                        📋 コピー
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* カテゴリ別フレーズ */}
        <section className="categories">
          <h2 
            className="section-header"
            onClick={() => setShowCategories(!showCategories)}
          >
            📁 カテゴリ別フレーズ
            <span className="toggle-icon">{showCategories ? '▼' : '▶'}</span>
          </h2>
          
          {showCategories && (
            <div className="categories-content">
              {Object.entries(weatherData.byTopic).map(([topicKey, topicData]) => {
                // フレーズが0件のカテゴリはスキップ
                if (topicData.phrases.length === 0) return null
                
                return (
                  <div key={topicKey} className="category-section">
                    <h3 className="category-title">
                      ■ {topicData.header}（{topicData.phrases.length}件）
                    </h3>
                    <div className="category-phrases">
                      {topicData.phrases.map((phrase) => {
                        const evidence = getEvidence(phrase, weatherData.details)
                        
                        return (
                          <div key={phrase.id} className="category-phrase-item">
                            <div className="category-phrase-content">
                              <div className="category-phrase-text">• {phrase.text}</div>
                              {evidence && (
                                <div className="category-phrase-evidence">💡 {evidence}</div>
                              )}
                            </div>
                            <button 
                              className="copy-button-small"
                              onClick={() => handleCopy(phrase.text)}
                            >
                              📋
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* 詳細データ */}
        <section className="details">
          <h2 
            className="section-header"
            onClick={() => setShowDetails(!showDetails)}
          >
            📊 詳細データ
            <span className="toggle-icon">{showDetails ? '▼' : '▶'}</span>
          </h2>
          
          {showDetails && (
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">最高気温</span>
                <span className="detail-value">{weatherData.details.maxTemp}℃</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">最低気温</span>
                <span className="detail-value">{weatherData.details.minTemp}℃</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">昨日比</span>
                <span className="detail-value">{weatherData.details.yesterdayDiff}℃</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">降水確率（今日）</span>
                <span className="detail-value">{weatherData.details.rainProbToday}%</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">降水確率（明日）</span>
                <span className="detail-value">{weatherData.details.rainProbTomorrow}%</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">湿度</span>
                <span className="detail-value">{weatherData.details.humidity}%</span>
              </div>
              {weatherData.details.sunrise && (
                <div className="detail-item">
                  <span className="detail-label">日の出</span>
                  <span className="detail-value">{formatTime(weatherData.details.sunrise)}</span>
                </div>
              )}
              {weatherData.details.sunset && (
                <div className="detail-item">
                  <span className="detail-label">日没</span>
                  <span className="detail-value">{formatTime(weatherData.details.sunset)}</span>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App