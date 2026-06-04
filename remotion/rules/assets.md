# 素材清单规范（remotion）

> 阶段：素材盘点 / 资源管理（asset inventory）
> 适用场景：**生成脚本或分镜时**——必须配套输出一份"素材清单"
> 来源：用户硬约束
> 状态：✅ 生效
> 上下游：上游 = `copy.md`（确定需要什么内容）+ `video-types.md`（A/B/C 类型决定素材优先级）；下游 = `script.md`（Scene 组件用素材）+ `storyboard.md`（每镜引用素材）

---

## 1. 素材清单工作流

### 1.1 触发条件

每次生成以下任一产物时，**必须**配套输出一份素材清单：

- ✅ **脚本**（`resources/docs/copy/<主题>.md` 落地后）
- ✅ **分镜**（`storyboard.md` 落地后）
- ⚠️ **不触发**：纯字幕、纯动效、纯 BGM 调整

### 1.2 流程

```
1. 写脚本/分镜时
       ↓
2. 扫描脚本/分镜中的所有 content_source / 引用
       ↓
3. 去 resources/videos/ images/ audios/ 中检索
       ↓
4. 已有 → 复制到 remotion/public/<主题>/
   缺失 → 列出"待生成"，给 mmx prompt
       ↓
5. 输出 assets.md（按本文件 §2 格式）
       ↓
6. （下一步）实现 Scene 组件时直接 import 资源
```

### 1.3 输出位置

每份视频的素材清单放在视频入口同级目录：

```
remotion/src/scenes/<视频主题>/
├── index.tsx
├── subtitles.json
├── storyboard.md
├── storyboard.json
├── assets.md           # ← 素材清单（人类可读）
└── components/
    └── ...
```

### 1.4 ⚠️ 可代码实现的内容不进 assets.md（强约束）

> **核心规则**：能用 Remotion 代码渲染的内容，**绝不**让 AI 生成图片。
> AI 生图只用于"代码难做 / 成本高"的视觉资产——人像、动作演示、复杂插画、抽象背景。
> 例：**翼状肩胛**视频里的 4 个"动作数据卡"（"12-15 次 × 3 组"等）就是典型反例——本来应该用 `<ActionDataCard>` 组件代码实现，结果 mmx 生成了 4 张静态 PNG。

**应该用代码实现的 8 类内容**（"AI 强 → 代码弱" 反而是反模式）：

| 类型 | 典型例子 | 为什么必须用代码 |
|---|---|---|
| **数据卡 / 参数卡** | "12-15 次 × 3 组" / "PR 80KG × 10" | 数据 prop 化，字体/颜色/动效精控；改数不用重生图 |
| **数字高亮 / 计数器** | "PR 突破 80KG" / "7 天" | 必须用 `interpolate` 做数字滚动 + spring 弹入 |
| **章节标题 / 小标题** | "4 个动作" / "自测 1" | 纯白 + spring 入场 + 强调色描边，AI 生图无法控入场动效 |
| **进度条 / 数据条** | 训练计划进度 / 容量填充 | 必须用 `interpolate` 同步动效 |
| **简单图表** | 7 天柱状图 / 容量折线 | 几何 + 数据驱动，AI 生图没法做动效 |
| **列表 / 要点** | "钩子 1 / 2 / 3" / "3 个误区" | 文字描边 / 强调色 / 序号 badge 要可控 |
| **按钮 / CTA** | "立即开始" / "试试 7 练" | 半透明 + 强调色 + 入场动效，硬规则 |
| **Badge / 标签** | "B 类知识" / "POWER BUILD" | 几何 + 文字，AI 生图浪费 |

**仍然需要 AI / 用户素材的 4 类**（代码真的搞不定）：

| 类型 | 为什么 |
|---|---|
| **人像 / 自拍** | 必须用户拍（AI 假人健身质量不稳定）|
| **训练动作演示** | 必须用户拍 |
| **复杂插画 / 概念图** | 代码难做或耗时长（如解剖图、场景图）|
| **抽象背景纹理** | 光斑 / 粒子 / 扫描线（mmx 优势）|

**对其他文档的影响**：

