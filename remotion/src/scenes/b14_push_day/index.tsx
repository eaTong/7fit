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
 * 转场风格：有力硬切（push_left / zoom），禁用 fade
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
import { VoiceoverText } from "./components/VoiceoverText";

/* === 配置 === */
const FPS = 30;
const TRANSITION_FRAMES = 9;
const COMPOSITION_FRAMES = Math.round(32 * FPS);

const BASE = "b14_push_day";

const BGM_VOLUME_NORMAL = 0.25;
const FADE_IN_FRAMES = 30;
const FADE_OUT_FRAMES = 60;

const video = (name: string) => `${BASE}/videos/${name}`;
const audio = (name: string) => `${BASE}/audios/${name}`;

const VIDEO_DURATIONS: Record<string, number> = {
  "push_lying.mp4": 5.873,
  "push_seated.mp4": 6.231,
  "push_overhead.mp4": 5.687,
  "push_front.mp4": 13.747,
  "push_reverse.mp4": 6.771,
};

interface Shot {
  shot_id: string;
  start: number;
  end: number;
  duration: number;
  content_type: string;
  content_source: string | null;
  voiceover: string;
  description: string;
  transition_in: string;
  transition_out: string;
  grid_cells?: Array<{ position: string; source: string }>;
}

const Grid2x2: React.FC<{ cells: Array<{ position: string; source: string }> }> = ({ cells }) => {
  const cellSize = 480;
  const gap = 8;
  const gridWidth = cellSize * 2 + gap;
  const gridHeight = cellSize * 2 + gap;
  const offsetX = (1080 - gridWidth) / 2;
  const offsetY = (1920 - gridHeight) / 2 - 100;

  const positions: Record<string, React.CSSProperties> = {
    "top-left": { left: offsetX, top: offsetY },
    "top-right": { left: offsetX + cellSize + gap, top: offsetY },
    "bottom-left": { left: offsetX, top: offsetY + cellSize + gap },
    "bottom-right": { left: offsetX + cellSize + gap, top: offsetY + cellSize + gap },
  };

  return (
    <AbsoluteFill>
      <svg style={{ position: "absolute", width: "100%", height: "100%", zIndex: 10 }}>
        <line x1={offsetX} y1={offsetY + cellSize} x2={offsetX + gridWidth} y2={offsetY + cellSize} stroke="white" strokeWidth={2} />
        <line x1={offsetX + cellSize} y1={offsetY} x2={offsetX + cellSize} y2={offsetY + gridHeight} stroke="white" strokeWidth={2} />
      </svg>
      {cells.map((cell, i) => (
        <div key={i} style={{ position: "absolute", width: cellSize, height: cellSize, ...positions[cell.position] }}>
          <OffthreadVideo src={staticFile(video(cell.source))} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      ))}
    </AbsoluteFill>
  );
};

const ShotRenderer: React.FC<{ shot: Shot; index: number; isLast: boolean }> = ({ shot, index, isLast }) => {
  const frame = useCurrentFrame();
  const durationFrames = Math.round(shot.duration * FPS);

  const enterProgress = interpolate(frame, [0, TRANSITION_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const exitStart = durationFrames - TRANSITION_FRAMES;
  const exitProgress = isLast
    ? 1
    : interpolate(frame, [exitStart, durationFrames], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.in(Easing.cubic),
      });

  const opacity = Math.min(enterProgress, exitProgress);
  const pushX = frame < TRANSITION_FRAMES
    ? interpolate(frame, [0, TRANSITION_FRAMES], [50, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  if (shot.content_type === "video_grid" && shot.grid_cells) {
    return (
      <AbsoluteFill style={{ opacity, transform: `translateX(${pushX}px)` }}>
        <Grid2x2 cells={shot.grid_cells} />
        {shot.voiceover && <VoiceoverText text={shot.voiceover} />}
      </AbsoluteFill>
    );
  }

  if (shot.content_type === "pause_breath") {
    const src = shot.content_source?.replace(" (freeze frame)", "").trim() || "";
    return (
      <AbsoluteFill style={{ opacity }}>
        <Img src={staticFile(video(src))} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        {shot.voiceover && <VoiceoverText text={shot.voiceover} />}
      </AbsoluteFill>
    );
  }

  if (shot.content_type === "video" && shot.content_source) {
    const videoDur = VIDEO_DURATIONS[shot.content_source] || shot.duration;
    const playbackRate = videoDur / shot.duration;
    return (
      <AbsoluteFill style={{ opacity, transform: `translateX(${pushX}px)` }}>
        <OffthreadVideo src={staticFile(video(shot.content_source))} playbackRate={playbackRate} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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

const BGMWithDucking: React.FC = () => (
  <Audio
    src={staticFile(audio("bgm/gym_beat_b14.mp3"))}
    volume={(f) => {
      let v = BGM_VOLUME_NORMAL;
      if (f < FADE_IN_FRAMES) v = BGM_VOLUME_NORMAL * (f / FADE_IN_FRAMES);
      if (f > COMPOSITION_FRAMES - FADE_OUT_FRAMES) v = BGM_VOLUME_NORMAL * ((COMPOSITION_FRAMES - f) / FADE_OUT_FRAMES);
      return Math.max(0, v);
    }}
  />
);

export const B14PushDay: React.FC = () => {
  const shots = storyboard.shots as Shot[];

  return (
    <AbsoluteFill style={{ background: "#0A0A0A" }}>
      <BGMWithDucking />
      {shots.map((shot, idx) => {
        const startFrame = Math.round(shot.start * FPS);
        const durationFrames = Math.round(shot.duration * FPS);
        const isLast = idx === shots.length - 1;

        let paddedDuration = durationFrames;
        if (idx < shots.length - 1) {
          const nextStart = Math.round(shots[idx + 1].start * FPS);
          const myEnd = startFrame + durationFrames;
          const gap = Math.max(0, nextStart - myEnd);
          paddedDuration += gap + TRANSITION_FRAMES;
        }

        return (
          <Sequence key={shot.shot_id} from={startFrame} durationInFrames={paddedDuration} premountFor={1 * FPS}>
            <ShotRenderer shot={shot} index={idx} isLast={isLast} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
