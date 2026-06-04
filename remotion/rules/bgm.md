# BGM 规范（remotion）

> 阶段：背景音乐（Background Music）
> 适用场景：所有需要 BGM 的视频/口播/产品演示
> 来源：七练品牌定位 + 用户硬约束
> 状态：✅ 生效
> 上下游：上游 = `copy.md`（确定视频情绪基调）+ `video-types.md`（类型 A/B/C 决定默认 BGM）；下游 = `script.md`（在 Composition 中集成）+ `subtitle.md`（与字幕时间线对齐）

---

## 1. BGM 与七练品牌的契合点

七练的定位决定了 BGM 必须**和品牌同频**——而不是套用健身赛道常见的"激情喊麦"模板。

### 1.1 品牌 DNA（来自 `resources/docs/`）

| 维度 | 七练的调性 | BGM 应该传达什么 |
|---|---|---|
| **灵魂 why** | "用产品思维去健身，用健身改造产品" | **理性、深度、可分析**——不是"来劲"是"想透" |
| **钩子 hook** | "让健身更简单" | **轻盈、流畅、不沉重**——降低门槛感 |
| **目标用户** | 练了半年以上、产生数据焦虑的中级爱好者 | **陪伴感、同侪感**——不是教练命令、不是网红表演 |
| **设计语言** | 暗色 + 霓虹橙红 + 科技感 + 力量感 | **电子、合成、稳定节拍**——视觉听感统一 |
| **创始人人格** | 2 年训练、踩过坑、产品经理 | **不张扬、说真话、有专业底气**——BGM 要"压得住" |

### 1.2 七练 BGM 的 3 个"绝对不"

1. **绝对不"健身房嗨曲"**——不要那种"动次打次"、EDM 嗨曲、Hip-hop 喊麦、BPM 130+ 的高能节奏
2. **绝对不"鸡汤抒情"**——不要钢琴抒情、纯人声哼唱、慢节奏 ballad
3. **绝对不"网红热曲"**——不用在抖音/小红书当红流行的爆款 BGM（同质化、不独特）

### 1.3 七练 BGM 的 3 个"必须有"

1. **必须有科技感**——合成器音色、电子元素、未来感
2. **必须有稳定节奏**——BPM 控制在 90-110，给人"思考中"而非"躁动中"的感觉
3. **必须有低频厚实**——力量感来源是 bass 和低频铺垫，不是高音

---

## 2. BGM 类型库（4 类情绪 × 4 个用途）

按"视频情绪"选 BGM 类型：

### 2.1 类型 A：Cyber Pulse（赛博脉冲）—— 默认/通用

| 维度 | 规格 |
|---|---|
| 流派 | Synthwave / Future Bass / Cyberpunk Electronic |
| BPM | 95-105 |
| 调性 | 小调（Am / Em / Dm） |
| 核心乐器 | Synth pad + 808 bass + 轻量电子鼓 + 偶尔 arp 旋律 |
| 情绪 | 冷静、专注、有未来感 |
| 适用 | 产品功能演示、数据展示、周报复盘、UI 演示 |
| 配画 | 与暗色背景 + 霓虹橙红元素 + 科技感数据完美契合 |

### 2.2 类型 B：Power Build（力量蓄势）—— 强调/CTA

| 维度 | 规格 |
|---|---|
| 流派 | Tech House / Industrial Bass / Dark Trap |
| BPM | 100-110（比 A 略快，更推力）|
| 调性 | 小调（强调紧张感） |
| 核心乐器 | 厚 808 + 失真 synth + 渐强鼓点 + drop 段 |
| 情绪 | 蓄力、爆发、不可阻挡 |
| 适用 | 训练动作演示、PR 突破、CTA 收尾、转化节点 |
| 配画 | 配合数字放大、橙色描边、动效节奏感 |

### 2.3 类型 C：Quiet Think（静思）—— 痛点/共鸣

| 维度 | 规格 |
|---|---|
| 流派 | Ambient Electronic / Lo-fi Tech / Downtempo |
| BPM | 75-90（最慢，给人"想事情"的感觉）|
| 调性 | 大调或中性（C / F / G）|
| 核心乐器 | 弱电子鼓 + 氛围 pad + 偶尔钢琴点 + 环境音 |
| 情绪 | 安静、内省、共鸣 |
| 适用 | 痛点开场、创始人故事、个人反思、慢节奏叙事 |
| 配画 | 配合半透明背景、字幕主导、画面留白多 |

