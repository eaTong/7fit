# 健身计划功能 - 详情页

## 功能概述

健身计划功能允许用户通过AI生成个性化训练计划，可视化编辑调整，按计划执行并追踪进度。

**与动作库/肌肉库的集成：**
- 计划动作关联 `exercises.id`，享受动作库的完整数据（步骤、安全提示、肌肉关联）
- 训练日直接关联目标肌肉群，便于AI理解和用户查看
- 器械选项复用动作库的 `Equipment` 枚举

---

## 用户故事

### 故事1：AI生成健身计划
**作为** 健身用户
**我想要** 告诉AI我的健身目标和条件
**以便于** 获得一个量身定制的训练计划

**示例对话：**
```
用户: 帮我生成一个增肌计划，每周练4次，有杠铃和哑铃，训练经验1年
AI: 已生成12周增肌计划，包含：
- 周一：胸部+三头肌（胸大肌、肱三头肌）
- 周三：背+二头肌（背阔肌、肱二头肌）
- 周五：腿部+肩部（股四头肌、三角肌）
- 周日：有氧+核心
是否需要调整？
```

### 故事2：对话调整计划
**作为** 健身用户
**我想要** 通过对话调整计划内容
**以便于** 快速修改不想做的动作或调整强度

**示例对话：**
```
用户: 把周三换成练胸
AI: 已调整计划，周三现为：胸部+三头肌
    原动作：杠铃卧推、哑铃飞鸟、绳索下压

用户: 卧推重量太高了，降低到50kg
AI: 已调整杠铃卧推重量为50kg
```

### 故事3：执行打卡
**作为** 健身用户
**我想要** 按计划执行训练并打卡
**以便于** 追踪完成情况

**示例对话：**
```
用户: (打开今日训练页面)
    今日：周一 - 胸部+三头肌

用户: 完成了卧推60kg 4组12次
用户: (点击完成打卡)

用户: 完成了今天所有动作
AI: 太棒了！今日训练完成度100%
    胸部训练总计：2400kg
    执行建议：恢复良好，可以保持当前强度
```

### 故事4：查看执行分析
**作为** 健身用户
**我想要** 了解我的执行情况和AI建议
**以便于** 优化训练计划

**示例对话：**
```
用户: 我的计划执行得怎么样？
AI: 近两周执行分析：
- 完成率：85%（17/20个动作）
- 平均重量提升：+2.5kg
- 建议：周三训练完成率较低(70%)，
  可能是上半身疲劳累积，建议增加休息或降低容量
```

---

## 数据模型

### workout_plans - 健身计划
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键 |
| userId | INT | 用户ID |
| name | VARCHAR(100) | 计划名称 |
| goal | ENUM | bulk(增肌)/cut(减脂)/maintain(维持) |
| frequency | INT | 每周训练次数 |
| experience | ENUM | beginner/intermediate/advanced |
| availableEquipment | JSON | 可用器械数组，取值：barbell/dumbbell/cable/machine/bodyweight/other |
| targetMuscles | JSON | 优先训练肌肉群（可选） |
| conditions | TEXT | 身体状况/伤病 |
| bodyWeight | DECIMAL(5,2) | 体重(kg) |
| bodyFat | DECIMAL(4,1) | 体脂率(%) |
| height | DECIMAL(5,1) | 身高(cm) |
| durationWeeks | INT | 计划周期(周) |
| status | ENUM | draft/active/completed/paused |
| createdAt | DATETIME | 创建时间 |
| updatedAt | DATETIME | 更新时间 |

### plan_exercises - 计划动作
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键 |
| planId | INT | 关联 workout_plans.id |
| exerciseId | INT (可空) | 关联 exercises.id；为空表示自定义动作如有氧 |
| exerciseName | VARCHAR(100) | 动作名称（保留便于快速展示，即使有 exerciseId） |
| dayOfWeek | INT | 星期几(1-7) |
| targetMuscles | VARCHAR(100) | 目标肌肉群字符串，如 "chest,triceps" |
| targetSets | INT | 目标组数（V2 新增 target 前缀） |
| targetReps | VARCHAR(20) | 目标次数范围，如 "8-12"（V2 新增 target 前缀） |
| targetWeight | DECIMAL(5,2) | 目标重量(kg)；AI生成时可能为空（V2 新增 target 前缀） |
| targetDuration | INT | 目标时长(分钟)；如有氧运动（V2 新增 target 前缀） |
| restSeconds | INT | 组间休息(秒) |
| orderIndex | INT | 同日内的顺序 |
| sets/reps/weight/duration | INT/VARCHAR/DECIMAL/INT | 兼容旧字段名（V1 兼容） |

