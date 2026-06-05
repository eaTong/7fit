# 素材清单：翼状肩胛自测 + 改善：4 个动作

**视频主题**：winged_scapula_b3
**视频类型**：B 类 — 健身知识
**目标账号**：主号（健身博主号）
**BGM 类型**：Power Build（105 BPM, tech house）
**目标时长**：~74 秒（含 9 段段间停顿 = 实际 m4a 68.07s + sfx）
**生成日期**：2026-06-05（v8 更新：方案 C 混合 + 9 段间 + 3 sfx）
**关联脚本**：[copy.md](../../../docs/copy/winged_scapula_b3.md)（v7 18 段 / 中速 3.4 / 66s 预期）
**关联分镜**：[storyboard.md](storyboard.md) + [storyboard.json](storyboard.json)（20 个 shot：10 主 + 10 段间 transition）
**关联字幕**：[subtitles.json](subtitles.json)（draft 18 段，待 mmx 校准）
**关联拍摄清单**：[shoot-checklist.md](shoot-checklist.md)

---

## 0. 状态总览

| 类别 | 总数 | ✅ 就位 | 📋 待拍 | ❌ 缺失 | 🆕 待实现 |
|---|---|---|---|---|---|
| 视频（用户自拍） | 4 | 0 | 4 | 0 | - |
| 视频（mmx 生成） | 3 | 0 | - | 3 | - |
| 图片（mmx 生成） | 1 | 1 | - | 0 | - |
| 图片（mmx 过渡卡） | 1 | 0 | - | 1 | - |
| 音频（用户自录 m4a） | 1 | 1 | - | 0 | - |
| 音频（mmx BGM mp3） | 1 | 1 | - | 0 | - |
| 🆕 转场音效 sfx | 3 | 0 | - | 3 | - |
| 代码组件 | 5 | 0 | - | - | 5 |
| **合计** | **19** | **3** | **4** | **7** | **5** |

> 📌 **v8 决策**（2026-06-05）：视频从"7 段全自拍"改为**方案 C 混合**——
> - **4 段用户自拍**（动作 1-4 演示，质量高，必须自拍）
> - **3 段 mmx 生成**（钩子对比 / 自测 1 镜子 / 自测 2 推墙——自测类不依赖动作真实度）
>
> 同时新增：1 张 mmx 过渡卡（"4 个动作改善"）+ 3 个 sfx（whoosh/sweep×3/pop×2）+ 1 个 CTAButton 组件。

---

## 1. 全部资产（单表，按 # 排序）

> 数字 # 与"§2 路径清单"一一对应。
> **已就位=3 / 待拍=4 / 缺失=7 / 待实现=5。**

