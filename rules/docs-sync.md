# 文档同步（docs-sync.md）

> **Phase 1 强制**：写视频脚本前，必须**先把两个外部仓库的文档增量同步**到 `docs/`，并生成项目级 `SUMMARY.md`。
>
> 没有同步就不要写脚本 —— 视频中提到的事实必须有 `docs/` 里的源文档可追溯。
>
> **同步哲学**：**事实可追溯 = 不重复造轮子 + 不臆造**——2 个外部仓库（fit_lc + 7fit_opc）是事实唯一来源。3 要素：**增量同步**（不复制整个仓库）+ **路径规范**（`docs/fit_lc/` + `docs/opc/`）+ **SUMMARY.md 索引**（写脚本时直接读）。

---

## 1 · 4 个文档源

| 仓库 | 路径 | 同步什么 |
|---|---|---|
| **7fit 产品本体** | `/Users/eatong/eaTong_projects/fit_lc` | 产品代码、后端、PRD、功能细节 |
| **7fit 品牌** | `/Users/eatong/eaTong_projects/7fit_opc` | 北极星、利基、Headline、转化漏斗 |
| **视频脚本稿**（产物，非同步）| `resources/docs/copy/<主题>.md` | 这次视频的文案（用户手写或 AI 起草） |
| **本仓库同步清单** | `docs/SUMMARY.md` | 三个源的索引 + 视频脚本可引用的事实清单 |

> **目录分工**：
> - `docs/` = 外部同步文档（fit_lc + 7fit_opc 的快照）
> - `resources/docs/copy/` = 视频脚本稿（每视频一份 .md）
> - `resources/docs/` = 旧位置（已废弃，新文件不再放这里）

### 1.1 目录结构

```
docs/
├── README.md                       # 目录说明
├── SUMMARY.md                      # 同步索引 + 视频脚本事实清单
├── fit_lc/                         # 7fit 产品本体（PRD/架构/数据模型）
│   ├── prd.md                      # 主 PRD
│   ├── prd-planning.md             # PRD 计划
│   ├── prd-details/                # 6 大类功能详情
│   └── architecture/               # 后端架构 + 数据模型
└── opc/                            # 7fit 品牌（北极星/利基/Headline）
    ├── north-star.md
    ├── niche-statement-v4.md
    ├── headline-candidates.md
    ├── founders-note.md
    └── landing-page-skeleton.md
```

---

## 2 · 同步流程

```
1. 扫描 fit_lc/docs/ 找出与视频主题相关的新增/修改
2. 扫描 7fit_opc/outputs/ 找出相关新增/修改
3. 把与视频主题相关的文档复制到 docs/{fit_lc|opc}/ 下（用子目录分类）
4. 生成或更新 docs/SUMMARY.md（模板见下）
5. 后续所有视频脚本都基于 SUMMARY.md + 实际复制到的文档撰写
```

### 2.1 同步 SOP（5 步详解）

