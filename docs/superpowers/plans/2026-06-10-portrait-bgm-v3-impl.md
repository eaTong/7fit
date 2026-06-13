# 竖屏铁律 + BGM Per-Topic v3 — 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在框架层硬约束竖屏（1080×1920），对齐 BGM per-topic 命名规范与 `gen-bgm.js` v2 实现，修复现有 scene 的 BGM 引用。

**Architecture:**
- 根画布硬约束：`hyperframe/index.html` 写死 1080×1920，移除横屏测试 composition
- 文档同步：`bgm.md` v2 → v3 + `mmx.md` 3 处路径约定同步
- BGM 修复：`gym_machine_judge_b13.html` BGM src 改 `<topic>.mp3` + 用 `gen-bgm.js` 生成

**Tech Stack:** Node.js + Hyperframes v0.6.72 + GSAP + mmx CLI + ffmpeg

**Spec:** [../specs/2026-06-10-portrait-bgm-v3-design.md](../specs/2026-06-10-portrait-bgm-v3-design.md)

---

## 文件结构

| 文件 | 类型 | 责任 |
|---|---|---|
| `hyperframe/index.html` | Modify | 框架根画布（1080×1920）+ composition 注册入口 |
| `hyperframe/compositions/_legacy/01_test.html` | Move from | 横屏测试产物归档 |
| `hyperframe/compositions/_legacy/README.md` | Create | _legacy 目录说明 |
| `hyperframe/compositions/gym_machine_judge_b13.html` | Modify | BGM src 改 `<topic>.mp3` |
| `resources/audios/bgm/gym_machine_judge_b13.mp3` | Generated | per-topic BGM（gen-bgm.js 输出）|
| `resources/audios/bgm/gym_machine_judge_b13.cues.json` | Generated | section cue 元数据 |
| `resources/audios/bgm/power_build.mp3` | Keep | 旧版共享 BGM（不删） |
| `rules/bgm.md` | Rewrite v2→v3 | 4 类选型 + per-topic 文档 + 评分卡 |
| `tools/mmx.md` | Modify 3 处 | §1.1 / §4.3 / §6.3 路径约定 |

**显式不动**：
- `gen-bgm.js` v2（已 per-topic）
- `gen-scene.js`（已有竖屏硬约束）
- `CLAUDE.md` / `render.md` / `script.md`（已包含规范描述）

---

## Task 1: 移动 `01_test.html` 到 `_legacy/` + 创建 README

**Files:**
- Move: `hyperframe/compositions/01_test.html` → `hyperframe/compositions/_legacy/01_test.html`
- Create: `hyperframe/compositions/_legacy/README.md`

- [ ] **Step 1: 创建 `_legacy/` 目录并移动文件**

```bash
mkdir -p hyperframe/compositions/_legacy
git mv hyperframe/compositions/01_test.html hyperframe/compositions/_legacy/01_test.html
```

**预期**：
- 终端输出 `rename ... => ...`（git mv 成功）
- `ls hyperframe/compositions/` 现在只有 `gym_machine_judge_b13.html`
- `ls hyperframe/compositions/_legacy/` 现在有 `01_test.html`

- [ ] **Step 2: 创建 `_legacy/README.md`**

```bash
cat > hyperframe/compositions/_legacy/README.md <<'EOF'
# _legacy/

历史测试 composition 归档目录。文件不符合项目当前规范（竖屏 1080×1920）。

- `01_test.html` — 横屏 1920×1080 早期测试产物，已废弃

新 composition 请直接放 `compositions/` 根目录。
EOF
```

**预期**：
- 文件创建成功，无错误
- `cat hyperframe/compositions/_legacy/README.md` 显示上面内容

- [ ] **Step 3: 验证移动结果**

```bash
ls -la hyperframe/compositions/
ls -la hyperframe/compositions/_legacy/
```

**预期输出**：
```
hyperframe/compositions/:
  gym_machine_judge_b13.html

hyperframe/compositions/_legacy/:
  01_test.html
  README.md
```

- [ ] **Step 4: Commit**

```bash
git add hyperframe/compositions/_legacy/
git commit -m "refactor(compositions): 01_test.html 移到 _legacy/（横屏测试产物归档）"
```

**预期**：`[main XXXXXXX] refactor(compositions): 01_test.html 移到 _legacy/...`

---

## Task 2: 改写 `hyperframe/index.html` 根画布硬约束

**Files:**
- Modify: `hyperframe/index.html` (line 5, 9, 13-20, 21-27)

