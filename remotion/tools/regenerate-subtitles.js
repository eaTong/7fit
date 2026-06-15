#!/usr/bin/env node
/**
 * regenerate-subtitles.js
 *
 * 基于 copy.md 自动生成每个 scene 的 subtitles.json（理论时间戳）。
 *
 * 输入：docs/copy/<topic>.md（钩子/主体/收尾 3 个 H2 段的 `>` 引用）
 * 输出：remotion/src/scenes/<topic>/subtitles.json
 *
 * 何时运行：每次修改 copy.md 后（与 regenerate-scenes.js 配对使用）
 *
 * 用法：
 *   cd remotion
 *   node tools/regenerate-subtitles.js                 # 处理所有 copy.md
 *   node tools/regenerate-subtitles.js a2_one_person_50_videos  # 只处理单个
 *
 * 与 regenerate-scenes.js 的关系：
 *   - regenerate-scenes.js → scenes.json（提词器元数据 + 嵌入 HTML）
 *   - regenerate-subtitles.js → <scene>/subtitles.json（Remotion 字幕）
 *   - 两者都从 copy.md 读，输出对位（同一个 id / 同一份 hook+body+closing）
 *
 * 时长算法（v1 简单版）：
 *   - 钩子 3s (抖音硬约束)
 *   - 收尾 7s (默认)
 *   - 段间停顿 0.5s
 *   - 主体总时长 = 预计时长 - 钩子 - 收尾 - 段间停顿
 *   - 各段按字数比分配
 *   - 段内按 句末标点（。！？——）切条
 *   - 单条 ≤ 4s / ≤ 24 字 (timing-sync.md §6.1)
 *
 * 已知限制（v1）：
 *   - 不做 highlight 自动识别（默认 false）—— 由 copy.md `[xxx]` 重点词决定时人工加
 *   - 不处理中速档位差异（统一 3.4 字/秒）—— 未来按 [timing-sync.md §2] 4 档支持
 *   - 不感知录音实际节奏（用户录音 m4a 节奏可能与理论不同）—— 录音后人工校准
 */

const fs = require('fs');
const path = require('path');

const COPY_DIR = path.resolve(__dirname, '../../docs/copy');
const REMOTION_DIR = path.resolve(__dirname, '../src/scenes');

const HOOK_DURATION = 3.0;       // 抖音硬约束
const CLOSING_DURATION = 7.0;    // CLAUDE.md 默认
const SEGMENT_PAUSE = 0.5;       // 段间停顿
const SPEED_DEFAULT = 3.4;       // 中速 字/秒
const SUB_MAX_DURATION = 4.0;    // timing-sync.md §6.1
const SUB_MAX_CHARS = 24;        // timing-sync.md §6.1

const H2_TITLE_RE = /^(钩子|主体|收尾|脚本|旁白|念稿|Hook|Body|Closing|Script|Voiceover)/i;

/**
 * 解析 copy.md：返回 { meta, hook, body, closing, bodySegments, totalDuration }
 */
function parseCopyMd(content, filename) {
  const id = filename.replace(/\.md$/, '');

  const titleMatch = content.match(/^#\s+(.+?)$/m);
  const title = titleMatch ? titleMatch[1].trim() : id;

  const durMatch = content.match(/\*\*预计时长\*\*[：:]\s*~?(\d+(?:\.\d+)?)\s*秒?/);
  const totalDuration = durMatch ? parseFloat(durMatch[1]) : 60.0;

  // 扫 H2 位置
  const h2Regex = /^## (.+)$/gm;
  const positions = [];
  let m;
  while ((m = h2Regex.exec(content)) !== null) {
    positions.push({ title: m[1].trim(), start: m.index });
  }
  for (let i = 0; i < positions.length; i++) {
    positions[i].end = i + 1 < positions.length ? positions[i + 1].start : content.length;
  }

  // 按 H2 提取 `>` 引用行
  const sections = { hook: [], body: [], closing: [] };
  for (const pos of positions) {
    if (!H2_TITLE_RE.test(pos.title)) continue;
    const body = content.slice(pos.start, pos.end);
    const lines = body.split('\n').slice(1)
      .filter(l => /^\s*>/.test(l))
      .map(l => l.replace(/^\s*>\s*/, '').trim())
      .filter(l => l.length > 0);
    if (lines.length === 0) continue;
    if (/钩子|Hook/i.test(pos.title)) sections.hook.push(...lines);
    else if (/收尾|Closing/i.test(pos.title)) sections.closing.push(...lines);
    else if (/主体|Body|脚本|旁白|念稿|Script|Voiceover/i.test(pos.title)) sections.body.push(...lines);
  }

  // 主体段按 [段N·] 标签分组
  const bodySegments = parseBodySegments(sections.body);

  return {
    id, title, totalDuration,
    hook: sections.hook.join(' '),
    bodySegments,
    closing: sections.closing.join(' '),
  };
}

/**
 * 解析主体段：按 [段N·...] 标签分组，段内累积为 rawText
 * 兼容旧格式：无 [段N·] 标签时，每个非空 `>` 引用行 = 一个段
 */
function parseBodySegments(bodyLines) {
  const segments = [];
  let current = null;
  for (const line of bodyLines) {
    const m = line.match(/^\[段(\d+)·([^\]]+)\]\s*(.*)$/);
    if (m) {
      if (current) segments.push(current);
      current = { idx: parseInt(m[1], 10), label: m[2].trim(), text: m[3] || '' };
    } else if (current) {
      current.text += (current.text ? '\n' : '') + line;
    } else {
      // 无 [段N·] 标签（旧格式兼容）：每行 = 一个段
      if (line.trim()) {
        segments.push({ idx: segments.length + 1, label: `段${segments.length + 1}`, text: line });
      }
    }
  }
  if (current) segments.push(current);
  return segments;
}

