# 渲染规范（render.md）

> **Phase 5 核心产物**：视频自检通过后 → 用户显式指令 → `npm run render`。
>
> **必须遵循**：[timing-sync.md](timing-sync.md)（`tl.duration()` 对齐）+ [checklist.md](checklist.md)（渲染前必跑 50+ 项）+ [script.md](script.md)（Scene 实现）
>
> **渲染哲学**：**默认只预览，渲染要授权**。Hyperframes 按帧确定性渲染，需要**用户显式说"开始渲染"**才能 `npm run render`。模糊措辞（"OK"/"不错"）**不**视为授权。3 要素：**用户授权** + **自检 50+ 项** + **渲染后看一遍**。

---

## 1 · ⚠️ 渲染触发硬规则

**默认只启动 Studio 预览（`npm run dev`），绝不自动渲染。**

### 1.1 触发渲染的有效关键词

- "开始渲染"
- "渲染吧"
- "render"
- "导出"
- "可以渲染"

### 1.2 模糊措辞不算授权

- ❌ "OK" / "不错" / "看起来挺好" / "继续" → **不**视为渲染授权
- ✅ 必须**显式**说出上述关键词之一

### 1.3 完整流程

```
1. checklist.md 渲染前 50+ 项全部 ✅（[§6 场景化自检](checklist.md#6--场景化自检3-场景--必跑项) 6.3 渲染前必跑项）
2. npm run dev（背景启动 Studio，让用户审核，run_in_background: true）
3. 用户在浏览器看一遍 → 用户说"开始渲染"
4. 记录用户授权时间（[§1.4](#14-用户授权记录模板)）
5. npm run render -- <SceneId> out/<name>.mp4
6. 渲染后自检（[§7 渲染后自检](#7--渲染后自检必做) 9 项 + [§11 失败 case 库](#11-渲染失败-case-库)）
7. 输出文件命名 [§3.3](#33-输出文件命名) → 入 gitignore（不入库）
```

### 1.4 用户授权记录模板

> **记录到 `<主题>.copy_notes.md`**：

```markdown
## 渲染授权记录

- **授权时间**：2026-06-09 14:30
- **授权原话**：「开始渲染」
- **授权人**：eatong
- **Studio 状态**：通过（3 遍审核）
- **输出文件**：`out/winged_scapula_b3_2026-06-09_v1.mp4`
- **渲染耗时**：4m 12s
```

> **作用**：审计追溯（避免"我以为你说过"）。

---

## 1.5 · 单视频激活规则（专注正在推进的视频）

**核心原则**：同一时期只推进一个视频。index.html 中**只注册当前视频**，其他视频的 `<div data-composition-id=...>` 全部注释掉。

| 状态 | 处理方式 |
|---|---|
| **正在推进的视频** | 注册到 `index.html` + 默认 `scene=` |
| **已交付/暂停的视频** | 在 `index.html` 中注释掉（不删文件）|
| **不推进的视频** | 保留 composition 文件但不注册，避免 lint 污染 |

**操作步骤**：
1. 专注 A → 注释 B13 + 改默认 scene 为 A
2. 专注 B → 注释 A + 改默认 scene 为 B
3. 需要渲染历史视频 → 在 index.html 中临时放回注释，完成后重新注释

**index.html 默认 scene 切换**：
```js
// 默认 scene 改为当前推进的视频
const sceneParam = params.get('scene') || 'a2_one_person_50_videos';
```

---

## 2 · 常用命令

所有命令在 `hyperframe/` 目录下执行：

```bash
cd hyperframe

# 启动 Studio 预览（http://localhost:4000）—— 默认动作
npm run dev                    # = npx hyperframes studio

# 渲染视频（产物输出到 out/）—— ⚠️ 必须用户说"开始渲染"才执行
npm run render -- <SceneId> out/<name>.mp4

# 单帧抽检（可疑帧静态检查）
npm run still -- <SceneId> --frame=900

# 类型检查 + ESLint
npm run lint
```

> **`npm run dev` 是长跑服务**（不是一次性命令）。在 Claude Code 中用 `run_in_background: true`，绝不能前台跑（会超时挂掉）。

### 2.1 渲染命令扩展

