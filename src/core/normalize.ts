/**
 * 基本正規化ユーティリティ
 */

import type { NormalizeOptions } from "../types";
import {
  toHankakuAlphanumeric,
  toHankakuKatakana,
  toZenkakuKatakana,
  toHiragana,
  toKatakana,
} from "./kana";
import { trimAll, collapseSpaces, normalizeSpaces } from "./space";

/**
 * よく使う記号を正規化
 */
export function normalizeSymbols(str: string): string {
  return (
    str
      // ハイフン類を統一
      .replace(/[‐－―‐−–—―]/g, "-")
      // 波ダッシュ
      .replace(/[〜～]/g, "~")
      // 中点
      .replace(/[・･]/g, "·")
      // 感嘆符・疑問符
      .replace(/！/g, "!")
      .replace(/？/g, "?")
      // 括弧
      .replace(/（/g, "(")
      .replace(/）/g, ")")
      // 句読点
      .replace(/、/g, ",")
      .replace(/。/g, ".")
  );
}

/**
 * テキストの正規化（メイン関数）
 */
export function normalizeText(
  str: string,
  options: NormalizeOptions = {}
): string {
  let result = str;

  // デフォルト設定
  const opts: Required<NormalizeOptions> = {
    toHankakuAlphanumeric: true,
    toHankakuKatakana: false,
    toZenkakuKatakana: true,
    toHiragana: false,
    toKatakana: false,
    trim: true,
    collapseSpaces: true,
    normalizeSpaces: true,
    normalizeSymbols: true,
    ...options,
  };

  // NOTE: カナ変換 → 英数字変換 → 空白処理 → 記号正規化

  // カナ変換
  if (opts.toHiragana) {
    result = toHiragana(result);
  } else if (opts.toKatakana) {
    result = toKatakana(result);
  }

  // 半角カタカナ → 全角カタカナ
  if (opts.toZenkakuKatakana) {
    result = toZenkakuKatakana(result);
  }

  // 全角カタカナ → 半角カタカナ
  if (opts.toHankakuKatakana) {
    result = toHankakuKatakana(result);
  }

  // 英数字変換
  if (opts.toHankakuAlphanumeric) {
    result = toHankakuAlphanumeric(result);
  }

  // 空白処理
  if (opts.normalizeSpaces) {
    result = normalizeSpaces(result);
  }
  if (opts.collapseSpaces) {
    result = collapseSpaces(result);
  }
  if (opts.trim) {
    result = trimAll(result);
  }

  // 記号正規化
  if (opts.normalizeSymbols) {
    result = normalizeSymbols(result);
  }

  return result;
}
