# 素材清单规范（assets.md）

> **触发条件**：每次生成脚本或分镜时，**必须**配套输出 `assets.md`。
>
> **实现 Scene 组件前必查**——只有 `assets.md` 的"已就位"列表中的素材才能 import。
>
> **素材哲学**：**素材先于脚本**——写脚本前先看 `resources/images/` 和 `resources/videos/` 里有什么可用的实拍/截图；不够的用 mmx 生成。**素材是视频质量的"地基"**，不是"后期补的"。

---

## 1 · 输出位置与结构

### 1.1 输出位置

`remotion/src/scenes/<主题>/assets.md` —— **source of truth，必须入库**（见 [checklist.md §F.7](checklist.md#f-实现准备-5-项)）。

### 1.2 清单分两节

| 节 | 含义 | 处理 |
|---|---|---|
| **§已就位** | 从 `resources/` 复制到 `public/<主题>/` | 可直接 import |
| **§缺失** | 还没素材，需写 mmx prompt 生成 | mmx 生成 / 用户自录（详见 [tools/mmx.md §3](../../tools/mmx.md#3--图片生成mmx-image-generate)）|

### 1.3 不进 assets.md

- ❌ **可代码实现的内容**（用 `interpolate` 数字滚动 / 数据可视化能做的）
- ❌ **代码文件**（`subtitles.json` / `storyboard.md` 不进 public/）
- ❌ **抽象图形**（简单色块、icon、emoji）

> 例：动作次数 / 重量 / RPE 等数据 → 用代码渲染（数字滚动 `interpolate`），**不**用图片。

### 1.4 §缺失 必须标优先级

> **铁律**：§缺失 每条标 P0 / P1 / P2，**P0 不做完不开工**。

| 优先级 | 含义 |
|---|---|
| **P0** | 必做（视频核心素材，缺了视频半成品）|
| **P1** | 重要（影响观感，缺了视频能用但糙）|
| **P2** | 可选（锦上添花，缺了不影响）|

---

## 2 · 自动复制流程

```bash
# 1. 创建视频专属素材目录
mkdir -p remotion/public/<主题>/{videos,images,audios/bgm,audios/sfx}

# 2. 复制并转码视频 → WebM VP9（浏览器兼容）
ffmpeg -y -i "resources/videos/卧推80KG_10.mov" \
  -vcodec libvpx-vp9 -crf 35 -b:v 0 \
  -pix_fmt yuv420p \
  -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2" \
  -deadline realtime \
  "remotion/public/<主题>/videos/卧推80KG_10.webm"

# 3. 复制图片
cp resources/images/翼状肩胛自测.png remotion/public/<主题>/images/

# 4. 复制 BGM
cp resources/audios/bgm/power_build.mp3 remotion/public/<主题>/audios/bgm/

# 5. 复制 SFX
cp resources/audios/sfx/whoosh.mp3 remotion/public/<主题>/audios/sfx/
```

> **铁律**：视频文件（.mov / .mp4）**必须转码为 WebM VP9** 再复制到 public/。Remotion 的 OffthreadVideo 在渲染时通过浏览器代理加载视频，MOV/MP4/H264 在 macOS Chrome 环境存在解码兼容性问题，**只有 VP9/WebM 可以稳定流式加载**。
>
> **不复制代码文件**：`subtitles.json` / `storyboard.md` 留在 scene 目录，不进 public/。

### 2.1 复制后自检

```bash
# 1. 数量核对（§已就位 列表条数 = 实际文件数）
ls remotion/public/<主题>/videos/ | wc -l

# 2. 命名核对（文件名与 storyboard.json `content_source` 完全一致）
# 见 §3 命名约定

# 3. 可访问性测试（启动 Studio 加载）
npm run dev
```

---

## 3 · 命名约定

| 文件类型 | 命名风格 | 示例 |
|---|---|---|
| 素材文件 | `<3 位数字>_<snake>.mov/png/mp3` | `001_hook_compare.mov` / `power_build.mp3` |
| 主题目录 | snake_case | `winged_scapula_b3` |
| BGM | `<风格>.mp3` | `power_build.mp3` / `cyber_pulse.mp3` |
| SFX | `<音效名>.mp3` | `whoosh.mp3` / `pop.mp3` |

> **3 位数字** = 拍摄/录制顺序（`001` 第一个，`002` 第二个...）。

### 3.1 推荐命名

| 用途 | 推荐 |
|---|---|
| 钩子素材 | `001_hook_compare.mov` / `001_hook_question.png` |
| 自测镜头 | `010_selftest_step1.mov` / `011_selftest_step2.mov` |
| 训练动作 | `020_action_wall_angel.mov` / `021_action_ytw.mov` |
| 数据图 | `100_hero.png` / `101_data_viz.png` |
| BGM | `power_build.mp3` / `cyber_pulse.mp3`（按风格）|
| SFX | `whoosh.mp3` / `pop.mp3`（按音效名）|

### 3.2 命名反模式

- ❌ 中文名（编码错位）`/Users/eatong/翼状肩.mov`
- ❌ 空格（URL 编码问题）`卧推 80KG.mov`
- ❌ 大写 + 数字混（不规范）`Video01.MOV`
- ❌ 无 3 位前缀（看不出顺序）`hook.mov`
- ❌ 命名与 storyboard.json `content_source` 不一致（import 失败）

---

## 4 · mmx Prompt 模板

> **mmx 是项目默认 AI 工具**。本文 §4 给出**业务级** prompt（针对 7fit 视频素材），完整规范 + 通用模板 + 实践经验见 [tools/mmx.md §3.3](../../tools/mmx.md#33-4-类-prompt-模板项目标准)。
>
> 4 个业务级 prompt 类型：
> - **4.1 data_viz**（数据图）—— 默认用 `interpolate` 代码渲染，mmx 图片仅作 fallback
> - **4.2 screen_recording**（用户录）—— **AI 不可替代**，必须用户自录
> - **4.3 动画元素**（合成动效）—— mmx 生成
> - **4.4 UI 截图** —— mmx 生成

### 4.1 data_viz（数据图）

```text
生成一张数据可视化图，竖屏 1080×1920。
主题：<描述>
要求：
- 暗色背景（#0A0A0A）
- 主色：#FF4500 烈焰橙 / #DC143C 电红
- 文字：纯白 #FFFFFF / 字号 ≥ 48px
- 强调数字用橙色加粗
- 几何 / 科技感 / 硬朗圆角
输出 PNG。
```

### 4.2 screen_recording（用户录）

```text
用户录屏素材：<描述>
- 屏幕分辨率：1080×1920（移动端）
- 录制软件：iPhone 屏幕录制 / macOS Screenshot
- 录制约 30s，包含 3 个交互步骤
- 输出 .mov / .mp4
```

> **铁律**：训练动作演示建议用户自拍（详 §5），mmx 生成的"假人健身"质量不稳定。

### 4.3 动画元素（合成）

```text
生成一个抽象动效元素，竖屏 1080×1920。
- 类型：粒子 / 几何 / 数据流
- 颜色：#FF4500 / #DC143C
- 时长：3-5s 循环
- 输出 .mov（H.264 编码）
```

### 4.4 UI 截图

```text
生成 7fit 小程序界面截图：
- 设备：iPhone 15 Pro
- 页面：<具体页面，如训练记录>
- 状态：<具体数据填充>
- 输出 PNG（1080×2400）
```

---

## 5 · 缺失的视频素材：用户自拍

> **训练动作演示建议用户自己拍摄** —— mmx 生成的"假人健身"质量不稳定（动作失真，用户一看就出戏）。

拍摄规范见 `shoot-checklist.md`（每个 scene 目录自带）。

### 5.1 用户自拍 vs mmx 生成 决策表

| 素材类型 | 用户自拍 | mmx 生成 |
|---|---|---|
| **训练动作演示** | ✅ 必用 | ❌ 不用 |
| **人脸 / 口播** | ✅ 必用 | ❌ 不用 |
| **自测动作** | ✅ 必用 | ❌ 不用 |
| **产品截图** | ❌ 不需 | ✅ 必用 |
| **数据图** | ❌ 不需 | ✅ 必用（4.1）|
| **抽象动效** | ❌ 不需 | ✅ 必用（4.3）|
| **空镜 / B-roll** | ⚠️ 优先自拍 | ⚠️ 兜底 |

---

## 6 · assets.md 模板

```markdown
# <主题> · 素材清单

> **更新日期**：YYYY-MM-DD
> **视频类型**：A / B / C
> **总素材数**：N（已就位 M / 缺失 K）

---

## §已就位（可立即 import）

### 视频
| 编号 | 文件名 | 路径 | 时长 | 用途 |
|---|---|---|---|---|
| 001 | 001_hook_compare.mov | `public/<主题>/videos/` | 3.2s | Shot 0 钩子 |
| 010 | 010_selftest_step1.mov | `public/<主题>/videos/` | 5.4s | Shot 1 自测 1 |

### 图片
| 编号 | 文件名 | 路径 | 尺寸 | 用途 |
|---|---|---|---|---|
| 100 | 100_hero.png | `public/<主题>/images/` | 1080×1920 | Shot 0 背景 |

### 音频
| 编号 | 文件名 | 路径 | 时长 | 用途 |
|---|---|---|---|---|
| B01 | power_build.mp3 | `public/<主题>/audios/bgm/` | 75s | BGM |
| S01 | whoosh.mp3 | `public/<主题>/audios/sfx/` | 0.4s | 转场音效 |

---

## §缺失（需生成 / 自拍）

### 待生成（mmx prompt）
| 编号 | 描述 | 优先级 | mmx prompt |
|---|---|---|---|
| 200 | 翼状肩胛示意图 | P0 | [data_viz §4.1 模板] |
| 201 | 4 动作对比卡片 | P0 | [data_viz §4.1 模板] |

### 待自拍（用户）
| 编号 | 描述 | 优先级 | 拍摄规范 |
|---|---|---|---|
| 020 | 靠墙天使动作演示 | P0 | shoot-checklist.md §3 |
| 021 | 俯身 Y-T-W 动作演示 | P0 | shoot-checklist.md §3 |

---

## §验收（实现 Scene 前必走）

- [ ] §已就位 所有素材文件存在 + 可访问
- [ ] §缺失 中 P0 项全部完成（或用户确认可省略）
- [ ] 素材命名与 storyboard.json `content_source` 完全一致
- [ ] 视频素材时长 ≥ shot 要求时长
- [ ] 训练动作素材是用户自拍（非 mmx 生成）
```

---

## 7 · 混合类型（主体 + 辅助）

混合类型视频（A→B / B→C / A→C）的 assets.md 要分两节：

```markdown
## §主体类型素材（A 类 · 占比 60%+）
- ...

## §辅助类型素材（B 类 · 占比 < 40%）
- ...
```

> 详见 [video-types.md §混合类型](video-types.md#混合类型进阶)。

---

## 8 · A/B/C 三类素材清单差异化

| 维度 | A 人设 | B 知识 | C 解码 |
|---|---|---|---|
| **视频素材占比** | 60% | **80%+** | 40%（含终端录屏 20%）|
| **图片素材占比** | 20% | 10% | 20% |
| **音频素材占比** | 20% | 10% | 15% |
| **核心素材** | 用户自拍口播 | 用户自拍动作演示 | 功能截图 + 代码素材 + 终端录屏 + HUD |
| **mmx 生成** | 数据图 / B-roll | 数据图 / 抽象动效 | **50%**（UI 截图 / 数据图 / 动效）|
| **code rendering** | — | — | **30%**（终端/HUD 由代码实时渲染）|
| **典型素材数** | 8-12 段 | 12-18 段 | 12-18 段 |

### 8.1 A 类素材清单骨架（v3 · 2026-06-10 双态重写 / v3.4 升级 ≥ 90s）

> **A 类核心 = 主口播视频双用**。**1 段 ≥ 90s 主口播视频同时支撑口播态（全屏）和辅助素材态（右下角圆头像）**——不可拆、不可剪断。
>
> **v3.4 变更**（2026-06-15）：A 类时长下限从 60s 提升到 90s（用户决策）。主口播视频时长同步提升。

```
视频素材（60%）
├── 001_talking_head.mp4  ← 【P0 必走】≥ 90s 主口播视频（贯穿全片，双用）
│   ├── 口播态 1：钩子（3s 切 1 段）
│   ├── 口播态 2：段 1 / 段 4（讲"为什么" + 反思）
│   ├── 辅助素材态 1：段 2 / 段 3 / 段 5（缩圆头像右下角）
│   └── 口播态 3：收尾（CTA）
│
├── 010_screen_recording_1.mp4  ← 【P1 重要】辅助素材 1（屏幕录制 / 工具操作）
├── 011_screen_recording_2.mp4  ← 【P1 重要】辅助素材 2（如有）
└── 020_broll_1.mov  ← 【P2 可选】B-roll 1（环境 / 抽象动效）

图片素材（20%）
├── 100_data_viz.png  ← 【P1 重要】数据图（HTML/CSS 渲染优先，mmx 备用）
├── 101_code_screenshot.png  ← 【P1 重要】代码截图（飘右上角）
└── 110_outro_cta.png  ← 【P2 可选】收尾背景图

音频素材（20%）
├── quiet_think.mp3  ← 【P0 必走】BGM（ambient, 80 BPM, C major）
└── pop.mp3  ← 【P2 可选】highlight SFX
```

#### 8.1.1 关键技术约束（A 类 v3）

| 约束 | 原因 |
|---|---|
| **001_talking_head.mp4 ≥ 90s 不剪断**（v3.4 升级）| 圆头像持续播放 = 嘴在动，**剪断就破坏"人设"** |
| **同一份视频双用**（口播态全屏 + 辅助素材态缩圆头像）| 不可剪断，**不可分两段**；分两段会导致圆头像"嘴不动" |
| **录屏/录视频用 `<video>` element + object-fit: cover + border-radius: 50%** | 实时抽帧，不能用第二张图（违反 [video-types.md §12.1](video-types.md#121-a-类专属反模式v3-新增--2026-06-10)）|
| **不拍"100_avatar.png"静态头像** | ❌ 旧版用照片做圆头像 → 观众立刻出戏 |
| **辅助素材命名 010-/011- 连续编号** | 后期按顺序调用，与分镜 `data-shot-id` 一一对应 |

#### 8.1.2 A 类拍摄顺序（与 B/C 不同）

```
Step 1：先写 copy.md 5 段文案（v2 锁版）
Step 2：录主口播视频 001_talking_head.mp4（≥ 90s，**按 5 段顺序录，不剪断**）
Step 3：录辅助素材 010-/011-（屏幕录制 / 工具操作，5-10s/段）
Step 4：录 B-roll 020-（按需）
Step 5：拍数据图 / 代码截图（HTML/CSS 渲染优先，mmx 备用）
Step 6：验收（主口播视频 ≥ 90s + 抽帧测试 + 同期声 + 连续性）
```

> **为什么 A 类顺序特别重要**：**圆头像依赖主口播视频的连续播放**。如果先录辅助素材再录主口播视频，辅助素材对应的口型/表情都对不上——后期改起来非常痛苦。完整规范见 [shoot-checklist.md §3.A](shoot-checklist.md#3a-a-类口播补充v3-新增--2026-06-10)。

### 8.2 B 类素材清单骨架

```
视频素材（80%+）
├── 001_hook_compare.mov（钩子对比）
├── 010_selftest_step1.mov（自测 1）
├── 011_selftest_step2.mov（自测 2）
├── 020_action_wall_angel.mov（动作 1）
├── 021_action_ytw.mov（动作 2）
├── 022_action_band.mov（动作 3）
└── 023_action_ytwl.mov（动作 4）

图片素材（10%）
└── 100_action_compare.png（动作对比卡）

音频素材（10%）
├── power_build.mp3（BGM）
└── pop.mp3（highlight SFX）
```

### 8.3 C 类素材清单骨架（七练解码）

```
视频素材（40%）
├── 001_hook_terminal.mov（钩子终端/HUD 录屏）
├── 010_code_demo.mov（代码素材/终端录屏）
├── 011_brain_mode.mov（功能截图/操作录屏）
├── 012_surgery.mov（功能拆解/操作视频）
└── 020_talking_head.mov（【可选】创始人口播）

图片素材（20%）
├── 100_feature_card_1.png（功能 1 截图）
├── 101_feature_card_2.png（功能 2 截图）
└── 102_data_viz.png（数据可视化图表）

音频素材（15%）
├── cyber_pulse_sci_fi.mp3（BGM · 赛博脉冲）
├── whoosh.mp3（转场）
└── glitch.mp3（glitch 音效）

代码渲染（30%）
├── HUD overlay（终端/HUD 界面用代码实时渲染）
└── 数据卡片（interpolate 数字滚动 + 图表）
```

---

## 9 · mmx Prompt 调优技巧 + 失败案例

### 9.1 Prompt 调优 5 原则

| # | 原则 | 错误示例 | 正确示例 |
|---|---|---|---|
| 1 | **明确尺寸** | "一张健身图" | "竖屏 1080×1920" |
| 2 | **指定配色** | "好看的颜色" | "#FF4500 / #DC143C / #FFFFFF" |
| 3 | **指定风格** | "科技感" | "粗描边、几何、霓虹、数据冲击、硬朗圆角" |
| 4 | **指定用途** | "动作演示图" | "B-roll 健身房空镜，远景 4 秒" |
| 5 | **加 `NO` 排除** | — | "NO text, NO watermark, NO people" |

### 9.2 失败案例 + 修法

| # | 失败 | 原因 | 修法 |
|---|---|---|---|
| 1 | "健身房图片" → 生成抽象卡通 | 没指定风格 | 加 "realistic photo, 1080×1920, dim lighting" |
| 2 | "训练动作" → 生成 6 根手指的怪人 | AI 生成人体不稳 | **改用用户自拍**（详 §5.1）|
| 3 | "数据图" → 白色背景 | 没指定背景 | 加 "dark background #0A0A0A" |
| 4 | "logo 截图" → 文字乱码 | AI 不会写字 | 用代码渲染文字（`interpolate` + `<Text>`）|
| 5 | "动作对比" → 4 张图但比例不一致 | 没指定尺寸 | 加 "1080×1920 严格" |

### 9.3 mmx 命令模板

```bash
# 图片生成
mmx image generate --prompt "..." --width 1920 --height 1080 \
  --prompt-optimizer --quiet --non-interactive \
  --out resources/images/<主题>/<file>.png

# BGM 生成
mmx music generate --prompt "tech house, 105 BPM, D minor, 75s, NO vocals" \
  --quiet --non-interactive \
  --out resources/audios/bgm/power_build.mp3
```

---

## 10 · 素材清单完整性自检 SOP

> 写完 assets.md 后必走。

```
1. §已就位 数量 = public/<主题>/ 实际文件数
   ↓
2. 命名核对（§已就位 文件名 = storyboard.json `content_source`）
   ↓
3. §缺失 P0 项全部完成（或用户确认可省略）
   ↓
4. 视频素材时长 ≥ shot 要求时长
   ↓
5. 训练动作素材是用户自拍（非 mmx 生成）
   ↓
6. 启动 Studio 加载 → 无 404 / 加载失败
   ↓
7. §验收 7 项全打勾
```

### 10.1 完整性自检清单

- [ ] §已就位 与实际文件数 1:1 对应
- [ ] §已就位 文件名与 storyboard.json `content_source` 完全一致
- [ ] §缺失 P0 项全部完成
- [ ] §缺失 P1 项有解决方案
- [ ] §缺失 P2 项标"可选"
- [ ] 视频素材时长 ≥ shot 要求时长
- [ ] 训练动作素材是用户自拍
- [ ] 混合类型（如果）分主体 + 辅助两节
- [ ] 命名符合 §3 命名约定
- [ ] BGM/SFX 在 bgm/sfx 独立目录

---

## 11 · 5 维评分卡 + 评审 SOP

> **每维 ≥ 3 分才能进入用户审阅**，总分 ≥ 18/25。

### 11.1 评分卡

| 维度 | 1 分（差）| 3 分（中）| 5 分（优）| 本稿得分 |
|---|---|---|---|---|
| **完整性** | §缺失 P0 > 3 项 / 无优先级 | §缺失 P0 ≤ 3 项 + 标优先级 | §缺失 P0 = 0 / P1/P2 有方案 | — |
| **命名规范** | 命名不一致 / 有中文 / 有空格 | 全 snake_case + 3 位前缀 | 全规范 + 与 storyboard.json 一致 | — |
| **类型匹配** | 训练动作 mmx 生成 | 训练动作用户自拍 + 数据 mmx | 100% 符合 §5.1 决策表 | — |
| **mmx prompt** | prompt 不带尺寸/配色 | 带尺寸 + 配色 | 带 5 原则（§9.1）| — |
| **验收完整** | 跳过 §验收 | §验收 5/7 打勾 | §验收 7/7 全打勾 | — |

### 11.2 评审 SOP

```
1. 跑 §10.1 完整性自检清单
   ↓
2. 跑 Studio 加载测试（无 404）
   ↓
3. 自评 5 维（≥ 18 分）
   ↓
4. 用户审阅 → 通过 / 改稿
```

---

## 12 · 反模式

- ❌ 跳过 assets.md 直接写 Scene 组件（可能引用不存在的素材）
- ❌ 可代码实现的内容写进 assets.md（数字滚动、数据图表）
- ❌ 代码文件（subtitles.json / storyboard.md）复制到 public/
- ❌ 训练动作用 mmx 生成的"假人健身"（质量不稳定）
- ❌ 素材命名与 storyboard.json `content_source` 不一致（import 失败）
- ❌ §缺失 不标优先级（用户不知道先做哪个）
- ❌ §缺失 P0 项没完成就开工（视频半成品）
- ❌ 用 mmx 生成图片代替实际数据可视化（数据用代码渲染更可控）
- ❌ 混合类型 assets.md 不分主体 / 辅助
- ❌ **§缺失 P0 > 3 项**（核心素材缺口太大）
- ❌ **mmx prompt 不带尺寸**（生成结果不可控）
- ❌ **mmx prompt 不带 `NO` 排除**（容易出乱码/水印/路人）
- ❌ **训练动作 mmx 生成**（动作失真，详 §5.1）
- ❌ **跳过完整性自检**（import 时 404）
- ❌ **跳过 5 维评分卡直接给用户**

---

## 附录 A · 速查索引

| 我想... | 看... |
|---|---|
| 写 assets.md | [§6 assets.md 模板](#6-assetsmd-模板) |
| 复制素材 | [§2 自动复制流程](#2-自动复制流程) |
| 命名素材 | [§3 命名约定](#3-命名约定) |
| 写 mmx prompt | [§4 mmx Prompt 模板](#4-mmx-prompt-模板) |
| 决定用户自拍 vs mmx | [§5.1 决策表](#51-用户自拍-vs-mmx-生成-决策表) |
| 按视频类型差异化 | [§8 A/B/C 三类素材清单差异化](#8-abc-三类素材清单差异化) |
| 调 mmx prompt | [§9 mmx Prompt 调优技巧](#9-mmx-prompt-调优技巧--失败案例) |
| 跑完整性自检 | [§10 素材清单完整性自检 SOP](#10-素材清单完整性自检-sop) |
| 跑 5 维评分 | [§11 5 维评分卡 + 评审 SOP](#11-5-维评分卡--评审-sop) |

---

## 附录 B · 变更日志

### v2（2026-06-09）— 深化拓展

- **新增 §1.4 §缺失 必标优先级**：P0/P1/P2 定义
- **新增 §2.1 复制后自检**：数量 / 命名 / 可访问性 3 步
- **新增 §3.2 命名反模式**：5 类常见错用
- **新增 §5.1 用户自拍 vs mmx 生成 决策表**：7 类素材→自拍/mmx 映射
- **新增 §8 A/B/C 三类素材清单差异化**：视频/图片/音频 3 维 + 3 类骨架
- **新增 §9 mmx Prompt 调优技巧 + 失败案例**：5 原则 + 5 失败 + 修法
- **新增 §10 素材清单完整性自检 SOP**：7 步流程 + 10 项清单
- **新增 §11 5 维评分卡 + 评审 SOP**：总分 ≥ 18 才能进用户审阅
- **新增附录 A 速查索引** + **附录 B 变更日志**
- **§12 反模式从 9 条扩到 15 条**
- **保留不变**：§1 输出位置与结构 + §2 自动复制流程 + §3 命名约定 + §4 mmx Prompt 模板 + §5 缺失视频素材 + §6 assets.md 模板 + §7 混合类型

### v1（2026-06-08）— 初版

- 输出位置 + 自动复制 + 命名约定 + mmx Prompt 模板 + 用户自拍 + assets.md 模板 + 混合类型 + 反模式
- 由 winged_scapula_b3 实战沉淀
