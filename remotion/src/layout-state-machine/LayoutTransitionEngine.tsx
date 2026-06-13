import { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { AnimatedTalkingHead } from "./AnimatedTalkingHead";
import { MediaFallback } from "../components/MediaFallback";
import { getLayout } from "./layouts";
import type { LayoutState, ShotEntry } from "./layouts/types";

interface LayoutTransitionEngineProps {
  videoSrc: string;
  shotSequence: ShotEntry[];

  /** 统一静态背景（所有 shot 相同）*/
  backgroundSrc?: string;
  backgroundType?: "video" | "image";

  /** 自定义背景渲染函数（优先级高于 backgroundSrc）
   *  适用场景：每个 shot 不同背景、背景视频、渐变、light leak 等
   *  签名：(currentShot, curLayout) => React.ReactNode
   */
  renderBackground?: (currentShot: ShotEntry, curLayout: LayoutState) => React.ReactNode;

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
  backgroundSrc,
  backgroundType = "image",
  renderBackground,
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

  // 渲染背景层（优先级：renderBackground > backgroundSrc > 无背景）
  const renderBackgroundLayer = () => {
    if (renderBackground) {
      return renderBackground(currentShot, curLayout);
    }
    if (backgroundSrc) {
      return (
        <MediaFallback
          src={backgroundSrc}
          type={backgroundType}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      );
    }
    return null;
  };

  if (!shotSequence.length) {
    const fallbackLayout = getLayout("fullscreen")!;
    return (
      <AbsoluteFill>
        {renderBackgroundLayer()}
        <AnimatedTalkingHead
          videoSrc={videoSrc}
          prevLayout={fallbackLayout}
          curLayout={fallbackLayout}
          transitionType="ease-out"
        />
        {children(fallbackLayout, fallbackLayout, "ease-out", "")}
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill>
      {/* Layer 1: 背景层 */}
      {renderBackgroundLayer()}

      {/* Layer 2: 口播动画层（全局持久，永不 unmount）*/}
      <AnimatedTalkingHead
        videoSrc={videoSrc}
        prevLayout={prevLayout}
        curLayout={curLayout}
        transitionType={currentShot.transitionType}
      />

      {/* Layer 3: 辅助素材层 */}
      {children(prevLayout, curLayout, currentShot.transitionType, currentShot.shotId)}
    </AbsoluteFill>
  );
};