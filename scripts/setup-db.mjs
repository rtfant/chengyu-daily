#!/usr/bin/env node

/**
 * 数据库初始化脚本
 *
 * 用法：
 *   DATABASE_URL="postgresql://..." node scripts/setup-db.mjs
 *
 * 功能：
 *   1. 创建 idioms 表（如果不存在）
 *   2. 显示当前数据库状态
 */

import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("错误: 请设置 DATABASE_URL 环境变量");
  console.error(
    '示例: DATABASE_URL="postgresql://user:pass@host/db" node scripts/setup-db.mjs'
  );
  process.exit(1);
}

const sql = neon(DATABASE_URL);

console.log("正在连接 Neon 数据库...");

// 创建表
await sql`
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

console.log("数据表创建成功！");

// 查看状态
const rows = await sql`
  SELECT
    COUNT(*)::int AS total,
    COUNT(*) FILTER (WHERE served = TRUE)::int AS served
  FROM idioms
`;

const { total, served } = rows[0];
console.log(`当前数据库状态: ${total} 条成语已缓存, ${served} 条已使用`);
console.log("数据库初始化完成！");
