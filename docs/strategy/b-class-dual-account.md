# B 类视频「一源双出」方案

> 目标：同一份动作素材，用 remotion 最小代价生成两个小红书账号的版本
> 状态：方案设计
> 关联：remotion 框架 / B 类竖屏视频 / 小红书双账号

---

## 1. 核心思路：素材层不变，remotion 层做「皮肤 + 节奏 + 文案」三向差异

```
┌─────────────────────────────────────────────────────┐
│                   素材层（只录一遍）                    │
│  动作视频(.mov) + 旁白(.m4a) + 图片素材(.png)           │
└─────────────────────────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
   ┌────────────┐  ┌────────────┐  ┌────────────┐
   │   皮肤差异   │  │   节奏差异   │  │   文案差异   │
   │  颜色/位置   │  │  快慢/切镜   │  │  CTA/Hook  │
   └────────────┘  └────────────┘  └────────────┘
          │               │               │
          └───────────────┼───────────────┘
                          ▼
   ┌─────────────────────────────────────────────────┐
   │            remotion 双 Composition               │
   │   winged-scapula-b3-pro  |  winged-scapula-b3-lite │
   └─────────────────────────────────────────────────┘
```

---

## 2. 两个小红书账号的定位差异建议

基于小红书平台特性（收藏导向 / 生活感 / 信息密度高），建议两个账号走以下差异化路线：

| 维度 | 账号 A：「健身干货库」 | 账号 B：「健身跟练营」 |
|---|---|---|
| **人设** | 专业教练感 | 健身搭子感 |
| **视觉** | 深色系（黑/橙红）| 明亮系（白/蓝绿）|
| **信息密度** | 高（参数齐全，收藏向）| 中（重点突出，跟练向）|
| **ActionDataCard 位置** | 右下角，紧凑 | 左侧/底部，大字体 |
| **BGM** | Tech House（Power Build）| Lo-fi / Chill House |
| **节奏** | 标准节奏（教学讲解）| 稍快（快节奏切镜）|
| **CTA** | "收藏跟练 / 评论区交作业" | "跟我练 / 打卡 Day1" |
| **封面策略** | 大字报 + 痛点词 | 真人出镜 + 表情 |

> **关键**：两个账号从视频本身看就是"完全不同的风格"，但底层素材完全一样。

---

## 3. remotion 实现方案（最小改动路径）

### 3.1 新增：Theme 配置系统（1 个文件）

```ts
// src/themes/b-variants.ts
export interface BVariantTheme {
  id: string;
  name: string;
  // 色彩
  primaryColor: string;
  bgColor: string;
  textColor: string;
  cardBg: string;
  // ActionDataCard
  cardPosition: 'bottom-right' | 'bottom-left' | 'bottom-center';
  cardStyle: 'compact' | 'large';
  // CTA
  ctaStyle: 'pill' | 'square' | 'minimal';
  // BGM（文件名映射）
  bgmFile: string;
  // 字体
  fontFamily: string;
}

export const B_VARIANTS: Record<string, BVariantTheme> = {
  pro: {
    id: 'pro',
    name: '健身干货库',
    primaryColor: '#FF4500',
    bgColor: '#0A0A0A',
    textColor: '#FFFFFF',
    cardBg: 'rgba(220, 20, 60, 0.15)',
    cardPosition: 'bottom-right',
    cardStyle: 'compact',
    ctaStyle: 'pill',
    bgmFile: 'power_build.mp3',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
  },
  lite: {
    id: 'lite',
    name: '健身跟练营',
    primaryColor: '#00D4AA',
    bgColor: '#F5F5F5',
    textColor: '#1A1A1A',
    cardBg: 'rgba(0, 212, 170, 0.12)',
    cardPosition: 'bottom-left',
    cardStyle: 'large',
    ctaStyle: 'square',
    bgmFile: 'chill_house.mp3',  // 需新增 BGM
    fontFamily: '-apple-system, PingFang SC, sans-serif',
  },
};
```

### 3.2 改造：组件层接受 theme prop（2-3 个组件）

**ActionDataCard** —— 目前硬编码右下角 + 橙红色：

```tsx
// 改造后：根据 theme.cardPosition 改变位置
interface ActionDataCardProps {
  name: string;
  reps: string;
  sets: string;
  theme?: BVariantTheme;  // 新增
}

// 位置映射
const POSITION_MAP = {
  'bottom-right': { bottom: 80, right: 40, left: 'auto' },
  'bottom-left':  { bottom: 80, left: 40, right: 'auto' },
  'bottom-center': { bottom: 80, left: '50%', transform: 'translateX(-50%)' },
};
```

**CTAButton** —— 同样接受 theme prop 改变样式。

**ShotContent** —— 把 theme 传递给子组件：

```tsx
interface ShotContentProps {
  shot: Shot;
  theme?: BVariantTheme;  // 新增
}
```

### 3.3 改造：Scene 层接受 variant prop（每个 B 类 scene）

以 `WingedScapulaB3` 为例：

```tsx
// 新增 props 接口
interface WingedScapulaB3Props {
  variant?: 'pro' | 'lite';  // 默认 'pro'
}

export const WingedScapulaB3: React.FC<WingedScapulaB3Props> = ({ variant = 'pro' }) => {
  const theme = B_VARIANTS[variant];

  return (
    <AbsoluteFill style={{ background: theme.bgColor }}>
      {/* BGM 随 variant 变化 */}
      <BGMWithDucking
        src={staticFile(audio(`bgm/${theme.bgmFile}`))}
        // ...
      />
      {/* Shots 渲染时传入 theme */}
      {shots.map(shot => (
        <ShotContent key={shot.shot_id} shot={shot} theme={theme} />
      ))}
    </AbsoluteFill>
  );
};
```

