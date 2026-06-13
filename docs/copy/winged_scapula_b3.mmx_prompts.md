# mmx 生成 Prompts：翼状肩胛自测 + 改善：4 个动作

> **2026-06-05** — Phase 4 素材生成清单
>
> ⚠️ **我没有 mmx API 工具**——下面 7 个 prompt 给你（或 mmx 工具）跑。
> 命名严格按 [assets.md §1-2](../../../remotion/src/scenes/winged_scapula_b3/assets.md) 表格的路径，下载后 cp 到 `resources/` + `public/` 对应位置。

---

## 0. 全局风格规范（适用所有 prompt）

```
通用风格：
- 配色：dark background #0A0A0A / 暖光橙色 #FF4500 (主) / 电红 #DC143C (辅)
- 字体：现代无衬线（Inter / 思源黑体）
- 尺寸：1080×1920 竖屏（9:16），mp4 格式
- 帧率：30 fps
- 风格：健身教学 + 力量感 + 科技感（参考 [script.md §7](../../rules/script.md)）
- 无文字水印 / 无品牌 logo
- 5-12s 循环 / 可拼接
```

---

## 1. 视频 #5 — 钩子对比（mmx）

**目标文件**：`../../../resources/videos/winged_scapula_b3_001_hook_compare.mov`
**目标位置**：`hyperframe/public/winged_scapula_b3/videos/001_hook_compare.mov`
**shot_id**：S02（5.33s）
**覆盖字幕**：「你可能有翼状肩胛。先用两个动作自测一下。」

### Prompt
```
健身教学视频，1080x1920 竖屏，30fps，5 秒可循环。
暗色背景 #0A0A0A + 暖光橙红 #FF4500 强调。

镜头内容：3 个连续画面，每个 ~1.6 秒：
1) 正常肩胛骨：人物背对镜头，自然站立，双手垂在身侧，肩胛骨平整贴背。柔光从左前方 45° 照。
2) 翼状肩胛：人物同样背对镜头，但肩胛骨内侧明显突出，像"翅膀"翘起。橙红色高亮肩胛骨位置。
3) 对比分割：左侧"正常"右侧"翼状"，中间有橙色分割线，箭头指向差异。

人物：成年男性，运动衣贴身（必须露出肩胛骨），肩宽中等。

风格：健身纪录片 + 教学示范，浅景深，柔光，无文字（只允许背景半透明"翼状"小标）。
```

### 验收清单
- [ ] 1080×1920 竖屏
- [ ] 5 秒
- [ ] 肩胛骨可见（背面）
- [ ] 翼状 vs 正常 对比清晰
- [ ] 暖色调 + 暗背景
- [ ] 无文字 / 无水印

---

## 2. 视频 #6 — 自测 1：镜子（mmx）

**目标文件**：`../../../resources/videos/winged_scapula_b3_002_mirror_test.mov`
**目标位置**：`hyperframe/public/winged_scapula_b3/videos/002_mirror_test.mov`
**shot_id**：S03（8.82s）
**覆盖字幕**：「第一个：背对镜子站好，肩膀放松手垂下来。肩胛骨内侧明显突出，就是翼状。」

### Prompt
```
健身教学视频，1080x1920 竖屏，30fps，8-9 秒可循环。
暗色背景 #0A0A0A + 暖光橙红 #FF4500 强调。

镜头内容：2 个连续画面：
1) 准备（3-4 秒）：人物背对一面落地镜，距离 1-1.5m，肩膀完全放松双手垂下。朋友从镜子侧前方拍（看到镜子里的背影 + 朋友的相机角度）。柔光均匀，避免镜子反光。
2) 检验（4-5 秒）：镜头推近肩胛骨特写，橙红色高亮肩胛骨内侧"翼状"区域。叠加半透明"翼状"小标。

人物：成年女性（与视频 #5 性别切换），运动衣贴身（必须露出肩胛骨）。

风格：健身教学 + 朋友协助 + 镜面视角，柔光，无文字。
```

