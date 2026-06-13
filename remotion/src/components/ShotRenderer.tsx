/**
 * ShotRenderer — 转场包装组件（共享）
 *
 * 职责：
 * - 统一处理 enter/exit 转场动画（opacity + translateX/Y + scale）
 * - 接收 children 作为内容，不关心具体内容
 *
 * 使用方式：
 * <ShotRenderer
 *   transitionIn="push_left"
 *   transitionOut="fade"
 *   isFirst={false}
 *   paddedDuration={120}
 * >
 *   <ShotContent shot={shot} />
 * </ShotRenderer>
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { getTransitionEffect } from "../utils/transition";

interface ShotRendererProps {
  /** 转场类型：转入 */
  transitionIn: string;
  /** 转场类型：转出 */
  transitionOut: string;
  /** 是否是第一镜（跳过 enter fade）*/
  isFirst?: boolean;
  /** 是否是最后一镜（跳过 exit fade）*/
  isLast?: boolean;
  /** Sequence 实际帧数（含 crossfade padding）*/
  paddedDuration: number;
  /** 子组件内容 */
  children: React.ReactNode;
}

export const ShotRenderer: React.FC<ShotRendererProps> = ({
  transitionIn,
  transitionOut,
  isFirst = false,
  isLast = false,
  paddedDuration,
  children,
}) => {
  const frame = useCurrentFrame();

  // 转入效果
  const enter = getTransitionEffect(transitionIn, frame, paddedDuration, true);
  // 转出效果
  const exit = getTransitionEffect(transitionOut, frame, paddedDuration, false);

  // 合并：enter 渐入 + exit 渐出
  // 首镜跳过 enter fade，末镜跳过 exit fade
  const opacity = isFirst || isLast ? 1 : Math.min(enter.opacity, exit.opacity);
  const translateX = enter.translateX !== 0 ? enter.translateX : -exit.translateX;
  const translateY = enter.translateY !== 0 ? enter.translateY : -exit.translateY;
  const scale = enter.scale !== 1 ? enter.scale : exit.scale;

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};