// components/TopPhrases.jsx
import PhraseCard from './PhraseCard'

/**
 * TOP3フレーズセクション
 * @param {Object} props
 * @param {Array} props.phrases - TOP3フレーズ配列
 * @param {Object} props.details - 詳細データ
 * @param {Function} props.onCopy - コピーハンドラー
 */
function TopPhrases({ phrases, details, onCopy }) {
  return (
    <section className="top-phrases">
      <h2 className="section-title">💬 おすすめフレーズ TOP3</h2>
      {phrases.length === 0 ? (
        <div className="no-data">今日は特に話すことがないですね...</div>
      ) : (
        <div className="phrases-list">
          {phrases.map((phrase, index) => (
            <PhraseCard
              key={phrase.id}
              phrase={phrase}
              rank={index + 1}
              details={details}
              onCopy={onCopy}
              isSmall={false}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default TopPhrases