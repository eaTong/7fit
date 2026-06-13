# 动效规范（animation.md）

> **Phase 2 实现关键**：Scene 组件用 `useCurrentFrame()` + `interpolate()` / `spring()` 编排动效。
>
> **必须遵循**：[timing-sync.md](timing-sync.md)（时长锚点）+ [script.md](script.md)（安全区 + 配色）+ [storyboard.md](storyboard.md)（每镜动效标注）
>
> **动效哲学**：**`useCurrentFrame()` + `interpolate()` 唯一可靠**。Remotion 引擎按帧确定性渲染，CSS 动画/Tailwind 类/RAF 全部失效——这是动效选型的**第一铁律**。

---

## 1 · ⚠️ 唯一可靠的动效方式

**`useCurrentFrame()` + `interpolate()` / `spring()`**—— Remotion 引擎按帧确定性渲染，**只有通过帧号驱动的动画能稳定按帧推进**。

### 1.1 ❌ 禁用清单（4 大禁用）

| 禁用项 | 原因 |
|---|---|
| ❌ **CSS `transition` / `animation`** | remotion 按帧渲染时不按帧推进 |
| ❌ **Tailwind 动画类**（`animate-pulse` 等）| 同上 |
| ❌ **`requestAnimationFrame`** 算动画进度 | 不走帧号时间线，必错位 |
| ❌ **`Date.now()` / `performance.now()`** 算进度 | 必须走帧号内部时间 |