- [ ] **Step 1: 修改 viewport meta（line 5）**

读取当前 line 5 然后替换（`Edit` 工具，old_string 必须精确匹配）：

```html
<!-- old -->
    <meta name="viewport" content="width=1920, height=1080" />
<!-- new -->
    <meta name="viewport" content="width=1080, height=1920" />
```

**预期**：文件第 5 行变为 `<meta name="viewport" content="width=1080, height=1920" />`

- [ ] **Step 2: 修改 body CSS（line 9）**

```html
<!-- old -->
      html, body { margin: 0; width: 1920px; height: 1080px; overflow: hidden; background: #000; }
<!-- new -->
      html, body { margin: 0; width: 1080px; height: 1920px; overflow: hidden; background: #000; }
```

**预期**：body 高度从 1080px 改为 1920px

- [ ] **Step 3: 修改根 section（line 13-20）**

```html
<!-- old -->
    <div
      id="root"
      data-composition-id="main"
      data-start="0"
      data-duration="10"
      data-width="1920"
      data-height="1080"
    >
<!-- new -->
    <div
      id="root"
      data-composition-id="main"
      data-start="0"
      data-duration="62.33"
      data-width="1080"
      data-height="1920"
    >
```

**预期**：根 `data-duration` 从 10 改为 62.33（最长 comp 时长），`data-width/data-height` 改为 1080/1920

- [ ] **Step 4: 删除 `01_test` 引用块（line 21-27）**

```html
<!-- 删除整段 -->
      <div id="composition-01_test"
           data-composition-id="01_test"
           data-composition-src="compositions/01_test.html"
           data-start="0"
           data-duration="10"
           data-width="1920"
           data-height="1080"></div>
```

- [ ] **Step 5: 验证 index.html 改写后状态**

```bash
cat hyperframe/index.html
```

**预期**：
- 根 `data-width="1080" data-height="1920"`
- 根 `data-duration="62.33"`
- viewport `width=1080 height=1920`
- body CSS `width: 1080px; height: 1920px`
- 只有一个 `<div data-composition-id="gym_machine_judge_b13">`
- 没有 `01_test` 引用

- [ ] **Step 6: 跑 `npm run check` 验证根 composition**

```bash
cd hyperframe && npm run check
```

**预期**：PASS（lint + validate + inspect 全部通过，无 error）。warning 可以接受但 error 必须 0。

- [ ] **Step 7: Commit**

```bash
cd ..  # 回项目根
git add hyperframe/index.html
git commit -m "feat(hyperframe): 根画布硬约束 1080×1920，移除 01_test 横屏引用"
```

**预期**：`[main XXXXXXX] feat(hyperframe): 根画布硬约束 1080×1920...`

---

## Task 3: 修复 `gym_machine_judge_b13.html` BGM src

**Files:**
- Modify: `hyperframe/compositions/gym_machine_judge_b13.html` (line 88)

- [ ] **Step 1: 定位 BGM audio 标签**

```bash
grep -n 'id="bgm"' hyperframe/compositions/gym_machine_judge_b13.html
```

**预期**：`88:      <audio id="bgm" src="../assets/audios/bgm/power_build.mp3" ...`

- [ ] **Step 2: 替换 src 路径**

```html
<!-- old -->
      <audio id="bgm" src="../assets/audios/bgm/power_build.mp3"
             data-start="0" data-duration="62.33" data-track-index="1" preload="auto"></audio>
<!-- new -->
      <audio id="bgm" src="../../resources/audios/bgm/gym_machine_judge_b13.mp3"
             data-start="0" data-duration="62.33" data-track-index="1" preload="auto"></audio>
```

**预期**：line 88 src 从 `../assets/audios/bgm/power_build.mp3` 改为 `../../resources/audios/bgm/gym_machine_judge_b13.mp3`（`hyperframe/compositions/` 下 2 级回退到项目根）

- [ ] **Step 3: 验证修改**

```bash
grep -n 'id="bgm"' hyperframe/compositions/gym_machine_judge_b13.html
```

**预期**：`88:      <audio id="bgm" src="../../resources/audios/bgm/gym_machine_judge_b13.mp3" ...`

- [ ] **Step 4: Commit（不立即跑 gen-bgm，留到 Task 4）**

```bash
git add hyperframe/compositions/gym_machine_judge_b13.html
git commit -m "fix(scene): BGM src 改 per-topic 命名 (gym_machine_judge_b13.mp3)"
```

---

## Task 4: 用 `gen-bgm.js` 生成 per-topic BGM

