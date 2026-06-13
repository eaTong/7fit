import { AbsoluteFill } from "remotion";
import { LayoutTransitionEngine } from "../../layout-state-machine/LayoutTransitionEngine";
import { ShotContent } from "../../layout-state-machine/ShotContent";
import { MediaFallback } from "../../components/MediaFallback";
import type { ShotEntry } from "../../layout-state-machine/layouts/types";

// ============================================================
// 8-Shot A类视频叙事弧
// 叙事弧：Hook → Pain → Solution → Demo → Proof → Deep Dive → CTA → Brand
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
];

// ============================================================
// AI 背景图映射（mmx 生成后放到 remotion/public/images/bg/）
// 对应 shotSequence 的每个 shotId
// ============================================================
const BACKGROUND_MAP: Record<string, string> = {
  s1: "images/bg/s1_hook.jpg",
  s2: "images/bg/s2_pain.jpg",
  s3: "images/bg/s3_solution.jpg",
  s4: "images/bg/s4_demo.jpg",
  s5: "images/bg/s5_proof.jpg",
  s6: "images/bg/s6_deep_dive.jpg",
  s7: "images/bg/s7_cta.jpg",
  s8: "images/bg/s8_brand.jpg",
};

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
        {(_, curLayout, __, currentShotId) => (
          <ShotContent
            currentShotId={currentShotId}
            contentType="image"
            contentSrc="images/demo.jpg"
            curLayout={curLayout}
          />
        )}
      </LayoutTransitionEngine>
    </AbsoluteFill>
  );
};