# 分镜表：翼状肩胛自测 + 改善：4 个动作

**视频主题**：winged_scapula_b3
**视频类型**：B 类 — 健身知识
**目标账号**：主号（健身博主号）
**BGM**：Power Build（105 BPM, tech house）
**关联文案**：[copy.md](../../../docs/copy/winged_scapula_b3.md)（v7 18 段 / 中速 3.4 字/秒 / 66s 预期）
**关联字幕**：[subtitles.json](subtitles.json)（draft 18 段 / 73s 预算 / 待 mmx 校准）
**关联素材**：[assets.md](assets.md)
**关联分镜数据**：[storyboard.json](storyboard.json)
**生成日期**：2026-06-05

> ⚠️ **2026-06-05 流程变更**：每个 shot 边界必标注"转入/转出动效"，每个段间停顿必落成 `transition` shot。
> 详见 [storyboard.md §4.5-4.6](../../rules/storyboard.md#45--段间停顿--shot-边界2026-06-04-流程变更)

---

## 0. 时长预算总览

| 段落 | 段数 | 时长 | 类型 |
|---|---|---|---|
| 钩子 + 钩子对比 | 1 + 1 | 3.5s + 5.3s = 8.8s | image + video |
| 段间停顿 | 9 × 0.7s | 6.3s | transition |
| 主体 intro | 1 | 5.3s | video |
| 测试 1（镜子） | 1 | 8.8s | video |
| 测试 2（推墙） | 1 | 8.5s | video |
| 过渡（"别担心今天教你 4 个动作"） | 1 | 4.4s | video + code |
| 4 个动作（每个 2 段 + 1 数据卡） | 4 × (7-8s) | ~30s | video + code |
| 收尾 CTA | 1 | 6.2s | code + 钩子 call back |
| **总时长（含段间）** | | **~78s** | |
| 实际 m4a 音频 | | **68.07s** | 差 -10s（mmx 校准后会缩小）|

---

## 1. 完整分镜表

> **每行 = 1 个 shot**。**TR** 开头 = 段间停顿 transition shot（content_type=transition）。
> **转入/转出动效**写在 description 末尾的 `[转入: ...] [转出: ...]` 标记中。
> **时间戳基于 subtitles.json draft（18 段 + 9 段间 0.7s）**——mmx 校准后需重新对齐。

| shot_id | start | end | duration | content_type | content_source | voiceover_seg | description |
|---|---|---|---|---|---|---|---|
| **S01** | 0.00 | 3.53 | 3.53 | `image` | `scapula_anatomy.png` | #1（钩子）| 钩子背景：翼状 vs 正常肩胛 解剖示意（半透明黑色 + 橙红高亮）。视觉钩定"后背鼓起来"。**转入：fade 0.3s** [转入: fade] |
| **TR01** | 3.53 | 4.23 | 0.70 | `transition` | — | — | **段间停顿：钩子 → 主体**。空镜黑屏 + "翼状肩胛"章节标题淡入。**T1 whoosh** 音效叠加。**转入：fade 0.3s, 转出：fade 0.3s** [转入: fade] [转出: fade] |
| **S02** | 4.23 | 9.56 | 5.33 | `video` | `001_hook_compare.mov` | #2-3（intro）| 钩子对比演示：用户背对镜头，肩胛骨翼状 vs 正常对比。手势示意"突出"位置。**转入：crossfade 0.3s, 转出：slide-left 0.3s** [转入: crossfade] [转出: slide-left] |
| **TR02** | 9.56 | 10.26 | 0.70 | `transition` | — | — | **段间停顿：intro → 测试 1**。空镜 + "自测 1"小标淡入。**T2 sweep** 音效。**转入：fade, 转出：fade** [转入: fade] [转出: fade] |
| **S03** | 10.26 | 19.08 | 8.82 | `video` | `002_mirror_test.mov` | #4-5（test 1）| 镜子自测 1：背对落地镜，自然站立，肩完全放松手垂下，朋友从镜子侧前方拍。**转入：crossfade 0.3s, 转出：slide-left 0.3s** [转入: crossfade] [转出: slide-left] |
| **TR03** | 19.08 | 19.78 | 0.70 | `transition` | — | — | **段间停顿：测试 1 → 测试 2**。空镜 + "自测 2"小标。**T2 sweep** 音效。**转入：fade, 转出：fade** [转入: fade] [转出: fade] |
| **S04** | 19.78 | 28.31 | 8.53 | `video` | `003_wall_push.mov` | #6-7（test 2）| 推墙自测 2：面对墙双手前平举推墙，**朋友从斜后方拍**看肩胛骨变化。推 5-8s + 收回 2s。**转入：crossfade 0.3s, 转出：slide-left 0.3s** [转入: crossfade] [转出: slide-left] |
| **TR04** | 28.31 | 29.01 | 0.70 | `transition` | — | — | **段间停顿：测试 2 → 过渡**。空镜 + "4 个动作改善"章节标题淡入（强化"还有救"的转折）。**T2 sweep** 音效。**转入：fade, 转出：fade** [转入: fade] [转出: fade] |
| **S05** | 29.01 | 33.42 | 4.41 | `video`+`code` | `004_wall_slide.mov`（动作 1 引入镜头）| #8（"别担心..."）| 过渡镜头：用户站到墙前准备姿势（动作 1 起始姿势）。同时显示 `<ActionDataCard name="4 个动作" sets="按节奏" />` 标题卡。**转入：crossfade 0.3s, 转出：slide-up 0.3s** [转入: crossfade] [转出: slide-up] |
| **TR05** | 33.42 | 34.12 | 0.70 | `transition` | — | — | **段间停顿：过渡 → 动作 1**。**T2 sweep** 音效。**转入：fade, 转出：fade** [转入: fade] [转出: fade] |
| **S06** | 34.12 | 41.47 | 7.35 | `video`+`code` | `004_wall_slide.mov`（动作 1 主体）| #9-10（action 1）| 壁虎推墙演示：前臂贴墙往上滑，肩胛骨要往下沉。12-15 次。**右下角叠加 `<ActionDataCard name="壁虎推墙" reps="12-15" sets="3" />`**。**转入：crossfade 0.3s, 转出：slide-left 0.3s** [转入: crossfade] [转出: slide-left] |
| **TR06** | 41.47 | 42.17 | 0.70 | `transition` | — | — | **段间停顿：动作 1 → 动作 2**。**T2 sweep** 音效。**转入：fade, 转出：fade** [转入: fade] [转出: fade] |
| **S07** | 42.17 | 50.11 | 7.94 | `video`+`code` | `005_pushup_plus.mov` | #11-12（action 2）| 俯卧撑+前伸演示：标准姿 / 跪姿。肩胛骨先往前推（让上背呈"凹陷"）然后收回。8-12 次。**右下角叠加 `<ActionDataCard name="俯卧撑+前伸" reps="8-12" sets="3" />`**。**转入：crossfade 0.3s, 转出：slide-left 0.3s** [转入: crossfade] [转出: slide-left] |
| **TR07** | 50.11 | 50.81 | 0.70 | `transition` | — | — | **段间停顿：动作 2 → 动作 3**。**T2 sweep** 音效。**转入：fade, 转出：fade** [转入: fade] [转出: fade] |
| **S08** | 50.81 | 58.16 | 7.35 | `video`+`code` | `006_ytwl.mov` | #13-14（action 3）| YTWL 演示：手握轻哑铃或矿泉水瓶，双臂按 Y→T→W→L 顺序，每字母位置停 2s。**机位：背对镜头**（唯一正确拍法）。**右下角叠加 `<ActionDataCard name="YTWL" reps="各 10-15" sets="4 字母" />`**。**转入：crossfade 0.3s, 转出：slide-left 0.3s** [转入: crossfade] [转出: slide-left] |
| **TR08** | 58.16 | 58.86 | 0.70 | `transition` | — | — | **段间停顿：动作 3 → 动作 4**。**T2 sweep** 音效。**转入：fade, 转出：fade** [转入: fade] [转出: fade] |
| **S09** | 58.86 | 66.80 | 7.94 | `video`+`code` | `007_band_pull_apart.mov` | #15-16（action 4）| 弹力带后收演示：双手握弹力带，手臂前平举与肩同宽，用力向两侧拉开，挤压肩胛骨停 1-2s。15-20 次。**机位：背对镜头**。**右下角叠加 `<ActionDataCard name="弹力带后收" reps="15-20" sets="3" />`**。**转入：crossfade 0.3s, 转出：slide-up 0.3s** [转入: crossfade] [转出: slide-up] |
| **TR09** | 66.80 | 67.50 | 0.70 | `transition` | — | — | **段间停顿：动作 4 → 收尾**。**T3 pop** 音效（柔和反馈）。**转入：fade, 转出：fade** [转入: fade] [转出: fade] |
| **S10** | 67.50 | 73.65 | 6.15 | `code`+`video` | 钩子对比 call back | #17-18（收尾）| 收尾 CTA：钩子对比 video 慢速回放（首尾呼应）+ 屏幕中央叠加 `<CTAButton text="去试试" subtext="评论区交作业" />`。视频淡出到 CTA 卡。**转入：crossfade 0.5s, 转出：fade 0.5s** [转入: crossfade] [转出: fade] |
| **TR10**（结尾） | 73.65 | 74.35 | 0.70 | `transition` | — | — | **结尾段间：CTA → 完**。黑屏 + 频道 logo。**无语音**。**T3 pop** 弱化。**转入：fade, 转出：fade** [转入: fade] [转出: fade] |

> 总时长 = 78s（包含 10 段段间停顿）。**实际音频 68.07s**——Phase 4 末尾需校准 m4a 真实时间戳。

---

## 2. 段间停顿镜头规范

| shot_id | 段间位置 | 音效 | 视觉 | 转入/转出 |
|---|---|---|---|---|
| TR01 | 钩子 → 主体 | T1 whoosh（"嗖"低频）| 黑屏 + "翼状肩胛"章节标题 | fade / fade |
| TR02 | intro → test 1 | T2 sweep | 空镜 + "自测 1"小标 | fade / fade |
| TR03 | test 1 → test 2 | T2 sweep | 空镜 + "自测 2"小标 | fade / fade |
| TR04 | test 2 → 过渡 | T2 sweep | "4 个动作改善"章节标题 | fade / fade |
| TR05 | 过渡 → 动作 1 | T2 sweep | "动作 1"小标 | fade / fade |
| TR06 | 动作 1 → 动作 2 | T2 sweep | "动作 2"小标 | fade / fade |
| TR07 | 动作 2 → 动作 3 | T2 sweep | "动作 3"小标 | fade / fade |
| TR08 | 动作 3 → 动作 4 | T2 sweep | "动作 4"小标 | fade / fade |
| TR09 | 动作 4 → 收尾 | T3 pop（柔和反馈）| "5 个"小标 → CTA 过渡 | fade / fade |
| TR10 | CTA → 完 | T3 pop 弱化 | 黑屏 + 频道 logo | fade / fade |

> **BGM 行为**：段间停顿期间 BGM 升回 -8dB（解除 ducking），段内维持 -12dB（ducking）。

---

## 3. 视频类镜头时长校验

按 [storyboard.md §3.1](../../rules/storyboard.md) "视频类镜头时长必须 > 5 秒"——检查：

| shot_id | 时长 | 视频素材 | 校验 |
|---|---|---|---|
| S01 | 3.53s | scapula_anatomy.png | ⚠️ 这是 image 不是 video，时长 3.5s OK（≤ 字幕时长）|
| S02 | 5.33s | 001_hook_compare.mov | ✅ > 5s |
| S03 | 8.82s | 002_mirror_test.mov | ✅ > 5s |
| S04 | 8.53s | 003_wall_push.mov | ✅ > 5s |
| S05 | 4.41s | 004_wall_slide.mov（intro 部分）| ⚠️ < 5s —— **违反**。解决：合并 S05 入 S06，或延展 S05 视频（拍摄时多录 1s）|
| S06 | 7.35s | 004_wall_slide.mov | ✅ > 5s |
| S07 | 7.94s | 005_pushup_plus.mov | ✅ > 5s |
| S08 | 7.35s | 006_ytwl.mov | ✅ > 5s |
| S09 | 7.94s | 007_band_pull_apart.mov | ✅ > 5s |
| S10 | 6.15s | 钩子对比 call back | ✅ > 5s |

> **S05 违反视频 ≥ 5s 约束**。**解决**：将 S05（4.41s 过渡）合并入 S06（7.35s 动作 1），S05 改成 image shot（静态卡 "4 个动作改善"），节省一个 video shot。

### 修正后的 shot 列表（合并 S05/S06）

| shot_id | start | end | duration | content_type | source | voiceover |
|---|---|---|---|---|---|---|
| S05' | 29.01 | 33.42 | 4.41 | `image` | `transition_card_4actions.png` | #8（"别担心..."）| "4 个动作改善"过渡卡（image）|
| S06' | 33.42 | 41.47 | 8.05 | `video`+`code` | `004_wall_slide.mov`（含 intro + 主体）| #9-10 | 壁虎推墙（含起始姿势 + 演示）|

> 修正后总 shot 数：10 + 10 段间 = 20 shots。所有 video shot ≥ 5s ✓

---

## 4. 必填字段校验

按 [storyboard.md §2](../../rules/storyboard.md) 校验：

- ✅ shot_id（唯一）= 1-20
- ✅ start / end / duration（连续，时间线闭合）
- ✅ content_type（6 选 1：video / image / animation / data_viz / screen_recording / composite / **transition** / **code_component**）
- ✅ content_source（视频文件名 / image 文件名 / 组件名 + props）
- ✅ voiceover（覆盖 18 段，无重复无遗漏）
- ✅ description（每镜有实际视觉描述，不空洞）
- ✅ 转入/转出动效（每个 shot 边界标注）
- ✅ 段间停顿 shot（content_type=transition，9 个 + 1 个结尾）

---

## 5. 与字幕对齐

每个 shot 的 start/end 必须与 [subtitles.json](subtitles.json) 的 voiceover segments 严格对齐。

**当前 draft 字幕时间戳基于中速 3.4 字/秒**——**与实际 m4a 68.07s 差 5.3s**。

**校准方案**：
1. 用户跑 mmx 真实识别 → 提供真实 start/end
2. 替换 subtitles.json 的 time
3. 用真实时间重算所有 shot 的 start/end
4. 重新跑 storyboard 校准

---

## 6. 实现优先级

| 优先级 | 任务 | 原因 |
|---|---|---|
| **P0** | 用户自拍 7 段视频（按 [shoot-checklist.md](shoot-checklist.md)）| 阻塞所有 video shot |
| **P0** | mmx 生成 3 个 sfx（whoosh / sweep × 3 / pop × 2）| 阻塞段间停顿 |
| **P1** | 实现 4 个 `<ActionDataCard>` 组件 | 阻塞 S06-S09 |
| **P1** | 实现 1 个 `<CTAButton>` 组件 | 阻塞 S10 |
| **P2** | 写 Scene 组件组装 20 个 shots | 阻塞渲染 |
| **P2** | mmx 校准 subtitles.json 真实时间戳 | 校准所有 shot 边界 |