**Files:**
- Generated: `resources/audios/bgm/gym_machine_judge_b13.mp3`
- Generated: `resources/audios/bgm/gym_machine_judge_b13.cues.json`

- [ ] **Step 1: 跑 gen-bgm.js**

```bash
node tools/gen-bgm.js gym_machine_judge_b13
```

**预期输出**（按顺序）：
1. `📖 从 copy.md 读 BGM 选型：power_build (Power Build)`
2. `📖 从 copy.md 读时长：XXs，背景音乐时长 = YYs (+5s buffer)`
3. `📑 从 storyboard.md 解析 N sections:` + 列出每个 section
4. `🎵 生成 BGM：power_build (YYs) for "gym_machine_judge_b13"`
5. mmx 输出（被 --quiet 抑制）
6. `✅ Cue points: resources/audios/bgm/gym_machine_judge_b13.cues.json (N sections)`
7. `✅ BGM 生成成功：resources/audios/bgm/gym_machine_judge_b13.mp3 (XX.X KB, YYs)`

- [ ] **Step 2: 验证生成的文件**

```bash
ls -la resources/audios/bgm/
```

**预期**：
```
.gitkeep
gym_machine_judge_b13.cues.json
gym_machine_judge_b13.mp3
power_build.mp3     ← 旧版保留
```

- [ ] **Step 3: 验证 cues.json 内容**

```bash
cat resources/audios/bgm/gym_machine_judge_b13.cues.json
```

**预期**：JSON 包含 `topic`、`duration`、`preset`、`sections`（每 section 含 name/title/start/end/dur/mood）

- [ ] **Step 4: 验证 sections 数 = storyboard major sections**

```bash
# 解析 cues.json 的 sections 数组长度
cat resources/audios/bgm/gym_machine_judge_b13.cues.json | grep -c '"start"'
# 解析 storyboard.md 的 major section 数（### Shot 行）
grep -c '^### Shot' hyperframe/src/scenes/gym_machine_judge_b13/storyboard.md
```

**预期**：两个数字大致相同（cues 是 major sections：钩子/t1/t2/t3/outro；shot 数 = 全部镜头数；shot 数 ≥ cues 数）

- [ ] **Step 5: 跑 `npm run check`（确保场景引用新 BGM 不报错）**

```bash
cd hyperframe && npm run check
```

**预期**：PASS（不会因 BGM 文件不存在报错，Hyperframes 引擎不静态校验音频文件）

- [ ] **Step 6: 检查 gitignore 状态（mp3 不入库是设计，不是漏掉）**

```bash
cd ..
git check-ignore -v resources/audios/bgm/gym_machine_judge_b13.mp3
git check-ignore -v resources/audios/bgm/power_build.mp3
```

**预期**：
- 两个文件都匹配 `.gitignore` 的 `resources/**/*.mp3` 规则
- 这是**设计**——`.gitignore` 主动排除 `resources/` 下所有大体积媒体（mp3/mp4/png 等），避免污染 git
- BGM 由 `gen-bgm.js` 在每个新视频时按需生成（per-topic 保证唯一性 + 不共享）

> **设计约束**：新生成的 `gym_machine_judge_b13.mp3` 与保留的 `power_build.mp3` **都**不会入库。新开发者 clone 仓库后必须跑 `node tools/gen-bgm.js <topic>` 重新生成。

- [ ] **Step 7: Commit 元数据（仅 .cues.json）**

```bash
git add resources/audios/bgm/gym_machine_judge_b13.cues.json
git status  # 确认 mp3 不在待 commit 列表
git commit -m "feat(audio): gym_machine_judge_b13 section cue 元数据（mp3 由 gen-bgm.js 重新生成）"
```

**预期**：
- `git status` 中**不**应有 mp3 文件（被 .gitignore 排除）
- 提交信息中说明 mp3 不入库的原因（per-topic 重新生成）

---

## Task 5: 改写 `bgm.md` v2 → v3

**Files:**
- Modify: `rules/bgm.md`（7 处改动：§0 新增 / §7 / §8.1 / §9 / §10 / §13 / §14 / §15 / 附录 B）

> **任务分批**：为避免单次 Edit 太大，拆成 5 个子步骤。

- [ ] **Step 1: §0 新增 v3 重点（顶部）**

在文件最开头（line 1 之前）插入：

