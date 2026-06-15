/**
 * VoiceoverText — 底部字幕文字组件（共享）
 *
 * 功能：
 * - 字号放大一倍（默认 72px）
 * - 半透明黑色圆角背景
 * - 支持高亮显示（橙底白字，用于强调数字/动作词）
 *
 * 支持格式：
 * - string：纯文本
 * - string[]：多行文本
 * - SubtitleSegment[]：含高亮标记的文本
 */

import type { SubtitleSegment } from "../../types/shot";
import type { BVariantTheme } from "../../themes/b-variant-theme";

interface VoiceoverTextProps {
  text: string | string[] | SubtitleSegment[];
  bottom?: number;      // 底部距离，默认 140
  fontSize?: number;     // 字号，默认 72
  paddingX?: number;     // 水平内边距，默认 32
  theme?: BVariantTheme; // 可选：B 类双版本主题
}

/** 判断是否为 SubtitleSegment 数组 */
function isSegments(v: unknown): v is SubtitleSegment[] {
  return Array.isArray(v) && v.length > 0 && typeof v[0] === "object" && "text" in v[0];
}

/** 判断是否为 string 数组（多行）*/
function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.length > 0 && typeof v[0] === "string";
}

export const VoiceoverText: React.FC<VoiceoverTextProps> = ({
  text,
  bottom = 140,
  fontSize = 72,
  paddingX = 32,
  theme,
}) => {
  // 统一成 SubtitleSegment[]
  const segments: SubtitleSegment[] = (() => {
    if (isSegments(text)) return text;
    if (isStringArray(text)) return text.map(t => ({ text: t }));
    if (typeof text === "string") return [{ text }];
    return [];
  })();

  return (
    <div
      style={{
        position: "absolute",
        bottom,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        padding: `0 ${paddingX}px`,
      }}
    >
      {/* 字幕背景 */}
      <div
        style={{
          background: theme?.subtitleBg ?? "rgba(0,0,0,0.6)",
          borderRadius: fontSize / 4,
          padding: `${fontSize / 2}px ${fontSize}px`,
          maxWidth: "100%",
        }}
      >
        {segments.map((seg, i) =>
          seg.highlight ? (
            // 高亮段
            <span
              key={i}
              style={{
                background: theme?.highlightBg ?? "#FF4500",
                color: theme?.highlightText ?? "#FFFFFF",
                fontWeight: 700,
                fontSize: fontSize * 1.15,
                borderRadius: 6,
                padding: `0 ${fontSize * 0.2}px`,
                margin: `0 ${fontSize * 0.05}px`,
              }}
            >
              {seg.text}
            </span>
          ) : (
            // 普通段
            <span
              key={i}
              style={{
                color: theme?.subtitleText ?? "#FFFFFF",
                fontWeight: 700,
                fontSize,
                textShadow: "0 2px 8px rgba(0,0,0,0.9)",
              }}
            >
              {seg.text}
            </span>
          )
        )}
      </div>
    </div>
  );
};