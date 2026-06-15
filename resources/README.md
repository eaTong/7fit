# resources/ 目录结构

> **核心规则**：
> - `assets/` 公用素材 → **进版本管理**
> - `scenes/` 场景专属素材 → **不进版本管理**（本地保留）

---

## 📁 assets/（公用 · 可入库）

适合**跨场景复用**、由 **mmx/ffmpeg 自动化生成**、**体积小（<10MB）** 的素材。

```
assets/
├── bgm/        # 背景音乐（mmx 生成，每段 <5MB）
├── sfx/        # 短音效（ffmpeg/人工生成，<50KB/段）
├── overlays/   # 通用叠加层（HUD/扫描线/背景图）
├── fonts/      # 字体
├── icons/      # 通用 SVG icon
└── presets/    # 通用预设（mmx prompt 模板等）
```

**命名约定**：
- bgm/：`{scene}_{variant}_{style}.mp3`，例：`c01_main_a.mp3`
- sfx/：按**音效类型**命名（与场景无关），例：`whoosh.mp3`
- overlays/：通用名 + 主题，例：`bg_pro.jpg`（任何 pro 版本都能用）

---

## 📁 scenes/（场景专属 · 不入库）

按**场景维度**组织——每个 scene 独立目录。

```
scenes/
├── b3/                          # winged_scapula_b3 翼状肩胛
│   ├── videos/                  # 7 个 .mov
│   ├── audios/bgm/              # 场景专属 BGM（可空）
│   └── images → ../../assets/overlays/   # 软链到公用背景
│
├── b14/                         # 推力日
│   ├── videos/                  # 7 个 .mov
│   ├── audios/bgm/              # 场景专属音频
│   └── images → ../../assets/overlays/   # 软链到公用背景
│
├── b15/                         # 腹肌
│   ├── audios/bgm/lite_vibe_b15.mp3
│   ├── videos/                  # 暂空（未来补）
│   └── images → ../../assets/overlays/
│
├── c01/                         # 未来：PM Fitness Log
│   ├── videos/                  # 8 段口播（ta0-ta7）
│   ├── audios/                  # 备用旁白
│   └── images/                  # 小程序截图
│
└── _legacy/                     # 历史遗留（不影响渲染）
    └── winged_scapula_b3/       # 旧结构的图（git untracked）
```

### 每个 scene 的标准结构

| 子目录 | 用途 | 是否必有 |
|---|---|---|
| `videos/` | 视频（动作演示、口播、B-roll）| ✅ |
| `audios/bgm/` | 场景专属 BGM | ⚠️ 可选 |
| `audios/` | 完整旁白录音（顶层）| ⚠️ 可选 |
| `images/` | 小程序截图、参考图、临时元素 | ⚠️ 可选 |
| `photoshoots/` | 拍摄计划 | ⚠️ 可选 |
| `exports/` | 个人中间产物 | ⚠️ 可选 |

**规则**：组件用 `video(name) = ${BASE}/videos/${name}` 模式，**所有 scene 必须有 videos/**（哪怕空的），否则组件会 404。其他目录按需。

### 为什么用 `scenes/` 而不是 `user/`？

- **`scenes/` 是描述性命名**（"这是场景素材"），`user/` 是访问控制描述（"这是用户私有的"）
- 跟 `assets/`（公用资产）形成**对称**——`assets` + `scenes` 直观
- 跟 `remotion/public/scenes/` 软链**同名**——心智模型一致

### `images` 软链到 `assets/overlays/`

每个 scene 都有 `images/` 子目录，软链到 `assets/overlays/`（公用背景）——这样：
- 组件用 `scenes/<scene>/images/xxx.jpg` 一致访问
- 不用每个 scene 复制背景图
- 未来场景专属图片也可放这里，会覆盖软链

---

## 🔁 软链集成（remotion/public/）

```
remotion/public/
├── assets/      → resources/assets/
│   ├── bgm/  (软链)
│   ├── sfx/  (软链)
│   └── overlays/  (软链)
│
└── scenes/      (自动维护)
    ├── b3   → ../../../resources/scenes/b3
    ├── b14  → ../../../resources/scenes/b14
    └── b15  → ../../../resources/scenes/b15
```

**自动化**：`npm run dev` / `npm run build` 自动跑 `tools/sync-public-symlinks.js`，扫描 `resources/scenes/` 自动创建软链。

---

## 📦 添加新场景

```bash
# 1. 创建场景目录（标准结构）
mkdir -p resources/scenes/c01/{videos,audios,images}
ln -s ../../assets/overlays resources/scenes/c01/images

# 2. 放素材
cp ta0_hook.mp4 resources/scenes/c01/videos/

# 3. 启动 Studio（自动 sync）或手动
npm run dev
# 自动创建: remotion/public/scenes/c01 → resources/scenes/c01

# 4. 组件引用
<Video src={staticFile("scenes/c01/videos/ta0_hook.mp4")} />
```

---

## 🚫 .gitignore 规则

```gitignore
# ===== 公用 · 入库 =====
!resources/assets/
!resources/assets/**/*

# ===== 场景 · 不入库 =====
resources/scenes/
!resources/scenes/.gitkeep
```
