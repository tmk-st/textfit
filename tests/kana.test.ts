import { describe, it, expect } from "vitest";
import {
  toHankakuAlphanumeric,
  toZenkakuAlphanumeric,
  toHankakuKatakana,
  toZenkakuKatakana,
  toHiragana,
  toKatakana,
} from "../src/core/kana";

describe("kana.ts", () => {
  describe("toHankakuAlphanumeric", () => {
    it("全角英数字を半角に変換", () => {
      expect(toHankakuAlphanumeric("ＡＢＣＤ１２３４")).toBe("ABCD1234");
      expect(toHankakuAlphanumeric("ａｂｃｄ５６７８")).toBe("abcd5678");
    });

    it("すでに半角の場合は変更なし", () => {
      expect(toHankakuAlphanumeric("ABCD1234")).toBe("ABCD1234");
    });

    it("混在している場合", () => {
      expect(toHankakuAlphanumeric("Test１２３４test")).toBe("Test1234test");
    });
  });

  describe("toZenkakuAlphanumeric", () => {
    it("半角英数字を全角に変換", () => {
      expect(toZenkakuAlphanumeric("ABCD1234")).toBe("ＡＢＣＤ１２３４");
      expect(toZenkakuAlphanumeric("abcd5678")).toBe("ａｂｃｄ５６７８");
    });
  });

  describe("toZenkakuKatakana", () => {
    it("半角カタカナを全角カタカナに変換", () => {
      expect(toZenkakuKatakana("ｶﾀｶﾅ")).toBe("カタカナ");
    });

    it("濁点を正しく結合", () => {
      expect(toZenkakuKatakana("ｶﾞｷﾞｸﾞｹﾞｺﾞ")).toBe("ガギグゲゴ");
      expect(toZenkakuKatakana("ﾊﾞﾋﾞﾌﾞﾍﾞﾎﾞ")).toBe("バビブベボ");
    });

    it("半濁点を正しく結合", () => {
      expect(toZenkakuKatakana("ﾊﾟﾋﾟﾌﾟﾍﾟﾎﾟ")).toBe("パピプペポ");
    });
  });

  describe("toHiragana", () => {
    it("カタカナをひらがなに変換", () => {
      expect(toHiragana("カタカナ")).toBe("かたかな");
      expect(toHiragana("テスト")).toBe("てすと");
    });

    it("濁点・半濁点も正しく変換", () => {
      expect(toHiragana("ガギグゲゴ")).toBe("がぎぐげご");
      expect(toHiragana("パピプペポ")).toBe("ぱぴぷぺぽ");
    });
  });

  describe("toKatakana", () => {
    it("ひらがなをカタカナに変換", () => {
      expect(toKatakana("ひらがな")).toBe("ヒラガナ");
      expect(toKatakana("てすと")).toBe("テスト");
    });
  });
});
