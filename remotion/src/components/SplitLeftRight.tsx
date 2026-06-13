/**
 * SplitLeftRight — 左文右图横屏布局组件（共享）
 *
 * 横屏 1920×1080：左侧 40% 放文字，右侧 60% 放视频/图片
 *
 * 布局（1920×1080）：
 * ┌────────────────────────────┐
 * │  文字区 768px  │  视频区 1152px  │
 * │  left: 0      │  left: 768        │
 * └────────────────────────────┘
 * 字幕条：底部 216px
 */

import { AbsoluteFill, OffthreadVideo, Img } from "remotion";
import { staticFile } from "remotion";

interface SplitLeftRightProps {
  /** 左侧文字区域内容（React 节点）*/
  left: React.ReactNode;
  /** 右侧视频/图片源 */
  rightSrc?: string;
  /** 右侧媒体类型 */
  rightType?: "video" | "image";
  /** 字幕区域（底部 216px）*/
  subtitle?: React.ReactNode;
  /** 字幕高度，默认 216 */
  subtitleHeight?: number;
}

const CANVAS_W = 1920;
const CANVAS_H = 1080;
const LEFT_W = Math.round(CANVAS_W * 0.4);   // 768px
const RIGHT_W = CANVAS_W - LEFT_W;            // 1152px

export const SplitLeftRight: React.FC<SplitLeftRightProps> = ({
  left,
  rightSrc,
  rightType = "video",
  subtitle,
  subtitleHeight = 216,
}) => {
  return (
    <AbsoluteFill>
      {/* 背景黑 */}
      <div style={{ position: "absolute", width: CANVAS_W, height: CANVAS_H, background: "#0A0A0A" }} />

      {/* 左侧文字区 40% */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: LEFT_W,
          height: CANVAS_H,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 32px",
        }}
      >
        {left}
      </div>

      {/* 右侧视频/图片 60% */}
      {rightSrc && (
        <div
          style={{
            position: "absolute",
            left: LEFT_W,
            top: 0,
            width: RIGHT_W,
            height: CANVAS_H,
            overflow: "hidden",
          }}
        >
          {rightType === "video" ? (
            <OffthreadVideo
              src={staticFile(rightSrc)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <Img
              src={staticFile(rightSrc)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}
        </div>
      )}

      {/* 底部字幕条 */}
      {subtitle && (
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: CANVAS_W,
            height: subtitleHeight,
          }}
        >
          {subtitle}
        </div>
      )}
    </AbsoluteFill>
  );
};