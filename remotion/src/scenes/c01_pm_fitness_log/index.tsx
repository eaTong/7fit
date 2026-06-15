/**
 * C-1 PM Fitness Log — 一个产品经理的健身自救（C 类 · 七练解码）
 *
 * 视频时长：90s（2700 帧 @ 30fps）
 * 画布：1080×1920 竖屏（9:16）
 * BGM：c01_pm_fitness_log_a.mp3（A 版）/ _b.mp3（B 版）
 * SFX：5 个（whoosh / pop / click / glitch / data-ping）ffmpeg 合成
 *
 * 文案：「练了 2 年，皮质醇过载，2 周睡不着...」（见 docs/copy/c01_pm_fitness_log.md）
 *
 * 结构（v3.1 口播分段）：
 * - 8 镜（S0-S7），每镜对应一段口播（TA0-TA7）
 * - 镜头内主体画面 + 右下角口播 280×280
 * - 转场：wipe-h / glitch+色差 / quick cut / fade
 *
 * 分镜来源：[storyboard.md](storyboard.md)
 * 文案来源：[docs/copy/c01_pm_fitness_log.md](../../../../docs/copy/c01_pm_fitness_log.md)
 * 字幕来源：[subtitles_a.json](subtitles_a.json) / [subtitles_b.json](subtitles_b.json)
 */

import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { C1Frame } from "./components/C1Frame";
import { HudBackground } from "./components/HudBackground";
import { WeeklyReportCard } from "./components/WeeklyReportCard";

/* === 配置 === */
const FPS = 30;
const DURATION = 90; // 秒
const TOTAL_FRAMES = DURATION * FPS; // 2700

const BASE = "c01_pm_fitness_log";

const video = (name: string) => `${BASE}/videos/${name}`;
const audio = (name: string) => `${BASE}/audios/${name}`;

/* === 口播分段映射（v3.1） === */
const TALKING_SEGMENTS = [
  { id: "ta0", file: video("ta0_hook.mp4"),         start: 0,    end: 4  * FPS },
  { id: "ta1", file: video("ta1_cortisol.mp4"),     start: 4  * FPS, end: 16 * FPS },
  { id: "ta2", file: video("ta2_reflect.mp4"),      start: 16 * FPS, end: 28 * FPS },
  { id: "ta3", file: video("ta3_pm_translate.mp4"), start: 28 * FPS, end: 38 * FPS },
  { id: "ta4", file: video("ta4_mini_app.mp4"),     start: 38 * FPS, end: 52 * FPS },
  { id: "ta5", file: video("ta5_scenes.mp4"),       start: 52 * FPS, end: 70 * FPS },
  { id: "ta6", file: video("ta6_quote.mp4"),        start: 70 * FPS, end: 80 * FPS },
  { id: "ta7", file: video("ta7_cta.mp4"),          start: 80 * FPS, end: 90 * FPS },
];

/* === 镜头配置 === */
const SHOTS = [
  {
    id: "s0",
    start: 0,
    end: 4 * FPS,
    transitionIn: "fadeIn",
    transitionOut: "wipe-h",
  },
  {
    id: "s1",
    start: 4 * FPS,
    end: 16 * FPS,
    transitionIn: "wipe-h",
    transitionOut: "wipe-h",
  },
  {
    id: "s2",
    start: 16 * FPS,
    end: 28 * FPS,
    transitionIn: "wipe-h",
    transitionOut: "wipe-h",
  },
  {
    id: "s3",
    start: 28 * FPS,
    end: 38 * FPS,
    transitionIn: "wipe-h",
    transitionOut: "glitch",
  },
  {
    id: "s4",
    start: 38 * FPS,
    end: 52 * FPS,
    transitionIn: "glitch",
    transitionOut: "wipe-h",
  },
  {
    id: "s5",
    start: 52 * FPS,
    end: 70 * FPS,
    transitionIn: "quick-cut",
    transitionOut: "fade",
  },
  {
    id: "s6",
    start: 70 * FPS,
    end: 80 * FPS,
    transitionIn: "fade",
    transitionOut: "wipe-h",
  },
  {
    id: "s7",
    start: 80 * FPS,
    end: 90 * FPS,
    transitionIn: "wipe-h",
    transitionOut: "fade",
  },
];

export interface C1Props {
  variant?: "a" | "b"; // A 版（健身角度）vs B 版（PM 角度）
}

/**
 * C-1 主入口组件
 */
export const C1PMFitnessLog: React.FC<C1Props> = ({ variant = "a" }) => {
  // BGM 文件名（A/B 切换）
  const bgmFile = audio(`bgm/${variant === "b" ? "c01_pm_fitness_log_b" : "c01_pm_fitness_log_a"}.mp3`);

  return (
    <AbsoluteFill style={{ background: "#0A0A0A" }}>
      {/* L0 背景层：HUD 网格 + 扫描线（贯穿全片）*/}
      <HudBackground intensity={0.8} />

      {/* L1 主体层：8 镜依次播放 */}
      {SHOTS.map((shot) => (
        <Sequence
          key={shot.id}
          from={shot.start}
          durationInFrames={shot.end - shot.start}
        >
          <C1Frame
            shotId={shot.id}
            shotIndex={SHOTS.indexOf(shot)}
            transitionIn={shot.transitionIn}
            transitionOut={shot.transitionOut}
            variant={variant}
          />
        </Sequence>
      ))}

      {/* L2 口播层：8 段口播，依次显示（右下角 280×280）*/}
      {TALKING_SEGMENTS.map((seg) => (
        <Sequence
          key={seg.id}
          from={seg.start}
          durationInFrames={seg.end - seg.start}
        >
          {/* 口播视频，object-fit: cover 裁剪 280×280 方形 */}
          <TalkingHeadWindow src={staticFile(seg.file)} />
        </Sequence>
      ))}

      {/* 收尾段叠加：周报卡展示（5b 三场景中的 AI 周报）*/}
      <Sequence
        from={64 * FPS}
        durationInFrames={6 * FPS}
      >
        <div
          style={{
            position: "absolute",
            top: 200,
            left: 180,
            width: 720,
            height: 480,
          }}
        >
          <WeeklyReportCard weekNumber={24} startFrame={0} />
        </div>
      </Sequence>

      {/* L3 音频层：BGM（自动 fade in/out）*/}
      <Audio
        src={staticFile(bgmFile)}
        volume={(f) => {
          // Fade in: 0-30 帧
          if (f < 30) return 0.25 * (f / 30);
          // Fade out: 末 90 帧
          if (f > TOTAL_FRAMES - 90) {
            return 0.25 * Math.max(0, (TOTAL_FRAMES - f) / 90);
          }
          return 0.25;
        }}
      />
    </AbsoluteFill>
  );
};

/* === 口播视频窗口（右下角 280×280 + 角标） === */
const TalkingHeadWindow: React.FC<{ src: string }> = ({ src }) => {
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          right: 32,
          bottom: 80,
          width: 280,
          height: 280,
          borderRadius: 12,
          overflow: "hidden",
          border: "2px solid #FF4500",
          boxShadow: "0 0 20px rgba(255, 69, 0, 0.4)",
        }}
      >
        <video
          src={src}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          autoPlay
          muted
          playsInline
        />
      </div>
    </AbsoluteFill>
  );
};

export default C1PMFitnessLog;
