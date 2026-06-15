# 资源管理规范（resources.md）

> **核心规则**：仓库只管理**公用素材**（`assets/`）和**结构元数据**（`.gitkeep`），**场景专属素材**（`scenes/`）在本地，**不入版本管理**。
>
> 实际素材存放与 Remotion 渲染访问的桥接通过 `remotion/public/` 软链完成，**零拷贝、零维护**。

---

## 1 · 目录结构

```
resources/
├── README.md                  # 详细说明
│
├── assets/                    # 公用 · 入库 · mmx/ffmpeg 生成
│   ├── bgm/                  # BGM（<5MB/段）
│   ├── sfx/                  # 短音效（<50KB/段）
│   ├── overlays/             # 通用背景图 / 扫描线 / HUD
│   ├── fonts/                # 自定义字体
│   ├── icons/                # SVG icon
│   └── presets/              # mmx prompt 模板
│
└── scenes/                    # 场景专属 · 不入库 · 用户本地
    └── <scene>/
        ├── videos/           # 视频（动作演示 / 口播 / B-roll）
        ├── audios/bgm/       # 场景专属 BGM
        ├── audios/           # 完整旁白录音
        ├── images → ../../assets/overlays/   # 软链到公用背景
        ├── photoshoots/      # 拍摄计划
        └── exports/          # 个人中间产物
```

---

## 2 · 入库策略

### 2.1 一句话规则

- **`assets/`** → 入库（自动同步 `remotion/public/assets/`）
- **`scenes/`** → 不入库（仅本地，软链到 `remotion/public/scenes/`）
- **`.gitkeep`** → 入库（保留空目录结构）

### 2.2 .gitignore 规则

```gitignore
# 公用 · 入库（白名单）
!resources/assets/
!resources/assets/**/*

# 场景 · 不入库（黑名单）
resources/scenes/
!resources/scenes/.gitkeep

# 历史兼容
resources/user/                 # 旧命名（防止误入库）
!resources/user/.gitkeep
```

---

## 3 · 软链集成（remotion/public/）

### 3.1 自动维护工具

`tools/sync-public-symlinks.js` 扫描 `resources/scenes/` 自动创建/更新/清理软链。

**集成到 npm scripts**：
- `npm run dev` 启动 Studio 前自动 sync（`predev` hook）
- `npm run build` 渲染前自动 sync（`prebuild` hook）
- `npm run scenes:sync` 手动触发

### 3.2 软链结构

```
remotion/public/
├── assets/                    # 软链 → ../../../resources/assets/
│   ├── bgm/                 # (symlink)
│   ├── sfx/                 # (symlink)
│   └── overlays/            # (symlink)
│
└── scenes/                    # 自动维护
    ├── b3   → ../../../resources/scenes/b3
    ├── b14  → ../../../resources/scenes/b14
    ├── b15  → ../../../resources/scenes/b15
    └── <新 scene>           # 自动新增
```

### 3.3 手动 sync（极少用）

```bash
node tools/sync-public-symlinks.js
```

---

## 4 · 添加新场景的标准流程

### 4.1 创建场景目录

```bash
# 标准 3 目录结构（videos 必有，audios/images 按需）
mkdir -p resources/scenes/c01/{videos,audios,audios/bgm,images}

# images 软链到公用背景
ln -s ../../assets/overlays resources/scenes/c01/images
```

### 4.2 放素材

```bash
# 视频（口播 / 动作演示 / B-roll）
cp ta0_hook.mp4 resources/scenes/c01/videos/
cp miniapp_screenshot.png resources/scenes/c01/images/my_screenshot.png
cp voiceover_full.m4a resources/scenes/c01/audios/
```

### 4.3 启动项目（自动同步软链）

```bash
npm run dev
# 自动创建: remotion/public/scenes/c01 → resources/scenes/c01
```

### 4.4 组件引用

```tsx
import { staticFile } from "remotion";

<Video src={staticFile("scenes/c01/videos/ta0_hook.mp4")} />
<Img src={staticFile("scenes/c01/images/my_screenshot.png")} />
<Audio src={staticFile("scenes/c01/audios/voiceover_full.m4a")} />
<Audio src={staticFile("assets/sfx/whoosh.mp3")} />  // 公用 SFX
<Audio src={staticFile("assets/bgm/c01_main.mp3")} />  // 公用 BGM
```

