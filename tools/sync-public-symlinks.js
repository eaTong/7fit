/* eslint-disable */
/**
 * sync-public-symlinks.js
 *
 * 自动化维护 remotion/public/scenes/ 软链：
 * 1. 扫描 resources/user/videos/ 下的所有 scene
 * 2. 自动为每个 scene 在 remotion/public/scenes/ 创建软链
 * 3. 删除已不存在的 dangling 软链
 * 4. 自动为每个 scene 软链 images/ → assets/overlays（如果不存在）
 *
 * 用法：
 *   node tools/sync-public-symlinks.js
 *
 * 集成到 npm scripts（package.json）：
 *   "predev": "node tools/sync-public-symlinks.js",
 *   "scenes:sync": "node tools/sync-public-symlinks.js"
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const USER_VIDEOS = path.join(ROOT, "resources/user/videos");
const PUBLIC_SCENES = path.join(ROOT, "remotion/public/scenes");
const ASSETS_OVERLAYS = path.join(ROOT, "resources/assets/overlays");

function log(level, ...args) {
  const colors = {
    info: "\x1b[36m", // cyan
    success: "\x1b[32m", // green
    warn: "\x1b[33m", // yellow
    error: "\x1b[31m", // red
    reset: "\x1b[0m",
  };
  const icon = { info: "ℹ", success: "✓", warn: "⚠", error: "✗" }[level];
  console.log(`${colors[level]}${icon} ${args.join(" ")}${colors.reset}`);
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function isSymlink(p) {
  try {
    return fs.lstatSync(p).isSymbolicLink();
  } catch {
    return false;
  }
}

function readSymlink(p) {
  try {
    return fs.readlinkSync(p);
  } catch {
    return null;
  }
}

function main() {
  log("info", "🔗 同步 scenes/ 软链...");
  log("info", `   user videos:  ${USER_VIDEOS}`);
  log("info", `   public scenes: ${PUBLIC_SCENES}`);
  console.log("");

  ensureDir(PUBLIC_SCENES);

  // 1. 扫描 resources/user/videos/ 下的所有 scene
  const existingScenes = fs.existsSync(USER_VIDEOS)
    ? fs
        .readdirSync(USER_VIDEOS, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name)
        .sort()
    : [];

  log("info", `发现 ${existingScenes.length} 个 scene: ${existingScenes.join(", ")}`);
  console.log("");

  let created = 0;
  let updated = 0;
  let cleaned = 0;

  // 2. 为每个 scene 创建/更新软链
  for (const scene of existingScenes) {
    const target = path.join(USER_VIDEOS, scene);
    const linkPath = path.join(PUBLIC_SCENES, scene);
    const relLink = path.relative(PUBLIC_SCENES, target);

    // 删除旧的软链或目录
    if (fs.existsSync(linkPath)) {
      if (isSymlink(linkPath)) {
        const currentTarget = readSymlink(linkPath);
        const expectedTarget = relLink;
        if (currentTarget !== expectedTarget) {
          fs.unlinkSync(linkPath);
          log("warn", `  软链目标变化: ${scene} (${currentTarget} → ${expectedTarget})`);
        } else {
          continue; // 软链已正确
        }
      } else {
        // 不是软链，是真实目录——保留，不动
        log("warn", `  ${scene} 已是真实目录，跳过软链`);
        continue;
      }
    }

    // 创建软链
    fs.symlinkSync(relLink, linkPath);
    if (fs.lstatSync(linkPath).isSymbolicLink()) {
      log("success", `  scenes/${scene} → ${relLink}`);
      created++;
    }

    // 自动补 images/ 软链（如果存在且不存在）
    const imagesInScene = path.join(target, "images");
    const overlaysRel = path.relative(target, ASSETS_OVERLAYS);
    if (
      fs.existsSync(ASSETS_OVERLAYS) &&
      !fs.existsSync(imagesInScene)
    ) {
      try {
        fs.symlinkSync(overlaysRel, imagesInScene);
        log("info", `    + ${scene}/images → ${overlaysRel}`);
      } catch (e) {
        log("warn", `    + 创建 images 软链失败: ${e.message}`);
      }
    }
  }

  console.log("");

  // 3. 清理 dangling 软链
  if (fs.existsSync(PUBLIC_SCENES)) {
    const links = fs
      .readdirSync(PUBLIC_SCENES, { withFileTypes: true })
      .filter((d) => d.isSymbolicLink());

    for (const link of links) {
      const linkPath = path.join(PUBLIC_SCENES, link.name);
      if (!fs.existsSync(linkPath)) {
        fs.unlinkSync(linkPath);
        log("warn", `  清理 dangling 软链: scenes/${link.name}`);
        cleaned++;
      }
    }
  }

  console.log("");
  log("success", `完成: ${created} 新建 / ${updated} 更新 / ${cleaned} 清理`);
}

main();
