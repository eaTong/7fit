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
├── shoot-checklist.md  # ← 拍摄清单（外拆，详见 §2.4）
└── components/
    └── ...
```

> 🆕 **2026-06-04**：转场音效 sfx 资源按 `T1` / `T2` / `T3` 编号，路径见 §2 路径清单。
> 来源：`mmx 生成` 或 `用户提供`；目标位置 `remotion/public/<主题>/audios/sfx/`。

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

> ⚠️ **2026-06-04 升级**：从"按类型分组"重构为 **Option A——按 `#` 编号单表**。
> 详见 §2.0 设计动机。

### 2.0 设计动机

之前的格式按"视频/图片/音频/代码组件"分 4 个表格，每个表格有自己的"路径清单"块。**3 个痛点**：

| 痛点 | 体现 |
|---|---|
| 路径清单重复 3-5 次 | 改文件名要改多处 |
| "来源"列与路径清单信息冗余 | 表格里写"用户自拍"，上面又写路径 |
| 按"类型"分组，扫不到"行动项" | 用户实际想问"我现在要拍什么"，不是"视频有哪些子节" |

**Option A 重构后**：
- §0 **状态总览**（一眼看进度）—— 5 列：✅ / 📋 / ❌ / 🆕
- §1 **全部资产**（单表，按 # 排序）—— 1 张表覆盖 video/image/audio/code
- §2 **路径清单**（单份，#1-#N 全列）—— 不再每个类型分块
- §3 **代码组件 TODO**（单独成节）
- §4 **推荐执行顺序**
- §5 **指向 shoot-checklist.md**（拍摄清单外拆）

### 2.1 必填字段（每个素材必须有）

**§1 表格内字段**

| 字段 | 必填 | 说明 |
|---|---|---|
| **#** | ✅ | 编号（用于组件 import 时引用，整份文档唯一）。代码组件用 `C1` / `C2` 前缀。转场音效用 `T1` / `T2` 前缀（2026-06-04 新增）|
| **类型** | ✅ | `video` / `image` / `audio` / `bgm` / `voiceover` / `sfx` 🆕 / `code` |
| **状态** | ✅ | 4 选 1：`✅ 就位` / `📋 待拍` / `❌ 缺失` / `🆕 待实现` |
| **描述** | ✅ | 这个素材是什么（1-2 句中文，**画面/声音内容描述**）|
| **拍摄要求** | 仅 video | 5 维度（机位/光线/时长/动作/其他），见 §2.2 |

> **"来源"列已删除**——信息已包含在 §2 路径清单的"源路径"列，不重复。

**§2 路径清单字段**

| 字段 | 必填 | 说明 |
|---|---|---|
| `#` | ✅ | 与 §1 对应 |
| `状态` | ✅ | 同上 |
| `源路径` | ✅ | `resources/<目录>/<文件名>`（mmx 生成/用户提供的原始位置）|
| `目标位置` | ✅* | `remotion/public/<主题>/<子目录>/<文件名>` |

> *`目标位置` 在**当前没有自动复制脚本**时必填。如果未来加了 `scripts/copy-assets.sh` 之类的工具，
> 路径清单里可以**只写源路径**——目标位置由脚本自动算出来。

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

### 2.3 完整模板（Option A 单表）

