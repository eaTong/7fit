/** 布局 ID 枚举（用于类型检查 + 反向查找）*/
export enum LayoutId {
  Fullscreen = "fullscreen",
  PipBottomRight = "pip_bottom_right",
  PipBottomLeft = "pip_bottom_left",
  Grid2x2 = "grid_2x2",
  BottomRightTalking = "bottom_right_talking",
  BottomLeftTalking = "bottom_left_talking",
  TopCenterTalking = "top_center_talking",
  OverlayTalkingHead = "overlay_talking_head",
  CenteredFullscreenBg = "centered_fullscreen_bg",
  CenterDualAux = "center_dual_aux",
  OrbitingCenter = "orbiting_center",
  TextCenterTalkingLeft = "text_center_talking_left",
  TextCenterTalkingRight = "text_center_talking_right",
}

export interface LayoutState {
  /** 唯一标识 */
  id: LayoutId;
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
  /** 口播是否为背景层（用于 centered_fullscreen_bg）*/
  isBackgroundLayer?: boolean;
  /** 口播背景层透明度（0~1）*/
  bgOpacity?: number;
  /** 多辅助元素区域槽位（布局可定义多个 auxiliary slot）*/
  auxiliarySlots?: AuxiliarySlot[];
}

export interface AuxiliarySlot {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
  /** 槽位名称（如 "left", "right", "center"）*/
  slot: string;
}

export type TransitionEasing =
  | "spring"
  | "ease-out"
  | "ease-in-out"
  | "crisp"
  | "standard"
  | "slide-left"
  | "slide-right"
  | "push_left"
  | "zoom"
  | "fade";

export interface ShotEntry {
  shotId: string;
  layoutId: LayoutId;
  transitionType: TransitionEasing;
  startFrame: number;
  endFrame: number;
  /** 强制正圆渲染（borderRadius = squareSize/2），用于 circleTransition 场景 */
  isCircle?: boolean;
}