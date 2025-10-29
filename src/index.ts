// 型定義
export type {
  NormalizeOptions,
  NameOptions,
  PhoneOptions,
  EmailOptions,
  CorrectionSuggestion,
} from "./types";

// コア機能
export {
  toHankakuAlphanumeric,
  toZenkakuAlphanumeric,
  toHankakuKatakana,
  toZenkakuKatakana,
  toHiragana,
  toKatakana,
} from "./core/kana";

export {
  trimAll,
  collapseSpaces,
  normalizeSpaces,
  removeAllSpaces,
} from "./core/space";

export { normalizeText, normalizeSymbols } from "./core/normalize";

// 共通プリセット
export {
  normalizePhone,
  normalizeEmail,
  normalizeName,
  normalizeNumber,
  formatCreditCard,
  normalizePostalCode,
} from "./presets/common";
