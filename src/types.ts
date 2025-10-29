/**
 * 正規化オプション
 */
export interface NormalizeOptions {
  /** 全角英数字を半角に変換 */
  toHankakuAlphanumeric?: boolean;
  /** 全角カタカナを半角カタカナに変換 */
  toHankakuKatakana?: boolean;
  /** 半角カタカナを全角カタカナに変換 */
  toZenkakuKatakana?: boolean;
  /** カタカナをひらがなに変換 */
  toHiragana?: boolean;
  /** ひらがなをカタカナに変換 */
  toKatakana?: boolean;
  /** 前後の空白を削除 */
  trim?: boolean;
  /** 連続する空白を1つに圧縮 */
  collapseSpaces?: boolean;
  /** 全角スペースを半角スペースに変換 */
  normalizeSpaces?: boolean;
  /** 記号を正規化（ハイフンなど） */
  normalizeSymbols?: boolean;
}

/**
 * 名前正規化オプション
 */
export interface NameOptions {
  /** 姓名の間のスペースを削除 */
  removeSpaces?: boolean;
  /** 全角に統一 */
  toZenkaku?: boolean;
}

/**
 * 電話番号正規化オプション
 */
export interface PhoneOptions {
  /** ハイフンを追加 */
  addHyphens?: boolean;
  /** ハイフンを削除 */
  removeHyphens?: boolean;
  /** 半角に統一 */
  toHankaku?: boolean;
}

/**
 * メール正規化オプション
 */
export interface EmailOptions {
  /** よくあるタイポを修正 */
  fixCommonTypos?: boolean;
  /** 小文字に統一 */
  toLowerCase?: boolean;
}

/**
 * 補正候補
 */
export interface CorrectionSuggestion {
  original: string;
  corrected: string;
  confidence: "high" | "medium" | "low";
  reason: string;
}
