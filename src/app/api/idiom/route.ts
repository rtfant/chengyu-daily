import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { fetchIdiom } from "@/lib/scraper";
import { getIdiomForDate } from "@/lib/utils";
import { idiomIndex } from "@/data/seed-idioms";
import {
  shouldAutoCrawl,
  shouldRecrawl,
  resetForRecrawl,
  markServed,
} from "@/lib/cache";

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

  // 标记该成语已被使用
  markServed(word);

  // 检查是否需要重新爬取整轮（3000 条快用完时，剩余 < 300 自动触发新一轮）
  if (shouldRecrawl()) {
    resetForRecrawl();
    // 重置后触发新一轮全量爬取
    const origin = new URL(request.url).origin;
    after(async () => {
      try {
        await fetch(`${origin}/api/cron/crawl?round=0`, {
          signal: AbortSignal.timeout(55000),
        });
      } catch {}
    });
  } else if (shouldAutoCrawl()) {
    // 还有未缓存的成语 → 触发链式爬取，一次性爬完所有 3000+
    const origin = new URL(request.url).origin;
    after(async () => {
      try {
        await fetch(`${origin}/api/cron/crawl?round=0`, {
          signal: AbortSignal.timeout(55000),
        });
      } catch {}
    });
  }

  return NextResponse.json(idiom);
}
