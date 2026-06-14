# Remotion CLI 指令完整手册
## 覆盖所有常用命令、参数、渲染配置

> **调研日期**：2026-06-14
> **基于**：Remotion 官方文档 + Skills rules

---

## 目录

1. [核心命令](#1-核心命令)
2. [渲染参数详解](#2-渲染参数详解)
3. [Studio 命令](#3-studio-命令)
4. [包管理命令](#4-包管理命令)
5. [FFmpeg 包装命令](#5-ffmpeg-包装命令)
6. [配置与升级](#6-配置与升级)
7. [实用工作流](#7-实用工作流)
8. [7fit 项目命令规范](#8-7fit-项目命令规范)

---

## 1. 核心命令

### 1.1 开发预览

```bash
cd remotion

# 默认启动 Studio（推荐）
npm run dev

# 指定端口
npx remotion studio --port 4668

# 仅预览单个 Composition
npx remotion preview MyComposition
```

### 1.2 渲染视频

```bash
# 基本渲染
npx remotion render <CompositionId> out/video.mp4

# 指定 Composition
npx remotion render a2_one_person_50_videos out/a2_final.mp4

# 渲染到当前日期文件
npx remotion render MyComp out/MyComp_$(date +%Y%m%d).mp4
```

### 1.3 单帧抽检

```bash
# 渲染第 30 帧静态图
npx remotion still <CompositionId> --frame=30

# 缩放 25% 用于快速检查
npx remotion still MyComp --frame=90 --scale=0.25

# 输出到文件
npx remotion still MyComp --frame=30 --output=/tmp/frame30.png
```

---

## 2. 渲染参数详解

### 2.1 输出格式

| 参数 | 值 | 说明 |
|---|---|---|
| `--image-format` | `jpeg` / `png` | 帧格式，PNG 用于透明视频 |
| `--pixel-format` | `yuva444p10le` | ProRes 透明视频必需 |
| `--codec` | `prores` / `vp9` / `h264` | 编码格式 |

### 2.2 透明视频渲染

```bash
# ProRes 透明（后期软件）
npx remotion render MyComp out/video.mov \
  --image-format=png \
  --pixel-format=yuva444p10le \
  --codec=prores \
  --prores-profile=4444

# WebM 透明（浏览器）
npx remotion render MyComp out/video.webm \
  --image-format=png \
  --pixel-format=yuva420p \
  --codec=vp9
```

### 2.3 WebGL 渲染（Maps / HtmlInCanvas）

```bash
# 必须加 --gl=angle 才能渲染 WebGL 内容
npx remotion render MyComp out/video.mp4 --gl=angle --concurrency=1
```

### 2.4 性能控制

| 参数 | 说明 | 推荐值 |
|---|---|---|
| `--concurrency` | 并发渲染帧数 | WebGL: 1, 其他: 2-4 |
| `--quality` | 渲染质量 0-100 | 默认 80 |
| `--scale` | 输出缩放 | 0.5 = 540×960 |

### 2.5 静音渲染

```bash
# 不播放音频快速检查
npx remotion render MyComp out/video.mp4 --no-media
```

---

## 3. Studio 命令

### 3.1 启动 Studio

```bash
# 基本启动
npx remotion studio

# 指定端口和 Composition
npx remotion studio --port 4668 --composition-id MyComp

# 只读模式（无编辑）
npx remotion studio --read-only
```

### 3.2 部署 Studio

```bash
# 部署到 Remotion Cloud（付费）
npx remotion deploy

# 获取部署 URL
npx remotion deploy --site-name my-video-site
```

---

## 4. 包管理命令

### 4.1 添加 Remotion 包

```bash
# npm
npx remotion add @remotion/three

# bun
bunx remotion add @remotion/three

# yarn
yarn remotion add @remotion/three

# pnpm
pnpm exec remotion add @remotion/three
```

### 4.2 查看已安装包

Remotion 会自动检测 `package.json` 中的 `@remotion/*` 包。

### 4.3 常用包安装清单

```bash
# 3D 渲染
npx remotion add @remotion/three

# 媒体处理
npx remotion add @remotion/media

# 音频可视化
npx remotion add @remotion/media-utils

# 转场系统
npx remotion add @remotion/transitions

# 光漏特效
npx remotion add @remotion/light-leaks

# Lottie 动画
npx remotion add @remotion/lottie

# 字幕系统
npx remotion add @remotion/captions

# Google Fonts
npx remotion add @remotion/google-fonts

# Zod 类型
npx remotion add @remotion/zod-types

# 文字测量
npx remotion add @remotion/layout-utils

# GIF 支持
npx remotion add @remotion/gif
```

---

## 5. FFmpeg 包装命令

### 5.1 基本用法

```bash
# 视频转音频
npx remotion ffmpeg -i input.mp4 output.mp3

# 视频修剪
npx remotion ffmpeg -ss 00:00:05 -i input.mp4 -to 00:00:10 -c:v libx264 -c:a aac output.mp4

# 获取视频信息
npx remotion ffprobe input.mp4
```

### 5.2 静音检测

```bash
# 测量响度
npx remotion ffmpeg -i video.mov -map 0:a -af loudnorm=print_format=json -f null /dev/null

# 检测静音段
npx remotion ffmpeg -i video.mov -map 0:a -af "silencedetect=noise=-30dB:d=0.5" -f null /dev/null
```

---

## 6. 配置与升级

### 6.1 查看版本

```bash
npx remotion versions
```

### 6.2 升级 Remotion

```bash
# 升级到最新版本
npx remotion upgrade

# 升级到指定版本
npx remotion upgrade --version 4.0.373
```

### 6.3 配置 config.ts

```ts
// remotion.config.ts
import { Config } from "@remotion/cli/config";

// 默认渲染设置
Config.setVideoImageFormat("png");
Config.setPixelFormat("yuva444p10le");
Config.setCodec("prores");

// Chromium 设置
Config.setChromiumOpenGlRenderer("angle");

// 端口
Config.setPort(4668);
```

---

## 7. 实用工作流

### 7.1 开发调试流程

```bash
# 1. 启动 Studio 预览
npm run dev

# 2. 单帧抽检可疑帧
npx remotion still MyComp --frame=90 --scale=0.25

# 3. 确认 OK 后渲染
npx remotion render MyComp out/final.mp4
```

### 7.2 透明视频工作流

```bash
# 1. 配置 config.ts（见 6.3）
# 2. 渲染 ProRes
npx remotion render MyComp out/video.mov \
  --image-format=png \
  --pixel-format=yuva444p10le \
  --codec=prores \
  --prores-profile=4444

# 3. 在 DaVinci Resolve / Premiere 中合成
```

### 7.3 WebGL 渲染工作流

```bash
# 1. 确保 config.ts 中设置了 --gl=angle
Config.setChromiumOpenGlRenderer("angle");

# 2. 渲染（单并发）
npx remotion render MyComp out/video.mp4 --gl=angle --concurrency=1
```

### 7.4 批量渲染多个视频

```bash
# 渲染多个 Composition
for comp in video_a video_b video_c; do
  npx remotion render $comp out/${comp}.mp4
done

# 渲染不同质量
npx remotion render MyComp out/preview.mp4 --scale=0.5
npx remotion render MyComp out/final.mp4 --scale=1
```

---

## 8. 7fit 项目命令规范

### 8.1 渲染命令模板

```bash
# 基础渲染（1080×1920 竖屏）
npx remotion render <composition-id> out/<name>_<date>_v<ver>.mp4

# 示例
npx remotion render a2_one_person_50_videos out/a2_20260614_v1.mp4
```

### 8.2 抽检命令

```bash
# 抽检关键帧（钩子 0s、结尾 -1s、中间随机）
npx remotion still a2_one_person_50_videos --frame=0 --scale=0.25
npx remotion still a2_one_person_50_videos --frame=2964 --scale=0.25
npx remotion still a2_one_person_50_videos --frame=1500 --scale=0.25
```

### 8.3 渲染前自检

```
1. 检查 durationInFrames 与 timing-sync.md 是否一致
2. 检查 BGM 时长是否 ≥ 全文 + 3s
3. 确认所有素材已就位（public/ 目录）
4. 运行 npm run lint 类型检查
```

### 8.4 渲染后自检

```bash
# 渲染完成后必须：
# 1. 用播放器打开视频看一遍（不是只检查文件存在）
# 2. 检查 BGM 音量是否正常
# 3. 检查字幕是否同步
# 4. 检查转场是否流畅（≥ 0.3s）
```

---

*CLI 指令手册完毕。*
