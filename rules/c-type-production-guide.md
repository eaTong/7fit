# C 类七练解码 · 剪辑方向全集

> **Phase 0 必读**：开始制作 C 类视频前，先读本文档，再做具体设计。
> 本文聚合了 video-types.md / copy.md / animation.md / assets.md / bgm.md 等 15 份规则中 C 类的全部规范，**按生产顺序编排**。

---

## 0 · 视觉基因定义

### 0.1 氛围关键词

```
赛博解码 · 产品经理的桌面 · 终端美学 · 控制台思维 · 数据流
暗色基底 · 霓虹点缀 · HUD 界面 · 代码滚动 · 扫描线
理性不做作 · 克制不花哨 · 科技感不游戏感
```

### 0.2 色板

| 用途 | 色值 | CSS 变量 | 使用场景 |
|---|---|---|---|
| 画布背景 | `#0A0A0A` | `--bg` | 全片底色 |
| 强调色 1（焰橙）| `#FF4500` | `--accent-1` | CTA / 关键高亮 / 霓虹边框 |
| 强调色 2（电红）| `#DC143C` | `--accent-2` | 警告 / 数据冲击 / 动作高亮 |
| 终端绿 | `#00FF41` | `--terminal` | 代码 / 终端输出 / 数据流 |
| 赛博紫 | `#8B5CF6` | `--cyber` | HUD 网格 / 辅助信息 / 背景粒子 |
| 数据青 | `#00BCD4` | `--cyan` | 卡片边框 / 数据标签 / 强调线 |
| 文字主色 | `#FFFFFF` | `--text` | 正文 |
| 文字次色 | `#888888` | `--text-dim` | 辅助信息 / 注释 |
| 代码注释灰 | `#6A9955` | `--code-comment` | 代码块中的注释文字 |

### 0.3 字体系统

| 用途 | 字体 | 风格 |
|---|---|---|
| 标题 / 强调文案 | `monospace`（如 JetBrains Mono / Fira Code）| 等宽、终端感 |
| 代码块 | `monospace` + 语法高亮 | 等宽、行号 |
| 字幕 | `sans-serif`（默认）| 清晰可读 |
| HUD 辅助信息 | `monospace` + 半透明 | 等宽、小字 |

> **fontWeight**：标题 bold / 正文 normal / HUD 小字 lighter (300)

---

## 1 · 布局体系

### 1.1 画布

**尺寸**：1080×1920 竖屏（9:16）
**安全区**：上下左右各留 5%（54px / 96px），关键信息放中上部

### 1.2 核心布局：分析态（Analysis Mode）

C 类七练解码默认且唯一的布局。占全片 80%+ 时长。

```
┌──────────────────────────────────┐  ─ ─ y: 0
│  ╔══════ HUD 头栏 ══════╗       │
│  ║  $ 7fit decode v1.0  ║       │  60px HUD header
│  ║  [分析模式]           ║       │  半透明，固定顶部
│  ╚═══════════════════════╝       │  ─ ─ y: 60
│                                  │
│    ┌──────────────────────┐      │
│    │  主内容区              │      │
│    │  ─ 代码块 / 终端     │      │  主体 55%
│    │  ─ 功能截图 / 卡片   │      │  y: 60 ~ y: 1116
│    │  ─ HUD 数据展示       │      │  内容区域
│    │  ─ 数据可视化         │      │
│    └──────────────────────┘      │  ─ ─ y: 1116
│                                  │
│  ┌──── 底部信息栏 ────┐         │
│  │  [状态] [进度] [>_] │         │  48px status bar
│  └─────────────────────┘         │  ─ ─ y: 1164
│                                  │
│  ░░░░ 字幕区域 ░░░░░            │  120px subtitles
│  ░░░░░░░░░░░░░░░░░░░░           │  y: 1164 ~ y: 1284
│                                  │
│  ▒▒▒▒ 背景健身视频 ▒▒▒▒         │  渗透全屏
│  (desaturated, 40% opacity)      │  始终在底层
└──────────────────────────────────┘  ─ ─ y: 1920
```