```bash
# 指定输出分辨率（默认 1080×1920）
npm run render -- <SceneId> out/<name>.mp4 --width=1080 --height=1920

# 指定帧率（默认 30 fps）
npm run render -- <SceneId> out/<name>.mp4 --fps=30

# 指定视频时长（覆盖默认）
npm run render -- <SceneId> out/<name>.mp4 --duration=65.4

# 指定起始帧
npm run render -- <SceneId> out/<name>.mp4 --from=0 --to=1962
```

---

## 3 · 画布与输出

### 3.1 默认画布

- **1080×1920**（9:16 竖屏）
- **fps 30**
- ❌ **禁止**默认横屏

### 3.2 横屏是 opt-in

用户必须明确说"做横屏"才允许（用 1920×1080，fps 30）。

### 3.3 输出文件命名

```
out/<主题>_<日期>_v<N>.mp4
```

例：
- `out/winged_scapula_b3_2026-06-09_v1.mp4`（首发）
- `out/winged_scapula_b3_2026-06-10_v2.mp4`（修正字幕）
- `out/winged_scapula_b3_2026-06-12_v3.mp4`（大改）

> **不入库**（`out/` 永久 .gitignore），本地按需保留最近 3 个版本。

### 3.4 帧格式

- 默认 jpeg（`encoding.imageFormat: 'jpeg'`）
- 输出默认覆盖

### 3.5 画布决策表

| 平台 | 比例 | 尺寸 | 决策 |
|---|---|---|---|
| **小红书** | 9:16 | 1080×1920 | ✅ 默认 |
| **小红书** | 4:3 | 1080×1440 | ⚠️ 仅封面 |
| **抖音** | 9:16 | 1080×1920 | ✅ 默认 |
| **视频号** | 9:16 | 1080×1920 | ✅ 默认 |
| **B 站** | 16:10 | 1146×717 | ⚠️ opt-in |
| **横屏（YouTube）** | 16:9 | 1920×1080 | ❌ opt-in，需用户明确 |

---

## 4 · 防卡帧 11 类问题

| # | 问题 | 解决方案 |
|---|---|---|
| 1 | shot 之间硬切 | GSAP timeline label 重叠 ≥ 0.3s |
| 2 | `stagger` / `fromTo` 配 `lazy: false` 手动 seek 失败 | 配 `lazy: false` 时手动 seek 一次 |
| 3 | 首帧黑屏 | timeline 构造时 `.progress(0).render(0)` 锁住初始帧 |
| 4 | 资产加载延迟 | `preload="auto"` |
| 5 | shot 内部时间错乱 | 用 `timeline.time()` 拿本地时间 |
| 6 | 子元素定位错乱 | 父容器绝对定位 + 子元素 absolute |
| 7 | 末段静音/字幕提前消失 | `timeline.duration() = VIDEO_DURATION` |
| 8 | transform 居中冲突 | 用 `xPercent: -50, yPercent: -50`（不用 CSS `translate(-50%,-50%)`）|
| 9 | 视频自带音轨 | `<video muted playsinline>` + 分离 `<audio>` |
| 10 | CSS transition/animation 残留 | 全部用 GSAP 替换 |
| 11 | 视频同时播放 > 2 个 | 改图片或预渲染 |

---

## 5 · Studio 长跑服务

```bash
# ✅ 正确：用 run_in_background
npm run dev &  # 保持后台运行

# ❌ 错误：前台跑
npm run dev    # 会超时挂掉
```

> 在 Claude Code 中用 Bash 工具跑后台任务（`run_in_background: true`）。

### 5.1 Studio 启动参数

```bash
# 指定端口
npm run dev -- --port=4000

# 指定 scene
npm run dev -- --scene=winged_scapula_b3

# 自动打开浏览器
npm run dev -- --open
```

---

## 6 · timeline duration 硬约束

```js
const VIDEO_DURATION = 65.4  // 秒（来自 [timing-sync.md]）
const tl = gsap.timeline({ paused: true })
// ... 所有 tween
tl.duration(VIDEO_DURATION)  // ⭐ 必加
tl.progress(0).render(0)
```

> **为什么必加**：防止 timeline 跑到末尾后继续 seek 到无声/无字幕区间。

### 6.1 VIDEO_DURATION 同步

