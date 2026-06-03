# 动效规范（remotion）

> 阶段：动效（animation / motion design）
> 适用场景：在 Remotion 中实现一切"动起来"的效果
> 来源：Remotion 4.0 官方文档 + 用户品牌调性约束
> 状态：✅ 生效
> 上下游：上游 = `storyboard.md`（确定每个分镜的"动什么"）；下游 = `script.md`（实现组件时引用本文件）

---

## 1. 动效工作流 + 触发条件

### 1.1 触发

在写 Scene 组件（`components/Shot<编号>_<描述>.tsx`）时，**任何"会动"的东西**都先翻本文件查 API + 选型，再写代码。

### 1.2 ⚠️ 重要禁忌（先看这条）

| 写法 | 是否可用 | 原因 |
|---|---|---|
| **`interpolate()` + `useCurrentFrame()`** | ✅ 必须 | Remotion 唯一可靠的动效方式 |
| **`spring()` + `useCurrentFrame()`** | ✅ 必须 | 物理弹簧，效果更自然 |
| **CSS `transition` / `animation`** | ❌ **禁用** | 不会按帧渲染，结果不可预测 |
| **Tailwind 动画类**（`animate-pulse` 等）| ❌ **禁用** | 同上 |
| **`requestAnimationFrame` / `setTimeout`** | ❌ **禁用** | 渲染管线不兼容 |
| **`<motion.div>` (Framer Motion)** | ❌ **不推荐** | 同上原因；如需 spring 用 `spring()` |
| **`<Spring>` from `@react-spring/web`** | ⚠️ 可用但**不推荐** | 与 Remotion 渲染管线有冲突；优先用 `spring()` |

> **核心原则**：Remotion 是"按帧渲染"，所有动效必须**用当前帧号驱动**。

---

## 2. 动效选型速查表

