// components/PhraseCard.jsx
import { getEvidence } from '../utils/evidenceUtils'

/**
 * 個別のフレーズカードコンポーネント
 * @param {Object} props
 * @param {Object} props.phrase - フレーズオブジェクト
 * @param {number} props.rank - ランキング番号（TOP3用、nullの場合は表示しない）
 * @param {Object} props.details - 詳細データ
 * @param {Function} props.onCopy - コピーハンドラー
 * @param {boolean} props.isSmall - 小さいボタン表示
 */
function PhraseCard({ phrase, rank = null, details, onCopy, isSmall = false }) {
  const evidence = getEvidence(phrase, details)

  const cardClass = isSmall ? 'category-item' : 'phrase-card'
  const contentClass = isSmall ? 'category-content' : 'phrase-main'
  const textClass = isSmall ? 'category-text' : 'phrase-text'
  const evidenceClass = isSmall ? 'category-evidence' : 'phrase-evidence'
  const buttonClass = isSmall ? 'copy-btn-small' : 'copy-btn'

  return (
    <div className={cardClass}>
      {rank !== null && (
        <div className="phrase-rank">{rank}</div>
      )}
      <div className={contentClass}>
        <div className={textClass}>{phrase.text}</div>
        {evidence && (
          <div className={evidenceClass}>{evidence}</div>
        )}
      </div>
      <button
        className={buttonClass}
        onClick={(e) => onCopy(e, phrase.text)}
      >
        コピー
      </button>
    </div>
  )
}

export default PhraseCard