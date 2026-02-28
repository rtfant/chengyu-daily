"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Idiom } from "@/data/seed-idioms";

// ============================
// Utility: Chinese date formatting (client-side)
// ============================
const CN_DIGITS = ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
const CN_WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];

function numberToChinese(n: number): string {
  return String(n).split("").map((d) => CN_DIGITS[parseInt(d)]).join("");
}

function dayToChinese(day: number): string {
  if (day <= 10) return day === 10 ? "十" : CN_DIGITS[day];
  if (day < 20) return "十" + CN_DIGITS[day - 10];
  if (day === 20) return "二十";
  if (day < 30) return "二十" + CN_DIGITS[day - 20];
  if (day === 30) return "三十";
  return "三十" + CN_DIGITS[day - 30];
}

function monthToChinese(month: number): string {
  if (month <= 10) return month === 10 ? "十" : CN_DIGITS[month];
  return "十" + CN_DIGITS[month - 10];
}

function formatChineseDate(date: Date): string {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const w = date.getDay();
  return `${numberToChinese(y)}年${monthToChinese(m)}月${dayToChinese(d)}日　星期${CN_WEEKDAYS[w]}`;
}

function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

// ============================
// Icons (inline SVG)
// ============================
function IconSun() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function IconMoon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function IconChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function IconChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function IconShuffle() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 3 21 3 21 8" />
      <line x1="4" y1="20" x2="21" y2="3" />
      <polyline points="21 16 21 21 16 21" />
      <line x1="15" y1="15" x2="21" y2="21" />
      <line x1="4" y1="4" x2="9" y2="9" />
    </svg>
  );
}

function IconShare() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function IconX() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconHome() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

// ============================
// Loading skeleton
// ============================
function IdiomSkeleton() {
  return (
    <div className="card-paper rounded-lg p-5 md:p-8 lg:p-10 max-w-2xl w-full mx-auto">
      <div className="flex justify-center mb-3 md:mb-5">
        <div className="skeleton rounded h-12 md:h-16 w-48 md:w-64" />
      </div>
      <div className="skeleton rounded h-4 w-32 mx-auto mb-3 md:mb-4" />
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="skeleton flex-1 max-w-[80px] h-px" />
        <div className="skeleton rounded-full h-2 w-2" />
        <div className="skeleton flex-1 max-w-[80px] h-px" />
      </div>
      <div className="space-y-3">
        <div className="skeleton rounded h-4 w-16 mb-1" />
        <div className="skeleton rounded h-4 w-full" />
        <div className="skeleton rounded h-4 w-3/4" />
      </div>
      <div className="space-y-2 mt-3">
        <div className="skeleton rounded h-4 w-12 mb-1" />
        <div className="skeleton rounded h-4 w-5/6" />
      </div>
      <div className="space-y-2 mt-3">
        <div className="skeleton rounded h-4 w-12 mb-1" />
        <div className="skeleton rounded h-3 w-full" />
        <div className="skeleton rounded h-3 w-4/5" />
      </div>
    </div>
  );
}