#### 布局参数

| 区域 | y 起始 | 高度 | 内容 |
|---|---|---|---|
| HUD 头栏 | 0 | 60px | 固定标题 + 状态指示 |
| **主内容区** | 60 | **~1056px** | 核心内容（代码/卡片/HUD）|
| 底部信息栏 | 1116 | 48px | 终端状态 / loading / 进度 |
| 字幕区 | 1164 | 120px | 文字字幕 |
| 背景视频 | 0 | 1920px | 全画布底层穿透 |

### 1.3 辅助布局：故事态（Story Mode）

用于"创始人视角"方向，占全片 ≤ 20% 时长。

```
┌──────────────────────────────────┐
│   ╔══ HUD overlay ═══╗          │
│   ║  创始人视角       ║          │
│   ╚═══════════════════╝          │
│                                  │
│        ┌──────────┐              │
│        │  口播视频  │              │  口播居中
│        │  正方形    │              │  尺寸 540×540
│        │  50%×画布  │              │  object-fit: cover
│        └──────────┘              │  圆角 16px
│                                  │  四周有霓虹描边
│    "皮质醇过载后，一个 PM         │
│     的健身自救"                   │  字幕叠在视频上
│                                  │
│  ░░░░ 字幕区域 ░░░░░            │
└──────────────────────────────────┘
```

> 故事态只在"创始人视角"段使用。其余三个方向（造轮子/健脑/手术刀）全程使用 **分析态**。

### 1.4 布局切换规则

| 方向 | 默认布局 | 是否切故事态 |
|---|---|---|
| 造轮子 | 分析态 100% | ❌ |
| 健脑 | 分析态 100% | ❌ |
| 手术刀 | 分析态 100% | ❌ |
| 创始人视角 | 分析态 70% → **故事态 30%** | ✅ 末段切 |

---

## 2 · 分层渲染体系（图层栈）

从底层到顶层：

| 层 | z-index | 内容 | 实现 |
|---|---|---|---|
| **L0 · 背景层** | 0 | 健身视频（50% 去饱和 + 40% 不透明度 + 微高斯模糊）| `<OffthreadVideo>` + CSS filter |
| **L1 · 氛围层** | 1 | HUD 网格 + 扫描线 + 粒子 | CSS overlay + code render |
| **L2 · 内容层** | 2 | **核心区域**（代码/卡片/HUD 数据）| React components |
| **L3 · 信息层** | 3 | 顶部状态栏 + 底部终端行 | React components |
| **L4 · 文字层** | 4 | 标题 / 强调文案 / 数据标注 | `<Text>` |
| **L5 · 字幕层** | 5 | 字幕（非 highlight 透明底）| subtitles component |
| **L6 · 动效层** | 6 | 入场动效 / 转场 / highlight | `interpolate` + `spring` |

### 2.1 各层详细实现

#### L0 · 背景层

```tsx
// 健身视频作为全片背景，始终在底层
<AbsoluteFill style={{ zIndex: 0 }}>
  <OffthreadVideo
    src={staticFile("videos/020_broll_gym.webm")}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
      filter: "saturate(0.5) brightness(0.3) blur(2px)",
      opacity: 0.4,
    }}
  />
</AbsoluteFill>
```

> 背景视频贯穿全片，不做切换。用于"健身"锚点——观众任何时候都记得这是健身内容。
> 素材来源：用户自拍训练 B-roll 或 mmx 生成。

#### L1 · 氛围层

