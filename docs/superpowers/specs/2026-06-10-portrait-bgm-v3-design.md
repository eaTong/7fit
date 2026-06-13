# 竖屏铁律 + BGM Per-Topic 规范 v3 — 设计文档

| 字段 | 值 |
|---|---|
| **日期** | 2026-06-10 |
| **作者** | Claude (brainstorming) |
| **状态** | ✅ 用户已批准（5 段设计）|
| **实施方案** | A · 最小硬约束 + 文档修正（无 SFX 自动化） |
| **影响文件** | 5 个（1 修 + 1 移 + 1 fix + 1 重写 + 1 小改） |

---

## 1 · 背景与目标

### 1.1 问题陈述

**两个独立但同源的问题**：

1. **竖屏铁律未在框架层硬约束**：
   - `hyperframe/index.html` 根画布当前为 **1920×1080 横屏**（line 5, 9, 18-19）
   - 根里第一个 composition `01_test` 是 1920×1080（横屏测试产物）
   - `gen-scene.js` 在 scene 层加了硬约束（line 260-265），但**根 composition 没有任何机制拦截**
   - 如果未来有人新建横屏 composition，根层无法防御

2. **BGM 工具与文档不一致**：
   - `tools/gen-bgm.js` v2（2026-06-10）已实现 per-topic 命名 + section cue prompt
   - `rules/bgm.md` v2（2026-06-09）仍写"共享预设文件名"（`cyber_pulse.mp3 / power_build.mp3` 等）
   - `tools/mmx.md` §1.1 / §4.3 / §6.3 路径约定也是 `<类型>.mp3`
   - **存在同名 `power_build.mp3` 共享文件**（4.8MB），新规则过渡期可能产生混淆

### 1.2 目标

- **框架层硬约束**：根 `index.html` 写死 1080×1920，任何新 composition 都在此画布下渲染，无法默认出横屏
- **文档与工具对齐**：所有规则文档的"输出位置"从"类型名"改为"`<topic>.mp3`"
- **不破坏现状**：保留 `power_build.mp3` 旧文件不删；新视频走 per-topic 路径
- **修复遗留不一致**：现有 `gym_machine_judge_b13.html` 的 BGM src 指向 `power_build.mp3`，与新规则不符，顺手 fix

### 1.3 非目标

- **不**实现 BGM 关键点 SFX 自动注入（属方案 B 范围，本设计不涉及）
- **不**新增 `tools/check-canvas.js` 校验脚本（属方案 C 范围）
- **不**改 `gen-bgm.js` 实现（已符合新规则）
- **不**改 `gen-scene.js` 的竖屏硬约束（已生效）
- **不**改 `render.md`（"默认 1080×1920"已写明）

---

## 2 · 范围：5 个文件改动

| # | 文件 | 类型 | 关键变化 |
|---|---|---|---|
| 1 | `hyperframe/index.html` | 修改 | 根画布硬约束 1080×1920；移除 `01_test` 引用 |
| 2 | `hyperframe/compositions/01_test.html` | 移动 | → `compositions/_legacy/01_test.html`（横屏测试产物归档） |
| 3 | `hyperframe/compositions/gym_machine_judge_b13.html` | Fix | line 88 BGM src 改 `<topic>.mp3` 路径 |
| 4 | `rules/bgm.md` | 重写 v2 → v3 | 6 处改写 + 1 节新增 + 反模式 + 评分卡 |
| 5 | `tools/mmx.md` | 小改 3 处 | §1.1 / §4.3 / §6.3 路径约定同步 |

**配套生成**（gen-bgm.js 副作用，不算独立文件）：
- `resources/audios/bgm/gym_machine_judge_b13.mp3`（per-topic BGM，~4-5MB）
- `resources/audios/bgm/gym_machine_judge_b13.cues.json`（section cue 元数据）
- `compositions/_legacy/README.md`（一行说明 _legacy 目录用途）

**显式不动**：
- `power_build.mp3` 保留在 `resources/audios/bgm/`（用户已确认）
- `gen-bgm.js` v2 不动
- `gen-scene.js` 不动
- `CLAUDE.md`、`render.md`、`script.md` 不动

---

## 3 · 改动 §1 — `hyperframe/index.html` 根画布硬约束

### 3.1 viewport meta（line 5）

