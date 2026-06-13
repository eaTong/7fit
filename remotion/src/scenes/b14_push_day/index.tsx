/**
 * B14 PushDay — 健身推力日计划
 *
 * 视频时长：32s（12 shots = 8 动作镜 + 4 freeze frame）
 * 画布：1080×1920 竖屏（9:16）
 * BGM：gym_beat_b14.mp3（120 BPM，prominent kick drum）
 *
 * 分镜来源：[storyboard.json](storyboard.json)
 * 关联文案：[copy.md](../../../docs/copy/b14_push_day.md)
 *
 * 转场风格：有力硬切（push_left / zoom / fade），禁用单纯 fade
 * 音频：TTS（无旁白）
 *
 * 2×2 网格钩子布局：
 * ┌─────────┬─────────┐
 * │ 躺着推   │ 靠着推  │
 * ├─────────┼─────────┤
 * │ 向上推   │ 向前推  │
 * └─────────┴─────────┘
 */

import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  staticFile,
} from "remotion";
import storyboard from "./storyboard.json";
import { VoiceoverText } from "../../components/VoiceoverText";
import { Grid2x2 } from "../../components/Grid2x2";
import { ShotRenderer } from "../../components/ShotRenderer";
import { BGMWithDucking } from "../../components/BGMWithDucking";
import type { Shot } from "../../types/shot";

/* === 配置 === */
const FPS = 30;
const TRANSITION_FRAMES = 9;

const BASE = "b14_push_day";

const video = (name: string) => `${BASE}/videos/${name}`;
const audio = (name: string) => `${BASE}/audios/${name}`;

/* === 视频真实时长（实测 via ffprobe）===
 * 用于动态计算 playbackRate——让视频铺满 shot 时长
 * 视频 < shot → 慢放（playbackRate < 1）
 * 视频 > shot → 快进（playbackRate > 1）*/
const VIDEO_DURATIONS: Record<string, number> = {
  "push_lying.mp4": 5.873,
  "push_seated.mp4": 6.231,
  "push_overhead.mp4": 5.687,
  "push_front.mp4": 13.747,
  "push_reverse.mp4": 6.771,
  "key_tips.mp4": 3.766,    // storyboard 5.0s → 0.753x 慢放
  "outro.mp4": 8.733,       // storyboard 7.0s → 1.247x 快进
};

/* === Shot 内容渲染器 === */
const ShotContent: React.FC<{ shot: Shot }> = ({ shot }) => {
  if (shot.content_type === "video_grid" && shot.grid_cells) {
    // [top-left, top-right, bottom-left, bottom-right]
    const sources: [string, string, string, string] = [
      shot.grid_cells.find(c => c.position === "top-left")?.source || "",
      shot.grid_cells.find(c => c.position === "top-right")?.source || "",
      shot.grid_cells.find(c => c.position === "bottom-left")?.source || "",
      shot.grid_cells.find(c => c.position === "bottom-right")?.source || "",
    ];
    return (
      <AbsoluteFill>
        <Grid2x2 sources={sources} type="video" basePath={`${BASE}/videos`} showGridLines={false} />
        {shot.voiceover && <VoiceoverText text={shot.voiceover} />}
      </AbsoluteFill>
    );
  }

  if (shot.content_type === "pause_breath") {
    const src = shot.content_source?.replace(" (freeze frame)", "").trim() || "";
    // freeze frame 使用 OffthreadVideo + playbackRate=0 定格在首帧
    return (
      <AbsoluteFill>
        <OffthreadVideo
          src={staticFile(video(src))}
          startFrom={0}
          playbackRate={0}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        {shot.voiceover && <VoiceoverText text={shot.voiceover} />}
      </AbsoluteFill>
    );
  }

  if (shot.content_type === "video" && shot.content_source) {
    const videoDur = VIDEO_DURATIONS[shot.content_source] || shot.duration;
    const playbackRate = videoDur / shot.duration;
    return (
      <AbsoluteFill>
        <OffthreadVideo
          src={staticFile(video(shot.content_source))}
          startFrom={0}
          playbackRate={playbackRate}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        {shot.voiceover && <VoiceoverText text={shot.voiceover} />}
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ background: "#0A0A0A", justifyContent: "center", alignItems: "center" }}>
      {shot.voiceover && <VoiceoverText text={shot.voiceover} fontSize={48} />}
    </AbsoluteFill>
  );
};

/* === 主 Scene === */
export const B14PushDay: React.FC<{
  bgmVolume?: number;
  enableFadeIn?: boolean;
  enableTransitions?: boolean;
}> = ({ bgmVolume = 0.25, enableFadeIn = true }) => {
  const shots = storyboard.shots as Shot[];

  // ✅ 统一转场逻辑：过滤 pause_breath shots，让视频镜 crossfade 衔接
  const videoShots = shots.filter((s) => s.content_type !== "pause_breath");

  // ✅ 实际总帧数：取最后一镜的 end（而非硬编码 32s）
  const compositionFrames = Math.round(shots[shots.length - 1].end * FPS);

  return (
    <AbsoluteFill style={{ background: "#0A0A0A" }}>
      <BGMWithDucking
        src={staticFile(audio("bgm/gym_beat_b14.mp3"))}
        compositionFrames={compositionFrames}
        normalVolume={bgmVolume}
        fadeInFrames={enableFadeIn ? 30 : 0}
      />
      {videoShots.map((shot, idx, arr) => {
        const isFirst = idx === 0;
        const isLast = idx === arr.length - 1;
        const startFrame = Math.round(shot.start * FPS);
        const durationFrames = Math.round(shot.duration * FPS);

        // ✅ 正确的 crossfade padding：填满 gap + 加 crossfade
        // exitExtend = gap 到下一镜的距离 + 固定 9 帧 crossfade
        // 这样 Sequence 时长严格等于"填满 gap + crossfade"，视频刚好播完
        let exitExtend = 0;
        if (!isLast) {
          const nextStartFrame = Math.round(arr[idx + 1].start * FPS);
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
            premountFor={1 * FPS}
          >
            <ShotRenderer
              transitionIn={shot.transition_in}
              transitionOut={shot.transition_out}
              isFirst={isFirst}
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