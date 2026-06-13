import { AuxiliaryContentManager } from "./AuxiliaryContentManager";
import type { LayoutState } from "./layouts/types";
import { CodeDisplay } from "../components/CodeDisplay";
import { GitLogDisplay, type GitLogEntry } from "../components/GitLogDisplay";

interface ShotContentProps {
  currentShotId: string;
  contentType: "video" | "image" | "data_viz" | "text_card" | "code_display" | "gitlog_display" | "pause_breath";
  contentSrc?: string;
  curLayout: LayoutState;
  /** code_display 时传入代码字符串 */
  codeContent?: string;
  /** gitlog_display 时传入 entries 数组 */
  gitlogEntries?: GitLogEntry[];
  /** gitlog_display 时传入可见行数 */
  gitlogVisibleCount?: number;
}

/**
 * 渲染当前 shot 的辅助内容
 * 位置根据 curLayout 计算（口播占据的区域之外）
 *
 * 对于 left_text_right_talking：辅助素材在左侧 70% 区域
 * 对于 pip_*：辅助素材覆盖主视频区域
 * 对于 grid_2x2：辅助素材覆盖除口播格外的区域
 * 对于 fullscreen：当前 shot 不需要辅助素材（口播全屏）
 */
export const ShotContent: React.FC<ShotContentProps> = ({
  currentShotId,
  contentType,
  contentSrc,
  curLayout,
  codeContent,
  gitlogEntries,
  gitlogVisibleCount,
}) => {
  // code_display / gitlog_display 需要额外数据，不走 contentSrc
  const needsAuxiliary = contentType !== "pause_breath" && (contentSrc || contentType === "code_display" || contentType === "gitlog_display");

  if (!needsAuxiliary) return null;

  // 根据 layoutId 计算辅助素材的占位区域
  const auxStyle = getAuxiliaryStyle(curLayout.id);

  // code_display 和 gitlog_display 独立渲染（不走 AuxiliaryContentManager）
  if (contentType === "code_display") {
    return (
      <div style={{ position: "absolute", ...auxStyle }}>
        <CodeDisplay
          code={codeContent ?? "// no code provided"}
          language="typescript"
          fontSize={28}
          showLineNumbers
          maxHeight={typeof auxStyle.height === "number" ? auxStyle.height * 0.9 : 400}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }

  if (contentType === "gitlog_display") {
    return (
      <div style={{ position: "absolute", ...auxStyle }}>
        <GitLogDisplay
          entries={gitlogEntries ?? []}
          fontSize={28}
          visibleCount={gitlogVisibleCount ?? 5}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }

  return (
    <AuxiliaryContentManager
      contentType={contentType}
      contentSrc={contentSrc}
      enterFrame={0}
      visible={true}
      style={auxStyle}
    />
  );
}

function getAuxiliaryStyle(layoutId: string): React.CSSProperties {
  switch (layoutId) {
    case "left_text_right_talking":
      return { left: 50, top: 50, width: 1340, height: 864 };
    case "left_text_right_talking_50pct":
      return { left: 0, top: 0, width: 910, height: 864 };
    case "bottom_right_talking":
      // 口播在右下角小窗，辅助内容占左侧全高
      return { left: 0, top: 0, width: 1440, height: 864 };
    case "bottom_left_talking":
      // 口播在左下角小窗，辅助内容占右侧全高
      return { left: 480, top: 0, width: 1440, height: 864 };
    case "top_center_talking":
      // 口播在顶部中央，辅助内容占下方
      return { left: 0, top: 360, width: 1920, height: 504 };
    case "overlay_talking_head":
      // 口播在左上角小窗叠加（zIndex=20），辅助内容全屏
      return { left: 0, top: 0, width: 1920, height: 864 };
    case "pip_bottom_right":
    case "pip_bottom_left":
      return { left: 0, top: 0, width: 1920, height: 864 };
    case "grid_2x2":
      return { left: 960, top: 0, width: 960, height: 864 };
    case "fullscreen":
    default:
      return { display: "none" };
  }
}