### 2.4 类型 D：Hop Pulse（轻快推进）—— 步骤/教程

| 维度 | 规格 |
|---|---|
| 流派 | Glitch Hop / Future Funk / 轻 Tech House |
| BPM | 105-115（最快，但不至于"嗨"）|
| 调性 | 大调或中性 |
| 核心乐器 | 弹跳 bass + 轻合成器 + 跳跃鼓点 + 偶尔采样 |
| 情绪 | 推进、明快、有步骤感 |
| 适用 | 步骤教程、功能使用演示、操作流程 |
| 配画 | 配合画面切换、滑动转场、序列镜头 |

### 2.5 选型速查

| 视频类型 | 推荐 BGM 类型 |
|---|---|
| 产品功能介绍 | A (Cyber Pulse) |
| 训练动作演示 | B (Power Build) |
| 周报/数据复盘 | A (Cyber Pulse) |
| 痛点/创始人故事 | C (Quiet Think) |
| 步骤教程 | D (Hop Pulse) |
| CTA/收尾 | B (Power Build) → A (Cyber Pulse) 渐变 |
| 钩子（前 3 秒）| B 或 C 切到 A |
| 短视频（≤15s）| A 全程（保持简洁）|
| 长视频（≥30s）| A 为主 + C 中段插入 + B 收尾 |

---

## 3. 技术规格（与 `animation.md` 时序对齐）

### 3.1 时长

- **BGM 总时长 = 视频时长**（前后各留 0.5-1s 静音垫）
- BGM 中间**不要硬切**——保持连续（保证情绪连贯）
- 段落切换在 BGM 内部用 fade 处理（不能让用户听到"歌结束了"）

### 3.2 音量与人声（voiceover）的关系（基线）

| 元素 | 推荐音量（相对） | 说明 |
|---|---|---|
| 旁白/人声 | 0 dB（参考点）| 主体 |
| BGM（**旁白期间**）| **-12 dB**（即人声的 25%）| ducking 状态（见 3.4 节）|
| BGM（**无人声期间**）| **-8 dB**（即人声的 40%）| 主体时略高 |
| 音效（按钮音、转场音）| -18 dB ~ -15 dB | 装饰，不能抢戏 |

> 七练硬规则：**BGM 永远不能盖过人声**。这是 ducking 的设计目标。

### 3.3 入场与出场

- **入场**：BGM 在视频第 0s 开始，但前 1-2s 音量从 0 渐入到 -12 dB（fade in）
- **出场**：视频最后 2-3s 渐出（fade out）
- **段落切换**：用 0.3-0.5s 短 fade 切换情绪，不要硬切

### 3.4 ⚠️ ducking（闪避）规则

**当旁白进入时，BGM 自动从 -8 dB 降到 -12 dB**；**旁白结束后，BGM 升回 -8 dB**。

> ⚠️ **本节 3.4 是 3.2 的精确版**：3.2 给的是基线范围，3.4 给的是按时间窗的精确曲线。实现 ducking 时以 3.4 为准。

实现方式：
- 在 Remotion 中用 `interpolate` 手动写音量曲线
- 或在混音阶段用音频编辑工具（Audition、Logic）做 sidechain ducking

```tsx
// 示例：旁白期间的 BGM 音量
const voiceActive = (t) => t >= 0.5 && t < 12.0;  // 旁白时间窗
const bgmVolume = voiceActive
  ? 0.25  // 旁白时 -12 dB
  : 0.4;  // 无人声 -8 dB

<Audio src={staticFile("bgm_cyber_pulse.mp3")} volume={bgmVolume} />
```

---

## 4. BGM 的来源与生成

### 4.1 优先级

| 优先级 | 来源 | 适用 |
|---|---|---|
| 1（默认）| **mmx（minimax）生成** | 缺一不可时统一走这条路 |
| 2 | 用户提供 | 用户从第三方平台买的版权音乐 |
| 3 | 第三方平台购买 | Epidemic Sound / Artlist / Musicbed（商用授权）|
| 4 | Royalty-free 库 | Pixabay Music / Uppbeat / Bensound（需自验授权）|

### 4.2 mmx 生成 prompt 模板

使用 mmx 生成 BGM 时，按下面 4 个 prompt 模板之一：

**Cyber Pulse（默认）**
```
synthwave background music, 100 BPM, A minor, dark and futuristic,
steady pulse, 808 bass, ambient synth pad, no vocals, no lyrics,
30 seconds, loopable, suitable for product demo video
```

