// remotion/src/scenes/AuxiliaryContentManager.tsx

import { useCurrentFrame, interpolate, Easing, AbsoluteFill } from "remotion";
import { Img, OffthreadVideo } from "remotion";
import { staticFile } from "remotion";

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

  // 入场动画：opacity 0→1，ease-out，8 帧
  const opacity = interpolate(relFrame, [0, ENTER_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  if (!visible) return null;

  return (
    <div style={{ position: "absolute", width: "100%", height: "100%", opacity: Math.max(0, Math.min(1, opacity)), ...style }}>
      {contentType === "video" && contentSrc && (
        <OffthreadVideo src={staticFile(contentSrc)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      )}
      {contentType === "image" && contentSrc && (
        <Img src={staticFile(contentSrc)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      )}
      {contentType === "data_viz" && children}
      {contentType === "text_card" && children}
    </div>
  );
};