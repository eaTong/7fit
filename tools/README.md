# tools/ 工具脚本

> 自动化维护仓库的工具集。

## sync-public-symlinks.js

**自动化维护 `remotion/public/scenes/` 软链**——无需手维护。

### 原理

```
resources/user/videos/<scene>/  (你的素材真实位置)
        ↓ 自动软链
remotion/public/scenes/<scene>/  (Remotion 渲染访问)
        ↓
scenes/<scene>/videos/xxx.mp4  (组件用 staticFile 访问)
```

### 使用

**方式 1：自动（推荐）**

已集成到 npm scripts：
- `npm run dev` → 启动 Studio 前自动 sync
- `npm run build` → 渲染前自动 sync

**方式 2：手动**

```bash
node tools/sync-public-symlinks.js
```

### 它做什么

1. **扫描** `resources/user/videos/` 下所有 scene 目录
2. **创建/更新** `remotion/public/scenes/<scene>/` 软链指向 `resources/user/videos/<scene>/`
3. **自动补** `images/` 子软链（如果不存在）→ 指向 `resources/assets/overlays/`
4. **清理** dangling 软链（场景已删除但软链残留）

### 未来新增场景工作流

```bash
# 1. 你的素材放进 resources/user/videos/
mkdir -p resources/user/videos/c01/videos
cp ta0_hook.mp4 resources/user/videos/c01/videos/

# 2. 启动 Studio（自动 sync）或手动 sync
npm run dev
# 或
node tools/sync-public-symlinks.js

# 3. 组件里用 staticFile 访问
<Video src={staticFile("scenes/c01/videos/ta0_hook.mp4")} />
```

**零维护软链！** 每次新场景只要放素材到 `resources/user/videos/<scene>/`，自动可用。
