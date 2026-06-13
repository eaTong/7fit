/**
 * Grid2x2 — 2×2 网格布局组件（共享）
 * 用于同屏展示 4 个视频或图片
 *
 * 布局：
 * ┌─────────┬─────────┐
 * │ top-left│top-right│
 * ├─────────┼─────────┤
 * │bottom-l │bottom-r │
 * └─────────┴─────────┘
 *
 * 使用方式：
 * <Grid2x2 sources={[src1, src2, src3, src4]} type="video" basePath="b14_push_day/videos" />
 */

import { AbsoluteFill, OffthreadVideo, Img } from "remotion";
import { staticFile } from "remotion";

interface Grid2x2Props {
  /** 4 个媒体源，按顺序：[top-left, top-right, bottom-left, bottom-right] */
  sources: [string, string, string, string];
  /** 媒体类型 */
  type?: "video" | "image";
  /** 基础路径（如 "b14_push_day/videos"），自动拼接 source */
  basePath?: string;
  cellSize?: number;
  gap?: number;
  showGridLines?: boolean;
}

const POSITIONS = ["top-left", "top-right", "bottom-left", "bottom-right"] as const;

export const Grid2x2: React.FC<Grid2x2Props> = ({
  sources,
  type = "video",
  basePath,
  cellSize = 480,
  gap = 8,
  showGridLines = true,
}) => {
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
      {showGridLines && (
        <svg style={{ position: "absolute", width: "100%", height: "100%", zIndex: 10 }}>
          <line x1={offsetX} y1={offsetY + cellSize} x2={offsetX + gridWidth} y2={offsetY + cellSize} stroke="white" strokeWidth={2} />
          <line x1={offsetX + cellSize} y1={offsetY} x2={offsetX + cellSize} y2={offsetY + gridHeight} stroke="white" strokeWidth={2} />
        </svg>
      )}
      {sources.map((source, i) => {
        const position = POSITIONS[i];
        const src = basePath ? `${basePath}/${source}` : source;
        return (
          <div key={i} style={{ position: "absolute", width: cellSize, height: cellSize, ...positions[position] }}>
            {type === "video" ? (
              <OffthreadVideo src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            )}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};