- **`storyboard.md`**：分镜的 `content_type` 新增 `code_component` 值——表示此镜**不需要外部素材**，由代码组件渲染。`content_source` 字段写组件名 + props（如 `<ActionDataCard reps="12-15" sets="3" />`）
- **`script.md`**：在 `components/` 目录下沉淀**可复用的数据组件**（`<ActionDataCard>` / `<StatOverlay>` / `<SectionTitle>` / `<BulletList>` / `<PrimaryCTA>` / `<Badge>` / `<ProgressBar>` 等）
- **`assets.md` 模板**：本文件 §2.3 模板已**不包含**"数据卡/标题/CTA"等可代码实现的内容

---

## 2. 素材清单格式（assets.md）

### 2.1 必填字段（每个素材必须有）

> 2026-06-04 升级：每个素材**必须**包含完整字段。文件名 / 目标位置是"机械信息"，
> 抽到表格上方的"路径清单"里展示；表格内只保留"内容字段"（便于横向对比）。

**表格内字段**

| 字段 | 必填 | 说明 |
|---|---|---|
| **#** | ✅ | 编号（用于组件 import 时引用，整份文档唯一）|
| **状态** | ✅ | `✅ 已生成` / `❌ 缺失` / `❌ 📋 待拍` / `⏸️ 进行中` |
| **类型** | ✅ | `video` / `image` / `audio` / `bgm` / `voiceover` / `font` |
| **描述** | ✅ | 这个素材是什么（1-2 句中文，**画面/声音内容描述**）|
| **来源** | ✅ | `resources/<目录>/<文件名>` 或 `mmx 生成` 或 `用户提供` |
| **拍摄要求** | 仅视频 | 5 维度（机位/光线/时长/动作/其他），见 §2.2 |
| **备注** | 可选 | 特殊说明（如"需裁剪"、"需转码"）|

**表格外字段（路径清单）**

放在每个表格的**正上方**，按编号列出：

```
### 文件路径清单
- **#1**: `resources/videos/<scene>_001_hook.mov` → `remotion/public/<scene>/videos/001_hook.mov`
- **#2**: `resources/videos/<scene>_002_wall_push.mov` → `remotion/public/<scene>/videos/002_wall_push.mov`
- **#3**: `resources/images/<scene>_scapula_anatomy.png` → `remotion/public/<scene>/images/scapula_anatomy.png`
```

> **关于"目标位置"**：
> - 当前**没有**自动复制脚本，所以路径清单里**必须**同时给出 `源 → 目标`，人工或脚本对照复制
> - 如果未来加入自动复制脚本（如 `scripts/copy-assets.sh`），目标位置可省略——因为程序会自动算
> - 路径里的 `<scene>` 替换为实际视频主题（如 `winged_scapula_b3`）

### 2.2 视频素材的"拍摄要求"（必填）

> 视频素材**必须**额外填写"拍摄要求"字段——这是为了让你（或拍摄者）在拍摄前就清楚规格，
> 避免拍完发现不能用、白费时间。

**拍摄要求包含 5 个维度**：

| 维度 | 说明 | 示例 |
|---|---|---|
| **机位/角度** | 拍哪里、从什么方向拍 | "背对镜头 / 镜头平齐肩部" |
| **光线** | 自然光/室内光/具体方向 | "自然光从左前方 / 避免顶光" |
| **时长** | 镜头要多长 | "≥ 5s（视频类镜头硬约束）" |
| **动作要求** | 慢/快、几遍、关键发力点 | "正常速度 1 遍 + 0.5x 慢动作 1 遍（关键发力点）" |
| **其他** | 着装/避免遮挡/杂物等 | "穿贴身衣 / 露出肩胛骨 / 背景简洁" |

### 2.3 完整模板

> **新格式核心**：文件名 / 目标位置抽到表格上方的"路径清单"，表格内只剩"内容字段"。

