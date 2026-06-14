import { useCurrentFrame, interpolate, spring } from "remotion";
import { useVideoConfig } from "remotion";

interface WorkflowStep {
  icon: string;
  name: string;
  desc: string;
}

interface WorkflowCardProps {
  steps: WorkflowStep[];
  delay?: number;
}

export const WorkflowCard: React.FC<WorkflowCardProps> = ({ steps, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame: frame - delay, fps, config: { damping: 8, stiffness: 200, mass: 0.5 } });
  const scale = interpolate(enter, [0, 1], [0.85, 1]);
  const opacity = interpolate(enter, [0, 1], [0, 1]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 16,
        padding: 42,
        background: "rgba(10, 10, 20, 0.88)",
        backdropFilter: "blur(8px)",
        border: "2px solid rgba(255, 69, 0, 0.4)",
        borderRadius: 24,
        boxShadow: "0 0 32px rgba(255, 69, 0, 0.2), 0 12px 48px rgba(0,0,0,0.6)",
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      {steps.map((step, i) => {
        const stepEnter = spring({
          frame: frame - delay - i * 6,
          fps,
          config: { damping: 10, stiffness: 220, mass: 0.5 },
        });
        const stepScale = interpolate(stepEnter, [0, 1], [0.8, 1]);
        const stepOpacity = interpolate(stepEnter, [0, 1], [0, 1]);

        return (
          <div
            key={step.name}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 16,
              padding: "27px 33px",
              background: "rgba(255, 69, 0, 0.08)",
              border: "1px solid rgba(255, 69, 0, 0.3)",
              borderRadius: 18,
              opacity: stepOpacity,
              transform: `scale(${stepScale})`,
            }}
          >
            {/* Step number badge */}
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "#FF4500",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                fontWeight: 900,
                color: "#FFFFFF",
                flexShrink: 0,
                boxShadow: "0 0 16px rgba(255, 69, 0, 0.6)",
              }}
            >
              {i + 1}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#FFFFFF" }}>{step.name}</div>
              <div style={{ fontSize: 20, color: "#888888" }}>{step.desc}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
