import { AbsoluteFill } from "remotion";
import { LayoutTransitionEngine } from "../../layout-state-machine/LayoutTransitionEngine";
import { ShotContent } from "../../layout-state-machine/ShotContent";
import { MediaFallback } from "../../components/MediaFallback";
import type { ShotEntry } from "../../layout-state-machine/layouts/types";

// ============================================================
// 10-Shot A类视频叙事弧
// 叙事弧：Hook → Pain → Solution → Demo → Proof → Deep Dive → CTA → Brand → Code → GitLog
// ============================================================

const shotSequence: ShotEntry[] = [
  // s1: Hook · 反常识开场（全屏口播，情绪高点）
  { shotId: "s1", layoutId: "fullscreen",              transitionType: "zoom",       startFrame: 0,    endFrame: 90   },
  // s2: Pain · 健身困境（左文右口播，讲解痛点）
  { shotId: "s2", layoutId: "left_text_right_talking", transitionType: "slide-left", startFrame: 90,   endFrame: 210  },
  // s3: Solution · 7fit 登场（全屏口播，解决方案）
  { shotId: "s3", layoutId: "fullscreen",              transitionType: "ease-out",   startFrame: 210,  endFrame: 300  },
  // s4: Demo · 功能演示（左文右口播，演示核心功能）
  { shotId: "s4", layoutId: "left_text_right_talking", transitionType: "slide-left", startFrame: 300,  endFrame: 450  },
  // s5: Proof · 数据证明（2×2 网格，并列展示进步）
  { shotId: "s5", layoutId: "grid_2x2",                 transitionType: "fade",       startFrame: 450,  endFrame: 630  },
  // s6: Deep Dive · 深度讲解（左文右口播，讲解细节）
  { shotId: "s6", layoutId: "left_text_right_talking", transitionType: "slide-right", startFrame: 630, endFrame: 780 },
  // s7: CTA · 行动召唤（全屏口播，号召行动）
  { shotId: "s7", layoutId: "fullscreen",              transitionType: "zoom",       startFrame: 780,  endFrame: 900  },
  // s8: Brand · 品牌收尾（全屏口播，品牌 statement）
  { shotId: "s8", layoutId: "fullscreen",              transitionType: "fade",      startFrame: 900,  endFrame: 990  },
  // s9: Code · 代码展示（左侧代码，右下角色口播）
  { shotId: "s9", layoutId: "left_text_right_talking", transitionType: "slide-left", startFrame: 990,  endFrame: 1140 },
  // s10: GitLog · 版本历史展示（左侧滚动日志，右下角色口播）
  { shotId: "s10", layoutId: "left_text_right_talking", transitionType: "slide-right", startFrame: 1140, endFrame: 1290 },
  // s11: 50/50 分屏 · 左侧内容右侧口播
  { shotId: "s11", layoutId: "left_text_right_talking_50pct", transitionType: "ease-out", startFrame: 1290, endFrame: 1440 },
  // s12: Circle · 圆形口播收尾（isCircle 特殊渲染）
  { shotId: "s12", layoutId: "fullscreen", transitionType: "zoom", startFrame: 1440, endFrame: 1560 },
];

// ============================================================
// AI 背景图映射（mmx 生成后放到 remotion/public/images/bg/）
// 对应 shotSequence 的每个 shotId
// ============================================================
const BACKGROUND_MAP: Record<string, string> = {
  s1:  "images/bg/s1_hook.jpg",
  s2:  "images/bg/s2_pain.jpg",
  s3:  "images/bg/s3_solution.jpg",
  s4:  "images/bg/s4_demo.jpg",
  s5:  "images/bg/s5_proof.jpg",
  s6:  "images/bg/s6_deep_dive.jpg",
  s7:  "images/bg/s7_cta.jpg",
  s8:  "images/bg/s8_brand.jpg",
  s9:  "images/bg/s9_code.jpg",
  s10: "images/bg/s10_gitlog.jpg",
  s11: "images/bg/s11_talking.jpg",
  s12: "images/bg/s12_portrait.jpg",
};

// ============================================================
// 真实项目数据
// ============================================================

const CODE_SAMPLE = `interface ShotEntry {
  shotId: string;
  layoutId: string;
  transitionType: TransitionEasing;
  startFrame: number;
  endFrame: number;
  isCircle?: boolean;
}

const shotSequence: ShotEntry[] = [
  { shotId: "s1", layoutId: "fullscreen",
    transitionType: "zoom", startFrame: 0, endFrame: 90 },
  { shotId: "s2", layoutId: "left_text_right_talking",
    transitionType: "slide-left", startFrame: 90, endFrame: 210 },
];`;

const GITLOG_ENTRIES = [
  { hash: "506f249", author: "Claude", date: "2026-06-13", message: "feat: 文字最小24px规范落地 + 布局间距优化" },
  { hash: "03b1682", author: "Claude", date: "2026-06-13", message: "feat: add 8 AI-generated background images for workout_intro" },
  { hash: "fab61df", author: "Claude", date: "2026-06-13", message: "feat: enhance AnimatedTalkingHead with edge glow, circle mode" },
  { hash: "da5cbe2", author: "Claude", date: "2026-06-13", message: "feat(workout_intro): redesign 8-shot storyboard with per-shot AI backgrounds" },
  { hash: "9b4a7c5", author: "Claude", date: "2026-06-13", message: "feat: add MediaFallback global component with gradient fallback" },
  { hash: "b047d80", author: "Claude", date: "2026-06-12", message: "docs: add A类口播布局 usage spec to rules index" },
  { hash: "dd9ab21", author: "Claude", date: "2026-06-12", message: "docs: add A类视频布局状态机使用规范" },
  { hash: "b57714f", author: "Claude", date: "2026-06-12", message: "feat: add background layer to LayoutTransitionEngine" },
];

export const WorkoutIntro: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#0A0A0A" }}>
      <LayoutTransitionEngine
        videoSrc="videos/talking_head.mov"
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
          if (currentShotId === "s9") {
            return (
              <ShotContent
                currentShotId={currentShotId}
                contentType="code_display"
                codeContent={CODE_SAMPLE}
                curLayout={curLayout}
              />
            );
          }
          if (currentShotId === "s10") {
            return (
              <ShotContent
                currentShotId={currentShotId}
                contentType="gitlog_display"
                gitlogEntries={GITLOG_ENTRIES}
                gitlogVisibleCount={5}
                curLayout={curLayout}
              />
            );
          }
          if (currentShotId === "s11") {
            return (
              <div
                style={{
                  position: "absolute",
                  left: 960, top: 0, width: 910, height: 864,
                  background: "rgba(255,69,0,0.12)",
                  border: "2px solid #FF4500",
                  borderRadius: 20,
                  padding: "32px 40px",
                  backdropFilter: "blur(8px)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: 20,
                }}
              >
                <div style={{ fontSize: 32, fontWeight: 700, color: "#FF4500" }}>用产品思维去健身</div>
                <div style={{ fontSize: 24, color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>
                  把健身当成产品迭代<br />每一次训练都是用户研究
                </div>
              </div>
            );
          }
          return (
            <ShotContent
              currentShotId={currentShotId}
              contentType="image"
              contentSrc="images/demo.jpg"
              curLayout={curLayout}
            />
          );
        }}
      </LayoutTransitionEngine>
    </AbsoluteFill>
  );
};