---

## 5 · 组件 BASE 路径规范

所有 scene 的 `index.tsx` 用统一 BASE 模板：

```tsx
const BASE = "scenes/<scene>";  // 软链根目录

const video = (name: string) => `${BASE}/videos/${name}`;
const audio = (name: string) => `${BASE}/audios/${name}`;
const image = (name: string) => `${BASE}/images/${name}`;
```

**为什么这样写**：
- 软链自动把 `scenes/<scene>` 解析到 `resources/scenes/<scene>`
- `scenes/<scene>/videos/xxx.mp4` → 实际访问 `resources/scenes/<scene>/videos/xxx.mp4`
- 未来换底层路径（不需要再改组件代码）

---

## 6 · 公用素材管理（assets/）

### 6.1 添加新 BGM/SFX

```bash
# 用 mmx 生成（首选）
mmx music generate --prompt "..." --out resources/assets/bgm/c01_main.mp3

# 或 ffmpeg 合成短音效
ffmpeg -y -f lavfi -i "sine=f=..." ... resources/assets/sfx/whoosh.mp3
```

### 6.2 命名约定

| 类型 | 命名 | 示例 |
|---|---|---|
| BGM | `{scene}_{variant}_{style}.mp3` | `c01_main_a.mp3` |
| SFX | 按**音效类型**命名 | `whoosh.mp3` / `pop.mp3` / `click.mp3` |
| Overlay | 通用 + 主题 | `bg_pro.jpg` / `scanline.png` |

### 6.3 跨场景复用

- ✅ 跨场景共用 → 放 `assets/`
- ❌ 仅一个场景用 → 放 `scenes/<scene>/`

---

## 7 · 大文件处理

### 7.1 视频文件

- ❌ 禁止**直接放进 git**（动辄几百 MB）
- ✅ 放 `scenes/<scene>/videos/`（不入库）
- ✅ 渲染时通过软链访问

### 7.2 用户录音

- ❌ 禁止入 git（隐私 + 大小）
- ✅ 放 `scenes/<scene>/audios/`

### 7.3 中间产物

- 临时测试文件 → `scenes/<scene>/exports/`
- 完成后删除或保留在 `scenes/<scene>/exports/`（不入库）

---

## 8 · 常见错误

### ❌ 错误 1：直接修改 `remotion/public/scenes/<scene>/`

软链！**修改会被还原**。所有修改必须在 `resources/scenes/<scene>/` 下做。

### ❌ 错误 2：把 `assets/` 内容复制到 `scenes/`

重复存储！`scenes/<scene>/images/` 软链已经指向 `assets/overlays/`，直接放 `assets/overlays/` 即可。

### ❌ 错误 3：在 `remotion/public/` 下手动 `ln -s`

- 启动 Studio 时 sync 脚本可能误删（dangling 检测）
- 应该用 `tools/sync-public-symlinks.js` 自动管理

### ❌ 错误 4：在 `scenes/<scene>/` 下放 git 应该入库的文件

- ❌ BGM/SFX → 改放 `assets/`
- ❌ 通用背景图 → 改放 `assets/overlays/`
- ❌ mmx prompt 模板 → 改放 `assets/presets/`

---

## 9 · 迁移到新结构（一次性）

从 `resources/videos/` 旧结构迁移到 `resources/scenes/<scene>/videos/`：

```bash
# 1. 移动
mv resources/videos/<scene>/* resources/scenes/<scene>/videos/

# 2. 提交
git rm -r --cached resources/videos/
# .gitignore 自动忽略 resources/videos/ 旧位置
```

---

## 10 · 验证清单

每次新场景完成后检查：

- [ ] `resources/scenes/<scene>/` 目录结构完整（videos/audios/bgm/images）
- [ ] `resources/scenes/<scene>/images` 软链 → `../../assets/overlays/`
- [ ] 跑 `npm run dev` 测试软链
- [ ] 组件用 `staticFile("scenes/<scene>/...")` 引用
- [ ] `git status` 确认 scenes/ 不出现（被忽略）
- [ ] `assets/` 任何新文件 → `git add` 入库
