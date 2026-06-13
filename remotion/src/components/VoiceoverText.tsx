/**
 * VoiceoverText — 底部字幕文字组件（共享）
 * 用于显示视频字幕/旁白文字
 */

interface VoiceoverTextProps {
  text: string | string[];
  bottom?: number;    // 底部距离，默认 120
  fontSize?: number;  // 字号，默认 36
}

export const VoiceoverText: React.FC<VoiceoverTextProps> = ({
  text,
  bottom = 120,
  fontSize = 36,
}) => {
  const displayText = Array.isArray(text) ? text.join("\n") : text;
  return (
    <div
      style={{
        position: "absolute",
        bottom,
        left: 0,
        right: 0,
        textAlign: "center",
        color: "#FFFFFF",
        fontSize,
        fontWeight: 700,
        textShadow: "0 2px 8px rgba(0,0,0,0.8)",
        padding: "0 64px",
      }}
    >
      {displayText}
    </div>
  );
};