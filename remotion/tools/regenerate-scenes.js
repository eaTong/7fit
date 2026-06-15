#!/usr/bin/env node
/**
 * regenerate-scenes.js
 *
 * 自动扫描 resources/docs/copy/ 下的所有 copy.md，生成 scenes.json
 * 并把场景数据嵌入到 recording-teleprompter.html。
 *
 * 何时运行：每次新增/修改/删除 copy.md 后
 *
 * 用法：
 *   cd remotion
 *   node tools/regenerate-scenes.js
 *
 * 或在 package.json 加 npm script：
 *   "scenes:regen": "node tools/regenerate-scenes.js"
 */

const fs = require('fs');
const path = require('path');

const COPY_DIR = path.resolve(__dirname, '../../docs/copy');
const TOOLS_DIR = __dirname;
const SCENES_JSON = path.join(TOOLS_DIR, 'scenes.json');
const HTML_PATH = path.join(TOOLS_DIR, 'recording-teleprompter.html');
const HTML_MARKER_START = '/* === SCENES_DATA_START === */';
const HTML_MARKER_END = '/* === SCENES_DATA_END === */';

/**
 * 解析单个 copy.md，提取场景元数据
 */
function extractSceneMeta(content, filename) {
  const id = filename.replace(/\.md$/, '');

  // Title: first H1
  const titleMatch = content.match(/^#\s+(.+?)$/m);
  const title = titleMatch ? titleMatch[1].trim() : id;

  // 目标账号
  const accountMatch = content.match(/\*\*目标账号\*\*[：:]\s*(.+?)$/m);
  const account = accountMatch ? accountMatch[1].trim() : 'main';

  // 视频类型
  const typeMatch = content.match(/\*\*视频类型\*\*[：:]\s*(.+?)$/m);
  const type = typeMatch ? typeMatch[1].trim() : '';

  // 预计时长
  const durMatch = content.match(/\*\*预计时长\*\*[：:]\s*~?(\d+)\s*秒?/);
  const duration = durMatch ? parseInt(durMatch[1], 10) : 50;

  // BGM
  const bgmMatch = content.match(/\*\*BGM 选型\*\*[：:]\s*(.+?)$/m);
  const bgm = bgmMatch ? bgmMatch[1].trim() : '';

  // 投放渠道
  const channelMatch = content.match(/\*\*投放渠道\*\*[：:]\s*(.+?)$/m);
  const channel = channelMatch ? channelMatch[1].trim() : '';

  // 录音输出路径（推断）—— **2026-06-05 改**：从 mp3 改为 m4a（AAC 容器）
  // iPhone 语音备忘录默认输出就是 m4a，省去 ffmpeg 转码步骤
  const audioPath = `../../resources/audios/${id}.m4a`;

  // 旁白脚本正文（只含 > 引用的段，钩子/主体/收尾）
  const scriptText = extractScriptText(content);

  return { id, title, account, type, duration, bgm, channel, audioPath, scriptText, copyFile: filename };
}

/**
 * 从 copy.md 中提取旁白脚本
 *
 * 新格式（[copy.md 标准](../../remotion/rules/copy.md)）：
 * - copy.md 只含 3 个 H2 段：钩子 / 主体 / 收尾
 * - 每段 body 是 `>` 引用行（带 `>` 表示是朗读稿）
 * - 所有非旁白内容（highlight / 字数 / 修改日志 / 自检 / 风险 / 录音指引）→ copy_notes.md
 *
 * 启发式（白名单 + 行过滤，仍保留防御性以兼容老格式）：
 * 1. H2 标题必须命中白名单：钩子 / 主体 / 收尾 / 脚本 / 旁白 / 念稿
 *    + 英文 Hook / Body / Closing / Script / Voiceover
 * 2. 段内只保留 `>` 开头的行（去掉 bullet / 表格 / 分隔线）
 */
const VOICEOVER_TITLE_RE = /^(钩子|主体|收尾|脚本|旁白|念稿|Hook|Body|Closing|Script|Voiceover)/i;

function extractScriptText(content) {
  // 不再用 lookahead regex——Node.js 里 \Z 在 lookahead 中不工作，
  // $ 太宽（匹配任意行尾）会吞掉 0 字 body。
  // 改用「扫 H2 位置 + slice」两步走，可靠。

  // 第 1 步：扫所有 H2 标题位置
  const h2Regex = /^## (.+)$/gm;
  const positions = [];
  let m;
  while ((m = h2Regex.exec(content)) !== null) {
    positions.push({ title: m[1].trim(), start: m.index });
  }
  if (positions.length === 0) return '';

  // 第 2 步：给每个 H2 算 end（下一个 H2 的 start，或文件末尾）
  for (let i = 0; i < positions.length; i++) {
    positions[i].end = i + 1 < positions.length
      ? positions[i + 1].start
      : content.length;
  }

  // 第 3 步：白名单过滤 + 提取 > 引用行
  const out = [];
  for (const pos of positions) {
    if (!VOICEOVER_TITLE_RE.test(pos.title)) continue;

    const body = content.slice(pos.start, pos.end);
    // 第 1 行是 `## title`，跳过；剩下的行只要 > 开头的
    const voiceoverLines = body.split('\n').slice(1)
      .filter(l => /^\s*>/.test(l))
      .map(l => l.replace(/^\s*>\s*/, '').trim())
      .filter(l => l.length > 0);

    if (voiceoverLines.length === 0) continue;
    out.push(`## ${pos.title}\n${voiceoverLines.join('\n')}`);
  }
  return out.join('\n\n');
}

/**
 * 主流程
 */
function main() {
  console.log('🎬 扫描 copy/ 目录...');
  console.log(`   路径：${COPY_DIR}`);

  if (!fs.existsSync(COPY_DIR)) {
    console.error(`❌ 目录不存在：${COPY_DIR}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(COPY_DIR)
    .filter(f =>
      f.endsWith('.md') &&
      !f.startsWith('.') &&
      !f.endsWith('.copy_notes.md') &&   // 排除人类作者备注文件（不影响工具）
      !f.endsWith('.mmx_prompts.md')     // 排除 mmx 生图提示词（不是文案稿）
    );

  console.log(`   找到 ${files.length} 个 copy.md（已排除 *.copy_notes.md）\n`);

  if (files.length === 0) {
    console.warn('⚠️  没有 copy.md 文件。请先创建：resources/docs/copy/<scene>.md');
  }

  // 解析每个场景
  const scenes = files.map(f => {
    const fullPath = path.join(COPY_DIR, f);
    const content = fs.readFileSync(fullPath, 'utf8');
    const meta = extractSceneMeta(content, f);
    return meta;
  });

  // 按 id 排序
  scenes.sort((a, b) => a.id.localeCompare(b.id));

  // 写入 scenes.json
  const json = {
    generatedAt: new Date().toISOString(),
    totalScenes: scenes.length,
    scenes
  };
  fs.writeFileSync(SCENES_JSON, JSON.stringify(json, null, 2) + '\n');
  console.log(`✓ 写入 ${path.relative(process.cwd(), SCENES_JSON)}`);

  // 嵌入到 HTML
  if (fs.existsSync(HTML_PATH)) {
    let html = fs.readFileSync(HTML_PATH, 'utf8');
    const jsonStr = JSON.stringify(json);

    // 检查 marker
    if (html.includes(HTML_MARKER_START) && html.includes(HTML_MARKER_END)) {
      const before = html.split(HTML_MARKER_START)[0];
      const after = html.split(HTML_MARKER_END)[1];
      const newHtml = before + HTML_MARKER_START + '\nconst SCENES_DATA = ' + jsonStr + ';\n' + HTML_MARKER_END + after;
      fs.writeFileSync(HTML_PATH, newHtml);
      console.log(`✓ 嵌入场景数据到 ${path.relative(process.cwd(), HTML_PATH)}`);
    } else {
      console.warn(`⚠️  HTML 文件缺少 marker，未嵌入。请确保 HTML 包含：`);
      console.warn(`   ${HTML_MARKER_START}  ...  ${HTML_MARKER_END}`);
    }
  } else {
    console.log(`ℹ️  HTML 文件还不存在（${path.relative(process.cwd(), HTML_PATH)}），跳过嵌入`);
  }

  // 输出场景摘要
  console.log('\n📋 场景列表：');
  if (scenes.length === 0) {
    console.log('  （空）');
  } else {
    scenes.forEach(s => {
      const tag = `${s.account === 'main' ? '🏠主号' : s.account === 'sub' ? '🪪副号' : '   ?  '} ${s.type.padEnd(8)} ${s.duration}s  ${s.id}`;
      console.log(`  ${tag}  ${s.title}`);
    });
  }

  console.log(`\n✅ 完成。下一步：打开 ${path.relative(process.cwd(), HTML_PATH)}`);
}

main();