**Power Build**
```
tech house background music, 105 BPM, D minor, building energy,
808 bass, distorted synth lead, drop at 15s, no vocals, no lyrics,
20 seconds, suitable for action shots
```

**Quiet Think**
```
ambient electronic background music, 80 BPM, C major, calm and reflective,
soft pad, minimal percussion, no vocals, no lyrics,
20 seconds, loopable, suitable for personal story
```

**Hop Pulse**
```
glitch hop background music, 110 BPM, F major, upbeat and forward-moving,
bouncy bass, light synth melody, no vocals, no lyrics,
20 seconds, loopable, suitable for tutorial steps
```

### 4.3 输出位置

生成的 BGM 放在 `resources/audios/bgm/`：

```
resources/audios/
├── workout_intro.mp3          # 旁白音频（**用户自录**，不用 TTS）
├── weekly_review.mp3          # 旁白音频（**用户自录**，不用 TTS）
└── bgm/                       # 背景音乐（与旁白分开管理）
    ├── cyber_pulse_default.mp3
    ├── power_build_cta.mp3
    └── quiet_think_story.mp3
```

> BGM 与旁白**分开文件管理**，方便调音量、调时间、做混音。

### 4.4 时长处理

- 如果生成的 BGM 短于视频，用剪辑工具（Audition、ffmpeg）做无缝循环
- 如果 BGM 长于视频，淡出在最后
- **不允许"剪到 1/2 速度播放"**——会改变情绪调性

---

## 5. 与其他 rules 的协同

### 5.1 与 `subtitle.md` 协同

- 字幕入场用 `spring({ damping: 8, stiffness: 200, mass: 0.5 })`（弹跳）
- BGM 在旁白期间做 ducking（降到 -12 dB）
- 字幕动效 + BGM 节奏 = 整体"科技感 + 力量感"听感

### 5.2 与 `copy.md` 协同

- 文案类型决定 BGM 类型（参考第 2.5 节）
- 钩子（前 3 秒）通常配 Cyber Pulse 渐入或 Power Build 推力
- 收尾 CTA 配 Power Build → Cyber Pulse 渐变

### 5.3 与 `script.md` 协同

- 视觉元素（霓虹/数据/动效）的"力量感"由 BGM 的低频支撑
- 转场时 BGM 不要做硬切（用 0.3-0.5s 短 fade）
- 视频整体时长 = 旁白时长 + 0.5s 前后静音垫 + BGM 渐入渐出

### 5.4 与 `storyboard.md` 协同

- 每个分镜的 `description` 可以标注"配 BGM 情绪"（如 `[BGM: Quiet Think]`）
- 视频类分镜（> 5s）的 BGM 段落要支撑完整 5s+ 的情绪

---

## 6. 常见错误（红线）

### 6.1 ❌ 这些情况不要出现

- ❌ 健身房嗨曲（BPM 130+ EDM）
- ❌ 抒情钢琴 ballad
- ❌ 抖音/小红书当红流行 BGM
- ❌ 纯人声哼唱（即使好听）
- ❌ 中途突然变调/换歌（情绪断裂）
- ❌ BGM 盖过人声
- ❌ BGM 一直最大音量不变（没有 ducking）
- ❌ 用了版权不明的音乐（视频发布后被下架）

### 6.2 ❌ 选型错误示例

| 视频内容 | ❌ 错选 BGM | ✅ 应选 |
|---|---|---|
| 周报数据复盘 | 抒情钢琴 | Cyber Pulse |
| 训练 PR 突破 | Lo-fi 慢节拍 | Power Build |
| 创始人故事（反思）| Tech House 重拍 | Quiet Think |
| 步骤教程 | 抒情 ambient | Hop Pulse |
| 钩子（前 3 秒）| 长铺垫的 BGM | BGM 在第 0s 就推力 |

### 6.3 ❌ 混音错误示例

```
❌ 旁白 -3dB, BGM -3dB  （人声和 BGM 同样响，听不清）
❌ BGM 全程 -6dB  （ducking 没做）
❌ BGM 突然从 -12dB 跳到 -3dB  （爆音）
❌ 旁白结束后 BGM 没回升到 -8dB（应回升到 -8 dB，不是 -10 dB）
```

---

## 7. 在 Remotion 中的集成

### 7.1 基础结构

