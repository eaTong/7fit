/**
 * OverlayCard — 动作参数叠加卡组件（共享）
 *
 * 位置：右下角（竖屏距底边 96px，横屏距字幕区顶 96px）
 * 样式：半透明黑底 + 橙色强调数字
 *
 * 使用方式：
 * <OverlayCard name="卧推" reps="12-15" sets={3} rhythm="3-0-2" />
 */

interface OverlayCardProps {
  /** 动作名称，如 "卧推" */
  name?: string;
  /** 次数，如 "12-15" */
  reps?: string | number;
  /** 组数，如 "3" */
  sets?: string | number;
  /** 节奏/时长，如 "3-2-1" */
  rhythm?: string;
  /** 自定义内容 */
  bottom?: React.ReactNode;
  /** 卡片宽度，默认 192 */
  width?: number;
  /** 卡片高度，默认 108 */
  height?: number;
}

/** 橙色高亮数字 */
const Num: React.FC<{ children: React.ReactNode; size?: number }> = ({ children, size = 36 }) => (
  <span style={{ color: "#FF4500", fontWeight: 800, fontSize: size }}>{children}</span>
);

export const OverlayCard: React.FC<OverlayCardProps> = ({
  name,
  reps,
  sets,
  rhythm,
  bottom,
  width = 192,
  height = 108,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        right: 96,
        bottom: 216 + 96,
        width,
        height,
        background: "rgba(0,0,0,0.75)",
        borderRadius: 12,
        border: "1px solid rgba(255,69,0,0.6)",
        padding: "12px 16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backdropFilter: "blur(8px)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
      }}
    >
      {name && (
        <div style={{ fontSize: 18, fontWeight: 700, color: "#FFFFFF" }}>
          {name}
        </div>
      )}

      {(reps || sets || rhythm) && (
        <div style={{ display: "flex", gap: 12, alignItems: "baseline" }}>
          {reps && (
            <div>
              <span style={{ fontSize: 14, color: "#888", marginRight: 4 }}>次</span>
              <Num>{reps}</Num>
            </div>
          )}
          {sets && (
            <div>
              <span style={{ fontSize: 14, color: "#888", marginRight: 4 }}>组</span>
              <Num>{sets}</Num>
            </div>
          )}
          {rhythm && (
            <div>
              <span style={{ fontSize: 14, color: "#888", marginRight: 4 }}>秒</span>
              <Num size={28}>{rhythm}</Num>
            </div>
          )}
        </div>
      )}

      {bottom && (
        <div style={{ fontSize: 14, color: "#FFFFFF" }}>
          {bottom}
        </div>
      )}
    </div>
  );
};