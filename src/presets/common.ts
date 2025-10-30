/**
 * 日本語向けプリセット（実用的な補正関数）
 */

import type {
  NameOptions,
  PhoneOptions,
  EmailOptions,
  CorrectionSuggestion,
} from "../types";
import { toHankakuAlphanumeric, toZenkakuKatakana } from "../core/kana";
import { trimAll, removeAllSpaces } from "../core/space";

/**
 * 電話番号を正規化
 * 例: "０９０−１２３４−５６７８" → "090-1234-5678"
 */
export function normalizePhone(
  str: string,
  options: PhoneOptions = {}
): string {
  const opts: Required<PhoneOptions> = {
    addHyphens: true,
    removeHyphens: false,
    toHankaku: true,
    ...options,
  };

  let result = str;

  // 半角に統一
  if (opts.toHankaku) {
    result = toHankakuAlphanumeric(result);
  }

  // 国際番号 +81 形式はそのまま返す（フォーマット変更しない）
  if (/^\+81[-\d]+$/.test(result)) {
    return result;
  }

  // すべてのハイフンを削除してから整形
  result = result.replace(/[-－‐]/g, "");

  // 数字のみを抽出
  result = result.replace(/[^0-9+]/g, "");

  // ハイフンの追加/削除
  if (opts.removeHyphens) {
    return result;
  }

  if (opts.addHyphens) {
    // 携帯電話（090, 080, 070など）
    if (/^(070|080|090)\d{8}$/.test(result)) {
      return result.replace(/^(\d{3})(\d{4})(\d{4})$/, "$1-$2-$3");
    }
    // 固定電話（市外局番あり）
    if (/^0\d{9,10}$/.test(result)) {
      // 3桁-4桁-4桁
      if (result.length === 10) {
        return result.replace(/^(\d{2})(\d{4})(\d{4})$/, "$1-$2-$3");
      }
      // 4桁-2桁-4桁 or 3桁-3桁-4桁
      if (result.length === 11) {
        return result.replace(/^(\d{3})(\d{4})(\d{4})$/, "$1-$2-$3");
      }
    }
  }

  return result;
}

/**
 * メールアドレスを正規化
 * よくあるタイポを修正
 */
export function normalizeEmail(
  str: string,
  options: EmailOptions = {}
): { email: string; suggestions: CorrectionSuggestion[] } {
  const opts: Required<EmailOptions> = {
    fixCommonTypos: true,
    toLowerCase: true,
    ...options,
  };

  let result = trimAll(str);
  const suggestions: CorrectionSuggestion[] = [];

  // 全角@を半角に
  if (result.includes("＠")) {
    result = result.replace(/＠/g, "@");
    suggestions.push({
      original: str,
      corrected: result,
      confidence: "high",
      reason: "全角@を半角@に変換しました",
    });
  }

  // 全角ドットを半角に
  if (result.includes("．")) {
    result = result.replace(/．/g, ".");
  }

  // 小文字に統一
  if (opts.toLowerCase) {
    result = result.toLowerCase();
  }

  // よくあるタイポ修正
  if (opts.fixCommonTypos) {
    const typos: Record<string, string> = {
      "gamil.com": "gmail.com",
      "gmai.com": "gmail.com",
      "gmial.com": "gmail.com",
      "yahooo.co.jp": "yahoo.co.jp",
      "yhaoo.co.jp": "yahoo.co.jp",
      "hotmial.com": "hotmail.com",
      "outlok.com": "outlook.com",
    };

    for (const [wrong, correct] of Object.entries(typos)) {
      if (result.includes(wrong)) {
        const original = result;
        result = result.replace(wrong, correct);
        suggestions.push({
          original,
          corrected: result,
          confidence: "medium",
          reason: `${wrong} → ${correct} に修正しました`,
        });
      }
    }
  }

  return { email: result, suggestions };
}

/**
 * 名前を正規化
 * 例: "山田　太郎" → "山田太郎" or "山田 太郎"
 */
export function normalizeName(str: string, options: NameOptions = {}): string {
  const opts: Required<NameOptions> = {
    removeSpaces: true,
    toZenkaku: true,
    ...options,
  };

  let result = str;

  // 全角カタカナに統一
  if (opts.toZenkaku) {
    result = toZenkakuKatakana(result);
  }

  // 前後の空白削除
  result = trimAll(result);

  // 全角スペースを半角に
  result = result.replace(/\u3000/g, " ");

  // 連続スペースを1つに
  result = result.replace(/\s+/g, " ");

  // スペース削除オプション
  if (opts.removeSpaces) {
    result = removeAllSpaces(result);
  }

  return result;
}

/**
 * 数字を正規化（カンマ除去、計算用）
 * 例: "１，２３４" → "1234"
 */
export function normalizeNumber(str: string): string {
  let result = str;

  // 全角数字を半角に
  result = toHankakuAlphanumeric(result);

  // カンマを削除
  result = result.replace(/[,，]/g, "");

  // 空白削除
  result = result.replace(/\s/g, "");

  return result;
}

/**
 * クレジットカード番号を4桁区切りで整形
 * 例: "1234567890123456" → "1234 5678 9012 3456"
 */
export function formatCreditCard(str: string): string {
  // 半角数字のみ抽出
  const digits = toHankakuAlphanumeric(str).replace(/\D/g, "");

  // 4桁ずつ区切る
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

/**
 * 郵便番号を正規化
 * 例: "１２３−４５６７" → "123-4567"
 */
export function normalizePostalCode(str: string): string {
  let result = toHankakuAlphanumeric(str);

  // 数字のみ抽出
  const digits = result.replace(/\D/g, "");

  // 7桁の場合、3-4に区切る
  if (digits.length === 7) {
    return digits.replace(/^(\d{3})(\d{4})$/, "$1-$2");
  }

  return digits;
}
