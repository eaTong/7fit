import { useCurrentFrame, interpolate, spring } from "remotion";
import { useVideoConfig } from "remotion";

interface ImpactBarProps {
  aiPercent: number;
  mePercent: number;
  aiLabel?: string;
  meLabel?: string;
  delay?: number;
}

export const ImpactBar: React.FC<ImpactBarProps> = ({
  aiPercent,
  mePercent,
  aiLabel = "AI 执行",
  meLabel = "我判断",
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame: frame - delay, fps, config: { damping: 8, stiffness: 200, mass: 0.5 } });
  const slideY = interpolate(enter, [0, 1], [20, 0]);
  const opacity = interpolate(enter, [0, 1], [0, 1]);

  const aiFill = spring({
    frame: frame - delay - 5,
    fps,
    config: { damping: 12, stiffness: 180, mass: 0.5 },
  });
  const aiWidth = interpolate(aiFill, [0, 1], [0, aiPercent]);

  const meFill = spring({
    frame: frame - delay - 10,
    fps,
    config: { damping: 12, stiffness: 180, mass: 0.5 },
  });
  const meWidth = interpolate(meFill, [0, 1], [0, mePercent]);

  // AI 条 shimmer 动效
  const shimmerPos = interpolate(frame, [0, 60], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 32,
        padding: "48px 64px",
        background: "rgba(10, 10, 20, 0.88)",
        backdropFilter: "blur(8px)",
        border: "2px solid rgba(255, 69, 0, 0.4)",
        borderRadius: 20,
        boxShadow: "0 0 32px rgba(255, 69, 0, 0.2), 0 12px 48px rgba(0,0,0,0.6)",
        opacity,
        transform: `translateY(${slideY}px)`,
      }}
    >
      {/* AI 条 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontSize: 40, color: "#888888" }}>{aiLabel}</span>
          <span style={{ fontSize: 40, color: "#FF4500", fontWeight: 800 }}>{aiPercent}%</span>
        </div>
        <div
          style={{
            height: 48,
            background: "rgba(255, 69, 0, 0.12)",
            borderRadius: 24,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${aiWidth}%`,
              height: "100%",
              background: "linear-gradient(90deg, #FF4500, #FF6B35, #FF4500)",
              backgroundSize: "200% 100%",
              backgroundPosition: `${shimmerPos}% 0`,
              borderRadius: 24,
              boxShadow: "0 0 24px rgba(255, 69, 0, 0.7)",
            }}
          />
        </div>
      </div>

      {/* 我 条 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontSize: 40, color: "#888888" }}>{meLabel}</span>
          <span style={{ fontSize: 40, color: "#888888", fontWeight: 800 }}>{mePercent}%</span>
        </div>
        <div
          style={{
            height: 48,
            background: "rgba(136, 136, 136, 0.12)",
            borderRadius: 24,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${meWidth}%`,
              height: "100%",
              background: "rgba(136, 136, 136, 0.5)",
              borderRadius: 24,
            }}
          />
        </div>
      </div>
    </div>
  );
};
