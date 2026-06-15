import { AbsoluteFill, useCurrentFrame } from "remotion";
import { LayoutTransitionEngine } from "../../layout-state-machine/LayoutTransitionEngine";
import { MediaFallback } from "../../components/media/MediaFallback";
import { VoiceoverText } from "../../components/data-display/VoiceoverText";
import { BgmAudio } from "./BgmAudio";
import { BgmPulse } from "./BgmPulse";
import subtitles from "./subtitles.json";

/** 根据当前帧渲染字幕的内部组件（hooks 只能在组件内调用）*/
const SubtitleLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const activeSub = subtitles.subtitles.find(
    (s) => frame >= s.start * 30 && frame < s.end * 30
  );
  if (!activeSub) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 100 }}>
      <VoiceoverText text={activeSub.segments} bottom={50} />
    </div>
  );
};
import {
  MetadataPair,
  TimeStateCard,
  ToolBadgeList,
  WorkflowCard,
  ImpactBar,
  ComparisonCard,
  HeadlineCard,
} from "../../components/auxiliary";
import type { ShotEntry } from "../../layout-state-machine/layouts/types";
import { LayoutId } from "../../layout-state-machine/layouts/types";

// ============================================================
// A2 · 一人一周50条视频 · 8 shot × ~13s = ~106s（v4.1 重构）
// 文案稿：docs/copy/a2_one_person_50_videos.md（v4.1 锁版 313 字）
// 布局规范：rules/video-types.md §2
// 字幕：subtitles.json（30 条，131.0s，线性拉伸对齐录音实际 131.24s）
// Composition：durationInFrames=4020 (134s) = 录音 131.24s + 3s fade out
// 段间停顿：7 × 0.5s ≈ 3.5s（按 ratio 1.2476 缩放，钩子-段1 / 段1-2-3-4-5-6 / 段6-收尾）
// ============================================================

const shotSequence: ShotEntry[] = [
  // s1: 钩子 — 反常识开场（sub_001+002，0-112 帧 ≈ 3.7s，按 ratio 缩放）
  { shotId: "s1", layoutId: LayoutId.CenteredFullBg,     transitionType: "zoom",       startFrame: 0,    endFrame: 112 },
  // s2: 段1 身份+动机（sub_003-006，131-715 帧 ≈ 19.4s）
  { shotId: "s2", layoutId: LayoutId.TextCenterTalkingRight, transitionType: "slide-left", startFrame: 131,  endFrame: 715 },
  // s3: 段2 旧流程痛（sub_007-009，734-1175 帧 ≈ 14.7s）
  { shotId: "s3", layoutId: LayoutId.PipBottomRight,     transitionType: "slide-left", startFrame: 734,  endFrame: 1175 },
  // s4: 段3 工具介绍（sub_010-014，1194-1875 帧 ≈ 22.7s）
  { shotId: "s4", layoutId: LayoutId.PipBottomLeft,      transitionType: "slide-right", startFrame: 1194, endFrame: 1875 },
  // s5: 段4 核心收益（sub_015-020，1894-2687 帧 ≈ 26.4s）
  { shotId: "s5", layoutId: LayoutId.TextCenterTalkingLeft, transitionType: "fade",     startFrame: 1894, endFrame: 2687 },
  // s6: 段5 新工作流（sub_021-026，2706-3400 帧 ≈ 23.1s）
  { shotId: "s6", layoutId: LayoutId.BottomRightTalking, transitionType: "slide-left", startFrame: 2706, endFrame: 3400 },
  // s7: 段6 升华（sub_027-028，3419-3670 帧 ≈ 8.4s）
  { shotId: "s7", layoutId: LayoutId.BottomLeftTalking,  transitionType: "slide-right", startFrame: 3419, endFrame: 3670 },
  // s8: 收尾（sub_029-030，3689-4020 帧 ≈ 11.0s，含 2s fade out）
  { shotId: "s8", layoutId: LayoutId.CenteredFullBg,     transitionType: "fade",       startFrame: 3689, endFrame: 4020 },
];

// ============================================================

