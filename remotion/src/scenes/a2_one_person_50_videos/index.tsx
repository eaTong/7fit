import { AbsoluteFill } from "remotion";
import { LayoutTransitionEngine } from "../../layout-state-machine/LayoutTransitionEngine";
import { MediaFallback } from "../../components/media/MediaFallback";
import { GitLogDisplay } from "../../components/terminal/GitLogDisplay";
import {
  MetadataPair,
  TimeStateCard,
  ToolBadgeList,
  WorkflowCard,
  FlowDiagram,
  ImpactBar,
  ComparisonCard,
  QuoteCard,
  FormulaCard,
  HeadlineCard,
  FolderTree,
} from "../../components/auxiliary";
import type { ShotEntry } from "../../layout-state-machine/layouts/types";
import { LayoutId } from "../../layout-state-machine/layouts/types";

// ============================================================
// A2 · 一人一周50条视频 · 13 shot × 2.5s = 32.5s
// 文案稿：docs/copy/a2_one_person_50_videos.md
// 布局规范：rules/video-types.md §2
// ============================================================

const shotSequence: ShotEntry[] = [
  // s1: 钩子 — HeadlineCard 全屏居中
  { shotId: "s1", layoutId: LayoutId.Fullscreen, transitionType: "zoom", startFrame: 0, endFrame: 75 },
  // s2: 身份锚定
  { shotId: "s2", layoutId: LayoutId.TextCenterTalkingRight, transitionType: "slide-left", startFrame: 75, endFrame: 150 },
  // s3: 痛点
  { shotId: "s3", layoutId: LayoutId.PipBottomRight, transitionType: "slide-left", startFrame: 150, endFrame: 225 },
  // s4: 工具曝光
  { shotId: "s4", layoutId: LayoutId.PipBottomLeft, transitionType: "slide-right", startFrame: 225, endFrame: 300 },
  // s5: 工作流（辅助内容占左侧全高）
  { shotId: "s5", layoutId: LayoutId.TextCenterTalkingRight, transitionType: "fade", startFrame: 300, endFrame: 375 },
  // s6: 方法论
  { shotId: "s6", layoutId: LayoutId.TextCenterTalkingRight, transitionType: "ease-out", startFrame: 375, endFrame: 450 },
  // s7: AI 效果
  { shotId: "s7", layoutId: LayoutId.BottomRightTalking, transitionType: "slide-left", startFrame: 450, endFrame: 525 },
  // s8: 数字对比
  { shotId: "s8", layoutId: LayoutId.BottomLeftTalking, transitionType: "slide-right", startFrame: 525, endFrame: 600 },
  // s9: 感受
  { shotId: "s9", layoutId: LayoutId.TopCenterTalking, transitionType: "slide-left", startFrame: 600, endFrame: 675 },
  // s10: 核心观点
  { shotId: "s10", layoutId: LayoutId.OverlayTalkingHead, transitionType: "ease-out", startFrame: 675, endFrame: 750 },
  // s11: 收尾金句
  { shotId: "s11", layoutId: LayoutId.CenteredFullscreenBg, transitionType: "fade", startFrame: 750, endFrame: 825 },
  // s12: 证据（文件夹树 + GitLog）
  { shotId: "s12", layoutId: LayoutId.CenterDualAux, transitionType: "ease-out", startFrame: 825, endFrame: 900 },
  // s13: CTA 居中全屏
  { shotId: "s13", layoutId: LayoutId.CenteredFullscreenBg, transitionType: "zoom", startFrame: 900, endFrame: 975 },
];

// A2 背景图
const BACKGROUND_MAP: Record<string, string> = {
  s1: "images/bg/a2_workout_intro/s1_hook.jpg",
  s2: "images/bg/a2_workout_intro/s2_identity.jpg",
  s3: "images/bg/a2_workout_intro/s3_pain.jpg",
  s4: "images/bg/a2_workout_intro/s4_tools.jpg",
  s5: "images/bg/a2_workout_intro/s5_workflow.jpg",
  s6: "images/bg/a2_workout_intro/s6_method.jpg",
  s7: "images/bg/a2_workout_intro/s7_digital.jpg",
  s8: "images/bg/a2_workout_intro/s8_feeling.jpg",
  s9: "images/bg/a2_workout_intro/s9_workflow.jpg",
  s10: "images/bg/a2_workout_intro/s10_center.jpg",
  s11: "images/bg/a2_workout_intro/s11_compare.jpg",
  s12: "images/bg/a2_workout_intro/s12_cta.jpg",
  s13: "images/bg/a2_workout_intro/s13_orbiting.jpg",
};

