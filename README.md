# textfit jp

**日本語特化の入力補正ライブラリ**

[![npm version](https://img.shields.io/npm/v/textfit.svg)](https://www.npmjs.com/package/textfit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## インストール

```bash
npm install textfit
# or
yarn add textfit
# or
pnpm add textfit
```

## クイックスタート

```javascript
import { normalizeText, normalizePhone, normalizeEmail } from "textfit";

// 基本的なテキスト正規化
normalizeText("　　Ｔｅｓｔ　１２３　　");
// => "Test 123"

// 名前のスペース削除
normalizeName("山田　太郎");
// => "山田太郎"

// 電話番号
normalizePhone("０９０−１２３４−５６７８");
// => "090-1234-5678"

// メールアドレス（タイポ補正付き）
normalizeEmail("test＠gamil.com");
// => { email: "test@gmail.com", suggestions: [...] }
```

## API リファレンス

### 基本変換関数

- `toHankakuAlphanumeric(str)` - 全角英数字 → 半角
- `toZenkakuAlphanumeric(str)` - 半角英数字 → 全角
- `toHankakuKatakana(str)` - 全角カタカナ → 半角カタカナ
- `toZenkakuKatakana(str)` - 半角カタカナ → 全角カタカナ
- `toHiragana(str)` - カタカナ → ひらがな
- `toKatakana(str)` - ひらがな → カタカナ

### 正規化関数

- `normalizeText(str, options?)` - 総合的なテキスト正規化
- `normalizeSymbols(str)` - 記号の統一

### 実用プリセット

- `normalizePhone(str, options?)` - 電話番号
- `normalizeEmail(str, options?)` - メールアドレス
- `normalizeName(str, options?)` - 名前
- `normalizeNumber(str)` - 数字
- `formatCreditCard(str)` - クレジットカード
- `normalizePostalCode(str)` - 郵便番号

> 💡 詳細なオプションは[**API ドキュメント**](./docs/API.md)を参照してください
