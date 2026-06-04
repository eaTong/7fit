# 素材清单：翼状肩胛自测 + 改善：4 个动作

**视频主题**：winged_scapula_b3
**视频类型**：B 类 — 健身知识（体态问题）
**目标账号**：主号（健身博主号）
**BGM 类型**：Power Build（105 BPM, tech house）
**目标时长**：~50 秒
**生成日期**：2026-06-04
**关联脚本**：[resources/docs/copy/winged_scapula_b3.md](../../../docs/copy/winged_scapula_b3.md)
**关联分镜**：[research.md §8 视频结构建议](research.md) （待生成 storyboard.md）

---

## 0. 状态总览（看一眼这块就知道整体进度）

| 类别 | 总数 | ✅ 已生成 | ❌ 缺失 / 📋 待拍 | 阻塞 |
|---|---|---|---|---|
| 视频（用户自拍） | 7 | 0 | 7 📋 待拍 | **全部阻塞** |
| 图片（mmx 生成） | 1 | 1 | 0 | - |
| 音频（用户自录） | 1 | 1 | 0 | - |
| 音频（mmx BGM） | 1 | 1 | 0 | - |
| **外部素材合计** | **10** | **3** | **7** | 7 |
| 🆕 代码组件（`code_component`） | 4 | 0 | 4 ❌ 待实现 | - |

