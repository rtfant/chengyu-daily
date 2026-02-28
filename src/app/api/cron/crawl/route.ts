import { NextRequest, NextResponse } from "next/server";
import { fetchIdiom } from "@/lib/scraper";
import { getIdiomForDate } from "@/lib/utils";
import { getCacheStats } from "@/lib/cache";
import { idiomIndex } from "@/data/seed-idioms";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Vercel Pro 最大 60s，Free 最大 10s

/**
 * 批量爬取成语数据的 Cron 端点
 *
 * 用法：
 *   GET /api/cron/crawl               → 爬取未来 7 天的每日成语
 *   GET /api/cron/crawl?days=30       → 爬取未来 30 天的每日成语
 *   GET /api/cron/crawl?offset=0&batch=10 → 按 idiomIndex 偏移量爬取一批
 *
 * 供 Vercel Cron 或本地脚本调用。
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode"); // "index" = 按偏移量爬取
  const offset = parseInt(searchParams.get("offset") || "0");
  const batch = parseInt(searchParams.get("batch") || "10");
  const days = parseInt(searchParams.get("days") || "7");

  const crawled: Record<string, unknown> = {};
  const errors: string[] = [];

  if (mode === "index") {
    // 模式 A：按 idiomIndex 偏移量批量爬取（供本地脚本使用）
    const words = idiomIndex.slice(offset, offset + batch);

    await Promise.allSettled(
      words.map(async (word) => {
        try {
          const data = await fetchIdiom(word);
          if (data.meaning && data.meaning !== "暂未获取到释义，请稍后再试。") {
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

  // 模式 B（默认）：爬取未来 N 天的每日成语（供 Vercel Cron 使用）
  const today = new Date();
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const word = getIdiomForDate(date);

    try {
      const data = await fetchIdiom(word);
      if (data.meaning && data.meaning !== "暂未获取到释义，请稍后再试。") {
        crawled[word] = data;
      } else {
        errors.push(word);
      }
    } catch {
      errors.push(word);
    }
  }

  return NextResponse.json({
    mode: "days",
    days,
    success: Object.keys(crawled).length,
    errors: errors.length,
    words: Object.keys(crawled),
    cache: getCacheStats(),
  });
}
