# 脚本生成规范（script.md）

> **Phase 2 入口**：文案确认后，按本规范实现 Scene 组件 → 写 components/ → 写 scene.js 编排。
>
> **必须遵循**：[timing-sync.md](../planning/timing-sync.md)（时间字段锚点）+ [copy.md §15 下游接口](../planning/copy.md#15-下游接口说明)（文案稿字段→下游流向）
>
> **7fit 动效哲学**：**快进 + 留白 + 强调**——3 类基本节奏（详 §4.1）。所有动效都围绕"3 秒抓人 + 1 秒消化"展开。

---

## 1 · 速查：Remotion → Hyperframes API 映射

> **背景**：2026-06-05 框架迁移，原 Remotion（React + TS）→ Hyperframes（HTML + CSS + GSAP）。

| 概念 | Remotion（旧） | Hyperframes（新） |
|---|---|---|
| 视频描述 | `<Composition>` (React) | `<div class="clip" data-start="..." data-duration="...">`（HTML）|
| 时间容器 | `<Sequence from={n}>` | `gsap.timeline()` + `addLabel('shotB', 2.85)` |
| 帧号 | `useCurrentFrame()` | `gsap timeline.time()` / `window.__hfTime` |
| 插值 | `interpolate(frame, [0, 30], [0, 1])` | `gsap.fromTo(el, {y: 0}, {y: 100, duration: 1})` |
| 弹簧 | `spring({frame, fps, config})` | `gsap.from(el, {y: 100, ease: 'back.out(1.7)'})` |
| 视频元素 | `<Video src={...} />` | `<video muted playsinline>` + 分离 `<audio>` |
| 字幕 | `<Sequence from={start}>` + 文本 | `<div class="subtitle" data-start="..." data-duration="...">` + GSAP |
| 静态资源 | `staticFile()` | `fetch` + blob URL（避免相对路径错位）|
| 渲染触发 | `npx remotion render` | `npm run render -- <SceneId> out/<name>.mp4` |

---

## 2 · 入口与目录结构

### 2.1 入口文件

| 文件 | 位置 | 作用 |
|---|---|---|
| **root.html** | `hyperframe/src/root.html` | 视频 Composition 注册入口（HTML 挂载），`<main id="stage" data-scene="<主题>">` |
| **index.js** | `hyperframe/src/index.js` | 入口脚本，按 `data-scene` switch 初始化场景 |
| **index.css** | `hyperframe/src/index.css` | Tailwind/全局样式 + 7fit 色板 CSS 变量 |

### 2.2 每个视频一个独立 scene 目录

```
hyperframe/src/scenes/<主题>/
├── scene.html         # 场景结构
├── scene.js           # GSAP timeline + 动效
├── subtitles.json     # 自动生成的字幕
├── storyboard.md      # 分镜表
├── storyboard.json    # 分镜数据
├── assets.md          # 素材清单
├── research.md        # 主题调研
├── shoot-checklist.md # 拍摄清单
└── components/        # 每镜一组件（Shot<N>_<描述>.html）
```

> **强制门**：写 `scene.html` / `scene.js` 之前，§11 的 5 项必查全部 ✅。

---

## 3 · 安全区硬约束（防遮挡）

| 区域 | 最小留白 | 原因 |
|---|---|---|
| **顶部** | ≥ 120px | 适配手机摄像头 / 平台 UI |
| **左/右** | ≥ 64px | 适配手机圆角 / 异形屏 |
| **底部** | ≥ 80px | 给字幕留位 |

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

见 [timing-sync.md §段间停顿](../planning/timing-sync.md#段间停顿规范-05-1s用户硬约束)。禁止切换其他素材 / 纯字幕 / 装饰卡片。

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

```js
// 0.8× 慢动作
videoEl.playbackRate = 0.8
// 1.2× 加速
videoEl.playbackRate = 1.2
// 特写（zoom in 1.2×）
gsap.to(videoEl, { scale: 1.2, duration: 0.7, ease: 'power2.out' })
// freeze frame（定格）
videoEl.pause()
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

## 6 · 静态资源加载（推荐 `fetch` + blob URL）

```html
<div class="bg-video" data-asset="videos/卧推80KG_10.mov"></div>
```

```js
// 视频：直接 muted + playsinline，不带音轨
const bgVideo = document.querySelector('.bg-video')
bgVideo.src = '/<主题>/videos/卧推80KG_10.mov'  // 相对路径
bgVideo.muted = true
bgVideo.playsinline = true

// 图片：fetch + blob URL（避免相对路径错位）
fetch('/<主题>/images/翼状肩胛自测.png')
  .then(r => r.blob())
  .then(blob => {
    const url = URL.createObjectURL(blob)
    document.querySelector('.hero-img').src = url
  })
```

---

## 7 · 组件模板库（7 类常用组件）

> **铁律**：**每个 shot 拆成独立组件**（`components/Shot<N>_<描述>.html`），不要在 `scene.html` 写满全部内容。
>
> 原因：组件化 → 复用 + 单测 + 调试效率。

### 7.1 标题组件（`<h2 class="segment-title">`）

```html
<!-- components/Shot0_Hook_Title.html -->
<div class="hook-text" data-shot-id="hook_question">
  <h2 class="segment-title">你以为靠墙就能改翼状肩？</h2>
</div>
```

```js
// 入场（默认）
gsap.from('.segment-title', {
  y: 30, opacity: 0, duration: 0.5, ease: 'power2.out'
})
// 出场
gsap.to('.segment-title', {
  y: -20, opacity: 0, duration: 0.3, ease: 'power2.in'
})
```

### 7.2 卡片组件（信息卡 / 数据卡 / CTA 卡）

```html
<!-- components/Shot2_Action_CountCard.html -->
<div class="action-card" data-shot-id="action_wall_angel">
  <div class="card__count">12</div>
  <div class="card__unit">次 × 3 组</div>
</div>
```

```js
// 卡片入场（右上角，缩放 + 弹跳）
gsap.from('.action-card', {
  x: 50, opacity: 0, scale: 0.9, duration: 0.4, ease: 'back.out(1.4)'
})
// 数字滚动
gsap.to(cardCount, { val: 12, duration: 0.5, snap: { val: 1 },
  onUpdate: () => cardCount.innerText = Math.round(cardCount.val)
})
```

### 7.3 视频组件

```html
<!-- components/Shot1_SelfTest_Video.html -->
<video class="action-video" data-shot-id="self_test_1"
       muted playsinline preload="auto">
  <source src="/<主题>/videos/自测_01.mov" type="video/mp4">
</video>
```

```js
const video = document.querySelector('.action-video')
video.muted = true
video.playsinline = true
// 入场
gsap.from(video, { scale: 0.95, opacity: 0, duration: 0.5, ease: 'power2.out' })
```

### 7.4 字幕组件

```html
<div class="subtitle" data-shot-id="self_test_1" data-start="3.5" data-duration="6.0">
  <span class="subtitle__text">背对镜子站好，肩膀放松手垂下来</span>
  <span class="subtitle__highlight">肩胛骨内侧明显突出</span>
</div>
```

```js
// highlight 强制强调（1.15× 弹跳）
gsap.fromTo('.subtitle__highlight',
  { scale: 1 }, { scale: 1.15, duration: 0.25, yoyo: true, repeat: 1, ease: 'back.out(1.7)' }
)
```

### 7.5 装饰元素（数据可视化 / 进度条 / 时间轴）

```html
<div class="data-viz" data-shot-id="self_test_2">
  <div class="progress-bar" data-progress="0.6"></div>
</div>
```

```js
// 进度条
gsap.to('.progress-bar', { width: '60%', duration: 1.0, ease: 'power3.inOut' })
```

### 7.6 段间停顿组件（pause_breath）

```html
<!-- 强制延长上一个 video，不引入新元素 -->
<!-- scene.js 中用 GSAP 触发动效 -->
```

```js
// 4 选 1（参考 §5.2）
videoEl.playbackRate = 0.8  // 慢动作
```

### 7.7 CTA 组件（收尾 + 行动号召）

```html
<!-- components/Shot4_Outro_CTA.html -->
<div class="cta-card" data-shot-id="outro_cta">
  <h2 class="cta-card__title">去试试，评论区交作业</h2>
  <div class="cta-card__icon">💬</div>
</div>
```

### 7.8 A 类口播态组件（talking head，v4 锁版 · 2026-06-12）

> **A 类专属（v4）**。人物口播时的主屏组件。**主口播视频同一份素材双用**——全屏态正方形居中铺满，左右分栏态正方形缩到左侧 <30%。
>
> **v4 更新（2026-06-12）**：v3 圆形 PIP 已废弃 → v4 左右分栏。

```html
<!-- components/Shot1_TalkingHead.html -->
<div class="talking-head" data-shot-id="talking_head_1">
  <video class="talking-head__video"
         data-shot-id="talking_head_1"
         muted playsinline preload="auto"
         style="object-fit: cover; width: 100%; height: 100%;">
    <source src="/<主题>/videos/001_talking_head.mp4" type="video/mp4">
  </video>
</div>
```

```css
/* 主口播视频：正方形容器，GSAP 控制大小/位置 */
/* Full Screen（默认）：1080×1080 正方形居中 */
.talking-head {
  position: absolute;
  top: 0; left: 420px;
  width: 1080px; height: 1080px;
  border-radius: 24px;
  overflow: hidden;
  /* 羽化描边（全屏态专用，Split 态关闭）*/
  box-shadow: inset 0 0 30px 8px rgba(10,10,10,0.5),
              0 0 80px 40px rgba(10,10,10,0.4);
  mask-image: radial-gradient(circle 80% 80% at 50% 50%, black 10%, transparent 100%);
}
.talking-head__video {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: none;  /* ❌ CSS transition 禁用，全部交给 GSAP */
}
/* Split 态：574×574 正方形居左，feathering 关闭 */
.talking-head--split {
  left: 0; top: 260px;
  width: 574px; height: 574px;
  box-shadow: none;
  mask-image: none;
}
```

```js
// 双态切换：全屏态 → 左右分栏态（0.5s）
gsap.to('.talking-head', {
  left: 0, top: 260, width: 574, height: 574,
  duration: 0.5, ease: 'power2.inOut'
})
// 同时加 split class（用于关闭 feathering）
document.querySelector('.talking-head').classList.add('talking-head--split')

// 左右分栏态 → 全屏态（0.5s，反向）
gsap.to('.talking-head', {
  left: 420, top: 0, width: 1080, height: 1080,
  duration: 0.5, ease: 'power2.inOut'
})
document.querySelector('.talking-head').classList.remove('talking-head--split')
```

> **关键技术**：**不要 pause 视频**。双态切换 = 只改 CSS 位置/大小，**视频不停止播放**。这样视频里"嘴在动"的进度 = 主旁白进度 = 字幕进度，**三同步**。
>
> 详见 [video-types.md §3.2 A 类双态布局 + §3.2.6 四条布局硬约束](../planning/video-types.md#32-a-类双态布局新锁版--2026-06-10)

### 7.9 A 类辅助素材组件（visual support，2026-06-10 新增）

> **A 类专属**。当文案提及"看这个""用这个工具"时，辅助素材按"飘浮规则"展示。

```html
<!-- components/Shot2_VisualSupport.html -->
<div class="visual-support" data-shot-id="visual_support_1">
  <div class="visual-support__frame" data-position="top-right">
    <img class="visual-support__image"
         src="/<主题>/images/100_code_screenshot.png"
         alt="Cursor 代码截图">
    <div class="visual-support__label">Cursor + Claude</div>
  </div>
</div>
```

```css
/* 飘在右上角：半透明彩色边框 + backdrop blur */
.visual-support__frame[data-position="top-right"] {
  position: absolute;
  top: 140px; right: 64px;
  width: 60%; max-width: 600px;
  background: rgba(255, 69, 0, 0.10);
  border: 2px solid rgba(255, 69, 0, 0.5);
  border-radius: 16px;
  backdrop-filter: blur(4px);
  padding: 12px;
  z-index: 10;
}
```

```js
// 入场：从右滑入 + 缩放
gsap.from('.visual-support__frame', {
  x: 100, opacity: 0, scale: 0.9,
  duration: 0.4, ease: 'power2.out'
})
```

> **飘浮规则**详 [video-types.md §3.2.3](../planning/video-types.md#323-辅助素材的飘浮规则)

---

## 8 · Scene.js 编排模板（完整 timeline）

> **8 节标准结构**：开场 → 钩子 → 主体（自测/动作 × N）→ 段间停顿 × (N-1) → 收尾 → CTA。

### 8.1 完整 timeline 模板

```js
// scene.js —— 标准 8 节结构
const tl = gsap.timeline({ paused: true })

// 1. 开场（0-0.3s）—— 标题 / 主题元素入场
tl.from('.brand-mark', { opacity: 0, duration: 0.3 }, 0)

// 2. 钩子（0.3-3.3s）
tl.from('.hook-text', { y: 50, opacity: 0, duration: 0.4, ease: 'power2.out' }, 0.3)
  .to('.hook-text', { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, 0.3)

// 3. 主体段 1（3.5-9.5s）—— 自测 / 动作 1
tl.addLabel('segment-1', 3.5)
  .from('.segment-1', { opacity: 0, duration: 0.3 }, 'segment-1')
  .to('.segment-1', { opacity: 1, duration: 0.3 }, 'segment-1+=0.3')

// 4. 段间停顿（9.5-10.2s）—— pause_breath
tl.addLabel('pause-1', 9.0)
  .to('.segment-1 video', { playbackRate: 0.8, duration: 0.7 }, 'pause-1')

// 5. 主体段 2-N（10.2-...）—— 重复段 1 结构
// ...

// 6. 主体结束（X-Y s）—— 主体收尾
tl.to('.segment-N', { opacity: 0, duration: 0.3 }, 'main-end')

// 7. 收尾（Y-Z s）—— 1s 留白 + fade
tl.addLabel('outro', 'main-end+=0.3')
  .from('.outro-cta', { y: 30, opacity: 0, duration: 0.5, ease: 'power2.out' }, 'outro')

// 8. 末段停顿（Z-...）—— BGM fade out
tl.addLabel('fade-out', 'outro+=4')
  .to('.bgm', { volume: 0, duration: 3 }, 'fade-out')

// 必须：锁住首帧 + 注册全局
tl.progress(0).render(0)
window.__timelines = window.__timelines || {}
window.__timelines['scene_id'] = tl
```

### 8.2 timeline 标注速查

| 标注 | 含义 | 用法 |
|---|---|---|
| **绝对时间** | `addLabel('foo', 3.5)` | 在 3.5s 标注 foo |
| **相对时间** | `'foo+=0.3'` | 距 foo 0.3s 后 |
| **重叠转场** | `'shot2-in'`（shot1 出场后立刻开始）| 防硬切 |

---

## 9 · A/B/C 三类视频的脚本实现差异化

| 维度 | A 人设 | B 知识 | C 产品 |
|---|---|---|---|
| **每镜时长** | 5-8s（带情绪）| 3-6s（带动作）| 4-7s（带信息密度）|
| **镜数（60s 视频）** | 8-12 镜 | 12-18 镜 | 10-15 镜 |
| **转场风格** | 柔和（fade / slide_up）+ **双态切换 0.5s** | 紧凑（push_left / zoom）| 快切（fade / push）|
| **卡片占比** | 30%（数据/动作 overlay）| 50%（次数/组数/RPE）| 70%（功能截图/操作）|
| **入场动效侧重** | 慢（power2.out, 0.5-0.6s）| 中（power2.out, 0.4s）| 快（power2.out, 0.3-0.4s）|
| **highlight 频次** | 低（每镜 0-1 个）| 高（每镜 1-3 个）| 中（每镜 1-2 个）|
| **pause_breath 数** | 2-3 个 | 4-6 个 | 2-4 个 |
| **典型错误** | 入场太慢 / **人脸消失 / 辅助素材全屏替代人脸** | 镜数太多（切换疲劳）| 卡片堆砌（信息过载）|

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

**双态切换次数经验值**（60s A 类视频）：
- 口播态：3-4 段（钩子 + 反思/方法论 + 收尾）
- 辅助素材态：4-5 段（工具/数据/案例/总结）
- 总切换：8-10 次（每次 0.5s = 4-5s 用于切换 ≈ 总时长 7%）

### 9.2 B 类脚本骨架

```
钩子 (3s) → 自测 1-2 (快切) → 段间停顿 (zoom) → 动作 1-4 (紧) → 收尾 (7s)
```

### 9.3 C 类脚本骨架

```
钩子 (3s) → 功能 1 卡片 (截图 + 弹跳) → 功能 2 → 功能 3 → CTA 卡片
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
| **scene.js 行数** | ≤ 300 行（超了拆 modules/）|
| **scene.html 行数** | ≤ 200 行（不含 components/）|
| **单文件嵌套深度** | ≤ 3 层 |
| **shot 组件复用次数** | ≥ 2 次（一次性的塞 scene.html）|

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
| **动效** | 用 CSS transition / RAF | 全用 GSAP | 全用 GSAP + ease 选型合理 | — |
| **转场** | < 0.3s / 用 flip | ≥ 0.3s + 5 类之一 | ≥ 0.3s + 决策树选型 + 标注完整 | — |
| **性能** | > 8 个同时动画 / 触发 layout | ≤ 8 个 + 全 transform | ≤ 6 个 + 单镜 ≤ 50 DOM | — |

### 12.1 无素材预览工作流（素材未就绪时）

**设计原则**：素材未就绪也能预览剪辑节奏和图形动画，聚焦"剪得好不好"而非"素材拍没拍"。

**预览能看的（无需素材）**：
- ✅ GSAP timeline 动画（字幕淡入淡出、数字卡翻转、callout 滑入）
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
cd hyperframe
# B 类（B13 等）：直接预览
npm run dev -- --scene=gym_machine_judge_b13

# A 类（A2 等）：用 ?scene= 参数指定
npm run dev -- --scene=a2_one_person_50_videos
```

> 注意：A2 在 scene.html 里已补全 `onerror` fallback；gen-scene.js 通用模板（B/C 类）内置了 `renderVideoShot()` 的 video-missing fallback。新增 A 类场景时，确保 scene.html 的 `<video>` 标签也加了 `onerror` fallback。

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

### 13.4 性能差 / 帧率掉

**排查**：
1. 同时动画元素数 > 8？减少
2. 触发 layout 属性？看 Chrome DevTools Performance 面板的 Layout Shift
3. 视频同时播放 > 2？改用图片或预渲染

### 13.5 元素位置错位

**症状**：标题/卡片位置不对。

**排查**：
1. 安全区 ≥ 120px top / ≥ 64px left/right？
2. 用 CSS `transform: translate(-50%, -50%)` 居中？改 `xPercent: -50, yPercent: -50`
3. 视频 `object-fit: cover` 缺失？容器变形

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
- ❌ 跳过 components/ 直接在 scene.html 写满全部内容
- ❌ 用 CSS transition/animation / Tailwind 动画类（hyperframes 按帧渲染时不按帧推进）
- ❌ 用 `requestAnimationFrame` / `Date.now()` / `performance.now()` 算动画进度
- ❌ **video 自带音轨**（必须分离：muted video + 独立 audio）
- ❌ **timeline 没 `paused: true` + `.progress(0).render(0)`**（首帧黑屏）
- ❌ **单文件 > 300 行**（超了必拆 modules/）
- ❌ **跳过 5 维评分卡直接给用户**（容易漏项）
- ❌ **用 `setInterval` 算数字滚动**（不同步 timeline）
- ❌ **同时动画 > 8 个元素**（移动端必卡）
- ❌ **不跑自检就 npm run render**（违反 [render.md](render.md) 触发规则）

### 14.1 A 类专属反模式（v4 · 2026-06-12 新增）

> 与 [video-types.md §12.1](../planning/video-types.md#121-a-类专属反模式v3-新增--2026-06-10) 同步。

- ❌ A 类视频没有真人口播视频
- ❌ 辅助素材态时人脸完全消失（视频必须在左侧可见）
- ❌ 视频缩小使用圆形 PIP（v3 旧布局）——v4 改为左右分栏矩形视频
- ❌ 左右分栏时视频尺寸或位置不符合规范（不是正方形或 x ≠ 0 或 width > 576px）
- ❌ 双态切换时主口播视频 pause 了（视频里"嘴不动"了，破坏三同步）
- ❌ 辅助素材当主体（不飘角落也不弱化，直接全屏替代人脸）
- ❌ 双态切换 < 0.3s（生硬）或 > 1s（节奏拖）
- ❌ 用 CSS `transition` 做双态切换（hyperframes 引擎不按帧推进 → 卡帧）
- ❌ **口播视频未裁切为正方形**（竖屏素材直接居中两侧黑边）
- ❌ **Split 态视频宽度 ≥ 576px**（占比 ≥ 30%）
- ❌ **全片单一背景图**（A 类应有 per-scene 场景化背景）
- ❌ **Split 态视频列保留羽化描边/box-shadow 效果**

---

## 15 · 音频分离铁律（video muted + 独立 audio）

> **铁律（2026-06-11 立）**：所有 `<video>` 元素**必须**带 `muted playsinline` 属性，**视频文件自身的音轨不进入最终输出**。声音一律走**独立的 `<audio>` 元素**。
>
> **反面教训**：[gym_machine_judge_b13 修复](https://github.com/heygen-com/hyperframes/issues)（2026-06-11）—— 没有这条铁律导致 B 类视频普遍踩坑：视频音轨 + 独立音频双重播放，runtime 报警告 / 数据不对齐。

### 15.1 为什么必须

1. **framework 自动检测**：`muted` → `data-has-audio="false"` → render 阶段 `extractVideosStage` **不会**把视频音轨加到 `composition.audios` 数组。最终输出只含 1 个音轨（独立 `<audio>` 处理结果），不会有视频自带音轨。
2. **避免音轨冲突**：视频自带音轨 + 独立音频同时存在 → 双重播放 → 观众听两遍，且音量不可独立控。
3. **音量控制统一**：声音全走 `<audio>` 元素，`data-volume` / `gsap.to(audio, { volume })` 单独可控（fade-in / fade-out / 段间停顿静音都靠它）。
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

### 15.3 自检 checklist（写完 scene.html 后）

```bash
# 1. 所有 <video> 都有 muted
grep -c '<video' compositions/<topic>.html        # 视频总数
grep -c 'muted' compositions/<topic>.html         # muted 总数
# 上面两行输出必须相等

# 2. 没有任何 <video> 标记 data-has-audio="true"
grep 'data-has-audio="true"' compositions/<topic>.html
# 期望：无输出

# 3. 声音元素全在 <audio> 里
grep '<audio' compositions/<topic>.html
# 至少包含 voiceover + BGM（如有）
```

### 15.4 反例

- ❌ `<video src="...mp4" data-has-audio="true">`（不静音 → 视频自带音轨进 render）
- ❌ `<video src="...mp4">` 不写 `muted`（默认有声 → framework 走"双音轨"路径，runtime 报警告）
- ❌ 视频自带 BGM（"录的时候顺便加了个 BGM" → BGM 没法独立控音量，段间停顿做不到）
- ❌ 配音轨通过 video 的 `volume` 属性（video 应全程 muted，音量全在 `<audio>` 上）

### 15.5 三个 track-index 的语义

| track | 用途 | 例子 |
|---|---|---|
| `data-track-index="0"` | voiceover / 旁白 | `<audio id="voiceover">` |
| `data-track-index="1"` | BGM / 背景音乐 | `<audio id="bgm">` |
| `data-track-index="2"` | 视频 / 视觉元素 | `<video>`, `<div class="shot">` |

> 数字大小只代表轨道编号（不表视觉层级），框架对所有 track 一视同仁。  
> 同一 track 上的元素**不重叠时间**，不同 track 任意重叠——这是 voiceover + BGM 混音的基础。

---

## 附录 A · 速查索引

| 我想... | 看... |
|---|---|
| 写一个 Shot 组件 | [§7 组件模板库](#7-组件模板库7-类常用组件) |
| 编排完整 timeline | [§8 Scene.js 编排模板](#8-scenejs-编排模板完整-timeline) |
| 按视频类型差异化 | [§9 A/B/C 三类视频的脚本实现差异化](#9-abc-三类视频的脚本实现差异化) |
| 修首帧黑屏 | [§13.1 黑屏 / 首帧空白](#131-黑屏--首帧空白) |
| 跑 5 维评分 | [§12 5 维评分卡 + 评审 SOP](#12-5-维评分卡--评审-sop) |
| 写代码前必查 | [§11 实现 Scene 组件前必查](#11-实现-scene-组件前必查) |
| **video 必带 muted / 声音分离** | **[§15 音频分离铁律](#15--音频分离铁律video-muted--独立-audio)** |

---

## 附录 B · 变更日志

### v3（2026-06-11）— 音频分离铁律

- **新增 §15 音频分离铁律**："`<video>` 必带 `muted playsinline` + 声音走独立 `<audio>`" 立为铁律，附 4 条理由 + 模式模板 + 3 步自检 grep + 4 类反例 + 3 个 track-index 语义表
- 触发：gym_machine_judge_b13 修复时发现 hyperframes 0.6.72 在多 audio 元素场景下的语音丢失 bug；为避免下次再因"video 自带音轨 + 独立 audio"导致双重播放 / 静默丢音，把音轨分离硬约束写进规范
- 附录 A 速查索引新增 §15 入口
- §14 反模式已有"❌ video 自带音轨"条目，与 §15 互为引用

### v2（2026-06-09）— 深化拓展

- **新增 §7 组件模板库**：7 类常用组件（标题/卡片/视频/字幕/装饰/pause_breath/CTA），含 HTML + GSAP 代码
- **新增 §8 Scene.js 编排模板**：8 节标准结构（开场→钩子→主体→段间→收尾→CTA）+ timeline 标注速查
- **新增 §9 A/B/C 三类视频的脚本实现差异化**：每镜时长/镜数/转场/卡片占比/入场动效 5 维对照 + 3 类脚本骨架
- **新增 §10 性能与可维护性约束**：6 项性能铁律 + 4 项可维护性铁律
- **新增 §12 5 维评分卡 + 评审 SOP**：每维 ≥ 3 分 + 总分 ≥ 18 才能进用户审阅
- **新增 §13 调试与排错 SOP**：5 大症状（黑屏/卡帧/音画不同步/性能/位置错位）+ 排查顺序 + 修法模板
- **新增附录 A 速查索引** + **附录 B 变更日志**
- **§5 转场规范扩 5.3 决策树**
- **§14 反模式从 12 条扩到 21 条**
- **保留不变**：§1 API 映射 + §2 目录结构 + §3 安全区 + §4 设计风格 + §6 静态资源加载 + §11 实现前必查

### v1（2026-06-06）— 初版

- Remotion → Hyperframes API 映射
- 安全区 + 配色 + 转场 + 资源加载
- 由 winged_scapula_b3 实战沉淀
