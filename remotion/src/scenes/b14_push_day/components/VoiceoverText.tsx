/**
 * VoiceoverText — 底部字幕文字组件
 * 用于无旁白视频中显示标题/文案
 */

interface VoiceoverTextProps {
  text: string;
  bottom?: number;  // 底部距离，默认 120
  fontSize?: number; // 字号，默认 36
}

export const VoiceoverText: React.FC<VoiceoverTextProps> = ({
  text,
  bottom = 120,
  fontSize = 36,
}) => (
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
    {text}
  </div>
);
