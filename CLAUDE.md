# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

七练（7fit）的视频生成仓库，用于通过 **Remotion** 制作产品宣传/营销视频。视频内容所需的素材由用户放在 `resources/`，文案/产品信息从外部仓库同步后写在 `docs/`。

- **七练产品本体**（代码、后端、PRD）：`/Users/eatong/eaTong_projects/fit_lc`
- **品牌定位/对外文案**（OPC 一人公司方法论产出）：`/Users/eatong/eaTong_projects/7fit_opc`

> **北极星陈述**（灵魂 why · 锁版）：「用产品思维去健身，用健身改造产品。」
> **钩子句**（hook · 拉新主推）：「让健身更简单。」

## ⏰ 统一语速控制（2026-06-04 起强制）

> **核心铁律**：视频**所有时间字段是相互推导的，不是独立的**。改一个，必须改所有。

**单一锚点**：`主体时长 = 50 秒`（用户硬约束）。其他时间从它推导：

```
中速（默认）   = 主体字数 / 主体时长    → 当前 169 字 / 50s = 3.4 字/秒
钩子            = 3 秒（抖音硬约束）
收尾            = 7 秒
全文时长        = 钩子 + 主体 + 收尾    → 60 秒
BGM            ≥ 全文 + 3s fade out    → ≥ 63 秒
Composition   durationInFrames = 全文 × fps = 1800 帧
```

**4 档速度档位**（提词器顶部选）：
| 档位 | 字/秒 | 主体 50s 配套 | 全文 |
|---|---|---|---|
| 🐢 慢 | 2.5 | 68s | 78s |
| 🚶 **中** ⭐ | **3.4** | **50s** | **60s** |
| 🏃 快 | 4.0 | 42s | 52s |
| ⚡ 原速（不推荐）| 4.8 | 35s | 45s |

**改任何时间字段的同步清单**（必走，否则下游会错）：

1. `docs/copy/<主题>.md` — 主体/钩子/收尾/预计
2. `docs/copy/<主题>.copy_notes.md` — 字数核对
3. `remotion/tools/recording-teleprompter.html` — `DEFAULT_TARGET_SPEED` + 3 档按钮
4. `resources/audios/bgm/*.mp3` — 时长 ≥ 全文 + 3s
5. `remotion/src/scenes/<主题>/storyboard.md` — 镜头时长
6. `remotion/src/scenes/<主题>/subtitles.json` — 每条 end-start
7. `remotion/src/scenes/<主题>/index.tsx` — `durationInFrames`
8. `remotion/src/scenes/<主题>/assets.md` — §0 目标时长
9. **CLAUDE.md（本文件）** — 统一语速控制小节

**完整规则**：[rules/timing-sync.md](rules/timing-sync.md) §0-§8 全部必读。

> **被 7 个 rules 引用**：copy / subtitle / storyboard / bgm / script / animation / render / checklist 顶部都加了"必须遵循 timing-sync.md"提示。

---

## 目录结构

```
/Users/eatong/7fit/
├── CLAUDE.md               # 本文件（导航 + 极简铁律）
├── rules/                  # ⭐ 22 份视频制作规范（按生产阶段分组）
│   ├── README.md           # 规范索引
│   ├── video-types.md      # ✅ 视频类型分类（A/B/C）—— 开工前先看
│   ├── copy.md             # ✅ 文案规范
│   ├── docs-sync.md        # ✅ 外部仓库同步
│   ├── timing-sync.md      # ✅ ⏰ 统一语速控制
│   ├── strategy.md         # ✅ 项目级发布策略
│   ├── backlog.md         # ✅ 选题池
│   ├── voice-anchor.md     # ✅ 声音锚定
│   ├── anti-ai-tells.md    # ✅ 反 AI 味清单
│   ├── research.md         # ✅ 主题调研
│   ├── shoot-checklist.md  # ✅ 用户自拍清单
│   ├── script.md           # ✅ 脚本规范
│   ├── subtitle.md         # ✅ 字幕规范
│   ├── storyboard.md       # ✅ 分镜规范
│   ├── animation.md        # ✅ 动效规范
│   ├── bgm.md              # ✅ BGM 规范
│   ├── assets.md           # ✅ 素材清单规范
│   ├── rhythm.md           # ✅ 制作节奏 SOP
│   ├── checklist.md        # ✅ 自检清单
│   ├── render.md           # ✅ 渲染规范
│   ├── publish.md          # ✅ 发布与复盘
│   ├── accounts.md         # ✅ 双账号档案
│   ├── calendar.md         # ✅ 发布日历
│   └── *.remotion          # Remotion 原版规则备份
├── docs/                   # ⭐ 外部同步文档 + 视频脚本源
│   ├── README.md
│   ├── SUMMARY.md          # 同步清单（30 份外部文档索引）
│   ├── fit_lc/            # fit_lc 产品本体文档快照（13 份）
│   ├── opc/               # 7fit_opc 品牌定位文档快照（13 份）
│   ├── copy/              # 视频文案稿（每视频一份 .md）
│   ├── diagrams/          # 图表资源
│   ├── superpowers/       # 超级能力文档
│   └── topics/            # 主题文档
├── remotion/               # Remotion 视频项目（React + TS + Tailwind）
│   ├── src/
│   │   ├── Root.tsx       # 视频 Composition 注册入口
│   │   ├── index.ts       # registerRoot 入口
│   │   ├── index.css      # Tailwind 入口
│   │   └── scenes/        # 每个视频一个独立入口（<主题>.tsx）
│   │       └── <主题>/
│   │           ├── index.tsx
│   │           ├── subtitles.json
│   │           ├── storyboard.md
│   │           ├── storyboard.json
│   │           └── components/
│   ├── public/            # 视频静态资源
│   ├── remotion.config.ts # Tailwind + 端口 4668 + jpeg 帧
│   └── package.json
└── resources/              # 用户维护的素材库
    ├── audios/           # 音频/语音文件
    │   └── bgm/          # 背景音乐
    ├── images/           # 图片素材
    └── videos/           # 视频素材
```

