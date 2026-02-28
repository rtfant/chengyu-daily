import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { fetchIdiom } from "@/lib/scraper";
import { getIdiomForDate } from "@/lib/utils";
import { idiomIndex } from "@/data/seed-idioms";
import {
  markServedInDB,
  shouldRecrawlDB,
  resetForRecrawlDB,
  getUncachedCount,
  seedDatabase,
  getRandomIdiomsFromDB,
} from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const dateStr = searchParams.get("date"); // YYYY-MM-DD
  const random = searchParams.get("random");

  // 随机模式：优先从数据库批量获取
  if (random === "1") {
    // 首次访问：确保种子数据已写入
    await seedDatabase();

    const randomIdioms = await getRandomIdiomsFromDB(1);
    if (randomIdioms.length > 0) {
      const idiom = randomIdioms[0];
      const word = idiom.idiom;

      // 异步标记已使用 + 触发后台任务
      after(async () => {
        await markServedInDB(word);

        // 检查是否需要重爬
        const needRecrawl = await shouldRecrawlDB();
        if (needRecrawl) {
          await resetForRecrawlDB();
        }

        // 检查是否有未缓存的成语 → 触发链式爬取
        const uncachedCount = await getUncachedCount();
        if (uncachedCount > 0) {
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

    // 数据库为空，降级到随机选择 + 爬取
    const idx = Math.floor(Math.random() * idiomIndex.length);
    const word = idiomIndex[idx];
    const idiom = await fetchIdiom(word);

    after(async () => {
      await markServedInDB(word);
    });

    return NextResponse.json(idiom);
  }

  // 日期模式或今日成语
  let word: string;
  if (dateStr) {
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
    await markServedInDB(word);
    await seedDatabase();

    const needRecrawl = await shouldRecrawlDB();
    if (needRecrawl) {
      await resetForRecrawlDB();
    }

    const uncachedCount = await getUncachedCount();
    if (uncachedCount > 0) {
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
