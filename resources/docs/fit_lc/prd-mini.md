# 七练小程序产品需求文档

> **注意：** 本文档为微信小程序版 PRD，记录已实现的功能。

**版本：** 1.5
**日期：** 2026-05-13
**状态：** 已上线

---

## 目录

1. [产品概述](#1-产品概述)
2. [技术架构](#2-技术架构)
3. [页面结构](#3-页面结构)
4. [核心功能模块](#4-核心功能模块)
5. [分包配置](#5-分包配置)
6. [数据模型](#6-数据模型)
7. [API接口](#7-api接口)

---

## 1. 产品概述

### 1.1 产品定位
七练小程序是 AI 专属私教 SaaS 系统的移动端入口，通过自然语言对话自动记录健身数据和身体围度，与 Web 版共享后端服务和数据。

### 1.2 核心价值
- **即开即用**：无需下载，微信内即可使用
- **语音输入**：支持语音输入训练内容，方便运动中记录
- **实时同步**：与 Web 版数据完全同步

### 1.3 目标用户
| 用户类型 | 描述 |
|---------|------|
| 个人健身爱好者 | 运动中快速记录训练、追踪围度变化 |
| 健身教练 | 管理客户训练数据 |

### 1.4 与 Web 版差异

| 差异点 | Web 版 | 小程序 |
|--------|--------|--------|
| 入口 | 浏览器 | 微信 |
| 语音输入 | 需浏览器支持 | 原生支持 |
| 推送通知 | 需 PWA | 微信模板消息 |
| 分享 | Web URL | 小程序卡片 |

---

## 2. 技术架构

### 2.1 技术栈
| 层级 | 技术选型 |
|------|---------|
| 框架 | 微信小程序原生框架 |
| 样式 | WXSS (CSS 超集) |
| 状态管理 | 本地 Storage + globalData |
| 网络 | wx.request |
| 媒体 | 录音、相机、相册 |

### 2.2 项目结构
```
fitlc-mini/
├── pages/               # 主包页面
│   ├── chat/           # AI 对话页 (chat.js)
│   ├── login/          # 登录页 (login.js)
│   ├── exercises/      # 动作库 (exercises.js)
│   ├── profile/        # 个人中心 (profile.js)
│   └── settings/       # 设置页 (settings.js)
├── packageA/           # 分包A：健身计划
│   └── pages/
│       ├── plans/          # 计划列表 (plans.js)
│       ├── plan-generate/  # 生成计划 (plan-generate.js)
│       ├── plan-detail/    # 计划详情 (plan-detail.js)
│       └── plan-execute/   # 执行打卡 (plan-execute.js)
├── packageB/           # 分包B：围度/日历
│   └── pages/
│       ├── measurements/   # 围度记录 (measurements.js)
│       └── calendar/       # 日历 (calendar.js)
├── packageC/           # 分包C：徽章/动作/相册
│   └── pages/
│       ├── badges/          # 徽章墙 (badges.js)
│       ├── exercise-detail/ # 动作详情 (exercise-detail.js)
│       └── gallery/        # 相册 (gallery.js)
├── api/                # API 客户端
├── store/              # 全局状态管理
├── assets/             # 静态资源
└── components/         # 公共组件
```

### 2.3 文件命名规范
**页面和组件文件名应与文件夹名称保持一致，避免使用 `index` 命名。**

例如：
- `pages/chat/index.js` → `pages/chat/chat.js`
- `components/button/index.js` → `components/button/button.js`

原因：微信小程序的分包机制会导致路径解析问题，统一的命名便于维护和理解。

### 2.4 分包策略
小程序采用**独立分包**机制：
- **主包**：TabBar 页面（chat/exercises/profile）+ 登录页
- **分包A**：健身计划模块（plans/plan-generate/plan-detail/plan-execute）
- **分包B**：围度/日历模块（measurements/calendar）
- **分包C**：徽章/动作详情/相册（badges/exercise-detail/gallery）

---

## 3. 页面结构

### 3.1 TabBar 配置
| Tab | 页面路径 | 图标 |
|-----|---------|------|
| 对话 | /pages/chat/chat | home.png |
| 动作库 | /pages/exercises/exercises | exercises.png |
| 我的 | /pages/profile/profile | profile.png |

### 3.2 页面清单
| 路径 | 页面名称 | 包 | 说明 |
|------|---------|-----|------|
| /pages/chat/chat | AI对话 | 主包 | 核心功能，训练/围度记录 |
| /pages/login/login | 登录 | 主包 | 用户登录 |
| /pages/exercises/exercises | 动作库 | 主包 | 动作列表+肌肉侧边栏 |
| /pages/profile/profile | 个人中心 | 主包 | 头像、统计、身体数据、快速入口 |
| /pages/settings/settings | 设置 | 主包 | 基础信息、身体数据 |
| /packageA/pages/plans/plans | 计划列表 | 分包A | 用户所有计划 |
| /packageA/pages/plan-generate/plan-generate | 生成计划 | 分包A | AI 生成新计划 |
| /packageA/pages/plan-detail/plan-detail | 计划详情 | 分包A | 查看和编辑计划 |
| /packageA/pages/plan-execute/plan-execute | 执行打卡 | 分包A | 打卡记录 |
| /packageB/pages/measurements/measurements | 围度记录 | 分包B | 围度历史 |
| /packageB/pages/calendar/calendar | 日历 | 分包B | 月历打卡视图 |
| /packageC/pages/badges/badges | 徽章墙 | 分包C | 用户徽章 |
| /packageC/pages/exercise-detail/exercise-detail | 动作详情 | 分包C | 动作完整信息 |
| /packageC/pages/gallery/gallery | 相册 | 分包C | 照片浏览 |

---

## 4. 核心功能模块

### 4.1 AI 对话记录

#### 4.1.1 功能描述
用户通过自然语言与 AI 对话，系统自动识别意图并执行相应操作。

#### 4.1.2 触发场景
- **记录训练**：`"深蹲100kg 5组每组8个"`
- **记录围度**：`"今天胸围94，腰围78"`
- **查询训练**：`"这周跑了多少次？"`
- **查询围度**：`"我的围度有什么变化？"`

#### 4.1.3 输入模式
| 模式 | 说明 |
|------|------|
| 文字模式 | 文本输入框，发送按钮 |
| 语音模式 | 按住说话，松开发送 |

#### 4.1.4 图片支持
- 用户可选择相册图片或拍照
- 图片预览，可移除
- 图片 URL 保存到 ChatMessage

#### 4.1.5 消息展示
- 用户消息（右侧）+ AI 回复（左侧）
- 已保存标识 + 撤销按钮
- 时间戳显示
- **追问提示**（意图澄清机制）：`needsClarification=true` 时显示追问提示样式
- **澄清结束**：`clarificationEnded=true` 时显示澄清结束提示

#### 4.1.6 意图澄清机制
当用户输入信息不完整时，AI 自动追问。

| API 返回标识 | 说明 |
|-------------|------|
| `needsClarification: true` | 表示需要追问 |
| `clarificationSessionId` | 澄清会话 ID |
| `clarificationEnded: true` | 澄清结束但信息仍不完整 |

**示例流程**：
```
用户: "卧推80公斤"
AI: "卧推 80kg，很棒！请问一共几组，每组几次？" (needsClarification: true)

用户: "3组7次"
AI: "✅ 训练记录已保存！卧推 80kg x 3组 x 7次"
```

### 4.2 动作库

#### 4.2.1 布局结构
- **左侧**：肌肉列表（48px 宽度），垂直滚动
- **右侧**：肌肉详情 + 动作列表

#### 4.2.2 肌肉侧边栏
- "全部" 选项（显示所有动作）
- 6 大肌肉群（胸部/背部/腿部/肩部/手臂/核心）
- 子肌肉（点击展开）

#### 4.2.3 动作列表
- 动作卡片：名称、标签、简述
- 支持搜索和筛选（器械类型、难度）
- 点击跳转动作详情

#### 4.2.4 筛选器
| 筛选维度 | 选项 |
|---------|------|
| 器械 | 杠铃、哑铃、绳索、器械、自重 |
| 难度 | 初级、中级、高级 |

### 4.3 个人中心

#### 4.3.1 用户信息
- 头像 + 昵称
- 性别 + 邮箱
- 设置按钮

#### 4.3.2 统计行
| 指标 | 说明 |
|------|------|
| 训练 | 累计训练次数 |
| 容量 | 累计训练量 |
| 连续 | 连续打卡天数 |
| 徽章 | 获得徽章数 |

#### 4.3.3 身体数据
- 身高、体重、体脂、BMI
- 点击跳转设置页编辑

#### 4.3.4 快捷入口
| 入口 | 图标 | 跳转 |
|------|------|------|
| 训练记录 | 📋 | /packageB/pages/calendar/calendar |
| 围度记录 | 📏 | /packageB/pages/measurements/measurements |
| 训练计划 | 📅 | /packageA/pages/plans/plans |
| 徽章墙 | 🏆 | /packageC/pages/badges/badges |
| 相册 | 📷 | /packageC/pages/gallery/gallery |

### 4.4 健身计划

#### 4.4.1 计划列表
- 用户所有计划（草稿/进行中/已完成）
- 创建新计划入口

#### 4.4.2 AI 生成计划
- 用户描述需求 → AI 生成结构化计划
- 可视化编辑

#### 4.4.3 计划执行
- 进入打卡页 → 完成动作 → 记录
- AI 分析肌肉恢复状态

### 4.5 围度记录

#### 4.5.1 围度历史
- 折线图展示围度变化
- 身体部位：胸围、腰围、臀围、臂围、腿围

#### 4.5.2 左右对称部位
- 左/右臂围并排显示
- 左/右大腿围并排显示
- 左/右小腿围并排显示

### 4.6 日历

#### 4.6.1 月历视图
- 6×7 日期网格
- 有记录日期显示橙色小圆点
- 当天高亮边框

#### 4.6.2 记录详情
- 点击日期展开训练/围度记录

### 4.7 相册

#### 4.7.1 照片同步
- 聊天中发送的图片自动同步
- OSS 公开 URL

#### 4.7.2 浏览
- 按月份分组
- 网格布局
- 全屏预览

### 4.9 设置页

#### 4.9.1 页面结构
- **个人信息 section**：
  - 头像（可上传）
  - 昵称（弹窗编辑）
  - 性别（弹窗选择：男/女）
  - 身高（弹窗编辑，单位 cm）
- **身体数据 section**：
  - 身体数据入口 → 跳转 `/packageB/pages/measurements/measurements`

#### 4.9.2 功能说明
| 功能 | 说明 |
|------|------|
| uploadAvatar | 选择图片上传，更新头像 |
| editNickname | showModal 弹窗编辑昵称 |
| editGender | showModal 选择性别（男/女） |
| editHeight | showModal 编辑身高（验证 0-300cm） |
| goToBodyData | 跳转到围度记录页面 |

**注意：** 体重、体脂编辑功能在围度记录页面（measurements）实现，settings 页通过"身体数据"入口跳转。

### 4.10 页面入口关系
```
profile ──┬── settings ──────────── goToBodyData ──→ measurements
          │                                        │
          │                         ┌─────────────┴─────────────┐
          └── gallery              calendar                    │
                          badges              exercise-detail
```

### 4.11 成就庆祝弹窗

#### 4.11.1 功能描述
聊天过程中根据后端返回的成就类型，队列式逐一展示庆祝弹窗（3秒/个）。

#### 4.11.2 弹窗类型
| 类型 | 触发条件 | 显示内容 |
|------|---------|---------|
| `first_workout` | `toolData.result.isFirstWorkout === true` | 🎉 "恭喜完成首次训练！" |
| `first_measurement` | `toolData.result.isFirstMeasurement === true` | 📏 "恭喜完成首次围度记录！" |
| `pr_break` | `achievements.isNewPR === true` | 🏆 PR 数值变化（旧值 → 新值） |
| `badge` | `achievements.badges.length > 0` | 🎖️ 徽章名称 |
| `milestone` | `achievements.milestones.length > 0` | ⭐ 里程碑名称 |

#### 4.11.3 实现方式
- **组件**：`components/celebration/celebration`
- **动画**：wx.createAnimation 淡入淡出（300ms）
- **队列**：多个成就逐一展示，每个 3 秒后自动切换下一个
- **触发**：chat.js 中 `handleAchievements()` 方法检测 toolData 并添加到队列

#### 4.11.4 后端接口变更
| 文件 | 新增字段 |
|------|---------|
| saveWorkout.ts | `isFirstWorkout` |
| saveMeasurement.ts | `isFirstMeasurement` |

### 4.12 聊天历史管理

#### 4.12.1 功能描述
在聊天页面通过自定义导航栏菜单入口，支持查看和删除聊天历史记录。

#### 4.12.2 入口：自定义导航栏菜单
- 使用 `navigationStyle: custom` 实现自定义导航栏
- 导航栏右侧 `⋮` 菜单按钮点击弹出操作菜单
- 操作菜单选项：历史管理、清空全部记录（危险操作二次确认）

#### 4.12.3 历史管理弹窗
- 底部弹出式弹窗，消息列表按日期分组（今天/昨天/更早）
- 每条消息显示：角色标识、时间、消息内容摘要
- 单条消息可删除
- 底部"清空全部记录"按钮

#### 4.12.4 文件结构
| 文件路径 | 说明 |
|---------|------|
| `components/history-manager/` | 历史管理组件（JS/WXML/WXSS/JSON） |

#### 4.12.5 后端接口新增
| 接口 | 方法 | 说明 |
|------|------|------|
| `/chat/revoke/all` | POST | 清空用户全部聊天记录 |

---

## 5. 分包配置

### 5.1 分包结构
```json
{
  "subpackages": [
    {
      "root": "packageA",
      "pages": [
        "pages/plans/plans",
        "pages/plan-generate/plan-generate",
        "pages/plan-detail/plan-detail",
        "pages/plan-execute/plan-execute"
      ]
    },
    {
      "root": "packageB",
      "pages": [
        "pages/measurements/measurements",
        "pages/calendar/calendar"
      ]
    },
    {
      "root": "packageC",
      "pages": [
        "pages/badges/badges",
        "pages/exercise-detail/exercise-detail",
        "pages/gallery/gallery"
      ]
    }
  ]
}
```

### 5.2 分包加载策略
- **按需加载**：用户点击时才加载对应分包
- **预加载**：TabBar 切换时可预加载下一个分包

---

## 6. 数据模型

### 6.1 本地存储
| Key | 类型 | 说明 |
|-----|------|------|
| token | string | JWT 认证令牌 |
| userInfo | object | 用户基本信息 |
| chatMessages | array | 本地聊天记录缓存 |

### 6.2 全局状态 (globalData)
| Key | 类型 | 说明 |
|-----|------|------|
| user | object | 当前用户信息 |
| isLoggedIn | boolean | 登录状态 |

---

## 7. API 接口

### 7.1 认证模块
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/auth/login | 用户登录 |
| POST | /api/auth/register | 用户注册 |
| GET | /api/auth/me | 获取当前用户 |

### 7.2 对话模块
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/chat/messages | 获取聊天记录 |
| POST | /api/chat/message | 发送消息 |
| POST | /api/chat/revoke/:id | 撤销消息 |
| POST | /api/chat/revoke/all | 清空全部聊天记录 |

### 7.3 记录模块
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/records/workouts | 训练历史 |
| GET | /api/records/measurements | 围度历史 |
| DELETE | /api/records/workout/:id | 软删除训练 |
| DELETE | /api/records/measurement/:id | 软删除围度 |
| POST | /api/records/workout/:id/restore | 恢复训练 |
| POST | /api/records/measurement/:id/restore | 恢复围度 |

### 7.4 围度记录（Inline Edit）

#### 7.4.1 网格布局
- 3列网格展示所有身体部位
- 左右对称部位（臂围/大腿围/小腿围）并排显示
- 最新记录值直接显示在网格中

#### 7.4.2 Inline Edit
- 点击网格单元 → 弹出输入框
- 输入框显示部位名称 placeholder
- 确认后调用 API 更新：`POST /api/records/measurement/:id/items`
- 支持同时修改多个部位后批量保存

### 7.5 动作库
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/exercises | 动作列表 |
| GET | /api/exercises/:id | 动作详情 |

### 7.6 健身计划
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/plans/generate | AI 生成计划 |
| GET | /api/plans | 计划列表 |
| GET | /api/plans/:id | 计划详情 |
| POST | /api/plans/:id/executions | 执行打卡 |

### 7.7 成就系统
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/achievements/badges | 用户徽章 |
| GET | /api/achievements/stats | 累计统计 |

### 7.8 相册
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/album/photos | 获取照片 |

---

## 附录

### A. 文档版本历史
| 版本 | 日期 | 说明 |
|------|------|------|
| 1.5 | 2026-05-13 | 新增聊天历史管理功能，支持自定义导航栏菜单、历史记录弹窗、单条删除和清空全部 |
| 1.4 | 2026-05-13 | 新增成就庆祝弹窗(celebration)功能，支持首次训练/围度、PR突破、徽章、里程碑的队列式弹窗展示 |
| 1.3 | 2026-05-12 | 新增设置页(settings)详细功能说明，包含个人信息编辑、身体数据入口 |
| 1.2 | 2026-05-12 | 优化文件命名规范，页面和组件文件名改为与文件夹同名，避免使用index命名 |
| 1.1 | 2026-05-07 | 新增围度记录Inline Edit功能；修复API端点（delete改用DELETE方法）；更新围度模块API |
| 1.0 | 2026-05-02 | 初始版本，微信小程序 PRD |

### B. 相关文档
| 文档 | 路径 |
|------|------|
| Web PRD | docs/PRD.md |
| 规划版 PRD | docs/PRD-planning.md |
| 后端 API 文档 | /api-docs (开发环境) |