import { useCurrentFrame, interpolate, spring } from "remotion";
import { useVideoConfig } from "remotion";

interface TimeStateCardProps {
  time: string;
  state: string;
  emotion?: string;
  delay?: number;
}

export const TimeStateCard: React.FC<TimeStateCardProps> = ({
  time,
  state,
  emotion,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame: frame - delay, fps, config: { damping: 8, stiffness: 200, mass: 0.5 } });
  const slideY = interpolate(enter, [0, 1], [20, 0]);
  const opacity = interpolate(enter, [0, 1], [0, 1]);

  // 时间数字脉冲 glow
  const timeGlow = interpolate(
    Math.sin((frame - delay) * 0.04),
    [-1, 1],
    [0.5, 1]
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        padding: "36px 48px",
        background: "rgba(10, 10, 20, 0.88)",
        backdropFilter: "blur(8px)",
        border: "2px solid rgba(220, 20, 60, 0.4)",
        borderRadius: 16,
        boxShadow: "0 0 20px rgba(220, 20, 60, 0.2), 0 8px 32px rgba(0,0,0,0.6)",
        opacity,
        transform: `translateY(${slideY}px)`,
      }}
    >
      {/* 时间 */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
        <span
          style={{
            fontSize: 96,
            fontWeight: 900,
            color: "#FF4500",
            textShadow: `0 0 ${40 * timeGlow}px rgba(255, 69, 0, ${0.5 + 0.3 * timeGlow})`,
            lineHeight: 1,
            transition: "text-shadow 0.1s",
          }}
        >
          {time}
        </span>
        {emotion && (
          <span style={{ fontSize: 32, color: "#DC143C", fontWeight: 700 }}>{emotion}</span>
        )}
      </div>

      {/* 状态 */}
      <div
        style={{
          fontSize: 44,
          color: "#FFFFFF",
          fontWeight: 700,
          borderLeft: "4px solid #DC143C",
          paddingLeft: 24,
          textShadow: "0 2px 12px rgba(0,0,0,0.5)",
        }}
      >
        {state}
      </div>
    </div>
  );
};