## 常用命令

所有命令在 `remotion/` 目录下执行：

```bash
cd remotion

# 启动 Studio 预览（http://localhost:4668）—— 默认动作
npm run dev

# 渲染视频（产物输出到 out/）—— ⚠️ 必须用户说"开始渲染"才执行
npx remotion render <CompositionId> out/<name>.mp4

# 单帧抽检（可疑帧静态检查）
npx remotion still <CompositionId> --frame=90

# 类型检查 + ESLint
npm run lint

# 打包（生产 bundle）
npm run build
```

> **⚠️ 渲染触发硬规则**（详见 [rules/render.md](rules/render.md)）：
>
> - **默认只启动预览**，**不**直接渲染
> - 必须用户说"开始渲染"才执行 `npx remotion render`
> - 默认 **1080×1920 竖屏**（9:16），**禁止**默认横屏
> - 模糊措辞（"OK"/"不错"）不视为渲染授权

> **当前状态**：`Composition.tsx` 是 Remotion 模板占位文件，**实际视频不在这**。所有视频内容都按 [rules/script.md](rules/script.md) 第 1 节放在 `remotion/src/scenes/<主题>/`。

### 第一个视频的目录初始化

首次做视频时，需要创建两个目录（项目初始化时还没建）：

```bash
# 1. 创建 Scene 目录
mkdir -p remotion/src/scenes/<主题>

# 2. 创建视频专属素材目录
mkdir -p remotion/public/<主题>/{videos,images,audios/bgm}

# 3. 删除 Remotion 模板的占位文件
rm remotion/src/Composition.tsx  # 旧的占位文件，每个视频有自己的入口
```

`Root.tsx` 也要更新——把 `import MyComposition from "./Composition"` 改为按视频注册：

```tsx
// remotion/src/Root.tsx
import { Composition } from "remotion";
import { WorkoutIntro } from "./scenes/workout_intro";  // 每个视频一行

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="workout_intro"          // 唯一 ID，用于 render 命令
        component={WorkoutIntro}
        durationInFrames={450}      // 15s @ 30fps = 450 帧（用 getAudioDuration 算真实时长）
        fps={30}
        width={1080}                // ← 默认竖屏 1080×1920
        height={1920}               // 详见 render.md 第 4 节
      />
    </>
  );
};
```

## 资源检索约定

- **图片/视频素材**：按视频内容命名（例如 `卧推80KG*10.mov`、`深蹲_100KG.mov`）。在 `resources/images/` 或 `resources/videos/` 下按文件名查找。
- **代码/产品文档/PRD/git 记录**：直接读取 `/Users/eatong/eaTong_projects/fit_lc`（重点是 `docs/PRD.md`、`docs/PRD-planning.md`、`docs/architecture/`、`docs/PRD-details/`、各 `routes/` 源码），按需用代码块展示给用户，不要让用户提供截图。
- **品牌/对外文案/转化漏斗**：读取 `/Users/eatong/eaTong_projects/7fit_opc`（重点是 `north-star.md`、`outputs/02-niche-positioning/02-niche-statement-v4.md`、`outputs/03-value-proposition/`、`outputs/07-conversion-loop/`）。
- **音频（旁白）**：用户**自录**（**不用 TTS**）—— 详见 [`copy.md §9`](rules/copy.md)，统一输出 **`.m4a`**（iPhone 语音备忘录默认格式）
- **音频/BGM 和图片生成**：使用 **mmx**（minimax）能力（BGM 仍为 `.mp3`，与旁白 `.m4a` 区分）
- **音频 → 字幕转写**：也使用 **mmx**（minimax）能力，输出 `remotion/src/scenes/<主题>/subtitles.json`（详见 `rules/subtitle.md`，m4a 直传无需转码）

## 文档同步工作流（生成视频脚本前的强制步骤）

在写视频脚本前，必须**先把两个外部仓库的文档增量同步到 `docs/`**，并生成项目级总结。
**完整规范见 [`docs-sync.md`](rules/docs-sync.md)**，本节只摘工作流概览：

1. 扫描 `/Users/eatong/eaTong_projects/fit_lc/docs/` 与 `/Users/eatong/eaTong_projects/7fit_opc/outputs/` 的最近变更
2. 把与视频主题相关的文档增量复制到 `docs/`（按子目录或主题命名，例如 `prd.md`、`opc-niche.md`、`opc-headline.md`）
3. 写一份总结性 markdown 放在 `docs/SUMMARY.md`（哪些文档已同步、各自关键信息、视频脚本可用的"事实清单"）—— 模板见 [`docs-sync.md §2`](rules/docs-sync.md)
4. 后续所有视频脚本都基于 `docs/SUMMARY.md` + `docs/` 下具体文档撰写

