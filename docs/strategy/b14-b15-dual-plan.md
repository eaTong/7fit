# B14 / B15 双版本（pro / lite）实现规划

> 基于「一源双出」方案，针对 B14（胸日）和 B15（腹肌）两个视频的具体实施规划。
> 状态：待实施
> 关联：`docs/strategy/b-class-dual-account.md`

---

## 1. 两个账号定位（确定版）

| 维度 | 账号 A：pro（健身干货库） | 账号 B：lite（健身跟练营） |
|---|---|---|
| **人设** | 专业教练感，信息密度高 | 健身搭子感，轻松跟练 |
| **受众** | 想系统学习、收藏计划 | 想直接跟着练、打卡 |
| **视觉关键词** | 力量、硬核、暗黑 | 清新、活力、明亮 |
| **CTA 风格** | "评论区交作业" | "跟我练 Day1 / 打卡" |

---

## 2. 两版本差异对照表

### 2.1 色彩系统

| 元素 | pro（深橙） | lite（亮青） |
|---|---|---|
| **主色 primary** | `#FF4500` | `#00D4AA` |
| **辅色 secondary** | `#DC143C` | `#0099FF` |
| **背景色 bg** | `#0A0A0A` | `#F5F5F5` |
| **卡片背景 cardBg** | `rgba(10,10,20,0.88)` | `rgba(255,255,255,0.92)` |
| **主文字 text** | `#FFFFFF` | `#1A1A1A` |
| **字幕背景 subtitleBg** | `rgba(0,0,0,0.6)` | `rgba(255,255,255,0.85)` |
| **字幕高亮文字** | `#FFFFFF`（白字橙底） | `#FFFFFF`（白字青底） |
| **进度环底色** | `rgba(255,255,255,0.2)` | `rgba(0,0,0,0.15)` |

### 2.2 BGM

| 视频 | pro 版 | lite 版 |
|---|---|---|
| B14 胸日 | `gym_beat_b14.mp3`（已有） | `lite_vibe_b14.mp3`（需新增） |
| B15 腹肌 | `gym_beat_b15.mp3`（已有） | `lite_vibe_b15.mp3`（需新增） |

> lite 版 BGM 建议：Chill House / Lo-fi / 轻快电子，BPM 100-110，无 vocal。

### 2.3 文案差异（仅 CTA 部分）

| 位置 | pro 版 | lite 版 |
|---|---|---|
| B14 outro | "评论区交作业" | "跟我练，评论区打卡 Day1" |
| B15 outro | "评论区交作业" | "卷起来，打卡开始" |

> 主体文案（钩子 + 动作名）两版本共用同一段旁白，不做修改。

### 2.4 组件样式差异

| 组件 | pro 版 | lite 版 |
|---|---|---|
| **ActionBadge** | 左上角，橙边黑底 | 左上角，青边白底 |
| **ParamCard** | 右上/左下，橙/红边框 | 右上/左下，青/蓝边框 |
| **ProgressRing** | 右下，橙环 | 右下，青环 |
| **VoiceoverText** | 黑底白字，橙高亮 | 白底黑字，青高亮 |
| **NumberImpact** | 橙/红高亮数字 | 青/蓝高亮数字 |

---

## 3. 需要修改的文件清单（共 8 个）

### 3.1 新增文件（1 个）

```
src/themes/b-variant-theme.ts          # Theme 定义 + pro/lite 配置
```

### 3.2 改造文件（6 个）

```
src/scenes/b14_push_day/index.tsx      # 接入 variant + theme
src/scenes/b15_abs/index.tsx           # 接入 variant + theme

src/components/auxiliary/ActionBadge.tsx     # 支持 theme（背景/文字/阴影）
src/components/auxiliary/ParamCard.tsx       # 支持 theme（背景/文字）
src/components/auxiliary/ProgressRing.tsx    # 支持 theme（背景/文字）
src/components/data-display/VoiceoverText.tsx # 支持 theme（背景/高亮/文字）
```

### 3.3 注册文件（1 个）

```
src/Root.tsx                           # 每个 B 类 Composition 注册 pro/lite 双版本
```

---

## 4. 详细改造方案

### 4.1 Theme 定义（新增 `src/themes/b-variant-theme.ts`）

