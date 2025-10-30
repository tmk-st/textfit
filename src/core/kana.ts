/**
 * カナ変換ユーティリティ
 */

/**
 * 全角英数字を半角に変換
 */
export function toHankakuAlphanumeric(str: string): string {
  return str.replace(/[Ａ-Ｚａ-ｚ０-９！＂＃＄％＆＇（）＊＋，－．／：；＜＝＞？＠［＼］＾＿｀｛｜｝～]/g, (char) => {
    return String.fromCharCode(char.charCodeAt(0) - 0xfee0);
  });
}

/**
 * 半角英数字を全角に変換
 */
export function toZenkakuAlphanumeric(str: string): string {
  return str.replace(/[A-Za-z0-9]/g, (char) => {
    return String.fromCharCode(char.charCodeAt(0) + 0xfee0);
  });
}

/**
 * 全角カタカナを半角カタカナに変換
 */
export function toHankakuKatakana(str: string): string {
  const map: Record<string, string> = {
    ガ: "ｶﾞ",
    ギ: "ｷﾞ",
    グ: "ｸﾞ",
    ゲ: "ｹﾞ",
    ゴ: "ｺﾞ",
    ザ: "ｻﾞ",
    ジ: "ｼﾞ",
    ズ: "ｽﾞ",
    ゼ: "ｾﾞ",
    ゾ: "ｿﾞ",
    ダ: "ﾀﾞ",
    ヂ: "ﾁﾞ",
    ヅ: "ﾂﾞ",
    デ: "ﾃﾞ",
    ド: "ﾄﾞ",
    バ: "ﾊﾞ",
    ビ: "ﾋﾞ",
    ブ: "ﾌﾞ",
    ベ: "ﾍﾞ",
    ボ: "ﾎﾞ",
    パ: "ﾊﾟ",
    ピ: "ﾋﾟ",
    プ: "ﾌﾟ",
    ペ: "ﾍﾟ",
    ポ: "ﾎﾟ",
    ヴ: "ｳﾞ",
    ヷ: "ﾜﾞ",
    ヺ: "ｦﾞ",
    ア: "ｱ",
    イ: "ｲ",
    ウ: "ｳ",
    エ: "ｴ",
    オ: "ｵ",
    カ: "ｶ",
    キ: "ｷ",
    ク: "ｸ",
    ケ: "ｹ",
    コ: "ｺ",
    サ: "ｻ",
    シ: "ｼ",
    ス: "ｽ",
    セ: "ｾ",
    ソ: "ｿ",
    タ: "ﾀ",
    チ: "ﾁ",
    ツ: "ﾂ",
    テ: "ﾃ",
    ト: "ﾄ",
    ナ: "ﾅ",
    ニ: "ﾆ",
    ヌ: "ﾇ",
    ネ: "ﾈ",
    ノ: "ﾉ",
    ハ: "ﾊ",
    ヒ: "ﾋ",
    フ: "ﾌ",
    ヘ: "ﾍ",
    ホ: "ﾎ",
    マ: "ﾏ",
    ミ: "ﾐ",
    ム: "ﾑ",
    メ: "ﾒ",
    モ: "ﾓ",
    ヤ: "ﾔ",
    ユ: "ﾕ",
    ヨ: "ﾖ",
    ラ: "ﾗ",
    リ: "ﾘ",
    ル: "ﾙ",
    レ: "ﾚ",
    ロ: "ﾛ",
    ワ: "ﾜ",
    ヲ: "ｦ",
    ン: "ﾝ",
    ァ: "ｧ",
    ィ: "ｨ",
    ゥ: "ｩ",
    ェ: "ｪ",
    ォ: "ｫ",
    ッ: "ｯ",
    ャ: "ｬ",
    ュ: "ｭ",
    ョ: "ｮ",
    "。": "｡",
    "、": "､",
    ー: "ｰ",
    "「": "｢",
    "」": "｣",
    "・": "･",
  };

  return str
    .split("")
    .map((char) => map[char] || char)
    .join("");
}

/**
 * 半角カタカナを全角カタカナに変換（濁点・半濁点を結合）
 */
