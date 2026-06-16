import "./index.css";
import { Composition } from "remotion";
import { WingedScapulaB3 } from "./scenes/winged_scapula_b3";
import { B14PushDay } from "./scenes/b14_push_day";
import { B15Abs } from "./scenes/b15_abs";
import { B16PullDay } from "./scenes/b16_pull_day";
import { TalkingHeadEffectDemo } from "./scenes/talking_head_effect_demo";
import { A2OnePerson50Videos } from "./scenes/a2_one_person_50_videos";
import { A2TransitionSeries } from "./scenes/a2_transition_series";
import { C1PMFitnessLog } from "./scenes/c01_pm_fitness_log";

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

      {/* B14：pro + lite 双版本 */}
      <Composition
        id="b14-push-day-pro"
        component={B14PushDay}
        durationInFrames={930}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          variant: 'pro',
          bgmVolume: 0.25,
          enableFadeIn: true,
        }}
      />
      <Composition
        id="b14-push-day-lite"
        component={B14PushDay}
        durationInFrames={930}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          variant: 'lite',
          bgmVolume: 0.25,
          enableFadeIn: true,
        }}
      />

      {/* B15：pro + lite 双版本 */}
      <Composition
        id="b15-abs-pro"
        component={B15Abs}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          variant: 'pro',
          bgmVolume: 0.25,
          enableFadeIn: true,
        }}
      />
      <Composition
        id="b15-abs-lite"
        component={B15Abs}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          variant: 'lite',
          bgmVolume: 0.25,
          enableFadeIn: true,
        }}
      />

      {/* B16：pro + lite 双版本 */}
      <Composition
        id="b16-pull-day-pro"
        component={B16PullDay}
        durationInFrames={1050}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          variant: 'pro',
          bgmVolume: 0.25,
          enableFadeIn: true,
        }}
      />
      <Composition
        id="b16-pull-day-lite"
        component={B16PullDay}
        durationInFrames={1050}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          variant: 'lite',
          bgmVolume: 0.25,
          enableFadeIn: true,
        }}
      />

      {/* === 特效演示（D 类，口播特效演示）：1920×1080 横屏（16:9）===
          v3.4 升级：原 workout_intro（被误归为 A 类），实际是布局/特效演示视频，
          不符合 A 类 ≥ 90s 时长要求。重命名为 talking-head-effect-demo 并归为 D 类。 */}
      <Composition
        id="talking-head-effect-demo"
        component={TalkingHeadEffectDemo}
        durationInFrames={975}  // 32.5s × 30fps（13镜×2.5s/镜）
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="a2-one-person-50-videos"
        component={A2OnePerson50Videos}
        durationInFrames={4020}  // v4.1.1 拉长：用户录音 131.24s + 3s fade out = 134s × 30fps = 4020
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="a2-transition-series"
        component={A2TransitionSeries}
        durationInFrames={2974}  // 与 a2-one-person-50-videos 相同
        fps={30}
        width={1920}
        height={1080}
      />

      {/* === C 类：1080×1920 竖屏（9:16）===
          C-1 PM Fitness Log — 一个产品经理的健身自救（C 类 · 七练解码）
          v3.1 口播分段（8 段 TA0-TA7）+ 信息密度拉满
          90s × 30fps = 2700 帧
          A 版（健身角度）/ B 版（PM 角度）双版本 */}

      <Composition
        id="c1-pm-fitness-log-a"
        component={C1PMFitnessLog}
        durationInFrames={2700}  // 90s × 30fps
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ variant: "a" }}
      />
      <Composition
        id="c1-pm-fitness-log-b"
        component={C1PMFitnessLog}
        durationInFrames={2700}  // 90s × 30fps
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ variant: "b" }}
      />
    </>
  );
};