| 步骤 | 动作 | 工具 |
|---|---|---|
| **1. 扫描 fit_lc** | 找主题相关章节 | `ls fit_lc/docs/` + grep |
| **2. 扫描 7fit_opc** | 找主题相关章节 | `ls 7fit_opc/outputs/` + grep |
| **3. 复制到 docs/** | 用 `cp -r` + 分类目录 | 终端 / Finder |
| **4. 更新 SUMMARY.md** | 写索引 + 引用清单 | Markdown |
| **5. 验证** | 检查路径 + 引用对 | `grep -r` |

### 2.2 同步时机

| 时机 | 频率 |
|---|---|
| **每个新视频开工前** | 必跑（详 §2）|
| **每周一次全量复核** | 周末集中（详 §6）|
| **外部仓库有更新时** | 增量同步 |

---

## 3 · `docs/SUMMARY.md` 模板

详见 [docs/SUMMARY.md](../../docs/SUMMARY.md)（已建好模板）。

```markdown
# 视频脚本源文档清单

> **用途**：AI Agent 写视频脚本时的事实查询起点。
> **更新日期**：YYYY-MM-DD
> **本次视频主题**：<主题，如 winged_scapula_b3>

## 已同步文档

| 源 | 路径 | 同步日期 | 关键内容 |
|---|---|---|---|
| fit_lc/docs/PRD.md | docs/fit_lc/prd.md | YYYY-MM-DD | 7fit 小程序主要功能列表 |
| fit_lc/docs/architecture/ | docs/fit_lc/architecture/ | YYYY-MM-DD | 后端架构图 + 数据模型 |
| 7fit_opc/outputs/02-niche-statement.md | docs/opc/niche-statement.md | YYYY-MM-DD | 利基 + 钩子句 + 北极星 |
| 7fit_opc/outputs/03-value-proposition/ | docs/opc/headline-candidates.md | YYYY-MM-DD | Headline 候选 + 落地页 |

## 视频脚本引用清单（本次视频可用的事实）

- "翼状肩胛 3 步自测 + 4 个动作" → 来自 `docs/opc/headline-candidates.md` §落地页
- "靠墙天使 / 俯身 Y-T-W / 弹力带外旋 / 死虫式" → 来自 `docs/opc/niche-statement.md` §动作清单
- "神经性翼状肩请就医" → 来自 `docs/fit_lc/prd.md` §安全提示
- ...

## 未同步/缺失

- [ ] 训练视频素材（4 个动作真人拍摄）— 等用户自录
- [ ] BGM（4 类候选）— 等用户选定
```

---

## 4 · 增量同步原则

- **不复制整个仓库**：只复制与本次视频主题相关的章节
- **不修改源文档**：复制到 `docs/` 后保留原文，避免污染外部仓库
- **同步后必须更新 SUMMARY**：否则下次视频脚本找不到引用
- **每周一次全量复核**：用户工作日时间有限，周末集中同步
- **按子目录分类**：`docs/fit_lc/` 放产品文档，`docs/opc/` 放品牌文档

### 4.1 增量同步决策表

| 情况 | 是否同步 | 处理 |
|---|---|---|
| **本次视频主题相关** | ✅ 必同步 | 复制到 docs/ |
| **未来可能用** | 🟡 标注 | 写进 SUMMARY.md "未同步"区 |
| **与本项目无关** | ❌ 不同步 | 不复制 |

### 4.2 同步边界

| 同步项 | 边界 |
|---|---|
| **PRD** | 只同步主题相关功能模块 |
| **架构** | 只同步视频可能引用的数据模型 |
| **北极星 / 利基** | **必同步**（每视频都要引用）|
| **Headline** | 必同步（直接进 copy.md）|

---

## 5 · 优先级引用（写脚本时直接读）

| 主题 | 优先读取 |
|---|---|
| 产品功能与卖点 | `docs/fit_lc/prd.md`、`docs/fit_lc/prd-planning.md`、`docs/fit_lc/prd-details/` |
| 数据模型 / API | `fit_lc/backend/prisma/schema.prisma`、`fit_lc/backend/src/routes/` |
| 品牌灵魂 / 北极星 | `docs/opc/north-star.md` |
| 利基与钩子句 | `docs/opc/niche-statement-v4.md` |
| Headline 候选 | `docs/opc/headline-candidates.md` |
| 创始人故事 | `docs/opc/founders-note.md` |
| 落地页骨架 | `docs/opc/landing-page-skeleton.md` |
| 转化漏斗 | `7fit_opc/outputs/07-conversion-loop/02-conversion-funnel.md` |
| 触达策略 | `7fit_opc/outputs/07-conversion-loop/01-reach-strategy.md` |

### 5.1 引用优先级排序

```
🔴 必读（每视频）：
- docs/opc/north-star.md
- docs/opc/niche-statement-v4.md
- docs/opc/headline-candidates.md

🟡 按视频类型：
- A 类 → docs/opc/founders-note.md
- B 类 → docs/fit_lc/prd.md §动作清单
- C 类 → docs/fit_lc/prd-details/ + 落地页骨架
```

---

## 6 · 周复核 SOP

> **每周末一次**（用户工作日时间有限，周末集中同步）。

```
1. 跑 §2 同步流程（1-5 步）
2. 对比上周发布视频引用的 fact，验证 SUMMARY.md 是否全
3. 更新 SUMMARY.md
4. 跑 §5 引用优先级，验证路径都对
5. 记录到日历（[calendar.md §4 月度复盘](../delivery/calendar.md)）
```

### 6.1 周复核 checklist

- [ ] 跑 §2 同步流程 5 步
- [ ] 验证上周发布视频引用的事实都有源
- [ ] 更新 SUMMARY.md（同步日期）
- [ ] 检查 `docs/fit_lc/` + `docs/opc/` 路径都对
- [ ] 标注未同步项（未来可能用）

---

## 7 · 写脚本时的引用 SOP

```
1. 用户说"做 X 视频"（[video-types.md §判定](../planning/video-types.md#判定流程必须问用户)）
   ↓
2. 跑 §2 同步流程（确保主题相关文档已同步）
   ↓
3. 读 docs/SUMMARY.md（看本次主题相关的事实在哪）
   ↓
4. 写 [research.md](../production/research.md)（从评论/平台/竞品/事实 4 维）
   ↓
5. 写 copy.md，每条事实标 [来源: <docs 路径> §<章节>]
   ↓
6. 跑 [copy.md §3.6 事实可追溯](../planning/copy.md#36-事实可追溯) 自检
```

---

## 8 · 异常处理

### 8.1 常见异常 + 修法

| 异常 | 现象 | 修法 |
|---|---|---|
| **外部仓库路径变了** | 引用失败 | 更新路径 + 写进 §3 SUMMARY |
| **同步后源文档被改** | 引用过期 | 增量同步 + 标日期 |
| **SUMMARY.md 漏更新** | 下次找不到引用 | 强制门控（详 §2.2）|
| **`docs/` 文件太多** | 工作区污染 | 增量同步（详 §4.1）|
| **跨仓库冲突** | 两个源说不同事 | 标注冲突 + 用户决策 |

### 8.2 异常决策表

| 异常 | 修法 | 影响范围 |
|---|---|---|
| **小问题**（1 处路径）| 改路径 | 单个视频 |
| **大问题**（仓库搬迁）| 全量重新同步 | 所有视频 |
| **冲突**（多源矛盾）| 用户决策 | 单条事实 |

---

## 9 · 5 维评分卡（同步质量）

> **每维 ≥ 3 分才能进 Phase 1（写 copy）**，总分 ≥ 15/25。

| 维度 | 1 分（差）| 3 分（中）| 5 分（优）| 本次得分 |
|---|---|---|---|---|
| **覆盖度** | 主题相关 < 50% | 主题相关 80% | 主题相关 100% + 未来可能用也同步 | — |
| **路径规范** | 直接放 docs/ 根 | 部分按子目录分类 | `docs/fit_lc/` + `docs/opc/` 全分类 | — |
| **SUMMARY.md 完整** | 不更新 | 更新了 | 更新 + 引用清单全 | — |
| **不污染源** | 改了源文档 | 复制后未改 | 复制后保留原文 + 标日期 | — |
| **引用闭环** | copy.md 无来源 | 50% 引用 docs/ | 100% 引用 docs/ + 双源 | — |

---

## 10 · 反模式

- ❌ 写脚本时不引用任何文档，凭"印象"编内容
- ❌ 复制整个仓库到 `docs/`（污染工作区）
- ❌ 改了源文档后忘记同步（导致视频说陈旧功能）
- ❌ 同步后不更新 SUMMARY.md（下次视频脚本找不到引用）
- ❌ 假设视频脚本作者记得外部仓库的细节（每条引用都要可追溯到 `docs/` 下的某个文件）
- ❌ 把视频脚本稿（`copy/`）放进 `docs/` —— `docs/` 只放外部同步
- ❌ 把项目内部规范（`rules/`）放进 `docs/` —— `docs/` 只放外部同步
- ❌ **不在 SUMMARY.md 写同步日期**（无法判断过期）
- ❌ **不区分 fit_lc/ 和 opc/ 子目录**（混在一起）
- ❌ **周不复核**（同步滞后）
- ❌ **跳过 5 维评分卡直接写 copy**

---

## 附录 A · 速查索引

| 我想... | 看... |
|---|---|
| 跑同步 | [§2 同步流程](#2-同步流程) |
| 套 SUMMARY 模板 | [§3 docs/SUMMARY.md 模板](#3-docssummarymd-模板) |
| 决策同步什么 | [§4 增量同步原则](#4-增量同步原则) |
| 查引用 | [§5 优先级引用](#5-优先级引用写脚本时直接读) |
| 周末复核 | [§6 周复核 SOP](#6-周复核-sop) |
| 修异常 | [§8 异常处理](#8-异常处理) |
| 跑评分 | [§9 5 维评分卡](#9-5-维评分卡同步质量) |

---

## 附录 B · 变更日志

### v2（2026-06-09）— 深化拓展

- **新增 §1.1 目录结构图**：6 子目录树状图
- **新增 §2.1 同步 SOP（5 步详解）**：每步动作+工具
- **新增 §2.2 同步时机**：3 时机决策
- **新增 §4.1 增量同步决策表**：3 情况→处理
- **新增 §4.2 同步边界**：4 同步项边界
- **新增 §5.1 引用优先级排序**：🔴 必读 + 🟡 按类型
- **新增 §6 周复核 SOP**：5 步流程
- **新增 §6.1 周复核 checklist**：5 项必走
- **新增 §7 写脚本时的引用 SOP**：6 步流程
- **新增 §8 异常处理**：5 类异常 + 决策表
- **新增 §9 5 维评分卡（同步质量）**：总分 ≥ 15 才能进 Phase 1
- **新增附录 A 速查索引** + **附录 B 变更日志**
- **§10 反模式从 7 条扩到 11 条**
- **保留不变**：§1 4 文档源 + §2 同步流程（基础 5 步）+ §3 SUMMARY 模板 + §4 增量同步原则（基础 5 原则）+ §5 优先级引用（基础 9 主题）+ §7 反模式（基础 7 条）

### v1（2026-06-04）— 初版

- 4 文档源 + 同步流程 + SUMMARY 模板 + 增量原则 + 优先级引用 + 反模式
- 由 winged_scapula_b3 实战沉淀
