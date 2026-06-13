import { AbsoluteFill } from "remotion";
import { LayoutTransitionEngine } from "../LayoutTransitionEngine";
import { ShotContent } from "../ShotContent";
import type { ShotEntry } from "../layouts/types";

// TODO: 素材路径占位符，替换为真实素材后再渲染
// - videoSrc: videos/talking_head.mov → 替换为实际口播视频
// - contentSrc: images/demo.jpg → 替换为实际图片素材
const shotSequence: ShotEntry[] = [
  { shotId: "s1", layoutId: "fullscreen",              transitionType: "ease-out",   startFrame: 0,    endFrame: 90 },
  { shotId: "s2", layoutId: "left_text_right_talking", transitionType: "slide-left", startFrame: 90,   endFrame: 210 },
  { shotId: "s3", layoutId: "pip_bottom_right",        transitionType: "zoom",       startFrame: 210,  endFrame: 360 },
  { shotId: "s4", layoutId: "grid_2x2",                 transitionType: "fade",      startFrame: 360,  endFrame: 540 },
  { shotId: "s5", layoutId: "left_text_right_talking_50pct", transitionType: "push_left", startFrame: 540, endFrame: 720 },
];

export const WorkoutIntro: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#0A0A0A" }}>
      <LayoutTransitionEngine
        videoSrc="videos/talking_head.mov"
        shotSequence={shotSequence}
      >
        {(_, curLayout, __, currentShotId) => (
          <ShotContent
            currentShotId={currentShotId}
            contentType="image"
            contentSrc="images/demo.jpg"
            curLayout={curLayout}
          />
        )}
      </LayoutTransitionEngine>
    </AbsoluteFill>
  );
};