import { neon } from "@neondatabase/serverless";
import { Idiom, idiomIndex, seedIdioms } from "@/data/seed-idioms";
import { extendedIdioms } from "@/data/extended-idioms";

// ============================================================
// Neon 数据库连接（HTTP 模式，每次请求独立连接，适合 Serverless）
// ============================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;
let _sql: ReturnType<typeof neon> | null = null;
let _initialized = false;

function getSQL(): ReturnType<typeof neon> | null {
  if (!process.env.DATABASE_URL) return null;
  if (!_sql) {
    _sql = neon(process.env.DATABASE_URL);
  }
  return _sql;
}

/**
 * 执行查询并返回行数组（处理 Neon 驱动的复杂类型）
 */
async function query(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Promise<Row[]> {
  const sql = getSQL();
  if (!sql) return [];
  const result = await sql(strings, ...values);
  return result as unknown as Row[];
}

/**
 * 自动建表（幂等操作，每个实例只执行一次）
 */
async function ensureTable(): Promise<boolean> {
  if (_initialized) return true;
  if (!getSQL()) return false;

  try {
    await query`
      CREATE TABLE IF NOT EXISTS idioms (
        word        TEXT PRIMARY KEY,
        pinyin      TEXT NOT NULL DEFAULT '',
        meaning     TEXT NOT NULL DEFAULT '',
        origin      TEXT NOT NULL DEFAULT '',
        example     TEXT NOT NULL DEFAULT '',
        examples    JSONB DEFAULT '[]'::jsonb,
        usage_info  TEXT DEFAULT '',
        synonyms    JSONB DEFAULT '[]'::jsonb,
        antonyms    JSONB DEFAULT '[]'::jsonb,
        served      BOOLEAN DEFAULT FALSE,
        created_at  TIMESTAMPTZ DEFAULT NOW(),
        updated_at  TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    
    // 创建索引加速查询
    await query`CREATE INDEX IF NOT EXISTS idx_idioms_served ON idioms(served)`;
    
    _initialized = true;
    return true;
  } catch (e) {
    console.error("[DB] ensureTable failed:", e);
    return false;
  }
}

// ============================================================
// 数据转换
// ============================================================

interface DBRow {
  word: string;
  pinyin: string;
  meaning: string;
  origin: string;
  example: string;
  examples: string[];
  usage_info: string;
  synonyms: string[];
  antonyms: string[];
  served: boolean;
}

function rowToIdiom(row: DBRow): Idiom {
  return {
    idiom: row.word,
    pinyin: row.pinyin,
    meaning: row.meaning,
    origin: row.origin,
    example: row.example,
    examples: row.examples || [],
    usage: row.usage_info || undefined,
    synonyms: row.synonyms || [],
    antonyms: row.antonyms || [],
  };
}

// ============================================================
// CRUD 操作
// ============================================================

/**
 * 从数据库获取成语数据
 */
export async function getIdiomFromDB(word: string): Promise<Idiom | null> {
  const ok = await ensureTable();
  if (!ok) return null;

  try {
    const rows = await query`SELECT * FROM idioms WHERE word = ${word}`;
    if (rows.length === 0) return null;
    return rowToIdiom(rows[0] as DBRow);
  } catch (e) {
    console.error("[DB] getIdiomFromDB failed:", e);
    return null;
  }
}

/**
 * 保存成语数据到数据库（UPSERT：存在则更新，不存在则插入）
 */
export async function saveIdiomToDB(
  word: string,
  data: Idiom
): Promise<boolean> {
  const ok = await ensureTable();
  if (!ok) return false;

  try {
    const examplesJson = JSON.stringify(data.examples || []);
    const synonymsJson = JSON.stringify(data.synonyms || []);
    const antonymsJson = JSON.stringify(data.antonyms || []);

    await query`
      INSERT INTO idioms (word, pinyin, meaning, origin, example, examples, usage_info, synonyms, antonyms, updated_at)
      VALUES (
        ${word},
        ${data.pinyin || ""},
        ${data.meaning || ""},
        ${data.origin || ""},
        ${data.example || ""},
        ${examplesJson}::jsonb,
        ${data.usage || ""},
        ${synonymsJson}::jsonb,
        ${antonymsJson}::jsonb,
        NOW()
      )
      ON CONFLICT (word) DO UPDATE SET
        pinyin = EXCLUDED.pinyin,
        meaning = EXCLUDED.meaning,
        origin = EXCLUDED.origin,
        example = EXCLUDED.example,
        examples = EXCLUDED.examples,
        usage_info = EXCLUDED.usage_info,
        synonyms = EXCLUDED.synonyms,
        antonyms = EXCLUDED.antonyms,
        updated_at = NOW()
    `;
    return true;
  } catch (e) {
    console.error("[DB] saveIdiomToDB failed:", e);
    return false;
  }
}

/**
 * 标记成语已被用户访问
 */
export async function markServedInDB(word: string): Promise<void> {
  const ok = await ensureTable();
  if (!ok) return;

  try {
    await query`UPDATE idioms SET served = TRUE WHERE word = ${word}`;
  } catch (e) {
    console.error("[DB] markServedInDB failed:", e);
  }
}

// ============================================================
// 统计与查询
// ============================================================

/**
 * 获取数据库缓存统计
 */
export async function getDBStats(): Promise<{
  totalIdioms: number;
  cached: number;
  uncached: number;
  served: number;
  unserved: number;
} | null> {
  const ok = await ensureTable();
  if (!ok) return null;

  try {
    const rows = await query`
      SELECT
        COUNT(*)::int AS cached,
        COUNT(*) FILTER (WHERE served = TRUE)::int AS served
      FROM idioms
    `;
    const { cached, served } = rows[0] as {
      cached: number;
      served: number;
    };
    return {
      totalIdioms: idiomIndex.length,
      cached,
      uncached: idiomIndex.length - cached,
      served,
      unserved: cached - served,
    };
  } catch (e) {
    console.error("[DB] getDBStats failed:", e);
    return null;
  }
}

/**
 * 获取未缓存的成语数量（快速统计，不返回列表）
 */
export async function getUncachedCount(): Promise<number> {
  const ok = await ensureTable();
  if (!ok) return idiomIndex.length;

  try {
    const rows = await query`SELECT COUNT(*)::int AS count FROM idioms`;
    const cached = (rows[0] as { count: number }).count;
    return idiomIndex.length - cached;
  } catch (e) {
    console.error("[DB] getUncachedCount failed:", e);
    return idiomIndex.length;
  }
}

/**
 * 获取未缓存的成语列表（不在数据库中的）
 * 优化：使用 NOT IN 子查询，避免全表扫描
 */
export async function getUncachedWords(): Promise<string[]> {
  const ok = await ensureTable();
  if (!ok) return idiomIndex;

  try {
    const rows = await query`SELECT word FROM idioms`;
    const cachedSet = new Set(rows.map((r) => r.word as string));
    return idiomIndex.filter((w) => !cachedSet.has(w));
  } catch (e) {
    console.error("[DB] getUncachedWords failed:", e);
    return idiomIndex;
  }
}

/**
 * 检查是否需要重新爬取整轮
 * 条件：全部已缓存 且 未使用的 <= 300 条
 */
export async function shouldRecrawlDB(): Promise<boolean> {
  const stats = await getDBStats();
  if (!stats) return false;
  // 还没缓存完，不需要重爬
  if (stats.uncached > 0) return false;
  // 全部缓存完毕，且未使用的 <= 300 → 触发重爬
  return stats.unserved <= 300;
}

/**
 * 重置整个缓存，准备新一轮爬取
 * 删除所有记录，让爬取器重新抓取最新数据
 */
export async function resetForRecrawlDB(): Promise<void> {
  const ok = await ensureTable();
  if (!ok) return;

  try {
    await query`DELETE FROM idioms`;
    console.log("[DB] Cache cleared for recrawl");
  } catch (e) {
    console.error("[DB] resetForRecrawlDB failed:", e);
  }
}

// ============================================================
// 种子数据初始化
// ============================================================

/**
 * 批量获取随机成语（从数据库中随机抽取）
 */
export async function getRandomIdiomsFromDB(
  count: number = 10
): Promise<Idiom[]> {
  const ok = await ensureTable();
  if (!ok) return [];

  try {
    const rows = await query`
      SELECT * FROM idioms 
      ORDER BY RANDOM() 
      LIMIT ${count}
    `;
    return rows.map((r) => rowToIdiom(r as DBRow));
  } catch (e) {
    console.error("[DB] getRandomIdiomsFromDB failed:", e);
    return [];
  }
}

/**
 * 将本地种子数据批量写入数据库（仅在数据库为空时执行）
 */
export async function seedDatabase(): Promise<number> {
  const ok = await ensureTable();
  if (!ok) return 0;

  try {
    // 检查是否已有数据
    const rows = await query`SELECT COUNT(*)::int AS count FROM idioms`;
    const count = (rows[0] as { count: number }).count;
    if (count > 0) return count; // 已有数据，跳过

    // 收集所有种子数据
    const allSeeds: [string, Idiom][] = [
      ...Object.entries(seedIdioms),
      ...Object.entries(extendedIdioms),
    ];

    // 批量写入（每批 20 个并行）
    const BATCH = 20;
    let inserted = 0;
    for (let i = 0; i < allSeeds.length; i += BATCH) {
      const batch = allSeeds.slice(i, i + BATCH);
      await Promise.all(
        batch.map(async ([word, data]) => {
          const ok = await saveIdiomToDB(word, data);
          if (ok) inserted++;
        })
      );
    }

    console.log(`[DB] Seeded ${inserted} idioms from local data`);
    return inserted;
  } catch (e) {
    console.error("[DB] seedDatabase failed:", e);
    return 0;
  }
}