/**
 * 切句：按 "。" "！" "？" "——" 切分，保留标点
 */
function splitSentences(text) {
  // 移除段标签（保留纯文本）
  const clean = text.replace(/^\[段\d+·[^\]]+\]\s*/, '').trim();
  // 按句末标点切
  const sentences = [];
  const regex = /[^。！？」”』\n]+[。！？」”』]?/g;
  let m;
  while ((m = regex.exec(clean)) !== null) {
    const s = m[0].trim();
    if (s) sentences.push(s);
  }
  return sentences;
}

/**
 * 统计纯字数（不计标点 / 数字 / 英文按 1 字）
 */
function countChars(s) {
  return s.replace(/[\s，。、！？：；"''「」『』（）—…\-——>\[\]·:.\/]/g, '').length;
}

/**
 * 按字数切条（保证每条 ≤ 24 字）
 */
function splitByChars(sentences) {
  const chunks = [];
  for (const sent of sentences) {
    if (countChars(sent) <= SUB_MAX_CHARS) {
      chunks.push(sent);
    } else {
      // 强制按 24 字拆
      let remaining = sent;
      while (countChars(remaining) > SUB_MAX_CHARS) {
        let cut = SUB_MAX_CHARS;
        // 优先在 "，" "；" 处断
        for (let i = SUB_MAX_CHARS; i > SUB_MAX_CHARS / 2; i--) {
          if (remaining[i] === '，' || remaining[i] === '；' || remaining[i] === '、') {
            cut = i + 1;
            break;
          }
        }
        chunks.push(remaining.slice(0, cut));
        remaining = remaining.slice(cut);
      }
      if (remaining) chunks.push(remaining);
    }
  }
  return chunks;
}

/**
 * 检测 highlight 启发式：含数字 / 工具名 / 关键动作
 */
function shouldHighlight(text) {
  if (/\d/.test(text)) return true;  // 数字
  if (/Claude Code|mmx|Remotion/.test(text)) return true;  // 工具名
  if (/AI/.test(text)) return true;  // AI
  if (/^——/.test(text) || /——$/.test(text)) return true;  // 破折号强调
  return false;
}

/**
 * 主体段时间分配：按字数比例
 */
function distributeBodyTime(bodySegments, hookDur, closingDur, totalDur) {
  const pauseCount = bodySegments.length + 1;  // 钩子-段1 + 段N-段N+1 + 段末-收尾
  const totalPause = pauseCount * SEGMENT_PAUSE;
  const bodyTotal = totalDur - hookDur - closingDur - totalPause;

  const totalChars = bodySegments.reduce((sum, s) => sum + countChars(s.text), 0);
  let cursor = hookDur + SEGMENT_PAUSE;  // 钩子结束 + 停顿
  const result = [];
  for (const seg of bodySegments) {
    const segDur = bodyTotal * (countChars(seg.text) / totalChars);
    result.push({ ...seg, start: cursor, end: cursor + segDur });
    cursor += segDur + SEGMENT_PAUSE;
  }
  return { bodyTime: result, closingStart: cursor - SEGMENT_PAUSE + SEGMENT_PAUSE };
}

/**
 * 段内切条 + 时长分配
 */
function buildSegmentSubs(seg, allSegments) {
  const sentences = splitSentences(seg.text);
  const chunks = splitByChars(sentences);
  const segChars = countChars(seg.text);
  const segDur = seg.end - seg.start;

  let cursor = seg.start;
  const subs = [];
  for (const chunk of chunks) {
    const chunkChars = countChars(chunk);
    const dur = segDur * (chunkChars / segChars);
    // 强制 ≤ 4s（按字符数截断）
    const finalDur = Math.min(dur, SUB_MAX_DURATION);
    subs.push({
      start: cursor,
      end: cursor + finalDur,
      text: chunk,
      highlight: shouldHighlight(chunk),
    });
    cursor += finalDur;
  }
  return subs;
}

/**
 * 主生成函数
 */
function generateSubtitles(parseResult) {
  const { id, totalDuration, hook, bodySegments, closing } = parseResult;

  if (bodySegments.length === 0) {
    console.warn(`⚠️  ${id}: 没有主体段（[段N·] 标签），跳过`);
    return null;
  }

  const allSubs = [];
  let subId = 1;

  // 1. 钩子
  if (hook) {
    const hookSentences = splitSentences(hook);
    const hookChunks = splitByChars(hookSentences);
    const hookChars = countChars(hook);
    let cursor = 0;
    for (const chunk of hookChunks) {
      const chunkChars = countChars(chunk);
      const dur = Math.min(HOOK_DURATION * (chunkChars / hookChars), SUB_MAX_DURATION);
      allSubs.push({
        id: `sub_${String(subId++).padStart(3, '0')}`,
        start: +cursor.toFixed(2),
        end: +(cursor + dur).toFixed(2),
        text: chunk,
        segments: [{ text: chunk, highlight: shouldHighlight(chunk) }],
      });
      cursor += dur;
    }
  }

  // 2. 主体段时间分配
  const bodyTime = distributeBodyTime(bodySegments, HOOK_DURATION, CLOSING_DURATION, totalDuration);

  // 3. 主体段内切条
  for (const seg of bodyTime.bodyTime) {
    const subs = buildSegmentSubs(seg, bodySegments);
    for (const sub of subs) {
      allSubs.push({
        id: `sub_${String(subId++).padStart(3, '0')}`,
        start: sub.start,
        end: sub.end,
        text: sub.text,
        segments: [{ text: sub.text, highlight: sub.highlight }],
      });
    }
  }

  // 4. 收尾
  if (closing) {
    const closingSentences = splitSentences(closing);
    const closingChunks = splitByChars(closingSentences);
    const closingChars = countChars(closing);
    const closingStart = bodyTime.closingStart;
    let cursor = closingStart;
    for (const chunk of closingChunks) {
      const chunkChars = countChars(chunk);
      const dur = Math.min(CLOSING_DURATION * (chunkChars / closingChars), SUB_MAX_DURATION);
      allSubs.push({
        id: `sub_${String(subId++).padStart(3, '0')}`,
        start: +cursor.toFixed(2),
        end: +(cursor + dur).toFixed(2),
        text: chunk,
        segments: [{ text: chunk, highlight: shouldHighlight(chunk) }],
      });
      cursor += dur;
    }
  }

  return {
    id,
    language: 'zh-CN',
    duration: totalDuration,
    track_index: 0,
    version: 'auto-generated',
    notes: `由 regenerate-subtitles.js 自动生成（基于 copy.md + 中速 ${SPEED_DEFAULT} 字/秒）。音频实测时长可能与理论不同，需要录音后人工校准。`,
    subtitles: allSubs,
  };
}

/**
 * 主流程
 */
function main() {
  const targetId = process.argv[2];  // 可选：只处理单个 id

  console.log('🎙️ 扫描 copy/ 目录...');
  console.log(`   路径：${COPY_DIR}`);

  if (!fs.existsSync(COPY_DIR)) {
    console.error(`❌ 目录不存在：${COPY_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(COPY_DIR)
    .filter(f => f.endsWith('.md') && !f.endsWith('.copy_notes.md') && !f.endsWith('.mmx_prompts.md'));

  let processed = 0;
  let skipped = 0;
  for (const f of files) {
    const id = f.replace(/\.md$/, '');
    if (targetId && id !== targetId) continue;

    const sceneDir = path.join(REMOTION_DIR, id);
    const subsJson = path.join(sceneDir, 'subtitles.json');

    if (!fs.existsSync(sceneDir)) {
      console.log(`⏭️  ${id}: scene 目录不存在，跳过`);
      skipped++;
      continue;
    }

    const content = fs.readFileSync(path.join(COPY_DIR, f), 'utf8');
    const parseResult = parseCopyMd(content, f);
    const subs = generateSubtitles(parseResult);

    if (!subs) {
      skipped++;
      continue;
    }

    fs.writeFileSync(subsJson, JSON.stringify(subs, null, 2) + '\n');
    console.log(`✓ ${id}: ${subs.subtitles.length} 条字幕 / ${subs.duration}s → ${path.relative(process.cwd(), subsJson)}`);
    processed++;
  }

  console.log(`\n✅ 完成：${processed} 个场景已生成，${skipped} 个跳过`);
  console.log(`\n下一步：检查每个 subtitles.json 的单条时长（应 ≤ 4s + ≤ 24 字）`);
}

main();
