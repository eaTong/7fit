/**
 * 转场效果工具函数
 * 提供统一的 enter/exit 效果计算
 */

import { interpolate } from "remotion";

export type TransitionType =
  | "fade"
  | "push_left"
  | "push_right"
  | "slide-left"
  | "slide-up"
  | "zoom"
  | "none";

export interface TransitionEffect {
  opacity: number;
  translateX: number;
  translateY: number;
  scale: number;
}

/**
 * 计算指定转场类型在当前帧的视觉效果
 *
 * @param type - 转场类型
 * @param frame - 当前帧（相对 Sequence）
 * @param durationFrames - Sequence 总帧数
 * @param isEnter - true=计算转入效果(0→1)，false=计算转出效果(1→0)
 * @param transitionFrames - 转场帧数，默认 9
 */
export function getTransitionEffect(
  type: string,
  frame: number,
  durationFrames: number,
  isEnter: boolean,
  transitionFrames: number = 9
): TransitionEffect {
  const progress = isEnter
    ? interpolate(frame, [0, transitionFrames], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : interpolate(frame, [durationFrames - transitionFrames, durationFrames], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

  // t: enter 时 0→1, exit 时 1→0
  const t = isEnter ? progress : 1 - progress;

  switch (type) {
    case "push_left":
      return {
        opacity: t,
        translateX: interpolate(t, [0, 1], [80, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        translateY: 0,
        scale: 1,
      };

    case "push_right":
      return {
        opacity: t,
        translateX: interpolate(t, [0, 1], [-80, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        translateY: 0,
        scale: 1,
      };

    case "slide-left":
      return {
        opacity: t,
        translateX: interpolate(t, [0, 1], [50, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        translateY: 0,
        scale: 1,
      };

    case "slide-up":
      return {
        opacity: t,
        translateX: 0,
        translateY: interpolate(t, [0, 1], [50, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        scale: 1,
      };

    case "zoom":
      return {
        opacity: t,
        translateX: 0,
        translateY: 0,
        scale: interpolate(t, [0, 1], [1, 1.1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      };

    case "fade":
    case "pause_breath":
    case "none":
    default:
      return {
        opacity: t,
        translateX: 0,
        translateY: 0,
        scale: 1,
      };
  }
}