// remotion/src/scenes/AnimatedTalkingHead.tsx

import { useCurrentFrame, interpolate, Easing } from "remotion";
import { LayoutState, TransitionEasing } from "./layouts/types";
import { MediaFallback } from "../components/media/MediaFallback";

const TRANSITION_FRAMES = 30; // 30fps × 1s 过渡动画（减半）

const MIN_RADIUS = 20; // 默认最小圆角（防止 borderRadius=0 的硬边）

const EASING_MAP: Record<string, (t: number) => number> = {
  "spring":          (t) => Easing.bezier(0.34, 1.56, 0.64, 1)(t),
  "ease-out":        Easing.out(Easing.cubic),
  "ease-in-out":     Easing.inOut(Easing.cubic),
  "crisp":           Easing.bezier(0.16, 1, 0.3, 1),
  "standard":        Easing.bezier(0.4, 0, 0.2, 1),
  "slide-left":      Easing.out(Easing.cubic),
  "slide-right":     Easing.out(Easing.cubic),
  "push_left":       Easing.out(Easing.cubic),
  "zoom":            Easing.out(Easing.cubic),
  "fade":            Easing.out(Easing.cubic),
};

interface AnimatedTalkingHeadProps {
  videoSrc: string;
  prevLayout: LayoutState;
  curLayout: LayoutState;
  shotStartFrame: number;
  transitionType: TransitionEasing;
  /** 强制渲染为正圆（borderRadius = squareSize/2），用于 circleTransition 场景 */
  isCircle?: boolean;
  /** 边缘羽化颜色，默认为白色（匹配深色背景）*/
  edgeGlowColor?: string;
  /** 口播作为背景层（全屏半透明铺底）*/
  isBackground?: boolean;
  /** 背景层透明度（0~1）*/
  bgOpacity?: number;
}

export const AnimatedTalkingHead: React.FC<AnimatedTalkingHeadProps> = ({
  videoSrc,
  prevLayout,
  curLayout,
  shotStartFrame,
  transitionType = "ease-out",
  isCircle = false,
  edgeGlowColor = "rgba(255,255,255,0.5)",
  isBackground = false,
  bgOpacity = 1,
}) => {
  const frame = useCurrentFrame();
  const relFrame = frame - shotStartFrame;
  const easing = EASING_MAP[transitionType] ?? EASING_MAP["ease-out"];

  const left   = interpolate(relFrame, [0, TRANSITION_FRAMES], [prevLayout.left, curLayout.left], { easing, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const top    = interpolate(relFrame, [0, TRANSITION_FRAMES], [prevLayout.top, curLayout.top], { easing, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const width  = interpolate(relFrame, [0, TRANSITION_FRAMES], [prevLayout.width, curLayout.width], { easing, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const height = interpolate(relFrame, [0, TRANSITION_FRAMES], [prevLayout.height, curLayout.height], { easing, extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // canvas 居中（fullscreen 以 canvas 中心为基准）
  const CANVAS_W = 1920;
  const CANVAS_H = 1080;
  const isFullscreen = curLayout.id === "fullscreen";
  const isBgMode = isBackground || curLayout.isBackgroundLayer;
  const opacity = isBgMode ? (curLayout.bgOpacity ?? bgOpacity) : 1;

  // 分屏布局留白边，防止顶着屏幕边缘或邻侧素材
  const PADDING = 50;

  const effectiveLeft   = left   + PADDING;
  const effectiveTop    = top    + PADDING;
  const effectiveWidth  = width  - PADDING * 2;
  const effectiveHeight = height - PADDING * 2;

  // 正方形尺寸：统一取宽高较小值减去 padding
  // 全屏 → 以 canvas 高度为正方形边长（竖屏视频适配全屏）
  // 分屏布局 → 以当前布局宽高较小值为边长
  const rawSquare = isFullscreen
    ? CANVAS_H
    : Math.min(width, height);

  const squareSize = rawSquare - PADDING * 2;

  // 正方形容器定位：基于正方形尺寸重新计算 left/top（保证动画全程正方形）
  // 当前布局的 center → 正方形容器 center
  const curCenterX = effectiveLeft + effectiveWidth / 2;
  const curCenterY = effectiveTop  + effectiveHeight / 2;
  const prevCenterX = prevLayout.left + PADDING + (prevLayout.width  - PADDING * 2) / 2;
  const prevCenterY = prevLayout.top  + PADDING + (prevLayout.height - PADDING * 2) / 2;

  const squareLeft = interpolate(relFrame, [0, TRANSITION_FRAMES], [prevCenterX, curCenterX], { easing, extrapolateLeft: "clamp", extrapolateRight: "clamp" }) - squareSize / 2;
  const squareTop  = interpolate(relFrame, [0, TRANSITION_FRAMES], [prevCenterY, curCenterY], { easing, extrapolateLeft: "clamp", extrapolateRight: "clamp" }) - squareSize / 2;

  // 圆形：borderRadius = squareSize / 2
  const rawRadius = interpolate(relFrame, [0, TRANSITION_FRAMES], [prevLayout.borderRadius, curLayout.borderRadius], { easing, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const circleRadius = squareSize / 2;

  // isCircle=true 时强制使用圆形 radius，否则取布局值（但不低于 MIN_RADIUS）
  const finalRadius = isCircle
    ? circleRadius
    : Math.max(rawRadius, MIN_RADIUS);

  // 边缘羽化：用多层 box-shadow 模拟内外羽化
  const innerGlow = `0 0 ${isCircle ? 4 : 2}px ${edgeGlowColor}`;
  const outerGlow = `0 0 ${isCircle ? 20 : 8}px ${edgeGlowColor.replace("0.5", "0.2")}`;
  const softGlow  = `0 0 ${isCircle ? 60 : 20}px ${edgeGlowColor.replace("0.5", "0.08")}`;
  const glowShadow = `${innerGlow}, ${outerGlow}, ${softGlow}`;

  return (
    <div
      style={{
        position: "absolute",
        // 背景模式：全画布铺满，不做 square 居中
        left: isBgMode ? 0 : squareLeft,
        top: isBgMode ? 0 : squareTop,
        width: isBgMode ? CANVAS_W : squareSize,
        height: isBgMode ? CANVAS_H : squareSize,
        borderRadius: isBgMode ? 0 : finalRadius,
        overflow: "hidden",
        border: "none",
        boxShadow: isBgMode ? "none" : glowShadow,
        zIndex: isBgMode ? 5 : curLayout.zIndex,
        opacity,
      }}
    >
      <MediaFallback
        src={videoSrc}
        type="video"
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          left: 0,
          top: 0,
          // 竖屏视频（如 9:16）放在横屏容器（1920×1080 画布）里：
          // - 容器更窄（竖屏布局如 480×864）→ 用 contain 完整显示，避免切掉头顶下巴
          // - 容器更宽（全屏等）→ 用 cover 填满
          objectFit: effectiveWidth < squareSize ? "contain" : "cover",
          // contain 模式下居中（口播视频通常是竖屏，人物居中）
          objectPosition: effectiveWidth < squareSize ? "center center" : "center center",
        }}
      />
    </div>
  );
};
