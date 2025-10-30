import { describe, it, expect } from "vitest";
import {
  normalizeText,
  normalizePhone,
  normalizeEmail,
  normalizeName,
  normalizeNumber,
  formatCreditCard,
  normalizePostalCode,
} from "../src/index";

describe("Integration Tests - 実際の使用シナリオ", () => {
  describe("フォーム入力のシナリオ", () => {
    it("お問い合わせフォーム: 名前・電話・メール", () => {
      // ユーザーが入力した（乱れた）データ
      const userInput = {
        name: "　山田　　太郎　",
        phone: "０９０−１２３４−５６７８",
        email: "test＠gamil.com",
      };

      // 正規化
      const normalized = {
        name: normalizeName(userInput.name),
        phone: normalizePhone(userInput.phone),
        email: normalizeEmail(userInput.email).email,
      };

      // 期待される結果
      expect(normalized).toEqual({
        name: "山田太郎",
        phone: "090-1234-5678",
        email: "test@gmail.com",
      });
    });

    it("会員登録フォーム: 全項目", () => {
      const userInput = {
        name: "ﾔﾏﾀﾞ　ﾀﾛｳ",
        email: "YAMADA＠YAHOOO.CO.JP",
        phone: "０３１２３４５６７８",
        postalCode: "１２３４５６７",
      };

      const normalized = {
        name: normalizeName(userInput.name),
        email: normalizeEmail(userInput.email, { toLowerCase: true }).email,
        phone: normalizePhone(userInput.phone),
        postalCode: normalizePostalCode(userInput.postalCode),
      };

      expect(normalized).toEqual({
        name: "ヤマダタロウ",
        email: "yamada@yahoo.co.jp",
        phone: "03-1234-5678",
        postalCode: "123-4567",
      });
    });
  });

  describe("ECサイトのシナリオ", () => {
    it("決済情報入力: クレジットカード・郵便番号", () => {
      const userInput = {
        cardNumber: "１２３４５６７８９０１２３４５６",
        postalCode: "１０１−００６５",
      };

      const normalized = {
        cardNumber: formatCreditCard(userInput.cardNumber),
        postalCode: normalizePostalCode(userInput.postalCode),
      };

      expect(normalized).toEqual({
        cardNumber: "1234 5678 9012 3456",
        postalCode: "101-0065",
      });
    });

    it("商品検索: キーワード正規化", () => {
      const searchKeywords = [
        "　　ﾉｰﾄﾊﾟｿｺﾝ　　",
        "ＡＰＰＬＥ　ＭＡＣＢＯＯＫ",
        "ワイヤレス　　　マウス",
      ];

      const normalized = searchKeywords.map((keyword) =>
        normalizeText(keyword)
      );

      expect(normalized).toEqual([
        "ノートパソコン",
        "APPLE MACBOOK",
        "ワイヤレス マウス",
      ]);
    });
  });

  describe("データインポートのシナリオ", () => {
    it("CSV インポート: 複数レコードの一括正規化", () => {
      const csvData = [
        { name: "　佐藤　一郎　", phone: "０９０−１１１１−２２２２" },
        { name: "ﾀﾅｶ　ﾀﾛｳ", phone: "０８０−３３３３−４４４４" },
        { name: "鈴木　花子", phone: "０７０−５５５５−６６６６" },
      ];

      const normalized = csvData.map((record) => ({
        name: normalizeName(record.name),
        phone: normalizePhone(record.phone),
      }));

      expect(normalized).toEqual([
        { name: "佐藤一郎", phone: "090-1111-2222" },
        { name: "タナカタロウ", phone: "080-3333-4444" },
        { name: "鈴木花子", phone: "070-5555-6666" },
      ]);
    });

    it("金額データのインポート: 全角数字・カンマ処理", () => {
      const prices = ["１，０００", "￥２，５００", "１２，３４５", "¥10,000"];

      const normalized = prices.map((price) => {
        const numStr = normalizeNumber(price.replace(/[￥¥]/g, ""));
        return parseInt(numStr, 10);
      });

      expect(normalized).toEqual([1000, 2500, 12345, 10000]);
    });
  });

  describe("検索・マッチングのシナリオ", () => {
    it("電話番号の重複チェック（ハイフンあり・なし混在）", () => {
      const dbPhones = ["090-1234-5678", "08012345678", "070-9999-8888"];

      const searchPhone = "０９０１２３４５６７８";
      const normalizedSearch = normalizePhone(searchPhone, {
        removeHyphens: true,
      });

      // DB内の電話番号も正規化して比較
      const found = dbPhones.some((dbPhone) => {
        const normalized = normalizePhone(dbPhone, { removeHyphens: true });
        return normalized === normalizedSearch;
      });

      expect(found).toBe(true);
      expect(normalizedSearch).toBe("09012345678");
    });

    it("名前の曖昧マッチング（スペース有無・カナ種別）", () => {
      const searchInputs = ["山田　太郎", "ﾔﾏﾀﾞ ﾀﾛｳ", "山田 太郎"];

      const normalizedInputs = searchInputs.map((name) =>
        normalizeName(name, { removeSpaces: true })
      );

      expect(normalizedInputs).toEqual([
        "山田太郎",
        "ヤマダタロウ",
        "山田太郎",
      ]);
    });
  });

  describe("エラーハンドリング・境界値", () => {
    it("空文字列の処理", () => {
      expect(normalizeText("")).toBe("");
      expect(normalizePhone("")).toBe("");
      expect(normalizeName("")).toBe("");
    });

    it("スペースのみの入力", () => {
      expect(normalizeText("　　　")).toBe("");
      expect(normalizeName("   ")).toBe("");
    });

    it("特殊文字を含む入力", () => {
      expect(normalizeText("test@#$%test")).toBe("test@#$%test");
      expect(normalizePhone("090-!!!-5678")).toBe("0905678");
    });

    it("非常に長い文字列", () => {
      const longText = "あ".repeat(1000);
      const result = normalizeText(longText);
      expect(result.length).toBe(1000);
    });

    it("不正な郵便番号（桁数異常）", () => {
      expect(normalizePostalCode("12345")).toBe("12345"); // 5桁
      expect(normalizePostalCode("123")).toBe("123"); // 3桁
    });
  });

  describe("チェーン処理のシナリオ", () => {
    it("複数ステップの正規化", () => {
      // 入力: めちゃくちゃな状態
      const messyInput = "　　Ｔｅｓｔ−−−Ｄａｔａ　　　";

      // ステップ1: 基本正規化
      const step1 = normalizeText(messyInput);

      // ステップ2: さらにカスタム処理
      const step2 = step1.replace(/Test/i, "テスト");

      expect(step1).toBe("Test---Data");
      expect(step2).toBe("テスト---Data");
    });

    it("メールアドレス: 段階的な補正", () => {
      const input = "　ＴＥＳＴ＠ＧＡＭＩＬ．ＣＯＭ　";

      // 段階的処理
      const trimmed = normalizeText(input);
      const { email, suggestions } = normalizeEmail(trimmed);

      expect(trimmed).toBe("TEST@GAMIL.COM");
      expect(email).toBe("test@gmail.com");
      expect(suggestions.length).toBeGreaterThan(0);
    });
  });

  describe("オプション指定のシナリオ", () => {
    it("名前のスペース保持オプション", () => {
      const input = "山田　太郎";

      const withoutSpace = normalizeName(input, { removeSpaces: true });
      const withSpace = normalizeName(input, { removeSpaces: false });

      expect(withoutSpace).toBe("山田太郎");
      expect(withSpace).toBe("山田 太郎");
    });

    it("電話番号のハイフン制御", () => {
      const input = "０９０１２３４５６７８";

      const withHyphens = normalizePhone(input, { addHyphens: true });
      const withoutHyphens = normalizePhone(input, { removeHyphens: true });

      expect(withHyphens).toBe("090-1234-5678");
      expect(withoutHyphens).toBe("09012345678");
    });

    it("テキスト正規化のカスタムオプション", () => {
      const input = "カタカナ　テスト";

      const toHira = normalizeText(input, { toHiragana: true });
      const toKata = normalizeText(input, { toKatakana: true });

      expect(toHira).toBe("かたかな てすと");
      expect(toKata).toBe("カタカナ テスト");
    });
  });
});
