import "./index.css";
import { Composition } from "remotion";
import { WingedScapulaB3 } from "./scenes/winged_scapula_b3";

/**
 * A/B/C 三类视频的画布尺寸规范：
 * - A 类（个人人设）：1920×1080 横屏（16:9）
 * - B 类（健身知识）：1080×1920 竖屏（9:16）
 * - C 类（七练介绍）：1080×1920 竖屏（9:16）
 *
 * 每个 Composition 必须指定正确的 width/height。
 */

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* === B 类：1080×1920 竖屏（9:16）=== */}
      <Composition
        id="winged-scapula-b3"
        component={WingedScapulaB3}
        durationInFrames={2232}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* === A 类示例：1920×1080 横屏（16:9）===
      // 未来 A 类视频在此注册，示例：
      <Composition
        id="a2-one-person"
        component={A2OnePerson}
        durationInFrames={3315}  // 110.5s × 30fps
        fps={30}
        width={1920}
        height={1080}
      />
      */}

      {/* === C 类：1080×1920 竖屏（9:16）===
      // 未来 C 类视频在此注册，示例：
      <Composition
        id="c1-product-intro"
        component={C1ProductIntro}
        durationInFrames={1800}  // 60s × 30fps
        fps={30}
        width={1080}
        height={1920}
      />
      */}
    </>
  );
};
