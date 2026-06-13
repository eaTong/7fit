/**
 * MediaFallback — Video / Image 统一封装 + 素材缺失 fallback
 *
 * 行为：
 * - 尝试加载 OffthreadVideo / Img（使用 staticFile）
 * - 加载失败（文件不存在）→ 显示渐变背景 + 文件路径名称
 * - 未传 src → 显示渐变背景 + "[无素材]" 提示
 */

import { useState, type CSSProperties } from "react";
import { OffthreadVideo, Img } from "remotion";
import { staticFile } from "remotion";

interface MediaFallbackProps {
  src?: string;
  type?: "video" | "image";
  style?: CSSProperties;
  /** 自定义 className（用于 debug）*/
  className?: string;
}

export const MediaFallback: React.FC<MediaFallbackProps> = ({
  src,
  type = "image",
  style,
  className,
}) => {
  const [failed, setFailed] = useState(false);

  // 无 src 或加载失败 → 显示渐变 fallback
  if (!src || failed) {
    return (
      <div
        className={className}
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          ...style,
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "0 24px",
            wordBreak: "break-all",
          }}
        >
          {/* 文件图标 */}
          <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.6 }}>
            {type === "video" ? "🎬" : "🖼"}
          </div>
          {/* 路径文字 */}
          <div
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.55)",
              fontFamily: "monospace",
              lineHeight: 1.5,
              maxWidth: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {src ? (
              <>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>
                  {type === "video" ? "VIDEO NOT FOUND" : "IMAGE NOT FOUND"}
                </div>
                <div>{src}</div>
              </>
            ) : (
              <div style={{ color: "rgba(255,255,255,0.35)", fontStyle: "italic" }}>
                [no asset assigned]
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 正常渲染
  if (type === "video") {
    return (
      <OffthreadVideo
        src={staticFile(src)}
        style={{ width: "100%", height: "100%", objectFit: "cover", ...style }}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <Img
      src={staticFile(src)}
      style={{ width: "100%", height: "100%", objectFit: "cover", ...style }}
      onError={() => setFailed(true)}
    />
  );
};