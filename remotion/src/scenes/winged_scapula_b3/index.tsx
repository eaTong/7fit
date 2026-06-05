/**
 * WingedScapulaB3 — 翼状肩胛自测 + 改善：4 个动作
 *
 * 视频时长：~74s（20 shot = 10 主镜头 + 10 段间 transition）
 * 实际旁白：68.07s（m4a 录音）
 *
 * Shot 数据来源：[storyboard.json](storyboard.json)
 * 关联分镜：[storyboard.md](storyboard.md)
 * 关联文案：[copy.md](../../../docs/copy/winged_scapula_b3.md)
 * 关联字幕：[subtitles.json](subtitles.json)
 *
 * 缺失素材（运行时会报错，需先跑 mmx 生成）：
 *   - 3 视频（#5 钩子对比 / #6 自测 1 / #7 自测 2）— 见 [mmx_prompts.md](../../../docs/copy/winged_scapula_b3.mmx_prompts.md) §1-3
 *   - 1 过渡图（#9 "4 个动作改善"）— 见 §4
 *   - 3 sfx（T1 whoosh / T2 sweep / T3 pop）— 见 §5-7
 *
 * 音频集成（[bgm.md §3](../../rules/bgm.md)）：
 *   - BGM fade in 0-1s / **-16dB** during voiceover / **-12dB** after voiceover / fade out last 2.5s
 *   - 段间停顿期间 BGM 升回 -12dB（解除 ducking）
 *   - 2026-06-05：用户反馈 BGM 盖过人声，从规范默认值 -12/-8dB 压到 -16/-12dB
 *
 * Shot 渲染关键修复（2026-06-05 黑屏 + 转场问题）：
 *   - 动态 `playbackRate = 视频时长 / shot 时长`——视频铺满 shot 不留黑底
 *     - 视频短于 shot（S03 5.875s→8.82s / S04 5.875s→8.53s / S10 5.875s→6.15s）→ 慢放
 *     - 视频长于 shot（S06 17.77s→7.35s / S07 26.5s→7.94s / S08 17s→7.35s / S09 26.77s→7.94s）→ 快进
 *   - S05 image 文件名：transition_card_4actions.png → transition_4actions.png
 *   - **2026-06-05 v2 转场：过滤 TR 黑屏 shot + 前镜撑到底**
 *     1. 过滤掉所有 `content_type === "transition"` 的黑屏 shot（不再渲染）
 *     2. 每个视频镜的 Sequence 末扩"到下一镜的距离 + 9 帧 crossfade"
 *     3. 效果：前一个视频撑过 TR 段间停顿位置（继续显示），直到下一镜 fade in 才退出
 *     4. 用户看到 2 个视频同时显示的 9 帧重叠 = 真正的 crossfade
 */

import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import storyboard from "./storyboard.json";
import { ActionDataCard } from "../../components/ActionDataCard";
import { CTAButton } from "../../components/CTAButton";

/* === 配置 === */
const FPS = 30;
const TRANSITION_FRAMES = 9; // 0.3s @ 30fps（shot 边界的转入/转出动效）
const COMPOSITION_FRAMES = 2232; // 74.4s × 30fps（storyboard 总时长）

/* === 资源根路径（必须在 public/winged_scapula_b3/ 下）=== */
const BASE = "winged_scapula_b3";

/* === 旁白时长（实测 m4a = 68.07s）=== */
const VOICEOVER_END_FRAME = Math.round(68.07 * FPS);

/* === 视频真实时长（实测 via ffprobe，2026-06-05）===
 * 用于动态计算 playbackRate——让视频时长 < shot 时长时慢放铺满，
 * 视频时长 > shot 时长时快进压缩。**修复 S03/S04/S10 视频比 shot 短导致的黑屏** */
const VIDEO_DURATIONS: Record<string, number> = {
  "001_hook_compare.mov": 5.875,
  "002_mirror_test.mov": 5.875,
  "003_wall_push.mov": 5.875,
  "004_wall_slide.mov": 17.767,
  "005_pushup_plus.mov": 26.5,
  "006_ytwl.mov": 17.0,
  "007_band_pull_apart.mov": 26.767,
};

/* === 资源路径 helper（全部带 BASE 前缀）=== */
const audio = (name: string) => `${BASE}/audios/${name}`;
const video = (name: string) => `${BASE}/videos/${name}`;
const image = (name: string) => `${BASE}/images/${name}`;

/* === Shot 类型定义 === */
interface Shot {
  shot_id: string;
  start: number;
  end: number;
  duration: number;
  content_type: string;
  content_source: string | null;
  voiceover: number[];
  description: string;
  transition_in: string;
  transition_out: string;
  code_component?: string;
  code_props?: Record<string, string>;
  sfx?: string;
}

