# 素材清单 · a2_one_person_50_videos (v4.1)

> **§0 目标时长**：106 秒（3180 帧 @ 30fps）
> **§0 文案版本**：v4.1 锁版 313 字（[docs/copy/a2_one_person_50_videos.md](../../../docs/copy/a2_one_person_50_videos.md)）
> **§0 视频类型**：A 类（个人人设）· 1920×1080 横屏 · 30fps
> **§0 主口播视频**：≥ 90s 不剪断（v3.4 A 类硬约束）——见 §1 P0
> **§0 BGM**：Quiet Think（80 BPM ambient，A 类默认）· 时长 ≥ 106 + 3s fade = **≥ 109s**（bgm.md §1.1）

---

## §1. P0 主口播视频（A 类硬约束 v3.4）

### 1.1 关键技术约束

| 约束 | 原因 |
|---|---|
| **001_talking_head.mp4 ≥ 90s 不剪断** | 圆头像持续播放 = 嘴在动，**剪断就破坏"人设"**（v3.4 A 类硬约束）|
| **同一份视频双用**（口播态全屏 + 辅助素材态缩圆头像）| 不可剪断，**不可分两段** |
| **录屏用 `<video>` + object-fit: cover + border-radius: 50%** | 实时抽帧，不能用第二张图 |
| **不拍 100_avatar.png 静态头像** | ❌ 旧版用照片做圆头像 → 观众立刻出戏 |
| **拍摄时长 ≥ 90s 但 v4.1 文案 105.8s** | 建议录 ≥ 110s（含自由发挥 + 重录）|

### 1.2 拍摄顺序

```
Step 1：写 copy.md v4.1 锁版（钩子 + 主体 6 段 + 收尾）
Step 2：录主口播视频 001_talking_head.mp4（≥ 90s，建议 110s，按 6 段顺序录，**不剪断**）
Step 3：录辅助素材 010-/011-（屏幕录制 / 工具操作，5-10s/段）
Step 4：录 B-roll 020-（按需）
Step 5：拍数据图 / 代码截图（HTML/CSS 渲染优先，mmx 备用）
Step 6：验收（主口播视频 ≥ 90s + 抽帧测试 + 同期声 + 连续性）
```

### 1.3 拍摄参数

| 维度 | 取值 | 原因 |
|---|---|---|
| **数量** | 1 段贯穿全片（**≥ 90s 完整版**）| 双用：口播态全屏 + 辅助素材态缩圆头像；不可剪断 |
| **机位** | 正面 / 1x 镜头 / 距离 1.2-1.5m | 圆头像里"五官清晰"是底线 |
| **取景** | 上半身 + 头部居中（头顶留 ≥ 20% 空白）| 圆头像裁切时不能切到头顶/下巴 |
| **表情** | 口型清晰 / 有眼神交流 / 有手势 | 圆头像里 240px 直径下还能看出"在说话" |
| **声音** | 同期声（人声是主轴，轻后期降噪）| 后期只配 BGM，不动人声 |
| **时长** | ≥ 90s（一个完整版本，不剪断）| 圆头像需要**连续播放**才能"嘴在动" |
| **口型同步** | 每句旁白对应一段 | 圆头像"嘴在动"的进度 = 字幕进度 = **三同步** |

---

## §2. 资源目录结构

```
remotion/
├── public/
│   ├── videos/
│   │   └── a2_talking_head.mov        ← 【P0】主口播视频（≥ 90s，mp4/mov 都可）
│   ├── images/
│   │   └── bg/
│   │       └── a2_workout_intro/      ← 历史命名（与 a2 共享，详见 v3.5 注释）
│   │           ├── s1_hook.jpg
│   │           ├── s2_identity.jpg
│   │           ├── s2_pain.jpg
│   │           ├── s3_pain.jpg
│   │           ├── s4_tools.jpg
│   │           ├── s5_workflow.jpg
│   │           ├── s6_deep_dive.jpg
│   │           ├── s7_cta.jpg
│   │           ├── s8_brand.jpg
│   │           ├── s9_code.jpg
│   │           ├── s10_center.jpg
│   │           ├── s10_gitlog.jpg
│   │           ├── s11_compare.jpg
│   │           ├── s11_talking.jpg
│   │           ├── s12_cta.jpg
│   │           ├── s13_orbiting.jpg
│   │           ├── s_dual_aux.jpg
│   │           └── s_orbiting.jpg
│   └── audios/
│       └── bgm/
│           ├── a2_one_person_50_videos_v1.mp3  ← Quiet Think 80 BPM
│           └── a2_one_person_50_videos_v2.mp3  ← Quiet Think 80 BPM（当前用）
│
└── src/scenes/a2_one_person_50_videos/
    ├── index.tsx                ← 主组件（v4.1 8 镜 shotSequence + s1-s8 卡片）
    ├── storyboard.md            ← 分镜（v4.1 8 镜）
    ├── subtitles.json           ← 字幕（v4.1 30 条，105.0s）
    ├── BgmAudio.tsx             ← BGM + Ducking
    ├── BgmPulse.tsx             ← BGM 节拍脉冲
    ├── status.md                ← 制作进度
    └── assets.md                ← 本文件
```

