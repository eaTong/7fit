# 外部同步文档（docs/）

> **本目录是从外部 2 个仓库增量同步过来的产品/品牌文档**，供 AI Agent 撰写视频脚本时查询。
>
> **写入人**：Claude Code（按 [docs-sync.md](../rules/planning/docs-sync.md) 规则）
> **同步源**：`/Users/eatong/eaTong_projects/fit_lc` + `/Users/eatong/eaTong_projects/7fit_opc`

---

## 目录约定

| 子目录 | 内容来源 | 用途 |
|---|---|---|
| `fit_lc/` | 7fit 产品本体仓库 | PRD、功能细节、数据模型、API |
| `opc/` | 7fit 品牌仓库 | 北极星、利基、Headline、转化漏斗 |
| `SUMMARY.md` | （本目录根）| 同步索引 + 视频脚本可引用的事实清单 |

---

## 同步工作流

> 完整规范见 [../rules/planning/docs-sync.md](../rules/planning/docs-sync.md)。

```
1. 扫描 fit_lc/docs/ 找出与视频主题相关的新增/修改
2. 扫描 7fit_opc/outputs/ 找出相关新增/修改
3. 把与视频主题相关的文档增量复制到 docs/{fit_lc|opc}/ 下
4. 生成或更新 docs/SUMMARY.md（同步清单）
5. 视频脚本引用 docs/ 下的具体章节
```

---

## 反模式

- ❌ 把视频脚本产物（如文案稿）放进 `docs/`
- ❌ 把项目内部规范（如 `rules/` 下的文档）放进 `docs/`
- ❌ 整个仓库复制（只复制与本次视频主题相关的章节）
- ❌ 修改源文档（`fit_lc` / `7fit_opc`）—— `docs/` 是只读快照
- ❌ 同步后不更新 SUMMARY.md（下次视频脚本找不到引用）
