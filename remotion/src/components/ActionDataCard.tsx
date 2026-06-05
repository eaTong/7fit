import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

/**
 * ActionDataCard — 动作数据卡
 *
 * 用于 4 个动作演示镜头的右下角叠加显示。
 * 显示动作名 + 次数 + 组数。
 *
 * Props:
 *   name: 动作名（如 "壁虎推墙"）
 *   reps: 次数区间字符串（如 "12-15" / "各 10-15"）
 *   sets: 组数字符串（如 "3" / "4 字母"）
 *
 * 设计规范（[script.md §5.1] 元素背景 = 半透明 + 彩色）：
 *   - 背景：`#FF4500/15`（半透明橙色，呼应"电红/烈焰橙"主色）
 *   - 边框：`#FF4500` 1px 描边
 *   - 数字：橙色 `#FF4500` 1.5em 粗体
 *   - 文字：纯白 `#FFFFFF`
 *   - 入场：spring 弹跳（damping: 8, stiffness: 200）
 */

export interface ActionDataCardProps {
  name: string;
  reps: string;
  sets: string;
  /** 入场延迟帧数（默认 15 = 0.5s @ 30fps），让视频先露脸再叠卡 */
  delay?: number;
  /** 卡片在屏幕中的位置：右下角（默认） */
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
}

export const ActionDataCard: React.FC<ActionDataCardProps> = ({
  name,
  reps,
  sets,
  delay = 15,
  position = "top-right",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 入场：spring 弹跳（damping 8, stiffness 200, mass 0.5 — 标准入场动效）
  const enter = spring({
    frame: frame - delay,
    fps,
    config: { damping: 8, stiffness: 200, mass: 0.5 },
  });

  // 入场透明度（0 → 1）
  const opacity = interpolate(enter, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 入场位移（top-right 卡片从右滑入 → -40px；其他位置从下方 20px 滑入）
  const isTop = position === "top-right" || position === "top-left";
  const translateX = isTop
    ? interpolate(enter, [0, 1], [40, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;
  const translateY = isTop
    ? 0
    : interpolate(enter, [0, 1], [20, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

  // 位置计算（v2：top-right 默认 + 更大尺寸）
  const positionStyle: React.CSSProperties = (() => {
    switch (position) {
      case "bottom-right":
        return { right: 40, bottom: 100 };
      case "bottom-left":
        return { left: 40, bottom: 100 };
      case "top-right":
        return { right: 40, top: 100 };
      case "top-left":
        return { left: 40, top: 100 };
    }
  })();

  return (
    <div
      style={{
        position: "absolute",
        ...positionStyle,
        opacity,
        transform: `translateX(${translateX}px) translateY(${translateY}px)`,
        // 元素背景：半透明 + 彩色（[script.md §5.1] 硬约束）
        background: "rgba(255, 69, 0, 0.18)",
        border: "2px solid #FF4500",
        borderRadius: 16,
        padding: "18px 28px",
        minWidth: 360,
        backdropFilter: "blur(4px)",  // 玻璃效果
        fontFamily: "-apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif",
        boxShadow: "0 6px 24px rgba(255, 69, 0, 0.3)",
      }}
    >
      {/* 动作名 */}
      <div
        style={{
          color: "#FFFFFF",
          fontSize: 32,
          fontWeight: 700,
          marginBottom: 12,
          letterSpacing: 1,
        }}
      >
        {name}
      </div>

      {/* 数据行：橙色数字 + 白色单位（v2：更大更醒目）*/}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 18,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span
            style={{
              color: "#FF4500",
              fontSize: 56,
              fontWeight: 800,
              lineHeight: 1,
              textShadow: "0 0 16px rgba(255, 69, 0, 0.5)",
            }}
          >
            {reps}
          </span>
          <span style={{ color: "#FFFFFF", fontSize: 24, fontWeight: 500 }}>
            次
          </span>
        </div>

        <span style={{ color: "#888888", fontSize: 28, fontWeight: 300 }}>×</span>

        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span
            style={{
              color: "#FF4500",
              fontSize: 56,
              fontWeight: 800,
              lineHeight: 1,
              textShadow: "0 0 16px rgba(255, 69, 0, 0.5)",
            }}
          >
            {sets}
          </span>
          <span style={{ color: "#FFFFFF", fontSize: 24, fontWeight: 500 }}>
            组
          </span>
        </div>
      </div>
    </div>
  );
};
