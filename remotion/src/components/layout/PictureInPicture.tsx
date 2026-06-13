/**
 * PictureInPicture — 画中画布局组件（共享）
 *
 * 横屏 1920×1080：主视频占全屏，小窗叠加在右下角
 *
 * 小窗规格（基于 spec §14.2.2）：
 * - 尺寸：540×303（约 29.7%×28%，原始比例 16:9）
 * - 位置：右下角，距边缘 96px
 * - 圆角：12px
 * - 边框：2px 白色描边
 *
 * 布局（1920×1080）：
 * ┌────────────────────────────┐
 * │                            │ ┌──────┐
 * │     主视频（全屏）          │ │小窗  │
 * │                            │ │右下角 │
 * │                            │ └──────┘
 * │  [字幕条 底部 216px]          │
 * └────────────────────────────┘
 */

import { AbsoluteFill, OffthreadVideo, Img } from "remotion";
import { staticFile } from "remotion";

interface PictureInPictureProps {
  /** 主视频/图片源（全屏背景）*/
  mainSrc?: string;
  mainType?: "video" | "image";
  /** 小窗视频/图片源 */
  pipSrc?: string;
  pipType?: "video" | "image";
  /** 小窗尺寸，默认 540×303 */
  pipWidth?: number;
  pipHeight?: number;
  /** 小窗距离边缘间距，默认 96 */
  pipMargin?: number;
  /** 小窗圆角，默认 12 */
  pipRadius?: number;
  /** 字幕条（底部 216px）*/
  subtitle?: React.ReactNode;
}

const CANVAS_W = 1920;
const CANVAS_H = 1080;
const SUBTITLE_H = 216;

export const PictureInPicture: React.FC<PictureInPictureProps> = ({
  mainSrc,
  mainType = "video",
  pipSrc,
  pipType = "video",
  pipWidth = 540,
  pipHeight = 303,
  pipMargin = 96,
  pipRadius = 12,
  subtitle,
}) => {
  // 小窗位置：右下角
  const pipRight = pipMargin;
  const pipBottom = SUBTITLE_H + pipMargin;

  return (
    <AbsoluteFill>
      {/* 背景黑 */}
      <div style={{ position: "absolute", width: CANVAS_W, height: CANVAS_H, background: "#0A0A0A" }} />

      {/* 主视频/图片（全屏）*/}
      {mainSrc && (
        <div style={{ position: "absolute", width: CANVAS_W, height: CANVAS_H, overflow: "hidden" }}>
          {mainType === "video" ? (
            <OffthreadVideo src={staticFile(mainSrc)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <Img src={staticFile(mainSrc)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          )}
        </div>
      )}

      {/* 小窗（右下角）*/}
      {pipSrc && (
        <div
          style={{
            position: "absolute",
            right: pipRight,
            bottom: pipBottom,
            width: pipWidth,
            height: pipHeight,
            borderRadius: pipRadius,
            overflow: "hidden",
            border: "2px solid rgba(255,255,255,0.8)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.6)",
          }}
        >
          {pipType === "video" ? (
            <OffthreadVideo src={staticFile(pipSrc)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <Img src={staticFile(pipSrc)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          )}
        </div>
      )}

      {/* 字幕条（底部）*/}
      {subtitle && (
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: CANVAS_W,
            height: SUBTITLE_H,
          }}
        >
          {subtitle}
        </div>
      )}
    </AbsoluteFill>
  );
};