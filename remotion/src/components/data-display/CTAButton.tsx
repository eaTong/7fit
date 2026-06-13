import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

/**
 * CTAButton — 收尾 CTA 按钮
 *
 * 用于视频结尾的"去试试 / 评论区交作业"提示。
 * 屏幕中央显示，配合钩子对比视频回放。
 *
 * Props:
 *   text: 主标题（如 "去试试"）
 *   subtext: 副标题（如 "评论区交作业"）
 *
 * 设计规范（[script.md §5.1]）：
 *   - 主背景：实色 #0A0A0A 半透明遮罩
 *   - 主按钮：橙色 #FF4500 实色背景 + 白色文字
 *   - 入场：spring 弹跳 + 轻微 scale 缩放
 */

export interface CTAButtonProps {
  text: string;
  subtext: string;
  /** 入场延迟帧数（默认 30 = 1s @ 30fps） */
  delay?: number;
}

export const CTAButton: React.FC<CTAButtonProps> = ({
  text,
  subtext,
  delay = 30,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 入场：spring 弹跳
  const enter = spring({
    frame: frame - delay,
    fps,
    config: { damping: 8, stiffness: 200, mass: 0.5 },
  });

  const opacity = interpolate(enter, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 按钮自身从 0.85 缩放到 1.0（轻微"弹"出）
  const scale = interpolate(enter, [0, 1], [0.85, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          padding: 48,
          // 半透明黑色遮罩（让背景视频仍可见）
          background: "rgba(10, 10, 10, 0.6)",
          borderRadius: 24,
          backdropFilter: "blur(8px)",
          border: "2px solid #FF4500",
        }}
      >
        {/* 主 CTA 按钮 */}
        <div
          style={{
            background: "#FF4500",
            color: "#FFFFFF",
            padding: "20px 60px",
            borderRadius: 16,
            fontSize: 56,
            fontWeight: 800,
            letterSpacing: 2,
            boxShadow: "0 8px 32px rgba(255, 69, 0, 0.5)",
            fontFamily: "-apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif",
          }}
        >
          {text}
        </div>

        {/* 副标题 */}
        <div
          style={{
            color: "#FFFFFF",
            fontSize: 28,
            fontWeight: 500,
            letterSpacing: 1,
            fontFamily: "-apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif",
          }}
        >
          {subtext}
        </div>
      </div>
    </AbsoluteFill>
  );
};