// ============================================================
// A2 Scene 入口
// ============================================================
export const A2OnePerson50Videos: React.FC = () => {
  // 旁白结束帧 = 最后一条字幕 end × fps
  // subtitles.json 最后一条 sub_030: end=131.0s → 131.0×30 = 3930 帧
  // Composition durationInFrames=4020 (134s)，留 90 帧 = 3s 给 fade out
  const VOICEOVER_END_FRAME = 3930;

  return (
    <AbsoluteFill style={{ background: "#0A0A0A" }}>
      {/* Layer 0: BGM（含 Ducking） */}
      <BgmAudio
        bgmSrc="a2_one_person_50_videos/audios/bgm/a2_one_person_50_videos_v2.mp3"
        voiceoverEndFrame={VOICEOVER_END_FRAME}
        duckedVolume={0.15}
        normalVolume={0.8}
        recoveryDuration={30}
      />

      {/* Layer 1: BGM 节拍脉冲（视觉反馈） */}
      <BgmPulse
        bgmSrc="a2_one_person_50_videos/audios/bgm/a2_one_person_50_videos_v2.mp3"
        color="#FF4500"
        maxOpacity={0.4}
        maxScale={1.3}
      />

      {/* Layer 2: 背景图层 */}
      <MediaFallback
        src="images/bg/a2_workout_intro/s1_hook.jpg"
        type="image"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      {/* Layer 3: 布局切换引擎 */}
      <LayoutTransitionEngine
        videoSrc="videos/a2_talking_head.mov"
        shotSequence={shotSequence}
      >
        {(_, curLayout, __, currentShotId) => {
          const shot = shotSequence.find(s => s.shotId === currentShotId);
          const enterFrame = shot?.startFrame ?? 0;
          switch (currentShotId) {
            case "s1":
              return (
                <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <HeadlineCard delay={enterFrame} title="谁能想到——" highlightWord="产品经理下班后" subtitle="也开始剪健身视频了" />
                </div>
              );
            case "s2":
              return (
                <div style={{ position: "absolute", left: 0, top: 0, width: 1440, height: 864, display: "flex", alignItems: "center", padding: "0 50px" }}>
                  <MetadataPair delay={enterFrame} label="身份" value="产品经理" subLabel="健身" subValue="2 年爱好者" />
                </div>
              );
            case "s3":
              return (
                <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 864, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <TimeStateCard delay={enterFrame} time="凌晨 2 点" state="9 步流程熬 1 周" />
                </div>
              );
            case "s4":
              return (
                <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 864, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ToolBadgeList delay={enterFrame} tools={["Claude Code 写脚本/列分镜/出镜头", "mmx 出图/做字幕/找 BGM", "Remotion 按帧渲染/自动特效/转场/排版/收集素材"]} />
                </div>
              );
            case "s5":
              return (
                <div style={{ position: "absolute", left: 0, top: 0, width: 960, height: 864, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ImpactBar delay={enterFrame} aiPercent={90} mePercent={10} aiLabel="AI 替我扛 9 成" meLabel="我只判断方向" />
                </div>
              );
            case "s6":
              return (
                <div style={{ position: "absolute", left: 960, top: 0, width: 960, height: 864, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
                  <WorkflowCard delay={enterFrame} steps={[
                    { icon: "1", name: "7 点下班", desc: "健身拍素材" },
                    { icon: "2", name: "回家", desc: "素材交给 AI" },
                    { icon: "3", name: "睡觉", desc: "AI 自动跑" },
                    { icon: "4", name: "第二天起来", desc: "视频剪好了" },
                  ]} />
                </div>
              );
            case "s7":
              return (
                <div style={{ position: "absolute", left: 0, top: 0, width: 1440, height: 864, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ComparisonCard delay={enterFrame} before={{ label: "以前", value: "1周", unit: "/ 条" }} after={{ label: "现在", value: "1天", unit: "/ 条 × 20" }} />
                </div>
              );
            case "s8":
              return (
                <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <HeadlineCard delay={enterFrame} title="AI 时代，所有人的工作流" highlightWord="都值得被重构一遍" subtitle="评论区聊聊你的工作" />
                </div>
              );
            default:
              return null;
          }
        }}
      </LayoutTransitionEngine>

      {/* Layer 4: 字幕层：独立于 LayoutTransitionEngine */}
      <SubtitleLayer />
    </AbsoluteFill>
  );
};
