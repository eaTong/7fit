/**
 * MediaFallback — Video / Image 统一封装 + 素材缺失 fallback
 *
 * 行为：
 * - 优先用 OffthreadVideo / Img（使用 staticFile）
 * - 用 fetch HEAD 请求检测文件是否存在（404 → fallback）
 * - 未传 src → 显示渐变背景 + "[无素材]" 提示
 */

import { useState, useEffect, type CSSProperties } from "react";
import { OffthreadVideo, Img } from "remotion";
import { staticFile } from "remotion";

interface MediaFallbackProps {
  src?: string;
  type?: "video" | "image";
  style?: CSSProperties;
  className?: string;
}

export const MediaFallback: React.FC<MediaFallbackProps> = ({
  src,
  type = "image",
  style,
  className,
}) => {
  const [loadState, setLoadState] = useState<"idle" | "loading" | "ok" | "error">(
    src ? "loading" : "error"
  );

  // 有 src 时，用 fetch HEAD 检测文件是否存在
  useEffect(() => {
    if (!src) {
      setLoadState("error");
      return;
    }

    const url = staticFile(src);
    fetch(url, { method: "HEAD" })
      .then((res) => {
        if (res.ok) {
          setLoadState("ok");
        } else {
          setLoadState("error");
        }
      })
      .catch(() => {
        setLoadState("error");
      });
  }, [src]);

  // 半透明渐变 fallback UI（背景可透出）
  const renderFallback = () => (
    <div
      className={className}
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, rgba(26,26,46,0.85) 0%, rgba(22,33,62,0.85) 50%, rgba(15,52,96,0.85) 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        backdropFilter: "blur(2px)",
        ...style,
      }}
    >
      <div style={{ textAlign: "center", padding: "0 32px", wordBreak: "break-all" }}>
        <div style={{ fontSize: 56, marginBottom: 16, opacity: 0.6 }}>
          {type === "video" ? "🎬" : "🖼"}
        </div>
        <div
          style={{
            fontSize: 24,
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
              <div
                style={{
                  fontSize: 24,
                  color: "rgba(255,255,255,0.3)",
                  marginBottom: 6,
                  letterSpacing: "0.1em",
                }}
              >
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

  // 无 src 或检测到 404 → 显示 fallback
  if (loadState === "error") {
    return renderFallback();
  }

  // 加载中 / 检测中 → 也显示 fallback（避免闪烁 video 占位图）
  if (loadState === "loading") {
    return renderFallback();
  }

  // 正常渲染
  if (type === "video") {
    return (
      <OffthreadVideo
        muted
        src={staticFile(src!)}
        style={{ width: "100%", height: "100%", objectFit: "cover", ...style }}
      />
    );
  }

  return (
    <Img
      src={staticFile(src!)}
      style={{ width: "100%", height: "100%", objectFit: "cover", ...style }}
    />
  );
};