```tsx
// HUD 网格覆盖层
const HudGrid: React.FC = () => (
  <div style={{
    position: "absolute", top: 0, left: 0,
    width: "100%", height: "100%",
    backgroundImage: `
      linear-gradient(rgba(139, 92, 246, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(139, 92, 246, 0.03) 1px, transparent 1px)
    `,
    backgroundSize: "60px 60px",
    zIndex: 1,
    pointerEvents: "none",
  }} />
);

// 扫描线
const ScanLine: React.FC<{ frame: number }> = ({ frame }) => {
  const opacity = interpolate(
    Math.sin(frame * 0.02),
    [-1, 1],
    [0.02, 0.06],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return (
    <div style={{
      position: "absolute", top: 0, left: 0,
      width: "100%", height: "100%",
      background: `repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0, 0, 0, 0.1) 2px,
        rgba(0, 0, 0, 0.1) 4px
      )`,
      opacity,
      zIndex: 1,
      pointerEvents: "none",
    }} />
  );
};
```

> HUD 网格 + 扫描线 + 微量粒子 ≈ C 类视觉"气味"。但 **不能喧宾夺主**——opacity 控制在 0.02-0.06。

#### L2 · 内容层（核心）

内容层是 C 类视频的灵魂。根据 4 个方向有不同的内容组件：

| 方向 | L2 主组件 | 辅助组件 |
|---|---|---|
| 造轮子 | `CodeBlock`（语法高亮代码块）| `DecisionTree`（决策树图）|
| 健脑 | `ComparisonCard`（功能对比卡）| `DataViz`（数据可视化）|
| 手术刀 | `FeatureDemo`（操作截图轮播）| `FlowChart`（架构流程图）|
| 创始人视角 | `FounderNote`（故事文字卡）| `Timeline`（时间线）|

**通用组件规范**：
- 所有内容卡片加入场动效：`spring()` 0.3s
- 卡片默认半透明背景 `rgba(10,10,10,0.88)` + `backdropFilter: blur(8px)` + `border: 1px solid rgba(255,69,0,0.3)`
- 卡片四周有**霓虹角标**（4 个小短角）

**霓虹角标实现**：

```tsx
// 卡片四角的霓虹角标（纯 CSS）
const cornerStyle = (position: "tl" | "tr" | "bl" | "br"): React.CSSProperties => {
  const base = {
    position: "absolute" as const,
    width: 16, height: 16,
    borderColor: "#FF4500",
  };
  switch (position) {
    case "tl": return { ...base, top: -2, left: -2, borderTop: "2px solid", borderLeft: "2px solid" };
    case "tr": return { ...base, top: -2, right: -2, borderTop: "2px solid", borderRight: "2px solid" };
    case "bl": return { ...base, bottom: -2, left: -2, borderBottom: "2px solid", borderLeft: "2px solid" };
    case "br": return { ...base, bottom: -2, right: -2, borderBottom: "2px solid", borderRight: "2px solid" };
  }
};
```

---

## 3 · 动效系统

### 3.1 入场动效（每镜起始）

| 动效 | 时长 | CSS 实现 | 适用元素 |
|---|---|---|---|
| **终端打字** | 0.3s/字 | `interpolate` + 逐字 opacity | 代码块 / 终端文本 |
| **fade+slideUp** | 0.5s | `translateY(40→0)` + `opacity(0→1)` | 卡片 / 截图 |
| **spring 弹入** | 0.4s | `spring()` → scale(0.8→1) | 数据数字 / 强调词 |
| **glitch 入场** | 0.2s | R/G/B 3 层偏移 + clip | HUD 状态变化 / 关键揭示 |
| **扫描入场** | 0.5s | clip-path 从左到右扫描 | 代码块 / 数据表 |
| **光标闪烁** | 持续 | `opacity` sin 波 500ms 周期 | 终端光标 |

### 3.2 退场动效（每镜结束，转场前半段）

| 动效 | 时长 | 适用 |
|---|---|---|
| **fadeOut** | 0.3s | 普通段结束 |
| **slideLeft 推出** | 0.4s | 内容切换 |
| **glitch 消散** | 0.3s | 关键转场 / 段间分隔 |

