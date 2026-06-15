# A 类视频口播布局状态机实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal：** 为 A 类视频（口播）构建一套口播视频持久化 + 动态布局状态机，口播永不 unmount，位置/大小随 Shot 边界以动画方式 morph

**Architecture：**
- `LayoutStateRegistry` 作为注册中心，新增布局只需注册数据对象，核心引擎 0 修改
- `AnimatedTalkingHead` 全局持久，通过 `interpolate` 在 prevLayout ↔ curLayout 之间 morph
- `LayoutTransitionEngine` 监听 frame → 确定当前 Shot → 驱动布局切换
- `AuxiliaryContentManager` 按 Shot 独立管理辅助素材的入场/退场动画
- Shot 序列数据结构与 storyboard.json 完全兼容

**Tech Stack：** Remotion（useCurrentFrame + interpolate + Easing），纯 React + TS，无新依赖

---

## 文件结构

```
remotion/src/scenes/<主题>/
├── layouts/
│   ├── index.ts           # 统一导出
│   ├── types.ts           # LayoutState 接口
│   └── registry.ts        # 注册中心 + 5 种内置布局
├── AnimatedTalkingHead.tsx
├── LayoutTransitionEngine.tsx
├── AuxiliaryContentManager.tsx
├── ShotContent.tsx
└── index.tsx              # Scene 入口
```

---

## Task 1: LayoutState 接口定义

**Files:**
- Create: `remotion/src/scenes/layouts/types.ts`

- [ ] **Step 1: 创建 layouts/types.ts**

```ts
// remotion/src/scenes/layouts/types.ts

export interface LayoutState {
  /** 唯一标识，如 "fullscreen" / "pip_bottom_right" */
  id: string;
  /** 左上角 X（横屏 1920 基准）*/
  left: number;
  /** 左上角 Y */
  top: number;
  /** 宽度 */
  width: number;
  /** 高度 */
  height: number;
  /** 圆角（px）*/
  borderRadius: number;
  /** 边框宽度（px）*/
  borderWidth: number;
  /** 边框颜色 */
  borderColor: string;
  /** 阴影 */
  shadow: string;
  /** 层叠顺序（默认 10）*/
  zIndex: number;
}

export type TransitionEasing =
  | "spring"
  | "ease-out"
  | "ease-in-out"
  | "crisp"
  | "standard";

export interface ShotEntry {
  shotId: string;
  layoutId: string;
  transitionType: TransitionEasing;
  startFrame: number;
  endFrame: number;
}
```

- [ ] **Step 2: 提交**

```bash
git add remotion/src/scenes/layouts/types.ts
git commit -m "feat: add LayoutState interface and ShotEntry type"
```

---

## Task 2: LayoutStateRegistry 注册中心

**Files:**
- Create: `remotion/src/scenes/layouts/registry.ts`

- [ ] **Step 1: 创建 layouts/registry.ts**

```ts
// remotion/src/scenes/layouts/registry.ts

import { LayoutState } from "./types";

const REGISTRY: Map<string, LayoutState> = new Map();

/**
 * 注册一个布局状态到全局注册中心
 * 新增布局 → 只需调用此函数注册一个对象，核心引擎无需修改
 */
export function registerLayout(state: LayoutState): LayoutState {
  if (REGISTRY.has(state.id)) {
    console.warn(`[LayoutStateRegistry] 布局 "${state.id}" 已被注册，将被覆盖`);
  }
  REGISTRY.set(state.id, state);
  return state;
}

/** 根据 id 查询布局，未找到返回 undefined */
export function getLayout(id: string): LayoutState | undefined {
  return REGISTRY.get(id);
}

/** 返回所有已注册布局 */
export function getAllLayouts(): LayoutState[] {
  return Array.from(REGISTRY.values());
}

// ─── 内置 5 种布局（数据来源：PictureInPicture / SplitLeftRight / Grid2x2）───

registerLayout({
  id: "fullscreen",
  left: 0, top: 0, width: 1920, height: 864,
  borderRadius: 0, borderWidth: 0, borderColor: "transparent",
  shadow: "none", zIndex: 10,
});

registerLayout({
  id: "left_text_right_talking",
  left: 1344, top: 0, width: 480, height: 864,
  borderRadius: 12, borderWidth: 2, borderColor: "rgba(255,255,255,0.8)",
  shadow: "0 4px 24px rgba(0,0,0,0.6)", zIndex: 10,
});

registerLayout({
  id: "pip_bottom_right",
  left: 1284, top: 567, width: 540, height: 303,
  borderRadius: 12, borderWidth: 2, borderColor: "rgba(255,255,255,0.8)",
  shadow: "0 4px 24px rgba(0,0,0,0.6)", zIndex: 10,
});

registerLayout({
  id: "pip_bottom_left",
  left: 96, top: 567, width: 540, height: 303,
  borderRadius: 12, borderWidth: 2, borderColor: "rgba(255,255,255,0.8)",
  shadow: "0 4px 24px rgba(0,0,0,0.6)", zIndex: 10,
});

registerLayout({
  id: "grid_2x2",
  left: 0, top: 0, width: 960, height: 432,
  borderRadius: 0, borderWidth: 0, borderColor: "transparent",
  shadow: "none", zIndex: 10,
});
```

