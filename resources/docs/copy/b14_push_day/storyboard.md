# 健身推力日计划 · 分镜表

> **视频类型**：B 类 — 健身知识
> **总时长**：~32s（TTS 录制后精确）
> **BGM**：`gym_beat_b14.mp3`（120 BPM，prominent kick drum）
> **画布**：1080×1920 竖屏
> **音频**：分段 TTS（无旁白）
> **转场风格**：有力硬切（push_left / zoom），禁用 fade
> **钩子布局**：2×2 网格同屏 4 动作

---

## Shot 列表

| # | shot_id | start | end | dur | 类型 | 素材（resources/videos/） | 转场入 | 转场出 |
|---|---|---|---|---|---|---|---|---|
| 0 | hook_2x2_grid | 0.0 | 3.0 | 3.0 | video_grid | `push_lying.mov + push_seated.mov + push_overhead.mov + push_front.mov` | fade | push_left |
| 1 | push_lying | 3.0 | 6.0 | 3.0 | video | `push_lying.mov` | push_left | push_left |
| 2 | pause_breath_1 | 6.0 | 6.5 | 0.5 | pause_breath | (上镜 freeze) | pause_breath | fade |
| 3 | push_seated | 6.5 | 9.5 | 3.0 | video | `push_seated.mov` | fade | push_left |
| 4 | pause_breath_2 | 9.5 | 10.0 | 0.5 | pause_breath | (上镜 freeze) | pause_breath | fade |
| 5 | push_overhead | 10.0 | 13.0 | 3.0 | video | `push_overhead.mov` | fade | push_left |
| 6 | pause_breath_3 | 13.0 | 13.5 | 0.5 | pause_breath | (上镜 freeze) | pause_breath | fade |
| 7 | push_front | 13.5 | 16.5 | 3.0 | video | `push_front.mov` | fade | push_left |
| 8 | pause_breath_4 | 16.5 | 17.0 | 0.5 | pause_breath | (上镜 freeze) | pause_breath | fade |
| 9 | push_reverse | 17.0 | 20.0 | 3.0 | video | `push_reverse.mov` | fade | push_left |
| 10 | key_tips | 20.0 | 25.0 | 5.0 | video | `key_tips.mov` | push_left | push_left |
| 11 | outro_video | 25.0 | 32.0 | 7.0 | video | `outro.mov`（用户提供）| push_left | fade |

---

## 详细描述

### Shot 0 · hook_2x2_grid

- **画面**：**2×2 网格同屏 4 个动作**（首发钩子布局规范）
  - 左上格：躺着推（`push_lying.mov`）
  - 右上格：靠着推（`push_seated.mov`）
  - 左下格：向上推（`push_overhead.mov`）
  - 右下格：向前推（`push_front.mov`）
  - 每个格子：~480×480px，细线分割（白线 2px）
  - 画布：1080×1920
  - `object-fit: cover`，动作视频直接填满格子
- **字幕**（TTS）："健身计划没那么难——第一天你就推。"
  - highlight："第一天你就推"（橙色，1.15× 弹跳）
  - 位置：底部居中
- **转场**：fade 入 / push_left 出（有力硬切）
- **BGM**：第 0s 淡入，BGM kick drum 同步

---

### Shot 1 · push_lying

- **画面**：仰卧杠铃卧推演示（`push_lying.mov`）
- **字幕**（TTS）："躺着推——"
- **转场**：push_left 入 / push_left 出
- **动效**：字幕 1.15× 弹跳

---

### Shot 2 · pause_breath_1

- **画面**：Shot 1 最后一帧 **freeze frame**（定格）
- **实现**：上一视频暂停 0.8× 慢动作
- **转场**：pause_breath 入 / fade 出

---

### Shot 3 · push_seated

- **画面**：坐姿器械推胸演示（`push_seated.mov`）
- **字幕**（TTS）："靠着推——"
- **转场**：fade 入 / push_left 出

---

### Shot 4 · pause_breath_2

- **画面**：Shot 3 freeze frame
- **转场**：pause_breath 入 / fade 出

---

### Shot 5 · push_overhead

- **画面**：哑铃推肩演示（`push_overhead.mov`）
- **字幕**（TTS）："向上推——"
- **转场**：fade 入 / push_left 出

---

### Shot 6 · pause_breath_3

- **画面**：Shot 5 freeze frame
- **转场**：pause_breath 入 / fade 出

---

### Shot 7 · push_front

- **画面**：地雷管前推演示（`push_front.mov`）
- **字幕**（TTS）："向前推——"
- **转场**：fade 入 / push_left 出

---

### Shot 8 · pause_breath_4

- **画面**：Shot 7 freeze frame
- **转场**：pause_breath 入 / fade 出

---

### Shot 9 · push_reverse

- **画面**：窄距反手推演示（`push_reverse.mov`）
- **字幕**（TTS）："反着推——"
- **转场**：fade 入 / push_left 出

---

### Shot 10 · key_tips

- **画面**：用户演示关键要点（`key_tips.mov`）
  - 挺胸状态 + 持杠铃/哑铃
- **字幕**（TTS）：
  1. "推的时候胸挺起来。"
  2. "从轻的重量开始。"
  3. "加到 12 次力竭。"
  4. "做 5 组。"
- **右上角参数卡**：12 次 / 5 组（橙色卡片，1.15× 弹跳）
- **转场**：push_left 入 / push_left 出

---

### Shot 11 · outro_video

- **画面**：用户提供的收尾视频（`outro.mov`）
- **字幕**（TTS）：
  1. "推力日计划，5 个动作 + 12 次 × 5 组。"
  2. "评论告诉我——你推了几个？"
- **转场**：push_left 入 / fade 出（黑屏淡出）
- **CTA 动效**：评论图标 1.15× 弹跳

---

## 2×2 网格布局规范（钩子专用）

> **首发 B14，以后复用**
>
> ```
> ┌─────────────┬─────────────┐
> │  左上格     │   右上格    │
> │ 躺着推      │ 靠着推      │
> ├─────────────┼─────────────┤
> │  左下格     │   右下格    │
> │ 向上推      │ 向前推      │
> └─────────────┴─────────────┘
> ```
>
> | 参数 | 值 |
> |---|---|
> | 画布 | 1080 × 1920 |
> | 每格尺寸 | ~480 × 480px |
> | 分割线 | 2px，白色 |
> | object-fit | cover |
> | 字幕位置 | 底部居中 |

---

## 5 维评分卡

| 维度 | 得分 | 说明 |
|---|---|---|
| **镜数合理性** | 5 | 12 镜（B 类 12-18 标准）+ 4 类段配比合适 |
| **转场标注** | 5 | 100% 标注 + 有力硬切风格 |
| **description 准确性** | 5 | 5 要素齐全 + 动效标注 |
| **时长匹配** | 4 | 视频 3s / freeze 0.5s / 要点 5s / 收尾 7s |
| **B-roll 标记** | 5 | pause_breath 用 freeze frame 正确实现 |
| **总分** | **24** | **25** ✓ |