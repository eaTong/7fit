# Remotion 深度调研报告
## 涵盖：动效系统、3D、CLI 指令、特效、合集分析

> **调研日期**：2026-06-14
> **基于**：Remotion 官方文档 v4 + Skills 文档 + 项目现有实现
> **目的**：系统性掌握 Remotion 能力矩阵，为 7fit 视频生成项目提供技术选型参考

---

## 目录

1. [核心动效系统](#1-核心动效系统)
2. [转场系统](#2-转场系统)
3. [3D 渲染](#3-3d-渲染)
4. [音频可视化](#4-音频可视化)
5. [Lottie 动画](#6-lottie-动画)
6. [Light Leaks 光漏特效](#7-light-leaks-光漏特效)
7. [文字动效](#8-文字动效)
8. [HTML in Canvas / WebGL 特效](#9-html-in-canvas--webgl-特效)
9. [媒体处理](#10-媒体处理)
10. [字体系统](#11-字体系统)
11. [动态 Composition](#12-动态-composition)
12. [参数化视频](#13-参数化视频)
13. [CLI 指令](#14-cli-指令)
14. [地图集成](#15-地图集成)
15. [透明视频](#16-透明视频)
16. [FFmpeg 集成](#17-ffmpeg-集成)
17. [可用包速查表](#18-可用包速查表)
18. [7fit 项目深度分析](#19-7fit-项目深度分析)
19. [推荐使用场景矩阵](#20-推荐使用场景矩阵)

---

## 1. 核心动效系统

### 1.1 唯一可靠的动效方式

Remotion 按帧确定性渲染，**唯一可靠的动效方案**是 `useCurrentFrame()` + `interpolate()` / `spring()`。

| 方案 | 按帧推进 | 确定性 | 帧精确 Seek | 评分 |
|---|---|---|---|---|
| **`useCurrentFrame()` + `interpolate()`** | ✅ | ✅ | ✅ | ⭐⭐⭐⭐⭐ |
| CSS transition | ❌ | ❌ | ❌ | ⭐ |
| CSS animation | ❌ | ❌ | ❌ | ⭐ |
| GSAP | ❌ | ❌ | ❌ | ⭐ |
| `requestAnimationFrame` | ❌ | ❌ | ❌ | ⭐ |
| Tailwind 动画类 | ❌ | ❌ | ❌ | ⭐ |

**结论**：Remotion 引擎按帧 seek，CSS/GSAP/RAF 依赖"实时推进"，seek 时会卡帧或跳变。`useCurrentFrame()` + `interpolate()` 是唯一能 frame-accurate seek 的方案。

### 1.2 interpolate 基础

```tsx
import { interpolate, Easing } from "remotion";

// 基础：0→1 over 100 frames
const opacity = interpolate(frame, [0, 100], [0, 1]);

// 带 clamp（推荐）
const clampedOpacity = interpolate(frame, [0, 100], [0, 1], {
  extrapolateRight: "clamp",
  extrapolateLeft: "clamp",
});

// 带自定义 easing
const animatedOpacity = interpolate(frame, [0, 60], [0, 1], {
  easing: Easing.bezier(0.16, 1, 0.3, 1),
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});
```

### 1.3 Easing 曲线（6 条推荐）

| Easing | 场景 | 效果 |
|---|---|---|
| `Easing.bezier(0.16, 1, 0.3, 1)` | 入场首选 | 柔和减速，无超调 |
| `Easing.bezier(0.3, 0, 1, 0.7)` | 出场 | 加速消失 |
| `Easing.bezier(0.4, 0, 0.2, 1)` | 转场 | 对称加减速 |
| `Easing.bezier(0.2, 0, 0, 1)` | 数字滚动/进度条 | 强调感 |
| `Easing.out(Easing.back(1.7))` | 弹跳强调 | 超调后回落 |
| `Easing.linear` | mask/进度条 | 等速（少用）|

**Ease 选型决策树**：
```
入场？→ bezier(0.16, 1, 0.3, 1)
出场？→ bezier(0.3, 0, 1, 0.7)
转场？→ bezier(0.4, 0, 0.2, 1)
数字/进度？→ bezier(0.2, 0, 0, 1)
弹跳强调？→ Easing.out(Easing.back(1.7))
```

### 1.4 spring 弹性动画

```tsx
import { spring } from "remotion";

// 弹跳强调效果
const scale = spring({
  frame,
  fps,
  config: { damping: 12, stiffness: 200, mass: 0.5 },
});
```

spring 适合需要物理感、超调回落的场景（如 CTA 弹跳、数字脉冲）。

### 1.5 数字滚动

```tsx
const progress = interpolate(frame, [20, 65], [0, 100], {
  extrapolateRight: "clamp",
  easing: Easing.bezier(0.2, 0, 0, 1),
});
const displayNum = Math.round(progress);
```

### 1.6 Stagger 错位入场

```tsx
// 方案 1：多个 Sequence 错开
<Sequence from={0}><Card index={0} /></Sequence>
<Sequence from={3}><Card index={1} /></Sequence>
<Sequence from={6}><Card index={2} /></Sequence>

// 方案 2：map + stagger 计算
{[0, 1, 2].map((i) => {
  const opacity = interpolate(frame - i * 3, [0, 6], [0, 1], {
    extrapolateRight: "clamp",
  });
  return <div style={{ opacity }}>Card {i}</div>;
})}
```

### 1.7 首帧锁住（防黑屏）

```tsx
// ✅ 正确：首帧 opacity=1
const opacity = interpolate(frame, [0, 15], [1, 1], { extrapolateRight: "clamp" });

// ✅ 或用 spring 确保初始有值
const scale = spring({ frame, fps, config: { damping: 15 } });
```

---

## 2. 转场系统

### 2.1 TransitionSeries 组件

来自 `@remotion/transitions`，支持两种增强方式：
- **Transitions**：场景间的交叉过渡（fade / slide / wipe 等），会缩短总时长
- **Overlays**：在切换点叠加特效，不影响总时长

```tsx
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade, slide } from "@remotion/transitions/fade";

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
</TransitionSeries>
```

### 2.2 可用转场类型

```tsx
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { flip } from "@remotion/transitions/flip";
import { clockWipe } from "@remotion/transitions/clock-wipe";

// 带方向
<TransitionSeries.Transition
  presentation={slide({ direction: "from-left" })}
  timing={linearTiming({ durationInFrames: 20 })}
/>
```

方向：`"from-left"`, `"from-right"`, `"from-top"`, `"from-bottom"`

### 2.3 Timing 类型

```tsx
import { linearTiming, springTiming } from "@remotion/transitions";

// 线性
linearTiming({ durationInFrames: 20 });

// 弹性
springTiming({ config: { damping: 200 }, durationInFrames: 25 });
```

### 2.4 Overlay 叠加层

```tsx
import { LightLeak } from "@remotion/light-leaks";

<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={60}>
    <SceneA />
  </TransitionSeries.Sequence>
  <TransitionSeries.Overlay durationInFrames={30}>
    <LightLeak />
  </TransitionSeries.Overlay>
  <TransitionSeries.Sequence durationInFrames={60}>
    <SceneB />
  </TransitionSeries.Sequence>
</TransitionSeries>
```

### 2.5 总时长计算

Transitions 会重叠相邻场景，总时长 **短于** 所有 Sequence 之和：

```
场景1(60f) + 场景2(60f) - 转场(15f) = 105f
```

Overlays 不影响总时长。

---

## 3. 3D 渲染

### 3.1 ThreeCanvas 组件

来自 `@remotion/three`，在 Remotion 中渲染 Three.js 场景：

```tsx
import { ThreeCanvas } from "@remotion/three";
import { useVideoConfig } from "remotion";

const { width, height } = useVideoConfig();

<ThreeCanvas width={width} height={height}>
  <ambientLight intensity={0.4} />
  <directionalLight position={[5, 5, 5]} intensity={0.8} />
  <mesh>
    <sphereGeometry args={[1, 32, 32]} />
    <meshStandardMaterial color="red" />
  </mesh>
</ThreeCanvas>
```

### 3.2 3D 动画规则

**⚠️ 核心约束**：所有动画必须用 `useCurrentFrame()` 驱动，禁止用 `useFrame()`（来自 `@react-three/fiber`）。

```tsx
// ✅ 正确
const frame = useCurrentFrame();
const rotationY = frame * 0.02;
<mesh rotation={[0, rotationY, 0]}>
  <boxGeometry args={[2, 2, 2]} />
  <meshStandardMaterial color="#4a9eff" />
</mesh>

// ❌ 错误
useFrame(({ clock }) => {
  mesh.rotation.y = clock.getElapsedTime(); // 禁止
});
```

### 3.3 ThreeCanvas + Sequence

`layout="none"` 是必须的：

```tsx
<ThreeCanvas width={width} height={height}>
  <Sequence layout="none">
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#4a9eff" />
    </mesh>
  </Sequence>
</ThreeCanvas>
```

### 3.4 适用场景

| 场景 | 说明 |
|---|---|
| 产品 3D 展示 | 物体旋转、拆解动画 |
| 粒子效果 | 数据达成、里程碑庆祝 |
| 粒子背景 | 科技感氛围层 |
| 3D 文字 | 立体标题展示 |
| 场景飞入 | 航线、路径动画 |

### 3.5 安装

```bash
npx remotion add @remotion/three
```

---

## 4. 音频可视化

### 4.1 核心 API

来自 `@remotion/media-utils`：

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

const frequencies = visualizeAudio({
  fps,
  frame,
  audioData,
  numberOfSamples: 256,  // 必须是 2 的幂
  optimizeFor: "speed",
  dataOffsetInSeconds,
});
```

### 4.2 频谱柱可视化

```tsx
return (
  <div style={{ display: "flex", alignItems: "flex-end", height: 200 }}>
    {frequencies.map((v, i) => (
      <div
        key={i}
        style={{
          flex: 1,
          height: `${v * 100}%`,
          backgroundColor: "#0b84f3",
          margin: "0 1px",
        }}
      />
    ))}
  </div>
);
```

### 4.3 低频驱动效果（Beat-Reactive）

```tsx
const lowFrequencies = frequencies.slice(0, 32);
const bassIntensity =
  lowFrequencies.reduce((sum, v) => sum + v, 0) / lowFrequencies.length;

const scale = 1 + bassIntensity * 0.5;
const opacity = Math.min(0.6, bassIntensity * 0.8);
```

### 4.4 波形可视化

```tsx
import {
  createSmoothSvgPath,
  useWindowedAudioData,
  visualizeAudioWaveform,
} from "@remotion/media-utils";

const waveform = visualizeAudioWaveform({
  fps, frame, audioData,
  numberOfSamples: 256,
  windowInSeconds: 0.5,
  dataOffsetInSeconds,
});

const path = createSmoothSvgPath({
  points: waveform.map((y, i) => ({
    x: (i / (waveform.length - 1)) * width,
    y: HEIGHT / 2 + (y * HEIGHT) / 2,
  })),
});

return (
  <svg width={width} height={HEIGHT}>
    <path d={path} fill="none" stroke="#0b84f3" strokeWidth={2} />
  </svg>
);
```

### 4.5 应用场景

| 场景 | 映射 |
|---|---|
| 频谱柱 | `data[i]` → height |
| 圆形波形 | `data[i]` → radius |
| 节奏脉冲 | `data[0]` → scale（低频脉冲）|
| 背景动效 | `data[0]` → opacity / blur |
| 高频闪烁 | `data[64]` → sparkle opacity |

---

## 5. 字幕与 Captions

### 5.1 TikTok 风格字幕

来自 `@remotion/captions`：

```tsx
import { createTikTokStyleCaptions } from "@remotion/captions";

const { pages } = useMemo(() => {
  return createTikTokStyleCaptions({
    captions,
    combineTokensWithinMilliseconds: 1200,
  });
}, [captions]);
```

### 5.2 单词高亮

```tsx
const currentTimeMs = (frame / fps) * 1000;
const absoluteTimeMs = page.startMs + currentTimeMs;

return (
  <div style={{ fontSize: 80, fontWeight: "bold", whiteSpace: "pre" }}>
    {page.tokens.map((token) => {
      const isActive = token.fromMs <= absoluteTimeMs && token.toMs > absoluteTimeMs;
      return (
        <span style={{ color: isActive ? "#39E508" : "white" }}>
          {token.text}
        </span>
      );
    })}
  </div>
);
```

### 5.3 字幕安装

```bash
npx remotion add @remotion/captions
```

---

## 6. Lottie 动画

### 6.1 基本用法

来自 `@remotion/lottie`：

```tsx
import { Lottie, LottieAnimationData } from "@remotion/lottie";
import { useEffect, useState } from "react";
import { cancelRender, continueRender, delayRender } from "remotion";

export const MyAnimation = () => {
  const [handle] = useState(() => delayRender("Loading Lottie animation"));
  const [animationData, setAnimationData] = useState<LottieAnimationData | null>(null);

  useEffect(() => {
    fetch("https://assets4.lottiefiles.com/packages/lf20_zyquagfl.json")
      .then((data) => data.json())
      .then((json) => {
        setAnimationData(json);
        continueRender(handle);
      })
      .catch((err) => cancelRender(err));
  }, [handle]);

  if (!animationData) return null;

  return <Lottie animationData={animationData} style={{ width: 400, height: 400 }} />;
};
```

### 6.2 适用场景

- 预设动画（成功/加载/错误动画）
- 装饰性动画（粒子、飘落效果）
- 图标动画（播放、暂停、点赞）
- 品牌动画（Lottie 文件可复用）

### 6.3 安装

```bash
npx remotion add @remotion/lottie
```

---

## 7. Light Leaks 光漏特效

### 7.1 基本用法

来自 `@remotion/light-leaks`，WebGL 渲染的光漏叠加效果：

```tsx
import { LightLeak } from "@remotion/light-leaks";

// 基础
<LightLeak />

// 自定义
<LightLeak seed={5} hueShift={240} />
```

### 7.2 与 TransitionSeries 集成

```tsx
import { TransitionSeries } from "@remotion/transitions";
import { LightLeak } from "@remotion/light-leaks";

<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={60}>
    <SceneA />
  </TransitionSeries.Sequence>
  <TransitionSeries.Overlay durationInFrames={30}>
    <LightLeak />
  </TransitionSeries.Overlay>
  <TransitionSeries.Sequence durationInFrames={60}>
    <SceneB />
  </TransitionSeries.Sequence>
</TransitionSeries>
```

### 7.3 Props

- `durationInFrames`：默认跟随父 composition 时长
- `seed`：光漏形状，默认 0
- `hueShift`：色相偏移（0-360），默认 0（黄橙），120=绿，240=蓝

### 7.4 安装

```bash
npx remotion add @remotion/light-leaks
```

---

## 8. 文字动效

### 8.1 打字机效果

```tsx
const CHAR_FRAMES = 2;  // 每字符帧数

const getTypedText = ({ frame, fullText, charFrames, pauseFrames }) => {
  let typedChars = 0;
  if (frame < preLen * charFrames) {
    typedChars = Math.floor(frame / charFrames);
  } else if (frame < preLen * charFrames + pauseFrames) {
    typedChars = preLen;
  } else {
    const postPhase = frame - preLen * charFrames - pauseFrames;
    typedChars = Math.min(fullText.length, preLen + Math.floor(postPhase / charFrames));
  }
  return fullText.slice(0, typedChars);
};

// 光标闪烁
const cursorOpacity = interpolate(frame % blinkFrames, [0, blinkFrames/2, blinkFrames], [1, 0, 1], {
  extrapolateLeft: "clamp", extrapolateRight: "clamp",
});
```

### 8.2 单词高亮（荧光笔效果）

```tsx
const highlightProgress = spring({
  fps, frame,
  config: { damping: 200 },
  delay,
  durationInFrames,
});
const scaleX = Math.max(0, Math.min(1, highlightProgress));

// 渲染时用 transform-origin: left center 的 scaleX 动画
<span style={{
  position: "absolute",
  left: 0, right: 0, top: "50%",
  height: "1.05em",
  transform: `translateY(-50%) scaleX(${scaleX})`,
  transformOrigin: "left center",
  backgroundColor: color,
  borderRadius: "0.18em",
}} />
```

### 8.3 字母依次出现

```tsx
const charOpacity = interpolate(frame - i, [0, 3], [0, 1], {
  extrapolateRight: "clamp",
});
```

---

## 9. HTML in Canvas / WebGL 特效

### 9.1 基本用法

来自 `remotion`，将 HTML 渲染到 Canvas 以应用 2D/WebGL 效果：

```tsx
import { HtmlInCanvas } from "remotion";

<HtmlInCanvas width={1280} height={720}>
  <div style={{ fontSize: 80 }}>Hello</div>
</HtmlInCanvas>
```

### 9.2 2D 模糊效果

```tsx
const onPaint: HtmlInCanvasOnPaint = useCallback(({ canvas, element, elementImage }) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to acquire 2D context");

  const blurPx = 4 + 18 * (0.5 + 0.5 * Math.sin((frame / fps) * Math.PI));

  ctx.reset();
  ctx.filter = `blur(${blurPx}px)`;
  const transform = ctx.drawElementImage(elementImage, 0, 0);
  element.style.transform = transform.toString();
}, [frame, fps]);

<HtmlInCanvas width={width} height={height} onPaint={onPaint}>
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", fontSize: 120 }}>
    <h1>Hello</h1>
  </AbsoluteFill>
</HtmlInCanvas>
```

### 9.3 WebGL 效果

需要渲染时加 `--gl=angle` 参数：

```tsx
const onInit: HtmlInCanvasOnInit = useCallback(({ canvas }) => {
  const gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: true });
  if (!gl) throw new Error("WebGL2 unavailable. Try rendering with the --gl=angle option.");
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  // compile program, create texture, set up VAO...
  return () => { /* cleanup */ };
}, []);

const onPaint: HtmlInCanvasOnPaint = useCallback(({ elementImage }) => {
  gl.texElementImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, elementImage);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}, []);
```

### 9.4 注意

- 仅在 Chrome 149+ 且需开启 `chrome://flags/#canvas-draw-element` 标志
- 渲染时需加 `--gl=angle` 参数
- 不支持嵌套 `<HtmlInCanvas>`

---

## 10. 媒体处理

### 10.1 Video 组件

来自 `@remotion/media`：

```tsx
import { Video } from "@remotion/media";
import { staticFile } from "remotion";

// 基础
<Video src={staticFile("video.mp4")} />

// 修剪
<Video
  src={staticFile("video.mp4")}
  trimBefore={2 * fps}   // 跳过前 2 秒
  trimAfter={10 * fps}   // 结束于第 10 秒
/>

// 音量回调
<Video
  src={staticFile("video.mp4")}
  volume={(f) => interpolate(f, [0, 1 * fps], [0, 1], { extrapolateRight: "clamp" })}
/>

// 播放速率
<Video src={staticFile("video.mp4")} playbackRate={0.8} />  // 慢动作
<Video src={staticFile("video.mp4")} playbackRate={1.2} />  // 加速

// 静音
<Video src={staticFile("video.mp4")} muted />

// 循环
<Video src={staticFile("video.mp4")} loop />
```

### 10.2 Audio 组件

```tsx
import { Audio } from "@remotion/media";

// 基础
<Audio src={staticFile("audio.mp3")} />

// 音量回调（f 从音频开始播放时计算）
<Audio
  src={staticFile("audio.mp3")}
  volume={(f) => interpolate(f, [0, 1 * fps], [0, 1], { extrapolateRight: "clamp" })}
/>

// 静音
<Audio src={staticFile("audio.mp3")} muted={frame >= 2 * fps && frame <= 4 * fps} />

// 循环音量曲线
<Audio
  src={staticFile("audio.mp3")}
  loop
  loopVolumeCurveBehavior="extend"
  volume={(f) => interpolate(f, [0, 300], [1, 0])}
/>
```

### 10.3 GIF / 动态图片

```tsx
import { AnimatedImage, staticFile } from "remotion";

// 基础
<AnimatedImage src={staticFile("animation.gif")} width={500} height={500} />

// 播放速率
<AnimatedImage src={staticFile("animation.gif")} playbackRate={2} />

// 循环行为
<AnimatedImage src={staticFile("animation.gif")} loopBehavior="pause-after-finish" />
```

### 10.4 Image 组件

```tsx
import { Img, staticFile } from "remotion";

// 基础
<Img src={staticFile("photo.png")} style={{ width: 500, height: 300 }} />

// 动态路径
<Img src={staticFile(`avatars/${userId}.png`)} />
<Img src={staticFile(`frames/frame${frame}.png`)} />
```

### 10.5 安装

```bash
npx remotion add @remotion/media
```

---

## 11. 字体系统

### 11.1 Google Fonts（推荐）

```tsx
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

// 在组件中使用
<div style={{ fontFamily, fontSize: 80, fontWeight: "bold" }}>Hello</div>
```

### 11.2 本地字体

```tsx
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

await loadFont({
  family: "MyFont",
  url: staticFile("MyFont-Regular.woff2"),
  weight: "400",
});
```

### 11.3 安装

```bash
npx remotion add @remotion/google-fonts
npx remotion add @remotion/fonts
```

---

## 12. 动态 Composition

### 12.1 calculateMetadata

```tsx
import { Composition, CalculateMetadataFunction } from "remotion";

const calculateMetadata: CalculateMetadataFunction<Props> = async ({
  props, abortSignal
}) => {
  const data = await fetch(`https://api.example.com/video/${props.videoId}`, {
    signal: abortSignal,
  }).then((res) => res.json());

  return {
    durationInFrames: Math.ceil(data.duration * 30),
    props: { ...props, videoUrl: data.url },
  };
};

<Composition
  id="MyComp"
  component={MyComponent}
  fps={30}
  width={1080}
  height={1920}
  defaultProps={{ videoId: "abc123" }}
  calculateMetadata={calculateMetadata}
/>
```

### 12.2 获取媒体时长

```tsx
import { getAudioDuration } from "./get-audio-duration";
import { getVideoDuration } from "./get-video-duration";

const durationInSeconds = await getAudioDuration(staticFile("audio.mp3"));
const durationInFrames = Math.ceil(durationInSeconds * fps);
```

### 12.3 获取图片/视频尺寸

```tsx
import { getImageDimensions } from "remotion";
import { getVideoDimensions } from "@remotion/media-utils";

const { width, height } = await getImageDimensions(staticFile("photo.png"));
const dimensions = await getVideoDimensions(staticFile("video.mp4"));
```

---

## 13. 参数化视频

### 13.1 Zod Schema

```tsx
import { z } from "zod";

export const MyCompositionSchema = z.object({
  title: z.string(),
  color: zColor(),  // 颜色选择器
});
```

### 13.2 使用 Schema

```tsx
const MyComponent: React.FC<z.infer<typeof MyCompositionSchema>> = ({ title, color }) => {
  return <div style={{ color }}>{title}</div>;
};

// 在 Composition 中
<Composition
  id="MyComp"
  component={MyComponent}
  schema={MyCompositionSchema}
  defaultProps={{ title: "Hello", color: "#ff0000" }}
  // ...
/>
```

### 13.3 安装

```bash
npx remotion add @remotion/zod-types
```

---

## 14. CLI 指令

### 14.1 核心命令

| 命令 | 说明 |
|---|---|
| `npm run dev` | 启动 Remotion Studio 预览（默认端口 4668）|
| `npx remotion render <id> out/video.mp4` | 渲染视频 |
| `npx remotion still <id> --frame=90` | 渲染单帧静态图 |
| `npx remotion studio` | 启动 Studio（带 UI）|
| `npx remotion versions` | 查看当前版本 |
| `npx remotion upgrade` | 升级 Remotion |
| `npx remotion add <package>` | 添加 Remotion 包 |

### 14.2 渲染参数

| 参数 | 说明 |
|---|---|
| `--gl=angle` | 启用 WebGL（用于 HtmlInCanvas / Maps）|
| `--concurrency=1` | 单并发（用于 WebGL 渲染）|
| `--image-format=png` | PNG 帧格式 |
| `--codec=prores` | ProRes 编码 |
| `--pixel-format=yuva444p10le` | 透明视频像素格式 |
| `--scale=0.25` | 缩放比例 |
| `--frame=30` | 指定帧号 |

### 14.3 FFmpeg 包装

```bash
npx remotion ffmpeg -i input.mp4 output.mp3
npx remotion ffprobe input.mp4
```

---

## 15. 地图集成

### 15.1 基本用法

来自 `maplibre-gl` + `@turf/turf`：

```tsx
import maplibregl from 'maplibre-gl';
import * as turf from '@turf/turf';
import 'maplibre-gl/dist/maplibre-gl.css';

// 创建地图
const mapInstance = new maplibregl.Map({
  container: containerRef.current,
  style: 'https://demotiles.maplibre.org/style.json',
  center: zurich,
  zoom: 7,
  interactive: false,
  attributionControl: false,
  fadeDuration: 0,
  canvasContextAttributes: { preserveDrawingBuffer: true },
});
```

### 15.2 动画航线

```tsx
// 使用 Turf 计算大圆航线
const greatCircleLine = (from, to) => {
  const route = turf.greatCircle(from, to, { npoints: 100 });
  return turf.lineString(route.geometry.coordinates);
};

// 航线渐显
const getPartialTargetRoute = (progress) => {
  return turf.lineSliceAlong(targetRoute, 0, distanceAlong(targetRouteDistance, progress));
};

// 更新地图
map.getSource('trace')?.setData(getPartialTargetRoute(travelProgress));
```

### 15.3 渲染参数

```bash
bunx remotion render [composition-id] out/video.mp4 --gl=angle --concurrency=1
```

### 15.4 适用场景

- 航线飞入/飞出场（旅游、健身旅行类视频）
- 地图路径动画（跑步路线、健身路线）
- 地理位置展示

---

## 16. 透明视频

### 16.1 ProRes 透明（适合后期软件）

```bash
npx remotion render --image-format=png --pixel-format=yuva444p10le --codec=prores --prores-profile=4444 MyComp out.mov
```

### 16.2 WebM 透明（适合浏览器）

```bash
npx remotion render --image-format=png --pixel-format=yuva420p --codec=vp9 MyComp out.webm
```

### 16.3 配置默认值

```ts
// remotion.config.ts
Config.setVideoImageFormat("png");
Config.setPixelFormat("yuva444p10le");
Config.setCodec("prores");
Config.setProResProfile("4444");
```

---

## 17. FFmpeg 集成

### 17.1 静音检测

```bash
# 测量响度
npx remotion ffmpeg -i public/video.mov -map 0:a -af loudnorm=print_format=json -f null /dev/null

# 自适应阈值检测静音
npx remotion ffmpeg -i public/video.mov -map 0:a -af "silencedetect=noise=${THRESH}dB:d=0.5" -f null /dev/null
```

### 17.2 修剪视频

```bash
# 推荐：用 Video 组件的 trimBefore/trimAfter（非破坏性）
<Video src={staticFile('video.mp4')} trimBefore={5 * fps} trimAfter={10 * fps} />

# 如果需要独立文件（需重新编码）
npx remotion ffmpeg -ss 00:00:05 -i public/input.mp4 -to 00:00:10 -c:v libx264 -c:a aac public/output.mp4
```

---

## 18. 可用包速查表

| 包 | 命令 | 用途 |
|---|---|---|
| `@remotion/three` | `npx remotion add @remotion/three` | 3D 渲染 |
| `@remotion/media` | `npx remotion add @remotion/media` | Video/Audio 组件 |
| `@remotion/media-utils` | `npx remotion add @remotion/media-utils` | 音频可视化 |
| `@remotion/transitions` | `npx remotion add @remotion/transitions` | TransitionSeries |
| `@remotion/light-leaks` | `npx remotion add @remotion/light-leaks` | 光漏叠加效果 |
| `@remotion/lottie` | `npx remotion add @remotion/lottie` | Lottie 动画 |
| `@remotion/captions` | `npx remotion add @remotion/captions` | TikTok 风格字幕 |
| `@remotion/google-fonts` | `npx remotion add @remotion/google-fonts` | Google Fonts |
| `@remotion/fonts` | `npx remotion add @remotion/fonts` | 本地字体 |
| `@remotion/zod-types` | `npx remotion add @remotion/zod-types` | Zod 类型 |
| `@remotion/layout-utils` | `npx remotion add @remotion/layout-utils` | 文字测量 |
| `@remotion/gif` | `npx remotion add @remotion/gif` | GIF 组件 |
| `maplibre-gl` | `npm i maplibre-gl` | 地图 |
| `@turf/turf` | `npm i @turf/turf` | 地理计算 |
| `zod` | `npm i zod` | Schema 验证 |

---

## 19. 7fit 项目深度分析

### 19.1 项目现状

**已有能力**：
- ✅ `LayoutTransitionEngine` — 分镜状态机 + 布局切换
- ✅ `ShotRenderer` — Shot 渲染器
- ✅ 字幕层独立渲染（`SubtitleLayer`）
- ✅ 多种 Auxiliary 组件（`MetadataPair`, `TimeStateCard`, `ToolBadgeList`, `WorkflowCard`, `FlowDiagram`, `ImpactBar`, `ComparisonCard`, `QuoteCard`, `HeadlineCard`）
- ✅ 10 个 shot × ~11s 的分镜序列
- ✅ 口播视频叠加布局

**已有组件**：
- `auxiliary/` — 12 个数据卡片组件
- `data-display/` — `VoiceoverText` 字幕组件
- `transitions/` — `ShotRenderer` 转场渲染
- `layout/` — 布局状态机

### 19.2 与 Remotion 原生能力对比

| 能力 | 项目已有 | Remotion 原生 | 可结合点 |
|---|---|---|---|
| **转场** | `ShotRenderer` 自定义 | `@remotion/transitions` TransitionSeries | 用 TransitionSeries 重构 Shot 切换，支持 fade/slide/wipe |
| **字幕** | `SubtitleLayer` + `VoiceoverText` | `@remotion/captions` TikTok 风格 | 单词级高亮同步（现有字幕 JSON 已支持 segments）|
| **3D** | ❌ 无 | `@remotion/three` ThreeCanvas | 健身动作 3D 模型展示/肌肉解剖 |
| **音频可视化** | ❌ 无 | `@remotion/media-utils` | BGM 频谱驱动视觉元素（节拍脉冲/频谱柱）|
| **Lottie** | ❌ 无 | `@remotion/lottie` | 成功动画/加载动画/粒子效果 |
| **Light Leaks** | ❌ 无 | `@remotion/light-leaks` | 场景切换叠加光漏效果 |
| **文字动效** | 基础 opacity/y | typewriter / word highlight | 终端打字效果/关键词高亮 |
| **WebGL 特效** | ❌ 无 | `HtmlInCanvas` | Glitch/Chromatic Aberration/Blur |
| **BGM Ducking** | ❌ 无 | Audio 组件 + interpolate | 旁白期间 BGM 降音量 |
| **地图** | ❌ 无 | maplibre-gl | 健身路线/地理位置展示 |
| **动态时长** | 固定帧数 | `calculateMetadata` | 根据音频自动计算 composition 时长 |

### 19.3 推荐引入的能力

#### 🔴 高优先级（当前缺失但项目需要）

| 能力 | 现状 | 引入方式 | 价值 |
|---|---|---|---|
| **BGM Ducking** | 无 | Audio `volume` 回调 + interpolate | 旁白清晰，BGM 不抢戏 |
| **音频可视化** | 无 | `@remotion/media-utils` | BGM 节拍驱动元素脉冲/频谱柱 |
| **TransitionSeries 重构** | 自定义 ShotRenderer | `@remotion/transitions` | 支持 fade/slide/wipe/light-leaks overlay |
| **字幕单词高亮** | 基础字幕显示 | `@remotion/captions` + interpolate | 更强阅读引导 |

#### 🟡 中优先级（增强视觉效果）

| 能力 | 现状 | 引入方式 | 价值 |
|---|---|---|---|
| **Lottie 动画** | 无 | `@remotion/lottie` | 数据达成/里程碑粒子 |
| **Light Leaks** | 无 | `@remotion/light-leaks` | 场景切换光漏叠加 |
| **打字机效果** | 基础文字 | typewriter 代码 | 代码展示/终端效果 |
| **Glitch 效果** | 无 | `HtmlInCanvas` WebGL | 科技感强调 |

#### 🟢 低优先级（特定场景需要）

| 能力 | 场景 | 引入方式 | 价值 |
|---|---|---|---|
| **3D 模型** | 肌肉解剖/动作教学 | `@remotion/three` | B 类教学增强 |
| **地图航线** | 健身旅行路线 | maplibre-gl + turf | 特定主题视频 |
| **透明视频** | 叠加到外部视频 | ProRes/WebM | 特定需求 |
| **动态时长** | 不同音频长度 | calculateMetadata | 复用性 |

### 19.4 关键技术缺口

**1. BGM Ducking 未实现**
项目 BGM 规范要求"旁白期间 BGM ≤ -12dB"，但当前 `A2OnePerson50Videos` 组件没有 BGM 音量控制。需要用 Audio 组件 + `interpolate` 实现：

```tsx
// 推荐实现
const frame = useCurrentFrame();
const isVoiceoverActive = frame >= voiceoverStart && frame <= voiceoverEnd;
const bgmVolume = isVoiceoverActive
  ? interpolate(frame, [voiceoverStart, voiceoverStart + duckingDuration], [0.8, 0.2])
  : interpolate(frame, [voiceoverEnd, voiceoverEnd + recoveryDuration], [0.2, 0.8]);

<Audio
  src={staticFile("bgm.mp3")}
  volume={bgmVolume}
/>
```

**2. 音频可视化缺失**
BGM 频谱驱动视觉元素（B 类健身视频的"节拍脉冲"）当前完全没有实现。这是 B 类视频的核心差异化能力。

**3. 转场用 ShotRenderer 而非 TransitionSeries**
当前 `LayoutTransitionEngine` 用的是自定义 `transitionType` 字段（`"zoom"`, `"slide-left"`, `"fade"`），没有使用 `@remotion/transitions` 的 TransitionSeries + Overlay 机制。TransitionSeries 的优势在于：
- 转场时长自动计算
- Overlay 可以叠加光漏
- 支持 springTiming 弹性转场

---

## 20. 推荐使用场景矩阵

### 20.1 A 类（个人人设/口播）

| 能力 | 推荐度 | 原因 |
|---|---|---|
| 打字机效果 | ⭐⭐⭐⭐⭐ | 工具展示/终端演示 |
| 单词高亮字幕 | ⭐⭐⭐⭐⭐ | 引导阅读 |
| Light Leaks | ⭐⭐⭐⭐ | 场景切换质感 |
| Lottie 粒子 | ⭐⭐⭐ | 里程碑庆祝 |
| Glitch | ⭐⭐ | 警告/强调（少用）|

### 20.2 B 类（健身知识/动作演示）

| 能力 | 推荐度 | 原因 |
|---|---|---|
| 音频可视化（BGM 驱动）| ⭐⭐⭐⭐⭐ | 节拍脉冲/频谱柱 |
| 3D 模型 | ⭐⭐⭐⭐ | 肌肉解剖/动作演示 |
| 数字滚动 | ⭐⭐⭐⭐⭐ | 训练计数/PR 重量 |
| 双视角对比 | ⭐⭐⭐⭐ | 正确/错误姿势对照 |
| Light Leaks | ⭐⭐⭐ | 转场质感 |

### 20.3 C 类（七练介绍/产品展示）

| 能力 | 推荐度 | 原因 |
|---|---|---|
| Lottie 动画 | ⭐⭐⭐⭐⭐ | 功能点展示 |
| WebGL 特效 | ⭐⭐⭐⭐ | 产品质感 |
| 地图航线 | ⭐⭐⭐ | 健身场景 |
| 打字机效果 | ⭐⭐⭐ | 代码/终端展示 |
| 透明视频 | ⭐⭐ | 特定需求 |

---

## 附录 A：完整 Easing 曲线代码

```tsx
// 入场（柔和减速）
const enter = interpolate(frame, [0, 45], [0, 1], {
  easing: Easing.bezier(0.16, 1, 0.3, 1),
  extrapolateLeft: "clamp", extrapolateRight: "clamp",
});

// 出场（加速消失）
const exit = interpolate(frame, [45, 60], [1, 0], {
  easing: Easing.bezier(0.3, 0, 1, 0.7),
  extrapolateLeft: "clamp", extrapolateRight: "clamp",
});

// 转场（对称加减速）
const transition = interpolate(frame, [0, 30], [0, 1], {
  easing: Easing.bezier(0.4, 0, 0.2, 1),
  extrapolateLeft: "clamp", extrapolateRight: "clamp",
});

// 数字滚动（强调）
const count = interpolate(frame, [20, 50], [0, 100], {
  easing: Easing.bezier(0.2, 0, 0, 1),
  extrapolateLeft: "clamp", extrapolateRight: "clamp",
});

// 弹跳入场（超调）
const bounce = interpolate(frame, [0, 20], [0, 1], {
  easing: Easing.out(Easing.back(1.7)),
  extrapolateLeft: "clamp", extrapolateRight: "clamp",
});
```

---

## 附录 B：安装清单

```bash
cd /Users/eatong/7fit/remotion

# 核心包（按需添加）
npx remotion add @remotion/three
npx remotion add @remotion/media
npx remotion add @remotion/media-utils
npx remotion add @remotion/transitions
npx remotion add @remotion/light-leaks
npx remotion add @remotion/lottie
npx remotion add @remotion/captions
npx remotion add @remotion/google-fonts
npx remotion add @remotion/zod-types
npx remotion add @remotion/layout-utils
npx remotion add @remotion/gif

# 第三方包
npm i maplibre-gl @turf/turf
```

---

## 附录 C：性能约束速查

| 维度 | 上限 | 原因 |
|---|---|---|
| 同时动画元素 | ≤ 8 个 | 移动端 GPU |
| 动画属性白名单 | transform / opacity / scale / rotation | 走合成层 |
| 动画属性黑名单 | width / height / top / left | 触发重排 |
| 同时播放视频 | ≤ 2 个 | 移动端解码 |
| 首屏 DOM 节点 | ≤ 50 个 | 性能 |

---

*报告生成完毕。所有文档已保存至 `research/` 目录。*
