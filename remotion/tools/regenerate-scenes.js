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

const COPY_DIR = path.resolve(__dirname, '../../resources/docs/copy');
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

  // 录音输出路径（推断）
  const audioPath = `../../resources/audios/${id}.mp3`;

  return { id, title, account, type, duration, bgm, channel, audioPath, copyFile: filename };
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
    .filter(f => f.endsWith('.md') && !f.startsWith('.'));

  console.log(`   找到 ${files.length} 个 copy.md\n`);

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