| 我想实现... | 用什么 API | 文档位置 |
|---|---|---|
| 元素淡入 / 滑入 / 缩放 / 旋转 | `interpolate()` | [§4](#4-interpolate线性插值) |
| 元素弹跳入场（带物理感） | `spring()` | [§5](#5-spring物理弹簧) |
| 自定义缓动曲线（Material/Bounce 等） | `Easing.bezier()` | [§6](#6-easing缓动) |
| 数字滚动、计数动画 | `interpolate()` | [§4](#4-interpolate线性插值) |
| 文字逐字出现（打字机） | 字符串切片 | [§10](#10-文字动效) |
| 关键词高亮（高亮笔效果） | 蒙版 / 宽度插值 | [§10](#10-文字动效) |
| 场景之间转场 | `@remotion/transitions` | [§7](#7-转场-transitions-包) |
| 转场期间的覆盖效果（光斑） | `@remotion/light-leaks` | [§8](#8-光斑-overlay-lightleaks) |
| 频谱 / 波形 / 低音响应 | `@remotion/media-utils` | [§9](#9-音频可视化) |
| 3D 内容 | `@remotion/three` | [§11](#11-3d-内容) |
| Lottie 动画 | `@remotion/lottie` | [§12](#12-lottie) |
| 时间轴排序 / 延迟 | `<Sequence>` / `<Series>` | [§3](#3-sequence--series-时序) |
| 复杂嵌套时序 | 嵌套 `<Sequence>` + 负 offset | [§3.5](#35-series-与-sequence-重叠) |

---

## 3. Sequence / Series（时序）

### 3.1 Sequence 基础

```tsx
import { Sequence } from "remotion";

<Sequence from={60} durationInFrames={30} layout="none">
  <Title />
</Sequence>
```

| 属性 | 说明 |
|---|---|
| `from` | 起始帧（默认 0） |
| `durationInFrames` | 持续帧数 |
| `layout="none"` | 取消外层 absolute fill（需要时使用） |
| `premountFor={fps}` | 预加载（**强烈建议所有 Sequence 都加**，避免渲染卡顿） |

> ⚠️ **Always premount any `<Sequence>`** —— 详见 [sequencing.md](https://www.remotion.dev/docs/sequencing#premounting)

### 3.2 Sequence 内 `useCurrentFrame()` 返回的是**本地帧**

```tsx
<Sequence from={60} durationInFrames={30}>
  <MyComponent />  {/* 这里 useCurrentFrame() 返回 0-29，不是 60-89 */}
</Sequence>
```

### 3.3 嵌套 Sequence

```tsx
<Sequence from={0} durationInFrames={120}>
  <Background />
  <Sequence from={15} durationInFrames={90} layout="none">
    <Title />
  </Sequence>
  <Sequence from={45} durationInFrames={60} layout="none">
    <Subtitle />
  </Sequence>
</Sequence>
```

### 3.4 Series 串行场景

```tsx
import { Series } from "remotion";

<Series>
  <Series.Sequence durationInFrames={45}>
    <Intro />
  </Series.Sequence>
  <Series.Sequence durationInFrames={60}>
    <Main />
  </Series.Sequence>
  <Series.Sequence durationInFrames={30}>
    <Outro />
  </Series.Sequence>
</Series>
```

### 3.5 Series 与 Sequence 重叠

**用负 offset 让下一段提前开始**——这是 `script.md` 第 8 节"转场帧重叠"的标准实现：

```tsx
<Series>
  <Series.Sequence durationInFrames={60}>
    <SceneA />
  </Series.Sequence>
  <Series.Sequence offset={-15} durationInFrames={60}>
    {/* 在 SceneA 结束前 15 帧就开始，0.5s 转场（30fps） */}
    <SceneB />
  </Series.Sequence>
</Series>
```

> 与 `script.md` 第 8 节"转场 ≥ 0.3s"硬约束的对应实现就是这里。

---

## 4. `interpolate()`（线性插值）

### 4.1 基本用法

```tsx
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

const frame = useCurrentFrame();
const { fps } = useVideoConfig();

// 0-60 帧内：opacity 从 0 → 1
const opacity = interpolate(frame, [0, 60], [0, 1], {
  extrapolateRight: "clamp",
  extrapolateLeft: "clamp",
});
```

### 4.2 常用插值模式（七练落地参考）

| 动效 | 起始值 | 结束值 | 帧数 | 备注 |
|---|---|---|---|---|
| **淡入** | `opacity: 0` | `opacity: 1` | 12-20 帧 | 字幕/卡片入场 |
| **淡出** | `opacity: 1` | `opacity: 0` | 8-12 帧 | 出场（比入场快） |
| **从下浮入** | `translateY: 40` | `translateY: 0` | 15-25 帧 | 字幕/数据卡 |
| **从右滑入** | `translateX: 100` | `translateX: 0` | 15-20 帧 | 步骤递进 |
| **缩放入场** | `scale: 0.6` | `scale: 1.0` | 12-20 帧 | 按钮/图标 |
| **数字滚动** | `0` | `80` | 25-40 帧 | 训练重量/次数 |
| **旋转入场** | `rotate: -180` | `rotate: 0` | 20-30 帧 | ❌ 七练禁用（违反"力量感"调性） |
| **颜色渐变** | `#FF4500` | `#DC143C` | 15-25 帧 | 警示态切换 |

### 4.3 ⚠️ extrapolate 必加

```tsx
interpolate(frame, [0, 60], [0, 1], {
  extrapolateRight: "clamp",  // ← 必须 clamp，否则会溢出
  extrapolateLeft: "clamp",   // ← 必须 clamp
});
```

不 clamp 会导致：动画结束后继续返回边界值之外，画面"乱跑"。

### 4.4 组合插值：分离"时机"和"映射"

多个属性共享同一时机时，**先算进度，再映射属性**：

```tsx
// 1 个进度
const slideIn = interpolate(frame, [0, 25], [0, 1], {
  easing: Easing.bezier(0.22, 1, 0.36, 1),
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});

// 多个属性共享这个进度
const overlayX = interpolate(slideIn, [0, 1], [100, 0]);
const opacity = slideIn;
const scale = interpolate(slideIn, [0, 1], [0.8, 1]);
```

---

## 5. `spring()`（物理弹簧）

### 5.1 基本用法

```tsx
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

const frame = useCurrentFrame();
const { fps } = useVideoConfig();

const bounce = spring({
  frame,
  fps,
  config: { damping: 8, stiffness: 200, mass: 0.5 },
});
// bounce 返回 0 → 1（带过冲后衰减到 1）
```

### 5.2 spring 参数详解

| 参数 | 默认值 | 效果 |
|---|---|---|
| `stiffness`（刚度）| 100 | 越大越"硬"，弹得快 |
| `damping`（阻尼）| 10 | 越大越不震荡，越快稳定 |
| `mass`（质量）| 1 | 越大惯性越强，到位越慢 |
| `overshootClamping` | false | true 则不会过冲 |

### 5.3 七练推荐的 spring 配置

| 场景 | stiffness | damping | mass | 效果 |
|---|---|---|---|---|
| **字幕弹跳入场**（默认）| 200 | 8 | 0.5 | 弹得明显，回弹小 |
| **重点 segment 二次跳动** | 250 | 6 | 0.4 | 更脆的小跳 |
| **数据卡入场** | 150 | 12 | 0.7 | 中等弹感，稳 |
| **按钮按压** | 300 | 15 | 0.5 | 干脆利落 |
| ❌ 旋转弹簧 | — | — | — | 不符合"力量感" |

### 5.4 spring 与 interpolate 选型

- **想"有节奏/有缓冲"** → `spring()`（如入场、强调态）
- **想"线性/平滑"** → `interpolate()`（如数字滚动、颜色渐变）
- **默认**：入场出场优先 `spring()`，中间过渡用 `interpolate()`

### 5.5 延迟启动 spring

```tsx
const delay = 0.2 * fps;  // 0.2s 延迟
const bounce = spring({
  frame: Math.max(0, frame - delay),
  fps,
  config: { damping: 8, stiffness: 200, mass: 0.5 },
});
```

### 5.6 ⚠️ spring 不带 `extrapolate` 选项

spring 是 0 → 1 平滑曲线，本身不需要 clamp。但如果 `frame` 是负数，需要包 `Math.max(0, ...)`。

---

## 6. Easing（缓动）

### 6.1 命名曲线（按"弯度"递增）

`Easing.quad` < `Easing.cubic` < `Easing.sin` < `Easing.exp` < `Easing.circle`

### 6.2 方向预设

- `Easing.in` —— 启动慢，结尾快
- `Easing.out` —— 启动快，结尾慢（**入场用这个**）
- `Easing.inOut` —— 两端慢中间快

### 6.3 自定义贝塞尔曲线

```tsx
import { interpolate, Easing } from "remotion";

const value = interpolate(frame, [0, 30], [0, 1], {
  easing: Easing.bezier(0.16, 1, 0.3, 1),
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});
```

### 6.4 七练推荐的 4 条贝塞尔曲线（速查）

| 名称 | 曲线 | 适用 |
|---|---|---|
| **Crisp 入场** | `Easing.bezier(0.16, 1, 0.3, 1)` | 入场默认（强 ease-out，无过冲）|
| **Editorial 慢淡** | `Easing.bezier(0.45, 0, 0.55, 1)` | 数据图表/长内容淡入 |
| **Playful 过冲** | `Easing.bezier(0.34, 1.56, 0.64, 1)` | 强调元素（克制使用）|
| **Standard** | `Easing.bezier(0.4, 0, 0.2, 1)` | Material 标准，转场用 |

> 与 `script.md` 第 8.3 节"转场缓动"对应：转场用 Standard 入场/出场。

### 6.5 入场/出场的方向选择（一般规律）

- **入场**：`Easing.out` —— 元素"冲进来再减速"
- **出场**：`Easing.in` —— 元素"慢慢加速离开"
- **不要用 `linear`**：默认是 linear，但视觉上"机械感"重，少用

---

## 7. 转场（`@remotion/transitions` 包）

> ⚠️ 当前 `remotion/package.json` **未安装** `@remotion/transitions` 和 `@remotion/light-leaks`——如需使用，先执行 `npx remotion add @remotion/transitions` 和 `npx remotion add @remotion/light-leaks`。

### 7.1 TransitionSeries 基础

```tsx
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={60}>
    <SceneA />
  </TransitionSeries.Sequence>
  <TransitionSeries.Transition
    presentation={fade()}
    timing={linearTiming({ durationInFrames: 15 })}
  />
  <TransitionSeries.Sequence durationInFrames={60}>
    <SceneB />
  </TransitionSeries.Sequence>
</TransitionSeries>;
```

### 7.2 可用的转场类型

| 导入 | 类型 | 七练是否推荐 |
|---|---|---|
| `@remotion/transitions/fade` | 淡入淡出 | ✅ 默认 |
| `@remotion/transitions/slide` | 方向滑动 | ✅ 步骤递进 |
| `@remotion/transitions/wipe` | 擦除 | ⚠️ 极少用 |
| `@remotion/transitions/flip` | 翻转 | ❌ 禁用（违反"力量感"）|
| `@remotion/transitions/clock-wipe` | 时钟擦除 | ❌ 禁用 |

### 7.3 slide 方向

```tsx
import { slide } from "@remotion/transitions/slide";

<TransitionSeries.Transition
  presentation={slide({ direction: "from-left" })}  // from-left / from-right / from-top / from-bottom
  timing={linearTiming({ durationInFrames: 20 })}
/>
```

### 7.4 timing 两种模式

```tsx
import { linearTiming, springTiming } from "@remotion/transitions";

// 线性匀速
linearTiming({ durationInFrames: 20 });

// 弹簧（自然感）
springTiming({ config: { damping: 200 }, durationInFrames: 25 });
```

### 7.5 ⚠️ 时长计算

转场会**重叠**相邻 Sequence，所以总时长 = 段时长之和 - 转场时长：

```
总时长 = scene1 + scene2 + scene3 - transition1 - transition2
```

可用 `timing.getDurationInFrames({ fps })` 算单个转场实际占多少帧。

### 7.6 七练转场硬约束（与 `script.md` 第 8 节对齐）

- **转场 ≥ 0.3s**（30fps = 9 帧）
- **优先 fade 或 slide**，禁用 flip/旋转/3D
- **缓动用 Standard**（`Easing.bezier(0.4, 0, 0.2, 1)`）
- **转场中禁止出现大面积纯色块遮挡**（与 `script.md` 第 2 节联动）

---

## 8. 光斑 Overlay（LightLeaks）

> ⚠️ 需先 `npx remotion add @remotion/light-leaks`（要求 Remotion ≥ 4.0.415）

### 8.1 基础用法

```tsx
import { TransitionSeries } from "@remotion/transitions";
import { LightLeak } from "@remotion/light-leaks";

<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={60}>
    <SceneA />
  </TransitionSeries.Sequence>
  <TransitionSeries.Overlay durationInFrames={20}>
    <LightLeak />
  </TransitionSeries.Overlay>
  <TransitionSeries.Sequence durationInFrames={60}>
    <SceneB />
  </TransitionSeries.Sequence>
</TransitionSeries>;
```

### 8.2 关键 props

- `seed` —— 不同值产生不同光斑图案（默认 0）
- `hueShift` —— 0=黄橙、120=绿、240=蓝

### 8.3 七练用法

- 转场时偶尔加一个暖色光斑（`hueShift: 0`），**不要连续场景都加**
- 蓝色/绿色光斑（七练品牌主色是橙红）**不推荐**，会破坏品牌一致性

---

## 9. 音频可视化

> ⚠️ 需先 `npx remotion add @remotion/media-utils`

### 9.1 频谱柱状图

```tsx
import { useWindowedAudioData, visualizeAudio } from "@remotion/media-utils";
import { staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const frame = useCurrentFrame();
const { fps } = useVideoConfig();

const { audioData, dataOffsetInSeconds } = useWindowedAudioData({
  src: staticFile("music.mp3"),
  frame,
  fps,
  windowInSeconds: 30,
});

if (!audioData) return null;

const frequencies = visualizeAudio({
  fps,
  frame,
  audioData,
  numberOfSamples: 256,  // 必须是 2 的幂
  optimizeFor: "speed",
  dataOffsetInSeconds,
});

return (
  <div style={{ display: "flex", alignItems: "flex-end", height: 200 }}>
    {frequencies.map((v, i) => (
      <div key={i} style={{ flex: 1, height: `${v * 100}%`, backgroundColor: "#FF4500" }} />
    ))}
  </div>
);
```

### 9.2 低音响应（让元素跟着鼓点动）

```tsx
const lowFreqs = frequencies.slice(0, 32);
const bass = lowFreqs.reduce((s, v) => s + v, 0) / lowFreqs.length;

const scale = 1 + bass * 0.5;
const opacity = Math.min(0.6, bass * 0.8);
```

### 9.3 波形（oscilloscope）

```tsx
import { createSmoothSvgPath, visualizeAudioWaveform } from "@remotion/media-utils";

const waveform = visualizeAudioWaveform({
  fps, frame, audioData,
  numberOfSamples: 256,
  windowInSeconds: 0.5,
  dataOffsetInSeconds,
});

const path = createSmoothSvgPath({
  points: waveform.map((y, i) => ({ x: (i / (waveform.length - 1)) * width, y: HEIGHT / 2 + (y * HEIGHT) / 2 })),
});

return <svg width={width} height={HEIGHT}><path d={path} stroke="#FF4500" fill="none" strokeWidth={2} /></svg>;
```

### 9.4 ⚠️ 重要提示

**当把 `audioData` 传给子组件时，子组件不要再调 `useCurrentFrame()`**——会拿到 Sequence 内的本地帧，导致可视化断裂。父组件把 `frame` 一起传下去。

---

## 10. 文字动效

### 10.1 打字机效果（用字符串切片，不用 per-character opacity）

```tsx
const text = "让健身更简单";
const charsToShow = Math.floor(interpolate(frame, [0, 30], [0, text.length + 1], {
  extrapolateRight: "clamp",
  extrapolateLeft: "clamp",
}));

return <div>{text.slice(0, charsToShow)}</div>;
```

### 10.2 关键词高亮（高亮笔效果）

```tsx
const highlightWidth = interpolate(frame, [10, 25], [0, 100], {
  extrapolateRight: "clamp",
  extrapolateLeft: "clamp",
});

<div className="relative">
  <span>3 秒记录一次搞定</span>
  <div
    className="absolute inset-y-0 bg-[#FF4500]/30"
    style={{
      left: "0px",
      width: `${highlightWidth}px`,
    }}
  />
</div>
```

### 10.3 字幕动效（与 `subtitle.md` 第 4 节对齐）

- 入场用 `spring({ damping: 8, stiffness: 200, mass: 0.5 })`
- 重点 segment 叠加二次小跳（`stiffness: 250, damping: 6, mass: 0.4`）
- 出场用 `interpolate` + `Easing.in` + 8-12 帧淡出

---

## 11. 3D 内容

> ⚠️ 需先 `npx remotion add @remotion/three three @react-three/fiber`

适用于：
- 3D Logo 旋转
- 训练动作 3D 演示
- 复杂数据 3D 柱状图

七练用法：3D 主要用于**Logo 转场/数据展示**，不要让整个视频都 3D（与"力量感"调性可能冲突）。优先 2D 霓虹效果。

---

## 12. Lottie

> ⚠️ 需先 `npx remotion add @remotion/lottie`

适用于 Lottie 动画文件（.json）。同步时间轴由 `playbackRate` 和 `frame` 共同决定。

七练用法：可用来呈现**复杂的训练动作图标/装饰动效**。如果没有 Lottie 资产，优先用 `interpolate` + `spring` 自己写。

---

## 13. GIF 同步

> ⚠️ 需先 `npx remotion add @remotion/gif`

```tsx
import { Gif } from "@remotion/gif";

<Gif src={staticFile("loading.gif")} style={{ width: 200 }} />
```

---

## 14. HTML in Canvas（高级）

> ⚠️ 需先 `npx remotion add @remotion/web-renderer` 或类似

把 HTML 渲染到 `<canvas>` 里，可以加 2D/WebGL 滤镜、模糊、扭曲等 CSS 难以实现的效果。

七练用法：除非有特殊视觉需求（如玻璃模糊、像素化滤镜），否则**不推荐**——增加复杂度但收益小。

---

## 15. 动效 × 七练品牌调性的映射

| 品牌调性 | 对应动效 API | 七练推荐配置 |
|---|---|---|
| **科技感** | spring 弹性入场 + 数字滚动 + 扫描线 | stiffness 高 / damping 中 |
| **力量感** | 大幅度缩放/位移（不回弹过头）| stiffness 中 / damping 高 |
| **克制** | 入场用 ease-out，出场用 ease-in | 缓动不要用弹性 |
| **节奏** | Sequence 重叠做转场（≥ 0.3s）| linearTiming |
| **未来感** | LightLeak 暖光斑（偶尔）| hueShift: 0 |
| ❌ 柔美 | 旋转/翻转/3D 翻页 | 一律禁用 |

---

## 16. 速查清单（动效开工前 + 写完后——只列**本文件专属**项）

> **跨文件去重原则**：通用检查（音频/字幕/分镜/素材/自检）见 [checklist.md](remotion/rules/checklist.md)；本节只列**动效实现**的专属项。

**开工前**

- [ ] 选型查第 2 节速查表（看用 interpolate / spring / @remotion/transitions 哪个）
- [ ] 确认 API 在已安装依赖中（如未装，先 `npx remotion add xxx`）
- [ ] 缓动曲线在第 6.4 节速查表里选（Crisp / Editorial / Playful / Standard）

**写完后**

- [ ] 没有用 CSS transition/animation（见第 1.2 节）
- [ ] 没有用 Tailwind 动画类
- [ ] `interpolate` 都加了 `extrapolateLeft/Right: "clamp"`（见第 4.3 节）
- [ ] `spring` 没有传负数 frame（用 `Math.max(0, ...)`，见第 5.5 节）
- [ ] Sequence 都加了 `premountFor={1 * fps}`（见第 3.1 节）
- [ ] 入场/出场方向正确（入场 `Easing.out` / 出场 `Easing.in`，见第 6.5 节）
- [ ] 没有旋转/翻转/3D 翻页（违反"力量感"调性，见第 4.2 节）
- [ ] 数字/颜色渐变用 `interpolate`，弹性入场用 `spring`（见第 5.4 节）
- [ ] 动效幅度合理（避免"屏幕抖"级别的位移）

**其他维度的自检**（不在本文件）：
- 转场硬约束 ≥ 0.3s → [script.md](remotion/rules/script.md) 第 8 节
- 综合自检 → [checklist.md](remotion/rules/checklist.md) 第 2 节（master）
