# A 类视频口播布局状态机 — 使用规范

> **适用对象**：A 类视频（个人人设/口播）的脚本设计者、分镜工程师
> **强制等级**：**必须遵守**，违反将导致渲染异常或预期之外的效果
> **最后更新**：2026-06-13

---

## 0 · 核心概念速查

| 概念 | 说明 |
|---|---|
| **口播视频** | 全局持久，永不 unmount，只做位置/大小 morphing |
| **Shot** | 时间段单元，由 `shotSequence` 定义 |
| **LayoutState** | 布局状态（位置/尺寸/圆角/边框），注册到 `LayoutStateRegistry` |
| **辅助素材** | 按 shot 加载的视频/图片/数据卡，入场/退场独立动画 |
| **背景层** | `backgroundSrc` 或 `renderBackground`，最底层 |

---

## 1 · shotSequence 设计规范

### 1.1 数据结构

```ts
const shotSequence: ShotEntry[] = [
  {
    shotId: "s1",              // 唯一标识，snake_case
    layoutId: "fullscreen",    // 引用 LayoutStateRegistry 中的布局 id
    transitionType: "ease-out", // 口播 morphing 曲线
    startFrame: 0,              // 起始帧（含）
    endFrame: 90,               // 结束帧（不含），时长 = endFrame - startFrame
  },
  // 更多 shot...
];
```

### 1.2 时间约束

| 约束 | 规则 | 原因 |
|---|---|---|
| **连续性** | `shot[N].endFrame === shot[N+1].startFrame` | 无缝衔接，不留黑帧 |
| **无重叠** | `shot[A].startFrame < shot[B].endFrame` 时，A 与 B 不能同时活跃 | 引擎线性扫描，不处理重叠 |
| **最小 Shot 时长** | ≥ 30 帧（约 1 秒） | 布局 morphing 过渡需要 30 帧，低于 1 秒视觉上会很突兀 |
| **总时长** | 所有 shot 连续覆盖，无空洞 | 中间有空帧会导致布局回退到 fullscreen fallback |

### 1.3 Shot 命名

- `shotId` 使用 `snake_case`，如 `s1`、`intro_talking`、`demo_pip`
- 语义化命名有助于调试：`demo_pip` 比 `s3` 更可读

---

## 2 · 布局类型语义

每种 `layoutId` 代表一种**口播的呈现状态**，不是随意选用的。

### 2.1 布局一览

| layoutId | 口播状态 | 适用场景 |
|---|---|---|
| `fullscreen` | 全屏占据 | 纯口播、强调、情绪高点 |
| `left_text_right_talking` | 口播在右侧 30% | 左侧放文字/数据/参数，讲解时用 |
| `pip_bottom_right` | 口播缩右下小窗 | 主区域展示演示/视频，口播作为补充 |
| `pip_bottom_left` | 口播缩左下小窗 | 同上，构图需要时用 |
| `grid_2x2` | 口播占左上格（其余 3 格辅助素材）| 并列展示多个内容时用 |

### 2.2 布局选择原则

**不是想用什么就用什么——根据叙事阶段选择**：

```
开场/情绪高点  → fullscreen（纯口播冲击力最大）
讲解内容      → left_text_right_talking（口播 + 文字/参数同步）
展示演示/视频 → pip_bottom_right/left（口播补充 + 主区域演示）
多角度并列    → grid_2x2（口播 + 3 个辅助格）
```

### 2.3 禁止规则

- **禁止**在 `fullscreen` 布局的 shot 中同时放大量文字——口播全屏时主区域就是口播，文字无处放
- **禁止**在 `left_text_right_talking` 布局的 shot 中口播内容与文字内容相同——口播已经在那了，不需要重复文字
- **禁止**在 `grid_2x2` 布局的 shot 中口播内容与辅助格内容相同——口播在小窗，辅助格才是主内容

---

## 3 · 过渡曲线选择

每种 `transitionType` 影响口播从旧布局 morph 到新布局时的**动画曲线**。

### 3.1 曲线一览

