export interface LayoutState {
  /** 唯一标识，如 "fullscreen" / "pip_bottom_right" */
  id: string;
  /** 左上角 X（横屏 1920 基准）*/
  left: number;
  /** 左上角 Y */
  top: number;
  /** 宽度 */
  width: number;
  /** 高度 */
  height: number;
  /** 圆角（px）*/
  borderRadius: number;
  /** 边框宽度（px）*/
  borderWidth: number;
  /** 边框颜色 */
  borderColor: string;
  /** 阴影 */
  shadow: string;
  /** 层叠顺序（默认 10）*/
  zIndex: number;
}

export type TransitionEasing =
  | "spring"
  | "ease-out"
  | "ease-in-out"
  | "crisp"
  | "standard";

export interface ShotEntry {
  shotId: string;
  layoutId: string;
  transitionType: TransitionEasing;
  startFrame: number;
  endFrame: number;
}