### 3.3 转场动效（镜间过渡）

转场分为两半：**前镜退场+后镜入场**，总时长 0.6s。

| 转场类型 | 总时长 | 前镜退场 | 后镜入场 | 适用段间 |
|---|---|---|---|---|
| **wipe-h** | 0.6s | 3 条水平线扫出 | 内容同步装入 | 段 → 段（通用）|
| **wipe-v** | 0.6s | 3 条垂直线扫出 | 同左 | 段 → 段（通用）|
| **glitch+色差** | 0.4s | R/G/B 错位→恢复+新内容 | — | 关键揭示 / CTA 切出 |
| **scan 扫描** | 0.5s | 内容从左到右被扫描线覆盖 | 新内容跟在扫描线后 | 代码段→分析段 |
| **fade** | 0.4s | 简单淡出 | 淡入 | 故事态→分析态 |

```tsx
// Wipe-h 转场实现
const WipeH: React.FC<{ frame: number; duration: number }> = ({ frame, duration }) => {
  const progress = interpolate(frame, [0, duration], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  // 3 条扫描线，每条覆盖 33% 高度
  return (
    <>
      <div style={{ clipPath: `inset(0 ${(1 - progress) * 100}% 66% 0)`, transition: "none" }}>
        {/* 旧内容 */}
      </div>
      <div style={{ clipPath: `inset(33% ${(1 - progress) * 100}% 33% 0)` }}>
        {/* 旧内容 */}
      </div>
      <div style={{ clipPath: `inset(66% ${(1 - progress) * 100}% 0 0)` }}>
        {/* 旧内容 */}
      </div>
      {/* 新内容在旧内容扫出后显示 */}
      <div style={{ opacity: progress > 0.8 ? 1 : 0 }}>
        {/* 新内容 */}
      </div>
    </>
  );
};
```

### 3.4 动效时序总表

```
镜 N 开始             镜 N 结束/转场         镜 N+1 开始
├── 入场动效 0.3-0.5s ──┤── 主体内容 ──┤── 退场 0.3s ──┤── 入场 ──┤
                        ↑              ↑
                    highlight 弹出    pause_breath
                    (0.2s spring)    (0.5-0.7s 内容暂停)
```

### 3.5 Highlight 动效（每镜内）

每镜弹出 1-2 个 highlight 元素（强调词 / 数据 / 关键结论）。

```tsx
// Highlight spring 弹跳
const highlightScale = spring({
  frame: frame - highlightStartFrame,
  fps: 30,
  config: { damping: 12, stiffness: 200 },
});
// → scale(0.8 → 1.1 → 1.0) 弹跳感
```

| highlight 类型 | 动效 | 同时 SFX |
|---|---|---|
| 关键数字 | spring 弹入 + 放大 1.15× | `pop.mp3` |
| 文字结论 | fadeIn + 色彩变换（#FF4500） | — |
| 函数名/变量 | 终端绿高亮 + 光标 | — |
| CTA 按钮 | 霓虹边框渐变 + pulse | `click.mp3` |

---

## 4 · 5 种内容方向的组件模板

### 4.1 造轮子 —— 代码/终端组件

```
┌──────────────────────────────────┐
│  ╔══ $ terminal ═══╗            │
│  ║ > git log --oneline ║        │  终端模拟器
│  ║ a1d3f7f feat: 3秒记录 ║     │  顶部有终端标题栏
│  ║ b2c8e4a refactor: 表单→NLU║ │  (红黄绿三圆点)
│  ║ c3f9b5d init MVP ║           │
│  ╚══════════════════════╝        │
│                                  │
│  ┌── 决策树 ──────────────────┐  │
│  │  表单 vs 自然语言            │  │  决策对比表
│  │  ├─ 表单: 5-6 次点击/组    │  │  左：旧方案（灰色）
│  │  └─ NLU: 1 句话搞定        │  │  右：新方案（橙色高亮）
│  └────────────────────────────┘  │
│                                  │
│  ░ 结论: "用户会偷懒 →          │  结论行
│  ░ 不要和人性做对抗"            │  终端绿
└──────────────────────────────────┘
```

