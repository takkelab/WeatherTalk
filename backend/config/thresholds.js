// config/thresholds.js
// しきい値を一元管理（後で調整しやすい）

export const THRESHOLDS = {
  // 気温関連
  hotMax: 28,           // 最高気温が暑いと判断する基準（℃）
  coldMax: 12,          // 最高気温が寒いと判断する基準（℃）
  deltaDay: 3,          // 前日比の大きな変化と判断する基準（℃）
  diurnal: 7,           // 一日の寒暖差が大きいと判断する基準（℃）
  
  // 雨関連
  rainProbToday: 60,    // 今日降る確率が高いと判断する基準（%）
  rainProbTomorrow: 50, // 明日降る確率が高いと判断する基準（%）
  heavyRainYday: 10,    // 昨日の雨が多いと判断する基準（mm）
  sunBreakSunshineSec: 3 * 3600,  // 晴れ間と判断する日照時間（秒）
  sunBreakRainMin: 1,   // 晴れ間判定の最小降水量（mm）
  
  // 風・体感関連
  windModerate: 8,      // やや風が強いと判断する基準（m/s）
  windStrong: 12,       // 風が強いと判断する基準（m/s）
  gustModerate: 10,     // やや突風が強いと判断する基準（m/s）
  gustStrong: 12,       // 突風が強いと判断する基準（m/s）
  apparentGap: 2,       // 体感温度差が大きいと判断する基準（℃）
  
  // 湿度関連
  humidityHigh: 75,     // 高湿度と判断する基準（%）
  humidityLow: 40,      // 低湿度と判断する基準（%）
  humidityMuggyTemp: 20, // じめじめ判定の最低気温（℃）
  humidityDryTemp: 15,   // 乾燥判定の最高気温（℃）
  
  // 季節・日照関連
  summerLike: 25,       // 夏っぽいと判断する平均気温（℃）
  winterLike: 10,       // 冬っぽいと判断する平均気温（℃）
  springAutumnMin: 15,  // 春秋の最低気温（℃）
  springAutumnMax: 20,  // 春秋の最高気温（℃）
  
  sunsetEarly: 17 * 60, // 日が短いと判断する日没時刻（17:00 = 17*60分）
  sunsetLate: 18.5 * 60, // 日が長いと判断する日没時刻（18:30 = 18.5*60分）
  sunshineShort: 2 * 3600, // 日照時間が短い（2時間 = 2*3600秒）
  sunshineModerate: 4 * 3600, // 日照時間がそこそこ（4時間 = 4*3600秒）
  sunshineLong: 6 * 3600,  // 日照時間が長い（6時間 = 6*3600秒）
  
  daylightShort: 10 * 3600, // 昼の長さが短い（10時間）
  daylightLong: 14 * 3600,  // 昼の長さが長い（14時間）
  
  // 季節変わり目
  weeklyTempChange: 5,  // 週次気温変化の閾値（3℃→5℃に引き上げ）
  
  // 梅雨関連
  consecutiveRainMin: 1,  // 連続降雨判定の最小降水量（mm）
  
  // 例年比較関連
  normalDiffWarm: 2,     // 平年より暖かいと判断する差（℃）
  normalDiffCold: -2,    // 平年より寒いと判断する差（℃）
  unseasonableWarm: 4,   // 季節外れに暖かいと判断する差（℃）
  unseasonableCold: -4,  // 季節外れに寒いと判断する差（℃）
};