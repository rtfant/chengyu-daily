import * as cheerio from "cheerio";
import { Idiom, seedIdioms } from "@/data/seed-idioms";
import { extendedIdioms } from "@/data/extended-idioms";

// 请求超时时间
const TIMEOUT = 10000;

// 通用请求头
const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
};

// --- Source 1: 百度汉语 ---
async function scrapeFromBaiduHanyu(word: string): Promise<Idiom | null> {
  try {
    const url = `https://hanyu.baidu.com/s?wd=${encodeURIComponent(word)}&ptype=zici`;
    const res = await fetch(url, {
      headers: HEADERS,
      signal: AbortSignal.timeout(TIMEOUT),
    });
    if (!res.ok) return null;

    const html = await res.text();
    const $ = cheerio.load(html);

    const pinyin =
      $("#pinyin .keyword").text().trim() ||
      $(".pronounce .keyword").text().trim() ||
      "";

    // 获取更详细的释义
    let meaning = "";
    const meaningEl = $(".tab-content .content .text").first();
    if (meaningEl.length) {
      meaning = meaningEl.text().trim();
    }
    if (!meaning) {
      meaning = $("#explanation .text").first().text().trim();
    }
    // 尝试获取更多释义内容
    if (!meaning) {
      $(".basicmean-item").each((_, el) => {
        const text = $(el).text().trim();
        if (text && meaning.length < 500) {
          meaning += (meaning ? "；" : "") + text;
        }
      });
    }

    const origin =
      $("#source .text").first().text().trim() ||
      $(".tab-content")
        .filter((_, el) => $(el).find(".title").text().includes("出处"))
        .find(".text")
        .first()
        .text()
        .trim() ||
      "";

    // 获取多条例句
    const examples: string[] = [];
    $("#example .text, .example-item").each((i, el) => {
      if (i < 3) {
        const text = $(el).text().trim();
        if (text) examples.push(text);
      }
    });

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
      origin: origin || "",
      example: examples[0] || "",
      examples: examples.length > 0 ? examples : undefined,
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
      headers: HEADERS,
      signal: AbortSignal.timeout(TIMEOUT),
    });
    if (!res.ok) return null;

    const html = await res.text();
    const $ = cheerio.load(html);

    const pinyin = $(".dicpy .z_ts2").first().text().trim() || "";
    let meaning = "";
    let origin = "";
    const examples: string[] = [];

    $(".content .jnr, .gc_cy_jjnr").each((_, el) => {
      const text = $(el).text().trim();
      if (text.includes("解释") || text.includes("释义")) {
        meaning = text.replace(/^[\s\S]*?[：:]\s*/, "").trim();
      }
      if (text.includes("出处")) {
        origin = text.replace(/^[\s\S]*?[：:]\s*/, "").trim();
      }
      if (text.includes("例句") || text.includes("示例")) {
        const ex = text.replace(/^[\s\S]*?[：:]\s*/, "").trim();
        if (ex && examples.length < 3) examples.push(ex);
      }
    });

    // 尝试其他选择器获取释义
    if (!meaning) {
      meaning = $(".gc_cy_jy").text().trim() || $(".jnr p").first().text().trim() || "";
    }

    if (!meaning && !pinyin) return null;

    return {
      idiom: word,
      pinyin: pinyin || "",
      meaning: meaning || `${word}的释义`,
      origin: origin || "",
      example: examples[0] || "",
      examples: examples.length > 0 ? examples : undefined,
      synonyms: [],
      antonyms: [],
    };
  } catch {
    return null;
  }
}

