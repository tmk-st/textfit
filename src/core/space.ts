/**
 * 空白処理ユーティリティ
 */

/**
 * 前後の空白を削除（全角スペースも含む）
 */
export function trimAll(str: string): string {
  return str.replace(/^[\s\u3000]+|[\s\u3000]+$/g, "");
}

/**
 * 連続する空白を1つに圧縮（全角スペースも含む）
 */
export function collapseSpaces(str: string): string {
  return str.replace(/[\s\u3000]+/g, " ");
}

/**
 * 全角スペースを半角スペースに変換
 */
export function normalizeSpaces(str: string): string {
  return str.replace(/\u3000/g, " ");
}

/**
 * すべての空白を削除
 */
export function removeAllSpaces(str: string): string {
  return str.replace(/[\s\u3000]/g, "");
}
