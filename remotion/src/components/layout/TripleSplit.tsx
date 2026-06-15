/**
 * TripleSplit — 三分屏布局组件（共享）
 *
 * 横屏 1920×1080：三区域分割显示不同内容
 *
 * 布局（基于 spec §14.3.2）：
 * 上：中景（全身/动作）55% / 下：细节 45%
 * 左：参数卡 / 右：字幕
 *
 * 懒人模式（A/B/C 类预设）+ 自定义模式
 *
 * 懒人模式 A（推荐）：自动三等分
 * ┌───────┬───────┐
 * │ 全景  │ 细节  │
 * │  50%  │  50%  │
 * ├───────┼───────┤
 * │ 参数卡 │ 字幕  │
 * │  50%  │  50% │
 * └───────┴───────┘
 */

import { AbsoluteFill, OffthreadVideo, Img } from "remotion";
import { staticFile } from "remotion";

type MediaType = "video" | "image";

interface TripleSplitMedia {
  src?: string;
  type?: MediaType;
  /** 自定义 CSS 类名（用于内容组件注入）*/
  className?: string;
}

interface TripleSplitProps {
  /**
   * 懒人预设模式：
   * "action" — 上：动作全景+细节 / 下：参数卡+字幕
   * "对比" — 左：错误 / 右：正确（字幕在底部）
   * 自定义：传各区域内容
   */
  mode?: "action" | "对比" | "custom";
  /** 上左区域（懒人模式 A：全景 55%）*/
  topLeft?: TripleSplitMedia;
  /** 上右区域（懒人模式 A：动作细节）*/
  topRight?: TripleSplitMedia;
  /** 下左区域（懒人模式 A：参数卡）*/
  bottomLeft?: TripleSplitMedia;
  /** 下右区域（字幕/收尾 CTA）*/
  bottomRight?: React.ReactNode;
  /** 字幕区高度，默认 216 */
  subtitleHeight?: number;
}

const CANVAS_W = 1920;
const CANVAS_H = 1080;
const SUBTITLE_H = 216;
const UPPER_H = CANVAS_H - SUBTITLE_H;  // 864

export const TripleSplit: React.FC<TripleSplitProps> = ({
  mode = "action",
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  subtitleHeight = SUBTITLE_H,
}) => {
  const halfW = CANVAS_W / 2;
  const upperH = UPPER_H;
  const lowerH = CANVAS_H - upperH - subtitleHeight;

  const MediaSlot: React.FC<{ media: TripleSplitMedia | undefined; style?: React.CSSProperties }> = ({ media, style }) => {
    if (!media?.src) return null;
    return (
      <div style={{ position: "absolute", overflow: "hidden", ...style }}>
        {media.type === "image" ? (
          <Img src={staticFile(media.src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <OffthreadVideo muted src={staticFile(media.src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        )}
      </div>
    );
  };

  if (mode === "对比") {
    // 对比模式：左右对半，下方字幕
    return (
      <AbsoluteFill>
        <div style={{ position: "absolute", width: CANVAS_W, height: CANVAS_H, background: "#0A0A0A" }} />
        {/* 左：错误示范 */}
        <MediaSlot media={topLeft} style={{ left: 0, top: 0, width: halfW, height: UPPER_H }} />
        {/* 右：正确示范 */}
        <MediaSlot media={topRight} style={{ left: halfW, top: 0, width: halfW, height: UPPER_H }} />
        {/* 分隔线 */}
        <div style={{ position: "absolute", top: 0, left: halfW, width: 2, height: UPPER_H, background: "#FFFFFF" }} />
        {/* 底部字幕区 */}
        <div style={{ position: "absolute", left: 0, bottom: 0, width: CANVAS_W, height: subtitleHeight }}>
          {bottomRight}
        </div>
      </AbsoluteFill>
    );
  }

  // 默认 action 模式：上下两行，下行左右两区
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", width: CANVAS_W, height: CANVAS_H, background: "#0A0A0A" }} />
      {/* 上部：全景 + 细节 */}
      <MediaSlot media={topLeft} style={{ left: 0, top: 0, width: halfW, height: upperH }} />
      <MediaSlot media={topRight} style={{ left: halfW, top: 0, width: halfW, height: upperH }} />
      {/* 分割线 */}
      <div style={{ position: "absolute", top: upperH, left: 0, width: CANVAS_W, height: 2, background: "#333" }} />
      {/* 下部：参数卡 + 字幕 */}
      <MediaSlot media={bottomLeft} style={{ left: 0, top: upperH, width: halfW, height: lowerH }} />
      {/* 字幕区 */}
      <div style={{ position: "absolute", left: halfW, top: upperH, width: halfW, height: lowerH }}>
        {bottomRight}
      </div>
    </AbsoluteFill>
  );
};