/* === Shot 内容渲染器（不含转入/转出动画）=== */
const ShotContent: React.FC<{ shot: Shot }> = ({ shot }) => {
  // === 段间停顿 transition shot：纯黑屏 ===
  if (shot.content_type === "transition") {
    return (
      <AbsoluteFill style={{ background: "#0A0A0A" }} />
    );
  }

  // === Image 类（钩子背景 / 过渡卡）===
  if (shot.content_type === "image" || shot.content_type === "transition_card") {
    if (!shot.content_source) return <AbsoluteFill style={{ background: "#0A0A0A" }} />;
    return (
      <AbsoluteFill>
        <Img
          src={staticFile(image(shot.content_source))}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </AbsoluteFill>
    );
  }

  // === Video 类（含 video+code 子型）===
  if (shot.content_type.startsWith("video")) {
    if (!shot.content_source) {
      return <PlaceholderShot shotId={shot.shot_id} reason="video file missing" />;
    }
    // ✅ 核心修复：动态 playbackRate 让视频铺满整个 shot 时长
    // 视频 < shot → 慢放（playbackRate < 1），修复 S03/S04/S10 末段黑屏
    // 视频 > shot → 快进（playbackRate > 1），让 S06-S09 不超出 shot 范围
    const videoDur = VIDEO_DURATIONS[shot.content_source];
    const playbackRate = videoDur ? videoDur / shot.duration : 1;
    return (
      <AbsoluteFill>
        <OffthreadVideo
          src={staticFile(video(shot.content_source))}
          playbackRate={playbackRate}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        {/* video+code 子型：叠加代码组件 */}
        {shot.code_component === "ActionDataCard" && shot.code_props && (
          <ActionDataCard
            name={shot.code_props.name}
            reps={shot.code_props.reps}
            sets={shot.code_props.sets}
          />
        )}
      </AbsoluteFill>
    );
  }

  // === Code 类（CTA）===
  if (shot.content_type.startsWith("code")) {
    if (shot.code_component === "CTAButton" && shot.code_props) {
      return (
        <AbsoluteFill>
          {/* code+video 子型：背景视频 + CTA 卡（playbackRate 防止 0.275s 缺口黑屏） */}
          {shot.content_source && (
            <OffthreadVideo
              src={staticFile(video(shot.content_source))}
              playbackRate={
                VIDEO_DURATIONS[shot.content_source]
                  ? VIDEO_DURATIONS[shot.content_source] / shot.duration
                  : 1
              }
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}
          <CTAButton
            text={shot.code_props.text}
            subtext={shot.code_props.subtext}
          />
        </AbsoluteFill>
      );
    }
    return <AbsoluteFill style={{ background: "#0A0A0A" }} />;
  }

  return <AbsoluteFill style={{ background: "#0A0A0A" }} />;
};

/* === 占位（缺失素材时）=== */
const PlaceholderShot: React.FC<{ shotId: string; reason: string }> = ({
  shotId,
  reason,
}) => {
  return (
    <AbsoluteFill
      style={{
        background: "#1A0A0A",
        justifyContent: "center",
        alignItems: "center",
        color: "#FF4500",
        fontFamily: "-apple-system, sans-serif",
        fontSize: 24,
        textAlign: "center",
        padding: 40,
      }}
    >
      <div>
        <div style={{ fontSize: 36, fontWeight: 700, marginBottom: 12 }}>
          ⚠️ {shotId}
        </div>
        <div style={{ fontSize: 18, color: "#888888" }}>{reason}</div>
        <div style={{ fontSize: 14, color: "#666666", marginTop: 12 }}>
          跑 [mmx_prompts.md](../../../docs/copy/winged_scapula_b3.mmx_prompts.md) 生成
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* === Shot 包装（处理转入/转出动画 + sfx）=== */
const ShotRenderer: React.FC<{
  shot: Shot;
  isFirst?: boolean;       // 第一镜不 enter fade（保持首帧饱满）
  isLast?: boolean;        // 末镜不 exit fade（不渐出到黑）
  paddedDuration?: number; // Sequence 实际 duration（含 crossfade padding）
}> = ({ shot, isFirst = false, isLast = false, paddedDuration }) => {
  const frame = useCurrentFrame(); // local frame (in v4, relative to Sequence)
  const durationFrames = Math.round(shot.duration * FPS);
  // paddedDuration = 实际 Sequence 长度（含 crossfade padding），用于计算 exit fade 窗口
  const exitWindowEnd = paddedDuration ?? durationFrames;

  // 转入动画：opacity 0 → 1（首镜跳过）
  const enterOpacity = isFirst
    ? 1
    : interpolate(frame, [0, TRANSITION_FRAMES], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      });

  // 转出动画：opacity 1 → 0（末镜跳过）
  const exitOpacity = isLast
    ? 1
    : interpolate(
        frame,
        [exitWindowEnd - TRANSITION_FRAMES, exitWindowEnd],
        [1, 0],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.in(Easing.cubic),
        },
      );

  // 转入位移（slide-left/slide-up 类型：进入时位移）
  let enterTranslateX = 0;
  if (shot.transition_in === "slide-left" || shot.transition_out === "slide-left") {
    enterTranslateX = interpolate(frame, [0, TRANSITION_FRAMES], [50, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (shot.transition_in === "slide-up" || shot.transition_out === "slide-up") {
    enterTranslateX = 0;
  }

  // 转出位移
  let exitTranslateX = 0;
  if (shot.transition_out === "slide-left") {
    exitTranslateX = interpolate(
      frame,
      [exitWindowEnd - TRANSITION_FRAMES, exitWindowEnd],
      [0, -50],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      },
    );
  } else if (shot.transition_out === "slide-up") {
    exitTranslateX = interpolate(
      frame,
      [exitWindowEnd - TRANSITION_FRAMES, exitWindowEnd],
      [0, -50],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      },
    );
  }

  const opacity = Math.min(enterOpacity, exitOpacity);
  const translateX = enterTranslateX !== 0 ? enterTranslateX : exitTranslateX;

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `translateX(${translateX}px)`,
      }}
    >
      <ShotContent shot={shot} />
    </AbsoluteFill>
  );
};

