import { AbsoluteFill } from "remotion";
import { LayoutTransitionEngine } from "../../layout-state-machine/LayoutTransitionEngine";
import { ShotContent } from "../../layout-state-machine/ShotContent";
import { MediaFallback } from "../../components/media/MediaFallback";
import { CodeDisplay } from "../../components/terminal/CodeDisplay";
import { GitLogDisplay } from "../../components/terminal/GitLogDisplay";
import { OrbitingVideo } from "../../components/media/OrbitingVideo";
import type { ShotEntry } from "../../layout-state-machine/layouts/types";

// ============================================================
// 13-Shot A类布局展示（每种布局各一次，每镜 75 帧/2.5s @ 30fps）
// 叙事弧：全屏 → 左文右口播 → PIP右下 → PIP左下 → 网格 → 50%等分
//        → 右下角色口播 → 左下角色口播 → 顶部居中 → 左上角叠加
//        → 口播背景层 → 居中双侧 → 环形环绕
// ============================================================

const shotSequence: ShotEntry[] = [
  // s1: fullscreen（全屏口播，圆）
  { shotId: "s1", layoutId: "fullscreen",              transitionType: "zoom",       startFrame: 0,    endFrame: 75,   isCircle: true  },
  // s2: left_text_right_talking（左文右口播）
  { shotId: "s2", layoutId: "left_text_right_talking", transitionType: "slide-left", startFrame: 75,   endFrame: 150  },
  // s3: pip_bottom_right（右下角色口播）
  { shotId: "s3", layoutId: "pip_bottom_right",        transitionType: "slide-left", startFrame: 150,  endFrame: 225  },
  // s4: pip_bottom_left（左下角色口播）
  { shotId: "s4", layoutId: "pip_bottom_left",         transitionType: "slide-right", startFrame: 225,  endFrame: 300  },
  // s5: grid_2x2（2×2 网格）
  { shotId: "s5", layoutId: "grid_2x2",                transitionType: "fade",        startFrame: 300,  endFrame: 375  },
  // s6: left_text_right_talking_50pct（50%等分左文右口播）
  { shotId: "s6", layoutId: "left_text_right_talking_50pct", transitionType: "ease-out", startFrame: 375, endFrame: 450  },
  // s7: bottom_right_talking（右下角色口播，宽幅辅助内容）
  { shotId: "s7", layoutId: "bottom_right_talking",     transitionType: "slide-left", startFrame: 450,  endFrame: 525  },
  // s8: bottom_left_talking（左下角色口播）
  { shotId: "s8", layoutId: "bottom_left_talking",     transitionType: "slide-right", startFrame: 525, endFrame: 600  },
  // s9: top_center_talking（顶部居中口播）
  { shotId: "s9", layoutId: "top_center_talking",     transitionType: "slide-left", startFrame: 600,  endFrame: 675  },
  // s10: overlay_talking_head（左上角叠加口播）
  { shotId: "s10", layoutId: "overlay_talking_head",  transitionType: "ease-out",   startFrame: 675,  endFrame: 750  },
  // s11: centered_fullscreen_bg（口播全屏背景层，内容居中叠加）
  { shotId: "s11", layoutId: "centered_fullscreen_bg", transitionType: "fade",      startFrame: 750,  endFrame: 825  },
  // s12: center_dual_aux（居中口播，左右双侧辅助内容）
  { shotId: "s12", layoutId: "center_dual_aux",        transitionType: "ease-out",   startFrame: 825,  endFrame: 900  },
  // s13: orbiting_center（居中圆形，4个视频环绕旋转）
  { shotId: "s13", layoutId: "orbiting_center",        transitionType: "zoom",       startFrame: 900,  endFrame: 975, isCircle: true },
];

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
  s12: "images/bg/s_dual_aux.jpg",
  s13: "images/bg/s_orbiting.jpg",
};

// ============================================================
// 数据样本
// ============================================================

const CODE_SAMPLE = `interface ShotEntry {
  shotId: string;
  layoutId: string;
  transitionType: TransitionEasing;
  startFrame: number;
  endFrame: number;
}

const shotSequence: ShotEntry[] = [
  { shotId: "s1", layoutId: "fullscreen",
    transitionType: "zoom", startFrame: 0, endFrame: 75 },
];`;

