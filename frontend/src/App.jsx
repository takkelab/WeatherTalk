// App.jsx - リファクタリング版
import './App.css'
import Header from './components/Header'
import TopPhrases from './components/TopPhrases'
import CategorySection from './components/CategorySection'
import DetailSection from './components/DetailSection'
import { Loading, ErrorDisplay } from './components/LoadingError'
import { useWeatherData } from './hooks/useWeatherData'
import { useCopyToClipboard } from './hooks/useCopyToClipboard'
import { getWeatherInfo, getBackgroundClass } from './utils/weatherUtils'

function App() {
  const { weatherData, loading, error } = useWeatherData()
  const handleCopy = useCopyToClipboard()

  const backgroundClass = getBackgroundClass(weatherData)

  if (loading) {
    return (
      <div className={`app ${backgroundClass}`}>
        <Loading />
      </div>
    )
  }

  if (error) {
    return (
      <div className={`app ${backgroundClass}`}>
        <ErrorDisplay message={error} />
      </div>
    )
  }

  if (!weatherData) {
    return null
  }

  const weatherInfo = getWeatherInfo(weatherData.details.code)

  return (
    <div className={`app ${backgroundClass}`}>
      <div className="container">
        <Header
          weatherInfo={weatherInfo}
          date={weatherData.date}
          timeOfDay={weatherData.timeOfDay}
        />

        <main className="main">
          <TopPhrases
            phrases={weatherData.topPhrases}
            details={weatherData.details}
            onCopy={handleCopy}
          />

          <CategorySection
            byTopic={weatherData.byTopic}
            details={weatherData.details}
            onCopy={handleCopy}
          />

          <DetailSection
            details={weatherData.details}
          />
        </main>
      </div>
    </div>
  )
}

export default App