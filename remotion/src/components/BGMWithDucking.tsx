/**
 * BGMWithDucking — BGM 背景音乐组件（共享）
 *
 * 职责：
 * - 播放 BGM 音频
 * - fade in（开头）
 * - voiceover 期间 ducking（压低音量）
 * - fade out（结尾）
 *
 * 使用方式：
 * <BGMWithDucking
 *   src={staticFile("b14_push_day/audios/bgm/gym_beat_b14.mp3")}
 *   compositionFrames={960}
 *   voiceoverEndFrame={2040}
 *   normalVolume={0.25}
 *   duckVolume={0.15}
 *   fadeInFrames={30}
 *   fadeOutFrames={60}
 * />
 */

import { Audio } from "remotion";

interface BGMWithDuckingProps {
  /** BGM 音频路径（建议用 staticFile() 包装）*/
  src: string;
  /** 视频总帧数（用于 fade out 计算）*/
  compositionFrames: number;
  /** 旁白结束帧（ducking 截止点），不传 = 无 ducking */
  voiceoverEndFrame?: number;
  /** 正常音量（0-1），默认 0.25 */
  normalVolume?: number;
  /** ducking 音量（0-1），默认 0.15（-16dB 约 0.158）*/
  duckVolume?: number;
  /** fade in 帧数，默认 30（1s @ 30fps）*/
  fadeInFrames?: number;
  /** fade out 帧数，默认 60（2s @ 30fps）*/
  fadeOutFrames?: number;
}

export const BGMWithDucking: React.FC<BGMWithDuckingProps> = ({
  src,
  compositionFrames,
  voiceoverEndFrame,
  normalVolume = 0.25,
  duckVolume = 0.15,
  fadeInFrames = 30,
  fadeOutFrames = 60,
}) => {
  return (
    <Audio
      src={src}
      volume={(f) => {
        let v = normalVolume;

        // Fade in
        if (f < fadeInFrames) {
          v = normalVolume * (f / fadeInFrames);
        }

        // Ducking during voiceover
        if (voiceoverEndFrame !== undefined && f >= fadeInFrames && f < voiceoverEndFrame) {
          v = duckVolume;
        }

        // Fade out
        if (f > compositionFrames - fadeOutFrames) {
          const fadeOutRatio = (compositionFrames - f) / fadeOutFrames;
          v = Math.min(v, normalVolume * fadeOutRatio);
        }

        return Math.max(0, v);
      }}
    />
  );
};