**组件清单**：

| 组件 | 实现方式 | 参数 |
|---|---|---|
| `Terminal` | 模拟终端窗口，标题栏+内容区 | lines: string[], typingSpeed: number |
| `CodeBlock` | 语法高亮代码（手动 token 着色）| code: string, lang: string |
| `DecisionTree` | 左右对比卡，spring 弹入 | leftTitle, rightTitle, items[] |
| `ConclusionLine` | 底部终端绿结论，打字机效果 | text: string |

### 4.2 健脑 —— 认知对比卡

```
┌──────────────────────────────────┐
│  用产品思维去健身                  │  标题 HUD
│                                  │
│  ┌──── 健身 ────┐ ┌──── 产品 ────┐│
│  │ 练了半年没进步│ │ 数据驱动迭代  ││  左右对照
│  │ 不知道哪里错  │ │ A/B 测试思维  ││  健身（左，灰）
│  │ 凭感觉加重量  │ │ 北极星指标    ││  产品（右，橙）
│  └──────────────┘ └──────────────┘│
│                                  │
│  ░ 认知升级 1: 训练记录 = 埋点   │  结论 1
│  ░ 认知升级 2: 周复盘 = 数据报告 │  结论 2
│  ░ 认知升级 3: PR 跟踪 = 北极星 │  结论 3
└──────────────────────────────────┘
```

### 4.3 手术刀 —— 功能拆解

```
┌──────────────────────────────────┐
│  3 秒记录 · 数据流                │  标题
│                                  │
│  ┌─ Step 1 ──────────────────┐  │
│  │ 语音 → 自然语言解析       │  │  步骤卡 1
│  │ [说话] → [NLP] → [结构]  │  │  带箭头连线
│  └──────────────────────────┘  │
│         ↓                       │  箭头过渡
│  ┌─ Step 2 ──────────────────┐  │
│  │ 结构化数据 → 写入存储      │  │  步骤卡 2
│  │ 动作:卧推 重量:80 组:5 次:8│  │
│  └──────────────────────────┘  │
│         ↓                       │
│  ┌─ Step 3 ──────────────────┐  │
│  │ 自动关联 → 更新周报 PR    │  │  步骤卡 3
│  │ 卧推 PR: 80kg 5x8 (+2.5) │  │  数据橙色强调
│  └──────────────────────────┘  │
└──────────────────────────────────┘
```

### 4.4 创始人视角 —— 故事卡

```
┌──────────────────────────────────┐
│  ╔══ 创始人笔记 ═══╗            │
│  ╚═══════════════════╝          │
│                                  │
│  "练了 2 年                      │  大号引文
│   皮质醇过载                     │  fontSize: 36
│   2 周睡不着觉                   │  终端绿
│   才意识到需要量化训练"          │
│                                  │
│  ──────────────                  │  分割线
│  健身最大的成本不是动作不标准     │  结论（次色）
│  是事后才知道自己哪里错了         │
│                                  │
│  [ ➡ 听我讲完整故事 ]           │  CTA 按钮（霓虹边框）
└──────────────────────────────────┘
```

### 4.5 收尾 CTA（所有方向通用）

```
┌──────────────────────────────────┐
│                                  │
│                                  │
│             本文总结              │  总结文字
│     3 秒记录 = 懒人最优解        │
│    → 不和人性的懒惰做对抗        │
│                                  │
│  ┌──────────────────────┐       │
│  │  想试 7fit？          │       │  CTA 卡片
│  │  评论区告诉我你的训练  │       │  霓虹角标
│  │  我来帮你分析数据     │       │  终端绿边框
│  └──────────────────────┘       │
│                                  │
│  关注我，下期讲数据怎么自动分析   │  双 CTA 第二句
│                                  │
│  ░ 7fit · 让健身更简单 ░        │  品牌行
└──────────────────────────────────┘
```

