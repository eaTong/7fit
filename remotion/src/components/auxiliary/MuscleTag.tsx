/**
 * MuscleTag — 肌群标签组件
 *
 * 显示目标肌群（如"背阔肌宽幅"）
 * pro: 橙色主题 + 呼吸辉光
 * lite: 蓝色主题 + 脉冲动画
 *
 * 位置：top-right（storyboard 指定）
 */

import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import type { BVariantTheme } from "../../themes/b-variant-theme";

interface MuscleTagProps {
  muscle: string;
  position: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  delay?: number;
  color?: string;
  theme: BVariantTheme;
}

const POSITIONS = {
  "top-right": { right: 160, top: "50%", transform: "translateY(-50%)" },
  "top-left": { left: 160, top: "50%", transform: "translateY(-50%)" },
  "bottom-right": { right: 160, bottom: "50%", transform: "translateY(50%)" },
  "bottom-left": { left: 160, bottom: "50%", transform: "translateY(50%)" },
};

export const MuscleTag: React.FC<MuscleTagProps> = ({
  muscle,
  position = "top-right",
  delay = 0,
  color,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isPro = theme.id === "pro";

  // 入场动画：scale 0→1 + 呼吸辉光
  const entryFrame = Math.max(0, frame - delay);
  const scale = spring({
    frame: entryFrame,
    fps,
    damping: 14,
    stiffness: 120,
    mass: 0.8,
  });

  // 呼吸辉光（pro）或脉冲（lite）
  const glowOpacity = isPro
    ? interpolate(Math.sin(entryFrame * 0.08), [-1, 1], [0.3, 0.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : interpolate(Math.sin(entryFrame * 0.12), [-1, 1], [0.4, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const accentColor = color || (isPro ? theme.primary : "#4FC3F7");
  const pos = POSITIONS[position];

  return (
    <div
      style={{
        position: "absolute",
        ...pos,
        transform: `scale(${scale})`,
        transformOrigin: "center center",
      }}
    >
      {/* 辉光背景 */}
      <div
        style={{
          position: "absolute",
          inset: -8,
          background: accentColor,
          opacity: glowOpacity * 0.3,
          borderRadius: 8,
          filter: "blur(12px)",
        }}
      />
      {/* 标签内容 */}
      <div
        style={{
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(8px)",
          padding: "6px 14px",
          borderRadius: 6,
          border: `1.5px solid ${accentColor}`,
          boxShadow: `0 0 12px ${accentColor}66`,
        }}
      >
        <span
          style={{
            fontFamily: "PingFang SC, sans-serif",
            fontSize: 52,
            fontWeight: 700,
            color: accentColor,
            letterSpacing: 1,
          }}
        >
          {muscle}
        </span>
      </div>
    </div>
  );
};