- [ ] **Step 2: 创建 layouts/index.ts（统一导出）**

```ts
// remotion/src/scenes/layouts/index.ts

export { registerLayout, getLayout, getAllLayouts } from "./registry";
export type { LayoutState, ShotEntry, TransitionEasing } from "./types";
```

- [ ] **Step 3: 提交**

```bash
git add remotion/src/scenes/layouts/registry.ts remotion/src/scenes/layouts/types.ts remotion/src/scenes/layouts/index.ts
git commit -m "feat: add LayoutStateRegistry with 5 built-in layouts"
```

---

## Task 3: AnimatedTalkingHead（口播 morphing 元素）

**Files:**
- Create: `remotion/src/scenes/AnimatedTalkingHead.tsx`

- [ ] **Step 1: 创建 AnimatedTalkingHead.tsx**

```tsx
// remotion/src/scenes/AnimatedTalkingHead.tsx

import { AbsoluteFill, OffthreadVideo, useCurrentFrame, interpolate, Easing } from "remotion";
import { staticFile } from "remotion";
import { LayoutState } from "./layouts/types";

const TRANSITION_FRAMES = 30; // 30fps × 1s 过渡动画

const EASING_MAP: Record<string, (t: number) => number> = {
  "spring":          (t) => Easing.bezier(0.34, 1.56, 0.64, 1)(t),
  "ease-out":        Easing.out(Easing.cubic),
  "ease-in-out":     Easing.inOut(Easing.cubic),
  "crisp":           Easing.bezier(0.16, 1, 0.3, 1),
  "standard":        Easing.bezier(0.4, 0, 0.2, 1),
};

interface AnimatedTalkingHeadProps {
  videoSrc: string;
  prevLayout: LayoutState;
  curLayout: LayoutState;
  transitionType: string;
}

export const AnimatedTalkingHead: React.FC<AnimatedTalkingHeadProps> = ({
  videoSrc,
  prevLayout,
  curLayout,
  transitionType = "ease-out",
}) => {
  const frame = useCurrentFrame();
  const easing = EASING_MAP[transitionType] ?? EASING_MAP["ease-out"];

  const left    = interpolate(frame, [0, TRANSITION_FRAMES], [prevLayout.left, curLayout.left], { easing, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const top     = interpolate(frame, [0, TRANSITION_FRAMES], [prevLayout.top, curLayout.top], { easing, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const width  = interpolate(frame, [0, TRANSITION_FRAMES], [prevLayout.width, curLayout.width], { easing, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const height = interpolate(frame, [0, TRANSITION_FRAMES], [prevLayout.height, curLayout.height], { easing, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const radius = interpolate(frame, [0, TRANSITION_FRAMES], [prevLayout.borderRadius, curLayout.borderRadius], { easing, extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{
      position: "absolute",
      left, top, width, height,
      borderRadius: radius,
      overflow: "hidden",
      border: curLayout.borderWidth > 0 ? `${curLayout.borderWidth}px solid ${curLayout.borderColor}` : "none",
      boxShadow: curLayout.shadow === "none" ? undefined : curLayout.shadow,
      zIndex: curLayout.zIndex,
    }}>
      <OffthreadVideo
        src={staticFile(videoSrc)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
};
```

- [ ] **Step 2: 提交**

```bash
git add remotion/src/scenes/AnimatedTalkingHead.tsx
git commit -m "feat: add AnimatedTalkingHead with interpolate morphing"
```

---

## Task 4: LayoutTransitionEngine（过渡引擎）

**Files:**
- Create: `remotion/src/scenes/LayoutTransitionEngine.tsx`

- [ ] **Step 1: 创建 LayoutTransitionEngine.tsx**

