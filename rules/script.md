# 脚本生成规范（script.md）

> **Phase 2 入口**：文案确认后，按本规范实现 Scene 组件 → 写 components/ → 写 Scene 编排（index.tsx + Shot 组件）。
>
> **必须遵循**：[timing-sync.md](timing-sync.md)（时间字段锚点）+ [copy.md §15 下游接口](copy.md#15-下游接口说明)（文案稿字段→下游流向）
>
> **7fit 动效哲学**：**快进 + 留白 + 强调**——3 类基本节奏（详 §4.1）。所有动效都围绕"3 秒抓人 + 1 秒消化"展开。

---

## 2 · 入口与目录结构

### 2.1 入口文件

| 文件 | 位置 | 作用 |
|---|---|---|
| **Root.tsx** | `remotion/src/Root.tsx` | Composition 注册入口（`<Composition id="..." component={...} />`）|
| **index.ts** | `remotion/src/index.ts` | `registerRoot()` 入口 |
| **index.css** | `remotion/src/index.css` | Tailwind/全局样式 + 7fit 色板 CSS 变量 |

### 2.2 每个视频一个独立 scene 目录

```
remotion/src/scenes/<主题>/
├── index.tsx          # Scene 主组件（useCurrentFrame + interpolate）
├── subtitles.json     # 自动生成的字幕
├── storyboard.md      # 分镜表
├── storyboard.json    # 分镜数据
├── assets.md          # 素材清单
├── research.md        # 主题调研
├── shoot-checklist.md # 拍摄清单
└── components/        # 每镜一组件（Shot<N>_<描述>.tsx）
```

> **强制门**：实现 Scene 组件之前，§11 的 5 项必查全部 ✅。

---

## 3 · 安全区硬约束（防遮挡）

| 区域 | 最小留白 | 原因 |
|---|---|---|
| **顶部** | ≥ 120px | 适配手机摄像头 / 平台 UI |
| **左/右** | ≥ 64px | 适配手机圆角 / 异形屏 |
| **底部** | ≥ 80px | 给字幕留位 |
| **文字最小字号** | **≥ 24px** | 移动端可读，防止糊成一片 |

> **可视化对照**（1080×1920 画布）：

```
┌──────────────────┐  ← 0px
│  顶部安全区 120px │  ⚠️ 不放标题/CTA
├──────────────────┤
│                  │
│   可用区          │
│   (1700×952)     │
│                  │
├──────────────────┤
│  底部字幕区 80px  │  字幕位置
└──────────────────┘  ← 1920px
```

---

## 4 · 设计风格硬约束

### 4.1 段落标题（2026-06-06）

每个脚本段落必须有独立标题，**顶部居左**：
- 位置：≥ 120px top, ≥ 64px left
- 样式：48-64px / 纯白 `#FFFFFF` / bold

### 4.2 卡片位置（2026-06-06）

信息卡片（数据/CTA/动作说明/计时器）统一显示在**右上角**：
- 位置：≥ 120px top, ≥ 64px right
- 同一时刻只 1 张

### 4.3 段间停顿（2026-06-06）

见 [timing-sync.md §段间停顿](timing-sync.md#段间停顿规范-05-1s用户硬约束)。禁止切换其他素材 / 纯字幕 / 装饰卡片。

### 4.4 配色（7fit 色板）

| 用途 | 色值 | 备注 |
|---|---|---|
| 画布背景 | `#0A0A0A` | **唯一允许的"实色背景"**，仅用于页面/Scene 底层 |
| 强调色 1 | `#FF4500` | 烈焰橙（CTA / 关键数据 / **元素半透明背景色源**）|
| 强调色 2 | `#DC143C` | 电红（动作/警示 / **元素半透明背景色源**）|
| 文字主色 | `#FFFFFF` | **标题/正文都用纯白** |
| 文字次色 | `#888888` | 辅助说明 |
| 边框色 | `#333333` | — |

### 4.5 元素背景（强调色 + 透明度）

- ⚠️ **元素背景禁止使用实色**（`#1A1A1A` / `#252525` / `#FFFFFF` 等已废弃做元素背景）
- ✅ 必须用强调色 1/2 叠加透明度：
  - `rgba(255, 69, 0, 0.10)` — 橙色 10%（卡片背景）
  - `rgba(220, 20, 60, 0.15)` — 红色 15%（警示背景）

### 4.6 设计调性

- **科技感 + 力量感**（粗描边、几何、霓虹、数据冲击、硬朗圆角）
- **转场**：每个视频必须有转场，时长 **≥ 0.3s**，优先 Crossfade / Push / 方向滑动
- **素材框**：半透明彩色 + 同色系（橙/红）边框/背景，禁用纯白/纯灰做素材框背景

---

## 5 · 转场规范

### 5.1 5 类转场速查

| 类型 | 时长 | 适用场景 | ease |
|---|---|---|---|
| `fade` | 0.4s | 通用，柔和 | `power2.inOut` |
| `push_left` / `push_right` | 0.4s | 时间推进感 | `power2.inOut` |
| `slide_up` / `slide_down` | 0.4s | 新段落开始 | `power2.out` |
| `pause_breath` | 0.5-1s | 段间停顿（必用 0.8× 慢动作 / 1.2× 加速 / 特写）| 见 [§5.2](#52-pause_breath-4-种实现) |
| `zoom` | 0.5s | 强调重点 | `back.out(1.7)` |
| ❌ flip / 旋转 / 3D | — | 与"力量感"调性冲突，禁用 | — |

### 5.2 pause_breath 4 种实现

> **铁律**：pause_breath 必须**延长上一个视频**，禁止切换其他素材 / 纯字幕 / 装饰卡片。

```tsx
// 0.8× 慢动作 → playbackRate prop
<OffthreadVideo
  src={staticFile(videoSrc)}
  playbackRate={0.8}
  style={{ width: "100%", height: "100%", objectFit: "cover" }}
/>

// 1.2× 加速 → playbackRate prop
<OffthreadVideo
  src={staticFile(videoSrc)}
  playbackRate={1.2}
  style={{ width: "100%", height: "100%", objectFit: "cover" }}
/>

// 特写（zoom in 1.2×）→ interpolate scale
const scale = interpolate(frame, [0, 21], [1, 1.2], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: Easing.out(Easing.cubic),
});

// freeze frame（定格）→ 用 Img 替代 Video
<Img
  src={staticFile(lastVideoFrame)}
  style={{ width: "100%", height: "100%", objectFit: "cover" }}
/>
```

### 5.3 转场选型决策树

```
新段落开始？
├─ 是 → slide_up / slide_down（0.4s）
├─ 否，时间推进 → push_left / push_right（0.4s）
├─ 否，主题延续 → fade（0.4s）
├─ 是段间停顿 → pause_breath（0.5-1s，4 选 1）
└─ 需要强调重点 → zoom（0.5s）
```

---

## 6 · 静态资源加载（使用 `staticFile()`）

```tsx
import { staticFile, Video, Img } from "remotion";

// 视频：使用 <Video> 或 <OffthreadVideo> 组件
<OffthreadVideo
  src={staticFile("videos/卧推80KG_10.mov")}
  style={{ width: "100%", height: "100%", objectFit: "cover" }}
/>

// 图片：使用 <Img> 组件
<Img
  src={staticFile("images/翼状肩胛自测.png")}
  style={{ width: "100%", height: "100%" }}
/>
```

> **注意**：Remotion 中静态资源必须放在 `remotion/public/` 目录，使用 `staticFile()` 引用。

---

## 7 · 组件模板库（7 类常用组件）

> **铁律**：**每个 shot 拆成独立组件**（`components/Shot<N>_<描述>.tsx`），不要在 `index.tsx` 写满全部内容。
>
> 原因：组件化 → 复用 + 单测 + 调试效率。

### 7.1 标题组件

```tsx
// components/Shot0_Hook_Title.tsx
import { useCurrentFrame, interpolate, Easing } from "remotion";

export const Shot0_Hook_Title: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const y = interpolate(frame, [0, 15], [30, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div style={{ opacity, transform: `translateY(${y}px)` }}>
      <h2 style={{ color: "#FFFFFF", fontSize: 48 }}>
        你以为靠墙就能改翼状肩？
      </h2>
    </div>
  );
};
```

### 7.2 卡片组件（信息卡 / 数据卡 / CTA 卡）

```tsx
// components/Shot2_Action_CountCard.tsx
import { useCurrentFrame, interpolate, Easing } from "remotion";

export const Shot2_Action_CountCard: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(frame, [0, 12], [0.9, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.4)),
  });

  return (
    <div style={{
      opacity,
      transform: `translateX(50px) scale(${scale})`,
      position: "absolute",
      top: 120,
      right: 64,
    }}>
      <div style={{ color: "#FF4500", fontSize: 64 }}>12</div>
      <div style={{ color: "#FFFFFF", fontSize: 24 }}>次 × 3 组</div>
    </div>
  );
};
```

### 7.3 视频组件

```tsx
// components/Shot1_SelfTest_Video.tsx
import { OffthreadVideo, useCurrentFrame, interpolate, Easing } from "remotion";

export const Shot1_SelfTest_Video: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(frame, [0, 15], [0.95, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <OffthreadVideo
      src={staticFile("videos/自测_01.mov")}
      style={{ width: "100%", height: "100%", opacity, transform: `scale(${scale})` }}
    />
  );
};
```

### 7.4 字幕组件

```tsx
// components/Shot1_Subtitle.tsx
import { useCurrentFrame, interpolate, Easing } from "remotion";

export const Shot1_Subtitle: React.FC<{ text: string; highlight?: string }> = ({
  text, highlight
}) => {
  const frame = useCurrentFrame();
  const highlightFrame = frame - 10; // highlight 在第 10 帧开始
  const scale = interpolate(highlightFrame, [0, 8], [1, 1.15], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.7)),
  });

  return (
    <div style={{
      position: "absolute",
      bottom: 80,
      left: "50%",
      transform: "translateX(-50%)",
      textAlign: "center",
    }}>
      <span style={{ color: "#FFFFFF", fontSize: 32 }}>{text}</span>
      {highlight && (
        <span style={{ color: "#FF4500", fontSize: 36, fontWeight: 700, transform: `scale(${scale})` }}>
          {highlight}
        </span>
      )}
    </div>
  );
};
```

### 7.5 装饰元素（数据可视化 / 进度条 / 时间轴）

```tsx
// components/Shot_DataViz.tsx
import { useCurrentFrame, interpolate, Easing } from "remotion";

export const Shot_DataViz: React.FC = () => {
  const frame = useCurrentFrame();
  const barWidth = interpolate(frame, [20, 50], [0, 60], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.2, 0, 0, 1),
  });

  return (
    <div style={{
      position: "absolute",
      bottom: 200,
      width: "80%",
      height: 8,
      background: "#333",
    }}>
      <div style={{ width: `${barWidth}%`, height: "100%", background: "#FF4500" }} />
    </div>
  );
};
```

### 7.6 段间停顿组件（pause_breath）

> **pause_breath 在 Remotion 中通过 `<Video playbackRate>` 实现**。详见 [animation.md §5](animation.md#5--段间停顿动效pause_breath)。

```tsx
// 在 Shot 组件内通过 playbackRate 控制
<OffthreadVideo
  src={staticFile("videos/动作1.mov")}
  playbackRate={0.8}  // 慢动作
/>
```

### 7.7 CTA 组件（收尾 + 行动号召）

```tsx
// components/Shot4_Outro_CTA.tsx
import { useCurrentFrame, interpolate, Easing } from "remotion";

export const Shot4_Outro_CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 15], [0.8, 1.15], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.4)),
  });

  return (
    <div style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      xPercent: -50,
      yPercent: -50,
      transform: `scale(${scale})`,
      textAlign: "center",
    }}>
      <h2 style={{ color: "#FFFFFF", fontSize: 48 }}>去试试，评论区交作业</h2>
      <div style={{ fontSize: 64 }}>💬</div>
    </div>
  );
};
```

### 7.8 A 类口播态组件（talking head，v4 锁版 · 2026-06-12）

> **A 类专属（v4）**。人物口播时的主屏组件。**主口播视频同一份素材双用**——全屏态正方形居中铺满，左右分栏态正方形缩到左侧 <30%。
>
> **v4 更新（2026-06-12）**：v3 圆形 PIP 已废弃 → v4 左右分栏。

```tsx
// components/TalkingHead.tsx
// 双态：Full Screen（默认）| Split（缩到左侧）
// 视频不停止播放 = 嘴动进度 = 旁白进度 = 字幕进度（三同步）

interface TalkingHeadProps {
  videoSrc: string;
  mode: "full" | "split"; // 受父组件 frame 控制
  transitionFrames?: number;
}

const TalkingHead: React.FC<TalkingHeadProps> = ({
  videoSrc,
  mode,
  transitionFrames = 15, // 0.5s @ 30fps
}) => {
  const frame = useCurrentFrame();

  // 双态布局参数
  const FULL = { left: 420, top: 0, width: 1080, height: 1080 };
  const SPLIT = { left: 0, top: 260, width: 574, height: 574 };

  // 当前状态插值（GSAP power2.inOut 等效）
  const progress = interpolate(frame, [0, transitionFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1), // power2.inOut
  });

  const isFull = mode === "full";
  const target = isFull ? FULL : SPLIT;

  // GSAP.from/to 双态切换 → interpolate
  const left = interpolate(progress, [0, 1], [isFull ? SPLIT.left : FULL.left, target.left]);
  const top = interpolate(progress, [0, 1], [isFull ? SPLIT.top : FULL.top, target.top]);
  const width = interpolate(progress, [0, 1], [isFull ? SPLIT.width : FULL.width, target.width]);
  const height = interpolate(progress, [0, 1], [isFull ? SPLIT.height : FULL.height, target.height]);

  // 羽化描边（全屏态开启，Split 态关闭）
  const showFeathering = isFull;
  const boxShadowOpacity = interpolate(progress, [0, 1], [isFull ? 0 : 1, showFeathering ? 1 : 0]);

  return (
    <AbsoluteFill
      style={{
        position: "absolute",
        left,
        top,
        width,
        height,
        borderRadius: 24,
        overflow: "hidden",
        boxShadow:
          "inset 0 0 30px 8px rgba(10,10,10,0.5), 0 0 80px 40px rgba(10,10,10,0.4)",
      }}
    >
      <OffthreadVideo
        src={staticFile(videoSrc)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </AbsoluteFill>
  );
};
```

> **关键技术**：**不要 pause 视频**。双态切换 = 只改 CSS 位置/大小，**视频不停止播放**。这样视频里"嘴在动"的进度 = 主旁白进度 = 字幕进度，**三同步**。
>
> 详见 [video-types.md §3.2 A 类双态布局 + §3.2.6 四条布局硬约束](video-types.md#32-a-类双态布局新锁版--2026-06-10)

### 7.9 A 类辅助素材组件（visual support，2026-06-10 新增）

> **A 类专属**。当文案提及"看这个""用这个工具"时，辅助素材按"飘浮规则"展示。

```tsx
// components/VisualSupport.tsx
// 飘在右上角：半透明彩色边框 + backdrop blur
// 入场：从右滑入 + 缩放（spring 弹跳）

interface VisualSupportProps {
  imageSrc: string;
  label: string;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  enterFrame?: number; // 入场帧（相对于 Sequence 起点）
}

const VisualSupport: React.FC<VisualSupportProps> = ({
  imageSrc,
  label,
  position = "top-right",
  enterFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const localFrame = Math.max(0, frame - enterFrame);

  // 滑入 + 缩放 spring 动画
  const enterProgress = interpolate(localFrame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const x = interpolate(enterProgress, [0, 1], [100, 0]); // 从右滑入
  const opacity = interpolate(enterProgress, [0, 1], [0, 1]);
  const scale = interpolate(enterProgress, [0, 1], [0.9, 1], {
    easing: Easing.out(Easing.back(2)),
  });

  // 位置布局
  const positions: Record<string, React.CSSProperties> = {
    "top-right": { top: 140, right: 64, left: "auto" },
    "top-left": { top: 140, left: 64, right: "auto" },
    "bottom-right": { bottom: 200, right: 64, top: "auto", left: "auto" },
    "bottom-left": { bottom: 200, left: 64, top: "auto", right: "auto" },
  };

  return (
    <div
      style={{
        position: "absolute",
        width: "60%",
        maxWidth: 600,
        background: "rgba(255, 69, 0, 0.10)",
        border: "2px solid rgba(255, 69, 0, 0.5)",
        borderRadius: 16,
        backdropFilter: "blur(4px)",
        padding: 12,
        zIndex: 10,
        opacity,
        transform: `translateX(${x}px) scale(${scale})`,
        ...positions[position],
      }}
    >
      <Img
        src={staticFile(imageSrc)}
        style={{ width: "100%", borderRadius: 8 }}
      />
      <div
        style={{
          color: "#FFFFFF",
          fontSize: 20,
          marginTop: 8,
          textAlign: "center",
        }}
      >
        {label}
      </div>
    </div>
  );
};
```

> **飘浮规则**详 [video-types.md §3.2.3](video-types.md#323-辅助素材的飘浮规则)

---

## 8 · Scene 编排模板（完整 timeline）

> **Remotion 无需 GSAP timeline**。用 `<Sequence>` 组件按时间顺序排列 Shots，frame = 绝对时间轴位置。
>
> **8 节标准结构**：开场 → 钩子 → 主体（自测/动作 × N）→ 段间停顿 × (N-1) → 收尾 → CTA。

### 8.1 Remotion Scene 完整骨架

```tsx
// <主题>/index.tsx
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  interpolate,
  Easing,
  Img,
  OffthreadVideo,
} from "remotion";
import storyboard from "./storyboard.json";

const FPS = 30;
const TRANSITION_FRAMES = 9; // 0.3s 转场

interface Shot {
  shot_id: string;
  start: number;
  end: number;
  duration: number;
  content_type: string;
  content_source: string | null;
  voiceover: string;
  description: string;
  transition_in: string;
  transition_out: string;
}

export const <SceneName>: React.FC = () => {
  const frame = useCurrentFrame();
  const shots = storyboard.shots as Shot[];

  return (
    <AbsoluteFill style={{ background: "#0A0A0A" }}>
      {/* BGM + Ducking */}
      <Audio
        src={staticFile("bgm/<类型>.mp3")}
        volume={(f) => {
          // Ducking：旁白期间降 volume
          if (f > 90 && f < 270) return 0.15;
          return 0.25;
        }}
      />

      {/* Shots — 按 storyboard 顺序排列 */}
      {shots.map((shot, idx) => {
        const startFrame = Math.round(shot.start * FPS);
        const durationFrames = Math.round(shot.duration * FPS);
        const isLast = idx === shots.length - 1;

        // 计算 exit 延伸（crossfade）
        let paddedDuration = durationFrames;
        if (idx < shots.length - 1) {
          const nextShot = shots[idx + 1];
          const nextStart = Math.round(nextShot.start * FPS);
          const myEnd = startFrame + durationFrames;
          const gap = Math.max(0, nextStart - myEnd);
          paddedDuration += gap + TRANSITION_FRAMES;
        }

        return (
          <Sequence
            key={shot.shot_id}
            from={startFrame}
            durationInFrames={paddedDuration}
            premountFor={1 * FPS}
          >
            <ShotRenderer shot={shot} isLast={isLast} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

/* === Shot 渲染器（按 content_type 分支）=== */
const ShotRenderer: React.FC<{ shot: Shot; isLast: boolean }> = ({ shot, isLast }) => {
  const frame = useCurrentFrame();
  const durationFrames = Math.round(shot.duration * FPS);

  // 转场动画
  const enterProgress = interpolate(frame, [0, TRANSITION_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const exitStart = durationFrames - TRANSITION_FRAMES;
  const exitProgress = isLast
    ? 1
    : interpolate(frame, [exitStart, durationFrames], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.in(Easing.cubic),
      });

  const opacity = Math.min(enterProgress, exitProgress);

  // 按 content_type 渲染
  switch (shot.content_type) {
    case "video":
      return (
        <AbsoluteFill style={{ opacity }}>
          <OffthreadVideo
            src={staticFile(shot.content_source || "")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>
      );

    case "pause_breath": // 段间停顿
      return (
        <AbsoluteFill style={{ opacity }}>
          <Img
            src={staticFile(shot.content_source || "")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>
      );

    case "text_card":
      return (
        <AbsoluteFill
          style={{
            background: "#0A0A0A",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h1 style={{ color: "#FFFFFF", fontSize: 72 }}>{shot.description}</h1>
        </AbsoluteFill>
      );

    default:
      return (
        <AbsoluteFill style={{ background: "#0A0AA" }}>
          <div style={{ color: "#FF4500", fontSize: 32 }}>
            ⚠️ {shot.content_type}
          </div>
        </AbsoluteFill>
      );
  }
};
```

### 8.2 Sequence 时间计算速查

| 场景 | 计算方式 |
|---|---|
| **绝对帧** | `startFrame = Math.round(shot.start * FPS)` |
| **Sequence from** | `from={startFrame}`（绝对时间轴） |
| **paddedDuration** | `durationFrames + gap + TRANSITION_FRAMES`（转场延伸） |
| **premountFor** | `premountFor={1 * FPS}`（防黑屏） |

---

## 9 · A/B/C 三类视频的脚本实现差异化

| 维度 | A 人设 | B 知识 | C 解码 |
|---|---|---|---|
| **每镜时长** | 5-8s（带情绪）| 3-6s（带动作）| 5-8s（带故事性）|
| **镜数（视频时长）** | 8-12 镜（60s）<br>12-18 镜（90s+）| 12-18 镜（60s）<br>18-24 镜（90s+）| 12-18 镜（60-90s）|
| **转场风格** | 柔和（fade / slide_up）+ **双态切换 0.5s** | 紧凑（push_left / zoom）| 赛博解码（wipe/glitch/scanline）|
| **卡片占比** | 30%（数据/动作 overlay）| 50%（次数/组数/RPE）| 50%（功能截图/代码）|
| **入场动效侧重** | 慢（power2.out, 0.5-0.6s）| 中（power2.out, 0.4s）| 科技（spring/glitch, 0.3-0.5s）|
| **highlight 频次** | 低（每镜 0-1 个）| 高（每镜 1-3 个）| 中（每镜 1-2 个）|
| **pause_breath 数** | 2-3 个 | 4-6 个 | 3-5 个 |
| **典型错误** | 入场太慢 / **人脸消失 / 辅助素材全屏替代人脸** | 镜数太多（切换疲劳）| 代码/截图堆砌（信息过载）|

---

## 7.10 · 布局组件规范（2026-06-13）

> **核心原则**：每种布局方式**必须封装为独立组件**，放在 `src/components/` 下，禁止在 Scene 内联实现。

### 7.10.1 为什么需要独立布局组件

1. **复用**：多个视频可能用相同的布局（如 2×2 网格）
2. **可维护**：布局逻辑与内容分离，修改布局不影响 shot 内容
3. **可测试**：独立组件可以单独抽检帧
4. **跨 Scene 共享**：`src/components/` 下的组件可在所有 Scene 间共享

### 7.10.2 布局组件 vs 内容组件

| 类型 | 位置 | 职责 | 示例 |
|---|---|---|---|
| **布局组件** | `src/components/` | 负责**空间排版**，不关心具体内容 | `Grid2x2`、`ThreeQuarters`、`Sidebar` |
| **内容组件** | `scenes/<主题>/components/` | 负责**内容渲染**，依赖布局组件 | `Shot1_Title`、`ActionDataCard` |
| **Scene** | `scenes/<主题>/index.tsx` | 编排 shot + 转场，不直接渲染元素 | — |

### 7.10.3 当前已封装的布局组件

| 组件 | 文件 | 布局描述 |
|---|---|---|
| `Grid2x2` | `src/components/Grid2x2.tsx` | 2×2 网格同屏 4 个视频 |
| `VoiceoverText` | `src/components/VoiceoverText.tsx` | 底部字幕文字 |
| `ActionDataCard` | `src/components/ActionDataCard.tsx` | 右上角动作参数卡 |
| `CTAButton` | `src/components/CTAButton.tsx` | 底部 CTA 按钮 |

### 7.10.4 新增布局组件的标准

当需要实现以下模式之一时，**必须**新建布局组件：

| 布局模式 | 组件名建议 | 说明 |
|---|---|---|
| 上下分栏 | `VerticalSplit` | 上 A / 下 B |
| 左右分栏 | `HorizontalSplit` | 左 A / 右 B |
| 三分屏 | `TripleSplit` | 三区域同屏 |
| 全屏 + 覆盖层 | `Overlay` | 底部字幕 overlay |
| 画中画 | `PictureInPicture` | 小窗在大窗角落 |
| 轮播 | `Carousel` | 多内容轮切 |

### 7.10.5 布局组件规范

```tsx
// ✅ 正确：布局组件只接收简单 props，不依赖 storyboard
interface Grid2x2Props {
  sources: [string, string, string, string];  // 4 个资源
  type?: "video" | "image";
  basePath?: string;
  cellSize?: number;
  gap?: number;
}

// ❌ 错误：布局组件直接依赖 Shot 类型（耦合 storyboard）
interface BadGridProps {
  grid_cells: Array<{ position: string; source: string }>;  // 依赖 Shot 类型
  shot: Shot;  // 布局组件不应该知道 Shot
}
```

### 7.10.6 调用方式

```tsx
// Scene 内
<Grid2x2 
  sources={[a, b, c, d]} 
  type="video" 
  basePath="b14_push_day/videos" 
/>

// 不允许在 Scene 内直接写布局逻辑
// ❌
<div style={{ position: "absolute", left: offsetX, top: offsetY }}>...</div>
```

### 7.10.7 速查清单

- [ ] 新布局需求出现 → 先问"是否已有对应布局组件"
- [ ] 如果没有 → 在 `src/components/` 新建布局组件
- [ ] 布局组件**不依赖** `Shot` 类型
- [ ] Scene 只负责编排，不写布局逻辑

---

## 8 · Scene 编排模板（完整 timeline）

### 9.1 A 类脚本骨架（v3 · 2026-06-10 改写双态版）

> **A 类核心是"双态"**：钩子 + 收尾用**口播态**（人脸主屏），主体段用**辅助素材态**（人脸缩右下角圆头像 + 辅助素材飘角落/全屏弱化）。

```
钩子 (3s, 口播态)        ← 人脸主屏 + 钩子句大字幕
→ 段 1 (5-8s, 口播态)     ← 人脸主屏 + 字幕（讲"为什么"）
→ 段 2 (5-8s, 辅助素材态) ← 圆头像右下 + 工具/代码/录屏飘右上
→ pause_breath (0.7s)    ← 上一镜 0.8× 慢动作
→ 段 3 (5-8s, 辅助素材态) ← 圆头像右下 + 数据/对比卡片飘左上
→ 段 4 (5-8s, 口播态)     ← 人脸主屏 + 反思
→ pause_breath (0.7s)    ← 上一镜 0.8× 慢动作
→ 段 5 (5-8s, 辅助素材态) ← 圆头像右下 + 总结图表飘右上
→ 收尾 (7-8s, 口播态)     ← 人脸主屏 + CTA + 评论图标
```

**双态切换次数经验值**（A 类 ≥ 90s 视频）：
- 口播态：3-4 段（钩子 + 反思/方法论 + 收尾）
- 辅助素材态：4-5 段（工具/数据/案例/总结）
- 总切换：8-10 次（每次 0.5s = 4-5s 用于切换 ≈ 总时长 7%）

### 9.2 B 类脚本骨架

```
钩子 (3s) → 自测 1-2 (快切) → 段间停顿 (zoom) → 动作 1-4 (紧) → 收尾 (7s)
```

### 9.3 C 类脚本骨架（七练解码）

```
钩子 (3s) → 造轮子 (代码/终端录屏) → 健脑 (功能截图) → 手术刀 (操作视频) → 创始人视角 (口播/文字) → 收尾 CTA
```

---

## 10 · 性能与可维护性约束

### 10.1 性能铁律

| 维度 | 上限 | 原因 |
|---|---|---|
| **同时动画元素数** | ≤ 8 个 | 移动端 GPU 瓶颈 |
| **优先 transform/opacity** | ✅ 强制 | 走合成层，不触发重排 |
| **避免 layout 触发属性** | 禁用 width/height/top/left 动画 | 必重排，必卡 |
| **视频同时播放数** | ≤ 2 个 | 移动端解码瓶颈 |
| **单镜 DOM 节点数** | ≤ 50 个 | 防止首帧渲染慢 |
| **图片大小** | ≤ 2MB（单张）/ ≤ 500KB（卡片）| 加载时长 ≤ 1s |

### 10.2 可维护性铁律

| 维度 | 上限 |
|---|---|
| **index.tsx 行数** | ≤ 300 行（超了拆 modules/）|
| **单 shot 组件行数** | ≤ 150 行 |
| **单文件嵌套深度** | ≤ 3 层 |
| **shot 组件复用次数** | ≥ 2 次（一次性的塞 Scene 入口）|

---

## 11 · 实现 Scene 组件前必查

1. **assets.md "已就位"列表**——只有素材就位才能 import
2. **timing-sync.md**——确认时长锚点
3. **storyboard.md**——确认 shot 划分
4. **subtitles.json**——确认每条字幕时长
5. **checklist.md §F 实现准备**——5 项检查全部 ✅

---

## 12 · 5 维评分卡 + 评审 SOP

> **每维 ≥ 3 分才能进入用户审阅**，总分 ≥ 18/25。

### 12.1 评分卡

| 维度 | 1 分（差）| 3 分（中）| 5 分（优）| 本稿得分 |
|---|---|---|---|---|
| **安全区** | 标题/CTA 压 120px | 全在安全区内 | 全在安全区 + 留 ≥ 20px 余量 | — |
| **配色** | 用实色背景 / 纯白框 | 用半透明强调色 | 半透明 + 强对比 + 3 处呼应 | — |
| **动效** | 用 CSS transition / RAF | 用 interpolate + useCurrentFrame | interpolate + easing + premountFor 完整 | — |
| **转场** | < 0.3s / 用 flip | ≥ 0.3s + 5 类之一 | ≥ 0.3s + 决策树选型 + 标注完整 | — |
| **性能** | > 8 个同时动画 / 触发 layout | ≤ 8 个 + 全 transform | ≤ 6 个 + 单镜 ≤ 50 DOM | — |

### 12.1 无素材预览工作流（素材未就绪时）

**设计原则**：素材未就绪也能预览剪辑节奏和图形动画，聚焦"剪得好不好"而非"素材拍没拍"。

**预览能看的（无需素材）**：
- ✅ Remotion 动效（interpolate 字幕淡入淡出、数字卡翻转、callout 滑入）
- ✅ 图形界面（hook 数字卡、callout 面板、CTA 卡片）
- ✅ 字幕文字显示和切换节奏
- ✅ 双态布局切换（PIP ↔ Split Left）
- ✅ 工具快切节奏（label 切换动画）

**预览看不到的（缺失素材时黑屏）**：
- ❌ 视频区 → 显示 `⚠️ 文件缺失` 占位符
- ❌ 工具录屏区 → 显示 `⚠️ 工具录屏缺失` 占位符
- ❌ 旁白 `.m4a` → 无声（不影响图形预览）
- ❌ BGM `.mp3` → 无声（不影响图形预览）

**fallback 机制**（自动触发）：
- 视频 `<video>` 加 `onerror` → 隐藏 video → 显示 `.video-missing` 占位符
- 素材路径填正确的文件名，显示在占位符中方便定位

**预览命令（素材未就绪时）**：
```bash
cd remotion
# 启动 Studio 预览
npm run dev
```

> 注意：Remotion 组件用 `<OffthreadVideo>` 自带 `onError` fallback；新增 A 类场景时，确保 video-missing fallback 组件已实现（见 §7.6）。

---

### 12.2 评审 SOP

```
1. 自评（5 维打分）→ ≥ 18 分才能提交
   ↓
2. 启动 npm run dev（用 run_in_background:true）
   ↓
3. 全屏过 3 遍（首屏 / 末屏 / 随机 5 镜）
   ↓
4. 异常打勾到 checklist.md §G 渲染前
   ↓
5. 用户审阅 → 通过 / 改稿
```

---

## 13 · 调试与排错 SOP

### 13.1 黑屏 / 首帧空白

**症状**：Studio 打开后首帧黑屏。

**排查顺序**：
1. `Sequence` 的 `premountFor={1 * fps}` 是否缺失？（必加，防黑屏）
2. `<OffthreadVideo>` 的 `src` 路径是否正确？（用 `staticFile()` 包裹）
3. 资源文件是否在 `remotion/public/<主题>/` 下？
4. 图片 `fetch` 失败？看 Network 面板

**修法模板**：

```tsx
// ✅ 修法：Sequence + premountFor
<Sequence from={0} premountFor={1 * FPS}>
  <ShotRenderer />
</Sequence>

// ✅ 修法：静态资源路径
<OffthreadVideo
  src={staticFile("videos/xxx.mov")}
  style={{ width: "100%", height: "100%", objectFit: "cover" }}
/>
```

### 13.2 卡帧 / 元素卡住不动

**症状**：某镜切换时元素没动到位。

**排查**：
1. 转场 `TRANSITION_FRAMES` < 9（0.3s）？
2. `interpolate` 缺 `extrapolateLeft/Right: "clamp"`？
3. `easing` 用 `Easing.bezier()` 而非 GSAP 字符串？

### 13.3 音画不同步

**症状**：BGM 跟字幕/动作对不上。

**排查**：
1. 视频用了自带音轨？（必须 `muted` + 独立 `<Audio>` 旁白）
2. Composition `durationInFrames` 是否与 BGM 时长匹配？
3. BGM ducking 的 `volume()` 回调 frame 范围是否与旁白字幕对齐？

### 13.4 性能差 / 帧率掉

**排查**：
1. 同时动画元素数 > 8？减少
2. 触发 layout 属性？看 Chrome DevTools Performance 面板的 Layout Shift
3. 视频同时播放 > 2？改用 `<Img>` freeze frame

### 13.5 元素位置错位

**症状**：标题/卡片位置不对。

**排查**：
1. 安全区 ≥ 120px top / ≥ 64px left/right？
2. 用 `transform: translate(-50%, -50%)` 居中？改 `xPercent: -50, yPercent: -50`
3. `object-fit: cover` 缺失？容器变形

---

## 14 · 反模式

- ❌ 大面积纯色块遮挡画面
- ❌ 顶部标题压在 120px 安全区
- ❌ 卡片同屏出现 2 张
- ❌ 段间停顿用切换素材 / 纯字幕 / 装饰卡片
- ❌ 元素背景用实色暗灰 / 纯白
- ❌ 标题用渐变 / 描边 / 阴影（破坏纯白原则）
- ❌ 转场用 flip / 旋转 / 3D（与力量感冲突）
- ❌ 素材框用纯白 / 纯灰背景
- ❌ 配字幕时主体区域放长文字
- ❌ 跳过 components/ Shot 组件直接在 index.tsx 写满全部内容
- ❌ 用 CSS transition/animation / Tailwind 动画类（remotion 按帧渲染时不按帧推进）
- ❌ 用 `requestAnimationFrame` / `Date.now()` / `performance.now()` 算动画进度
- ❌ **video 自带音轨**（必须分离：muted video + 独立 audio）
- ❌ **Sequence 没加 `premountFor={1 * fps}`**（首帧黑屏）
- ❌ **单文件 > 300 行**（超了必拆 modules/）
- ❌ **跳过 5 维评分卡直接给用户**（容易漏项）
- ❌ **用 `setInterval` 算数字滚动**（用 `useCurrentFrame()` + `interpolate()`）
- ❌ **同时动画 > 8 个元素**（移动端必卡）
- ❌ **不跑自检就 npm run render**（违反 [render.md](render.md) 触发规则）

### 14.1 A 类专属反模式（v4 · 2026-06-12 新增）

> 与 [video-types.md §12.1](video-types.md#121-a-类专属反模式v3-新增--2026-06-10) 同步。

- ❌ A 类视频没有真人口播视频
- ❌ 辅助素材态时人脸完全消失（视频必须在左侧可见）
- ❌ 视频缩小使用圆形 PIP（v3 旧布局）——v4 改为左右分栏矩形视频
- ❌ 左右分栏时视频尺寸或位置不符合规范（不是正方形或 x ≠ 0 或 width > 576px）
- ❌ 双态切换时主口播视频 pause 了（视频里"嘴不动"了，破坏三同步）
- ❌ 辅助素材当主体（不飘角落也不弱化，直接全屏替代人脸）
- ❌ 双态切换 < 0.3s（生硬）或 > 1s（节奏拖）
- ❌ 用 CSS `transition` 做双态切换（remotion 引擎不按帧推进 → 卡帧）
- ❌ **口播视频未裁切为正方形**（竖屏素材直接居中两侧黑边）
- ❌ **Split 态视频宽度 ≥ 576px**（占比 ≥ 30%）
- ❌ **全片单一背景图**（A 类应有 per-scene 场景化背景）
- ❌ **Split 态视频列保留羽化描边/box-shadow 效果**

---

## 15 · 音频分离铁律（video muted + 独立 audio）

> **铁律（2026-06-11 立）**：所有 `<video>` 元素**必须**带 `muted playsinline` 属性，**视频文件自身的音轨不进入最终输出**。声音一律走**独立的 `<audio>` 元素**。
>
> **反面教训**：视频音轨 + 独立音频双重播放导致 B 类视频普遍踩坑：runtime 报警告 / 数据不对齐。

### 15.1 为什么必须

1. **framework 自动检测**：`muted` → `data-has-audio="false"` → render 阶段 `extractVideosStage` **不会**把视频音轨加到 `composition.audios` 数组。最终输出只含 1 个音轨（独立 `<audio>` 处理结果），不会有视频自带音轨。
2. **避免音轨冲突**：视频自带音轨 + 独立音频同时存在 → 双重播放 → 观众听两遍，且音量不可独立控。
3. **音量控制统一**：声音全走 `<Audio>` 元素，Remotion 的 `volume` 属性函数 `volume={(f) => ...}` 单独可控（fade-in / fade-out / ducking 都靠它）。
4. **后期可换**：换 BGM / 调音量 / 加段间停顿不需要重录视频。

### 15.2 模式

```html
<!-- 视频：只画面，音轨静音 -->
<video id="v-shot_1" class="clip" data-start="3.5" data-duration="6.0" data-track-index="2"
       src="../../../assets/videos/<topic>/<file>.mov"
       muted playsinline preload="metadata"></video>

<!-- 声音：独立 <audio>，按需：voiceover / BGM / sfx -->
<audio id="voiceover" src="../../../assets/audios/<topic>/<file>.m4a"
       data-start="0" data-duration="62.33" data-track-index="0" preload="auto"></audio>
<audio id="bgm"       src="../../../assets/audios/bgm/<topic>.mp3"
       data-start="0" data-duration="62.33" data-track-index="1" preload="auto"></audio>
```

### 15.3 自检 checklist（实现 Scene 组件后）

```bash
# 1. 所有 <OffthreadVideo> / <Video> 都是 muted（默认）
grep -n 'OffthreadVideo' src/scenes/<topic>/index.tsx | wc -l   # 视频数
grep -n 'muted' src/scenes/<topic>/index.tsx | wc -l             # muted 数
# 上面两行输出应相等（或视频组件默认 muted）

# 2. 音频全走 <Audio> 组件（volume 函数可调）
grep -n '<Audio' src/scenes/<topic>/index.tsx
# 至少包含 voiceover + BGM（如有）

# 3. BGM 有 ducking 逻辑（旁白帧期间降 volume）
grep -n 'volume' src/scenes/<topic>/index.tsx
# 应有 volume={(f) => ...} 回调
```

### 15.4 反例

- ❌ `<OffthreadVideo>` 带音轨（应 `muted` + 独立 `<Audio>` 旁白）
- ❌ 视频自带 BGM（"录的时候顺便加了个 BGM" → BGM 没法独立控音量，段间停顿做不到）
- ❌ BGM 没有 ducking（旁白期间 BGM 没降 volume）
- ❌ BGM fade-in/fade-out 缺失（首帧刺耳 / 末帧突然断）

### 15.5 Remotion 音轨结构

| 用途 | 组件 | 说明 |
|---|---|---|
| voiceover / 旁白 | `<Audio src={staticFile("voiceover.m4a")} />` | 用户自录旁白 |
| BGM / 背景音乐 | `<Audio src={staticFile("bgm.mp3")} volume={(f) => ...} />` | 带 ducking 回调 |
| 视频元素 | `<OffthreadVideo muted ... />` | 全程 muted |

> Remotion 的 `<Audio>` 组件通过 `volume` 函数实现 ducking / fade-in / fade-out。
> 同一 Composition 内的多个 `<Audio>` 可以任意重叠时间——这是 voiceover + BGM 混音的基础。

---

## 附录 A · 速查索引

| 我想... | 看... |
|---|---|
| 写一个 Shot 组件 | [§7 组件模板库](#7-组件模板库7-类常用组件) |
| 编排完整 timeline | [§8 Scene 编排模板](#8-scene-编排模板完整-timeline) |
| 按视频类型差异化 | [§9 A/B/C 三类视频的脚本实现差异化](#9-abc-三类视频的脚本实现差异化) |
| 修首帧黑屏 | [§13.1 黑屏 / 首帧空白](#131-黑屏--首帧空白) |
| 跑 5 维评分 | [§12 5 维评分卡 + 评审 SOP](#12-5-维评分卡--评审-sop) |
| 写代码前必查 | [§11 实现 Scene 组件前必查](#11-实现-scene-组件前必查) |
| **video 必带 muted / 声音分离** | **[§15 音频分离铁律](#15--音频分离铁律video-muted--独立-audio)** |

---

## 附录 B · 变更日志

### v3（2026-06-11）— 音频分离铁律

- **新增 §15 音频分离铁律**："`<video>` 必带 `muted playsinline` + 声音走独立 `<audio>`" 立为铁律，附 4 条理由 + 模式模板 + 3 步自检 grep + 4 类反例 + 3 个 track-index 语义表
- 触发：gym_machine_judge_b13 修复时发现 remotion 0.6.72 在多 audio 元素场景下的语音丢失 bug；为避免下次再因"video 自带音轨 + 独立 audio"导致双重播放 / 静默丢音，把音轨分离硬约束写进规范
- 附录 A 速查索引新增 §15 入口
- §14 反模式已有"❌ video 自带音轨"条目，与 §15 互为引用

### v2（2026-06-09）— 深化拓展

- **新增 §7 组件模板库**：7 类常用组件（标题/卡片/视频/字幕/装饰/pause_breath/CTA），含 TSX + interpolate 代码
- **新增 §8 Scene 编排模板**：8 节标准结构（开场→钩子→主体→段间→收尾→CTA）+ Sequence 速查
- **新增 §9 A/B/C 三类视频的脚本实现差异化**：每镜时长/镜数/转场/卡片占比/入场动效 5 维对照 + 3 类脚本骨架
- **新增 §10 性能与可维护性约束**：6 项性能铁律 + 4 项可维护性铁律
- **新增 §12 5 维评分卡 + 评审 SOP**：每维 ≥ 3 分 + 总分 ≥ 18 才能进用户审阅
- **新增 §13 调试与排错 SOP**：5 大症状（黑屏/卡帧/音画不同步/性能/位置错位）+ 排查顺序 + 修法模板
- **新增附录 A 速查索引** + **附录 B 变更日志**
- **§5 转场规范扩 5.3 决策树**
- **§14 反模式从 12 条扩到 21 条**
- **保留不变**：§2 目录结构 + §3 安全区 + §4 设计风格 + §6 静态资源加载 + §11 实现前必查

### v1（2026-06-06）— 初版

- 安全区 + 配色 + 转场 + 资源加载
- 由 winged_scapula_b3 实战沉淀
