# 七练 (7fit) · 视频生产仓库

> **北极星**：「用产品思维去健身，用健身改造产品。」

用 [Remotion](https://www.remotion.dev/) 制作的健身视频仓库。

---

## 视频列表

| 场景 | 类型 | 状态 |
|---|---|---|
| [winged_scapula_b3](remotion/src/scenes/winged_scapula_b3) | B 类 · 健身知识 | ✅ 已发布 |
| [b14_push_day](remotion/src/scenes/b14_push_day) | B 类 · 推胸日 | 🔄 开发中 |
| [b15_abs](remotion/src/scenes/b15_abs) | B 类 · 腹肌日 | 🔄 开发中 |
| [a2_one_person_50_videos](remotion/src/scenes/a2_one_person_50_videos) | A 类 · 口播 | 🔄 开发中 |
| [a2_transition_series](remotion/src/scenes/a2_transition_series) | A 类 · 转场系列 | 🔄 开发中 |
| [talking_head_effect_demo](remotion/src/scenes/talking_head_effect_demo) | Demo · 口播特效 | 🔄 开发中 |

---

## 快速开始

```bash
cd remotion

# 启动预览
npm run dev

# 渲染视频（需用户授权）
npx remotion render <CompositionId> out/<name>.mp4
```

---

## 规范文件

- [rules/video-types.md](rules/video-types.md) - 视频类型定义（A/B/C）
- [rules/copy.md](rules/copy.md) - 文案规范
- [rules/timing-sync.md](rules/timing-sync.md) - 语速控制
- [rules/animation.md](rules/animation.md) - 动效规范
- [rules/bgm.md](rules/bgm.md) - BGM 规范

---

## 配色

| 用途 | 色值 |
|---|---|
| 背景 | `#0A0A0A` |
| 强调 | `#FF4500` |
| 文字 | `#FFFFFF` |