```markdown
# 素材清单：<视频主题>

**视频主题**：<主题>
**视频类型**：<A/B/C>
**目标账号**：<main/sub>
**生成日期**：<YYYY-MM-DD>
**关联脚本**：resources/docs/copy/<主题>.md
**关联分镜**：storyboard.md

---

## 0. 状态总览（看一眼就知道整体进度）

| 类别 | 总数 | ✅ 已生成 | ❌ 缺失 / 📋 待拍 | 阻塞 |
|---|---|---|---|---|
| 视频（用户自拍） | <N> | 0 | <N> | - |
| 图片（mmx 生成） | <N> | 0 | <N> | - |
| 音频（用户自录） | <N> | 0 | <N> | - |
| 音频（mmx BGM） | <N> | 0 | <N> | - |
| 🆕 代码组件（`code_component`） | <N> | 0 | <N> | - |
| **合计** | <sum> | 0 | <sum> | - |

---

## 1. 视频素材（用户自拍为主——共 <N> 段）

> ⚠️ **所有视频都依赖用户自拍**——是当前唯一阻塞

### 文件路径清单

- **#1**: `resources/videos/<scene>_001_hook_compare.mov` → `remotion/public/<scene>/videos/001_hook_compare.mov`
- **#2**: `resources/videos/<scene>_002_mirror_test.mov` → `remotion/public/<scene>/videos/002_mirror_test.mov`
- **#3**: `resources/videos/<scene>_003_wall_push.mov` → `remotion/public/<scene>/videos/003_wall_push.mov`

| # | 状态 | 类型 | 描述 | 来源 | 拍摄要求 |
|---|---|---|---|---|---|
| 1 | ❌ 📋 待拍 | video | 用户背对镜头，肩胛骨翼状 vs 正常对比演示 | 用户自拍 | **机位**：背对镜头 / 镜头平齐肩部<br>**光线**：自然光从左前方<br>**时长**：≥ 10s<br>**动作**：自然站立 / 双手垂在身侧 / 缓慢转身 30°<br>**其他**：穿贴身衣 / 露出肩胛骨 |
| 2 | ❌ 📋 待拍 | video | 镜子自测 1：背对镜子，自然站立 | 用户自拍 | **机位**：背对落地镜 / 朋友侧前方拍<br>**光线**：均匀<br>**时长**：≥ 5s<br>**动作**：自然站立 / 肩完全放松 / 手垂下<br>**其他**：露出肩胛骨 |
| 3 | ❌ 📋 待拍 | video | 推墙测试：面对墙双手前平举推墙 | 用户自拍 | **机位**：侧面 45°<br>**光线**：自然光侧方<br>**时长**：≥ 10s<br>**动作**：面对墙 / 双臂前平举 / 推 5s / 收回<br>**其他**：需 1 个朋友帮忙 |

---

## 2. 图片素材（mmx 生成或用户截图——共 <N> 张）

> ⚠️ **本节只放"AI 优势 / 代码难做"的图片**：复杂概念图、解剖示意、抽象背景、UI 截图。
> **数据卡 / 标题 / 列表 / CTA / Badge 等"可代码实现"内容不进本节**——见 §1.4，参考 §4 模板。

### 文件路径清单

- **#1**: `resources/images/<scene>_scapula_anatomy.png` → `remotion/public/<scene>/images/scapula_anatomy.png`

| # | 状态 | 类型 | 描述 | 来源 | 备注 |
|---|---|---|---|---|---|
| 1 | ❌ 缺失 | image | 翼状肩 vs 正常肩胛 解剖示意（用于钩子背景）| mmx 生成 | 1080×1920 竖屏 / 暗色背景 / 橙红色高亮 / 半透明 |

---

## 3. 音频素材

### 文件路径清单

- **#1**: `resources/audios/<scene>.mp3` → `remotion/public/<scene>/audios/<scene>.mp3`
- **#2**: `resources/audios/bgm/power_build.mp3` → `remotion/public/<scene>/audios/bgm/power_build.mp3`

| # | 状态 | 类型 | 描述 | 来源 | 备注 |
|---|---|---|---|---|---|
| 1 | ❌ 缺失 | voiceover | 旁白（4.8 字/秒 × 244 字 ≈ 50 秒）| **用户自录**（不用 TTS）| MP3 / 128kbps+ / 单声道 / 44.1kHz / [copy.md §9 录音规范](copy.md#9-用户自录旁白规范2026-06-04-起-tts-退役) |
| 2 | ❌ 缺失 | bgm | BGM（Power Build 类型）| mmx 生成 | 105 BPM / tech house / Dm / ≥ 50s 可循环 |

---

## 4. 代码组件（`code_component`——对应分镜 `content_type: code_component`）

> 本节**不是**外部素材清单，是 Remotion 代码实现的 TODO 列表。
> 任何"数据卡 / 数字高亮 / 标题 / 列表 / CTA / Badge"等可代码实现的内容（见 §1.4）**必须**在本节列出，
> 完成后 §0 状态总览里"代码组件"那行翻成 ✅。

| # | 状态 | 组件名 | 用途 | props | 引用位置 |
|---|---|---|---|---|---|
| C1 | ❌ 待实现 | `<ActionDataCard>` | 动作 1 数据卡：壁虎推墙 · 12-15 次 × 3 组 | `{ name: "壁虎推墙", reps: "12-15", sets: "3" }` | Shot S05（动作 1 演示）|
| C2 | ❌ 待实现 | `<ActionDataCard>` | 动作 2 数据卡：俯卧撑+前伸 · 8-12 次 × 3 组 | `{ name: "俯卧撑+前伸", reps: "8-12", sets: "3" }` | Shot S07（动作 2 演示）|

**实现位置**：`remotion/src/components/<Name>.tsx`（跨视频复用）或 `remotion/src/scenes/<主题>/components/<Name>.tsx`（视频专属）

**实现模板**：见 [script.md §10.3](script.md#103-实现示例actiondatacard-骨架) 的 `<ActionDataCard>` 骨架

---

## 5. 状态汇总

- **已就位**：<N> 项
- **待生成/获取**：<M> 项
- **阻塞情况**：<如果某些分镜没素材就实现不了，列出来>

### 5.1 推荐执行顺序

```
第 1 步（并行）：
  - <按可并行任务列>

