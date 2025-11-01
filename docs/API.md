# textfit jp - APIドキュメント

## 📋 目次

- [インストール](#インストール)
- [クイックスタート](#クイックスタート)
- [基本変換関数](#基本変換関数)
- [空白処理関数](#空白処理関数)
- [正規化関数](#正規化関数)
- [実用プリセット](#実用プリセット)
- [型定義](#型定義)
- [実践的な使用例](#実践的な使用例)
- [よくある質問](#よくある質問)

---

## インストール

```bash
npm install textfit
# or
yarn add textfit
# or
pnpm add textfit
```

---

## クイックスタート

```typescript
import { normalizeText, normalizePhone, normalizeEmail } from 'textfit';

// テキストの総合正規化
const text = normalizeText("　Ｔｅｓｔ　１２３　");
console.log(text); // => "Test 123"

// 電話番号の正規化
const phone = normalizePhone("０９０−１２３４−５６７８");
console.log(phone); // => "090-1234-5678"

// メールアドレスの正規化とタイポ修正
const { email, suggestions } = normalizeEmail("test＠gamil.com");
console.log(email); // => "test@gmail.com"
console.log(suggestions); // タイポ修正の詳細
```

---

## 基本変換関数

### `toHankakuAlphanumeric(str: string): string`

全角英数字・記号を半角に変換します。

**対応文字:**
- 英字: `Ａ-Ｚａ-ｚ` → `A-Za-z`
- 数字: `０-９` → `0-9`
- 記号: `！＂＃＄％＆＇（）＊＋，－．／：；＜＝＞？＠［＼］＾＿｀｛｜｝～` など

**使用例:**

```typescript
import { toHankakuAlphanumeric } from 'textfit';

toHankakuAlphanumeric("ＡＢＣＤ１２３４");
// => "ABCD1234"

toHankakuAlphanumeric("Ｔｅｓｔ＠ｅｘａｍｐｌｅ．ｃｏｍ");
// => "Test@example.com"

toHankakuAlphanumeric("価格：￥１，０００");
// => "価格:¥1,000"
```

---

### `toZenkakuAlphanumeric(str: string): string`

半角英数字を全角に変換します。

**使用例:**

```typescript
import { toZenkakuAlphanumeric } from 'textfit';

toZenkakuAlphanumeric("ABCD1234");
// => "ＡＢＣＤ１２３４"

toZenkakuAlphanumeric("Test123");
// => "Ｔｅｓｔ１２３"
```

---

### `toHankakuKatakana(str: string): string`

全角カタカナを半角カタカナに変換します。濁点・半濁点も適切に分離されます。

**使用例:**

```typescript
import { toHankakuKatakana } from 'textfit';

toHankakuKatakana("カタカナ");
// => "ｶﾀｶﾅ"

toHankakuKatakana("ガギグゲゴ");
// => "ｶﾞｷﾞｸﾞｹﾞｺﾞ"

toHankakuKatakana("アイウエオ。、「」");
// => "ｱｲｳｴｵ｡､｢｣"
```

**対応記号:**
- `。` → `｡`
- `、` → `､`
- `ー` → `ｰ`
- `「」` → `｢｣`
- `・` → `･`

---

### `toZenkakuKatakana(str: string): string`

半角カタカナを全角カタカナに変換します。濁点・半濁点も自動的に結合されます。

**使用例:**

```typescript
import { toZenkakuKatakana } from 'textfit';

toZenkakuKatakana("ｶﾀｶﾅ");
// => "カタカナ"

toZenkakuKatakana("ｶﾞｷﾞｸﾞｹﾞｺﾞ");
// => "ガギグゲゴ"

toZenkakuKatakana("ｱｲｳｴｵ｡､｢｣");
// => "アイウエオ。、「」"
```

---

### `toHiragana(str: string): string`

カタカナをひらがなに変換します。

**使用例:**

```typescript
import { toHiragana } from 'textfit';

toHiragana("カタカナ");
// => "かたかな"

toHiragana("カタカナ漢字123");
// => "かたかな漢字123"
```

---

### `toKatakana(str: string): string`

ひらがなをカタカナに変換します。

**使用例:**

```typescript
import { toKatakana } from 'textfit';

toKatakana("ひらがな");
// => "ヒラガナ"

toKatakana("ひらがな漢字123");
// => "ヒラガナ漢字123"
```

---

## 空白処理関数

### `trimAll(str: string): string`

前後の空白を削除します（全角スペース `　` も含む）。

**使用例:**

```typescript
import { trimAll } from 'textfit';

trimAll("　全角スペース　");
// => "全角スペース"

trimAll(" 半角スペース ");
// => "半角スペース"

trimAll("　\t\n混在\n\t　");
// => "混在"
```

**対応する空白文字:**
- 半角スペース
- 全角スペース（`\u3000`）
- タブ（`\t`）
- 改行（`\n`, `\r`）

---

### `collapseSpaces(str: string): string`

連続する空白を1つの半角スペースに圧縮します。

**使用例:**

```typescript
import { collapseSpaces } from 'textfit';

collapseSpaces("複数の   　スペース");
// => "複数の スペース"

collapseSpaces("改行も\n\n\n圧縮");
// => "改行も 圧縮"
```

**特徴:**
- すべての種類の空白文字（半角・全角・タブ・改行）を対象
- 圧縮後は半角スペース1つに統一

---

### `normalizeSpaces(str: string): string`

全角スペースを半角スペースに変換します。

**使用例:**

```typescript
import { normalizeSpaces } from 'textfit';

normalizeSpaces("全角　スペース");
// => "全角 スペース"

normalizeSpaces("混在　の　スペース");
// => "混在 の スペース"
```

---

### `removeAllSpaces(str: string): string`

すべての空白文字を削除します。

**使用例:**

```typescript
import { removeAllSpaces } from 'textfit';

removeAllSpaces("すべて 削除");
// => "すべて削除"

removeAllSpaces("山田　太郎");
// => "山田太郎"

removeAllSpaces("Tel: 090 1234 5678");
// => "Tel:09012345678"
```

---

## 正規化関数

### `normalizeText(str: string, options?: NormalizeOptions): string`

テキストを総合的に正規化します。複数の変換を一度に適用できる便利な関数です。

#### オプション

```typescript
interface NormalizeOptions {
  toHankakuAlphanumeric?: boolean; // 全角英数字を半角に（デフォルト: true）
  toHankakuKatakana?: boolean;     // 全角カタカナを半角に（デフォルト: false）
  toZenkakuKatakana?: boolean;     // 半角カタカナを全角に（デフォルト: true）
  toHiragana?: boolean;            // カタカナをひらがなに（デフォルト: false）
  toKatakana?: boolean;            // ひらがなをカタカナに（デフォルト: false）
  trim?: boolean;                  // 前後の空白を削除（デフォルト: true）
  collapseSpaces?: boolean;        // 連続スペースを圧縮（デフォルト: true）
  normalizeSpaces?: boolean;       // 全角スペースを半角に（デフォルト: true）
  normalizeSymbols?: boolean;      // 記号を正規化（デフォルト: true）
}
```

---

### `normalizeSymbols(str: string): string`

よく使う記号を統一します。

**変換ルール:**

| 変換前 | 変換後 | 説明 |
|--------|--------|------|
| `‐ － ― ー − – — ―` | `-` | ハイフン・ダッシュ類 |
| `〜 ～` | `~` | 波ダッシュ |
| `・ ･` | `·` | 中点 |
| `！` | `!` | 感嘆符 |
| `？` | `?` | 疑問符 |
| `（ ）` | `( )` | 括弧 |
| `、` | `,` | 読点 |
| `。` | `.` | 句点 |

**使用例:**

```typescript
import { normalizeSymbols } from 'textfit';

normalizeSymbols("test－test");
// => "test-test"

normalizeSymbols("こんにちは！元気ですか？");
// => "こんにちは!元気ですか?"

normalizeSymbols("価格：１００円（税込）");
// => "価格:100円(税込)"

normalizeSymbols("項目１・項目２・項目３");
// => "項目1·項目2·項目3"
```

---

## 実用プリセット

### `normalizePhone(str: string, options?: PhoneOptions): string`

電話番号を正規化します。日本の携帯電話・固定電話に対応。

#### オプション

```typescript
interface PhoneOptions {
  addHyphens?: boolean;    // ハイフンを追加（デフォルト: true）
  removeHyphens?: boolean; // ハイフンを削除（デフォルト: false）
  toHankaku?: boolean;     // 半角に統一（デフォルト: true）
}
```

#### 使用例

**基本的な使用:**

```typescript
import { normalizePhone } from 'textfit';

normalizePhone("０９０−１２３４−５６７８");
// => "090-1234-5678"

normalizePhone("０８０１２３４５６７８");
// => "080-1234-5678"

normalizePhone("０３−１２３４−５６７８");
// => "03-1234-5678"
```

**ハイフンなし:**

```typescript
normalizePhone("090-1234-5678", { removeHyphens: true });
// => "09012345678"

normalizePhone("０９０−１２３４−５６７８", { removeHyphens: true });
// => "09012345678"
```

**国際番号形式:**

```typescript
// +81形式はそのまま保持
normalizePhone("+81-90-1234-5678");
// => "+81-90-1234-5678"

normalizePhone("+819012345678");
// => "+819012345678"
```

#### 対応フォーマット

**携帯電話:**
- 090-XXXX-XXXX
- 080-XXXX-XXXX
- 070-XXXX-XXXX

**固定電話:**
- XX-XXXX-XXXX（2桁市外局番）
- XXX-XXXX-XXXX（3桁市外局番）
- XXXX-XX-XXXX（4桁市外局番）

---

### `normalizeEmail(str: string, options?: EmailOptions)`

メールアドレスを正規化し、よくあるタイポを自動修正します。

#### オプション

```typescript
interface EmailOptions {
  fixCommonTypos?: boolean; // タイポを修正（デフォルト: true）
  toLowerCase?: boolean;    // 小文字に統一（デフォルト: true）
}
```

#### 戻り値

```typescript
interface EmailResult {
  email: string;                      // 正規化されたメールアドレス
  suggestions: CorrectionSuggestion[]; // 修正内容の詳細
}

interface CorrectionSuggestion {
  original: string;                        // 元の文字列
  corrected: string;                       // 修正後の文字列
  confidence: "high" | "medium" | "low";   // 信頼度
  reason: string;                          // 修正理由
}
```

#### 使用例

**基本的な使用:**

```typescript
import { normalizeEmail } from 'textfit';

const result = normalizeEmail("TEST＠EXAMPLE.COM");
console.log(result.email);
// => "test@example.com"

console.log(result.suggestions);
// => [
//   {
//     original: "TEST＠EXAMPLE.COM",
//     corrected: "TEST@EXAMPLE.COM",
//     confidence: "high",
//     reason: "全角@を半角@に変換しました"
//   }
// ]
```

**タイポ修正:**

```typescript
const result = normalizeEmail("user＠gamil.com");
console.log(result.email);
// => "user@gmail.com"

console.log(result.suggestions);
// => [
//   {
//     original: "user＠gamil.com",
//     corrected: "user@gamil.com",
//     confidence: "high",
//     reason: "全角@を半角@に変換しました"
//   },
//   {
//     original: "user@gamil.com",
//     corrected: "user@gmail.com",
//     confidence: "medium",
//     reason: "gamil.com → gmail.com に修正しました"
//   }
// ]
```

#### 対応タイポ一覧

| よくあるタイポ | 正しい形式 |
|----------------|------------|
| `gamil.com` | `gmail.com` |
| `gmai.com` | `gmail.com` |
| `gmial.com` | `gmail.com` |
| `yahooo.co.jp` | `yahoo.co.jp` |
| `yhaoo.co.jp` | `yahoo.co.jp` |
| `hotmial.com` | `hotmail.com` |
| `outlok.com` | `outlook.com` |

#### 信頼度レベル

- **high**: 全角文字の半角化など、確実な変換
- **medium**: タイポ修正など、推測を含む変換
- **low**: 曖昧な修正（現在未使用）

---

### `normalizeName(str: string, options?: NameOptions): string`

日本語の名前を正規化します。

#### オプション

```typescript
interface NameOptions {
  removeSpaces?: boolean; // 姓名間のスペースを削除（デフォルト: true）
  toZenkaku?: boolean;    // 全角に統一（デフォルト: true）
}
```

#### 使用例

**基本的な使用:**

```typescript
import { normalizeName } from 'textfit';

normalizeName("山田　太郎");
// => "山田太郎"

normalizeName("ﾔﾏﾀﾞ ﾀﾛｳ");
// => "ヤマダタロウ"

normalizeName("  山田   太郎  ");
// => "山田太郎"
```

**スペースを保持:**

```typescript
normalizeName("山田 太郎", { removeSpaces: false });
// => "山田 太郎"

normalizeName("山田　　　太郎", { removeSpaces: false });
// => "山田 太郎"  // 連続スペースは1つに圧縮
```

**半角カタカナを全角に:**

```typescript
normalizeName("ﾔﾏﾀﾞ ﾀﾛｳ");
// => "ヤマダタロウ"

normalizeName("ﾔﾏﾀﾞ ﾀﾛｳ", { removeSpaces: false });
// => "ヤマダ タロウ"
```

---

### `normalizeNumber(str: string): string`

数字を正規化します（カンマ除去、計算用）。

#### 使用例

```typescript
import { normalizeNumber } from 'textfit';

normalizeNumber("１，２３４，５６７");
// => "1234567"

normalizeNumber("¥1,000");
// => "1000"

normalizeNumber("３．１４");
// => "3.14"

normalizeNumber("￥１，０００円");
// => "1000"
```

#### 処理内容

1. 全角数字を半角に変換
2. カンマ（`,` `，`）を削除
3. 空白を削除

---

### `formatCreditCard(str: string): string`

クレジットカード番号を 4 桁区切りで整形します。

#### 使用例

```typescript
import { formatCreditCard } from 'textfit';

formatCreditCard("1234567890123456");
// => "1234 5678 9012 3456"

formatCreditCard("１２３４５６７８９０１２３４５６");
// => "1234 5678 9012 3456"

formatCreditCard("1234-5678-9012-3456");
// => "1234 5678 9012 3456"
```

#### 処理内容

1. 全角数字を半角に変換
2. 数字以外の文字を削除
3. 4桁ごとにスペースで区切る

**注意:**
- 実際のクレジットカード処理では、PCI DSS準拠の対策が必要です
- この関数は表示用の整形のみを行います

---

### `normalizePostalCode(str: string): string`

日本の郵便番号を正規化します（3-4 形式）。

#### 使用例

```typescript
import { normalizePostalCode } from 'textfit';

normalizePostalCode("１２３４５６７");
// => "123-4567"

normalizePostalCode("１２３−４５６７");
// => "123-4567"

normalizePostalCode("123 4567");
// => "123-4567"

normalizePostalCode("〒123-4567");
// => "123-4567"
```

#### 処理内容

1. 全角数字を半角に変換
2. 数字以外の文字を削除
3. 7桁の場合、`XXX-XXXX` 形式に整形

---

## 型定義

すべての型定義はTypeScriptで利用可能です。

```typescript
import type {
  NormalizeOptions,
  NameOptions,
  PhoneOptions,
  EmailOptions,
  CorrectionSuggestion,
} from 'textfit';
```

### `NormalizeOptions`

```typescript
interface NormalizeOptions {
  toHankakuAlphanumeric?: boolean; // デフォルト: true
  toHankakuKatakana?: boolean;     // デフォルト: false
  toZenkakuKatakana?: boolean;     // デフォルト: true
  toHiragana?: boolean;            // デフォルト: false
  toKatakana?: boolean;            // デフォルト: false
  trim?: boolean;                  // デフォルト: true
  collapseSpaces?: boolean;        // デフォルト: true
  normalizeSpaces?: boolean;       // デフォルト: true
  normalizeSymbols?: boolean;      // デフォルト: true
}
```

### `PhoneOptions`

```typescript
interface PhoneOptions {
  addHyphens?: boolean;    // デフォルト: true
  removeHyphens?: boolean; // デフォルト: false
  toHankaku?: boolean;     // デフォルト: true
}
```

### `EmailOptions`

```typescript
interface EmailOptions {
  fixCommonTypos?: boolean; // デフォルト: true
  toLowerCase?: boolean;    // デフォルト: true
}
```

### `NameOptions`

```typescript
interface NameOptions {
  removeSpaces?: boolean; // デフォルト: true
  toZenkaku?: boolean;    // デフォルト: true
}
```

### `CorrectionSuggestion`

```typescript
interface CorrectionSuggestion {
  original: string;                        // 元の文字列
  corrected: string;                       // 修正後の文字列
  confidence: "high" | "medium" | "low";   // 信頼度
  reason: string;                          // 修正理由
}
```

---

## よくある質問

### Q: 半角カタカナと全角カタカナの変換を同時に行うとどうなりますか？

A: `normalizeText()` では、`toZenkakuKatakana` が優先されます。両方を `true` にした場合は、全角カタカナに統一されます。

### Q: ひらがなとカタカナの変換を同時に指定するとどうなりますか？

A: `toHiragana` が優先されます。

### Q: 電話番号の国際番号形式（+81）はどう処理されますか？

A: +81 形式の電話番号は、ハイフンの有無に関わらずそのまま保持されます。

### Q: メールアドレスのタイポ修正はどの程度信頼できますか？

A: タイポ修正は、よく知られた誤入力パターンに基づいています。`confidence` フィールドで信頼度を確認し、重要な処理の前にはユーザーに確認を求めることを推奨します。

### Q: パフォーマンスはどうですか？大量のデータでも使えますか？

A: すべての関数は正規表現と文字列操作のみを使用しており、高速に動作します。大量データの処理にも適していますが、必要に応じてバッチ処理を検討してください。

### Q: ブラウザとNode.jsの両方で使えますか？

A: はい。TextFitは環境に依存しない純粋なJavaScript/TypeScriptで実装されているため、ブラウザ、Node.js、Denoなどすべての環境で動作します。

### Q: Tree-shakingに対応していますか？

A: はい。ES Modules として提供されているため、必要な関数のみをインポートすることでバンドルサイズを最小化できます。

---

## サポート

- GitHub Issues: [github.com/tmk-st/textfit/issues](https://github.com/tmk-st/textfit/issues)

## ライセンス

MIT License
