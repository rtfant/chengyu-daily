import * as cheerio from "cheerio";
import { Idiom, seedIdioms } from "@/data/seed-idioms";
import { extendedIdioms } from "@/data/extended-idioms";
import { getCachedIdiom, setCachedIdiom } from "@/lib/cache";
import { getIdiomFromDB, saveIdiomToDB } from "@/lib/db";

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
    let usage = "";
    const examples: string[] = [];
    const synonyms: string[] = [];
    const antonyms: string[] = [];
    // 收集额外的释义（来自 .jnr/.gnr）用于补充主释义
    const extraMeanings: string[] = [];

    // 解析成语解释区块 (#cyjs .content p)
    $("#cyjs .content p, .cyjs .content p").each((_, el) => {
      const text = $(el).text().trim();
      if (text.startsWith("【解释】")) {
        meaning = text.replace("【解释】", "").trim();
      } else if (text.startsWith("【出处】")) {
        origin = text.replace("【出处】", "").trim();
      } else if (text.startsWith("【示例】") || text.startsWith("【例句】")) {
        // 清理 ◎ 来源标注，如 "这也是一则事实... ◎《花月痕》第五一回"
        let ex = text.replace(/^【[示例例句]+】/, "").trim();
        ex = ex.replace(/\s*◎.*$/, "").trim();
        if (ex && examples.length < 3) examples.push(ex);
      } else if (text.startsWith("【近义词】")) {
        const syn = text.replace("【近义词】", "").trim();
        synonyms.push(...syn.split(/[、，,\s]+/).filter(Boolean));
      } else if (text.startsWith("【反义词】")) {
        const ant = text.replace("【反义词】", "").trim();
        antonyms.push(...ant.split(/[、，,\s]+/).filter(Boolean));
      } else if (text.startsWith("【语法】")) {
        usage = text.replace("【语法】", "").trim();
      }
    });

    // 从 .jnr 和 .gnr 区块提取更多例句和释义
    const addExample = (ex: string) => {
      if (ex && ex.length > 5 && examples.length < 3 && !examples.some(e => e.includes(ex) || ex.includes(e))) {
        examples.push(ex);
      }
    };

    $(".jnr p, .gnr p, .gnr div").each((_, el) => {
      let text = $(el).text().trim();
      text = text.replace(/&mdash;/g, "\u2014\u2014").replace(/&hellip;/g, "...").replace(/&ldquo;/g, "\u201C").replace(/&rdquo;/g, "\u201D");
      if (text.startsWith("\u25CE") || text.length < 8) return;

      // 提取 [英文释义] 后面的中文详细释义（.jnr 区块）
      const encsMatch = text.match(/\[.*?\]\s*(.+)/);
      if (encsMatch) {
        const detailMeaning = encsMatch[1].trim();
        // 排除纯例句（含"如："），只取释义性文本
        if (detailMeaning.length > 5 && !detailMeaning.startsWith("如")) {
          extraMeanings.push(detailMeaning);
        }
      }

      // 提取 "如：「...」" 格式的例句
      const ruMatch = text.match(/如[\uFF1A:]?\s*[\u300C\u201C](.+?)[\u300D\u201D]/);
      if (ruMatch) {
        addExample(ruMatch[1].trim());
        return;
      }

      // 从gnr长文本中提取 「...」 引号内的例句
      const allQuotes = text.match(/[\u300C\u201C]([^\u300D\u201D]{8,80})[\u300D\u201D]/g);
      if (allQuotes) {
        for (const q of allQuotes) {
          const inner = q.slice(1, -1).trim();
          if (inner.length > 8 && !inner.startsWith("\u300A")) {
            addExample(inner);
          }
        }
        return;
      }

      // 提取包含成语词本身的用法句子
      if (text.includes(word) && text.length > word.length + 4 && text.length < 150) {
        if (text.startsWith("[") || text.includes("拼音") || text.includes("注音")) return;
        if (text.startsWith(word) && /[a-zA-Z\u0101\u00E1\u01CE\u00E0\u0113\u00E9\u011B\u00E8\u012B\u00ED\u01D0\u00EC\u014D\u00F3\u01D2\u00F2\u016B\u00FA\u01D4\u00F9\u01D6\u01D8\u01DA\u01DC\u3100-\u312F]/.test(text.slice(word.length, word.length + 3))) return;
        if (/[\u3100-\u312F]{2,}/.test(text)) return;
        if (origin && (text.includes(origin) || origin.includes(text))) return;
        const cleanEx = text.replace(/[\u25CE\u25CF\u25A0]/g, "").trim();
        addExample(cleanEx);
        return;
      }

      // 备用释义来源（不含英文标注的长文本）
      if (!meaning && !encsMatch) {
        if (text.length > 8 && !text.startsWith("如")) {
          extraMeanings.push(text);
        }
      }
    });

    // 合并释义：如果主释义较短，用额外释义补充
    if (meaning && extraMeanings.length > 0) {
      for (const em of extraMeanings) {
        // 只补充不重复的内容
        if (em.length > 5 && !meaning.includes(em) && !em.includes(meaning)) {
          // 确保连接处不会出现重复标点
          const sep = meaning.endsWith("。") || meaning.endsWith("；") ? "" : "。";
          meaning = meaning + sep + em;
          break; // 最多补充一条
        }
      }
    } else if (!meaning && extraMeanings.length > 0) {
      meaning = extraMeanings[0];
    }

    // 如果例句不足3条，从出处中提取引用句作为补充例句
    if (examples.length < 3 && origin) {
      const quoteMatch = origin.match(/["\u201C\u300C](.{8,}?)["\u201D\u300D]/);
      if (quoteMatch) {
        const ex = quoteMatch[1].trim();
        if (ex && !examples.some(e => e.includes(ex) || ex.includes(e))) {
          examples.push(ex);
        }
      }
    }

    if (!meaning && !pinyin) return null;

    return {
      idiom: word,
      pinyin: pinyin || "",
      meaning: meaning || `${word}的释义`,
      origin: origin || "",
      example: examples[0] || "",
      examples: examples.length > 0 ? examples : undefined,
      usage: usage || undefined,
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

// --- Source 7: 千万库 (qianwanku.com) ---
// 该站使用 GB2312 编码，URL 基于内部 ID，需要先搜索获取 ID
async function scrapeFromQianwanku(word: string): Promise<Idiom | null> {
  try {
    // 第一步：通过搜索页获取成语的内部 ID
    const searchUrl = `http://chengyu.qianwanku.com/socy.asp?txtname=${encodeURIComponent(word)}`;
    const searchRes = await fetch(searchUrl, {
      headers: {
        ...HEADERS,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(TIMEOUT),
      redirect: "follow",
    });
    if (!searchRes.ok) return null;

    const searchBuf = await searchRes.arrayBuffer();
    const searchHtml = new TextDecoder("gb2312").decode(searchBuf);
    const $search = cheerio.load(searchHtml);

    // 从搜索结果中找到匹配的成语链接
    let cyUrl = "";
    $search("a").each((_, el) => {
      const href = $search(el).attr("href") || "";
      const text = $search(el).text().trim();
      if (text === word && href.includes("cy.asp?id=")) {
        cyUrl = href;
      }
    });

    if (!cyUrl) return null;

    // 第二步：抓取成语详情页
    const detailUrl = cyUrl.startsWith("http")
      ? cyUrl
      : `http://chengyu.qianwanku.com/${cyUrl}`;
    const detailRes = await fetch(detailUrl, {
      headers: HEADERS,
      signal: AbortSignal.timeout(TIMEOUT),
    });
    if (!detailRes.ok) return null;

    const detailBuf = await detailRes.arrayBuffer();
    const detailHtml = new TextDecoder("gb2312").decode(detailBuf);
    const $ = cheerio.load(detailHtml);

    let pinyin = "";
    let meaning = "";
    let origin = "";
    let usage = "";
    const examples: string[] = [];
    const synonyms: string[] = [];
    const antonyms: string[] = [];

    // 拼音：在 .pinyin 类中
    pinyin = $(".pinyin").text().trim() || "";

    // 解析 h2 标题后的内容段落
    const content = $(".wid.nr.tl").last();
    let currentSection = "";

    content.children().each((_, el) => {
      const tagName = (el as unknown as { tagName?: string }).tagName?.toLowerCase() || "";
      const text = $(el).text().trim();

      if (tagName === "h2") {
        currentSection = text;
        return;
      }

      // 释义段落（h2后面的文本节点）
      if (currentSection.includes("意思") && !meaning) {
        const cleanText = text.replace(/\n/g, "").trim();
        if (cleanText.length > 3) meaning = cleanText;
      }
    });

    // 用正则从完整 HTML 文本中提取各字段
    const fullText = content.text();

    // 释义
    if (!meaning) {
      const meaningMatch = fullText.match(/的意思[\s\n]*(.+?)(?:\n|成语出处)/);
      if (meaningMatch) meaning = meaningMatch[1].trim();
    }

    // 出处
    const originMatch = fullText.match(/成语出处[\s\n]*(.+?)(?:\n|的用法)/);
    if (originMatch) origin = originMatch[1].trim();

    // 用法段落
    const usageSection = fullText.match(/的用法[\s\n]*([\s\S]+?)(?:\n近\/反义词|的近|其它说明)/);
    if (usageSection) {
      const usageText = usageSection[1].trim();
      // 提取感情色彩和语法
      const grammarMatch = usageText.match(/【成语语法】[：:]\s*(.+?)(?:\n|【|$)/);
      const emotionMatch = usageText.match(/【感情色彩】[：:]\s*(.+?)(?:\n|【|$)/);
      if (grammarMatch) {
        usage = grammarMatch[1].trim();
        if (emotionMatch) {
          const emotion = emotionMatch[1].trim();
          if (!usage.includes(emotion)) usage = emotion + "；" + usage;
        }
      }
      // 提取示例
      const exMatch = usageText.match(/【成语示例】[：:]\s*(.+?)(?:\n|【|$)/);
      if (exMatch) {
        let ex = exMatch[1].trim();
        // 清理来源标注
        ex = ex.replace(/（《[^）]+》[^）]*）\s*$/, "").replace(/\s*《[^》]+》[^）]*$/, "").trim();
        if (ex.length > 5 && examples.length < 3) examples.push(ex);
      }
    }

    // 近反义词
    const synMatch = fullText.match(/【近义词】[：:]\s*(.+?)(?:\n|【|$)/);
    const antMatch = fullText.match(/【反义词】[：:]\s*(.+?)(?:\n|【|$)/);
    if (synMatch) {
      synonyms.push(...synMatch[1].trim().split(/[、，,\s]+/).filter(Boolean));
    }
    if (antMatch) {
      const antText = antMatch[1].trim();
      if (antText && antText !== "\u00A0") {
        antonyms.push(...antText.split(/[、，,\s]+/).filter(Boolean));
      }
    }

    if (!meaning && !pinyin) return null;

    return {
      idiom: word,
      pinyin,
      meaning: meaning || `${word}的释义`,
      origin: origin || "",
      example: examples[0] || "",
      examples: examples.length > 0 ? examples : undefined,
      usage: usage || undefined,
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

    // 用法：取最长的
    if (r.usage && (!merged.usage || r.usage.length > merged.usage.length)) {
      merged.usage = r.usage;
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
 * 判断一个成语数据是否完整（拥有拼音、释义、出处、且有至少2条例句）
 * 只有非常完整的数据才跳过网络请求
 */
function isComplete(idiom: Idiom): boolean {
  return !!(
    idiom.pinyin &&
    idiom.meaning &&
    idiom.origin &&
    idiom.examples &&
    idiom.examples.length >= 2
  );
}

/**
 * 获取成语数据（公开 API）
 *
 * 三层缓存架构：
 *   1. 内存缓存（Map）          → 同一热实例内瞬间返回（< 1ms）
 *   2. Neon 数据库              → 持久化，冷启动也命中（~10-50ms）
 *   3. 网络爬取（7 源合并）     → 首次获取（3-10s），结果自动写入上面两层
 *
 * 爬取失败时返回兜底数据（不入库，下次请求重试）。
 */
export async function fetchIdiom(word: string): Promise<Idiom> {
  // Layer 1: 内存缓存（最快）
  const memCached = getCachedIdiom(word);
  if (memCached && isComplete(memCached)) {
    return memCached;
  }

  // Layer 2: Neon 数据库（持久化）
  try {
    const dbData = await getIdiomFromDB(word);
    if (dbData && isComplete(dbData)) {
      setCachedIdiom(word, dbData);
      return dbData;
    }
  } catch {
    // 数据库不可用，继续尝试本地数据和网络爬取
  }

  // Layer 2.5: 本地种子数据
  const localData = seedIdioms[word] || extendedIdioms[word] || null;
  if (localData && isComplete(localData)) {
    setCachedIdiom(word, localData);
    saveIdiomToDB(word, localData).catch(() => {}); // 异步写入DB，不阻塞
    return localData;
  }

  // Layer 3: 并行爬取 7 个网络源
  const scrapers = [
    scrapeFromBaiduHanyu(word),
    scrapeFromZdic(word),
    scrapeFromHwxnet(word),
    scrapeFromQianp(word),
    scrapeFromHttpcn(word),
    scrapeFromChazidian(word),
    scrapeFromQianwanku(word),
  ];

  const results = await Promise.allSettled(scrapers);
  const successResults = results
    .filter(
      (r): r is PromiseFulfilledResult<Idiom | null> =>
        r.status === "fulfilled"
    )
    .map((r) => r.value);

  // 将本地数据也加入合并列表
  if (localData) successResults.unshift(localData);

  // 合并所有来源的结果
  const merged = mergeIdiomData(successResults);
  if (merged) {
    setCachedIdiom(word, merged);
    saveIdiomToDB(word, merged).catch(() => {}); // 异步写入DB
    return merged;
  }

  // 兜底
  if (localData) return localData;

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