```html
<!-- before -->
<meta name="viewport" content="width=1920, height=1080" />
<!-- after -->
<meta name="viewport" content="width=1080, height=1920" />
```

### 3.2 body CSS（line 9）

```css
/* before */ html, body { ... width: 1920px; height: 1080px; ... }
/* after  */ html, body { ... width: 1080px; height: 1920px; ... }
```

### 3.3 根 section（line 13-20）

```html
<!-- before -->
<div id="root" data-composition-id="main" data-start="0" data-duration="10"
     data-width="1920" data-height="1080">
<!-- after -->
<div id="root" data-composition-id="main" data-start="0" data-duration="62.33"
     data-width="1080" data-height="1920">
```

> `data-duration` 改为当前最长 comp 的时长（gym_machine_judge_b13 = 62.33s）。根 duration 是 Hyperframes 引擎 seek 的上限，按"**最长 comp 写入**"原则。
>
> **后续维护规则**：每新增一个 comp，如果其 `data-duration` > 根 duration，必须同步把根 duration 改为新最大值。

### 3.4 移除 `01_test` 引用（line 21-27）

删除整段：
```html
<div id="composition-01_test"
     data-composition-id="01_test"
     data-composition-src="compositions/01_test.html"
     data-start="0"
     data-duration="10"
     data-width="1920"
     data-height="1080"></div>
```

### 3.5 保留 `gym_machine_judge_b13` 引用（line 29-35）

不变。

---

## 4 · 改动 §2 — `01_test.html` 移到 `_legacy/`

### 4.1 移动

```bash
mkdir -p hyperframe/compositions/_legacy
git mv hyperframe/compositions/01_test.html hyperframe/compositions/_legacy/01_test.html
```

### 4.2 新增 `_legacy/README.md`

```markdown
# _legacy/

历史测试 composition 归档目录。文件不符合项目当前规范（竖屏 1080×1920）。

- `01_test.html` — 横屏 1920×1080 早期测试产物，已废弃

新 composition 请直接放 `compositions/` 根目录。
```

---

## 5 · 改动 §3 — `gym_machine_judge_b13.html` BGM ref fix

### 5.1 修改 line 88

```html
<!-- before -->
<audio id="bgm" src="../assets/audios/bgm/power_build.mp3"
       data-start="0" data-duration="62.33" data-track-index="1" preload="auto"></audio>

<!-- after -->
<audio id="bgm" src="../../resources/audios/bgm/gym_machine_judge_b13.mp3"
       data-start="0" data-duration="62.33" data-track-index="1" preload="auto"></audio>
```

> 路径由 `../assets/...` 改为 `../../resources/...`：scene.html 在 `hyperframe/compositions/` 下，`../` 一次 = `hyperframe/`，二次 = 项目根。

### 5.2 生成 per-topic BGM

```bash
node tools/gen-bgm.js gym_machine_judge_b13
```

**预期输出**：
- `resources/audios/bgm/gym_machine_judge_b13.mp3`（4-5MB，新生成）
- `resources/audios/bgm/gym_machine_judge_b13.cues.json`（section cue 元数据）
- `resources/audios/bgm/power_build.mp3`（4.8MB，**保留**不删）

### 5.3 验证

```bash
ls -la resources/audios/bgm/  # 应见 2 个 mp3 + 1 个 cues.json
cat resources/audios/bgm/gym_machine_judge_b13.cues.json  # 检查 sections 数与 storyboard 一致
cd hyperframe && npm run check  # lint + validate + inspect 通过
```

---

## 6 · 改动 §4 — `bgm.md` v2 → v3 改写

### 6.1 顶部新增 §0 v3 重点（3 行摘要）

```markdown
## 0 · v3 重点（2026-06-10）

1. **Per-topic 命名**：每个视频独立 BGM 文件 `resources/audios/bgm/<topic>.mp3`（不再用 `cyber_pulse.mp3` / `power_build.mp3` 等共享预设名）
2. **每次重新生成**：新视频必须调 `gen-bgm.js` 生成，不复用旧文件
3. **Section cue 情绪提示**：长视频按 `storyboard.md` 解析 sections，注入 prompt 让 BGM 在 section 边界自然起伏
```

### 6.2 §7 集成代码示例（修改 1 处）

```html
<!-- before -->
<source src="/<主题>/audios/bgm/power_build.mp3" type="audio/mpeg">
<!-- after -->
<source src="/<主题>/audios/bgm/<topic>.mp3" type="audio/mpeg">
```