| # | 类型 | 状态 | 描述 | 拍摄要求（仅视频）/ 备注 |
|---|---|---|---|---|
| 1 | video | 📋 待拍 | **动作 1**：壁虎推墙（前臂贴墙滑，肩胛骨下沉）| **机位**：侧面 90°<br>**光线**：自然光侧方<br>**时长**：≥ 10s（取 12-15 次循环中 10s 关键段）<br>**动作**：面对墙 / 脚尖离墙 15-30cm / 前臂贴墙 / 沿墙缓慢向上滑到最高 / 停 2s / 缓慢滑下 / **全程肩胛骨下沉不耸肩**<br>**其他**：慢速演示 / 露出肩胛骨 |
| 2 | video | 📋 待拍 | **动作 2**：俯卧撑+肩胛骨前伸 | **机位**：侧面 90°<br>**光线**：自然光<br>**时长**：≥ 10s（取 8-12 次循环中 10s 关键段）<br>**动作**：俯卧撑起始姿势 / 肩胛骨先往前推（让上背呈"凹陷"）/ 然后收回（中立位）<br>**其他**：新手可跪姿 / 不塌腰 / 露出肩胛骨 |
| 3 | video | 📋 待拍 | **动作 3**：YTWL 4 个字母动作 | **机位**：背对镜头（**唯一正确拍法**——能看清肩胛骨后收）<br>**光线**：均匀 / 浅色背景<br>**时长**：≥ 12s（Y/T/W/L 各字母 2-3s 演示）<br>**动作**：手握轻哑铃或矿泉水瓶 / 双臂按 Y→T→W→L 顺序做 / 每字母位置停 2s / **全程不耸肩**<br>**其他**：1-2kg 轻哑铃 / 露出肩胛骨 |
| 4 | video | 📋 待拍 | **动作 4**：弹力带后收 | **机位**：背对镜头<br>**光线**：均匀<br>**时长**：≥ 10s（取 15-20 次循环中 10s 关键段）<br>**动作**：双手握弹力带 / 手臂前平举与肩同宽 / 用力向两侧拉开 / 拉到最大挤压肩胛骨停 1-2s / 缓慢收回<br>**其他**：轻阻力弹力带（绿色或蓝色）/ 露出肩胛骨 |
| 5 | video | ❌ 缺失 | **钩子对比**（mmx 生成）：背对镜头肩胛骨翼状 vs 正常对比 | 适合 mmx 假人——**抽象对比演示**。mmx prompt: dark bg, mono 5s loop, "winged scapula comparison" |
| 6 | video | ❌ 缺失 | **自测 1：镜子**（mmx 生成）：背对落地镜自然站立 | mmx prompt: person facing mirror, side view, 5s |
| 7 | video | ❌ 缺失 | **自测 2：推墙**（mmx 生成）：面对墙推墙，侧面拍 | mmx prompt: person pushing wall, side view 45°, 8s |
| 8 | image | ✅ 就位 | 翼状肩 vs 正常肩胛 解剖示意（钩子背景用）| - |
| 9 | image | ❌ 缺失 | "4 个动作改善"过渡卡（"别担心今天教你 4 个动作"）| mmx prompt: 章节标题卡 / dark bg / 橙红数字 "4" + 白色文字 |
| 10 | voiceover | ✅ 就位 | 旁白（**3.4 字/秒 × 196 字 ≈ 58s**，含 2.1s 段间停顿 = 全文 66s）| **M4A / AAC-LC / 单声道 / 48kHz / 65kbps** / 必用户自录（iPhone 语音备忘录）|
| 11 | bgm | ✅ 就位 | BGM Power Build | 105 BPM / tech house / Dm / **≥ 71s** 可循环（实测 149.7s ✓）|
| T1 | sfx 🆕 | ❌ 缺失 | **段间 T1：whoosh**（钩子→主体，"嗖"低频滑动）| 0.3-0.5s / mmx prompt: whoosh transition, low frequency, 0.5s |
| T2 | sfx 🆕 | ❌ 缺失 | **段间 T2：sweep × 3**（intro→test1, test1→test2, 动作间各一次）| 0.3-0.5s / mmx prompt: short sweep, mid frequency, 0.3s |
| T3 | sfx 🆕 | ❌ 缺失 | **段间 T3：pop × 2**（动作 4→收尾, 收尾→完）| 0.3-0.5s / mmx prompt: pop, soft, feedback, 0.3s |
| C1 | code | 🆕 待实现 | `<ActionDataCard>` 壁虎推墙 · 12-15 × 3 | `{ name: "壁虎推墙", reps: "12-15", sets: "3" }` |
| C2 | code | 🆕 待实现 | `<ActionDataCard>` 俯卧撑+前伸 · 8-12 × 3 | `{ name: "俯卧撑+前伸", reps: "8-12", sets: "3" }` |
| C3 | code | 🆕 待实现 | `<ActionDataCard>` YTWL · 各 10-15 | `{ name: "YTWL", reps: "各 10-15", sets: "4 字母" }` |
| C4 | code | 🆕 待实现 | `<ActionDataCard>` 弹力带后收 · 15-20 × 3 | `{ name: "弹力带后收", reps: "15-20", sets: "3" }` |
| C5 | code 🆕 | 🆕 待实现 | `<CTAButton>` 收尾 CTA "去试试 / 评论区交作业" | `{ text: "去试试", subtext: "评论区交作业" }` |

---

## 2. 路径清单（单份）

