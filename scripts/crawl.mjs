#!/usr/bin/env node
/**
 * 本地批量爬取脚本 - 爬取所有 3000+ 成语并缓存到 JSON 文件
 *
 * 使用方法：
 *   1. 先启动开发服务器：npm run dev
 *   2. 在另一个终端运行：npm run crawl
 *
 * 特性：
 *   - 增量爬取：自动跳过已缓存的成语
 *   - 断点续爬：每批次自动保存，中断后再次运行即可继续
 *   - 可配置参数：批次大小、延迟时间、服务器端口
 *
 * 环境变量：
 *   PORT=3000        开发服务器端口（默认 3000）
 *   BATCH_SIZE=5     每批爬取数量（默认 5）
 *   BATCH_DELAY=3000 批次间延迟毫秒（默认 3000）
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_FILE = path.join(__dirname, "../src/data/idiom-cache.json");
const PORT = process.env.PORT || "3000";
const API_BASE = `http://localhost:${PORT}/api/cron/crawl`;
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || "5");
const BATCH_DELAY = parseInt(process.env.BATCH_DELAY || "3000");

// 加载已有缓存
let cache = {};
try {
  cache = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
} catch {
  cache = {};
}

function saveCache() {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache));
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  // 先检测开发服务器是否运行
  try {
    const check = await fetch(`http://localhost:${PORT}/`);
    if (!check.ok) throw new Error();
  } catch {
    console.error(`\n  错误：无法连接到 http://localhost:${PORT}`);
    console.error(`  请先在另一个终端运行: npm run dev\n`);
    process.exit(1);
  }

  // 获取 idiomIndex 总数
  const initRes = await fetch(`${API_BASE}?mode=index&offset=0&batch=0`);
  const initData = await initRes.json();
  const total = initData.total;
  const cachedCount = Object.keys(cache).length;

  console.log(`\n  成语总数: ${total}`);
  console.log(`  已缓存:   ${cachedCount}`);
  console.log(`  待爬取:   ~${total - cachedCount}`);
  console.log(`  批次大小: ${BATCH_SIZE}`);
  console.log(`  批次延迟: ${BATCH_DELAY}ms\n`);

  let offset = 0;
  let newCount = 0;
  let errorCount = 0;
  const startTime = Date.now();

  while (offset < total) {
    try {
      const res = await fetch(
        `${API_BASE}?mode=index&offset=${offset}&batch=${BATCH_SIZE}`
      );
      const data = await res.json();

      // 合并到缓存（只覆盖有效数据）
      if (data.data) {
        for (const [word, idiomData] of Object.entries(data.data)) {
          if (!cache[word] || idiomData.meaning !== "暂未获取到释义，请稍后再试。") {
            cache[word] = idiomData;
            newCount++;
          }
        }
      }

      // 保存进度
      saveCache();

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
      const progress = Math.min(offset + data.batch, total);
      const pct = ((progress / total) * 100).toFixed(1);
      errorCount += data.errors || 0;

      process.stdout.write(
        `\r  [${progress}/${total}] ${pct}% | 缓存: ${Object.keys(cache).length} | 新增: ${newCount} | 失败: ${errorCount} | 耗时: ${elapsed}s`
      );

      offset += BATCH_SIZE;

      // 批次间延迟（避免请求过快）
      if (offset < total) {
        await sleep(BATCH_DELAY);
      }
    } catch (err) {
      console.error(`\n  批次错误 (offset=${offset}): ${err.message}`);
      console.log("  等待 5 秒后重试...");
      await sleep(5000);
    }
  }

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n\n  完成！`);
  console.log(`  总缓存: ${Object.keys(cache).length} 条成语`);
  console.log(`  本次新增: ${newCount} 条`);
  console.log(`  总耗时: ${totalTime}s`);
  console.log(`  缓存文件: ${CACHE_FILE}\n`);
  console.log(`  下一步: git add src/data/idiom-cache.json && git commit && git push\n`);
}

main().catch((err) => {
  console.error("爬取失败:", err);
  process.exit(1);
});
