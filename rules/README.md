# 7fit 视频生产规范索引

> **本目录是七练 (7fit) 视频生产的「工艺标准」。** 所有视频脚本撰写 → 分镜 → 渲染都必须遵循这里的规定。
>
> **核心范式**：AI 驱动 + Remotion 视频引擎。
>
> **北极星**：「用产品思维去健身，用健身改造产品。」
> **钩子句**：「让健身更简单。」
>
> **来源**：由 7fit 规则体系演进而来（2026-06-13），统一使用 Remotion 引擎。

---

## 22 份规范总览

| # | 规则 | 用途 | 必读时机 |
|---|---|---|---|
| 1 | [video-types.md](video-types.md) | 3 类视频（A 个人人设 / B 健身知识 / C 七练介绍）判定 + BGM 配对 | 用户说"做 X 视频"后**第一件事** |
| 2 | [docs-sync.md](docs-sync.md) | 增量同步 `fit_lc` + `7fit_opc` 到 `docs/` + SUMMARY.md | 写文案稿前强制 |
| 3 | [copy.md](copy.md) | 文案稿撰写规范（口语化、3 秒钩子、违禁词自检、5 维评分卡）| 写 `docs/copy/<主题>.md` 时 |
| 4 | [timing-sync.md](timing-sync.md) | ⏰ 统一语速控制（B/C 主体 50s 锚点 / A 类 ≥ 90s 全文 / 中速 3.4 字/秒 / 4 档速度） | **改任何时间字段必走** |
| 5 | [strategy.md](strategy.md) | 项目级发布策略（双账号矩阵、节奏、禁区）| 立项前 / 调整策略时 |
| 6 | [backlog.md](backlog.md) | 选题池（按 A/B/C 类型分组 + 状态流转）| 每周一选题会议 |
| 7 | [voice-anchor.md](voice-anchor.md) | 声音锚定（语气词/停顿/节奏控制）| 录音前 |
| 8 | [anti-ai-tells.md](anti-ai-tells.md) | 反 AI 味清单（口语化 + 具体性三件套）| 写文案时 |
| 9 | [research.md](research.md) | 主题调研（平台数据 / 用户痛点 / 竞品 / 数据点 4 大维度）| **Phase 0** 写 copy 之前 |
| 10 | [shoot-checklist.md](shoot-checklist.md) | 用户自拍 5 维规格 + 7 项拍摄前检查 + 4 项验收 | **Phase 4** 自拍前 |
| 11 | [script.md](script.md) | 视频脚本编排规范 | 写 components/ 时 |
| 12 | [subtitle.md](subtitle.md) | 字幕层：Whisper 转写 + highlight segment 标记 | 录旁白后 |
| 13 | [storyboard.md](storyboard.md) | 分镜表：shot + pause + 段间停顿差异化动效 | 有字幕后设计分镜时 |
| 14 | [animation.md](animation.md) | Remotion 动效：interpolate + spring + 4 条 easing + 转场动画 | 写 Scene 组件时 |
| 15 | [bgm.md](bgm.md) | 4 类 BGM（Cyber Pulse / Power Build / Quiet Think / Hop Pulse）+ ducking | 选 BGM 时 |
| 16 | [assets.md](assets.md) | 素材清单 + 缺失补齐（mmx prompt 模板）| 写分镜时配套输出 |
| 17 | [rhythm.md](rhythm.md) | 单条视频制作流程 SOP（5 步 + 1 触发 + T-3/T+7 节奏）| 制作单条视频时 |
| 18 | [checklist.md](checklist.md) | 6 大块 30+ 项检查（开工前 + 渲染前） | 开工前 + 渲染前 |
| 19 | [render.md](render.md) | 渲染触发硬规则（默认只预览 / 显式指令才 render） | 准备 `npm run render` 时 |
| 20 | [publish.md](publish.md) | 发布与复盘（小红书 + 抖音矩阵 + 24h/7d 数据） | 视频投出去后 |
| 21 | [accounts.md](accounts.md) | 双账号档案（人设 / 隔离 / 安全设置）| 账号初始化 / 调整人设时 |
| 22 | [calendar.md](calendar.md) | 发布日历（每周排期 + 实际发布记录）| 每周排期时 |
| 23 | [animation-inventory.md](animation-inventory.md) | 动画/特效/转场清单（生成脚本**必须**参考）| 写 Scene 组件时**强制参考** |

---

## 按生产阶段分组

### planning · 决策 + 准备（Phase 0-1）

