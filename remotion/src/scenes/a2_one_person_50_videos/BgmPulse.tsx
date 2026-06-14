/**
 * BgmPulse - BGM 节拍脉冲可视化
 *
 * 使用低频段驱动一个半透明脉冲环，视觉上跟随 BGM 节拍"呼吸"
 * 适合 B 类健身视频的 BGM 驱动视觉元素
 *
 * 使用方式：
 *   <BgmPulse bgmSrc="audios/bgm.mp3" color="#FF4500" />
 */

import { useWindowedAudioData, visualizeAudio } from "@remotion/media-utils";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { staticFile } from "remotion";

interface BgmPulseProps {
  /** BGM 文件路径（相对于 public/） */
  bgmSrc: string;
  /** 脉冲颜色 */
  color?: string;
  /** 脉冲最大透明度 */
  maxOpacity?: number;
  /** 脉冲最大缩放比例 */
  maxScale?: number;
  /** 低频段采样范围（默认 0-16，取最低频段） */
  bassRange?: number;
}

export const BgmPulse: React.FC<BgmPulseProps> = ({
  bgmSrc,
  color = "#FF4500",
  maxOpacity = 0.5,
  maxScale = 1.4,
  bassRange = 16,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { audioData, dataOffsetInSeconds } = useWindowedAudioData({
    src: staticFile(bgmSrc),
    frame,
    fps,
    windowInSeconds: 30,
  });

  if (!audioData) {
    return null;
  }

  const frequencies = visualizeAudio({
    fps,
    frame,
    audioData,
    numberOfSamples: 128,
    optimizeFor: "speed",
    dataOffsetInSeconds,
  });

  // 取最低 bassRange 个频段求平均（低频 = 节拍）
  const bassFrequencies = frequencies.slice(0, bassRange);
  const bassIntensity =
    bassFrequencies.reduce((sum, v) => sum + v, 0) / bassFrequencies.length;

  // 低频强度映射到缩放和透明度
  const scale = interpolate(
    bassIntensity,
    [0, 0.3, 0.6],
    [1, 1 + (maxScale - 1) * 0.5, maxScale],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const opacity = interpolate(
    bassIntensity,
    [0, 0.2, 0.5],
    [0, maxOpacity * 0.4, maxOpacity],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* 主脉冲环 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 1920,
          height: 1080,
          transform: `translate(-50%, -50%) scale(${scale})`,
          opacity,
          borderRadius: "50%",
          border: `3px solid ${color}`,
          boxShadow: `0 0 30px ${color}, inset 0 0 30px ${color}`,
        }}
      />
      {/* 次级脉冲环（略微延迟，增强层次感） */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 1920,
          height: 1080,
          transform: `translate(-50%, -50%) scale(${scale * 0.85})`,
          opacity: opacity * 0.6,
          borderRadius: "50%",
          border: `2px solid ${color}`,
        }}
      />
    </AbsoluteFill>
  );
};
