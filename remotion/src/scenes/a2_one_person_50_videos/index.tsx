import { AbsoluteFill, useCurrentFrame } from "remotion";
import { LayoutTransitionEngine } from "../../layout-state-machine/LayoutTransitionEngine";
import { MediaFallback } from "../../components/media/MediaFallback";
import { VoiceoverText } from "../../components/data-display/VoiceoverText";
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
  FlowDiagram,
  ImpactBar,
  ComparisonCard,
  QuoteCard,
  HeadlineCard,
} from "../../components/auxiliary";
import type { ShotEntry } from "../../layout-state-machine/layouts/types";
import { LayoutId } from "../../layout-state-machine/layouts/types";

// ============================================================
// A2 · 一人一周50条视频 · 10 shot × ~11s = ~112s
// 文案稿：docs/copy/a2_one_person_50_videos.md
// 布局规范：rules/video-types.md §2
// 字幕：subtitles.json（29条，107.5s，全文字幕顺序对齐）
// ============================================================

const shotSequence: ShotEntry[] = [
  // s1: 钩子 — 反常识开场（sub_001+002），用口播居中布局
  { shotId: "s1", layoutId: LayoutId.CenteredFullBg, transitionType: "zoom", startFrame: 0, endFrame: 201 },
  // s2: 身份锚定 — 产品经理背景（sub_003+004）
  { shotId: "s2", layoutId: LayoutId.TextCenterTalkingRight, transitionType: "slide-left", startFrame: 201, endFrame: 425 },
  // s3: 痛点 — 凌晨2点/人力剪辑（sub_008+009+010+011）
  { shotId: "s3", layoutId: LayoutId.PipBottomRight, transitionType: "slide-left", startFrame: 425, endFrame: 791 },
  // s4: 工具 — Claude/mmx/Remotion（sub_012+013+014+015）
  { shotId: "s4", layoutId: LayoutId.PipBottomLeft, transitionType: "slide-right", startFrame: 791, endFrame: 1286 },
  // s5: 方法论 — 方向确认/睡觉跑完（sub_016+017+018）
  { shotId: "s5", layoutId: LayoutId.TextCenterTalkingLeft, transitionType: "fade", startFrame: 1286, endFrame: 1586 },
  // s6: AI效果 — 扛90%苦活/只做判断（sub_019+020+021）
  { shotId: "s6", layoutId: LayoutId.BottomRightTalking, transitionType: "slide-left", startFrame: 1586, endFrame: 1894 },
  // s7: 数字对比 — 以前2周vs现在1天（sub_022+023+024）
  { shotId: "s7", layoutId: LayoutId.BottomLeftTalking, transitionType: "slide-right", startFrame: 1894, endFrame: 2284 },
  // s8: 感受 — 开挂/外包AI（sub_025+026）
  { shotId: "s8", layoutId: LayoutId.TopCenterTalking, transitionType: "slide-left", startFrame: 2284, endFrame: 2524 },
  // s9: 核心观点 — 工作流放大（sub_027+028）
  { shotId: "s9", layoutId: LayoutId.OverlayTalkingHead, transitionType: "ease-out", startFrame: 2524, endFrame: 2824 },
  // s10: CTA — 评论区说说（sub_029）
  { shotId: "s10", layoutId: LayoutId.CenteredFullBg, transitionType: "fade", startFrame: 2824, endFrame: 2974 },
];

// ============================================================

// ============================================================
// A2 Scene 入口
// ============================================================
export const A2OnePerson50Videos: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#0A0A0A" }}>
      {/* 背景图层 */}
      <MediaFallback
        src="images/bg/a2_workout_intro/s1_hook.jpg"
        type="image"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      {/* 布局切换引擎 */}
      <LayoutTransitionEngine
        videoSrc="videos/a2_talking_head.mov"
        shotSequence={shotSequence}
      >
        {(_, curLayout, __, currentShotId) => {
          const shot = shotSequence.find(s => s.shotId === currentShotId);
          const enterFrame = shot?.startFrame ?? 0;
          switch (currentShotId) {
            case "s1":
              return null;
            case "s2":
              return (
                <div style={{ position: "absolute", left: 0, top: 0, width: 1440, height: 864, display: "flex", alignItems: "center", padding: "0 50px" }}>
                  <MetadataPair delay={enterFrame} label="身份" value="产品经理" subLabel="健身" subValue="七年爱好者" />
                </div>
              );
            case "s3":
              return (
                <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 864, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <TimeStateCard delay={enterFrame} time="凌晨 2 点" state="累得要死" />
                </div>
              );
            case "s4":
              return (
                <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 864, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ToolBadgeList delay={enterFrame} tools={["Claude Code", "mmx", "Remotion"]} />
                </div>
              );
            case "s5":
              return (
                <div style={{ position: "absolute", left: 960, top: 0, width: 960, height: 432, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
                  <WorkflowCard delay={enterFrame} steps={[
                    { icon: "1", name: "确认方向", desc: "Claude Code 判断" },
                    { icon: "2", name: "睡觉跑完", desc: "AI 自动执行" },
                    { icon: "3", name: "审核结果", desc: "mmx 生成素材" },
                    { icon: "4", name: "Remotion 渲染", desc: "按帧保证质量" },
                  ]} />
                </div>
              );
            case "s6":
              return (
                <div style={{ position: "absolute", left: 0, top: 0, width: 960, height: 864, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FlowDiagram delay={enterFrame} nodes={[
                    { label: "确认方向", sublabel: "我判断" },
                    { label: "睡觉", sublabel: "AI 执行" },
                    { label: "跑完", sublabel: "自动完成" },
                  ]} />
                </div>
              );
            case "s7":
              return (
                <div style={{ position: "absolute", left: 0, top: 0, width: 1440, height: 864, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ImpactBar delay={enterFrame} aiPercent={90} mePercent={10} aiLabel="AI 执行" meLabel="我判断" />
                </div>
              );
            case "s8":
              return (
                <div style={{ position: "absolute", left: 480, top: 0, width: 1440, height: 864, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ComparisonCard delay={enterFrame} before={{ label: "以前", value: "2周", unit: "/ 条" }} after={{ label: "现在", value: "1天", unit: "/ 条" }} />
                </div>
              );
            case "s9":
              return (
                <div style={{ position: "absolute", left: 0, top: 360, width: 1920, height: 504, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <QuoteCard delay={enterFrame} quote="你是开挂了吧？" attribution="朋友" emoji="🤯" />
                </div>
              );
            case "s10":
              return (
                <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <HeadlineCard delay={enterFrame} title="评论区说说" highlightWord="你在做什么" subtitle="看能不能用 AI 提效" />
                </div>
              );
            default:
              return null;
          }
        }}
      </LayoutTransitionEngine>
      {/* 字幕层：独立于 LayoutTransitionEngine */}
      <SubtitleLayer />
    </AbsoluteFill>
  );
};
