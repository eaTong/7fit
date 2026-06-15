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
| 002 | a2_talking_head.MOV | resources/videos/ | ~60s | 备用口播素材 |

### 音频
| 编号 | 文件名 | 路径 | 时长 | 用途 |
|---|---|---|---|---|
| BGM-A | c01_pm_fitness_log_a.mp3 | resources/audios/bgm/ | 96s | A版 BGM |
| BGM-B | c01_pm_fitness_log_b.mp3 | resources/audios/bgm/ | 89s | B版 BGM |
| S01 | whoosh.mp3 | resources/audios/sfx/ | 0.3s | wipe-h/wipe-v 转场 |
| S02 | pop.mp3 | resources/audios/sfx/ | 0.2s | highlight 弹入 |
| S03 | click.mp3 | resources/audios/sfx/ | 0.1s | CTA 按钮 |
| S04 | glitch.mp3 | resources/audios/sfx/ | 0.3s | glitch+色差 转场（B版专用）|
| S05 | data-ping.mp3 | resources/audios/sfx/ | 0.4s | 段1皮质醇数据提示音 |

---

## §缺失（需生成）

### 待自拍（用户）—— 分段口播 v3.1

> **v3.1 升级**：从 1 段连续口播改为 8 段分段口播，每段对应一个文案主体段，方便保持表情+剪辑灵活。
> 详细分段方案见 [storyboard.md §自拍拍摄清单](storyboard.md#自拍拍摄清单)。

| 编号 | 文件名 | 时长 | 主题 | 表情/姿态 | 优先级 |
|---|---|---|---|---|---|
| 010 | ta0_hook_ta0.mp4 | 4s | 钩子 | 特写正面、凝练、眼神有力 | P0 |
| 011 | ta1_cortisol_ta1.mp4 | 12s | 皮质醇 | 特写凝重、回忆式、眉头微皱 | P0 |
| 012 | ta2_reflect_ta2.mp4 | 12s | 反思 | 半身+手比划、自问自答、点头/摇头 | P0 |
| 013 | ta3_pm_translate_ta3.mp4 | 10s | PM 翻译 | 半身推眼镜、手指比划"等价于" | P0 |
| 014 | ta4_mini_app_ta4.mp4 | 14s | 小程序 | 近景+手机道具、演示"说话"动作 | P0 |
| 015 | ta5_scenes_ta5.mp4 | 18s | 三场景 | 镜头微切、眼神左右看 3 次 | P0 |
| 016 | ta6_quote_ta6.mp4 | 10s | 金句 | 特写坚定、节奏加重、眼神有力 | P0 |
| 017 | ta7_cta_ta7.mp4 | 10s | CTA | 特写放松、微笑、引导手部动作 | P0 |
| 020 | 终端/代码录屏 ~15s | 15s | S0 钩子段背景素材 | 终端操作画面（绿字符+光标）| P1 |

> **拍摄建议**：
> - 设备：iPhone，1080p 30fps，**横屏或竖屏均可**（最终 `object-fit: cover` 裁剪 280×280）
> - 机位：水平视线，三脚架或书堆架稳
> - 录音：手机自带麦，嘴距 30-50cm，安静环境
> - 每段录 2-3 条，命名 `_take1` `_take2`，挑最佳
> - 终端录屏：macOS QuickTime → 新建屏幕录制 → 选终端窗口 → 录 15s

### 待生成（mmx prompt）
| 编号 | 描述 | 优先级 | mmx prompt |
|---|---|---|---|
| 100 | 背景 HUD 静态帧（7fit 风格数据面板）| P1 | "Dark futuristic HUD interface, 1080×1920 vertical, data panel with orange and green elements, no text, clean layout, cyberpunk but minimal" |
| 101 | 周报卡片（AI 训练周报样式）| P0 | "A weekly fitness report card, dark background #0A0A0A, orange accent #FF4500, showing 'Volume: +8%' and 'RPE climbing' warning, minimal UI design, 1080×1920" |
| 102 | BGM 文件 | P0 | mmx music generate → 见 §BGM |

### 待代码渲染（v3.2 升级：HUD 背景 + 周报卡改用代码实现）
| 编号 | 描述 | 优先级 | 实现方式 |
|---|---|---|---|
| C01 | `Terminal` 组件 | P0 | React component + interpolate 打字效果 |
| C02 | `DecisionTree` 对比卡 | P0 | React component + spring 弹入 |
| C03 | `ConclusionLine` 金句组件 | P0 | React component + typewriter |
| C04 | `DataViz` 数字动画 30→3 | P0 | interpolate 数字滚动 |
| C05 | `HudOverlay` + 扫描线 | P1 | CSS background gradient |
| C06 | 转场效果（wipe/glitch/scan）| P1 | React component + clip-path |
| C07 | CTA 按钮（霓虹边框）| P0 | CSS + interpolate |
| **C08** | **`HudBackground` 动态 HUD 背景** | P0 | React component + SVG path + 渐变 + 粒子（替代原 100 mmx 静态图）|
| **C09** | **`WeeklyReportCard` AI 周报卡** | P0 | React component + spring + 数据 mock（替代原 101 mmx 静态图）|
| C10 | `MiniAppScreenshot` 小程序截图占位 | P1 | React component 模拟截图 UI（如果用户没时间截真实图）|

> **v3.2 升级说明**：HUD 背景和周报卡改用代码实现，原因是：
> - mmx 生成图加载慢、风格难统一
> - C 类需要"赛博解码"质感，代码渲染更精准
> - 可定制（数据可调、颜色可改）
> - 与现有 HUD 网格、终端文字风格统一

---

## §BGM 方案

### A版 BGM（~93s 视频 + 3s fade = 96s）
```bash
mmx music generate \
  --prompt "synthwave, 100 BPM, A minor, 96s, NO vocals, dark futuristic, retro-futuristic pulse, steady driving beat, cyber coding atmosphere" \
  --quiet --non-interactive \
  --out resources/audios/bgm/c01_pm_fitness_log_a.mp3
```

### B版 BGM 精简版（~86s 视频 + 3s fade = 89s）
```bash
mmx music generate \
  --prompt "synthwave, 100 BPM, A minor, 89s, NO vocals, heavy synth bass, arpeggiated sequences, cyberpunk atmosphere, sci-fi pulse, analog synth leads" \
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
