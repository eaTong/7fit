// remotion/src/scenes/AnimatedTalkingHead.tsx

import { AbsoluteFill, OffthreadVideo, useCurrentFrame, interpolate, Easing } from "remotion";
import { staticFile } from "remotion";
import { LayoutState } from "./layouts/types";

const TRANSITION_FRAMES = 30; // 30fps × 1s 过渡动画

const EASING_MAP: Record<string, (t: number) => number> = {
  "spring":          (t) => Easing.bezier(0.34, 1.56, 0.64, 1)(t),
  "ease-out":        Easing.out(Easing.cubic),
  "ease-in-out":     Easing.inOut(Easing.cubic),
  "crisp":           Easing.bezier(0.16, 1, 0.3, 1),
  "standard":        Easing.bezier(0.4, 0, 0.2, 1),
};

interface AnimatedTalkingHeadProps {
  videoSrc: string;
  prevLayout: LayoutState;
  curLayout: LayoutState;
  transitionType: string;
}

export const AnimatedTalkingHead: React.FC<AnimatedTalkingHeadProps> = ({
  videoSrc,
  prevLayout,
  curLayout,
  transitionType = "ease-out",
}) => {
  const frame = useCurrentFrame();
  const easing = EASING_MAP[transitionType] ?? EASING_MAP["ease-out"];

  const left    = interpolate(frame, [0, TRANSITION_FRAMES], [prevLayout.left, curLayout.left], { easing, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const top     = interpolate(frame, [0, TRANSITION_FRAMES], [prevLayout.top, curLayout.top], { easing, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const width  = interpolate(frame, [0, TRANSITION_FRAMES], [prevLayout.width, curLayout.width], { easing, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const height = interpolate(frame, [0, TRANSITION_FRAMES], [prevLayout.height, curLayout.height], { easing, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const radius = interpolate(frame, [0, TRANSITION_FRAMES], [prevLayout.borderRadius, curLayout.borderRadius], { easing, extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{
      position: "absolute",
      left, top, width, height,
      borderRadius: radius,
      overflow: "hidden",
      border: curLayout.borderWidth > 0 ? `${curLayout.borderWidth}px solid ${curLayout.borderColor}` : "none",
      boxShadow: curLayout.shadow === "none" ? undefined : curLayout.shadow,
      zIndex: curLayout.zIndex,
    }}>
      <OffthreadVideo
        src={staticFile(videoSrc)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
};