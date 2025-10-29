# API ドキュメント

## 基本変換関数

### `toHankakuAlphanumeric(str: string): string`

全角英数字を半角に変換します。

```javascript
toHankakuAlphanumeric("ＡＢＣＤ１２３４");
// => "ABCD1234"
```

### `toZenkakuAlphanumeric(str: string): string`

半角英数字を全角に変換します。

```javascript
toZenkakuAlphanumeric("ABCD1234");
// => "ＡＢＣＤ１２３４"
```

### `toHankakuKatakana(str: string): string`

全角カタカナを半角カタカナに変換します。

```javascript
toHankakuKatakana("カタカナ");
// => "ｶﾀｶﾅ"
```

### `toZenkakuKatakana(str: string): string`

半角カタカナを全角カタカナに変換します。濁点・半濁点も自動的に結合されます。

```javascript
toZenkakuKatakana("ﾊﾟｿｺﾝ");
// => "パソコン"
```

### `toHiragana(str: string): string`

カタカナをひらがなに変換します。

```javascript
toHiragana("カタカナ");
// => "かたかな"
```

### `toKatakana(str: string): string`

ひらがなをカタカナに変換します。

```javascript
toKatakana("ひらがな");
// => "ヒラガナ"
```

---

## 空白処理関数

### `trimAll(str: string): string`

前後の空白を削除します（全角スペースも含む）。

```javascript
trimAll("　前後空白　");
// => "前後空白"
```

### `collapseSpaces(str: string): string`

連続する空白を 1 つに圧縮します。

```javascript
collapseSpaces("連続　　　空白");
// => "連続 空白"
```

### `normalizeSpaces(str: string): string`

全角スペースを半角スペースに変換します。

```javascript
normalizeSpaces("全角　スペース");
// => "全角 スペース"
```

### `removeAllSpaces(str: string): string`

すべての空白を削除します。

```javascript
removeAllSpaces("すべて 削除");
// => "すべて削除"
```

---

## 正規化関数

### `normalizeText(str: string, options?: NormalizeOptions): string`

テキストを総合的に正規化します。

#### オプション

```typescript
interface NormalizeOptions {
  toHankakuAlphanumeric?: boolean; // 全角英数字を半角に（デフォルト: true）
  toHankakuKatakana?: boolean; // 全角カタカナを半角に（デフォルト: false）
  toZenkakuKatakana?: boolean; // 半角カタカナを全角に（デフォルト: true）
  toHiragana?: boolean; // カタカナをひらがなに（デフォルト: false）
  toKatakana?: boolean; // ひらがなをカタカナに（デフォルト: false）
  trim?: boolean; // 前後の空白を削除（デフォルト: true）
  collapseSpaces?: boolean; // 連続スペースを圧縮（デフォルト: true）
  normalizeSpaces?: boolean; // 全角スペースを半角に（デフォルト: true）
  normalizeSymbols?: boolean; // 記号を正規化（デフォルト: true）
}
```

#### 使用例

```javascript
// デフォルト設定
normalizeText("　Ｔｅｓｔ　１２３　");
// => "Test 123"

// カスタム設定
normalizeText("カタカナ", { toHiragana: true });
// => "かたかな"

normalizeText("test", { toZenkakuAlphanumeric: true });
// => "ｔｅｓｔ"
```

### `normalizeSymbols(str: string): string`

よく使う記号を統一します。

- ハイフン類: `‐ － ― ー` → `-`
- 波ダッシュ: `〜 ～` → `~`
- 括弧: `（ ）` → `( )`
- 感嘆符・疑問符: `！ ？` → `! ?`

```javascript
normalizeSymbols("test－test");
// => "test-test"
```

---

## 実用プリセット

### `normalizePhone(str: string, options?: PhoneOptions): string`

電話番号を正規化します。

#### オプション

```typescript
interface PhoneOptions {
  addHyphens?: boolean; // ハイフンを追加（デフォルト: true）
  removeHyphens?: boolean; // ハイフンを削除（デフォルト: false）
  toHankaku?: boolean; // 半角に統一（デフォルト: true）
}
```

#### 使用例

```javascript
normalizePhone("０９０−１２３４−５６７８");
// => "090-1234-5678"

normalizePhone("090-1234-5678", { removeHyphens: true });
// => "09012345678"
```

### `normalizeEmail(str: string, options?: EmailOptions): { email: string; suggestions: CorrectionSuggestion[] }`

メールアドレスを正規化します。よくあるタイポを自動修正します。

#### オプション

```typescript
interface EmailOptions {
  fixCommonTypos?: boolean; // タイポを修正（デフォルト: true）
  toLowerCase?: boolean; // 小文字に統一（デフォルト: true）
}
```

#### 戻り値

```typescript
interface CorrectionSuggestion {
  original: string;
  corrected: string;
  confidence: "high" | "medium" | "low";
  reason: string;
}
```

#### 使用例

```javascript
const result = normalizeEmail("test＠gamil.com");
console.log(result.email);
// => "test@gmail.com"

console.log(result.suggestions);
// => [
//   {
//     original: "test＠gamil.com",
//     corrected: "test@gmail.com",
//     confidence: "medium",
//     reason: "gamil.com → gmail.com に修正しました"
//   }
// ]
```

#### 対応タイポ

- `gamil.com` → `gmail.com`
- `gmai.com` → `gmail.com`
- `gmial.com` → `gmail.com`
- `yahooo.co.jp` → `yahoo.co.jp`
- `yhaoo.co.jp` → `yahoo.co.jp`
- `hotmial.com` → `hotmail.com`
- `outlok.com` → `outlook.com`

### `normalizeName(str: string, options?: NameOptions): string`

名前を正規化します。

#### オプション

```typescript
interface NameOptions {
  removeSpaces?: boolean; // 姓名間のスペースを削除（デフォルト: true）
  toZenkaku?: boolean; // 全角に統一（デフォルト: true）
}
```

#### 使用例

```javascript
normalizeName("山田　太郎");
// => "山田太郎"

normalizeName("ﾔﾏﾀﾞ ﾀﾛｳ");
// => "ヤマダタロウ"

normalizeName("山田 太郎", { removeSpaces: false });
// => "山田 太郎"
```

### `normalizeNumber(str: string): string`

数字を正規化します（カンマ除去、計算用）。

```javascript
normalizeNumber("１，２３４，５６７");
// => "1234567"

normalizeNumber("¥1,000");
// => "1000"
```

### `formatCreditCard(str: string): string`

クレジットカード番号を 4 桁区切りで整形します。

```javascript
formatCreditCard("1234567890123456");
// => "1234 5678 9012 3456"

formatCreditCard("１２３４５６７８９０１２３４５６");
// => "1234 5678 9012 3456"
```

### `normalizePostalCode(str: string): string`

郵便番号を正規化します（3-4 形式）。

```javascript
normalizePostalCode("１２３４５６７");
// => "123-4567"

normalizePostalCode("１２３−４５６７");
// => "123-4567"
```

---

## 型定義

すべての型定義は TypeScript で利用可能です。

```typescript
import type {
  NormalizeOptions,
  NameOptions,
  PhoneOptions,
  EmailOptions,
  CorrectionSuggestion,
} from "textfit";
```
