/**
 * ActionBadge — 动作名 chip（左上角/右上角）
 *
 * 用于 B 类视频每个动作镜显示动作名：
 * - 弹簧弹入（0.25s）
 * - 玻璃态 + 橙边
 * - 缩略动作名（≤4 字）
 */

import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

interface ActionBadgeProps {
  name: string;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  delay?: number;        // 帧延迟
  color?: string;        // 强调色
}

export const ActionBadge: React.FC<ActionBadgeProps> = ({
  name,
  position = "top-left",
  delay = 0,
  color = "#FF4500",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 弹簧弹入
  const enter = spring({
    frame: frame - delay,
    fps,
    config: { damping: 8, stiffness: 200, mass: 0.5 },
  });
  const scale = interpolate(enter, [0, 1], [0.7, 1]);
  const opacity = interpolate(enter, [0, 1], [0, 1]);

  // 呼吸辉光
  const pulse = interpolate(Math.sin((frame - delay) * 0.1), [-1, 1], [0.6, 1]);
  const glowOpacity = 0.3 + 0.4 * pulse;

  // 位置计算
  const posStyle: React.CSSProperties = (() => {
    const base: React.CSSProperties = { position: "absolute", top: 160, zIndex: 20 };
    if (position === "top-left") return { ...base, left: 60 };
    if (position === "top-right") return { ...base, right: 60 };
    if (position === "bottom-left") return { ...base, bottom: 320, top: "auto" };
    return { ...base, bottom: 320, right: 60, top: "auto" };
  })();

  return (
    <div
      style={{
        ...posStyle,
        transform: `scale(${scale})`,
        opacity,
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: "rgba(10, 10, 20, 0.88)",
        backdropFilter: "blur(8px)",
        border: `2px solid ${color}`,
        borderRadius: 999,
        padding: "16px 32px",
        boxShadow: `0 0 ${20 + 20 * pulse}px rgba(255, 69, 0, ${glowOpacity})`,
      }}
    >
      {/* 圆点指示器 */}
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: 999,
          background: color,
          boxShadow: `0 0 12px ${color}`,
        }}
      />
      <span
        style={{
          color: "#FFFFFF",
          fontSize: 48,
          fontWeight: 800,
          letterSpacing: 2,
        }}
      >
        {name}
      </span>
    </div>
  );
};
