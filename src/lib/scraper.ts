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

    // 拼音：在 .dicpy 中（排除"注音"行）
    let pinyin = "";
    $("p").each((_, el) => {
      const text = $(el).text();
      if (text.includes("拼音") && !text.includes("注音")) {
        pinyin = $(el).find(".dicpy").text().trim();
      }
    });

    let meaning = "";
    let origin = "";
    const examples: string[] = [];
    const synonyms: string[] = [];
    const antonyms: string[] = [];

    // 解析成语解释区块 (#cyjs .content p)
    $("#cyjs .content p, .cyjs .content p").each((_, el) => {
      const text = $(el).text().trim();
      if (text.startsWith("【解释】")) {
        meaning = text.replace("【解释】", "").trim();
      } else if (text.startsWith("【出处】")) {
        origin = text.replace("【出处】", "").trim();
      } else if (text.startsWith("【示例】") || text.startsWith("【例句】")) {
        const ex = text.replace(/^【[示例例句]+】/, "").trim();
        if (ex && examples.length < 3) examples.push(ex);
      } else if (text.startsWith("【近义词】")) {
        const syn = text.replace("【近义词】", "").trim();
        synonyms.push(...syn.split(/[、，,\s]+/).filter(Boolean));
      } else if (text.startsWith("【反义词】")) {
        const ant = text.replace("【反义词】", "").trim();
        antonyms.push(...ant.split(/[、，,\s]+/).filter(Boolean));
      }
    });

    // 备用：从 .jnr 区块解析
    if (!meaning) {
      $(".jnr p").each((_, el) => {
        const text = $(el).text().trim();
        // 跳过标题行 (如 "◎ 垂头丧气 chuítóu-sàngqì")
        if (text.startsWith("◎")) return;
        if (text.includes("[") && !meaning) {
          // 如 "[dejected] 低着头无精打彩的样子"
          meaning = text.replace(/\[.*?\]\s*/, "").trim();
        } else if (!meaning && text.length > 5) {
          meaning = text;
        }
      });
    }

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
 * 合并多个来源的数据，综合显示最完整的内容
 * 策略：从所有来源中取每个字段的最佳值，例句去重合并
 */
function mergeIdiomData(results: (Idiom | null)[]): Idiom | null {
  const validResults = results.filter((r): r is Idiom => r !== null);
  if (validResults.length === 0) return null;

  const merged: Idiom = {
    idiom: validResults[0].idiom,
    pinyin: "",
    meaning: "",
    origin: "",
    example: "",
    synonyms: [],
    antonyms: [],
  };

  // 收集所有例句（去重）
  const allExamples: string[] = [];
  // 收集所有近义词和反义词（去重）
  const allSynonyms = new Set<string>();
  const allAntonyms = new Set<string>();

  for (const r of validResults) {
    // 拼音：取第一个非空的
    if (!merged.pinyin && r.pinyin) {
      merged.pinyin = r.pinyin;
    }

    // 释义：取最长最详细的
    if (r.meaning && r.meaning.length > merged.meaning.length) {
      merged.meaning = r.meaning;
    }

    // 出处：取最长的
    if (r.origin && r.origin.length > merged.origin.length) {
      merged.origin = r.origin;
    }

    // 例句：从所有来源收集，去重
    const exList = r.examples && r.examples.length > 0 ? r.examples : r.example ? [r.example] : [];
    for (const ex of exList) {
      if (ex && !allExamples.some((e) => e === ex || e.includes(ex) || ex.includes(e))) {
        allExamples.push(ex);
      }
    }

    // 近义词、反义词合并
    r.synonyms.forEach((s) => { if (s) allSynonyms.add(s); });
    r.antonyms.forEach((a) => { if (a) allAntonyms.add(a); });
  }

  // 最多保留3条例句
  merged.examples = allExamples.slice(0, 3);
  merged.example = merged.examples[0] || "";
  merged.synonyms = Array.from(allSynonyms);
  merged.antonyms = Array.from(allAntonyms);

  return merged;
}

/**
 * 判断一个成语数据是否完整（拥有拼音、释义、出处、例句等关键字段）
 */
function isComplete(idiom: Idiom): boolean {
  return !!(
    idiom.pinyin &&
    idiom.meaning &&
    idiom.origin &&
    (idiom.examples?.length || idiom.example)
  );
}

/**
 * Fetch idiom data by trying multiple sources, with fallback to seed data.
 * 如果本地数据不完整，会从网络源补充缺失的字段。
 */
export async function fetchIdiom(word: string): Promise<Idiom> {
  // 1. Check local data first (fastest)
  const localData = seedIdioms[word] || extendedIdioms[word] || null;

  // 如果本地数据完整，直接返回
  if (localData && isComplete(localData)) {
    return localData;
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

  // 如果有本地数据，也加入合并列表一起综合
  if (localData) {
    successResults.unshift(localData);
  }

  // 合并所有成功的结果
  const merged = mergeIdiomData(successResults);
  if (merged) {
    return merged;
  }

  // 3. 如果有本地数据但网络全部失败，仍然返回本地数据
  if (localData) {
    return localData;
  }

  // 4. Return a minimal fallback
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
