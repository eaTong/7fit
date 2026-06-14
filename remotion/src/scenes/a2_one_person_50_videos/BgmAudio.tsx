/**
 * BgmAudio - BGM 音频组件，带 Ducking（旁白期间自动压低 BGM）
 *
 * 使用方式：
 *   <BgmAudio bgmSrc="audios/bgm.mp3" voiceoverEndFrame={2970} />
 *
 * Ducking 逻辑：
 *   - 旁白期间（0 → voiceoverEndFrame）：BGM 音量从 0.8 降到 0.15
 *   - 旁白结束后（voiceoverEndFrame → voiceoverEndFrame+30）：BGM 音量从 0.15 恢复到 0.8
 *   - 恢复时长固定 30 帧（1 秒 @30fps）
 */

import { Audio } from "@remotion/media";
import { interpolate, useCurrentFrame, staticFile } from "remotion";

interface BgmAudioProps {
  /** BGM 文件路径（相对于 public/） */
  bgmSrc: string;
  /** 旁白结束帧号（用于触发 ducking） */
  voiceoverEndFrame: number;
  /** Ducking 压低目标音量 */
  duckedVolume?: number;
  /** 恢复正常音量 */
  normalVolume?: number;
  /** 恢复时长（帧数） */
  recoveryDuration?: number;
}

export const BgmAudio: React.FC<BgmAudioProps> = ({
  bgmSrc,
  voiceoverEndFrame,
  duckedVolume = 0.15,
  normalVolume = 0.8,
  recoveryDuration = 30,
}) => {
  const frame = useCurrentFrame();

  // Ducking 逻辑：
  // 旁白期间：volume = duckedVolume
  // 旁白结束后：volume 从 duckedVolume 线性恢复到 normalVolume
  const isDuringVoiceover = frame < voiceoverEndFrame;
  const isRecovering =
    frame >= voiceoverEndFrame &&
    frame < voiceoverEndFrame + recoveryDuration;

  // 计算当前帧在恢复阶段的进度（0 → 1）
  const recoveryProgress = isRecovering
    ? interpolate(frame, [voiceoverEndFrame, voiceoverEndFrame + recoveryDuration], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : frame >= voiceoverEndFrame + recoveryDuration
    ? 1
    : 0;

  const volume = isDuringVoiceover
    ? duckedVolume
    : interpolate(recoveryProgress, [0, 1], [duckedVolume, normalVolume], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

  return (
    <Audio
      src={staticFile(bgmSrc)}
      volume={volume}
      loop
    />
  );
};
