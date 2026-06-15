# remotion/public/ 目录结构（v2 优化版）

> **核心原则**：这是 **Remotion 渲染时**访问的"运行时资源"。
> 真实素材在 `../../resources/`，这里用 **软链** 引用，不重复存储。

## 当前结构

```
remotion/public/
├── assets/                  # 公用素材软链 → resources/assets/
│   ├── bgm/        → ../../../resources/assets/bgm/
│   ├── sfx/        → ../../../resources/assets/sfx/
│   └── overlays/   → ../../../resources/assets/overlays/
│
├── scenes/<scene>/         # 场景素材软链 → resources/user/<type>/<scene>/
│   ├── a1/         → ../../../resources/user/videos/a1/
│   ├── a2/
│   ├── b3/         (winged_scapula_b3 视频)
│   ├── b14/        (推力日视频)
│   ├── b15/        (腹肌视频)
│   ├── b16/        (拉日视频)
│   └── c01/        (PM Fitness Log 视频/录音/截图)
│
├── images/                 # 历史遗留（不推荐新用）
└── videos/                 # 历史遗留（不推荐新用）
```

## 使用规则

### ✅ 推荐用法
- 静态资源 → `staticFile("assets/<type>/<filename>")`
- 场景视频/录音/截图 → `staticFile("scenes/<scene>/<file>")`

### ❌ 不推荐
- ❌ 直接往 `remotion/public/<scene>/` 复制素材
- ❌ 软链到 git 跟踪的目录

## 添加新素材

```bash
# 公用素材（如 BGM）→ 放 resources/assets/，自动可被软链访问
cp my_bgm.mp3 resources/assets/bgm/

# 场景素材（如自拍口播）→ 放 resources/user/videos/<scene>/
cp my_take.mp4 resources/user/videos/c01/

# 创建软链（如果 scenes/<scene>/ 还没有）
mkdir -p resources/user/videos/c01
ln -s ../../../resources/user/videos/c01 remotion/public/scenes/c01
```

## 历史目录兼容

旧的 `remotion/public/<scene>/videos/`、`remotion/public/<scene>/audios/`、
`remotion/public/images/`、`remotion/public/videos/` 暂时保留，
未来逐步迁移到 `scenes/<scene>/` + `assets/` 结构。
