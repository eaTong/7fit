import { useCurrentFrame, interpolate, spring } from "remotion";
import { useVideoConfig } from "remotion";

interface QuoteCardProps {
  quote: string;
  attribution: string;
  emoji?: string;
  delay?: number;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({
  quote,
  attribution,
  emoji,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame: frame - delay, fps, config: { damping: 8, stiffness: 200, mass: 0.5 } });
  const slideX = interpolate(enter, [0, 1], [-30, 0]);
  const opacity = interpolate(enter, [0, 1], [0, 1]);

  // 引号浮动动效
  const quoteFloat = interpolate(
    Math.sin((frame - delay) * 0.03),
    [-1, 1],
    [-4, 4]
  );

  // 署名延迟淡入
  const attrEnter = spring({
    frame: frame - delay - 15,
    fps,
    config: { damping: 10, stiffness: 150, mass: 0.5 },
  });
  const attrOpacity = interpolate(attrEnter, [0, 1], [0, 1]);
  const attrY = interpolate(attrEnter, [0, 1], [10, 0]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
        padding: "36px 48px",
        background: "rgba(10, 10, 20, 0.88)",
        backdropFilter: "blur(8px)",
        borderLeft: "5px solid #FF4500",
        borderRadius: 16,
        boxShadow: "0 0 20px rgba(255, 69, 0, 0.15), 0 8px 32px rgba(0,0,0,0.6)",
        opacity,
        transform: `translateX(${slideX}px)`,
      }}
    >
      {/* 大引号装饰 — 浮动 */}
      <div
        style={{
          fontSize: 96,
          color: "#FF4500",
          fontFamily: "Georgia, serif",
          lineHeight: 0.5,
          opacity: 0.6,
          transform: `translateY(${quoteFloat}px)`,
          transition: "transform 0.1s",
        }}
      >
        "
      </div>

      {/* 引用文字 */}
      <div
        style={{
          fontSize: 48,
          fontWeight: 800,
          color: "#FFFFFF",
          lineHeight: 1.3,
          textShadow: "0 2px 16px rgba(0,0,0,0.4)",
        }}
      >
        {quote}
      </div>

      {/* 署名 — 延迟淡入 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontSize: 26,
          color: "#888888",
          opacity: attrOpacity,
          transform: `translateY(${attrY}px)`,
        }}
      >
        <span>— {attribution}</span>
        {emoji && <span style={{ fontSize: 36 }}>{emoji}</span>}
      </div>
    </div>
  );
};