| 来源 | 取值 |
|---|---|
| **文案稿** | 钩子 + 主体 + 段间停顿 + 收尾 |
| **timing-sync.md** | `全文时长` 字段 |
| **scene.js** | `const VIDEO_DURATION = 65.4` |
| **渲染命令** | `--duration=65.4` |

> 改 VIDEO_DURATION 必须 4 处同步。

---

## 7 · 渲染后自检（必做）

```markdown
## 渲染后自检清单

- [ ] 打开视频看一遍（不是只看产物存在）
- [ ] BGM 音量合理（≤ 旁白 60%，ducking 工作）
- [ ] 转场流畅（无硬切、无卡顿）
- [ ] 字幕完整显示（不截断、不重叠）
- [ ] 末段无静音 / 无字幕消失
- [ ] 开头无黑屏
- [ ] 视频总时长 ≈ 目标时长（± 0.5s）
- [ ] 输出文件名带版本号
- [ ] 输出文件存到 `out/`（不入库）
```

> **失败怎么办**：回 `[ ] checklist.md` 查具体项，修复后**重新渲染**（不是只改 scene.js 就算完）。

### 7.1 渲染后自检 SOP

```
1. 用播放器打开 out/<name>.mp4（不是只 ls 看文件存在）
2. 听 BGM：是否盖过旁白？ducking 工作？
3. 看转场：有没有硬切？有没有卡帧？
4. 看字幕：截断？重叠？highlight 弹跳？
5. 末段检查：静音？字幕提前消失？
6. 时间检查：总时长 vs 目标（± 0.5s）？
7. 命名检查：带版本号？日期正确？
8. gitignore 检查：`git status` 应为空
```

---

## 8 · Remotion → Hyperframes 渲染速查

| 概念 | Remotion | Hyperframes |
|---|---|---|
| 渲染命令 | `npx remotion render <id> out/<name>.mp4` | `npm run render -- <SceneId> out/<name>.mp4` |
| 抽帧 | `npx remotion still <id> out/<frame>.png --frame=900` | `npm run still -- <SceneId> --frame=900` |
| 预览 | `npx remotion studio` | `npm run dev` |
| 合成 ID | `<Composition id="..." />` | `<main data-scene="...">` |
| 视频/音频分离 | `<Video src={...} />`（自带音轨）| `<video muted playsinline>` + `<audio>` |

---

## 9 · 性能优化

### 9.1 渲染参数

| 参数 | 默认 | 优化 | 备注 |
|---|---|---|---|
| **分辨率** | 1080×1920 | 同左 | 不要超高清（移动端看不出）|
| **帧率** | 30 fps | 同左 | 60 fps 体积翻倍 |
| **码率** | 自动 | **H.264 高码率** | 5-8 Mbps |
| **帧格式** | jpeg | 同左 | png 体积 3× |
| **音频** | AAC | 同左 | 128 kbps+ |

### 9.2 性能优化 5 招

| 招 | 效果 |
|---|---|
| 1. 同时动画元素 ≤ 6 | 渲染快 30% |
| 2. 图片 ≤ 500KB | 首帧加载快 1s |
| 3. 视频预渲染到帧 | 跳过实时解码 |
| 4. 关闭浏览器其他 tab | 释放内存 |
| 5. 用 CDN 加速下载 | 资产加载快 |

### 9.3 渲染体积参考

| 视频时长 | 推荐码率 | 输出体积 |
|---|---|---|
| 30s | 4 Mbps | ~15 MB |
| 60s | 5 Mbps | ~38 MB |
| 90s | 6 Mbps | ~68 MB |
| 120s | 7 Mbps | ~105 MB |

> 小红书 / 抖音限制 ≤ 200 MB，控制在 100 MB 以内最优。

---

## 10 · 渲染异常处理

### 10.1 常见异常 + 处理