| # | 状态 | 源路径 | 目标位置 |
|---|---|---|---|
| 1 | 📋 待拍 | `resources/videos/winged_scapula_b3_004_wall_slide.mov` | `remotion/public/winged_scapula_b3/videos/004_wall_slide.mov` |
| 2 | 📋 待拍 | `resources/videos/winged_scapula_b3_005_pushup_plus.mov` | `remotion/public/winged_scapula_b3/videos/005_pushup_plus.mov` |
| 3 | 📋 待拍 | `resources/videos/winged_scapula_b3_006_ytwl.mov` | `remotion/public/winged_scapula_b3/videos/006_ytwl.mov` |
| 4 | 📋 待拍 | `resources/videos/winged_scapula_b3_007_band_pull_apart.mov` | `remotion/public/winged_scapula_b3/videos/007_band_pull_apart.mov` |
| 5 | ❌ 缺失 | `resources/videos/winged_scapula_b3_001_hook_compare.mov` | `remotion/public/winged_scapula_b3/videos/001_hook_compare.mov` |
| 6 | ❌ 缺失 | `resources/videos/winged_scapula_b3_002_mirror_test.mov` | `remotion/public/winged_scapula_b3/videos/002_mirror_test.mov` |
| 7 | ❌ 缺失 | `resources/videos/winged_scapula_b3_003_wall_push.mov` | `remotion/public/winged_scapula_b3/videos/003_wall_push.mov` |
| 8 | ✅ 就位 | `resources/images/winged_scapula_b3_scapula_anatomy_01.png` | `remotion/public/winged_scapula_b3/images/scapula_anatomy.png` |
| 9 | ❌ 缺失 | `resources/images/winged_scapula_b3_transition_4actions.png` | `remotion/public/winged_scapula_b3/images/transition_4actions.png` |
| 10 | ✅ 就位 | `resources/audios/winged_scapula_b3.m4a` | `remotion/public/winged_scapula_b3/audios/winged_scapula_b3.m4a` |
| 11 | ✅ 就位 | `resources/audios/bgm/power_build.mp3` | `remotion/public/winged_scapula_b3/audios/bgm/power_build.mp3` |
| T1 | ❌ 缺失 | `resources/audios/sfx/winged_scapula_b3_T1_whoosh.mp3` | `remotion/public/winged_scapula_b3/audios/sfx/T1_whoosh.mp3` |
| T2 | ❌ 缺失 | `resources/audios/sfx/winged_scapula_b3_T2_sweep.mp3` | `remotion/public/winged_scapula_b3/audios/sfx/T2_sweep.mp3` |
| T3 | ❌ 缺失 | `resources/audios/sfx/winged_scapula_b3_T3_pop.mp3` | `remotion/public/winged_scapula_b3/audios/sfx/T3_pop.mp3` |

---

## 3. 代码组件 TODO（`code_component`）

> 对应 §1 表格 #C1-#C5。完成后翻 ✅。

| # | 组件名 | 用途 | props | 引用位置 |
|---|---|---|---|---|
| C1 | `<ActionDataCard>` | 动作 1 数据卡：壁虎推墙 · 12-15 × 3 | `{ name, reps, sets }` | Shot S06（动作 1 演示）|
| C2 | `<ActionDataCard>` | 动作 2 数据卡：俯卧撑+前伸 · 8-12 × 3 | `{ name, reps, sets }` | Shot S07（动作 2 演示）|
| C3 | `<ActionDataCard>` | 动作 3 数据卡：YTWL · 各 10-15 | `{ name, reps, sets }` | Shot S08（动作 3 演示）|
| C4 | `<ActionDataCard>` | 动作 4 数据卡：弹力带后收 · 15-20 × 3 | `{ name, reps, sets }` | Shot S09（动作 4 演示）|
| C5 | `<CTAButton>` 🆕 | 收尾 CTA："去试试 / 评论区交作业" | `{ text, subtext }` | Shot S10（收尾）|

**实现位置**：
- `<ActionDataCard>`：`remotion/src/components/ActionDataCard.tsx`（跨视频复用）
- `<CTAButton>`：`remotion/src/components/CTAButton.tsx`（跨视频复用）

---

## 4. 推荐执行顺序

```
第 1 步（mmx 端：批量生成 7 个缺失项）：
  - 3 个视频（#5 钩子对比 / #6 自测 1 / #7 自测 2）
  - 1 个过渡卡图（#9 "4 个动作改善"）
  - 3 个 sfx（T1 whoosh / T2 sweep / T3 pop）
  → 全部 mmx 生成（同步）

第 2 步（用户：按 [shoot-checklist.md](shoot-checklist.md) 拍摄 4 段视频）：
  - 拍完一段拷到 resources/videos/，然后 cp 到 public/

第 3 步（开发：实现 5 个代码组件）：
  - 4 个 ActionDataCard（共用一个组件，4 个 props 变体）
  - 1 个 CTAButton

第 4 步（mmx：用刚录的 m4a 识别字幕 → subtitles.json 校准）

第 5 步（开发：实现 Scene 组件 + 集成 BGM + 转场 + sfx）

第 6 步（跑 [checklist.md](../../rules/checklist.md) 自检 → 等用户说"开始渲染"）
```

---

## 5. 拍摄清单

> ⚠️ **已拆到独立文件**：[shoot-checklist.md](shoot-checklist.md) — 拍摄当天打开这个文件。
> 本文件 §1 表格里"拍摄要求"列是技术规格，shoot-checklist.md 是执行清单。
>
> **v8 变化**：自拍段数从 7 → 4（钩子对比 + 镜子 + 推墙 改 mmx 生成）。