### 3.4 改造：Root.tsx 注册双 Composition（1 个文件）

```tsx
{/* === B 类：pro 版（健身干货库）=== */}
<Composition
  id="winged-scapula-b3-pro"
  component={WingedScapulaB3}
  defaultProps={{ variant: 'pro' }}
  durationInFrames={2232}
  fps={30}
  width={1080}
  height={1920}
/>

{/* === B 类：lite 版（健身跟练营）=== */}
<Composition
  id="winged-scapula-b3-lite"
  component={WingedScapulaB3}
  defaultProps={{ variant: 'lite' }}
  durationInFrames={2232}
  fps={30}
  width={1080}
  height={1920}
/>
```

### 3.5 批量渲染命令

```bash
# 一次渲染两个版本
npx remotion render src/index.tsx winged-scapula-b3-pro out/winged_scapula_b3_pro.mp4
npx remotion render src/index.tsx winged-scapula-b3-lite out/winged_scapula_b3_lite.mp4
```

或用 remotion 的 `renderMedia` / `renderMediaOnLambda` 批量渲染。

---

## 4. 差异维度清单（按代价排序）

### 4.1 零额外素材（纯 remotion 配置）

| 差异项 | 实现方式 | 效果 |
|---|---|---|
| **色彩主题** | theme.primaryColor / bgColor / cardBg | 两个视频看起来品牌完全不同 |
| **参数卡位置** | theme.cardPosition | 一个在右下一个在左下，构图差异明显 |
| **参数卡样式** | theme.cardStyle | compact vs large，信息量不同 |
| **CTA 样式** | theme.ctaStyle | pill vs square，调性不同 |
| **BGM** | theme.bgmFile | 不同风格音乐，氛围完全不同 |
| **字体/字重** | theme.fontFamily | 系统字体差异，细节质感不同 |

### 4.2 低代价（可复用现有素材或 mmx 生成）

| 差异项 | 实现方式 | 代价 |
|---|---|---|
| **Hook 图片** | 两个 variant 用不同的 `hook_image.png` | 低：mmx 生成 2 张图 |
| **过渡卡文字** | 同一过渡图，文字内容不同 | 低：改 storyboard.json 的 code_props |
| **字幕风格** | 不同颜色/描边/背景框 | 低：改字幕渲染组件 |

### 4.3 中代价（需要调整 storyboard 或代码）

| 差异项 | 实现方式 | 代价 |
|---|---|---|
| **节奏快慢** | 不同 playbackRate（如 lite 版整体快 1.2x）| 中：改 Scene 层的 playbackRate 计算 |
| **Shot 分割方式** | pro 版详细讲解（shot 多），lite 版快剪（shot 少）| 中：维护两个 storyboard.json |
| **不同 Hook 视频** | 前 3 秒用不同素材（一个痛点镜头，一个真人说话）| 中：需要多录一段 hook |

---

## 5. 最小可行路径（MVP，1 小时内验证）

### Step 1：创建 theme 文件（15 min）
- 新建 `src/themes/b-variants.ts`
- 定义 pro / lite 两套配色和位置

### Step 2：改造 ActionDataCard（15 min）
- 接受 `theme` prop
- 根据 `cardPosition` / `cardStyle` 改变渲染

### Step 3：改造 WingedScapulaB3（15 min）
- 接受 `variant` prop
- 传给 ShotContent / ActionDataCard / CTAButton
- BGM 路径随 variant 变化

### Step 4：Root.tsx 注册双 Composition（5 min）
- 复制一个 Composition，改 id 和 defaultProps.variant

### Step 5：渲染验证（10 min）
- 分别渲染 pro / lite 两个版本
- 对比差异是否足够明显

---

## 6. 进阶：两个账号如何避免被平台判定为"搬运"

小红书（及抖音）有查重机制，单纯改颜色可能不够。建议差异组合至少包含：

1. **视觉差异 ≥ 2 项**：颜色 + 布局位置（已完成）
2. **音频差异 ≥ 1 项**：不同 BGM（已完成）
3. **文案差异 ≥ 1 项**：不同 CTA / 不同 hook 文字（建议加）
4. **时长差异 ≥ 10%**：lite 版可以剪掉部分过渡，短 5-8 秒

> **组合以上差异后，两个视频在平台算法眼中就是"不同内容"**。

---

## 7. 扩展：推广到所有 B 类视频

验证 `winged-scapula-b3` 双版本可行后，其他 B 类视频（`b14-push-day`, `b15-abs` 等）只需：

1. 复用同一套 `B_VARIANTS` theme 配置
2. 各 Scene 组件统一接入 `variant` prop
3. Root.tsx 中每个 B 类 Composition 都注册 pro/lite 双版本

**最终效果**：每录一次素材，remotion 自动输出 2 个视频，分别发两个小红书账号。

---

## 8. 决策点

| 问题 | 建议 |
|---|---|
| 两个账号的定位要定下来吗？ | 需要先定，决定 theme 的配色和调性 |
| lite 版需要额外 BGM 吗？ | 是，建议准备 1-2 首 chill house / lo-fi |
| 需要两个 storyboard 吗？ | MVP 阶段不用，先共用同一个；后期可拆分 |
| 封面图也要不同吗？ | 是，建议用 remotion 的 `getStill` 分别截取两个版本的首帧 |

---

*方案设计完成，等待用户确认后进入 remotion 代码实现。*
