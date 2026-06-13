import { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { AnimatedTalkingHead } from "./AnimatedTalkingHead";
import { getLayout } from "./layouts";
import type { LayoutState, ShotEntry } from "./layouts/types";

interface LayoutTransitionEngineProps {
  videoSrc: string;
  shotSequence: ShotEntry[];
  children: (
    prevLayout: LayoutState,
    curLayout: LayoutState,
    transitionType: string,
    currentShotId: string,
  ) => React.ReactNode;
}

export const LayoutTransitionEngine: React.FC<LayoutTransitionEngineProps> = ({
  videoSrc,
  shotSequence,
  children,
}) => {
  const frame = useCurrentFrame();

  // 找到当前 frame 对应的 shot（线性扫描，小于 20 个 shot 无需优化）
  const currentShot = useMemo(() => {
    return shotSequence.find((s) => frame >= s.startFrame && frame < s.endFrame)
      ?? shotSequence[shotSequence.length - 1];
  }, [frame, shotSequence]);

  const currentIndex = shotSequence.indexOf(currentShot);
  const prevShot = currentIndex > 0 ? shotSequence[currentIndex - 1] : null;

  const curLayout = useMemo(
    () => getLayout(currentShot.layoutId) ?? getLayout("fullscreen")!,
    [currentShot.layoutId]
  );
  const prevLayout = useMemo(
    () => (prevShot ? (getLayout(prevShot.layoutId) ?? curLayout) : curLayout),
    [prevShot, curLayout]
  );

  return (
    <AbsoluteFill>
      <AnimatedTalkingHead
        videoSrc={videoSrc}
        prevLayout={prevLayout}
        curLayout={curLayout}
        transitionType={currentShot.transitionType}
      />
      {children(prevLayout, curLayout, currentShot.transitionType, currentShot.shotId)}
    </AbsoluteFill>
  );
};