| transitionType | 曲线感觉 | 推荐使用场景 |
|---|---|---|
| `ease-out` | 快速启动 + 柔缓停止 | 默认/开场/情绪平稳过渡 |
| `ease-in-out` | 慢起慢停 | 温和过渡，不强调变化 |
| `crisp` | 快起快停，锐利 | 健身力量感、节奏感强 |
| `standard` | 偏硬朗 | 健身力量感 |
| `spring` | 弹跳感 | 口播缩小到小窗（PIP）时 |
| `slide-left` | 左滑入 | 左侧新内容替换旧内容 |
| `slide-right` | 右滑入 | 右侧新内容替换旧内容 |
| `push_left` | 左推入（带缩放）| 切换到 left_text_right_talking |
| `zoom` | 放大入场 | 切换到 fullscreen（放大感）|
| `fade` | 纯淡入淡出 | 静默过渡，不强调变化 |

### 3.2 曲线选择原则

```
从 fullscreen → left_text_right_talking : push_left 或 slide-left
从 left_text_right_talking → pip :         spring（弹入小窗感）
从 pip → fullscreen :                      zoom（放大回归）
从任意 → fullscreen（情绪高点）:           ease-out 或 zoom
日常讲解过渡：                             ease-out 或 slide-left
健身力量感场景：                           crisp 或 standard
```

### 3.3 禁止规则

- **禁止**在情绪高点（如"最后我要告诉你一件事"）使用 `fade`——`fade` 是淡化，不适合强调
- **禁止**连续两个 shot 使用相同的 `transitionType` 且布局不变——morphing 是给观众看的，变化才有意义

---

## 4 · 背景层使用规范

### 4.1 背景优先级

```
renderBackground（自定义） > backgroundSrc（静态） > 无背景（#0A0A0A 黑）
```

### 4.2 使用场景

| 场景 | 推荐方式 |
|---|---|
| 整个视频使用同一张背景图 | `backgroundSrc="images/bg.jpg"` |
| 每个 shot 切换不同背景 | `renderBackground` 函数 |
| 背景是视频（如 B-roll）| `renderBackground` 返回 `OffthreadVideo` |
| 创意背景（如渐变、light leak）| `renderBackground` 返回自定义元素 |

### 4.3 renderBackground 签名

```ts
renderBackground?: (currentShot: ShotEntry, curLayout: LayoutState) => React.ReactNode;
```

**示例：每个 shot 对应不同背景图**

```tsx
<LayoutTransitionEngine
  videoSrc="videos/talking_head.mov"
  shotSequence={shotSequence}
  renderBackground={(currentShot) => (
    <Img
      src={staticFile(`images/bg_${currentShot.shotId}.jpg`)}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  )}
/>
```

### 4.4 禁止规则

- **禁止**在 `fullscreen` 布局的 shot 中使用高对比度/强纹理背景——口播是主体，背景太花影响可读性
- **禁止**在 `left_text_right_talking` 布局的 shot 中背景与左侧文字颜色接近——影响文字可读性
- **禁止**在 `renderBackground` 中返回带 zIndex 的元素——背景层固定在最底层，自定义 zIndex 会打乱层级

---

## 5 · 辅助素材（ShotContent）规范

### 5.1 内容类型

| contentType | 渲染方式 | 入场动画 |
|---|---|---|
| `video` | OffthreadVideo | opacity 0→1，8 帧 |
| `image` | Img | opacity 0→1，8 帧 |
| `data_viz` | 自定义 children | scale 0.8→1 + opacity |
| `text_card` | 自定义 children | opacity + translateY |
| `pause_breath` | 不渲染 | 无（段间停顿）|

### 5.2 位置由 layoutId 决定

| layoutId | 辅助素材位置 | 说明 |
|---|---|---|
| `fullscreen` | 无（`display: none`）| 口播全屏，无辅助素材空间 |
| `left_text_right_talking` | 左侧 1344×864 | 文字/参数放这里 |
| `pip_bottom_right/left` | 全屏 1920×864 | 主区域放演示视频 |
| `grid_2x2` | 右侧 960×864 | 3 个辅助格 |

### 5.3 禁止规则

- **禁止**在 `fullscreen` 布局的 shot 中传入 `contentSrc`——口播全屏时辅助素材会被隐藏，但资源仍会加载，浪费性能
- **禁止**在 `pause_breath` shot 中放 `contentSrc`——`pause_breath` 就是纯停顿，不放内容

