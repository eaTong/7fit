/**
 * HudBackground · C 类赛博解码视觉核心
 *
 * 用途：信息元件背景层（L1 氛围层）
 * - 网格（60px 间距，紫色低透明度）
 * - 扫描线（CRT 复古效果）
 * - 数据粒子（流动的十六进制字符）
 * - 角标装饰（4 个霓虹短角）
 *
 * 不需要外部素材，全部 CSS + 少量 DOM。
 */

import React, { useMemo } from "react";
import { useCurrentFrame, interpolate, random } from "remotion";

const WIDTH = 1920;
const HEIGHT = 1080;

export const HudBackground: React.FC<{ intensity?: number }> = ({
  intensity = 1,
}) => {
  const frame = useCurrentFrame();

  // 扫描线透明度（呼吸效果）
  const scanOpacity = useMemo(() => {
    return interpolate(Math.sin(frame * 0.04), [-1, 1], [0.04, 0.12], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }, [frame]);

  // 流动数据粒子（固定数量，位置稳定 + 颜色变化）
  const particles = useMemo(() => {
    const result: Array<{ x: number; y: number; ch: string; speed: number }> =
      [];
    const chars = ["0", "1", "F", "A", "7", "B", "9", "E", "2", "C"];
    for (let i = 0; i < 12; i++) {
      const seed = `particle-${i}`;
      result.push({
        x: random(seed) * WIDTH,
        y: random(`${seed}-y`) * HEIGHT,
        ch: chars[Math.floor(random(`${seed}-c`) * chars.length)],
        speed: 0.3 + random(`${seed}-s`) * 0.4,
      });
    }
    return result;
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: WIDTH,
        height: HEIGHT,
        overflow: "hidden",
        pointerEvents: "none",
        opacity: intensity,
      }}
    >
      {/* 1. 网格 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.06) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* 2. 扫描线 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.15) 2px,
            rgba(0, 0, 0, 0.15) 4px
          )`,
          opacity: scanOpacity,
        }}
      />

      {/* 3. 流动数据粒子（16 进制字符）*/}
      {particles.map((p, i) => {
        const yOffset = (frame * p.speed) % HEIGHT;
        const finalY = (p.y + yOffset) % HEIGHT;
        const charOpacity = interpolate(
          (frame * 0.1 + i * 5) % 100,
          [0, 50, 100],
          [0.1, 0.5, 0.1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x,
              top: finalY,
              color: "#00FF41",
              fontFamily: "monospace",
              fontSize: 18,
              fontWeight: "bold",
              opacity: charOpacity,
            }}
          >
            {p.ch}
          </div>
        );
      })}

      {/* 4. 四角装饰 */}
      {[
        { top: 16, left: 16, br: "borderTop borderLeft" },
        { top: 16, right: 16, br: "borderTop borderRight" },
        { bottom: 16, left: 16, br: "borderBottom borderLeft" },
        { bottom: 16, right: 16, br: "borderBottom borderRight" },
      ].map((corner, i) => {
        const sides: React.CSSProperties = {
          position: "absolute",
          width: 32,
          height: 32,
        };
        if (corner.top !== undefined) sides.top = corner.top;
        if (corner.bottom !== undefined) sides.bottom = corner.bottom;
        if (corner.left !== undefined) sides.left = corner.left;
        if (corner.right !== undefined) sides.right = corner.right;
        if (corner.br.includes("borderTop")) {
          sides.borderTop = "2px solid #FF4500";
        }
        if (corner.br.includes("borderBottom")) {
          sides.borderBottom = "2px solid #FF4500";
        }
        if (corner.br.includes("borderLeft")) {
          sides.borderLeft = "2px solid #FF4500";
        }
        if (corner.br.includes("borderRight")) {
          sides.borderRight = "2px solid #FF4500";
        }
        return <div key={i} style={sides} />;
      })}

      {/* 5. 顶部状态条（HUD 头栏装饰）*/}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: 56,
          background: "linear-gradient(180deg, rgba(255, 69, 0, 0.12) 0%, transparent 100%)",
          borderBottom: "1px solid rgba(255, 69, 0, 0.3)",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 24,
            top: 18,
            color: "#FF4500",
            fontFamily: "monospace",
            fontSize: 14,
            fontWeight: "bold",
            letterSpacing: "0.1em",
          }}
        >
          $ 7fit decode v1.0
        </div>
        <div
          style={{
            position: "absolute",
            right: 24,
            top: 18,
            color: "#00FF41",
            fontFamily: "monospace",
            fontSize: 14,
            fontWeight: "bold",
          }}
        >
          ● LIVE
        </div>
      </div>
    </div>
  );
};

export default HudBackground;
