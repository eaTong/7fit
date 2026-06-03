# 制作节奏（rhythm.md）

> 单条视频从 idea → published 的完整流程 + 每周复盘节奏
> 状态：✅ 锁版
> 更新日期：2026-06-04
> 关联：[[strategy.md]] / [[backlog.md]] / [[calendar.md]] / [rules/](../../remotion/rules/)

---

## 1. 单条视频制作流程（5 步 + 1 触发）

总时长预算：2-3h/条（B 类 2h / A 类 2.5h / C 类 3h）

```
[T-3 天]  选题      —— 从 backlog 选定，移到 writing
[T-2 天]  copy      —— 写文案（30-60min）
[T-2 天]  素材      —— 收集/拍摄/生成（30-60min）
[T-1 天]  storyboard + 实现（60-120min）
[T-1 天]  自检      —— checklist.md 30+ 项（15min）
[T-0]    预览      —— Studio 启动，等用户授权
[T-0]    渲染      —— 用户说"开始渲染"才执行
[T+0]    发布      —— 上传到对应账号
[T+1 天] 24h 数据记录
[T+7 天] 7 天数据 + 复盘
```

### 1.1 详细时间分配

| 阶段 | 时长 | 工具/规则 |
|---|---|---|
| 选题 | 5 min | [[backlog.md]] 选定 |
| 写 copy | 30-60 min | [copy.md](../../remotion/rules/copy.md) + [[accounts.md]] |
| 文档同步 | 10 min | docs/SUMMARY.md |
| 旁白 TTS | 5 min | mmx 文本转音频 |
| BGM 选型 | 5 min | [[strategy.md]] 类型映射 |
| mmx 识别字幕 | 5 min | 自动生成 subtitles.json |
| 素材收集 | 30-60 min | [[accounts.md]] 资源隔离 |
| 分镜 | 30 min | storyboard.md |
| 实现 Scene 组件 | 60-90 min | script.md + animation.md |
| 跑 checklist | 15 min | checklist.md |
| 启动 Studio 预览 | 2 min | npm run dev |
| 等用户授权 | 不计 | "开始渲染"指令 |
| 渲染 | 2-5 min | npx remotion render |
| 后处理/上传 | 10 min | 标题/标签/封面 |
| 发布 | 5 min | 上传抖音 |
| 数据记录 | 5 min | [[calendar.md]] |
| **小计** | **~3-5h/条** | — |

---

## 2. 一周工作流

### 周末（周日 + 周六）

```
周日 14:00  ━━  周复盘（看上周数据 + 调整下周排期）
周日 16:00  ━━  下周 3 条选题确认（从 backlog 选 3 个）
周日 18:00  ━━  副号 A 类（如果这周轮到）
周一-周四  ━━  自由制作时间（见下表）
周日 20:00  ━━  副号 A 类发布（如轮到）
```

### 工作日（周一至周五）

| 日 | 主号任务 | 时长 |
|---|---|---|
| 周一 | 写 copy + TTS 旁白 | 1h |
| 周二 | 实现 B 类 + Studio 预览 | 1.5h |
| 周二 19:30 | **主号 B 类发布** | 5 min |
| 周三 | C 类 copy + storyboard | 1.5h |
| 周四 | C 类实现 + 副号 A 类（如有）| 2h |
| 周五 19:30 | **主号 C 类发布** | 5 min |
| 周六 | 自由 / 备料 / 复盘 | — |

> **总周制作时间**：~6-8h（主号 B 2h + 主号 C 3h + 副号 A 1h + 杂项 1h）

---

## 3. 关键节点的"门控"（gating）

每一步有明确的"完成标志"，确保不返工：

### 3.1 copy 完成

- [ ] 通过 [copy.md 第 4.12 节](../../remotion/rules/copy.md) 违禁词自检（13 类，0 命中）
- [ ] 钩子在前 3 秒、≤ 25 字、第 1 字不寒暄
- [ ] 全文口语化，5 种钩子类型之一
- [ ] 事实可追溯（提到的事实都在 [[strategy.md]] / PRD 里能找到）
- [ ] 标注**目标账号**（主号/副号）
- [ ] 标注**视频类型**（A/B/C）

**门控**：自检 ❌ → 修，不发布

### 3.2 素材完成

- [ ] **assets.md 包含每个素材的"拍摄要求"**（视频素材必填 5 维度：机位/光线/时长/动作/其他）—— 见 [assets.md 第 2.2 节](../../remotion/rules/assets.md)
- [ ] 通过 [assets.md](../../remotion/rules/assets.md) 自动复制已有素材到 `remotion/public/<主题>/`
- [ ] 缺失素材 0 项（或明确标注"等待生成"）
- [ ] 训练动作视频 ≥ 5s（[storyboard.md 第 3.1 节](../../remotion/rules/storyboard.md)）
- [ ] 文件名一致（resources/、assets.md、组件 staticFile 三处）
- [ ] **拍摄前**：assets.md §5 拍摄清单 7 项全部确认

**门控**：素材缺失 → 阻塞，不能进入实现

### 3.3 storyboard 完成

- [ ] 每个分镜字段完整
- [ ] 视频类镜头 > 5s、图片类 = 字幕时长
- [ ] start 连续、总 end = 音频总时长
- [ ] 字幕对齐关系明确

**门控**：分镜不齐 → 阻塞

