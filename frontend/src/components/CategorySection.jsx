// components/CategorySection.jsx
import { useState } from 'react'
import PhraseCard from './PhraseCard'

/**
 * カテゴリ別フレーズセクション
 * @param {Object} props
 * @param {Object} props.byTopic - トピック別フレーズデータ
 * @param {Object} props.details - 詳細データ
 * @param {Function} props.onCopy - コピーハンドラー
 */
function CategorySection({ byTopic, details, onCopy }) {
  const [showCategories, setShowCategories] = useState(false)

  return (
    <section className="section-collapsible">
      <h2
        className="section-header"
        onClick={() => setShowCategories(!showCategories)}
      >
        <span>カテゴリ別フレーズ</span>
        <span className="toggle-icon">{showCategories ? '▼' : '▶'}</span>
      </h2>

      {showCategories && (
        <div className="section-content">
          {Object.entries(byTopic).map(([topicKey, topicData]) => {
            // フレーズが0件のカテゴリはスキップ
            if (topicData.phrases.length === 0) return null

            return (
              <div key={topicKey} className="category">
                <h3 className="category-title">
                  {topicData.header} ({topicData.phrases.length})
                </h3>
                <div className="category-list">
                  {topicData.phrases.map((phrase) => (
                    <PhraseCard
                      key={phrase.id}
                      phrase={phrase}
                      details={details}
                      onCopy={onCopy}
                      isSmall={true}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default CategorySection