# 7fit 视频生产规范索引

> **核心范式**：AI 驱动 + Remotion 视频引擎。
> **北极星**：「用产品思维去健身，用健身改造产品。」

---

## 10 条铁律（开工前必读）

1. **视频类型开工第一步**——读 [video-types.md](video-types.md) 判断 A/B/C
2. **⏰ 改任何时间字段必走** [timing-sync.md](timing-sync.md)——B 类主体 50s / C 类 60s / A 类 ≥ 90s，中速 3.4 字/秒
3. **段间停顿 0.5-1s**——让观众消化前段内容
4. **场景转入+转出动效必标注**——每个 shot 边界
5. **BGM 放最后**——总时长确定后才能选 BGM
6. **默认只预览**——用户说"开始渲染"才执行 `npx remotion render`
7. **每个视频一个独立 scene**——含 index.tsx + storyboard + subtitles + components/
8. **mmx 是默认 AI 工具**——图片/BGM（字幕由 `regenerate-subtitles.js` 自动生成）
9. **事实可追溯**——功能/价格/数字必须能在 `docs/` 找到原文
10. **文案必须用户确认**——说"文案 OK"才能进 Phase 2

---

## 📋 按工作流分层

```
决策 → 规划 → 写代码 → 交付
  ↓      ↓       ↓
 规划层  执行层
```

### 🧠 规划层（Planning）- 构思时读

| 规则 | 用途 |
|---|---|
| [video-types.md](video-types.md) | 选视频类型（A/B/C） |
| [copy.md](copy.md) | 写什么内容（文案规范）|
| [research.md](research.md) | 主题调研 |
| [timing-sync.md](timing-sync.md) | 时长规划 |
| [script.md](script.md) | 脚本结构 |
| [storyboard.md](storyboard.md) | 分镜规划 |
| **[resources.md](resources.md)** | **有哪些资源可用** |

### ⚙️ 执行层（Execution）- 写代码时读

| 规则 | 用途 |
|---|---|
| [animation.md](animation.md) | 动效代码 |
| [animation-inventory.md](animation-inventory.md) | 动效清单（有什么可用）|
| [subtitle.md](subtitle.md) | 字幕实现 |
| [bgm.md](bgm.md) | BGM 选配 |
| [assets.md](assets.md) | 素材清单 |
| [shoot-checklist.md](shoot-checklist.md) | 自拍规范 |
| [voice-anchor.md](voice-anchor.md) | 录音规范 |
| [anti-ai-tells.md](anti-ai-tells.md) | 防 AI 味 |
| [render.md](render.md) | 渲染 |
| [checklist.md](checklist.md) | 自检 |

### 📦 运营层（Operation）- 长期维护

| 规则 | 用途 |
|---|---|
| [strategy.md](strategy.md) | 发布策略 |
| [backlog.md](backlog.md) | 选题池 |
| [accounts.md](accounts.md) | 账号管理 |
| [calendar.md](calendar.md) | 发布日历 |
| [publish.md](publish.md) | 发布与复盘 |
| [rhythm.md](rhythm.md) | 制作节奏 |

---

## 规范总览（按层级）

### 🧠 规划层（8 个）

| # | 规则 | 用途 |
|---|---|---|
| 1 | [video-types.md](video-types.md) | 3 类视频判定 |
| 2 | [docs-sync.md](docs-sync.md) | 外部同步 |
| 3 | [copy.md](copy.md) | 文案 |
| 4 | [timing-sync.md](timing-sync.md) | ⏰ 语速/时长 |
| 5 | [research.md](research.md) | 主题调研 |
| 6 | [script.md](script.md) | 脚本编排 |
| 7 | [storyboard.md](storyboard.md) | 分镜规划 |
| 8 | [resources.md](resources.md) | 资源索引 |

### ⚙️ 执行层（10 个）

| # | 规则 | 用途 |
|---|---|---|
| 1 | [animation.md](animation.md) | 动效代码 |
| 2 | [animation-inventory.md](animation-inventory.md) | 动效清单 |
| 3 | [subtitle.md](subtitle.md) | 字幕 |
| 4 | [bgm.md](bgm.md) | BGM |
| 5 | [assets.md](assets.md) | 素材 |
| 6 | [shoot-checklist.md](shoot-checklist.md) | 自拍 |
| 7 | [voice-anchor.md](voice-anchor.md) | 录音 |
| 8 | [anti-ai-tells.md](anti-ai-tells.md) | 反 AI 味 |
| 9 | [render.md](render.md) | 渲染 |
| 10 | [checklist.md](checklist.md) | 自检 |

### 📦 运营层（6 个）

| # | 规则 | 用途 |
|---|---|---|
| 1 | [strategy.md](strategy.md) | 发布策略 |
| 2 | [backlog.md](backlog.md) | 选题池 |
| 3 | [accounts.md](accounts.md) | 账号 |
| 4 | [calendar.md](calendar.md) | 日历 |
| 5 | [publish.md](publish.md) | 发布复盘 |
| 6 | [rhythm.md](rhythm.md) | 制作节奏 |

---

## 常用命名

| 类型 | 风格 | 示例 |
|---|---|---|
| 主题目录 | `snake_case` | `winged_scapula_b3` |
| shot 组件 | `PascalCase` | `Shot0_Hook.tsx` |
| 素材文件 | `<数字>_<name>.ext` | `001_hook.mov` |
| 文案稿 | `<主题>.md` | `winged_scapula_b3.md` |

---

## 版本控制

- **`out/` 永久 .gitignore**
- **`subtitles.json` / `storyboard.json` / `assets.md` 入库**
- **版本号在文件名**：`out/<主题>_<日期>_v<N>.mp4`