---

## 6 · 脚本设计流程

### 6.1 步骤

```
Step 1: 写文案（按 copy.md 规范）
       ↓
Step 2: 按语义段落切分 Storybeat，确定 Shot 数量
       ↓
Step 3: 为每个 Shot 选择 layoutId（参考 §2.2 布局选择原则）
       ↓
Step 4: 为每个 Shot 选择 transitionType（参考 §3.2 曲线选择原则）
       ↓
Step 5: 计算 startFrame / endFrame（基于语速，中速 3.4 字/秒）
       ↓
Step 6: 确定背景（backgroundSrc / renderBackground / 无背景）
       ↓
Step 7: 确定辅助素材（contentType + contentSrc）
       ↓
Step 8: 编写 shotSequence，填入 Scene index.tsx
```

### 6.2 示例： WorkoutIntro 4+1 Shot 设计

```ts
const shotSequence: ShotEntry[] = [
  // s1: 开场纯口播，全屏，情绪高点
  { shotId: "s1", layoutId: "fullscreen",              transitionType: "ease-out",   startFrame: 0,    endFrame: 90 },
  // s2: 讲解内容，左文右口播
  { shotId: "s2", layoutId: "left_text_right_talking", transitionType: "slide-left", startFrame: 90,   endFrame: 210 },
  // s3: 演示视频，口播缩右下小窗
  { shotId: "s3", layoutId: "pip_bottom_right",        transitionType: "spring",     startFrame: 210,  endFrame: 360 },
  // s4: 并列展示，口播占左上格
  { shotId: "s4", layoutId: "grid_2x2",                 transitionType: "fade",      startFrame: 360,  endFrame: 540 },
  // s5: 收尾，纯口播全屏
  { shotId: "s5", layoutId: "fullscreen",              transitionType: "zoom",       startFrame: 540,  endFrame: 720 },
];
```

---

## 7 · 帧数计算规则

### 7.1 公式

```
每 Shot 时长（秒）= 该段字数 / 中速（3.4 字/秒）
每 Shot 时长（帧）= 时长（秒）× 30 fps
endFrame = startFrame + durationInFrames
```

### 7.2 示例

```
段落："大家好，今天我们来聊聊力量训练"
字数：18 字
中速时长：18 / 3.4 = 5.3 秒
帧数：5.3 × 30 = 159 帧（约 5.3 秒）

shotSequence:
  startFrame: 0
  endFrame: 159
```

### 7.3 段间停顿

相邻 shot 之间加入 0.5-1 秒（15-30 帧）的 `pause_breath` shot，用于：
- 情绪过渡（从紧张到放松）
- 观众消化前段内容
- BGM 过渡点

---

## 8 · 竖屏兼容（预留）

当前规范仅支持**横屏 1920×1080**。

竖屏 1080×1920 扩展时：
- 新建 `layout-state-machine/layouts/portrait/` 注册中心
- 竖屏布局 id 加前缀 `portrait_`
- Scene 入口根据 `isPortrait` prop 选择对应 registry

---

## 9 · 快速检查清单

每个 Shot 提交前自查：

- [ ] `shotId` 唯一且语义化
- [ ] `layoutId` 与当前叙事阶段匹配（不是随意选）
- [ ] `transitionType` 与场景情绪匹配（不是随意选）
- [ ] `startFrame` = 上一个 `endFrame`（连续无空洞）
- [ ] `duration >= 30` 帧（约 1 秒）
- [ ] `fullscreen` shot 中无 `contentSrc`（浪费性能）
- [ ] `pause_breath` shot 中无 `contentSrc`
- [ ] `renderBackground` 返回元素无自定义 zIndex
- [ ] 背景与口播颜色/内容不冲突

---

## 10 · 违规处理

违反本规范可能导致：
- 口播与小窗内容重叠
- 背景与文字可读性冲突
- 布局 morphing 突兀（shot 太短）
- 资源浪费（加载无用素材）

**发现违规 → 返回 Step 3 重新设计 Shot**，不要带着问题进入分镜阶段。