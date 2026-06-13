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
 */

import { AbsoluteFill, OffthreadVideo, Img } from "remotion";
import { staticFile } from "remotion";

interface Grid2x2Props {
  sources: [string, string, string, string];
  type?: "video" | "image";
  basePath?: string;
  showGridLines?: boolean;
}

const POSITIONS = ["top-left", "top-right", "bottom-left", "bottom-right"] as const;

// canvas 尺寸
const CANVAS_W = 1080;
const CANVAS_H = 1920;

// 每格尺寸：2*cellW = CANVAS_W, 2*cellH = CANVAS_H
const CELL_W = CANVAS_W / 2;  // 540
const CELL_H = CANVAS_H / 2;  // 960

const cellPositions: Record<string, { left: number; top: number }> = {
  "top-left":    { left: 0,          top: 0 },
  "top-right":   { left: CELL_W,     top: 0 },
  "bottom-left": { left: 0,          top: CELL_H },
  "bottom-right":{ left: CELL_W,     top: CELL_H },
};

export const Grid2x2: React.FC<Grid2x2Props> = ({
  sources,
  type = "video",
  basePath,
  showGridLines = true,
}) => {
  return (
    <AbsoluteFill>
      {/* 中间十字白缝 */}
      {showGridLines && (
        <svg style={{ position: "absolute", width: CANVAS_W, height: CANVAS_H, zIndex: 10, left: 0, top: 0 }}>
          <line x1={CELL_W} y1={0} x2={CELL_W} y2={CANVAS_H} stroke="white" strokeWidth={2} />
          <line x1={0} y1={CELL_H} x2={CANVAS_W} y2={CELL_H} stroke="white" strokeWidth={2} />
        </svg>
      )}

      {/* 4 个格子 */}
      {sources.map((source, i) => {
        const pos = cellPositions[POSITIONS[i]];
        const src = basePath ? `${basePath}/${source}` : source;
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
    </AbsoluteFill>
  );
};

/**
 * 视频填充：自动检测方向，填满格子
 *
 * 竖屏视频（9:16, 1080×1920）：宽度撑满，上下裁剪居中
 * 横屏视频（16:9, 1920×1080）：高度撑满，左右裁剪居中
 * 正方形视频：直接撑满
 */
const VideoFillCell: React.FC<{ src: string; cellW: number; cellH: number }> = ({ src, cellW, cellH }) => {
  const VIDEO_W = 1080;
  const VIDEO_H = 1920;

  if (VIDEO_W < VIDEO_H) {
    // 竖屏：宽度撑满，高度按比例放大溢出裁剪（上下居中）
    const scaledH = cellW * (VIDEO_H / VIDEO_W);
    const top = -(scaledH - cellH) / 2;
    return <OffthreadVideo src={src} style={{ position: "absolute", width: cellW, height: scaledH, left: 0, top }} />;
  }

  if (VIDEO_W > VIDEO_H) {
    // 横屏：高度撑满，宽度按比例放大溢出裁剪（左右居中）
    const scaledW = cellH * (VIDEO_W / VIDEO_H);
    const left = -(scaledW - cellW) / 2;
    return <OffthreadVideo src={src} style={{ position: "absolute", width: scaledW, height: cellH, left, top: 0 }} />;
  }

  // 正方形：直接撑满
  return <OffthreadVideo src={src} style={{ position: "absolute", width: "100%", height: "100%", left: 0, top: 0 }} />;
};