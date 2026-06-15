/**
 * WeeklyReportCard · AI 周报卡
 *
 * 用途：段 5 三场景 → AI 周报演示
 * - 顶部"第 N 周训练总结"标题
 * - 训练量 +8%（绿色数字 + 上箭头）
 * - RPE 上升（黄色警告 + 上箭头）
 * - 建议"安排轻训"（橙色 callout）
 * - 下周计划卡（mini 列表）
 * - 数据可视化折线（mock 7 天数据）
 *
 * 入场动效：spring 弹入 + 各模块 stagger
 */

import React from "react";
import { useCurrentFrame, spring, interpolate, useVideoConfig } from "remotion";

interface WeeklyReportCardProps {
  weekNumber?: number;
  startFrame?: number;
  width?: number;
  height?: number;
}

export const WeeklyReportCard: React.FC<WeeklyReportCardProps> = ({
  weekNumber = 24,
  startFrame = 0,
  width = 720,
  height = 480,
}) => {
  const frame = useCurrentFrame() - startFrame;
  const { fps } = useVideoConfig();

  // 主卡片入场
  const mainScale = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 180 },
  });
  const mainOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 训练量数字 spring
  const volumeScale = spring({
    frame: frame - 10,
    fps,
    config: { damping: 10, stiffness: 200 },
  });

  // RPE 警告 stagger
  const rpeOpacity = interpolate(frame, [25, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 建议条 stagger
  const suggestY = interpolate(frame, [40, 55], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const suggestOpacity = interpolate(frame, [40, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 折线图 stagger
  const chartOpacity = interpolate(frame, [55, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const chartProgress = interpolate(frame, [55, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 下周计划 stagger
  const nextPlanOpacity = interpolate(frame, [90, 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 7 天数据 mock（训练量递增 + 周末下降）
  const days = ["一", "二", "三", "四", "五", "六", "日"];
  const volumes = [60, 80, 75, 90, 95, 70, 40];
  const rpes = [6, 7, 7, 8, 9, 7, 5];
  const maxVol = Math.max(...volumes);

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        opacity: mainOpacity,
        transform: `scale(${mainScale})`,
      }}
    >
      {/* 主卡片背景 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(10, 10, 10, 0.88)",
          border: "1px solid rgba(255, 69, 0, 0.3)",
          borderRadius: 16,
          backdropFilter: "blur(8px)",
          boxShadow: "0 0 30px rgba(255, 69, 0, 0.15)",
        }}
      />

      {/* 4 个霓虹角标 */}
      {[
        { top: -2, left: -2, sides: "TL" },
        { top: -2, right: -2, sides: "TR" },
        { bottom: -2, left: -2, sides: "BL" },
        { bottom: -2, right: -2, sides: "BR" },
      ].map((c, i) => {
        const sides: React.CSSProperties = {
          position: "absolute",
          width: 16,
          height: 16,
        };
        if (c.top !== undefined) sides.top = c.top;
        if (c.bottom !== undefined) sides.bottom = c.bottom;
        if (c.left !== undefined) sides.left = c.left;
        if (c.right !== undefined) sides.right = c.right;
        const [a, b] = c.sides.split("");
        sides[
          a === "T" ? "borderTop" : "borderBottom"
        ] = `2px solid #FF4500`;
        sides[
          b === "L" ? "borderLeft" : "borderRight"
        ] = `2px solid #FF4500`;
        return <div key={i} style={sides} />;
      })}

      {/* 标题 */}
      <div
        style={{
          position: "absolute",
          top: 24,
          left: 32,
          color: "#888",
          fontFamily: "monospace",
          fontSize: 14,
        }}
      >
        📊 第 {weekNumber} 周训练总结
      </div>

      {/* 训练量行 */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 32,
          right: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            color: "#FFFFFF",
            fontSize: 18,
            fontFamily: "sans-serif",
          }}
        >
          训练量
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              color: "#00FF41",
              fontFamily: "monospace",
              fontSize: 36,
              fontWeight: "bold",
              transform: `scale(${volumeScale})`,
              transformOrigin: "right center",
            }}
          >
            +8%
          </div>
          <div
            style={{
              color: "#00FF41",
              fontSize: 24,
            }}
          >
            ↑
          </div>
        </div>
      </div>

      {/* RPE 警告行 */}
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 32,
          right: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          opacity: rpeOpacity,
        }}
      >
        <div
          style={{
            color: "#FFFFFF",
            fontSize: 18,
            fontFamily: "sans-serif",
          }}
        >
          RPE 平均
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              color: "#FFB300",
              fontFamily: "monospace",
              fontSize: 28,
              fontWeight: "bold",
            }}
          >
            7.8
          </div>
          <div
            style={{
              color: "#FFB300",
              fontSize: 20,
            }}
          >
            ↑
          </div>
          <div
            style={{
              color: "#FF4500",
              fontSize: 12,
              background: "rgba(255, 69, 0, 0.15)",
              padding: "2px 8px",
              borderRadius: 4,
              marginLeft: 8,
            }}
          >
            ⚠ 上升
          </div>
        </div>
      </div>

      {/* 折线图 */}
      <div
        style={{
          position: "absolute",
          top: 180,
          left: 32,
          right: 32,
          height: 140,
          opacity: chartOpacity,
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 600 140" preserveAspectRatio="none">
          {/* 网格线 */}
          {[0, 1, 2, 3].map((i) => (
            <line
              key={i}
              x1="0"
              y1={i * 40 + 10}
              x2="600"
              y2={i * 40 + 10}
              stroke="rgba(139, 92, 246, 0.1)"
              strokeWidth="1"
            />
          ))}

          {/* 训练量折线 */}
          <polyline
            points={volumes
              .map((v, i) => {
                const x = (i / 6) * 580 + 10;
                const y = 130 - (v / maxVol) * 100;
                return `${x},${y}`;
              })
              .join(" ")}
            fill="none"
            stroke="#00FF41"
            strokeWidth="2"
            strokeDasharray="1000"
            strokeDashoffset={1000 - 1000 * chartProgress}
            style={{ filter: "drop-shadow(0 0 4px #00FF41)" }}
          />

          {/* RPE 折线 */}
          <polyline
            points={rpes
              .map((r, i) => {
                const x = (i / 6) * 580 + 10;
                const y = 130 - (r / 10) * 100;
                return `${x},${y}`;
              })
              .join(" ")}
            fill="none"
            stroke="#FFB300"
            strokeWidth="2"
            strokeDasharray="1000"
            strokeDashoffset={1000 - 1000 * chartProgress}
          />

          {/* 训练量点 */}
          {volumes.map((v, i) => {
            const x = (i / 6) * 580 + 10;
            const y = 130 - (v / maxVol) * 100;
            const visible = i / 6 < chartProgress;
            if (!visible) return null;
            return (
              <circle
                key={`vol-${i}`}
                cx={x}
                cy={y}
                r={3}
                fill="#00FF41"
                style={{ filter: "drop-shadow(0 0 3px #00FF41)" }}
              />
            );
          })}
        </svg>

        {/* 星期标签 */}
        <div
          style={{
            position: "absolute",
            bottom: -20,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "space-between",
            padding: "0 8px",
            color: "#888",
            fontFamily: "monospace",
            fontSize: 11,
          }}
        >
          {days.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
      </div>

      {/* 建议 callout */}
      <div
        style={{
          position: "absolute",
          top: 320,
          left: 32,
          right: 32,
          background: "rgba(255, 69, 0, 0.12)",
          border: "1px solid rgba(255, 69, 0, 0.4)",
          borderRadius: 8,
          padding: "12px 16px",
          transform: `translateY(${suggestY}px)`,
          opacity: suggestOpacity,
        }}
      >
        <div
          style={{
            color: "#FF4500",
            fontFamily: "monospace",
            fontSize: 12,
            fontWeight: "bold",
            marginBottom: 4,
          }}
        >
          ⚡ AI 建议
        </div>
        <div
          style={{
            color: "#FFFFFF",
            fontSize: 15,
            fontFamily: "sans-serif",
          }}
        >
          下周安排一次轻训，降低 RPE 风险
        </div>
      </div>

      {/* 下周计划卡 */}
      <div
        style={{
          position: "absolute",
          top: 400,
          left: 32,
          right: 32,
          opacity: nextPlanOpacity,
        }}
      >
        <div
          style={{
            color: "#888",
            fontFamily: "monospace",
            fontSize: 12,
            marginBottom: 6,
          }}
        >
          📋 下周计划
        </div>
        <div
          style={{
            display: "flex",
            gap: 6,
          }}
        >
          {[
            { day: "一", action: "上肢推" },
            { day: "二", action: "轻训" },
            { day: "三", action: "下肢" },
            { day: "四", action: "休息" },
          ].map((p, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                background: "rgba(0, 188, 212, 0.08)",
                border: "1px solid rgba(0, 188, 212, 0.2)",
                borderRadius: 6,
                padding: "8px 4px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  color: "#00BCD4",
                  fontFamily: "monospace",
                  fontSize: 11,
                  marginBottom: 2,
                }}
              >
                周{p.day}
              </div>
              <div
                style={{
                  color: "#FFFFFF",
                  fontSize: 12,
                  fontFamily: "sans-serif",
                }}
              >
                {p.action}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklyReportCard;