---

## 5 · 素材清单

### 5.1 按方向分的素材需求

| 方向 | P0（必做）| P1（重要）| P2（可选）|
|---|---|---|---|
| **造轮子** | 终端录屏 / 代码截图 | 决策对比图 | 架构流程图 |
| **健脑** | 功能截图 / 数据图 | 认知对照卡 | 背景动效 |
| **手术刀** | 操作录屏 / 流程截图 | 时序图 | 数据流动画 |
| **创始人视角** | **创始人口播视频** | 故事文字卡 | 时间线 |

### 5.2 通用素材（所有方向共用）

| 素材 | 来源 | 用途 |
|---|---|---|
| 健身 B-roll 视频 | 用户自拍 / mmx | 全片背景（L0）|
| HUD 网格覆盖 | 代码渲染（CSS）| L1 氛围层 |
| 扫描线效果 | 代码渲染（CSS）| L1 氛围层 |
| Cyber Pulse BGM | mmx 生成 | 全片 BGM |
| whoosh SFX | `sfx/whoosh.mp3` | 转场 |
| click SFX | `sfx/click.mp3` | CTA |
| pop SFX | `sfx/pop.mp3` | highlight |

### 5.3 建议的目录结构

```
remotion/public/<主题>/
├── videos/
│   ├── 020_broll_gym.webm      # 健身背景（全片）
│   ├── 010_terminal_recording.webm  # 终端录屏
│   └── 020_talking_head.webm   # 创始人口播（可选）
├── images/
│   ├── 100_feature_card_1.png
│   ├── 101_feature_card_2.png
│   └── 102_data_viz.png
└── audios/
    ├── bgm/cyber_pulse_sci_fi.mp3
    └── sfx/{whoosh,pop,click,glitch}.mp3
```

---

## 6 · BGM + 音效设计

### 6.1 BGM 选型

| 档位 | 方向 | BGM | BPM | 说明 |
|---|---|---|---|---|
| **主 BGM** | 造轮子/健脑/手术刀 | Cyber Pulse 增强版 | 100 | synthwave + 琶音序列 + 模拟合成器 |
| **故事 BGM** | 创始人视角段 | Quiet Think | 80 | ambient 钢琴，降低心率 |
| **CTA** | 收尾 3s | Cyber Pulse 增强到 105 | 105 | 略提速，制造紧迫感 |

### 6.2 BGM 分段 cue

```typescript
// C 类 BGM 分段 cue（假设全文 70s）
const bgmCues = [
  { start: 0, end: 3,   intensity: "intro",   desc: "钩子段，fade in + 弱琶音" },
  { start: 3, end: 45,  intensity: "steady",  desc: "主体分析，Cyber Pulse 标准强度" },
  { start: 45, end: 55, intensity: "dip",     desc: "创始人故事段，切 Quiet Think" },
  { start: 55, end: 63, intensity: "build",   desc: "收尾，回到 Cyber Pulse + 鼓机渐强" },
  { start: 63, end: 70, intensity: "outro",   desc: "CTA + fade out 3s" },
];
```

### 6.3 SFX 时间表

| 位置 | SFX | 时长 | 音量 |
|---|---|---|---|
| 镜头入场 | `whoosh.mp3` | 0.3s | 0.5 |
| highlight 弹出 | `pop.mp3` | 0.2s | 0.6 |
| 转场（wipe/glitch）| `whoosh.mp3` | 0.4s | 0.5 |
| 数据数字变化 | `click.mp3` | 0.1s | 0.3 |
| CTA 按钮 | `click.mp3` | 0.2s | 0.5 |
| glitch 转场 | `glitch.mp3`（可选）| 0.3s | 0.4 |
| 段间停顿 | 无 | — | — |