### 验收清单
- [ ] 1080×1920 竖屏
- [ ] 8-9 秒
- [ ] 背对镜子 + 朋友侧前方拍
- [ ] 肩胛骨可见
- [ ] 镜子无反光
- [ ] 暖色调 + 暗背景

---

## 3. 视频 #7 — 自测 2：推墙（mmx）

**目标文件**：`../../../resources/videos/winged_scapula_b3_003_wall_push.mov`
**目标位置**：`hyperframe/public/winged_scapula_b3/videos/003_wall_push.mov`
**shot_id**：S04（8.53s）
**覆盖字幕**：「第二个：双手推墙，让朋友看背后。肩胛骨像长了翅膀翘起来，基本没跑了。」

### Prompt
```
健身教学视频，1080x1920 竖屏，30fps，8-9 秒可循环。
暗色背景 #0A0A0A + 暖光橙红 #FF4500 强调。

镜头内容：3 个连续画面：
1) 推墙起始（2-3 秒）：人物面对白墙站立，双臂前平举与肩同高，掌心贴墙。侧面 45° 机位（拍到墙 + 人物全身）。
2) 推墙保持（4-5 秒）：朋友从人物斜后方拍（看肩胛骨变化）。橙红色高亮肩胛骨"翘起"位置。
3) 收回（2 秒）：人物双手放下，肩胛骨回落。

人物：成年男性，运动衣贴身（必须露出肩胛骨）。

风格：健身教学 + 自测演示 + 朋友协助，侧面 45° + 斜后方双机位切换，柔光，无文字。
```

### 验收清单
- [ ] 1080×1920 竖屏
- [ ] 8-9 秒
- [ ] 面对墙 + 朋友斜后方拍
- [ ] 肩胛骨可见
- [ ] 暖色调 + 暗背景
- [ ] 推墙 + 收回动作完整

---

## 4. 过渡图 #9 — "4 个动作改善" 章节卡（mmx）

**目标文件**：`../../../resources/images/winged_scapula_b3_transition_4actions.png`
**目标位置**：`hyperframe/public/winged_scapula_b3/images/transition_4actions.png`
**shot_id**：S05（4.41s）
**覆盖字幕**：「别担心，今天教你 4 个动作改善一下。」

### Prompt
```
健身章节标题卡，1080×1920 竖屏，PNG 透明或暗背景。

布局（上下 3 段）：
1) 顶部（屏幕 1/3）："别担心" 4 字大字号（120px），纯白 #FFFFFF，加粗
2) 中部（屏幕 1/3）：巨大数字 "4"（300px），电红 #DC143C 发光，加粗
3) 底部（屏幕 1/3）："个动作改善一下" 7 字中等字号（80px），纯白 #FFFFFF
4) 角落：左上角小标"第 1 步"或章节 icon（暖橙 #FF4500）

背景：暗色 #0A0A0A 纯色，简洁
字体：现代无衬线（Inter / 思源黑体）
风格：健身教学 + 力量感 + 强对比

不要：3D 渲染 / 渐变 / 阴影 / 文字水印
```

### 验收清单
- [ ] 1080×1920 竖屏
- [ ] PNG 格式
- [ ] 3 段布局清晰
- [ ] "4" 巨大 + 红色发光
- [ ] "别担心" / "个动作改善一下" 文字清晰
- [ ] 暗背景

---

## 5. sfx T1 — whoosh（钩子→主体）

**目标文件**：`../../../resources/audios/sfx/winged_scapula_b3_T1_whoosh.mp3`
**目标位置**：`hyperframe/public/winged_scapula_b3/audios/sfx/T1_whoosh.mp3`
**shot_id**：TR01（0.7s）

### Prompt
```
音效设计：whoosh transition sound, 0.5 秒可循环。
风格：低频"嗖"声，像空气快速被切开。
频率：低频主导（200-500 Hz 主能量），高频快速衰减
包络：起音 0.05s，主体 0.3s，衰减 0.15s
音量：标准化 -3 dBFS
格式：MP3, 44.1 kHz, 单声道, 128 kbps
```

### 验收清单
- [ ] MP3 / 0.5 秒 / 单声道
- [ ] 低频 whoosh 感
- [ ] 起音快 + 主体短 + 衰减干净

