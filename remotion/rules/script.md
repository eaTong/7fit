# 脚本生成规范（remotion）

> 阶段：脚本 / 分镜
> 来源：用户硬约束 + 项目品牌锁版
> 状态：✅ 生效
> **视频类型**：开工前先确定属于 3 类中的哪一类（A 个人人设 / B 健身知识 / C 七练介绍），详见 `video-types.md`

---

## 1. 入口与场景命名

**每个脚本一个单独的入口**，不允许把多个视频塞到同一个 Composition 里。

- 入口文件命名：`<主题>.tsx`（如 `workout_intro.tsx`、`weekly_review.tsx`）
- 入口位置：`remotion/src/scenes/`
- 每个入口文件负责一个完整视频的 Composition 定义
- 在 `remotion/src/Root.tsx` 中按主题注册

**场景（Scene / Sequence）命名必须根据脚本内容自动命名**，禁止使用 `Scene1/Scene2` 或 `intro/body/outro` 这种通用占位名。命名应反映**该段在讲什么**：

```tsx
// ✅ 正确
<Sequence from={0} durationInFrames={90}>
  <HookQuestion />     {/* 钩子问题 */}
</Sequence>
<Sequence from={90} durationInFrames={120}>
  <ThreeSecRecord />   {/* 3秒记录演示 */}
</Sequence>
<Sequence from={210} durationInFrames={60}>
  <WeeklySummaryCTA /> {/* 周报CTA */}
</Sequence>

// ❌ 错误
<Sequence from={0} durationInFrames={90}>
  <Scene1 />
</Sequence>
<Sequence from={90} durationInFrames={120}>
  <Scene2 />
</Sequence>
```

---

## 2. 视觉遮挡禁令

**禁止使用大面积纯色块遮挡**画面（例如满屏黑底+居中文字、满屏色块+单行白字）。

- 字幕/标题的背景只能是**细长条/胶囊/半透明渐变**，绝不能是覆盖整个画面宽度的大色块
- 如果画面本身是实拍视频/图片素材，禁止叠全屏色块去"美化"
- 需要分区时使用**轻微的渐变、阴影、模糊或细描边**来区分层次

```tsx
// ✅ 字幕条：底部细长半透明胶囊
<div className="absolute bottom-12 left-12 right-12 bg-black/60 backdrop-blur-sm rounded-2xl px-6 py-3">
  <span className="text-white">3 秒记录，一次搞定</span>
</div>

// ❌ 禁止
<div className="absolute inset-0 bg-black">
  <span className="text-white text-3xl">3 秒记录，一次搞定</span>
</div>
```

---

## 3. 字幕安全区

字幕需要留出足够的安全区（适配不同手机/平台 UI 遮挡）：

| 方向 | 最小安全区 | 推荐值 |
|---|---|---|
| 左边 | ≥ 64px | 96px |
| 右边 | ≥ 64px | 96px |
| 下面 | ≥ 80px | 120px（避开点赞/进度条） |

- 字幕文本宽度 = 画布宽度 − 左边距 − 右边距
- 字幕应**单行优先**，超出宽度才换行；最多 2 行
- 字体大小：18-28px（1080×1920 画布），行高 1.4-1.6
- 默认在视频底部 1/3 区域内，不允许贴着画面边缘

---

## 4. 顶部标题与"摄像头安全区"

视频**顶部必须有标题**，标题区需要留出足够安全区——这部分画布在某些平台（尤其手机摄像头拍摄/AR 场景）会被遮挡。

- 顶部安全区：≥ 120px（推荐 160px）
- 标题位于安全区**下方**，不要把标题压在顶部 120px 内
- 标题字号：32-48px（1080×1920 画布）
- 标题字重：bold / 700+
- 标题**居左对齐**（中文阅读习惯），距离左边 64-96px
- 标题区与画面主体之间留 ≥ 24px 间距

```tsx
// ✅ 正确
<div className="absolute top-[160px] left-[96px] right-[96px]">
  <h1 className="text-white text-4xl font-bold">让健身更简单</h1>
</div>

// ❌ 错误
<div className="absolute top-4 left-4 right-4">
  <h1 className="text-white text-4xl font-bold">让健身更简单</h1>
</div>
```

---

## 5. 配色：使用小程序主色

所有元素设计以**小程序配色**为主色（不要自己造一套新色）：

