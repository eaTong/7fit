import { AuxiliaryContentManager } from "./AuxiliaryContentManager";
import type { LayoutState } from "./layouts/types";

interface ShotContentProps {
  currentShotId: string;
  contentType: "video" | "image" | "data_viz" | "text_card" | "pause_breath";
  contentSrc?: string;
  curLayout: LayoutState;
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
}) => {
  const needsAuxiliary = contentType !== "pause_breath" && contentSrc;

  if (!needsAuxiliary) return null;

  // 根据 layoutId 计算辅助素材的占位区域
  const auxStyle = getAuxiliaryStyle(curLayout.id);

  return (
    <AuxiliaryContentManager
      contentType={contentType}
      contentSrc={contentSrc}
      enterFrame={0}
      visible={true}
      style={auxStyle}
    />
  );
};

function getAuxiliaryStyle(layoutId: string): React.CSSProperties {
  switch (layoutId) {
    case "left_text_right_talking":
      // 左侧 70% 放文字/素材，口播在右侧 30%
      return { left: 0, top: 0, width: 1344, height: 864 };
    case "pip_bottom_right":
    case "pip_bottom_left":
      // 口播缩到小窗，主区域全屏显示辅助素材
      return { left: 0, top: 0, width: 1920, height: 864 };
    case "grid_2x2":
      // 口播占左上格，其余 3 格放辅助素材
      return { left: 960, top: 0, width: 960, height: 864 };
    case "fullscreen":
    default:
      // 全屏口播，无需辅助素材
      return { display: "none" };
  }
}