```markdown
# BGM 规范（bgm.md）

> **Phase 6 产物**（**放最后**）：视频总时长确定后 → 按总时长设计 BGM。
> ...
> **必须遵循**：...

---

## 0 · v3 重点（2026-06-10）

1. **Per-topic 命名**：每个视频独立 BGM 文件 `resources/audios/bgm/<topic>.mp3`（不再用 `cyber_pulse.mp3` / `power_build.mp3` 等共享预设名）
2. **每次重新生成**：新视频必须调 `gen-bgm.js` 生成，不复用旧文件
3. **Section cue 情绪提示**：长视频按 `storyboard.md` 解析 sections，注入 prompt 让 BGM 在 section 边界自然起伏

---
```

**Edit 操作**：在 line 14 的 `---` 后插入 `## 0 · v3 重点` 段。

- [ ] **Step 2: §7 集成代码示例（line 173-176）**

```html
<!-- old (line 173-175) -->
<audio id="bgm" preload="auto" loop>
  <source src="/<主题>/audios/bgm/power_build.mp3" type="audio/mpeg">
</audio>
<!-- new -->
<audio id="bgm" preload="auto" loop>
  <source src="/<主题>/audios/bgm/<topic>.mp3" type="audio/mpeg">
</audio>
```

- [ ] **Step 3: §8.1 mmx Prompt 模板（line 215-218）**

```bash
# old
mmx music generate \
  --prompt "tech house, 105 BPM, D minor, 75s, NO vocals, powerful build, gym training energy" \
  --quiet --non-interactive \
  --out resources/audios/bgm/power_build.mp3
# new
mmx music generate \
  --prompt "tech house, 105 BPM, D minor, 75s, NO vocals, powerful build, gym training energy" \
  --quiet --non-interactive \
  --out resources/audios/bgm/<topic>.mp3
```

并在"必带参数"段（line 221-227）末尾加：
```markdown
- 时长 = 视频总时长 + 3s（自动由 `gen-bgm.js` 从 `copy.md` 读 预计时长 + 5s buffer 计算）
```

并在 `> **必带参数**：` 整段后追加新说明：
```markdown
> **Section cue 自动注入**：`gen-bgm.js` 自动从 `storyboard.md` 解析 sections（钩子/段 1/段 2/.../收尾），在 prompt 中追加 SECTION CUES 段落，指示 mmx 在每个 section 边界做情绪变化。
```

- [ ] **Step 4: §9 存放位置（line 232-238，整段改写）**

```markdown
<!-- old -->
## 9 · 存放位置

```
resources/audios/bgm/         ← BGM（与旁白 .m4a 区分）
├── cyber_pulse.mp3
├── power_build.mp3
├── quiet_think.mp3
└── hop_pulse.mp3
```

> **旁白**（.m4a）放 `resources/audios/<主题>.m4a`，**不要**放 `bgm/`。

<!-- new -->
## 9 · 存放位置

```
resources/audios/bgm/         ← BGM（与旁白 .m4a 区分）
└── <topic>.mp3              ← 每个视频独立 BGM，per-topic 命名
```

例：
- `gym_machine_judge_b13.mp3`
- `winged_scapula_b3.mp3`
- `weekly_review.mp3`

> **旁白**（.m4a）放 `resources/audios/<主题>.m4a`，**不要**放 `bgm/`。

### 9.1 为什么不共享

v3 之前用 `cyber_pulse.mp3` 等共享预设名，3 个核心问题：

1. **时长不匹配**：共享 BGM 长度固定（~75s），视频改了总长度后 BGM 不够长
2. **风格不定制**：同一类型（Power Build）的不同视频应该有不同情绪细节，共享 BGM 是"一刀切"
3. **污染风险**：所有 video share 同一文件，并行剪辑/混剪时容易串流

**v3 per-topic 解决**：每次新视频用 `gen-bgm.js <topic>` 重新生成，文件名 = topic，长度 = 视频总时长 + 3s，风格关键词根据 sections 注入。
```

- [ ] **Step 5: §10 选型决策树（line 263-268，叶子节点追加）**

```markdown
<!-- old -->
└─ 步骤教程 / 拆解
   └─ BGM = D · Hop Pulse

<!-- new -->
└─ 步骤教程 / 拆解
   └─ BGM = D · Hop Pulse
       ↓
       node tools/gen-bgm.js <topic>   # 输出到 resources/audios/bgm/<topic>.mp3
```

- [ ] **Step 6: §13 验收清单（line 357-371，第 1 项前插入新项）**