---

## 7 · 文案 + 字幕规范

### 7.1 文案结构（4 方向通用）

```
[钩子 3s]    反常识/身份代入——"我做了 3 年产品，发现一个反常识的事"
[造轮子 15s] 设计决策推理——"为什么不用表单？因为..."
[健脑 15s]   认知升级——"产品经理看健身，3 个思维模型"
[手术刀 15s] 功能拆解——"3 秒记录的数据流是这样的..."
[创始人视角] 故事收束（可选）——"为什么一个 PM 要做健身工具"
[收尾 CTA]   双 CTA——"评论区告诉我 + 关注我下期见"
```

### 7.2 违禁词自检

C 类特殊注意（在 copy.md §12.1.14-15 基础上强化）：

```
❌ "创业 / 创业公司 / 团队 / 融资" → ✅ "个人项目 / 自己做 / 边上班边搞"
❌ "颠覆 / 极致 / 行业第一" → ✅ "我目前试下来 / 我自己的解法"
❌ "比 Keep / 比训记 / 比 XX" → ✅ "我之前用的方式 / 以前试过的工具"
❌ "治愈/治疗/降三高" → ✅ "辅助/改善/激活"
❌ "加微信 / 扫码" → ✅ "评论区 / 主页 / 7fit 小程序"
```

### 7.3 字幕样式

```
┌──────────────────────────────────┐
│                                  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░     │
│  ░░ 我做了 3 年产品经理       ░░ │  默认字幕
│  ░░ 发现一个反常识的事         ░░ │  白色，居中
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░     │  fontSize: 36
│                                  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░     │  highlight 字幕
│  ░░ 反常识的事                  ░░ │  #FF4500 强调色
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░     │  字号 42，加粗
│                                  │
│  ░░ 3秒记录 ─ 推荐              ░░ │  代码风格字幕
│  ░░ #00FF41 终端绿              ░░ │  技术/功能名用
└──────────────────────────────────┘
```

---

## 8 · 视频分镜模板（10 镜，70s 全文）

| 镜号 | 时长 | 内容 | 布局 | L2 组件 | 转场入 | 转场出 | 音效 |
|---|---|---|---|---|---|---|---|
| **0 钩子** | 0-3s | "我做了 3 年产品发现一个反常识的事" | 分析态 | `Terminal` 打出钩子句 | fade in | scan | — |
| **1 问题** | 3-10s | "表单记录要 5-6 下，没人坚持得了" | 分析态 | `DecisionTree` 对比 | scan | wipe-h | whoosh |
| **2 推理** | 10-20s | "所以改用自然语言 1 句话搞定" | 分析态 | `CodeBlock` 核心代码 | wipe-h | wipe-h | whoosh |
| **3 认知** | 20-30s | "产品思维 × 健身的 3 个升级" | 分析态 | `ComparisonCard` | wipe-h | wipe-h | — |
| **4 数据** | 30-37s | "周报 AI 怎么自动分析" | 分析态 | `DataViz` 图表 | wipe-v | scan | whoosh |
| **5 链路** | 37-45s | "从语音到结构化数据的完整链路" | 分析态 | `FlowChart` | scan | glitch | glitch |
| **6 故事** | 45-52s | "为什么做这个——皮质醇的故事" | 故事态 | `FounderNote` | glitch+色差 | fade | pop |
| **7 总结** | 52-58s | "核心结论回放" | 分析态 | `ConclusionLine` | fade | wipe-v | — |
| **8 CTA** | 58-65s | "评论区告诉我 + 关注我" | 分析态 | CTA 卡片 | wipe-v | — | click |
| **9 尾帧** | 65-70s | "7fit · 让健身更简单" + 品牌 | 分析态 | 品牌文字 + 二维码 | fade | fade out 3s | BGM fade |

