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
} from "remotion";
import storyboard from "./storyboard.json";
import { ActionDataCard } from "../../components/ActionDataCard";
import { CTAButton } from "../../components/CTAButton";
import { ShotRenderer } from "../../components/ShotRenderer";
import { BGMWithDucking } from "../../components/BGMWithDucking";

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

/* === Shot 类型定义（winged_scapula_b3 专用）===
 * 注意：此 Scene 的 voiceover 是 number[]（字幕时间戳数组），
 * 与共享 Shot 接口的 string | string[] 不同，故保留本地定义 */
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
    return <AbsoluteFill style={{ background: "#0A0A0A" }} />;
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
          <CTAButton text={shot.code_props.text} subtext={shot.code_props.subtext} />
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
}) => (
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
      <div style={{ fontSize: 36, fontWeight: 700, marginBottom: 12 }}>⚠️ {shotId}</div>
      <div style={{ fontSize: 18, color: "#888888" }}>{reason}</div>
      <div style={{ fontSize: 14, color: "#666666", marginTop: 12 }}>
        跑 [mmx_prompts.md](../../../docs/copy/winged_scapula_b3.mmx_prompts.md) 生成
      </div>
    </div>
  </AbsoluteFill>
);

/* === SFX 组件（按 shot 时间戳）=== */
const SFXLayer: React.FC = () => {
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
      <BGMWithDucking
        src={staticFile(audio("bgm/power_build.mp3"))}
        compositionFrames={COMPOSITION_FRAMES}
        voiceoverEndFrame={VOICEOVER_END_FRAME}
        normalVolume={0.25}
        duckVolume={0.15}
        fadeInFrames={30}
        fadeOutFrames={75}
      />

      {/* 旁白（m4a）*/}
      <Audio src={staticFile(audio("winged_scapula_b3.m4a"))} volume={1.0} />

      {/* 3 个 sfx（在指定时间播放）*/}
      <SFXLayer />

      {/* ✅ 2026-06-05 v2：过滤 transition shots + crossfade padding */}
      {(storyboard as Shot[])
        .filter((s) => s.content_type !== "transition")
        .map((shot, idx, arr) => {
          const isFirst = idx === 0;
          const isLast = idx === arr.length - 1;
          const startFrame = Math.round(shot.start * FPS);
          const durationFrames = Math.round(shot.duration * FPS);

          let exitExtend = 0;
          if (!isLast) {
            const nextShot = arr[idx + 1];
            const nextStartFrame = Math.round(nextShot.start * FPS);
            const myEndFrame = startFrame + durationFrames;
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
                transitionIn={shot.transition_in}
                transitionOut={shot.transition_out}
                isFirst={isFirst}
                isLast={isLast}
                paddedDuration={paddedDuration}
              >
                <ShotContent shot={shot} />
              </ShotRenderer>
            </Sequence>
          );
        })}
    </AbsoluteFill>
  );
};