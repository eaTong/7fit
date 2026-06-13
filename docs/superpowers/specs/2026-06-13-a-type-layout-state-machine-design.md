# A 类视频口播布局状态机设计

> **日期**：2026-06-13
> **范围**：A 类视频（个人人设/口播）的口播视频持久化 + 动态布局切换架构
> **前提**：仅横屏 1920×1080，竖屏按需独立扩展

---

## 1 · 问题与目标

### 1.1 现状痛点

现有布局组件（PictureInPicture / SplitLeftRight / TripleSplit / Grid2x2）都是**静态单态**：
- 给定 props，一次性渲染，不会随时间 morph
- 口播视频只能作为"叠加层"存在于小窗，无法在多个布局间平滑过渡
- 新增布局需要改组件代码，不符合"新增布局只需注册对象"的要求

### 1.2 目标

1. **口播视频全局持久**，不 unmount，只做 position/size/radius 的 interpolate morphing
2. **LayoutStateRegistry** 作为注册中心，新增布局只需注册一个数据对象，零核心代码修改
3. **Shot 边界驱动布局切换**，每个 shot 可声明 transitionType（spring / ease-out / cubic-bezier）
4. **辅助素材按 shot 入场动画**，每类素材独立 opacity spring 弹入
5. **只支持横屏**，竖屏组件按需独立扩展

---

## 2 · 核心架构

### 2.1 四个核心角色 + 背景层

```
┌─────────────────────────────────────────────────────────┐
│  LayoutStateRegistry（注册中心）                        │
│  · 存所有布局定义（left/top/width/height/borderRadius） │
│  · 新增布局 → 注册一个对象即可，零核心代码修改          │
└──────────────────────┬──────────────────────────────────┘
                       │ 查询当前布局
                       ▼
┌─────────────────────────────────────────────────────────┐
│  BackgroundLayer（背景层）                               │
│  · 由调用者通过 backgroundSrc 或 renderBackground 提供 │
│  · 优先级：renderBackground > backgroundSrc > 无背景   │
│  · 位于 AbsoluteFill 最底层，口播层下方                 │
└──────────────────────┬──────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────┐
│  AnimatedTalkingHead（口播动画元素）                    │
│  · 视频始终存在于 AbsoluteFill，永不 unmount            │
│  · position/size/radius 随 frame interpolate morphing  │
└──────────────────────┬──────────────────────────────────┘
                       │ 接收 prevLayout + curLayout + transitionType
                       ▼
┌─────────────────────────────────────────────────────────┐
│  LayoutTransitionEngine（过渡引擎）                      │
│  · 监听 Shot 边界 → 查新布局 → 驱动 interpolate         │
│  · 支持 spring / ease-out / cubic-bezier               │
│  · 每个 shot 可声明 transitionType（转场动画风格）      │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│  AuxiliaryContentManager（辅助素材管理）                │
│  · 按 shot 的 content_type 加载视频/图片/数据卡         │
│  · 每类素材独立入场动画（opacity spring 弹入）          │
└─────────────────────────────────────────────────────────┘
```

**渲染层级（从底到顶）**：
1. 背景层（backgroundSrc / renderBackground）
2. 口播动画层（AnimatedTalkingHead）
3. 辅助素材层（children / ShotContent）

### 2.2 文件结构

```
remotion/src/
├── layout-state-machine/         # A 类口播布局状态机（跨主题共享）
│   ├── index.ts                  # 统一 barrel 导出
│   ├── layouts/
│   │   ├── index.ts              # LayoutStateRegistry（统一导出）
│   │   ├── registry.ts           # 注册中心 + 内置 5 种布局
│   │   └── types.ts              # LayoutState / ShotEntry / TransitionEasing
│   ├── AnimatedTalkingHead.tsx   # 口播 morphing 元素
│   ├── LayoutTransitionEngine.tsx # 过渡引擎
│   ├── AuxiliaryContentManager.tsx # 辅助素材管理
│   └── ShotContent.tsx           # 辅助内容渲染
├── scenes/<主题>/
│   └── index.tsx                 # Scene 入口（引用 layout-state-machine）
└── components/                   # 共享组件（PictureInPicture / SplitLeftRight / ...）
```

---

## 3 · LayoutState 数据结构

