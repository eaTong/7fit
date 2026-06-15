# Storyboard · a2_one_person_50_videos (v4.1)

> **A2 · 一人一周 50 条视频**（A 类 · 个人人设 v4.1 重构版）
> 文案源：[docs/copy/a2_one_person_50_videos.md](../../../docs/copy/a2_one_person_50_videos.md)（v4.1 锁版 313 字 / 105.8s）
> Composition：`a2-one-person-50-videos` · durationInFrames=3180 (106s) · 1920×1080 @ 30fps
> 字幕：[subtitles.json](./subtitles.json)（30 条，105.0s）
> 分镜引擎：[LayoutTransitionEngine](../../layout-state-machine/LayoutTransitionEngine.tsx)
> 段间停顿：7 × 0.5s = 3.5s（钩子-段1 / 段1-2-3-4-5-6 / 段6-收尾）

---

## 0. 总览（8 shot × ~13s = ~106s）

| # | shotId | 起始 | 结束 | 时长 | layoutId | 关键内容 |
|---|---|---|---|---|---|---|
| s1 | 钩子 | 0 (0.0s) | 90 (3.0s) | 3.0s | CenteredFullBg | "谁能想到——" 反常识 |
| s2 | 段1 身份+动机 | 105 (3.5s) | 573 (19.1s) | 15.6s | TextCenterTalkingRight | 我是 PM / 健身 2 年 / 朋友问 / 剪视频 |
| s3 | 段2 旧流程痛 | 588 (19.6s) | 942 (31.4s) | 11.8s | PipBottomRight | 9 步流程熬 1 周 / 凌晨 2 点 / 9 点上班 |
| s4 | 段3 工具介绍 | 957 (31.9s) | 1503 (50.1s) | 18.2s | PipBottomLeft | Claude Code + mmx + Remotion |
| s5 | 段4 核心收益 | 1518 (50.6s) | 2154 (71.8s) | 21.2s | TextCenterTalkingLeft | AI 9 成 / 我 1 成 / 20 倍 |
| s6 | 段5 新工作流 | 2169 (72.3s) | 2724 (90.8s) | 18.5s | BottomRightTalking | 7 点下班 → 健身拍 → 回家交 AI → 睡 → 剪好 |
| s7 | 段6 升华 | 2739 (91.3s) | 2943 (98.1s) | 6.8s | BottomLeftTalking | 朋友开挂 / 流水线 |
| s8 | 收尾 | 2958 (98.6s) | 3180 (106.0s) | 7.4s | CenteredFullBg | AI 时代重构 / 评论区聊聊 |

> **段间停顿**：s1→s2 (15 帧) / s2→s3 / s3→s4 / s4→s5 / s5→s6 / s6→s7 / s7→s8 (各 15 帧) = 7 × 0.5s = 3.5s

---

## 1. 逐镜分镜

### s1 · 钩子（0-3.0s，3.0s）— CenteredFullBg

**字幕**：
- 0.0-2.6s：谁能想到—— *(highlight)*
- 2.6-5.0s：产品经理下班后，也开始剪健身视频了

**画面**：
- 全屏居中 HeadlineCard：title="谁能想到——" / highlightWord="产品经理下班后" / subtitle="也开始剪健身视频了"
- 背景图：`images/bg/a2_workout_intro/s1_hook.jpg`
- 转场：zoom 入场

**目的**：反常识冲击（A 类首选钩子类型 §4.1）

---

### s2 · 段1 身份+动机（3.5-19.1s，15.6s）— TextCenterTalkingRight

**字幕**（4 条）：
- 5.5-10.5s：我是个产品经理。上班朝九晚七——下班才是正事，剪视频 *(highlight)*
- 10.5-13.5s：健身 2 年，朋友看我练的还行
- 13.5-16.5s：就问我怎么练的，打字说不清
- 16.5-19.1s：干脆剪视频讲清楚 *(highlight)*

**画面**：
- 左文右口播：左侧 MetadataPair（身份=产品经理 / 健身=2 年爱好者） + 右侧 talking head 圆头像
- 转场：slide-left（从 CenteredFullBg 滑入）

**目的**：身份锚定（§3.2 反常识 + 身份代入双钩）

---

### s3 · 段2 旧流程痛（19.6-31.4s，11.8s）— PipBottomRight

**字幕**（3 条）：
- 19.6-23.6s：文案、脚本、音乐、字幕、素材、剪辑、转场、调色、导出—— *(highlight)*
- 23.6-27.4s：1 条熬 1 周，每天凌晨 2 点才收工 *(highlight)*
- 27.4-30.4s：第二天还要 9 点上班

**画面**：
- PIP 圆头像右下角：TimeStateCard（time="凌晨 2 点" / state="9 步流程熬 1 周"）
- 9 步流程的完整列举（用户 v4.1 要求）通过字幕实现
- 转场：slide-left

**目的**：具体化旧流程（§3.3 生活化对话，§9.1 数字冲击力）

---

### s4 · 段3 工具介绍（31.9-50.1s，18.2s）— PipBottomLeft

**字幕**（5 条）：
- 30.9-34.0s：后来我换了 3 个工具——专治"白天上班、晚上创作"的人 *(highlight)*
- 34.0-38.0s：Claude Code 写脚本、列分镜、出镜头决策
- 38.0-41.5s：mmx 出图、做字幕、找 BGM
- 41.5-45.0s：Remotion 按帧渲染
- 45.0-48.6s：自动做特效、转场、排版、收集素材 *(highlight)*

