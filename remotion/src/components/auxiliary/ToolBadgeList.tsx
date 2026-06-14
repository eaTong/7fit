import { useCurrentFrame, interpolate, spring } from "remotion";
import { useVideoConfig } from "remotion";
import { staticFile } from "remotion";

interface ToolBadgeListProps {
  tools: string[];
  logoUrls?: string[];
  delay?: number;
}

// 本地 logo 路径（优先）
const LOCAL_LOGOS: Record<string, string> = {
  "Claude Code": "images/logos/claude-code.png",
  "mmx": "images/logos/mmx.png",
  "Remotion": "images/logos/remotion.png",
};

// 远程 logo URL（本地没有时 fallback）
const REMOTE_LOGOS: Record<string, string> = {
  "Figma": "https://logo.clearbit.com/figma.com",
  "Notion": "https://logo.clearbit.com/notion.so",
  "Linear": "https://logo.clearbit.com/linear.app",
  "Vercel": "https://logo.clearbit.com/vercel.com",
  "GitHub": "https://logo.clearbit.com/github.com",
  "ChatGPT": "https://logo.clearbit.com/openai.com",
  "Hyperframes": "https://logo.clearbit.com/github.com",
};

export const ToolBadgeList: React.FC<ToolBadgeListProps> = ({
  tools,
  logoUrls,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 40,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {tools.map((tool, i) => {
        const enter = spring({
          frame: frame - delay - i * 8,
          fps,
          config: { damping: 8, stiffness: 200, mass: 0.5 },
        });

        const scale = interpolate(enter, [0, 1], [0.7, 1]);
        const opacity = interpolate(enter, [0, 1], [0, 1]);
        const y = interpolate(enter, [0, 1], [20, 0]);

        const logoSrc = logoUrls?.[i] ?? LOCAL_LOGOS[tool] ?? REMOTE_LOGOS[tool];

        return (
          <div
            key={tool}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              padding: "32px 40px",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(8px)",
              border: "2px solid rgba(255, 69, 0, 0.6)",
              borderRadius: 16,
              boxShadow: "0 0 32px rgba(255, 69, 0, 0.3)",
              opacity,
              transform: `scale(${scale}) translateY(${y}px)`,
            }}
          >
            {/* Logo — 192×192 大图标 */}
            {logoSrc && (
              logoSrc.startsWith("images/") ? (
                <img
                  src={staticFile(logoSrc)}
                  alt={tool}
                  style={{
                    width: 192,
                    height: 192,
                    objectFit: "contain",
                    borderRadius: 16,
                  }}
                />
              ) : (
                <img
                  src={logoSrc}
                  alt={tool}
                  style={{
                    width: 192,
                    height: 192,
                    objectFit: "contain",
                    borderRadius: 16,
                  }}
                />
              )
            )}
            {/* 工具名 — 44px 大字 */}
            <span
              style={{
                fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                fontSize: 44,
                color: "#1A1A1A",
                fontWeight: 800,
                textAlign: "center",
              }}
            >
              {tool}
            </span>
          </div>
        );
      })}
    </div>
  );
};
