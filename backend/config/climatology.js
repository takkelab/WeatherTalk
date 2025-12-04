// config/climatology.js
// 平年値データ（気象庁 1991-2020年平年値）

/**
 * 東京の月別平年値
 * 出典: 気象庁「平年値（年・月ごとの値）」
 * https://www.data.jma.go.jp/obd/stats/etrn/view/nml_sfc_ym.php?prec_no=44&block_no=47662
 */
export const TOKYO_CLIMATOLOGY = {
  1: {
    avgMax: 9.8,   // 1月の平均最高気温（℃）
    avgMin: 2.1,   // 1月の平均最低気温（℃）
  },
  2: {
    avgMax: 10.7,
    avgMin: 2.9,
  },
  3: {
    avgMax: 14.0,
    avgMin: 5.8,
  },
  4: {
    avgMax: 19.4,
    avgMin: 11.0,
  },
  5: {
    avgMax: 23.6,
    avgMin: 15.7,
  },
  6: {
    avgMax: 26.1,
    avgMin: 19.4,
  },
  7: {
    avgMax: 29.9,
    avgMin: 23.3,
  },
  8: {
    avgMax: 31.3,
    avgMin: 24.5,
  },
  9: {
    avgMax: 27.3,
    avgMin: 21.1,
  },
  10: {
    avgMax: 21.7,
    avgMin: 15.0,
  },
  11: {
    avgMax: 16.5,
    avgMin: 9.4,
  },
  12: {
    avgMax: 11.9,
    avgMin: 4.4,
  },
};

/**
 * 指定月の平年値を取得
 * @param {number} month - 月（1-12）
 * @returns {Object} 平年値 { avgMax, avgMin }
 */
export function getClimatology(month) {
  return TOKYO_CLIMATOLOGY[month] || null;
}

/**
 * 日付から平年値を取得
 * @param {string} dateString - ISO8601形式の日付文字列
 * @returns {Object} 平年値 { avgMax, avgMin }
 */
export function getClimatologyFromDate(dateString) {
  const date = new Date(dateString);
  const month = date.getMonth() + 1; // 0-11 → 1-12
  return getClimatology(month);
}