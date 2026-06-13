# CLAUDE.md

> **本文件是仓库根的"导航 + 极简铁律"。所有规则详情已迁到 `rules/`，本文件不再重复。**

---

## 项目概述

七练（7fit）的视频生成仓库，使用 **[Hyperframes](https://github.com/heygen-com/hyperframes)**（HeyGen 开源）制作产品宣传/营销视频。**Write HTML. Render video. Built for agents.** —— 视频描述语言从 React/Remotion 迁到 HTML + CSS + GSAP，引擎通过 Chrome Headless + `Experimental.beginFrame` 按帧确定性渲染。

视频内容所需的素材由用户放在 `resources/`，文案/产品信息从外部仓库同步后写在 `docs/`。

- **七练产品本体**（代码、后端、PRD）：`/Users/eatong/eaTong_projects/fit_lc`
- **品牌定位/对外文案**（OPC 一人公司方法论产出）：`/Users/eatong/eaTong_projects/7fit_opc`
- **七练旧版（Remotion 仓库，仅参考）**：`/Users/eatong/7fit`

> **北极星陈述**（灵魂 why · 锁版）：「用产品思维去健身，用健身改造产品。」
> **钩子句**（hook · 拉新主推）：「让健身更简单。」

---

## ⏰ 统一语速控制（铁律 · 详情见 [timing-sync.md](rules/planning/timing-sync.md)）

> **核心铁律**：视频**所有时间字段是相互推导的，不是独立的**。改一个，必须改所有。

**单一锚点**：`主体时长 = 50 秒`（用户硬约束）。其他时间从它推导：

```
中速（默认）   = 主体字数 / 主体时长    → 当前 170 字 / 50s = 3.4 字/秒
钩子            = 3 秒（抖音硬约束）
收尾            = 7 秒
段间停顿        = 0.5-1 秒（用户硬约束）
全文时长        = 钩子 + 主体 + 段间停顿×(N-1) + 收尾  → > 60 秒
BGM            ≥ 全文 + 3s fade out    → > 63 秒
Timeline        duration = 全文 × 1    → > 60 秒
```

**4 档速度档位**（提词器顶部选）：

| 档位 | 字/秒 | 主体 50s 配套 | 全文 |
|---|---|---|---|
| 🐢 慢 | 2.5 | 68s | > 78s |
| 🚶 **中** ⭐ | **3.4** | **50s** | **> 60s** |
| 🏃 快 | 4.0 | 42s | > 52s |
| ⚡ 原速 | 4.8 | 35s | > 45s |

**改任何时间字段的同步清单**：见 [timing-sync.md §同步清单](rules/planning/timing-sync.md#改任何时间字段的同步清单必走否则下游会错)（10 个文件必改）。

---

## 📂 目录结构

```
/Users/eatong/7fit_hp/
├── CLAUDE.md                    # 本文件（导航 + 极简铁律）
├── README.md                    # 项目说明
├── codebuddy.md                 # Codebuddy 工作流（外部 AI 协作）
├── .workbuddy/                  # Workbuddy 配置
├── rules/                       # ⭐ 19 份项目规范（按生产阶段分组）
│   ├── README.md                # 索引
│   ├── planning/                # Phase 0-1：决策 + 准备
│   │   ├── video-types.md       # 3 类视频（A/B/C）判定
│   │   ├── docs-sync.md         # 外部仓库同步
│   │   ├── copy.md              # 文案规范
│   │   ├── timing-sync.md       # ⏰ 统一语速控制
│   │   ├── strategy.md          # 项目级发布策略
│   │   └── backlog.md           # 选题池
│   ├── production/              # Phase 2-4：实现
│   │   ├── research.md          # 主题调研（4 维度）
│   │   ├── shoot-checklist.md   # 自拍清单（5 维 + 7 项检查）
│   │   ├── script.md            # Hyperframes 编排
│   │   ├── subtitle.md          # 字幕生成
│   │   ├── storyboard.md        # 分镜规范
│   │   ├── animation.md         # GSAP 动效
│   │   ├── bgm.md               # BGM 4 类
│   │   ├── assets.md            # 素材清单
│   │   └── rhythm.md            # 制作节奏 SOP
│   └── delivery/                # Phase 5-7：交付
│       ├── checklist.md         # 6 大块 30+ 项自检
│       ├── render.md            # 渲染触发硬规则
│       ├── publish.md           # 发布与复盘
│       ├── accounts.md          # 双账号档案
│       └── calendar.md          # 发布日历
├── docs/                        # ⭐ 外部同步文档（fit_lc + 7fit_opc 快照）
│   ├── README.md                # 目录说明
│   └── SUMMARY.md               # 同步索引 + 视频脚本事实清单
├── hyperframe/                  # ⚠️ LEGACY — 已废弃（2026-06-12 起由 hp-a/ 和 hp-b/ 替代）
├── hp-a/                        # ⭐ A 类视频项目（1920×1080 横屏 · Personal Branding）
│   ├── index.html               # A2 composition（standalone，无 scene 切换）
│   ├── compositions/           # 未来新增 A 类 composition
│   ├── assets/
│   │   ├── videos/             # a2_001_talking_head.mp4
│   │   └── audios/             # a2_one_person_50_videos.m4a + bgm/
│   ├── docs/copy/               # A 类文案稿
│   ├── hyperframes.json
│   ├── meta.json
│   └── package.json
├── hp-b/                        # ⭐ B 类视频项目（1080×1920 竖屏 · Fitness Knowledge）
│   ├── index.html               # B13 composition（standalone，竖屏）
│   ├── compositions/           # 未来新增 B 类 composition
│   ├── assets/
│   │   ├── videos/              # gym_machine_judge_b13*.mp4（主演示待录）+ angle_*.mov
│   │   └── audios/             # gym_machine_judge_b13.m4a + bgm/
│   ├── docs/copy/               # B 类文案稿
│   ├── hyperframes.json
│   ├── meta.json
│   └── package.json
├── tools/                       # ⭐ 辅助脚本（项目根级，跨 hyperframe 共享）
│   ├── recording-teleprompter.html  # 录音提词器
│   └── mmx.md                   # mmx CLI 4 大能力规范
└── resources/                   # 用户维护的素材库
    ├── docs/copy/               # 视频脚本稿（每视频一个目录）
    │   └── <主题>/
    │       ├── .md             # 文案稿
    │       ├── subtitles.json   # 字幕（B 类/C 类由 gen-subtitles.js 生成）
    │       ├── storyboard.md    # 分镜
    │       └── assets.md        # 素材清单
    ├── audios/                  # 音频/语音文件
    │   └── bgm/                 # 背景音乐（与旁白分开管理）
    ├── images/                  # 图片素材
    └── videos/                  # 视频素材
```

---

## 常用命令

**按项目执行**（hp-a/ 服务 A 类横屏 · hp-b/ 服务 B 类竖屏）：

```bash
# ========== HP-A（A 类 · 1920×1080 横屏）==========
cd hp-a && npm install
npm run dev              # 启动预览（http://localhost:3286/#project/hp-a）
npm run check            # lint + validate + inspect
npm run render -- out/a2.mp4   # 渲染（需用户授权）

# ========== HP-B（B 类 · 1080×1920 竖屏）==========
cd hp-b && npm install
npm run dev              # 启动预览（http://localhost:3002/#project/hp-b）
npm run check            # lint + validate + inspect
npm run render -- out/b13.mp4  # 渲染（需用户授权）
```

> ⚠️ **渲染必须用户显式授权**："开始渲染"才执行 `npm run render`

### ⭐ mmx 默认 AI 工具（项目所有 AI 能力入口）

```bash
# 图片生成（数据图 / UI 截图 / 装饰图）
mmx image generate --prompt "..." --width 1920 --height 1080 \
  --prompt-optimizer --quiet --non-interactive \
  --out resources/images/<主题>/<file>.png

# BGM 生成（4 类：Cyber Pulse / Power Build / Quiet Think / Hop Pulse）
mmx music generate --prompt "tech house, 105 BPM, Dm minor, 75s, NO vocals" \
  --quiet --non-interactive \
  --out resources/audios/bgm/<类型>.mp3

# 字幕生成（**从 copy.md 直接生成，无需 STT**）
node tools/gen-subtitles.js <主题>
# 选项: --speed 3.4 | --dry-run | --out <path>
# 串联: --with-bgm (自动生成 BGM) / --with-scene (自动生成 hyperframe scene)

# Hyperframes 场景生成（storyboard → scene.html）
node tools/gen-scene.js <主题>
# 选项: --with-bgm | --bgm-type power_build | --out <dir>

# 图片理解（验证生成结果，极少用）
mmx vision describe --input <image.png>
```

> **完整规范**：见 [tools/mmx.md](tools/mmx.md)（6 大能力 + prompt 模板 + 实践经验）。
> **核心原则**：**能用 HTML/CSS 渲染就不用 mmx 图片** —— 文字卡/数据图/警示 overlay 全用代码。

> **⚠️ 渲染触发硬规则**（详见 [render.md](rules/delivery/render.md)）：
>
> - **默认只启动预览**，**不**直接渲染
> - 必须用户说"开始渲染"才执行 `npm run render`
> - 画布尺寸按视频类型：**A 类横屏 1920×1080** / **B/C 类竖屏 1080×1920**（见 [video-types.md](rules/planning/video-types.md) §6 画布尺寸行）
> - 模糊措辞（"OK"/"不错"）不视为渲染授权

---

## 🎬 视频制作 6 阶段流程

| Phase | 关键动作 | 关键规则 | 触发 gate |
|---|---|---|---|
| **0 · 立项** | 判断视频类型（A/B/C）+ 同步 OPC 文档 | [video-types.md](rules/planning/video-types.md) + [docs-sync.md](rules/planning/docs-sync.md) | 用户确认类型 |
| **1 · 文案** | 写 `resources/docs/copy/<主题>.md` + 提词器试读 | [copy.md](rules/planning/copy.md) | 用户"文案 OK" |
| **2 · 脚本** | 算时长 + 编排段 → scene.html + scene.js + components/ | [script.md](rules/production/script.md) + [timing-sync.md](rules/planning/timing-sync.md) + [animation.md](rules/production/animation.md) | — |
| **3 · 字幕** | 录旁白 → mmx 转写 → `subtitles.json` | [subtitle.md](rules/production/subtitle.md) | — |
| **4 · 分镜 + 素材** | 设计分镜 + 输出素材清单 + mmx 生成缺失 | [storyboard.md](rules/production/storyboard.md) + [assets.md](rules/production/assets.md) | — |
| **5 · BGM** | 选 BGM（按视频总时长） | [bgm.md](rules/production/bgm.md) | — |
| **6 · 渲染** | checklist → `npm run dev` → 用户"开始渲染"才 `npm run render` | [checklist.md](rules/delivery/checklist.md) + [render.md](rules/delivery/render.md) | 渲染前自检通过 + 用户授权 |
| **7 · 发布 + 复盘** | 投到账号矩阵 + 24h/7d 数据回收 | [publish.md](rules/delivery/publish.md) | 24h + 7d 数据回收 |

> **完整工作流 + 阶段图**：见 [rules/index.md §6 阶段流程](rules/README.md#视频生产-6-阶段流程必须按顺序)

---

## 🔥 极简铁律（10 条 · daily 速查）

> 完整版见各 rules 文件。这一节是高频扫读，不是替代品。

1. **视频类型开工第一步**——读 [video-types.md](rules/planning/video-types.md) 判断 A/B/C，否则不写脚本
2. **⏰ 改任何时间字段必走** [timing-sync.md](rules/planning/timing-sync.md)——主体 50s 锚点 / 中速 3.4 字/秒 / 10 文件同步清单
3. **Hyperframes 入口**：`root.html` 的 `<main id="stage" data-scene="<主题>">` + `index.js` switch 初始化 + GSAP timeline 注册到 `window.__timelines`
4. **音频三件套**：BGM / voiceover / highlight / sfx 都是独立 `<audio>` 元素，track index 错开
5. **视频元素**：`<video muted playsinline>` + 分离 `<audio>`（不用视频本身带音轨）
6. **GSAP 与 CSS transform**：动画 `y` 时不要用 CSS `transform: translate(-50%,-50%)`，改用 `xPercent: -50, yPercent: -50`
7. **确定性**：无 `Date.now()` / `Math.random()` / `requestAnimationFrame` 算动画进度（hyperframes 引擎按帧 seek；音频可视化可例外，见 [animation.md §8](rules/production/animation.md#8--音频可视化analysernode)）
8. **渲染触发**：`npm run dev` 用 `run_in_background:true`；`npm run render` 必须用户显式指令
9. **段间停顿 0.5-1s**——`pause_breath` 延长上一个视频 0.8× 慢动作 / 1.2× 加速 / 特写 / freeze frame
10. **每个视频一个独立 scene 目录**——`hyperframe/src/scenes/<主题>/`，含 scene.html + scene.js + components/

---

## 🆕 命名约定

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

## 📁 版本控制 + 文件管理

1. **`out/` 和 `renders/` 永久 .gitignore**——视频产物不入库（`hyperframe/out/` = 最新渲染缓存 / `hyperframe/renders/` = 历史版本快照）
2. **`subtitles.json` / `storyboard.json` / `assets.md` 入库**——source of truth
3. **版本号在文件名里**——`out/<主题>_<日期>_v<N>.mp4`（`v1` 首发 / `v2` 修正 / `v3` 大改）

---

## 小程序配色（视频主色板）

| 用途 | 色值 | 备注 |
|---|---|---|
| 画布背景 | `#0A0A0A` | 唯一允许的"实色背景" |
| 强调色 1 | `#FF4500` | 烈焰橙（CTA / 关键数据 / 元素半透明背景色源）|
| 强调色 2 | `#DC143C` | 电红（动作/警示 / 元素半透明背景色源）|
| 文字主色 | `#FFFFFF` | 标题/正文都用纯白 |
| 文字次色 | `#888888` | 辅助说明 |
| 边框色 | `#333333` | — |

- ⚠️ **元素背景禁止使用实色**——必须用强调色 1/2 叠加透明度（`rgba(255, 69, 0, 0.10)` 等），详见 [script.md §3.5](rules/production/script.md#35-元素背景强调色--透明度)
- **设计风格**：元素必须有科技感 + 力量感（粗描边、几何、霓虹、数据冲击、硬朗圆角）

---

## ⚠️ 命名约定：两套 A/B/C 不要混

| A/B/C 出处 | 含义 | 速查 |
|---|---|---|
| [video-types.md](rules/planning/video-types.md) | **视频类型** | A 个人人设 / B 健身知识 / C 七练介绍 |
| [bgm.md](rules/production/bgm.md) | **BGM 类型** | A Cyber Pulse / B Power Build / C Quiet Think / D Hop Pulse |

> 默认搭配：A 视频类型 → C BGM 类型（Quiet Think）/ B 视频类型 → B BGM 类型（Power Build）/ C 视频类型 → A BGM 类型（Cyber Pulse）

---

## 工作流通用原则

- **素材先于脚本**：写脚本前先看 `resources/images/` 和 `resources/videos/` 里有什么可用的实拍/截图；不够的用 mmx 生成
- **同步先于创作**：写脚本前先完成 `docs/` 同步
- **规则先于执行**：每个阶段开工前先读 [rules/<subdir>/<stage>.md](rules/) 了解约束
- **每条事实都可追溯**：视频脚本中提到的功能、数据、价格、品牌口吻，都必须能在 `docs/` 找到原文
- **⚠️ 渲染框架锁定 Hyperframes**：禁止默认使用 Remotion / Lottie 单文件 / FFmpeg 直接拼脚本。如需切回旧框架，开新仓库并标记 `*_legacy`

---

## 索引入口

| 我想... | 看... |
|---|---|
| 知道视频类型怎么判定 | [video-types.md](rules/planning/video-types.md) |
| 知道怎么同步 OPC 文档 | [docs-sync.md](rules/planning/docs-sync.md) |
| 知道文案怎么写 | [copy.md](rules/planning/copy.md) |
| 知道时长怎么算 / 改时间字段怎么同步 | [timing-sync.md](rules/planning/timing-sync.md) |
| 知道脚本怎么生成（components/ + scene.js）| [script.md](rules/production/script.md) |
| 知道字幕怎么转写 + 样式 | [subtitle.md](rules/production/subtitle.md) |
| 知道分镜怎么设计 | [storyboard.md](rules/production/storyboard.md) |
| 知道动效用 GSAP 怎么写 | [animation.md](rules/production/animation.md) |
| 知道 BGM 选哪类 / 怎么集成 | [bgm.md](rules/production/bgm.md) |
| 知道素材清单怎么写 | [assets.md](rules/production/assets.md) |
| 开工前 / 渲染前自检 | [checklist.md](rules/delivery/checklist.md) |
| 知道渲染怎么触发 | [render.md](rules/delivery/render.md) |
| 知道发布到哪些平台 + 怎么复盘 | [publish.md](rules/delivery/publish.md) |
| 看完整 19 份规范索引 | [rules/index.md](rules/README.md) |