| 用途 | 色值 | Tailwind |
|---|---|---|
| 画布背景（页面/Scene 底层） | `#0A0A0A`（深黑）| `bg-[#0A0A0A]` |
| 强调色 1 | `#FF4500`（烈焰橙）| `text-[#FF4500]` / `bg-[#FF4500]` |
| 强调色 2 | `#DC143C`（电红）| `text-[#DC143C]` / `bg-[#DC143C]` |
| 文字主色 | `#FFFFFF`（纯白）| `text-white` |
| 文字次色 | `#888888` | `text-[#888888]` |
| 边框色 | `#333333` | `border-[#333333]` |

> ⚠️ 旧的"背景次色 `#1A1A1A` / 背景三级 `#252525`"**已废弃**——不要在元素背景上使用纯色暗灰/纯白，详见第 5.1 节。

**规则补充**：

- **标题使用纯白色**（`#FFFFFF`），不要给标题加渐变/描边/阴影
- 强调色只用于**关键数据、CTA 按钮、关键动作词**，不能大面积铺
- 文字默认纯白
- 不允许引入与小程序色板冲突的新颜色

### 5.1 元素背景：半透明 + 彩色（硬约束）

**所有"非画布"的元素背景**（卡片、面板、chip、tag、toast、按钮、素材框、装饰块等）**禁止使用纯色填充**，必须满足：

1. **半透明**——用 Tailwind 透明度语法（`/10` `/15` `/20` `/30` 等）
2. **彩色**——色相要鲜明（不是灰、不是黑、不是白）
3. **色源限定**——只能用**强调色 1 `#FF4500`** 或 **强调色 2 `#DC143C`** 叠加透明度（**不能**用 `#1A1A1A`/`#252525`/`#FFFFFF` 等中性色做元素背景）

```tsx
// ✅ 元素背景：半透明彩色（橙系 / 红系）
<div className="bg-[#FF4500]/15 border border-[#FF4500]/40">     {/* 橙色调强调态 */}
  <p className="text-white">3 秒记录</p>
</div>

<div className="bg-[#DC143C]/20 border border-[#DC143C]/50">     {/* 红色调警示态 */}
  <p className="text-white">疲劳预警</p>
</div>

<div className="bg-[#FF4500]/10 border border-[#FF4500]/30">     {/* 浅橙 弱强调 */}
  <p className="text-white">动作提示</p>
</div>

// ❌ 元素背景：纯色暗灰（已废弃）
<div className="bg-[#1A1A1A] border border-[#333333]">

// ❌ 元素背景：纯色白（也禁用）
<div className="bg-white">

// ❌ 元素背景：纯色暗（任意色都禁用纯色填充）
<div className="bg-[#252525]">
```

**透明度档位**（按视觉权重选择）：

| 用途 | 推荐透明度 | 视觉 |
|---|---|---|
| 弱装饰/背景层 | `/5` `/10` | 极淡，几近不可见，只起"色温"作用 |
| 普通 chip/tag | `/15` `/20` | 能感知到色相，不抢戏 |
| 强调态/CTA | `/25` `/30` | 明显的色块，焦点引导 |
| 警示态/错误态 | `/30` `/40` | 强烈的色彩信号 |

**典型元素背景组合**：

| 元素 | 推荐组合 |
|---|---|
| 普通卡片 | `bg-[#FF4500]/10` + `border-[#FF4500]/30` |
| 强调数据卡 | `bg-[#FF4500]/20` + `border-[#FF4500]/50` + `shadow` |
| 警示/错误 | `bg-[#DC143C]/25` + `border-[#DC143C]/50` |
| 装饰底纹 | `bg-[#FF4500]/5`（仅色温） |
| 按钮（默认） | `bg-[#FF4500]/85` + `text-white`（接近实色，但允许少量透明） |
| 按钮（次要） | `bg-[#FF4500]/15` + `border-[#FF4500]/40` + `text-[#FF4500]` |

> 唯一允许"接近实色"的元素是**主 CTA 按钮**（`/85` 左右）——因为可点击性需要视觉锚定。其余所有元素保持半透明。

### 5.2 文字/边框的色源不受影响

- 文字仍可纯白 `#FFFFFF`
- 边框可用纯色（`#FF4500` / `#DC143C` / `#333333`），不需要叠加透明度
- 阴影可使用色相 + 透明度（如 `shadow-[0_0_24px_rgba(255,69,0,0.4)]`）

