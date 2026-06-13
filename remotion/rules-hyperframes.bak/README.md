# 7fit 视频生产规范索引

> **本目录是七练 (7fit) 视频生产的「工艺标准」。** 所有视频脚本撰写 → 分镜 → 渲染都必须遵循这里的规定。
>
> **核心范式**：AI 驱动 + Hyperframes 渲染。HTML 是视频描述语言，GSAP 是动效语言，Claude Code 是流水线。
>
> **北极星**：「用产品思维去健身，用健身改造产品。」
> **钩子句**：「让健身更简单。」
>
> **2026-06-09 深化**：20 份规范全部 v2 化——从"what 不能做"为主，转向"how 做好 + 改稿 SOP + 评分卡 + 案例库"。每份新增附录 A 速查索引 + 附录 B 变更日志 + 5 维评分卡。总行数从 ~2.5K 增长到 ~8.6K。

---

## 仓库结构（单源真相）

```
7fit_hp/                                          ← 仓库根（AI Agent 工作区）
├── CLAUDE.md                                     ← 仓库总览 + 流程 + rules 索引
├── rules/                                        ← ⭐ 本目录（20 份规范，按生产阶段分组）
│   ├── README.md                                 ← 本文件（索引）
│   ├── planning/                                 ← Phase 0-1：决策 + 准备
│   │   ├── video-types.md                        ← 3 类视频判定
│   │   ├── docs-sync.md                          ← 外部仓库同步
│   │   ├── copy.md                               ← 文案规范
│   │   └── timing-sync.md                        ← ⏰ 统一语速控制
│   ├── production/                               ← Phase 2-4：实现
│   │   ├── script.md                             ← Hyperframes 编排
│   │   ├── subtitle.md                           ← 字幕生成
│   │   ├── storyboard.md                         ← 分镜规范
│   │   ├── animation.md                          ← GSAP 动效
│   │   ├── bgm.md                                ← BGM 4 类
│   │   └── assets.md                             ← 素材清单
│   └── delivery/                                 ← Phase 5-7：交付
│       ├── checklist.md                          ← 6 大块 30+ 项自检
│       ├── render.md                             ← 渲染触发硬规则
│       └── publish.md                            ← 发布与复盘
├── hyperframe/                                   ← 视频项目（官方工具链产物）
│   ├── CLAUDE.md                                 ← Hyperframes 工具说明
│   ├── src/                                      ← 源码（root.html / index.js / scenes/）
│   ├── public/                                   ← 视频素材（videos / images / audios）
│   ├── tools/                                    ← 辅助脚本（recording-teleprompter.html）
│   ├── hyperframe.config.js                      ← 画布/字体/输出配置
│   └── package.json                              ← 依赖 gsap / hyperframes
└── resources/                                    ← 用户维护的素材库（被 Claude 写入）
    ├── docs/                                     ← 外部仓库同步文档
    │   ├── SUMMARY.md                            ← 同步清单
    │   └── copy/                                 ← 每视频一份 .md 文案稿
    └── audio/                                    ← 备用音频
```

---

## 20 份规范按生产阶段分组

> **2026-06-09 全面深化**：20 份规范全部 v2 化——从"what 不能做"为主，转向"how 做好 + 改稿 SOP + 5 维评分卡 + 案例库 + 速查索引"。每份新增附录 A（速查索引）+ 附录 B（变更日志）+ 5 维评分卡。总行数从 ~2.5K → ~8.6K。
>
> **2026-06-04 增量**：新增 2 份规范（research.md + shoot-checklist.md），总数从 17 → 19 份。`research.md` 和 `shoot-checklist.md` 是 scene 目录自带文件，之前 rules 缺失对应规范。

### 📋 planning · 决策 + 准备（Phase 0-1）

| 规则 | 用途 | 必读时机 |
|---|---|---|
| [planning/video-types.md](planning/video-types.md) | 3 类视频（A 个人人设 / B 健身知识 / C 七练介绍）判定 + BGM 配对 | 用户说"做 X 视频"后**第一件事** |
| [planning/docs-sync.md](planning/docs-sync.md) | 增量同步 `fit_lc` + `7fit_opc` 到 `docs/` + SUMMARY.md | 写文案稿前强制 |
| [planning/copy.md](planning/copy.md) | 文案稿撰写规范（口语化、3 秒钩子、违禁词自检） | 写 `resources/docs/copy/<主题>.md` 时 |
| [planning/strategy.md](planning/strategy.md) | 项目级发布策略（双账号矩阵、节奏、禁区）| 立项前 / 调整策略时 |
| [planning/backlog.md](planning/backlog.md) | 选题池（按 A/B/C 类型分组 + 状态流转）| 每周一选题会议 |
| [planning/timing-sync.md](planning/timing-sync.md) | ⏰ 统一语速控制（主体 50s 锚点 / 中速 3.4 字/秒 / 4 档速度） | **改任何时间字段必走** |

