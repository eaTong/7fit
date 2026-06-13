/**
 * 转场效果工具函数
 * 提供统一的 enter/exit 效果计算
 *
 * 支持的转场类型（共 14 种）：
 *
 * 【纯透明度】
 * - fade          淡入淡出（opacity 0↔1）
 *
 * 【水平位移】（X 轴）
 * - push_left     左推入（translateX: 80→0）
 * - push_right    右推入（translateX: -80→0）
 * - slide-left   左滑入（translateX: 50→0，较柔和）
 * - slide-right  右滑入（translateX: -50→0，较柔和）
 *
 * 【垂直位移】（Y 轴）
 * - slide-up     上滑入（translateY: 50→0）
 * - slide-down   下滑入（translateY: -50→0）
 *
 * 【缩放】
 * - zoom         放大入场（scale: 1.1→1）
 * - shrink       缩小退场（scale: 1→0.9）
 *
 * 【条纹擦除】（Wipe，translate + clip 组合）
 * - wipe-h       水平条纹擦除（横条纹依次扫过）
 * - wipe-v       垂直条纹擦除（竖条纹依次扫过）
 *
 * 【特殊】
 * - none         无转场（opacity=1，无位移/缩放）
 *
 * 7fit 调性选择：
 * - B 类健身：push_left / slide-left / zoom（力量感）
 * - A 类人设：fade / slide-up / slide-down（柔和自然）
 * - C 类产品：fade / slide-left / wipe-h（科技感）
 */

import { interpolate } from "remotion";

export type TransitionType =
  | "fade"
  | "push_left"
  | "push_right"
  | "slide-left"
  | "slide-right"
  | "slide-up"
  | "slide-down"
  | "zoom"
  | "shrink"
  | "wipe-h"
  | "wipe-v"
  | "none";

export interface TransitionEffect {
  opacity: number;
  translateX: number;
  translateY: number;
  scale: number;
  /** clip 路径（Wipe 系列用）*/
  clipRect?: { x: number; y: number; w: number; h: number };
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
  // progress: enter 时 0→1，exit 时从 1→0
  const progress = isEnter
    ? interpolate(frame, [0, transitionFrames], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : interpolate(frame, [durationFrames - transitionFrames, durationFrames], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

  // t: enter 时 0→1，exit 时 1→0
  const t = isEnter ? progress : 1 - progress;

  switch (type) {
    // ===== 纯透明度 =====
    case "fade":
      return { opacity: t, translateX: 0, translateY: 0, scale: 1 };

    // ===== 水平位移 =====
    case "push_left":
      return {
        opacity: t,
        translateX: interpolate(t, [0, 1], [80, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        translateY: 0,
        scale: 1,
      };

    case "push_right":
      return {
        opacity: t,
        translateX: interpolate(t, [0, 1], [-80, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        translateY: 0,
        scale: 1,
      };

    case "slide-left":
      return {
        opacity: t,
        translateX: interpolate(t, [0, 1], [50, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        translateY: 0,
        scale: 1,
      };

    case "slide-right":
      return {
        opacity: t,
        translateX: interpolate(t, [0, 1], [-50, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        translateY: 0,
        scale: 1,
      };

    // ===== 垂直位移 =====
    case "slide-up":
      return {
        opacity: t,
        translateX: 0,
        translateY: interpolate(t, [0, 1], [50, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        scale: 1,
      };

    case "slide-down":
      return {
        opacity: t,
        translateX: 0,
        translateY: interpolate(t, [0, 1], [-50, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        scale: 1,
      };

    // ===== 缩放 =====
    case "zoom":
      // 入场：scale 从 1.1→1（放大退出感），出场：scale 1→1.1（缩小离开感）
      return {
        opacity: t,
        translateX: 0,
        translateY: 0,
        scale: isEnter
          ? interpolate(t, [0, 1], [1.1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
          : interpolate(t, [0, 1], [1, 1.1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      };

    case "shrink":
      // 入场：scale 从 0.9→1（缩小进入），出场：scale 1→0.9（缩小离开）
      return {
        opacity: t,
        translateX: 0,
        translateY: 0,
        scale: isEnter
          ? interpolate(t, [0, 1], [0.9, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
          : interpolate(t, [0, 1], [1, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      };

    // ===== 条纹擦除（Wipe）=====
    // 3 条横条纹，从下往上依次扫过（wipe-h）
    case "wipe-h": {
      // 每条纹占 1/3 高度，3 条依次入场，每条间隔 transitionFrames/3
      const stripeH = 1920 / 3; // 每条纹高
      const stripeGap = transitionFrames / 3;
      const stripe1 = interpolate(t, [0, 1], [stripeH * 3, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const stripe2 = interpolate(t, [stripeGap, stripeGap + 1], [stripeH * 3, stripeH], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const stripe3 = interpolate(t, [stripeGap * 2, stripeGap * 2 + 1], [stripeH * 3, stripeH * 2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const clipH = Math.min(stripe1, stripe2, stripe3);
      return { opacity: t, translateX: 0, translateY: 0, scale: 1, clipRect: { x: 0, y: 1920 - clipH, w: 1080, h: clipH } };
    }

    // 3 条竖条纹，从左往右依次扫过（wipe-v）
    case "wipe-v": {
      const stripeW = 1080 / 3;
      const stripeGap = transitionFrames / 3;
      const stripe1 = interpolate(t, [0, 1], [stripeW * 3, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const stripe2 = interpolate(t, [stripeGap, stripeGap + 1], [stripeW * 3, stripeW], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const stripe3 = interpolate(t, [stripeGap * 2, stripeGap * 2 + 1], [stripeW * 3, stripeW * 2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const clipW = Math.min(stripe1, stripe2, stripe3);
      return { opacity: t, translateX: 0, translateY: 0, scale: 1, clipRect: { x: 0, y: 0, w: clipW, h: 1920 } };
    }

    // ===== 无转场 =====
    case "none":
    case "pause_breath":
    default:
      return { opacity: t, translateX: 0, translateY: 0, scale: 1 };
  }
}
