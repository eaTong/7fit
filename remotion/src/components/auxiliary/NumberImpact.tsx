/**
 * NumberImpact — 中心数字弹入（playful 贝塞尔 overshoot）
 *
 * 用于 B 类视频数字冲击镜（如 5×12）：
 * - 大数字 200px，bold 900
 * - spring overshoot 弹跳
 * - 数字呼吸辉光
 *
 * 支持 overlay 模式（叠加在视频上）：
 * - `visibleFromFrame` / `visibleToFrame`：在镜头内的可见区间
 * - 区间外自动隐藏 + 区间内自动 fade in/out
 */

import { useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import type { BVariantTheme } from "../../themes/b-variant-theme";

interface NumberImpactProps {
  numbers: Array<{ text: string; highlight?: boolean }>;
  delay?: number;
  stagger?: number;     // 多段数字交错入场
  /** 从哪一帧开始可见（overlay 模式） */
  visibleFromFrame?: number;
  /** 到哪一帧结束可见（overlay 模式） */
  visibleToFrame?: number;
  /** fade 时长（帧） */
  fadeFrames?: number;
  /** 位置 */
  position?: "center" | "top" | "bottom";
  theme?: BVariantTheme; // 可选：B 类双版本主题
}

export const NumberImpact: React.FC<NumberImpactProps> = ({
  numbers,
  delay = 0,
  stagger = 6,
  visibleFromFrame = 0,
  visibleToFrame,
  fadeFrames = 12,
  position = "center",
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // overlay 模式：可见性控制
  const totalFrames = visibleToFrame ?? Infinity;
  const visibleDuration = totalFrames - visibleFromFrame;
  const timeSinceVisible = frame - visibleFromFrame;
  const visible = frame >= visibleFromFrame && frame < totalFrames;

  // fade in / fade out
  let wrapperOpacity = 0;
  if (visible) {
    if (timeSinceVisible < fadeFrames) {
      // fade in
      wrapperOpacity = interpolate(timeSinceVisible, [0, fadeFrames], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    } else if (timeSinceVisible > visibleDuration - fadeFrames) {
      // fade out
      const t = timeSinceVisible - (visibleDuration - fadeFrames);
      wrapperOpacity = interpolate(t, [0, fadeFrames], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    } else {
      wrapperOpacity = 1;
    }
  }

  // 呼吸辉光
  const pulse = interpolate(Math.sin((frame - delay) * 0.1), [-1, 1], [0.6, 1]);
  const glowSize = 30 + 30 * pulse;

  // 位置
  const posStyle: React.CSSProperties = (() => {
    if (position === "top") {
      return { alignItems: "flex-start", paddingTop: 240 };
    }
    if (position === "bottom") {
      return { alignItems: "flex-end", paddingBottom: 400 };
    }
    return { alignItems: "center" };
  })();

  if (!visible) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        justifyContent: "center",
        flexDirection: "row",
        gap: 24,
        zIndex: 30,
        flexWrap: "wrap",
        padding: "0 80px",
        opacity: wrapperOpacity,
        ...posStyle,
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
          return (
            <span
              key={i}
              style={{
                color: theme?.text ?? "#FFFFFF",
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

        const highlightColor = theme?.primary ?? "#FF4500";
        return (
          <span
            key={i}
            style={{
              color: highlightColor,
              fontSize: 200,
              fontWeight: 900,
              lineHeight: 1,
              opacity,
              transform: `scale(${overshootScale})`,
              textShadow: `0 0 ${glowSize}px ${highlightColor}${Math.round((0.6 + 0.3 * pulse) * 255).toString(16).padStart(2, '0')}`,
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
