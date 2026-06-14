/**
 * NumberImpact — 中心数字弹入（playful 贝塞尔 overshoot）
 *
 * 用于 B 类视频数字冲击镜（如 5×12）：
 * - 大数字 200px，bold 900
 * - spring overshoot 弹跳
 * - 数字呼吸辉光
 */

import { useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";

interface NumberImpactProps {
  numbers: Array<{ text: string; highlight?: boolean }>;
  delay?: number;
  stagger?: number;     // 多段数字交错入场
}

export const NumberImpact: React.FC<NumberImpactProps> = ({
  numbers,
  delay = 0,
  stagger = 6,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 呼吸辉光
  const pulse = interpolate(Math.sin((frame - delay) * 0.1), [-1, 1], [0.6, 1]);
  const glowSize = 30 + 30 * pulse;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        zIndex: 30,
        flexWrap: "wrap",
        padding: "0 80px",
      }}
    >
      {numbers.map((num, i) => {
        // playful 贝塞尔 overshoot
        const enter = spring({
          frame: frame - delay - i * stagger,
          fps,
          config: { damping: 8, stiffness: 200, mass: 0.5 },
        });
        const overshootScale = interpolate(
          enter,
          [0, 0.7, 1],
          [0, 1.25, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.34, 1.56, 0.64, 1),
          }
        );
        const opacity = interpolate(enter, [0, 1], [0, 1]);

        if (!num.highlight) {
          // 普通文字（"个动作 ×"）
          return (
            <span
              key={i}
              style={{
                color: "#FFFFFF",
                fontSize: 72,
                fontWeight: 700,
                opacity,
                transform: `scale(${overshootScale})`,
                textShadow: "0 2px 12px rgba(0, 0, 0, 0.9)",
              }}
            >
              {num.text}
            </span>
          );
        }

        // 数字（高亮）
        return (
          <span
            key={i}
            style={{
              color: "#FF4500",
              fontSize: 200,
              fontWeight: 900,
              lineHeight: 1,
              opacity,
              transform: `scale(${overshootScale})`,
              textShadow: `0 0 ${glowSize}px rgba(255, 69, 0, ${0.6 + 0.3 * pulse})`,
              filter: `brightness(${pulse})`,
              fontFamily: "monospace",
            }}
          >
            {num.text}
          </span>
        );
      })}
    </div>
  );
};