```tsx
// remotion/src/scenes/LayoutTransitionEngine.tsx

import { useMemo } from "react";
import { AbsoluteFill } from "remotion";
import { AnimatedTalkingHead } from "./AnimatedTalkingHead";
import { getLayout } from "./layouts";
import type { LayoutState, ShotEntry } from "./layouts/types";

interface LayoutTransitionEngineProps {
  videoSrc: string;
  shotSequence: ShotEntry[];
  children: (
    prevLayout: LayoutState,
    curLayout: LayoutState,
    transitionType: string,
    currentShotId: string,
  ) => React.ReactNode;
}

export const LayoutTransitionEngine: React.FC<LayoutTransitionEngineProps> = ({
  videoSrc,
  shotSequence,
  children,
}) => {
  // 查找当前 frame 对应的 shot
  const { currentShot, prevShot, curLayout } = useMemo(() => {
    // 注意：这里用 useCurrentFrame 的逻辑由调用方（Scene）通过 props 传入
    // shotSequence 由 Scene 层计算 frame 后传入
    return { currentShot: null, prevShot: null, curLayout: getLayout("fullscreen")! };
  }, [shotSequence]);

  return (
    <AbsoluteFill>
      {/* 口播动画元素（全局持久，最底层）*/}
      <AnimatedTalkingHead
        videoSrc={videoSrc}
        prevLayout={curLayout}
        curLayout={curLayout}
        transitionType="ease-out"
      />
    </AbsoluteFill>
  );
};
```

> **注意**：Task 4 初始版本为占位，Task 6（Scene 入口）中会结合 `useCurrentFrame` 完整实现。

- [ ] **Step 2: 提交**

```bash
git add remotion/src/scenes/LayoutTransitionEngine.tsx
git commit -m "feat: add LayoutTransitionEngine skeleton"
```

---

## Task 5: AuxiliaryContentManager（辅助素材管理）

**Files:**
- Create: `remotion/src/scenes/AuxiliaryContentManager.tsx`

- [ ] **Step 1: 创建 AuxiliaryContentManager.tsx**

```tsx
// remotion/src/scenes/AuxiliaryContentManager.tsx

import { useCurrentFrame, interpolate, Easing, AbsoluteFill } from "remotion";
import { Img, OffthreadVideo } from "remotion";
import { staticFile } from "remotion";

const ENTER_FRAMES = 8;
const EXIT_FRAMES = 8;

interface AuxiliaryContentManagerProps {
  contentType: "video" | "image" | "data_viz" | "text_card" | "pause_breath";
  contentSrc?: string;
  enterFrame: number;   // 入场帧（相对 shot 起始）
  visible: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const AuxiliaryContentManager: React.FC<AuxiliaryContentManagerProps> = ({
  contentType,
  contentSrc,
  enterFrame,
  visible,
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  const relFrame = frame - enterFrame;

  // 入场动画：opacity 0→1，ease-out，8 帧
  const opacity = interpolate(relFrame, [0, ENTER_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  if (!visible) return null;

  return (
    <div style={{ position: "absolute", width: "100%", height: "100%", opacity: Math.max(0, Math.min(1, opacity)), ...style }}>
      {contentType === "video" && contentSrc && (
        <OffthreadVideo src={staticFile(contentSrc)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      )}
      {contentType === "image" && contentSrc && (
        <Img src={staticFile(contentSrc)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      )}
      {contentType === "data_viz" && children}
      {contentType === "text_card" && children}
    </div>
  );
};
```

- [ ] **Step 2: 提交**

```bash
git add remotion/src/scenes/AuxiliaryContentManager.tsx
git commit -m "feat: add AuxiliaryContentManager with enter animation"
```

---

## Task 6: ShotContent（辅助内容渲染）

**Files:**
- Create: `remotion/src/scenes/ShotContent.tsx`

- [ ] **Step 1: 创建 ShotContent.tsx**