| 异常 | 现象 | 处理 |
|---|---|---|
| **渲染超时** | 命令挂死 | Ctrl+C 中断 → 减少同时动画元素 → 重试 |
| **内存溢出** | 浏览器崩溃 | 关闭其他 tab → 拆 video → 重试 |
| **音画不同步** | BGM 跟字幕错位 | 检查 §6 VIDEO_DURATION 是否对齐 |
| **黑屏** | 视频开头黑 | 查 [animation.md §13.1](animation.md#131-黑屏--首帧空白) |
| **卡帧** | 某镜卡住 | 查 [animation.md §13.2](animation.md#132-卡帧--元素卡住不动) |
| **文件 0 字节** | 渲染失败产物 | 重新跑，详 §10.2 |

### 10.2 失败重试 SOP

```
1. 记录失败信息（错误码 / 现象 / 时间）
2. 跑 §10.1 异常处理表
3. 跑 §7 渲染后自检（如果产物存在）
4. 修复 → 重新跑全 checklist → 重新渲染
5. 连续失败 3 次 → 拆 video（分段渲染）
```

### 10.3 分段渲染（长视频应急）

> 视频 > 90s 容易超时，分段渲染后用 ffmpeg 拼接。

```bash
# 1. 分段渲染
npm run render -- <SceneId> out/part1.mp4 --from=0 --to=1800
npm run render -- <SceneId> out/part2.mp4 --from=1800 --to=3600

# 2. ffmpeg 拼接
ffmpeg -i out/part1.mp4 -i out/part2.mp4 -filter_complex "[0:v][0:a][1:v][1:a]concat=n=2:v=1:a=1[v][a]" -map "[v]" -map "[a]" out/<name>.mp4
```

---

## 11 · 渲染失败 case 库

> **实战踩过的坑**——遇到类似问题先查这里。

| # | 失败现象 | 根本原因 | 修法 |
|---|---|---|---|
| 1 | 视频开头 1s 黑屏 | timeline 没 `.progress(0).render(0)` | 加锁初始帧（§6）|
| 2 | 字幕提前 0.5s 消失 | `tl.duration()` < VIDEO_DURATION | 改 `tl.duration(VIDEO_DURATION)` |
| 3 | BGM 比旁白响 | BGM volume 没设 | 设 `volume: 0.4`（-8 dB）|
| 4 | 转场硬切 | 入场/出场没重叠 0.3s | GSAP addLabel 重叠 |
| 5 | 视频比 mp3 长 5s | 视频自带音轨 | 改 `<video muted>` + 分离 audio |
| 6 | 末段静音 | VIDEO_DURATION 短了 | 改 VIDEO_DURATION = 钩子+主体+收尾 |
| 7 | 钩子弹跳入场失效 | ease 用错 | 改 `back.out(1.7)`（不是 `power2.out`）|
| 8 | 数字滚动不同步 | 用 `setInterval` | 改 GSAP `snap: { val: 1 }` |
| 9 | 移动端首屏慢 | DOM 节点 > 50 | 拆组件 / 懒加载 |
| 10 | 输出文件 0 字节 | 渲染中崩溃 | 跑 §10.2 重试 |

---

## 12 · 5 维评分卡 + 评审 SOP

> **每维 ≥ 3 分才能进入用户审阅**，总分 ≥ 18/25。

### 12.1 评分卡

| 维度 | 1 分（差）| 3 分（中）| 5 分（优）| 本稿得分 |
|---|---|---|---|---|
| **触发合规** | 没用户授权就 render | 有授权 + 有记录 | 有授权 + 有记录 + 授权原话引用 | — |
| **自检完整** | 跳过 checklist | 跑全 50+ 项 | 跑全 + 严重度分级 + 跨文件影响项 | — |
| **画布规范** | 默认横屏 | 默认竖屏 1080×1920 | 默认竖屏 + 横屏 opt-in 文档化 | — |
| **命名规范** | 无版本号 | 含日期 + v1 | 含日期 + v1 + 入 gitignore | — |
| **渲染后自检** | 跳过 / 失败不重渲 | 9 项全过 | 9 项全过 + 失败 case 库对应 | — |

### 12.2 评审 SOP

```
1. 跑 [checklist.md §6.3 渲染前 50+ 项]
   ↓
2. 自评 5 维（≥ 18 分）
   ↓
3. 用户授权（[§1.1 关键词](#11-触发渲染的有效关键词)）+ 记录（[§1.4](#14-用户授权记录模板)）
   ↓
4. 启动 npm run dev（背景）
   ↓
5. 全屏过 3 遍
   ↓
6. 用户说"开始渲染" → 渲染
   ↓
7. 跑 [§7 渲染后自检 9 项](#7--渲染后自检必做)
   ↓
8. 输出文件 → gitignore（不入库）
```

---

## 13 · 反模式

- ❌ 用户没明确说"开始渲染"就执行 `npm run render`
- ❌ "OK / 不错" 视为渲染授权
- ❌ 默认横屏（必须用户明确说"做横屏"）
- ❌ `npm run dev` 前台跑（超时挂掉）
- ❌ timeline 没 `.duration(VIDEO_DURATION)` 锚点
- ❌ timeline 没 `.progress(0).render(0)` 锁初始帧
- ❌ shot 之间转场 < 0.3s（硬切）
- ❌ 用 CSS `transform: translate(-50%,-50%)` 居中（与 GSAP 冲突）
- ❌ 视频本身带音轨（违反 Hyperframes 音视频分离）
- ❌ 渲染后只看产物存在（必须打开看一遍）
- ❌ 渲染后自检失败但不重新渲染（半成品发布）
- ❌ `out/<name>.mp4` 入库（永久 gitignore）
- ❌ 输出文件名不含版本号（v1 / v2 / v3）
- ❌ **VIDEO_DURATION 4 处不同步**（详 §6.1）
- ❌ **渲染失败不重试直接放弃**（详 §10.2）
- ❌ **跳过 5 维评分卡直接给用户**
- ❌ **没跑异常处理表就重渲**（重复踩同一个坑）

---

## 附录 A · 速查索引

| 我想... | 看... |
|---|---|
| 触发渲染 | [§1 渲染触发硬规则](#1-渲染触发硬规则) |
| 跑 Studio | [§5 Studio 长跑服务](#5-studio-长跑服务) |
| 控制画布 | [§3 画布与输出](#3-画布与输出) |
| 修卡帧 | [§4 防卡帧 11 类问题](#4-防卡帧-11-类问题) |
| 设 VIDEO_DURATION | [§6 timeline duration 硬约束](#6-timeline-duration-硬约束) |
| 渲染后自检 | [§7 渲染后自检（必做）](#7-渲染后自检必做) |
| 性能优化 | [§9 性能优化](#9-性能优化) |
| 异常处理 | [§10 渲染异常处理](#10-渲染异常处理) |
| 查失败案例 | [§11 渲染失败 case 库](#11-渲染失败-case-库) |
| 跑 5 维评分 | [§12 5 维评分卡 + 评审 SOP](#12-5-维评分卡--评审-sop) |

---

## 附录 B · 变更日志

### v2（2026-06-09）— 深化拓展

- **新增 §1.3 完整流程**：7 步（从自检到 gitignore）
- **新增 §1.4 用户授权记录模板**：5 字段（时间/原话/人/状态/输出）
- **新增 §2.1 渲染命令扩展**：4 类参数（分辨率/帧率/时长/起始帧）
- **新增 §3.5 画布决策表**：6 平台→画布映射
- **新增 §4 防卡帧 11 类问题**：从 7 类扩到 11 类（增 transform 冲突/音视频分离/CSS 残留/视频数）
- **新增 §5.1 Studio 启动参数**：端口/scene/浏览器
- **新增 §6.1 VIDEO_DURATION 同步**：4 处必同步（文案/timing/scene/命令）
- **新增 §7.1 渲染后自检 SOP**：8 步流程
- **新增 §9 性能优化**：5 招 + 渲染体积参考表
- **新增 §10 渲染异常处理**：6 类异常 + 失败重试 SOP + 分段渲染（ffmpeg 拼接）
- **新增 §11 渲染失败 case 库**：10 个实战 case（黑屏/字幕提前/BGM 响/硬切/音画不同步 等）
- **新增 §12 5 维评分卡 + 评审 SOP**：总分 ≥ 18 才能进用户审阅
- **新增附录 A 速查索引** + **附录 B 变更日志**
- **§13 反模式从 13 条扩到 16 条**
- **保留不变**：§1.1-1.2 触发规则 + §2 常用命令 + §3.1-3.4 画布与输出 + §4 防卡帧（基础 7 类）+ §5 Studio 长跑服务 + §6 timeline duration + §7 渲染后自检（9 项）+ §8 Remotion 速查

### v1（2026-06-08）— 初版

- 渲染触发硬规则 + 常用命令 + 画布与输出 + 防卡帧 7 类 + Studio 长跑 + timeline duration + 渲染后自检 + Remotion 速查 + 反模式
- 由 winged_scapula_b3 实战沉淀
