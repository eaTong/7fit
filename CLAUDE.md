# CLAUDE.md

> 七练（7fit）视频生成仓库，通过 **Remotion** 制作产品宣传/营销视频。
> 素材在 `resources/`，文案从外部仓库同步到 `docs/`。

**北极星**：「用产品思维去健身，用健身改造产品。」
**钩子句**：「让健身更简单。」

**外部仓库**：
- 产品本体：`/Users/eatong/eaTong_projects/fit_lc`
- 品牌定位：`/Users/eatong/eaTong_projects/7fit_opc`

---

## 10 条铁律

1. **视频类型是开工第一步**——先判断 A/B/C，才能写脚本
2. **⏰ 改任何时间字段必走** [rules/timing-sync.md](rules/timing-sync.md)——B 类主体 50s / C 类七练解码 60s / A 类 ≥ 90s 全文无上限，中速 3.4 字/秒
3. **段间停顿 0.5-1s**——让观众消化前段内容
4. **场景转入+转出动效必标注**——每个 shot 边界都要写
5. **BGM 放最后**——总时长确定后才能选 BGM
6. **默认只预览**——必须用户说"开始渲染"才执行 `npx remotion render`
7. **每个视频一个独立 scene**——含 index.tsx + storyboard + subtitles + components/
8. **mmx 是默认 AI 工具**——图片/BGM（字幕由 `regenerate-subtitles.js` 自动生成，不再走 mmx ASR）
9. **事实可追溯**——功能/价格/数字必须能在 `docs/` 找到原文
10. **文案必须用户确认**——说"文案 OK"才能进 Phase 2

---

## 常用命令

```bash
cd remotion

npm run dev              # 启动 Studio 预览（默认动作）
npx remotion render <Id> out/<name>.mp4  # 渲染（必须用户说"开始渲染"）
npx remotion still <Id> --frame=90       # 单帧抽检
npm run lint                             # 类型检查
```

**旁白录制**：用户说"录旁白"时，运行 `node tools/regenerate-scenes.js` 生成字幕文件

**渲染硬规则**：默认只预览；1080×1920 竖屏；横屏需用户明确要求。

---

## 视频制作流程

```
Phase 1: 文案 + 分段 → 用户确认门
Phase 2: 脚本 + 时长计算
Phase 3: 字幕（`regenerate-subtitles.js` 基于 copy.md 自动生成）
Phase 4: 分镜 + 素材清单
Phase 5: 转场音效
Phase 6: BGM（放最后）
后期: 自检 → 组装 → 预览 → 渲染 → 发布 → 复盘
```

**每步开工前读对应 rules 文件，不要跳步。**

---

## Remotion 关键约定

- **动效唯一合法方式**：`useCurrentFrame()` + `interpolate()` / `spring()`
- **禁用**：CSS transition/animation、Tailwind 动画类、`requestAnimationFrame`
- `interpolate` 必须加 `extrapolateLeft/Right: "clamp"`
- 所有 Sequence 加 `premountFor={1 * fps}`
- 静态资源用 `staticFile('xxx')`
- 每个视频一个 Composition，在 `Root.tsx` 注册

---

## 工作流原则

- **素材先于脚本**——先看 `resources/` 有什么，不够的 mmx 生成
- **同步先于创作**——写脚本前先完成 `docs/` 同步
- **规则先于执行**——每阶段开工前读 `rules/<stage>.md`
- **事实可追溯**——功能/价格/数字必须能在 `docs/` 找到原文

---

## 规范索引（按需加载）

| 阶段 | 规范文件 |
|------|----------|
| 视频类型 | [rules/video-types.md](rules/video-types.md) |
| 文案 | [rules/copy.md](rules/copy.md) |
| 语速 | [rules/timing-sync.md](rules/timing-sync.md) |
| 脚本 | [rules/script.md](rules/script.md) |
| 字幕 | [rules/subtitle.md](rules/subtitle.md) |
| 分镜 | [rules/storyboard.md](rules/storyboard.md) |
| 动效 | [rules/animation.md](rules/animation.md) |
| BGM | [rules/bgm.md](rules/bgm.md) |
| 素材 | [rules/assets.md](rules/assets.md) |
| 渲染 | [rules/render.md](rules/render.md) |
| 发布 | [rules/publish.md](rules/publish.md) |

---

## 配色（视频主色板）

| 用途 | 色值 |
|---|---|
| 画布背景 | `#0A0A0A` |
| 强调色 1 | `#FF4500`（CTA / 元素半透明背景）|
| 强调色 2 | `#DC143C`（动作/警示）|
| 文字主色 | `#FFFFFF` |
| 文字次色 | `#888888` |

- **元素背景必须半透明+彩色**，禁止实色（#1A1A1A / #FFFFFF）
- 标题纯白 + bold，不加渐变/描边

---

## 资源检索

- **素材**：在 `resources/images/` 或 `resources/videos/` 按文件名查找
- **产品文档**：直接读 `/Users/eatong/eaTong_projects/fit_lc/docs/`
- **品牌文案**：直接读 `/Users/eatong/eaTong_projects/7fit_opc/outputs/`
- **旁白**：用户自录 `.m4a`（不用 TTS）
- **BGM/图片生成**：用 **mmx**
- **字幕转写**：mmx → `subtitles.json`

---

## 内容创作优先引用

| 主题 | 路径 |
|---|---|
| 产品功能 | `fit_lc/docs/PRD.md` |
| 北极星 | `7fit_opc/north-star.md` |
| 利基/钩子句 | `7fit_opc/outputs/02-niche-positioning/02-niche-statement-v4.md` |
| 转化漏斗 | `7fit_opc/outputs/07-conversion-loop/02-conversion-funnel.md` |

---

## 网络代理

遇到网络问题时设置本地代理：

```bash
export https_proxy=http://127.0.0.1:7897 http_proxy=http://127.0.0.1:7897 all_proxy=socks5://127.0.0.1:7897
```