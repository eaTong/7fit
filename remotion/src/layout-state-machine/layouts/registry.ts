import { LayoutState, LayoutId } from "./types";

const REGISTRY: Map<LayoutId, LayoutState> = new Map();

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
export function getLayout(id: LayoutId): LayoutState | undefined {
  return REGISTRY.get(id);
}

/** 返回所有已注册布局 */
export function getAllLayouts(): LayoutState[] {
  return Array.from(REGISTRY.values());
}

/** 根据字符串值反向查找 LayoutId 枚举成员（用于解析动态 id）*/
export function layoutIdOf(id: string): LayoutId | undefined {
  for (const v of Object.keys(LayoutId)) {
    if (LayoutId[v as keyof typeof LayoutId] === id) {
      return id as LayoutId;
    }
  }
  return undefined;
}

// ─── 内置 10 种布局 ──
// 注：left_text_right_talking、left_text_right_talking_50pct 已废弃，不再注册

registerLayout({
  id: LayoutId.Fullscreen,
  left: 0, top: 0, width: 1920, height: 864,
  borderRadius: 0, borderWidth: 0, borderColor: "transparent",
  shadow: "none", zIndex: 10,
});

registerLayout({
  id: LayoutId.PipBottomRight,
  left: 1284, top: 567, width: 540, height: 303,
  borderRadius: 20, borderWidth: 2, borderColor: "rgba(255,255,255,0.8)",
  shadow: "0 4px 24px rgba(0,0,0,0.6)", zIndex: 10,
});

registerLayout({
  id: LayoutId.PipBottomLeft,
  left: 96, top: 567, width: 540, height: 303,
  borderRadius: 20, borderWidth: 2, borderColor: "rgba(255,255,255,0.8)",
  shadow: "0 4px 24px rgba(0,0,0,0.6)", zIndex: 10,
});

registerLayout({
  id: LayoutId.Grid2x2,
  left: 0, top: 0, width: 960, height: 432,
  borderRadius: 0, borderWidth: 0, borderColor: "transparent",
  shadow: "none", zIndex: 10,
});

// ── 4 种辅助内容多元素布局 ──

// 口播小窗放右下角，辅助内容占左侧全高
registerLayout({
  id: LayoutId.BottomRightTalking,
  left: 1440, top: 384, width: 480, height: 480,
  borderRadius: 240, borderWidth: 2, borderColor: "rgba(255,255,255,0.8)",
  shadow: "0 4px 24px rgba(0,0,0,0.6)", zIndex: 10,
});

// 口播放左下角，辅助内容占右侧全高
registerLayout({
  id: LayoutId.BottomLeftTalking,
  left: 0, top: 384, width: 480, height: 480,
  borderRadius: 20, borderWidth: 2, borderColor: "rgba(255,255,255,0.8)",
  shadow: "0 4px 24px rgba(0,0,0,0.6)", zIndex: 10,
});

// 口播放顶部中央，辅助内容占下方
registerLayout({
  id: LayoutId.TopCenterTalking,
  left: 720, top: 0, width: 480, height: 360,
  borderRadius: 20, borderWidth: 2, borderColor: "rgba(255,255,255,0.8)",
  shadow: "0 4px 24px rgba(0,0,0,0.6)", zIndex: 10,
});

// 口播放左上角小窗叠加（zIndex=20 在辅助内容之上），辅助内容全屏
registerLayout({
  id: LayoutId.OverlayTalkingHead,
  left: 50, top: 50, width: 360, height: 360,
  borderRadius: 180, borderWidth: 2, borderColor: "rgba(255,255,255,0.8)",
  shadow: "0 0 20px rgba(255,255,255,0.3)", zIndex: 20,
});

// ── 3 种多辅助元素布局 ──

// 口播视频全屏铺满背景（半透明），内容叠加在正中央
registerLayout({
  id: LayoutId.FullscreenBg,
  left: 0, top: 0, width: 1920, height: 1080,
  borderRadius: 0, borderWidth: 0, borderColor: "transparent",
  shadow: "none", zIndex: 5,
  isBackgroundLayer: true,
  bgOpacity: 1,
  auxiliarySlots: [
    { id: "center", slot: "center", left: 560, top: 190, width: 800, height: 700 },
  ],
});

// 口播居中，左右两侧辅助内容
registerLayout({
  id: LayoutId.CenterDualAux,
  left: 528, top: 108, width: 864, height: 864,
  borderRadius: 10, borderWidth: 2, borderColor: "rgba(255,255,255,0.8)",
  shadow: "0 4px 24px rgba(0,0,0,0.6)", zIndex: 15,
  auxiliarySlots: [
    { id: "left", slot: "left", left: 50, top: 50, width: 400, height: 864 },
    { id: "right", slot: "right", left: 1470, top: 50, width: 400, height: 864 },
  ],
});

// 口播居中圆形，多个视频环绕旋转（子元素数量不限，由引擎动态添加）
registerLayout({
  id: LayoutId.OrbitingCenter,
  left: 780, top: 270, width: 360, height: 360,
  borderRadius: 180, borderWidth: 2, borderColor: "rgba(255,255,255,0.8)",
  shadow: "0 0 30px rgba(255,255,255,0.4)", zIndex: 15,
  // auxiliarySlots 由引擎动态计算和添加，此处不再预定义固定槽位
});

// ── 2 种 text_center_talking 布局 ──

// 口播视频在左边，辅助内容在中间
registerLayout({
  id: LayoutId.TextCenterTalkingLeft,
  left: 0, top: 108, width: 480, height: 864,
  borderRadius: 20, borderWidth: 2, borderColor: "rgba(255,255,255,0.8)",
  shadow: "0 4px 24px rgba(0,0,0,0.6)", zIndex: 10,
  auxiliarySlots: [
    { id: "center", slot: "center", left: 560, top: 190, width: 800, height: 700 },
  ],
});

// 口播视频在右边，辅助内容在中间
registerLayout({
  id: LayoutId.TextCenterTalkingRight,
  left: 1440, top: 108, width: 480, height: 864,
  borderRadius: 20, borderWidth: 2, borderColor: "rgba(255,255,255,0.8)",
  shadow: "0 4px 24px rgba(0,0,0,0.6)", zIndex: 10,
  auxiliarySlots: [
    { id: "center", slot: "center", left: 560, top: 190, width: 800, height: 700 },
  ],
});