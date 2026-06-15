# resources/ 目录结构

> **核心规则**：
> - `assets/` 公用素材 → **进版本管理**
> - `user/` 用户专属素材 → **不进版本管理**（本地保留）

---

## 📁 assets/（公用 · 可入库）

适合**跨场景复用**、由 **mmx/ffmpeg 自动化生成**、**体积小（<10MB）** 的素材。

```
assets/
├── bgm/        # 背景音乐（mmx 生成，每段 <5MB）
│   └── c01_pm_fitness_log_a.mp3
│
├── sfx/        # 短音效（ffmpeg/人工生成，<50KB/段）
│   ├── whoosh.mp3       # wipe-h/wipe-v 转场
│   ├── pop.mp3          # highlight 弹入
│   ├── click.mp3        # CTA 按钮
│   ├── glitch.mp3       # glitch+色差 转场
│   └── data-ping.mp3    # 数据提示音
│
├── overlays/   # 通用叠加层（HUD/扫描线/背景）
│   ├── B_pro_bg.JPG
│   ├── b_lite_bg.JPG
│   └── outro.JPG
│
├── fonts/      # 自定义字体（如果引入）
│   └── JetBrainsMono-Bold.ttf
│
├── icons/      # 通用 SVG icon
│   └── fitness-default.svg
│
└── presets/    # 通用预设（mmx prompt 模板等）
    └── mmx_cyberpunk_bg.txt
```

**命名约定**：
- bgm/：`{scene}_{variant}_{style}.mp3`，例：`c01_pm_fitness_log_a.mp3`
- sfx/：按**音效类型**命名（与场景无关），例：`whoosh.mp3`
- overlays/：通用名 + 主题，例：`bg_pro.jpg`（任何 pro 版本都能用）

---

## 📁 user/（用户专属 · 不入库）

每个用户**只本地保留**的素材：自拍口播、拍摄的训练视频、录音、截图、参考图等。

```
user/
├── videos/<scene>/      # 用户自拍 / 拍摄的训练视频
│   ├── a1/              # 每个 scene 一个子目录
│   ├── a2/
│   ├── b3/              # winged_scapula_b3 训练视频
│   ├── b14/             # 推力日训练视频
│   ├── b15/             # 腹肌训练视频
│   └── misc/            # 未分类
│
├── audios/<scene>/      # 用户录音旁白
│   ├── a1/
│   ├── a2/
│   └── misc/
│
├── images/<scene>/      # 用户截图（小程序 UI / 拍摄参考）
│   ├── winged_scapula_b3/   # 历史遗留
│   └── misc/
│
├── photoshoots/         # 拍摄计划/参考资料
│   └── README.md
│
└── exports/              # 用户本地中间产物（个人备份）
```

**为什么用 `<scene>/` 子目录**：
- 同一素材可能被多个 scene 复用 → 按 scene 命名
- 删除某个 scene → 直接删除对应子目录
- 不污染全局命名空间

---

## 🔁 迁移指南（旧 → 新）

| 旧位置 | 新位置 | 入库？|
|---|---|---|
| `resources/audios/bgm/*.mp3` | `resources/assets/bgm/*.mp3` | ✅ |
| `resources/audios/sfx/*.mp3` | `resources/assets/sfx/*.mp3` | ✅ |
| `resources/audios/*.m4a` | `resources/user/audios/<scene>/` | ❌ |
| `resources/images/winged_scapula_b3_*.png` | `resources/user/images/winged_scapula_b3/` | ❌ |
| `resources/images/B_pro_bg.JPG` | `resources/assets/overlays/bg_pro.jpg` | ✅ |
| `resources/videos/*.mov` | `resources/user/videos/<scene>/` | ❌ |

---

## 📦 在 Remotion 中引用

```tsx
import { staticFile } from "remotion";

// ✅ 公用素材（资产）
<Audio src={staticFile("assets/bgm/c01_pm_fitness_log_a.mp3")} />
<Audio src={staticFile("assets/sfx/whoosh.mp3")} />

// ✅ 用户素材（local，git 忽略）
<Video src={staticFile("user/videos/c01/ta0_hook.mp4")} />
<Img src={staticFile("user/images/c01/miniapp_screenshot.png")} />
<Audio src={staticFile("user/audios/c01/voiceover.m4a")} />
```

> **注意**：`staticFile()` 相对于 `remotion/public/`。
> 实际部署时，需要把 `resources/user/` 软链或复制到 `remotion/public/user/`。

---

## 🚫 .gitignore 规则

```gitignore
# assets/ 入库
!resources/assets/
!resources/assets/bgm/
!resources/assets/sfx/
!resources/assets/overlays/
...

# user/ 不入库
resources/user/
!resources/user/.gitkeep

# 历史兼容
resources/audios/*       # 旧位置不进
resources/images/*      # 旧位置不进
resources/videos/*       # 旧位置不进
```
