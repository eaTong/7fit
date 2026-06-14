import { useCurrentFrame } from "remotion";
import { useVideoConfig } from "remotion";

interface OrbitingItem {
  label: string;
  icon?: string;
}

interface OrbitingContentProps {
  items: OrbitingItem[];
  orbitRadius?: number;
  orbitSpeed?: number;
  itemSize?: number;
  startAngle?: number;
}

// 环形内容元素（内容驱动，不依赖视频源）
export const OrbitingContent: React.FC<OrbitingContentProps> = ({
  items,
  orbitRadius = 380,
  orbitSpeed = 8,
  itemSize = 120,
  startAngle = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <>
      {items.map((item, i) => {
        const angle = (startAngle + i * (360 / items.length) + frame * orbitSpeed / fps) * (Math.PI / 180);
        const centerX = 960;
        const centerY = 540;
        const x = centerX + orbitRadius * Math.cos(angle) - itemSize / 2;
        const y = centerY + orbitRadius * Math.sin(angle) - itemSize / 2;

        return (
          <div
            key={`${item.label}-${i}`}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: itemSize,
              height: itemSize,
              borderRadius: "50%",
              background: "rgba(10, 10, 20, 0.88)",
              border: "2px solid rgba(255, 69, 0, 0.6)",
              boxShadow: "0 0 16px rgba(255, 69, 0, 0.3)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
              overflow: "hidden",
            }}
          >
            {item.icon && (
              <span style={{ fontSize: itemSize * 0.35 }}>{item.icon}</span>
            )}
            <span
              style={{
                fontSize: Math.max(10, itemSize * 0.12),
                color: "#FFFFFF",
                fontWeight: 700,
                textAlign: "center",
                padding: "0 4px",
                lineHeight: 1.2,
                fontFamily: '"JetBrains Mono", monospace',
              }}
            >
              {item.label}
            </span>
          </div>
        );
      })}
    </>
  );
};