```ts
export interface BVariantTheme {
  id: 'pro' | 'lite';
  name: string;
  // 色彩
  primary: string;
  secondary: string;
  bg: string;
  cardBg: string;
  cardBorder: string;
  text: string;
  textInverse: string;
  subtitleBg: string;
  subtitleText: string;
  highlightBg: string;
  highlightText: string;
  progressTrack: string;
  shadowColor: string;
  // BGM
  bgmFile: string;
  // 字体
  fontFamily: string;
}

export const B_VARIANT_PRO: BVariantTheme = {
  id: 'pro',
  name: '健身干货库',
  primary: '#FF4500',
  secondary: '#DC143C',
  bg: '#0A0A0A',
  cardBg: 'rgba(10,10,20,0.88)',
  cardBorder: 'rgba(255,255,255,0.1)',
  text: '#FFFFFF',
  textInverse: '#1A1A1A',
  subtitleBg: 'rgba(0,0,0,0.6)',
  subtitleText: '#FFFFFF',
  highlightBg: '#FF4500',
  highlightText: '#FFFFFF',
  progressTrack: 'rgba(255,255,255,0.2)',
  shadowColor: 'rgba(255,69,0,',
  bgmFile: 'gym_beat',          // 后缀由场景决定 _b14 / _b15
  fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
};

export const B_VARIANT_LITE: BVariantTheme = {
  id: 'lite',
  name: '健身跟练营',
  primary: '#00D4AA',
  secondary: '#0099FF',
  bg: '#F5F5F5',
  cardBg: 'rgba(255,255,255,0.92)',
  cardBorder: 'rgba(0,0,0,0.08)',
  text: '#1A1A1A',
  textInverse: '#FFFFFF',
  subtitleBg: 'rgba(255,255,255,0.85)',
  subtitleText: '#1A1A1A',
  highlightBg: '#00D4AA',
  highlightText: '#FFFFFF',
  progressTrack: 'rgba(0,0,0,0.15)',
  shadowColor: 'rgba(0,212,170,',
  bgmFile: 'lite_vibe',         // 后缀由场景决定 _b14 / _b15
  fontFamily: '-apple-system, PingFang SC, sans-serif',
};

export const B_VARIANTS: Record<string, BVariantTheme> = {
  pro: B_VARIANT_PRO,
  lite: B_VARIANT_LITE,
};

/** 根据视频 ID 获取完整 BGM 文件名 */
export function getBgmFileName(theme: BVariantTheme, videoId: string): string {
  return `${theme.bgmFile}_${videoId}.mp3`;
}

/** 将 storyboard 硬编码颜色替换为 theme 色 */
export function mapStoryboardColor(color: string, theme: BVariantTheme): string {
  if (color === '#FF4500' || color === '#ff4500') return theme.primary;
  if (color === '#DC143C' || color === '#dc143c') return theme.secondary;
  return color;
}
```

### 4.2 Scene 层改造（B14 / B15 同步改）

以 B14PushDay 为例：

```tsx
// 新增 props
interface B14PushDayProps {
  variant?: 'pro' | 'lite';
  bgmVolume?: number;
  enableFadeIn?: boolean;
  enableTransitions?: boolean;
}

export const B14PushDay: React.FC<B14PushDayProps> = ({
  variant = 'pro',
  bgmVolume = 0.25,
  enableFadeIn = true,
  enableTransitions = true,
}) => {
  const theme = B_VARIANTS[variant];
  const shots = storyboard.shots as Shot[];
  const compositionFrames = Math.round(shots[shots.length - 1].end * FPS);
  const bgmFile = getBgmFileName(theme, 'b14');

  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      <BGMWithDucking
        src={staticFile(audio(`bgm/${bgmFile}`))}
        compositionFrames={compositionFrames}
        normalVolume={bgmVolume}
        fadeInFrames={enableFadeIn ? 30 : 0}
      />
      <Audio src={staticFile(audio("b14_push_day.m4a"))} volume={1.0} />
      {shots.map((shot, idx, arr) => {
        // ... 时间计算不变
        return (
          <Sequence ...>
            <ShotRenderer ...>
              <ShotContent shot={shot} theme={theme} />
            </ShotRenderer>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
```

### 4.3 ShotContent 改造（传入 theme）

