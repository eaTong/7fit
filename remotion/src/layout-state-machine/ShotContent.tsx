import { AuxiliaryContentManager } from "./AuxiliaryContentManager";
import type { LayoutState } from "./layouts/types";
import { LayoutId } from "./layouts/types";
import { CodeDisplay } from "../components/terminal/CodeDisplay";
import { GitLogDisplay, type GitLogEntry } from "../components/terminal/GitLogDisplay";

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
  /** text_card 时传入文字内容 */
  textContent?: string;
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
  textContent,
}) => {
  // code_display / gitlog_display 需要额外数据，不走 contentSrc
  const needsAuxiliary = contentType !== "pause_breath" && (contentSrc || contentType === "code_display" || contentType === "gitlog_display");

  if (!needsAuxiliary) return null;

  // 根据 layoutId 计算辅助素材的占位区域（zIndex = curLayout.zIndex + 10，确保在口播上方）
  const auxStyle = getAuxiliaryStyle(curLayout);

  // code_display 和 gitlog_display 独立渲染（不走 AuxiliaryContentManager）
  if (contentType === "code_display") {
    return (
      <CodeDisplay
        code={codeContent ?? "// no code provided"}
        language="typescript"
        fontSize={28}
        showLineNumbers
        maxHeight={typeof auxStyle.height === "number" ? auxStyle.height * 0.9 : 400}
        style={{ position: "absolute", ...auxStyle }}
      />
    );
  }

  if (contentType === "gitlog_display") {
    return (
      <GitLogDisplay
        entries={gitlogEntries ?? []}
        fontSize={28}
        visibleCount={gitlogVisibleCount ?? 5}
        style={{ position: "absolute", ...auxStyle }}
      />
    );
  }

  // text_card 传入文字内容作为 children
  const children = contentType === "text_card" && textContent ? (
    <div style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: "0 40px",
      gap: 16,
    }}>
      {textContent.split("\n").map((line, i) => (
        <div key={i} style={{
          fontSize: 36,
          fontWeight: 700,
          color: "#FFFFFF",
          lineHeight: 1.4,
          textShadow: "0 2px 8px rgba(0,0,0,0.8)",
        }}>
          {line}
        </div>
      ))}
    </div>
  ) : undefined;

  return (
    <AuxiliaryContentManager
      contentType={contentType}
      contentSrc={contentSrc}
      enterFrame={0}
      visible={true}
      style={auxStyle}
    >
      {children}
    </AuxiliaryContentManager>
  );
}

function getAuxiliaryStyle(layout: LayoutState): React.CSSProperties {
  const z = layout.zIndex + 10;
  switch (layout.id) {
    case LayoutId.TextCenterTalkingRight:
      return { left: 50, top: 50, width: 1340, height: 864, zIndex: z };
    case LayoutId.TextCenterTalkingLeft:
      return { left: 0, top: 0, width: 910, height: 864, zIndex: z };
    case LayoutId.BottomRightTalking:
      // 口播在右下角小窗，辅助内容占左侧全高
      return { left: 0, top: 0, width: 1440, height: 864, zIndex: z };
    case LayoutId.BottomLeftTalking:
      // 口播在左下角小窗，辅助内容占右侧全高
      return { left: 480, top: 0, width: 1440, height: 864, zIndex: z };
    case LayoutId.TopCenterTalking:
      // 口播在顶部中央，辅助内容占下方
      return { left: 0, top: 360, width: 1920, height: 504, zIndex: z };
    case LayoutId.OverlayTalkingHead:
      // 口播在左上角小窗叠加（zIndex=20），辅助内容全屏
      return { left: 0, top: 0, width: 1920, height: 864, zIndex: z };
    case LayoutId.CenteredFullBg:
      // 辅助内容在口播上方
      return { left: 470, top: 50, width: 980, height: 450, zIndex: z };
    case LayoutId.CenterDualAux:
    case LayoutId.OrbitingCenter:
      // 这些布局内容复杂，在 workout_intro children 里直接渲染
      return { display: "none" };
    case LayoutId.PipBottomRight:
    case LayoutId.PipBottomLeft:
      return { left: 0, top: 0, width: 1920, height: 864, zIndex: z };
    case LayoutId.Grid2x2:
      return { left: 960, top: 0, width: 960, height: 864, zIndex: z };
    case LayoutId.Fullscreen:
    default:
      return { display: "none" };
  }
}