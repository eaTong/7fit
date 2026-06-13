/**
 * A 类视频口播布局状态机 — 统一导出
 *
 * 使用方式：
 * import { LayoutTransitionEngine, ShotContent } from "../layout-state-machine";
 * import { getLayout, registerLayout } from "../layout-state-machine/layouts";
 * import type { LayoutState, ShotEntry, TransitionEasing } from "../layout-state-machine/layouts";
 */

export { LayoutTransitionEngine } from "./LayoutTransitionEngine";
export { AnimatedTalkingHead } from "./AnimatedTalkingHead";
export { ShotContent } from "./ShotContent";
export { AuxiliaryContentManager } from "./AuxiliaryContentManager";

export { registerLayout, getLayout, getAllLayouts } from "./layouts";
export type { LayoutState, ShotEntry, TransitionEasing } from "./layouts";