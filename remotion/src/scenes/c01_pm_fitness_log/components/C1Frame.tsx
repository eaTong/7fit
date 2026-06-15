/**
 * C1Frame · C-1 8 镜主体画面
 *
 * 每镜内容：
 * - 背景：HudBackground（L1 氛围）
 * - 主体：信息元件（数据卡/折线/高亮）
 * - 转场：入/出
 *
 * 8 镜：
 * - S0 钩子：终端逐行打字 + 数字卡 + 时间轴
 * - S1 皮质醇：数据卡 + 折线 + 症状列
 * - S2 反思：字段列表 + 30s 数字 + 高亮条
 * - S3 PM 翻译：PRD 文档 + 训练日志 + 批注条
 * - S4 小程序：截图卡 + 3 秒标签 + 流程箭头
 * - S5 三场景：围度记录/智能查询/AI 周报三卡轮换
 * - S6 金句：30 vs 3 对比 + 删除线
 * - S7 CTA：品牌文字 + 互动卡片 + 彩蛋
 */

import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

interface C1FrameProps {
  shotId: string;
  shotIndex: number;
  transitionIn: string;
  transitionOut: string;
  variant: "a" | "b";
}

const FONT_MONO = "monospace";
const FONT_SANS = "sans-serif";

export const C1Frame: React.FC<C1FrameProps> = ({
  shotId,
  shotIndex,
  transitionIn,
  transitionOut,
  variant,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 入场通用：scale 0.95 → 1
  const enterScale = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 180 },
  });
  const enterOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        opacity: enterOpacity,
        transform: `scale(${enterScale})`,
      }}
    >
      {shotId === "s0" && <S0Hook frame={frame} fps={fps} variant={variant} />}
      {shotId === "s1" && <S1Cortisol frame={frame} fps={fps} />}
      {shotId === "s2" && <S2Reflect frame={frame} fps={fps} />}
      {shotId === "s3" && <S3PMTranslate frame={frame} fps={fps} />}
      {shotId === "s4" && <S4MiniApp frame={frame} fps={fps} />}
      {shotId === "s5" && <S5Scenes frame={frame} fps={fps} />}
      {shotId === "s6" && <S6Quote frame={frame} fps={fps} />}
      {shotId === "s7" && <S7CTA frame={frame} fps={fps} />}
    </div>
  );
};

