# Remotion 调研总结与 7fit 项目应用建议
## 完整报告索引 + 关键决策

> **总结日期**：2026-06-14
> **调研范围**：Remotion v4 全部能力矩阵

---

## 📚 完整报告索引

| 文档 | 内容 |
|---|---|
| [01-remotion-animation-research.md](01-remotion-animation-research.md) | 核心动效系统 + 18 类能力完整分析 |
| [02-remotion-3d-analysis.md](02-remotion-3d-analysis.md) | Three.js + React Three Fiber 深度分析 |
| [03-remotion-cli-commands.md](03-remotion-cli-commands.md) | CLI 指令完整手册 |
| **本文件** | 总结 + 7fit 项目应用建议 |

---

## 🎯 关键发现

### 1. Remotion 的核心优势

| 能力 | 成熟度 | 7fit 适用性 |
|---|---|---|
| 帧精确动画（`interpolate`）| ⭐⭐⭐⭐⭐ | ✅ 直接使用 |
| 转场系统（TransitionSeries）| ⭐⭐⭐⭐ | ✅ 项目已有自定义，可升级 |
| 字幕/Captions | ⭐⭐⭐⭐ | ✅ 已有 `VoiceoverText`，可增强 |
| 音频可视化 | ⭐⭐⭐⭐ | ⚠️ **缺失**，需引入 |
| 3D 渲染 | ⭐⭐⭐ | 🟡 未来潜力，当前可暂缓 |
| Lottie | ⭐⭐⭐⭐ | 🟡 增强粒子效果 |
| Light Leaks | ⭐⭐⭐⭐ | 🟡 增强转场质感 |
| WebGL 特效 | ⭐⭐⭐ | 🟡 科技感特效 |

### 2. 项目已有能力 vs Remotion 原生能力

```
项目已有                                    Remotion 原生可补充
─────────────────────────────────────────────────────────────────
✅ 帧精确动画 (interpolate)              ✅ 完全一致，直接用
✅ 布局状态机 (LayoutTransitionEngine)   ✅ 可升级为 TransitionSeries
✅ 字幕层独立渲染 (SubtitleLayer)        ✅ 可增强为 TikTok 风格单词高亮
✅ 12 个 Auxiliary 组件                  ✅ 粒子/光漏/Lottie 可补充
❌ BGM Ducking                            ✅ Audio volume 回调实现
❌ 音频可视化 (BGM 驱动)                  ✅ @remotion/media-utils
❌ TransitionSeries                       ✅ @remotion/transitions
❌ Light Leaks 叠加                       ✅ @remotion/light-leaks
❌ Lottie 动画                            ✅ @remotion/lottie
❌ 打字机/文字动效                        ✅ typewriter + word highlight
❌ 3D 渲染                                ✅ @remotion/three
❌ 透明视频                               ✅ ProRes/WebM
```

---

## 🔴 高优先级行动项

### 行动 1：BGM Ducking 实现

**现状**：BGM 规范要求"旁白期间 BGM ≤ -12dB"，但组件完全没有实现。

**解决方案**：

```tsx
// 在 Scene 入口组件中添加
const frame = useCurrentFrame();
const { fps } = useVideoConfig();

// 旁白时间段（根据 subtitles.json 计算）
const VOICEOVER_START = 0;    // 帧
const VOICEOVER_END = 2970;   // 帧
const DUCKING_DURATION = 15;  // 帧（0.5s）

// Ducking 逻辑
const isVoiceover = frame >= VOICEOVER_START && frame <= VOICEOVER_END;
const bgmVolume = isVoiceover
  ? interpolate(frame, [VOICEOVER_START, VOICEOVER_START + DUCKING_DURATION], [0.8, 0.15])
  : interpolate(frame, [VOICEOVER_END, VOICEOVER_END + DUCKING_DURATION], [0.15, 0.8]);

// 使用
<Audio src={staticFile("bgm.mp3")} volume={bgmVolume} />
```

**价值**：✅ 立刻提升音频质量，符合 BGM 规范要求。

---

### 行动 2：音频可视化引入

**现状**：BGM 频谱驱动视觉元素（B 类健身视频的"节拍脉冲"）完全没有实现。

**解决方案**：

