# 七练 (7fit) · 视频生产仓库

> **北极星**：「用产品思维去健身，用健身改造产品。」
> **钩子句**：「让健身更简单。」

七练产品的官方视频生产仓库。所有产品宣传/营销视频都在这里用 [Remotion](https://www.remotion.dev/)（React + TypeScript + Tailwind）制作。

七练产品本体与品牌素材分别维护在两个外部仓库：

| 仓库 | 用途 |
|---|---|
| [eaTong_projects/fit_lc](https://github.com/eatong/fit_lc) | 产品代码、后端、PRD、功能细节 |
| [eaTong_projects/7fit_opc](https://github.com/eatong/7fit_opc) | 北极星、利基定位、Headline、转化漏斗、OPC 方法论 |

> 这两个仓库的文档会**增量同步**到 `resources/docs/`，再据此撰写视频脚本——详见 [rules/docs-sync.md](rules/docs-sync.md)。

---

## 📂 目录结构

```
7fit/
├── remotion/                # Remotion 视频项目
│   ├── src/
│   │   ├── Root.tsx         # Composition 注册入口
│   │   ├── scenes/          # 每个视频一个独立入口（<主题>）
│   │   │   └── <主题>/
│   │   │       ├── index.tsx
│   │   │       ├── subtitles.json
│   │   │       ├── storyboard.md / .json
│   │   │       ├── assets.md
│   │   │       └── components/      # 每个分镜一组件
│   │   └── index.ts
│   ├── public/<主题>/       # 视频专属素材（从 resources/ 复制）
│   ├── rules/               # 12 份视频制作规范（每阶段一文件）
│   ├── tools/               # 辅助脚本（如分镜索引器）
│   └── remotion.config.ts
└── resources/               # 用户维护的素材库
    ├── docs/                # 同步后的产品/品牌文档 + 文案稿
    │   ├── SUMMARY.md
    │   └── copy/            # 每视频一份 .md 文案稿
    ├── audios/              # 音频/语音（用户自录）
    │   └── bgm/             # 背景音乐（与旁白分开）
    ├── images/              # 图片素材
    └── videos/              # 视频素材（用户自拍训练动作为主）
```

---

## 🚀 常用命令

所有命令在 `remotion/` 目录下执行：

```bash
cd remotion

# 启动 Studio 预览（http://localhost:4668）—— 默认动作
npm run dev

# 类型检查 + ESLint
npm run lint

# 打包（生产 bundle）
npm run build

# 单帧抽检（可疑帧静态检查）
npx remotion still <CompositionId> --frame=90

# ⚠️ 渲染视频（产物输出到 out/）—— 必须用户说"开始渲染"才执行
npx remotion render <CompositionId> out/<name>.mp4
```

> **⚠️ 渲染触发硬规则**（详见 [rules/render.md](rules/render.md)）：
>
> - **默认只启动预览**，**不**直接渲染
> - 必须用户说"开始渲染"/"渲染吧"/"render"/"导出"才执行 `npx remotion render`
> - 模糊措辞（"OK"/"不错"）**不**视为渲染授权
> - 默认 **1080×1920 竖屏（9:16）**，禁止默认横屏

---

## 🎬 三类视频（A / B / C）

**开工第一步**：先判断视频属于哪一类。

| 类型 | 主体 | 辅助 | 典型场景 | 推荐 BGM |
|---|---|---|---|---|
| **A. 个人人设（OPC）** | 人脸/口播（用户自拍） | 视频片段 + 角落数据 overlay | 创始人故事、痛点共鸣、理念传递 | **Quiet Think**（ambient, 80 BPM） |
| **B. 健身知识** | 动作演示视频（用户自拍多角度） | 关键参数 overlay（重量/次数/RPE） | 训练教程、PR 庆祝、动作纠错 | **Power Build**（tech house, 105 BPM） |
| **C. 七练介绍** | 弹出内容卡片（截图/操作视频/代码块/git log） | 弱化处理的健身视频背景 | 产品演示、功能介绍、数据复盘 | **Cyber Pulse**（synthwave, 100 BPM） |

> 混合类型（A→B / B→C / A→C）也可以，主体类型 = 时长占比最大的，切换时用 ≥0.3s 转场。
>
> 完整规范：[rules/video-types.md](rules/video-types.md)

---

## 🎨 视觉规范速览

视频中所有元素配色从这张表取，**禁止自创颜色**：

| 用途 | 色值 | 用途说明 |
|---|---|---|
| 画布背景 | `#0A0A0A` | 唯一允许的"实色背景"，仅用于页面/Scene 底层 |
| 强调色 1 | `#FF4500` | 烈焰橙（CTA / 关键数据 / 元素半透明背景） |
| 强调色 2 | `#DC143C` | 电红（动作/警示 / 元素半透明背景） |
| 文字主色 | `#FFFFFF` | 标题/正文统一纯白 + bold |
| 文字次色 | `#888888` | 辅助说明 |
| 边框色 | `#333333` | — |

⚠️ **元素背景必须用半透明彩色**（`bg-[#FF4500]/10` / `bg-[#DC143C]/20` 等），**禁止用纯色暗灰/纯白做元素背景**——详见 [rules/script.md §5.1](rules/script.md)。

**设计风格**：元素必须有**科技感 + 力量感**（粗描边、几何、霓虹、数据冲击、硬朗圆角）。

---

## 📐 12 份制作规范（rules/）

每个阶段开工前**先读对应 rules 文件**，**不要跳步**。

| # | 阶段 | 规范文件 | 关键约束 |
|---|---|---|---|
| 1 | **视频类型** | [video-types.md](rules/video-types.md) | A 口播 / B 知识 / C 介绍；开工第一步 |
| 2 | **文档同步** | [docs-sync.md](rules/docs-sync.md) | 外部 2 个仓库增量同步到 `resources/docs/` |
| 3 | 文案 | [copy.md](rules/copy.md) | 口语化 + 3 秒钩子 + 13 类违禁词 |
| 4 | 脚本 | [script.md](rules/script.md) | 入口/场景命名 + 安全区 + 配色 + 科技/力量感 + 转场 |
| 5 | 字幕 | [subtitle.md](rules/subtitle.md) | mmx 转写 + 纯白/28px + 弹跳动效 |
| 6 | 分镜 | [storyboard.md](rules/storyboard.md) | 视频 > 5s / 图片 = 字幕 / 每镜必有实内容 |
| 7 | 动效 | [animation.md](rules/animation.md) | interpolate + spring + 4 条贝塞尔曲线；**禁用 CSS 动画** |
| 8 | BGM | [bgm.md](rules/bgm.md) | 4 类情绪（Cyber/Power/Quiet/Hop Pulse）+ BPM 75-115 + ducking |
| 9 | 素材清单 | [assets.md](rules/assets.md) | 列出每个分镜需要的素材 + 自动从 resources/ 复制到 public/ |
| 10 | 自检 | [checklist.md](rules/checklist.md) | 6 大块 30+ 项检查 → Ready/Blocked 决策 |
| 11 | 渲染 | [render.md](rules/render.md) | **默认只预览不渲染** + 竖屏 1080×1920 + 防卡帧 7 类 |
| 12 | **发布与复盘** | [publish.md](rules/publish.md) | 账号/平台矩阵 + 标题/封面/标签/时间 + 24h+7d 数据复盘 |

---

## 🔁 视频制作全流程

```
-2. 【必做】读 OPC 文档（北极星/利基/PRD）      [video-types.md §0]
-1. 【必做】确定视频类型 A/B/C                    [video-types.md]
 0.  写文案稿 → resources/docs/copy/<主题>.md      [copy.md]
 1.  文档同步 → resources/docs/ + SUMMARY.md       [docs-sync.md]
 2.  用户自录旁白 → resources/audios/<主题>.mp3     [copy.md §9]
 3.  选型/生成 BGM → resources/audios/bgm/<类型>.mp3  [bgm.md]
 4.  mmx 识别旁白 → subtitles.json                  [subtitle.md]
 5.  按字幕设计分镜 → storyboard.md / .json         [storyboard.md]
 6.  配套输出素材清单 → assets.md + 自动复制已有素材 [assets.md]
 7.  【开工前自检】跑 checklist.md 6 大块检查        [checklist.md]
 8.  实现分镜 → 每个 Shot 一个组件                  [script.md + animation.md]
 9.  在 Composition 中组装 + 转场 + BGM             [script.md §8 + animation.md §7 + bgm.md §7]
10.  【渲染前自检】再跑一次 checklist.md            [checklist.md]
11. ⚠️ 【默认只预览】启动 Studio 让用户审核         [render.md]
12. 收到"开始渲染"指令 → npx remotion render       [render.md]
13. 渲染后自检（看视频/听 BGM/查转场）              [render.md §7]
14. 【必做】发布到平台（账号/平台/标题/封面/标签/时间）  [publish.md §1-§8]
15. 【必做】24h + 7d 数据复盘，反哺 OPC 文档        [publish.md §9]
```

**每一步开工前先读对应 rules 文件**——**不要跳步**（尤其是**类型判断**/文档同步/文案/分镜/素材清单/自检/渲染触发/发布/复盘）。

---

## 🧩 第一个视频的目录初始化

首次做视频时，需要创建两个目录（项目初始化时还没建）：

```bash
# 1. 创建 Scene 目录
mkdir -p remotion/src/scenes/<主题>

# 2. 创建视频专属素材目录
mkdir -p remotion/public/<主题>/{videos,images,audios/bgm}

# 3. 删除 Remotion 模板的占位文件
rm remotion/src/Composition.tsx
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
        height={1920}
      />
    </>
  );
};
```

---

## ⚙️ Remotion 关键约定

- **动效的唯一合法方式**：`useCurrentFrame()` + `interpolate()` / `spring()`。**禁止** CSS transition/animation、Tailwind 动画类、`requestAnimationFrame`
- 所有 `Sequence` 都加 `premountFor={1 * fps}`——避免渲染卡顿
- `interpolate` 必须加 `extrapolateLeft/Right: "clamp"`
- 入场用 `spring({ damping: 8, stiffness: 200, mass: 0.5 })` 或 `Easing.out`
- 转场用 `@remotion/transitions` 的 `TransitionSeries` + `fade`/`slide`，**禁用 flip/旋转/3D**
- 静态资源放在 `remotion/public/`，引用时用 `staticFile('xxx')`
- Tailwind v4 已通过 `@remotion/tailwind-v4` 启用（`enableTailwind`）
- Studio 默认端口 **4668**，帧格式 **jpeg**

---

## 🎙️ 音频约定

- **旁白**：用户**自录**（**不用 TTS**）—— 详见 [copy.md §9](rules/copy.md)
- **BGM**：使用 **mmx**（minimax）能力生成；4 类选型（Cyber/Power/Quiet/Hop Pulse）见 [bgm.md](rules/bgm.md)
- **Ducking 必做**：旁白期间 BGM 降到 -12 dB，旁白结束升回 -8 dB
- **存放位置**：`resources/audios/<主题>.mp3`（旁白）/ `resources/audios/bgm/<类型>.mp3`（BGM）

---

## 🔤 字幕约定（速查）

- 字幕格式：`{ id, start, end, segments: [{ text, highlight }] }`
- 重点内容（数字/动作/品牌句/CTA）打 `highlight: true`
- 样式：纯白 `#FFFFFF`、字号 **≥ 28px**（移动端可读）、`text-shadow`
- 重点 segment：橙色 `#FF4500` + 700 字重 + 1.15× 字号
- 入场用 spring 弹跳（0.25-0.4s），重点 segment 叠加二次跳动
- 单条字幕 ≤ 24 字、≤ 4s，不带句末标点

完整规范：[rules/subtitle.md](rules/subtitle.md)

---

## 🚫 13 类违禁词快查（抖音/小红书）

视频文案、广告、封面、Tag 都不能出现以下内容：

| # | 类别 | 典型词 | 七练重点 |
|---|---|---|---|
| 4.1 | 绝对化用语 | 最/第一/唯一/国家级/级/极/首 | ✅ 高频处罚 |
| 4.2 | 承诺与保证 | 100%/包/必/稳赚/无效退款 | ✅ 高频处罚 |
| 4.3 | 医疗/功效夸大 | 治愈/降三高/排毒/燃脂/暴瘦 | ✅ **七练健身赛道重灾区** |
| 4.4-4.6 | 权威/迷信/金融 | 国家 XX 机关专供/招财/收益率 | — |
| 4.7 | 诱导导流 | 加微信/扫码/戳这里 | ✅ 小红书 2025-2026 重拳 |
| 4.8 | 贬低拉踩/对立 | 拉踩同行/制造男女对立 | ✅ 小红书《公约 2.0》重点 |
| 4.9 | 虚假人设/编造 | 假装素人/伪造体验 | ✅ 小红书重拳 |
| 4.10 | 未成年人/擦边/暴力 | 任何擦边 | ✅ 零容忍 |
| 4.11 | 行业专项（健身） | 燃脂/排毒/治疗颈椎 | ✅ **七练重点** |

完整清单 + 替换策略 + 自检脚本：[rules/copy.md §4](rules/copy.md)。

---

## 📡 内容创作时优先引用的资料

| 主题 | 优先读取 |
|---|---|
| 产品功能与卖点 | [fit_lc/docs/PRD.md](https://github.com/eatong/fit_lc/blob/main/docs/PRD.md)、`PRD-planning.md`、`PRD-details/` |
| 数据模型 / API | `fit_lc/backend/prisma/schema.prisma`、`fit_lc/backend/src/routes/` |
| 品牌灵魂 / 北极星 | [7fit_opc/north-star.md](https://github.com/eatong/7fit_opc/blob/main/north-star.md) |
| 利基与钩子句 | [7fit_opc/outputs/02-niche-positioning/02-niche-statement-v4.md](https://github.com/eatong/7fit_opc/blob/main/outputs/02-niche-positioning/02-niche-statement-v4.md) |
| Headline 候选 | [7fit_opc/outputs/03-value-proposition/03-headline-candidates.md](https://github.com/eatong/7fit_opc/blob/main/outputs/03-value-proposition/03-headline-candidates.md) |
| 创始人故事 | [7fit_opc/outputs/03-value-proposition/05-founders-note.md](https://github.com/eatong/7fit_opc/blob/main/outputs/03-value-proposition/05-founders-note.md) |
| 落地页骨架 | [7fit_opc/outputs/03-value-proposition/04-landing-page-skeleton.md](https://github.com/eatong/7fit_opc/blob/main/outputs/03-value-proposition/04-landing-page-skeleton.md) |
| 转化漏斗 | [7fit_opc/outputs/07-conversion-loop/02-conversion-funnel.md](https://github.com/eatong/7fit_opc/blob/main/outputs/07-conversion-loop/02-conversion-funnel.md) |
| 触达策略 | [7fit_opc/outputs/07-conversion-loop/01-reach-strategy.md](https://github.com/eatong/7fit_opc/blob/main/outputs/07-conversion-loop/01-reach-strategy.md) |

> ⚠️ 本仓库内的 `resources/docs/` 是**同步副本**（每条引用都可追溯），不直接读外部仓库。

---

## 📌 当前状态

- ✅ **12 份 rules 文件**全部就位（视频类型 → 发布与复盘全流程）
- ✅ **第 1 个视频 B3 翼状肩胛** 已发布（[`resources/audios/winged_scapula_b3.mp3`](resources/audios/winged_scapula_b3.mp3)）
- ✅ `rules/` 覆盖内容创作 → 拍摄 → 剪辑 → 成片 → 发布 → 复盘 全流程

---

## 🔧 通用工作原则

- **素材先于脚本**：写脚本前先看 `resources/images/` 和 `resources/videos/` 里有什么
- **同步先于创作**：写脚本前先完成 `resources/docs/` 同步
- **规则先于执行**：每个阶段开工前先读 `rules/<stage>.md`
- **每条事实都可追溯**：视频脚本提到的功能/数据/价格/品牌口吻，都必须能在 `resources/docs/` 找到原文
- **默认不渲染**：永远先 `npm run dev` 让用户在 Studio 里审核，收到"开始渲染"才执行 `npx remotion render`

---

## 📄 License

Remotion 模板部分遵循 Remotion 自身的 [公司授权条款](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md)。本仓库中由七练团队产出的视频代码、文案、素材归七练所有。