> **🆕 2026-06-04 规则更新**（[assets.md §1.4](../../rules/assets.md#14-⚠️-可代码实现的内容不进-assetsmd强约束)）：
> 原计划 4 张动作数据卡（`param_1_wall_slide.png` 等）**改用 `<ActionDataCard>` 组件代码实现**——
> 不进 assets.md，不消耗 mmx 配额。**mmx 实际只生成 1 张图**（`scapula_anatomy.png` 解剖示意，AI 优势项）。
>
> **当前阶段**：mmx 端 100% 完成（图片 1/1 + 音频 2/2）。**只剩用户自拍 7 段视频 + 4 个代码组件待实现**。
> **预期开工时间**：1.5-2 小时（按 [assets.md §6 拍摄清单](assets.md#6-拍摄清单执行前自检)）

---

## 1. 视频素材（用户自拍为主——共 7 段）

> 按 research.md §8 视频结构排序
> ⚠️ **所有视频都依赖用户自拍**——是当前唯一阻塞

### 1.1 钩子 + 自测 1 素材

#### 文件路径清单

- **#1**: `resources/videos/winged_scapula_b3_001_hook_compare.mov` → `remotion/public/winged_scapula_b3/videos/001_hook_compare.mov`
- **#2**: `resources/videos/winged_scapula_b3_002_mirror_test.mov` → `remotion/public/winged_scapula_b3/videos/002_mirror_test.mov`

| # | 状态 | 类型 | 描述 | 来源 | 拍摄要求 |
|---|---|---|---|---|---|
| 1 | ❌ 📋 待拍 | video | 用户背对镜头，肩胛骨翼状 vs 正常对比演示（让观众一眼看出"翼状"长什么样）| 用户自拍 | **机位**：背对镜头 / 镜头平齐肩部 / 距离 1.5m<br>**光线**：自然光从左前方 45° / 避免顶光和逆光<br>**时长**：≥ 10s（可截 3-5s 关键帧）<br>**动作**：自然站立 / 双手垂在身侧 / 缓慢转 30° 展示肩胛骨<br>**其他**：穿贴身运动衣 / **必须露出肩胛骨**（不能宽松遮挡）/ 背景用浅色墙 / 不要有镜子反光 |
| 2 | ❌ 📋 待拍 | video | 镜子自测 1：背对镜子，自然站立，肩放松手垂下 | 用户自拍 | **机位**：背对一面落地镜 / 朋友从朋友拍 / 或自己用定时拍摄<br>**光线**：均匀 / 镜子不要反光<br>**时长**：≥ 5s<br>**动作**：自然站立 / 肩完全放松 / 手垂下 / 不要挺胸<br>**其他**：朋友站在镜子侧前方拍 / 露出肩胛骨 |

### 1.2 自测 2 素材

#### 文件路径清单

- **#3**: `resources/videos/winged_scapula_b3_003_wall_push.mov` → `remotion/public/winged_scapula_b3/videos/003_wall_push.mov`

| # | 状态 | 类型 | 描述 | 来源 | 拍摄要求 |
|---|---|---|---|---|---|
| 3 | ❌ 📋 待拍 | video | 推墙测试：面对墙双手前平举推墙，让朋友从背后看 | 用户自拍 | **机位**：侧面 45°（拍到墙 + 用户的全身）<br>**光线**：自然光从侧方<br>**时长**：≥ 10s（推墙保持 5-8 秒 + 收回 2s）<br>**动作**：面对墙 / 双臂前平举与肩同高 / 掌心贴墙 / 推出去 5 秒 / 收回<br>**其他**：需要 1 个朋友帮忙 / 朋友站用户斜后方 / 露出肩胛骨 |

### 1.3 4 个动作素材

#### 文件路径清单

- **#4**: `resources/videos/winged_scapula_b3_004_wall_slide.mov` → `remotion/public/winged_scapula_b3/videos/004_wall_slide.mov`
- **#5**: `resources/videos/winged_scapula_b3_005_pushup_plus.mov` → `remotion/public/winged_scapula_b3/videos/005_pushup_plus.mov`
- **#6**: `resources/videos/winged_scapula_b3_006_ytwl.mov` → `remotion/public/winged_scapula_b3/videos/006_ytwl.mov`
- **#7**: `resources/videos/winged_scapula_b3_007_band_pull_apart.mov` → `remotion/public/winged_scapula_b3/videos/007_band_pull_apart.mov`

| # | 状态 | 类型 | 描述 | 来源 | 拍摄要求 |
|---|---|---|---|---|---|
| 4 | ❌ 📋 待拍 | video | 动作 1 演示：壁虎推墙（前臂贴墙往上滑，肩胛骨下沉）| 用户自拍 | **机位**：侧面 90°（看得到侧身全貌）<br>**光线**：自然光侧方<br>**时长**：≥ 30s（12-15 次完整循环）<br>**动作**：面对墙 / 脚尖离墙 15-30cm / 前臂和手掌贴墙 / 大小臂 90° / 沿墙缓慢向上滑到最高 / 停留 2 秒 / 缓慢滑下 / **全程肩胛骨下沉不能耸肩**<br>**其他**：慢速演示（让观众看清动作）/ 露出肩胛骨 / 不要只拍头/颈 |
| 5 | ❌ 📋 待拍 | video | 动作 2 演示：俯卧撑+肩胛骨前伸（标准姿 / 或跪姿）| 用户自拍 | **机位**：侧面 90°（看得到全身起伏）<br>**光线**：自然光<br>**时长**：≥ 25s（8-12 次完整循环）<br>**动作**：俯卧撑起始姿势 / 肩胛骨先往前推（让上背呈"凹陷"）/ 然后收回（中立位）/ 这是完整一次 / **核心是"前伸"那一下**<br>**其他**：新手可从跪姿开始 / 不要塌腰 / 露出肩胛骨 |
| 6 | ❌ 📋 待拍 | video | 动作 3 演示：YTWL 4 个字母动作（Y/T/W/L）| 用户自拍 | **机位**：背对镜头（**这是 Y/T/W/L 唯一正确的拍法**——能看清肩胛骨后收）<br>**光线**：均匀 / 浅色背景<br>**时长**：≥ 45s（4 个字母各 10-15 次）<br>**动作**：手握轻哑铃或矿泉水瓶 / 双臂按 Y→T→W→L 顺序做 / 每个字母位置停 2 秒 / **全程不耸肩** / 感受肩胛骨向中间夹<br>**其他**：建议用 1-2kg 轻哑铃 / 露出肩胛骨 |
| 7 | ❌ 📋 待拍 | video | 动作 4 演示：弹力带后收 | 用户自拍 | **机位**：背对镜头<br>**光线**：均匀<br>**时长**：≥ 30s（15-20 次完整循环）<br>**动作**：双手握弹力带 / 手臂前平举与肩同宽 / 用力向两侧拉开弹力带 / 拉到最大时挤压肩胛骨停 1-2 秒 / 缓慢收回 / **重点不是手臂 是肩胛骨向中间夹**<br>**其他**：用轻阻力弹力带（绿色或蓝色）/ 露出肩胛骨 |

---

## 2. 图片素材（mmx 生成——共 1 张，✅ 已就位）

#### 文件路径清单

- **#1**: `resources/images/winged_scapula_b3_scapula_anatomy.png` → `remotion/public/winged_scapula_b3/images/scapula_anatomy.png`

| # | 状态 | 类型 | 描述 | 来源 | 备注 |
|---|---|---|---|---|---|
| 1 | ✅ 已生成 | image | 翼状肩 vs 正常肩胛骨 示意（用于钩子背景 / 自测参照）| mmx 生成 | 1080×1920 竖屏 / 暗色 `#0A0A0A` / 橙 `#FF4500` 高亮 / 半透明 |

> **🆕 变更**：原计划 4 张动作数据卡（`param_*.png`）已从本节**移除**——按 [assets.md §1.4](../../rules/assets.md#14-⚠️-可代码实现的内容不进-assetsmd强约束) 改用代码组件实现，详见 §4。

---

## 3. 音频素材

#### 文件路径清单

- **#1**: `resources/audios/winged_scapula_b3.mp3` → `remotion/public/winged_scapula_b3/audios/winged_scapula_b3.mp3`
- **#2**: `resources/audios/bgm/power_build.mp3` → `remotion/public/winged_scapula_b3/audios/bgm/power_build.mp3`

| # | 状态 | 类型 | 描述 | 来源 | 备注 |
|---|---|---|---|---|---|
| 1 | ✅ 已生成 | voiceover | 旁白（4.8 字/秒 × 244 字 ≈ 50 秒）| **用户自录**（不用 TTS）| MP3 / 128kbps+ / 单声道 / 44.1kHz / [copy.md §9 录音规范](../../rules/copy.md#9-用户自录旁白规范2026-06-04-起-tts-退役) |
| 2 | ✅ 已生成 | bgm | BGM（Power Build 类型）| mmx 生成 | 105 BPM / tech house / Dm / ≥ 50s 可循环 / [bgm.md 第 4.2 节](../../rules/bgm.md) |

---

## 4. 代码组件（`code_component`——不进 mmx 配额）

> 🆕 **2026-06-04 新增**（[assets.md §1.4](../../rules/assets.md#14-⚠️-可代码实现的内容不进-assetsmd强约束) + [script.md §10](../../rules/script.md#10-可复用数据组件库强约束配合-assetsmd-§14)）。
> 下面 4 个组件**不是外部素材**，是 Remotion 代码实现。**完成后 §0 状态总览里"代码组件"那行翻成 ✅**。

| # | 状态 | 组件名 | 用途 | props | 引用位置 |
|---|---|---|---|---|---|
| C1 | ❌ 待实现 | `<ActionDataCard>` | 动作 1 数据卡：壁虎推墙 · 12-15 次 × 3 组 · RPE 7 | `{ name: "壁虎推墙", reps: "12-15", sets: "3", rpe: "7" }` | Shot S05（动作 1 演示）|
| C2 | ❌ 待实现 | `<ActionDataCard>` | 动作 2 数据卡：俯卧撑+前伸 · 8-12 次 × 3 组 | `{ name: "俯卧撑+前伸", reps: "8-12", sets: "3" }` | Shot S07（动作 2 演示）|
| C3 | ❌ 待实现 | `<ActionDataCard>` | 动作 3 数据卡：YTWL · 各 10-15 次 | `{ name: "YTWL", reps: "10-15", sets: "4" }` | Shot S09（动作 3 演示）|
| C4 | ❌ 待实现 | `<ActionDataCard>` | 动作 4 数据卡：弹力带后收 · 15-20 次 × 3 组 | `{ name: "弹力带后收", reps: "15-20", sets: "3" }` | Shot S11（动作 4 演示）|

**实现位置**：`remotion/src/components/ActionDataCard.tsx`（**跨视频复用**——不止本视频用）

**实现模板**：见 [script.md §10.3](../../rules/script.md#103-实现示例actiondatacard-骨架) 的 `<ActionDataCard>` 骨架

**完成判据**：
- [ ] `remotion/src/components/ActionDataCard.tsx` 文件存在
- [ ] 4 个 Shot 在 Scene 组件中 import 并使用，props 与上表一致
- [ ] 启动 Studio 预览：每张数据卡 spring 弹入正常，数字橙底 + 白色文字

---

## 5. 状态汇总

- **已就位**：3 项（1 图片 + 2 音频）
- **待生成/获取**：7 项（7 视频，**全部用户自拍**）
- **待代码实现**：4 项（4 个 `<ActionDataCard>` 数据卡）
- **阻塞情况**：
  - 7 个视频素材**全部依赖用户自拍**——不能开工
  - 1 个旁白音频**用户自录**——可以并行
  - 1 个 BGM **已生成**（mmx）——完成
  - 4 个代码组件**依赖开发**——可与视频拍摄并行

### 5.1 推荐执行顺序

```
第 1 步（并行）：
  - 用户拍 7 个视频素材（预计 1.5-2 小时）
  - 用户录旁白
  - 开发 <ActionDataCard> 组件（预计 30 分钟）
  - mmx 端已完成

第 2 步：
  - 全部就位 → 复制到 remotion/public/winged_scapula_b3/
  - 跑 checklist.md 自检

第 3 步：
  - 实现 Scene 组件
  - 启动 Studio 预览
  - 等用户说"开始渲染"
```

---

## 6. 拍摄清单（执行前自检）

### 6.1 通用要求（所有视频）

- [ ] 着装：穿贴身运动衣 / **必须露出肩胛骨**（不能宽松遮挡）
- [ ] 背景：浅色墙（健身房一角 / 居家干净墙角） / 避免杂物
- [ ] 设备：三脚架固定 / 或找朋友帮拍
- [ ] 画质：1080p / 30fps / 4K 更好 / 横平竖直
- [ ] 收音：iPhone 单独录旁白（不用视频自带 mic）
- [ ] 试拍：拍前先 1 段测试，检查焦点、亮度、肩胛骨可见性

### 6.2 各段特别要求

- [ ] #1（钩子对比）：**必须背对镜头** / 自然光侧方 / 完整露出两侧肩胛骨
- [ ] #2（镜子自测）：需要镜子 + 朋友 / 或定时自拍
- [ ] #3（推墙测试）：需要 1 个朋友帮忙 / 从背后拍
- [ ] #4-7（4 个动作）：**机位都是背对或侧面**——核心是让观众看清肩胛骨

---

## 7. 与其他 docs 的对齐

| 时机 | 动作 | 文档 |
|---|---|---|
| 写完 copy 后 | 生成本 assets.md | [copy.md](../../../docs/copy/winged_scapula_b3.md) → assets.md |
| 用户准备拍视频 | 看本文件 §6 拍摄清单 | assets.md |
| 用户拍完 | 复制到 `remotion/public/` | [assets.md 规则第 3 节](../../rules/assets.md) |
| 跑自检 | 对齐本文件"已就位"列表 | [checklist.md](../../rules/checklist.md) |
| 实现 Scene | 用本文件 §4 组件 props + §2/§3 路径清单 | [script.md](../../rules/script.md) |
