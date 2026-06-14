import "./index.css";
import { Composition } from "remotion";
import { WingedScapulaB3 } from "./scenes/winged_scapula_b3";
import { B14PushDay } from "./scenes/b14_push_day";
import { WorkoutIntro } from "./scenes/workout_intro";
import { A2OnePerson50Videos } from "./scenes/a2_one_person_50_videos";

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

      <Composition
        id="b14-push-day"
        component={B14PushDay}
        durationInFrames={960}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          bgmVolume: 0.25,
          enableFadeIn: true,
        }}
      />

      {/* === A 类：1920×1080 横屏（16:9）=== */}
      <Composition
        id="workout-intro"
        component={WorkoutIntro}
        durationInFrames={975}  // 32.5s × 30fps（13镜×2.5s/镜）
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="a2-one-person-50-videos"
        component={A2OnePerson50Videos}
        durationInFrames={2974}  // 10镜 × ~99s（字幕全内容），末帧=2974
        fps={30}
        width={1920}
        height={1080}
      />

      {/* === C 类示例：1080×1920 竖屏（9:16）===
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