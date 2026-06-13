/**
 * GitLogDisplay — Git Log 滚动展示组件（共享）
 *
 * 功能：
 * - 显示多条 git log entry
 * - 垂直滚动，中间行高亮（始终可见 + 视觉强调）
 * - 半透明科技感背景 + 霓虹橙色边框
 */

import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

export interface GitLogEntry {
  hash: string;     // 7位短 hash
  author: string;
  date: string;
  message: string;
}

interface GitLogDisplayProps {
  entries: GitLogEntry[];
  fontSize?: number;
  visibleCount?: number;   // 可见行数，默认 15
  scrollSpeed?: number;     // 每秒滚动行数，默认 1
  highlightColor?: string;  // 高亮色，默认 #FF4500
  style?: React.CSSProperties;
}

export const GitLogDisplay: React.FC<GitLogDisplayProps> = ({
  entries,
  fontSize = 28,
  visibleCount = 15,
  scrollSpeed = 1,
  highlightColor = "#FF4500",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!entries.length) return null;

  // 当前滚动到的 index（居中行）
  const currentIndex = Math.floor((frame * scrollSpeed / fps) % entries.length);
  const halfVisible = Math.floor(visibleCount / 2);

  // 显示的 entry 范围
  const startIndex = Math.max(0, currentIndex - halfVisible);
  const endIndex = Math.min(entries.length, startIndex + visibleCount);
  const visibleEntries = entries.slice(startIndex, endIndex);

  const LINE_H = fontSize * 1.7;

  return (
    <div
      style={{
        background: "rgba(8, 8, 20, 0.88)",
        backdropFilter: "blur(8px)",
        border: `1px solid rgba(255, 69, 0, 0.35)`,
        boxShadow: `0 0 16px rgba(255, 69, 0, 0.12), 0 4px 24px rgba(0,0,0,0.6)`,
        borderRadius: 12,
        overflow: "hidden",
        fontFamily: '"JetBrains Mono", "Fira Code", "SF Mono", monospace',
        ...style,
      }}
    >
      {/* 标题栏 */}
      <div
        style={{
          background: "rgba(255, 69, 0, 0.08)",
          borderBottom: "1px solid rgba(255, 69, 0, 0.2)",
          padding: `${fontSize * 0.4}px ${fontSize}px`,
          display: "flex",
          alignItems: "center",
          gap: fontSize * 0.5,
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "rgba(255,69,0,0.7)" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "rgba(255,165,0,0.7)" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "rgba(0,200,100,0.7)" }} />
        </div>
        <span
          style={{
            fontSize: fontSize * 0.7,
            color: "rgba(255, 69, 0, 0.6)",
            letterSpacing: "0.05em",
          }}
        >
          git log
        </span>
      </div>

      {/* Log 列表 */}
      <div style={{ overflow: "hidden" }}>
        {visibleEntries.map((entry, relativeIdx) => {
          const absoluteIdx = startIndex + relativeIdx;
          const isCenter = absoluteIdx === currentIndex;
          const isBeforeCenter = absoluteIdx < currentIndex;

          // 每行动效：从上方滑入
          const entrySpring = spring({
            frame: frame - (startIndex + relativeIdx) * 4,
            fps,
            config: { damping: 12, stiffness: 180, mass: 0.4 },
          });
          const slideIn = interpolate(entrySpring, [0, 1], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const opacity = interpolate(entrySpring, [0, 1], [0.4, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

          return (
            <div
              key={absoluteIdx}
              style={{
                display: "flex",
                alignItems: "center",
                height: LINE_H,
                padding: `0 ${fontSize}px`,
                transform: `translateY(${slideIn}px)`,
                opacity,
                background: isCenter
                  ? `rgba(255, 69, 0, 0.12)`
                  : isBeforeCenter
                  ? "rgba(255,255,255,0.02)"
                  : "transparent",
                borderLeft: isCenter
                  ? `3px solid ${highlightColor}`
                  : "3px solid transparent",
                transition: "background 0.2s",
                boxSizing: "border-box",
              }}
            >
              {/* Hash */}
              <span
                style={{
                  fontSize: 24,
                  color: isCenter ? highlightColor : "#00CCFF",
                  fontWeight: isCenter ? 700 : 400,
                  minWidth: fontSize * 5,
                  flexShrink: 0,
                }}
              >
                {entry.hash}
              </span>

              {/* Author */}
              <span
                style={{
                  fontSize: 24,
                  color: isCenter ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.45)",
                  marginLeft: fontSize,
                  minWidth: fontSize * 4,
                  flexShrink: 0,
                }}
              >
                {entry.author}
              </span>

              {/* Date */}
              <span
                style={{
                  fontSize: 24,
                  color: "rgba(255,255,255,0.3)",
                  marginLeft: fontSize * 0.5,
                  flexShrink: 0,
                }}
              >
                {entry.date}
              </span>

              {/* Message */}
              <span
                style={{
                  fontSize,
                  color: isCenter ? "#FFFFFF" : "rgba(255,255,255,0.7)",
                  fontWeight: isCenter ? 600 : 400,
                  marginLeft: fontSize,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  flex: 1,
                }}
              >
                {entry.message}
              </span>
            </div>
          );
        })}
      </div>

      {/* 底部滚动指示器 */}
      <div
        style={{
          height: 3,
          background: "rgba(255,255,255,0.05)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: `${(currentIndex / entries.length) * 100}%`,
            width: `${(1 / entries.length) * 100}%`,
            height: "100%",
            background: highlightColor,
            boxShadow: `0 0 8px ${highlightColor}`,
            transition: "left 0.3s linear",
          }}
        />
      </div>
    </div>
  );
};