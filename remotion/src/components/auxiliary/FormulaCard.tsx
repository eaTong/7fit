import { useCurrentFrame, interpolate, spring } from "remotion";
import { useVideoConfig } from "remotion";

interface FormulaCardProps {
  formula: string;
  resultLabel?: string;
  delay?: number;
}

export const FormulaCard: React.FC<FormulaCardProps> = ({
  formula,
  resultLabel,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame: frame - delay, fps, config: { damping: 8, stiffness: 200, mass: 0.5 } });
  const scale = interpolate(enter, [0, 1], [0.8, 1]);
  const opacity = interpolate(enter, [0, 1], [0, 1]);

  const parts = formula.split(/([×*=+\-\/])/);

  // 结果 glow 脉冲
  const resultGlow = interpolate(
    Math.sin((frame - delay) * 0.04),
    [-1, 1],
    [0.5, 1]
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
        padding: "40px 60px",
        background: "rgba(10, 10, 20, 0.88)",
        backdropFilter: "blur(8px)",
        border: "2px solid rgba(255, 69, 0, 0.4)",
        borderRadius: 16,
        boxShadow: "0 0 20px rgba(255, 69, 0, 0.15), 0 8px 32px rgba(0,0,0,0.6)",
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      {/* 公式行 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          fontFamily: '"JetBrains Mono", monospace',
        }}
      >
        {parts.map((part, i) => {
          const isOperator = /^[×*=+\-\/]$/.test(part.trim());
          const isEquals = part === "=";
          const isResult = i === parts.length - 1 || (isEquals && i === parts.length - 2);

          // 每个部分依次弹出
          const partEnter = spring({
            frame: frame - delay - i * 3,
            fps,
            config: { damping: 12, stiffness: 200, mass: 0.5 },
          });
          const partScale = interpolate(partEnter, [0, 1], [0.3, 1]);
          const partOpacity = interpolate(partEnter, [0, 1], [0, 1]);

          if (isEquals) {
            return (
              <span key={i} style={{ fontSize: 56, color: "#FFFFFF", fontWeight: 600, opacity: partOpacity, transform: `scale(${partScale})` }}>
                {part}
              </span>
            );
          }
          if (isOperator) {
            return (
              <span key={i} style={{ fontSize: 48, color: "#888888", opacity: partOpacity }}>
                {part}
              </span>
            );
          }
          return (
            <span
              key={i}
              style={{
                fontSize: isResult ? 96 : 64,
                fontWeight: 900,
                color: isResult ? "#FF4500" : "#FFFFFF",
                textShadow: isResult ? `0 0 ${40 * resultGlow}px rgba(255, 69, 0, ${0.5 + 0.3 * resultGlow})` : "none",
                opacity: partOpacity,
                transform: `scale(${partScale})`,
                transition: isResult ? "text-shadow 0.1s" : "none",
              }}
            >
              {part.trim()}
            </span>
          );
        })}
      </div>

      {/* 结果标签 */}
      {resultLabel && (
        <div
          style={{
            fontSize: 24,
            color: "#888888",
            borderTop: "1px solid rgba(255, 69, 0, 0.3)",
            paddingTop: 16,
            marginTop: 8,
          }}
        >
          {resultLabel}
        </div>
      )}
    </div>
  );
};
