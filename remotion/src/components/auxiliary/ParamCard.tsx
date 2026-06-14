/**
 * ParamCard — 参数卡（右上/左下角）
 *
 * 用于 B 类视频显示关键参数（如 12次 / 5组）：
 * - 弹簧弹入
 * - 呼吸辉光
 * - 大字号数字 + 标签
 */

import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

interface ParamCardProps {
  label: string;            // 主文字（"12次"）
  caption?: string;         // 副文字（"力竭"）
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  delay?: number;
  color?: string;
  breathing?: boolean;      // 呼吸辉光
}

export const ParamCard: React.FC<ParamCardProps> = ({
  label,
  caption,
  position = "top-right",
  delay = 0,
  color = "#FF4500",
  breathing = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: frame - delay,
    fps,
    config: { damping: 8, stiffness: 200, mass: 0.5 },
  });
  const scale = interpolate(enter, [0, 1], [0.6, 1]);
  const opacity = interpolate(enter, [0, 1], [0, 1]);

  // 呼吸辉光
  const pulse = breathing
    ? interpolate(Math.sin((frame - delay) * 0.08), [-1, 1], [0.6, 1])
    : 1;
  const glowSize = 16 + 16 * pulse;

  // 位置
  const posStyle: React.CSSProperties = (() => {
    const base: React.CSSProperties = { position: "absolute", zIndex: 20 };
    if (position === "top-left") return { ...base, top: 160, left: 60 };
    if (position === "top-right") return { ...base, top: 160, right: 60 };
    if (position === "bottom-left") return { ...base, bottom: 320, left: 60 };
    return { ...base, bottom: 550, right: 60 };
  })();

  return (
    <div
      style={{
        ...posStyle,
        transform: `scale(${scale})`,
        opacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        background: "rgba(10, 10, 20, 0.88)",
        backdropFilter: "blur(8px)",
        border: `3px solid ${color}`,
        borderRadius: 24,
        padding: "20px 36px",
        boxShadow: `0 0 ${glowSize}px ${color}80`,
        minWidth: 180,
      }}
    >
      <span
        style={{
          color: color,
          fontSize: 72,
          fontWeight: 900,
          lineHeight: 1,
          textShadow: `0 0 20px ${color}80`,
        }}
      >
        {label}
      </span>
      {caption && (
        <span
          style={{
            color: "#FFFFFF",
            fontSize: 36,
            fontWeight: 600,
            opacity: 0.9,
          }}
        >
          {caption}
        </span>
      )}
    </div>
  );
};