**不要假设视频脚本作者记得外部仓库的细节**——每条引用都要可追溯到 `docs/` 下的某个文件。

## 视频制作总流程（6 阶段 + 后期）

> **2026-06-04 重构**：原 15 步流程按 6 阶段重组，原始步骤号 `-2` ~ `15` 全部保留（顺序不变），仅做阶段归类。
> 4 个新硬约束：① 文案确认门（用户不确认不能进 Phase 2）② 段间停顿 0.5-1s ③ 场景转出/转入动效必标注 ④ BGM 放最后

### ⏸ 用户确认门（唯一 gate）

> **位置**：Phase 1 末尾。**通过条件**：用户明确说"文案确认" / "脚本可以了" / "开始下一步" / 类似授权。
> 未通过 → 停在这里，**不能**进入 Phase 2 生成脚本。
> 通过后用户再说"开始生成脚本"才进 Phase 2。

---

### Phase 1: 完整文案 + 内容分段

> **核心动作**：写文案（分段）→ 试读 → **用户确认门**。
> 试读期间文案可能改多轮。门通过前不要动脚本/字幕。

| 步骤 | 动作 | 规则 |
|---|---|---|
| **-2** | 读 OPC 文档（北极星/利基/PRD）| [video-types.md §0](rules/video-types.md) + `7fit_opc/` |
| **-1** | 确定视频类型 A/B/C | [video-types.md](rules/video-types.md) ← **第一件事** |
| **0** | 写文案稿 → `docs/copy/<主题>.md` | [copy.md](rules/copy.md) |
| **1** | 文档同步 → `docs/SUMMARY.md` | [docs-sync.md](rules/docs-sync.md) ← 引用要可追溯 |
| ⭐ | **试读 + 文案确认环节** | 提词器试念 → 用户可要求改文案 → 回到步骤 0 |
| 🚦 | **用户确认门** | 用户明确说"文案 OK"才能进 Phase 2 |

---

### Phase 2: 生成脚本 + 片段时长计算

> **核心动作**：字数 × 中速 = 片段时长 + 段间停顿 0.5-1s + 实现分镜 Shot 组件。

| 步骤 | 动作 | 规则 |
|---|---|---|
| ⭐ | **每段时长 = 字数 × 中速**（中速 3.4 字/秒默认）| [timing-sync.md §0](rules/timing-sync.md) |
| ⭐ | **段间停顿 0.5-1s**（用户硬约束，让观众消化前段内容）| [timing-sync.md §3](rules/timing-sync.md) |
| **8** | 实现分镜 → 每个 Shot 一个组件 | [script.md](rules/script.md) + [animation.md](rules/animation.md) |

---

### Phase 3: 字幕生成（按 Phase 2 时长自动）

> **核心动作**：录旁白 → mmx 转写 → 自动按 Phase 2 时长切分。

| 步骤 | 动作 | 规则 |
|---|---|---|
| **2** | 用户自录旁白 → `resources/audios/<主题>.mp3` | [copy.md §9](rules/copy.md) ← **不用 TTS** |
| **4** | mmx 识别旁白 → `subtitles.json` | [subtitle.md](rules/subtitle.md) |

---

### Phase 4: 视频内容 + 素材清单

> **核心动作**：按字幕设计分镜（**含场景转入转出动效**）→ 输出素材清单。

| 步骤 | 动作 | 规则 |
|---|---|---|
| **5** | 按字幕设计分镜 → `storyboard.md` / `.json` | [storyboard.md](rules/storyboard.md) |
| ⭐ | **场景的转入 + 转出动效必标注**（每个 shot 边界）| [storyboard.md](rules/storyboard.md) + [animation.md §7](rules/animation.md) |
| **6** | 输出素材清单 → `assets.md` + 自动复制已有素材 | [assets.md](rules/assets.md) + §4.4 批量 prompt + 验收 |

---

### Phase 5: 转场音效

> **核心动作**：按时间分段（每个 shot 边界）设置转场音效。

| 步骤 | 动作 | 规则 |
|---|---|---|
| ⭐ | **按时间分段设置转场音效** | 音效库 mmx 生成 / 第三方平台 → `resources/audios/sfx/` |

---

### Phase 6: BGM（按总时长设计，**放最后**）

> **核心动作**：视频总时长已确定（Phase 2-5 都完成）→ 按总时长设计 BGM。

| 步骤 | 动作 | 规则 |
|---|---|---|
| **3** | 选型/生成 BGM → `resources/audios/bgm/<类型>.mp3` | [bgm.md](rules/bgm.md) |

> **为什么 BGM 放最后**：总时长是 Phase 6 之前才确定的（= 钩子 + 主体 + 转场 + 收尾 + 5s buffer）。提前选 BGM 长度会错。

---

### 后期：自检 + 渲染 + 发布 + 复盘（顺序不变）

> 原 step 7-15 全部保留，按原顺序放在 Phase 6 之后。