/* ============== S0 钩子 ============== */
const S0Hook: React.FC<{ frame: number; fps: number; variant: "a" | "b" }> = ({
  frame,
  fps,
  variant,
}) => {
  const lines = variant === "b"
    ? ["> 一个 PM 的健身数据焦虑", "> 和我的 AI 解法", "> ……"]
    : ["$ 练了 2 年", "$ 皮质醇过载", "$ 2 周睡不着", "$ ……"];

  // 打字机效果：每 0.3s 出现一行
  const linesVisible = Math.min(lines.length, Math.floor(frame / 9) + 1);
  const lastLineChars = Math.min(
    lines[linesVisible - 1].length,
    Math.floor((frame % 9) * 1.5),
  );

  return (
    <>
      {/* 终端块（左上）*/}
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 60,
          width: 600,
          padding: 24,
          background: "rgba(10, 10, 10, 0.85)",
          border: "1px solid rgba(0, 255, 65, 0.3)",
          borderRadius: 8,
          fontFamily: FONT_MONO,
          fontSize: 20,
        }}
      >
        {lines.slice(0, linesVisible).map((line, i) => (
          <div
            key={i}
            style={{
              color: "#00FF41",
              marginBottom: 6,
              whiteSpace: "pre",
            }}
          >
            {i === linesVisible - 1
              ? line.slice(0, lastLineChars) + (Math.floor(frame / 6) % 2 === 0 ? "▊" : "")
              : line}
          </div>
        ))}
      </div>

      {/* 数字卡"2周"（右上）*/}
      <div
        style={{
          position: "absolute",
          top: 120,
          right: 60,
          width: 240,
          height: 160,
          background: "rgba(255, 69, 0, 0.15)",
          border: "2px solid #FF4500",
          borderRadius: 12,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          transform: `scale(${spring({ frame: frame - 15, fps, config: { damping: 10, stiffness: 200 } })})`,
        }}
      >
        <div style={{ color: "#888", fontSize: 14, fontFamily: FONT_MONO, marginBottom: 8 }}>
          ⚠ 持续时长
        </div>
        <div style={{ color: "#FF4500", fontSize: 72, fontWeight: "bold", fontFamily: FONT_MONO }}>
          2周
        </div>
      </div>

      {/* 时间轴（中部）*/}
      <div
        style={{
          position: "absolute",
          top: 380,
          left: 60,
          right: 60,
          height: 80,
          padding: 16,
          background: "rgba(10, 10, 10, 0.7)",
          border: "1px solid rgba(255, 69, 0, 0.3)",
          borderRadius: 8,
        }}
      >
        <div style={{ color: "#888", fontSize: 12, fontFamily: FONT_MONO, marginBottom: 8 }}>
          $ cortisol-timeline
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {[
            { week: "W1-2", label: "失眠", color: "#888" },
            { week: "W3", label: "意识到", color: "#FF4500" },
            { week: "W4-5", label: "恢复", color: "#00FF41" },
          ].map((it, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ color: it.color, fontSize: 14, fontFamily: FONT_MONO, fontWeight: "bold" }}>
                {it.week}
              </div>
              <div style={{ color: "#FFF", fontSize: 12, fontFamily: FONT_SANS, marginTop: 2 }}>
                {it.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

/* ============== S1 皮质醇 ============== */
const S1Cortisol: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  // 症状列表
  const symptoms = [
    { icon: "😴", text: "失眠", delay: 5 },
    { icon: "☁️", text: "白天像踩棉花", delay: 25 },
    { icon: "⚠️", text: "皮质醇↑", delay: 50 },
  ];

  // 数据卡入场
  const cardScale = spring({ frame, fps, config: { damping: 14, stiffness: 180 } });

  return (
    <>
      {/* 标题 + 折线（左侧主信息区）*/}
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 60,
          width: 580,
          height: 380,
          background: "rgba(10, 10, 10, 0.85)",
          border: "1px solid rgba(255, 69, 0, 0.3)",
          borderRadius: 12,
          padding: 24,
          opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          transform: `scale(${cardScale})`,
        }}
      >
        <div style={{ color: "#FF4500", fontSize: 16, fontFamily: FONT_MONO, fontWeight: "bold", marginBottom: 8 }}>
          📊 皮质醇检测报告
        </div>
        <div style={{ color: "#888", fontSize: 12, fontFamily: FONT_MONO, marginBottom: 16 }}>
          Range: W1 → W5
        </div>

        {/* SVG 折线图 */}
        <svg width="100%" height="240" viewBox="0 0 520 240" preserveAspectRatio="none">
          {/* 网格 */}
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1="40" y1={i * 60 + 20} x2="500" y2={i * 60 + 20}
              stroke="rgba(139, 92, 246, 0.1)" strokeWidth="1" />
          ))}

          {/* 训练量线（蓝色，持平）*/}
          <line x1="40" y1="160" x2="500" y2="160"
            stroke="#00BCD4" strokeWidth="2" strokeDasharray="4 4" />
          <text x="40" y="155" fill="#00BCD4" fontSize="10" fontFamily="monospace">训练量</text>

          {/* RPE 折线（橙红色，攀升）*/}
          <polyline
            points="40,200 130,180 220,150 310,100 400,60 500,40"
            fill="none" stroke="#FF4500" strokeWidth="3"
            strokeDasharray="1000"
            strokeDashoffset={1000 - 1000 * Math.min(1, frame / 80)}
            style={{ filter: "drop-shadow(0 0 4px #FF4500)" }}
          />
          <text x="40" y="195" fill="#FF4500" fontSize="10" fontFamily="monospace">RPE / 疲劳</text>

          {/* 交叉点标注（Week3）*/}
          <circle cx="220" cy="150" r="6" fill="#FF4500" style={{ filter: "drop-shadow(0 0 6px #FF4500)" }} />
          {frame > 90 && (
            <text x="240" y="145" fill="#FFFFFF" fontSize="11" fontFamily="monospace">
              ⚠ 皮质醇阈值
            </text>
          )}
        </svg>
      </div>

      {/* 数字标签"3-4周训练损失"（右上）*/}
      <div
        style={{
          position: "absolute",
          top: 120,
          right: 60,
          width: 240,
          height: 100,
          background: "rgba(220, 20, 60, 0.15)",
          border: "2px solid #DC143C",
          borderRadius: 12,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: interpolate(frame, [20, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        <div style={{ color: "#DC143C", fontSize: 36, fontWeight: "bold", fontFamily: FONT_MONO }}>
          3-4周
        </div>
        <div style={{ color: "#FFF", fontSize: 12, fontFamily: FONT_SANS, marginTop: 4 }}>
          训练损失
        </div>
      </div>

      {/* 症状列表（左侧底部）*/}
      <div
        style={{
          position: "absolute",
          top: 540,
          left: 60,
          right: 60,
          display: "flex",
          gap: 12,
        }}
      >
        {symptoms.map((s, i) => {
          const symProgress = interpolate(frame, [s.delay, s.delay + 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={i}
              style={{
                flex: 1,
                background: "rgba(220, 20, 60, 0.1)",
                border: "1px solid rgba(220, 20, 60, 0.4)",
                borderRadius: 8,
                padding: "12px 16px",
                opacity: symProgress,
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ color: "#FFF", fontSize: 14, fontFamily: FONT_SANS }}>{s.text}</div>
            </div>
          );
        })}
      </div>

      {/* 状态栏（底部）*/}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 48,
          background: "rgba(255, 69, 0, 0.1)",
          borderTop: "1px solid rgba(255, 69, 0, 0.3)",
          display: "flex",
          alignItems: "center",
          padding: "0 32px",
          fontFamily: FONT_MONO,
          fontSize: 14,
          color: "#FF4500",
        }}
      >
        $ status: 恢复中 → 轻训 2周
      </div>
    </>
  );
};

/* ============== S2 反思 ============== */
const S2Reflect: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  // 6 个表单字段
  const fields = ["动作名", "重量", "组数", "次数", "RPE", "备注"];

  return (
    <>
      {/* 左侧字段列表 */}
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 60,
          width: 480,
          height: 580,
          background: "rgba(10, 10, 10, 0.85)",
          border: "1px solid rgba(255, 69, 0, 0.3)",
          borderRadius: 12,
          padding: 24,
        }}
      >
        <div style={{ color: "#FF4500", fontSize: 16, fontFamily: FONT_MONO, fontWeight: "bold", marginBottom: 4 }}>
          📝 训练记录表单
        </div>
        <div style={{ color: "#888", fontSize: 12, fontFamily: FONT_MONO, marginBottom: 20 }}>
          6 字段 · 每次练完填
        </div>

        {fields.map((f, i) => {
          const fieldProgress = interpolate(frame, [10 + i * 5, 18 + i * 5], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 12px",
                marginBottom: 8,
                background: fieldProgress > 0.8 ? "rgba(255, 69, 0, 0.15)" : "rgba(255, 255, 255, 0.03)",
                border: fieldProgress > 0.8 ? "1px solid #FF4500" : "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: 6,
                opacity: fieldProgress,
              }}
            >
              <div style={{ color: "#00FF41", marginRight: 12, fontFamily: FONT_MONO }}>☑</div>
              <div style={{ color: "#FFF", fontSize: 16, fontFamily: FONT_SANS }}>{f}</div>
            </div>
          );
        })}
      </div>

      {/* 右侧 30s 大数字 */}
      <div
        style={{
          position: "absolute",
          top: 120,
          right: 60,
          width: 380,
          height: 380,
          background: "rgba(255, 69, 0, 0.1)",
          border: "2px solid #FF4500",
          borderRadius: 16,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ color: "#888", fontSize: 14, fontFamily: FONT_MONO, marginBottom: 8 }}>
          ⏱ 每次练完
        </div>
        <div
          style={{
            color: "#FF4500",
            fontSize: 144,
            fontWeight: "bold",
            fontFamily: FONT_MONO,
            transform: `scale(${1 + Math.sin(frame * 0.15) * 0.05})`,
            textShadow: "0 0 30px rgba(255, 69, 0, 0.5)",
          }}
        >
          30s
        </div>
        <div style={{ color: "#FFF", fontSize: 14, fontFamily: FONT_SANS, marginTop: 8 }}>
          坚持不了 6 个月
        </div>
      </div>

      {/* 底部高亮条（最后一句弹出）*/}
      {frame > 280 && (
        <div
          style={{
            position: "absolute",
            bottom: 80,
            left: 60,
            right: 60,
            height: 64,
            background: "#FF4500",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            padding: "0 32px",
            fontFamily: FONT_MONO,
            fontSize: 24,
            fontWeight: "bold",
            color: "#FFF",
            transform: `translateY(${interpolate(frame, [280, 300], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
            opacity: interpolate(frame, [280, 300], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          坚持不了 6 个月
        </div>
      )}
    </>
  );
};

/* ============== S3 PM 翻译 ============== */
const S3PMTranslate: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  return (
    <>
      {/* 左侧 PRD 文档 */}
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 60,
          width: 460,
          height: 480,
          background: "rgba(10, 10, 10, 0.88)",
          border: "1px solid rgba(0, 188, 212, 0.3)",
          borderRadius: 12,
          padding: 24,
          fontFamily: FONT_MONO,
        }}
      >
        <div style={{ color: "#00BCD4", fontSize: 14, fontWeight: "bold", marginBottom: 4 }}>
          [PRD] 需求 #421
        </div>
        <div style={{ color: "#888", fontSize: 12, marginBottom: 16 }}>
          Feature: 训练数据可追溯
        </div>
        <div style={{ color: "#FFF", fontSize: 13, lineHeight: 1.8 }}>
          <div>• 用户每次练完自动归档</div>
          <div>• 每周生成复盘结论</div>
          <div>• 数据可视化，趋势可读</div>
          <div style={{ color: "#00FF41", marginTop: 12 }}>// PM 批注：</div>
          <div style={{ color: "#00FF41" }}>// 监控做在事前</div>
          <div style={{ color: "#00FF41" }}>// 比复盘便宜得多</div>
        </div>
      </div>

      {/* 右侧 训练日志 */}
      <div
        style={{
          position: "absolute",
          top: 120,
          right: 60,
          width: 460,
          height: 480,
          background: "rgba(10, 10, 10, 0.88)",
          border: "1px solid rgba(255, 69, 0, 0.3)",
          borderRadius: 12,
          padding: 24,
          fontFamily: FONT_MONO,
        }}
      >
        <div style={{ color: "#FF4500", fontSize: 14, fontWeight: "bold", marginBottom: 4 }}>
          [训练日志]
        </div>
        <div style={{ color: "#888", fontSize: 12, marginBottom: 16 }}>
          2026.03.15
        </div>
        <div style={{ color: "#FFF", fontSize: 14, lineHeight: 2 }}>
          <div>卧推 80kg × 8 × 5</div>
          <div>深蹲 100kg × 5 × 5</div>
          <div>引体向上 × 10 × 4</div>
          <div style={{ color: "#888", fontSize: 12, marginTop: 16 }}>RPE 平均: 7.5</div>
          <div style={{ color: "#888", fontSize: 12 }}>时长: 75 min</div>
        </div>
      </div>

      {/* 底部批注条 */}
      {frame > 200 && (
        <div
          style={{
            position: "absolute",
            bottom: 80,
            left: 60,
            right: 60,
            padding: "16px 24px",
            background: "rgba(106, 153, 85, 0.15)",
            border: "1px solid rgba(106, 153, 85, 0.4)",
            borderLeft: "4px solid #6A9955",
            borderRadius: 6,
            fontFamily: FONT_MONO,
            fontSize: 16,
            color: "#FFF",
            opacity: interpolate(frame, [200, 220], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          <span style={{ color: "#6A9955" }}>//</span> 等价于产品上线一个月，才发现功能用户根本不用
        </div>
      )}
    </>
  );
};

/* ============== S4 小程序 ============== */
const S4MiniApp: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  // AI 解析卡片入场
  const cardScale = spring({ frame: frame - 60, fps, config: { damping: 12, stiffness: 200 } });

  return (
    <>
      {/* 小程序截图模拟（手机框）*/}
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 200,
          width: 380,
          height: 700,
          background: "#1A1A1A",
          border: "3px solid #FF4500",
          borderRadius: 32,
          padding: 12,
          boxShadow: "0 0 40px rgba(255, 69, 0, 0.3)",
        }}
      >
        {/* 顶部状态 */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "8px 16px",
          color: "#FFF",
          fontFamily: FONT_MONO,
          fontSize: 12,
        }}>
          <span>9:41</span>
          <span>📶 🔋</span>
        </div>

        {/* 对话内容 */}
        <div style={{ padding: 16, color: "#FFF" }}>
          {/* 用户消息 */}
          <div
            style={{
              background: "#FF4500",
              color: "#FFF",
              padding: "10px 14px",
              borderRadius: 16,
              marginBottom: 12,
              fontFamily: FONT_SANS,
              fontSize: 14,
              maxWidth: "85%",
              marginLeft: "auto",
            }}
          >
            深蹲 100kg 5 组每组 8 个
          </div>

          {/* AI 回复（解析卡片）*/}
          <div
            style={{
              background: "rgba(0, 188, 212, 0.1)",
              border: "1px solid #00BCD4",
              borderRadius: 16,
              padding: 16,
              transform: `scale(${cardScale})`,
              transformOrigin: "top left",
            }}
          >
            <div style={{ color: "#00BCD4", fontFamily: FONT_MONO, fontSize: 11, marginBottom: 8 }}>
              ✓ 已解析
            </div>
            <div style={{ fontFamily: FONT_SANS, fontSize: 14, lineHeight: 1.8 }}>
              <div>🏋️ <strong>深蹲</strong></div>
              <div style={{ color: "#888", fontSize: 12 }}>重量: 100kg</div>
              <div style={{ color: "#888", fontSize: 12 }}>组数 × 次数: 5 × 8</div>
              <div style={{ color: "#00FF41", fontSize: 12, marginTop: 6 }}>✓ 已保存</div>
            </div>
          </div>
        </div>
      </div>

      {/* "3 秒"大标签（右上）*/}
      <div
        style={{
          position: "absolute",
          top: 200,
          right: 100,
          width: 200,
          height: 200,
          background: "rgba(255, 69, 0, 0.2)",
          border: "3px solid #FF4500",
          borderRadius: 16,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: interpolate(frame, [50, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        <div style={{ color: "#888", fontSize: 12, fontFamily: FONT_MONO, marginBottom: 4 }}>
          ⏱ 耗时
        </div>
        <div style={{ color: "#FF4500", fontSize: 80, fontWeight: "bold", fontFamily: FONT_MONO }}>
          3
        </div>
        <div style={{ color: "#FF4500", fontSize: 24, fontFamily: FONT_MONO }}>
          秒
        </div>
      </div>

      {/* 流程箭头（底部）*/}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 100,
          right: 100,
          height: 50,
          background: "rgba(0, 188, 212, 0.1)",
          border: "1px solid #00BCD4",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          fontFamily: FONT_MONO,
          fontSize: 16,
          color: "#00BCD4",
        }}
      >
        <span>🎙 语音</span>
        <span>→</span>
        <span>🤖 AI 解析</span>
        <span>→</span>
        <span>📊 结构化</span>
        <span>→</span>
        <span style={{ color: "#00FF41" }}>✓ 保存</span>
      </div>
    </>
  );
};

/* ============== S5 三场景 ============== */
const S5Scenes: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  // 18s = 540 帧
  // 场景1: 0-180 帧 (0-6s)
  // 场景2: 180-360 帧 (6-12s)
  // 场景3: 360-540 帧 (12-18s)
  const currentScene = frame < 180 ? 0 : frame < 360 ? 1 : 2;

  const scenes = [
    {
      icon: "📏",
      title: "围度记录",
      input: "今天胸围 94 腰围 78",
      output: "✓ 已保存",
      desc: "不只记训练，围度也能记",
    },
    {
      icon: "🔍",
      title: "智能查询",
      input: '"这周跑了多少次？"',
      output: "本周跑步 3 次 / 15km",
      desc: "AI 直接给结论",
    },
    {
      icon: "📊",
      title: "AI 周报",
      input: "训练量 +8% / RPE ↑",
      output: "建议: 安排轻训",
      desc: "基于你的数据定制",
    },
  ];

  return (
    <>
      {/* 三个场景卡片（从左到右排列，当前高亮放大）*/}
      {scenes.map((s, i) => {
        const isCurrent = i === currentScene;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 140,
              left: 60 + i * 320,
              width: 280,
              height: 520,
              background: isCurrent ? "rgba(255, 69, 0, 0.12)" : "rgba(10, 10, 10, 0.5)",
              border: isCurrent ? "2px solid #FF4500" : "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: 12,
              padding: 20,
              opacity: isCurrent ? 1 : 0.4,
              transform: isCurrent
                ? `scale(${1})`
                : `scale(0.95)`,
              transition: "opacity 0.3s",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 12 }}>{s.icon}</div>
            <div style={{ color: isCurrent ? "#FF4500" : "#888", fontSize: 18, fontWeight: "bold", fontFamily: FONT_SANS, marginBottom: 16 }}>
              {s.title}
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ color: "#888", fontSize: 11, fontFamily: FONT_MONO, marginBottom: 4 }}>
                用户输入
              </div>
              <div style={{
                color: "#FFF",
                background: "rgba(255, 69, 0, 0.2)",
                padding: "8px 12px",
                borderRadius: 6,
                fontFamily: FONT_SANS,
                fontSize: 13,
              }}>
                {s.input}
              </div>
            </div>

            <div>
              <div style={{ color: "#888", fontSize: 11, fontFamily: FONT_MONO, marginBottom: 4 }}>
                AI 输出
              </div>
              <div style={{
                color: "#00FF41",
                background: "rgba(0, 255, 65, 0.1)",
                padding: "8px 12px",
                borderRadius: 6,
                fontFamily: FONT_SANS,
                fontSize: 13,
              }}>
                {s.output}
              </div>
            </div>

            <div style={{
              color: "#FFF",
              fontSize: 12,
              fontFamily: FONT_SANS,
              marginTop: 16,
              fontStyle: "italic",
            }}>
              {s.desc}
            </div>
          </div>
        );
      })}

      {/* 底部关键词 */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 60,
          right: 60,
          textAlign: "center",
          fontFamily: FONT_MONO,
          fontSize: 18,
          color: "#00FF41",
        }}
      >
        &gt; 你可以这样用
      </div>
    </>
  );
};

/* ============== S6 金句 ============== */
const S6Quote: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  // 数字 30 → 删除线效果
  const lineWidth = interpolate(frame, [50, 100], [0, 240], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // 数字 3 弹入
  const threeScale = spring({ frame: frame - 30, fps, config: { damping: 10, stiffness: 200 } });

  return (
    <>
      {/* 左侧 30 (灰色 + 删除线)*/}
      <div
        style={{
          position: "absolute",
          top: 280,
          left: 200,
          fontFamily: FONT_MONO,
          fontSize: 240,
          fontWeight: "bold",
          color: "#888",
          opacity: 0.5,
        }}
      >
        30
        {/* 删除线 */}
        {lineWidth > 0 && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              width: lineWidth,
              height: 6,
              background: "#FF4500",
              transform: "translateY(-50%)",
            }}
          />
        )}
        <div style={{
          fontSize: 24,
          color: "#888",
          textAlign: "center",
          marginTop: 12,
          fontStyle: "normal",
        }}>
          坚持不了 6 个月
        </div>
      </div>

      {/* 中间 VS */}
      <div style={{
        position: "absolute",
        top: 360,
        left: "50%",
        transform: "translateX(-50%)",
        color: "#FF4500",
        fontFamily: FONT_MONO,
        fontSize: 48,
        fontWeight: "bold",
      }}>
        VS
      </div>

      {/* 右侧 3 (橙色, 弹入)*/}
      <div
        style={{
          position: "absolute",
          top: 280,
          right: 200,
          fontFamily: FONT_MONO,
          fontSize: 240,
          fontWeight: "bold",
          color: "#FF4500",
          textShadow: "0 0 40px rgba(255, 69, 0, 0.6)",
          transform: `scale(${threeScale})`,
        }}
      >
        3
        <div style={{
          fontSize: 24,
          color: "#00FF41",
          textAlign: "center",
          marginTop: 12,
          fontStyle: "normal",
        }}>
          就能坚持
        </div>
      </div>

      {/* 底部金句条（终端绿 + 光标）*/}
      {frame > 180 && (
        <div
          style={{
            position: "absolute",
            bottom: 120,
            left: 80,
            right: 80,
            padding: "20px 32px",
            background: "rgba(0, 255, 65, 0.08)",
            border: "1px solid #00FF41",
            borderRadius: 8,
            fontFamily: FONT_MONO,
            fontSize: 22,
            color: "#00FF41",
            textAlign: "center",
            opacity: interpolate(frame, [180, 200], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          不是习惯问题，是产品设计问题
          <span style={{ marginLeft: 8, animation: "blink 0.5s infinite" }}>▊</span>
        </div>
      )}
    </>
  );
};

/* ============== S7 CTA ============== */
const S7CTA: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  return (
    <>
      {/* 顶部品牌文字 */}
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 60,
          right: 60,
          textAlign: "center",
          fontFamily: FONT_MONO,
          fontSize: 32,
          color: "#00FF41",
          opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        &gt; 用产品思维去健身
      </div>
      <div
        style={{
          position: "absolute",
          top: 170,
          left: 60,
          right: 60,
          textAlign: "center",
          fontFamily: FONT_MONO,
          fontSize: 18,
          color: "#888",
          opacity: interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        &gt; 用健身改造产品
      </div>

      {/* CTA 互动卡（左下）*/}
      <div
        style={{
          position: "absolute",
          top: 280,
          left: 60,
          width: 440,
          height: 220,
          background: "rgba(255, 69, 0, 0.12)",
          border: "2px solid #FF4500",
          borderRadius: 16,
          padding: 24,
          opacity: interpolate(frame, [30, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        <div style={{ color: "#FF4500", fontSize: 20, fontFamily: FONT_MONO, marginBottom: 12 }}>
          💬 互动
        </div>
        <div style={{ color: "#FFF", fontSize: 20, fontFamily: FONT_SANS, lineHeight: 1.5 }}>
          评论区说说你对
          <span style={{ color: "#FF4500", fontWeight: "bold" }}> 健身助手 </span>
          的想法
        </div>
      </div>

      {/* 彩蛋预告（右下）*/}
      <div
        style={{
          position: "absolute",
          top: 280,
          right: 60,
          width: 440,
          height: 220,
          background: "rgba(0, 255, 65, 0.08)",
          border: "1px solid #00FF41",
          borderRadius: 16,
          padding: 24,
          opacity: interpolate(frame, [50, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        <div style={{ color: "#00FF41", fontSize: 14, fontFamily: FONT_MONO, marginBottom: 8 }}>
          // 下期预告 →
        </div>
        <div style={{ color: "#FFF", fontSize: 16, fontFamily: FONT_SANS, lineHeight: 1.6 }}>
          放出 AI 解析训练记录的
          <span style={{ color: "#00FF41", fontFamily: FONT_MONO, fontWeight: "bold" }}>原始 Prompt</span>
        </div>
        <div style={{ color: "#888", fontSize: 12, fontFamily: FONT_MONO, marginTop: 12 }}>
          $ 你看了就知道有多简单
        </div>
      </div>

      {/* 关注引导（底部）*/}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 60,
          right: 60,
          textAlign: "center",
          fontFamily: FONT_MONO,
          fontSize: 20,
          color: "#FF4500",
          opacity: interpolate(frame, [80, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        ★ 关注我，别错过
      </div>

      {/* 底部品牌行 */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 48,
          background: "rgba(0, 0, 0, 0.8)",
          borderTop: "1px solid rgba(255, 69, 0, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: FONT_MONO,
          fontSize: 14,
          color: "#888",
        }}
      >
        7fit · 让健身更简单
      </div>
    </>
  );
};
