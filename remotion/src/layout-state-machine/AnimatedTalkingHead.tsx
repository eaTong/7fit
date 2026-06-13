// remotion/src/scenes/AnimatedTalkingHead.tsx

import { useCurrentFrame, interpolate, Easing } from "remotion";
import { LayoutState, TransitionEasing } from "./layouts/types";
import { MediaFallback } from "../components/MediaFallback";

const TRANSITION_FRAMES = 60; // 30fps × 2s 过渡动画（让 morphing 更明显）

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
  /** 上一帧的布局（morph 起点）*/
  prevLayout: LayoutState;
  /** 当前帧的布局（morph 终点）*/
  curLayout: LayoutState;
  /** 当前 shot 的起始帧（用于相对帧计算）*/
  shotStartFrame: number;
  transitionType: TransitionEasing;
}

export const AnimatedTalkingHead: React.FC<AnimatedTalkingHeadProps> = ({
  videoSrc,
  prevLayout,
  curLayout,
  shotStartFrame,
  transitionType = "ease-out",
}) => {
  const frame = useCurrentFrame();
  const relFrame = frame - shotStartFrame; // 相对帧：从 shot 起始位置算
  const easing = EASING_MAP[transitionType] ?? EASING_MAP["ease-out"];

  const left    = interpolate(relFrame, [0, TRANSITION_FRAMES], [prevLayout.left, curLayout.left], { easing, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const top     = interpolate(relFrame, [0, TRANSITION_FRAMES], [prevLayout.top, curLayout.top], { easing, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const width  = interpolate(relFrame, [0, TRANSITION_FRAMES], [prevLayout.width, curLayout.width], { easing, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const height = interpolate(relFrame, [0, TRANSITION_FRAMES], [prevLayout.height, curLayout.height], { easing, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const radius = interpolate(relFrame, [0, TRANSITION_FRAMES], [prevLayout.borderRadius, curLayout.borderRadius], { easing, extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 正方形：以 width 和 height 中较小的值作为边长
  const squareSize = Math.min(width, height);

  // 分屏布局（layout 非 fullscreen）：在 layout 区域内居中
  // fullscreen：口播占满主区域，以 canvas 中心为基准垂直居中
  const CANVAS_W = 1920;
  const CANVAS_H = 1080;
  const isFullscreen = curLayout.id === "fullscreen";

  const squareLeft = isFullscreen
    ? (CANVAS_W - squareSize) / 2       // canvas 水平居中
    : left + (width - squareSize) / 2;   // layout 区域内水平居中

  const squareTop = isFullscreen
    ? (CANVAS_H - squareSize) / 2       // canvas 垂直居中
    : top + (height - squareSize) / 2;   // layout 区域内垂直居中

  return (
    <div
      style={{
        position: "absolute",
        left: squareLeft,
        top: squareTop,
        width: squareSize,
        height: squareSize,
        borderRadius: radius,
        overflow: "hidden",
        border: curLayout.borderWidth > 0 ? `${curLayout.borderWidth}px solid ${curLayout.borderColor}` : "none",
        boxShadow: curLayout.shadow === "none" ? undefined : curLayout.shadow,
        zIndex: curLayout.zIndex,
      }}
    >
      <MediaFallback
        src={videoSrc}
        type="video"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
};