**画面**：
- PIP 圆头像左下角：ToolBadgeList（3 个 tool，每个带具体能力）
  - "Claude Code 写脚本/列分镜/出镜头"
  - "mmx 出图/做字幕/找 BGM"
  - "Remotion 按帧渲染/自动特效/转场/排版/收集素材"
- 转场：slide-right

**目的**：3 工具具体能力（§3.3 具体性原则，§9.1 数字冲击力）

---

### s5 · 段4 核心收益（50.6-71.8s，21.2s）— TextCenterTalkingLeft

**字幕**（6 条）：
- 49.1-53.5s：AI 替我扛 9 成活。我只判断方向 *(highlight)*
- 53.5-57.0s：——剩下的它自己跑完 *(highlight)*
- 57.0-60.5s：再也不用熬夜剪视频了 *(highlight)* ← 用户 v4.1 要求
- 60.5-64.0s：健身、睡觉、剪视频，三件事不再打架
- 64.0-67.0s：产能翻的不是 2 倍，是 20 倍 *(highlight)* ← 用户 v4.1 微调 28→20
- 67.0-70.3s：之前熬到凌晨 2 点的日子，一去不复返

**画面**：
- 50% 等分左文右口播：左侧 ImpactBar（aiPercent={90} / mePercent={10} / aiLabel="AI 替我扛 9 成" / meLabel="我只判断方向"）
- 右侧 talking head 圆头像
- 转场：fade

**目的**：核心收益（A 类身份代入——"我"的判断力 vs "AI"的执行力）

---

### s6 · 段5 新工作流（72.3-90.8s，18.5s）— BottomRightTalking

**字幕**（6 条）：
- 70.8-73.5s：7 点下班，健身顺便拍素材
- 73.5-76.5s：回家把素材交给 AI，睡觉
- 76.5-80.0s：第二天起来，视频剪好了
- 80.0-83.0s：睁开眼，成片就在电脑里 *(highlight)* ← 用户 v4.1 微调 文件夹→电脑
- 83.0-86.0s：包括现在你看到的视频 *(highlight)* ← 用户 v4.1 要求
- 86.0-88.8s：也是用这套 AI 工作流生成的 *(highlight)*

**画面**：
- 右上 / 右下宽幅：WorkflowCard（4 步）
  1. 7 点下班 — 健身拍素材
  2. 回家 — 素材交给 AI
  3. 睡觉 — AI 自动跑
  4. 第二天起来 — 视频剪好了
- 转场：slide-left

**目的**：新工作流可视化（§3.3 具体场景，§7.2 A 类模板）

---

### s7 · 段6 升华（91.3-98.1s，6.8s）— BottomLeftTalking

**字幕**（2 条）：
- 89.3-93.0s：朋友都说我开挂了
- 93.0-95.6s：——其实我只是把剪视频变成了流水线 *(highlight)*

**画面**：
- 左下角 ComparisonCard：before="以前 1周/条" / after="现在 1天/条 × 20"
- 转场：slide-right

**目的**：升华（v3.4 钩子类型反常识——"流水线"比喻）

---

### s8 · 收尾（98.6-106.0s，7.4s）— CenteredFullBg

**字幕**（2 条）：
- 96.1-100.5s：AI 时代，所有人的工作流都值得被重构一遍 *(highlight)* ← 用户 v4.1 要求
- 100.5-105.0s：评论区聊聊你的工作吧 *(highlight)*

**画面**：
- 全屏居中 HeadlineCard：title="AI 时代，所有人的工作流" / highlightWord="都值得被重构一遍" / subtitle="评论区聊聊你的工作"
- 转场：fade + fade out（105-106s）

**目的**：留悬念 CTA（§6.4 互动型 + 留悬念型双 CTA，§6.5 A 类首选）

---

## 2. 段间停顿总览

| 段间 | 帧 | 秒 | 视觉建议 |
|---|---|---|---|
| s1 → s2 | 15 | 0.5 | 弱 fade / 文字残影 |
| s2 → s3 | 15 | 0.5 | quick cut / push left |
| s3 → s4 | 15 | 0.5 | 0.5s 静止放大（9 步流程的视觉停留）|
| s4 → s5 | 15 | 0.5 | quick cut / push right |
| s5 → s6 | 15 | 0.5 | slide up（核心收益 → 新工作流强转折）|
| s6 → s7 | 15 | 0.5 | quick cut / push left |
| s7 → s8 | 15 | 0.5 | fade out + zoom out（沉淀收尾）|

---

## 3. v3 → v4.1 分镜变化总览

| 维度 | v3 (10 镜) | **v4.1 (8 镜)** |
|---|---|---|
| 镜数 | 10 | 8（合并 4 个相邻小镜）|
| 总时长 | 99.1s | 106s |
| 主体字数 | 250 | 313 |
| 字幕条数 | 29 | 30 |
| 文案版本 | 模糊/重复/拗口 | 故事化/具体/自然 |
| Layout 覆盖 | 10 种 | 7 种（s2=s5 互换 layout）|
| 视觉卡片 | MetadataPair/TimeStateCard/ToolBadgeList/WorkflowCard/FlowDiagram/ImpactBar/ComparisonCard/QuoteCard/HeadlineCard (9) | MetadataPair/TimeStateCard/ToolBadgeList/ImpactBar/WorkflowCard/ComparisonCard/HeadlineCard (7) |
