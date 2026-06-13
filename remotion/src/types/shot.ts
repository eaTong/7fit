/**
 * 共享 Shot 类型定义
 * 所有 Scene 的 Shot 接口统一使用此定义
 */

export interface GridCell {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  source: string;
}

export interface Shot {
  shot_id: string;
  start: number;
  end: number;
  duration: number;
  content_type: string;
  content_source: string | null;
  voiceover: string | string[];  // B类：string（字幕文本）/ B类旁白：string[]
  description: string;
  transition_in: string;
  transition_out: string;
  grid_cells?: GridCell[];
  code_component?: string;
  code_props?: Record<string, string>;
  sfx?: string;
}

/** 转场类型枚举 */
export type TransitionType =
  | "fade"           // 淡入淡出
  | "push_left"      // 左推入
  | "push_right"     // 右推入
  | "slide-left"     // 左滑入
  | "slide-up"       // 上滑入
  | "zoom"           // 放大切入
  | "none";          // 无转场

/** 内容类型枚举 */
export type ContentType =
  | "video"
  | "video_grid"
  | "image"
  | "transition_card"
  | "pause_breath"   // freeze frame
  | "transition"     // 黑屏过渡
  | "code";