// ============================================================
// 真实 GitLog 数据（从当前项目 recent commits）
// ============================================================
const GITLOG_ENTRIES = [
  { hash: "1968e13", author: "Claude", date: "2026-06-13", message: "feat: 新增横屏布局组件 SplitLeftRight/PictureInPicture/TripleSplit/OverlayCard" },
  { hash: "ad9aad4", author: "Claude", date: "2026-06-13", message: "docs: 横屏布局规范 + 转场动画扩展" },
  { hash: "e52547e", author: "Claude", date: "2026-06-13", message: "feat: 扩展转场动画至14种" },
  { hash: "2360bef", author: "Claude", date: "2026-06-12", message: "refactor: B14 PushDay 字幕 + 转场 + 布局全面重构" },
  { hash: "0348b5b", author: "Claude", date: "2026-06-12", message: "docs: 记录 a2_one_person_50_videos 项目状态" },
  { hash: "f3a2c1d", author: "Claude", date: "2026-06-12", message: "feat: 13张AI背景图生成完成" },
  { hash: "c9d1e8f", author: "Claude", date: "2026-06-11", message: "feat: A2布局规范落地" },
  { hash: "7b4e2a6", author: "Claude", date: "2026-06-11", message: "feat: 布局状态机支持center_dual_aux" },
  { hash: "5f8c3b7", author: "Claude", date: "2026-06-11", message: "feat: OrbitingVideo环绕组件完成" },
  { hash: "2d7a9e1", author: "Claude", date: "2026-06-10", message: "feat: A2钩子文案确认（反常识+身份代入）" },
  { hash: "1a3b5c8", author: "Claude", date: "2026-06-10", message: "refactor: ShotContent支持text_card类型" },
  { hash: "9e2f4d7", author: "Claude", date: "2026-06-09", message: "feat: 新增AuxiliaryContentManager组件" },
  { hash: "6c8e1f3", author: "Claude", date: "2026-06-09", message: "feat: AnimatedTalkingHead边缘羽化优化" },
  { hash: "3d5a7b9", author: "Claude", date: "2026-06-08", message: "feat: 布局状态机核心架构完成" },
  { hash: "8b2f6e4", author: "Claude", date: "2026-06-08", message: "docs: 撰写A2视频脚本初稿" },
  { hash: "0f9c3d2", author: "Claude", date: "2026-06-07", message: "feat: Remotion项目初始化完成" },
  { hash: "4e7a1b5", author: "Claude", date: "2026-06-07", message: "chore: 搭建layout-state-machine骨架" },
  { hash: "2c6d8f0", author: "Claude", date: "2026-06-06", message: "feat: 注册13种布局到registry" },
  { hash: "7f3b9c1", author: "Claude", date: "2026-06-06", message: "feat: 基础AnimatedTalkingHead组件完成" },
  { hash: "a1d5e8b", author: "Claude", date: "2026-06-05", message: "docs: 撰写项目规范文档" },
];

