# 自检清单（remotion）

> 阶段：**每个视频需求开工前的预检（pre-flight check）**
> 适用场景：用户提出"做一条新视频"时；或在实现 Scene 组件前；或在准备渲染前
> 来源：用户硬约束
> 状态：✅ 生效
> **第一步**：先确定视频类型（A/B/C，见 `video-types.md`）—— 不同类型的检查项略有差异
> 上下游：是所有其他 rules 的**汇总检查**——任何一项 ❌ 都不能进入下一步

> ⏰ **2026-06-04 强制**：检查「时间字段同步」必走 [timing-sync.md §3 同步清单](./timing-sync.md#3-时间同步清单修改后必须改的-7-个文件) 7 个文件。
> 改任何时间字段（钩子/主体/收尾/中速/语速）→ 7 个文件必须全部同步。

---

## 0. 关于本清单的设计（去重原则）

本清单是**所有自检的 master**——其他 rules 文件末尾的"速查清单"是**本文件专属的精简版**。

**设计原则**：

1. **本文件（checklist.md）** 包含**完整 6 大块 30+ 项**自检，跨所有阶段
2. **其他 rules 文件**的速查清单**只列本文件专属项**（不重复其他文件已经覆盖的）
3. 跨文件重复的项目 → 标注"→ 详见 [xxx.md](remotion/rules/xxx.md) 第 X 节"
4. 真正需要"全维度检查"时，**只跑本清单即可**

> **避免重复的反模式**：以前每个 rules 文件都有自己的速查清单，30-40% 内容重复（色板、安全区、转场、违禁词等）。现在每个文件的速查清单只回答"我这一段独有的事"，跨段检查统一走本文件。

---

## 1. 自检触发条件

在以下任一时机，**必须**运行本清单：

1. **新视频需求**：用户说"做一条 X 视频" → 先跑清单看是否已就位
2. **实现 Scene 组件前**：写 `scenes/<主题>/components/Shot*.tsx` 之前
3. **准备渲染前**：`npx remotion render` 之前最后一次检查

⚠️ **任一项 ❌ → 不要往下走**，先解决阻塞项。

---

## 2. 完整自检清单（6 大块，30+ 项）

> **这是 master 版本**——其他 rules 文件的速查清单只列**本文件专属**项，跨阶段检查统一来本节。

### ✅ A. 文档与文案（`copy.md`）

- [ ] `resources/docs/SUMMARY.md` 存在（含本次视频用到的所有事实）
- [ ] `resources/docs/copy/<主题>.md` 文案稿存在
- [ ] 文案通过违禁词自检（见 `copy.md` 第 4.12 节）
- [ ] 钩子在前 3 秒（≤25 字，第 1 字不寒暄）
- [ ] 全文口语化（短句 ≤20 字 + 允许语气词 + 第一/二人称）
- [ ] 事实可追溯：提到的功能/价格/数字都能在 `resources/docs/` 找到原文

### ✅ B. 字幕（`subtitle.md`）

- [ ] `remotion/src/scenes/<主题>/subtitles.json` 存在
- [ ] 每条字幕包含 `id` / `start` / `end` / `segments`
- [ ] 每个 `segment` 有 `text` + `highlight` 字段
- [ ] 重点内容已打 `highlight: true`（数字/动作词/品牌句/CTA）
- [ ] 字幕 `start` 连续无空隙（第一条从 0 开始，最后一条 end = 音频总时长）
- [ ] 单条字幕 ≤ 24 字、≤ 4s
- [ ] 字幕总时长 = 旁白音频时长（误差 ≤0.3s）
- [ ] 没有句末标点（句号/问号/感叹号）

### ✅ C. 音频（`bgm.md`）

- [ ] **旁白音频**：`resources/audios/<主题>.m4a` 存在（**🆕 2026-06-05：从 mp3 改 m4a**——iPhone 语音备忘录默认格式）
- [ ] **旁白格式校验**：M4A / AAC-LC / 单声道 / 44.1-48 kHz / 64-128 kbps+
- [ ] **BGM 选型**：第 2.5 节速查表中选定了对应类型（Cyber Pulse / Power Build / Quiet Think / Hop Pulse）
- [ ] **BGM 文件**：`resources/audios/bgm/<类型>.mp3` 存在（mmx 生成 / 用户提供 / 第三方，**仍用 mp3 与旁白区分**）
- [ ] BGM 时长 ≥ 视频总时长（可循环则 OK）
- [ ] 旁白（m4a）和 BGM（mp3）都在 Scene 组件中正确 import（`staticFile('audios/...')`）

### ✅ D. 素材（`assets.md`）

- [ ] `remotion/src/scenes/<主题>/assets.md` 存在
- [ ] **缺失素材 0 项**——所有分镜的 content_source 都已就位
- [ ] **素材与分镜完全匹配**：
  - video 分镜 → 实际是 .mov/.mp4 文件
  - image 分镜 → 实际是 .png/.jpg/.webp
  - data_viz → 实际是图片或可代码生成（不是空文件）
  - animation → 标注"代码生成"，assets.md 中**不需要列出**
- [ ] **已自动复制**：`remotion/public/<主题>/{videos,images,audios}/` 都有对应文件
- [ ] **文件名拼写一致**：`assets.md` 写的文件名 = 实际文件名 = 组件中 `staticFile()` 调用的文件名
- [ ] **时长约束**（见 `storyboard.md` 第 3 节）：
  - video 分镜的素材时长 ≥ 5s
  - image 分镜无时长要求
- [ ] **训练动作素材**（主要适用于**类型 B** 健身知识视频）：用户自己拍摄（不用 mmx 生成的"假人健身"）

### ✅ E. 分镜（`storyboard.md`）

- [ ] `remotion/src/scenes/<主题>/storyboard.md` 存在
- [ ] `remotion/src/scenes/<主题>/storyboard.json` 存在
- [ ] 每个分镜字段完整：`shot_id` / `start` / `end` / `duration` / `content_type` / `content_source` / `voiceover` / `description`
- [ ] 分镜总 `end` = 字幕总时长 = 音频总时长（**三者必须完全一致**）
- [ ] 没有分镜的 `content_type` 是"纯色 + 文字"
- [ ] `description` 描述的是画面（不是文字在说什么）
- [ ] 字幕对齐关系明确（1:1 / 1:N / N:1）
- [ ] 已有 components/ 目录规划（每镜一组件）

### ✅ F. 实现与渲染准备

- [ ] 主题目录用 kebab-case 英文/拼音（如 `workout_intro`）
- [ ] `remotion/src/scenes/<主题>/index.tsx` 入口文件存在
- [ ] `remotion/src/Root.tsx` 已注册本视频的 Composition
- [ ] 所有依赖包已安装（`@remotion/transitions` / `@remotion/light-leaks` 等）
- [ ] 如需转场 → 已 `npx remotion add @remotion/transitions`
- [ ] 如需光斑 → 已 `npx remotion add @remotion/light-leaks`
- [ ] 如需音频可视化 → 已 `npx remotion add @remotion/media-utils`

---

## 3. 自检输出格式

把自检结果输出到用户面前，**让用户一眼看到是否能进入实现**。

### 3.1 ✅ 全部通过时

```markdown
## 自检：<视频主题>  →  ✅ Ready to implement

- ✅ 文档与文案（6/6 通过）
- ✅ 字幕（8/8 通过）
- ✅ 音频（5/5 通过）
- ✅ 素材（7/7 通过）—— 4 个视频 + 3 个图片全部就位
- ✅ 分镜（8/8 通过）—— 6 个分镜，总时长 15.2s
- ✅ 实现准备（5/5 通过）

**阻塞项：0**
**总时长：15.2s** | **分镜数：6** | **素材数：7**

可以开始实现 Scene 组件。
```

### 3.2 ❌ 有阻塞项时

```markdown
## 自检：<视频主题>  →  ❌ Blocked（5 项需修复）

### 阻塞项

1. **缺失素材 S03**：周报数据图
   - 文件类型应为：image
   - 当前位置：resources/images/（未找到）
   - 修复：mmx 生成（参见 `assets.md` 第 4.1 节 prompt 模板）
   - 阻塞：S03 分镜无法实现

2. **BGM 未选型**：
   - 当前 BGM 文件不存在：resources/audios/bgm/cyber_pulse_default.mp3
   - 修复：根据视频类型选定 BGM 类型并生成（参见 `bgm.md` 第 2.5 节）
   - 阻塞：视频无法正常混音

3. **字幕与音频时长不匹配**：
   - 字幕总时长：15.2s
   - 旁白音频时长：12.8s
   - 差异：2.4s（> 0.3s 阈值）
   - 修复：调整字幕（删 1-2 条）或重新自录（参考 [copy.md §9](copy.md#9-用户自录旁白规范2026-06-04-起-tts-退役)）

4. **分镜 S05 时长错误**：
   - content_type=video 但 duration=3.2s（< 5s 阈值）
   - 修复：要么把视频镜头延长（覆盖更多字幕），要么换成 image

5. **文件未复制**：
   - resources/videos/卧推80KG_10.mov 未复制到 remotion/public/<主题>/videos/
   - 修复：执行 `cp`（参见 `assets.md` 第 3.2 节）

### 通过项

- ✅ 文档与文案
- ✅ 字幕 JSON 格式
- ✅ 违禁词自检
- ⏸️ 音频（待补全）
- ⏸️ 素材（4 项缺失）
- ⏸️ 分镜（1 项时长错误）
- ✅ 实现准备
```

---

## 4. 何时再次自检

### 4.1 阻塞项修复后

每修复一项，重新跑清单（自动或手动）—— 不能再凭印象说"应该 OK 了"。

### 4.2 准备渲染前（最后一道关）

```bash
# 1. 跑最终自检清单
# 2. 全部通过 → 执行：
cd remotion
npx remotion render <CompositionId> out/<name>.mp4
```

### 4.3 渲染失败的回退

如果渲染失败：
1. 先查 Remotion 控制台错误（一般是 missing asset / 帧数错误 / 类型错误）
2. 对照本清单检查"实现准备"一节
3. 必要时回到 `storyboard.md` / `assets.md` 重新走流程

---

## 5. 自检清单与各 rules 的对应

| 自检项 | 来源 |
|---|---|
| A. 文档与文案 | [copy.md](remotion/rules/copy.md) 第 4.12（违禁词）+ 第 8（速查清单）|
| B. 字幕 | [subtitle.md](remotion/rules/subtitle.md) 第 5（对齐）+ 第 8（速查清单）|
| C. 音频 | [bgm.md](remotion/rules/bgm.md) 第 2.5（选型）+ 第 8（速查清单）|
| D. 素材 | [assets.md](remotion/rules/assets.md) 第 2（格式）+ 第 8（速查清单）|
| E. 分镜 | [storyboard.md](remotion/rules/storyboard.md) 第 3（时长约束）+ 第 7（速查清单）|
| F. 实现准备 | [script.md](remotion/rules/script.md) + [animation.md](remotion/rules/animation.md) |

> **本清单是其他所有 rules 的"汇总速查"**——发现某项 ❌ 时，**先回到对应 rules 文件查细节，再修复**。

---

## 6. 速查清单（用户的 4 个必看）

> 用户最关心的 4 件事（来自原始约束）：
> 1. 是否有足够的素材（**完全匹配**）
> 2. 字幕/音频是否完整

### 6.1 素材"完全匹配"判定

| 判定项 | ✅ 匹配 | ❌ 不匹配 |
|---|---|---|
| 文件类型 | video 分镜 → .mov/.mp4<br>image 分镜 → .png/.jpg/.webp | 错位（如 image 分镜用了 .mov）|
| 内容语义 | 文件名/内容与 `description` 描述一致 | 文件名对不上（`卧推80KG_10.mov` 用到了"深蹲"分镜）|
| 时长 | video 素材 ≥ 5s<br>image 素材无要求 | video 素材 < 5s |
| 文件可访问 | `remotion/public/<主题>/` 下能找到 | 还在 `resources/`，没复制过来 |
| 文件可播放 | 用 ffmpeg/Studio 打开能正常播放 | 文件损坏/编码异常 |

### 6.2 字幕/音频"完整"判定

| 判定项 | ✅ 完整 | ❌ 不完整 |
|---|---|---|
| 字幕文件 | subtitles.json 存在且格式正确 | 缺失 / 字段不全 / 解析失败 |
| 字幕覆盖 | 0s 到音频末尾全覆盖 | 中间有空隙 / 末尾缺失 |
| 音频文件 | 旁白 + BGM 都在位 | 任何一个缺失 |
| 时长对齐 | 字幕总时长 ≈ 音频总时长（±0.3s）| 差异 > 0.3s |
| 重点标记 | highlight 字段覆盖数字/动作/品牌句 | 全部 highlight=false 或没有 highlight 字段 |
| 音画同步 | Studio 预览中字幕与音频人声对齐 | 字幕比人声早/晚 > 0.5s |

### 6.3 用户的"开始渲染"决策树

```
跑自检清单
  ↓
全 ✅ ?
  ├─ 是 → 直接 npx remotion render
  └─ 否 → 列阻塞项 → 用户决定：
      ├─ 现在修 → 修完再跑清单
      ├─ 跳过该项继续 → 标注风险，下次补
      └─ 放弃本次视频 → 归档 storyboard.md / assets.md
```

---

## 7. 与 `assets.md` 的边界

| 关注点 | `assets.md` | `checklist.md`（本文件）|
|---|---|---|
| 何时用 | **生成/更新脚本/分镜时**（创造阶段） | **开工前/渲染前**（验证阶段）|
| 输出 | 素材清单（已就位 + 缺失）| 自检结果（Ready/Blocked）|
| 是否动手复制 | ✅ 自动 `cp` | ❌ 只检查，不动手 |
| 阻塞时怎么办 | 列缺失项 + mmx prompt | 列阻塞项 + 修复建议 |

> **assets.md 是"计划清单"，checklist.md 是"通过/不通过"——分工不同，不重复**。