第 2 步：
  - 全部就位 → 复制到 remotion/public/<scene>/
  - 跑 checklist.md 自检

第 3 步：
  - 实现 Scene 组件
  - 启动 Studio 预览
  - 等用户说"开始渲染"
```

---

## 6. 拍摄清单（执行前自检）

### 6.1 通用要求（所有视频）

- [ ] 着装：穿贴身运动衣 / **必须露出肩胛骨**（不能宽松遮挡）
- [ ] 背景：浅色墙（健身房一角 / 居家干净墙角） / 避免杂物
- [ ] 设备：三脚架固定 / 或找朋友帮拍
- [ ] 画质：1080p / 30fps / 4K 更好 / 横平竖直
- [ ] 收音：iPhone 单独录旁白（不用视频自带 mic）
- [ ] 试拍：拍前先 1 段测试，检查焦点、亮度、肩胛骨可见性

### 6.2 各段特别要求

- [ ] **#<N>（<名称>）**：<具体要求>
- [ ] **#<N>（<名称>）**：<具体要求>

---

## 7. 与其他 docs 的对齐

| 时机 | 动作 | 文档 |
|---|---|---|
| 写完 copy 后 | 生成本 assets.md | [copy.md](../../../docs/copy/<scene>.md) → assets.md |
| 用户准备拍视频 | 看本文件 §6 拍摄清单 | assets.md |
| 用户拍完 | 复制到 `remotion/public/` | [assets.md 规则第 3 节](../../rules/assets.md) |
| 跑自检 | 对齐本文件"已就位"列表 | [checklist.md](../../rules/checklist.md) |
| 实现 Scene | 用本文件 §2/§3 路径清单 + §4 组件 props import | [script.md](../../rules/script.md) |
```

### 2.4 字段说明

**表格内字段**

| 字段 | 必填 | 说明 |
|---|---|---|
| `#` | ✅ | 编号（整份文档唯一，与"路径清单"里的 # 对应）|
| `状态` | ✅ | `✅ 已生成` / `❌ 缺失` / `❌ 📋 待拍` / `⏸️ 进行中` |
| `类型` | ✅ | `video` / `image` / `audio` / `bgm` / `voiceover` / `font` |
| `描述` | ✅ | 这个素材展示/播放的内容（1-2 句中文）|
| `来源` | ✅ | `resources/<目录>/<文件名>` 或 `mmx 生成` 或 `用户提供` |
| `拍摄要求` | 仅视频 | 5 维度（机位/光线/时长/动作/其他）|
| `备注` | 可选 | 特殊说明（如"需裁剪"、"需转码"）|

**表格外字段（路径清单）**

| 字段 | 必填 | 说明 |
|---|---|---|
| `源路径` | ✅ | `resources/<目录>/<文件名>`（mmx 生成/用户提供的原始位置）|
| `目标位置` | ✅* | `remotion/public/<主题>/<子目录>/<文件名>` |

> *`目标位置` 在**当前没有自动复制脚本**时必填。如果未来加了 `scripts/copy-assets.sh` 之类的工具，
> 路径清单里可以**只写源路径**——目标位置由脚本自动算出来。

