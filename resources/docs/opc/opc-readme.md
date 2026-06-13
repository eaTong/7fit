# 7fit_opc · 一人公司 OPC 产出仓库

> 副业 IP · 七练小程序（AI 健身记录 + 智能周复盘）的一人公司完整孵化记录
> 基于《一人企业方法论》第二版 · 9 阶段 SOP
> 协作团队：OPC 一人公司专家团 · 主理人 易牧

---

## 仓库用途

本仓库是 OPC 专家团**对外可发布**产出的版本化管理仓库。

| 用途 | 说明 |
|---|---|
| 主工作区 | `~/WorkBuddy/<session>/opc-doc/`（OPC 团队工作目录，含完整内部桥接/状态文件）|
| **本仓库** | `~/eaTong_projects/7fit_opc/`（git 跟踪，**只含可对用户输出的内容**）|
| 同步方式 | `cp -R` 全量镜像 + 偶尔 `rsync` 增量 |
| 当前阶段 | **建盘期 · 07 转化闭环**（进行中） |

> **关于目录分工**：主工作区是 OPC 团队"工作目录"，含完整内部桥接、阶段状态、决策日志，方便下次会话的主理人/成员恢复上下文。本仓库是用户"对外仓库"，只保留最终可对用户/对市场输出的内容（品牌文案、产品方案、转化路径等）。

---

## 当前状态

- ✅ **建盘期 01-03** 已完成（资源盘点 / 利基定位 / 价值主张）
- ⏭️ **建盘期 04 商业模式** 跳过（plugin 不可用，已写跳过说明）
- ⏭️ **验证期 06 MVP 设计** 跳过（plugin 卡住，已写跳过说明）
- 🔄 **验证期 07 转化闭环** 进行中（2/5 文件已落盘：触达策略 + 转化漏斗）
- ⏳ **运营期 08-09** 待触发

---

## 目录结构（17 个文件 · 全是可对用户输出）

```
.
├── README.md                        ← 本文件
├── SYNC_NOTES.md                    ← 主工作区 ↔ 本仓库 同步说明
├── .gitignore                       ← git 忽略规则
├── git-init.sh                      ← git 初始化脚本（一次性）
│
├── north-star.md                    ← 品牌三层架构（核心锁版）
│
└── outputs/
    ├── 01-resource-audit/           ← 资源盘点（8 大类）
    │   ├── resource-inventory.md
    │   └── scorecard.json
    │
    ├── 02-niche-positioning/        ← 利基定位（三环 + 六维）
    │   ├── 01-three-circles.md
    │   ├── 02-niche-statement-v4.md ⭐ 核心对外文案
    │   └── 03-six-dimension-score.md
    │
    ├── 03-value-proposition/        ← 价值主张（VPC 完整版）
    │   ├── 01-vpc-customer-profile.md
    │   ├── 02-vpc-value-map.md
    │   ├── 03-headline-candidates.md ⭐ 对外文案
    │   ├── 04-landing-page-skeleton.md ⭐ 落地页骨架
    │   └── 05-founders-note.md ⭐ 480 字创始人故事
    │
    └── 07-conversion-loop/          ← 转化闭环（进行中）
        ├── 01-reach-strategy.md      ✅ 3 大渠道触达
        ├── 02-conversion-funnel.md   ✅ 6 步转化漏斗
        ├── 03-pricing-page-design.md ⏳ 待落盘
        ├── 04-flywheel-launcher.md   ⏳ 待落盘
        └── 05-cost-feasibility-check.md ⏳ 待落盘
```

---

## 阶段地图

```
建盘期 ────────────────────────────────────
01 资源盘点 ✅ → 02 利基定位 ✅ → 03 价值主张 ✅
                                        ↓
                          04 商业模式 ⏭️（跳过）
                                                ↓
                          06 MVP 设计 ⏭️（跳过）→ 07 转化闭环 🔄

运营期 ────────────────────────────────────
08 资产沉淀 ← → 09 经营复盘（按需触发，无固定顺序）
```

---

## 关键决策摘要

- **D-001**：项目方向 = 健身赛道（基于创始人 2 年训练 + 七练代码资产）
- **D-002**：利基 = 雏形 A（AI 训练日志 + 智能周复盘）· 六维 25/30 强机会
- **D-003**：陈述结构 = 三层架构（灵魂 why + 钩子 hook + 产品 what）
- **D-004**：灵魂 why 锁版 =「用产品思维去健身，用健身改造产品」
- **D-005**：钩子 hook 锁版 =「让健身更简单」
- **D-006**：MVP 边界 = 砍 B/C/D 三雏形 + 社交；保留 3 秒记录 / 智能周报 / 个人化问答
- **D-007**：Headline 组合 = 都要（A 主标题 / C 故事区 / B 价格锚定）
- **D-008**：Founder's Note 480 字成稿通过，不修改
- **D-009**：跳过 06 MVP 直入 07 转化闭环

---

## 用户模式 & 偏好

- **用户模式**：教学模式（边走边解释术语）
- **用户身份**：产品经理 + 前程序员，健身爱好者，七练小程序作者
- **硬约束**：月投入 ≤ 1000 元 / 单人运营 / 本职工作优先 / 公域渠道近乎零
- **节奏偏好**：快速决策，单字回答常见

---

## 同步流程

每次主工作区有"可对用户输出"的新产出：

```bash
# 方式 A：全量镜像
cp -R ~/WorkBuddy/<session>/opc-doc/. ~/eaTong_projects/7fit_opc/

# 方式 B：rsync 增量（推荐长期使用）
rsync -av --delete \
  ~/WorkBuddy/<session>/opc-doc/ \
  ~/eaTong_projects/7fit_opc/

# ⚠️ 注意：本仓库是"对外精简版"，同步后需清理内部桥接/状态文件
#   （handoff-*.md / skip-notice.md / session-summary.md / state/）

# 提交到 git
cd ~/eaTong_projects/7fit_opc
git add -A
git commit -m "stage 07: 落盘价格页 + 飞轮启动器"
```

---

## 方法论原书

《一人企业方法论》第二版 · https://ft07.com

> 主理人：易牧（OPC 一人公司专家团主理人）
