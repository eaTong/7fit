/**
 * OrbitingVideo — 环绕口播视频的旋转元素
 *
 * 沿环形轨道绕中心点旋转，每个元素独立视频源、独立轨道参数。
 * 用于 orbiting_center 布局。
 */

import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { MediaFallback } from "./MediaFallback";

interface OrbitingVideoProps {
  src: string;
  /** 轨道半径（从圆心到轨道中心的距离）*/
  orbitRadius: number;
  /** 轨道速度（度/秒，正值顺时针）*/
  orbitSpeed: number;
  /** 起始角度（度，0=右侧，90=下方，180=左侧，270=上方）*/
  startAngle: number;
  /** 圆心 X（默认画布中央）*/
  centerX?: number;
  /** 圆心 Y（默认画布中央）*/
  centerY?: number;
  /** 视频宽度*/
  width: number;
  /** 视频高度*/
  height: number;
  /** 是否圆形裁剪*/
  isCircle?: boolean;
  /** 入场帧数（默认 0）*/
  enterFrame?: number;
}

const CANVAS_CX = 960;
const CANVAS_CY = 540;

export const OrbitingVideo: React.FC<OrbitingVideoProps> = ({
  src,
  orbitRadius,
  orbitSpeed,
  startAngle,
  centerX = CANVAS_CX,
  centerY = CANVAS_CY,
  width,
  height,
  isCircle = false,
  enterFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relFrame = frame - enterFrame;

  // 轨道角度（弧度）
  const angleDeg = startAngle + (relFrame * orbitSpeed / fps);
  const angleRad = (angleDeg * Math.PI) / 180;

  // 圆心位置（带呼吸感的微弱浮动）
  const breatheX = interpolate(relFrame, [0, 60], [0, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const breatheY = interpolate(relFrame, [0, 45], [0, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const cx = centerX + breatheX;
  const cy = centerY + breatheY;

  // 计算当前位置（口播在圆心，环绕元素绕其旋转）
  const left = cx + orbitRadius * Math.cos(angleRad) - width / 2;
  const top  = cy + orbitRadius * Math.sin(angleRad) - height / 2;

  // 入场 opacity（0→1，ease-out）
  const opacity = interpolate(relFrame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const squareSize = Math.min(width, height);
  const radius = isCircle ? squareSize / 2 : 12;

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width,
        height,
        borderRadius: radius,
        overflow: "hidden",
        border: "2px solid rgba(255,255,255,0.6)",
        boxShadow: "0 0 16px rgba(255,255,255,0.2), 0 4px 16px rgba(0,0,0,0.6)",
        opacity: Math.max(0, Math.min(1, opacity)),
        zIndex: 10,
      }}
    >
      <MediaFallback
        src={src}
        type="video"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
};