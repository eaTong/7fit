# 字幕生成规范（remotion）

> 阶段：字幕（音频 → 时间线字幕）
> 适用场景：**根据语音自动转字幕**（用户提供音频文件 → 自动生成字幕）
> 来源：用户硬约束
> 状态：✅ 生效

> ⏰ **2026-06-04 强制**：字幕每条时长 = `字数 / 中速`，**必须**遵循 [timing-sync.md](./timing-sync.md) §0。
> 中速 = 主体字数 / 主体时长（默认 3.4 字/秒）。改中速 → 7 个文件同步（见 timing-sync.md §3）。

---

## 1. 字幕生成工作流

> **2026-06-04 流程变更**：字幕生成归 **Phase 3**（用户自录旁白后）。详见 [CLAUDE.md 视频制作总流程](../CLAUDE.md#视频制作总流程6-阶段--后期)。

用户提供音频文件后，**自动识别音频并按时间线生成字幕文件**：

### 1.1 输入

- 用户把音频文件放在 `resources/audios/<视频主题>.m4a`（**iPhone 语音备忘录默认格式，2026-06-05 起强制**）
- **不再接受** `.mp3` / `.wav` / 其他格式——重录而非转码
- 文件命名遵循视频主题，例如：`workout_intro.m4a`、`weekly_review.m4a`

### 1.2 识别工具

**使用 mmx（minimax）能力**做语音识别 + 时间戳对齐，**不要自己调用别的 ASR 服务**。

### 1.3 输出位置

字幕 JSON 放在视频入口文件的同级目录：

```
remotion/src/scenes/<视频主题>/
├── index.tsx              # 视频入口
└── subtitles.json         # 自动生成的字幕数据
```

> ⚠️ `subtitles.json` 是**派生文件**，可重建；不要在 git 中固化过期字幕（除非用户明确要求锁版）。

### 1.4 输出格式

每条字幕一个对象，按时间顺序排列：

```json
[
  {
    "id": 1,
    "start": 0.00,
    "end": 2.40,
    "segments": [
      { "text": "让", "highlight": false },
      { "text": "健身", "highlight": true },
      { "text": "更简单", "highlight": false }
    ]
  },
  {
    "id": 2,
    "start": 2.40,
    "end": 5.10,
    "segments": [
      { "text": "3 秒", "highlight": true },
      { "text": "记录一次搞定", "highlight": false }
    ]
  }
]
```

字段说明：
- `id`：从 1 开始递增
- `start` / `end`：秒（float，保留 2 位小数）
- `segments`：把同一时间窗内的文字拆成"普通段 + 重点段"，**重点内容必须打 `highlight: true`**

#### 1.4.1 🆕 段间停顿不放字幕（2026-06-04 用户硬约束）

> **核心**：copy.md 段落之间的 0.5-1s 段间停顿，**subtitles.json 里不放字幕条目**。
> 段间停顿期间字幕**不显示**（黑屏 / 空镜 / 转场），BGM ducking 解除。

```json
// ✅ 正确：段间停顿不放字幕
[
  { "id": 1, "start": 0.00, "end": 2.40, "segments": [...] },  // 钩子
  { "id": 2, "start": 3.10, "end": 5.10, "segments": [...] },  // 主体 1（中间 0.7s 是段间停顿，无字幕）
  { "id": 3, "start": 5.80, "end": 8.20, "segments": [...] },  // 主体 2
  ...
]

// ❌ 错误：段间停顿放空字幕条目
[
  { "id": 1, "start": 0.00, "end": 2.40, "segments": [...] },
  { "id": 2, "start": 2.40, "end": 3.10, "segments": [] },  // ← 段间停顿"占位条"
  { "id": 3, "start": 3.10, "end": 5.10, "segments": [...] },
  ...
]
```

> **为什么不放空字幕条**：空字幕条会让渲染器在该时段显示一个空白字幕框（闪一下），破坏节奏。
> 段间停顿由 [storyboard.md §4.5](storyboard.md) 的 `transition` shot 处理，subtitles.json 不参与。

### 1.5 重点内容识别

自动识别 + 人工复核，识别策略：

- **数字**：`80KG` / `10 次` / `3 秒` / `19 元` / `1 周`
- **动作词**：`深蹲` / `卧推` / `硬拉` / `记录` / `复盘`
- **品牌关键句**：`让健身更简单` / `AI 私教` / `周复盘`
- **CTA**：`立即体验` / `扫码加入` / `点这里`

识别后写回 `highlight: true`，供组件层做高亮样式。

---

## 2. 字幕与画面文字的分工

**有字幕时，视频主体区域**（标题安全区以下、字幕安全区以上的中间区域）**不允许出现太多文字**——避免信息冗余，让用户视线聚焦。

- 主体区域以**图/视频/动效/数据可视化**为主
- 必要的文字（如数据标签、关键词条）单场景 ≤ 6 个字
- 大段说明、定义、列表 → 让位给字幕，不在画面上重复
- 标题区（顶部 ≥120px 安全区下方）可以放主标题
- 字幕区（底部 1/3）专属于字幕

> 此条与 `script.md` 第 4 节联动：写脚本时就应避免主体区域塞长文字，把内容交给语音 + 字幕承载。

---

## 3. 字幕样式

### 3.1 字体

- **颜色**：纯白 `#FFFFFF`（不允许换色）
- **字重**：500-700（中等偏粗，保证移动端可读）
- **字号**：28-40px（1080×1920 画布，移动端显示清晰可读，**绝不能小于 28px**）
- **行高**：1.4-1.6
- **字体族**：使用系统默认无衬线（`-apple-system, "PingFang SC", "Microsoft YaHei", sans-serif`），保证 Android/iOS 都正常显示
- **阴影/描边**：建议加 `text-shadow: 0 2px 8px rgba(0,0,0,0.8)`，保证在亮色/复杂背景上仍可读

### 3.2 位置

- 字幕位于**画面底部 1/3 区域**
- 距底部 ≥ 80px（与 `script.md` 第 3 节安全区一致）
- 距左右各 ≥ 64px

### 3.3 重点内容高亮样式

`highlight: true` 的 segment 应用以下任一/全部样式与普通文字区分：

| 维度 | 普通段 | 重点段 |
|---|---|---|
| 颜色 | `#FFFFFF` | `#FF4500`（强调色） |
| 字重 | 500 | 700 |
| 字号 | 基准 | 基准 × 1.15 |
| 是否加粗 | 否 | 是 |
| 阴影 | 浅 | 略强（`0 0 8px rgba(255,69,0,0.5)`） |

```tsx
// ✅ 推荐
<span className="text-white text-3xl font-medium">让</span>
<span className="text-[#FF4500] text-[34px] font-bold drop-shadow-[0_0_8px_rgba(255,69,0,0.5)]">健身</span>
<span className="text-white text-3xl font-medium">更简单</span>
```

### 3.4 背景

字幕**不使用**大色块背景（与 `script.md` 第 2 节联动）。允许：
- 文字本身 + `text-shadow` 即可
- 极轻半透明胶囊（`bg-black/40 backdrop-blur-sm`），但**不强制**

---

## 4. 字幕动效：弹跳 + 重点跳动

每条字幕入场时应用**弹跳效果**（bounce / pop-in），增强节奏感与科技感。

### 4.1 入场动效

- **缓动**：使用 spring（`spring({ frame, fps, config: { damping: 8, stiffness: 200, mass: 0.5 })`）或 overshoot bezier
- **轨迹**：
  - `scale: 0.6 → 1.15 → 1.0`（小幅回弹）
  - 或 `translateY: 20px → -4px → 0`（轻浮起）
- **时长**：0.25-0.4s
- **同步**：整条字幕同时弹入（不是逐字）

### 4.2 重点 segment 跳动

`highlight: true` 的 segment 在普通弹跳之上**叠加一次小跳动**：

- 入场后 0.15-0.25s 触发
- `scale: 1.0 → 1.2 → 1.0`，spring damping 较低
- 强调"这个词很重要"

### 4.3 出场

- 简单淡出（opacity 1 → 0，0.15s），不弹跳
- 与下一条字幕入场之间留 ≥ 0.05s 间隔

### 4.4 实现代码骨架

```tsx
import { useCurrentFrame, spring, useVideoConfig, AbsoluteFill } from "remotion";

type Segment = { text: string; highlight: boolean };
type Subtitle = { id: number; start: number; end: number; segments: Segment[] };

export const Subtitle: React.FC<{ subs: Subtitle[] }> = ({ subs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const current = subs.find((s) => t >= s.start && t < s.end);
  if (!current) return null;

  const localFrame = frame - current.start * fps;
  const popIn = spring({
    frame: localFrame,
    fps,
    config: { damping: 8, stiffness: 200, mass: 0.5 },
  });

  return (
    <AbsoluteFill className="pointer-events-none">
      <div
        className="absolute bottom-24 left-16 right-16 text-center"
        style={{
          transform: `scale(${0.6 + popIn * 0.5})`,  // 0.6 → 1.1 → 1.0
          opacity: popIn,
        }}
      >
        {current.segments.map((seg, i) => (
          <span
            key={i}
            className={seg.highlight ? "text-[#FF4500] font-bold" : "text-white font-medium"}
            style={{
              fontSize: seg.highlight ? 38 : 33,
              textShadow: "0 2px 8px rgba(0,0,0,0.8)",
              marginRight: 6,
            }}
          >
            {seg.text}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};
```

---

## 5. 字幕与音频对齐

- 字幕 `start` / `end` 严格对应音频时间线（不偏移、不提前）
- 单条字幕时长推荐 1.5-4.0s（不要超过 5s，否则一条塞太多字）
- 单条字幕字符数 ≤ 24 字（中文按字计，英文按词计）
- 句末标点（句号/问号/感叹号）不出现在字幕文本里——字幕是"听的辅佐"，不是"读的原文"
- 数字、单位、专有名词按原样保留（如 `80KG`、`AI`）

---

## 6. 速查清单（只列**本文件专属**项）

> **跨文件去重原则**：通用检查见 [checklist.md](remotion/rules/checklist.md)；本节只列**字幕生成**的专属项。

- [ ] 音频文件放在 `resources/audios/`（见第 1.1 节）
- [ ] 用 mmx 识别 + 生成 `remotion/src/scenes/<主题>/subtitles.json`（见第 1.2-1.3 节）
- [ ] JSON 格式按规范（`id`/`start`/`end`/`segments` + `highlight`，见第 1.4 节）
- [ ] 重点内容已打 `highlight: true`（数字/动作/品牌句/CTA，见第 1.5 节）
- [ ] 字幕样式：纯白 `#FFFFFF` + 字号 ≥ 28px + `text-shadow`（见第 3.1 节）
- [ ] 重点 segment 用 `#FF4500` + 700 字重 + 1.15× 字号（见第 3.3 节）
- [ ] 入场用 spring 弹跳（0.25-0.4s），重点 segment 叠加二次跳动（见第 4.1-4.2 节）
- [ ] 主体区域不放长文字，让位给字幕（见第 2 节）
- [ ] 单条字幕 ≤ 24 字、≤ 4s（见第 5 节）

**其他维度的自检**（不在本文件）：
- 字幕安全区（位置/字号/颜色）→ [script.md](remotion/rules/script.md) 第 3 节
- 综合自检 → [checklist.md](remotion/rules/checklist.md) 第 2 节（master）