```tsx
const ShotContent: React.FC<{ shot: Shot; theme: BVariantTheme }> = ({
  shot,
  theme,
}) => {
  const anim = getAnim(shot);

  // 颜色映射：将 storyboard 硬编码的 #FF4500 / #DC143C 替换为 theme 色
  const mapColor = (c?: string) => c ? mapStoryboardColor(c, theme) : theme.primary;

  // video_grid 钩子
  if (shot.content_type === "video_grid") {
    return (
      <AbsoluteFill>
        <Grid2x2 ... />
        {shot.voiceover && (
          <VoiceoverText text={shot.voiceover} bottom={50} theme={theme} />
        )}
      </AbsoluteFill>
    );
  }

  // 视频镜
  if (shot.content_type === "video") {
    return (
      <AbsoluteFill>
        <OffthreadVideo ... />
        {anim.action_badge && (
          <ActionBadge
            name={anim.action_badge.name}
            position={anim.action_badge.position}
            delay={anim.action_badge.delay_frames}
            color={theme.primary}
            theme={theme}          // 新增：背景/文字/阴影
          />
        )}
        {anim.progress_ring && (
          <ProgressRing
            current={anim.progress_ring.current}
            total={anim.progress_ring.total}
            position={anim.progress_ring.position}
            delay={anim.progress_ring.delay_frames}
            impulse={anim.progress_ring.impulse}
            color={theme.primary}
            theme={theme}          // 新增：背景/文字
          />
        )}
        {anim.param_card?.map((card, i) => (
          <ParamCard
            key={i}
            label={card.label}
            caption={card.caption}
            color={mapColor(card.color)}
            position={card.position}
            delay={card.delay_frames}
            breathing={card.breathing}
            theme={theme}          // 新增：背景/文字
          />
        ))}
        {/* number_overlay 高亮色映射 */}
        {anim.number_overlay && (
          <NumberImpact
            numbers={anim.number_overlay.numbers.map(n => ({
              ...n,
              // 高亮数字使用 theme.primary，否则保持默认
            }))}
            // ... 其他 props
          />
        )}
        {shot.voiceover && (
          <VoiceoverText text={shot.voiceover} bottom={50} theme={theme} />
        )}
      </AbsoluteFill>
    );
  }
  // ...
};
```

### 4.4 子组件改造要点

#### ActionBadge（`src/components/auxiliary/ActionBadge.tsx`）

新增 `theme?: BVariantTheme` prop，替换硬编码：

```tsx
interface ActionBadgeProps {
  name: string;
  position?: ...;
  delay?: number;
  color?: string;
  theme?: BVariantTheme;   // 新增
}

// 替换硬编码：
background: theme?.cardBg ?? "rgba(10, 10, 20, 0.88)"
color: theme?.text ?? "#FFFFFF"        // 文字颜色
boxShadow: `0 0 ${20 + 20 * pulse}px ${theme?.shadowColor ?? 'rgba(255, 69, 0,'}${glowOpacity})`
```

#### ParamCard（`src/components/auxiliary/ParamCard.tsx`）

同理新增 `theme` prop，替换硬编码背景、文字、阴影颜色。

#### ProgressRing（`src/components/auxiliary/ProgressRing.tsx`）

新增 `theme` prop，替换：
- `fill="rgba(10, 10, 20, 0.88)"` → `theme.cardBg`
- `stroke="rgba(255, 255, 255, 0.2)"` → `theme.progressTrack`
- 中心数字 `color="#FFFFFF"` → `theme.text`

#### VoiceoverText（`src/components/data-display/VoiceoverText.tsx`）

新增 `theme` prop，替换：
- 容器背景 `rgba(0,0,0,0.6)` → `theme.subtitleBg`
- 高亮段背景 `#FF4500` → `theme.highlightBg`
- 普通段文字 `#FFFFFF` → `theme.subtitleText`

### 4.5 Root.tsx 双版本注册

