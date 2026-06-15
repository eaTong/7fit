# C-1 · 脚本编排（Script）v3.1

> **视频主题**：c01_pm_fitness_log（一个产品经理的健身自救）
> **视频类型**：C · 七练解码（身份反差 + 造轮子混合）
> **版本**：v3.1 —— **口播分段**（8 段独立自拍）+ 信息密度拉满 + 转场串联

---

## 口播分段（v3.1 升级）

每段口播独立拍摄，便于：
- 每段表情匹配场景（皮质醇→严肃、PM→理性、CTA→放松）
- 卡壳只重录一段
- 拍摄灵活（机位/姿态微调）

| 段 ID | 主题 | 时长 | 文件 | 表情/姿态 |
|---|---|---|---|---|
| **TA0** | 钩子 | 4s | `ta0_hook.mp4` | 特写正面、凝练、眼神有力 |
| **TA1** | 皮质醇 | 12s | `ta1_cortisol.mp4` | 特写凝重、回忆式、眉头微皱 |
| **TA2** | 反思 | 12s | `ta2_reflect.mp4` | 半身+手比划、自问自答、点头/摇头 |
| **TA3** | PM 翻译 | 10s | `ta3_pm_translate.mp4` | 半身推眼镜、手指比划"等价于" |
| **TA4** | 小程序 | 14s | `ta4_mini_app.mp4` | 近景+手机道具、演示"说话"动作 |
| **TA5** | 三场景 | 18s | `ta5_scenes.mp4` | 镜头微切、眼神左右看 3 次 |
| **TA6** | 金句 | 10s | `ta6_quote.mp4` | 特写坚定、节奏加重、眼神有力 |
| **TA7** | CTA | 10s | `ta7_cta.mp4` | 特写放松、微笑、引导手部动作 |

**口播布局**：右下角 280×280 正方形容器，`object-fit: cover`，每段入场 spring 弹入、退场 fade out。

---

## 逐段脚本（含口播片段 + 信息元件 + 转场）

| 镜号 | 起止 | 时长 | 口播片段 | 口播文案 | 信息元件 | 转场入 | 转场出 | SFX |
|---|---|---|---|---|---|---|---|---|
| **S0 钩子** | 0-4s | 4s | **TA0** | "练了2年，皮质醇过载，2周睡不着" | ①终端逐行打出 ②数字卡"2周" ③时间轴 ④状态栏 | fadeIn | wipe-h | — |
| **S1 皮质醇** | 4-16s | 12s | **TA1** | "有阵子状态特别差…又花了两周做轻训" | ①数据卡+折线 ②标签"3-4周" ③症状列 ④状态栏 | wipe-h | wipe-h | 数据提示音 |
| **S2 反思** | 16-28s | 12s | **TA2** | "事后我在想…30秒一组坚持不了6个月" | ①字段列表 ②数字卡"30s" ③高亮条 | wipe-h | wipe-h | whoosh |
| **S3 PM翻译** | 28-38s | 10s | **TA3** | "做产品的都知道…产品上线一个月才发现" | ①PRD卡 ②训练日志卡 ③批注条 | wipe-h | glitch+色差 | whoosh |
| **S4 小程序** | 38-52s | 14s | **TA4** | "所以我做了小程序…一句话AI自动归档" | ①小程序截图 ②"⏱3秒"标签 ③流程箭头 ④高亮 | glitch+色差 | wipe-h | click |
| **S5 三场景** | 52-70s | 18s | **TA5** | "不只记训练…不是网上搬的模板" | ①围度记录卡 ②智能查询卡 ③AI周报卡 轮换 | quick cut×3 | fade | pop×3 |
| **S6 金句** | 70-80s | 10s | **TA6** | "能偷懒…但3秒就能坚持" | ①"30"灰 ②"3"橙 ③金句条+光标 ④删除线 | fade | wipe-h | 数字弹入 |
| **S7 CTA** | 80-90s | 10s | **TA7** | "用产品思维…关注我别错过" | ①品牌文字 ②CTA卡 ③彩蛋"下期→Prompt" ④状态栏 | wipe-h | fadeOut 3s | click |

---

## 转场与口播时序

```
┌─ TA_n 主体内容 ─┐──0.3-0.5s 转场──┌─ TA_n+1 主体内容 ─┐
  口播框入场 0.3s                    口播框退场 0.3s + 主体转场
  TA_n 持续显示 10-18s                TA_n+1 入场
                                       ↓
                          转场期间口播可以短暂退场（0.3-0.5s）
                          让转场效果更醒目
                          每段主体期间口播持续可见
```

---

## 视频参数

```typescript
const VIDEO_DURATION = 90; // 秒
const FPS = 30;
const COMPOSITION_FRAMES = 90 * 30; // 2700 帧
const SPEED = 3.4; // 中速
const TALKING_HEAD_SIZE = 280;
const TALKING_HEAD_X = 1920 - 280 - 32;
const TALKING_HEAD_Y = 1080 - 280 - 80;

// 口播分段映射
const TALKING_SEGMENTS = [
  { id: "ta0", file: "ta0_hook.mp4",         start: 0,  end: 4  },
  { id: "ta1", file: "ta1_cortisol.mp4",     start: 4,  end: 16 },
  { id: "ta2", file: "ta2_reflect.mp4",      start: 16, end: 28 },
  { id: "ta3", file: "ta3_pm_translate.mp4", start: 28, end: 38 },
  { id: "ta4", file: "ta4_mini_app.mp4",     start: 38, end: 52 },
  { id: "ta5", file: "ta5_scenes.mp4",       start: 52, end: 70 },
  { id: "ta6", file: "ta6_quote.mp4",        start: 70, end: 80 },
  { id: "ta7", file: "ta7_cta.mp4",          start: 80, end: 90 },
];
```
