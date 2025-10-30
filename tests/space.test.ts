import { describe, it, expect } from "vitest";
import {
  trimAll,
  collapseSpaces,
  normalizeSpaces,
  removeAllSpaces,
} from "../src/core/space";

describe("space.ts", () => {
  describe("trimAll", () => {
    it("前後の半角スペースを削除", () => {
      expect(trimAll("  test  ")).toBe("test");
      expect(trimAll("   hello world   ")).toBe("hello world");
    });

    it("前後の全角スペースを削除", () => {
      expect(trimAll("　test　")).toBe("test");
      expect(trimAll("　　こんにちは　　")).toBe("こんにちは");
    });

    it("前後の混在スペースを削除", () => {
      expect(trimAll(" 　test　 ")).toBe("test");
    });

    it("中間のスペースは削除しない", () => {
      expect(trimAll("  hello world  ")).toBe("hello world");
      expect(trimAll("　テスト　データ　")).toBe("テスト　データ");
    });

    it("スペースのみの文字列は空文字に", () => {
      expect(trimAll("   ")).toBe("");
      expect(trimAll("　　　")).toBe("");
      expect(trimAll(" 　 　 ")).toBe("");
    });

    it("スペースがない場合は変更なし", () => {
      expect(trimAll("test")).toBe("test");
    });
  });

  describe("collapseSpaces", () => {
    it("連続する半角スペースを1つに", () => {
      expect(collapseSpaces("hello    world")).toBe("hello world");
      expect(collapseSpaces("a     b     c")).toBe("a b c");
    });

    it("連続する全角スペースを1つに", () => {
      expect(collapseSpaces("こんにちは　　　世界")).toBe("こんにちは 世界");
    });

    it("混在する連続スペースを1つに", () => {
      expect(collapseSpaces("test 　  　test")).toBe("test test");
    });

    it("タブや改行も含めて処理", () => {
      expect(collapseSpaces("hello\t\t\tworld")).toBe("hello world");
      expect(collapseSpaces("line1\n\n\nline2")).toBe("line1 line2");
    });

    it("単独スペースは変更なし", () => {
      expect(collapseSpaces("hello world")).toBe("hello world");
    });
  });

  describe("normalizeSpaces", () => {
    it("全角スペースを半角スペースに変換", () => {
      expect(normalizeSpaces("こんにちは　世界")).toBe("こんにちは 世界");
      expect(normalizeSpaces("テスト　　データ")).toBe("テスト  データ");
    });

    it("すでに半角スペースの場合は変更なし", () => {
      expect(normalizeSpaces("hello world")).toBe("hello world");
    });

    it("全角・半角混在の場合", () => {
      expect(normalizeSpaces("test　テスト data")).toBe("test テスト data");
    });

    it("複数の全角スペースも変換", () => {
      expect(normalizeSpaces("　　　")).toBe("   ");
    });
  });

  describe("removeAllSpaces", () => {
    it("すべての半角スペースを削除", () => {
      expect(removeAllSpaces("hello world")).toBe("helloworld");
      expect(removeAllSpaces("a b c d")).toBe("abcd");
    });

    it("すべての全角スペースを削除", () => {
      expect(removeAllSpaces("こんにちは　世界")).toBe("こんにちは世界");
      expect(removeAllSpaces("山田　太郎")).toBe("山田太郎");
    });

    it("混在スペースをすべて削除", () => {
      expect(removeAllSpaces("test 　data　 info")).toBe("testdatainfo");
    });

    it("前後・中間すべてのスペースを削除", () => {
      expect(removeAllSpaces("  hello  world  ")).toBe("helloworld");
    });

    it("タブや改行も削除", () => {
      expect(removeAllSpaces("hello\tworld\ntest")).toBe("helloworldtest");
    });

    it("スペースがない場合は変更なし", () => {
      expect(removeAllSpaces("test")).toBe("test");
    });
  });

  describe("統合テスト", () => {
    it("実際の名前入力の処理", () => {
      const input = "　山田　　太郎　";
      const step1 = trimAll(input); // => '山田　　太郎'
      const step2 = normalizeSpaces(step1); // => '山田  太郎'
      const step3 = collapseSpaces(step2); // => '山田 太郎'
      const step4 = removeAllSpaces(step3); // => '山田太郎'

      expect(step1).toBe("山田　　太郎");
      expect(step2).toBe("山田  太郎");
      expect(step3).toBe("山田 太郎");
      expect(step4).toBe("山田太郎");
    });

    it("実際のテキスト入力の処理", () => {
      const input = "　　　Hello　　World　　　";
      const normalized = collapseSpaces(normalizeSpaces(trimAll(input)));
      expect(normalized).toBe("Hello World");
    });
  });
});
