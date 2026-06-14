import { useCurrentFrame, interpolate, spring } from "remotion";
import { useVideoConfig } from "remotion";

interface FlowNode {
  label: string;
  sublabel?: string;
}

interface FlowDiagramProps {
  nodes: FlowNode[];
  delay?: number;
}

export const FlowDiagram: React.FC<FlowDiagramProps> = ({ nodes, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const flowProgress = interpolate(
    frame % (nodes.length * 30),
    [0, nodes.length * 30],
    [0, nodes.length - 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 0,
        padding: "36px 50px",
        background: "rgba(10, 10, 20, 0.88)",
        backdropFilter: "blur(8px)",
        border: "2px solid rgba(255, 69, 0, 0.4)",
        borderRadius: 18,
        boxShadow: "0 0 24px rgba(255, 69, 0, 0.18), 0 10px 40px rgba(0,0,0,0.6)",
      }}
    >
      {nodes.map((node, i) => {
        const enter = spring({
          frame: frame - delay - i * 8,
          fps,
          config: { damping: 8, stiffness: 200, mass: 0.5 },
        });
        const scale = interpolate(enter, [0, 1], [0.8, 1]);
        const opacity = interpolate(enter, [0, 1], [0, 1]);

        const isActive = i === Math.floor(flowProgress);

        return (
          <div key={node.label} style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
            {/* Node */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 15,
                padding: "25px 36px",
                background: isActive ? "rgba(255, 69, 0, 0.2)" : "rgba(255, 69, 0, 0.08)",
                border: `2px solid ${isActive ? "#FF4500" : "rgba(255, 69, 0, 0.3)"}`,
                borderRadius: 14,
                boxShadow: isActive ? "0 0 24px rgba(255, 69, 0, 0.5)" : "none",
                opacity,
                transform: `scale(${scale})`,
                transition: "background 0.3s, border-color 0.3s",
              }}
            >
              <div style={{ fontSize: 34, fontWeight: 800, color: "#FFFFFF" }}>{node.label}</div>
              {node.sublabel && (
                <div style={{ fontSize: 22, color: "#888888" }}>{node.sublabel}</div>
              )}
            </div>

            {/* Arrow */}
            {i < nodes.length - 1 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0 18px",
                }}
              >
                <svg width="63" height="31" viewBox="0 0 63 31">
                  <defs>
                    <linearGradient id={`grad-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FF4500" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#FF4500" stopOpacity="1" />
                    </linearGradient>
                  </defs>
                  <line x1="0" y1="15" x2="49" y2="15" stroke={`url(#grad-${i})`} strokeWidth="3" />
                  <polygon points="49,7 63,15 49,23" fill="#FF4500" />
                </svg>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