---

## §3. v4.1 vs v3 资源差异

| 维度 | v3 (99.1s) | **v4.1 (106s)** |
|---|---|---|
| 主口播视频时长 | ≥ 60s | **≥ 90s**（v3.4 升级）|
| BGM 时长 | ≥ 102s | **≥ 109s**（106 + 3s fade）|
| 字幕条数 | 29 | 30 |
| shot 数 | 10 | 8（合并 4 个相邻小镜）|
| 主体文案 | 250 字 | 313 字 |
| Layout 数量 | 10 种 | 7 种（s2 / s5 互换 layout）|
| 背景图 | s1-s13 共享 | 同 v3（无需新增）|

---

## §4. 验收清单（v4.1 锁版后）

### 4.1 P0 主口播视频验收

- [ ] **时长 ≥ 90s**（v3.4 升级硬约束）
- [ ] **同期声连续**（不爆音 / 不突然变小）
- [ ] **抽帧测试**：随机抽 1 帧 → 240px 圆头像 → 五官清晰
- [ ] **不剪断**（圆头像需要连续播放）
- [ ] **口型同步**（嘴动幅度可见，每句旁白对应一段）

### 4.2 P1 BGM 验收

- [ ] **时长 ≥ 109s**（v4.1 106s + 3s fade out）
- [ ] **BPM 80**（Quiet Think ambient，A 类默认）
- [ ] **fade in 2s + fade out 3s**（bgm.md §1.2，视频 > 90s）

### 4.3 P2 字幕验收

- [ ] **30 条**（sub_001 - sub_030）
- [ ] **每条 ≤ 4s / ≤ 24 字**（timing-sync.md §6.1）
- [ ] **第 1 条 highlight**（钩子强调）
- [ ] **数字 / 工具名 / 关键动作 highlight**（关键节点 6-8 处）

### 4.4 P3 视觉验收

- [ ] **8 shot × ~13s**（s1-s8 总和 3180 帧 = 106s）
- [ ] **段间停顿 7 × 0.5s = 3.5s**（钩子-段1 / 段1-6 / 段6-收尾）
- [ ] **layout 7 种**（CenteredFullBg / TextCenterTalkingRight / PipBottomRight / PipBottomLeft / TextCenterTalkingLeft / BottomRightTalking / BottomLeftTalking）
- [ ] **辅助卡片 7 种**（HeadlineCard / MetadataPair / TimeStateCard / ToolBadgeList / ImpactBar / WorkflowCard / ComparisonCard）

---

## §5. 反模式提醒

- ❌ **录主口播 < 90s**（v3.4 硬约束，必检）
- ❌ **录主口播分两段**（圆头像"嘴不动"会破坏人设）
- ❌ **BGM < 全文 106s**（末尾会静音，bgm.md §1.1）
- ❌ **字幕单条 > 4s / > 24 字**（timing-sync.md §6.1）
- ❌ **subtitles.json 末条 end ≠ Composition 时长**（会出黑屏）
- ❌ **VOICEOVER_END_FRAME > durationInFrames**（旧版 3225 > 2974 是 bug，v4.1 已修 3150 < 3180）

---

## §6. 变更日志

### v4.1（2026-06-15）— 资产清单建立

- 主口播视频时长下限 60s → **90s**（v3.4 A 类硬约束）
- BGM 时长下限 102s → **109s**（v4.1 全文 106s + 3s fade）
- 字幕条数 29 → **30**（v4.1 6 段主体更细粒度切分）
- shot 数 10 → **8**（v4.1 合并相邻小镜）
- Layout 数量 10 → 7
- 新增验收清单 §4（P0-P3）+ 反模式 §5

### 旧版（v3，2026-06-13 之前）— 99.1s / 60s 主口播 / 29 字幕

- 原 workout_intro 时代的 A 类 v3 资产
- 与 v4.1 主要差异：时长、主口播视频下限、shot 数