| 步骤 | 动作 | 规则 |
|---|---|---|
| **7** | 【开工前自检】跑 checklist.md 6 大块检查 | [checklist.md](rules/checklist.md) ← 全部 ✅ 才能进下一步 |
| **9** | 在 Composition 中组装 + 转场 + BGM | [script.md §8](rules/script.md) + [animation.md §7](rules/animation.md) + [bgm.md §7](rules/bgm.md) |
| **10** | 【渲染前自检】再跑一次 checklist.md | [checklist.md](rules/checklist.md) ← 全部 ✅ 才能 render |
| **11** | ⚠️ 【默认只预览】启动 Studio 让用户审核 | [render.md](rules/render.md) ← 不自动 render |
| **12** | 收到"开始渲染"指令 → `npx remotion render` | [render.md](rules/render.md) ← 必须显式触发 |
| **13** | 渲染后自检（看视频/听 BGM/查转场）| [render.md §7](rules/render.md) |
| **14** | 【必做】发布到平台（账号/平台/标题/封面/标签/时间）| [publish.md §1-§8](rules/publish.md) |
| **15** | 【必做】24h + 7d 数据复盘，反哺 OPC 文档 | [publish.md §9](rules/publish.md) |

---

### 工作流总览图

```
Phase 1          Phase 2         Phase 3      Phase 4         Phase 5    Phase 6
文案+分段    →   脚本+时长   →   字幕     →   视频+素材  →   转场音效 →  BGM
                                       ↓
  -2 读OPC        8 实现分镜        2 自录旁白    5 设计分镜     新增       3 选型BGM
  -1 定类型       新:字数×中速      4 mmx识别     6 素材清单
   0 写文案       新:段间停顿                                      
   1 同步文档                     ↓
   ⭐ 试读确认                     ↓
   🚦 用户门 ──[未确认]─┐         ↓
              ──[确认]──┴─→ 进入 Phase 2
                                       ↓
                                ───────── 后期（顺序不变）─────────
                                7 自检 → 9 组装 → 10 自检 → 11 预览
                                → 12 渲染 → 13 自检 → 14 发布 → 15 复盘
```

每一步开工前先读对应 rules 文件，**不要跳步**（尤其是**类型判断**/文档同步/文案/分镜/素材清单/自检/渲染触发/发布/复盘）。**写组件时同步翻 `animation.md` 查动效 API**。

## 视频制作阶段与 rules 规范

`rules/` 目录用于存放**各阶段（脚本、分镜、动效、配乐、合成）的规范文件**。执行某个阶段的动作前，先读取 `rules/<stage>.md` 了解该阶段的约束：

| 阶段 | 规范文件 | 说明 |
|---|---|---|
| **视频类型** | `rules/video-types.md` | **3 类视频分类**（A 个人人设 / B 健身知识 / C 七练介绍），开工前必看 + §0 OPC 文档同步指针 |
| **文档同步** | `rules/docs-sync.md` | **外部 2 个仓库**（fit_lc / 7fit_opc）增量同步到 `docs/` + SUMMARY.md 模板（必走，引用要可追溯）|
| 文案 | `rules/copy.md` | 口语化、前 3 秒钩子、生活化对话、抖音/小红书违禁词 + §9 用户自录旁白规范（不用 TTS）|
| 脚本 | `rules/script.md` | 入口命名、场景命名、字幕/标题安全区、配色、风格、转场、素材框 + §10 可复用数据组件库 |
| 字幕 | `rules/subtitle.md` | 音频 → 字幕自动转写、字幕样式、弹跳动效、主体区域让位 |
| 分镜 | `rules/storyboard.md` | 按字幕设计分镜、时长约束（视频 > 5s）、每镜必有实内容 + `code_component` 类型 |
| **A 类口播布局** | `docs/superpowers/specs/...-usage.md` | **A 类视频专用**：shotSequence 规范 / 布局语义选择 / 过渡曲线 / 背景层 / 脚本设计流程 / 快速检查清单 |
| 动效 | `rules/animation.md` | interpolate/spring/easing/sequence/transitions/light-leaks/音频可视化/3D/Lottie |
| BGM | `rules/bgm.md` | 4 类情绪 × 4 种用途、synthwave/tech-house/ambient/glitch-hop、BPM 75-115、ducking |
| 素材清单 | `rules/assets.md` | 脚本/分镜生成时配套输出，列出每个素材 + 自动复制已有素材到 `public/<主题>/` + §1.4 可代码实现内容不进 assets.md + §4.4 批量 prompt + 验收 |
| 自检 | `rules/checklist.md` | 每个视频需求开工前/渲染前 | 6 大块 30+ 项检查，输出 Ready/Blocked 决策，缺失项给修复建议 |
| 渲染 | `rules/render.md` | 渲染输出阶段 | ⚠️ 默认只预览不渲染；必须"开始渲染"才执行；默认 1080×1920 竖屏；防卡帧 7 类问题 |
| **发布与复盘** | `rules/publish.md` | **账号矩阵（主/副号）+ 平台矩阵（抖音/小红书/视频号/B站）+ 标题/封面/标签/时间 + 24h + 7d 数据复盘**（视频投出去才算闭环）|

**当前已落地的规范**：视频类型 + 文档同步 + 文案 + 脚本 + 字幕 + 分镜 + 动效 + BGM + 素材清单 + 自检 + 渲染 + 发布与复盘。共 12 个 rules 文件，覆盖内容创作 → 拍摄 → 剪辑 → 成片 → 发布 → 复盘 全流程。

**脚本核心硬约束速览**（详见 `rules/script.md`）：