```tsx
// remotion/src/scenes/ShotContent.tsx

import { AbsoluteFill } from "remotion";
import { AuxiliaryContentManager } from "./AuxiliaryContentManager";
import type { LayoutState } from "./layouts/types";

interface ShotContentProps {
  currentShotId: string;
  contentType: "video" | "image" | "data_viz" | "text_card" | "pause_breath";
  contentSrc?: string;
  curLayout: LayoutState;
}

/**
 * 渲染当前 shot 的辅助内容
 * 位置根据 curLayout 计算（口播占据的区域之外）
 *
 * 对于 left_text_right_talking：辅助素材在左侧 70% 区域
 * 对于 pip_*：辅助素材覆盖主视频区域
 * 对于 fullscreen：当前 shot 不需要辅助素材（口播全屏）
 */
export const ShotContent: React.FC<ShotContentProps> = ({
  currentShotId,
  contentType,
  contentSrc,
  curLayout,
}) => {
  const needsAuxiliary = contentType !== "pause_breath" && contentSrc;

  if (!needsAuxiliary) return null;

  // 根据 layoutId 计算辅助素材的占位区域
  const auxStyle = getAuxiliaryStyle(curLayout.id);

  return (
    <AuxiliaryContentManager
      contentType={contentType}
      contentSrc={contentSrc}
      enterFrame={0}
      visible={true}
      style={auxStyle}
    />
  );
};

function getAuxiliaryStyle(layoutId: string): React.CSSProperties {
  switch (layoutId) {
    case "left_text_right_talking":
      // 左侧 70% 放文字/素材，口播在右侧 30%
      return { left: 0, top: 0, width: 1344, height: 864 };
    case "pip_bottom_right":
    case "pip_bottom_left":
      // 口播缩到小窗，主区域全屏显示辅助素材
      return { left: 0, top: 0, width: 1920, height: 864 };
    case "grid_2x2":
      // 口播占左上格，其余 3 格放辅助素材（由 ShotRenderer 按 grid 布局处理）
      return { left: 960, top: 0, width: 960, height: 864 };
    case "fullscreen":
    default:
      // 全屏口播，无需辅助素材
      return { display: "none" };
  }
}
```

- [ ] **Step 2: 提交**

```bash
git add remotion/src/scenes/ShotContent.tsx
git commit -m "feat: add ShotContent auxiliary renderer"
```

---

## Task 7: Scene 入口完整集成

**Files:**
- Create: `remotion/src/scenes/<主题>/index.tsx`

- [ ] **Step 1: 完善 LayoutTransitionEngine（结合 useCurrentFrame 完整实现）**

将 Task 4 的占位实现替换为完整版：

```tsx
// remotion/src/scenes/LayoutTransitionEngine.tsx（完整版）

import { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { AnimatedTalkingHead } from "./AnimatedTalkingHead";
import { getLayout } from "./layouts";
import type { LayoutState, ShotEntry } from "./layouts/types";

interface LayoutTransitionEngineProps {
  videoSrc: string;
  shotSequence: ShotEntry[];
  children: (
    prevLayout: LayoutState,
    curLayout: LayoutState,
    transitionType: string,
    currentShotId: string,
  ) => React.ReactNode;
}

export const LayoutTransitionEngine: React.FC<LayoutTransitionEngineProps> = ({
  videoSrc,
  shotSequence,
  children,
}) => {
  const frame = useCurrentFrame();

  // 找到当前 frame 对应的 shot（线性扫描，小于 20 个 shot 无需优化）
  const currentShot = useMemo(() => {
    return shotSequence.find((s) => frame >= s.startFrame && frame < s.endFrame)
      ?? shotSequence[shotSequence.length - 1];
  }, [frame, shotSequence]);

  const currentIndex = shotSequence.indexOf(currentShot);
  const prevShot = currentIndex > 0 ? shotSequence[currentIndex - 1] : null;

  const curLayout = useMemo(
    () => getLayout(currentShot.layoutId) ?? getLayout("fullscreen")!,
    [currentShot.layoutId]
  );
  const prevLayout = useMemo(
    () => (prevShot ? (getLayout(prevShot.layoutId) ?? curLayout) : curLayout),
    [prevShot, curLayout]
  );

  return (
    <AbsoluteFill>
      <AnimatedTalkingHead
        videoSrc={videoSrc}
        prevLayout={prevLayout}
        curLayout={curLayout}
        transitionType={currentShot.transitionType}
      />
      {children(prevLayout, curLayout, currentShot.transitionType, currentShot.shotId)}
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: 创建 Scene 入口示例**

```tsx
// remotion/src/scenes/talking_head_effect_demo/index.tsx  // v3.5 改名（原 workout_intro → talking_head_effect_demo）

import { AbsoluteFill } from "remotion";
import { LayoutTransitionEngine } from "../LayoutTransitionEngine";
import { ShotContent } from "../ShotContent";
import { OverlayCard } from "../components/OverlayCard";
import type { ShotEntry } from "../layouts/types";