> **数据来源**：5 种初始布局的坐标/尺寸均从现有组件提取（PictureInPicture / SplitLeftRight / Grid2x2），组件本体保留，A 类视频改用新架构。

### 3.1 接口定义

```ts
// src/layout-state-machine/layouts/types.ts

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
```

### 3.2 内置 5 种初始布局

| ID | 描述 | left | top | width | height | borderRadius |
|---|---|---|---|---|---|---|
| `fullscreen` | 全屏口播 | 0 | 0 | 1920 | 864 | 0 |
| `left_text_right_talking` | 左文右口播（口播占右 30%，距右边缘 96px）| 1344 | 0 | 480 | 864 | 12 |
| `pip_bottom_right` | 小窗右下角（距右 96px，距底 96px）| 1284 | 567 | 540 | 303 | 12 |
| `pip_bottom_left` | 小窗左下角（距左 96px，距底 96px）| 96 | 567 | 540 | 303 | 12 |
| `grid_2x2` | 口播放左上格（其余 3 格辅助素材）| 0 | 0 | 960 | 432 | 0 |

> **扩展原则**：新增布局只需在 registry.ts 中调用 `registerLayout()` 注册一个对象，核心引擎无需修改。

---

## 4 · LayoutStateRegistry

```ts
// src/scenes/<主题>/layouts/registry.ts

import { LayoutState } from "./types";

const REGISTRY: Map<string, LayoutState> = new Map();

export function registerLayout(state: LayoutState): LayoutState {
  if (REGISTRY.has(state.id)) {
    console.warn(`[LayoutStateRegistry] 布局 "${state.id}" 已被注册，将被覆盖`);
  }
  REGISTRY.set(state.id, state);
  return state;
}

export function getLayout(id: string): LayoutState | undefined {
  return REGISTRY.get(id);
}

export function getAllLayouts(): LayoutState[] {
  return Array.from(REGISTRY.values());
}

// 内置布局
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

---

## 5 · AnimatedTalkingHead

### 5.1 职责

- 口播视频始终渲染在 AbsoluteFill 最底层
- 接收 `prevLayout` + `curLayout` + `transitionType`
- 在两个 layout 之间用 `interpolate` 做 morphing（left/top/width/height/borderRadius）
- **永不 unmount**，只做属性插值

### 5.2 实现

```tsx
// src/scenes/<主题>/AnimatedTalkingHead.tsx

import { AbsoluteFill, OffthreadVideo, useCurrentFrame, interpolate, Easing } from "remotion";
import { staticFile } from "remotion";
import { LayoutState } from "./layouts/types";

const TRANSITION_FRAMES = 30; // 30fps × 1s 过渡

