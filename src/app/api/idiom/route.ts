import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { fetchIdiom } from "@/lib/scraper";
import { getIdiomForDate } from "@/lib/utils";
import { idiomIndex } from "@/data/seed-idioms";
import {
  markServedInDB,
  shouldRecrawlDB,
  resetForRecrawlDB,
  getUncachedWords,
  seedDatabase,
} from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const dateStr = searchParams.get("date"); // YYYY-MM-DD
  const random = searchParams.get("random");

  let word: string;

  if (random === "1") {
    const idx = Math.floor(Math.random() * idiomIndex.length);
    word = idiomIndex[idx];
  } else if (dateStr) {
    const date = new Date(dateStr + "T00:00:00");
    if (isNaN(date.getTime())) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }
    word = getIdiomForDate(date);
  } else {
    word = getIdiomForDate(new Date());
  }

  const idiom = await fetchIdiom(word);

  // 异步标记已使用 + 触发后台任务
  after(async () => {
    // 标记已使用
    await markServedInDB(word);

    // 首次访问：如果数据库为空，先写入种子数据
    await seedDatabase();

    // 检查是否需要重爬（3000 条快用完，剩余未使用 < 300）
    const needRecrawl = await shouldRecrawlDB();
    if (needRecrawl) {
      await resetForRecrawlDB();
    }

    // 检查是否有未缓存的成语 → 触发链式爬取
    const uncached = await getUncachedWords();
    if (uncached.length > 0) {
      const origin = new URL(request.url).origin;
      try {
        await fetch(`${origin}/api/cron/crawl?round=0`, {
          signal: AbortSignal.timeout(55000),
        });
      } catch {}
    }
  });

  return NextResponse.json(idiom);
}
