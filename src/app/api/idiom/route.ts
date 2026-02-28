import { NextRequest, NextResponse } from "next/server";
import { fetchIdiom } from "@/lib/scraper";
import { getIdiomForDate } from "@/lib/utils";
import { idiomIndex } from "@/data/seed-idioms";

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
  return NextResponse.json(idiom);
}