- 每个脚本一个独立入口（`remotion/src/scenes/<主题>.tsx`），场景名按内容自动命名
- 禁止大面积纯色块遮挡画面
- 字幕需留左/右 ≥ 64px、底部 ≥ 80px 安全区
- 顶部标题区需留 ≥ 120px 顶部安全区（适配手机摄像头）
- 元素配色以**小程序色板**为主，标题统一纯白 `#FFFFFF`
- **元素背景必须是半透明 + 彩色**（强调色 `#FF4500` / `#DC143C` + 透明度），禁止用纯色暗灰/纯白做元素背景（第 5.1 节）
- **画布背景**仍然用 `#0A0A0A` 深黑（页面/Scene 底层唯一允许的实色）
- **设计风格**：元素必须有科技感 + 力量感（粗描边、几何、霓虹、数据冲击、硬朗圆角）
- **转场**：每个视频必须有转场，时长 **≥ 0.3s**，优先 Crossfade / Push / 方向滑动
- **素材框**：半透明彩色 + 同色系（橙/红）边框/背景，禁用纯白/纯灰做素材框背景
- **配字幕时**：主体区域不放长文字，让位给字幕

**字幕核心硬约束速览**（详见 `rules/subtitle.md`）：

- 用户音频放在 `resources/audios/`，用 **mmx** 自动识别 + 生成 `subtitles.json`
- 字幕格式：`{ id, start, end, segments: [{ text, highlight }] }`
- 重点内容（数字/动作/品牌句/CTA）打 `highlight: true`
- 字幕样式：纯白 `#FFFFFF`、字号 **≥ 28px**（移动端可读）、`text-shadow`
- 重点 segment：橙色 `#FF4500` + 700 字重 + 1.15× 字号
- 入场用 spring 弹跳（0.25-0.4s），重点 segment 叠加二次跳动
- 单条字幕 ≤ 24 字、≤ 4s，不带句末标点

**分镜核心硬约束速览**（详见 `rules/storyboard.md`）：

- 触发条件：有字幕文件/音频时，必须按字幕设计分镜
- 输出一份 `storyboard.md`（人类可读）+ `storyboard.json`（结构化）
- 每个分镜字段：`shot_id` / `start` / `end` / `duration` / `content_type` / `content_source` / `voiceover` / `description`
- **视频类镜头时长必须 > 5s**（打包多条字幕）
- **图片类镜头时长 = 字幕时长**（或略长，2-5s）
- **严禁"纯色背景 + 文字"镜头**——每镜必须有实内容（视频/图片/动画/数据可视化/屏幕录制/复合层）
- `description` 描述的是**画面在展示什么**，不是文字在说什么
- 字幕对齐关系：默认 1:1，视频镜头 1:N，每镜一组件（`components/Shot<编号>_<描述>.tsx`）

**文案核心硬约束速览**（详见 `rules/copy.md`）：

- 文案稿保存到 `docs/copy/<主题>.md`
- **口语化**：第一/二人称 + 短句（≤20字）+ 允许语气词 + 不堆砌形容词
- **前 3 秒钩子**：5 种类型（反常识/痛点共鸣/数字冲击/身份代入/悬念提问），禁用寒暄式开场
- **生活化对话**：像朋友聊健身，承认不完美，敢用第一人称吐槽
- **避广告腔**：禁用"我们/本产品/极致/颠覆"等品牌堆砌
- **违禁词自检**：抖音/小红书违禁词清单见 `copy.md` 第 4 节（13 类 + 自检脚本）
- **事实可追溯**：提到的功能/价格/数字都能在 `docs/` 找到原文

**动效核心硬约束速览**（详见 `rules/animation.md`）：

- **⚠️ 唯一可靠的动效方式**：`useCurrentFrame()` + `interpolate()` / `spring()`
- **禁用 CSS transition/animation 和 Tailwind 动画类**——不会按帧渲染
- `interpolate` 必须加 `extrapolateLeft/Right: "clamp"`
- Sequence 都要加 `premountFor={1 * fps}` 避免渲染卡顿
- 入场用 `spring({ damping: 8, stiffness: 200, mass: 0.5 })` 或 `Easing.out`
- 出场用 `Easing.in`（更轻，8-12 帧）
- 推荐 4 条贝塞尔曲线（Crisp / Editorial / Playful / Standard）见 `animation.md` 第 6.4 节
- 转场用 `@remotion/transitions` 的 `TransitionSeries` + `fade`/`slide`，**禁用 flip/旋转/3D**（与"力量感"调性冲突）
- 数字滚动/颜色渐变用 `interpolate`；弹性入场用 `spring`
- 未安装的包（`@remotion/transitions` / `@remotion/light-leaks` / `@remotion/media-utils`）用前先 `npx remotion add xxx`

**BGM 核心硬约束速览**（详见 `rules/bgm.md`）：

- **品牌契合**：理性深度（灵魂 why）+ 轻盈不沉重（钩子 hook）+ 同侪陪伴（中级用户）→ 不要健身房嗨曲/抒情 ballad/网红热曲
- **4 类 BGM 选型**：
  - **Cyber Pulse**（synthwave, 100 BPM, Am）—— 默认/产品演示/数据复盘
  - **Power Build**（tech house, 105 BPM, Dm）—— 训练演示/PR/CTA
  - **Quiet Think**（ambient, 80 BPM, C）—— 痛点/故事反思
  - **Hop Pulse**（glitch hop, 110 BPM, F）—— 步骤教程
