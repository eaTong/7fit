# 外部文档同步规范（docs-sync）

> 阶段：内容创作前的**信息准备**（external docs → internal SUMMARY）
> 适用场景：写文案稿 / 拍视频前——**先**把外部仓库的相关文档增量同步到 `resources/docs/`
> 来源：用户硬约束（CLAUDE.md "文档同步工作流" 段）
> 状态：✅ 生效
> 上下游：上游 = `/Users/eatong/eaTong_projects/fit_lc`（产品）+ `/Users/eatong/eaTong_projects/7fit_opc`（品牌）；下游 = `copy.md`（写文案）+ `video-types.md`（判类型）

---

## 0. 为什么这一步是"必做"

> **核心规则**：**视频脚本作者不应当假设自己记得外部仓库的细节**——每条引用都要可追溯到 `resources/docs/` 下的某个文件。

反模式（**禁止**）：
- ❌ "七练有个 X 功能" → 直接写在文案里，但 `resources/docs/` 没有原文
- ❌ "我们最新定价 Y" → 没有同步到内部文档，写错了就被打脸
- ❌ "创始人说 Z" → 没有 OPC 文档的来源

正模式（**强制**）：
- ✅ 写文案前**先**扫外部仓库的最近变更
- ✅ 把相关文档**复制**到 `resources/docs/`
- ✅ 写 `SUMMARY.md` 列出"哪些文档已同步 / 各自关键信息 / 视频脚本可用的事实清单"
- ✅ 写文案时**只引用** `resources/docs/` 里的内容，**不**直接读外部仓库

---

## 1. 同步工作流

### 1.1 触发条件

| 场景 | 是否触发 |
|---|---|
| 用户说"出 X 视频" | ✅ **必触发**（写文案前的第 0 步）|
| 用户说"改 X 视频" | ✅ 触发（确保改完还基于最新事实）|
| 用户说"加一个新功能视频" | ✅ 触发（新功能必然有 PRD 变更）|
| 用户说"重发同款文案" | ❌ 不用（已经同步过）|

### 1.2 流程

```
0. 拿到视频主题关键词
       ↓
1. 扫描 2 个外部仓库的最近 7 天变更
   - /Users/eatong/eaTong_projects/fit_lc
   - /Users/eatong/eaTong_projects/7fit_opc
       ↓
2. 筛选与本视频主题相关的文档
       ↓
3. 复制到 resources/docs/  （按子目录或主题命名）
       ↓
4. 写 resources/docs/SUMMARY.md  （本文件 §2 模板）
       ↓
5. 写文案时，只引用 resources/docs/ 里的内容
```

### 1.3 同步检查（写文案前 5 分钟）

- [ ] 外部 2 个仓库都扫了最近 7 天变更
- [ ] 与本视频主题相关的文档**全部**复制到 `resources/docs/`
- [ ] `SUMMARY.md` 已更新
- [ ] 写文案时**没有**直接读外部仓库（只读 `resources/docs/`）

---

## 2. SUMMARY.md 模板

`resources/docs/SUMMARY.md` 必须按以下结构写（视频脚本作者要一眼能找到"我需要的事实"）：

```markdown
# 视频项目文档总览

**最后更新**：<YYYY-MM-DD>
**当前视频主题**：<主题>
**当前视频类型**：<A/B/C>（详见 video-types.md）
**外部仓库扫描范围**：最近 7 天

---

## 1. 已同步的文档清单

| 文件 | 来源仓库 | 同步日期 | 用途（视频脚本要引用什么）|
|---|---|---|---|
| `prd.md` | fit_lc | 2026-06-04 | 产品功能 / 卖点 / 数据 |
| `prd-details/auth.md` | fit_lc | 2026-06-04 | 登录 / 注册 / 第三方登录相关 |
| `opc-niche.md` | 7fit_opc | 2026-06-04 | 利基定位 / 用户画像 / 痛点 |
| `opc-headline.md` | 7fit_opc | 2026-06-04 | 钩子句 / 标题候选 |
| `opc-founders-note.md` | 7fit_opc | 2026-06-04 | 创始人故事 / 价值观 |
| ... | | | |

---

## 2. 视频脚本可用的事实清单（按主题分类）

> 这一节是"事实速查"——写文案时直接挑用。

### 2.1 产品功能 / 数据
- 训练计划自动生成（基于 7 练的 RPE 算法）—— `prd.md §3.2`
- 智能补全动作名（OCR + 动作库）—— `prd.md §4.1`
- PR 突破自动识别（重量 × 次数 × RPE）—— `prd.md §5.3`
- 7 练有 4 大模块：训练 / 记录 / AI 教练 / 社区 —— `prd.md §2`

### 2.2 用户痛点（从 OPC 文档提炼）
- 中级健身者最痛的不是"不会练"，是"练了不知道练得对不对" —— `opc-niche.md §3.2`
- 70% 健身者有体态问题但不自知 —— `opc-niche.md §4.1`

### 2.3 钩子句候选（来自 OPC）
- "让健身更简单。" —— `opc-headline.md §1.1`（品牌主推）
- "用产品思维去健身，用健身改造产品。" —— `opc-niche.md §1`（北极星）
- "你以为的挺胸其实是翼状肩胛" —— `opc-headline.md §3.5`（反常识型）

### 2.4 创始人故事（仅 A 类视频用）
- 创始人做了 5 年产品经理，从 0 健身到 PR 100KG —— `opc-founders-note.md §2`
- 七练不是"产品"是"实验"——每改一版看用户反馈 —— `opc-founders-note.md §3`

### 2.5 定价 / 商业模式（仅 C 类视频用）
- 免费版 + Pro 版（¥39/月）—— `prd.md §6.1`

---

## 3. 视频脚本的"红线"（这些不能写）

- ❌ 不能承诺"X 天见效"——产品没承诺过 → `prd.md §6.5` 商业化边界
- ❌ 不能用"最 / 第一 / 唯一"等绝对化词 —— `opc-niche.md §5.1` 品牌调性
- ❌ 不能用创始人真名 / 公司真名 —— 涉及隐私

---

## 4. 待补充（同步过程中发现但没抄的）

- [ ] `prd-details/onboarding.md` —— 还没抄，但可能与"新手引导"视频相关
- [ ] `7fit_opc/outputs/05-pricing/` —— 还没抄，但 C 类视频可能用
```