/* === BGM + Ducking === */
const BGMWithDucking: React.FC = () => {
  // ✅ 2026-06-05 调整：用户反馈 BGM 盖过人声 → 压到更激进的 -16dB / -12dB
  // -16dB ≈ 0.158, -12dB ≈ 0.251
  const DUCK_VOL = 0.15;     // 旁白期间：约 -16dB（更安静，让位给口播）
  const NORMAL_VOL = 0.25;   // 无旁白：约 -12dB
  const FADE_OUT_FRAMES = 75; // 末 2.5s 渐出

  return (
    <Audio
      src={staticFile(audio("bgm/power_build.mp3"))}
      volume={(f) => {
        let v = NORMAL_VOL;
        if (f < 30) {
          // Fade in 0-1s
          v = NORMAL_VOL * (f / 30);
        } else if (f < VOICEOVER_END_FRAME) {
          // Voiceover 期间：ducking（-16dB）
          v = DUCK_VOL;
        } else {
          // Voiceover 结束后：解除 ducking（-12dB）
          v = NORMAL_VOL;
        }
        // 末 2.5s fade out（防止突止）
        const fadeOut = interpolate(
          f,
          [COMPOSITION_FRAMES - FADE_OUT_FRAMES, COMPOSITION_FRAMES],
          [1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
        return Math.max(0, v * fadeOut);
      }}
    />
  );
};

/* === SFX 组件（按 shot 时间戳）=== */
const SFXLayer: React.FC = () => {
  // 从 storyboard 提取所有 sfx，按 start 排序
  const sfxEvents = (storyboard as Shot[])
    .filter((s) => !!s.sfx)
    .map((s) => ({
      src: s.sfx as string,
      startFrame: Math.round(s.start * FPS),
    }))
    .sort((a, b) => a.startFrame - b.startFrame);

  return (
    <>
      {sfxEvents.map((evt, i) => (
        <Sequence key={i} from={evt.startFrame}>
          <Audio src={staticFile(audio(`sfx/${evt.src}`))} volume={0.8} />
        </Sequence>
      ))}
    </>
  );
};

/* === 主 Scene === */
export const WingedScapulaB3: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#0A0A0A" }}>
      {/* BGM with ducking */}
      <BGMWithDucking />

      {/* 旁白（m4a）*/}
      <Audio src={staticFile(audio("winged_scapula_b3.m4a"))} volume={1.0} />

      {/* 3 个 sfx（在指定时间播放）*/}
      <SFXLayer />

      {/* ✅ 2026-06-05 v2：彻底重写转场逻辑
          - **过滤掉所有 transition 黑屏 shot**（TR01-TR10），不渲染
          - 每个**视频镜的 Sequence 末扩"到下一镜的距离 + 9 帧 crossfade"**
          - 效果：前一个视频会"撑"到下一个视频 fade in 完才离开（中间的 TR 段间停顿位置继续显示前一个视频）
          - 用户看到：S02 全程 → S02 fade out + S03 fade in（9 帧重叠）→ S03 全程 */}
      {((storyboard as Shot[]).filter((s) => s.content_type !== "transition")).map(
        (shot, idx, arr) => {
          const isFirst = idx === 0;
          const isLast = idx === arr.length - 1;
          const startFrame = Math.round(shot.start * FPS);
          const durationFrames = Math.round(shot.duration * FPS);

          // 计算到下一个视频镜的距离（包含中间的 TR 段间停顿时长）
          // 让本镜 Sequence 延伸到下一镜 startFrame 后再 +9 帧 crossfade
          let exitExtend = 0;
          if (!isLast) {
            const nextShot = arr[idx + 1];
            const nextStartFrame = Math.round(nextShot.start * FPS);
            const myEndFrame = startFrame + durationFrames;
            // gap = TR 段间停顿时长，crossfade = TRANSITION_FRAMES
            const gapToNext = Math.max(0, nextStartFrame - myEndFrame);
            exitExtend = gapToNext + TRANSITION_FRAMES;
          }
          const paddedDuration = durationFrames + exitExtend;

          return (
            <Sequence
              key={shot.shot_id}
              from={startFrame}
              durationInFrames={paddedDuration}
            >
              <ShotRenderer
                shot={shot}
                isFirst={isFirst}
                isLast={isLast}
                paddedDuration={paddedDuration}
              />
            </Sequence>
          );
        },
      )}
    </AbsoluteFill>
  );
};
