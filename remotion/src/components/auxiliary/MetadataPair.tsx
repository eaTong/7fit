import { useCurrentFrame, interpolate, spring } from "remotion";
import { useVideoConfig } from "remotion";

interface MetadataPairProps {
  label: string;
  value: string;
  subLabel?: string;
  subValue?: string;
  delay?: number;
}

export const MetadataPair: React.FC<MetadataPairProps> = ({
  label,
  value,
  subLabel,
  subValue,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame: frame - delay, fps, config: { damping: 8, stiffness: 200, mass: 0.5 } });
  const slideX = interpolate(enter, [0, 1], [-40, 0]);
  const opacity = interpolate(enter, [0, 1], [0, 1]);

  // 分隔线呼吸 glow 动效
  const dividerGlow = interpolate(
    Math.sin((frame - delay) * 0.05),
    [-1, 1],
    [0.3, 1]
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 48,
        padding: "32px 48px",
        background: "rgba(10, 10, 20, 0.88)",
        backdropFilter: "blur(8px)",
        border: "2px solid rgba(255, 69, 0, 0.4)",
        borderRadius: 16,
        boxShadow: "0 0 20px rgba(255, 69, 0, 0.15), 0 8px 32px rgba(0,0,0,0.6)",
        opacity,
        transform: `translateX(${slideX}px)`,
      }}
    >
      {/* 主元数据 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ fontSize: 24, color: "#888888", fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 56, color: "#FFFFFF", fontWeight: 900, lineHeight: 1.1, textShadow: "0 0 20px rgba(255,255,255,0.2)" }}>{value}</div>
      </div>

      {/* 分隔线 — 呼吸 glow */}
      <div
        style={{
          width: 3,
          height: 80,
          background: `rgba(255, 69, 0, ${dividerGlow})`,
          borderRadius: 2,
          boxShadow: `0 0 ${12 * dividerGlow}px rgba(255, 69, 0, ${dividerGlow * 0.5})`,
          transition: "box-shadow 0.1s",
        }}
      />

      {/* 副元数据 */}
      {subLabel && subValue && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 24, color: "#888888", fontWeight: 500 }}>{subLabel}</div>
          <div style={{ fontSize: 56, color: "#FFFFFF", fontWeight: 900, lineHeight: 1.1, textShadow: "0 0 20px rgba(255,255,255,0.2)" }}>{subValue}</div>
        </div>
      )}
    </div>
  );
};