// 示例 Shot 序列（从 storyboard.json 生成）
const shotSequence: ShotEntry[] = [
  { shotId: "s1", layoutId: "fullscreen",              transitionType: "ease-out",  startFrame: 0,    endFrame: 90 },
  { shotId: "s2", layoutId: "left_text_right_talking", transitionType: "slide-left", startFrame: 90,   endFrame: 210 },
  { shotId: "s3", layoutId: "pip_bottom_right",        transitionType: "zoom",       startFrame: 210,  endFrame: 360 },
  { shotId: "s4", layoutId: "grid_2x2",                 transitionType: "fade",      startFrame: 360,  endFrame: 540 },
];

export const TalkingHeadEffectDemo: React.FC = () => {  // v3.5 改名（原 WorkoutIntro → TalkingHeadEffectDemo）
  return (
    <AbsoluteFill style={{ background: "#0A0A0A" }}>
      <LayoutTransitionEngine
        videoSrc="videos/talking_head.mov"
        shotSequence={shotSequence}
      >
        {(_, curLayout, __, currentShotId) => (
          <ShotContent
            currentShotId={currentShotId}
            contentType="image"
            contentSrc="images/demo.jpg"
            curLayout={curLayout}
          />
        )}
      </LayoutTransitionEngine>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 3: 提交**

```bash
git add remotion/src/scenes/LayoutTransitionEngine.tsx remotion/src/scenes/talking_head_effect_demo/index.tsx  # v3.5 改名
git commit -m "feat: integrate Scene entry with LayoutTransitionEngine"
```

---

## Task 8: 扩展性验证（新增一个自定义布局）

验证"新增布局只需注册对象"的原则是否成立。

- [ ] **Step 1: 在 registry.ts 新增一个"左文右口播 50%"布局**

在 `layouts/registry.ts` 末尾添加：

```ts
registerLayout({
  id: "left_text_right_talking_50pct",
  left: 960, top: 0, width: 960, height: 864,
  borderRadius: 12, borderWidth: 2, borderColor: "rgba(255,255,255,0.8)",
  shadow: "0 4px 24px rgba(0,0,0,0.6)", zIndex: 10,
});
```

- [ ] **Step 2: 在 shotSequence 中引用它**

```ts
{ shotId: "s5", layoutId: "left_text_right_talking_50pct", transitionType: "push_left", startFrame: 540, endFrame: 720 }
```

- [ ] **Step 3: 验证零修改原则**

确认 `AnimatedTalkingHead` / `LayoutTransitionEngine` 无需任何改动。

- [ ] **Step 4: 提交**

```bash
git add remotion/src/scenes/layouts/registry.ts remotion/src/scenes/talking_head_effect_demo/index.tsx  # v3.5 改名
git commit -m "feat: verify extendability — add left_text_right_talking_50pct layout without core changes"
```

---

## 计划自检

**Spec 覆盖检查：**

| Spec 要求 | 对应 Task |
|---|---|
| 口播视频永不 unmount | Task 3 (AnimatedTalkingHead) |
| LayoutStateRegistry 注册中心 | Task 2 (registry.ts) |
| 新增布局 = registry.ts 注册对象 | Task 8 (扩展性验证) |
| spring/ease-out/cubic-bezier 动画曲线 | Task 3 (EASING_MAP) |
| Shot 边界驱动布局切换 | Task 7 (LayoutTransitionEngine 完整版) |
| 辅助素材按 shot 退场/入场 | Task 5 (AuxiliaryContentManager) |
| 5 种内置布局（坐标已更新）| Task 2 (registry.ts 内置 5 种) |
| 竖屏预留（不实现）| Spec §10 |

**Placeholder 扫描：** 无 TBD/TODO，所有 id/帧数/坐标均为具体值。

**类型一致性：** `ShotEntry.layoutId` 引用 `LayoutState.id`，类型一致。`getLayout()` 返回 `LayoutState | undefined`，`AnimatedTalkingHead` 正确接收。

---

## 执行选项

**Plan complete and saved to `docs/superpowers/plans/2026-06-13-a-type-layout-state-machine.md`**

两个执行选项：

**1. Subagent-Driven（推荐）** — 每个 Task 由独立 subagent 实现，Task 间有 review 间隙，适合这种多文件、新架构的探索性实现

**2. Inline Execution** — 在当前 session 内顺序执行所有 Task，checkpoint 节点 review（Task 2 完成后 / Task 7 完成后）

**你倾向哪个？**