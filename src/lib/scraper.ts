import * as cheerio from "cheerio";
import { Idiom, seedIdioms } from "@/data/seed-idioms";
import { extendedIdioms } from "@/data/extended-idioms";

// --- Source 1: 百度汉语 ---
async function scrapeFromBaiduHanyu(word: string): Promise<Idiom | null> {
  try {
    const url = `https://hanyu.baidu.com/s?wd=${encodeURIComponent(word)}&ptype=zici`;
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "zh-CN,zh;q=0.9",
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;

    const html = await res.text();
    const $ = cheerio.load(html);

    const pinyin =
      $("#pinyin .keyword").text().trim() ||
      $(".pronounce .keyword").text().trim() ||
      "";
    const meaning =
      $(".tab-content .content .text").first().text().trim() ||
      $("#explanation .text").first().text().trim() ||
      "";
    const origin =
      $("#source .text").first().text().trim() ||
      $(".tab-content")
        .filter((_, el) => $(el).find(".title").text().includes("出处"))
        .find(".text")
        .first()
        .text()
        .trim() ||
      "";
    const example =
      $("#example .text").first().text().trim() ||
      $(".tab-content")
        .filter((_, el) => $(el).find(".title").text().includes("例句"))
        .find(".text")
        .first()
        .text()
        .trim() ||
      "";

    const synonymsText =
      $("#synonym .text").text().trim() ||
      $(".tab-content")
        .filter((_, el) => $(el).find(".title").text().includes("近义词"))
        .find(".text")
        .text()
        .trim() ||
      "";
    const antonymsText =
      $("#antonym .text").text().trim() ||
      $(".tab-content")
        .filter((_, el) => $(el).find(".title").text().includes("反义词"))
        .find(".text")
        .text()
        .trim() ||
      "";

    const synonyms = synonymsText
      ? synonymsText.split(/[、，,\s]+/).filter(Boolean)
      : [];
    const antonyms = antonymsText
      ? antonymsText.split(/[、，,\s]+/).filter(Boolean)
      : [];

    if (!meaning && !pinyin) return null;

    return {
      idiom: word,
      pinyin: pinyin || "",
      meaning: meaning || `${word}的释义`,
      origin: origin || "暂无出处记录",
      example: example || "",
      synonyms,
      antonyms,
    };
  } catch {
    return null;
  }
}

// --- Source 2: 汉典 (zdic.net) ---
async function scrapeFromZdic(word: string): Promise<Idiom | null> {
  try {
    const url = `https://www.zdic.net/hans/${encodeURIComponent(word)}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "zh-CN,zh;q=0.9",
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;

    const html = await res.text();
    const $ = cheerio.load(html);

    const pinyin = $(".dicpy .z_ts2").first().text().trim() || "";
    let meaning = "";
    let origin = "";
    let example = "";

    $(".content .jnr").each((_, el) => {
      const text = $(el).text().trim();
      if (text.includes("解释") || text.includes("释义")) {
        meaning =
          $(el)
            .find("p")
            .first()
            .text()
            .replace(/^[\s\S]*?[：:]/, "")
            .trim() || text;
      }
      if (text.includes("出处")) {
        origin =
          $(el)
            .find("p")
            .first()
            .text()
            .replace(/^[\s\S]*?[：:]/, "")
            .trim() || text;
      }
      if (text.includes("例句") || text.includes("示例")) {
        example =
          $(el)
            .find("p")
            .first()
            .text()
            .replace(/^[\s\S]*?[：:]/, "")
            .trim() || text;
      }
    });

    if (!meaning && !pinyin) return null;

    return {
      idiom: word,
      pinyin: pinyin || "",
      meaning: meaning || `${word}的释义`,
      origin: origin || "暂无出处记录",
      example: example || "",
      synonyms: [],
      antonyms: [],
    };
  } catch {
    return null;
  }
}

// --- Source 3: 国学大师 (guoxuedashi.net) ---
async function scrapeFromGuoxue(word: string): Promise<Idiom | null> {
  try {
    const url = `https://www.guoxuedashi.net/chengyu/${encodeURIComponent(word)}.html`;
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "zh-CN,zh;q=0.9",
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;

    const html = await res.text();
    const $ = cheerio.load(html);

    let pinyin = "";
    let meaning = "";
    let origin = "";
    let example = "";
    const synonyms: string[] = [];
    const antonyms: string[] = [];

    $("table tr").each((_, row) => {
      const label = $(row).find("td").first().text().trim();
      const value = $(row).find("td").last().text().trim();
      if (label.includes("拼音")) pinyin = value;
      if (label.includes("解释") || label.includes("释义")) meaning = value;
      if (label.includes("出处")) origin = value;
      if (label.includes("举例") || label.includes("例句")) example = value;
      if (label.includes("近义")) {
        synonyms.push(...value.split(/[、，,\s]+/).filter(Boolean));
      }
      if (label.includes("反义")) {
        antonyms.push(...value.split(/[、，,\s]+/).filter(Boolean));
      }
    });

    if (!meaning && !pinyin) return null;

    return {
      idiom: word,
      pinyin: pinyin || "",
      meaning: meaning || `${word}的释义`,
      origin: origin || "暂无出处记录",
      example: example || "",
      synonyms,
      antonyms,
    };
  } catch {
    return null;
  }
}

/**
 * Fetch idiom data by trying multiple sources in order, falling back to seed data.
 */
export async function fetchIdiom(word: string): Promise<Idiom> {
  // 1. Check local data first (fastest)
  if (seedIdioms[word]) {
    return seedIdioms[word];
  }
  if (extendedIdioms[word]) {
    return extendedIdioms[word];
  }

  // 2. Try scraping from multiple sources in parallel-race
  const scrapers = [
    scrapeFromBaiduHanyu(word),
    scrapeFromZdic(word),
    scrapeFromGuoxue(word),
  ];

  const results = await Promise.allSettled(scrapers);

  for (const result of results) {
    if (result.status === "fulfilled" && result.value) {
      return result.value;
    }
  }

  // 3. Return a minimal fallback
  return {
    idiom: word,
    pinyin: "",
    meaning: "暂未获取到释义，请稍后再试。",
    origin: "",
    example: "",
    synonyms: [],
    antonyms: [],
  };
}
