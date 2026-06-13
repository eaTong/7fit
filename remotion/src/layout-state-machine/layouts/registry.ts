import { LayoutState } from "./types";

const REGISTRY: Map<string, LayoutState> = new Map();

/**
 * 注册一个布局状态到全局注册中心
 * 新增布局 → 只需调用此函数注册一个对象，核心引擎无需修改
 */
export function registerLayout(state: LayoutState): LayoutState {
  if (REGISTRY.has(state.id)) {
    console.warn(`[LayoutStateRegistry] 布局 "${state.id}" 已被注册，将被覆盖`);
  }
  REGISTRY.set(state.id, state);
  return state;
}

/** 根据 id 查询布局，未找到返回 undefined */
export function getLayout(id: string): LayoutState | undefined {
  return REGISTRY.get(id);
}

/** 返回所有已注册布局 */
export function getAllLayouts(): LayoutState[] {
  return Array.from(REGISTRY.values());
}

// ─── 内置 5 种布局（数据来源：PictureInPicture / SplitLeftRight / Grid2x2）───

registerLayout({
  id: "fullscreen",
  left: 0, top: 0, width: 1920, height: 864,
  borderRadius: 0, borderWidth: 0, borderColor: "transparent",
  shadow: "none", zIndex: 10,
});

registerLayout({
  id: "left_text_right_talking",
  left: 1440, top: 0, width: 480, height: 864,
  borderRadius: 20, borderWidth: 2, borderColor: "rgba(255,255,255,0.8)",
  shadow: "0 4px 24px rgba(0,0,0,0.6)", zIndex: 10,
});

registerLayout({
  id: "pip_bottom_right",
  left: 1284, top: 567, width: 540, height: 303,
  borderRadius: 20, borderWidth: 2, borderColor: "rgba(255,255,255,0.8)",
  shadow: "0 4px 24px rgba(0,0,0,0.6)", zIndex: 10,
});

registerLayout({
  id: "pip_bottom_left",
  left: 96, top: 567, width: 540, height: 303,
  borderRadius: 20, borderWidth: 2, borderColor: "rgba(255,255,255,0.8)",
  shadow: "0 4px 24px rgba(0,0,0,0.6)", zIndex: 10,
});

registerLayout({
  id: "grid_2x2",
  left: 0, top: 0, width: 960, height: 432,
  borderRadius: 0, borderWidth: 0, borderColor: "transparent",
  shadow: "none", zIndex: 10,
});

registerLayout({
  id: "left_text_right_talking_50pct",
  left: 960, top: 0, width: 960, height: 864,
  borderRadius: 20, borderWidth: 2, borderColor: "rgba(255,255,255,0.8)",
  shadow: "0 4px 24px rgba(0,0,0,0.6)", zIndex: 10,
});

// ── 新增 4 种辅助内容多元素布局 ──

// 口播小窗放右下角，辅助内容占左侧全高
registerLayout({
  id: "bottom_right_talking",
  left: 1440, top: 384, width: 480, height: 480,
  borderRadius: 240, borderWidth: 2, borderColor: "rgba(255,255,255,0.8)",
  shadow: "0 4px 24px rgba(0,0,0,0.6)", zIndex: 10,
});

// 口播放左下角，辅助内容占右侧全高
registerLayout({
  id: "bottom_left_talking",
  left: 0, top: 384, width: 480, height: 480,
  borderRadius: 20, borderWidth: 2, borderColor: "rgba(255,255,255,0.8)",
  shadow: "0 4px 24px rgba(0,0,0,0.6)", zIndex: 10,
});

// 口播放顶部中央，辅助内容占下方
registerLayout({
  id: "top_center_talking",
  left: 720, top: 0, width: 480, height: 360,
  borderRadius: 20, borderWidth: 2, borderColor: "rgba(255,255,255,0.8)",
  shadow: "0 4px 24px rgba(0,0,0,0.6)", zIndex: 10,
});

// 口播放左上角小窗叠加（zIndex=20 在辅助内容之上），辅助内容全屏
registerLayout({
  id: "overlay_talking_head",
  left: 50, top: 50, width: 360, height: 360,
  borderRadius: 180, borderWidth: 2, borderColor: "rgba(255,255,255,0.8)",
  shadow: "0 0 20px rgba(255,255,255,0.3)", zIndex: 20,
});