```tsx
// 在 B 类视频中添加节拍脉冲效果
import { useWindowedAudioData, visualizeAudio } from "@remotion/media-utils";

const BgmPulse: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { audioData, dataOffsetInSeconds } = useWindowedAudioData({
    src: staticFile("bgm.mp3"),
    frame, fps, windowInSeconds: 30,
  });

  if (!audioData) return null;

  const frequencies = visualizeAudio({ fps, frame, audioData, numberOfSamples: 128 });
  const bassIntensity = frequencies.slice(0, 16).reduce((sum, v) => sum + v, 0) / 16;

  // 低频脉冲环
  const scale = 1 + bassIntensity * 0.3;
  const opacity = Math.min(0.5, bassIntensity * 0.6);

  return (
    <div style={{
      position: "absolute",
      width: "100%", height: "100%",
      borderRadius: "50%",
      border: "3px solid #FF4500",
      transform: `scale(${scale})`,
      opacity,
    }} />
  );
};
```

**价值**：✅ B 类健身视频的核心差异化能力。

---

### 行动 3：TransitionSeries 重构

**现状**：当前 `LayoutTransitionEngine` 使用自定义 `transitionType` 字段，没有使用 `@remotion/transitions`。

**升级方案**：

```tsx
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade, slide } from "@remotion/transitions/slide";
import { LightLeak } from "@remotion/light-leaks";

<TransitionSeries>
  {shotSequence.map((shot, i) => (
    <>
      <TransitionSeries.Sequence key={shot.shotId} durationInFrames={shot.endFrame - shot.startFrame}>
        <ShotContent shotId={shot.shotId} />
      </TransitionSeries.Sequence>
      {i < shotSequence.length - 1 && (
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-left" })}
          timing={linearTiming({ durationInFrames: 15 })}
        />
      )}
      {i === Math.floor(shotSequence.length / 2) && (
        <TransitionSeries.Overlay durationInFrames={30}>
          <LightLeak seed={3} hueShift={30} />
        </TransitionSeries.Overlay>
      )}
    </>
  ))}
</TransitionSeries>
```

**价值**：✅ 支持更丰富的转场效果 + 光漏叠加。

---

## 🟡 中优先级行动项

| 行动 | 当前状态 | 引入方式 | 预估成本 |
|---|---|---|---|
| **Lottie 动画** | 无 | `@remotion/lottie` | 半天 |
| **Light Leaks** | 无 | `@remotion/light-leaks` | 2 小时 |
| **字幕单词高亮** | 基础字幕 | `@remotion/captions` | 4 小时 |
| **打字机效果** | 无 | typewriter 代码 | 2 小时 |
| **Glitch 特效** | 无 | `HtmlInCanvas` | 4 小时 |

---

## 🟢 低优先级（未来潜力）

| 能力 | 场景 | 引入成本 | 建议时间 |
|---|---|---|---|
| **3D 渲染** | B 类肌肉解剖 | 高 | 未来版本 |
| **地图航线** | 健身旅行 | 中 | 特定主题 |
| **透明视频** | 叠加外部视频 | 低 | 按需 |
| **动态时长** | 不同音频长度 | 中 | v2 考虑 |

---

## 📋 安装清单（按优先级）

```bash
cd /Users/eatong/7fit/remotion

# 🔴 高优先级
npx remotion add @remotion/media-utils     # 音频可视化（BGM Ducking 基础）
npx remotion add @remotion/transitions    # TransitionSeries

# 🟡 中优先级
npx remotion add @remotion/light-leaks     # 光漏叠加
npx remotion add @remotion/lottie          # Lottie 动画
npx remotion add @remotion/captions        # TikTok 字幕增强

# 🟢 未来
npx remotion add @remotion/three           # 3D 渲染
npm i maplibre-gl @turf/turf              # 地图
```

---

## 🎬 视频类型 × 能力矩阵

| 能力 | A 类（人设）| B 类（健身）| C 类（产品）|
|---|---|---|---|
| BGM Ducking | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 音频可视化 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| TransitionSeries | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 字幕增强 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Lottie | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Light Leaks | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| 3D 渲染 | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| 打字机 | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| Glitch | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |

---

## 📊 总结

**Remotion 能力边界清晰**：
- ✅ 强项：帧精确动画 + 字幕 + 转场 + 媒体处理
- ⚠️ 中等：3D（需额外工作）+ 音频可视化（需引入）
- ❌ 弱项：实时物理模拟、复杂骨骼动画

**7fit 项目当前缺口**：
1. 🔴 BGM Ducking（音频质量核心）
2. 🔴 音频可视化（B 类差异化）
3. 🟡 TransitionSeries 升级（转场增强）
4. 🟡 字幕单词高亮（阅读引导）

**建议路径**：
1. 短期（本周）：实现 BGM Ducking + 引入 `@remotion/transitions`
2. 中期（下次视频）：引入音频可视化 + Light Leaks
3. 长期（未来版本）：3D 渲染试点

---

*总结完毕。全部调研文档已保存至 `research/` 目录。*