---

## 6. 速查清单（写完一个脚本后自检——只列**本文件专属**项）

> **跨文件去重原则**：通用检查（音频/字幕/分镜/素材/自检）见 [checklist.md](remotion/rules/checklist.md)；本节只列**脚本实现阶段**的专属项。

- [ ] 每个脚本一个独立入口文件（见第 1 节）
- [ ] Sequence/Scene 名字反映内容，不是 Scene1/2/3（见第 1 节）
- [ ] 没有任何全屏纯色块遮挡（见第 2 节）
- [ ] 顶部标题区有 ≥120px 顶部安全区（见第 4 节）
- [ ] 元素具备科技感 + 力量感（见第 7 节）
- [ ] 场景之间有 ≥0.3s 转场，缓动 Standard（见第 8 节）
- [ ] 元素背景 = 半透明彩色（橙/红 + 透明度），不用纯色暗灰/纯白（见第 5.1 节）
- [ ] 素材框 = 半透明彩色 + 同色系边框（见第 9 节）

**其他维度的自检**（不在本文件）：
- 字幕完整性 → [subtitle.md](remotion/rules/subtitle.md) 第 8 节
- 分镜约束 → [storyboard.md](remotion/rules/storyboard.md) 第 7 节
- 素材清单 → [assets.md](remotion/rules/assets.md) 第 7 节
- 综合自检 → [checklist.md](remotion/rules/checklist.md) 第 2 节（master）

---

## 7. 元素设计风格：科技感 + 力量感

所有 UI 元素（按钮、卡片、图表、装饰、图标）需要传达**科技感 + 力量感**——这是七练面向"中级健身者"的人格化品牌调性。

### 7.1 科技感（Sci-tech / Cyber）

- 几何线条：直角、细描边、网格底纹、数据点阵、扫描线
- 单色高对比：黑底 + 荧光色描边/数字
- 数字优先：把"kg/次/组/周"等关键数据放大、数字化
- 轻微发光：使用 `drop-shadow` / `box-shadow` 模拟霓虹/LED 效果（克制使用）
- 等宽数字：关键数字用 `font-variant-numeric: tabular-nums` 或等宽字体

### 7.2 力量感（Power / Strength）

- **粗描边**：边框 2-4px（不要 1px 细线），传达"结实、扛得住"
- **硬朗几何**：避免圆润到 50% 的圆角（圆角最大 8-12px）
- **大字号数据**：训练重量、次数用大号字（≥ 64px），形成视觉冲击
- **倾斜/破折元素**：训练动作图标、数据曲线可加倾斜或破折处理
- **金属/暗色质感**：避免可爱/柔和配色

### 7.3 ✅ / ❌ 对比

```tsx
// ✅ 科技感 + 力量感
<div className="border-2 border-[#FF4500] rounded-lg p-6 shadow-[0_0_24px_rgba(255,69,0,0.4)]">
  <div className="text-[#FF4500] text-7xl font-bold tabular-nums">80</div>
  <div className="text-white text-lg mt-2">KG × 10</div>
</div>

// ❌ 偏柔：圆角过大、无描边、无数据冲击
<div className="rounded-3xl p-6 bg-[#252525]">
  <div className="text-white text-2xl">80kg 10次</div>
</div>

// ❌ 偏柔：纯色暗背景（违反第 5.1 半透明彩色硬约束）
<div className="rounded-3xl p-6 bg-[#1A1A1A]">
  <div className="text-white text-2xl">80kg 10次</div>
</div>
```

### 7.4 动效中的科技感

- **数字滚动**：重量/次数用 `interpolate` 滚动到位
- **扫描线 / 数据流**：进入/退出场景时加 1-2 道扫光
- **网格背景**：可加 1-2px 的低透明度网格（≤ 10%）做底纹
- **粒子/数据点**：关键 KPI 周围加 4-8 个浮动数据点（克制）

---

## 8. 转场

**每个视频必须有转场**——Sequence 之间不能直接硬切。

### 8.1 时长

- **最低 0.3s**（30fps 视频 = 9 帧）
- 推荐 0.4-0.6s（12-18 帧）
- 转场总时长不能盖过内容时长；一段 3s 的小段配 0.5s 转场已足够

