# 动画清单 / 特效清单 / 转场清单

> **强制优先级**：生成脚本时**必须**参考本清单。复用组件优先，但**绝不将就**——如果现有组件不满足需求，必须新建或扩展。
>
> **生效日期**：2026-06-14
> **维护人**：每次新增动画/特效/转场组件后**必须**更新本清单

---

## 目录

1. [转场清单](#1-转场清单transition-types) — `remotion/src/utils/transition.ts`
2. [动画清单](#2-动画清单animations) — 组件入场/出场/循环动画
3. [特效清单](#3-特效清单effects) — 视觉增强效果
4. [可探索清单（可选）](#4-可探索清单可选) — 尚未实现但可考虑
5. [组件复用规则](#5-组件复用规则)

---

## 1. 转场清单（Transition Types）

### 1.1 已实现转场（14 种）

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

### 1.2 转场引擎

| 组件 | 位置 | 用途 |
|---|---|---|
| `ShotRenderer` | `components/transitions/ShotRenderer.tsx` | 统一转场封装（enter/exit 组合） |
| `TransitionSeriesEngine` | `components/transitions/TransitionSeriesEngine.tsx` | 序列转场 + LightLeak |

### 1.3 转场使用规则

- **最低时长**：`≥ 0.3s`（9 帧 @ 30fps）
- **禁止**：flip / 旋转 / 3D 转场（与力量感调性冲突）
- **优先**：Crossfade（fade）/ Push / 方向滑动
- **BGM 场景**：转场时 BGM 同步做 ducking

---

## 2. 动画清单（Animations）

### 2.1 入场动画（Entry Animations）

| 动画名称 | 实现组件 | 模式 | 关键参数 |
|---|---|---|---|
| **弹簧弹入** | 13+ 组件（HeadlineCard/QuoteCard/FormulaCard/WorkflowCard/ToolBadgeList/FolderTree/ImpactBar/TimeStateCard/MetadataPair/ComparisonCard/FlowDiagram/ActionDataCard） | `spring({ damping: 8, stiffness: 200, mass: 0.5 })` | delay 可调 |
| **渐显** | 所有组件 | `interpolate(enter, [0,1], [0,1])` | opacity 0→1 |
| **缩放弹入** | ActionDataCard | scale: 0.85→1 | spring + translateX/Y |
| **交错入场** | FormulaCard(i×3)/WorkflowCard(i×6)/ToolBadgeList(i×8)/FolderTree(i×4)/GitLogDisplay | `spring({ frame: frame - delay - i*stagger })` | i 为索引 |

### 2.2 出场动画（Exit Animations）

| 动画名称 | 实现位置 | 模式 |
|---|---|---|
| **渐隐** | 所有组件通用 | `Easing.in`（8-12 帧） |
| **缩小退出** | ActionDataCard | `Easing.out(Easing.cubic)` |
| **向左滑出** | ShotRenderer exit | `translateX: 0→-80` |

### 2.3 循环动画（Loop Animations）

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

### 2.4 动效 API 规范

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

### 2.5 贝塞尔曲线（4 条推荐）

| 名称 | 参数 | 用途 |
|---|---|---|
| Crisp | `Easing.bezier(0.16, 1, 0.3, 1)` | 入场 |
| Editorial | `Easing.bezier(0.4, 0, 0.2, 1)` | 转场 |
| Playful | `Easing.bezier(0.34, 1.56, 0.64, 1)` | 弹跳 |
| Standard | `Easing.out(Easing.cubic)` | 出场 |

---

## 3. 特效清单（Effects）

### 3.1 已实现特效

| 特效名称 | 实现位置 | 参数 | 备注 |
|---|---|---|---|
| **LightLeak** | `TransitionSeriesEngine.tsx:145-161` / `ShotRenderer.tsx:94-108` | seed / hueShift | `@remotion/light-leaks` |
| **BGM Pulse** | `BgmPulse.tsx:64-76` | bass→scale(1→1.4) + opacity(0→0.5) | 音频驱动 |
| **边框辉光** | 所有 Auxiliary 组件 | `boxShadow: "0 0 20px rgba(255,69,0,0.15)"` | 呼吸动画 |
| **霓虹边框** | CTAButton | `border: "2px solid #FF4500"` | 静态 |
| **玻璃态** | 所有 Auxiliary 组件 | `bg: rgba(10,10,20,0.88) + backdropFilter: blur(8px)` | 半透明背景 |
| **打字光标** | CodeDisplay.tsx:255 | blink via sin | 500ms 周期 |
| **Shimmer 条纹** | ImpactBar.tsx | interpolate shimmer | 进度条纹理 |

### 3.2 音频相关特效

| 特效名称 | 实现位置 | 用途 |
|---|---|---|
| **BGM Ducking** | `BGMWithDucking.tsx:53-73` | 旁白期间 BGM 降 -12dB |
| **BGM Fade In/Out** | `BGMWithDucking.tsx` | 帧 0-60 fade in，末 60 帧 fade out |
| **音频可视化** | `BgmPulse.tsx` | `useWindowedAudioData` + `visualizeAudio` |

### 3.3 样式特效

| 特效名称 | 实现组件 | 模式 |
|---|---|---|
| **文字辉光** | HeadlineCard.tsx:67-68 | `textShadow: "0 0 50px rgba(...)"` |
| **亮度呼吸** | HeadlineCard/TimeStateCard/FormulaCard | `filter: brightness` + sin |
| **半透明强调背景** | 所有 Auxiliary 组件 | 强调色 1/2 + 透明度 |

---

## 4. 可探索清单（可选）

> 以下特效/动画**尚未实现**，但在**特定场景合适时可以考虑**。实现前需确认：
> 1. 调性匹配（力量感/科技感）
> 2. 性能影响评估
> 3. 不影响现有组件稳定性

### 4.1 入场/强调动画

| 特效 | 场景建议 | 复杂度 |
|---|---|---|
| **字母逐一显示** | 代码展示、步骤说明 | 中 |
| **词语逐一显示** | 字幕高亮、关键词强调 | 低 |
| **挤压入场** | 数据卡片、强调数字 | 低 |
| **旋转入场** | 图标、工具徽章 | 中 |
| **下划线强调** | 关键词高亮 | 低 |
| **背景闪烁** | 切换提示 | 低 |
| **脉冲循环（自动）** | 活跃状态指示器 | 低 |

### 4.2 转场变体

| 特效 | 场景建议 | 复杂度 |
|---|---|---|
| **Wipe Left/Right/Up/Down** | 方向感强的内容切换 | 中 |
| **窗帘转场** | 戏剧性切换 | 中 |
| **缩放转场（1.5×）** | 聚焦放大 | 低 |
| **模糊转场** | 柔和过渡 | 中 |

### 4.3 视觉特效

| 特效 | 场景建议 | 复杂度 |
|---|---|---|
| **Glitch 故障** | 科技感强调、数据错误展示 | 高 |
| **RGB 偏移** | 动感强调 | 高 |
| **扫描线** | 复古/科技感 | 中 |
| **粒子爆发** | CTA、成就展示 | 高 |
| **视差滚动** | 多层背景 | 中 |
| **边框圆角渐变** | 布局过渡 | 低 |
| **动作轨迹线** | B 类健身动作演示 | 高 |
| **频谱柱** | BGM 可视化增强 | 中 |

### 4.4 音频特效

| 特效 | 场景建议 | 复杂度 |
|---|---|---|
| **Beat Pulse Ring（AnalyserNode）** | B 类视频节拍可视化 | 高 |
| **Treble Sparkle** | 高频闪烁 | 中 |
| **RPE 难度块** | B 类健身难度展示 | 中 |

---

## 5. 组件复用规则

### 5.1 复用优先级

```
1. 现有组件完全满足需求 → 直接使用
2. 现有组件部分满足 → 扩展现有组件（加 props）
3. 现有组件不满足 → 新建组件（不复用）
4. 多个场景需要相同模式 → 提取为共享组件/hooks
```

### 5.2 "不将就" 原则

- **禁止**：因为"差不多能用"而强行复用不匹配的组件
- **禁止**：修改现有组件使其丧失原有功能
- **允许**：通过 props 扩展组件行为（不影响原有调用方）
- **允许**：新建组件后，旧组件保留（逐步迁移）

### 5.3 可复用组件索引

| 类别 | 组件 | 路径 |
|---|---|---|
| **转场引擎** | ShotRenderer | `components/transitions/ShotRenderer.tsx` |
| **转场引擎** | TransitionSeriesEngine | `components/transitions/TransitionSeriesEngine.tsx` |
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

---

## 6. 新增组件登记

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

## 7. 相关规范索引

| 规范 | 路径 | 关联 |
|---|---|---|
| 动效铁律 | `rules/animation.md` | 必须遵循 `useCurrentFrame() + interpolate/spring` |
| 分镜规范 | `rules/storyboard.md` | 转场时长 ≥ 0.3s |
| BGM 规范 | `rules/bgm.md` | BGM Ducking 必做 |
| 脚本规范 | `rules/script.md` | 安全区 / 配色约束 |