const EASING_MAP = {
  "spring":          Easing.bezier(0.34, 1.56, 0.64, 1), // spring
  "ease-out":        Easing.out(Easing.cubic),
  "ease-in-out":     Easing.inOut(Easing.cubic),
  "crisp":           Easing.bezier(0.16, 1, 0.3, 1),      // Editorial
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
  const easing = EASING_MAP[transitionType as keyof typeof EASING_MAP] ?? EASING_MAP["ease-out"];

  const left       = interpolate(frame, [0, TRANSITION_FRAMES], [prevLayout.left, curLayout.left], { easing, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const top        = interpolate(frame, [0, TRANSITION_FRAMES], [prevLayout.top, curLayout.top], { easing, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const width      = interpolate(frame, [0, TRANSITION_FRAMES], [prevLayout.width, curLayout.width], { easing, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const height     = interpolate(frame, [0, TRANSITION_FRAMES], [prevLayout.height, curLayout.height], { easing, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const radius     = interpolate(frame, [0, TRANSITION_FRAMES], [prevLayout.borderRadius, curLayout.borderRadius], { easing, extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{
      position: "absolute",
      left, top, width, height,
      borderRadius: radius,
      overflow: "hidden",
      border: curLayout.borderWidth > 0 ? `${curLayout.borderWidth}px solid ${curLayout.borderColor}` : "none",
      boxShadow: curLayout.shadow,
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

---

## 6 · LayoutTransitionEngine

### 6.1 职责

- 维护 `shotSequence`（shot 列表 + 各自对应的 layoutId + transitionType）
- 维护 `prevLayout` / `curLayout` 状态
- 监听当前 frame，计算当前处于哪个 shot
- 当 shot 切换时，更新 prevLayout = curLayout，curLayout = 新布局
- 将 prevLayout / curLayout / 当前 transitionType 下传给 AnimatedTalkingHead
- **统一管理背景层**（backgroundSrc / renderBackground），位于口播层下方

### 6.2 Props 接口

```tsx
interface LayoutTransitionEngineProps {
  videoSrc: string;
  shotSequence: ShotEntry[];

  /** 统一静态背景（所有 shot 相同）*/
  backgroundSrc?: string;
  backgroundType?: "video" | "image";

  /** 自定义背景渲染函数（优先级高于 backgroundSrc）*/
  renderBackground?: (currentShot: ShotEntry, curLayout: LayoutState) => React.ReactNode;

  children: (
    prevLayout: LayoutState,
    curLayout: LayoutState,
    transitionType: string,
    currentShotId: string,
  ) => React.ReactNode;
}
```

**背景优先级**：`renderBackground` > `backgroundSrc` > 无背景

### 6.3 实现要点

```tsx
// 渲染层级（从底到顶）
<AbsoluteFill>
  {/* Layer 1: 背景层 */}
  {renderBackground
    ? renderBackground(currentShot, curLayout)
    : backgroundSrc
    ? <OffthreadVideo src={staticFile(backgroundSrc)} style={{ ... }} />
    : null}

  {/* Layer 2: 口播动画层（永不 unmount）*/}
  <AnimatedTalkingHead ... />

  {/* Layer 3: 辅助素材层 */}
  {children(prevLayout, curLayout, transitionType, currentShot.shotId)}
</AbsoluteFill>
```

---

## 7 · AuxiliaryContentManager

### 7.1 职责

- 根据当前 shot 的 `content_type` / `content_source` 渲染辅助素材
- 每个素材独立入场动画（opacity spring 弹入，8-12 帧）
- 切换 shot 时旧素材退场（opacity 1→0，8 帧），新素材入场

### 7.2 素材类型 × 入场动画

| content_type | 渲染方式 | 入场动画 |
|---|---|---|
| `video` | OffthreadVideo | opacity 0→1 spring，8 帧 |
| `image` | Img | opacity 0→1 spring，8 帧 |
| `data_viz` | 自定义数据卡组件 | scale 0.8→1 + opacity，spring |
| `text_card` | 文字卡片 | opacity + translateY，ease-out |
| `pause_breath` | 纯色/空白 | 无 |

### 7.3 实现

```tsx
// src/scenes/<主题>/AuxiliaryContentManager.tsx

import { useCurrentFrame, interpolate, AbsoluteFill } from "remotion";
import { spring } from "remotion";
import { Easing } from "remotion";

interface AuxiliaryContentManagerProps {
  contentType: string;
  contentSrc?: string;
  enterFrame: number;   // 入场帧（相对 shot）
  visible: boolean;
}

const ENTER_FRAMES = 8;

export const AuxiliaryContentManager: React.FC<AuxiliaryContentManagerProps> = ({
  contentType,
  contentSrc,
  enterFrame,
  visible,
}) => {
  const frame = useCurrentFrame();
  const relFrame = frame - enterFrame;

  const opacity = interpolate(relFrame, [0, ENTER_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  if (!visible || !contentSrc) return null;

  return (
    <div style={{ opacity: Math.max(0, Math.min(1, opacity)) }}>
      {contentType === "video" && <OffthreadVideo src={staticFile(contentSrc)} />}
      {contentType === "image" && <Img src={staticFile(contentSrc)} />}
      {/* data_viz / text_card 渲染... */}
    </div>
  );
};
```

---

## 8 · Scene 入口集成

```tsx
// src/scenes/<主题>/index.tsx

import { AbsoluteFill } from "remotion";
import { LayoutTransitionEngine, ShotContent } from "../layout-state-machine";
import type { ShotEntry } from "../layout-state-machine/layouts";

// 从 storyboard.json 生成的 shot 序列
const shotSequence: ShotEntry[] = [
  { shotId: "s1", layoutId: "fullscreen",              transitionType: "ease-out",  startFrame: 0,    endFrame: 90 },
  { shotId: "s2", layoutId: "left_text_right_talking", transitionType: "slide-left", startFrame: 90,   endFrame: 210 },
  { shotId: "s3", layoutId: "pip_bottom_right",        transitionType: "zoom",       startFrame: 210,  endFrame: 360 },
  { shotId: "s4", layoutId: "grid_2x2",                 transitionType: "fade",      startFrame: 360,  endFrame: 540 },
  // 新增 shot 只需加一行 ↓
];

export const MyScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#0A0A0A" }}>
      <LayoutTransitionEngine videoSrc="videos/talking_head.mov" shotSequence={shotSequence}>
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

> **Barrel 导出**：`layout-state-machine/index.ts` 暴露统一入口，Scene 文件只需：
> ```ts
> import { LayoutTransitionEngine, ShotContent } from "../layout-state-machine";
> import type { ShotEntry } from "../layout-state-machine/layouts";
> ```

---

## 9 · 新增布局扩展流程

**步骤 1**：在 `layouts/registry.ts` 末尾注册新布局对象

```ts
// src/layout-state-machine/layouts/registry.ts
registerLayout({
  id: "triple_split_talking",
  left: 0, top: 0, width: 640, height: 864,
  borderRadius: 0, borderWidth: 0, borderColor: "transparent",
  shadow: "none", zIndex: 10,
});
```

**步骤 2**：在 Scene 的 `shotSequence` 中引用

```ts
// src/scenes/<主题>/index.tsx
{ shotId: "s5", layoutId: "triple_split_talking", transitionType: "push_left", startFrame: 540, endFrame: 720 }
```

**零修改**：`AnimatedTalkingHead` / `LayoutTransitionEngine` / `AuxiliaryContentManager` 无需改动。

---

## 10 · Barrel Export 统一入口

`layout-state-machine/index.ts` 暴露所有公开 API，Scene 文件统一引用路径：

```ts
// ✅ 推荐：barrel export
import { LayoutTransitionEngine, ShotContent } from "../layout-state-machine";
import { getLayout, registerLayout } from "../layout-state-machine/layouts";
import type { ShotEntry } from "../layout-state-machine/layouts";

// ❌ 不推荐：深路径 import（虽然功能相同）
import { LayoutTransitionEngine } from "../layout-state-machine/LayoutTransitionEngine";
```

导出内容：

| 导出 | 来源 |
|---|---|
| `LayoutTransitionEngine` | LayoutTransitionEngine.tsx |
| `AnimatedTalkingHead` | AnimatedTalkingHead.tsx |
| `ShotContent` | ShotContent.tsx |
| `AuxiliaryContentManager` | AuxiliaryContentManager.tsx |
| `registerLayout / getLayout / getAllLayouts` | layouts/registry.ts |
| `LayoutState / ShotEntry / TransitionEasing` | layouts/types.ts |

---

## 12 · 已验证的技术约束

| 约束 | 来源 |
|---|---|
| `interpolate` 必须加 `extrapolateLeft/Right: "clamp"` | animation.md §1.2 |
| 口播视频用 `OffthreadVideo`（不阻塞渲染）| remotion-best-practices |
| 所有 Sequence 加 `premountFor={1 * fps}` | animation.md §5 |
| 动画曲线只用 remotion Easing，不使用 CSS transition | animation.md §1.2 |
| BGM 放 Phase 6 最后 | CLAUDE.md §6 |
| 视频 > 5s 约束由 storyboard.json 时长控制 | storyboard.md §2 |
| `TransitionEasing` 类型与 `EASING_MAP` 键值必须完全匹配 | 实现验证 |

---

## 13 · Spec 自检

- [x] **Placeholder 扫描**：无 TBD/TODO，所有布局 id / 帧数 / 坐标均为具体值
- [x] **内部一致性**：registry.ts 注册 id 与 shotSequence 引用 id 完全对应
- [x] **Scope**：仅 A 类视频口播持久化布局，横屏专用，竖屏作为预留
- [x] **歧义检查**：`transitionType` 仅用于曲线选择（opacity/translate/scale 由 engine 内置），明确无歧义
- [x] **可扩展性**：新增布局只需 registry.ts 注册对象，核心引擎 0 修改