```tsx
import { Audio, AbsoluteFill, Sequence } from "remotion";
import { staticFile } from "remotion";

export const MyVideo = () => {
  return (
    <AbsoluteFill>
      {/* BGM 全程播放 */}
      <Audio src={staticFile("audios/bgm/cyber_pulse_default.mp3")} volume={0.3} />

      {/* 视觉内容 */}
      <Sequence from={0} durationInFrames={90}>
        <HookQuestion />
      </Sequence>
      <Sequence from={81} durationInFrames={120}>
        <ThreeSecRecord />
      </Sequence>
    </AbsoluteFill>
  );
};
```

### 7.2 进阶：动态音量（ducking）

```tsx
import { Audio, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export const VideoWithDucking = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // 旁白时间窗：0.5s - 12.0s
  const voiceActive = t >= 0.5 && t < 12.0;

  // ducking 曲线（用 lerp 软切换）
  const bgmVolume = voiceActive ? 0.25 : 0.4;

  // 视频末 2s fade out
  const videoDuration = 15;  // 总时长
  const fadeOut = interpolate(t, [videoDuration - 2, videoDuration], [1, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <AbsoluteFill>
      <Audio
        src={staticFile("audios/bgm/cyber_pulse_default.mp3")}
        volume={bgmVolume * fadeOut}
      />
      {/* 旁白 Audio 用同样的逻辑 */}
      <Audio
        src={staticFile("audios/workout_intro.mp3")}
        volume={fadeOut}
      />
    </AbsoluteFill>
  );
};
```

### 7.3 进阶：分段 BGM（不同情绪）

```tsx
import { Sequence, Audio } from "remotion";

<>
  {/* 0-3s: Power Build 推力（钩子）*/}
  <Sequence from={0} durationInFrames={3 * fps}>
    <Audio src={staticFile("audios/bgm/power_build_intro.mp3")} volume={0.35} />
  </Sequence>

  {/* 3-15s: Cyber Pulse 持续（主体）*/}
  <Sequence from={3 * fps} durationInFrames={12 * fps}>
    <Audio src={staticFile("audios/bgm/cyber_pulse_default.mp3")} volume={0.3} />
  </Sequence>

  {/* 15-20s: Power Build 收尾（CTA）*/}
  <Sequence from={15 * fps} durationInFrames={5 * fps}>
    <Audio src={staticFile("audios/bgm/power_build_cta.mp3")} volume={0.35} />
  </Sequence>
</>
```

> 分段 BGM 之间用 0.3-0.5s 短 fade 切换（在剪辑软件中预处理），不要在 Remotion 里硬切。

---

## 8. 速查清单（只列**本文件专属**项）

> **跨文件去重原则**：通用检查见 [checklist.md](remotion/rules/checklist.md)；本节只列**BGM 选型/混音**的专属项。

**选型阶段**

- [ ] 视频类型已确定（A/B/C，见 [video-types.md](remotion/rules/video-types.md)）
- [ ] BGM 类型匹配：功能演示 → Cyber Pulse / 训练演示 → Power Build / 故事反思 → Quiet Think / 步骤教程 → Hop Pulse（见第 2.5 节）
- [ ] BPM 在 75-115 范围内
- [ ] 调性以小调为主（Quiet Think / Hop Pulse 例外）
- [ ] 无人声、无歌词（除非特殊需求）
- [ ] 不属于"健身房嗨曲 / 抒情 ballad / 网红热曲"红线（见第 6 节）

**混音阶段**

- [ ] 旁白期间 BGM = -12 dB（ducking 状态，见第 3.2 / 3.4 节）
- [ ] 无人声期间 BGM = -8 dB
- [ ] 视频末 2-3s fade out
- [ ] 段落切换用 0.3-0.5s 短 fade，不用硬切
- [ ] 音量变化用 `lerp`/`interpolate`，不用阶跃

**版权阶段**

- [ ] 来源 = mmx 生成 / 第三方平台 / 用户提供（见第 4.1 节）
- [ ] 商业发布用途有明确授权
- [ ] 不用抖音/小红书当红流行 BGM（同质化 + 版权风险）
- [ ] 输出到 `resources/audios/bgm/` 统一管理

**Remotion 集成阶段**

- [ ] 使用 `<Audio>` 组件，不用 `<video>` + audio track
- [ ] ducking 用 `useCurrentFrame` + `interpolate` 动态音量（见第 7.2 节）
- [ ] 旁白和 BGM 一起 fade out
- [ ] 分段 BGM 已在剪辑软件中做过渡

**其他维度的自检**（不在本文件）：
- 综合自检 → [checklist.md](remotion/rules/checklist.md) 第 2 节（master）
