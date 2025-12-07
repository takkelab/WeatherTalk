// components/LoadingError.jsx

/**
 * ローディング表示コンポーネント
 */
export function Loading() {
  return (
    <div className="container">
      <div className="loading">読み込み中...</div>
    </div>
  )
}

/**
 * エラー表示コンポーネント
 * @param {Object} props
 * @param {string} props.message - エラーメッセージ
 */
export function ErrorDisplay({ message }) {
  return (
    <div className="container">
      <div className="error">⚠ {message}</div>
    </div>
  )
}