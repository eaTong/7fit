# BGM 规范（bgm.md）

> **Phase 6 产物**（**放最后**）：视频总时长确定后 → 按总时长设计 BGM。
>
> **必须遵循**：[timing-sync.md](timing-sync.md)（BGM 时长 ≥ 全文 + 3s fade out）+ [script.md 音视频分离](script.md#15--音频分离铁律video-muted--独立-audio)（`<video muted playsinline>` + 分离 `<audio>`）
>
> **BGM 哲学**：**BGM 是"情绪地基"**——不抢人声，烘托气氛。3 要素：**音量克制**（-8 ~ -12 dB）+ **风格匹配**（视频类型 → BGM 类型）+ **节奏匹配**（BPM 与动作同步）。

---

## 0 · v3 重点（2026-06-10）

1. **Per-topic 命名**：每个视频独立 BGM 文件 `resources/audios/bgm/<topic>.mp3`（不再用 `cyber_pulse.mp3` / `power_build.mp3` 等共享预设名）
2. **每次重新生成**：新视频必须调 `gen-bgm.js` 生成，不复用旧文件
3. **Section cue 情绪提示**：长视频按 `storyboard.md` 解析 sections，注入 prompt 让 BGM 在 section 边界自然起伏

---

## 1 · 为什么 BGM 放最后

**总时长是 Phase 6 之前才确定的**（= 钩子 + 主体 + 转场 + 收尾 + 5s buffer）。提前选 BGM 长度会错。

> 错误示范：先选了一个 60s 的 BGM，结果视频改到 75s，末尾 15s 没音乐。
>
> **A 类时长 ≥ 90s**（v3.4 升级）：A 类 BGM 至少 ≥ 全文 + 3s。例：A 类 110s → BGM ≥ 113s。

### 1.1 BGM 长度公式

```
BGM 长度 ≥ 视频总时长 + 3s（fade out 余量）
```

> 视频 60s → BGM 至少 63s。视频 75s → BGM 至少 78s。

---

## 2 · 4 类 BGM 选型（按情绪）

> **⚠️ BGM 类型的 A/B/C/D 不要与视频类型 A/B/C 混用**——详 [video-types.md](video-types.md) 速查。

| 类型 | 风格 | BPM | 调性 | 适用场景 |
|---|---|---|---|---|
| **A · Cyber Pulse** | synthwave | 100 | Am | 默认 / 产品演示 / 数据复盘 |
| **B · Power Build** | tech house | 105 | Dm | 训练演示 / PR / CTA |
| **C · Quiet Think** | ambient | 80 | C | 痛点 / 故事反思 / 个人 vlog |
| **D · Hop Pulse** | glitch hop | 110 | F | 步骤教程 / 拆解演示 |

### 2.1 默认搭配（视频类型 → BGM 类型）

| 视频类型 | 推荐 BGM | 理由 |
|---|---|---|
| **A · 个人人设** | **C · Quiet Think**（ambient, 80 BPM）| 衬托人声，不抢戏 |
| **B · 健身知识** | **B · Power Build**（tech house, 105 BPM）| 训练 + 演示的混合气质 |
| **C · 七练解码** | **A · Cyber Pulse 增强版**（synthwave, 100 BPM，创始人故事段可混用 **C · Quiet Think**）| 赛博解码 + 科技感 + 深度分析 |
| 混合类型 | 时长占比最大的类型 | 例：A 60% + B 40% → A 的 BGM |

> 视频类型判定见 [video-types.md §默认搭配](video-types.md#默认搭配视频类型--bgm-类型)。

### 2.2 4 类 BGM 详解

#### A · Cyber Pulse（synthwave, 100 BPM, Am）

- **情绪**：赛博解码 / 未来感 / 深度推进
- **元素**：合成器 + 鼓机 + 失真贝斯 + 琶音序列 + **模拟合成器主音**
- **典型场景**：C 类七练解码（深度分析/代码/HUD 展示）、数据飞入、赛博视觉效果
- **慎用**：人声多的视频（容易盖过人声）；纯口播段建议降 ducking
- **prompt 模板**：`"synthwave, 100 BPM, A minor, 75s, NO vocals, dark futuristic, heavy synth bass, arpeggiated sequences, cyberpunk atmosphere, sci-fi pulse"`
- **混合模式**：C 类视频可在"创始人视角"主题段切换为 C · Quiet Think（80 BPM），主体分析段用 Cyber Pulse 增强版，形成节奏对比

#### B · Power Build（tech house, 105 BPM, Dm）

- **情绪**：力量感 / 训练感 / 推进感
- **元素**：4/4 拍 + 失真贝斯 + 鼓机
- **典型场景**：B 类训练演示、PR、CTA
- **慎用**：安静反思类视频（破坏气氛）
- **prompt 模板**：`"tech house, 105 BPM, D minor, 75s, NO vocals, powerful build, gym training energy"`

#### C · Quiet Think（ambient, 80 BPM, C）

- **情绪**：安静 / 反思 / 陪伴
- **元素**：合成器 + 钢琴 + 极简鼓点
- **典型场景**：A 类人设视频、痛点开场、个人 vlog
- **慎用**：节奏紧凑的演示（太平）
- **prompt 模板**：`"ambient, 80 BPM, C major, 75s, NO vocals, minimal reflective, calm background"`

#### D · Hop Pulse（glitch hop, 110 BPM, F）

- **情绪**：节奏感 / 跳跃感 / 步骤感
- **元素**：碎拍鼓机 + glitch + 合成器
- **典型场景**：步骤教程、拆解演示
- **慎用**：B 类训练演示（不如 Power Build 稳）
- **prompt 模板**：`"glitch hop, 110 BPM, F major, 75s, NO vocals, broken beat, step-by-step energy"`

---

## 3 · 品牌契合（7fit 调性）

| 维度 | 7fit 调性 | BGM 选择 |
|---|---|---|
| **灵魂 why** | 理性深度 | 不要健身房嗨曲 |
| **钩子** | 轻盈不沉重 | 不要抒情 ballad |
| **同侪** | 中级用户陪伴 | 不要网红热曲 |

> **避免**：❌ 健身房嗨曲 / ❌ 抒情 ballad / ❌ 网红热曲

---

## 4 · BPM 规范

**BPM 控制在 75-115**，以**小调**为主（Am/Dm/F/Gm 优先）。

| BPM 范围 | 适用 | 感觉 |
|---|---|---|
| 75-85 | 安静、思考、痛点 | "慢下来看看自己" |
| 85-100 | 通用、平衡 | "边练边听" |
| 100-115 | 训练、CTA、节奏感 | "一起动起来" |

### 4.1 BPM 与动作演示同步

> **B 类视频**：动作演示的节奏感来源于 BGM 的 BPM。

| 动作类型 | 推荐 BPM | 原因 |
|---|---|---|
| **慢动作（拉伸）** | 75-85 | 慢 → 慢拉伸同步 |
| **中等节奏（力量训练）** | 100-110 | 力量 → 中等节奏 |
| **快动作（爆发力）** | 110-115 | 爆发力 → 快节奏 |

---

## 5 · 人声 vs BGM 音量

| 元素 | 音量 | dB | volume（0-1）|
|---|---|---|---|
| **旁白（人声）** | 主体 | 0 dB | 1.0 |
| **BGM（无旁白段）** | -8 dB | -8 dB | 10^(-8/20) ≈ 0.4 |
| **BGM（旁白段，ducking 后）** | -12 dB | -12 dB | 10^(-12/20) ≈ 0.25 |

### 5.1 Ducking 必做

旁白期间 BGM 降到 -12 dB，旁白结束升回 -8 dB：

```js
// 旁白开始 → BGM 降
tl.to(bgmEl, { volume: 0.25, duration: 0.5, ease: 'power2.out' }, 'voiceover-start')
// 旁白结束 → BGM 升
tl.to(bgmEl, { volume: 0.4, duration: 0.5, ease: 'power2.in' }, 'voiceover-end')
```

> Web Audio 音量范围是 0-1，所以 -8 dB = 10^(-8/20) ≈ 0.4，-12 dB ≈ 0.25。

### 5.2 Ducking 自动化 SOP

```
1. 解析旁白时间表（**v3.5 改**：[regenerate-subtitles.js](../../remotion/tools/regenerate-subtitles.js) 生成的 `subtitles.json` —— 理论时间戳，3.4 字/秒中速；不再走 mmx ASR）
2. 为每条旁白创建 duck 事件
3. 旁白前 0.3s 降 → 旁白结束 + 0.3s 升
4. 段间停顿（无旁白）保持 -8 dB
5. 收尾段（最后 1-2s）做最终 fade out
```

---

## 6 · 淡入淡出

| 阶段 | 时长 | 实现 |
|---|---|---|
| **视频第 0s** | fade in 1-2s | `tl.fromTo(bgmEl, {volume: 0}, {volume: 0.4, duration: 1.5}, 0)` |
| **视频末 2-3s** | fade out | `tl.to(bgmEl, {volume: 0, duration: 2.5}, VIDEO_DURATION - 2.5)` |

### 6.1 淡入淡出边界情况

| 场景 | 处理 |
|---|---|
| 视频 < 30s | fade in 0.8s + fade out 1.5s（缩短）|
| 视频 30-60s | fade in 1.5s + fade out 2.5s（默认）|
| 视频 60-90s | fade in 1.5s + fade out 3s（默认+延长）|
| 视频 > 90s（A 类常见）| fade in 2s + fade out 3s（延长）|
| 段间停顿 | 不影响 BGM（继续播放）|

---

## 7 · 集成（Remotion `<Audio>` 组件 + volume 函数）

```tsx
import { Audio } from "remotion";

<Audio
  src={staticFile("bgm/<topic>.mp3")}
  volume={(f) => {
    // fade in：前 45 帧（1.5s）从 0 渐变到 0.4
    if (f < 45) return interpolate(f, [0, 45], [0, 0.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    // ducking：旁白期间降 volume
    if (f > 90 && f < 270) return 0.25;
    return 0.4;
  }}
/>
```

> **不要**在视频本身带音轨（`<OffthreadVideo muted>` + 分离 `<Audio>`，见 [script.md §15](script.md#15--音频分离铁律video-muted--独立-audio)）。

### 7.1 多音频元素规范

> **铁律**：BGM / voiceover / highlight / sfx 都是**独立 `<audio>` 元素**，track index 错开。

| 元素 | track_index | 默认 volume |
|---|---|---|
| **BGM** | 0 | 0.4（ducking 后 0.25）|
| **旁白** | 1 | 1.0 |
| **highlight SFX** | 2 | 0.6 |
| **transition SFX** | 3 | 0.5 |

---

## 8 · 来源优先级

> **mmx 是项目默认 AI 工具**。完整规范 + BGM 4 类 prompt 模板见 [tools/mmx.md §4](../../tools/mmx.md#4--音乐生成mmx-music-generate)。

1. **mmx 生成**（首选，可控）—— 详见 [tools/mmx.md §4](../../tools/mmx.md#4--音乐生成mmx-music-generate)
2. **用户提供**（版权清晰）
3. **第三方平台**：
   - [Epidemic Sound](https://www.epidemicsound.com/)（订阅制）
   - [Artlist](https://artlist.io/)（订阅制）
   - [YouTube Audio Library](https://www.youtube.com/audiolibrary)（免费，需注明来源）

### 8.1 mmx Prompt 模板

```bash
mmx music generate \
  --prompt "tech house, 105 BPM, D minor, 75s, NO vocals, powerful build, gym training energy" \
  --quiet --non-interactive \
  --out resources/audios/bgm/<topic>.mp3
```

> **必带参数**：
> - BPM（必须明确）
> - 调性（小调优先）
> - 时长 = 视频总时长 + 3s（自动由 `gen-bgm.js` 从 `copy.md` 读 预计时长 + 5s buffer 计算）
> - `NO vocals`（避免人声干扰旁白）
> - 风格关键词（synthwave / tech house / ambient / glitch hop）

> **Section cue 自动注入**：`gen-bgm.js` 自动从 `storyboard.md` 解析 sections（钩子/段 1/段 2/.../收尾），在 prompt 中追加 SECTION CUES 段落，指示 mmx 在每个 section 边界做情绪变化。

---

## 9 · 存放位置

```
resources/audios/bgm/         ← BGM（与旁白 .m4a 区分）
└── <topic>.mp3              ← 每个视频独立 BGM，per-topic 命名
```

例：
- `gym_machine_judge_b13.mp3`
- `winged_scapula_b3.mp3`
- `weekly_review.mp3`

> **旁白**（.m4a）放 `resources/audios/<主题>.m4a`，**不要**放 `bgm/`。

### 9.1 为什么不共享

v3 之前用 `cyber_pulse.mp3` 等共享预设名，3 个核心问题：

1. **时长不匹配**：共享 BGM 长度固定（~75s），视频改了总长度后 BGM 不够长
2. **风格不定制**：同一类型（Power Build）的不同视频应该有不同情绪细节，共享 BGM 是"一刀切"
3. **污染风险**：所有 video share 同一文件，并行剪辑/混剪时容易串流

**v3 per-topic 解决**：每次新视频用 `gen-bgm.js <topic>` 重新生成，文件名 = topic，长度 = 视频总时长 + 3s，风格关键词根据 sections 注入。

### 9.2 SFX 存放位置

```
resources/audios/sfx/         ← 音效（与 BGM 区分）
├── whoosh.mp3               # 转场
├── pop.mp3                  # highlight
├── click.mp3                # CTA
└── impact.mp3               # 数据冲击
```

---

## 10 · 选型决策树

```
视频类型？
├─ A 人设
│  └─ BGM = C · Quiet Think
├─ B 知识
│  └─ BGM = B · Power Build
├─ C 七练解码
│  └─ BGM = A · Cyber Pulse
├─ 混合类型
│  └─ 时长占比最大的类型对应的 BGM
└─ 步骤教程 / 拆解
   └─ BGM = D · Hop Pulse
       ↓
       node tools/gen-bgm.js <topic>   # 输出到 resources/audios/bgm/<topic>.mp3
```

---

## 11 · SFX 音效库

> **SFX（Sound Effects）= 短音效**（< 2s），用于转场 / highlight / CTA 强调。

### 11.1 4 类 SFX + 适用场景

| 类型 | 用途 | 时长 | 音量 | 应用位置 |
|---|---|---|---|---|
| **whoosh** | 转场 | 0.3-0.5s | 0.5 | push_left / slide_up / fade |
| **pop** | highlight | 0.2-0.3s | 0.6 | highlight segment 弹跳同步 |
| **click** | CTA | 0.2s | 0.5 | 收尾 CTA 入场 |
| **impact** | 数据冲击 | 0.4-0.6s | 0.7 | 数字滚动 / 重要数据展示 |

### 11.2 SFX 集成

```html
<audio id="sfx-pop" preload="auto">
  <source src="/<主题>/audios/sfx/pop.mp3" type="audio/mpeg">
</audio>
```

```tsx
// highlight segment 弹跳时同步播放 SFX
import { Audio } from "remotion";

// highlight segment 弹跳动效（Remotion spring）
const scale = interpolate(frame, [0, 7, 14], [1, 1.15, 1], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: Easing.out(Easing.back(1.7)),
});

// SFX 用 Audio 组件（播放一次）
<Audio src={staticFile("sfx/pop.mp3"} volume={0.6} />
// 在 highlight 入场时播放（用 Sequence 或 frame 触发）
```

### 11.3 SFX 选型决策表

| 场景 | SFX | 原因 |
|---|---|---|
| push_left 转场 | whoosh | 推感 |
| highlight 弹跳 | pop | 强调感 |
| CTA 大字幕入场 | click | 确认感 |
| 数字滚动结束 | impact | 重量感 |
| 段间停顿 | 不用 SFX | 留白更重要 |
| 收尾 fade out | 不用 SFX | 安静收尾 |

---

## 12 · Ducking 自动化

### 12.1 手动 Ducking（推荐）

```js
// 假设旁白从 3.5s 开始，5.97s 结束
tl.to(bgmEl, { volume: 0.25, duration: 0.5, ease: 'power2.out' }, 3.2)  // 旁白前 0.3s 降
tl.to(bgmEl, { volume: 0.4, duration: 0.5, ease: 'power2.in' }, 6.27)   // 旁白后 0.3s 升
```

### 12.2 自动 Ducking（多段旁白）

> 当视频有 ≥ 5 段旁白时，手动写 duck 事件很繁琐。用自动 ducking：

```js
// 解析旁白时间表
const voiceoverEvents = [
  { start: 3.5, end: 5.97 },
  { start: 6.0, end: 8.5 },
  { start: 9.0, end: 12.0 }
]

// 自动加 duck
voiceoverEvents.forEach(vo => {
  tl.to(bgmEl, { volume: 0.25, duration: 0.5, ease: 'power2.out' }, vo.start - 0.3)
    .to(bgmEl, { volume: 0.4, duration: 0.5, ease: 'power2.in' }, vo.end + 0.3)
})
```

### 12.3 Ducking 反模式

- ❌ 不做 ducking（旁白 + BGM 叠在一起乱）
- ❌ ducking 间隔 < 0.3s（听感突兀）
- ❌ ducking 后音量 > 0.4（盖过旁白）
- ❌ 段间停顿也 ducking（多余）
- ❌ BGM 在旁白期间 > -8 dB（盖人声）

---

## 13 · BGM 验收清单

> 渲染前必走。

- [ ] BGM 文件名 = `<topic>.mp3`（per-topic 命名，不是 `power_build.mp3` 等共享名）
- [ ] BGM 长度 ≥ 视频总时长 + 3s
- [ ] BPM 在 75-115 范围内
- [ ] 调性为小调（Am/Dm/F/Gm）
- [ ] **NO vocals**（无任何人声）
- [ ] BGM 类型与视频类型匹配（§2.1）
- [ ] 4 类 BGM 之一（A Cyber Pulse / B Power Build / C Quiet Think / D Hop Pulse）
- [ ] 音量在 -8 ~ -12 dB 范围
- [ ] Ducking 已加（每段旁白前 0.3s 降）
- [ ] 视频第 0s fade in 1.5s
- [ ] 视频末 2-3s fade out
- [ ] 视频本身带音轨？（必为 `<video muted playsinline>`，分离 `<audio>`）
- [ ] SFX（可选）已加并独立 `<audio>` 元素

---

## 14 · 6 维评分卡 + 评审 SOP

> **每维 ≥ 3 分才能进入用户审阅**，总分 ≥ 18/30（6 维 × 5 分，新增第 6 维"Per-topic 命名"）。

### 14.1 评分卡

| 维度 | 1 分（差）| 3 分（中）| 5 分（优）| 本稿得分 |
|---|---|---|---|---|
| **类型匹配** | 视频类型 ≠ BGM 类型 | 匹配默认搭配 | 匹配 + 混合类型按占比选 | — |
| **长度合规** | 长度 < 视频时长 | 长度 = 视频时长 | 长度 ≥ 视频时长 + 3s | — |
| **BPM 调性** | BPM > 115 / 大调 | BPM 75-115 + 小调 | BPM 75-115 + 小调 + 与动作同步 | — |
| **音量/Ducking** | BGM > 旁白 / 无 ducking | -8 ~ -12 dB + 全 ducking | -8 ~ -12 dB + 全 ducking + SFX 同步 | — |
| **集成规范** | 视频自带音轨 | muted video + 独立 audio | muted video + 独立 audio + 4 track 错开 | — |
| **Per-topic 命名** | 沿用 `power_build.mp3` 等共享名 | 输出 `<topic>.mp3` | 输出 `<topic>.mp3` + `.cues.json` 同步 | — |

### 14.2 评审 SOP

```
1. 跑 §13 BGM 验收清单
   ↓
2. 自评 6 维（≥ 18 分）
   ↓
3. Studio 加载全屏过 3 遍
   - 钩子段：fade in 自然？
   - 主体段：ducking 不抢人声？
   - 收尾段：fade out 干净？
   ↓
4. 用户审阅 → 通过 / 改稿
```

---

## 15 · 反模式

- ❌ 提前选 BGM 长度（视频改了 BGM 不够长 → 末尾静音）
- ❌ BGM 比旁白响（听不清人声）
- ❌ 不做 ducking（旁白 + BGM 叠在一起乱）
- ❌ 视频开头不 fade in（突然开始吓观众）
- ❌ 视频结尾不 fade out（突然结束很突兀）
- ❌ 用健身房嗨曲 / 抒情 ballad / 网红热曲（与 7fit 调性冲突）
- ❌ 用大调（Am/Dm/F/Gm 小调优先）
- ❌ BPM > 115 或 < 75（节奏感不对）
- ❌ 在视频本身带音轨（违反音视频分离原则）
- ❌ 旁白放 `bgm/` 目录（混在一起找不到）
- ❌ **BPM 与动作不同步**（B 类训练必用 100-115 BPM）
- ❌ **BPM > 120**（盖过旁白节奏感）
- ❌ **BGM 有 vocals**（必带 `NO vocals`）
- ❌ **BGM 长度 < 视频总时长**（末尾静音，违反 §1.1）
- ❌ **ducking 间隔 < 0.3s**（听感突兀）
- ❌ **段间停顿做 ducking**（多余，破坏留白）
- ❌ **跳过 5 维评分卡直接给用户**
- ❌ **用 `cyber_pulse.mp3` / `power_build.mp3` 等共享预设名输出 BGM**（必须 per-topic `<topic>.mp3`）
- ❌ **不同视频复用同一份 BGM 文件**（v3 强制 per-topic 生成）

---

## 附录 A · 速查索引

| 我想... | 看... |
|---|---|
| 选 BGM 类型 | [§2.1 默认搭配](#21-默认搭配视频类型--bgm-类型) |
| 选 BPM | [§4 BPM 规范](#4-bpm-规范) |
| 设音量 | [§5 人声 vs BGM 音量](#5-人声-vs-bgm-音量) |
| 加 ducking | [§12 Ducking 自动化](#12-ducking-自动化) |
| 加 SFX | [§11 SFX 音效库](#11-sfx-音效库) |
| 跑验收 | [§13 BGM 验收清单](#13-bgm-验收清单) |
| 跑 5 维评分 | [§14 6 维评分卡 + 评审 SOP](#14-6-维评分卡--评审-sop) |
| 写 mmx prompt | [§8.1 mmx Prompt 模板](#81-mmx-prompt-模板) |

---

## 附录 B · 变更日志

### v3（2026-06-10）— 框架层竖屏硬约束 + Per-topic BGM

- **新增 §0 v3 重点**：3 行摘要（per-topic 命名 / 每次重新生成 / section cue 提示）
- **§7 集成代码**：`<source src>` 改 `<topic>.mp3`
- **§8.1 mmx Prompt 模板**：`--out` 改 `<topic>.mp3` + 新增"时长自动计算"说明 + 新增"section cue 自动注入"说明
- **§9 存放位置**：整段改写为 per-topic 命名，附 3 个 example
- **§9.1 新增"为什么不共享"**：3 理由（时长/风格/污染）
- **§10 决策树**：叶子节点加 `gen-bgm.js <topic>` 命令
- **§13 验收清单**：从 12 项扩到 13 项（新增 per-topic 命名检查）
- **§14 评分卡**：新增第 6 维"Per-topic 命名"，总分 30/30，门槛 ≥ 18
- **§15 反模式**：从 17 条扩到 19 条（增共享命名 + 复用文件 2 条）
- **附录 B**：本 v3 变更日志

### v2（2026-06-09）— 深化拓展

- **新增 §1.1 BGM 长度公式**：BGM ≥ 视频时长 + 3s
- **新增 §2.2 4 类 BGM 详解**：每类含情绪/元素/场景/慎用/prompt 模板
- **新增 §4.1 BPM 与动作演示同步表**：3 类动作→BPM 映射
- **新增 §5.1 Ducking 必做**：volume 数值表（0-1 范围）
- **新增 §5.2 Ducking 自动化 SOP**：5 步流程
- **新增 §6.1 淡入淡出边界情况**：3 档视频时长 → 淡入淡出映射
- **新增 §7.1 多音频元素规范**：track_index 错开 4 类
- **新增 §8.1 mmx Prompt 模板**：必带 5 参数（BPM/调性/时长/NO vocals/风格）
- **新增 §9.1 SFX 存放位置**：4 类 SFX
- **新增 §10 选型决策树**：5 视频类型→BGM 速查
- **新增 §11 SFX 音效库**：4 类 SFX + 适用场景 + 集成代码
- **新增 §12 Ducking 自动化**：手动 + 自动 + 反模式
- **新增 §13 BGM 验收清单**：12 项渲染前必走
- **新增 §14 5 维评分卡 + 评审 SOP**：总分 ≥ 18 才能进用户审阅
- **新增附录 A 速查索引** + **附录 B 变更日志**
- **§15 反模式从 10 条扩到 17 条**
- **保留不变**：§1 为什么 BGM 放最后 + §2 4 类选型表 + §3 品牌契合 + §5 人声 vs BGM 音量表 + §6 淡入淡出 + §7 集成 + §8 来源优先级 + §9 存放位置

### v1（2026-06-08）— 初版

- 为什么 BGM 放最后 + 4 类选型 + 品牌契合 + BPM 规范 + 音量 + 淡入淡出 + 集成 + 来源 + 存放位置 + 反模式
- 由 winged_scapula_b3 实战沉淀