### 🎬 production · 实现（Phase 0-4）

| 规则 | 用途 | 必读时机 |
|---|---|---|
| [production/research.md](production/research.md) | 主题调研（平台数据 / 用户痛点 / 竞品 / 数据点 4 大维度）| **Phase 0** 写 copy 之前 |
| [production/shoot-checklist.md](production/shoot-checklist.md) | 用户自拍 5 维规格 + 7 项拍摄前检查 + 4 项验收 | **Phase 4** 自拍前 |
| [production/script.md](production/script.md) | Hyperframes 编排：index.html + compositions/*.html + components/ | 写 components/ 时 |
| [production/subtitle.md](production/subtitle.md) | 字幕层：Whisper 转写 + highlight segment 标记 | 录旁白后 |
| [production/storyboard.md](production/storyboard.md) | 分镜表：shot + pause + 段间停顿差异化动效 | 有字幕后设计分镜时 |
| [production/animation.md](production/animation.md) | GSAP 动效：4 条 ease + 段间停顿 3 模式 + 元素入场/出场 | 写 scene.js 时 |
| [production/bgm.md](production/bgm.md) | 4 类 BGM（Cyber Pulse / Power Build / Quiet Think / Hop Pulse）+ ducking | 选 BGM 时 |
| [production/assets.md](production/assets.md) | 素材清单 + 缺失补齐（mmx prompt 模板） | 写分镜时配套输出 |
| [production/rhythm.md](production/rhythm.md) | 单条视频制作流程 SOP（5 步 + 1 触发 + T-3/T+7 节奏）| 制作单条视频时 |

### 📦 delivery · 交付（Phase 5-7）

| 规则 | 用途 | 必读时机 |
|---|---|---|
| [delivery/checklist.md](delivery/checklist.md) | 6 大块 30+ 项检查（开工前 + 渲染前） | 开工前 + 渲染前 |
| [delivery/render.md](delivery/render.md) | 渲染触发硬规则（默认只预览 / 显式指令才 render） | 准备 `npm run render` 时 |
| [delivery/publish.md](delivery/publish.md) | 发布与复盘（小红书 + 抖音矩阵 + 24h/7d 数据） | 视频投出去后 |
| [delivery/accounts.md](delivery/accounts.md) | 双账号档案（人设 / 隔离 / 安全设置）| 账号初始化 / 调整人设时 |
| [delivery/calendar.md](delivery/calendar.md) | 发布日历（每周排期 + 实际发布记录）| 每周排期时 |

---

## 视频生产 6 阶段流程（必须按顺序）

| Phase | 关键动作 | 触发 gate |
|---|---|---|
| **0 · 立项** | 读 OPC 文档 → 判断视频类型（A/B/C）→ 用户确认 | 用户确认类型 |
| **1 · 文案** | 写 `resources/docs/copy/<主题>.md` → 同步文档 → 提词器试读 | 用户确认"文案 OK" |
| **2 · 脚本** | 算时长 + 编排段 → `compositions/` + `index.html` | — |
| **3 · 字幕** | 录旁白 → mmx 转写 → `subtitles.json` | — |
| **4 · 分镜** | 设计分镜 → `storyboard.md` + `storyboard.json` → 素材清单 | — |
| **5 · 渲染** | `npm run check` + `npm run dev` + 用户"开始渲染"才 `npm run render` | 渲染前自检通过 |
| **6 · 发布** | 7fit 小程序视频号 + 24h/7d 复盘 | 24h + 7d 数据回收 |

---

## 核心硬规则速查（10 条铁律）

> 完整版见各规则文件。**这一节是 daily 速查，不是替代品。**

1. **视频类型开工第一步**——读 [planning/video-types.md](planning/video-types.md) 判断 A/B/C，否则不写脚本
2. **⏰ 改任何时间字段必走** [planning/timing-sync.md](planning/timing-sync.md)——主体 50s 锚点 / 中速 3.4 字/秒 / 10 文件同步清单
3. **Hyperframes 入口**：`root.html` 的 `<main id="stage" data-scene="<主题>">` + `index.js` switch 初始化 + GSAP timeline 注册到 `window.__timelines`
4. **音频三件套**：每个视频的 BGM / voiceover / 5 个 highlight / 3 个 sfx 都是独立 `<audio>` 元素，track index 错开
5. **视频元素**：`<video muted playsinline>` + 分离 `<audio>`（不用视频本身带音轨）
6. **GSAP 与 CSS transform**：动画 `y` 时不要用 CSS `transform: translate(-50%,-50%)`，改用 `xPercent: -50, yPercent: -50`
7. **确定性**：无 `Date.now()` / `Math.random()` / `requestAnimationFrame` 算动画进度（音频可视化可例外，见 [animation.md §8](production/animation.md#8--音频可视化analysernode)）
8. **渲染触发**：`npm run dev` 用 `run_in_background:true`；`npm run render` 必须用户显式指令（详见 [delivery/render.md](delivery/render.md)）
9. **段间停顿 0.5-1s**——`pause_breath` shot 延长上一个视频 0.8× 慢动作 / 1.2× 加速 / 特写 / freeze frame，**禁止**切换其他素材 / 显示纯字幕 / 显示装饰卡片
10. **每个视频一个独立 scene 目录**——`hyperframe/src/scenes/<主题>/`，含 scene.html + scene.js + components/，并在 root.html + index.js 中按主题注册
11. **mmx 是默认 AI 工具**——所有图片 / BGM / 字幕识别需求默认调 `mmx` CLI（详见 [tools/mmx.md](../tools/mmx.md)）

---

## 命名约定速查

| 文件类型 | 命名风格 | 示例 |
|---|---|---|
| 主题目录 | `snake_case` | `winged_scapula_b3` / `weekly_review` |
| shot HTML 组件 | `PascalCase` | `Shot0_Hook.html` / `Shot5_Action2_PushupPlus.html` |
| `data-shot-id` 属性 | `snake_case` | `data-shot-id="hook_question"` |
| 素材文件 | `<3 位数字>_<snake>.mov/png/mp3` | `001_hook_compare.mov` / `power_build.mp3` |
| 文案稿 | `<主题>.md` + `<主题>.copy_notes.md` | `winged_scapula_b3.md` + `winged_scapula_b3.copy_notes.md` |
| 转场类型名 | `snake_case` 动效名 | `fade` / `push_left` / `slide_up` / `pause_breath` |
| CSS 类名（BEM） | `block__element--modifier` | `info-card__title` / `segment-title--center` |

---

## 版本控制速查

1. **`out/` 永久 .gitignore**——视频产物不入库
2. **`subtitles.json` / `storyboard.json` / `assets.md` 入库**——source of truth
3. **版本号在文件名里**——`out/<主题>_<日期>_v<N>.mp4`（`v1` 首发 / `v2` 修正 / `v3` 大改）

---

## v2 深化专题（2026-06-09）

> **目标**：把 20 份规范从"红线手册"升级为"操作手册 + 改稿 SOP + 评分卡"。

### 深化范围

| 维度 | v1 | v2 |
|---|---|---|
| **行数** | ~2.5K | **~8.6K**（×3.4）|
| **章节数** | ~150 | **300+** |
| **表格数** | ~150 | **~700** |
| **新增章节类型** | — | 5 维评分卡 / 速查索引 / 变更日志 / 决策树 / 失败 case 库 |
| **反模式条目** | ~80 | **~200** |
| **典型深化方向** | 禁用清单 | 禁用 + 案例 + 修法 + 决策树 + 评分 |

### 5 个批次 + 深化主题

| 批次 | 文件 | 深化主题 |
|---|---|---|
| **A · 核心三件套** | script + storyboard + animation | 组件库 + 8 节 timeline + 4 类段模板 + GSAP 选型库 |
| **B · 素材三件套** | subtitle + bgm + assets | 5 类样式 + SFX 库 + Ducking 自动化 + 调优技巧 |
| **C · 交付三件套** | checklist + render + publish | 跨文件影响图 + 失败 case 库 + 数据基准 3 档 |
| **D · 规划三件套** | video-types + timing-sync + strategy | 3 类 18 维差异 + 10 文件同步 + 6 月路线图 |
| **E · 支撑件** | research + shoot + docs-sync + accounts + calendar + backlog + rhythm | 调研 SOP + 5 维拍摄 + 同步 + 矩阵隔离 + 跨文档流转 |

### 跨文件衔接闭环

> **改一处 → 改 N 处**的同步清单已下沉到各文件 `附录 A 速查索引`：

- **copy.md §15 下游接口** ← → **checklist.md §7 跨文件影响图** ← → **timing-sync.md §3 同步清单** ← → **render.md §6 VIDEO_DURATION 同步** ← → **all files §X 5 维评分卡**
- 每个文件都有自己的 `附录 A 速查索引`（一眼能找到要看的章节）+ `附录 B 变更日志`（改了啥有据可查）

### 使用方式变化

| 场景 | v1 怎么用 | v2 怎么用 |
|---|---|---|
| **写新稿** | 翻 6 大硬约束 | §2 人格锁版 → §4 选钩子类型 → §5 控节奏 → §6 配 CTA → §11 套模板 → §10 跑评分卡 |
| **改稿** | 看用户反馈自己琢磨 | §10 改稿 SOP 6 步 + 5 维评分卡定位 + §9 反例库避坑 |
| **A/B 钩子** | 用户提 3 个，AI 草 1 个 | §10.3 3 选 1 流程 + 钩子力评分表 |
| **渲染前** | 跑 checklist | §6.3 场景化自检 50+ 项（按场景选对应大块）|
| **发布后** | 看数据 | §9 24h + 7d 复盘 + 数据基准 3 档（达标/优秀/爆款）|
| **跨文件改 1 字段** | 凭记忆 | 跑对应同步清单（10 文件 / 6 处 / 跨文件影响图）|

### 各文件 v2 速查

| 文件 | 旧 | 新 | 5 维评分卡 | 速查索引 | 关键深化 |
|---|---|---|---|---|---|
| [copy.md](planning/copy.md) | 190 | 731 | ✅ | ✅ | 5 种钩子详解 + 5 类字幕样式 + A/B/C 差异化 + 改稿 SOP |
| [script.md](production/script.md) | 168 | 586 | ✅ | ✅ | 7 类组件模板 + 8 节 timeline + 调试 SOP |
| [storyboard.md](production/storyboard.md) | 220 | 508 | ✅ | ✅ | 4 类段模板 + 3 类分镜骨架 + 5 维评分 |
| [animation.md](production/animation.md) | 598 | 598 | ✅ | ✅ | 6 场景动效库 + 11 类卡帧 + 性能约束 |
| [subtitle.md](production/subtitle.md) | 201 | 508 | ✅ | ✅ | 拆合策略 + 5 类样式 + 3 类差异化 |
| [bgm.md](production/bgm.md) | 152 | 467 | ✅ | ✅ | 4 类 BGM 详解 + SFX 库 + Ducking 自动化 |
| [assets.md](production/assets.md) | 225 | 489 | ✅ | ✅ | 自拍 vs mmx 决策 + 3 类骨架 + 5 原则 |
| [checklist.md](delivery/checklist.md) | 176 | 346 | ✅ | ✅ | G/H/I 3 大块 + 场景化自检 + 跨文件影响图 |
| [render.md](delivery/render.md) | 180 | 447 | ✅ | ✅ | 用户授权记录 + 11 类卡帧 + 失败 case 库 |
| [publish.md](delivery/publish.md) | 210 | 423 | ✅ | ✅ | 双平台适配 + A/B 测试 + 数据基准 |
| [video-types.md](planning/video-types.md) | 97 | 301 | ✅ | ✅ | 3 类 18 维差异 + M1 锁版 + 决策树 |
| [timing-sync.md](planning/timing-sync.md) | 139 | 341 | ✅ | ✅ | 锚点推导链 + 同步 SOP + VIDEO_DURATION 6 处 |
| [strategy.md](planning/strategy.md) | 255 | 413 | ✅ | ✅ | 战略三角 + M1→M6 路线图 + 风险应对 |
| [research.md](production/research.md) | 157 | 302 | ✅ | ✅ | 4 维调研 + 时间分配 + 调研→copy 衔接 |
| [shoot-checklist.md](production/shoot-checklist.md) | 200 | 369 | ✅ | ✅ | 5 维扩展 + 7 项检查详解 + 异常处理 |
| [docs-sync.md](planning/docs-sync.md) | 106 | 296 | ✅ | ✅ | 同步 SOP + 周复核 + 异常处理 |
| [accounts.md](delivery/accounts.md) | 193 | 314 | ✅ | ✅ | 运营 5 维 + 紧急决策表 + 监控指标 |
| [calendar.md](delivery/calendar.md) | 150 | 336 | ✅ | ✅ | 跨文档流转图 + 复盘 SOP + 例外决策 |
| [backlog.md](planning/backlog.md) | 286 | 454 | ✅ | ✅ | 状态机流转 + 周选题会 + 做/不做决策 |
| [rhythm.md](production/rhythm.md) | 284 | 442 | ✅ | ✅ | 8 门控 + 4 复盘节奏 + 应急 SOP |
| **合计** | **~3.6K** | **~8.7K** | **20/20** | **20/20** | **×2.4 行数** |
