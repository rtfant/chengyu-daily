import { Idiom } from "@/data/seed-idioms";
import cacheData from "@/data/idiom-cache.json";

// 静态缓存：从预爬取的 JSON 文件加载（随部署持久化）
const staticCache = cacheData as unknown as Record<string, Idiom>;

// 运行时内存缓存（在 Vercel 热实例中持久化，冷启动后重置）
const memoryCache = new Map<string, Idiom>();

/**
 * 获取缓存的成语数据
 * 优先级：内存缓存 > 静态 JSON 缓存
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
    totalUnique: new Set([...memoryCache.keys(), ...Object.keys(staticCache)]).size,
  };
}