### plan_executions - 执行记录
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键 |
| planId | INT | 关联 workout_plans.id |
| planExerciseId | INT | 关联 plan_exercises.id |
| scheduledDate | DATE | 计划日期 |
| completedAt | DATETIME | 完成时间 |
| completedReps | INT | 完成次数 |
| completedWeight | DECIMAL(5,2) | 完成重量 |
| status | ENUM | pending/completed/skipped |
| notes | TEXT | 备注 |

### 与动作库的关系
```
workout_plans
    │
    └──< plan_exercises >─── exercises (exerciseId)
                                │
                                └──< exercise_muscles >─── muscles (muscleId)
```

---

## 肌肉群与训练日分配原则

### 肌肉恢复周期
| 肌肉类型 | 最优恢复时间 | 训练频率建议 |
|---------|-------------|-------------|
| 大肌群（胸、背、腿） | 48-72小时 | 每周1-2次 |
| 小肌群（肩、臂、腹） | 24-48小时 | 每周2-3次 |

### 标准分配模式
**每周4次（增肌）：**
```
周一：胸部 + 肱三头肌
      └─ 胸大肌(主) + 前锯肌(辅)
      └─ 肱三头肌(主)

周三：背部 + 肱二头肌
      └─ 背阔肌(主) + 斜方肌(辅)
      └─ 肱二头肌(主)

周五：腿部 + 肩部
      └─ 股四头肌 + 臀大肌(主)
      └─ 三角肌(主) + 肩袖肌群(辅)

周日：核心 + 有氧
      └─ 腹直肌 + 腹斜肌
      └─ 心肺功能
```

**每周3次（减脂/维持）：**
```
周三：上半身推（胸、肩、三头）
周五：上半身拉（背、二头）
周日：下半身（腿、臀）
```

### 根据目标的调整
| 目标 | 复合/孤立比例 | 有氧 | 训练密度 |
|------|-------------|------|---------|
| 增肌 (bulk) | 70%复合 / 30%孤立 | 10-15% | 高强度，低容量 |
| 减脂 (cut) | 50%复合 / 50%孤立 | 25-35% | 中等强度，高容量 |
| 维持 (maintain) | 60%复合 / 40%孤立 | 15-20% | 适中 |

---

## AI Tool 设计

### generate_plan - 生成计划
```javascript
{
  name: "generate_plan",
  description: "当用户请求生成健身计划时使用",
  schema: {
    user_profile: {
      goal: "bulk" | "cut" | "maintain",
      frequency: number,                    // 每周训练次数 2-6
      experience: "beginner" | "intermediate" | "advanced",
      availableEquipment: ["barbell", "dumbbell"],  // 复用 Equipment 枚举
      targetMuscles?: ["chest", "back"],    // 可选，优先训练部位
      conditions?: string,                  // 伤病/限制
      bodyWeight: number,
      height: number,
      durationWeeks: number
    }
  },
  returns: {
    plan: {
      name: string,
      goal: string,
      frequency: number,
      durationWeeks: number,
      experience: string,
      exercises: [{
        exerciseId: number,      // 关联 exercises.id
        exerciseName: string,     // 便于快速展示
        dayOfWeek: number,        // 1-7
        targetMuscles: string,    // "chest,triceps"
        sets: number,
        reps: string,             // "8-12"
        weight: number,
        restSeconds: number
      }]
    },
    message: string  // AI 对用户的说明
  }
}
```

### adjust_plan - 调整计划
```javascript
{
  name: "adjust_plan",
  description: "当用户请求调整现有健身计划时使用",
  schema: {
    plan_id: number,
    adjustment: string  // "把周三换成练胸" / "卧推重量降低到50kg"
  }
}
```