```markdown
<!-- 现有 12 项前加 1 项 -->
- [ ] BGM 文件名 = `<topic>.mp3`（per-topic 命名，不是 `power_build.mp3` 等共享名）
- [ ] BGM 长度 ≥ 视频总时长 + 3s
- ...
```

- [ ] **Step 7: §14 5 维评分卡（line 380-386，新增第 6 维）**

```markdown
<!-- 现有 5 维后追加 -->
| **Per-topic 命名** | 沿用 `power_build.mp3` 等共享名 | 输出 `<topic>.mp3` | 输出 `<topic>.mp3` + `.cues.json` 同步 | — |
```

并在评分卡说明段（line 378）更新：
```markdown
<!-- old -->
> **每维 ≥ 3 分才能进入用户审阅**，总分 ≥ 18/25。

<!-- new -->
> **每维 ≥ 3 分才能进入用户审阅**，总分 ≥ 18/30（6 维 × 5 分，新增第 6 维"Per-topic 命名"）。
```

- [ ] **Step 8: §15 反模式（line 405-422，从 17 → 19）**

在反模式列表末尾（line 421 后，`- ❌ **跳过 5 维评分卡直接给用户**` 之后）加 2 条：

```markdown
- ❌ **用 `cyber_pulse.mp3` / `power_build.mp3` 等共享预设名输出 BGM**（必须 per-topic `<topic>.mp3`）
- ❌ **不同视频复用同一份 BGM 文件**（v3 强制 per-topic 生成）
```

- [ ] **Step 9: 附录 B 变更日志（line 444-462 之前）追加 v3**

在 `### v2（2026-06-09）— 深化拓展` 段前插入 v3 段：

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
```

- [ ] **Step 10: 验证 bgm.md 改写结果**

```bash
# 旧共享名应 0 命中
grep -c 'cyber_pulse\.mp3\|power_build\.mp3\|quiet_think\.mp3\|hop_pulse\.mp3' rules/bgm.md
# 预期: 0（除 §15 反模式中故意保留的"❌ 用 ... 共享预设名"那条）
# 新 per-topic 应 ≥ 3 命中
grep -c '<topic>\|per-topic' rules/bgm.md
# 预期: ≥ 5
```

- [ ] **Step 11: Commit**

```bash
git add rules/bgm.md
git commit -m "docs(rules): bgm.md v2 → v3 改写为 per-topic BGM 规范"
```

---

## Task 6: 改写 `tools/mmx.md` 3 处

**Files:**
- Modify: `tools/mmx.md` (line 27, 193, 309)

- [ ] **Step 1: §1.1 能力速查表（line 27）**

```markdown
<!-- old -->
| 🎵 **音乐生成** | `mmx music generate` | BGM 4 类（[tools/gen-bgm.js](gen-bgm.js) 包装）| MP3 | `resources/audios/bgm/<类型>.mp3` |
<!-- new -->
| 🎵 **音乐生成** | `mmx music generate` | BGM 4 类（[tools/gen-bgm.js](gen-bgm.js) 包装）| MP3 | `resources/audios/bgm/<topic>.mp3` |
```

- [ ] **Step 2: §4.3 BGM 4 类 prompt 模板（line 193）**

```markdown
<!-- old -->
`resources/audios/bgm/<类型>.mp3`（如 `power_build.mp3`）
<!-- new -->
`resources/audios/bgm/<topic>.mp3`（如 `gym_machine_judge_b13.mp3`）
```

- [ ] **Step 3: §6.3 场景 2 生成 BGM（line 309）**

```bash
# old
  --out resources/audios/bgm/power_build.mp3
# new
  --out resources/audios/bgm/<topic>.mp3
