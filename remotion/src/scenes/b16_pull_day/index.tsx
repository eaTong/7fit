/**
 * B16 Pull Day — 背部健身计划（6 动作拉力系列）
 *
 * 视频时长：35s（9 镜 = 1 钩子 + 6 动作 + 1 要点 + 1 CTA）
 * 画布：1080×1920 竖屏（9:16）
 * BGM：gym_beat_b16.mp3
 * 默认 bgmVolume=0.25（-12dB，对齐 winged_scapula_b3 防盖人声）
 *
 * 文案：「健身计划没那么难——第二天你就拉。向下拉、把自己往上拉、
 *        窄距下拉、水平拉、水平窄距拉、直臂拉」
 *
 * 结构（对标 B15 Abs）：
 * - 钩子：2×2 网格（4 格 stagger + impulse + LightLeak）
 * - 6 个动作镜：ActionBadge + MuscleTag + KeyPoint + ProgressRing（1/6 → 6/6）
 * - 要点镜：4 行参数 stagger 揭示
 * - Outro：计划总结 + 评论 CTA
 * - 转场交替（wipe-h / zoom）避免单调
 *
 * 分镜来源：[storyboard.json](storyboard.json)
 */

import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  staticFile,
} from "remotion";
import storyboard from "./storyboard.json";
import { VoiceoverText } from "../../components/data-display/VoiceoverText";
import { Grid2x2 } from "../../components/layout/Grid2x2";
import { ShotRenderer } from "../../components/transitions/ShotRenderer";
import { BGMWithDucking } from "../../components/media/BGMWithDucking";
import { ActionBadge } from "../../components/auxiliary/ActionBadge";
import { ProgressRing } from "../../components/auxiliary/ProgressRing";
import { NumberImpact } from "../../components/auxiliary/NumberImpact";
import { ParamCard } from "../../components/auxiliary/ParamCard";
import { MuscleTag } from "../../components/auxiliary/MuscleTag";
import { KeyPoint } from "../../components/auxiliary/KeyPoint";
import type { Shot } from "../../types/shot";
import { B_VARIANTS, getBgmFileName, mapStoryboardColor } from "../../themes/b-variant-theme";
import type { BVariantTheme } from "../../themes/b-variant-theme";

/* === 配置 === */
const FPS = 30;
const TRANSITION_FRAMES = 9;

const BASE = "scenes/b16";

const video = (name: string) => `${BASE}/videos/${name}`;
const audio = (name: string) => `${BASE}/audios/${name}`;

/* === 视频真实时长（实测 via ffprobe）===
 * 所有视频已裁剪至 ≤ shot时长×2，保证 playbackRate ≤ 2x */
const VIDEO_DURATIONS: Record<string, number> = {
  "pull_latdown.mp4": 7.0,
  "pull_chinup.mp4": 7.0,
  "pull_narrow_latdown.mp4": 7.0,
  "pull_seated_row.mp4": 7.0,
  "pull_tbar_row.mp4": 7.0,
  "pull_straight_arm.mp4": 7.0,
  "key_tips.mp4": 9.009,
  "outro.mp4": 10.01,
};

/** AnimationOverrides 类型 */
interface AnimationOverrides {
  grid_stagger_frames?: number;
  grid_impulse_idx?: number;
  grid_impulse_scale?: number;
  light_leak?: { duration_frames: number; seed: number; hueShift: number };
  action_badge?: { name: string; position: "top-left" | "top-right" | "bottom-left" | "bottom-right"; delay_frames: number };
  progress_ring?: {
    current: number;
    total: number;
    position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
    delay_frames: number;
    impulse?: boolean;
  };
  param_card?: Array<{
    label: string;
    caption?: string;
    color: string;
    position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
    delay_frames: number;
    breathing: boolean;
  }>;
  comment_cta_pulse?: { delay_frames: number };
  number_overlay?: {
    numbers: Array<{ text: string; highlight?: boolean }>;
    visible_frames: number;
    fade_frames: number;
    stagger_frames: number;
  };
}

/** 从 shot 中提取 animation_overrides */
function getAnim(shot: Shot): AnimationOverrides {
  return ((shot as unknown) as { animation_overrides?: AnimationOverrides }).animation_overrides ?? {};
}