// --- Source 3: 汉文学网 (hwxnet.com) ---
async function scrapeFromHwxnet(word: string): Promise<Idiom | null> {
  try {
    const url = `https://cy.hwxnet.com/view/${encodeURIComponent(word)}.html`;
    const res = await fetch(url, {
      headers: HEADERS,
      signal: AbortSignal.timeout(TIMEOUT),
    });
    if (!res.ok) return null;

    const html = await res.text();
    const $ = cheerio.load(html);

    let pinyin = "";
    let meaning = "";
    let origin = "";
    const examples: string[] = [];
    const synonyms: string[] = [];
    const antonyms: string[] = [];

    // 拼音
    pinyin = $(".cy_py").text().trim() || $(".pinyin").text().trim() || "";

    // 解析各个字段
    $(".cy_content li, .cy_tb tr").each((_, el) => {
      const label = $(el).find(".cy_tb_tit, td:first-child").text().trim();
      const value = $(el).find(".cy_tb_con, td:last-child").text().trim() || $(el).text().replace(label, "").trim();

      if (label.includes("解释") || label.includes("释义")) {
        meaning = value;
      }
      if (label.includes("出处") || label.includes("典故")) {
        origin = value;
      }
      if (label.includes("举例") || label.includes("例句") || label.includes("示例")) {
        if (value && examples.length < 3) examples.push(value);
      }
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
      pinyin,
      meaning: meaning || `${word}的释义`,
      origin: origin || "",
      example: examples[0] || "",
      examples: examples.length > 0 ? examples : undefined,
      synonyms,
      antonyms,
    };
  } catch {
    return null;
  }
}

// --- Source 4: 千篇国学 (qianp.com) ---
async function scrapeFromQianp(word: string): Promise<Idiom | null> {
  try {
    const url = `https://chengyu.qianp.com/cy/${encodeURIComponent(word)}`;
    const res = await fetch(url, {
      headers: HEADERS,
      signal: AbortSignal.timeout(TIMEOUT),
    });
    if (!res.ok) return null;

    const html = await res.text();
    const $ = cheerio.load(html);

    let pinyin = "";
    let meaning = "";
    let origin = "";
    const examples: string[] = [];
    const synonyms: string[] = [];
    const antonyms: string[] = [];

    // 拼音
    pinyin = $(".py, .pinyin").text().trim() || "";

    // 解析内容
    $(".cy-info tr, .info-item").each((_, el) => {
      const text = $(el).text();
      if (text.includes("拼音")) {
        pinyin = pinyin || text.replace(/拼音[：:]\s*/, "").trim();
      }
      if (text.includes("解释") || text.includes("释义")) {
        meaning = text.replace(/[解释释义][：:]\s*/, "").trim();
      }
      if (text.includes("出处")) {
        origin = text.replace(/出处[：:]\s*/, "").trim();
      }
      if (text.includes("例句") || text.includes("举例")) {
        const ex = text.replace(/[例句举例][：:]\s*/, "").trim();
        if (ex && examples.length < 3) examples.push(ex);
      }
      if (text.includes("近义词")) {
        const syn = text.replace(/近义词[：:]\s*/, "").trim();
        synonyms.push(...syn.split(/[、，,\s]+/).filter(Boolean));
      }
      if (text.includes("反义词")) {
        const ant = text.replace(/反义词[：:]\s*/, "").trim();
        antonyms.push(...ant.split(/[、，,\s]+/).filter(Boolean));
      }
    });

    if (!meaning && !pinyin) return null;

    return {
      idiom: word,
      pinyin,
      meaning: meaning || `${word}的释义`,
      origin: origin || "",
      example: examples[0] || "",
      examples: examples.length > 0 ? examples : undefined,
      synonyms,
      antonyms,
    };
  } catch {
    return null;
  }
}

// --- Source 5: 汉程词典 (httpcn.com) ---
async function scrapeFromHttpcn(word: string): Promise<Idiom | null> {
  try {
    const url = `https://hy.httpcn.com/Html/Cy/${encodeURIComponent(word)}.shtml`;
    const res = await fetch(url, {
      headers: HEADERS,
      signal: AbortSignal.timeout(TIMEOUT),
    });
    if (!res.ok) return null;

    const html = await res.text();
    const $ = cheerio.load(html);

    let pinyin = "";
    let meaning = "";
    let origin = "";
    const examples: string[] = [];
    const synonyms: string[] = [];
    const antonyms: string[] = [];

    // 尝试多种选择器
    pinyin = $(".pinyin").text().trim() || $("[class*='py']").first().text().trim() || "";
    meaning = $(".jyjs, .explain, [class*='mean']").first().text().trim() || "";
    origin = $(".chud, .origin, [class*='source']").first().text().trim() || "";

    $(".liju li, .example li").each((i, el) => {
      if (i < 3) {
        const text = $(el).text().trim();
        if (text) examples.push(text);
      }
    });

    if (!meaning && !pinyin) return null;

    return {
      idiom: word,
      pinyin,
      meaning: meaning || `${word}的释义`,
      origin: origin || "",
      example: examples[0] || "",
      examples: examples.length > 0 ? examples : undefined,
      synonyms,
      antonyms,
    };
  } catch {
    return null;
  }
}

// --- Source 6: 查字典 (chazidian.com) ---
async function scrapeFromChazidian(word: string): Promise<Idiom | null> {
  try {
    const url = `https://www.chazidian.com/cy/${encodeURIComponent(word)}/`;
    const res = await fetch(url, {
      headers: HEADERS,
      signal: AbortSignal.timeout(TIMEOUT),
    });
    if (!res.ok) return null;

    const html = await res.text();
    const $ = cheerio.load(html);

    let pinyin = "";
    let meaning = "";
    let origin = "";
    const examples: string[] = [];
    const synonyms: string[] = [];
    const antonyms: string[] = [];

    $(".cy_info tr").each((_, el) => {
      const label = $(el).find("th").text().trim();
      const value = $(el).find("td").text().trim();

      if (label.includes("拼音")) pinyin = value;
      if (label.includes("解释") || label.includes("释义")) meaning = value;
      if (label.includes("出处")) origin = value;
      if (label.includes("例子") || label.includes("例句")) {
        if (value && examples.length < 3) examples.push(value);
      }
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
      pinyin,
      meaning: meaning || `${word}的释义`,
      origin: origin || "",
      example: examples[0] || "",
      examples: examples.length > 0 ? examples : undefined,
      synonyms,
      antonyms,
    };
  } catch {
    return null;
  }
}

/**
 * 合并多个来源的数据，选择最完整的
 */
function mergeIdiomData(results: (Idiom | null)[]): Idiom | null {
  const validResults = results.filter((r): r is Idiom => r !== null);
  if (validResults.length === 0) return null;

  // 找到释义最详细的结果
  let best = validResults[0];
  for (const r of validResults) {
    // 优先选择释义更长的
    if (r.meaning.length > best.meaning.length) {
      best = { ...best, meaning: r.meaning };
    }
    // 合并例句
    if (r.examples && r.examples.length > (best.examples?.length || 0)) {
      best = { ...best, examples: r.examples, example: r.examples[0] || best.example };
    }
    // 补充缺失的字段
    if (!best.pinyin && r.pinyin) best = { ...best, pinyin: r.pinyin };
    if (!best.origin && r.origin) best = { ...best, origin: r.origin };
    if (best.synonyms.length === 0 && r.synonyms.length > 0) {
      best = { ...best, synonyms: r.synonyms };
    }
    if (best.antonyms.length === 0 && r.antonyms.length > 0) {
      best = { ...best, antonyms: r.antonyms };
    }
  }

  return best;
}

/**
 * Fetch idiom data by trying multiple sources, with fallback to seed data.
 */
export async function fetchIdiom(word: string): Promise<Idiom> {
  // 1. Check local data first (fastest)
  if (seedIdioms[word]) {
    return seedIdioms[word];
  }
  if (extendedIdioms[word]) {
    return extendedIdioms[word];
  }

  // 2. Try scraping from multiple sources in parallel
  const scrapers = [
    scrapeFromBaiduHanyu(word),
    scrapeFromZdic(word),
    scrapeFromHwxnet(word),
    scrapeFromQianp(word),
    scrapeFromHttpcn(word),
    scrapeFromChazidian(word),
  ];

  const results = await Promise.allSettled(scrapers);
  const successResults = results
    .filter((r): r is PromiseFulfilledResult<Idiom | null> => r.status === "fulfilled")
    .map((r) => r.value);

  // 合并所有成功的结果
  const merged = mergeIdiomData(successResults);
  if (merged) {
    return merged;
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

/**
 * 获取成语列表（用于搜索）
 */
export function getIdiomList(): string[] {
  const allIdioms = new Set<string>();
  Object.keys(seedIdioms).forEach((k) => allIdioms.add(k));
  Object.keys(extendedIdioms).forEach((k) => allIdioms.add(k));
  return Array.from(allIdioms);
}
