// hooks/useCopyToClipboard.js

/**
 * クリップボードへのコピー機能を提供するカスタムフック
 * @returns {Function} コピー処理関数
 */
export function useCopyToClipboard() {
  const handleCopy = (event, text) => {
    const button = event.currentTarget

    navigator.clipboard.writeText(text)
      .then(() => {
        button.textContent = '✓ コピー完了'
        setTimeout(() => {
          button.textContent = 'コピー'
        }, 2000)
      })
      .catch((err) => {
        console.error('コピーエラー:', err)
        alert('コピーに失敗しました')
      })
  }

  return handleCopy
}