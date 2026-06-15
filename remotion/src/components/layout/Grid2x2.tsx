/**
 * Grid2x2 — 2×2 网格布局组件（共享）
 * 4 个格子无缝撑满整个 canvas（1080×1920）
 *
 * 布局：
 * ┌─────────┬─────────┐
 * │ top-left│top-right│
 * ├─────────┼─────────┤
 * │bottom-l │bottom-r │
 * └─────────┴─────────┘
 *
 * v2 支持 stagger 入场 + impulse 冲击
 */

import { AbsoluteFill, OffthreadVideo, Img, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { staticFile } from "remotion";

interface Grid2x2Props {
  sources: [string, string, string, string];
  type?: "video" | "image";
  basePath?: string;
  showGridLines?: boolean;
  /** 4 格交错入场间隔（帧） */
  staggerFrames?: number;
  /** 第几格最后 0.3s 做缩放冲击（0-3） */
  impulseIdx?: number;
  /** impulse 缩放幅度，默认 1.15 */
  impulseScale?: number;
  /** 整体入场延迟（帧） */
  delay?: number;
  /** 底层光晕颜色（解决首帧黑屏） */
  glowColor?: string;
  /** 底层背景图片（优先级高于 glowColor） */
  backgroundImage?: string;
}

const POSITIONS = ["top-left", "top-right", "bottom-left", "bottom-right"] as const;

const CANVAS_W = 1080;
const CANVAS_H = 1920;
const CELL_W = CANVAS_W / 2;
const CELL_H = CANVAS_H / 2;

const cellPositions: Record<string, { left: number; top: number }> = {
  "top-left":    { left: 0,      top: 0 },
  "top-right":   { left: CELL_W, top: 0 },
  "bottom-left": { left: 0,      top: CELL_H },
  "bottom-right":{ left: CELL_W, top: CELL_H },
};

export const Grid2x2: React.FC<Grid2x2Props> = ({
  sources,
  type = "video",
  basePath,
  showGridLines = true,
  staggerFrames = 0,
  impulseIdx = -1,
  impulseScale = 1.15,
  delay = 0,
  glowColor,
  backgroundImage,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      {/* 底层背景（图片优先，否则用光晕，解决首帧黑屏） */}
      {backgroundImage ? (
        <Img
          src={staticFile(backgroundImage)}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
          }}
        />
      ) : glowColor ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            background: `radial-gradient(circle at 50% 50%, ${glowColor}33 0%, transparent 70%)`,
            zIndex: 0,
          }}
        />
      ) : null}

      {/* 4 个格子 */}
      {sources.map((source, i) => {
        const pos = cellPositions[POSITIONS[i]];
        const src = basePath ? `${basePath}/${source}` : source;

        // 单格入场动画
        const enter = spring({
          frame: frame - delay - i * staggerFrames,
          fps,
          config: { damping: 8, stiffness: 200, mass: 0.5 },
        });
        const scale = interpolate(enter, [0, 1], [0.7, 1]);
        const opacity = interpolate(enter, [0, 1], [0, 1]);

        // impulse：第 i 格最后 0.3s 做一次冲击
        let impulseActive = 1;
        if (i === impulseIdx) {
          const impulseFrames = 9; // 0.3s @ 30fps
          const timeSinceEnter = frame - delay - i * staggerFrames - 30;
          if (timeSinceEnter > 0 && timeSinceEnter < impulseFrames) {
            // 在最后 0.3s 内做一次缩放冲击
            const impulseT = timeSinceEnter / impulseFrames;
            const s = Easing.out(Easing.cubic)(impulseT);
            impulseActive = 1 + (impulseScale - 1) * s;
          } else if (timeSinceEnter >= impulseFrames) {
            impulseActive = 1;
          }
        }

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: pos.left,
              top: pos.top,
              width: CELL_W,
              height: CELL_H,
              overflow: "hidden",
              transform: `scale(${scale * impulseActive})`,
              opacity,
            }}
          >
            {type === "video" ? (
              <VideoFillCell src={staticFile(src)} cellW={CELL_W} cellH={CELL_H} />
            ) : (
              <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            )}
          </div>
        );
      })}

      {/* 中间十字白缝（最后画，保证不透明覆盖格子边缘） */}
      {showGridLines && (
        <svg style={{ position: "absolute", width: CANVAS_W, height: CANVAS_H, zIndex: 10, left: 0, top: 0, pointerEvents: "none" }}>
          <line x1={CELL_W} y1={0} x2={CELL_W} y2={CANVAS_H} stroke="white" strokeWidth={2} />
          <line x1={0} y1={CELL_H} x2={CANVAS_W} y2={CELL_H} stroke="white" strokeWidth={2} />
        </svg>
      )}
    </AbsoluteFill>
  );
};

const VideoFillCell: React.FC<{ src: string; cellW: number; cellH: number }> = ({ src, cellW, cellH }) => {
  const VIDEO_W = 1080;
  const VIDEO_H = 1920;

  if (VIDEO_W < VIDEO_H) {
    const scaledH = cellW * (VIDEO_H / VIDEO_W);
    const top = -(scaledH - cellH) / 2;
    return <OffthreadVideo muted src={src} style={{ position: "absolute", width: cellW, height: scaledH, left: 0, top }} />;
  }

  if (VIDEO_W > VIDEO_H) {
    const scaledW = cellH * (VIDEO_W / VIDEO_H);
    const left = -(scaledW - cellW) / 2;
    return <OffthreadVideo muted src={src} style={{ position: "absolute", width: scaledW, height: cellH, left, top: 0 }} />;
  }

  return <OffthreadVideo muted src={src} style={{ position: "absolute", width: "100%", height: "100%", left: 0, top: 0 }} />;
};
