import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { fetchIdiom } from "@/lib/scraper";
import { getIdiomForDate } from "@/lib/utils";
import {
  getCacheStats,
  getUncachedIdioms,
  setCrawlInProgress,
} from "@/lib/cache";
import { idiomIndex } from "@/data/seed-idioms";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// 安全上限：最多链式调用 600 轮（600 × 5 = 3000 条）
const MAX_ROUNDS = 600;

/**
 * 自链式批量爬取端点
 *
 * 工作方式：
 *   1. 一次触发 → 在本轮函数内尽量多地爬取未缓存成语
 *   2. 如果还有未缓存成语 → 用 after() 自动触发下一轮
 *   3. 链式执行，直到全部 3000+ 条缓存完毕
 *
 * 这意味着一次 Cron 触发（或一次用户请求触发）就能自动完成全部 3000 条的爬取。
 *
 * 模式：
 *   GET /api/cron/crawl              → 自动链式爬取所有未缓存成语
 *   GET /api/cron/crawl?mode=index   → 按偏移量爬取（供本地脚本）
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode");
  const round = parseInt(searchParams.get("round") || "0");

  // 模式 A：按偏移量批量爬取（供本地脚本）
  if (mode === "index") {
    const offset = parseInt(searchParams.get("offset") || "0");
    const batch = parseInt(searchParams.get("batch") || "10");
    const words = idiomIndex.slice(offset, offset + batch);
    const crawled: Record<string, unknown> = {};
    const errors: string[] = [];

    await Promise.allSettled(
      words.map(async (word) => {
        try {
          const data = await fetchIdiom(word);
          if (
            data.meaning &&
            data.meaning !== "暂未获取到释义，请稍后再试。"
          ) {
            crawled[word] = data;
          } else {
            errors.push(word);
          }
        } catch {
          errors.push(word);
        }
      })
    );

    return NextResponse.json({
      mode: "index",
      offset,
      batch: words.length,
      total: idiomIndex.length,
      success: Object.keys(crawled).length,
      errors: errors.length,
      cache: getCacheStats(),
      data: crawled,
    });
  }

  // 模式 B（默认）：自链式爬取全部未缓存成语
  setCrawlInProgress(true);
  const startTime = Date.now();
  const TIME_LIMIT = 50000; // 50 秒（留余量给响应和链式触发）
  let successCount = 0;
  let errorCount = 0;

  try {
    // 收集未来 30 天的成语（高优先级）
    const today = new Date();
    const upcomingWords = new Set<string>();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      upcomingWords.add(getIdiomForDate(date));
    }

    // 获取所有未缓存成语，优先爬取即将展示的
    const uncached = getUncachedIdioms();
    const prioritized = [
      ...uncached.filter((w) => upcomingWords.has(w)),
      ...uncached.filter((w) => !upcomingWords.has(w)),
    ];

    // 每批 5 个并行爬取，持续到时间用完
    const BATCH_SIZE = 5;
    for (let i = 0; i < prioritized.length; i += BATCH_SIZE) {
      if (Date.now() - startTime > TIME_LIMIT) break;

      const batchWords = prioritized.slice(i, i + BATCH_SIZE);
      const results = await Promise.allSettled(
        batchWords.map(async (word) => {
          try {
            const data = await fetchIdiom(word);
            if (
              data.meaning &&
              data.meaning !== "暂未获取到释义，请稍后再试。"
            ) {
              return true;
            }
            return false;
          } catch {
            return false;
          }
        })
      );

      for (const r of results) {
        if (r.status === "fulfilled" && r.value) {
          successCount++;
        } else {
          errorCount++;
        }
      }
    }
  } finally {
    setCrawlInProgress(false);
  }

  // 自链式续爬：如果还有未缓存成语，自动触发下一轮
  const remaining = getUncachedIdioms().length;
  if (remaining > 0 && round < MAX_ROUNDS) {
    const origin = new URL(request.url).origin;
    after(async () => {
      try {
        await fetch(`${origin}/api/cron/crawl?round=${round + 1}`, {
          signal: AbortSignal.timeout(55000),
        });
      } catch {
        // 链式调用失败不影响已缓存的数据
      }
    });
  }

  return NextResponse.json({
    mode: "auto-chain",
    round,
    success: successCount,
    errors: errorCount,
    remaining,
    timeUsed: `${((Date.now() - startTime) / 1000).toFixed(1)}s`,
    cache: getCacheStats(),
  });
}