### 3.4 实现完成（Scene 组件）

- [ ] 所有 Sequence 加 `premountFor={1 * fps}`
- [ ] `interpolate` 都加 `extrapolateLeft/Right: "clamp"`
- [ ] 转场帧重叠 ≥ 0.3s
- [ ] 入场用 spring、出场用 Easing.in
- [ ] 半透明彩色背景，没有纯色块遮挡
- [ ] 没有 CSS transition/animation

**门控**：实现 ❌ → 不渲染，先修

### 3.5 自检完成（[checklist.md](../../remotion/rules/checklist.md)）

- [ ] 6 大块 30+ 项全部 ✅
- [ ] 没有 ❌ 项

**门控**：❌ → 不渲染，先修

### 3.6 渲染触发（[render.md](../../remotion/rules/render.md)）

- [ ] **用户说"开始渲染"**（默认只预览）
- [ ] 模糊措辞不算授权

**门控**：没收到指令 → 不渲染

---

## 4. 数据复盘节奏

### 4.1 24h 数据（每次发布后）

发布后 24 小时，记录到 [[calendar.md]]：
- 播放量
- 点赞数
- 评论数
- 收藏数
- 完播率（如可查）
- 评论关键词（前 5 条评论）

### 4.2 7 天数据（每周日）

发布后 7 天，记录到 [[calendar.md]]：
- 最终播放量
- 涨粉数
- 评论总结
- 是否"爆款"（如播放 > 平时 2x）
- 是否"踩雷"（如播放 < 平时 0.3x）

### 4.3 月度复盘（每月最后一天）

填 [[calendar.md]] 的"月度复盘"表：

- 哪类内容数据最好？（B / C / A）
- 哪类最难做？
- 副号是否被发现？
- 制作流程的瓶颈在哪？
- M+1 比例是否调整？

### 4.4 季度复盘（每 3 个月）

- 账号定位是否需要调整？
- 是否扩第三平台（视频号/小红书）？
- 是否增加产能？

---

## 5. 工具与模板速查

### 5.1 命令速查

```bash
# 启动 Studio 预览
cd remotion && npm run dev

# 渲染（用户授权后）
cd remotion && npx remotion render <CompositionId> out/<name>.mp4

# 单帧抽检
cd remotion && npx remotion still <CompositionId> --frame=90

# 类型检查
cd remotion && npm run lint
```

### 5.2 模板文件速查

| 用途 | 模板 |
|---|---|
| 写文案 | [copy.md 第 7 节模板](../../remotion/rules/copy.md) |
| 素材清单 | [assets.md 第 2 节模板](../../remotion/rules/assets.md) |
| 分镜表 | [storyboard.md 第 2 节模板](../../remotion/rules/storyboard.md) |
| 自检 | [checklist.md 第 2 节](../../remotion/rules/checklist.md) |
| 月度排期 | [[calendar.md]] |

### 5.3 mmx 用法速查

| 用途 | mmx 工具 | 规则 |
|---|---|---|
| 旁白 TTS | mmx TTS | 输出到 `resources/audios/<主题>.mp3` |
| BGM 生成 | mmx 音乐 | 输出到 `resources/audios/bgm/<类型>.mp3` |
| 图片生成 | mmx 图片 | 输出到 `resources/images/<主题>/` |
| 字幕识别 | mmx ASR | 输出到 `remotion/src/scenes/<主题>/subtitles.json` |

---

## 6. 应急流程

### 6.1 视频在 Studio 预览有 bug

1. 看控制台错误
2. 对照 [animation.md](../../remotion/rules/animation.md) 第 16 节速查
3. 修复后回到 [checklist.md](../../remotion/rules/checklist.md) 第 2 节重跑

### 6.2 渲染失败

1. 跑 `npx remotion still <id> --frame=<错帧>` 定位
2. 对照 [render.md](../../remotion/rules/render.md) 第 3 节防卡帧 7 类
3. 修复 → 重跑 checklist → 重渲染

### 6.3 发布后数据异常（0 播放 / 被限流）

1. 检查内容是否触发抖音公约（参考 [copy.md 第 4 节](../../remotion/rules/copy.md)）
2. 检查是否被算法误判"营销号"（太多 C 类连续发布）
3. 暂停 1 周发 C 类，回归纯 B 类内容
4. 申诉（如果认为是误判）

### 6.4 副号被发现/被反查

立即启动 [[accounts.md]] 第 6 节紧急预案。

---

## 7. 速查清单（每周日）

- [ ] 看上周 3 条发布数据，填入 [[calendar.md]]
- [ ] 从 [[backlog.md]] 选下周 3 条选题
- [ ] 更新 [[calendar.md]] 下周排期
- [ ] 准备下周 3 条的 copy（如果周日晚有空）
- [ ] 检查副号账号安全（[[accounts.md]] 第 5 节）

---

## 8. 速查清单（每月初）

- [ ] 填 [[calendar.md]] 当月排期表
- [ ] 决定当月是否调整 [[strategy.md]] 比例
- [ ] 备份 [[calendar.md]] 历史发布数据

---

## 9. 速查清单（每月底）

- [ ] 填 [[calendar.md]] 月度复盘表
- [ ] 归档 [[backlog.md]] 中 published > 30 天的
- [ ] 评估 [[accounts.md]] 账号健康度
- [ ] 决策 M+1 比例与排期