### 6.3 §8.1 mmx Prompt 模板（修改 2 处）

1. `--out` 路径：`resources/audios/bgm/power_build.mp3` → `resources/audios/bgm/<topic>.mp3`
2. 时长说明：在"必带参数"段加一行：
   ```markdown
   - 时长 = 视频总时长 + 3s（自动由 `gen-bgm.js` 从 `copy.md` 读 预计时长 + 5s buffer 计算）
   ```
3. 新增末尾说明：
   ```markdown
   > **Section cue 自动注入**：`gen-bgm.js` 自动从 `storyboard.md` 解析 sections（钩子/段 1/段 2/.../收尾），在 prompt 中追加 SECTION CUES 段落，指示 mmx 在每个 section 边界做情绪变化。
   ```

### 6.4 §9 存放位置（整段改写）

**v2 原文**：
```markdown
resources/audios/bgm/         ← BGM（与旁白 .m4a 区分）
├── cyber_pulse.mp3
├── power_build.mp3
├── quiet_think.mp3
└── hop_pulse.mp3
```

**v3 改写**：
```markdown
resources/audios/bgm/         ← BGM（与旁白 .m4a 区分）
└── <topic>.mp3              ← 每个视频独立 BGM，per-topic 命名

例：
- gym_machine_judge_b13.mp3
- winged_scapula_b3.mp3
- weekly_review.mp3
```

**§9.1 新增"为什么不共享"小节**：
```markdown
### 9.1 为什么不共享 BGM 文件

v3 之前用 `cyber_pulse.mp3` 等共享预设名，3 个核心问题：

1. **时长不匹配**：共享 BGM 长度固定（~75s），视频改了总长度后 BGM 不够长
2. **风格不定制**：同一类型（Power Build）的不同视频应该有不同情绪细节，共享 BGM 是"一刀切"
3. **污染风险**：所有 video share 同一文件，并行剪辑/混剪时容易串流

**v3 per-topic 解决**：每次新视频用 `gen-bgm.js <topic>` 重新生成，文件名 = topic，长度 = 视频总时长 + 3s，风格关键词根据 sections 注入。
```

### 6.5 §10 选型决策树（修改叶子节点）

```markdown
└─ 步骤教程 / 拆解
   └─ BGM = D · Hop Pulse
       ↓
       node tools/gen-bgm.js <topic>   # 输出到 resources/audios/bgm/<topic>.mp3
```

### 6.6 §13 验收清单（增 1 项，13 项总）

在第 1 项前插入：
```markdown
- [ ] BGM 文件名 = `<topic>.mp3`（per-topic 命名，不是 `power_build.mp3` 等共享名）
```

### 6.7 §14 5 维评分卡（增第 6 维，总分 30/30）

| 维度 | 1 分（差）| 3 分（中）| 5 分（优）| 本稿得分 |
|---|---|---|---|---|
| **Per-topic 命名** | 沿用 `power_build.mp3` 等共享名 | 输出 `<topic>.mp3` | 输出 `<topic>.mp3` + `.cues.json` 同步 | — |

> 原 5 维"每维 ≥ 3 分"门槛保持不变。新增第 6 维后总分上限变 30/30，门槛"**每维 ≥ 3 分**"等价于"总分 ≥ 18/30"（6 × 3 = 18）。

### 6.8 §15 反模式（增 2 条，从 17 → 19）

```markdown
- ❌ **用 `cyber_pulse.mp3` / `power_build.mp3` 等共享预设名输出 BGM**（必须 per-topic `<topic>.mp3`）
- ❌ **不同视频复用同一份 BGM 文件**（v3 强制 per-topic 生成）
```

### 6.9 附录 B 变更日志（增 v3）

```markdown
### v3（2026-06-10）— 框架层竖屏硬约束 + Per-topic BGM

- **新增 §0 v3 重点**：3 行摘要（per-topic 命名 / 每次重新生成 / section cue 提示）
- **§7 集成代码**：`<source src>` 改 `<topic>.mp3`
- **§8.1 mmx Prompt 模板**：`--out` 改 `<topic>.mp3` + 新增"时长自动计算"说明 + 新增"section cue 自动注入"说明
- **§9 存放位置**：整段改写为 per-topic 命名，附 3 个 example
- **§9.1 新增"为什么不共享"**：3 理由（时长/风格/污染）
- **§10 决策树**：叶子节点加 `gen-bgm.js <topic>` 命令
- **§13 验收清单**：从 12 项扩到 13 项（新增 per-topic 命名检查）
- **§14 评分卡**：新增第 6 维"Per-topic 命名"，总分 30/30，门槛 ≥ 18
- **§15 反模式**：从 17 条扩到 19 条（增共享命名 + 复用文件 2 条）
- **附录 B**：本 v3 变更日志

### v2（2026-06-09）— 深化拓展
（保留原 v2 内容）
```

