# C-1 · 素材清单（Assets）

> **更新日期**：2026-06-15
> **视频类型**：C · 七练解码（身份反差 + 造轮子混合）
> **总素材数**：9（已就位 3 / 缺失 6）

---

## §已就位（可立即 import）

### 视频
| 编号 | 文件名 | 路径 | 时长 | 用途 |
|---|---|---|---|---|
| 001 | 000_hook_gym_pan.MOV | resources/videos/ | 10s | S0-S8 L0 背景健身视频 |
| 002 | a2_talking_head.MOV | resources/videos/ | ~60s | B版 S6 可选创始人口播 |

### 音频
| 编号 | 文件名 | 路径 | 用途 |
|---|---|---|---|
| S01 | whoosh.mp3 | resources/audios/sfx/ | 转场 SFX |
| S02 | pop.mp3 | resources/audios/sfx/ | highlight SFX |
| S03 | click.mp3 | resources/audios/sfx/ | CTA SFX |

---

## §缺失（需生成）

### 待自拍（用户）
| 编号 | 描述 | 优先级 | 用途 |
|---|---|---|---|
| 010 | 终端/代码录屏（录制终端打字或代码滚动画面 ~15s）| P0 | A/B 版 S0 钩子段素材 |

> **终端录屏建议**：
> - 打开终端/Terminal，执行简单的 git log 或 cat 命令
> - 录制 15s 左右的终端操作画面
> - 画面内容不重要，主要是"终端氛围"（绿色字符 + 光标闪烁）
> - macOS 自带的 QuickTime Player → 新建屏幕录制 → 选终端窗口录制

### 待生成（mmx prompt）
| 编号 | 描述 | 优先级 | mmx prompt |
|---|---|---|---|
| 100 | 背景 HUD 静态帧（7fit 风格数据面板）| P1 | "Dark futuristic HUD interface, 1080×1920 vertical, data panel with orange and green elements, no text, clean layout, cyberpunk but minimal" |
| 101 | 周报卡片（AI 训练周报样式）| P0 | "A weekly fitness report card, dark background #0A0A0A, orange accent #FF4500, showing 'Volume: +8%' and 'RPE climbing' warning, minimal UI design, 1080×1920" |
| 102 | BGM 文件 | P0 | mmx music generate → 见 §BGM |

### 待代码渲染
| 编号 | 描述 | 优先级 | 实现方式 |
|---|---|---|---|
| C01 | `Terminal` 组件 | P0 | React component + interpolate 打字效果 |
| C02 | `DecisionTree` 对比卡 | P0 | React component + spring 弹入 |
| C03 | `ConclusionLine` 金句组件 | P0 | React component + typewriter |
| C04 | `DataViz` 数字动画 30→3 | P0 | interpolate 数字滚动 |
| C05 | `HudOverlay` + 扫描线 | P1 | CSS background gradient |
| C06 | 转场效果（wipe/glitch/scan）| P1 | React component + clip-path |
| C07 | CTA 按钮（霓虹边框）| P0 | CSS + interpolate |

---

## §BGM 方案

### A版 BGM
```bash
mmx music generate \
  --prompt "synthwave, 100 BPM, A minor, 65s, NO vocals, dark futuristic, retro-futuristic pulse, steady driving beat" \
  --quiet --non-interactive \
  --out resources/audios/bgm/c01_pm_fitness_log_a.mp3
```

### B版 BGM
```bash
mmx music generate \
  --prompt "synthwave, 100 BPM, A minor, 80s, NO vocals, heavy synth bass, arpeggiated sequences, cyberpunk atmosphere, sci-fi pulse, analog synth leads" \
  --quiet --non-interactive \
  --out resources/audios/bgm/c01_pm_fitness_log_b.mp3
```

> **B版 BGM 增强点**（相对 A 版）：
> - 增加琶音序列（arpeggiated sequences）
> - 更浓郁的赛博氛围（cyberpunk atmosphere）
> - 模拟合成器主音（analog synth leads）—— 适合 B 版更长的推理段

---

## §SFX 时间表

| 位置 | SFX | 时长 | 音量 |
|---|---|---|---|
| 所有 wipe-h/wipe-v 转场 | `whoosh.mp3` | 0.3s | 0.5 |
| highlight 弹入（橙色高亮词）| `pop.mp3` | 0.2s | 0.6 |
| CTA 按钮/卡片 | `click.mp3` | 0.2s | 0.5 |
| B版 glitch 转场 | 可选生成 `glitch.mp3`（mmx）| 0.3s | 0.4 |

---

## §验收

- [ ] 健身背景视频已就位（000_hook_gym_pan.MOV）
- [ ] 终端录屏 010 已拍摄
- [ ] mmx 图片 100-102 已生成
- [ ] BGM 已生成（A/B 各一版）
- [ ] SFX 文件已复制到 public/
- [ ] 所有代码渲染组件实现中
