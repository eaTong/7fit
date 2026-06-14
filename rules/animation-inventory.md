# 动画清单 / 特效清单 / 转场清单

> **强制优先级**：生成脚本时**必须**参考本清单。复用组件优先，但**绝不将就**——如果现有组件不满足需求，必须新建或扩展。
>
> **Remotion 原生包全量覆盖**：本清单涵盖所有 `@remotion/*` 包提供的原生能力，不仅仅是项目已用过的。
>
> **生效日期**：2026-06-14（更新：Remotion 原生包全量纳入）
> **维护人**：每次新增动画/特效/转场组件后**必须**更新本清单

---

## 目录

1. [Remotion 原生包速查](#1-remotion-原生包速查) — 9 个包的 API 速查
2. [转场清单](#2-转场清单) — 14 种自实现 + 14+ 种 @remotion/transitions 原生
3. [动画清单](#3-动画清单) — 入场/出场/循环动画
4. [特效清单](#4-特效清单) — 视觉增强效果
5. [可探索清单](#5-可探索清单可选) — 尚未实现但可考虑
6. [组件复用规则](#6-组件复用规则)

---

## 1. Remotion 原生包速查

### 1.1 @remotion/transitions — 转场引擎（14+ 种转场）

**核心组件**：`TransitionSeries`（替代 `Sequence`，支持 `TransitionSeries.Transition`）

**使用方式**：
```tsx
import { TransitionSeries } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { filmBurn } from '@remotion/transitions/film-burn';
import { linearTiming } from '@remotion/transitions';

<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={60}><SceneA /></TransitionSeries.Sequence>
  <TransitionSeries.Transition
    timing={linearTiming({ durationInFrames: 30 })}
    presentation={filmBurn({ seed: 42 })}
  />
  <TransitionSeries.Sequence durationInFrames={60}><SceneB /></TransitionSeries.Sequence>
</TransitionSeries>
```

**14+ 种内置转场**：

| 转场 | 子路径 | 类型 | 关键参数 |
|---|---|---|---|
| `fade` | `/fade` | CSS | `enterStyle?`, `exitStyle?` |
| `slide` | `/slide` | CSS | `direction: from-left/top/right/bottom` |
| `wipe` | `/wipe` | CSS | `direction: 8方向` |
| `flip` | `/flip` | CSS | `direction?`, `perspective?` |
| `clockWipe` | `/clock-wipe` | CSS | `width`, `height` |
| `bookFlip` | `/book-flip` | CSS | `direction` |
| `iris` | `/iris` | CSS | `width`, `height` |
| `none` | `/none` | CSS | — |
| `filmBurn` | `/film-burn` | **Shader** | `seed?` |
| `crosswarp` | `/crosswarp` | **Shader** | — |
| `crossZoom` | `/cross-zoom` | **Shader** | `strength?` |
| `swap` | `/swap` | **Shader** | `reflection?`, `perspective?`, `depth?` |
| `dreamyZoom` | `/dreamy-zoom` | **Shader** | — |
| `zoomBlur` | `/zoom-blur` | **Shader** | `rotation?` |
| `linearBlur` | `/linear-blur` | **Shader** | `intensity?` |
| `zoomInOut` | `/zoom-in-out` | **Shader** | — |
| `dissolve` | `/dissolve` | **Shader** | `lineWidth?`, `spreadColor?`, `hotColor?` |
| `ripple` | `/ripple` | **Shader** | `amplitude?`, `speed?` |

> **性能注意**：Shader 转场（filmBurn/crosswarp/ripple 等）需要 OffscreenCanvas 渲染，比 CSS 转场（fade/slide/wipe/flip）开销大。

### 1.2 @remotion/light-leaks — 光漏叠加

**组件**：`LightLeak` + 工厂函数 `lightLeak(...)`（Remotion Effects API）

**使用方式**：
```tsx
import { LightLeak } from '@remotion/light-leaks';

<LightLeak durationInFrames={30} seed={7} hueShift={180} />
```

**参数**：`seed?`（随机种子）、`hueShift?`（0-360，色相偏移）

### 1.3 @remotion/media-utils — 音频可视化

**已用**：`useWindowedAudioData` + `visualizeAudio`（BGM Pulse）

**新增可用**：

| API | 用途 |
|---|---|
| `visualizeAudioWaveform` | 原始波形（示波器风格） |
| `getWaveformPortion` | 分段波形，返回 `{ index, amplitude }[]` |
| `createSmoothSvgPath` | 平滑 SVG 路径（用于波形可视化） |
| `useAudioData` | 全量音频数据（短音频用，长音频用 `useWindowedAudioData`） |

```tsx
import { visualizeAudioWaveform } from '@remotion/media-utils';

const waveform = visualizeAudioWaveform({
  audioData, frame, fps, windowInSeconds: 3, numberOfSamples: 64
});
```

### 1.4 @remotion/three — Three.js 集成

**组件**：`ThreeCanvas`（React Three Fiber 封装）

**使用方式**：
```tsx
import { ThreeCanvas } from '@remotion/three';

<ThreeCanvas width={1920} height={1080}>
  <ambientLight />
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="#FF4500" />
  </mesh>
</ThreeCanvas>
```

**可用**：
- 完整 Three.js / React Three Fiber 能力
- 粒子系统、自定义着色器、3D 动画
- **需 peer deps**：`@react-three/fiber >= 8.0.0`、`three >= 0.137.0`

### 1.5 @remotion/lottie — AE 动画导出

**组件**：`Lottie`

**使用方式**：
```tsx
import { Lottie, getLottieMetadata } from '@remotion/lottie';
import animation from './animation.json';

const meta = getLottieMetadata(animation);
<Lottie animationData={animation} loop playbackRate={1} />
```

**Props**：`animationData`、`direction`、`loop`、`playbackRate`、`renderer: 'svg'|'canvas'|'html'`

### 1.6 @remotion/captions — 字幕数据处理

**能力**：纯数据处理（不渲染），生成结构化字幕。

**关键 API**：

| API | 用途 |
|---|---|
| `parseSrt({ input })` | SRT → `Caption[]` |
| `createTikTokStyleCaptions({ captions, combineTokensWithinMilliseconds })` | 生成 `TikTokPage[]`，含 `TikTokToken[]`（**词级时间**） |
| `ensureMaxCharactersPerLine` | 按行_maxChars 分段 |

**词级时间**（用于逐词高亮）：
```tsx
const { pages } = createTikTokStyleCaptions({
  captions,
  combineTokensWithinMilliseconds: 100,
});
// pages[i].tokens[j].fromMs / toMs → 逐词时间，可做高亮动画
```

### 1.7 @remotion/gif — GIF 播放

**组件**：`Gif` + 工具函数

| API | 用途 |
|---|---|
| `Gif` | 渲染 GIF 到 canvas |
| `getGifDurationInSeconds(src)` | 获取时长 |
| `preloadGif(src)` | 预加载，返回 `{ waitUntilDone(), free() }` |
| `onLoad` callback | 获取原始帧 `ImageData[]` + 每帧 delay |

```tsx
import { Gif, preloadGif } from '@remotion/gif';

const preload = preloadGif('/foo.gif');
preload.waitUntilDone().then(() => preload.free());

<Gif src="/foo.gif" width={400} height={300} fit="cover" loopBehavior="loop" />
```

### 1.8 @remotion/google-fonts — 字体加载

**已用**：Inter（通过 `enableTailwind`）

**新增可用**：

```tsx
import { loadFont, fontFamily } from '@remotion/google-fonts/BebasNeue';

loadFont('normal', { weights: ['400', '700'] }).waitUntilDone();
<div style={{ fontFamily: bebasNeueFamily }}>Hello</div>
```

**API**：`getAvailableFonts()` 列出所有可用字体（用于运行时字体选择器）

### 1.9 @remotion/layout-utils — 文本自适应

**核心工具**：

| API | 用途 |
|---|---|
| `fitText` | 单行文本自适应字号 |
| `fitTextOnNLines` | **多行文本自适应**（返回 `fontSize` + `lines[]`）|
| `measureText` | 测量文本尺寸 |
| `fillTextBox` | 增量填充文本 |

```tsx
import { fitTextOnNLines } from '@remotion/layout-utils';

const { fontSize, lines } = fitTextOnNLines({
  text: '多行文本',
  maxLines: 2,
  maxBoxWidth: 600,
  fontFamily: 'Inter',
  fontWeight: '700',
  maxFontSize: 72,
});
// lines[] 可用于逐行动画
```

> **注意**：需配合 `@remotion/google-fonts` 的 `loadFont().waitUntilDone()` 确保字体已加载。

---

## 2. 转场清单

### 2.1 自实现转场（14 种）

| 转场名称 | 实现位置 | 参数 | 适用场景 |
|---|---|---|---|
| `fade` | `transition.ts:71` | opacity: 0→1 | 任意，通用首选 |
| `push_left` | `transition.ts:80` | x: 80→0 | A→B 右推 |
| `push_right` | `transition.ts:86` | x: -80→0 | A→B 左推 |
| `slide-left` | `transition.ts:92` | x: 50→0 | 微滑 |
| `slide-right` | `transition.ts:98` | x: -50→0 | 微滑 |
| `slide-up` | `transition.ts:104` | y: 50→0 | 向上滑入 |
| `slide-down` | `transition.ts:110` | y: -50→0 | 向下滑入 |
| `zoom` | `transition.ts:116` | scale: 1.1→1 / 1→1.1 | 放大进入/缩小退出 |
| `shrink` | `transition.ts:122` | scale: 0.9→1 / 1→0.9 | 缩小进入/放大退出 |
| `wipe-h` | `transition.ts:128` | 横向条纹 | 横向扫过 |
| `wipe-v` | `transition.ts:134` | 纵向条纹 | 纵向扫过 |
| `none` | — | 无动效 | 硬切（仅在转场帧≥0.3s 时可用） |
| `pause_breath` | `transition.ts:152` | opacity 呼吸 | 镜头间自然呼吸 |

### 2.2 @remotion/transitions 原生转场（14+ 种）

> **优先使用 CSS 转场**（fade/slide/wipe/flip 等），Shader 转场（filmBurn/crossZoom 等）开销大。

| 转场 | 类型 | 场景建议 |
|---|---|---|
| `fade` | CSS | 通用首选 |
| `slide` | CSS | 8 方向滑入 |
| `wipe` | CSS | 8 方向扫过 |
| `flip` | CSS | 3D 翻转（需注意调性冲突）|
| `clockWipe` | CSS | 时钟式展开 |
| `bookFlip` | CSS | 书页式翻动 |
| `iris` | CSS | 虹膜式展开 |
| `filmBurn` | **Shader** | 胶片燃烧感 |
| `crosswarp` | **Shader** | 扭曲变形 |
| `crossZoom` | **Shader** | 缩放交叉 |
| `swap` | **Shader** | 3D 交换 |
| `dreamyZoom` | **Shader** | 梦幻缩放 |
| `ripple` | **Shader** | 水波纹 |
| `dissolve` | **Shader** | 溶解 |
| `zoomBlur` | **Shader** | 缩放模糊 |
| `linearBlur` | **Shader** | 线性模糊 |
| `zoomInOut` | **Shader** | 缩放入出 |

### 2.3 转场引擎

| 组件 | 位置 | 用途 |
|---|---|---|
| `ShotRenderer` | `components/transitions/ShotRenderer.tsx` | 统一转场封装（enter/exit 组合） |
| `TransitionSeriesEngine` | `components/transitions/TransitionSeriesEngine.tsx` | 序列转场 + LightLeak |
| `TransitionSeries` | `@remotion/transitions` | 原生序列转场（替代 ShotRenderer） |

### 2.4 转场使用规则

- **最低时长**：`≥ 0.3s`（9 帧 @ 30fps）
- **优先**：fade / slide / wipe（CSS 转场，开销小）
- **慎用**：Shader 转场（开销大，仅在特定调性需要时用）
- **禁止**：flip / 旋转 / 3D（与力量感调性冲突）——除非 C 类视频且有明确理由

---

## 3. 动画清单

### 3.1 入场动画（Entry Animations）

| 动画名称 | 实现组件 | 模式 | 关键参数 |
|---|---|---|---|
| **弹簧弹入** | 13+ 组件 | `spring({ damping: 8, stiffness: 200, mass: 0.5 })` | delay 可调 |
| **渐显** | 所有组件 | `interpolate(enter, [0,1], [0,1])` | opacity 0→1 |
| **缩放弹入** | ActionDataCard | scale: 0.85→1 | spring + translateX/Y |
| **交错入场** | FormulaCard/WorkflowCard/ToolBadgeList/FolderTree/GitLogDisplay | `spring({ frame: frame - delay - i*stagger })` | i 为索引 |
| **Lottie 动画** | `@remotion/lottie` | AE 导出 JSON | `animationData`、`loop`、`playbackRate` |

### 3.2 出场动画（Exit Animations）

| 动画名称 | 实现位置 | 模式 |
|---|---|---|
| **渐隐** | 所有组件通用 | `Easing.in`（8-12 帧） |
| **缩小退出** | ActionDataCard | `Easing.out(Easing.cubic)` |
| **向左滑出** | ShotRenderer exit | `translateX: 0→-80` |

### 3.3 循环动画（Loop Animations）

| 动画名称 | 实现组件 | 模式 |
|---|---|---|
| **呼吸辉光** | HeadlineCard/QuoteCard/FormulaCard/ImpactBar/TimeStateCard/MetadataPair | `Math.sin(frame * 0.03)` → brightness 0.7-1 |
| **边框发光呼吸** | QuoteCard/FormulaCard/ImpactBar/TimeStateCard/MetadataPair | `box-shadow` pulse |
| **脉冲环** | BgmPulse.tsx | 双环 offset opacity |
| **轨道旋转** | OrbitingContent/OrbitingVideo | `angle = startAngle + i*(360/n) + frame*speed/fps` |
| **打字机** | CodeDisplay.tsx | `Math.min(frame*speed, totalChars)` |
| **滚动列表** | GitLogDisplay.tsx | `Math.floor((frame*speed/fps) % entries.length)` |
| **流动高亮** | FlowDiagram.tsx | `frame % (nodes.length*30)` 循环 |
| **活跃边框** | GitLogDisplay.tsx | `border + scale` sin 波 |

### 3.4 动效 API 规范

```tsx
// 弹簧入场（标准模板）
const frame = useCurrentFrame();
const { fps } = useVideoConfig();
const enter = spring({
  frame: frame - delay,
  fps,
  config: { damping: 8, stiffness: 200, mass: 0.5 }
});
const scale = interpolate(enter, [0, 1], [0.85, 1]);
const opacity = interpolate(enter, [0, 1], [0, 1]);

// 呼吸效果
const pulse = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.3, 1]);

// 交错入场
items.map((item, i) => {
  const enter = spring({
    frame: frame - delay - i * stagger,
    fps,
    config: { damping: 8, stiffness: 200, mass: 0.5 }
  });
});
```

### 3.5 贝塞尔曲线（4 条推荐）

| 名称 | 参数 | 用途 |
|---|---|---|
| Crisp | `Easing.bezier(0.16, 1, 0.3, 1)` | 入场 |
| Editorial | `Easing.bezier(0.4, 0, 0.2, 1)` | 转场 |
| Playful | `Easing.bezier(0.34, 1.56, 0.64, 1)` | 弹跳 |
| Standard | `Easing.out(Easing.cubic)` | 出场 |

---

## 4. 特效清单

### 4.1 已实现特效

| 特效名称 | 实现位置 | 参数 | 备注 |
|---|---|---|---|
| **LightLeak** | `TransitionSeriesEngine.tsx` / `ShotRenderer.tsx` | seed / hueShift | `@remotion/light-leaks` |
| **BGM Pulse** | `BgmPulse.tsx` | bass→scale + opacity | 音频驱动 |
| **BGM Waveform** | `BgmPulse.tsx` | `visualizeAudioWaveform` | 波形可视化 |
| **边框辉光** | 所有 Auxiliary 组件 | `boxShadow: "0 0 20px rgba(255,69,0,0.15)"` | 呼吸动画 |
| **霓虹边框** | CTAButton | `border: "2px solid #FF4500"` | 静态 |
| **玻璃态** | 所有 Auxiliary 组件 | `bg: rgba(10,10,20,0.88) + backdropFilter: blur(8px)` | 半透明背景 |
| **打字光标** | CodeDisplay.tsx:255 | blink via sin | 500ms 周期 |
| **Shimmer 条纹** | ImpactBar.tsx | interpolate shimmer | 进度条纹理 |

### 4.2 @remotion/media-utils 音频特效

| 特效名称 | API | 用途 |
|---|---|---|
| **FFT 频谱** | `visualizeAudio` | BGM Pulse 已用，频率柱可视化 |
| **波形** | `visualizeAudioWaveform` | 示波器风格波形 |
| **SVG 波形路径** | `createSmoothSvgPath` | 平滑波形 SVG |
| **分段波形** | `getWaveformPortion` | 返回 `{ index, amplitude }[]` |

### 4.3 @remotion/three 3D 特效

| 特效 | 场景建议 |
|---|---|
| **粒子系统** | 数据可视化、背景粒子 |
| **自定义着色器** | 科技感/力量感效果 |
| **3D 旋转/缩放** | C 类视频卡片强调 |
| **WebGL 渲染** | 高性能背景层 |

### 4.4 @remotion/lottie 特效

AE 导出的 Lottie JSON 动画，可用于：
- 图标动画（loading/spinner/checkmark）
- 装饰动画（粒子/光效/背景动效）
- 复杂路径动画（手写效果/路径描边）

### 4.5 @remotion/captions 字幕特效

**词级时间**用于：
- 逐词高亮（sweep / glow）
- 卡拉OK 效果
- 动态字幕位置

### 4.6 样式特效

| 特效名称 | 实现组件 | 模式 |
|---|---|---|
| **文字辉光** | HeadlineCard.tsx | `textShadow: "0 0 50px rgba(...)"` |
| **亮度呼吸** | HeadlineCard/TimeStateCard/FormulaCard | `filter: brightness` + sin |
| **半透明强调背景** | 所有 Auxiliary 组件 | 强调色 1/2 + 透明度 |

---

## 5. 可探索清单（可选）

> 以下特效/动画**尚未实现**，但在**特定场景合适时可以考虑**。

### 5.1 入场/强调动画

| 特效 | 场景建议 | 包依赖 | 复杂度 |
|---|---|---|---|
| **字母逐一显示** | 代码展示、步骤说明 | `@remotion/captions` 词级时间 | 中 |
| **词语逐一显示** | 字幕高亮、关键词强调 | `@remotion/captions` | 低 |
| **挤压入场** | 数据卡片、强调数字 | 自实现 | 低 |
| **旋转入场** | 图标、工具徽章 | 自实现 | 中 |
| **下划线强调** | 关键词高亮 | 自实现 | 低 |
| **背景闪烁** | 切换提示 | 自实现 | 低 |
| **脉冲循环（自动）** | 活跃状态指示器 | 自实现 | 低 |
| **Lottie 动画** | 图标/装饰动画 | `@remotion/lottie` | 低 |

### 5.2 转场变体

| 特效 | 场景建议 | 包依赖 | 复杂度 |
|---|---|---|---|
| **filmBurn** | 胶片燃烧感 | `@remotion/transitions` | 低 |
| **crossZoom** | 缩放交叉 | `@remotion/transitions` | 低 |
| **ripple** | 水波纹 | `@remotion/transitions` | 低 |
| **dissolve** | 溶解 | `@remotion/transitions` | 低 |
| **clockWipe** | 时钟展开 | `@remotion/transitions` | 低 |
| **dreamyZoom** | 梦幻缩放 | `@remotion/transitions` | 中 |
| **Wipe 8 方向** | 方向感切换 | `@remotion/transitions` | 低 |

### 5.3 3D / WebGL 特效

| 特效 | 场景建议 | 包依赖 | 复杂度 |
|---|---|---|---|
| **粒子爆发** | CTA、成就展示 | `@remotion/three` | 高 |
| **3D 卡片翻转** | C 类视频 | `@remotion/three` | 高 |
| **自定义着色器** | 科技感特效 | `@remotion/three` | 高 |
| **粒子系统** | 背景层 | `@remotion/three` | 中 |

### 5.4 音频特效

| 特效 | 场景建议 | 包依赖 | 复杂度 |
|---|---|---|---|
| **FFT 频谱柱** | BGM 可视化增强 | `@remotion/media-utils` | 中 |
| **波形示波器** | 音频波形展示 | `@remotion/media-utils` | 中 |
| **平滑 SVG 波形** | 背景装饰 | `@remotion/media-utils` | 低 |

### 5.5 文本特效

| 特效 | 场景建议 | 包依赖 | 复杂度 |
|---|---|---|---|
| **fitTextOnNLines** | 多行自适应字号 | `@remotion/layout-utils` | 低 |
| **逐行动画** | 多行文本逐行揭示 | `@remotion/layout-utils` | 中 |
| **字体选择器** | 运行时字体切换 | `@remotion/google-fonts` | 中 |

---

## 6. 组件复用规则

### 6.1 复用优先级

```
1. 现有组件完全满足需求 → 直接使用
2. 现有组件部分满足 → 扩展现有组件（加 props）
3. 现有组件不满足 → 新建组件（不复用）
4. 多个场景需要相同模式 → 提取为共享组件/hooks
```

### 6.2 "不将就" 原则

- **禁止**：因为"差不多能用"而强行复用不匹配的组件
- **禁止**：修改现有组件使其丧失原有功能
- **允许**：通过 props 扩展组件行为（不影响原有调用方）
- **允许**：新建组件后，旧组件保留（逐步迁移）

### 6.3 可复用组件索引

| 类别 | 组件 | 路径 |
|---|---|---|
| **转场引擎** | ShotRenderer | `components/transitions/ShotRenderer.tsx` |
| **转场引擎** | TransitionSeriesEngine | `components/transitions/TransitionSeriesEngine.tsx` |
| **转场引擎** | TransitionSeries | `@remotion/transitions` |
| **转场工具** | 14 种转场函数 | `utils/transition.ts` |
| **布局引擎** | LayoutTransitionEngine | `layout-state-machine/LayoutTransitionEngine.tsx` |
| **布局引擎** | AnimatedTalkingHead | `layout-state-machine/AnimatedTalkingHead.tsx` |
| **音频** | BGMWithDucking | `components/media/BGMWithDucking.tsx` |
| **音频** | BgmPulse | `scenes/a2_transition_series/BgmPulse.tsx` |
| **音频** | BgmAudio | `scenes/a2_transition_series/BgmAudio.tsx` |
| **数据卡片** | HeadlineCard | `components/auxiliary/HeadlineCard.tsx` |
| **数据卡片** | QuoteCard | `components/auxiliary/QuoteCard.tsx` |
| **数据卡片** | FormulaCard | `components/auxiliary/FormulaCard.tsx` |
| **数据卡片** | WorkflowCard | `components/auxiliary/WorkflowCard.tsx` |
| **数据卡片** | ToolBadgeList | `components/auxiliary/ToolBadgeList.tsx` |
| **数据卡片** | ActionDataCard | `components/data-display/ActionDataCard.tsx` |
| **数据卡片** | CTAButton | `components/data-display/CTAButton.tsx` |
| **数据卡片** | ImpactBar | `components/auxiliary/ImpactBar.tsx` |
| **数据卡片** | ComparisonCard | `components/auxiliary/ComparisonCard.tsx` |
| **数据卡片** | FlowDiagram | `components/auxiliary/FlowDiagram.tsx` |
| **数据卡片** | FolderTree | `components/auxiliary/FolderTree.tsx` |
| **数据卡片** | MetadataPair | `components/auxiliary/MetadataPair.tsx` |
| **数据卡片** | TimeStateCard | `components/auxiliary/TimeStateCard.tsx` |
| **终端** | CodeDisplay | `components/terminal/CodeDisplay.tsx` |
| **终端** | GitLogDisplay | `components/terminal/GitLogDisplay.tsx` |
| **媒体** | OrbitingContent | `components/auxiliary/OrbitingContent.tsx` |
| **媒体** | OrbitingVideo | `components/media/OrbitingVideo.tsx` |

### 6.4 Remotion 原生包速查索引

| 包 | 能力 | 入口文件 |
|---|---|---|
| `@remotion/transitions` | 14+ 种转场 + TransitionSeries | `TransitionSeries` 组件 |
| `@remotion/light-leaks` | 光漏叠加 | `LightLeak` 组件 |
| `@remotion/media-utils` | 音频可视化（FFT/波形）| `visualizeAudio` / `visualizeAudioWaveform` |
| `@remotion/three` | Three.js / WebGL | `ThreeCanvas` 组件 |
| `@remotion/lottie` | AE 动画 | `Lottie` 组件 |
| `@remotion/captions` | 字幕数据处理（词级时间）| `createTikTokStyleCaptions` |
| `@remotion/gif` | GIF 播放 | `Gif` 组件 |
| `@remotion/google-fonts` | 字体加载 | `loadFont` / `getAvailableFonts` |
| `@remotion/layout-utils` | 文本自适应 | `fitText` / `fitTextOnNLines` |

---

## 7. 新增组件登记

每次新建动画/特效/转场组件后，**必须**填写：

```markdown
### [组件名称]
- **路径**：
- **类型**：转场 / 动画 / 特效 / 音频
- **实现**：描述核心实现
- **调用示例**：
- **依赖**：是否需要新包（需先 `npx remotion add xxx`）
```

---

## 8. 相关规范索引

| 规范 | 路径 | 关联 |
|---|---|---|
| 动效铁律 | `rules/animation.md` | 必须遵循 `useCurrentFrame() + interpolate/spring` |
| 分镜规范 | `rules/storyboard.md` | 转场时长 ≥ 0.3s |
| BGM 规范 | `rules/bgm.md` | BGM Ducking 必做 |
| 脚本规范 | `rules/script.md` | 安全区 / 配色约束 |