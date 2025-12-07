// hooks/useWeatherData.js
import { useState, useEffect } from 'react'

/**
 * 天気データを取得するカスタムフック
 * @returns {Object} { weatherData, loading, error }
 */
export function useWeatherData() {
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  return { weatherData, loading, error }
}