```markdown
# 素材清单：<视频主题>

**视频主题**：<主题>
**视频类型**：<A/B/C>
**目标账号**：<main/sub>
**BGM 类型**：<Cyber Pulse / Power Build / Quiet Think / Hop Pulse>
**目标时长**：<秒>
**生成日期**：<YYYY-MM-DD>
**关联脚本**：[copy.md](../../../docs/copy/<主题>.md)
**关联分镜**：[storyboard.md](storyboard.md) （待生成）

---

## 0. 状态总览

| 类别 | 总数 | ✅ 就位 | 📋 待拍 | ❌ 缺失 | 🆕 待实现 |
|---|---|---|---|---|---|
| 视频（用户自拍） | <N> | <X> | <Y> | 0 | - |
| 图片（mmx 生成） | <N> | <X> | - | <Y> | - |
| 音频（用户自录） | <N> | <X> | - | <Y> | - |
| 音频（mmx BGM） | <N> | <X> | - | <Y> | - |
| 🆕 转场音效（mmx sfx） | <N> | <X> | - | <Y> | - |
| 代码组件 | <N> | <X> | - | - | <Y> |
| **合计** | <sum> | <sum> | <sum> | <sum> | <sum> |

> 📌 **总览解读**：✅ = 无需操作；📋 = 用户要拍/录；❌ = mmx 要生；🆕 = 开发要写。

---

## 1. 全部资产（单表，按 # 排序）

> 数字 # 与"§2 路径清单"一一对应。

| # | 类型 | 状态 | 描述 | 拍摄要求（仅视频）|
|---|---|---|---|---|
| 1 | video | 📋 待拍 | 用户背对镜头，肩胛骨翼状 vs 正常对比演示 | **机位**：背对镜头 / 平齐肩部<br>**光线**：自然光左前方 45°<br>**时长**：≥ 10s<br>**动作**：自然站立 / 双手垂身侧 / 缓慢转 30°<br>**其他**：贴身运动衣 / 露出肩胛骨 |
| 2 | video | 📋 待拍 | 镜子自测 1：背对镜子，自然站立 | **机位**：背对落地镜 / 朋友从侧前方拍<br>**光线**：均匀<br>**时长**：≥ 5s<br>**动作**：自然站立 / 肩完全放松 / 手垂下<br>**其他**：朋友站镜子侧前方 / 露出肩胛骨 |
| 3 | image | ✅ 就位 | 翼状肩 vs 正常肩胛 解剖示意（钩子背景用）| - |
| 4 | voiceover | ✅ 就位 | 旁白（**3.4 字/秒 × 196 字 ≈ 58s**，含 2.1s 段间停顿 = 全文 66s）| **M4A / AAC-LC / 单声道 / 44.1-48 kHz / 64-128kbps+** / 必用户自录 |
| 5 | bgm | ✅ 就位 | BGM Power Build | 105 BPM / tech house / Dm / **≥ 65s** 可循环（**Phase 6 选型**）|
| T1 | sfx 🆕 | ❌ 缺失 | 钩子 → 主体 转场音效（whoosh / 滑动声）| 0.3-0.5s / 与视频"动起来"节奏匹配 / Phase 5 mmx 生成 |
| T2 | sfx 🆕 | ❌ 缺失 | 主体段内（自测 1→2 / 动作 1→2 / 2→3 / 3→4）转场音效 | 0.3-0.5s × 3 段 |
| T3 | sfx 🆕 | ❌ 缺失 | 主体 → 收尾 转场音效（柔和一点，对应"沉淀"）| 0.3-0.5s |
| C1 | code | 🆕 待实现 | `<ActionDataCard>` 壁虎推墙 · 12-15 × 3 | - |
| C2 | code | 🆕 待实现 | `<ActionDataCard>` 俯卧撑+前伸 · 8-12 × 3 | - |

---

## 2. 路径清单（单份）

| # | 状态 | 源路径 | 目标位置 |
|---|---|---|---|
| 1 | 📋 待拍 | `resources/videos/<scene>_001_hook_compare.mov` | `remotion/public/<scene>/videos/001_hook_compare.mov` |
| 2 | 📋 待拍 | `resources/videos/<scene>_002_mirror_test.mov` | `remotion/public/<scene>/videos/002_mirror_test.mov` |
| 3 | ✅ 就位 | `resources/images/<scene>_scapula_anatomy_01.png` | `remotion/public/<scene>/images/scapula_anatomy.png` |
| 4 | ✅ 就位 | `resources/audios/<scene>.m4a` | `remotion/public/<scene>/audios/<scene>.m4a` |
| 5 | ✅ 就位 | `resources/audios/bgm/power_build.mp3` | `remotion/public/<scene>/audios/bgm/power_build.mp3` |

> 已就位项 (#3-#5) **已复制**到 public/；待拍项 (#1-#2) 等用户拍完再复制。

---

## 3. 代码组件 TODO（`code_component`）

> 对应 §1 表格 #C1-#C2。这不是外部素材，是**实现清单**。完成后翻 ✅。

| # | 组件名 | 用途 | props | 引用位置（预估）|
|---|---|---|---|---|
| C1 | `<ActionDataCard>` | 动作 1 数据卡：壁虎推墙 · 12-15 × 3 | `{ name: "壁虎推墙", reps: "12-15", sets: "3" }` | Shot S05（动作 1 演示）|
| C2 | `<ActionDataCard>` | 动作 2 数据卡：俯卧撑+前伸 · 8-12 × 3 | `{ name: "俯卧撑+前伸", reps: "8-12", sets: "3" }` | Shot S07（动作 2 演示）|

**实现位置**：`remotion/src/components/<Name>.tsx`（跨视频复用）

**实现模板**：见 [script.md §10.3](script.md#103-实现示例actiondatacard-骨架)

---

## 4. 推荐执行顺序

```
第 1 步（mmx 端：把已就位素材搬到 public/）：
  mkdir -p remotion/public/<scene>/{videos,images,audios/bgm}
  cp resources/images/<scene>_* remotion/public/<scene>/images/
  cp resources/audios/<scene>.m4a remotion/public/<scene>/audios/     # 🆕 旁白从 mp3 改 m4a（2026-06-05）
  cp resources/audios/bgm/*.mp3 remotion/public/<scene>/audios/bgm/  # BGM 仍 mp3（mmx 标准输出）

第 2 步（用户：按 shoot-checklist.md 拍摄 N 段视频）：
  拍完一段拷到 resources/videos/，然后 cp 到 public/

第 3 步（开发：实现 X 个代码组件）：
  见 script.md §10.X

第 4 步（mmx：用刚录的 mp3 识别字幕 → subtitles.json）

第 5 步（开发：按字幕写分镜 storyboard.md/.json）

第 6 步（开发：实现 Scene 组件 + 集成 BGM + 转场）

第 7 步（跑 checklist.md 自检 → 等用户说"开始渲染"）
```

---

## 5. 拍摄清单

> ⚠️ **已拆到独立文件**：[shoot-checklist.md](shoot-checklist.md) — 拍摄当天打开这个文件。
> 本文件 §1 表格里"拍摄要求"列是技术规格（机位/光线/时长/动作/其他），shoot-checklist.md 是执行清单（环境/设备/通用要求 + 各段特别提醒）。
```

### 2.4 拍摄清单外拆（shoot-checklist.md）

> **为什么外拆**：拍摄清单是"拍摄当天执行"，assets.md 是"开工前规划"——两个工作流不同步，混在一个文档里反而互相干扰。

**文件位置**：`remotion/src/scenes/<主题>/shoot-checklist.md`（与 assets.md 同级）

**典型结构**：
1. 通用要求（所有视频）—— 着装/背景/设备/画质/收音/试拍
2. 各段特别提醒（按 # 编号）—— 简版"重点"，详细规格回看 assets.md §1
3. 拍完归档流程 —— `cp` 命令
4. 全部拍完自检 —— assets.md 状态总览更新
5. 与其他 docs 对齐 —— 一张表

**模板见 §2.5**。

### 2.5 shoot-checklist.md 模板

```markdown
# 拍摄清单：<视频主题>

> ⚠️ 拍摄当天打开这个文件。素材规格见 [assets.md §1](assets.md#1-全部资产单表按-排序) 「拍摄要求」列。
> 总素材数：<N> 段视频。

---

## 1. 通用要求（所有 <N> 段都遵守）

- [ ] **着装**：穿贴身运动衣 / **必须露出肩胛骨**（不能宽松遮挡）
- [ ] **背景**：浅色墙（健身房一角 / 居家干净墙角）/ 避免杂物
- [ ] **设备**：三脚架固定 / 或找朋友帮拍
- [ ] **画质**：1080p / 30fps / 4K 更好 / 横平竖直
- [ ] **收音**：iPhone 单独录旁白（不用视频自带 mic）
- [ ] **试拍**：拍前先 1 段测试

---

## 2. 各段特别提醒

> 每条对应 assets.md §1 中的 #。**只列重点**，完整规格见 assets.md。

- [ ] **#1（<名称>）**：<重点 1>
- [ ] **#2（<名称>）**：<重点 2>

---

## 3. 拍完一段 → 立即归档

\`\`\`
# 1. 拷到 resources/videos/
cp ~/Desktop/IMG_XXXX.MOV resources/videos/<scene>_00X_<name>.mov

# 2. 复制到 public/
cp resources/videos/<scene>_00X_<name>.mov remotion/public/<scene>/videos/00X_<name>.mov

# 3. 跑 assets.md §0 状态总览检查
\`\`\`

> 文件名严格按 assets.md §2 路径清单——**三处一致**（resources/ 原始名 + public/ 目标名 + 代码里 `staticFile()` 路径）。

---

## 4. 全部拍完后的自检

- [ ] <N> 段视频都在 `resources/videos/` 和 `remotion/public/<scene>/videos/`
- [ ] assets.md §0 状态总览里"📋 待拍"列从 <N> → 0
- [ ] 打开 1 段视频，确认：露出肩胛骨 ✓ / 焦点清晰 ✓ / 无杂物背景 ✓
```

### 2.6 字段说明（精简版，详见 §2.1）

| 字段 | 必填 | 说明 |
|---|---|---|
| `#` | ✅ | 编号（整份文档唯一）|
| `类型` | ✅ | `video` / `image` / `audio` / `bgm` / `voiceover` / `code` |
| `状态` | ✅ | 4 选 1：`✅ 就位` / `📋 待拍` / `❌ 缺失` / `🆕 待实现` |
| `描述` | ✅ | 1-2 句中文 |
| `拍摄要求` | 仅 video | 5 维度（机位/光线/时长/动作/其他）|

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

**生成脚本时（Option A 格式）**

- [ ] 主体区域提到的所有视觉元素都列出来
- [ ] 每个元素标 `✅ 就位` / `📋 待拍` / `❌ 缺失` / `🆕 待实现` 之一
- [ ] 缺失的写 mmx prompt（见 §4 节）
- [ ] 输出 `remotion/src/scenes/<主题>/assets.md`，按 §2.3 模板（Option A 单表）
- [ ] **§0 状态总览** 5 列填齐（✅ / 📋 / ❌ / 🆕）
- [ ] **§1 全部资产**单表，按 `#` 排序，覆盖 video/image/audio/code 4 类
- [ ] **§2 路径清单**单份，不重复
- [ ] 自动复制已有素材到 `remotion/public/<主题>/`（见 §3 节）
- [ ] **§5 指向 shoot-checklist.md**（拍摄清单外拆）

**生成/更新分镜时**

- [ ] 每个分镜的 `content_source` 字段对应 assets.md §1 中的一行
- [ ] 已有的自动复制
- [ ] 缺失的写 prompt
- [ ] 更新 assets.md §0 状态总览 + §1 状态列 + §2 路径清单
- [ ] 阻塞情况列在 §0 总览

**实现 Scene 组件前**

- [ ] assets.md §0 里"📋 待拍"和"❌ 缺失"列都已为 0
- [ ] `remotion/public/<主题>/` 目录已建好
- [ ] 已就位项全部 cp 到 public/
- [ ] §0 里"🆕 待实现" 代码组件也都实现了

**拍摄前（用 shoot-checklist.md）**

- [ ] 用户打开 shoot-checklist.md §1 通用要求
- [ ] 用户按 §2 各段特别提醒拍
- [ ] 每拍完一段，按 §3 命令归档 + 更新 assets.md §0

**其他维度的自检**（不在本文件）：
- 通用综合自检 → [checklist.md](remotion/rules/checklist.md) 第 2 节（master）
- 主题目录命名 → [script.md](remotion/rules/script.md) 第 1 节