---

## 7 · 改动 §5 — `mmx.md` 小改 3 处

### 7.1 §1.1 能力速查表（line 27）

| 能力 | CLI | 典型场景 | 输出格式 | 输出位置约定 |
|---|---|---|---|---|
| 🎵 **音乐生成** | `mmx music generate` | BGM 4 类（[tools/gen-bgm.js](gen-bgm.js) 包装）| MP3 | `resources/audios/bgm/<topic>.mp3` |

> 末列从 `<类型>.mp3` 改为 `<topic>.mp3`

### 7.2 §4.3 BGM 4 类 prompt 模板（line 193）

```markdown
`resources/audios/bgm/<topic>.mp3`（如 `gym_machine_judge_b13.mp3`）
```

> 从 `<类型>.mp3`（如 `power_build.mp3`）改为 `<topic>.mp3`（如 `gym_machine_judge_b13.mp3`）

### 7.3 §6.3 场景 2 生成 BGM（line 305-311）

```bash
mmx music generate \
  --prompt "tech house, 105 BPM, D minor, 75s, NO vocals, powerful build, gym training energy" \
  --quiet --non-interactive \
  --out resources/audios/bgm/<topic>.mp3
```

> 末行从 `power_build.mp3` 改为 `<topic>.mp3`（用 `gym_machine_judge_b13` 作 example）

---

## 8 · 数据流与一致性

### 8.1 新数据流（v3 后）

```
copy.md (BGM 选型 + 预计时长)
  ↓
gen-bgm.js <topic>
  ├─ 读 storyboard.md 解析 sections
  ├─ 拼 cue prompt（每个 section 边界注入情绪关键词）
  ├─ 调 mmx music generate
  └─ 输出:
      - resources/audios/bgm/<topic>.mp3
      - resources/audios/bgm/<topic>.cues.json
  ↓
gen-scene.js <topic> [--with-bgm]
  ├─ 调 gen-bgm.js（如 BGM 不存在）
  ├─ 生成 scene.html（bgm src 指向 resources/audios/bgm/<topic>.mp3）
  └─ 输出 hyperframe/src/scenes/<topic>/scene.html
  ↓
hyperframe/index.html (根画布硬约束 1080×1920)
  └─ <div data-composition-src="compositions/gym_machine_judge_b13.html" data-width="1080" data-height="1920">
  ↓
npm run render -- <SceneId> out/<name>.mp4
  └─ 根画布 + sub composition 都跑在 1080×1920
```

### 8.2 跨文件一致性要点

| 字段 | 出现位置 | 同步规则 |
|---|---|---|
| 画布尺寸 1080×1920 | `index.html` 根 / `gen-scene.js` line 258-265 / scene.html | 改根时同步改 scene 生成约束 |
| BGM 文件名 `<topic>.mp3` | `gen-bgm.js` 输出 / `gen-scene.js` line 271 / scene.html `<audio src>` / `bgm.md` 文档 | 改命名约定时 4 处同步 |
| 时长 VIDEO_DURATION | `copy.md` 预计时长 / `gen-bgm.js` 读 +5s / scene.html `data-duration` / `<audio data-duration>` | 改 4 处同步（详 timing-sync.md） |

---

## 9 · 验证计划

### 9.1 静态验证（必跑）

```bash
# 1. 文件存在性
ls -la hyperframe/compositions/                        # 应只剩 gym_machine_judge_b13.html
ls -la hyperframe/compositions/_legacy/                 # 01_test.html + README.md
ls -la resources/audios/bgm/                            # 应见 2 个 mp3 + 1 个 cues.json

# 2. 根画布约束
grep -E 'data-width|data-height' hyperframe/index.html  # 根 + 唯一 comp 都 1080/1920
grep -E 'viewport' hyperframe/index.html                # width=1080 height=1920

# 3. scene BGM 引用
grep -E 'bgm.*src' hyperframe/compositions/gym_machine_judge_b13.html
# 应: src="../../resources/audios/bgm/gym_machine_judge_b13.mp3"

# 4. 文档一致
grep -E 'power_build\.mp3|cyber_pulse\.mp3' rules/bgm.md  # 应 0 命中
grep -E '<topic>\.mp3' rules/bgm.md                       # 应 ≥ 3 命中
grep -E 'power_build\.mp3|<topic>\.mp3' tools/mmx.md                  # 后者命中
```