export function toZenkakuKatakana(str: string): string {
  // 濁点・半濁点を結合
  str = str
    .replace(/ｶﾞ/g, "ガ")
    .replace(/ｷﾞ/g, "ギ")
    .replace(/ｸﾞ/g, "グ")
    .replace(/ｹﾞ/g, "ゲ")
    .replace(/ｺﾞ/g, "ゴ")
    .replace(/ｻﾞ/g, "ザ")
    .replace(/ｼﾞ/g, "ジ")
    .replace(/ｽﾞ/g, "ズ")
    .replace(/ｾﾞ/g, "ゼ")
    .replace(/ｿﾞ/g, "ゾ")
    .replace(/ﾀﾞ/g, "ダ")
    .replace(/ﾁﾞ/g, "ヂ")
    .replace(/ﾂﾞ/g, "ヅ")
    .replace(/ﾃﾞ/g, "デ")
    .replace(/ﾄﾞ/g, "ド")
    .replace(/ﾊﾞ/g, "バ")
    .replace(/ﾋﾞ/g, "ビ")
    .replace(/ﾌﾞ/g, "ブ")
    .replace(/ﾍﾞ/g, "ベ")
    .replace(/ﾎﾞ/g, "ボ")
    .replace(/ﾊﾟ/g, "パ")
    .replace(/ﾋﾟ/g, "ピ")
    .replace(/ﾌﾟ/g, "プ")
    .replace(/ﾍﾟ/g, "ペ")
    .replace(/ﾎﾟ/g, "ポ")
    .replace(/ｳﾞ/g, "ヴ")
    .replace(/ﾜﾞ/g, "ヷ")
    .replace(/ｦﾞ/g, "ヺ");

  const map: Record<string, string> = {
    ｱ: "ア",
    ｲ: "イ",
    ｳ: "ウ",
    ｴ: "エ",
    ｵ: "オ",
    ｶ: "カ",
    ｷ: "キ",
    ｸ: "ク",
    ｹ: "ケ",
    ｺ: "コ",
    ｻ: "サ",
    ｼ: "シ",
    ｽ: "ス",
    ｾ: "セ",
    ｿ: "ソ",
    ﾀ: "タ",
    ﾁ: "チ",
    ﾂ: "ツ",
    ﾃ: "テ",
    ﾄ: "ト",
    ﾅ: "ナ",
    ﾆ: "ニ",
    ﾇ: "ヌ",
    ﾈ: "ネ",
    ﾉ: "ノ",
    ﾊ: "ハ",
    ﾋ: "ヒ",
    ﾌ: "フ",
    ﾍ: "ヘ",
    ﾎ: "ホ",
    ﾏ: "マ",
    ﾐ: "ミ",
    ﾑ: "ム",
    ﾒ: "メ",
    ﾓ: "モ",
    ﾔ: "ヤ",
    ﾕ: "ユ",
    ﾖ: "ヨ",
    ﾗ: "ラ",
    ﾘ: "リ",
    ﾙ: "ル",
    ﾚ: "レ",
    ﾛ: "ロ",
    ﾜ: "ワ",
    ｦ: "ヲ",
    ﾝ: "ン",
    ｧ: "ァ",
    ｨ: "ィ",
    ｩ: "ゥ",
    ｪ: "ェ",
    ｫ: "ォ",
    ｯ: "ッ",
    ｬ: "ャ",
    ｭ: "ュ",
    ｮ: "ョ",
    "｡": "。",
    "､": "、",
    ｰ: "ー",
    "｢": "「",
    "｣": "」",
    "･": "・",
  };

  return str
    .split("")
    .map((char) => map[char] || char)
    .join("");
}

/**
 * カタカナをひらがなに変換
 */
export function toHiragana(str: string): string {
  return str.replace(/[\u30A1-\u30F6]/g, (char) => {
    return String.fromCharCode(char.charCodeAt(0) - 0x60);
  });
}

/**
 * ひらがなをカタカナに変換
 */
export function toKatakana(str: string): string {
  return str.replace(/[\u3041-\u3096]/g, (char) => {
    return String.fromCharCode(char.charCodeAt(0) + 0x60);
  });
}