/* === Shot 内容渲染器 === */
const ShotContent: React.FC<{ shot: Shot; theme: BVariantTheme }> = ({ shot, theme }) => {
  const anim = getAnim(shot);
  const mapColor = (c?: string) => mapStoryboardColor(c, theme);

  // 钩子：2×2 网格（带 stagger + impulse）
  if (shot.content_type === "video_grid" && shot.grid_cells) {
    const sources: [string, string, string, string] = [
      shot.grid_cells.find(c => c.position === "top-left")?.source || "",
      shot.grid_cells.find(c => c.position === "top-right")?.source || "",
      shot.grid_cells.find(c => c.position === "bottom-left")?.source || "",
      shot.grid_cells.find(c => c.position === "bottom-right")?.source || "",
    ];
    return (
      <AbsoluteFill>
        <Grid2x2
          sources={sources}
          type="video"
          basePath={`${BASE}/videos`}
          showGridLines
          staggerFrames={anim.grid_stagger_frames ?? 5}
          impulseIdx={anim.grid_impulse_idx ?? 3}
          impulseScale={anim.grid_impulse_scale ?? 1.15}
          backgroundImage={`${BASE}/images/${theme.id === 'pro' ? 'b_pro_bg.JPG' : 'b_lite_bg.JPG'}`}
        />
        {shot.voiceover && <VoiceoverText text={shot.voiceover} bottom={50} paddingX={16} theme={theme} />}
      </AbsoluteFill>
    );
  }

  // 视频镜
  if (shot.content_type === "video" && shot.content_source) {
    const videoDur = VIDEO_DURATIONS[shot.content_source] || shot.duration;
    const playbackRate = videoDur / shot.duration;
    return (
      <AbsoluteFill>
        <OffthreadVideo
          muted
          src={staticFile(video(shot.content_source))}
          startFrom={0}
          playbackRate={playbackRate}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        {/* 动作名 chip */}
        {anim.action_badge && (
          <ActionBadge
            name={anim.action_badge.name}
            position={anim.action_badge.position}
            delay={anim.action_badge.delay_frames}
            color={theme.primary}
            theme={theme}
          />
        )}
        {/* 进度环 */}
        {anim.progress_ring && (
          <ProgressRing
            current={anim.progress_ring.current}
            total={anim.progress_ring.total}
            position={anim.progress_ring.position}
            delay={anim.progress_ring.delay_frames}
            impulse={anim.progress_ring.impulse}
            color={theme.primary}
            theme={theme}
          />
        )}
        {/* 肌群标签 */}
        {anim.muscle_tag && (
          <MuscleTag
            muscle={anim.muscle_tag.muscle}
            position={anim.muscle_tag.position}
            delay={anim.muscle_tag.delay_frames}
            theme={theme}
          />
        )}
        {/* 关键点 */}
        {anim.key_point && (
          <KeyPoint
            text={anim.key_point.text}
            position={anim.key_point.position}
            delay={anim.key_point.delay_frames}
            theme={theme}
          />
        )}
        {/* 参数卡 */}
        {anim.param_card?.map((card, i) => (
          <ParamCard
            key={i}
            label={card.label}
            caption={card.caption}
            color={mapColor(card.color)}
            position={card.position}
            delay={card.delay_frames}
            breathing={card.breathing}
            theme={theme}
          />
        ))}
        {/* 数字 overlay（弹入后淡出，露出视频）*/}
        {anim.number_overlay && (
          <NumberImpact
            numbers={anim.number_overlay.numbers}
            visibleFromFrame={0}
            visibleToFrame={anim.number_overlay.visible_frames}
            fadeFrames={anim.number_overlay.fade_frames}
            stagger={anim.number_overlay.stagger_frames}
            theme={theme}
          />
        )}
        {/* 底部副字幕 */}
        {shot.voiceover && <VoiceoverText text={shot.voiceover} bottom={50} paddingX={16} theme={theme} />}
      </AbsoluteFill>
    );
  }

  // 兜底
  return (
    <AbsoluteFill style={{ background: "#0A0A0A", justifyContent: "center", alignItems: "center" }}>
      {shot.voiceover && <VoiceoverText text={shot.voiceover} fontSize={48} />}
    </AbsoluteFill>
  );
};

/* === 主 Scene === */
export const B16PullDay: React.FC<{
  variant?: 'pro' | 'lite';
  bgmVolume?: number;
  enableFadeIn?: boolean;
  enableTransitions?: boolean;
}> = ({ variant = 'pro', bgmVolume = 0.25, enableFadeIn = true, enableTransitions = true }) => {
  const theme = B_VARIANTS[variant];
  const shots = storyboard.shots as Shot[];

  // 实际总帧数：取最后一镜的 end
  const compositionFrames = Math.round(shots[shots.length - 1].end * FPS);
  const bgmFile = getBgmFileName(theme, 'b16');

  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      <BGMWithDucking
        src={staticFile(audio(`bgm/${bgmFile}`))}
        compositionFrames={compositionFrames}
        normalVolume={bgmVolume}
        fadeInFrames={enableFadeIn ? 30 : 0}
      />
      {/* 旁白配音 */}
      <Audio src={staticFile(audio("voiceover_b16.m4a"))} volume={1} />
      {shots.map((shot, idx, arr) => {
        const isFirst = idx === 0;
        const isLast = idx === arr.length - 1;
        const startFrame = Math.round(shot.start * FPS);
        const durationFrames = Math.round(shot.duration * FPS);

        // crossfade padding：填满 gap + 9 帧 crossfade
        let exitExtend = 0;
        if (!isLast) {
          const nextStartFrame = Math.round(arr[idx + 1].start * FPS);
          const myEndFrame = startFrame + durationFrames;
          const gapToNext = Math.max(0, nextStartFrame - myEndFrame);
          exitExtend = gapToNext + TRANSITION_FRAMES;
        }
        const paddedDuration = durationFrames + exitExtend;

        // LightLeak 配置（仅钩子镜）
        const anim = getAnim(shot);
        const enableLightLeak = enableTransitions && !!anim.light_leak;

        return (
          <Sequence
            key={shot.shot_id}
            from={startFrame}
            durationInFrames={paddedDuration}
            premountFor={1 * FPS}
          >
            <ShotRenderer
              transitionIn={enableTransitions ? shot.transition_in : "none"}
              transitionOut={enableTransitions ? shot.transition_out : "none"}
              isFirst={isFirst}
              isLast={isLast}
              paddedDuration={paddedDuration}
              enableLightLeak={enableLightLeak}
              lightLeakSeed={anim.light_leak?.seed}
              lightLeakHueShift={anim.light_leak?.hueShift}
            >
              <ShotContent shot={shot} theme={theme} />
            </ShotRenderer>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
