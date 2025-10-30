import { describe, it, expect } from "vitest";
import { normalizeText, normalizeSymbols } from "../src/core/normalize";

describe("normalize.ts", () => {
  describe("normalizeText", () => {
    it("デフォルト設定で正規化", () => {
      const input = "　　Ｔｅｓｔ　１２３　　";
      const result = normalizeText(input);
      expect(result).toBe("Test 123");
    });

    it("全角英数字を半角に変換", () => {
      expect(normalizeText("ＡＢＣＤ１２３４")).toBe("ABCD1234");
    });

    it("半角カタカナを全角に変換", () => {
      expect(normalizeText("ｶﾀｶﾅ")).toBe("カタカナ");
      expect(normalizeText("ﾊﾟｿｺﾝ")).toBe("パソコン");
    });

    it("空白を正規化", () => {
      expect(normalizeText("　前後空白　")).toBe("前後空白");
      expect(normalizeText("連続　　　空白")).toBe("連続 空白");
    });

    it("記号を正規化", () => {
      expect(normalizeText("test－test")).toBe("test-test");
    });

    it("カスタムオプション: カタカナをひらがなに", () => {
      const result = normalizeText("カタカナ", { toHiragana: true });
      expect(result).toBe("かたかな");
    });

    it("カスタムオプション: スペースを残す", () => {
      const result = normalizeText("  test  ", { trim: false });
      expect(result).toBe(" test ");
    });
  });

  describe("normalizeSymbols", () => {
    it("ハイフン類を統一", () => {
      expect(normalizeSymbols("test－test")).toBe("test-test");
      expect(normalizeSymbols("test―test")).toBe("test-test");
      expect(normalizeSymbols("test‐test")).toBe("test-test");
    });

    it("括弧を統一", () => {
      expect(normalizeSymbols("（テスト）")).toBe("(テスト)");
    });

    it("感嘆符・疑問符を統一", () => {
      expect(normalizeSymbols("こんにちは！")).toBe("こんにちは!");
      expect(normalizeSymbols("なぜ？")).toBe("なぜ?");
    });
  });
});
