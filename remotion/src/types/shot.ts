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
  /** 字幕内容：string | string[]（多行）| SubtitleSegment[]（含高亮）*/
  voiceover: string | string[] | SubtitleSegment[];
  description: string;
  transition_in: string;
  transition_out: string;
  grid_cells?: GridCell[];
  code_component?: string;
  code_props?: Record<string, string>;
  sfx?: string;
}

/** 字幕段落（含高亮）*/
export interface SubtitleSegment {
  text: string;
  highlight?: boolean; // 高亮显示：橙底白字
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