---

## 6. sfx T2 — sweep（段间停顿用，3 处）

**目标文件**：`../../../resources/audios/sfx/winged_scapula_b3_T2_sweep.mp3`
**目标位置**：`hyperframe/public/winged_scapula_b3/audios/sfx/T2_sweep.mp3`
**shot_id**：TR02 / TR03 / TR05 / TR06 / TR07 / TR08（6 处各 0.7s）

### Prompt
```
音效设计：sweep transition sound, 0.4 秒可循环。
风格：中高频短促滑动，像"刷"过的气流。
频率：中频（1-3 kHz 主能量），高频（5-8 kHz 滑动）
包络：起音 0.02s，主体 0.25s，衰减 0.13s
音量：标准化 -3 dBFS
格式：MP3, 44.1 kHz, 单声道, 128 kbps
```

### 验收清单
- [ ] MP3 / 0.4 秒 / 单声道
- [ ] 中高频 sweep 感
- [ ] 比 T1 短促更短（避免和 whoosh 重复感）

---

## 7. sfx T3 — pop（收尾过渡用，2 处）

**目标文件**：`../../../resources/audios/sfx/winged_scapula_b3_T3_pop.mp3`
**目标位置**：`hyperframe/public/winged_scapula_b3/audios/sfx/T3_pop.mp3`
**shot_id**：TR09 / TR10（2 处各 0.7s）

### Prompt
```
音效设计：pop transition sound, 0.4 秒可循环。
风格：柔和的"噗"反馈声，像确认/收尾的轻柔提示。
频率：中频（800 Hz - 2 kHz 短促爆发）
包络：起音 0.01s，主体 0.2s，衰减 0.2s（带轻微混响尾）
音量：标准化 -6 dBFS（比 T1/T2 略弱，避免抢戏）
格式：MP3, 44.1 kHz, 单声道, 128 kbps
```

### 验收清单
- [ ] MP3 / 0.4 秒 / 单声道
- [ ] 柔和 pop 感（不像 whoosh 那么"硬"）
- [ ] 音量比 T1/T2 略弱

---

## 8. 生成完成后的归档流程

```bash
# 1. 下载到 resources/ 临时目录（按上面命名）
cd resources/

# 2. 复制视频
cp winged_scapula_b3_001_hook_compare.mov videos/
cp winged_scapula_b3_002_mirror_test.mov videos/
cp winged_scapula_b3_003_wall_push.mov videos/

# 3. 复制图片（改短名）
cp winged_scapula_b3_transition_4actions.png images/

# 4. 复制 sfx
mkdir -p audios/sfx
cp winged_scapula_b3_T1_whoosh.mp3 audios/sfx/
cp winged_scapula_b3_T2_sweep.mp3 audios/sfx/
cp winged_scapula_b3_T3_pop.mp3 audios/sfx/

# 5. 复制到 public/（Scene 直接用）
cd ..
cp ../../../resources/videos/winged_scapula_b3_001_hook_compare.mov hyperframe/public/winged_scapula_b3/videos/
cp ../../../resources/videos/winged_scapula_b3_002_mirror_test.mov hyperframe/public/winged_scapula_b3/videos/
cp ../../../resources/videos/winged_scapula_b3_003_wall_push.mov hyperframe/public/winged_scapula_b3/videos/
cp ../../../resources/images/winged_scapula_b3_transition_4actions.png hyperframe/public/winged_scapula_b3/images/transition_4actions.png
cp ../../../resources/audios/sfx/winged_scapula_b3_T1_whoosh.mp3 hyperframe/public/winged_scapula_b3/audios/sfx/
cp ../../../resources/audios/sfx/winged_scapula_b3_T2_sweep.mp3 hyperframe/public/winged_scapula_b3/audios/sfx/
cp ../../../resources/audios/sfx/winged_scapula_b3_T3_pop.mp3 hyperframe/public/winged_scapula_b3/audios/sfx/
```

> 复制完后，所有 7 个缺失素材就位 → 跑 [checklist.md](../../rules/checklist.md) 自检 → 准备渲染。
