/**
 * KeyPoint — 关键点提示组件
 *
 * 显示动作关键点（如"肩胛骨先沉"）
 * pro: 橙色主题 + 闪动高亮
 * lite: 蓝色主题 + 滑入动画
 *
 * 位置：bottom-left（storyboard 指定）
 */

import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import type { BVariantTheme } from "../../themes/b-variant-theme";

interface KeyPointProps {
  text: string;
  position: "bottom-left" | "bottom-right" | "top-left" | "top-right";
  delay?: number;
  color?: string;
  theme: BVariantTheme;
}

const POSITIONS = {
  "bottom-left": { left: 160, bottom: "50%", transform: "translateY(50%)" },
  "bottom-right": { right: 160, bottom: "50%", transform: "translateY(50%)" },
  "top-left": { left: 160, top: "50%", transform: "translateY(-50%)" },
  "top-right": { right: 160, top: "50%", transform: "translateY(-50%)" },
};

export const KeyPoint: React.FC<KeyPointProps> = ({
  text,
  position = "bottom-left",
  delay = 0,
  color,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isPro = theme.id === "pro";

  // 入场动画
  const entryFrame = Math.max(0, frame - delay);
  const scale = spring({
    frame: entryFrame,
    fps,
    damping: 12,
    stiffness: 140,
    mass: 0.6,
  });

  // 闪动效果（pro：强调）或滑入（lite）
  const flashOpacity = isPro
    ? interpolate(Math.sin(entryFrame * 0.15), [-1, 1], [0.7, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;

  // 滑入偏移
  const slideOffset = isPro
    ? 0
    : spring({ frame: entryFrame, fps, damping: 16, stiffness: 100 }) * 20;

  const accentColor = color || (isPro ? theme.primary : "#4FC3F7");
  const pos = POSITIONS[position];

  return (
    <div
      style={{
        position: "absolute",
        ...pos,
        transform: `scale(${scale}) translateX(${isPro ? 0 : slideOffset}px)`,
        transformOrigin: "left center",
      }}
    >
      {/* 左边强调竖线 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: "50%",
          transform: "translateY(-50%)",
          width: 4,
          height: "80%",
          background: accentColor,
          borderRadius: 2,
          boxShadow: `0 0 8px ${accentColor}`,
          opacity: flashOpacity,
        }}
      />
      {/* 文字背景 */}
      <div
        style={{
          background: "rgba(0,0,0,0.8)",
          backdropFilter: "blur(10px)",
          padding: "8px 16px 8px 18px",
          borderRadius: 6,
          border: `1px solid ${accentColor}88`,
          marginLeft: 8,
        }}
      >
        <span
          style={{
            fontFamily: "PingFang SC, sans-serif",
            fontSize: 52,
            fontWeight: 700,
            color: "#FFFFFF",
            textShadow: `0 0 8px ${accentColor}`,
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};