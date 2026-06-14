import { useCurrentFrame, interpolate, spring } from "remotion";
import { useVideoConfig } from "remotion";

interface ComparisonCardProps {
  before: { label: string; value: string; unit: string };
  after: { label: string; value: string; unit: string };
  delay?: number;
}

export const ComparisonCard: React.FC<ComparisonCardProps> = ({
  before,
  after,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame: frame - delay, fps, config: { damping: 8, stiffness: 200, mass: 0.5 } });
  const scale = interpolate(enter, [0, 1], [0.85, 1]);
  const opacity = interpolate(enter, [0, 1], [0, 1]);

  // Before 数字弹出
  const beforeEnter = spring({
    frame: frame - delay - 8,
    fps,
    config: { damping: 10, stiffness: 180, mass: 0.5 },
  });
  const beforeScale = interpolate(beforeEnter, [0, 1], [0.3, 1]);

  // After 数字弹出（延迟更多）
  const afterEnter = spring({
    frame: frame - delay - 18,
    fps,
    config: { damping: 10, stiffness: 180, mass: 0.5 },
  });
  const afterScale = interpolate(afterEnter, [0, 1], [0.3, 1]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 40,
        padding: "48px 64px",
        background: "rgba(10, 10, 20, 0.88)",
        backdropFilter: "blur(8px)",
        border: "2px solid rgba(255, 69, 0, 0.4)",
        borderRadius: 20,
        boxShadow: "0 0 32px rgba(255, 69, 0, 0.2), 0 12px 48px rgba(0,0,0,0.6)",
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      {/* Before */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 20,
          padding: "28px 40px",
          background: "rgba(220, 20, 60, 0.12)",
          border: "2px solid rgba(220, 20, 60, 0.4)",
          borderRadius: 16,
          flex: 1,
        }}
      >
        <div style={{ fontSize: 32, color: "#DC143C", fontWeight: 700, whiteSpace: "nowrap" }}>
          {before.label}
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, transform: `scale(${beforeScale})`, transformOrigin: "left center" }}>
          <div style={{ fontSize: 100, fontWeight: 900, color: "#DC143C", textShadow: "0 0 40px rgba(220, 20, 60, 0.7)", lineHeight: 1 }}>
            {before.value}
          </div>
          <div style={{ fontSize: 28, color: "#888888" }}>{before.unit}</div>
        </div>
      </div>

      {/* VS */}
      <div
        style={{
          width: 88,
          height: 88,
          borderRadius: "50%",
          background: "#FF4500",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
          fontWeight: 900,
          color: "#FFFFFF",
          boxShadow: "0 0 32px rgba(255, 69, 0, 0.7)",
          flexShrink: 0,
        }}
      >
        VS
      </div>

      {/* After */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 20,
          padding: "28px 40px",
          background: "rgba(0, 255, 136, 0.08)",
          border: "2px solid rgba(0, 255, 136, 0.3)",
          borderRadius: 16,
          flex: 1,
        }}
      >
        <div style={{ fontSize: 32, color: "#00FF88", fontWeight: 700, whiteSpace: "nowrap" }}>
          {after.label}
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, transform: `scale(${afterScale})`, transformOrigin: "left center" }}>
          <div style={{ fontSize: 100, fontWeight: 900, color: "#00FF88", textShadow: "0 0 40px rgba(0, 255, 136, 0.7)", lineHeight: 1 }}>
            {after.value}
          </div>
          <div style={{ fontSize: 28, color: "#888888" }}>{after.unit}</div>
        </div>
      </div>
    </div>
  );
};