> 这是"造轮子"方向的模板。其他方向可替换 L2 组件、调整段长，但 **总镜数 10 ± 2**、**总时长 60-90s** 不变。

---

## 9 · 技术实现备忘

### 9.1 Remotion 组件架构建议

```
src/scenes/<主题>/
├── index.tsx                // Composition，注册进 Root.tsx
├── components/
│   ├── CTypeLayout.tsx      // 分析态布局容器（含 L0/L1 背景+氛围）
│   ├── StoryLayout.tsx      // 故事态布局容器
│   ├── Terminal.tsx         // 终端模拟器
│   ├── CodeBlock.tsx        // 代码块
│   ├── DecisionTree.tsx     // 决策对比卡
│   ├── ComparisonCard.tsx   // 认知对照卡
│   ├── DataViz.tsx          // 数据可视化
│   ├── FlowChart.tsx        // 流程图
│   ├── ConclusionLine.tsx   // 结论行（打字机）
│   ├── HudOverlay.tsx       // HUD 网格覆盖
│   ├── ScanLine.tsx         // 扫描线
│   └── TransitionEffects.tsx // 转场动效（wipe/glitch/scan）
├── storyboard.md            // 分镜
├── subtitles.json           // 字幕
└── assets.md                // 素材清单
```

### 9.2 核心动效函数

```tsx
// 终端打字效果
function typewriterText(frame: number, text: string, startFrame: number, speed: number = 3): string {
  const charsPerFrame = speed / 30; // speed = 字/秒
  const visibleChars = Math.floor(Math.max(0, frame - startFrame) * charsPerFrame);
  return text.slice(0, visibleChars);
}

// 光标闪烁
function cursorBlink(frame: number): number {
  return Math.sin(frame * 0.2) > 0 ? 1 : 0;
}

// glitch 效果 - R/G/B 通道偏移
function glitchOffset(frame: number, intensity: number = 5): { r: number; g: number; b: number } {
  const t = Math.sin(frame * 0.5);
  return {
    r: Math.floor(t * intensity),
    g: Math.floor(Math.sin(frame * 0.7) * intensity),
    b: Math.floor(Math.cos(frame * 0.3) * intensity),
  };
}
```

### 9.3 性能注意事项

- **禁止**每帧重渲染的粒子系统（大量 div 同时变化）
- 代码块 pre-render 为图片再播放，不逐字实时渲染（逐字改为计算可见长度，不是创建/销毁 DOM）
- HUD 网格用 CSS `background-image` gradient（纯 GPU）
- 扫描线用 CSS `repeating-linear-gradient` + `opacity`（纯 GPU）
- 转场用 `clip-path` + CSS transforms（GPU 加速）
- 字体预加载：`<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono" rel="stylesheet">`

---

## 10 · 自检清单

### 开工前

- [ ] 选定 4 方向之一（造轮子/健脑/手术刀/创始人视角）
- [ ] 确认钩子符合 C 类钩子偏好（反常识/身份代入/数字冲击）
- [ ] 确认文案通过违禁词自检（尤其 §12.1.14 创业叙事 / §12.1.15 技术用语）
- [ ] 时间字段对齐：C 类主体 60s / 全文 60-90s / 慢速 2.5
- [ ] 素材清单确认：功能截图/代码/HUD + 健身背景视频

### 渲染前

- [ ] L0 健身背景视频已就位（贯穿全片，不切换）
- [ ] L1 HUD 网格 + 扫描线已覆盖（opacity ≤ 0.06）
- [ ] L2 内容组件已就位（代码块/卡片/流程图）
- [ ] 转场动画已装配（wipe-h/wipe-v/glitch）
- [ ] BGM = Cyber Pulse 增强版（带 section cue）
- [ ] 字幕样式已适配 C 类（终端绿 + 高亮橙）
- [ ] 双 CTA 已实现（引流到产品 + 关注创作者）
- [ ] 所有数字/功能出处可追溯（`docs/` 中有原文）