// ============================================================
// 真实文件夹树（remotion/src 结构）
// ============================================================
const FOLDER_TREE = [
  {
    name: "src",
    type: "dir" as const,
    children: [
      {
        name: "components", type: "dir" as const, children: [
          {
            name: "auxiliary", type: "dir" as const, children: [
              { name: "ComparisonCard.tsx", type: "file" as const },
              { name: "FlowDiagram.tsx", type: "file" as const },
              { name: "FolderTree.tsx", type: "file" as const },
              { name: "FormulaCard.tsx", type: "file" as const },
              { name: "HeadlineCard.tsx", type: "file" as const },
              { name: "ImpactBar.tsx", type: "file" as const },
              { name: "MetadataPair.tsx", type: "file" as const },
              { name: "QuoteCard.tsx", type: "file" as const },
              { name: "TimeStateCard.tsx", type: "file" as const },
              { name: "ToolBadgeList.tsx", type: "file" as const },
              { name: "WorkflowCard.tsx", type: "file" as const },
              { name: "OrbitingContent.tsx", type: "file" as const },
              { name: "index.ts", type: "file" as const },
            ]
          },
          {
            name: "data-display", type: "dir" as const, children: [
              { name: "ActionDataCard.tsx", type: "file" as const },
              { name: "CTAButton.tsx", type: "file" as const },
              { name: "OverlayCard.tsx", type: "file" as const },
              { name: "VoiceoverText.tsx", type: "file" as const },
            ]
          },
          {
            name: "layout", type: "dir" as const, children: [
              { name: "Grid2x2.tsx", type: "file" as const },
              { name: "PictureInPicture.tsx", type: "file" as const },
              { name: "SplitLeftRight.tsx", type: "file" as const },
              { name: "TripleSplit.tsx", type: "file" as const },
            ]
          },
          {
            name: "media", type: "dir" as const, children: [
              { name: "BGMWithDucking.tsx", type: "file" as const },
              { name: "MediaFallback.tsx", type: "file" as const },
              { name: "OrbitingVideo.tsx", type: "file" as const },
            ]
          },
          {
            name: "terminal", type: "dir" as const, children: [
              { name: "CodeDisplay.tsx", type: "file" as const },
              { name: "GitLogDisplay.tsx", type: "file" as const },
            ]
          },
          {
            name: "transitions", type: "dir" as const, children: [
              { name: "ShotRenderer.tsx", type: "file" as const },
            ]
          },
        ]
      },
      {
        name: "layout-state-machine", type: "dir" as const, children: [
          { name: "AnimatedTalkingHead.tsx", type: "file" as const },
          { name: "AuxiliaryContentManager.tsx", type: "file" as const },
          { name: "LayoutTransitionEngine.tsx", type: "file" as const },
          { name: "ShotContent.tsx", type: "file" as const },
          { name: "index.ts", type: "file" as const },
          {
            name: "layouts", type: "dir" as const, children: [
              { name: "index.ts", type: "file" as const },
              { name: "registry.ts", type: "file" as const },
              { name: "types.ts", type: "file" as const },
            ]
          },
        ]
      },
      {
        name: "scenes", type: "dir" as const, children: [
          {
            name: "a2_one_person_50_videos", type: "dir" as const, children: [
              { name: "index.tsx", type: "file" as const },
              { name: "status.md", type: "file" as const },
            ]
          },
          { name: "b14_push_day", type: "dir" as const },
          { name: "winged_scapula_b3", type: "dir" as const },
        ]
      },
      { name: "index.ts", type: "file" as const },
      { name: "Root.tsx", type: "file" as const },
      { name: "index.css", type: "file" as const },
    ],
  },
];

// ============================================================
// s12: 双栏内容（文件夹树 + GitLog）
// ============================================================
const DualAuxContent: React.FC = () => (
  <>
    {/* 左：文件夹树 */}
    <FolderTree
      entries={FOLDER_TREE}
      delay={5}
      style={{ position: "absolute", left: 50, top: 50, width: 400, height: 864 }}
    />
    {/* 右：GitLog（20条） */}
    <GitLogDisplay
      entries={GITLOG_ENTRIES}
      fontSize={18}
      visibleCount={Infinity}
      style={{ position: "absolute", left: 1470, top: 50, width: 400, height: 864 }}
    />
  </>
);

// ============================================================

