// remotion/src/scenes/AuxiliaryContentManager.tsx

import { useCurrentFrame, interpolate, Easing } from "remotion";
import { useRef } from "react";
import { MediaFallback } from "../components/MediaFallback";

const ENTER_FRAMES = 8;
const EXIT_FRAMES = 8;

interface AuxiliaryContentManagerProps {
  contentType: "video" | "image" | "data_viz" | "text_card" | "pause_breath";
  contentSrc?: string;
  enterFrame: number;   // 入场帧（相对 shot 起始）
  visible: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const AuxiliaryContentManager: React.FC<AuxiliaryContentManagerProps> = ({
  contentType,
  contentSrc,
  enterFrame,
  visible,
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  const relFrame = frame - enterFrame;
  const wasVisibleRef = useRef(false);

  // Track if content was previously visible (for exit animation)
  if (visible) wasVisibleRef.current = true;
  const wasVisible = wasVisibleRef.current;

  // 入场动画：opacity 0→1，ease-out，8 帧
  const enterOpacity = interpolate(relFrame, [0, ENTER_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // 退场动画：opacity 1→0，ease-in，8 帧
  const exitOpacity = interpolate(
    Math.max(0, EXIT_FRAMES - relFrame),
    [0, EXIT_FRAMES],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.in(Easing.cubic),
    }
  );

  // pause_breath 不渲染任何内容
  if (contentType === "pause_breath") return null;

  if (!visible && !wasVisible) return null;

  // 计算最终 opacity：入场优先于退场
  let finalOpacity = visible ? enterOpacity : 0;
  if (!visible && wasVisible) {
    finalOpacity = exitOpacity;
  }

  return (
    <div style={{ position: "absolute", width: "100%", height: "100%", opacity: Math.max(0, Math.min(1, finalOpacity)), ...style }}>
      {contentType === "video" && (
        <MediaFallback src={contentSrc} type="video" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      )}
      {contentType === "image" && (
        <MediaFallback src={contentSrc} type="image" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      )}
      {contentType === "data_viz" && children}
      {contentType === "text_card" && children}
    </div>
  );
};