import { describe, it, expect } from "vitest";
import {
  toHankakuAlphanumeric,
  toZenkakuKatakana,
  toHiragana,
  normalizeText,
  normalizePhone,
  normalizeEmail,
  normalizeName,
  formatCreditCard,
} from "../src/index";

describe("Edge Cases & Boundary Tests", () => {
  describe("空文字・null・undefined", () => {
    it("空文字列の処理", () => {
      expect(normalizeText("")).toBe("");
      expect(toHankakuAlphanumeric("")).toBe("");
      expect(toZenkakuKatakana("")).toBe("");
      expect(normalizePhone("")).toBe("");
      expect(normalizeName("")).toBe("");
    });

    it("スペースのみの文字列", () => {
      expect(normalizeText("   ")).toBe("");
      expect(normalizeText("　　　")).toBe("");
      expect(normalizeText(" 　 　 ")).toBe("");
    });
  });

  describe("Unicode・特殊文字", () => {
    it("絵文字を含む文字列", () => {
      expect(normalizeText("こんにちは😀世界")).toBe("こんにちは😀世界");
      expect(normalizeName("山田😀太郎")).toBe("山田😀太郎");
    });

    it("異体字セレクタ", () => {
      // 葛󠄀（異体字）
      const input = "葛飾区";
      const result = normalizeText(input);
      expect(result).toBeTruthy();
    });

    it("結合文字", () => {
      // ハ + 濁点（結合）
      const combined = "ハ\u3099"; // が
      const result = toZenkakuKatakana(combined);
      expect(result).toBeTruthy();
    });

    it("サロゲートペア", () => {
      const surrogate = "𠮷野家"; // 𠮷は吉の異体字
      const result = normalizeText(surrogate);
      expect(result).toBe("𠮷野家");
    });

    it("制御文字", () => {
      const withControl = "test\x00data\x01end";
      const result = normalizeText(withControl);
      expect(result).toContain("test");
      expect(result).toContain("data");
    });

    it("改行コード", () => {
      const multiline = "line1\nline2\r\nline3";
      const result = normalizeText(multiline);
      expect(result).toBe("line1 line2 line3");
    });
  });

  describe("極端な長さ", () => {
    it("非常に長い文字列（1000文字）", () => {
      const longText = "あ".repeat(1000);
      const result = normalizeText(longText);
      expect(result.length).toBe(1000);
      expect(result).toBe(longText);
    });

    it("連続スペース（100個）", () => {
      const manySpaces = " ".repeat(100);
      const result = normalizeText(manySpaces);
      expect(result).toBe("");
    });

    it("長い電話番号（通常より長い）", () => {
      const longPhone = "09012345678901234567890";
      const result = normalizePhone(longPhone);
      expect(result).toBe("09012345678901234567890");
    });
  });

  describe("文字種の混在", () => {
    it("全角・半角・ひらがな・カタカナ混在", () => {
      const mixed = "ＡＢＣあいうカキクｱｲｳ123";
      const result = normalizeText(mixed);
      expect(result).toBe("ABCあいうカキクアイウ123");
    });

    it("日本語・英語・数字・記号混在", () => {
      const mixed = "こんにちはHello１２３！？";
      const result = normalizeText(mixed);
      expect(result).toBe("こんにちはHello123!?");
    });

    it("ひらがな・カタカナ混在を変換", () => {
      const mixed = "ひらがなカタカナ";
      const toKata = normalizeText(mixed, { toKatakana: true });
      const toHira = normalizeText(mixed, { toHiragana: true });

      expect(toKata).toBe("ヒラガナカタカナ");
      expect(toHira).toBe("ひらがなかたかな");
    });
  });

  describe("電話番号のエッジケース", () => {
    it("ハイフン位置が異常", () => {
      expect(normalizePhone("09-012-345678")).toBe("090-1234-5678");
      expect(normalizePhone("090-12-345678")).toBe("090-1234-5678");
    });

    it("括弧付き電話番号", () => {
      expect(normalizePhone("(090)1234-5678")).toBe("090-1234-5678");
      expect(normalizePhone("03(1234)5678")).toBe("03-1234-5678");
    });

    it("国際番号付き", () => {
      expect(normalizePhone("+81-90-1234-5678")).toBe("+81-90-1234-5678");
      expect(normalizePhone("+8109012345678")).toBe("+8109012345678");
    });

    it("桁数が超過", () => {
      expect(normalizePhone("090123456789012345")).toBe("090123456789012345");
    });

    it("数字以外の文字混入", () => {
      expect(normalizePhone("090-ABCD-5678")).toBe("0905678");
      expect(normalizePhone("tel:090-1234-5678")).toBe("090-1234-5678");
    });
  });

  describe("メールアドレスのエッジケース", () => {
    it("複数の@記号", () => {
      const result = normalizeEmail("test@@gmail.com");
      expect(result.email).toBe("test@@gmail.com");
    });

    it("@がない", () => {
      const result = normalizeEmail("testgmail.com");
      expect(result.email).toBe("testgmail.com");
    });

    it("ドメイン部分のみ", () => {
      const result = normalizeEmail("@gmail.com");
      expect(result.email).toBe("@gmail.com");
    });

    it("ローカル部分のみ", () => {
      const result = normalizeEmail("test@");
      expect(result.email).toBe("test@");
    });

    it("サブドメイン付き", () => {
      const result = normalizeEmail("test@mail.example.com");
      expect(result.email).toBe("test@mail.example.com");
    });

    it("特殊文字を含むローカル部", () => {
      const result = normalizeEmail("test+tag@gmail.com");
      expect(result.email).toBe("test+tag@gmail.com");
    });

    it("タイポ修正が複数該当する場合", () => {
      // gamil.com と gmai.com の両方のタイポパターン
      const result1 = normalizeEmail("test@gamil.com");
      const result2 = normalizeEmail("test@gmai.com");

      expect(result1.email).toBe("test@gmail.com");
      expect(result2.email).toBe("test@gmail.com");
    });
  });

  describe("名前のエッジケース", () => {
    it("非常に長い名前", () => {
      const longName = "山".repeat(50) + " " + "田".repeat(50);
      const result = normalizeName(longName);
      expect(result.length).toBe(100);
    });

    it("1文字の名前", () => {
      expect(normalizeName("林")).toBe("林");
      expect(normalizeName("あ")).toBe("あ");
    });

    it("複数のスペース", () => {
      expect(normalizeName("山田　　　太郎")).toBe("山田太郎");
      expect(normalizeName("山田     太郎")).toBe("山田太郎");
    });

    it("前後に大量のスペース", () => {
      const withSpaces = "     山田太郎     ";
      expect(normalizeName(withSpaces)).toBe("山田太郎");
    });

    it("旧字体・異体字", () => {
      expect(normalizeName("齋藤")).toBe("齋藤");
      expect(normalizeName("髙橋")).toBe("髙橋");
    });
  });

  describe("クレジットカードのエッジケース", () => {
    it("15桁（American Express）", () => {
      const amex = "123456789012345";
      expect(formatCreditCard(amex)).toBe("1234 5678 9012 345");
    });

    it("16桁（一般的）", () => {
      const visa = "1234567890123456";
      expect(formatCreditCard(visa)).toBe("1234 5678 9012 3456");
    });

    it("13桁（古いVisa）", () => {
      const oldVisa = "1234567890123";
      expect(formatCreditCard(oldVisa)).toBe("1234 5678 9012 3");
    });

    it("桁数が不足", () => {
      expect(formatCreditCard("12345")).toBe("1234 5");
    });

    it("桁数が超過（19桁）", () => {
      const long = "1234567890123456789";
      expect(formatCreditCard(long)).toBe("1234 5678 9012 3456 789");
    });

    it("数字以外を含む", () => {
      expect(formatCreditCard("1234-5678-9012-3456")).toBe(
        "1234 5678 9012 3456"
      );
      expect(formatCreditCard("1234 5678 9012 3456")).toBe(
        "1234 5678 9012 3456"
      );
    });
  });

  describe("カナ変換のエッジケース", () => {
    it("濁点だけの文字", () => {
      const dakuten = "\u3099"; // 結合用濁点
      expect(toZenkakuKatakana(dakuten)).toBe(dakuten);
    });

    it("半濁点だけの文字", () => {
      const handakuten = "\u309A"; // 結合用半濁点
      expect(toZenkakuKatakana(handakuten)).toBe(handakuten);
    });

    it("既に正規化済みの文字", () => {
      expect(toZenkakuKatakana("カタカナ")).toBe("カタカナ");
      expect(toHiragana("ひらがな")).toBe("ひらがな");
    });

    it("カタカナとひらがな混在", () => {
      const mixed = "ひらがなカタカナ";
      expect(toHiragana(mixed)).toBe("ひらがなかたかな");
    });

    it("小書き文字", () => {
      expect(toZenkakuKatakana("ｧｨｩｪｫ")).toBe("ァィゥェォ");
      expect(toHiragana("ァィゥェォ")).toBe("ぁぃぅぇぉ");
    });

    it("長音記号", () => {
      expect(toZenkakuKatakana("ｰ")).toBe("ー");
    });

    it("カタカナの「ヴ」", () => {
      expect(toZenkakuKatakana("ｳﾞ")).toBe("ヴ");
      expect(toHiragana("ヴ")).toBe("ゔ");
    });
  });

  describe("パフォーマンステスト", () => {
    it("大量の文字列を高速処理", () => {
      const start = Date.now();

      for (let i = 0; i < 1000; i++) {
        normalizeText("　Ｔｅｓｔ　１２３　");
      }

      const elapsed = Date.now() - start;

      // 1000回の処理が1秒以内（環境により調整）
      expect(elapsed).toBeLessThan(1000);
    });

    it("複雑な処理の組み合わせ", () => {
      const start = Date.now();

      for (let i = 0; i < 100; i++) {
        const text = normalizeText("　ｶﾀｶﾅ　テスト　", {
          toZenkakuKatakana: true,
          trim: true,
          collapseSpaces: true,
        });
      }

      const elapsed = Date.now() - start;
      expect(elapsed).toBeLessThan(500);
    });
  });
});
