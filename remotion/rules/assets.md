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

---

## 2. 素材清单格式（assets.md）

### 2.1 必填字段（每个素材必须有）

> 2026-06-04 升级：每个素材行**必须**包含完整 5 字段，不能简写。

| 字段 | 必填 | 说明 |
|---|---|---|
| **#** | ✅ | 编号（用于组件 import 时引用）|
| **文件名** | ✅ | 含项目相对路径（用于代码中 `staticFile()` 调用）|
| **类型** | ✅ | `video` / `image` / `audio` / `bgm` / `voiceover` / `font` |
| **描述** | ✅ | 这个素材是什么（1-2 句中文，**画面/声音内容描述**）|
| **来源 / 目标位置** | ✅ | `resources/<目录>/<文件名>` 或 `mmx 生成` 或 `用户提供` |

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

```markdown
# 素材清单：<视频主题>

**视频主题**：<主题>
**视频类型**：<A/B/C>
**目标账号**：<main/sub>
**生成日期**：<YYYY-MM-DD>
**关联脚本**：resources/docs/copy/<主题>.md
**关联分镜**：storyboard.md

---

## 1. 视频素材（用户自拍为主）

| # | 文件名（含项目相对路径）| 描述 | 来源 | 目标位置 | 拍摄要求 |
|---|---|---|---|---|---|
| 1 | `resources/videos/<scene>_001_hook.mov` | 用户背对镜头，肩胛骨翼状 vs 正常对比演示 | 用户自拍 | `remotion/public/<scene>/videos/001_hook.mov` | 机位：背对镜头 / 镜头平齐肩部<br>光线：自然光从左前方 / 避免顶光<br>时长：≥ 10s（钩子画面）<br>动作：自然站立 / 双手垂在身侧 / 缓慢转身 30°<br>其他：穿贴身衣 / 露出肩胛骨 / 背景简洁 |
| 2 | `resources/videos/<scene>_002_wall_push.mov` | 推墙测试自测 | 用户自拍 | `remotion/public/<scene>/videos/002_wall_push.mov` | 机位：正侧面或斜 45°<br>光线：均匀<br>时长：≥ 5s（自测演示）<br>动作：面对墙、双臂前平举推墙<br>其他：需要朋友从背后拍或后期加箭头标注 |
| ... |

## 2. 图片素材（mmx 生成或用户截图）

| # | 文件名 | 描述 | 来源 | 目标位置 | 备注 |
|---|---|---|---|---|---|
| 1 | `resources/images/<scene>_scapula_anatomy.png` | 翼状肩 vs 正常肩胛 示意（用于钩子背景）| mmx 生成 | `remotion/public/<scene>/images/scapula_anatomy.png` | 1080×1920 竖屏 / 暗色背景 / 橙红色高亮 / 半透明 |

## 3. 音频素材

| # | 文件名 | 描述 | 来源 | 目标位置 | 备注 |
|---|---|---|---|---|---|
| 1 | `resources/audios/<scene>.mp3` | 旁白（4.8 字/秒）| 用户自录 或 mmx TTS | `remotion/public/<scene>/audios/<scene>.mp3` | ~50s / MP3 / 128kbps+ |
| 2 | `resources/audios/bgm/power_build.mp3` | BGM（Power Build 类型）| mmx 生成 | `remotion/public/<scene>/audios/bgm/power_build.mp3` | 105 BPM / tech house / ≥ 50s 可循环 |

## 4. 状态汇总

- 已就位：<N> 项
- 待生成/获取：<M> 项
- 阻塞情况：<如果某些分镜没素材就实现不了，列出来>

## 5. 拍摄清单（执行前自检）

- [ ] 所有视频素材**有具体机位/光线/时长/动作**描述
- [ ] 着装：穿贴身运动衣 / 不遮挡肩胛骨
- [ ] 背景：简洁（健身房一角 / 居家干净墙角 / 浅色墙）
- [ ] 设备：三脚架 或 找朋友帮拍
- [ ] 画质：1080p / 30fps / 4K 更好
- [ ] 收音：安静环境 / 嘴距话筒 10-20cm

## 6. 下一步

- [ ] 用户确认缺失素材的优先级
- [ ] mmx 生成图片 / 等待用户拍摄
- [ ] 所有素材就位后开始实现 Scene 组件
```

### 2.4 字段说明

| 字段 | 必填 | 说明 |
|---|---|---|
| `#` | ✅ | 编号（用于组件 import 时引用）|
| `文件名` | ✅ | 含**项目相对路径**（`resources/videos/...` 或 `remotion/public/...`） |
| `描述` | ✅ | 这个素材展示/播放的内容（1-2 句中文）|
| `来源` | ✅ | `resources/<目录>/<文件名>` 或 `mmx 生成` 或 `用户提供` |
| `目标位置` | ✅ | `remotion/public/<主题>/<子目录>/<文件名>` |
| `拍摄要求` | 仅视频 | 5 维度（机位/光线/时长/动作/其他）|
| `备注` | 可选 | 特殊说明（如"需裁剪"、"需转码"）|

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