// ============================================================
// A2 Scene 入口
// ============================================================
export const A2OnePerson50Videos: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#0A0A0A" }}>
      <LayoutTransitionEngine
        videoSrc="videos/a2_talking_head.mov"
        shotSequence={shotSequence}
        renderBackground={(currentShot) => {
          const bgSrc = BACKGROUND_MAP[currentShot.shotId];
          return (
            <MediaFallback
              src={bgSrc}
              type="image"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          );
        }}
      >
        {(_, curLayout, __, currentShotId) => {
          // 算出当前 shot 的起始帧，供动画用
          const shot = shotSequence.find(s => s.shotId === currentShotId);
          const enterFrame = shot?.startFrame ?? 0;
          switch (currentShotId) {
            // s1: 钩子 — HeadlineCard 全屏居中
            case "s1":
              return (
                <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 15 }}>
                  <HeadlineCard
                    delay={enterFrame}
                    title="谁能想到"
                    highlightWord="产品经理"
                    subtitle="下班后，也开始剪健身视频了"
                  />
                </div>
              );

            // s2: 身份元数据对
            case "s2":
              return (
                <div style={{ position: "absolute", left: 0, top: 0, width: 1440, height: 864, display: "flex", alignItems: "center", padding: "0 50px" }}>
                  <MetadataPair delay={enterFrame}
                    label="身份"
                    value="产品经理"
                    subLabel="健身"
                    subValue="七年爱好者"
                  />
                </div>
              );

            // s3: 时间 + 状态
            case "s3":
              return (
                <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 864, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <TimeStateCard delay={enterFrame} time="凌晨 2 点" state="累得要死" />
                </div>
              );

            // s4: 工具名列表
            case "s4":
              return (
                <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 864, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ToolBadgeList delay={enterFrame} tools={["Claude Code", "mmx", "Remotion"]} />
                </div>
              );

            // s5: 工作流 2×2 网格
            case "s5":
              return (
                <div style={{ position: "absolute", left: 960, top: 0, width: 960, height: 432, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
                  <WorkflowCard delay={enterFrame}
                    steps={[
                      { icon: "1", name: "确认方向", desc: "Claude Code 判断" },
                      { icon: "2", name: "睡觉跑完", desc: "AI 自动执行" },
                      { icon: "3", name: "审核结果", desc: "mmx 生成素材" },
                      { icon: "4", name: "Remotion 渲染", desc: "按帧保证质量" },
                    ]}
                  />
                </div>
              );

            // s6: 流程图
            case "s6":
              return (
                <div style={{ position: "absolute", left: 0, top: 0, width: 960, height: 864, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FlowDiagram delay={enterFrame}
                    nodes={[
                      { label: "确认方向", sublabel: "我判断" },
                      { label: "睡觉", sublabel: "AI 执行" },
                      { label: "跑完", sublabel: "自动完成" },
                    ]}
                  />
                </div>
              );

            // s7: AI 影响力条
            case "s7":
              return (
                <div style={{ position: "absolute", left: 0, top: 0, width: 1440, height: 864, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ImpactBar delay={enterFrame}
                    aiPercent={90}
                    mePercent={10}
                    aiLabel="AI 执行"
                    meLabel="我判断"
                  />
                </div>
              );

            // s8: 前后数字对比
            case "s8":
              return (
                <div style={{ position: "absolute", left: 480, top: 0, width: 1440, height: 864, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ComparisonCard delay={enterFrame}
                    before={{ label: "以前", value: "2周", unit: "/ 条" }}
                    after={{ label: "现在", value: "1天", unit: "/ 条" }}
                  />
                </div>
              );

            // s9: 引用卡片
            case "s9":
              return (
                <div style={{ position: "absolute", left: 0, top: 360, width: 1920, height: 504, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <QuoteCard delay={enterFrame}
                    quote="你是开挂了吧？"
                    attribution="朋友"
                    emoji="🤯"
                  />
                </div>
              );

            // s10: 公式卡片
            case "s10":
              return (
                <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 864, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FormulaCard delay={enterFrame}
                    formula="1 × 50 = 50"
                    resultLabel="一个人 × AI 放大 = 一周 50 条"
                  />
                </div>
              );

            // s11: 收尾金句 — zIndex:10 确保在口播背景层之上
            case "s11":
              return (
                <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
                  <HeadlineCard delay={enterFrame}
                    title="不是人多"
                    highlightWord="不是人多"
                    subtitle="是工作流有没有被 AI 放大"
                  />
                </div>
              );

            // s12: 双栏（文件夹树 + GitLog）
            case "s12":
              return <DualAuxContent />;

            // s13: CTA 居中全屏
            case "s13":
              return (
                <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
                  <QuoteCard delay={enterFrame} quote="你平时做什么内容？" attribution="评论区说说" emoji="💬" />
                </div>
              );

            default:
              return null;
          }
        }}
      </LayoutTransitionEngine>
    </AbsoluteFill>
  );
};