### analyze_execution - 执行分析
```javascript
{
  name: "analyze_execution",
  description: "当用户询问计划执行情况、进度、或请求优化建议时使用",
  schema: {
    plan_id: number
  },
  returns: {
    completionRate: number,      // 完成率百分比
    totalVolume: number,         // 总训练量(kg)
    volumeChange: number,        // 重量变化趋势
    muscleRecoveryAnalysis: {    // 肌肉恢复分析
      muscle: string,
      lastTrained: date,
      recoveryStatus: "ready" | "recovering" | "fatigued"
    }[],
    suggestions: string[]        // AI 优化建议
  }
}
```

---

## 核心流程

### 生成计划流程
```
用户: "帮我生成增肌计划"
    ↓
AI调用 generate_plan tool
    ↓
1. 解析用户资料（goal, frequency, experience, equipment）
2. 将用户器械名称（中英文）映射为 Equipment 枚举值
3. 从 exercises 表查询：
   - equipment IN [用户器械]
   - difficulty = 用户经验水平
   - status = 'published'
4. 按肌肉群分组动作（通过 exercise_muscles JOIN muscles）
5. 按肌肉恢复周期（72h大肌群/48h小肌群）分配训练日
6. 生成 plan_exercises（含 exerciseId 和 targetMuscles）
    ↓
返回结构化计划 → 存入 workout_plans + plan_exercises
    ↓
前端展示时 JOIN exercises 获取动作详情（步骤、安全提示、肌肉关联）
```

**备选方案：** 若 exercises 表无数据，使用硬编码动作库生成计划。

### 对话调整流程
```
用户: "把周三动作换成哑铃卧推"
    ↓
AI调用 adjust_plan tool
    ↓
1. 解析调整意图：替换周三某动作
2. 从 exercises 表查询 "哑铃卧推" 的 exerciseId
3. 更新 plan_exercises 中对应记录的 exerciseId
    ↓
返回调整结果 + message
```

### 执行打卡流程
```
用户进入 /plans/:id/execute 打卡页
    ↓
系统查询今日计划动作（JOIN exercises 获取动作详情）
    ↓
用户点击"完成" → 填写实际 reps/weight
    ↓
提交 → POST /api/plans/:id/executions/batch
    ↓
存入 plan_executions（关联 planExerciseId → exerciseId → muscles）
    ↓
AI分析执行数据，给出建议
```

---

## API 接口

### 计划管理 `/api/plans`
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /generate | AI生成计划 |
| GET | / | 获取用户所有计划 |
| GET | /:id | 获取计划详情（含动作 JOIN exercises） |
| PUT | /:id | 更新计划基础信息 |
| DELETE | /:id | 删除计划 |
| POST | /:id/activate | 激活计划 |

### 计划动作 `/api/plans/:id/exercises`
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | / | 获取计划动作列表 |
| POST | / | 添加动作到计划 |
| PUT | /:exerciseId | 更新动作参数 |
| DELETE | /:exerciseId | 从计划移除动作 |

### 执行记录 `/api/plans/:id/executions`
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | / | 获取执行记录 |
| POST | / | 记录单次执行 |
| POST | /batch | 批量打卡 |
| GET | /analysis | 获取执行分析（JOIN muscles） |

---

## 前端页面