---

## 3. 自动复制已有素材

### 3.1 触发时机

**生成 assets.md 的同时**，自动执行复制操作。

### 3.2 复制规则

```
来源：resources/videos/卧推80KG_10.mov
目标：remotion/public/<视频主题>/videos/卧推80KG_10.mov
```

**复制命令**（用 Bash 执行）：

```bash
# 创建目标目录
mkdir -p remotion/public/<视频主题>/{videos,images,audios}

# 复制视频
cp "resources/videos/<文件名>" "remotion/public/<视频主题>/videos/"

# 复制图片
cp "resources/images/<文件名>" "remotion/public/<视频主题>/images/"

# 复制音频
cp "resources/audios/<文件名>" "remotion/public/<视频主题>/audios/"
cp "resources/audios/bgm/<文件名>" "remotion/public/<视频主题>/audios/bgm/"
```

> **不复制代码**（如 `subtitles.json`）—— JSON 跟随 Scene 组件走。

### 3.3 ⚠️ 不要复制"非素材"文件

- ❌ 不要把 `subtitles.json` 复制到 public/（它是代码数据，不是素材）
- ❌ 不要把 `storyboard.md` 复制到 public/
- ❌ 不要把整个 resources/ 复制到 public/（只复制需要的）

---

## 4. 缺失素材的生成 prompt

### 4.1 图片生成 prompt 模板（mmx）

按 `storyboard.md` 第 2 节的 `content_type` 选择：

**data_viz（数据可视化）**
```
data visualization, dark background #0A0A0A, neon orange highlights #FF4500,
weekly training report, 7-day bar chart, futuristic UI, minimal design,
no text labels, mobile screen aspect ratio
```

**screen_recording（屏幕录制）**
```
N/A —— 屏幕录制必须用户自己用手机/录屏软件制作，mmx 不提供
```

**动画元素**
```
abstract geometric animation, dark theme, neon orange, science fiction UI,
particle effects, suitable for video overlay, transparent background
```

**UI 截图**
```
mobile app UI screenshot, fitness tracking app, AI chat interface,
dark theme, Chinese language labels, modern minimalist design,
[具体描述界面内容]
```

### 4.2 视频生成 prompt 模板（mmx 或等待用户拍摄）

> ⚠️ **七练训练动作视频建议用户自己拍摄**——mmx 生成的"假人健身"视频质量不稳定。

**mmx 生成的视频只用于：**
- 抽象背景（粒子、扫描线、几何动画）
- 转场过场（光斑、能量波）
- 数据可视化动画

**用户拍摄的素材：**
- 训练动作演示（卧推/深蹲/硬拉等）
- 个人手机拍摄的场景
- 屏幕录制

### 4.3 缺失时的处理

- **图片**：写 mmx prompt 让用户确认后生成 → 用户下载到 `resources/images/` → 触发自动复制
- **视频**：标注"等待用户拍摄" + 推荐拍摄角度/光线/时长建议
- **音频/字幕**：走 `subtitle.md` 的现有流程

### 4.4 批量生成 + 验收 + 迭代工作流（mmx 端）

> **为什么单列一节**：assets.md §4.1-§4.3 只给了"单条 prompt 模板"，没有**批量化**和**验收**的工作流。
> 实际做视频常常**一次要生 5-10 张图**（数据卡 + 钩子背景 + 转场），如果一张张来，会浪费 mmx 配额 + 拖延工期。

#### 4.4.1 何时用批量

| 场景 | 建议 |
|---|---|
| **同类图片 ≥ 3 张**（如 4 个数据卡 / 7 天柱状图）| ✅ **必批量**——一次给 1 个总 prompt，列 N 个 variant |
| **不同类图片**（如钩子背景 + 数据卡 + 转场）| ⚠️ 视情况：可分 2-3 批，每批 ≤ 5 张 |
| **只有 1 张图** | ❌ 不用批量——直接单条 prompt |

#### 4.4.2 批量 prompt 写法（4 张数据卡示例）

