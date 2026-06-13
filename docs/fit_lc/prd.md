# 七练产品需求文档（正式版）

> **注意：** 本文档为正式版 PRD，记录已实现的功能。全部需求（包括未实现的）请参见 [PRD-planning.md](./PRD-planning.md)。

**版本：** 2.1
**日期：** 2026-05-07
**状态：** 已上线

---

## 目录

1. [产品概述](#1-产品概述)
2. [用户角色与权限](#2-用户角色与权限)
3. [核心功能模块](#3-核心功能模块)
   - 3.1 [AI对话记录](#31-ai对话记录)
   - 3.2 [训练动作库](#32-训练动作库)
   - 3.3 [肌肉库](#33-肌肉库)
   - 3.4 [历史记录管理](#34-历史记录管理)
   - 3.5 [数据趋势分析](#35-数据趋势分析)
   - 3.6 [健身计划](#36-健身计划)
   - 3.7 [日历页面](#37-日历页面)
4. [AI增强功能](#4-ai增强功能)
5. [激励与成就系统](#5-激励与成就系统)
6. [技术架构](#6-技术架构)
7. [数据库设计](#7-数据库设计)
8. [API接口设计](#8-api接口设计)
9. [前端页面清单](#9-前端页面清单)
10. [非功能性需求](#10-非功能性需求)

---

## 1. 产品概述

### 1.1 产品定位
七练是一款 AI 专属私教 SaaS 系统，通过自然语言对话自动记录健身数据和身体围度，支持历史数据查询与趋势分析。

### 1.2 核心价值
- **零门槛记录**：用户无需手动填写表单，直接用自然语言描述训练内容
- **智能解析**：AI 自动解析训练动作、组数、次数、重量等参数
- **数据洞察**：自动汇总训练统计和围度变化趋势

### 1.3 目标用户
| 用户类型 | 描述 |
|---------|------|
| 个人健身爱好者 | 希望快速记录训练、追踪围度变化的普通用户 |
| 健身教练 | 管理客户训练数据（未来扩展） |
| 系统管理员 | 维护动作库、肌肉库等基础数据 |

### 1.4 技术栈
| 层级 | 技术选型 |
|------|---------|
| 前端 | React 18 + Vite + TailwindCSS + Zustand + Axios + React Router v6 |
| 后端 | Node.js + Express.js + Prisma ORM |
| 数据库 | MySQL 8.0 |
| AI | LangChain.js + MiniMax Chat 模型 (Abab6/M2.7) |
| 认证 | JWT (JSON Web Token) |

---

## 2. 用户角色与权限

### 2.1 角色定义
| 角色 | 说明 | 权限范围 |
|------|------|---------|
| normal | 普通用户 | 使用AI对话、记录训练/围度、查看历史和趋势 |
| admin | 管理员 | 普通用户权限 + 动作库/肌肉库CRUD、AI增强操作 |

### 2.2 权限矩阵
| 功能 | normal | admin |
|------|--------|-------|
| AI对话记录训练 | ✓ | ✓ |
| AI对话记录围度 | ✓ | ✓ |
| 查看训练历史 | ✓ | ✓ |
| 查看围度历史 | ✓ | ✓ |
| 查看趋势图 | ✓ | ✓ |
| 动作库管理 | - | ✓ |
| 肌肉库管理 | - | ✓ |
| AI增强（批量生成） | - | ✓ |

### 2.3 新用户默认角色
新用户注册时自动分配 `normal` 角色。管理员角色需通过数据库手动分配。

---

## 3. 核心功能模块

### 3.1 AI对话记录

#### 3.1.1 功能描述
用户通过自然语言与AI对话，系统自动识别用户意图（记录训练/记录围度/查询数据）并执行相应操作。

#### 3.1.2 触发场景

**记录训练 (save_workout)**
```
触发示例：
- "今天跑了5公里"
- "深蹲100kg 5组每组8个"
- "练了30分钟hiit"
- "做了100个俯卧撑分5组"
```

**记录围度 (save_measurement)**
```
触发示例：
- "今天胸围94，腰围78"
- "测了一下臂围34"
- "腰又粗了，现在是80"
```

**查询训练 (query_workout)**
```
触发示例：
- "这周跑了多少次？"
- "上个月深蹲总重量多少？"
- "我的训练频率怎么样？"
- "对比一下这周和上周"
```

**查询围度 (query_measurement)**
```
触发示例：
- "我的围度有什么变化？"
- "胸围对比三个月前？"
- "最近腰有没有变细？"
```

#### 3.1.3 数据解析
| 参数 | 说明 |
|------|------|
| date | 训练/测量日期，格式 YYYY-MM-DD |
| exercises | 训练动作数组 [{name, sets, reps, weight, duration, distance}] |
| measurements | 围度数组 [{body_part, value}] |

#### 3.1.4 支持的身体部位
单侧部位：`chest`(胸) | `waist`(腰) | `hips`(臀) | `neck`(颈围)
成对部位：`biceps_l`/`biceps_r`(左/右臂围) | `thigh_l`/`thigh_r`(左/右大腿围) | `calf_l`/`calf_r`(左/右小腿围)

#### 3.1.5 消息历史加载
页面加载时自动获取最近20条对话记录，支持翻页查看历史消息。

#### 3.1.6 AI回复Markdown渲染
AI回复内容支持Markdown格式渲染，包括：
- 代码块、加粗、斜体
- 链接、引用、列表
- 表格（GFM扩展）

#### 3.1.7 撤销功能
保存成功后，用户可通过"撤销"按钮撤回最近一次操作（软删除）。

#### 3.1.8 交互设计
- 消息列表展示用户消息和AI回复
- 保存成功时显示"已保存"标识和撤销按钮
- AI回复包含操作结果摘要

#### 3.1.9 图片消息
用户发送图片时，图片URL保存到 `ChatMessage.imageUrls` 字段，支持多图。

#### 3.1.10 文本解析兜底
当AI未调用工具时（MiniMax模型bindTools限制），自动从AI回复文本解析围度/训练数据并保存。

#### 3.1.11 图片预处理（Vision Preprocessor）
当用户发送图片时，通过 Zhipu AI (GLM-4V-Flash) 预处理图片分析，结果注入到消息上下文中供主 AI (MiniMax) 使用。

**处理流程：**
```
用户发送消息（含图片）
    ↓
VisionPreprocessor 插件拦截
    ↓
调用 Zhipu GLM-4V-Flash 分析图片
    ↓
返回分析结果（体脂率、体态评估、肌肉线条等）
    ↓
将结果作为前缀注入消息："【图片解析结果】\n{分析结果}\n\n用户原始消息：..."
    ↓
主 AI (MiniMax) 处理纯文本对话
```

**实现位置：** `backend/src/agents/plugins/visionPreprocessor.ts`
**配置项：**
- `AI_VISION_PROVIDER=zhipu`（固定使用 Zhipu）
- `AI_VISION_MODEL=GLM-4V-Flash`（免费视觉模型）

#### 3.1.12 saveWorkout 必填字段验证
Tool 在调用前会验证动作信息完整性：

**验证规则：**
| 训练类型 | 必填字段 | 说明 |
|---------|---------|------|
| 力量训练 | weight + (sets 或 reps) | 如"卧推80kg 5组每组8个" |
| 有氧训练 | duration 或 distance | 如"跑步30分钟"、"跑了5公里" |
| 徒手训练 | sets + reps | 如"俯卧撑20个分4组" |

**信息不完整时：** Tool 返回 `status: 'needs_more_info'`，AI 追问用户补充信息后再调用。

**示例：**
- 用户说"卧推80公斤" → AI 追问："卧推80公斤，几组每组几次呢？"
- 用户说"做了俯卧撑" → AI 追问："做了多少组，每组几次？"

#### 3.1.13 Tool 返回格式
AI Tools 返回统一 JSON 格式，包含三个字段：

| 字段 | 类型 | 说明 |
|------|------|------|
| aiReply | string | AI 对话回复（用于直接展示给用户） |
| dataType | string | 数据类型标识 |
| result | object | 结构化返回数据（前端可解析） |

**统一返回格式：**
```typescript
interface ToolResponse<T = any> {
  aiReply: string;      // AI 对话回复
  dataType: string;     // 数据类型标识
  result: T;           // 结构化数据
}
```

**各 Tool 返回格式：**

| Tool | dataType | result 关键字段 |
|------|----------|----------------|
| save_workout | `workout` | id, date, exercises, feedback, achievements |
| save_measurement | `measurement` | id, date, measurements, achievements |
| query_workout | `workout_query` | workouts[], summary |
| query_measurement | `measurement_query` | measurements[], summary |
| generate_plan | `plan` | planId, schedule[], goal |
| adjust_plan | `plan_adjustment` | planId, adjustment |
| analyze_execution | `execution_analysis` | stats, suggestions |

**示例 - save_workout：**
```json
{
  "aiReply": "✅ 训练记录已保存！\n\n卧推 60kg 4×10，比上周多了2组！💪",
  "dataType": "workout",
  "result": {
    "id": 123,
    "date": "2026-05-03",
    "exercises": [{"name": "卧推", "sets": 4, "reps": 10, "weight": 60}],
    "feedback": {
      "personalized_comment": "表现不错！",
      "comparison_with_last": "比上周多了2组"
    },
    "achievements": {
      "isNewPR": false,
      "badges": [],
      "milestones": []
    }
  }
}
```

**Agent V2 返回结构：**
```typescript
{
  reply: string,      // AI 最终对话回复
  toolData: ToolResponse | null,  // 完整的 tool 返回数据
  errors?: string[]    // 执行错误列表（V2 新增）
}
```

> V2 移除了 `savedData` 字段，`toolData` 包含完整信息。

#### 3.1.14 意图澄清机制

当用户输入信息不完整时，AI 自动追问并携带已解析的信息，避免用户重复输入。

**实现位置**: `backend/src/agents/clarification/`

**核心组件**:
- `ClarificationManager` - 核心管理器，处理澄清会话创建、完成、过期
- `clarificationStore` - 内存存储，TTL 5分钟
- `clarificationPrompts` - 追问模板生成
- `clarificationPrompts.ts` - 生成追问模板
- `extractClarification.ts` - 解析用户回复，补充缺失信息
  - `tryParseWorkout()` - 完整解析（包含动作名）
  - `tryParseSetsAndReps()` - 仅解析组数/次数（复用已有动作名）

**核心流程**:
1. 用户输入 → LLM 识别意图 → 参数验证
2. 信息不完整 → 创建澄清会话 → 生成追问
3. 用户回复 → 合并上下文 → 重新验证/执行

**部分输入保留**：
当用户回复"3组7次"时（无动作名），系统复用 `partialInput` 中已有的动作名：
```
partialInput: { exercises: [{ name: "卧推", weight: 80 }] }
用户回复: "3组7次" → supplementedInput: { exercises: [{ name: "卧推", weight: 80, sets: 3, reps: 7 }] }
```

**限制**:
- 同一用户同时只允许一个澄清会话
- 最多3次追问循环
- Session TTL 5分钟

**API 返回标识**：
```json
{
  "reply": "卧推 80kg，很棒！请问一共几组，每组几次？",
  "toolData": { "clarificationSessionId": "uuid" },
  "needsClarification": true
}
```

| 标识 | 说明 |
|------|------|
| `needsClarification` | true 时表示需要追问 |
| `clarificationSessionId` | 澄清会话 ID |
| `clarificationEnded` | true 时表示澄清结束但信息仍不完整 |

---

### 3.2 训练动作库

#### 3.2.1 功能描述
结构化的训练动作数据库，"动作"页面整合了肌肉库和动作库：
- 左侧紧凑肌肉列表（占 48px 宽度）
- 点击肌肉后右侧显示肌肉简略信息（可展开/收起）
- 简略信息下方显示该肌肉关联的动作列表
- 支持动作筛选：难度、器械类型（杠铃/哑铃/绳索/器械/自重/壶铃/弹力带）、类别（自由重量/器械/自重）
- 点击动作跳转动作详情页 `/exercises/:id`

#### 3.2.2 动作详情页
独立页面 `/exercises/:id`，显示动作全部字段：
- 视频（位于页面顶部，如果有 videoUrl）
- 名称、难度标签、器械类型、动作类型
- 标签列表
- 母动作、变体列表（含差异说明）
- 主肌肉、辅助肌肉
- 动作步骤、安全注意事项、常见错误、调整说明
- 动作转换指南（变体、替代动作、降级选项）

**字段显示规范：**
- exerciseType：compound → 复合动作，isolation → 孤立动作
- variantType：equipment → 器械变体，difficulty → 难度变体，posture → 姿势变体
- adjustmentNotes：key 以橙色加粗显示

#### 3.2.2 动作属性
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键 |
| name | VARCHAR(200) | 动作名称 |
| category | ENUM | 肌肉群：chest/back/legs/shoulders/arms/core |
| equipment | ENUM | 器械：barbell/dumbbell/cable/machine/bodyweight/other |
| difficulty | ENUM | 难度：beginner/intermediate/advanced |
| description | TEXT | 动作说明（Markdown） |
| adjustmentNotes | TEXT | 细节调整（Markdown） |
| videoUrl | VARCHAR(500) | 视频教程链接 |
| steps | TEXT | 动作步骤说明 |
| safetyNotes | TEXT | 安全注意事项 |
| commonMistakes | TEXT | 常见错误 |
| exerciseType | STRING | compound(复合动作)/isolation(孤立动作) |
| variantType | ENUM | equipment/difficulty/posture（该动作自身的变体类型） |
| conversionGuide | JSON | 变体转换指南 |
| tags | JSON | 标签数组 |
| status | ENUM | draft(待审核)/published(已发布) |

#### 3.2.3 动作-肌肉关联
| 字段 | 类型 | 说明 |
|------|------|------|
| exerciseId | INT | 动作ID |
| muscleId | INT | 肌肉ID（关联level 2主肌肉） |
| role | ENUM | primary(主要)/secondary(辅助) |

#### 3.2.4 动作转换指南
通过 `conversionGuide` JSON 字段记录动作变体说明，包含以下信息：
- **变体**：该动作的常见变体形式
- **替代动作**：功能相似的其他动作
- **降级选项**：适合初学者的简化版本

用户可在动作详情页查看这些转换指南信息。
**状态：✅ 已实现（2026-04-28）**

#### 3.2.5 审核流程
1. AI或管理员创建动作 → status: `draft`
2. 管理员审核确认 → status: `published`
3. 已发布的动作才能被普通用户查询使用

#### 3.2.6 数据规模
预计 500+ 动作，覆盖 6 大肌肉群、多种器械和难度级别。

---

### 3.3 肌肉库

#### 3.3.1 功能描述
两层层级结构的肌肉数据库：肌肉群（Level 1）→ 主肌肉（Level 2）

#### 3.3.2 肌肉层级结构
```
胸部 (chest)
├── 胸大肌
├── 胸小肌
└── 前锯肌

背部 (back)
├── 背阔肌
├── 中下斜方肌
├── 大圆肌
├── 小圆肌
└── 竖脊肌

腿部 (legs)
├── 股四头肌
├── 腘绳肌
├── 臀大肌
└── 小腿肌群

肩部 (shoulders)
├── 三角肌
└── 肩袖肌群

手臂 (arms)
├── 肱二头肌
├── 肱三头肌
└── 前臂肌群

核心 (core)
├── 腹直肌
├── 腹斜肌
├── 腹横肌
└── 下背肌群
```

#### 3.3.3 肌肉属性
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键 |
| name | VARCHAR(100) | 肌肉名称 |
| group | ENUM | 肌肉群：chest/back/legs/shoulders/arms/core |
| parentId | INT | 父级肌肉ID，null=肌肉群本身 |
| sortOrder | INT | 排序序号 |
| origin | TEXT | 肌肉起点 |
| insertion | TEXT | 肌肉止点 |
| function | TEXT | 肌肉功能 |
| trainingTips | TEXT | 训练技巧 |

#### 3.3.4 数据统计
| 类型 | 数量 |
|------|------|
| 肌肉群 (Level 1) | 6 |
| 主肌肉 (Level 2) | ~20 |
| 总计 | ~26 |

---

### 3.4 历史记录管理

#### 3.4.1 训练记录 (workouts)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键 |
| userId | INT | 用户ID |
| date | DATETIME | 训练日期时间 |
| createdAt | DATETIME | 创建时间 |
| deletedAt | DATETIME | 软删除时间（NULL=未删除） |

#### 3.4.2 训练动作 (workout_exercises)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键 |
| workoutId | INT | 关联训练记录ID |
| exerciseName | VARCHAR(100) | 动作名称 |
| sets | INT | 组数 |
| reps | INT | 次数 |
| weight | DECIMAL(10,2) | 重量(kg) |
| duration | INT | 时长(分钟) |
| distance | DECIMAL(10,2) | 距离(公里) |
| createdAt | DATETIME | 创建时间 |

#### 3.4.3 围度记录 (body_measurements)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键 |
| userId | INT | 用户ID |
| date | DATETIME | 测量日期时间（支持同一天多次记录） |
| createdAt | DATETIME | 创建时间 |
| deletedAt | DATETIME | 软删除时间（NULL=未删除） |

**支持同一天多次记录：** 体重(weight)和体脂率(bodyFat)可以一天记录多次（如早晩各一次），通过时间戳区分。

#### 3.4.4 围度项目 (measurement_items)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键 |
| measurementId | INT | 关联围度记录ID |
| bodyPart | ENUM | 部位：chest/waist/hips/neck/biceps_l/biceps_r/thigh_l/thigh_r/calf_l/calf_r/weight/bodyFat/other |
| value | DECIMAL(10,2) | 数值(cm) |
| createdAt | DATETIME | 创建时间 |

**左右对称部位：** 左臂围(biceps_l)、右臂围(biceps_r)、左大腿围(thigh_l)、右大腿围(thigh_r)、左小腿围(calf_l)、右小腿围(calf_r)

#### 3.4.5 软删除
所有记录支持软删除（设置 `deletedAt` 时间戳），已删除记录不参与统计计算。

---

### 3.5 数据趋势分析

#### 3.5.1 围度趋势图
- 折线图展示多个身体部位的围度变化
- 支持部位：胸围、腰围、臀围、臂围、腿围、小腿围
- 时间范围：最近30天/90天/6个月/1年/全部

#### 3.5.2 训练统计
- 柱状图展示每周训练次数
- 按动作类型分类统计

---

### 3.6 健身计划

#### 3.6.1 功能描述
用户可通过AI生成个性化训练计划，支持对话调整、可视化编辑、执行追踪和进度分析。

**与动作库/肌肉库的集成：**
- 计划动作关联 `exercises.id`，获取完整动作详情（步骤、安全提示、肌肉关联）
- 训练日直接关联目标肌肉群，便于AI理解和用户查看
- 器械选项复用动作库的 `Equipment` 枚举

#### 3.6.2 核心流程

**生成计划**
```
用户描述需求 → AI识别GENERATE_PLAN
→ 根据器械/难度从 exercises 筛选动作
→ 按肌肉群恢复周期分配训练日
→ 返回结构化计划（含 exerciseId）
→ 存入数据库
```

**对话调整**
```
用户提出调整 → AI识别ADJUST_PLAN → 解析意图 → 更新 plan_exercises
```

**执行打卡**
```
进入打卡页 → JOIN exercises 获取动作详情 → 完成打卡
→ 存入 plan_executions
→ AI 分析肌肉恢复状态给出建议
```

#### 3.6.3 肌肉群分配原则
| 肌肉类型 | 最优恢复时间 | 训练频率 |
|---------|-------------|---------|
| 大肌群（胸、背、腿） | 48-72小时 | 每周1-2次 |
| 小肌群（肩、臂、腹） | 24-48小时 | 每周2-3次 |

#### 3.6.4 计划状态
| 状态 | 说明 |
|------|------|
| draft | 草稿（未激活） |
| active | 进行中 |
| completed | 已完成 |
| paused | 已暂停 |

#### 3.6.4 AI Tools
| Tool | 功能 |
|------|------|
| generate_plan | 根据用户信息生成健身计划 |
| adjust_plan | 调整现有计划内容 |
| analyze_execution | 分析执行数据给出建议 |

#### 3.6.5 详情说明
详见 [健身计划详情页](PRD-details/06-workout-plan.md)

---

### 3.7 日历页面

#### 3.7.1 功能描述
用户通过日历页面查看每月训练和围度记录，通过小圆点标识有记录的日期，点击日期展开查看详情。

#### 3.7.2 入口
- 用户在"我的"页面点击"连续打卡"卡片进入日历页面
- 日历页面使用独立布局（无底部 Tab，有顶部返回导航）

#### 3.7.3 页面结构
- 月份切换：左右箭头切换上一月/下一月，支持"今天"快速跳转
- 日期网格：6×7 布局，有记录的日期显示橙色小圆点
- 当天高亮：当天日期有橙色边框
- 详情展开：点击日期后下方展开显示训练/围度记录

---

### 3.8 相册功能

#### 3.8.1 功能描述
用户聊天中发送的图片自动同步到相册，支持按月份分组浏览和管理。

#### 3.8.2 功能特性
| 特性 | 说明 |
|------|------|
| 自动同步 | 用户发送图片时自动写入相册，无需手动操作 |
| 月份分组 | 图片按月份分组显示，按时间倒序排列，最新在前 |
| 照片预览 | 点击照片可全屏预览，支持 ESC 关闭 |
| 照片删除 | 右键可删除照片（软删除） |
| 公开URL | OSS 使用公开 URL，无需签名 |

#### 3.8.3 入口
- 个人中心页面"相册"快速入口

#### 3.8.4 页面结构
- 页面顶部显示月份分组标题（如"2026年4月"）
- 每个月份下显示该月所有照片网格（3列布局）
- 照片按时间倒序排列

#### 3.8.5 数据模型
**AlbumPhoto 表：**
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键 |
| userId | INT | 用户ID |
| ossUrl | VARCHAR(500) | OSS 图片地址（公开URL） |
| thumbnailUrl | VARCHAR(500) | 缩略图地址（可选） |
| chatMessageId | INT | 关联聊天消息ID |
| createdAt | DATETIME | 创建时间 |
| deletedAt | DATETIME | 软删除时间 |

#### 3.8.6 API 接口
| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | /api/album/photos | 获取所有照片（按月份分组） | 是 |
| DELETE | /api/album/photos/:id | 删除照片 | 是 |

---

## 4. AI增强功能

### 4.1 动作详情AI生成

#### 4.1.1 功能描述
管理员可通过AI自动生成动作的详细描述信息。

#### 4.1.2 生成字段
| 字段 | 说明 |
|------|------|
| steps | 动作步骤说明（4-6步） |
| safetyNotes | 安全注意事项（2-3条） |
| commonMistakes | 常见错误（2-3条） |
| adjustmentNotes | 调整说明 |
| exerciseType | compound/isolation |
| suggestedMuscles | 建议关联肌肉列表 |

#### 4.1.3 肌肉关联关系类型
| 关系 | 说明 |
|------|------|
| agonist | 主发力的肌肉 |
| synergist | 协同发力的肌肉 |
| antagonist | 拮抗肌 |
| stabilizer | 稳定肌 |

### 4.2 肌肉详情AI生成

#### 4.2.1 生成字段
| 字段 | 说明 |
|------|------|
| origin | 肌肉起点 |
| insertion | 肌肉止点 |
| function | 肌肉功能 |
| trainingTips | 训练技巧 |

### 4.3 批量生成脚本
支持断点续传的批量生成工具，输出JSON文件供管理员审核后导入数据库。

---

## 5. 激励与成就系统

### 5.1 个人最佳记录 (PR)

#### 5.1.1 功能描述
自动记录用户在各项动作上的个人最佳成绩，包括重量、次数、时长、距离等维度。

#### 5.1.2 记录类型
| 类型 | 说明 |
|------|------|
| weight | 最大重量 (kg) |
| reps | 最大次数 |
| duration | 最长时长 (分钟) |
| distance | 最长距离 (km) |

#### 5.1.3 PR检测
训练保存时自动检测是否突破个人最佳，触发时通知用户。

### 5.2 徽章系统

#### 5.2.1 徽章定义
| 字段 | 说明 |
|------|------|
| code | 唯一标识符 |
| name | 徽章名称 |
| description | 徽章描述 |
| category | 类别：workout/measurement/streak/milestone |
| conditionType | 条件类型：count/streak/pr/first |
| conditionValue | 条件值 (JSON) |
| tier | 等级：bronze/silver/gold/platinum |
| points | 积分奖励 |

#### 5.2.2 徽章类别
- **workout**: 训练相关徽章（首次训练、训练次数等）
- **measurement**: 围度相关徽章（首次测量等）
- **streak**: 连续打卡徽章
- **milestone**: 里程碑成就

### 5.3 里程碑系统

#### 5.3.1 里程碑定义
| 字段 | 说明 |
|------|------|
| code | 唯一标识符 |
| name | 里程碑名称 |
| category | 类别：strength/volume/consistency/measurement |
| metricType | 统计类型 |
| threshold | 阈值 |
| tier | 星级 (1-5) |

#### 5.3.2 进度追踪
自动追踪用户在各里程碑上的进度，完成时通知用户。

### 5.4 累计统计数据

#### 5.4.1 统计类型
| 类型 | 周期 | 说明 |
|------|------|------|
| weekly_workouts | weekly | 本周训练次数 |
| monthly_workouts | monthly | 本月训练次数 |
| total_workouts | all | 累计训练次数 |
| total_volume | all | 累计训练量 |
| weekly_volume | weekly | 本周训练量 |
| streak_days | all | 连续打卡天数 |

### 5.5 触发系统

#### 5.5.1 触发频率控制
同一行为每天最多触发1次，通过 `trigger_events` 表实现去重。

#### 5.5.2 触发类型
- workout_complete: 训练完成
- measurement_complete: 围度记录完成
- streak_broken: 连续打卡中断
- reminder: 定时提醒

### 5.6 首次庆祝动画

#### 5.6.1 功能描述
用户在 Chat 页面保存首次训练记录后，自动显示庆祝动画，持续3秒后消失。

#### 5.6.2 触发条件
`totalWorkouts === 1` 时触发，`FirstTimeCelebration` 组件从 `show=true` 变为显示。

#### 5.6.3 展示内容
- 🎉 emoji 跳动动画
- "恭喜完成首次训练！" 标题
- "坚持记录，你就是最棒的！" 副标题

### 5.7 行为锚点

#### 5.7.1 锚点时机
| 时机 | 形式 | 说明 |
|------|------|------|
| 训练刚结束 | AI确认消息 | 保存成功后显示关键数据摘要 |
| Dashboard空状态 | 引导卡片 | 首次进入时显示记录引导 |
| 次日（待实现） | Web Push | 依赖 F-009 推送服务 |

#### 5.7.2 空状态引导
当用户无训练记录时，Dashboard 显示引导卡片：
- "开始记录你的第一次训练"
- 示例: "今天深蹲 80kg 做了 5 组"
- CTA 按钮跳转 Chat

---

## 6. 技术架构

### 5.1 系统架构图
```
┌─────────────────────────────────────────────────────┐
│               React + Vite 前端                      │
│            (用户对话界面 + 数据展示)                   │
└─────────────────────┬───────────────────────────────┘
                      │ HTTP / REST API
                      ▼
┌─────────────────────────────────────────────────────┐
│                 Node.js 后端                         │
│  ┌─────────────────────────────────────────────┐    │
│  │          LangChain Agent                    │    │
│  │   - tools: save_workout, query_history...   │    │
│  │   - memory: conversation history            │    │
│  └─────────────────────────────────────────────┘    │
│                      │                               │
│                      ▼                               │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐    │
│  │SaveService │  │QueryService│  │AuthService │    │
│  └─────┬──────┘  └─────┬──────┘  └────────────┘    │
└────────┼───────────────┼────────────────────────────┘
         │               │
         ▼               ▼
    ┌─────────────────────────┐
    │         MySQL           │
    │  users / workouts /     │
    │  workout_exercises /    │
    │  body_measurements /   │
    │  measurement_items /     │
    │  muscles / exercises /   │
    │  roles                  │
    └─────────────────────────┘
```

### 5.2 后端分层架构
```
Router → Service → Repository
```

| 层级 | 职责 |
|------|------|
| Router | HTTP路由、参数校验、权限校验 |
| Service | 业务逻辑编排（无事务） |
| Repository | 数据库访问、ORM操作、事务边界 |

### 5.3 事务边界规范
**事务必须在 Repository 层管理**，Service 层不直接使用 `prisma.$transaction`。

| 操作 | 事务位置 | 说明 |
|------|---------|------|
| saveWorkout | workoutRepository.createWithExercises() | 训练+动作一次性创建 |
| saveMeasurement | measurementRepository.createWithItems() | 围度记录+项目一次性创建 |
| updateMeasurementPart | measurementRepository.upsertItems() | 批量 upsert 围度项目 |
| createPlan | planRepository.createWithExercises() | 计划+动作一次性创建 |
| planExecution | planRepository.recordExecution() | 单条执行记录 |

### 5.4 LangChain Agent Tools

> **Agent V2 架构文档：** 详见 [docs/architecture/fitness-agent-v2.md](../architecture/fitness-agent-v2.md)

| Tool | 功能 | 类别 |
|------|------|------|
| save_workout | 记录训练数据 | save |
| save_measurement | 记录身体围度 | save |
| query_workout | 查询训练历史 | query |
| query_measurement | 查询围度历史 | query |
| generate_plan | AI生成健身计划 | plan |
| adjust_plan | 调整现有计划 | plan |
| analyze_execution | 分析计划执行情况 | analyze |

**V2 特性：**
- 批量工具并行执行（按类别分组）
- 统一输入校验 + `needs_more_info` 状态处理
- 熔断器保护（5次失败熔断30秒）
- Fallback 文本解析兜底
- 历史消息压缩（Hybrid 方案，控制 token 成本）

**返回结构：**
```typescript
{
  reply: string,      // AI 最终对话回复
  toolData: ToolResponse | null,  // 工具返回数据
  errors?: string[]    // 执行错误列表
}
```

---

## 7. 数据库设计

### 6.1 ER关系图
```
users 1 ───< user_roles >──── 1 roles
  │
  │
  └──< workouts >──< workout_exercises >── exercises >──< exercise_muscles >── muscles
  │
  └──< body_measurements >──< measurement_items >
  │
  └──< workout_plans >──< plan_exercises >── exercises
  │                   │
  │                   └──< plan_executions >── plan_exercises
  │
  └──< personal_records >── workouts
  └──< badges >──< user_badges >
  └──< aggregated_stats >
  └──< trigger_events >
  └──< trend_predictions >
  └──< milestones >──< user_milestones >
```

### 6.2 表结构汇总
| 表名 | 说明 | 关键字段 |
|------|------|---------|
| users | 用户表 | id, email, password_hash |
| roles | 角色表 | id, name |
| user_roles | 用户角色关联 | userId, roleId |
| workouts | 训练记录 | id, userId, date, deletedAt |
| workout_exercises | 训练动作 | workoutId, name, sets, reps, weight, duration, distance |
| body_measurements | 围度记录 | id, userId, date, deletedAt |
| measurement_items | 围度项目 | measurementId, bodyPart, value |
| muscles | 肌肉层级 | id, name, group, parentId |
| exercises | 动作库 | id, name, category, equipment, difficulty, status, conversionGuide |
| personal_records | 个人最佳记录 | id, userId, exerciseName, recordType, bestValue, achievedAt |
| badges | 徽章定义 | id, code, name, description, category, conditionType, conditionValue |
| user_badges | 用户徽章记录 | id, userId, badgeId, achievedAt |
| aggregated_stats | 累计统计数据 | id, userId, statType, period, value |
| trigger_events | 触发事件日志 | id, userId, triggerType, triggerKey |
| trend_predictions | 趋势预测模型 | id, userId, metricType, slope, intercept, rSquared |
| milestones | 里程碑定义 | id, code, name, metricType, threshold |
| user_milestones | 用户里程碑记录 | id, userId, milestoneId, progress, achievedAt |
| chat_messages | 对话历史 | id, userId, role, content, savedData, imageUrls, createdAt |
| album_photos | 相册照片 | id, userId, ossUrl, thumbnailUrl, chatMessageId, createdAt, deletedAt |

#### 6.2.1 肌肉群训练量统计

通过 `workout_exercises` 与 `exercises` / `exercise_muscles` 关联，聚合计算各肌肉群训练量：

```sql
SELECT m.group, SUM(we.weight * we.sets * we.reps) as volume
FROM workout_exercises we
JOIN exercises e ON we.name = e.name
JOIN exercise_muscles em ON e.id = em.exerciseId
JOIN muscles m ON em.muscleId = m.id
WHERE w.userId = ? AND w.date BETWEEN ? AND ?
GROUP BY m.group
```

返回格式：
```json
{
  "muscleGroups": [
    { "name": "胸部", "group": "chest", "volume": 12500, "percentage": 35 }
  ]
}
```

### 6.3 索引设计
| 表 | 索引字段 |
|------|---------|
| users | email (UNIQUE) |
| workouts | userId, date, deletedAt |
| body_measurements | userId, date, deletedAt |
| exercises | category, equipment, difficulty, status |
| exercise_muscles | muscleId, (exerciseId, muscleId, role) UNIQUE |
| workout_plans | userId, status |
| plan_exercises | planId, dayOfWeek |
| plan_executions | planId, scheduledDate, status |

---

## 8. API接口设计

### 7.1 认证模块 `/api/auth`
| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | /register | 用户注册 | 否 |
| POST | /login | 用户登录 | 否 |
| GET | /me | 获取当前用户 | 是 |

### 7.2 对话模块 `/api/chat`
| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | /messages | 获取最近聊天记录 | 是 |
| POST | /message | 发送AI消息 | 是 |

### 7.3 记录模块 `/api/records`
| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | /workouts | 获取训练记录 | 是 |
| GET | /measurements | 获取围度记录 | 是 |
| DELETE | /workout/:id | 软删除训练 | 是 |
| DELETE | /measurement/:id | 软删除围度 | 是 |
| POST | /workout/:id/restore | 恢复训练 | 是 |
| POST | /measurement/:id/restore | 恢复围度 | 是 |

### 7.4 动作库模块 `/api/exercises`
| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | / | 获取动作列表 | 是 |
| GET | /:id | 获取动作详情 | 是 |

### 7.5 管理模块 `/api/admin`
| 方法 | 路径 | 说明 | 认证 | 权限 |
|------|------|------|------|------|
| GET | /exercises | 动作列表 | 是 | admin |
| POST | /exercises | 创建动作 | 是 | admin |
| PUT | /exercises/:id | 更新动作 | 是 | admin |
| DELETE | /exercises/:id | 删除动作 | 是 | admin |
| PATCH | /exercises/:id/publish | 发布动作 | 是 | admin |
| POST | /exercises/generate | AI生成动作详情 | 是 | admin |
| GET | /muscles | 肌肉列表 | 是 | admin |
| POST | /muscles | 创建肌肉 | 是 | admin |
| PUT | /muscles/:id | 更新肌肉 | 是 | admin |
| DELETE | /muscles/:id | 删除肌肉 | 是 | admin |
| POST | /muscles/generate | AI生成肌肉详情 | 是 | admin |

### 7.6 健身计划模块 `/api/plans`
| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | /generate | AI生成计划 | 是 |
| GET | / | 获取用户所有计划 | 是 |
| GET | /:id | 获取计划详情 | 是 |
| PUT | /:id | 更新计划 | 是 |
| DELETE | /:id | 删除计划 | 是 |
| POST | /:id/activate | 激活计划 | 是 |

### 7.7 计划动作 `/api/plans/:id/exercises`
| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | / | 获取计划动作 | 是 |
| POST | / | 添加动作 | 是 |
| PUT | /:exerciseId | 更新动作 | 是 |
| DELETE | /:exerciseId | 移除动作 | 是 |

### 7.8 执行记录 `/api/plans/:id/executions`
| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | / | 获取执行记录 | 是 |
| POST | / | 记录执行 | 是 |
| POST | /batch | 批量打卡 | 是 |
| GET | /analysis | 执行分析 | 是 |

### 7.9 成就系统 `/api/achievements`
| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | /personal-records | 获取个人最佳记录 | 是 |
| GET | /personal-records/top | 获取最佳PR列表 | 是 |
| GET | /badges | 获取用户徽章 | 是 |
| GET | /milestones | 获取里程碑进度 | 是 |
| GET | /stats | 获取累计统计数据 | 是 |
| GET | /muscle-volume | 获取肌肉群训练量统计 | 是 |
| POST | /check | 触发成就检查 | 是 |

### 7.10 触发系统 `/api/triggers`
| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | /eligible/:type | 获取可触发提醒 | 是 |
| POST | /record | 记录触发事件 | 是 |
| GET | /should-trigger | 检查是否应触发 | 是 |
| GET | /history | 获取触发历史 | 是 |
| DELETE | /:id | 删除触发事件 | 是 |

---

## 9. 前端页面清单

### 8.1 页面列表
| 路径 | 页面名称 | 说明 | 权限 |
|------|---------|------|------|
| /login | 登录页 | 用户登录 | 公开 |
| /register | 注册页 | 用户注册 | 公开 |
| /chat | AI对话页 | 核心功能，训练/围度记录（首页Tab） | 登录用户 |
| /gallery | 相册 | 用户相册，按月份浏览照片（我的页面入口） | 登录用户 |
| /history | 历史记录 | 训练和围度历史（二级页面） | 登录用户 |
| /trends | 趋势分析 | 围度趋势图和训练统计（二级页面） | 登录用户 |
| /profile | 个人中心 | 头像昵称、统计数据、身体数据、快速入口（我的Tab） | 登录用户 |
| /exercises | 动作库 | 动作列表和筛选（动作Tab） | 登录用户 |
| /exercises/:id | 动作详情 | 动作完整信息展示 | 登录用户 |
| /muscles | 肌肉库 | 肌肉层级树 | 登录用户 |
| /plans | 健身计划 | AI生成训练计划（二级页面） | 登录用户 |
| /calendar | 日历 | 查看每月训练/围度记录，点击展开详情 | 登录用户 |
| /badges | 徽章展示 | 用户徽章和成就 | 登录用户 |
| /settings | 设置中心 | 基础信息、身体数据入口 | 登录用户 |
| /settings/profile | 基础信息 | 头像、昵称编辑 | 登录用户 |
| /settings/body | 身体数据 | 身高、体重、体脂编辑 | 登录用户 |
| /admin/exercises | 动作库维护 | 动作CRUD和AI增强 | admin |
| /admin/muscles | 肌肉库维护 | 肌肉CRUD和AI增强 | admin |

### 8.2 底部导航栏

用户端底部 Tab 导航（3个Tab）：
| Tab | 图标 | 路径 |
|-----|------|------|
| 首页 | 🏠 | /chat |
| 动作 | 💪 | /exercises |
| 我的 | 👤 | /profile |

**二级页面布局：**
除首页、知识、我的之外的所有页面（history, trends, plans, gallery 等）均为二级页面，使用 `SecondaryPageLayout`：
- 无底部导航栏
- 顶部返回按钮header，点击返回上一页

### 8.2 UI风格规范

#### 配色方案
| 类型 | 色值 | 用途 |
|------|------|------|
| 背景主色 | #0A0A0A | 深黑 |
| 背景次色 | #1A1A1A | 深灰卡片 |
| 背景三级 | #252525 | 稍浅灰 |
| 强调色主 | #FF4500 | 烈焰橙 |
| 强调色次 | #DC143C | 电红 |
| 文字主色 | #FFFFFF | 白色 |
| 文字次色 | #888888 | 灰色 |
| 边框色 | #333333 | 默认边框 |

#### 视觉风格
- 无圆角或极小圆角 (2-4px)
- 粗边框按钮 (2px solid)
- 几何线条装饰
- 卡片光晕效果
- 深色渐变背景

#### 动效
- 快速过渡 (150-200ms)
- 强调色hover闪烁效果

---

## 10. 非功能性需求

### 9.1 性能
- API响应时间 < 500ms（不含AI调用）
- 前端首屏加载 < 2s
- 支持100+并发用户

### 9.2 安全
- 密码bcrypt加密存储
- JWT token 7天过期
- 后端API必须权限校验
- SQL注入防护（Prisma ORM）

### 9.3 可用性
- 前端错误提示友好
- 网络错误自动重试（可选）
- 401自动跳转登录页

### 9.4 数据完整性
- 外键约束确保关联有效
- 软删除保留历史数据
- 事务保证数据一致性

---

## 附录

### A. 文档索引
| 文档 | 路径 |
|------|------|
| 系统设计 | `docs/superpowers/specs/2026-04-23-fit-lc-design.md` |
| 前端设计 | `docs/superpowers/specs/2026-04-23-fit-lc-frontend-design.md` |
| 健身计划设计 | `docs/superpowers/specs/2026-04-23-fit-lc-workout-plan-design.md` |
| 健身计划实施计划 | `docs/superpowers/plans/2026-04-23-fit-lc-workout-plan-implementation.md` |
| 动作库设计 | `docs/superpowers/specs/2026-04-24-exercise-library-design.md` |
| 动作库批量生成设计 | `docs/superpowers/specs/2026-04-25-exercise-library-generation-design.md` |
| 动作详情设计 | `docs/superpowers/specs/2026-04-25-exercise-detail-design.md` |
| 肌肉详情设计 | `docs/superpowers/specs/2026-04-25-muscle-detail-design.md` |
| RBAC设计 | `docs/superpowers/specs/2026-04-25-rbac-admin-design.md` |
| AI增强设计 | `docs/superpowers/specs/2026-04-25-exercise-ai-design.md` |
| PRD健身计划详情 | `docs/PRD-details/06-workout-plan.md` |

---

**文档版本历史**
| 版本 | 日期 | 说明 |
|------|------|------|
| 1.0 | 2026-04-25 | 初始版本，整合所有模块需求 |
| 1.1 | 2026-04-28 | 更新技术栈、动作属性、AI增强功能 |
| 1.2 | 2026-04-28 | 添加成就系统数据表和API（personal_records, badges, milestones等） |
| 1.3 | 2026-04-29 | 添加前端展示层：PR卡片、徽章页面、肌肉群统计、首次庆祝动画、行为锚点设计 |
| 1.4 | 2026-04-29 | 添加聊天历史加载API、Markdown渲染支持 |
| 1.5 | 2026-04-30 | 添加相册功能：聊天图片自动同步、相册浏览、按月份筛选、软删除 |
| 1.6 | 2026-04-30 | 简化底部Tab栏为3个Tab（首页/知识/我的），二级页面统一使用返回按钮header |
| 1.7 | 2026-05-01 | Profile页面重构：头像昵称、统计行、身体数据、3个快速入口；设置拆分为/settings/profile和/settings/body；相册改为按月份分组显示所有照片；OSS签名URL修复 |
| 1.8 | 2026-05-01 | "知识"页面改名为"动作"；整合肌肉库和动作库到同一页面；肌肉列表紧凑显示，点击展开详情并展示关联动作；增加动作筛选（难度、器械类型、类别）；新增动作详情页/exercises/:id，显示全部字段（视频、步骤、安全注意事项、常见错误、调整说明、转换指南）；exerciseType和variantType显示中文标签 |
| 1.9 | 2026-05-01 | 围度记录date字段从DATE改为DATETIME，支持同一天多次记录（体重/体脂早晚记录）；支持bodyPart为weight和bodyFat；修复日期范围查询bug |
| 2.0 | 2026-05-01 | 支持左右对称部位单独记录（左/右臂围、左/右大腿围、左/右小腿围）；聊天消息保存imageUrls字段；OSS改为公开URL；AI文本解析兜底保存围度/训练数据；头像上传改为FormData方式 |
| 2.1 | 2026-05-07 | 架构重构：事务边界统一到Repository层；saveWorkout Tool增加必填字段验证（力量/有氧/徒手训练分类）；新增recordService统一记录查询；measurementRepository.upsertItems使用事务 |