### 计划列表页 `/plans`
```
┌─────────────────────────────────────────────┐
│ FITLC                            [历史][趋势][个人] │
├─────────────────────────────────────────────┤
│  健身计划                      [生成新计划]   │
├─────────────────────────────────────────────┤
│  ┌─────────────────────────────────────┐   │
│  │ 增肌计划 A                      [进行中] │
│  │ 每周4次 | 12周                    [执行] │
│  └─────────────────────────────────────┘   │
│  ┌─────────────────────────────────────┐   │
│  │ 减脂计划 B                      [已完成] │
│  │ 每周3次 | 8周                         │ │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### 计划详情页 `/plans/:id`
```
┌─────────────────────────────────────────────┐
│  增肌计划 A           [对话调整] [可视化编辑] [激活] │
├─────────────────────────────────────────────┤
│  目标：增肌 | 每周4次 | 剩余8周 | 完成度 65%      │
├─────────────────────────────────────────────┤
│  [周一 胸部+三头] [周三 背+二头] [周五 腿+肩] [周日 核心] │
├─────────────────────────────────────────────┤
│  周一：胸部+三头肌                           │
│  ┌─────────────────────────────────────┐   │
│  │ ≡ 杠铃卧推 (胸大肌)     4组 8-12次 60kg │
│  │   动作步骤：卧推凳上仰卧...           │
│  │ ≡ 哑铃飞鸟 (胸大肌)     3组 12-15次 15kg│
│  │ ≡ 绳索下压 (肱三头肌)   3组 12次  25kg │
│  └─────────────────────────────────────┘   │
│                    [开始执行]                │
├─────────────────────────────────────────────┤
│  AI 建议：最近执行率下降，建议增加休息日恢复    │
└─────────────────────────────────────────────┘
```

**展示说明：** 动作卡片可展开显示动作详情（步骤、安全提示、肌肉关联），通过 exerciseId JOIN 获取。

### 执行打卡页 `/plans/:id/execute`
```
┌─────────────────────────────────────────────┐
│  今日训练：周一 - 胸部+三头              04-25 │
├─────────────────────────────────────────────┤
│  ✓ 杠铃卧推  4组 60kg  [已完成]  60kg×12=720kg │
│  ○ 哑铃飞鸟  3组 15kg  [点击完成]            │
│  ○ 绳索下压  3组 25kg  [点击完成]            │
├─────────────────────────────────────────────┤
│  完成度: 1/3 动作                          │
│              [提交打卡]                      │
└─────────────────────────────────────────────┘
```

**V2 新增：AI聊天保存训练自动同步**
```
用户通过AI聊天保存训练记录时
    ↓
系统自动检查是否有活跃计划
    ↓
模糊匹配训练动作与计划动作（Levenshtein距离≤3）
    ↓
自动创建执行记录（无需手动打卡）
    ↓
返回结果时提示用户"已同步到您的【计划名】"
```
```

### 生成计划页 `/plans/new`
```
┌─────────────────────────────────────────────┐
│  生成新计划                                  │
├─────────────────────────────────────────────┤
│  目标:        [增肌 ▼]                      │
│  每周训练次数: [4次 ▼]                      │
│  训练经验:    [1-2年 ▼]                     │
│  可用器械:    [✓杠铃 ✓哑铃 □绳索 □器械]    │
│  计划周期:    [12周 ▼]                      │
│  体重(kg):   [70____]                       │
│  身高(cm):   [175___]                       │
│  身体状况:   [无__________________]         │
│                                             │
│  [可选] 优先训练部位:                        │
│  [✓ 胸部 □ 背部 □ 腿部 □ 肩部 □ 手臂]     │
│                                             │
│              [取消]  [生成计划]              │
└─────────────────────────────────────────────┘
```

**器械选项** 使用动作库的 Equipment 枚举值：
- barbell / dumbbell / cable / machine / bodyweight / other

---

## 状态流转

### 计划状态
```
draft ──[激活]──> active ──[完成]──> completed
                   │
                   └──[暂停]──> paused ──[激活]──> active
```

### 动作执行状态
```
pending ──[完成]──> completed
    │
    └──[跳过]──> skipped
```

---

## 分阶段实施

### Phase 1: 基础计划生成
- 表单收集用户信息（使用 Equipment 枚举）
- AI generate_plan tool（返回 exerciseId）
- 计划详情页展示（JOIN exercises）
- 对话调整计划

### Phase 2: 执行追踪
- 打卡功能
- 执行记录存储（关联 planExerciseId）
- AI analyze_execution tool（JOIN muscles 分析恢复状态）

### Phase 3: 可视化编辑
- 计划页面拖拽调整动作
- 动作参数修改
- 进度图表（按肌肉群统计训练量）

---

## 错误处理

| 场景 | 处理方式 |
|------|---------|
| 信息不足 | 询问补充："请问你的训练目标是增肌还是减脂？" |
| 找不到匹配动作 | AI选择最接近的动作，告知用户替代方案 |
| 计划不存在/无权访问 | 返回 403 Forbidden |
| 调整不明确 | 询问具体要调整什么："请问要调整哪个动作？" |
| 打卡网络错误 | Toast提示重试 |
| 数据验证失败 | 显示具体错误信息 |
