import { Idiom } from "@/data/seed-idioms";

/**
 * 轻量内存缓存层
 *
 * 作用：在同一个 Vercel 热实例内提供瞬时响应（< 1ms）
 * 数据库（Neon）是真正的持久化存储层，本层仅作加速。
 * 冷启动后内存缓存为空，会从数据库重新加载。
 */

const g = globalThis as unknown as {
  __idiomCache?: Map<string, Idiom>;
};
if (!g.__idiomCache) {
  g.__idiomCache = new Map<string, Idiom>();
}
const memoryCache = g.__idiomCache;

/**
 * 从内存缓存获取成语
 */
export function getCachedIdiom(word: string): Idiom | null {
  return memoryCache.get(word) || null;
}

/**
 * 写入内存缓存
 */
export function setCachedIdiom(word: string, data: Idiom): void {
  memoryCache.set(word, data);
}

/**
 * 内存缓存大小
 */
export function getMemoryCacheSize(): number {
  return memoryCache.size;
}