- **BPM 控制在 75-115**，以小调为主
- **人声 vs BGM**：旁白 0 dB（主体），BGM ≤ 旁白 60%（-12~-8 dB）
- **Ducking 必做**：旁白期间 BGM 降到 -12 dB，旁白结束升回 -8 dB
- **淡入淡出**：视频第 0s fade in（1-2s），末 2-3s fade out
- **来源优先级**：mmx 生成 > 用户提供 > 第三方平台（Epidemic Sound/Artlist）
- **存放位置**：`resources/audios/bgm/`（与旁白分开）
- **集成**：用 `<Audio>` 组件 + `useCurrentFrame` 动态音量实现 ducking
- **⚠️ 默认静音**：`bgmVolume` 默认为 `0`，组件默认静音，渲染时按需传参开启

**素材清单核心硬约束速览**（详见 `rules/assets.md`）：

- **触发条件**：每次生成脚本或分镜时，**必须**配套输出 `assets.md`
- **输出位置**：`remotion/src/scenes/<主题>/assets.md`
- **清单分两节**："已就位"（从 `resources/` 复制到 `public/<主题>/`）+ "缺失"（写 mmx prompt）
- **自动复制已有素材**：用 `cp` 把 `resources/{videos,images,audios}/<文件>` 复制到 `remotion/public/<主题>/`
- **不复制代码文件**：`subtitles.json` / `storyboard.md` 不进 public/
- **命名约定**：视频主题目录用 kebab-case 英文/拼音（如 `workout_intro`），素材文件名沿用 `resources/` 原名
- **mmx prompt 模板**：data_viz（数据图）/ screen_recording（用户录）/ 动画元素（合成）/ UI 截图 4 类
- **缺失的视频素材**：训练动作演示建议**用户自己拍摄**——mmx 生成的"假人健身"质量不稳定
- **实现 Scene 组件前**：先查 `assets.md` 的"已就位"列表，只有素材就位才能 import

**视频类型核心硬约束速览**（详见 [rules/video-types.md](rules/video-types.md)）：

- **开工第一步**：用户说"做 X 视频"时，**先判断属于 3 类中的哪一类**——A/B/C，得到确认后再继续
- **3 类速查**：
  - **A. 个人人设（OPC）**—— 主体 = 人脸/口播（用户自拍），辅助 = 视频片段 + 角落数据 overlay，BGM = **Quiet Think**（80 BPM, ambient）
  - **B. 健身知识**—— 主体 = 动作演示视频（用户自拍多角度），辅助 = 关键参数 overlay（动作名/重量/次数/RPE），BGM = **Power Build**（105 BPM, tech house）
  - **C. 七练介绍**—— 主体 = 弹出内容卡片（截图/操作视频/代码块/git log），背景 = 弱化处理的健身视频，BGM = **Cyber Pulse**（100 BPM, synthwave）
- **画面占比**：A 人脸 60-70% / B 动作 70%+ / C 卡片 60% + 背景全画面
- **关键素材**：A 必须有口播视频 / B 必须有训练动作视频（用户自拍，不信 mmx） / C 必须有弹出内容（截图/代码/git log）+ 背景健身视频
- **混合类型**：A→B / B→C / A→C 都可以，主体类型 = 时长占比最大的，切换时用 ≥0.3s 转场
- **assets.md 混合类型**：要分两节列（"主体类型素材" + "辅助类型素材"）

**自检核心硬约束速览**（详见 `rules/checklist.md`）：

- **触发时机**：每个视频需求开工前 + 实现 Scene 组件前 + 准备渲染前
- **6 大块 30+ 项检查**：
  - A. 文档与文案（6 项）—— SUMMARY.md / copy.md / 违禁词 / 钩子 / 口语化 / 事实可追溯
  - B. 字幕（8 项）—— JSON 格式 / 字段完整 / highlight / 时间线连续 / 时长匹配
  - C. 音频（5 项）—— 旁白存在 / BGM 选型 / BGM 文件 / 时长匹配 / 组件中正确 import
  - D. 素材（7 项）—— 缺失 0 项 / 完全匹配（类型/语义/时长）/ 自动复制 / 文件名拼写一致 / 训练动作用户自拍
  - E. 分镜（8 项）—— storyboard.md+json 存在 / 字段完整 / 三者时长一致（字幕=音频=分镜）/ 不允许纯色文字镜头
  - F. 实现准备（5 项）—— 主题目录命名 / 入口文件 / Root.tsx 注册 / 依赖包安装
