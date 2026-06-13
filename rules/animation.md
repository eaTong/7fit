# 动效规范（animation.md）

> **Phase 2 实现关键**：scene.js 用 GSAP timeline 编排动效。
>
> **必须遵循**：[timing-sync.md](../planning/timing-sync.md)（时长锚点）+ [script.md](script.md)（安全区 + 配色）+ [storyboard.md](storyboard.md)（每镜动效标注）
>
> **动效哲学**：**GSAP 唯一可靠**。Hyperframes 引擎按帧确定性渲染，CSS 动画/Tailwind 类/RAF 全部失效——这是动效选型的**第一铁律**。

---

## 1 · ⚠️ 唯一可靠的动效方式

**GSAP**（`gsap.timeline` + `gsap.from/to/fromTo`）—— Hyperframes 引擎按帧确定性渲染，**只有 GSAP 能稳定按帧推进**。

### 1.1 ❌ 禁用清单（4 大禁用）

| 禁用项 | 原因 |
|---|---|
| ❌ **CSS `transition` / `animation`** | hyperframes 按帧渲染时不按帧推进 |
| ❌ **Tailwind 动画类**（`animate-pulse` 等）| 同上 |
| ❌ **`requestAnimationFrame`** 算动画进度 | 不走真实时间线，必错位 |
| ❌ **`Date.now()` / `performance.now()`** 算进度 | 必须走 timeline 内部时间 |