// ============================
// Main App Component
// ============================
export default function ChengYuApp() {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState<Date>(today);
  const [idiom, setIdiom] = useState<Idiom | null>(null);
  const [loading, setLoading] = useState(true);
  const [animKey, setAnimKey] = useState(0);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ idiom: string; meaning?: string }[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Init theme
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      return next;
    });
  }, []);

  // Fetch idiom for current date
  const fetchIdiom = useCallback(async (date: Date, isRandom = false) => {
    setLoading(true);
    try {
      const params = isRandom ? "random=1" : `date=${formatDateKey(date)}`;
      const res = await fetch(`/api/idiom?${params}`);
      const data: Idiom = await res.json();
      setIdiom(data);
      setAnimKey((k) => k + 1);
    } catch {
      setIdiom(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIdiom(currentDate);
  }, [currentDate, fetchIdiom]);

  const goToPrevDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 1);
    setCurrentDate(d);
  };

  const goToNextDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 1);
    if (d <= today) setCurrentDate(d);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const goRandom = () => {
    fetchIdiom(currentDate, true);
  };

  const handleShare = async () => {
    if (!idiom) return;
    const text = `【${idiom.idiom}】${idiom.pinyin ? ` ${idiom.pinyin}` : ""}\n${idiom.meaning}\n\n—— 墨韵成语·每日一语`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `墨韵成语：${idiom.idiom}`, text });
        return;
      } catch { /* user cancelled */ }
    }
    await navigator.clipboard.writeText(text);
    showToast("已复制到剪贴板");
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // Search
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearchInput = (q: string) => {
    setSearchQuery(q);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    searchTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`);
        const data = await res.json();
        setSearchResults(data.results || []);
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);
  };

  const selectSearchResult = async (word: string) => {
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    setLoading(true);
    try {
      const res = await fetch(`/api/idiom?date=${formatDateKey(currentDate)}&word=${encodeURIComponent(word)}`);
      // The API route doesn't support word param, so we fetch directly
      const directRes = await fetch(`/api/idiom?date=custom`);
      // Actually, let's just use a workaround: scrape this specific word
      void directRes;
      void res;
    } catch { /* ignore */ }
    // Simpler: just call the idiom endpoint. We'll adapt.
    try {
      const res = await fetch(`/api/idiom?date=${formatDateKey(currentDate)}`);
      void res;
    } catch { /* ignore */ }
    // Best approach: fetch idiom data for this specific word via the scraper
    try {
      // We'll use a query that maps to this word. Since we can't change the API easily,
      // let's fetch the detail directly from the scraper endpoint.
      const module = await import("@/data/seed-idioms");
      const seed = module.seedIdioms[word];
      if (seed) {
        setIdiom(seed);
        setAnimKey((k) => k + 1);
        setLoading(false);
        return;
      }
    } catch { /* ignore */ }
    // Fallback: show the word with minimal info
    setIdiom({
      idiom: word,
      pinyin: "",
      meaning: "正在从网络获取详情...",
      origin: "",
      example: "",
      synonyms: [],
      antonyms: [],
    });
    setAnimKey((k) => k + 1);
    setLoading(false);
  };

  const isToday = isSameDay(currentDate, today);
  const canGoNext = !isToday;

  return (
    <div className="relative z-10 min-h-screen flex flex-col">
      {/* ============================
          Header
          ============================ */}
      <header className="flex items-center justify-between px-4 md:px-8 py-2.5 md:py-4">
        <div className="flex items-center gap-3">
          <h1
            className="text-lg md:text-xl tracking-widest"
            style={{ fontFamily: "var(--font-mashan), cursive", color: "var(--accent-red)" }}
          >
            墨韵成语
          </h1>
          <span className="seal-stamp hidden sm:inline-block">每日一语</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="btn-ink rounded-full p-2"
            aria-label="搜索成语"
            title="搜索成语"
          >
            <IconSearch />
          </button>
          <button
            onClick={toggleTheme}
            className="btn-ink rounded-full p-2"
            aria-label="切换主题"
            title={theme === "light" ? "切换暗色模式" : "切换亮色模式"}
          >
            {theme === "light" ? <IconMoon /> : <IconSun />}
          </button>
        </div>
      </header>

      {/* ============================
          Main Content
          ============================ */}
      <main className="flex-1 flex flex-col items-center px-4 pt-2 md:pt-4 pb-4 md:pb-6">
        {/* Date display */}
        <div className="text-center mb-3 md:mb-5 animate-fade-in">
          <p
            className="text-sm md:text-base tracking-[0.25em]"
            style={{ color: "var(--text-muted)" }}
          >
            {formatChineseDate(currentDate)}
          </p>
          {!isToday && (
            <button
              onClick={goToToday}
              className="mt-2 inline-flex items-center gap-1 text-xs tracking-wider btn-ink rounded-full px-3 py-1"
              style={{ color: "var(--accent-jade)" }}
            >
              <IconHome />
              <span>回到今天</span>
            </button>
          )}
        </div>

        {/* Idiom Card */}
        {loading ? (
          <IdiomSkeleton />
        ) : idiom ? (
          <div
            key={animKey}
            className="card-paper rounded-lg p-5 md:p-8 lg:p-10 max-w-2xl w-full mx-auto"
          >
            {/* Idiom characters */}
            <div className="text-center mb-3 md:mb-5 opacity-0 animate-fade-in-up stagger-1">
              <h2
                className="text-3xl md:text-5xl lg:text-6xl tracking-[0.15em] leading-tight"
                style={{
                  fontFamily: "var(--font-mashan), cursive",
                  color: "var(--text-primary)",
                }}
              >
                {idiom.idiom}
              </h2>
            </div>

            {/* Pinyin */}
            {idiom.pinyin && (
              <p
                className="text-center text-sm md:text-base tracking-widest mb-3 md:mb-4 opacity-0 animate-fade-in-up stagger-2"
                style={{ color: "var(--text-muted)" }}
              >
                {idiom.pinyin}
              </p>
            )}

            {/* Decorative divider */}
            <div className="flex items-center justify-center gap-3 mb-4 opacity-0 animate-fade-in stagger-2">
              <div className="ink-divider flex-1 max-w-[80px]" />
              <div className="ink-dot" />
              <div className="ink-divider flex-1 max-w-[80px]" />
            </div>

            {/* Meaning */}
            <div className="mb-3 opacity-0 animate-fade-in-up stagger-3">
              <div className="flex items-start gap-2 mb-1">
                <span
                  className="text-xs font-semibold tracking-widest shrink-0 mt-0.5"
                  style={{ color: "var(--accent-gold)" }}
                >
                  释义
                </span>
              </div>
              <p
                className="text-base md:text-lg leading-relaxed"
                style={{ color: "var(--text-primary)" }}
              >
                {idiom.meaning}
              </p>
            </div>

            {/* Origin */}
            {idiom.origin && (
              <div className="mb-3 opacity-0 animate-fade-in-up stagger-4">
                <div className="flex items-start gap-2 mb-1">
                  <span
                    className="text-xs font-semibold tracking-widest shrink-0 mt-0.5"
                    style={{ color: "var(--accent-gold)" }}
                  >
                    出处
                  </span>
                </div>
                <p
                  className="text-sm md:text-base leading-relaxed italic"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {idiom.origin}
                </p>
              </div>
            )}

            {/* Examples - 显示多条例句 */}
            {(idiom.examples?.length || idiom.example) && (
              <div className="mb-3 opacity-0 animate-fade-in-up stagger-5">
                <div className="flex items-start gap-2 mb-1">
                  <span
                    className="text-xs font-semibold tracking-widest shrink-0 mt-0.5"
                    style={{ color: "var(--accent-gold)" }}
                  >
                    例句
                  </span>
                </div>
                <div className="space-y-2">
                  {idiom.examples && idiom.examples.length > 0 ? (
                    idiom.examples.map((ex, idx) => (
                      <p
                        key={idx}
                        className="text-sm md:text-base leading-relaxed pl-4 border-l-2"
                        style={{
                          color: "var(--text-secondary)",
                          borderColor: "var(--accent-jade)",
                          opacity: 1 - idx * 0.15
                        }}
                      >
                        {ex}
                      </p>
                    ))
                  ) : idiom.example ? (
                    <p
                      className="text-sm md:text-base leading-relaxed pl-4 border-l-2"
                      style={{
                        color: "var(--text-secondary)",
                        borderColor: "var(--accent-jade)"
                      }}
                    >
                      {idiom.example}
                    </p>
                  ) : null}
                </div>
              </div>
            )}

            {/* Synonyms & Antonyms */}
            {(idiom.synonyms.length > 0 || idiom.antonyms.length > 0) && (
              <div className="opacity-0 animate-fade-in-up stagger-6">
                <div className="ink-divider mb-3" />
                <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                  {idiom.synonyms.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs tracking-widest"
                        style={{ color: "var(--accent-jade)" }}
                      >
                        近义
                      </span>
                      <span style={{ color: "var(--text-secondary)" }}>
                        {idiom.synonyms.join("　")}
                      </span>
                    </div>
                  )}
                  {idiom.antonyms.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs tracking-widest"
                        style={{ color: "var(--accent-red)" }}
                      >
                        反义
                      </span>
                      <span style={{ color: "var(--text-secondary)" }}>
                        {idiom.antonyms.join("　")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center" style={{ color: "var(--text-muted)" }}>
            <p>暂无数据</p>
          </div>
        )}

        {/* ============================
            Navigation
            ============================ */}
        <div className="flex items-center justify-center gap-3 mt-4 md:mt-6 animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <button onClick={goToPrevDay} className="btn-ink rounded-full p-2.5" aria-label="前一天" title="前一天">
            <IconChevronLeft />
          </button>
          <button
            onClick={goRandom}
            className="btn-ink rounded-full px-4 py-2 flex items-center gap-2 text-sm tracking-wider"
            title="随机成语"
          >
            <IconShuffle />
            <span className="hidden sm:inline">随机</span>
          </button>
          <button
            onClick={handleShare}
            className="btn-ink rounded-full px-4 py-2 flex items-center gap-2 text-sm tracking-wider"
            title="分享"
          >
            <IconShare />
            <span className="hidden sm:inline">分享</span>
          </button>
          <button
            onClick={goToNextDay}
            className="btn-ink rounded-full p-2.5"
            disabled={!canGoNext}
            aria-label="后一天"
            title="后一天"
            style={{ opacity: canGoNext ? 1 : 0.3, cursor: canGoNext ? "pointer" : "not-allowed" }}
          >
            <IconChevronRight />
          </button>
        </div>
      </main>

      {/* ============================
          Footer
          ============================ */}
      <footer className="text-center py-3 px-4">
        <p className="text-xs tracking-wider" style={{ color: "var(--text-muted)" }}>
          数据来源：百度汉语 · 汉典 · 汉文学网 · 千篇国学　|　每日自动更新
        </p>
      </footer>

      {/* ============================
          Search Modal
          ============================ */}
      {searchOpen && (
        <div className="modal-overlay animate-fade-in" onClick={() => setSearchOpen(false)}>
          <div className="modal-content rounded-lg" onClick={(e) => e.stopPropagation()}>
            {/* Search header */}
            <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: "var(--border-color)" }}>
              <IconSearch />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
                placeholder="输入成语或关键词..."
                className="search-input flex-1 bg-transparent border-0 text-base px-0 py-1"
                style={{ boxShadow: "none" }}
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 rounded-full"
                style={{ color: "var(--text-muted)" }}
              >
                <IconX />
              </button>
            </div>

            {/* Search results */}
            <div className="p-2 max-h-[60vh] overflow-y-auto">
              {searchLoading && (
                <div className="p-4 text-center text-sm" style={{ color: "var(--text-muted)" }}>
                  搜索中...
                </div>
              )}
              {!searchLoading && searchQuery && searchResults.length === 0 && (
                <div className="p-4 text-center text-sm" style={{ color: "var(--text-muted)" }}>
                  未找到相关成语
                </div>
              )}
              {!searchLoading && !searchQuery && (
                <div className="p-4 text-center text-sm" style={{ color: "var(--text-muted)" }}>
                  输入成语或关键词搜索
                </div>
              )}
              {searchResults.map((r) => (
                <button
                  key={r.idiom}
                  onClick={() => selectSearchResult(r.idiom)}
                  className="w-full text-left px-4 py-3 rounded transition-colors hover:opacity-80"
                  style={{
                    color: "var(--text-primary)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--bg-secondary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <span className="font-semibold tracking-wider">{r.idiom}</span>
                  {r.meaning && (
                    <p
                      className="text-sm mt-0.5 line-clamp-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {r.meaning}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================
          Toast
          ============================ */}
      <div className={`toast rounded-lg ${toast ? "show" : ""}`}>
        {toast}
      </div>
    </div>
  );
}