### 8.2 推荐转场类型（与品牌调性匹配）

| 类型 | 适用场景 | 注意 |
|---|---|---|
| **淡入淡出（Crossfade）** | 默认值/通用场景 | 黑场过渡 0.3-0.5s |
| **推进/拉远（Push/Pull）** | 同主题前后段（如：动作演示 → 数据复盘） | 用 `transform: scale()` 模拟 |
| **方向滑动** | 步骤递进（如：步骤 1 → 步骤 2 → 步骤 3） | 单方向（左/上）|
| **数字滚动接续** | 数字到数字的过渡 | 用 `interpolate` 让数字滚动到位 |
| ❌ 旋转 / 翻转 / 3D 翻页 | — | 与品牌调性不符，禁用 |

### 8.3 实现约定

- 转场通过 `Sequence` 的 `from` 帧重叠实现（前后段各占一半转场时长）
- 缓动函数优先用 `Easing.bezier(0.4, 0, 0.2, 1)`（Material 标准），避免线性插值
- 转场中**禁止出现大面积纯色块遮挡**（与第 2 节联动）

```tsx
// ✅ 正确的转场：两段 Sequence 帧重叠 + ease 缓动
<Sequence from={0} durationInFrames={90}>
  <HookQuestion />          {/* 0-90 帧 */}
</Sequence>
<Sequence from={81} durationInFrames={120}>   {/* 81 帧开始，重叠 9 帧 = 0.3s */}
  <ThreeSecRecord />
</Sequence>
```

---

## 9. 素材框设计

视频中展示图片/视频/数据卡片时，**统一使用半透明彩色素材框**。

### 9.1 三个硬约束

1. **优先透明**：素材框不要实心填充，能透就透，露出底图/视频
2. **边框与背景同色系**：边框色 = 背景色（同色系统一），视觉上不打架
3. **背景半透明 + 彩色**：用强调色 1 `#FF4500` 或强调色 2 `#DC143C` 叠加透明度（参考第 5.1 节）。**禁用纯白 `#FFFFFF` / 纯灰 `#1A1A1A` / 纯灰 `#252525` 做素材框背景**

### 9.2 推荐做法

```tsx
// ✅ 半透明彩色素材框：橙色细描边 + 半透明橙底
<div className="border-2 border-[#FF4500]/60 bg-[#FF4500]/10 rounded-lg p-4">
  <img src={staticFile("卧推80KG_10.png")} className="w-full" />
</div>

// ✅ 强调态素材框：实色描边 + 较深半透明橙底
<div className="border-2 border-[#FF4500] bg-[#FF4500]/20 rounded-lg p-4">
  <video src={staticFile("深蹲_100KG.mov")} className="w-full" />
</div>

// ✅ 警示态素材框：红色
<div className="border-2 border-[#DC143C] bg-[#DC143C]/15 rounded-lg p-4">
  <img src={staticFile("疲劳信号.png")} className="w-full" />
</div>

// ❌ 错误：实心灰底 + 灰色描边（违反半透明 + 彩色硬约束）
<div className="border-2 border-[#333333] bg-[#252525] rounded-lg p-4">

// ❌ 错误：纯白底 + 纯白描边（旧规则，已被新规则替代）
<div className="border-2 border-white bg-white/10 rounded-lg p-4">
```

### 9.3 同色系组合参考

边框与背景必须在同一色系（透明度可以不同，但色相要一致）：

| 边框色 | 背景色（同色系） | 视觉效果 | 适用 |
|---|---|---|---|
| `border-[#FF4500]` | `bg-[#FF4500]/10` | 橙框极淡（普通态）| 默认素材框 |
| `border-[#FF4500]` | `bg-[#FF4500]/20` | 橙框柔透（强调态）| 关键数据/CTA |
| `border-[#FF4500]/60` | `bg-[#FF4500]/10` | 橙框淡描边（次要）| 装饰性 |
| `border-[#DC143C]` | `bg-[#DC143C]/15` | 红框柔透（警示态）| 疲劳/风险信号 |

> ❌ 已禁用：`border-white + bg-white/*`、`border-[#333333] + bg-[#252525]` 等中性色组合。

### 9.4 圆角与描边

- 描边 2-3px（与第 7 节"力量感"的粗描边一致）
- 圆角 6-12px（避免过圆）
- 内边距 12-24px（给素材留呼吸）
