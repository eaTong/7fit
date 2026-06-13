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
  /** 是否是第一镜（跳过 enter）*/
  isFirst?: boolean;
  /** 是否是最后一镜（跳过 exit）*/
  isLast?: boolean;
  /** Sequence 实际帧数 */
  paddedDuration: number;
  /** 转场帧数，默认 9 */
  transitionFrames?: number;
  /** 子组件内容 */
  children: React.ReactNode;
}

export const ShotRenderer: React.FC<ShotRendererProps> = ({
  transitionIn,
  transitionOut,
  isFirst = false,
  isLast = false,
  paddedDuration,
  transitionFrames = 9,
  children,
}) => {
  const frame = useCurrentFrame();

  // 计算 enter/exit 效果（传 frame=0 获取静态值）
  const enter = getTransitionEffect(transitionIn, frame, paddedDuration, true);
  const exit = getTransitionEffect(transitionOut, frame, paddedDuration, false);

  // enter 区间：[0, transitionFrames)，opacity 从 0→1
  // exit 区间：[paddedDuration - transitionFrames, paddedDuration)，opacity 从 1→0
  // 中间区域：opacity = 1

  const isInEnter = !isFirst && frame < transitionFrames;
  const isInExit = !isLast && frame >= paddedDuration - transitionFrames;

  // opacity：enter 和 exit 不重叠，各自区域各自生效
  const enterOpacity = isFirst ? 1 : (isInEnter ? enter.opacity : 1);
  const exitOpacity = isLast ? 1 : (isInExit ? exit.opacity : 1);
  const opacity = enterOpacity * exitOpacity;

  // translateX/Y：只在对应区间生效
  const translateX = isInEnter ? enter.translateX : (isInExit ? -exit.translateX : 0);
  const translateY = isInEnter ? enter.translateY : (isInExit ? -exit.translateY : 0);
  const scale = isInEnter ? enter.scale : (isInExit ? exit.scale : 1);

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