```markdown
# 给 mmx 的批量 prompt

## 通用风格（适用于所有 4 张）
- 配色：dark background #0A0A0A, neon orange #FF4500 highlights
- 字体：现代无衬线（黑体 / Inter / 思源黑体）
- 尺寸：1080×200（横长条）
- 圆角：8px
- 描边：2px solid #FF4500 / 50% opacity
- 风格：科技感 + 力量感（参考 [script.md §7](../../rules/script.md#7-元素设计风格科技感--力量感)）

## 4 个 variant（每张一张）

### Variant 1：动作 1 数据卡
- 主标题："壁虎推墙"
- 数据行：12-15 次 × 3 组
- 副数据：RPE 7
- 强调色：橙色数字 + 白色文字

### Variant 2：动作 2 数据卡
- 主标题："俯卧撑+前伸"
- 数据行：8-12 次 × 3 组
- 副数据：无
- 强调色：同上

### Variant 3：动作 3 数据卡
- 主标题："YTWL"
- 数据行：各 10-15 次
- 副数据：4 个字母
- 强调色：同上

### Variant 4：动作 4 数据卡
- 主标题："弹力带后收"
- 数据行：15-20 次 × 3 组
- 副数据：轻阻力弹力带
- 强调色：同上
```

> **关键点**：**通用风格只写 1 次**，每个 variant 只写"变化的部分"（标题/数据/副数据），避免 mmx 4 张图风格漂移。

#### 4.4.3 验收清单（每张图必走）

mmx 生成完**必须**按以下清单验收，全部 ✅ 才能写入 `assets.md` 的"已生成"：

