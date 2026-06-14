/**
 * ProgressRing — 进度环（右/左下角）
 *
 * 用于 B 类视频 5 个动作镜显示 "X/5" 进度：
 * - SVG 圆环 stroke-dashoffset 动画
 * - 弹簧入场 + 中心数字弹入
 * - impulse 模式（第 5 个动作）满环时整体脉冲
 */

import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

interface ProgressRingProps {
  current: number;       // 1-5
  total?: number;        // 默认 5
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  delay?: number;
  size?: number;         // 直径，默认 160
  color?: string;
  impulse?: boolean;     // 满环时整体缩放脉冲
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  current,
  total = 5,
  position = "bottom-right",
  delay = 0,
  size = 160,
  color = "#FF4500",
  impulse = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 圆环参数
  const strokeWidth = 10;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(current / total, 1);

  // 弹簧入场
  const enter = spring({
    frame: frame - delay,
    fps,
    config: { damping: 8, stiffness: 200, mass: 0.5 },
  });
  const enterScale = interpolate(enter, [0, 1], [0.5, 1]);
  const enterOpacity = interpolate(enter, [0, 1], [0, 1]);

  // 进度环 stroke 动画（延迟 15 帧开始）
  const progressAnim = spring({
    frame: frame - delay - 15,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.6 },
  });
  const dashOffset = interpolate(progressAnim, [0, 1], [circumference, circumference * (1 - progress)]);

  // impulse 满环时整体脉冲
  const impulseScale = impulse
    ? 1 + 0.1 * Math.sin((frame - delay) * 0.15)
    : 1;

  // 中心数字弹入（延迟 25 帧）
  const numAnim = spring({
    frame: frame - delay - 25,
    fps,
    config: { damping: 8, stiffness: 200, mass: 0.5 },
  });
  const numScale = interpolate(numAnim, [0, 1], [0.5, 1]);

  // 位置
  const posStyle: React.CSSProperties = (() => {
    const base: React.CSSProperties = { position: "absolute", zIndex: 20 };
    if (position === "top-left") return { ...base, top: 160, left: 60 };
    if (position === "top-right") return { ...base, top: 160, right: 60 };
    if (position === "bottom-left") return { ...base, bottom: 320, left: 60 };
    return { ...base, bottom: 320, right: 60 };
  })();

  return (
    <div
      style={{
        ...posStyle,
        width: size,
        height: size,
        opacity: enterOpacity,
        transform: `scale(${enterScale * impulseScale})`,
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
        {/* 背景环 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="rgba(10, 10, 20, 0.88)"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth={strokeWidth}
        />
        {/* 进度环 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{
            filter: `drop-shadow(0 0 8px ${color})`,
          }}
        />
      </svg>
      {/* 中心文字 "X/5" */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${numScale})`,
        }}
      >
        <span
          style={{
            color: "#FFFFFF",
            fontSize: 36,
            fontWeight: 900,
            fontFamily: "monospace",
            textShadow: `0 0 12px ${color}`,
          }}
        >
          {current}/{total}
        </span>
      </div>
    </div>
  );
};
