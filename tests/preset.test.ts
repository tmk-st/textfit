import { describe, it, expect } from "vitest";
import {
  normalizePhone,
  normalizeEmail,
  normalizeName,
  normalizeNumber,
  formatCreditCard,
  normalizePostalCode,
} from "../src/presets/common";

describe("japanese.ts", () => {
  describe("normalizePhone", () => {
    it("全角を半角に変換してハイフンを追加", () => {
      expect(normalizePhone("０９０１２３４５６７８")).toBe("090-1234-5678");
      expect(normalizePhone("０８０−１２３４−５６７８")).toBe("080-1234-5678");
    });

    it("ハイフンを削除オプション", () => {
      expect(normalizePhone("090-1234-5678", { removeHyphens: true })).toBe(
        "09012345678"
      );
    });

    it("固定電話も正しく処理", () => {
      expect(normalizePhone("０３１２３４５６７８")).toBe("03-1234-5678");
    });
  });

  describe("normalizeEmail", () => {
    it("全角@を半角に変換", () => {
      const result = normalizeEmail("test＠gmail.com");
      expect(result.email).toBe("test@gmail.com");
      expect(result.suggestions.length).toBeGreaterThan(0);
    });

    it("よくあるタイポを修正", () => {
      const result = normalizeEmail("test@gamil.com");
      expect(result.email).toBe("test@gmail.com");
      expect(
        result.suggestions.some((s) => s.reason.includes("gmail.com"))
      ).toBe(true);
    });

    it("小文字に統一", () => {
      const result = normalizeEmail("Test@Gmail.Com");
      expect(result.email).toBe("test@gmail.com");
    });

    it("タイポ修正をスキップ", () => {
      const result = normalizeEmail("test@gamil.com", {
        fixCommonTypos: false,
      });
      expect(result.email).toBe("test@gamil.com");
      expect(result.suggestions.length).toBe(0);
    });
  });

  describe("normalizeName", () => {
    it("全角スペースを削除", () => {
      expect(normalizeName("山田　太郎")).toBe("山田太郎");
    });

    it("半角カタカナを全角に", () => {
      expect(normalizeName("ﾔﾏﾀﾞ ﾀﾛｳ")).toBe("ヤマダタロウ");
    });

    it("スペースを残すオプション", () => {
      expect(normalizeName("山田 太郎", { removeSpaces: false })).toBe(
        "山田 太郎"
      );
    });
  });

  describe("normalizeNumber", () => {
    it("全角数字を半角に、カンマを削除", () => {
      expect(normalizeNumber("１，２３４")).toBe("1234");
      expect(normalizeNumber("１２，３４５")).toBe("12345");
    });

    it("すでに半角の場合もカンマを削除", () => {
      expect(normalizeNumber("1,234,567")).toBe("1234567");
    });
  });

  describe("formatCreditCard", () => {
    it("4桁区切りで整形", () => {
      expect(formatCreditCard("1234567890123456")).toBe("1234 5678 9012 3456");
    });

    it("全角数字も処理", () => {
      expect(formatCreditCard("１２３４５６７８９０１２３４５６")).toBe(
        "1234 5678 9012 3456"
      );
    });

    it("既に区切られている場合も再整形", () => {
      expect(formatCreditCard("1234-5678-9012-3456")).toBe(
        "1234 5678 9012 3456"
      );
    });
  });

  describe("normalizePostalCode", () => {
    it("全角数字を半角に変換してハイフンを追加", () => {
      expect(normalizePostalCode("１２３４５６７")).toBe("123-4567");
      expect(normalizePostalCode("１２３−４５６７")).toBe("123-4567");
    });

    it("すでに半角の場合も整形", () => {
      expect(normalizePostalCode("1234567")).toBe("123-4567");
    });
  });
});