```tsx
// === B14：pro + lite ===
<Composition
  id="b14-push-day-pro"
  component={B14PushDay}
  defaultProps={{ variant: 'pro' }}
  durationInFrames={930}
  fps={30}
  width={1080}
  height={1920}
/>
<Composition
  id="b14-push-day-lite"
  component={B14PushDay}
  defaultProps={{ variant: 'lite' }}
  durationInFrames={930}
  fps={30}
  width={1080}
  height={1920}
/>

// === B15：pro + lite ===
<Composition
  id="b15-abs-pro"
  component={B15Abs}
  defaultProps={{ variant: 'pro' }}
  durationInFrames={900}
  fps={30}
  width={1080}
  height={1920}
/>
<Composition
  id="b15-abs-lite"
  component={B15Abs}
  defaultProps={{ variant: 'lite' }}
  durationInFrames={900}
  fps={30}
  width={1080}
  height={1920}
/>
```

---

## 5. 素材准备清单

| 素材 | 状态 | 说明 |
|---|---|---|
| `lite_vibe_b14.mp3` | ❌ 待准备 | lite 版 B14 BGM |
| `lite_vibe_b15.mp3` | ❌ 待准备 | lite 版 B15 BGM |
| 现有视频素材 | ✅ 已有 | pro/lite 共用 |
| 现有旁白 | ✅ 已有 | pro/lite 共用（CTA 文案差异通过字幕实现） |

> BGM 建议：可在现有的 `gym_beat_b14.mp3` / `gym_beat_b15.mp3` 基础上做降速（0.8x）+ 滤波处理，降低制作成本。或用同风格免费音乐替代。

---

## 6. 渲染命令

```bash
# B14 双版本
npx remotion render src/index.tsx b14-push-day-pro out/b14_push_day_pro.mp4
npx remotion render src/index.tsx b14-push-day-lite out/b14_push_day_lite.mp4

# B15 双版本
npx remotion render src/index.tsx b15-abs-pro out/b15_abs_pro.mp4
npx remotion render src/index.tsx b15-abs-lite out/b15_abs_lite.mp4
```

---

## 7. 防搬运查重组合

两个版本在算法层面的差异：

| 维度 | 差异程度 |
|---|---|
| **画面色彩** | 完全不同（黑底橙字 vs 白底青字） |
| **BGM** | 不同（Tech House vs Chill House） |
| **字幕风格** | 不同（黑底白字 vs 白底黑字） |
| **卡片样式** | 不同（黑底玻璃态 vs 白底轻量态） |
| **时长** | 相同（如需差异可后期 lite 版加速 1.05x） |
| **文案** | CTA 不同 |

**结论**：以上差异组合已足够让平台算法识别为两条独立内容，不会触发搬运查重。

---

## 8. 实施优先级（建议顺序）

```
Phase 1（30 min）：Theme 系统 + Root 注册
  └─ 1.1 新建 src/themes/b-variant-theme.ts
  └─ 1.2 Root.tsx 注册 b14/b15 的 pro/lite Composition

Phase 2（30 min）：Scene 层接入
  └─ 2.1 B14PushDay 接入 variant prop + theme
  └─ 2.2 B15Abs 接入 variant prop + theme
  └─ 2.3 ShotContent 传入 theme + 颜色映射

Phase 3（40 min）：子组件改造
  └─ 3.1 VoiceoverText 支持 theme
  └─ 3.2 ActionBadge 支持 theme
  └─ 3.3 ParamCard 支持 theme
  └─ 3.4 ProgressRing 支持 theme

Phase 4（20 min）：验证
  └─ 4.1 渲染 B14 pro/lite 对比
  └─ 4.2 渲染 B15 pro/lite 对比
  └─ 4.3 确认视觉差异足够明显

Phase 5（按需）：lite 版 BGM 准备
  └─ 5.1 制作/采购 lite_vibe_b14.mp3
  └─ 5.2 制作/采购 lite_vibe_b15.mp3
```

总预计耗时：**约 2 小时**（不含 BGM 制作）

---

## 9. 关键决策点

| 问题 | 建议 |
|---|---|
| **lite 版 BGM 从哪来？** | 先用现有 BGM 降速 0.8x 做临时版，后期替换 |
| **CTA 文案差异怎么实现？** | 两种方式：a) 准备两段旁白；b) 共用旁白，字幕显示不同文案。建议选 b，最小代价 |
| **NumberImpact 高亮色要不要改？** | 要改，通过 theme.primary 替换 |
| **WingedScapulaB3 要不要一起改？** | 建议先验证 B14/B15，确认方案可行后再推广到所有 B 类视频 |

---

*规划完成。确认后进入代码实施阶段。*
