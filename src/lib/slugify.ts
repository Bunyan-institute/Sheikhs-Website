/**
 * Turns any title into a URL-safe slug. Amharic (Ge'ez) and Arabic titles are romanised with a simple
 * letter table so the result is readable and never empty. It is a convenience, not linguistic
 * transliteration: slugs stay editable.
 */

// Ge'ez syllables are laid out in rows of 8 code points starting at U+1200: seven vowel orders + a labialised form.
const GEEZ_ROWS = [
  "h", "l", "h", "m", "s", "r", "s", "sh", "q", "qw", "q", "qw", "b", "v", "t", "ch", "h", "hw", "n", "ny", "", "k", "kw", "k", "kw",
  "w", "", "z", "zh", "y", "d", "dd", "j", "g", "gw", "ng", "t", "ch", "p", "ts", "ts", "f", "p",
];
const GEEZ_ORDERS = ["a", "u", "i", "a", "e", "", "o", "oa"];

const ARABIC: Record<string, string> = {
  ا: "a", أ: "a", إ: "i", آ: "aa", ب: "b", ت: "t", ث: "th", ج: "j", ح: "h", خ: "kh", د: "d", ذ: "dh", ر: "r", ز: "z",
  س: "s", ش: "sh", ص: "s", ض: "d", ط: "t", ظ: "z", ع: "a", غ: "gh", ف: "f", ق: "q", ك: "k", ل: "l", م: "m", ن: "n",
  ه: "h", و: "w", ي: "y", ى: "a", ة: "a", ء: "", ؤ: "w", ئ: "y", پ: "p", چ: "ch", گ: "g",
};

function romanise(text: string): string {
  let out = "";
  for (const ch of text) {
    const code = ch.codePointAt(0)!;
    if (code >= 0x1200 && code <= 0x1357) {
      const row = GEEZ_ROWS[(code - 0x1200) >> 3];
      const order = GEEZ_ORDERS[(code - 0x1200) & 7];
      out += row === undefined ? "" : row + order;
    } else if (ARABIC[ch] !== undefined) {
      out += ARABIC[ch];
    } else {
      out += ch;
    }
  }
  return out;
}

export function slugify(text: string, options: { fallbackPrefix?: string; maxLength?: number } = {}): string {
  const { fallbackPrefix = "item", maxLength = 60 } = options;
  const slug = romanise(text.normalize("NFD").replace(/[̀-ًͯ-ٰٟ]/g, ""))
    .toLowerCase()
    .replace(/['’`ʼʻ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, maxLength)
    .replace(/-+$/g, "");
  return slug || `${fallbackPrefix}-${Math.random().toString(36).slice(2, 6)}`;
}