| 规则 | 用途 |
|---|---|
| [video-types.md](video-types.md) | 3 类视频判定 |
| [docs-sync.md](docs-sync.md) | 外部仓库同步 |
| [copy.md](copy.md) | 文案规范 |
| [timing-sync.md](timing-sync.md) | ⏰ 统一语速控制 |
| [strategy.md](strategy.md) | 项目级发布策略 |
| [backlog.md](backlog.md) | 选题池 |
| [voice-anchor.md](voice-anchor.md) | 声音锚定 |
| [anti-ai-tells.md](anti-ai-tells.md) | 反 AI 味清单 |

### production · 实现（Phase 2-4）

| 规则 | 用途 |
|---|---|
| [research.md](research.md) | 主题调研 |
| [shoot-checklist.md](shoot-checklist.md) | 用户自拍清单 |
| [script.md](script.md) | 视频脚本编排 |
| [subtitle.md](subtitle.md) | 字幕生成 |
| [storyboard.md](storyboard.md) | 分镜规范 |
| [animation.md](animation.md) | 动效规范 |
| [animation-inventory.md](animation-inventory.md) | 动画/特效/转场清单（**强制参考**）|
| [bgm.md](bgm.md) | BGM 规范 |
| [assets.md](assets.md) | 素材清单 |
| [rhythm.md](rhythm.md) | 制作节奏 SOP |

### delivery · 交付（Phase 5-7）

| 规则 | 用途 |
|---|---|
| [checklist.md](checklist.md) | 自检清单 |
| [render.md](render.md) | 渲染触发 |
| [publish.md](publish.md) | 发布与复盘 |
| [accounts.md](accounts.md) | 双账号档案 |
| [calendar.md](calendar.md) | 发布日历 |

---

## 核心硬规则速查（10 条铁律）

1. **视频类型开工第一步**——读 [video-types.md](video-types.md) 判断 A/B/C，否则不写脚本
2. **⏰ 改任何时间字段必走** [timing-sync.md](timing-sync.md)——B/C 主体 50s 锚点 / A 类 ≥ 90s 全文 / 中速 3.4 字/秒 / 10 文件同步清单
3. **段间停顿 0.5-1s**——让观众消化前段内容
4. **场景的转入 + 转出动效必标注**（每个 shot 边界）
5. **BGM 放最后**（总时长确定后才能选 BGM）
6. **渲染触发**：`npm run dev` 预览；`npm run render` 必须用户显式指令
7. **每个视频一个独立 scene 目录**——含 index.tsx + storyboard + subtitles + components/
8. **mmx 是默认 AI 工具**——所有图片 / BGM 需求默认调 mmx CLI（**字幕**由 `regenerate-subtitles.js` 基于 copy.md 自动生成，不走 mmx ASR）
9. **事实可追溯**——提到的功能/价格/数字都必须在 `docs/` 找到原文
10. **用户确认门**——文案必须用户说"文案 OK"才能进 Phase 2

---

## 命名约定速查

| 文件类型 | 命名风格 | 示例 |
|---|---|---|
| 主题目录 | `snake_case` | `winged_scapula_b3` / `weekly_review` |
| shot 组件 | `PascalCase` | `Shot0_Hook.tsx` / `Shot5_Action2_PushupPlus.tsx` |
| 素材文件 | `<3 位数字>_<snake>.mov/png/mp3` | `001_hook_compare.mov` / `power_build.mp3` |
| 文案稿 | `<主题>.md` + `<主题>.copy_notes.md` | `winged_scapula_b3.md` + `winged_scapula_b3.copy_notes.md` |

---

## 版本控制速查

1. **`out/` 永久 .gitignore**——视频产物不入库
2. **`subtitles.json` / `storyboard.json` / `assets.md` 入库**——source of truth
3. **版本号在文件名里**——`out/<主题>_<日期>_v<N>.mp4`

---

## 变更日志

| 日期 | 变更 |
|---|---|
| 2026-06-13 | 规则体系演进，统一使用 Remotion 引擎，新增 9 份规则（strategy/backlog/voice-anchor/anti-ai-tells/research/rhythm/shoot-checklist/accounts/calendar），共 22 份规则 |
| 2026-06-14 | 新增 [animation-inventory.md](animation-inventory.md)：14 种转场 / 20+ 动画模式 / 10+ 特效 / 可探索清单，生成脚本时**必须参考** |

---

## 历史版本备份

Remotion 原生规则已备份到 `*.remotion` 后缀文件：

- `animation.md.remotion`
- `assets.md.remotion`
- `bgm.md.remotion`
- `checklist.md.remotion`
- `copy.md.remotion`
- `docs-sync.md.remotion`
- `publish.md.remotion`
- `render.md.remotion`
- `script.md.remotion`
- `storyboard.md.remotion`
- `subtitle.md.remotion`
- `timing-sync.md.remotion`
- `video-types.md.remotion`