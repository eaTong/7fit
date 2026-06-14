import { useCurrentFrame, interpolate, spring } from "remotion";
import { useVideoConfig } from "remotion";

interface HeadlineCardProps {
  title: string;
  highlightWord?: string;
  subtitle?: string;
  delay?: number;
}

export const HeadlineCard: React.FC<HeadlineCardProps> = ({
  title,
  highlightWord,
  subtitle,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame: frame - delay, fps, config: { damping: 8, stiffness: 200, mass: 0.5 } });
  const scale = interpolate(enter, [0, 1], [0.9, 1]);
  const opacity = interpolate(enter, [0, 1], [0, 1]);

  // 高亮词 shimmer
  const shimmerBrightness = interpolate(
    Math.sin((frame - delay) * 0.03),
    [-1, 1],
    [0.7, 1]
  );

  const titleParts = highlightWord && title.includes(highlightWord)
    ? title.split(highlightWord)
    : [title];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
        padding: "64px 96px",
        background: "transparent",
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      {/* 主标题 */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          textAlign: "center",
          fontSize: 125,
          fontWeight: 900,
          lineHeight: 1.1,
        }}
      >
        {titleParts[0]}
        {highlightWord && (
          <span
            style={{
              color: "#FF4500",
              textShadow: `0 0 50px rgba(255, 69, 0, ${0.5 + 0.3 * shimmerBrightness})`,
              filter: `brightness(${shimmerBrightness})`,
              transition: "filter 0.1s, text-shadow 0.1s",
            }}
          >
            {highlightWord}
          </span>
        )}
        {titleParts[1]}
      </div>

      {/* 副标题 */}
      {subtitle && (
        <div
          style={{
            fontSize: 58,
            color: "#FFFFFF",
            fontWeight: 600,
            textAlign: "center",
            opacity: 0.9,
          }}
        >
          {subtitle}
        </div>
      )}

      {/* 底部装饰线 */}
      <div
        style={{
          width: 208,
          height: 7,
          background: "linear-gradient(90deg, transparent, #FF4500, transparent)",
          borderRadius: 4,
          marginTop: 16,
        }}
      />
    </div>
  );
};
