# 分镜规范（remotion）

> 阶段：分镜（storyboard / shot list）
> 适用场景：根据字幕/音频设计镜头脚本
> 来源：用户硬约束
> 状态：✅ 生效
> 上下游：上游是 `subtitle.md`（字幕文件），下游是 `script.md`（每个分镜对应一个 Scene 组件）
> 配套产物：每次输出分镜**必须同时输出** `assets.md` 素材清单（详见 `assets.md`）
> **视频类型**：开工前先确定属于 3 类中的哪一类（A 个人人设 / B 健身知识 / C 七练介绍），详见 `video-types.md`

---

## 1. 分镜工作流

### 1.1 触发条件

**有字幕文件 / 音频**时，必须按字幕设计分镜。流程：

```
音频 (resources/audios/) 
   ↓ mmx 识别
字幕 (subtitles.json)
   ↓ 按本规范设计
分镜表 (storyboard.md / storyboard.json)
   ↓ 实现
Scene 组件 (scenes/<主题>/index.tsx)
```

### 1.2 输入

- `remotion/src/scenes/<主题>/subtitles.json`（由 `subtitle.md` 生成）
- 可选：用户在 `resources/videos/`、`resources/images/` 提供的素材

### 1.3 输出位置

分镜文档放在视频入口同级目录：

```
remotion/src/scenes/<视频主题>/
├── index.tsx
├── subtitles.json
├── storyboard.md         # 分镜表（人类可读，方便 review）
└── storyboard.json       # 分镜数据（结构化，可被组件消费）
```

> 两者写一份就够；`storyboard.json` 可由 `storyboard.md` 自动解析生成。

---

## 2. 分镜表格式

每个分镜（shot）必须包含以下字段：

| 字段 | 说明 | 示例 |
|---|---|---|
| `shot_id` | 镜头编号（从 1 开始） | `S01` |
| `start` | 起始时间（秒，对齐字幕） | `0.0` |
| `end` | 结束时间（秒） | `2.4` |
| `duration` | 镜头时长（秒） | `2.4` |
| `content_type` | 内容类型 | `video` / `image` / `animation` / `data_viz` / `code_component` |
| `content_source` | 素材路径（`resources/...`） / `generate:<mmx_prompt>` / `<组件名 prop=...>` | `resources/videos/卧推80KG_10.mov` / `<ActionDataCard reps="12-15" sets="3" />` |
| `voiceover` | 对齐的字幕 ID | `1`（即 `subtitles.json[0]`） |
| `description` | 这个镜头在讲什么 | `演示用户用 3 秒一句话记录训练` |
| `overlay_text` | 主区域叠加的少量文字（≤ 6 字，可选） | `3 秒` |

### 2.1 Markdown 分镜表模板

```markdown
| shot_id | 时间 (s) | 时长 (s) | 类型 | 素材 | 字幕 | 描述 |
|---------|----------|----------|------|------|------|------|
| S01 | 0.0-2.4 | 2.4 | video | resources/videos/卧推80KG_10.mov | 1 | 开场钩子：动作演示 |
| S02 | 2.4-5.1 | 2.7 | image | resources/images/chat_demo.png | 2 | 演示 AI 对话界面 |
| S03 | 5.1-10.0 | 4.9 | data_viz | generate:周报数据可视化 | 3-4 | 周报数据图表 |
```

### 2.2 JSON 分镜数据模板

```json
[
  {
    "shot_id": "S01",
    "start": 0.0,
    "end": 2.4,
    "duration": 2.4,
    "content_type": "video",
    "content_source": "resources/videos/卧推80KG_10.mov",
    "voiceover": 1,
    "description": "开场钩子：动作演示",
    "overlay_text": "3 秒"
  }
]
```

---

## 3. 时长硬约束

### 3.1 视频类镜头

**使用视频素材的镜头时长必须 > 5 秒**。

- 视频类镜头把多条相邻字幕"打包"到一个长镜头里
- 推荐覆盖 2-4 条字幕（5-12s），让视频充分发挥节奏感
- 不足 5s 的视频段 = ❌ 镜头时长错误

```markdown
# ✅ 正确：视频镜头 7.2s，覆盖 3 条字幕
| S03 | 5.1-12.3 | 7.2 | video | resources/videos/深蹲_100KG.mov | 3,4,5 | 深蹲训练演示 |
# ❌ 错误：视频镜头只用了 2.4s
| S03 | 5.1-7.5 | 2.4 | video | resources/videos/深蹲_100KG.mov | 3 | 深蹲训练演示 |
```