### 9.2 框架验证（必跑）

```bash
cd hyperframe
npm run check                                            # lint + validate + inspect
npm run dev -- --scene=gym_machine_judge_b13 &           # preview（run_in_background）
# 浏览器打开 http://localhost:4000，看：
# - 画布比例 9:16 竖屏
# - BGM 加载（不报 404）
# - 总时长 62.33s
# - 字幕入场正常
```

### 9.3 业务验证（推荐）

```bash
# 重新跑 gen-bgm.js 验证可重复
node tools/gen-bgm.js gym_machine_judge_b13
# 不带 --keep → 应重新生成（默认行为）
# 输出两个文件，cues.json sections 数 = storyboard sections 数
```

---

## 10 · 风险与回退

### 10.1 风险

| 风险 | 概率 | 影响 | 缓解 |
|---|---|---|---|
| 根画布改 1080×1920 后，旧有横屏素材（如果有）无法预览 | 低 | 中 | 已知只有 01_test.html（横屏）已移到 _legacy，新视频都是 portrait |
| `gym_machine_judge_b13.mp3` 生成失败（mmx 配额/网络）| 低 | 高 | 旧 `power_build.mp3` 仍可用作 fallback（但需临时回改 src）|
| 文档改动漏掉某处 | 中 | 低 | 9.1 静态验证脚本兜底 |
| Hyperframes 引擎不识别 1080×1920 根画布 | 极低 | 中 | 已有 gen-scene.js v2 实践，sub composition 跑过；根画布只是容器 |

### 10.2 回退 SOP

如果根画布硬约束导致整体渲染失败：

```bash
git revert HEAD  # 撤销最近一次提交（如果本设计已 commit）
# 或手动 revert 5 个文件
```

如果 gym_machine_judge_b13.mp3 生成失败：

```bash
# 临时回 scene.html BGM src 到 power_build.mp3
sed -i '' 's|gym_machine_judge_b13.mp3|power_build.mp3|' hyperframe/compositions/gym_machine_judge_b13.html
# 后续 mmx 恢复后再切回
```

---

## 11 · 未来扩展（Out of Scope）

- **B 方案 · SFX 自动化**：section 边界 + CTA 自动播 SFX（whoosh/pop/impact），由 mmx music generate + ffmpeg trim 生成 per-topic SFX 文件
- **C 方案 · CI 校验脚本**：`tools/check-canvas.js` + `npm run check:canvas` 渲染前拦截
- **BGM 风格库可配置化**：把 4 类 BGM 关键词从硬编码提到 `hyperframe/config/bgm-presets.json`
- **横屏 opt-in 文档化**：B 站等场景需要横屏时，开 `compositions/_landscape/` 子目录

---

## 12 · 验收清单（实施后跑）

- [ ] 5 个文件全部按本设计改动
- [ ] `resources/audios/bgm/gym_machine_judge_b13.mp3` 存在
- [ ] `resources/audios/bgm/gym_machine_judge_b13.cues.json` 存在，sections 数 = storyboard
- [ ] `resources/audios/bgm/power_build.mp3` 仍存在（保留）
- [ ] `hyperframe/compositions/01_test.html` 已移到 `_legacy/`
- [ ] `hyperframe/compositions/_legacy/README.md` 已创建
- [ ] `hyperframe/index.html` 根 `data-width="1080" data-height="1920"`
- [ ] `hyperframe/index.html` viewport `width=1080 height=1920`
- [ ] `gym_machine_judge_b13.html` line 88 src 指向 `<topic>.mp3`
- [ ] `npm run check` 通过（lint + validate + inspect）
- [ ] `npm run dev` preview 正常，BGM 不报 404
- [ ] 静态验证 9.1 全过
- [ ] 没有改动 CLAUDE.md、render.md、script.md、gen-bgm.js、gen-scene.js