| # | 验收项 | 通过判据 | 不通过怎么办 |
|---|---|---|---|
| 1 | **尺寸对吗** | 像素 = prompt 要求的尺寸（1080×1920 / 1080×200 等）| 重生成时显式加 `--width` `--height` |
| 2 | **背景色对吗** | `#0A0A0A`（深黑）| 改 prompt：明确加 `solid background #0A0A0A` |
| 3 | **强调色对吗** | 主色 = `#FF4500` 橙 / `#DC143C` 红 | 改 prompt：明确加 `primary color #FF4500` |
| 4 | **风格一致吗** | 4 张图**视觉上一眼是一套** | 强化"通用风格"段，列出字体/圆角/描边具体值 |
| 5 | **无乱码 / 无错字** | 文字清晰可读，无中文乱码 / 英文拼错 | 改 prompt：明确加 `no typos, clear Chinese text` |
| 6 | **无 AI 痕迹** | 没有"6 根手指 / 9 根脚趾 / 错乱线条"等 AI 生成瑕疵 | 重生成该张（不接受低质量）|
| 7 | **无敏感内容** | 无裸露 / 暴力 / 政治 / 种族 / 涉未成年人 | 必删，绝不能用 |
| 8 | **可商用** | 风格是"通用 UI 风格"非特定品牌 | 避免用"苹果 / 微信 / 抖音"等品牌名 |
| 9 | **半透明 / 边框** | 元素是半透明彩底 + 同色系边框（参考 [script.md §9](../../rules/script.md#9-素材框设计)）| 改 prompt：加 `semi-transparent orange background, orange border` |

#### 4.4.4 验收不通过时的迭代 5 步

```
1. 标出"哪几张不通过 + 哪个验收项不通过"
       ↓
2. 改 prompt 的"对应部分"（不要全改）
   - 颜色不对 → 改颜色描述
   - 尺寸不对 → 加显式尺寸
   - 风格漂移 → 强化"通用风格"段
       ↓
3. 重生成（**只生不通过的那几张**，不要全量重做）
       ↓
4. 再次验收（§4.4.3 清单）
       ↓
5. 最多迭代 3 轮——3 轮不过，换 prompt 模板（换基础风格词 / 换结构描述）
```

> **避免无限迭代**：**3 轮不过就停**。可能是 prompt 本身有问题（mmx 能力边界），换思路——比如让用户自己用 Figma 做，或者改成代码实现（参考 §1.4）。

#### 4.4.5 命名与归档

mmx 下载的图片**必须**按以下规则命名后再放进 `resources/images/`：

```
<主题>_<用途>_<编号>.<ext>

示例：
winged_scapula_b3_scapula_anatomy_01.png
winged_scapula_b3_param_1_wall_slide_01.png
```

- `<主题>`：与 `remotion/src/scenes/<主题>/` 一致
- `<用途>`：`scapula_anatomy` / `param_1_wall_slide` 等，**与 assets.md §2 表格里的"文件名"字段完全一致**
- `<编号>`：`_01` / `_02`（预留空间：未来如果同一张图有 v2）
- `<ext>`：`.png` / `.jpg`（默认 png，jpg 仅在文件大时）

> **命名一致性是硬约束**——assets.md 的"文件名"字段、remotion/public/ 里的实际文件、代码里 `staticFile()` 调用的路径**必须三处一致**。

#### 4.4.6 引用 mmx prompt 的位置

每个视频的 mmx prompt 历史**保留**在 `resources/docs/copy/<主题>_mmx_prompts.md`（可选），便于：

- 迭代时快速找到"上次怎么写的"
- 不同视频之间复用 prompt
- 用户审查 mmx 用了什么

模板：

```markdown
# mmx Prompts：<视频主题>

**生成日期**：2026-06-04
**生成者**：Claude（按 [assets.md §4.4](../../rules/assets.md#44-批量生成--验收--迭代工作流mmx-端) 流程）

---

## 批次 1：5 张图片（钩子背景 + 4 个数据卡）

**Prompt**：

\`\`\`
[完整 prompt 内容]
\`\`\`

**验收结果**：5/5 通过

**备注**：第 2 轮迭代时把"圆角 8px"改成"圆角 12px"更符合品牌
```

---

## 5. 与其他 rules 的协同

### 5.1 与 `script.md` 协同

写完脚本后，**对照脚本的"主体区域"内容**（参考 `script.md` 第 2 节"字幕与画面文字的分工"），列出每个场景需要的视觉素材。

### 5.2 与 `storyboard.md` 协同

分镜表本身就是素材需求的源——每个分镜的 `content_source` 字段直接成为 assets.md 中的一行。

**`storyboard.md` 输出后**，自动生成 assets.md：

```
storyboard.json 中每个分镜的 content_source
  ↓ 对应 resources/ 检索
  ↓ 命中 → 复制 → assets.md "已就位"
  ↓ 未命中 → 写 mmx prompt → assets.md "缺失"
```

### 5.3 与 `animation.md` 协同

`content_type: animation` 的分镜通常**不需要外部素材**——由代码生成。assets.md 中**不需要列出**这种类型。

### 5.4 与 `bgm.md` 协同

BGM 也算"音频素材"，但单独成一节（第 3 节），便于区分旁白和 BGM。

---

## 6. 命名约定

### 6.1 视频主题目录命名

`<主题>` 用 kebab-case 英文或拼音，例如：
- ✅ `workout_intro`
- ✅ `weekly_review`
- ✅ `pr_breakthrough_80kg`
- ❌ `Workout Intro`（不要用空格）
- ❌ `卧推突破`（不要用中文）

### 6.2 素材文件名

沿用 `resources/` 中的原名（用户已经命名了），不要再改名。

### 6.3 缺失素材的临时命名

mmx 生成但还没给最终名时，临时命名规则：
- `<内容类型>_<用途>.png`，例如 `data_viz_weekly_report.png`
- 用户提供后用真实文件名替换

---

## 7. 速查清单（只列**本文件专属**项）

> **跨文件去重原则**：通用检查见 [checklist.md](remotion/rules/checklist.md)；本节只列**素材清单生成**的专属项。

**生成脚本时**

- [ ] 主体区域提到的所有视觉元素都列出来
- [ ] 每个元素标"已有" / "缺失"
- [ ] 缺失的写 mmx prompt（见第 4 节）
- [ ] 输出 `remotion/src/scenes/<主题>/assets.md`（见第 2 节）
- [ ] 自动复制已有素材到 `remotion/public/<主题>/`（见第 3 节）

**生成/更新分镜时**

- [ ] 每个分镜的 `content_source` 字段对应 assets.md 中的一行（见第 5.2 节）
- [ ] 已有的自动复制
- [ ] 缺失的写 prompt
- [ ] 更新 assets.md 的"已就位"和"缺失"两节
- [ ] 阻塞情况列在"状态汇总"（见第 2.1 节）

**实现 Scene 组件前**

- [ ] assets.md 中所有阻塞素材已就位
- [ ] `remotion/public/<主题>/` 目录已建好
- [ ] 缺失的标"已生成"或"已上传"

**其他维度的自检**（不在本文件）：
- 通用综合自检 → [checklist.md](remotion/rules/checklist.md) 第 2 节（master）
- 主题目录命名 → [script.md](remotion/rules/script.md) 第 1 节
