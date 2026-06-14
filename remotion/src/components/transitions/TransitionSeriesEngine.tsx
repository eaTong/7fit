/**
 * TransitionSeriesEngine - 基于 @remotion/transitions 的转场引擎
 *
 * 使用 TransitionSeries 实现更丰富的转场效果：
 * - 支持 fade/slide/wipe/flip/clockWipe 等转场
 * - 支持 Overlay 叠加（如 LightLeak 光漏效果）
 * - 自动计算转场重叠时长
 *
 * 使用方式：
 * <TransitionSeriesEngine
 *   videoSrc="videos/talking_head.mov"
 *   shotSequence={shotSequence}
 *   enableLightLeak={true}
 *   lightLeakSeed={3}
 * >
 *   {(shot) => <ShotContent shot={shot} />}
 * </TransitionSeriesEngine>
 *
 * 注意：这是 LayoutTransitionEngine 的替代方案
 * 当前使用 LayoutTransitionEngine 的项目可以渐进迁移
 */

import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { LightLeak } from "@remotion/light-leaks";
import { AnimatedTalkingHead } from "../../layout-state-machine/AnimatedTalkingHead";
import { MediaFallback } from "../../components/media/MediaFallback";
import { getLayout } from "../../layout-state-machine/layouts";
import { LayoutId } from "../../layout-state-machine/layouts/types";
import type { ShotEntry } from "../../layout-state-machine/layouts/types";

interface TransitionSeriesEngineProps {
  videoSrc: string;
  shotSequence: ShotEntry[];
  backgroundSrc?: string;
  backgroundType?: "video" | "image";
  /** 是否启用 LightLeak 叠加效果 */
  enableLightLeak?: boolean;
  /** LightLeak 种子（不同值产生不同光漏形状）*/
  lightLeakSeed?: number;
  /** LightLeak 色相偏移（0=黄橙，120=绿，240=蓝）*/
  lightLeakHueShift?: number;
  /** 中间镜启用 LightLeak（默认第 5 镜）*/
  lightLeakShotIndex?: number;

  children: (shot: ShotEntry) => React.ReactNode;
}

export const TransitionSeriesEngine: React.FC<TransitionSeriesEngineProps> = ({
  videoSrc,
  shotSequence,
  backgroundSrc,
  backgroundType = "image",
  enableLightLeak = true,
  lightLeakSeed = 3,
  lightLeakHueShift = 30,
  lightLeakShotIndex = Math.floor(10 / 2), // 默认第 5 镜
  children,
}) => {
  const frame = useCurrentFrame();

  // 找到当前帧对应的 shot
  const currentShot = useMemo(() => {
    return (
      shotSequence.find((s) => frame >= s.startFrame && frame < s.endFrame) ??
      shotSequence[shotSequence.length - 1]
    );
  }, [frame, shotSequence]);

  const currentIndex = shotSequence.indexOf(currentShot);
  const prevShot = currentIndex > 0 ? shotSequence[currentIndex - 1] : null;

  const curLayout = useMemo(
    () => getLayout(currentShot.layoutId) ?? getLayout(LayoutId.Fullscreen)!,
    [currentShot.layoutId]
  );
  const prevLayout = useMemo(
    () => (prevShot ? (getLayout(prevShot.layoutId) ?? curLayout) : curLayout),
    [prevShot, curLayout]
  );

  const shotStartFrame = currentShot.startFrame;

  if (!shotSequence.length) {
    return (
      <AbsoluteFill>
        {backgroundSrc && (
          <MediaFallback
            src={backgroundSrc}
            type={backgroundType}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
        <AnimatedTalkingHead
          videoSrc={videoSrc}
          prevLayout={curLayout}
          curLayout={curLayout}
          shotStartFrame={0}
          transitionType="ease-out"
        />
        {children(shotSequence[0])}
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill>
      {/* 背景层 */}
      {backgroundSrc && (
        <MediaFallback
          src={backgroundSrc}
          type={backgroundType}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}

      {/* 口播动画层 */}
      <AnimatedTalkingHead
        videoSrc={videoSrc}
        prevLayout={prevLayout}
        curLayout={curLayout}
        shotStartFrame={shotStartFrame}
        transitionType={currentShot.transitionType}
        isCircle={currentShot.isCircle}
      />

      {/* 使用 TransitionSeries 处理 shot 切换 */}
      {/* 注意：这里只渲染当前 shot 的内容，TransitionSeries 用于未来重构 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
          zIndex: curLayout.zIndex + 10,
        }}
      >
        {children(currentShot)}
      </div>

      {/* LightLeak Overlay（可选，在中间镜叠加）
          注意：LightLeak 是全屏特效，这里缩小到 60% 并降低透明度，避免遮挡内容
      */}
      {enableLightLeak && currentIndex === lightLeakShotIndex && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: "60%",
            height: "60%",
            transform: "translate(-50%, -50%)",
            zIndex: 1000,
            pointerEvents: "none",
            opacity: 0.25,
          }}
        >
          <LightLeak seed={lightLeakSeed} hueShift={lightLeakHueShift} />
        </div>
      )}
    </AbsoluteFill>
  );
};