### 3.2 图片类镜头

**图片镜头的时长根据字幕决定**：

- 默认 = 对应字幕段的时长
- 如果图片需要更多展示时间，可延长到相邻字幕的中点（不超过 1.5× 字幕时长）
- 单张图片展示时间建议 **2-5 秒**，过短看不清楚，过长视觉疲劳

```markdown
# ✅ 正确：图片镜头 = 字幕时长
| S02 | 2.4-5.1 | 2.7 | image | resources/images/chat_demo.png | 2 | 对话界面演示 |
# ✅ 正确：图片略长于字幕
| S05 | 10.0-13.5 | 3.5 | image | resources/images/profile.png | 6 | 个人中心 |
# ❌ 错误：图片镜头 0.8s，根本看不清
| S05 | 10.0-10.8 | 0.8 | image | resources/images/profile.png | 6 | 个人中心 |
```

### 3.3 动画 / 数据可视化

- 同图片规则，根据字幕/数据复杂度决定时长
- 复杂图表建议 4-6s

### 3.4 时长一致性自检

每个分镜的 `start` 必须 = 上一镜的 `end`；`end - start == duration`。整段分镜的 `end` 必须等于音频总时长。

---

## 4. 镜头内容硬约束

**每个镜头都必须有实际视觉内容展现**，**严禁出现"纯色背景 + 文字"的空镜头**。

### 4.1 允许的 content_type

| 类型 | 说明 | 示例 | 是否需要外部素材 |
|---|---|---|---|
| `video` | 实拍视频素材 | 健身动作演示、训练 vlog | ✅ 需 `resources/videos/` |
| `image` | 图片素材/截图 | 界面截图、产品图 | ✅ 需 `resources/images/` |
| `animation` | Remotion 内的动效组件 | 数字滚动、3D 元素入场 | ❌ 纯代码 |
| `data_viz` | 数据可视化 | 折线图、柱状图、训练容量 | ❌ 纯代码 |
| `screen_recording` | 屏幕录制 | 演示 AI 对话流程 | ✅ 需用户录屏 |
| `composite` | 多层叠加 | 视频底层 + 数据前景层 | 视子层而定 |
| **`code_component`** | **可复用数据组件** | **数据卡 / 标题 / 列表 / CTA / Badge** | **❌ 纯代码，不进 assets.md** |

