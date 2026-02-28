import { Idiom, idiomIndex, seedIdioms } from "@/data/seed-idioms";
import { extendedIdioms } from "@/data/extended-idioms";
import cacheData from "@/data/idiom-cache.json";

// 静态缓存：从预爬取的 JSON 文件加载（随部署持久化）
const staticCache = cacheData as unknown as Record<string, Idiom>;

// 使用 globalThis 让内存缓存在 Vercel 热实例间持久化（冷启动后重置）
const g = globalThis as unknown as {
  __idiomCache?: Map<string, Idiom>;
  __servedSet?: Set<string>;
  __crawlInProgress?: boolean;
  __lastCrawlTime?: number;
};
if (!g.__idiomCache) {
  g.__idiomCache = new Map<string, Idiom>();
}
if (!g.__servedSet) {
  g.__servedSet = new Set<string>();
}
const memoryCache = g.__idiomCache;
const servedSet = g.__servedSet;

// 冷启动时自动从本地种子数据预填充内存缓存
function autoSeed() {
  for (const [word, data] of Object.entries(seedIdioms)) {
    if (!memoryCache.has(word)) memoryCache.set(word, data);
  }
  for (const [word, data] of Object.entries(extendedIdioms)) {
    if (!memoryCache.has(word)) memoryCache.set(word, data);
  }
  for (const [word, data] of Object.entries(staticCache)) {
    if (!memoryCache.has(word)) memoryCache.set(word, data as Idiom);
  }
}
autoSeed();

/**
 * 获取缓存的成语数据
 */
export function getCachedIdiom(word: string): Idiom | null {
  return memoryCache.get(word) || staticCache[word] || null;
}

/**
 * 将成语数据写入内存缓存
 */
export function setCachedIdiom(word: string, data: Idiom): void {
  memoryCache.set(word, data);
}

/**
 * 获取缓存统计信息
 */
export function getCacheStats() {
  return {
    memorySize: memoryCache.size,
    staticSize: Object.keys(staticCache).length,
    totalCached: memoryCache.size,
    totalIdioms: idiomIndex.length,
    uncached: idiomIndex.length - memoryCache.size,
    served: servedSet.size,
    unserved: memoryCache.size - servedSet.size,
  };
}

/**
 * 获取尚未缓存的成语列表
 */
export function getUncachedIdioms(): string[] {
  return idiomIndex.filter((word) => !memoryCache.has(word));
}

/**
 * 标记成语已被用户访问过
 */
export function markServed(word: string): void {
  servedSet.add(word);
}

/**
 * 判断是否需要重新爬取整轮（所有 3000 条都已使用，或剩余未使用 < 300）
 * 条件：全部缓存完毕 且 未使用的不足 300 条
 */
export function shouldRecrawl(): boolean {
  const uncached = getUncachedIdioms().length;
  if (uncached > 0) return false; // 还没缓存完，不需要重爬
  const unserved = memoryCache.size - servedSet.size;
  return unserved <= 300;
}

/**
 * 重置缓存，准备新一轮爬取
 */
export function resetForRecrawl(): void {
  servedSet.clear();
  memoryCache.clear();
  autoSeed(); // 重新从种子数据预填充
}

/**
 * 判断是否需要触发自动爬取（有未缓存的成语 且 没有正在进行的爬取）
 */
export function shouldAutoCrawl(): boolean {
  if (g.__crawlInProgress) return false;
  return getUncachedIdioms().length > 0;
}

/**
 * 设置爬取状态
 */
export function setCrawlInProgress(inProgress: boolean): void {
  g.__crawlInProgress = inProgress;
  if (inProgress) g.__lastCrawlTime = Date.now();
}