### 2.1 模板使用说明

- §1 表格**必须**列出"每个文件 + 来源 + 同步日期 + 用途"——4 列缺一不可
- §2 事实清单**按主题分类**——不是为了好看，是为了写文案时**快速找**
- §3 红线**是 OPC / PRD 中明文禁止的**——写文案时**最后**过一遍
- §4 待补充**保留**——下个视频可能用

---

## 3. 外部仓库扫描方法

### 3.1 用 git 看最近变更（推荐）

```bash
# fit_lc 最近 7 天变更
cd /Users/eatong/eaTong_projects/fit_lc
git log --since="7 days ago" --name-only --pretty=format:"%h %s" | head -50

# 7fit_opc 最近 7 天变更
cd /Users/eatong/eaTong_projects/7fit_opc
git log --since="7 days ago" --name-only --pretty=format:"%h %s" | head -50
```

### 3.2 按主题关键词找

```bash
# 找所有提到"翼状肩胛"的文档
grep -r "翼状肩胛" /Users/eatong/eaTong_projects/fit_lc/docs/ 2>/dev/null
grep -r "翼状肩胛" /Users/eatong/eaTong_projects/7fit_opc/outputs/ 2>/dev/null
```

### 3.3 优先级：哪些文档必同步

| 视频类型 | 必同步的文档 |
|---|---|
| **A 个人人设** | `opc-niche.md` + `opc-founders-note.md` + `north-star.md`（北极星）|
| **B 健身知识** | 外部医学 / 解剖参考（如果引用了）+ OPC 痛点文档 |
| **C 七练介绍** | `prd.md` + `prd-details/`（与本视频相关的）+ `prd.md §6` 定价 |

---

## 4. resources/docs/ 目录结构

```
resources/docs/
├── SUMMARY.md              # ← 总览（本文件 §2 模板）
├── prd.md                  # 产品主文档
├── prd-details/            # 产品子模块
│   ├── auth.md
│   ├── training-plan.md
│   └── ...
├── opc-niche.md            # 利基 / 用户画像
├── opc-headline.md         # 钩子句候选
├── opc-founders-note.md    # 创始人故事
├── research/               # 调研材料
│   ├── winged_scapula.md   # 翼状肩胛医学参考（B 类视频用）
│   └── ...
└── copy/                   # 文案稿（由 copy.md §1.3 落地）
    ├── workout_intro.md
    ├── winged_scapula_b3.md
    └── ...
```

---

## 5. 速查清单（同步前 + 写文案前——只列**本文件专属**项）

> **跨文件去重原则**：通用自检（视频内容/违禁词）见 [checklist.md](checklist.md)；本节只列**文档同步**专属项。

**同步前**

- [ ] 拿到视频主题关键词
- [ ] 外部 2 个仓库都扫了最近 7 天变更（git log）
- [ ] 用主题关键词 grep 找相关文档
- [ ] 与本视频主题相关的文档**全部**复制到 `resources/docs/`

**写 SUMMARY.md 时**

- [ ] §1 表格 4 列齐全：文件 + 来源 + 同步日期 + 用途
- [ ] §2 事实清单按主题分类（功能 / 痛点 / 钩子 / 故事 / 定价）
- [ ] §3 红线明确（不能写什么）
- [ ] §4 待补充保留

**写文案前**

- [ ] `resources/docs/SUMMARY.md` 已存在
- [ ] 文案里所有事实都能在 `resources/docs/` 找到原文
- [ ] 写文案时**没有**直接读外部仓库（只读 `resources/docs/`）
- [ ] 文案完成后跑一次 [copy.md §8 违禁词自检](copy.md)