> **`code_component` 是 2026-06-04 新增**——详见 [assets.md §1.4](assets.md#14-⚠️-可代码实现的内容不进-assetsmd强约束)。
> 触发场景：分镜要展示"数据卡 / 数字高亮 / 章节标题 / 列表 / 按钮 / Badge"等可用代码渲染的内容。
> `content_source` 字段写组件名 + props，例如 `<ActionDataCard name="壁虎推墙" reps="12-15" sets="3" />`。
> **不**进 `assets.md`（不消耗 mmx / 不占 `public/` 配额）。

### 4.2 ❌ 禁止的"伪内容"

- ❌ 纯黑底 + 居中文字
- ❌ 纯色块（橙/红/白）+ 单行标题
- ❌ 渐变背景 + 文字，无其他视觉元素
- ❌ 几何图形 + 文字，无信息含量

### 4.3 文字的角色

文字**只能作为叠加层**（overlay），**不能作为唯一内容**：

- ✅ 视频 + 角落数据标签（如 "80KG"）
- ✅ 数据图表 + 关键数据高亮
- ✅ 截图 + 红框/箭头标注
- ❌ 黑屏 + "让健身更简单"（即使文字再大）

### 4.4 强制要求

每个分镜在 `description` 中必须写清楚**实际视觉内容是什么**（不是文字在说什么，而是画面在展示什么）。Reviewer 看到 `description` 就要能想象出画面。

---

## 5. 字幕对齐规则

### 5.1 一一对应

**默认每个分镜对应 1 条字幕**。多对一/一对多需要明确理由：

| 关系 | 何时用 | 示例 |
|---|---|---|
| 1 镜头 : 1 字幕 | 默认 | 单条叙述 + 配图 |
| 1 镜头 : N 字幕 | 视频类镜头，N ≥ 1 | 演示 5s 视频，旁白说了 3 句 |
| N 镜头 : 1 字幕 | 复杂概念，文字一次说清但视觉要拆 | 拆解产品 3 个功能 = 3 个镜头共用 1 句旁白 |

### 5.2 对齐要求

- `voiceover` 字段记录对齐的字幕 ID
- 镜头 `start` / `end` 必须在所引用字幕的 `start` / `end` 范围内（或精确匹配）
- 视频镜头（duration > 5s）跨多条字幕时，`voiceover` 写 ID 列表（如 `"voiceover": [3, 4, 5]`）

### 5.3 静音段处理

如果分镜的 `start-end` 区间内没有字幕（静音/纯音效），仍然需要：

- 写明 `voiceover: null`
- `description` 中写"静音段" + 视觉内容
- 静音段时长建议 ≤ 1.5s（不要让画面空着太久）

---

## 6. 分镜 → Scene 组件的实现约定

### 6.1 一镜一组件

每个分镜对应一个 Scene 组件（在 `scenes/<主题>/components/` 下）：

```
remotion/src/scenes/workout_intro/
├── index.tsx              # Composition 入口
├── storyboard.md
├── storyboard.json
├── subtitles.json
└── components/
    ├── Shot01_HookVideo.tsx     # S01
    ├── Shot02_ChatDemo.tsx      # S02
    └── Shot03_DataViz.tsx       # S03
```

### 6.2 组件命名

`<Shot编号>_<分镜描述>.tsx`（PascalCase），与分镜 `description` 对应。

### 6.3 在 Composition 中组装

```tsx
// scenes/workout_intro/index.tsx
import { Shot01_HookVideo } from "./components/Shot01_HookVideo";
import { Shot02_ChatDemo } from "./components/Shot02_ChatDemo";

export const WorkoutIntro = () => {
  return (
    <>
      <Sequence from={0} durationInFrames={72}>      {/* S01: 0-2.4s @ 30fps = 72 帧 */}
        <Shot01_HookVideo />
      </Sequence>
      <Sequence from={63} durationInFrames={81}>      {/* S02: 2.1-4.8s（含 0.3s 转场） */}
        <Shot02_ChatDemo />
      </Sequence>
    </>
  );
};
```

### 6.4 命名与 `script.md` 联动

Scene 组件名反映**分镜内容**（不是 S01/S02 编号），与 `script.md` 第 1 节"场景命名必须根据内容自动命名"一致。

### 6.5 素材与 `assets.md` 联动

每个分镜的 `content_source` 字段会自动成为 `assets.md` 的一行。`assets.md` 输出时：
- 已有素材 → 自动复制到 `remotion/public/<主题>/`
- 缺失素材 → 列在"缺失"节，配 mmx prompt
- **视频素材必须包含"拍摄要求"**（5 维度：机位/光线/时长/动作/其他）—— 见 [assets.md 第 2.2 节](remotion/rules/assets.md)
- 实现 Scene 组件前，先查 `assets.md` 的"已就位"列表——只有素材就位才能 import

详见 [remotion/rules/assets.md](remotion/rules/assets.md)。

---

## 7. 速查清单（设计完一份分镜后自检——只列**本文件专属**项）

> **跨文件去重原则**：通用检查见 [checklist.md](remotion/rules/checklist.md)；本节只列**分镜设计阶段**的专属项。

- [ ] 输入是 `subtitles.json`（不是凭空写）
- [ ] 输出了 `storyboard.md` + `storyboard.json`（见第 1.3 节）
- [ ] 每个分镜字段完整：`shot_id` / `start` / `end` / `duration` / `content_type` / `content_source` / `voiceover` / `description`（见第 2 节）
- [ ] 视频类镜头 `duration > 5s`（见第 3.1 节）
- [ ] 图片类镜头 `duration` = 字幕时长或略长（见第 3.2 节）
- [ ] `start` 连续无空隙；总 `end` = 音频总时长（见第 3.4 节）
- [ ] 没有任何分镜的 `content_type` 是"纯色 + 文字"（见第 4 节）
- [ ] `description` 描述的是**画面在展示什么**（不是文字在说什么）
- [ ] 字幕对齐关系明确（1:1 / 1:N / N:1，见第 5 节）
- [ ] 已配套输出 `assets.md` 素材清单（详见 [assets.md](remotion/rules/assets.md) 第 2 节）

**其他维度的自检**（不在本文件）：
- 通用综合自检 → [checklist.md](remotion/rules/checklist.md) 第 2 节（master）
- 字幕完整性 → [subtitle.md](remotion/rules/subtitle.md) 第 6 节
- 场景命名 → [script.md](remotion/rules/script.md) 第 1 节
