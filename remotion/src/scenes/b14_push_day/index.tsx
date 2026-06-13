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

/* === 配置 === */
const FPS = 30;
const TRANSITION_FRAMES = 9; // 0.3s @ 30fps
const COMPOSITION_FRAMES = Math.round(32 * FPS); // 32s × 30fps

/* === 资源根路径 === */
const BASE = "b14_push_day";

/* === BGM 配置（120 BPM gym beat）=== */
const BGM_VOLUME_NORMAL = 0.25;   // 无旁白正常音量
const BGM_VOLUME_DUCK = 0.15;    // TTS 期间 ducking
const FADE_IN_FRAMES = 30;        // 首 1s fade in
const FADE_OUT_FRAMES = 60;       // 末 2s fade out

/* === 资源路径 helper === */
const video = (name: string) => `${BASE}/videos/${name}`;
const audio = (name: string) => `${BASE}/audios/${name}`;

/* === 视频时长映射（用于 playbackRate 计算）=== */
const VIDEO_DURATIONS: Record<string, number> = {
  "push_lying.mov": 3.0,
  "push_seated.mov": 3.0,
  "push_overhead.mov": 3.0,
  "push_front.mov": 3.0,
  "push_reverse.mov": 3.0,
};

/* === Storyboard Shot 类型 === */
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

/* === 2×2 网格钩子组件 === */
const Grid2x2: React.FC<{ cells: Array<{ position: string; source: string }> }> = ({ cells }) => {
  const cellSize = 480;
  const gap = 8;
  const gridWidth = cellSize * 2 + gap;
  const gridHeight = cellSize * 2 + gap;
  const offsetX = (1080 - gridWidth) / 2;
  const offsetY = (1920 - gridHeight) / 2 - 100; // 偏上，底部留字幕空间

  const positions: Record<string, React.CSSProperties> = {
    "top-left": { left: offsetX, top: offsetY },
    "top-right": { left: offsetX + cellSize + gap, top: offsetY },
    "bottom-left": { left: offsetX, top: offsetY + cellSize + gap },
    "bottom-right": { left: offsetX + cellSize + gap, top: offsetY + cellSize + gap },
  };

  return (
    <AbsoluteFill>
      {/* 网格线 */}
      <svg
        style={{ position: "absolute", width: "100%", height: "100%", zIndex: 10 }}
      >
        {/* 横线 */}
        <line x1={offsetX} y1={offsetY + cellSize} x2={offsetX + gridWidth} y2={offsetY + cellSize} stroke="white" strokeWidth={2} />
        {/* 竖线 */}
        <line x1={offsetX + cellSize} y1={offsetY} x2={offsetX + cellSize} y2={offsetY + gridHeight} stroke="white" strokeWidth={2} />
      </svg>

      {/* 4 个格子视频 */}
      {cells.map((cell, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: cellSize,
            height: cellSize,
            ...positions[cell.position],
          }}
        >
          <OffthreadVideo
            src={staticFile(video(cell.source))}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      ))}
    </AbsoluteFill>
  );
};

/* === Shot 渲染器 === */
const ShotRenderer: React.FC<{ shot: Shot; index: number; isLast: boolean }> = ({
  shot,
  index,
  isLast,
}) => {
  const frame = useCurrentFrame();
  const durationFrames = Math.round(shot.duration * FPS);
  const startFrame = Math.round(shot.start * FPS);

  // 转场动画：fade/push_left/zoom
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

  // push_left 位移
  const pushX = frame < TRANSITION_FRAMES
    ? interpolate(frame, [0, TRANSITION_FRAMES], [50, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  // 2×2 网格钩子
  if (shot.content_type === "video_grid" && shot.grid_cells) {
    return (
      <AbsoluteFill style={{ opacity, transform: `translateX(${pushX}px)` }}>
        <Grid2x2 cells={shot.grid_cells} />
      </AbsoluteFill>
    );
  }

  // freeze frame（段间停顿）
  if (shot.content_type === "pause_breath") {
    return (
      <AbsoluteFill style={{ opacity }}>
        <Img
          src={staticFile(video(shot.content_source?.replace(" (freeze frame)", "").trim() || "")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
    );
  }

  // 普通视频镜
  if (shot.content_type === "video" && shot.content_source) {
    const videoDur = VIDEO_DURATIONS[shot.content_source] || shot.duration;
    const playbackRate = videoDur / shot.duration;

    return (
      <AbsoluteFill style={{ opacity, transform: `translateX(${pushX}px)` }}>
        <OffthreadVideo
          src={staticFile(video(shot.content_source))}
          playbackRate={playbackRate}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
    );
  }

  // key_tips / outro（缺失素材占位）
  return (
    <AbsoluteFill
      style={{
        background: "#0A0A0A",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ color: "#FF4500", fontSize: 32, textAlign: "center" }}>
        ⚠️ {shot.content_type}
        <br />
        <span style={{ fontSize: 18, color: "#888" }}>
          {shot.content_source || "missing source"}
        </span>
      </div>
    </AbsoluteFill>
  );
};

/* === BGM + Ducking === */
const BGMWithDucking: React.FC = () => (
  <Audio
    src={staticFile(audio("bgm/gym_beat_b14.mp3"))}
    volume={(f) => {
      let v = BGM_VOLUME_NORMAL;
      // Fade in
      if (f < FADE_IN_FRAMES) {
        v = BGM_VOLUME_NORMAL * (f / FADE_IN_FRAMES);
      }
      // Fade out
      if (f > COMPOSITION_FRAMES - FADE_OUT_FRAMES) {
        v = BGM_VOLUME_NORMAL * ((COMPOSITION_FRAMES - f) / FADE_OUT_FRAMES);
      }
      return Math.max(0, v);
    }}
  />
);

/* === 主 Scene === */
export const B14PushDay: React.FC = () => {
  const shots = (storyboard.shots as Shot[]);

  return (
    <AbsoluteFill style={{ background: "#0A0A0A" }}>
      {/* BGM */}
      <BGMWithDucking />

      {/* Shots */}
      {shots.map((shot, idx) => {
        const startFrame = Math.round(shot.start * FPS);
        const durationFrames = Math.round(shot.duration * FPS);

        // 计算 exit 延伸（crossfade）
        let paddedDuration = durationFrames;
        if (idx < shots.length - 1) {
          const nextShot = shots[idx + 1];
          const nextStart = Math.round(nextShot.start * FPS);
          const myEnd = startFrame + durationFrames;
          const gap = Math.max(0, nextStart - myEnd);
          paddedDuration += gap + TRANSITION_FRAMES;
        }

        return (
          <Sequence key={shot.shot_id} from={startFrame} durationInFrames={paddedDuration}>
            <ShotRenderer shot={shot} index={idx} isLast={idx === shots.length - 1} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
