import { useCurrentFrame, interpolate, spring } from "remotion";
import { useVideoConfig } from "remotion";

interface TreeEntry {
  name: string;
  type: "dir" | "file";
  children?: TreeEntry[];
}

interface FolderTreeProps {
  entries: TreeEntry[];
  delay?: number;
  style?: React.CSSProperties;
}

interface TreeLineProps {
  prefix: string;
  isLast: boolean;
  name: string;
  type: "dir" | "file";
  enterDelay: number;
}

const TreeLine: React.FC<TreeLineProps> = ({ prefix, isLast, name, type, enterDelay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: frame - enterDelay,
    fps,
    config: { damping: 10, stiffness: 180, mass: 0.5 },
  });
  const opacity = interpolate(enter, [0, 1], [0, 1]);
  const x = interpolate(enter, [0, 1], [-20, 0]);

  const connector = isLast ? "└── " : "├── ";
  const icon = type === "dir" ? "📁" : "📄";
  const nameColor = type === "dir" ? "#FF4500" : "#FFFFFF";

  return (
    <div
      key={`${name}-${enterDelay}`}
      style={{ opacity, transform: `translateX(${x}px)`, whiteSpace: "nowrap" }}
    >
      <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 14, color: "#666888" }}>
        {prefix}{connector}
      </span>
      <span style={{ fontSize: 16 }}>{icon} </span>
      <span
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 14,
          color: nameColor,
          fontWeight: type === "dir" ? 700 : 400,
        }}
      >
        {name}
      </span>
    </div>
  );
};

export const FolderTree: React.FC<FolderTreeProps> = ({ entries, delay = 0, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame: frame - delay, fps, config: { damping: 8, stiffness: 200, mass: 0.5 } });
  const slideX = interpolate(enter, [0, 1], [-30, 0]);
  const opacity = interpolate(enter, [0, 1], [0, 1]);

  let globalIndex = 0;

  const renderEntries = (
    items: TreeEntry[],
    prefix: string,
    depth: number
  ): React.ReactNode[] => {
    const result: React.ReactNode[] = [];
    items.forEach((item, idx) => {
      const isLast = idx === items.length - 1;
      result.push(
        <TreeLine
          key={`${item.name}-${globalIndex}`}
          prefix={prefix}
          isLast={isLast}
          name={item.name}
          type={item.type}
          enterDelay={delay + globalIndex * 4}
        />
      );
      globalIndex++;
      if (item.children) {
        const childPrefix = prefix + (isLast ? "    " : "│   ");
        result.push(...renderEntries(item.children, childPrefix, depth + 1));
      }
    });
    return result;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        padding: "20px 24px",
        background: "rgba(10, 10, 20, 0.88)",
        backdropFilter: "blur(8px)",
        border: "2px solid rgba(255, 69, 0, 0.4)",
        borderRadius: 12,
        boxShadow: "0 0 16px rgba(255, 69, 0, 0.15), 0 8px 32px rgba(0,0,0,0.6)",
        opacity,
        transform: `translateX(${slideX}px)`,
        overflow: "hidden",
        ...style,
      }}
    >
      {renderEntries(entries, "", 0)}
    </div>
  );
};