- **输出格式**：✅ Ready to implement 或 ❌ Blocked（列出 N 个修复项）
- **素材"完全匹配"判定**：文件类型 + 内容语义 + 时长 + 可访问 + 可播放，5 维全对才算匹配
- **字幕/音频"完整"判定**：JSON 格式 + 时间线覆盖 + 文件就位 + 时长对齐（±0.3s）+ 重点标记 + 音画同步
- **任一项 ❌ → 不要往下走**，先回到对应 rules 文件查细节再修复
- **修复后必须重新跑清单**，不能凭印象"应该 OK 了"
- **速查清单去重原则**：每个 rules 文件末尾的"速查清单"只列**本文件专属**项；跨阶段综合自检统一走 [rules/checklist.md](rules/checklist.md) 第 2 节（master 6 大块 30+ 项）。详见 [checklist.md 第 0 节](rules/checklist.md#0-关于本清单的设计去重原则)。

**渲染核心硬约束速览**（详见 [rules/render.md](rules/render.md)）：

- **⚠️ 默认只启动 Studio 预览（`npm run dev`），绝不自动渲染**——必须用户说"开始渲染"才执行 `npx remotion render`
- **触发渲染的有效关键词**："开始渲染" / "渲染吧" / "render" / "导出" / "可以渲染"
- **模糊措辞不算授权**：用户说"OK"/"不错"——不视为渲染授权，必须再问一次
- **默认画布 1080×1920 竖屏（9:16），fps 30**——禁止默认横屏
- **横屏是 opt-in**：用户必须明确说"做横屏"才允许
- **防卡帧 7 类问题**：
  1. 转场帧重叠 ≥ 0.3s（防硬切）
  2. `interpolate` 必须加 `extrapolateLeft/Right: "clamp"`（防乱跑）
  3. Sequence 加 `premountFor={1 * fps}`（防黑屏）
  4. 资产 `prefetch()` 预加载（防延迟）
  5. Sequence 内用 `useCurrentFrame()` 拿本地帧（防时间错乱）
  6. 内嵌 Sequence 加 `layout="none"`（防定位错乱）
  7. 音频/字幕/Composition 时长对齐（防末段静音/字幕提前消失）
- **输出文件命名**：`out/<主题>_<日期>_v<N>.mp4`（不提交 git）
- **渲染后必须自检**：打开视频看一遍（不是只看产物存在）+ 检查 BGM 音量 + 转场流畅度

## Rules 索引

`rules/` 下的所有规范文件 + 适用范围：

| 阶段 | 规范文件 | 适用范围 | 关键约束 |
|---|---|---|---|
| **视频类型** | [rules/video-types.md](rules/video-types.md) | **开工第一步** | A 口播（人脸+片段） / B 知识（动作+参数） / C 介绍（弹出+背景） |
| **⏰ 统一语速** | [rules/timing-sync.md](rules/timing-sync.md) | **改任何时间字段必走** | 主体 50s 锚点 / 中速 3.4 字/秒 / 4 档速度 / 7 文件同步清单 |
| 文案 | [rules/copy.md](rules/copy.md) | 写文案/旁白/钩子 | 口语化 + 3 秒钩子 + 13 类违禁词 + copy.md / copy_notes.md 拆分 |
| 脚本 | [rules/script.md](rules/script.md) | 实现 Scene 组件 | 入口/场景命名 + 安全区 + 配色（半透明彩色）+ 科技感/力量感 + 转场 + 素材框 |
| 字幕 | [rules/subtitle.md](rules/subtitle.md) | 音频 → 字幕 | mmx 转写 + 纯白/28px + 弹跳动效 + 每条时长 = 字数/中速 |
| 分镜 | [rules/storyboard.md](rules/storyboard.md) | 按字幕设计分镜 | 视频 > 5s / 图片 = 字幕 / 每镜必有实内容 + 镜头时长基于字幕 |
| 动效 | [rules/animation.md](rules/animation.md) | 实现"会动"的元素 | interpolate + spring + 4 条贝塞尔曲线 + 禁用 CSS 动画 + Sequence 配 timing-sync |
| BGM | [rules/bgm.md](rules/bgm.md) | 选型 + 混音 + 集成 | 4 类情绪（Cyber Pulse / Power Build / Quiet Think / Hop Pulse）+ BPM 75-115 + ducking + 时长 ≥ 全文+3s |
| 素材清单 | [rules/assets.md](rules/assets.md) | 脚本/分镜配套输出 | Option A 单表 + 拍摄清单外拆 + 自动从 `resources/` 复制到 `public/<主题>/` |
| 自检 | [rules/checklist.md](rules/checklist.md) | 开工前/渲染前 | 6 大块 30+ 项检查 → Ready/Blocked 决策 + 修复建议 + timing-sync 同步检查 |
| 渲染 | [rules/render.md](rules/render.md) | 渲染输出 | **默认只预览不渲染** + 竖屏 1080×1920 + 防卡帧 7 类 + durationInFrames 按 timing-sync |

### ⚠️ 命名约定：A/B/C 的两套含义

文档里 **A/B/C** 有两套含义，**绝对不要混淆**：

| A/B/C 出处 | 含义 | 速查 |
|---|---|---|
| [video-types.md](rules/video-types.md) | **视频类型** | A 个人人设 / B 健身知识 / C 七练介绍 |
| [bgm.md](rules/bgm.md) | **BGM 类型** | A Cyber Pulse / B Power Build / C Quiet Think / D Hop Pulse |

> 默认搭配：A 视频类型 → C BGM 类型（Quiet Think）/ B 视频类型 → B BGM 类型（Power Build）/ C 视频类型 → A BGM 类型（Cyber Pulse）。详见 [video-types.md 第 6.4 节](rules/video-types.md#64-与-bgm-md-协同)。

### 违禁词快查（13 类，见 [copy.md 第 4 节](rules/copy.md#4-违禁词规则抖音--小红书)）

| # | 类别 | 典型词 | 七练重点 |
|---|---|---|---|
| 4.1 | 绝对化用语 | 最/第一/唯一/国家级/级/极/首 | ✅ 高频处罚 |
| 4.2 | 承诺与保证 | 100%/包/必/稳赚/无效退款 | ✅ 高频处罚 |
| 4.3 | 医疗/功效夸大 | 治愈/降三高/排毒/燃脂/暴瘦 | ✅ **七练健身赛道重灾区** |
| 4.4 | 权威/涉政 | 国家 XX 机关专供/特供 | — |
| 4.5 | 迷信/玄学 | 招财/逢凶化吉/算命 | — |
| 4.6 | 金融/虚拟货币 | 收益率/稳赚/区块链 | — |
| 4.7 | 诱导导流 | 加微信/扫码/戳这里 | ✅ 小红书 2025-2026 重拳 |
| 4.8 | 贬低拉踩/对立 | 拉踩同行/制造男女对立 | ✅ 小红书《公约 2.0》重点 |
| 4.9 | 虚假人设/编造 | 假装素人/伪造体验 | ✅ 小红书重拳 |
| 4.10 | 涉未成年人/擦边/暴力 | 任何擦边 | ✅ 零容忍 |
| 4.11 | 行业专项（健身） | 燃脂/排毒/治疗颈椎 | ✅ **七练重点** |
| 4.12 | 自检脚本 | 手工 + 工具 | — |
| 4.13 | 违禁词来源 | 法规 + 平台公约 | — |

**完整清单 + 替换策略 + 自检脚本**：见 [rules/copy.md](rules/copy.md) 第 4 节。

## Remotion 关键约定

- Composition 必须使用 `useCurrentFrame()` + `useVideoConfig()` + `AbsoluteFill` 模式驱动动画
- 静态资源放在 `remotion/public/`，引用时使用 `staticFile('xxx')`
- 已通过 `@remotion/tailwind-v4` 启用 Tailwind v4（`enableTailwind`）
- 帧格式默认 jpeg（`Config.setVideoImageFormat("jpeg")`），输出默认覆盖
- Studio 端口 4668
- 视频路径与时长由 `Composition` 的 `durationInFrames` + `fps` 决定
- **每个视频一个独立 Composition**（放在 `remotion/src/scenes/<主题>.tsx`），并在 `Root.tsx` 中按主题注册
- **动效的唯一合法实现方式**：`interpolate()` / `spring()` + `useCurrentFrame()`。**禁止 CSS transition/animation、Tailwind 动画类、`requestAnimationFrame`**（详见 [rules/animation.md](rules/animation.md) 第 1.2 节）
- **所有 Sequence 都加 `premountFor={1 * fps}`**——避免渲染卡顿

## 小程序配色（视频主色板）

视频中所有元素配色必须从这张表里取，禁止自创颜色：

| 用途 | 色值 | 备注 |
|---|---|---|
| 画布背景 | `#0A0A0A` | 唯一允许的"实色背景"，仅用于页面/Scene 底层 |
| 强调色 1 | `#FF4500` | 烈焰橙（CTA / 关键数据 / **元素半透明背景色源**）|
| 强调色 2 | `#DC143C` | 电红（动作/警示 / **元素半透明背景色源**）|
| 文字主色 | `#FFFFFF` | **标题/正文都用纯白** |
| 文字次色 | `#888888` | 辅助说明 |
| 边框色 | `#333333` | — |

- 强调色只用于关键数据/CTA 按钮/关键动作词，不大面积铺
- 标题统一纯白 `#FFFFFF` + bold，不加渐变/描边/阴影
- ⚠️ **元素背景禁止使用实色**（`#1A1A1A` / `#252525` / `#FFFFFF` 等已废弃做元素背景）——必须用强调色 1/2 叠加透明度（`bg-[#FF4500]/10` 等），详见 `rules/script.md` 第 5.1 节
- 完整约束见 `rules/script.md`

## 内容创作时优先引用的资料

| 主题 | 优先读取 |
|---|---|
| 产品功能与卖点 | `fit_lc/docs/PRD.md`、`fit_lc/docs/PRD-planning.md`、`fit_lc/docs/PRD-details/` |
| 数据模型 / API | `fit_lc/backend/prisma/schema.prisma`、`fit_lc/backend/src/routes/` |
| 品牌灵魂 / 北极星 | `7fit_opc/north-star.md` |
| 利基与钩子句 | `7fit_opc/outputs/02-niche-positioning/02-niche-statement-v4.md` |
| Headline 候选 | `7fit_opc/outputs/03-value-proposition/03-headline-candidates.md` |
| 创始人故事 | `7fit_opc/outputs/03-value-proposition/05-founders-note.md` |
| 落地页骨架 | `7fit_opc/outputs/03-value-proposition/04-landing-page-skeleton.md` |
| 转化漏斗 | `7fit_opc/outputs/07-conversion-loop/02-conversion-funnel.md` |
| 触达策略 | `7fit_opc/outputs/07-conversion-loop/01-reach-strategy.md` |

## 工作流通用原则

- **素材先于脚本**：写脚本前先看 `resources/images/` 和 `resources/videos/` 里有什么可用的实拍/截图；不够的用 mmx 生成
- **同步先于创作**：写脚本前先完成 `docs/` 同步
- **规则先于执行**：每个阶段开工前先读/写 `rules/<stage>.md`
- **每条事实都可追溯**：视频脚本中提到的功能、数据、价格、品牌口吻，都必须能在 `docs/` 找到原文