const GITLOG_ENTRIES = [
  { hash: "506f249", author: "Claude", date: "2026-06-13", message: "feat: 文字最小24px规范落地" },
  { hash: "03b1682", author: "Claude", date: "2026-06-13", message: "feat: add 8 AI-generated background images" },
  { hash: "fab61df", author: "Claude", date: "2026-06-13", message: "feat: enhance AnimatedTalkingHead edge glow" },
  { hash: "b57714f", author: "Claude", date: "2026-06-12", message: "feat: add background layer to LayoutTransitionEngine" },
  { hash: "dd9ab21", author: "Claude", date: "2026-06-12", message: "docs: add A类视频布局状态机使用规范" },
];

// ============================================================
// 居中叠加内容卡片（centered_fullscreen_bg 用）
// ============================================================
const CenteredCard: React.FC<{ title: string; lines: string[] }> = ({ title, lines }) => (
  <div
    style={{
      position: "absolute",
      left: 560, top: 190, width: 800, height: 700,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: 28,
      zIndex: 10,
    }}
  >
    <div style={{ fontSize: 72, fontWeight: 900, color: "#FF4500" }}>{title}</div>
    {lines.map((line, i) => (
      <div key={i} style={{ fontSize: 40, color: "#FFFFFF", lineHeight: 1.6 }}>
        {line}
      </div>
    ))}
  </div>
);

// ============================================================
// 双侧内容（center_dual_aux 用）
// ============================================================
const DualAuxContent: React.FC = () => (
  <>
    {/* 左：代码 */}
    <CodeDisplay
      code={CODE_SAMPLE}
      language="typescript"
      fontSize={20}
      showLineNumbers
      maxHeight={800}
      style={{ position: "absolute", left: 50, top: 50, width: 400, height: 864 }}
    />
    {/* 右：GitLog */}
    <GitLogDisplay
      entries={GITLOG_ENTRIES}
      fontSize={20}
      visibleCount={6}
      style={{ position: "absolute", left: 1470, top: 50, width: 400, height: 864 }}
    />
  </>
);

// ============================================================
// 环形环绕元素（orbiting_center 用）
// ============================================================
const OrbitElements: React.FC = () => (
  <>
    {/* 右侧轨道 */}
    <OrbitingVideo src="videos/demo_01.mov" orbitRadius={420} orbitSpeed={12} startAngle={0} width={200} height={150} />
    {/* 左侧轨道（镜像） */}
    <OrbitingVideo src="videos/demo_02.mov" orbitRadius={420} orbitSpeed={12} startAngle={180} width={200} height={150} />
    {/* 顶部轨道 */}
    <OrbitingVideo src="videos/demo_03.mov" orbitRadius={420} orbitSpeed={12} startAngle={270} width={200} height={150} />
    {/* 底部轨道 */}
    <OrbitingVideo src="videos/demo_04.mov" orbitRadius={420} orbitSpeed={12} startAngle={90} width={200} height={150} />
  </>
);

// ============================================================
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
          // s11: centered_fullscreen_bg — 口播背景层 + 居中内容卡片
          if (currentShotId === "s11") {
            return <CenteredCard title="用产品思维去健身" lines={["把健身当成产品迭代", "每一次训练都是用户研究"]} />;
          }
          // s12: center_dual_aux — 左右双侧内容
          if (currentShotId === "s12") {
            return <DualAuxContent />;
          }
          // s13: orbiting_center — 环形环绕元素
          if (currentShotId === "s13") {
            return <OrbitElements />;
          }
          // s9: 代码展示（left_text_right_talking）
          if (currentShotId === "s9") {
            return (
              <ShotContent currentShotId={currentShotId} contentType="code_display" codeContent={CODE_SAMPLE} curLayout={curLayout} />
            );
          }
          // s10: GitLog 展示（left_text_right_talking）
          if (currentShotId === "s10") {
            return (
              <ShotContent currentShotId={currentShotId} contentType="gitlog_display" gitlogEntries={GITLOG_ENTRIES} gitlogVisibleCount={5} curLayout={curLayout} />
            );
          }
          // 其他：默认图片辅助内容
          return (
            <ShotContent currentShotId={currentShotId} contentType="image" contentSrc="images/demo.jpg" curLayout={curLayout} />
          );
        }}
      </LayoutTransitionEngine>
    </AbsoluteFill>
  );
};