> **唯一例外**：[§8 音频可视化](#8--音频可视化analysernode) 中的 `requestAnimationFrame` 允许使用（驱动的是基于真实音频数据的连续反馈，不算动画进度）。

### 1.2 ✅ 推荐模式

```js
// 入场
gsap.from(el, { y: 30, opacity: 0, duration: 0.4, ease: 'power2.out' })

// 出场
gsap.to(el, { y: -20, opacity: 0, duration: 0.3, ease: 'power2.in' })

// 强调
gsap.fromTo(el, { scale: 1 }, { scale: 1.15, duration: 0.25, ease: 'back.out(1.7)' })

// 时间线
const tl = gsap.timeline({ paused: true })
tl.from('.hook-text', { y: 50, opacity: 0, duration: 0.4 }, 0)
  .to('.hook-text', { y: 0, opacity: 1, duration: 0.4 }, 0.4)
```

### 1.3 为什么 GSAP 是唯一选择

| 框架/方案 | 按帧推进 | 确定性 | 性能 | 评分 |
|---|---|---|---|---|
| **GSAP timeline** | ✅ 强制 | ✅ 帧精确 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| CSS transition | ❌ 实时 | ❌ 受 GPU 影响 | ⭐⭐⭐ | ⭐ |
| CSS animation | ❌ 实时 | ❌ 受 GPU 影响 | ⭐⭐⭐ | ⭐ |
| requestAnimationFrame | ❌ 实时 | ❌ 受主线程影响 | ⭐⭐ | ⭐ |
| Tailwind 动画类 | ❌ 同 CSS | ❌ | ⭐⭐⭐ | ⭐ |

> **结论**：Hyperframes 引擎按帧 seek → 动画必须能在**任意帧**还原状态。CSS/RAF 全部依赖"实时推进"，seek 时会卡帧或跳变。**GSAP timeline 是唯一能 frame-accurate seek 的方案**。

---

## 2 · 6 条 ease 曲线（推荐 + 决策树）

| ease | 适用场景 | 备注 |
|---|---|---|
| `'power2.out'` | 入场（柔和减速）| **默认首选** |
| `'power2.in'` | 出场（加速消失）| 默认出场 |
| `'power2.inOut'` | 转场（对称加减速）| fade / push_left / push_right |
| `'power3.inOut'` | 强调（对称加减速）| 数字滚动、进度条 |
| `'back.out(1.7)'` | 弹跳入场 | highlight segment 二次跳动 |
| `'none'` | 等速（用于 mask / 进度条）| 少用 |

> 完整 ease 列表见 [GSAP 文档](https://gsap.com/docs/v3/Eases/)。

### 2.1 ease 选型决策树

```
入场 / 出场？
├─ 入场
│  ├─ 普通（标题/卡片/视频）→ power2.out
│  └─ 弹跳（highlight / CTA）→ back.out(1.7)
├─ 出场
│  └─ power2.in
├─ 转场（fade / push_left / push_right）
│  └─ power2.inOut
└─ 强调（数字滚动 / 进度条）
   └─ power3.inOut
```

### 2.2 ease 反模式

- ❌ 入场用 `power2.in`（先快后慢 → 撞墙感）
- ❌ 出场用 `power2.out`（减速 → 不干脆）
- ❌ 转场用 `linear` 或 `none`（机械感）
- ❌ 全场用同一种 ease（节奏单调）

---

## 3 · 元素入场 / 出场规范

### 3.1 入场

| 元素 | duration | ease | y / opacity |
|---|---|---|---|
| **标题** | 0.4-0.6s | `power2.out` | y: 30 → 0 / opacity: 0 → 1 |
| **卡片** | 0.4s | `power2.out` | y: 20 → 0 / opacity: 0 → 1 |
| **视频/图片** | 0.5s | `power2.out` | scale: 0.95 → 1 / opacity: 0 → 1 |
| **highlight 字幕** | 0.25s | `back.out(1.7)` | scale: 1 → 1.15 → 1（yoyo）|

### 3.2 出场

| 元素 | duration | ease | y / opacity |
|---|---|---|---|
| **标题** | 0.3s | `power2.in` | y: 0 → -20 / opacity: 1 → 0 |
| **卡片** | 0.3s | `power2.in` | y: 0 → 20 / opacity: 1 → 0 |
| **视频/图片** | 0.4s | `power2.in` | scale: 1 → 1.05 / opacity: 1 → 0 |

### 3.3 强调

- **数字滚动**：`gsap.to(counterEl, { innerText: target, duration: 1, snap: { innerText: 1 } })`
- **脉冲**：`gsap.to(el, { scale: 1.1, duration: 0.5, yoyo: true, repeat: -1, ease: 'power2.inOut' })`
- **闪烁**：`gsap.to(el, { opacity: 0.3, duration: 0.3, yoyo: true, repeat: 3 })`

---

## 4 · 转场动画（GSAP addLabel 重叠）

```js
const tl = gsap.timeline({ paused: true })

// Shot 1：0-3s
tl.from('.shot-1', { opacity: 0, duration: 0.3 }, 0)
  .to('.shot-1', { opacity: 1, duration: 0.3 }, 0.3)
  .to('.shot-1', { opacity: 0, duration: 0.3 }, 2.7)

// Shot 2 在 2.85s 开始（与 Shot 1 出场重叠 0.15s，防硬切）
tl.addLabel('shot2-in', 2.85)
tl.from('.shot-2', { x: 100, opacity: 0, duration: 0.4 }, 'shot2-in')
```

### 4.1 5 类转场 GSAP 实现

| 转场 | 实现 |
|---|---|
| `fade` | `gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.inOut' })` |
| `push_left` | `gsap.from(el, { x: 100, opacity: 0, duration: 0.4, ease: 'power2.inOut' })` |
| `slide_up` | `gsap.from(el, { y: 100, opacity: 0, duration: 0.4, ease: 'power2.out' })` |
| `pause_breath` | 见 [§5 段间停顿动效](#5--段间停顿动效pause_breath) |
| `zoom` | `gsap.from(el, { scale: 0.8, opacity: 0, duration: 0.5, ease: 'back.out(1.7)' })` |

### 4.2 ❌ 禁用转场

- ❌ **flip / 旋转 / 3D**（与"力量感"调性冲突）
- ❌ 切换 < 0.3s（防卡帧核心规则）

---

## 5 · 段间停顿动效（pause_breath）

> 详见 [timing-sync.md §段间停顿](../planning/timing-sync.md#段间停顿规范-05-1s用户硬约束)。**4 种必选其一**：

| 模式 | GSAP 实现 |
|---|---|
| **0.8× 慢动作** | `videoEl.playbackRate = 0.8` |
| **1.2× 加速** | `videoEl.playbackRate = 1.2` |
| **特写（zoom in 1.2×）** | `gsap.to(videoEl, { scale: 1.2, duration: 0.7, ease: 'power2.out' })` |
| **freeze frame（定格）** | `videoEl.pause()` + 静态帧 |

---

## 6 · Stagger（错位入场）

```js
// 多张卡片依次入场
gsap.from('.card-list .card', {
  y: 30,
  opacity: 0,
  duration: 0.4,
  stagger: 0.1,  // 每张错开 0.1s
  ease: 'power2.out'
})
```

### 6.1 stagger 选型

| 场景 | stagger 值 |
|---|---|
| 列表项依次入场 | 0.1s |
| 关键参数逐步展示 | 0.15s |
| 数据飞入卡片 | 0.05s |
| 段落标题 + 副标题 | 0.2s |

---

## 7 · 数字滚动

```js
const counterEl = document.querySelector('.counter')
const counter = { val: 0 }
gsap.to(counter, {
  val: 100,
  duration: 1.5,
  ease: 'power3.inOut',
  snap: { val: 1 },
  onUpdate: () => {
    counterEl.innerText = counter.val
  }
})
```

### 7.1 数字滚动场景

- 训练计数（"12 次 × 3 组"）
- 数据可视化（PR 重量 100kg）
- 倒计时（"3 秒自测"）
- 进度百分比（"60% 改善"）

---

## 8 · 音频可视化（AnalyserNode）

```js
// 旧 useAudioData 不可用，改用 Web Audio API
const audioCtx = new AudioContext()
const source = audioCtx.createMediaElementSource(audioEl)
const analyser = audioCtx.createAnalyser()
analyser.fftSize = 256
source.connect(analyser)
analyser.connect(audioCtx.destination)

const data = new Uint8Array(analyser.frequencyBinCount)
function tick() {
  analyser.getByteFrequencyData(data)
  // data[i] 0-255 → 映射到 scale / opacity / ...
  requestAnimationFrame(tick)
}
tick()
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

## 9 · timeline 构造硬规则

```js
const tl = gsap.timeline({ paused: true })
// ... 添加所有 tween
tl.progress(0).render(0)  // 锁住初始帧，防黑屏
window.__timelines = window.__timelines || {}
window.__timelines['scene_id'] = tl
```

> **必须** `paused: true` + `.progress(0).render(0)`，否则首帧可能是黑屏。

### 9.1 完整 timeline 模板

> 详见 [script.md §8 Scene.js 编排模板](script.md#8-scenejs-编排模板完整-timeline)。

```js
// 1. 开场（0-0.3s）
tl.from('.brand-mark', { opacity: 0, duration: 0.3 }, 0)

// 2. 钩子（0.3-3.3s）
tl.from('.hook-text', { y: 50, opacity: 0, duration: 0.4, ease: 'power2.out' }, 0.3)
  .to('.hook-text', { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, 0.3)

// 3. 主体段 1（3.5-9.5s）
tl.addLabel('segment-1', 3.5)
  .from('.segment-1', { opacity: 0, duration: 0.3 }, 'segment-1')
  .to('.segment-1', { opacity: 1, duration: 0.3 }, 'segment-1+=0.3')

// 4. 段间停顿（9.5-10.2s）
tl.addLabel('pause-1', 9.0)
  .to('.segment-1 video', { playbackRate: 0.8, duration: 0.7 }, 'pause-1')

// 5-7. 主体段 2-N（10.2-...）→ 收尾 → CTA
// ...

// 末段停顿 + BGM fade out
tl.addLabel('fade-out', 'outro+=4')
  .to('.bgm', { volume: 0, duration: 3 }, 'fade-out')

// 必须：锁住首帧 + 注册全局
tl.progress(0).render(0)
window.__timelines = window.__timelines || {}
window.__timelines['scene_id'] = tl
```

---

## 10 · GSAP 与 CSS transform 冲突

> **动画 `y` 时不要用 CSS `transform: translate(-50%,-50%)`**，改用 `xPercent: -50, yPercent: -50`：

```js
// ❌ 错误：CSS transform 与 GSAP 冲突
// .centered { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }
gsap.from('.centered', { y: 30 })  // GSAP 会覆盖 CSS transform

// ✅ 正确：用 GSAP 自己的居中
gsap.set('.centered', { xPercent: -50, yPercent: -50 })
gsap.from('.centered', { y: 30, opacity: 0 })
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

```js
// 文字弹跳入场（首选）
gsap.from('.hook-text', {
  y: 50, opacity: 0, duration: 0.5, ease: 'back.out(1.4)'
})

// 整段飞入（次选，配合快速钩子）
gsap.from('.hook-card', {
  x: 100, opacity: 0, duration: 0.4, ease: 'power2.out'
})
```

### 11.2 数据冲击（关键数字）

**目标**：让数字有"重量"。

```js
// 数字滚动（首选）
gsap.to(counter, { val: 12, duration: 0.5, snap: { val: 1 },
  onUpdate: () => el.innerText = Math.round(counter.val)
})

// 数字 + 1.15× 弹跳
gsap.fromTo('.big-number', { scale: 0.5 }, { scale: 1.15, duration: 0.4, ease: 'back.out(1.7)' })
```

### 11.3 CTA 强调（收尾）

**目标**：引导互动。

```js
// 1.15× 弹跳 + 0.05s 二次
gsap.fromTo('.cta-card', { scale: 0.8 }, { scale: 1.15, duration: 0.4, yoyo: true, repeat: 1, ease: 'back.out(1.7)' })

// 持续脉冲（不推荐，干扰阅读）
// gsap.to('.cta-card', { scale: 1.1, duration: 0.5, yoyo: true, repeat: -1, ease: 'power2.inOut' })
```

### 11.4 进度感（数据飞入）

**目标**：让数据"流"起来。

```js
// 数字依次飞入（stagger）
gsap.from('.stat-list .stat', {
  y: 30, opacity: 0, duration: 0.4, stagger: 0.15, ease: 'power2.out'
})

// 进度条填充
gsap.to('.progress-bar', { width: '60%', duration: 1.0, ease: 'power3.inOut' })
```

### 11.5 段间停顿（pause_breath 4 选 1）

> 见 [§5 段间停顿动效](#5--段间停顿动效pause_breath)。

```js
videoEl.playbackRate = 0.8  // 慢动作
videoEl.playbackRate = 1.2  // 加速
gsap.to(videoEl, { scale: 1.2, duration: 0.7, ease: 'power2.out' })  // 特写
videoEl.pause()  // freeze frame
```

### 11.6 音频可视化（BGM 驱动）

> 见 [§8 音频可视化](#8--音频可视化analysernode)。

### 11.7 扩展动效库（v4.1 新增 · 2026-06-13）

> **基于 Motion Graphics 行业标准扩展的动效库**（18 类），按需选用。

#### 11.7.1 入场 / 出场动效

| 动效 | GSAP 实现 | 适用场景 |
|---|---|---|
| 字母依次出现 | `gsap.from('.char', {opacity:0, y:20, stagger:0.03, duration:0.3})` | 标题入场 / 金句强调 |
| 单词依次出现 | `gsap.from('.word', {opacity:0, x:-20, stagger:0.08, duration:0.35})` | 多词标题 / callout |
| 滑入 + 弹跳 | `gsap.from(el, {x:-100, opacity:0, duration:0.5, ease:'back.out(1.4)'})` | 卡片 / 面板入场 |
| 缩放弹跳 | `gsap.from(el, {scale:0.5, opacity:0, duration:0.5, ease:'back.out(1.7)'})` | CTA / 数字强调 |
| 渐显 + 上浮 | `gsap.from(el, {y:30, opacity:0, duration:0.4, ease:'power2.out'})` | 通用入场 |
| 渐隐 + 下滑 | `gsap.to(el, {y:30, opacity:0, duration:0.3, ease:'power2.in'})` | 通用出场 |
| 挤压入场 | `gsap.from(el, {scaleX:0.5, scaleY:1.2, duration:0.4, ease:'back.out(1.7)'})` | 图标 / emoji / 小元素 |
| 旋转入场 | `gsap.from(el, {rotation:-90, opacity:0, duration:0.5, ease:'back.out(1.4)'})` | 箭头 / 装饰元素 |

#### 11.7.2 转场动效

| 动效 | GSAP 实现 | 适用场景 |
|---|---|---|
| Wipe Left | `gsap.fromTo(el, {x:-1920}, {x:0, duration:0.5, ease:'power2.inOut'})` | 方向感强的推进 |
| Wipe Right | `gsap.fromTo(el, {x:1920}, {x:0, duration:0.5, ease:'power2.inOut'})` | 同上，反方向 |
| Wipe Up | `gsap.fromTo(el, {y:1080}, {y:0, duration:0.5, ease:'power2.inOut'})` | 向上推进 |
| Wipe Down | `gsap.fromTo(el, {y:-1080}, {y:0, duration:0.5, ease:'power2.inOut'})` | 向下推进 |
| Curtain | 上下两 panel 相向关闭/展开 | 全屏切换 |
| Zoom Transition | `gsap.fromTo(el, {scale:1.5, opacity:0}, {scale:1, opacity:1, duration:0.5})` | 强调转场 |
| Crossfade | `gsap.to(el, {opacity:0, duration:0.4})` | 柔和过渡（最常用）|
| Blur Transition | `gsap.fromTo(el, {filter:'blur(20px)'}, {filter:'blur(0px)', duration:0.5})` | 梦幻转场 |
| Push | 前一元素 `x:-1920` + 新元素 `x:1920→0` | 主流行转场 |

#### 11.7.3 强调 / 数据动效

| 动效 | GSAP 实现 | 适用场景 |
|---|---|---|
| 数字滚动 Counter | `gsap.to(counter, {val:target, duration:1.5, snap:{val:1}, ease:'power3.inOut'})` | 计数 / PR / 进度 |
| 脉冲 Pulse | `gsap.to(el, {scale:1.15, duration:0.3, yoyo:true, repeat:1})` | 关键数据 / CTA |
| 发光脉冲 | `gsap.to(el, {boxShadow:'0 0 40px var(--accent-1)', duration:0.4, yoyo:true, repeat:1})` | 强调数字 |
| 划线强调 | `gsap.from(el, {backgroundSize:'0% 3px', duration:0.4})` | 关键词强调 |
| 背景闪烁 | `gsap.from(el, {backgroundColor:'rgba(255,69,0,0.4)', duration:0.2, yoyo:true, repeat:1})` | 文字高亮 |

#### 11.7.4 特殊效果

| 动效 | GSAP 实现 | 适用场景 |
|---|---|---|
| Glitch | 多层 R/G/B 偏移 `gsap.to(el, {x:'+=3', duration:0.05, repeat:-1, yoyo:true})` | 科技感 / 警告 |
| Chromatic Aberration | 3 个同元素 R/G/B 偏移叠加 | 转场冲击 / 强调 |
| 打字机 Typewriter | 逐字设置 opacity:1，`stagger: 0.03s` | 终端 / 代码展示 |
| Scan Line | `repeating-linear-gradient` overlay 动态滚动 | 科技感 / 复古 |
| Morph 形状渐变 | `gsap.to(el, {borderRadius:'50%', duration:0.5})` | 状态切换 |
| Particle Burst | 多 `div` 从中心爆发 `scale + opacity` | 数据达成 / 里程碑 |
| Parallax 视差 | 背景层 `y:-30` + 前景层不动 | 背景层次感 |

#### 11.7.5 A/B 类专属动效速查

| 场景 | 动效 | GSAP 参数 |
|---|---|---|
| A 类钩子 | 数字卡弹跳 + 脉冲 | `back.out(1.7)`, stagger 0.1s |
| A 类工具展示 | 终端打字机效果 | 每字 0.03s |
| A 类双态切换 | 正方形缩小/放大 | 0.5s `power2.inOut` |
| A 类收尾 | CTA 卡片弹跳 + 霓虹描边 | `back.out(1.4)` + `box-shadow` 脉冲 |
| B 类动作强调 | 放大特写 `scale: 1.3` | 0.4s `power2.out` |
| B 类计数 | 数字滚动 + 闪烁 | `power3.inOut`, 0.8s |
| B 类段间停顿 | zoom in 1.2x / 0.8x 慢动作 | 0.7s `power2.out` |
| A/B 类字幕 | 字母依次出现 | stagger 0.02s |
| A/B 类进度条 | width 填充 + 颜色渐变 | `power3.inOut` |

#### 11.7.6 A 类动效适配方案（v4.2 新增）

> **A 类视频动效核心**：**慢进 + 留白 + 强调**——3 类基本节奏（详 §4.1）。所有动效都围绕"3 秒抓人 + 1 秒消化"展开。

##### 11.7.6.1 钩子入场（0-3s）
**目标**：3 秒抓人。

```js
// 文字弹跳入场（首选）
gsap.from('.hook-text', {
  y: 50, opacity: 0, duration: 0.5, ease: 'back.out(1.4)'
})

// 数字卡弹跳 + 脉冲（次选，配合快速钩子）
gsap.from('.hook-card', {
  scale: 0.5, opacity: 0, duration: 0.5, ease: 'back.out(1.7)',
  stagger: 0.1s  // 多张数字卡依次弹跳
})
```

##### 11.7.6.2 数据冲击（关键数字）
**目标**：让数字有"重量"。

```js
// 数字滚动（首选）
gsap.to(counter, { val: 12, duration: 0.5, snap: { val: 1 },
  onUpdate: () => el.innerText = Math.round(counter.val)
})

// 数字 + 1.15× 弹跳
gsap.fromTo('.big-number', { scale: 0.5 }, { scale: 1.15, duration: 0.4, ease: 'back.out(1.7)' })

// 霓虹描边 + 光晕 Glow
gsap.to('.big-number', {
  boxShadow: '0 0 0 2px #FF4500, 0 0 30px 10px rgba(255,69,0,0.3)',
  duration: 0.4, yoyo: true, repeat: 1
})
```

##### 11.7.6.3 CTA 强调（收尾）
**目标**：引导互动。

```js
// 1.15× 弹跳 + 0.05s 二次
gsap.fromTo('.cta-card', { scale: 0.8 }, { scale: 1.15, duration: 0.4, yoyo: true, repeat: 1, ease: 'back.out(1.7)' })

// 霓虹描边 + 脉冲
gsap.to('.cta-card', {
  boxShadow: '0 0 0 2px #FF4500, 0 0 20px #FF4500',
  duration: 0.5, yoyo: true, repeat: -1, ease: 'power2.inOut'
})
```

##### 11.7.6.4 进度感（数据飞入）
**目标**：让数据"流"起来。

```js
// 数字依次飞入（stagger）
gsap.from('.stat-list .stat', {
  y: 30, opacity: 0, duration: 0.4, stagger: 0.15, ease: 'power2.out'
})

// 进度条填充
gsap.to('.progress-bar', { width: '60%', duration: 1.0, ease: 'power3.inOut' })
```

##### 11.7.6.5 段间停顿（pause_breath 4 选 1）
> 见 [§5 段间停顿动效](#5--段间停顿动效pause_breath)。

```js
videoEl.playbackRate = 0.8  // 慢动作
videoEl.playbackRate = 1.2  // 加速
gsap.to(videoEl, { scale: 1.2, duration: 0.7, ease: 'power2.out' })  // 特写
videoEl.pause()  // freeze frame
```

##### 11.7.6.6 音频可视化（BGM 驱动）
> 见 [§8 音频可视化](#8--音频可视化analysernode)。

```js
const analyser = audioCtx.createAnalyser()
analyser.fftSize = 128
const data = new Uint8Array(analyser.frequencyBinCount)
function tick() {
  analyser.getByteFrequencyData(data)
  const bass = data.slice(0, 4).reduce((a, b) => a + b) / 4
  gsap.to('.pulse-ring', { scale: 1 + bass / 500, duration: 0.05 })
  requestAnimationFrame(tick)
}
tick()
```

##### 11.7.6.7 双态切换动效（A 类专属）
> 详见 [§12 A 类双态切换动效](#12--a-类双态切换动效2026-06-10-新增)。

```js
// 全屏态 → 左右分栏态（0.5s, power2.inOut）
gsap.to('.talking-head', {
  left: 0, top: 260, width: 574, height: 574,
  duration: 0.5, ease: 'power2.inOut'
})

// 同时：辅助素材入场
gsap.from('.visual-support__frame', {
  x: 80, opacity: 0, scale: 0.92,
  duration: 0.4, ease: 'power2.out'
}, '<+=0.1')  // 视频缩小后 0.1s 辅助素材接续入场
```

#### 11.7.7 B 类动效适配方案（v4.2 新增）

> **B 类视频动效核心**：**紧凑 + 强调 + 节拍**——3 类基本节奏（详 §4.1）。所有动效都围绕"动作演示 + 数据可视化"展开。

##### 11.7.7.1 动作强调（关键动作）
**目标**：让动作有"力量"。

```js
// 放大特写（首选）
gsap.from('.action-highlight', {
  scale: 1.0, opacity: 0, duration: 0.4, ease: 'power2.out'
})

// 动作 + 1.15× 弹跳
gsap.fromTo('.action-highlight', { scale: 1.0 }, { scale: 1.15, duration: 0.4, ease: 'back.out(1.7)' })
```

##### 11.7.7.2 计数（关键数据）
**目标**：让计数有"节奏"。

```js
// 数字滚动（首选）
gsap.to(counter, { val: 12, duration: 0.5, snap: { val: 1 },
  onUpdate: () => el.innerText = Math.round(counter.val)
})

// 数字 + 闪烁
gsap.to('.count-number', {
  opacity: 0.3, duration: 0.3, yoyo: true, repeat: 3
})
```

##### 11.7.7.3 段间停顿（pause_breath）
**目标**：让停顿有"呼吸"。

```js
// zoom in 1.2×（首选）
gsap.to(videoEl, { scale: 1.2, duration: 0.7, ease: 'power2.out' })

// 0.8× 慢动作
videoEl.playbackRate = 0.8

// 1.2× 加速
videoEl.playbackRate = 1.2

// freeze frame（定格）
videoEl.pause()
```

##### 11.7.7.4 字幕（关键要点）
**目标**：让字幕有"节奏"。

```js
// 字母依次出现（首选）
gsap.from('.char', {opacity:0, y:20, stagger:0.02, duration:0.3})

// 单词依次出现
gsap.from('.word', {opacity:0, x:-20, stagger:0.08, duration:0.35})
```

##### 11.7.7.5 进度条（完成度）
**目标**：让进度有"流动"。

```js
// width 填充 + 颜色渐变（首选）
gsap.to('.progress-bar', { width: '60%', duration: 1.0, ease: 'power3.inOut' })

// 颜色渐变
gsap.to('.progress-bar', {
  background: 'linear-gradient(90deg, #FF4500, #FFC800)',
  duration: 1.0, ease: 'power3.inOut'
})
```

##### 11.7.7.6 节拍驱动（BGM 驱动）
**目标**：让动作有"节拍"。

```js
const analyser = audioCtx.createAnalyser()
analyser.fftSize = 128
const data = new Uint8Array(analyser.frequencyBinCount)
function tick() {
  analyser.getByteFrequencyData(data)
  const bass = data.slice(0, 4).reduce((a, b) => a + b) / 4
  // 四角参数卡随节拍脉冲
  gsap.to('.beat-card', { scale: 1 + bass / 500, duration: 0.05 })
  requestAnimationFrame(tick)
}
tick()
```

##### 11.7.7.7 镜像对照（动作正误对比）
**目标**：让对比有"冲击"。

```js
// 左/右各 50%，同一动作正/误同步对比
gsap.from('.mirror-compare__left', {
  x: -100, opacity: 0, duration: 0.4, ease: 'power2.out'
})
gsap.from('.mirror-compare__right', {
  x: 100, opacity: 0, duration: 0.4, ease: 'power2.out'
})
```

---

## 17 · 视觉效果规范（v4.1 新增 · 2026-06-13）

> **A/B 类视频的视觉风格规范**——各类视觉效果的使用位置、参数和 GSAP 实现。

### 17.1 效果速查表

| 效果 | CSS 实现 | 使用位置 | 参数 |
|---|---|---|---|
| 羽化描边（全屏态）| `box-shadow: inset 0 0 30px 8px rgba(10,10,10,0.5), 0 0 80px 40px rgba(10,10,10,0.4)` | 全屏态 `.talking-head` | 固定 |
| 径向遮罩（全屏态）| `mask-image: radial-gradient(circle 80% 80% at 50% 50%, black 10%, transparent 100%)` | 全屏态视频边缘淡化 | 固定 |
| 渐变叠加 | `background: radial-gradient(ellipse 70% 70% at 50% 50%, rgba(10,10,10,0.2) 0%, rgba(10,10,10,0.85) 100%)` | `.bg-overlay` 背景层 | 固定 |
| 毛玻璃背景 | `backdrop-filter: blur(12px)` + 半透明背景 | Split 态辅助内容框 | blur 8-16px |
| 霓虹描边 | `box-shadow: 0 0 0 2px var(--accent-1), 0 0 20px var(--accent-1)` | CTA 卡 / highlight 元素 | accent-1 或 accent-2 |
| 暗角 | `radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)` | 全屏 overlay | 固定 |
| Per-scene 背景切换 | 多 `img.bg-scene[data-scene]` 叠加，GSAP 切换 `opacity` | 每场景独立背景 | 见 §3.2.6c |
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
| **数字弹跳** | `gsap.fromTo(el, {scale: 0.5}, {scale: 1.15, duration: 0.4, ease: 'back.out(1.7)'})` | 固定 | 关键数字 |

### 17.3 B 类视频特效适配方案（v4.2 新增）

> **B 类视频特效核心**：**力量感 + 节拍驱动**——动作强调用景深模糊 + 光晕 Glow，数据展示用霓虹描边 + 数字弹跳，节拍驱动用音频可视化 + 节奏脉冲。

#### 17.3.1 动作强调特效
**目标**：让动作有"力量"。

| 特效 | CSS 实现 | 参数 | 说明 |
|---|---|---|---|
| **景深模糊** | `filter: blur(4px)` 在非焦点元素 | blur 2-8px | 层次感 |
| **光晕 Glow** | `box-shadow: 0 0 30px 10px rgba(220,20,60,0.3)` | 颜色按场景 | 动作边缘强调 |
| **放大特写** | `gsap.to(el, {scale: 1.3, duration: 0.4, ease: 'power2.out'})` | 固定 | 关键动作 |

#### 17.3.2 数据展示特效
**目标**：让数据有"节奏"。

| 特效 | CSS 实现 | 参数 | 说明 |
|---|---|---|---|
| **霓虹描边** | `box-shadow: 0 0 0 2px #DC143C, 0 0 20px #DC143C` | 固定 | 参数卡 / 计数卡 |
| **数字弹跳** | `gsap.fromTo(el, {scale: 0.5}, {scale: 1.15, duration: 0.4, ease: 'back.out(1.7)'})` | 固定 | 关键数字 |
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

| 特效 | GSAP 实现 | 参数 | 说明 |
|---|---|---|---|
| **节拍脉冲环** | `gsap.to('.pulse-ring', {scale: 1 + bass / 500, duration: 0.05})` | `AnalyserNode` 数据驱动 | 低频脉冲 |
| **高频闪烁** | `gsap.to('.sparkle', {opacity: treble / 255, duration: 0.05})` | `AnalyserNode` 数据驱动 | 高频闪烁 |
| **频谱柱** | `gsap.to('.spectrum-bar', {height: data[i], duration: 0.05})` | `AnalyserNode` 数据驱动 | 频谱可视化 |

### 17.4 效果使用决策树| 景深模糊 | `filter: blur(4px)` 在非焦点元素 | 层次感 | blur 2-8px |

### 17.2 效果使用决策树

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

### 17.3 视觉风格速查

| 风格 | 关键词 | 配色 | 典型场景 |
|---|---|---|---|
| 科技感 | 毛玻璃 + 霓虹描边 + 暗角 + 噪点 | `#0A0A0A` + `#FF4500` | A 类工具展示 |
| 力量感 | 粗描边 + 高对比 + 硬朗圆角 | `#0A0A0A` + `#DC143C` | B 类动作教学 |
| 数据冲击 | 数字弹跳 + 霓虹 + 深色背景 | `#FF4500` + `#FFC800` | A 类钩子数字卡 |
| 极简 | 无装饰 + 纯白文字 + 透明背景 | `#FFFFFF` on transparent | C 类产品介绍 |
| 复古科技 | VHS 条纹 + 噪点 + 色差 | 低饱和 + tracking lines | A/B 类创意场景 |
| 自然氛围 | 暖色温 + 柔焦 | `#0A0A0A` + 暖橙光晕 | 个人故事类 A |

### 17.4 视频效果进阶（GSAP 实现）

| 效果 | HTML/CSS 结构 | GSAP 动画 | 适用场景 |
|---|---|---|---|
| Split Screen Transition | 上下/左右两 panel 遮挡 | 各自 `x: +/-1920` 动画 | 场景切换 |
| Book Page Flip | 3D `rotateY` 翻页效果 | `gsap.to(el, {rotationY:-90, duration:0.5})` | 章节过渡 |
| Letter by Letter Reveal | 每个字包在 `<span class="char">` | `stagger: 0.025` | 标题 / 金句 |
| Parallax Background | 多层背景不同速度 | `gsap.to(.bg-1, {y:-30, duration:1})` | 深度感 |
| Count-up + Suffix | 数字 + 单位后缀动画 | `innerText` 滚动 + 后缀淡入 | PR / 进度数据 |
| Elastic Snap | 元素吸附动画 | `ease: 'elastic.out(1, 0.5)'` | 强调 / CTA |
| Swing | 钟摆式摆动 | `gsap.to(el, {rotation:15, duration:0.3, yoyo:true, repeat:1})` | 装饰 / 箭头 |

### 17.5 B 类视频专用视觉效果

| 效果 | 实现 | 参数 |
|---|---|---|
| RPE/难度色块 | `background: rgba(220,20,60,0.15)` + `border: 2px solid #DC143C` | 红色系表示高强度 |
| 组数 × 次数 overlay | 固定位置 `position: absolute` + 数字滚动 | 右下角 64px 字号 |
| 动作标注线 | SVG `<line>` + 动画 `stroke-dashoffset` | 标注动作要点 |
| 节拍脉冲环 | 同心圆 `scale` + `opacity` 联动 BGM | `AnalyserNode` 数据驱动 |
| 进度时间条 | `height: 4px` + `width` 随时间增长 | 底部居中 |
| 动作轨迹 | 视频上叠加半透明箭头 SVG | `motionPath` GSAP 插件 |

### 17.6 音效驱动视觉效果（AnalyserNode 联动）

```js
// BGM 频谱驱动视觉元素
const analyser = audioCtx.createAnalyser()
analyser.fftSize = 128
const data = new Uint8Array(analyser.frequencyBinCount)
function tick() {
  analyser.getByteFrequencyData(data)
  const bass = data.slice(0, 4).reduce((a, b) => a + b) / 4
  gsap.to('.pulse-ring', { scale: 1 + bass / 500, duration: 0.05 })
  const treble = data.slice(60, 80).reduce((a, b) => a + b) / 20
  gsap.to('.sparkle', { opacity: treble / 255, duration: 0.05 })
  requestAnimationFrame(tick)
}
tick()
```

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
| 元素不动 | `timeline.progress(0).render(0)` 是否调用？ | 确认 timeline 初始化 |
| 位置错位 | CSS `transform: translate(-50%,-50%)` 是否与 GSAP y 混用？ | 改 `xPercent: -50, yPercent: -50` |
| 动画过快/过慢 | duration 是否 < 0.3s 或 > 1.5s？ | 按规范调整 |
| 元素跳帧 | ease 是否用了 `linear`？ | 换 `power2.out/in` |
| 性能卡顿 | 同时动画 > 8 个元素？ | 减少元素数量 |
| 字体模糊 | `font-smoothing` 是否设置？ | 添加 `-webkit-font-smoothing: antialiased` |
| mask 不生效 | `mask-image` 是否加了 `-webkit-` 前缀？ | 同时加两个版本 |

> **6 类新增视觉效果**，按需选用。

| 动效 | GSAP 实现 | 适用场景 |
|---|---|---|
| **Glitch** | RGB channel separation — 多层同元素 R/G/B 偏移 2-4px，`gsap.to(el, {x: rand, duration: 0.05, repeat: -1})` | 强调数字错误 / 警告 / 科技感 |
| **Chromatic Aberration** | 3 层同元素 R/G/B 偏移叠加 | 强调 / 转场冲击 |
| **Wipe** | `gsap.fromTo(el, {x: -1920}, {x: 0, duration: 0.5, ease: 'power2.inOut'})` | 方向感强的转场 |
| **Morph（形状渐变）** | `gsap.to(el, {borderRadius: '50%', duration: 0.5})` | 状态切换强调 |
| **Scan Line** | `repeating-linear-gradient` overlay + `gsap.to` opacity 脉冲 | 科技感 / 复古 / 终端 |
| **Particle Burst** | 多 `div` 从中心爆发 `scale + opacity` | 数据达成 / 里程碑 / CTA |

**A/B 类专属动效对照：**

| 场景 | 动效 | GSAP 参数 |
|---|---|---|
| A 类钩子 | 数字卡**弹跳 + 脉冲** | `back.out(1.7)`, stagger 0.1s |
| A 类工具展示 | 终端**打字机效果** | 每字 0.03s |
| A 类双态切换 | **正方形缩小/放大** | 0.5s `power2.inOut` |
| A 类收尾 | **CTA 卡片弹跳 + 霓虹描边** | `back.out(1.4)` + `box-shadow` 脉冲 |
| B 类动作强调 | **放大特写** `scale: 1.3` | 0.4s `power2.out` |
| B 类计数 | **数字滚动 + 闪烁** | `power3.inOut`, 0.8s |
| B 类段间 | **zoom in 1.2×** | 0.7s `power2.out` |

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
| **Per-scene 背景切换** | 多 `img.bg-scene[data-scene]` 叠加，GSAP 切换 `opacity` | 每场景独立背景 | 见 §3.2.6c |

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

### 12.1 双态切换 GSAP 实现

```js
// ====== 全屏态 → 左右分栏态（0.5s, power2.inOut）======
// 正方形缩小 + 左移：1080×1080 → 574×574，left: 420→0, top: 0→260
gsap.to('.talking-head', {
  left: 0, top: 260, width: 574, height: 574,
  duration: 0.5, ease: 'power2.inOut'
})
// 同时：辅助素材入场
gsap.from('.visual-support__frame', {
  x: 80, opacity: 0, scale: 0.92,
  duration: 0.4, ease: 'power2.out'
}, '<+=0.1')  // 视频缩小后 0.1s 辅助素材接续入场

// ====== 左右分栏态 → 全屏态（0.5s, power2.inOut，反向）======
// 正方形放大 + 居中：574×574 → 1080×1080，left: 0→420, top: 260→0
gsap.to('.visual-support__frame', {
  opacity: 0, scale: 0.95, duration: 0.25, ease: 'power2.in'
}, 0)

gsap.to('.talking-head', {
  left: 420, top: 0, width: 1080, height: 1080,
  duration: 0.5, ease: 'power2.inOut'
}, '<+=0.1')  // 辅助素材淡出后 0.1s 视频放大
```

### 12.2 关键约束

| 约束 | 原因 |
|---|---|
| **不暂停主口播视频** | 主口播视频不停止播放 = 视频里"嘴在动"的进度 = 旁白进度 = 字幕进度，**三同步** |
| **ease 用 power2.inOut** | 对称加减速，与"力量感"调性一致；不要用 back.out（弹跳过头，喧宾夺主）|
| **时长固定 0.5s** | 太快生硬（< 0.3s 算硬切），太慢拖节奏（> 0.8s）|
| **辅助素材入场用 0.1s 延迟** | 视频缩小先发生 0.1s，辅助素材再入场 → 视觉上是"人退到角落，素材补上" |
| **Split 态宽度 ≤ 574px** | `574/1920 = 29.9% < 30%`，满足规范 §3.2.6b |
| **正方形容器** | Full Screen `1080×1080` / Split `574×574`，`video { object-fit: cover }` |
| **Split 态关闭 feathering** | Split 时 `.talking-head { box-shadow: none; mask-image: none }` |

### 12.3 双态切换的反模式

- ❌ **切换时调 `videoEl.pause()`**（视频里"嘴不动"了，破坏三同步）
- ❌ **用 CSS `transition`**（hyperframes 按帧渲染时不按帧推进 → 卡帧）
- ❌ **视频和辅助素材同时入场**（视觉竞争，应该有 0.1s 先后）
- ❌ **ease 用 back.out**（弹跳过头）
- ❌ **切换 > 1s**（节奏拖，观众走神）
- ❌ **切换 < 0.3s**（生硬，违反 [storyboard.md §4 转场硬约束](storyboard.md#4-转场标注硬约束)）
- ❌ **Split 态宽度 > 576px**（违反 <30% 约束）
- ❌ **Split 态保留羽化描边/box-shadow**（视频列应无装饰）

> 完整 A 类布局规则：[video-types.md §3.2 A 类双态布局 + §3.2.6 四条布局硬约束](../planning/video-types.md#32-a-类双态布局新锁版--2026-06-10)
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
1. timeline 是否 `paused: true` + `.progress(0).render(0)` ？
2. 元素 CSS `opacity: 0` 没补 `.to(..., { opacity: 1 })` ？
3. 视频 `preload="auto"` 缺失？加 `await videoEl.play()` ？
4. 图片 `fetch` 失败？看 Network 面板

**修法模板**：

```js
// ✅ 修法：所有 from/to 配对 + 首帧锁
const tl = gsap.timeline({ paused: true })
tl.from('.text', { y: 30, opacity: 0, duration: 0.4 }, 0)
  .to('.text', { y: 0, opacity: 1, duration: 0.4 }, 0)  // ← 必须有 to
tl.progress(0).render(0)  // ← 锁首帧
```

### 13.2 卡帧 / 元素卡住不动

**症状**：某镜切换时元素没动到位。

**排查**：
1. 转场时长 < 0.3s？
2. 入场用 `from` 没补 `to` ？
3. transform 与 CSS `transform: translate(-50%, -50%)` 冲突？改 `xPercent: -50, yPercent: -50`

### 13.3 音画不同步

**症状**：BGM 跟字幕/动作对不上。

**排查**：
1. 视频用了自带音轨？（必须分离 → muted video + 独立 audio）
2. BGM 元素没接 timeline？（`<audio>` 元素是独立的，用 `currentTime` 同步）

**修法**：

```js
// BGM 与 timeline 同步
const bgm = document.querySelector('.bgm')
bgm.currentTime = 0
tl.eventCallback('onStart', () => bgm.play())
tl.eventCallback('onComplete', () => bgm.pause())
```

### 13.4 transform 冲突

**症状**：元素位置错位 / 居中失效。

**排查**：
1. CSS `transform: translate(-50%, -50%)` 与 GSAP `y` 冲突？
2. 用 `gsap.set(el, { xPercent: -50, yPercent: -50 })` 替代

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
| **transform 规范** | 用 CSS `translate(-50%,-50%)` 居中 | 用 `xPercent: -50, yPercent: -50` | 全用 GSAP 居中 + 不混用 | — |
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
- ❌ 数字滚动用 `setInterval` 而不是 GSAP（不同步于 timeline）
- ❌ 音频可视化用旧的 `useAudioData`（已废弃，用 AnalyserNode）
- ❌ **入场用 `from` 没补 `to`**（首帧黑屏）
- ❌ **同时动画 > 8 元素**（移动端必卡）
- ❌ **动画 width/height/top/left 属性**（触发 layout）
- ❌ **入场用 `power2.in`**（撞墙感）
- ❌ **全场用同一种 ease**（节奏单调）
- ❌ **跳过 5 维评分卡直接给用户**

### 16.1 A 类双态切换专属反模式（v3 · 2026-06-10 新增）

> 与 [video-types.md §12.1](../planning/video-types.md#121-a-类专属反模式v3-新增--2026-06-10) 同步。完整规则见 [§12 A 类双态切换动效](#12--a-类双态切换动效2026-06-10-新增)。

- ❌ 切换时调 `videoEl.pause()`（圆头像里"嘴不动"了）
- ❌ 用 CSS `transition` 做双态切换（hyperframes 引擎卡帧）
- ❌ 圆头像 ease 用 `back.out`（弹跳过头）
- ❌ 切换 < 0.3s 或 > 1s
- ❌ 圆头像和辅助素材同时入场（应该有 0.1s 先后）

---

## 附录 A · 速查索引

| 我想... | 看... |
|---|---|
| 知道为什么 GSAP 唯一 | [§1.3 为什么 GSAP 是唯一选择](#13-为什么-gsap-是唯一选择) |
| 选 ease | [§2.1 ease 选型决策树](#21-ease-选型决策树) |
| 选入场/出场动效 | [§3 元素入场 / 出场规范](#3--元素入场--出场规范) |
| 写转场 | [§4.1 5 类转场 GSAP 实现](#41-5-类转场-gsap-实现) |
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

- **新增 §1.3 为什么 GSAP 是唯一选择**：4 方案对比表 + 结论
- **新增 §2.1 ease 选型决策树**：4 类场景→ease 映射
- **新增 §2.2 ease 反模式**：4 种典型错用
- **新增 §4.1 5 类转场 GSAP 实现**：转场→代码映射
- **新增 §6.1 stagger 选型表**：4 场景→stagger 值
- **新增 §8.1 音频可视化应用场景**：4 映射方案
- **新增 §10.1 居中方案速查表**：4 场景推荐
- **新增 §11 动效选型库（按场景）**：6 大场景（钩子/数据/CTA/进度/段间/音频）+ 代码模板
- **新增 §12 动效性能约束**：6 维铁律 + 性能自检 SOP + 性能问题急救
- **新增 §13 调试图鉴**：5 大症状（黑屏/卡帧/音画不同步/transform/性能）+ 排查顺序 + 修法
- **新增 §14 5 维评分卡 + 评审 SOP**：总分 ≥ 18 才能进用户审阅
- **新增附录 A 速查索引** + **附录 B 变更日志**
- **§15 反模式从 10 条扩到 16 条**
- **保留不变**：§1.1/1.2 GSAP 入门 + §2 ease 列表 + §3 入场/出场 + §4 转场 + §5 段间停顿 + §6 Stagger + §7 数字滚动 + §8 音频可视化 + §9 timeline 构造 + §10 GSAP 与 CSS transform 冲突

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

- GSAP 唯一可靠 + 4 ease + 元素入场/出场 + 转场 + 段间停顿
- Stagger + 数字滚动 + 音频可视化 + timeline 构造 + CSS transform 冲突
- 由 winged_scapula_b3 实战沉淀