> **唯一例外**：[§8 音频可视化](#8--音频可视化analysernode) 中的 `requestAnimationFrame` 允许使用（驱动的是基于真实音频数据的连续反馈，不算动画进度）。

### 1.2 ✅ 推荐模式

```tsx
import { useCurrentFrame, interpolate, Easing, spring, useVideoConfig } from "remotion";

// 入场（opacity 0→1，10-15帧）
const frame = useCurrentFrame();
const opacity = interpolate(frame, [10, 15], [0, 1], {
  extrapolateRight: "clamp",
  easing: Easing.bezier(0.16, 1, 0.3, 1), // power2.out 等效
});

// 出场（opacity 1→0）
const exitOpacity = interpolate(frame, [40, 45], [1, 0], {
  extrapolateRight: "clamp",
  easing: Easing.bezier(0.3, 0, 1, 0.7), // power2.in 等效
});

// 弹跳强调（spring 动画）
const { fps } = useVideoConfig();
const scale = spring({
  frame,
  fps,
  config: { damping: 12, stiffness: 200 },
});

// 数字滚动
const progress = interpolate(frame, [20, 40], [0, 100], {
  extrapolateRight: "clamp",
});
```

### 1.3 为什么 `useCurrentFrame()` + `interpolate()` 是唯一选择

| 框架/方案 | 按帧推进 | 确定性 | 性能 | 评分 |
|---|---|---|---|---|
| **`useCurrentFrame()` + `interpolate()`** | ✅ 强制 | ✅ 帧精确 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| CSS transition | ❌ 实时 | ❌ 受 GPU 影响 | ⭐⭐⭐ | ⭐ |
| CSS animation | ❌ 实时 | ❌ 受 GPU 影响 | ⭐⭐⭐ | ⭐ |
| GSAP（外部库）| ❌ 实时 | ❌ 受主线程影响 | ⭐⭐⭐ | ⭐ |
| requestAnimationFrame | ❌ 实时 | ❌ 受主线程影响 | ⭐⭐ | ⭐ |
| Tailwind 动画类 | ❌ 同 CSS | ❌ | ⭐⭐⭐ | ⭐ |

> **结论**：Remotion 引擎按帧 seek → 动画必须能在**任意帧**还原状态。CSS/GSAP/RAF 全部依赖"实时推进"，seek 时会卡帧或跳变。**`useCurrentFrame()` + `interpolate()` 是唯一能 frame-accurate seek 的方案**。

---

## 2 · 6 条 ease 曲线（推荐 + 决策树）

| Easing | 适用场景 | Remotion 实现 |
|---|---|---|
| `Easing.bezier(0.16, 1, 0.3, 1)` | 入场（柔和减速）| **默认首选** |
| `Easing.bezier(0.3, 0, 1, 0.7)` | 出场（加速消失）| 默认出场 |
| `Easing.bezier(0.4, 0, 0.2, 1)` | 转场（对称加减速）| fade / push_left / push_right |
| `Easing.bezier(0.2, 0, 0, 1)` | 强调（对称加减速）| 数字滚动、进度条 |
| `Easing.out(Easing.back(1.7))` | 弹跳入场 | highlight segment 二次跳动 |
| `Easing.linear` | 等速（用于 mask / 进度条）| 少用 |

### 2.1 ease 选型决策树

```
入场 / 出场？
├─ 入场
│  ├─ 普通（标题/卡片/视频）→ Easing.bezier(0.16, 1, 0.3, 1)
│  └─ 弹跳（highlight / CTA）→ Easing.out(Easing.back(1.7))
├─ 出场
│  └─ Easing.bezier(0.3, 0, 1, 0.7)
├─ 转场（fade / push_left / push_right）
│  └─ Easing.bezier(0.4, 0, 0.2, 1)
└─ 强调（数字滚动 / 进度条）
   └─ Easing.bezier(0.2, 0, 0, 1)
```

### 2.2 ease 反模式

- ❌ 入场用 `Easing.bezier(0.3, 0, 1, 0.7)`（先快后慢 → 撞墙感）
- ❌ 出场用 `Easing.bezier(0.16, 1, 0.3, 1)`（减速 → 不干脆）
- ❌ 转场用 `Easing.linear`（机械感）
- ❌ 全场用同一种 ease（节奏单调）

---

## 3 · 元素入场 / 出场规范

### 3.1 入场

| 元素 | 帧数（@30fps）| Easing | 实现 |
|---|---|---|---|
| **标题** | 12-18 帧（0.4-0.6s）| `Easing.bezier(0.16, 1, 0.3, 1)` | `interpolate` opacity 0→1 + y 30→0 |
| **卡片** | 12 帧（0.4s）| `Easing.bezier(0.16, 1, 0.3, 1)` | 同上 |
| **视频/图片** | 15 帧（0.5s）| `Easing.bezier(0.16, 1, 0.3, 1)` | scale 0.95→1 + opacity 0→1 |
| **highlight 字幕** | 7-8 帧（0.25s）| `Easing.out(Easing.back(1.7))` | spring 或 `interpolate` scale 1→1.15 |

### 3.2 出场

| 元素 | 帧数（@30fps）| Easing | 实现 |
|---|---|---|---|
| **标题** | 9 帧（0.3s）| `Easing.bezier(0.3, 0, 1, 0.7)` | opacity 1→0 + y 0→-20 |
| **卡片** | 9 帧（0.3s）| `Easing.bezier(0.3, 0, 1, 0.7)` | opacity 1→0 + y 0→20 |
| **视频/图片** | 12 帧（0.4s）| `Easing.bezier(0.3, 0, 1, 0.7)` | scale 1→1.05 + opacity 1→0 |

### 3.3 强调

- **数字滚动**：`interpolate` + `Math.round` 映射
- **脉冲**：`spring({ frame, fps, config: { damping: 10 } })` 循环
- **闪烁**：用 `interpolate` + `yoyo: true`（需自行实现或用 Sequence）

---

## 4 · 转场动画（`<Sequence>` 重叠）

> Remotion 用 `<Sequence>` 组件实现转场，通过 `from` 和 `durationInFrames` 控制时间重叠。

```tsx
import { Sequence, AbsoluteFill } from "remotion";

const Scene = () => {
  const fps = 30;

  return (
    <AbsoluteFill>
      {/* Shot 1：0-90帧（0-3s）*/}
      <Sequence from={0} durationInFrames={90}>
        <Shot1 />
      </Sequence>

      {/* Shot 2 在 85帧开始（与 Shot 1 重叠 5帧=0.15s，防硬切）*/}
      <Sequence from={85} durationInFrames={90}>
        <Shot2 />
      </Sequence>
    </AbsoluteFill>
  );
};
```

### 4.1 14 类转场 Remotion 实现

> **转场代码**：`src/utils/transition.ts` 的 `getTransitionEffect()` 函数。
> **调性选择**：B 类力量感用 push_left/slide-left/zoom；A 类柔和用 fade/slide-up/down；C 类科技用 fade/slide-left/wipe-h。

#### 4.1.1 纯透明度（1 种）

| 转场 | 效果 | 适用场景 |
|---|---|---|
| `fade` | opacity 0↔1 | A 类人设 / 柔和切换 / 默认 |

#### 4.1.2 水平位移 X 轴（4 种）

| 转场 | 效果 | 适用场景 |
|---|---|---|
| `push_left` | translateX 80→0，有力硬切 | **B 类默认**，强调动作 |
| `push_right` | translateX -80→0，有力右推 | B 类交替方向 |
| `slide-left` | translateX 50→0，柔和滑入 | A 类柔和 / C 类科技 |
| `slide-right` | translateX -50→0，柔和右滑 | A 类柔和 |

#### 4.1.3 垂直位移 Y 轴（2 种）

| 转场 | 效果 | 适用场景 |
|---|---|---|
| `slide-up` | translateY 50→0，上滑入 | A 类自然感 |
| `slide-down` | translateY -50→0，下滑入 | A 类自然感 |

#### 4.1.4 缩放（2 种）

| 转场 | 效果 | 适用场景 |
|---|---|---|
| `zoom` | scale 1.1→1，放大入场 | B 类强调 / CTA |
| `shrink` | scale 1→0.9，缩小退场 | B 类柔和收尾 |

#### 4.1.5 条纹擦除 Wipe（2 种）

> 3 条条纹依次扫过：wipe-h 横条纹从下往上，wipe-v 竖条纹从左往右。
> 使用 `clipRect` 裁剪实现，不依赖 CSS `clip-path` 浏览器兼容。

| 转场 | 效果 | 适用场景 |
|---|---|---|
| `wipe-h` | 3 条横条纹依次入场（从下往上扫）| C 类科技感切换 |
| `wipe-v` | 3 条竖条纹依次入场（从左往右扫）| C 类科技感切换 |

#### 4.1.6 特殊（3 种）

| 转场 | 效果 | 适用场景 |
|---|---|---|
| `none` | 无动画，opacity=1 | 硬切 / freeze frame |
| `pause_breath` | 见 [§5 段间停顿动效](#5--段间停顿动效pause_breath) | 段间停顿 |
| （仅 exit 时 shrink）| scale 1→0.9 | 配合 zoom 入场对称 |

### 4.2 ❌ 禁用转场

- ❌ **flip / 旋转 / 3D**（与"力量感"调性冲突）
- ❌ 切换 < 0.3s（防卡帧核心规则）
- ❌ blur_in / blur_out（Remotion canvas 不支持 CSS filter blur 渲染）
- ❌ dissolve / iris（需要额外素材，不推荐）
- ❌ wipe-blur / 光晕擦除（性能开销大）

---

## 5 · 段间停顿动效（pause_breath）

> 详见 [timing-sync.md §段间停顿](timing-sync.md#段间停顿规范-05-1s用户硬约束)。**4 种必选其一**：

| 模式 | Remotion 实现 |
|---|---|
| **0.8× 慢动作** | `<Video playbackRate={0.8} />` |
| **1.2× 加速** | `<Video playbackRate={1.2} />` |
| **特写（zoom in 1.2×）** | `interpolate` scale 1→1.2 |
| **freeze frame（定格）** | 用 `pause()` + 静态帧 |

---

## 6 · Stagger（错位入场）

> 在 Remotion 中用多个 `<Sequence>` 或 map + 索引错开实现。

```tsx
// 方案 1：多个 Sequence 错开
<Sequence from={0}><Card index={0} /></Sequence>
<Sequence from={3}><Card index={1} /></Sequence>
<Sequence from={6}><Card index={2} /></Sequence>

// 方案 2：map + stagger 计算
{[0, 1, 2].map((i) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - i * 3, [0, 6], [0, 1], { extrapolateRight: "clamp" });
  return <div style={{ opacity }}>Card {i}</div>;
})}
```

### 6.1 stagger 选型

| 场景 | stagger 帧数（@30fps）|
|---|---|
| 列表项依次入场 | 3 帧（0.1s）|
| 关键参数逐步展示 | 4-5 帧（0.15s）|
| 数据飞入卡片 | 1-2 帧（0.05s）|
| 段落标题 + 副标题 | 6 帧（0.2s）|

---

## 7 · 数字滚动

```tsx
import { useCurrentFrame, interpolate } from "remotion";

const Counter = ({ target, startFrame = 20 }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [startFrame, startFrame + 45], [0, target], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.2, 0, 0, 1), // power3.inOut 等效
  });

  return <div>{Math.round(progress)}</div>;
};
```

### 7.1 数字滚动场景

- 训练计数（"12 次 × 3 组"）
- 数据可视化（PR 重量 100kg）
- 倒计时（"3 秒自测"）
- 进度百分比（"60% 改善"）

---

## 8 · 音频可视化（AnalyserNode）

```tsx
// Remotion 中使用 Web Audio API
const audioRef = useRef<HTMLAudioElement>(null);

useEffect(() => {
  const audioCtx = new AudioContext();
  const source = audioCtx.createMediaElementSource(audioRef.current!);
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256;
  source.connect(analyser);
  analyser.connect(audioCtx.destination);

  const data = new Uint8Array(analyser.frequencyBinCount);
  function tick() {
    analyser.getByteFrequencyData(data);
    // data[i] 0-255 → 映射到 scale / opacity / ...
    requestAnimationFrame(tick);
  }
  tick();
}, []);
```

> **注意**：`requestAnimationFrame` 在音频可视化中**允许使用**（不是算动画进度），因为它驱动的是基于真实音频数据的连续反馈。

### 8.1 音频可视化应用场景

| 场景 | 映射 |
|---|---|
| 频谱柱 | data[i] → height |
| 圆形波形 | data[i] → radius |
| 节奏脉冲 | data[0] → scale（节拍时脉冲）|
| 背景动效 | data[0] → opacity / blur |

---

## 10 · 进阶剪辑手法（调研补充）

> 来源：短视频行业调研 2025-2026

### 10.1 节奏感剪辑

配合音乐节奏和视觉画面调动，让视频更具感染力。

| 场景 | 手法 | 实现 |
|---|---|---|
| 运动/健身类 | **快节奏剪辑** + 动感 BGM | 镜头切换 0.5-1s，节奏紧凑 |
| 情感/反思类 | **慢节奏剪辑** + 舒缓 BGM | 镜头停留 3-5s，突出细节 |
| BGM 卡点 | **音频驱动切换** | 鼓点/歌词触发视觉变化 |

### 10.2 镜头切换进阶手法

| 手法 | 描述 | 适用场景 |
|---|---|---|
| **闪白** | 空白场景穿插，产生速度感 | 运动/节奏强烈视频 |
| **叠化** | 1-2帧重叠，平滑过渡 | 情感场景/场景转换 |
| **动作连接** | 大小两个画面按 7:3 比例连接 | 动作连贯性 |
| **无缝转场** | 主体不变，场景切换 | 空间转换 |
| **跳切** | 突然切换，表现时间/空间跃迁 | 快速节奏/强调 |

### 10.3 分屏布局（画中画进阶）

| 布局 | 描述 | Remotion 实现 |
|---|---|---|
| **双视角对照** | 左：侧视角 / 右：正视角 | 两个 `<OffthreadVideo>` 并排 |
| **画中画叠加** | 主画面 + 右下角小窗 | 绝对定位叠加 |
| **对比分屏** | 正确 vs 错误姿势 | `<div>` 左右分栏 |
| **参数+动作** | 下 60% 动作 + 上 40% 参数面板 | 上下分栏 |

### 10.4 竖屏特有布局（9:16）

| 布局 | 描述 | 适用 |
|---|---|---|
| **人物居中** | 主体居中，上下留白 | 口播/演讲 |
| **参数悬浮** | 动作画面 + 四角参数卡 | 健身教学 |
| **分步展示** | 上：动作 / 下：文字说明 | 教程类 |
| **AI 识别字幕** | 全屏动作 + 底部高亮字幕 | 跟练类 |

---

## 11 · B 类健身视频专项动效

> B 类（健身知识）的专属动效模式

### 11.1 动作参数 overlay

| 元素 | 位置 | 动效 |
|---|---|---|
| 动作名 | 左上/右上 | 入场弹跳 |
| 重量 | 右上 | 数字滚动 |
| 次数×组数 | 右下 | 依次入场 |
| RPE | 左下 | 脉冲强调 |

### 11.2 动作对比动效

```tsx
// 正确 vs 错误 双视角
<div style={{ display: 'flex', width: '100%' }}>
  <div style={{ width: '50%', border: '2px solid #FF4500' }}> {/* 正确 */}
  <div style={{ width: '50%', border: '2px solid #DC143C' }}> {/* 错误 */}
</div>
```

### 11.3 段间停顿时长（B 类）

| 位置 | 推荐时长 | 动效 |
|---|---|---|
| 自测 → 动作 | **1.0s** | freeze frame + 慢动作 |
| 动作 → 动作 | 0.5s | quick cut |
| 主体 → 收尾 | **1.0s** | fade out + zoom |

---

## 12 · A 类人设视频专项动效

> A 类（个人人设）的专属模式

### 12.1 双态切换（A 类核心）

| 切换 | 时长 | ease | Remotion 实现 |
|---|---|---|---|
| 全屏 → 分栏 | 0.5s | `power2.inOut` | `interpolate` width/height/x/y |
| 分栏 → 全屏 | 0.5s | `power2.inOut` | 同上反向 |

### 12.2 A 类背景动效

```tsx
// per-scene 背景切换
const bgOpacity = interpolate(currentFrame, [shotStart, shotEnd], [0.28, 0], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
})
```

---

## 13 · 反模式（扩展）

### 13.1 剪辑反模式

- ❌ **闪白滥用**（超过 3 次/视频 → 视觉疲劳）
- ❌ **叠化滥用**（全程叠化 → 拖沓感）
- ❌ **跳切滥用**（景别变化不足 → 不适感）
- ❌ **转场过快**（< 0.3s → 卡帧感）
- ❌ **节奏单调**（全程同一速度 → 无聊）

### 13.2 布局反模式

- ❌ **分屏过多**（> 3 个区域 → 信息过载）
- ❌ **字幕遮挡主体**（底部安全区不足 → 关键信息被挡）
- ❌ **参数位置不一致**（同类型视频参数位置乱 → 观众困惑）

---

## 9 · 首帧锁住（防黑屏）

> Remotion 默认首帧可能空白，需确保初始状态有可见内容。

```tsx
// 方案 1：在组件顶层设置初始 opacity
const opacity = interpolate(frame, [0, 10], [1, 1], { extrapolateRight: "clamp" });

// 方案 2：用 spring 确保首帧有值
const scale = spring({ frame, fps, config: { damping: 15 } });
// spring 在 frame=0 时返回初始值（非 NaN）
```

### 9.1 Sequence 防止黑屏

> `<Sequence>` 内所有组件默认 `layout="none"`，需自行确保可见性。

```tsx
import { Sequence } from "remotion";

<Sequence from={0} durationInFrames={90}>
  <Shot1 />  {/* Shot1 内部用 interpolate 确保 0 帧时有 opacity=1 */}
</Sequence>
```

---

## 10 · `interpolate` 与 CSS transform 冲突

> **动画 `y`/`x` 时不要用 CSS `transform: translate(-50%,-50%)`**，改用 `xPercent: -50, yPercent: -50`：

```tsx
// ❌ 错误：CSS transform 与 interpolate 冲突
// style={{ transform: 'translate(-50%, -50%)', ...interpolate 的 y 值会被覆盖 }}

<div style={{
  position: 'absolute',
  top: '50%',
  left: '50%',
  xPercent: -50,  // ✅ 正确：用 xPercent/yPercent 居中
  yPercent: -50,
  // interpolate 的 y 值不会与 transform 冲突
}}>
```

### 10.1 居中方案速查

| 场景 | 推荐方案 |
|---|---|
| 绝对居中（单元素）| `xPercent: -50, yPercent: -50` |
| 水平居中 | `xPercent: -50` |
| 垂直居中 | `yPercent: -50` |
| 边角定位 | 用 `top` / `left` 像素值，**不**用 transform |

---

## 11 · 动效选型库（按场景）

> **6 大场景**——按"想表达什么"选动效。

### 11.1 钩子入场（0-3s）

**目标**：3 秒抓人。

```tsx
// 文字弹跳入场（首选）
const hookOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
const hookY = interpolate(frame, [0, 15], [50, 0], {
  extrapolateRight: "clamp",
  easing: Easing.out(Easing.back(1.4)),
});

// 整段飞入（次选，配合快速钩子）
const cardX = interpolate(frame, [0, 12], [100, 0], {
  extrapolateRight: "clamp",
  easing: Easing.out(Easing.cubic),
});
const cardOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
```

### 11.2 数据冲击（关键数字）

**目标**：让数字有"重量"。

```tsx
// 数字滚动（首选）
const numProgress = interpolate(frame, [15, 30], [0, 12], {
  extrapolateRight: "clamp",
  easing: Easing.bezier(0.2, 0, 0, 1),
});
const displayNum = Math.round(numProgress);

// 数字 + 1.15× 弹跳
const numScale = interpolate(frame, [15, 27], [0.5, 1.15], {
  extrapolateRight: "clamp",
  easing: Easing.out(Easing.back(1.7)),
});
```

### 11.3 CTA 强调（收尾）

**目标**：引导互动。

```tsx
// 1.15× 弹跳
const ctaScale = interpolate(frame, [0, 12], [0.8, 1.15], {
  extrapolateRight: "clamp",
  easing: Easing.out(Easing.back(1.7)),
});
```

### 11.4 进度感（数据飞入）

**目标**：让数据"流"起来。

```tsx
// 数字依次飞入（stagger）
const statOpacity = interpolate(frame - i * 5, [0, 12], [0, 1], {
  extrapolateRight: "clamp",
});

// 进度条填充
const barWidth = interpolate(frame, [20, 50], [0, 60], {
  extrapolateRight: "clamp",
  easing: Easing.bezier(0.2, 0, 0, 1),
});
```

### 11.5 段间停顿（pause_breath 4 选 1）

> 见 [§5 段间停顿动效](#5--段间停顿动效pause_breath)。

```tsx
// Remotion Video 组件支持 playbackRate
<Video playbackRate={0.8} ... />  // 慢动作
<Video playbackRate={1.2} ... />  // 加速

// 特写：用 interpolate scale
const scale = interpolate(frame, [0, 21], [1, 1.2], { extrapolateRight: "clamp" });
<Video style={{ transform: `scale(${scale})` }} ... />
```

### 11.6 音频可视化（BGM 驱动）

> 见 [§8 音频可视化](#8--音频可视化analysernode)。

### 11.7 扩展动效库（v4.1 新增 · 2026-06-13）

> **基于 Motion Graphics 行业标准扩展的动效库**（18 类），按需选用。

#### 11.7.1 入场 / 出场动效

| 动效 | Remotion 实现 | 适用场景 |
|---|---|---|
| 字母依次出现 | `interpolate` + map 错开 stagger | 标题入场 / 金句强调 |
| 单词依次出现 | `interpolate` + stagger 帧错开 | 多词标题 / callout |
| 滑入 + 弹跳 | `Easing.out(Easing.back(1.4))` + opacity | 卡片 / 面板入场 |
| 缩放弹跳 | `Easing.out(Easing.back(1.7))` + scale | CTA / 数字强调 |
| 渐显 + 上浮 | `interpolate` y: 30→0 + opacity 0→1 | 通用入场 |
| 渐隐 + 下滑 | `interpolate` y: 0→30 + opacity 1→0 | 通用出场 |
| 挤压入场 | `interpolate` scaleX/scaleY | 图标 / emoji / 小元素 |
| 旋转入场 | `interpolate` rotation | 箭头 / 装饰元素 |

#### 11.7.2 转场动效

| 动效 | Remotion 实现 | 适用场景 |
|---|---|---|
| Wipe Left | `interpolate` translateX: [-1920, 0] | 方向感强的推进 |
| Wipe Right | `interpolate` translateX: [1920, 0] | 同上，反方向 |
| Wipe Up | `interpolate` translateY: [1080, 0] | 向上推进 |
| Wipe Down | `interpolate` translateY: [-1080, 0] | 向下推进 |
| Curtain | 上下两 panel 相向关闭/展开 | 全屏切换 |
| Zoom Transition | `interpolate` scale: [1.5, 1] + opacity | 强调转场 |
| Crossfade | `interpolate` opacity: [1, 0] | 柔和过渡（最常用）|
| Blur Transition | `interpolate` filter: blur(20px)→blur(0) | 梦幻转场 |
| Push | 前一元素 translateX: -1920 + 新元素 translateX: 1920→0 | 主流行转场 |

#### 11.7.3 强调 / 数据动效

| 动效 | Remotion 实现 | 适用场景 |
|---|---|---|
| 数字滚动 Counter | `interpolate` + `Math.round(target)` | 计数 / PR / 进度 |
| 脉冲 Pulse | `spring` + repeat（需手动控制）| 关键数据 / CTA |
| 发光脉冲 | `interpolate` boxShadow | 强调数字 |
| 划线强调 | CSS background + width 动画 | 关键词强调 |
| 背景闪烁 | `interpolate` backgroundColor | 文字高亮 |

#### 11.7.4 特殊效果

| 动效 | Remotion 实现 | 适用场景 |
|---|---|---|
| Glitch | 多层 R/G/B 偏移 + `interpolate` | 科技感 / 警告 |
| Chromatic Aberration | 3 个同元素 R/G/B 偏移叠加 | 转场冲击 / 强调 |
| 打字机 Typewriter | 逐字 map + opacity:1 | 终端 / 代码展示 |
| Scan Line | `repeating-linear-gradient` overlay | 科技感 / 复古 |
| Morph 形状渐变 | `interpolate` borderRadius | 状态切换 |
| Particle Burst | 多 `div` 从中心 scale + opacity | 数据达成 / 里程碑 |
| Parallax 视差 | 背景层 `interpolate` y + 前景层不动 | 背景层次感 |

#### 11.7.5 A/B 类专属动效速查

| 场景 | 动效 | Remotion 参数 |
|---|---|---|
| A 类钩子 | 数字卡弹跳 + 脉冲 | `Easing.out(Easing.back(1.7))`, stagger 3帧 |
| A 类工具展示 | 终端打字机效果 | 每字 1帧 |
| A 类双态切换 | 正方形缩小/放大 | 0.5s `Easing.bezier(0.4, 0, 0.2, 1)` |
| A 类收尾 | CTA 卡片弹跳 + 霓虹描边 | `Easing.out(Easing.back(1.4))` + box-shadow |
| B 类动作强调 | 放大特写 scale: 1.3 | 0.4s `Easing.out(Easing.cubic)` |
| B 类计数 | 数字滚动 + 闪烁 | `Easing.bezier(0.2, 0, 0, 1)`, 0.8s |
| B 类段间停顿 | zoom in 1.2x / 0.8x 慢动作 | 0.7s `Easing.out(Easing.cubic)` |
| A/B 类字幕 | 字母依次出现 | stagger 1帧 |
| A/B 类进度条 | width 填充 + 颜色渐变 | `Easing.bezier(0.2, 0, 0, 1)` |

#### 11.7.6 A 类动效适配方案（v4.2 新增）

> **A 类视频动效核心**：**慢进 + 留白 + 强调**——3 类基本节奏（详 §4.1）。所有动效都围绕"3 秒抓人 + 1 秒消化"展开。

##### 11.7.6.1 钩子入场（0-3s）
**目标**：3 秒抓人。

```tsx
// 文字弹跳入场（首选）
const hookOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
const hookY = interpolate(frame, [0, 15], [50, 0], {
  extrapolateRight: "clamp",
  easing: Easing.out(Easing.back(1.4)),
});

// 数字卡弹跳 + 脉冲（次选，配合快速钩子）
const cardScale = spring({ frame, fps, config: { damping: 12, stiffness: 200 } });
```

##### 11.7.6.2 数据冲击（关键数字）
**目标**：让数字有"重量"。

```tsx
// 数字滚动（首选）
const progress = interpolate(frame, [20, 50], [0, target], {
  extrapolateRight: "clamp",
  easing: Easing.bezier(0.2, 0, 0, 1),
});
const displayNum = Math.round(progress);

// 数字 + 1.15× 弹跳
const numScale = interpolate(frame, [20, 30], [0.5, 1.15], {
  extrapolateRight: "clamp",
  easing: Easing.out(Easing.back(1.7)),
});
```

##### 11.7.6.3 CTA 强调（收尾）
**目标**：引导互动。

```js
// 1.15× 弹跳 + 0.05s 二次
```tsx
// CTA 弹跳 + 霓虹描边
const ctaScale = interpolate(frame, [0, 20], [0.8, 1.15], {
  extrapolateRight: "clamp",
  easing: Easing.out(Easing.back(1.7)),
});
```

##### 11.7.6.4 进度感（数据飞入）
**目标**：让数据"流"起来。

```tsx
// 数字依次飞入（stagger）
const statOpacity = interpolate(frame - i * 3, [0, 6], [0, 1], {
  extrapolateRight: "clamp",
});

// 进度条填充
const barWidth = interpolate(frame, [20, 50], [0, 60], {
  extrapolateRight: "clamp",
  easing: Easing.bezier(0.2, 0, 0, 1),
});
```

##### 11.7.6.5 段间停顿（pause_breath 4 选 1）
> 见 [§5 段间停顿动效](#5--段间停顿动效pause_breath)。

##### 11.7.6.6 音频可视化（BGM 驱动）
> 见 [§8 音频可视化](#8--音频可视化analysernode)。

##### 11.7.6.7 双态切换动效（A 类专属）
> 详见 [§12 A 类双态切换动效](#12--a-类双态切换动效2026-06-10-新增)。

#### 11.7.7 B 类动效适配方案（v4.2 新增）

> **B 类视频动效核心**：**紧凑 + 强调 + 节拍**——3 类基本节奏（详 §4.1）。所有动效都围绕"动作演示 + 数据可视化"展开。

##### 11.7.7.1 动作强调（关键动作）
**目标**：让动作有"力量"。

```tsx
// 放大特写（首选）
const actionScale = interpolate(frame, [0, 12], [0.8, 1.3], {
  extrapolateRight: "clamp",
  easing: Easing.out(Easing.cubic),
});

// 动作 + 1.15× 弹跳
const actionScaleBounce = interpolate(frame, [0, 12], [1.0, 1.15], {
  extrapolateRight: "clamp",
  easing: Easing.out(Easing.back(1.7)),
});
```

##### 11.7.7.2 计数（关键数据）
**目标**：让计数有"节奏"。

```tsx
// 数字滚动
const countProgress = interpolate(frame, [0, 24], [0, 12], {
  extrapolateRight: "clamp",
  easing: Easing.bezier(0.2, 0, 0, 1),
});
const displayNum = Math.round(countProgress);
```

##### 11.7.7.3 段间停顿（pause_breath）
**目标**：让停顿有"呼吸"。

```tsx
// zoom in 1.2×
const breathScale = interpolate(frame, [0, 21], [1, 1.2], {
  extrapolateRight: "clamp",
  easing: Easing.out(Easing.cubic),
});
```

##### 11.7.7.4 字幕（关键要点）
**目标**：让字幕有"节奏"。

```tsx
// 字母依次出现（首选）
const charOpacity = interpolate(frame - i, [0, 3], [0, 1], {
  extrapolateRight: "clamp",
});
```

##### 11.7.7.5 进度条（完成度）
**目标**：让进度有"流动"。

```tsx
// width 填充 + 颜色渐变
const barWidth = interpolate(frame, [20, 50], [0, 60], {
  extrapolateRight: "clamp",
  easing: Easing.bezier(0.2, 0, 0, 1),
});
```

##### 11.7.7.6 节拍驱动（BGM 驱动）
**目标**：让动作有"节拍"。

> 见 [§8 音频可视化](#8--音频可视化analysernode)。

##### 11.7.7.7 镜像对照（动作正误对比）
**目标**：让对比有"冲击"。

```tsx
// 左/右各 50%，同一动作正/误同步对比
const leftX = interpolate(frame, [0, 12], [-100, 0], {
  extrapolateRight: "clamp",
  easing: Easing.out(Easing.cubic),
});
const rightX = interpolate(frame, [0, 12], [100, 0], {
  extrapolateRight: "clamp",
  easing: Easing.out(Easing.cubic),
});
```

---

## 17 · 视觉效果规范（v4.1 新增 · 2026-06-13）

> **A/B 类视频的视觉风格规范**——各类视觉效果的使用位置、参数和 CSS 实现。

### 17.1 效果速查表

| 效果 | CSS 实现 | 使用位置 | 参数 |
|---|---|---|---|
| 羽化描边（全屏态）| `box-shadow: inset 0 0 30px 8px rgba(10,10,10,0.5), 0 0 80px 40px rgba(10,10,10,0.4)` | 全屏态 `.talking-head` | 固定 |
| 径向遮罩（全屏态）| `mask-image: radial-gradient(circle 80% 80% at 50% 50%, black 10%, transparent 100%)` | 全屏态视频边缘淡化 | 固定 |
| 渐变叠加 | `background: radial-gradient(ellipse 70% 70% at 50% 50%, rgba(10,10,10,0.2) 0%, rgba(10,10,10,0.85) 100%)` | `.bg-overlay` 背景层 | 固定 |
| 毛玻璃背景 | `backdrop-filter: blur(12px)` + 半透明背景 | Split 态辅助内容框 | blur 8-16px |
| 霓虹描边 | `box-shadow: 0 0 0 2px var(--accent-1), 0 0 20px var(--accent-1)` | CTA 卡 / highlight 元素 | accent-1 或 accent-2 |
| 暗角 | `radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)` | 全屏 overlay | 固定 |
| Per-scene 背景切换 | 多 `img.bg-scene[data-scene]` 叠加，`interpolate` 切换 `opacity` | 每场景独立背景 | 用 `interpolate` 控制 opacity |
| 光晕 Glow | `box-shadow: 0 0 30px 10px rgba(255,69,0,0.3)` | 强调元素边缘 | 颜色按场景 |
| 噪点纹理 | `filter: url(#noise)` SVG filter 或 CSS `background-image: url(noise.png)` | 科技感 / 复古 | 5-10% opacity |
| 色差 Chromatic | 3 个元素层 R/G/B 偏移 2-4px | 强调 / 转场冲击 | 偏移 2-4px |
| VHS 条纹 | `repeating-linear-gradient` 半透明扫描线 | 复古科技感 | 3-5px 间隔 |
| 跟踪线 Tracking Lines | 斜向 `linear-gradient` overlay | 动感 / 速度感 | 15-30deg |
| 色温偏移 | `filter: sepia(0.1) saturate(1.2)` | 暖/冷色调氛围 | 按场景调性 |
| 景深模糊 | `filter: blur(4px)` 在非焦点元素 | 层次感 | blur 2-8px |

### 17.2 A 类视频特效适配方案（v4.2 新增）

> **A 类视频特效核心**：**科技感 + 数据冲击**——全屏态用羽化描边 + 径向遮罩，Split 态用毛玻璃背景 + 霓虹描边，数据展示用光晕 Glow + 数字弹跳。

#### 17.2.1 全屏态特效
**目标**：让口播视频有"质感"。

| 特效 | CSS 实现 | 参数 | 说明 |
|---|---|---|---|
| **羽化描边** | `box-shadow: inset 0 0 30px 8px rgba(10,10,10,0.5), 0 0 80px 40px rgba(10,10,10,0.4)` | 固定 | 视频边缘渐变淡化 |
| **径向遮罩** | `mask-image: radial-gradient(circle 80% 80% at 50% 50%, black 10%, transparent 100%)` | 固定 | 视频边缘羽化 |
| **暗角** | `radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)` | 固定 | 全屏氛围 |

#### 17.2.2 Split 态特效
**目标**：让辅助内容有"科技感"。

| 特效 | CSS 实现 | 参数 | 说明 |
|---|---|---|---|
| **毛玻璃背景** | `backdrop-filter: blur(12px)` + 半透明背景 | blur 8-16px | 辅助内容框背景 |
| **霓虹描边** | `box-shadow: 0 0 0 2px var(--accent-1), 0 0 20px var(--accent-1)` | accent-1 或 accent-2 | CTA 卡 / highlight 元素 |
| **渐变叠加** | `background: radial-gradient(ellipse 70% 70% at 50% 50%, rgba(10,10,10,0.2) 0%, rgba(10,10,10,0.85) 100%)` | 固定 | 背景层 |

#### 17.2.3 科技感特效
**目标**：让工具展示有"未来感"。

| 特效 | CSS 实现 | 参数 | 说明 |
|---|---|---|---|
| **噪点纹理** | `filter: url(#noise)` SVG filter 或 CSS `background-image: url(noise.png)` | 5-10% opacity | 科技感 / 复古 |
| **色差 Chromatic** | 3 个元素层 R/G/B 偏移 2-4px | 偏移 2-4px | 强调 / 转场冲击 |
| **跟踪线 Tracking Lines** | 斜向 `linear-gradient` overlay | 15-30deg | 动感 / 速度感 |
| **VHS 条纹** | `repeating-linear-gradient` 半透明扫描线 | 3-5px 间隔 | 复古科技感 |

#### 17.2.4 数据冲击特效
**目标**：让关键数据有"重量"。

| 特效 | CSS 实现 | 参数 | 说明 |
|---|---|---|---|
| **光晕 Glow** | `box-shadow: 0 0 30px 10px rgba(255,69,0,0.3)` | 颜色按场景 | 强调元素边缘 |
| **霓虹描边** | `box-shadow: 0 0 0 2px #FF4500, 0 0 20px #FF4500` | 固定 | 数字卡 / CTA 卡 |
| **数字弹跳** | `interpolate` scale: 0.5→1.15 + `Easing.out(Easing.back(1.7))` | 固定 | 关键数字 |

### 17.3 B 类视频特效适配方案（v4.2 新增）

> **B 类视频特效核心**：**力量感 + 节拍驱动**——动作强调用景深模糊 + 光晕 Glow，数据展示用霓虹描边 + 数字弹跳，节拍驱动用音频可视化 + 节奏脉冲。

#### 17.3.1 动作强调特效
**目标**：让动作有"力量"。

| 特效 | CSS 实现 | 参数 | 说明 |
|---|---|---|---|
| **景深模糊** | `filter: blur(4px)` 在非焦点元素 | blur 2-8px | 层次感 |
| **光晕 Glow** | `box-shadow: 0 0 30px 10px rgba(220,20,60,0.3)` | 颜色按场景 | 动作边缘强调 |
| **放大特写** | `interpolate` scale: 1→1.3 + `Easing.out(Easing.cubic)` | 固定 | 关键动作 |

#### 17.3.2 数据展示特效
**目标**：让数据有"节奏"。

| 特效 | CSS 实现 | 参数 | 说明 |
|---|---|---|---|
| **霓虹描边** | `box-shadow: 0 0 0 2px #DC143C, 0 0 20px #DC143C` | 固定 | 参数卡 / 计数卡 |
| **数字弹跳** | `interpolate` scale: 0.5→1.15 + `Easing.out(Easing.back(1.7))` | 固定 | 关键数字 |
| **RPE/难度色块** | `background: rgba(220,20,60,0.15)` + `border: 2px solid #DC143C` | 红色系表示高强度 | 难度标识 |

#### 17.3.3 力量感特效
**目标**：让教学有"硬朗"。

| 特效 | CSS 实现 | 参数 | 说明 |
|---|---|---|---|
| **粗描边** | `border: 4px solid #333333` | 固定 | 卡片 / 面板 |
| **高对比** | `color: #FFFFFF` on `#0A0A0A` | 固定 | 文字 / 背景 |
| **硬朗圆角** | `border-radius: 12px` | 固定 | 卡片 / 按钮 |

#### 17.3.4 节拍驱动特效
**目标**：让训练有"节奏"。

| 特效 | Remotion 实现 | 参数 | 说明 |
|---|---|---|---|
| **节拍脉冲环** | `interpolate` scale: 1→1+bass/500 + RAF | `AnalyserNode` 数据驱动 | 低频脉冲 |
| **高频闪烁** | `interpolate` opacity: treble/255 + RAF | `AnalyserNode` 数据驱动 | 高频闪烁 |
| **频谱柱** | `interpolate` height: data[i] + RAF | `AnalyserNode` 数据驱动 | 频谱可视化 |

### 17.4 效果使用决策树

```
效果用在哪种元素上？
├─ 口播视频（全屏态）→ 羽化描边 + 径向遮罩
├─ 口播视频（Split 态）→ 无装饰（直接透明叠画布）
├─ 辅助内容框 → 毛玻璃背景
├─ 背景层 → 渐变叠加 + 暗角
├─ CTA / highlight → 霓虹描边
├─ 全屏整体氛围 → 暗角
├─ 需要科技感 → 噪点纹理 / 色差
└─ 需要动感 → 跟踪线
```

### 17.5 视觉风格速查

| 风格 | 关键词 | 配色 | 典型场景 |
|---|---|---|---|
| 科技感 | 毛玻璃 + 霓虹描边 + 暗角 + 噪点 | `#0A0A0A` + `#FF4500` | A 类工具展示 |
| 力量感 | 粗描边 + 高对比 + 硬朗圆角 | `#0A0A0A` + `#DC143C` | B 类动作教学 |
| 数据冲击 | 数字弹跳 + 霓虹 + 深色背景 | `#FF4500` + `#FFC800` | A 类钩子数字卡 |
| 极简 | 无装饰 + 纯白文字 + 透明背景 | `#FFFFFF` on transparent | C 类产品介绍 |
| 复古科技 | VHS 条纹 + 噪点 + 色差 | 低饱和 + tracking lines | A/B 类创意场景 |
| 自然氛围 | 暖色温 + 柔焦 | `#0A0A0A` + 暖橙光晕 | 个人故事类 A |

### 17.6 视频效果进阶（Remotion 实现）

| 效果 | HTML/CSS 结构 | Remotion 动画 | 适用场景 |
|---|---|---|---|
| Split Screen Transition | 上下/左右两 panel 遮挡 | 各自 `interpolate` translateX | 场景切换 |
| Book Page Flip | 3D `rotateY` 翻页效果 | `interpolate` rotationY | 章节过渡 |
| Letter by Letter Reveal | 每个字包在 `<span class="char">` | map + stagger | 标题 / 金句 |
| Parallax Background | 多层背景不同速度 | `interpolate` translateY | 深度感 |
| Count-up + Suffix | 数字 + 单位后缀动画 | `Math.round` + `interpolate` | PR / 进度数据 |
| Elastic Snap | 元素吸附动画 | `spring` + `Easing.out(Easing.elastic)` | 强调 / CTA |
| Swing | 钟摆式摆动 | `interpolate` rotation | 装饰 / 箭头 |

### 17.7 B 类视频专用视觉效果

| 效果 | 实现 | 参数 |
|---|---|---|
| RPE/难度色块 | `background: rgba(220,20,60,0.15)` + `border: 2px solid #DC143C` | 红色系表示高强度 |
| 组数 × 次数 overlay | 固定位置 `position: absolute` + 数字滚动 | 右下角 64px 字号 |
| 动作标注线 | SVG `<line>` + `interpolate` `stroke-dashoffset` | 标注动作要点 |
| 节拍脉冲环 | 同心圆 `scale` + `opacity` 联动 BGM | `AnalyserNode` 数据驱动 |
| 进度时间条 | `height: 4px` + `width` 随时间增长 | 底部居中 |
| 动作轨迹 | 视频上叠加半透明箭头 SVG | SVG `motionPath` |

### 17.6 音效驱动视觉效果（AnalyserNode 联动）

```js
// BGM 频谱驱动视觉元素（Remotion 中使用 useRef + RAF）
const analyserRef = useRef<AnalyserNode | null>(null);

useEffect(() => {
  const audioCtx = new AudioContext();
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 128;
  analyserRef.current = analyser;

  const data = new Uint8Array(analyser.frequencyBinCount);
  function tick() {
    analyser.getByteFrequencyData(data);
    // data 映射到视觉属性由 RAF 驱动
    requestAnimationFrame(tick);
  }
  tick();
}, []);

| 场景 | 映射目标 |
|---|---|
| 节拍脉冲 Beat Pulse | `data[0]` → `.pulse-ring` scale |
| 高频闪烁 Treble Sparkle | `data[64]` → `.sparkle` opacity |
| 频谱柱 Spectrum Bar | `data[i]` → 各自 bar 的 height |
| 波形圆 Wave Circle | `data[i]` → radius |
| Bass 震动 Bass Shake | `data[0-4]` → container `x` 微震动 |

### 17.7 效果叠加规则

| 组合 | 效果 | 备注 |
|---|---|---|
| 羽化 + 径向遮罩 | 全屏态口播视频 | 叠加使用 |
| 毛玻璃 + 霓虹描边 | Split 态辅助内容框 | 叠加使用 |
| 暗角 + 噪点 | 整体背景氛围 | 可选叠加 |
| 色差 + Glitch | 科技感强调 | 慎用，干扰阅读 |
| Tracking Lines + Scan Line | 动感科技 | CTA/收尾专用 |

### 17.8 调试图鉴（v4.1 新增）

| 症状 | 排查 | 修法 |
|---|---|---|
| 元素不动 | 确认 `interpolate` 的 frame 范围覆盖当前帧 | 检查 frame 范围 |
| 位置错位 | CSS `transform: translate(-50%,-50%)` 是否与 `interpolate` y 混用？ | 改用 `xPercent: -50, yPercent: -50` |
| 动画过快/过慢 | 帧范围是否 < 9 帧或 > 45 帧？ | 按规范调整 |
| 元素跳帧 | ease 是否用了 `Easing.linear`？ | 换 `Easing.bezier(...)` |
| 性能卡顿 | 同时动画 > 8 个元素？ | 减少元素数量 |
| 字体模糊 | `font-smoothing` 是否设置？ | 添加 `-webkit-font-smoothing: antialiased` |
| mask 不生效 | `mask-image` 是否加了 `-webkit-` 前缀？ | 同时加两个版本 |

> **6 类新增视觉效果**，按需选用。

| 动效 | Remotion 实现 | 适用场景 |
|---|---|---|
| **Glitch** | 多层 R/G/B 偏移 + `interpolate` + RAF | 强调数字错误 / 警告 / 科技感 |
| **Chromatic Aberration** | 3 层同元素 R/G/B 偏移叠加 | 强调 / 转场冲击 |
| **Wipe** | `interpolate` translateX: [-1920, 0] | 方向感强的转场 |
| **Morph（形状渐变）** | `interpolate` borderRadius | 状态切换强调 |
| **Scan Line** | `repeating-linear-gradient` overlay + `interpolate` opacity | 科技感 / 复古 / 终端 |
| **Particle Burst** | 多 `div` 从中心爆发 `scale + opacity` | 数据达成 / 里程碑 / CTA |

**A/B 类专属动效对照：**

| 场景 | 动效 | Remotion 参数 |
|---|---|---|
| A 类钩子 | 数字卡**弹跳 + 脉冲** | `Easing.out(Easing.back(1.7))`, stagger 3帧 |
| A 类工具展示 | 终端**打字机效果** | 每字 1帧 |
| A 类双态切换 | **正方形缩小/放大** | 0.5s `Easing.bezier(0.4, 0, 0.2, 1)` |
| A 类收尾 | **CTA 卡片弹跳 + 霓虹描边** | `Easing.out(Easing.back(1.4))` + `box-shadow` 脉冲 |
| B 类动作强调 | **放大特写** `scale: 1.3` | 0.4s `Easing.out(Easing.cubic)` |
| B 类计数 | **数字滚动 + 闪烁** | `Easing.bezier(0.2, 0, 0, 1)`, 0.8s |
| B 类段间 | **zoom in 1.2×** | 0.7s `Easing.out(Easing.cubic)` |

---

## 17 · 视觉效果规范（v4.1 新增）

> **A/B 类视频的视觉风格规范**——羽化、毛玻璃、渐变叠加等效果的使用位置和参数。

### 17.1 效果速查表

| 效果 | CSS 实现 | 使用位置 | 参数 |
|---|---|---|---|
| **羽化描边**（全屏态）| `box-shadow: inset 0 0 30px 8px rgba(10,10,10,0.5), 0 0 80px 40px rgba(10,10,10,0.4)` | 全屏态 `.talking-head` | 固定 |
| **径向遮罩**（全屏态）| `mask-image: radial-gradient(circle 80% 80% at 50% 50%, black 10%, transparent 100%)` | 全屏态视频边缘淡化 | 固定 |
| **渐变叠加** | `background: radial-gradient(ellipse 70% 70% at 50% 50%, rgba(10,10,10,0.2) 0%, rgba(10,10,10,0.85) 100%)` | `.bg-overlay` 背景层 | 固定 |
| **毛玻璃背景** | `backdrop-filter: blur(12px)` + 半透明背景 | Split 态辅助内容框 | blur 8-16px |
| **霓虹描边** | `box-shadow: 0 0 0 2px var(--accent-1), 0 0 20px var(--accent-1)` | CTA 卡 / highlight 元素 | accent-1 或 accent-2 |
| **暗角** | `radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)` | 全屏 overlay | 固定 |
| **Per-scene 背景切换** | 多 `img.bg-scene[data-scene]` 叠加，`interpolate` 切换 `opacity` | 每场景独立背景 | 用 `interpolate` 控制 opacity |

### 17.2 效果使用决策树

```
效果用在哪种元素上？
├─ 口播视频（全屏态）→ 羽化描边 + 径向遮罩
├─ 口播视频（Split 态）→ 无装饰（直接透明叠画布）
├─ 辅助内容框 → 毛玻璃背景
├─ 背景层 → 渐变叠加 + 暗角
├─ CTA / highlight → 霓虹描边
└─ 全屏整体氛围 → 暗角
```

### 17.3 视觉风格速查

| 风格 | 关键词 | 配色 | 典型场景 |
|---|---|---|---|
| **科技感** | 毛玻璃 + 霓虹描边 + 暗角 | `#0A0A0A` + `#FF4500` | A 类工具展示 |
| **力量感** | 粗描边 + 高对比 + 硬朗圆角 | `#0A0A0A` + `#DC143C` | B 类动作教学 |
| **数据冲击** | 数字弹跳 + 霓虹 + 深色背景 | `#FF4500` + `#FFC800` | A 类钩子数字卡 |
| **极简** | 无装饰 + 纯白文字 + 透明背景 | `#FFFFFF` on transparent | C 类产品介绍 |

---

## 12 · A 类双态切换动效（v4 锁版 · 2026-06-12）

> **A 类专属（v4）**。A 类视频有 2 种布局状态——全屏态（口播视频 1080×1080 正方形居中铺满）和左右分栏态（视频缩到左侧 <30% + 辅助内容在右侧）。**双态切换是 A 类的核心动效**。
>
> **v4 更新（2026-06-12）**：v3 的圆形 PIP（右下角圆头像）已废弃 → v4 改为左右分栏（视频矩形缩左侧）。

### 12.1 双态切换 Remotion 实现

```tsx
// ====== 全屏态 → 左右分栏态（15帧 @30fps）======
const fullToSplit = (frame: number) => {
  const progress = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1), // power2.inOut 等效
  });
  return {
    left: 1080 * (1 - progress),      // 420→0
    top: 0 + 260 * progress,           // 0→260
    width: 1080 - 506 * progress,       // 1080→574
    height: 1080 - 506 * progress,      // 1080→574
  };
};

// ====== 左右分栏态 → 全屏态（反向，15帧）======
const splitToFull = (frame: number) => {
  const progress = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return {
    left: 0 + 420 * progress,          // 0→420
    top: 260 - 260 * progress,         // 260→0
    width: 574 + 506 * progress,        // 574→1080
    height: 574 + 506 * progress,       // 574→1080
  };
};
```

### 12.2 关键约束

| 约束 | 原因 |
|---|---|
| **不暂停主口播视频** | 主口播视频不停止播放 = 视频里"嘴在动"的进度 = 旁白进度 = 字幕进度，**三同步** |
| **ease 用 bezier(0.4, 0, 0.2, 1)** | 对称加减速，与"力量感"调性一致；不要用 back.out（弹跳过头，喧宾夺主）|
| **时长固定 0.5s（15帧 @30fps）** | 太快生硬（< 0.3s 算硬切），太慢拖节奏（> 0.8s）|
| **辅助素材入场用 3帧延迟** | 视频缩小先发生 3帧，辅助素材再入场 → 视觉上是"人退到角落，素材补上" |
| **Split 态宽度 ≤ 574px** | `574/1920 = 29.9% < 30%`，满足规范 §3.2.6b |
| **正方形容器** | Full Screen `1080×1080` / Split `574×574`，`video { object-fit: cover }` |
| **Split 态关闭 feathering** | Split 时 `.talking-head { box-shadow: none; mask-image: none }` |

### 12.3 双态切换的反模式

- ❌ **切换时调 `videoEl.pause()`**（视频里"嘴不动"了，破坏三同步）
- ❌ **用 CSS `transition`**（remotion 按帧渲染时不按帧推进 → 卡帧）
- ❌ **视频和辅助素材同时入场**（视觉竞争，应该有 0.1s 先后）
- ❌ **ease 用 back.out**（弹跳过头）
- ❌ **切换 > 1s**（节奏拖，观众走神）
- ❌ **切换 < 0.3s**（生硬，违反 [storyboard.md §4 转场硬约束](storyboard.md#4-转场标注硬约束)）
- ❌ **Split 态宽度 > 576px**（违反 <30% 约束）
- ❌ **Split 态保留羽化描边/box-shadow**（视频列应无装饰）

> 完整 A 类布局规则：[video-types.md §3.2 A 类双态布局 + §3.2.6 四条布局硬约束](video-types.md#32-a-类双态布局新锁版--2026-06-10)
> A 类口播态组件 HTML/CSS 模板：[script.md §7.8 A 类口播态组件](script.md#78-a-类口播态组件talking-head2026-06-10-新增)
> storyboard 字段 `layout_state`：[storyboard.md §1 字段定义](storyboard.md#1--字段定义)

---

## 13 · 动效性能约束（原 §12 v2）

> **铁律**：动效性能 = 移动端 ≥ 30fps。

| 维度 | 上限 | 原因 |
|---|---|---|
| **同时动画元素数** | ≤ 8 个 | 移动端 GPU 瓶颈 |
| **优先 transform/opacity** | ✅ 强制 | 走合成层，不触发重排 |
| **避免 layout 触发属性** | 禁用 width/height/top/left 动画 | 必重排，必卡 |
| **动画属性白名单** | transform / opacity / scale / rotation | 走合成层 |
| **动画属性黑名单** | width / height / top / left / margin / padding | 必重排 |
| **视频同时播放数** | ≤ 2 个 | 移动端解码瓶颈 |

### 12.1 性能自检 SOP

```
1. Chrome DevTools → Performance 面板录制 5s
2. 检查 FPS（应 ≥ 30）
3. 看是否有 layout / paint（应 0）
4. 看是否有 composite layers 警告
5. 移动端真机测试（iOS Safari + Android Chrome）
```

### 12.2 性能问题急救

| 症状 | 修法 |
|---|---|
| FPS < 30 | 减少同时动画元素 / 改用 opacity 单属性 |
| 有 layout shift | 改用 transform 替代 top/left |
| 视频卡顿 | 改用图片或预渲染 |
| 移动端首屏慢 | 减少首屏 DOM 节点（≤ 50）|

---

## 14 · 调试图鉴（5 大症状 + 排查顺序）

### 13.1 黑屏 / 首帧空白

**症状**：Studio 打开后首帧黑屏。

**排查顺序**：
1. `interpolate` 帧范围是否从 0 开始？
2. 元素 `opacity` 初始值是否为 1（不是 0）？
3. 视频 `<Video preload="auto">` 是否设置？

**修法模板**：

```tsx
// ✅ 修法：首帧 opacity=1，确保可见
const opacity = interpolate(frame, [0, 15], [1, 1], { extrapolateRight: "clamp" });
// 或用 spring 确保初始有值
const scale = spring({ frame, fps, config: { damping: 15 } });
```

### 13.2 卡帧 / 元素卡住不动

**症状**：某镜切换时元素没动到位。

**排查**：
1. 转场帧范围 < 9 帧（0.3s）？
2. `interpolate` 是否缺少 `extrapolateRight: "clamp"`？
3. CSS `transform: translate(-50%, -50%)` 与 `interpolate` y 混用？改 `xPercent: -50, yPercent: -50`

### 13.3 音画不同步

**症状**：BGM 跟字幕/动作对不上。

**排查**：
1. 视频用了自带音轨？（必须分离 → muted video + 独立 audio）
2. `<Audio>` 组件是否在 Composition 内正确使用？

**修法**：

```tsx
// BGM 用 Remotion Audio 组件，自动与 Composition 同步
<Audio src={staticFile("bgm.mp3')} />
```

### 13.4 transform 冲突

**症状**：元素位置错位 / 居中失效。

**排查**：
1. CSS `transform: translate(-50%, -50%)` 与 `interpolate` y/x 混用？
2. 用 `xPercent: -50, yPercent: -50` 替代 CSS transform

### 13.5 性能问题

**症状**：FPS 低 / 移动端卡顿。

**排查**（用 §12.1 性能自检 SOP）：

| 排查 | 修法 |
|---|---|
| 同时动画 > 8 元素 | 减少 / 错开 stagger |
| 触发 layout 属性 | 改 transform/opacity |
| 视频 > 2 个 | 改图片 / 预渲染 |
| 首屏 DOM > 50 | 拆分 / 懒加载 |

---

## 15 · 5 维评分卡 + 评审 SOP

> **每维 ≥ 3 分才能进入用户审阅**，总分 ≥ 18/25。

### 14.1 评分卡

| 维度 | 1 分（差）| 3 分（中）| 5 分（优）| 本稿得分 |
|---|---|---|---|---|
| **节奏** | 元素动效时长不统一 | 入场 0.4-0.5s + 出场 0.3s 标配 | 节奏匹配段间停顿（详 §11.5）| — |
| **性能** | > 8 元素同时 / 触发 layout | ≤ 8 元素 + 全 transform | ≤ 6 元素 + 单镜 ≤ 50 DOM | — |
| **ease 选型** | 全场用同一种 | 入场/出场/转场分别选 | 入场/出场/转场/强调各选对（详 §2.1）| — |
| **transform 规范** | 用 CSS `translate(-50%,-50%)` 居中 | 用 `xPercent: -50, yPercent: -50` | 全用 `interpolate` 居中 + 不混用 | — |
| **timeline 完整** | 缺 `paused: true` 或 `.render(0)` | 锁首帧 + 注册全局 | 8 节标准结构（详 §9.1）| — |

### 14.2 评审 SOP

```
1. 自评（5 维打分）→ ≥ 18 分才能提交
   ↓
2. 启动 npm run dev（用 run_in_background:true）
   ↓
3. 全屏过 3 遍（首屏 / 末屏 / 随机 5 镜）
   ↓
4. 跑 §12.1 性能自检（Chrome DevTools + 移动端真机）
   ↓
5. 用户审阅 → 通过 / 改稿
```

---

## 16 · 反模式

- ❌ 用 CSS transition/animation（按帧渲染时不按帧推进）
- ❌ 用 Tailwind 动画类（`animate-pulse` 等）
- ❌ 用 `requestAnimationFrame` / `Date.now()` 算动画进度
- ❌ 用 `flip` / 旋转 / 3D 转场（与力量感冲突）
- ❌ timeline 没 `paused: true` + `.progress(0).render(0)`（首帧黑屏）
- ❌ timeline 元素用 CSS `transform: translate(-50%,-50%)` 居中
- ❌ 段间停顿切换其他素材 / 显示纯字幕 / 显示装饰卡片
- ❌ 转场 < 0.3s（防卡帧核心规则）
- ❌ 数字滚动用 `setInterval` 而不是 `interpolate`（不同步于帧）
- ❌ 音频可视化用旧的 `useAudioData`（已废弃，用 AnalyserNode）
- ❌ **入场用 `from` 没补 `to`**（首帧黑屏）
- ❌ **同时动画 > 8 元素**（移动端必卡）
- ❌ **动画 width/height/top/left 属性**（触发 layout）
- ❌ **入场用 `power2.in`**（撞墙感）
- ❌ **全场用同一种 ease**（节奏单调）
- ❌ **跳过 5 维评分卡直接给用户**

### 16.1 A 类双态切换专属反模式（v3 · 2026-06-10 新增）

> 与 [video-types.md §12.1](video-types.md#121-a-类专属反模式v3-新增--2026-06-10) 同步。完整规则见 [§12 A 类双态切换动效](#12--a-类双态切换动效2026-06-10-新增)。

- ❌ 切换时调 `videoEl.pause()`（圆头像里"嘴不动"了）
- ❌ 用 CSS `transition` 做双态切换（remotion 引擎卡帧）
- ❌ 圆头像 ease 用 `back.out`（弹跳过头）
- ❌ 切换 < 0.3s 或 > 1s
- ❌ 圆头像和辅助素材同时入场（应该有 0.1s 先后）

---

## 附录 A · 速查索引

| 我想... | 看... |
|---|---|
| 知道为什么 `useCurrentFrame` + `interpolate` 唯一 | [§1.3 为什么 `interpolate` 是唯一选择](#13-为什么-interpolate-是唯一选择) |
| 选 ease | [§2.1 ease 选型决策树](#21-ease-选型决策树) |
| 选入场/出场动效 | [§3 元素入场 / 出场规范](#3--元素入场--出场规范) |
| 写转场 | [§4.1 5 类转场 Remotion 实现](#41-5-类转场-remotion-实现) |
| 写段间停顿 | [§5 段间停顿动效](#5--段间停顿动效pause_breath) |
| 错位入场 | [§6 Stagger](#6--stagger错位入场) |
| 数字滚动 | [§7 数字滚动](#7--数字滚动) |
| 写完整 timeline | [§9.1 完整 timeline 模板](#91-完整-timeline-模板) |
| 按场景选动效 | [§11 动效选型库（按场景）](#11--动效选型库按场景) |
| **写 A 类双态切换** | **[§12 A 类双态切换动效](#12--a-类双态切换动效2026-06-10-新增)** |
| 调性能 | [§13 动效性能约束](#13--动效性能约束原-12-v2) |
| 修 bug | [§14 调试图鉴](#14--调试图鉴5-大症状--排查顺序) |
| 跑 5 维评分 | [§15 5 维评分卡 + 评审 SOP](#15--5-维评分卡--评审-sop) |

---

## 附录 B · 变更日志

### v2（2026-06-09）— 深化拓展

- **新增 §1.3 为什么 `interpolate` 是唯一选择**：5 方案对比表 + 结论
- **新增 §2.1 ease 选型决策树**：4 类场景→ease 映射
- **新增 §2.2 ease 反模式**：4 种典型错用
- **新增 §4.1 5 类转场 Remotion 实现**：转场→代码映射
- **新增 §6.1 stagger 选型表**：4 场景→stagger 值
- **新增 §8.1 音频可视化应用场景**：4 映射方案
- **新增 §10.1 居中方案速查表**：4 场景推荐
- **新增 §11 动效选型库（按场景）**：6 大场景（钩子/数据/CTA/进度/段间/音频）+ 代码模板
- **新增 §12 动效性能约束**：6 维铁律 + 性能自检 SOP + 性能问题急救
- **新增 §13 调试图鉴**：5 大症状（黑屏/卡帧/音画不同步/transform/性能）+ 排查顺序 + 修法
- **新增 §14 5 维评分卡 + 评审 SOP**：总分 ≥ 18 才能进用户审阅
- **新增附录 A 速查索引** + **附录 B 变更日志**
- **§15 反模式从 10 条扩到 16 条**
- **保留不变**：§1.1/1.2 interpolate 入门 + §2 ease 列表 + §3 入场/出场 + §4 转场 + §5 段间停顿 + §6 Stagger + §7 数字滚动 + §8 音频可视化 + §9 首帧锁住 + §10 interpolate 与 CSS transform 冲突

### v3（2026-06-10）— A 类双态切换动效锁版

- **新增 §12 A 类双态切换动效**（核心锁版）：
  - 口播态 → 辅助素材态：width/height 100% → 240px + border-radius 0 → 50% + bottom/right 0 → 24px，**0.5s `power2.inOut`**
  - 辅助素材态 → 口播态：反向
  - **关键技术**：**不暂停主口播视频**，保证圆头像里"嘴在动"的进度 = 旁白进度 = 字幕进度 = **三同步**
  - 圆头像和辅助素材入场有 **0.1s 先后**（圆头像先缩，素材再入场）
  - borderRadius 用字符串 `'0%'/'50%'`（不用 max 50%，避免某些浏览器数值 tween 卡帧）
- **章节编号顺延**：原 §12/13/14/15 → §13/14/15/16
- **新增 §16.1 A 类双态切换专属反模式**：5 条（pause 视频 / CSS transition / back.out ease / 切换 < 0.3s 或 > 1s / 圆头像和素材同时入场）
- **附录 A 速查新增"写 A 类双态切换"行**
- **保留不变**：§1-§11 全部动效基础、§13-§15 性能/调试/评分卡

### v1（2026-06-08）— 初版

- `useCurrentFrame()` + `interpolate()` 唯一可靠 + 4 ease + 元素入场/出场 + 转场 + 段间停顿
- Stagger + 数字滚动 + 音频可视化 + timeline 构造 + CSS transform 冲突
- 由 winged_scapula_b3 实战沉淀