```

- [ ] **Step 4: 验证 mmx.md 改写结果**

```bash
# 旧共享名应 0 命中（除注释/example 故意保留的）
grep -c 'power_build\.mp3\|cyber_pulse\.mp3' tools/mmx.md
# 预期: 0
# 新 per-topic 应 ≥ 1 命中
grep -c '<topic>' tools/mmx.md
# 预期: ≥ 1
```

- [ ] **Step 5: Commit**

```bash
git add tools/mmx.md
git commit -m "docs(tools): mmx.md 3 处路径约定改为 per-topic <topic>.mp3"
```

---

## Task 7: 全量静态验证

**Files:** 无（仅跑命令验证）

- [ ] **Step 1: 文件存在性 + 命名一致性**

```bash
ls -la hyperframe/compositions/
ls -la hyperframe/compositions/_legacy/
ls -la resources/audios/bgm/
```

**预期**：
- `hyperframe/compositions/`：只有 `gym_machine_judge_b13.html`
- `hyperframe/compositions/_legacy/`：`01_test.html` + `README.md`
- `resources/audios/bgm/`：`.gitkeep` + `gym_machine_judge_b13.mp3` + `gym_machine_judge_b13.cues.json` + `power_build.mp3`（保留）

- [ ] **Step 2: 根画布约束**

```bash
grep -E 'data-width|data-height' hyperframe/index.html
grep -E 'viewport' hyperframe/index.html
```

**预期**：
- 根 + 唯一 comp 都 1080/1920
- viewport `width=1080 height=1920`

- [ ] **Step 3: scene BGM 引用**

```bash
grep -E 'bgm.*src' hyperframe/compositions/gym_machine_judge_b13.html
```

**预期**：src 指向 `../../resources/audios/bgm/gym_machine_judge_b13.mp3`

- [ ] **Step 4: 文档无旧共享名（除反模式故意保留的）**

```bash
grep -nE 'power_build\.mp3|cyber_pulse\.mp3|quiet_think\.mp3|hop_pulse\.mp3' rules/bgm.md
grep -nE 'power_build\.mp3|cyber_pulse\.mp3' tools/mmx.md
```

**预期**：
- `bgm.md` 只在 `§15 反模式` 段（"❌ 用 `cyber_pulse.mp3` / `power_build.mp3` 等共享预设名"）命中
- `mmx.md` 0 命中

- [ ] **Step 5: 跑 `npm run check`**

```bash
cd hyperframe && npm run check
```

**预期**：PASS（lint + validate + inspect 无 error）

---

## Task 8: 端到端 preview 验证

**Files:** 无（仅跑命令验证）

- [ ] **Step 1: 启动 Studio preview（背景）**

```bash
cd hyperframe
npm run dev &  # 后台跑
sleep 5  # 等服务起来
```

**预期**：终端输出 Hyperframes preview server 启动信息

- [ ] **Step 2: 浏览器打开 http://localhost:4000 检查**

用 playwright MCP 工具或浏览器手动检查：
- 画布比例 9:16 竖屏（不是 16:9 横屏）
- BGM 加载（不报 404 / Network 错误）
- 总时长 62.33s
- 字幕入场正常
- 无 console 错误

- [ ] **Step 3: 关闭 Studio**

```bash
# 用 TaskStop 工具停后台进程
```

---

## Task 9: 终态 commit + 报告

- [ ] **Step 1: 查看最终 git 状态**

```bash
cd ..  # 回项目根
git status
git log --oneline -10
```

**预期**：
- `git status` 应无未提交的改动
- 最近 commits 包含本次的 6-7 个提交（Task 1/2/3/4/5/6 各 1 个 + 可能的 fix）

- [ ] **Step 2: 输出实施报告**

向用户报告：
- ✅ 5 个文件改动完成
- ✅ BGM per-topic 生成成功
- ✅ 框架层竖屏硬约束生效
- ✅ `npm run check` 通过
- ✅ preview 验证通过
- 列出所有 commit hashes
- 列出 spec 中 12 项验收清单的结果

---

## 反模式（实施时避免）

- ❌ 漏掉某节 bgm.md 改动（一定要 9 个子步骤全做）
- ❌ 移动 01_test.html 后忘了删 index.html 里的引用
- ❌ 改 scene.html BGM src 后忘了跑 gen-bgm.js（会 404）
- ❌ 跑 gen-bgm.js 时手动指定 `--keep`（会跳过生成，不符合 v3 规则）
- ❌ 改 bgm.md 时删了 v2 变更日志（保留 v2 在附录 B）
- ❌ 把 `power_build.mp3` 删除（用户已确认保留）

## 风险与回退

- **mmx 配额耗尽 / 网络失败**：`gen-bgm.js` 报错时，临时回 scene.html BGM src 到 `power_build.mp3`，等配额恢复后再切回
- **Hyperframes 引擎不识别根 1080×1920**：`git revert` 全部 6 个 commit
- **bgm.md 改写错乱**：`git checkout HEAD~1 -- rules/bgm.md` 回滚单文件
- **新开发者 clone 仓库后 BGM 文件丢失**：`.gitignore` 排除了 `resources/**/*.mp3`，clone 后必须跑 `node tools/gen-bgm.js <topic>` 重新生成（这是设计——per-topic + 不复用）。文档说明：见 `bgm.md` §0 v3 重点第 2 条 + README 或 CONTRIBUTING（如有）
