import { NextRequest, NextResponse } from "next/server";
import { idiomIndex, seedIdioms } from "@/data/seed-idioms";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  if (!q) {
    return NextResponse.json({ results: [] });
  }

  // Search through idiom index and seed data
  const results: { idiom: string; meaning?: string }[] = [];

  for (const name of idiomIndex) {
    if (results.length >= 20) break;

    if (name.includes(q)) {
      const seed = seedIdioms[name];
      results.push({
        idiom: name,
        meaning: seed?.meaning,
      });
    }
  }

  // Also search by meaning in seed data
  if (results.length < 20) {
    for (const [name, data] of Object.entries(seedIdioms)) {
      if (results.length >= 20) break;
      if (results.some((r) => r.idiom === name)) continue;

      if (data.meaning.includes(q) || data.origin.includes(q)) {
        results.push({
          idiom: name,
          meaning: data.meaning,
        });
      }
    }
  }

  return NextResponse.json({ results });
}
