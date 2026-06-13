# 分镜规范（storyboard.md）

> **Phase 4 核心产物**：按字幕设计分镜，**含场景转入转出动效**，输出 `storyboard.md`（人类可读）+ `storyboard.json`（结构化）。
>
> **必须遵循**：[timing-sync.md](../planning/timing-sync.md)（镜头时长）+ [subtitle.md](subtitle.md)（字幕对齐）+ [script.md §7 组件模板库](script.md#7-组件模板库7-类常用组件)（每个 shot 拆组件）
>
> **分镜哲学**：**1 镜 = 1 个观众感知单元**。每镜必须有**主体（视频/图片/动效）+ 字幕 + 转场标注**。严禁"纯字幕镜"或"纯色块镜"（详 §3 严禁清单）。

---

## 1 · 字段定义

每个分镜字段：

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `shot_id` | string | ✅ | 分镜 ID（snake_case）|
| `start` | number | ✅ | 开始时间（秒）|
| `end` | number | ✅ | 结束时间（秒）|
| `duration` | number | ✅ | 时长（秒）= end - start |
| `content_type` | string | ✅ | 类型：`video` / `image` / `text_card` / `pause_breath` / `broll` / `data_viz` |
| `content_source` | string | ✅ | 素材路径（`/public/<主题>/videos/<file>.mov`）|
| `voiceover` | string | ✅ | 该镜对应的旁白文本 |
| `description` | string | ✅ | 画面在展示**什么**（不是文字在说什么）|
| `transition_in` | string | ✅ | 入场转场（`fade` / `push_left` / `slide_up` / `pause_breath`）|
| `transition_out` | string | ✅ | 出场转场（同上）|
| `data_shot_id` | string | ✅ | DOM 属性值（snake_case）|
| `broll_tag` | string | ❌ | B-roll 标记（`建立场景` / `平滑转场` / `增添意义`），仅 `content_type='broll'` 时填 |
| `layout_state` | string | ❌ | **A 类专属**（2026-06-10 新增）：`talking_head`（口播态）/ `visual_support`（辅助素材态），混合类型不填 |

---

## 2 · 时长硬约束

| 镜头类型 | 时长规则 | 原因 |
|---|---|---|
| **视频类** | > 5s（打包多条字幕）| 视频切换太频繁观众反应不过来 |
| **图片类** | = 字幕时长（或略长 2-5s）| 与旁白同步 |
| **pause_breath** | 0.5-1s（用户硬约束）| 段间停顿 |
| **text_card** | = 字幕时长 | 卡片展示完才走 |
| **data_viz** | = 字幕时长 | 数据可视化完整呈现 |
| **broll** | 1-5s（按功能）| 见 §10 B-roll 镜头 |

> **时长来源**：必须从 [timing-sync.md](../planning/timing-sync.md) 推导，不可手填。

---

## 3 · 严禁清单

### 3.1 严禁"纯色背景 + 文字"镜头

每镜必须有**实内容**：
- 视频 / 图片
- 动画 / 数据可视化
- 屏幕录制 / 复合层

### 3.2 严禁"纯字幕展示"镜头（2026-06-06）

字幕必须有**背景素材**（视频/图片/动画/复合层），**不能**让字幕成为 shot 的唯一内容。

### 3.3 严禁 pause_breath 切换其他素材

`pause_breath` shot 必须延长**上一个视频**的播放时间（0.8× 慢动作 / 1.2× 加速 / 特写 / freeze frame），**禁止**：
- 切换其他素材
- 显示纯字幕
- 显示装饰元素

---

## 4 · 转场标注硬约束

> **每个 shot 边界都要标 `transition_in` / `transition_out`**。

| 转场 | 时长 | 适用场景 | ease |
|---|---|---|---|
| `fade` | 0.4s | 通用，柔和 | `power2.inOut` |
| `push_left` / `push_right` | 0.4s | 时间推进感 | `power2.inOut` |
| `slide_up` / `slide_down` | 0.4s | 新段落开始 | `power2.out` |
| `pause_breath` | 0.5-1s | 段间停顿 | 见 [script.md §5.2](script.md#52-pause_breath-4-种实现) |
| `zoom` | 0.5s | 强调重点 | `back.out(1.7)` |
| ❌ flip / 旋转 / 3D | — | 与"力量感"调性冲突 | — |

> GSAP 实现见 [animation.md §3 转场](animation.md#3--转场动画)。

### 4.1 转场选型决策树

```
新段落开始？
├─ 是 → slide_up / slide_down（0.4s）
├─ 否，时间推进 → push_left / push_right（0.4s）
├─ 否，主题延续 → fade（0.4s）
├─ 是段间停顿 → pause_breath（0.5-1s，4 选 1）
└─ 需要强调重点 → zoom（0.5s）
```

### 4.2 A 类视频转场适配方案（v4.2 新增）

> **A 类视频转场核心**：**柔和 + 双态切换**——转场风格偏柔和（fade / slide_up），加上双态切换（0.5s power2.inOut）。

| 转场位置 | 转场类型 | 时长 | ease | 说明 |
|---|---|---|---|---|
| 钩子段 → 段1 | `fade` | 0.4s | `power2.inOut` | 柔和过渡 |
| 段1 → 段2（双态切换）| `double_state_switch` | 0.5s | `power2.inOut` | 视频缩小+辅助内容入场 |
| 段间停顿 | `pause_breath` | 0.5-1s | 4 选 1 | 0.8× 慢动作 / 1.2× 加速 / 特写 / freeze frame |
| 段2 → 段3 | `fade` | 0.4s | `power2.inOut` | 柔和过渡 |
| 收尾段 | `fade` | 1s | `power2.inOut` | 1s 沉淀 |

#### 4.2.1 A 类双态切换转场（专属）
> 详见 [animation.md §12 A 类双态切换动效](../production/animation.md#12--a-类双态切换动效2026-06-10-新增)。

```js
// 全屏态 → 左右分栏态（0.5s, power2.inOut）
gsap.to('.talking-head', {
  left: 0, top: 260, width: 574, height: 574,
  duration: 0.5, ease: 'power2.inOut'
})

// 同时：辅助素材入场
gsap.from('.visual-support__frame', {
  x: 80, opacity: 0, scale: 0.92,
  duration: 0.4, ease: 'power2.out'
}, '<+=0.1')  // 视频缩小后 0.1s 辅助素材接续入场
```

### 4.3 B 类视频转场适配方案（v4.2 新增）

> **B 类视频转场核心**：**紧凑 + 强调**——转场风格偏紧凑（push_left / zoom），强调重点动作。

| 转场位置 | 转场类型 | 时长 | ease | 说明 |
|---|---|---|---|---|---|
| 钩子段 → 自测段 | `push_left` | 0.4s | `power2.inOut` | 时间推进感 |
| 自测段 → 动作段 | `pause_breath` | 0.5-1s | 4 选 1 | 段间停顿 |
| 动作段之间 | `zoom` | 0.5s | `back.out(1.7)` | 强调重点动作 |
| 动作段 → 收尾段 | `push_left` | 0.4s | `power2.inOut` | 时间推进感 |
| 收尾段 | `fade` | 1s | `power2.inOut` | 1s 沉淀 |

#### 4.3.1 B 类动作段之间转场（zoom 强调）
```js
// 动作段之间：zoom（0.5s, back.out(1.7)）
gsap.fromTo('.action-highlight',
  { scale: 1 },
  { scale: 1.3, duration: 0.5, ease: 'back.out(1.7)' }
)
```

### 4.4 转场时长与 ease 选型规范

| 转场类型 | 时长 | ease | 适用场景 |
|---|---|---|---|
| **通用转场**（fade / push / slide）| 0.4s | `power2.inOut` | 大部分场景 |
| **强调转场**（zoom）| 0.5s | `back.out(1.7)` | 重点动作 / 关键数据 |
| **段间停顿**（pause_breath）| 0.5-1s | 4 选 1 | 段间消化 |
| **双态切换**（A 类专属）| 0.5s | `power2.inOut` | A 类双态切换 |
| **收尾沉淀**（fade）| 1s | `power2.inOut` | 收尾段 |

> **铁律**：转场时长 ≥ 0.3s，否则观众反应不过来（详 [animation.md §4.2 转场时长约束](../production/animation.md#42-转场时长约束)）。

---

## 5 · description 写法

**描述的是画面在展示什么，不是文字在说什么。**

| ❌ 错误 | ✅ 正确 |
|---|---|
| "讲翼状肩的危害" | "肩胛骨特写镜头，演示翼状肩形态" |
| "说训练方法" | "靠墙天使动作演示 × 4 次" |
| "强调 10 分钟" | "右上角卡片显示 '10 min'，配橙色 1.15× 弹跳动效" |

### 5.1 description 5 要素模板

每条 description 必含以下 5 类信息：

| # | 要素 | 例 |
|---|---|---|
| 1 | **主体** | 人物特写 / 物体 / 卡片 |
| 2 | **动作 / 状态** | 演示、旋转、滚动 |
| 3 | **位置** | 顶部居左 / 右上角 / 中央 |
| 4 | **辅助元素** | 卡片、字幕、装饰 |
| 5 | **动效标注**（如有）| 1.15× 弹跳、慢动作 |

**反例**（缺要素）：
- ❌ "展示训练方法"（缺 1-5）
- ❌ "上半身特写"（只有 1，缺其他）

---

## 6 · 字幕对齐关系

| 镜头类型 | 字幕对应 | 说明 |
|---|---|---|
| **视频类** | 1 : N（一镜对多条字幕）| 视频持续时间长，旁白推进 |
| **图片类** | 1 : 1 | 与字幕同进同出 |
| **text_card** | 1 : 1 | 卡片文字 = 字幕 |
| **pause_breath** | 0 : 0 | 段间停顿，无字幕 |
| **broll** | 1 : 0 或 0 : 0 | B-roll 镜头可无字幕 |
| **data_viz** | 1 : 1 | 数据展示 = 字幕 |

> 详见 [subtitle.md §6 时长校验](subtitle.md#6--时长校验公式)。

---

## 7 · 每镜一组件（`components/Shot<N>_<描述>.html`）

```
components/
├── Shot0_Hook.html              # 钩子
├── Shot1_SelfTest_1.html        # 自测第 1 步
├── Shot1_SelfTest_2.html        # 自测第 2 步
├── Shot1_SelfTest_3.html        # 自测第 3 步
├── Shot2_Action_WallAngel.html  # 动作 1：靠墙天使
├── Shot2_Action_YTW.html        # 动作 2：俯身 Y-T-W
├── Shot3_PauseBreath.html       # 段间停顿
├── Shot4_Outro_CTA.html         # 收尾 CTA
```

**命名规范**：
- PascalCase（与 `shot_id` snake_case 区分）
- `<N>_<段主题>_<描述>.html`

> 组件模板见 [script.md §7 组件模板库](script.md#7-组件模板库7-类常用组件)。

---

## 8 · storyboard.md 模板

```markdown
# <主题> · 分镜表

> **视频类型**：A / B / C
> **总时长**：65.4s（按 timing-sync.md）
> **BGM**：Power Build（tech house, 105 BPM）
> **画布**：1080×1920 竖屏

## Shot 列表

| # | shot_id | start | end | dur | 类型 | 素材 | 转场入 | 转场出 |
|---|---|---|---|---|---|---|---|---|
| 0 | hook_question | 0.0 | 3.0 | 3.0 | text_card | self_test.png | fade | push_left |
| 1 | self_test_1 | 3.5 | 9.5 | 6.0 | video | 自测_01.mov | push_left | pause_breath |
| 2 | pause_breath_1 | 9.0 | 9.7 | 0.7 | pause_breath | (上镜 0.8× 慢动作) | pause_breath | fade |
| 3 | self_test_2 | 9.7 | 16.5 | 6.8 | video | 自测_02.mov | fade | push_left |
| ... |

## 详细描述

### Shot 0 · hook_question
- **画面**：纯黑底 + 大字幕 "你以为靠墙就能改翼状肩？"
- **字幕**：highlight 全段，橙色 1.15×
- **动效**：文字从 0 弹跳入场（back.out 1.7）
- **BGM**：第 0s 淡入

### Shot 1 · self_test_1
- **画面**：上半身侧面特写，演示翼状肩形态
- **字幕**：白色，底部居中
- **转场**：左推（push_left, 0.4s）
```

---

## 9 · storyboard.json 模板

```json
{
  "id": "winged_scapula_b3",
  "duration": 65.4,
  "canvas": { "width": 1080, "height": 1920, "fps": 30 },
  "bgm": { "type": "power_build", "volume_db": -8 },
  "shots": [
    {
      "shot_id": "hook_question",
      "data_shot_id": "hook_question",
      "start": 0.0,
      "end": 3.0,
      "duration": 3.0,
      "content_type": "text_card",
      "content_source": "/public/winged_scapula_b3/images/self_test.png",
      "voiceover": "你以为靠墙就能改翼状肩？",
      "description": "纯黑底 + 大字幕",
      "transition_in": "fade",
      "transition_out": "push_left"
    }
  ]
}
```

---

## 10 · B-roll 镜头（辅助镜头）

> 2026-06-08 新增。A-roll 之外的一切辅助镜头，三大功能：

| 功能 | 描述 | 时长 | broll_tag |
|---|---|---|---|
| **建立场景** | 健身房 / 公园 / 办公室等空镜 | 2-3s | `建立场景` |
| **平滑转场** | 切主题前的过渡镜头 | 1-2s | `平滑转场` |
| **增添意义** | 数据可视化 / 屏幕录制 / 抽象动效 | 2-5s | `增添意义` |

**`description` 必含** `B-roll: <功能>` 标记。

例：
- "健身房空镜，远景 4 秒" → B-roll: 建立场景
- "训练数据飞入卡片" → B-roll: 增添意义
- "街跑脚步特写" → B-roll: 平滑转场

### 10.1 B-roll 与 A-roll 的关系

| 维度 | A-roll（主镜）| B-roll（辅镜）|
|---|---|---|
| 数量 | ≥ 70% | ≤ 30% |
| 是否带旁白 | ✅ 必带 | ❌ 可不带 |
| 时长 | 3-8s | 1-5s |
| content_type | `video` / `image` / `text_card` | `broll` |

---

## 11 · 4 类段落分镜模板

> **钩子段 / 自测段 / 动作段 / 收尾段**——4 类段落的分镜模板。

### 11.1 钩子段（0-3s）

**目标**：3 秒抓人。

| 字段 | 取值 |
|---|---|
| content_type | `text_card` 或 `video`（短） |
| 时长 | **固定 3s**（抖音硬约束）|
| transition_in | `fade` |
| transition_out | `push_left` / `slide_up`（节奏紧）|
| description | "**纯黑底 + 大字幕** `<钩子句>`，highlight 全段 + 1.15× 弹跳" |
| 字幕条数 | 1 条（钩子句本身）|

**示例**：

```json
{
  "shot_id": "hook_question",
  "start": 0.0, "end": 3.0, "duration": 3.0,
  "content_type": "text_card",
  "content_source": "/public/winged_scapula_b3/images/hook_bg.png",
  "voiceover": "你以为靠墙就能改翼状肩？",
  "description": "纯黑底 + 大字幕 '你以为靠墙就能改翼状肩？'，highlight 全段 + 1.15× 弹跳",
  "transition_in": "fade",
  "transition_out": "push_left"
}
```

### 11.2 自测段（每步 5-7s）

**目标**：让观众跟着做。

| 字段 | 取值 |
|---|---|
| content_type | `video`（必须）|
| 时长 | 5-7s/步（1 镜对多字幕 1:N）|
| transition_in | `push_left` / `fade` |
| transition_out | `pause_breath`（必带 0.5-1s）|
| description | "**演示动作**（上半身 / 侧面 / 背面）"<步号>"：<动作>，<观察点>特写" |
| 字幕条数 | 2-3 条（指令+观察）|

**示例**：

```json
{
  "shot_id": "self_test_1",
  "start": 3.5, "end": 9.5, "duration": 6.0,
  "content_type": "video",
  "content_source": "/public/winged_scapula_b3/videos/自测_01.mov",
  "voiceover": "背对镜子站好，肩膀放松手垂下来。肩胛骨内侧明显突出，就是翼状。",
  "description": "上半身背面特写，演示自测第 1 步：自然站姿 + 肩胛骨特写镜头",
  "transition_in": "push_left",
  "transition_out": "pause_breath"
}
```

### 11.3 动作段（每动作 5-8s）

**目标**：让观众跟着练。

| 字段 | 取值 |
|---|---|
| content_type | `video`（必须）|
| 时长 | 5-8s/动作（1 镜对多字幕 1:N）|
| transition_in | `pause_breath`（接自测）|
| transition_out | `pause_breath`（动作间）|
| description | "动作 <N>：<动作名>，<肌群>激活，<次数/组数>右上角卡片 + 1.15× 弹跳" |
| 字幕条数 | 3-4 条（动作名+要点+参数）|

**示例**：

```json
{
  "shot_id": "action_wall_angel",
  "start": 10.2, "end": 16.5, "duration": 6.3,
  "content_type": "video",
  "content_source": "/public/winged_scapula_b3/videos/壁虎推墙.mov",
  "voiceover": "第一个，壁虎推墙。前臂贴墙往上滑，肩胛骨要往下沉。12 次 3 组。",
  "description": "上半身侧面，动作 1：壁虎推墙，前锯肌激活。右上角 '12 次 × 3 组' 卡片 + 1.15× 弹跳",
  "transition_in": "pause_breath",
  "transition_out": "pause_breath"
}
```

### 11.4 收尾段（最后 7s）

**目标**：CTA + 行动号召。

| 字段 | 取值 |
|---|---|
| content_type | `text_card` / `image` |
| 时长 | 固定 7s |
| transition_in | `fade`（1s 沉淀）|
| transition_out | `fade`（黑屏淡出）|
| description | "**总结 + CTA**：<核心信息> + '<CTA 句>'，配 1.15× 弹跳" |
| 字幕条数 | 2-3 条（总结+CTA+安全提示）|

**示例**：

```json
{
  "shot_id": "outro_cta",
  "start": 58.0, "end": 65.0, "duration": 7.0,
  "content_type": "text_card",
  "content_source": "/public/winged_scapula_b3/images/outro.png",
  "voiceover": "这 4 个动作，每天 10 分钟就够。去试试，评论区交作业。",
  "description": "黑色背景 + '去试试，评论区交作业' 大字幕 + 评论图标卡片，1.15× 弹跳",
  "transition_in": "fade",
  "transition_out": "fade"
}
```

---

## 12 · A/B/C 三类视频的分镜差异化

| 维度 | A 人设 | B 知识 | C 产品 |
|---|---|---|---|
| **总镜数** | 8-12 | **12-18** | 10-15 |
| **单镜时长** | 5-8s | 3-6s | 4-7s |
| **视频镜占比** | 60%（口播态 50% + 辅助素材态 50%）| **80%+** | 40% |
| **卡片镜占比** | 20% | 50% | **70%** |
| **text_card 镜占比** | 20% | 10% | 30% |
| **B-roll 镜占比** | ≤ 20% | ≤ 30% | ≤ 20% |
| **转场风格** | 柔和（fade / slide_up）+ **双态切换 0.5s** | 紧凑（push_left / zoom）| 快切（fade / push）|
| **pause_breath 位置** | 主体中段 × 2-3 | **每动作后 × 4-6** | 主体末段 × 2-4 |
| **钩子段类型** | **talking_head**（人脸 + 大字幕）| **text_card**（大字钩子）| text_card（功能截图）|
| **收尾段类型** | **talking_head**（人脸 + 评论图标）| text_card + 评论图标 | **text_card + 二维码** |

### 12.1 A 类分镜骨架（v3 · 2026-06-10 双态重写）

> **A 类是唯一有"双态"标记的类型**——每个 shot 都必须填 `layout_state` 字段（`talking_head` 或 `visual_support`）。
>
> 双态 = 一段视频双用：口播态全屏，辅助素材态缩小到右下角圆头像。**主口播视频不停止播放**。

```
钩子 (3s, talking_head)        ← layout_state: talking_head（人脸全屏 + 大字幕）
→ 段 1 (5-8s, talking_head)    ← layout_state: talking_head（人脸 + 字幕"为什么"）
→ 段 2 (5-8s, visual_support)  ← layout_state: visual_support（圆头像右下 + 录屏飘右上）
→ pause_breath (0.7s)          ← 上一镜 0.8× 慢动作
→ 段 3 (5-8s, visual_support)  ← layout_state: visual_support（圆头像 + 数据卡片飘左上）
→ 段 4 (5-8s, talking_head)    ← layout_state: talking_head（人脸 + 反思）
→ pause_breath (0.7s)          ← 上一镜 0.8× 慢动作
→ 段 5 (5-8s, visual_support)  ← layout_state: visual_support（圆头像 + 总结图表飘右上）
→ 收尾 (7s, talking_head)      ← layout_state: talking_head（人脸 + CTA）
```

**示例分镜（v3 格式）**：

```json
{
  "shot_id": "talking_head_1",
  "data_shot_id": "talking_head_1",
  "start": 3.5,
  "end": 9.0,
  "duration": 5.5,
  "content_type": "video",
  "content_source": "/public/a1_vibe_coding_pipeline/videos/001_talking_head.mp4",
  "voiceover": "我一个人做出小程序 + 自动剪辑视频，靠的是 4 个 AI 工具。",
  "description": "口播态：上半身特写，用户边说边用手势强调'4'。右下角无圆头像（主屏就是人脸）。",
  "transition_in": "fade",
  "transition_out": "fade",
  "layout_state": "talking_head"
}
```

```json
{
  "shot_id": "visual_support_1",
  "data_shot_id": "visual_support_1",
  "start": 9.0,
  "end": 14.5,
  "duration": 5.5,
  "content_type": "video",
  "content_source": "/public/a1_vibe_coding_pipeline/videos/002_cursor_screen_recording.mp4",
  "voiceover": "看这个 Cursor，左边是 PRD，右边 Claude 直接出代码，diff 一目了然。",
  "description": "辅助素材态：用户人脸缩到右下角 240px 圆头像（持续口型），Cursor 录屏飘在右上角 60% 宽。",
  "transition_in": "fade",
  "transition_out": "pause_breath",
  "layout_state": "visual_support",
  "pict_in_pict": {
    "position": "bottom-right",
    "size": 240,
    "shape": "circle",
    "video_source": "/public/a1_vibe_coding_pipeline/videos/001_talking_head.mp4"
  },
  "visual_support": {
    "position": "top-right",
    "type": "screen_recording",
    "width": "60%"
  }
}
```

### 12.2 B 类分镜骨架

```
钩子 (3s, text_card)
→ 自测 1-2 (5-7s, video + 字幕 1:N)
→ 段间停顿 (zoom)
→ 动作 1-4 (5-8s, video + 卡片 1:N)
→ 段间停顿 (zoom) × 3
→ 收尾 (7s, text_card + CTA)
```

### 12.3 C 类分镜骨架

```
钩子 (3s, text_card 截图)
→ 功能 1-3 (4-7s, 卡片 + 操作视频 B-roll)
→ 收尾 (7s, text_card + 二维码)
```

---

## 13 · 5 维评分卡 + 评审 SOP

> **每维 ≥ 3 分才能进入用户审阅**，总分 ≥ 18/25。

### 13.1 评分卡

| 维度 | 1 分（差）| 3 分（中）| 5 分（优）| 本稿得分 |
|---|---|---|---|---|
| **镜数合理性** | 镜数过多（>20）/ 过少（<6）| 镜数在 12-18 | 镜数合理 + 4 类段配比合适 | — |
| **转场标注** | < 50% shot 有标注 | ≥ 80% 标注 | 100% 标注 + 转场类型多样 | — |
| **description 准确性** | 写"讲什么" | 5 要素缺 1-2 | 5 要素齐全 + 动效标注 | — |
| **时长匹配** | 视频 < 5s / 图片 ≠ 字幕时长 | 全部匹配 | 全部匹配 + 0.3s 余量 | — |
| **B-roll 标记** | 没用 B-roll 标签 | B-roll 镜 < 30% | B-roll 镜 ≤ 30% + 3 类功能齐全 | — |

### 13.2 评审 SOP

```
1. 自评（5 维打分）→ ≥ 18 分才能提交
   ↓
2. 字段完整性检查（storyboard.md + storyboard.json 字段 1:1 对应）
   ↓
3. 镜数核对（按 12.x 骨架）
   ↓
4. 启动 Studio 全屏过 3 遍（首屏 / 末屏 / 随机 5 镜）
   ↓
5. 用户审阅 → 通过 / 改稿
```

---

## 14 · 反模式

- ❌ 纯色背景 + 文字镜头（"这不叫视频，叫 PPT"）
- ❌ 纯字幕展示镜头（字幕必须有背景素材）
- ❌ 视频类镜头 < 5s（切换太频繁观众反应不过来）
- ❌ 图片类镜头 ≠ 字幕时长（不同步）
- ❌ `pause_breath` 切换其他素材（破坏消化节奏）
- ❌ 转场没标 `transition_in` / `transition_out`（下游 scene.js 写不出来）
- ❌ `description` 写"讲什么"而不是"展示什么"
- ❌ 字幕对应关系错乱（视频镜 1:N 写成了 1:1）
- ❌ components 文件用 snake_case（应 PascalCase）
- ❌ `data_shot_id` 用 PascalCase（应 snake_case，与 DOM 选择器友好）
- ❌ 不用 B-roll 标签，scene.js 不知道这是辅助镜头
- ❌ **description 缺 5 要素**（主体/动作/位置/辅元素/动效）
- ❌ **video 镜 1:1 配字幕**（视频镜必须 1:N，对应多条字幕）
- ❌ **text_card 镜时长 ≠ 字幕时长**（卡片没看完就走）
- ❌ **跳过 5 维评分卡直接给用户**
- ❌ **镜数 > 20 镜**（切换疲劳，详 §12 A/B/C 对照表）
- ❌ **钩子段 > 3s**（违反抖音硬约束）
- ❌ **收尾段 < 5s**（CTA 没时间消化）
- ❌ **B-roll 镜占比 > 30%**（喧宾夺主）
- ❌ **混合类型（A+B）不区分主体镜/辅助镜**（详 video-types.md §混合类型）

---

## 附录 A · 速查索引

| 我想... | 看... |
|---|---|
| 写一个分镜字段 | [§1 字段定义](#1-字段定义) |
| 控制时长 | [§2 时长硬约束](#2-时长硬约束) |
| 选转场 | [§4 转场标注硬约束](#4-转场标注硬约束) |
| 写 description | [§5 description 写法](#5-description-写法) |
| 套模板 | [§8 storyboard.md 模板](#8-storyboardmd-模板) / [§9 storyboard.json 模板](#9-storyboardjson-模板) |
| 写 B-roll | [§10 B-roll 镜头](#10-b-roll-镜头辅助镜头) |
| 按段落分镜 | [§11 4 类段落分镜模板](#11-4-类段落分镜模板) |
| 按视频类型差异化 | [§12 A/B/C 三类视频的分镜差异化](#12-abc-三类视频的分镜差异化) |
| 跑 5 维评分 | [§13 5 维评分卡 + 评审 SOP](#13-5-维评分卡--评审-sop) |

---

## 附录 B · 变更日志

### v2（2026-06-09）— 深化拓展

- **新增 §4.1 转场选型决策树**：5 类场景→转场映射
- **新增 §5.1 description 5 要素模板**：主体/动作/位置/辅元素/动效
- **新增 §10.1 B-roll 与 A-roll 关系表**：数量/旁白/时长/类型 4 维对照
- **新增 §11 4 类段落分镜模板**：钩子段/自测段/动作段/收尾段——每类含字段表 + JSON 示例
- **新增 §12 A/B/C 三类视频的分镜差异化**：5 维对照表 + 3 类分镜骨架
- **新增 §13 5 维评分卡 + 评审 SOP**：总分 ≥ 18 才能进用户审阅
- **新增附录 A 速查索引** + **附录 B 变更日志**
- **§1 字段表新增 `broll_tag` 字段**
- **§14 反模式从 12 条扩到 19 条**
- **保留不变**：§1 字段定义 + §2 时长硬约束 + §3 严禁清单 + §6 字幕对齐 + §7 每镜一组件 + §8/9 模板 + §10 B-roll + §11 description

### v1（2026-06-08）— 初版

- 字段定义 + 时长硬约束 + 严禁清单 + 转场标注 + description + 字幕对齐
- 每镜一组件 + md/json 模板 + B-roll 镜头
- 由 winged_scapula_b3 实战沉淀
