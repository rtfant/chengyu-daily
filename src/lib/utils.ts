import { idiomIndex } from "@/data/seed-idioms";

const CN_DIGITS = ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
const CN_WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];

function numberToChinese(n: number): string {
  return String(n)
    .split("")
    .map((d) => CN_DIGITS[parseInt(d)])
    .join("");
}

function dayToChinese(day: number): string {
  if (day <= 10) return (day === 10 ? "十" : CN_DIGITS[day]);
  if (day < 20) return "十" + CN_DIGITS[day - 10];
  if (day === 20) return "二十";
  if (day < 30) return "二十" + CN_DIGITS[day - 20];
  if (day === 30) return "三十";
  return "三十" + CN_DIGITS[day - 30];
}

function monthToChinese(month: number): string {
  if (month <= 10) return (month === 10 ? "十" : CN_DIGITS[month]);
  return "十" + CN_DIGITS[month - 10];
}

export function formatChineseDate(date: Date): string {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const w = date.getDay();
  return `${numberToChinese(y)}年${monthToChinese(m)}月${dayToChinese(d)}日 星期${CN_WEEKDAYS[w]}`;
}

export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Deterministic idiom index for a given date, based on day-of-year + year offset. */
export function getIdiomForDate(date: Date): string {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const yearOffset = date.getFullYear() * 7; // shift each year so it's not the same cycle
  const idx = (dayOfYear + yearOffset) % idiomIndex.length;
  return idiomIndex[idx];
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}
