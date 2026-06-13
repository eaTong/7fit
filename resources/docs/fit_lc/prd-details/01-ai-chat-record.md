# 3.1 AI对话记录 - 详情页

## 功能概述

AI对话记录是FitLC的核心功能，允许用户通过自然语言与AI对话，自动记录健身训练和身体围度数据。

---

## 用户故事

### 故事1：记录训练
**作为** 健身用户
**我想要** 用自然语言描述我的训练
**以便于** 快速记录而无需手动填写表单

**示例对话：**
```
用户: 今天深蹲100kg 5组每组8个
AI: 已保存：深蹲 100kg x 5组 x 8次

用户: 跑步跑了30分钟，大概5公里
AI: 已保存：跑步 30分钟 5公里
```

### 故事2：记录围度
**作为** 健身用户
**我想要** 描述我的身体围度测量值
**以便于** 追踪身体变化

**示例对话：**
```
用户: 今天胸围94，腰围78
AI: 已保存：胸围 94cm，腰围 78cm

用户: 臂围好像又粗了，量了一下有34
AI: 已保存：臂围 34cm
```

### 故事3：查询训练历史
**作为** 健身用户
**我想要** 询问我的训练记录
**以便于** 了解我的训练情况

**示例对话：**
```
用户: 这周跑了多少次？
AI: 这周跑了3次：周一5公里、周三3公里、周五6公里

用户: 上个月深蹲总重量多少？
AI: 上个月深蹲总计：3200kg
```

### 故事4：查询围度变化
**作为** 健身用户
**我想要** 询问我的围度变化
**以便于** 了解身体变化趋势

**示例对话：**
```
用户: 我的围度有什么变化？
AI: 近一个月变化：
- 胸围：94cm → 95cm (+1cm)
- 腰围：78cm → 76cm (-2cm)
- 臀围：92cm → 92cm (不变)
```

### 故事5：撤销错误记录
**作为** 健身用户
**我想要** 撤销我刚才的错误记录
**以便于** 修正输入错误

**交互说明：**
保存成功后，消息下方显示"撤销"按钮。用户点击撤销按钮，系统直接调用 `DELETE /api/records/workout/:id` 或 `DELETE /api/records/measurement/:id` API 进行软删除。

**示例：**
```
用户: 今天深蹲100kg 5组
AI: 已保存：深蹲 100kg x 5组 x 8次 [撤销]

用户: (点击撤销按钮)
系统: 调用 DELETE /api/records/workout/123
AI: 已撤销训练记录
```

---

## 功能详细说明

### 1. 意图识别

AI需要识别以下几种用户意图：

| 意图 | 触发条件 | Tool调用 |
|------|---------|---------|
| SAVE_WORKOUT | 用户描述训练内容 | save_workout |
| SAVE_MEASUREMENT | 用户描述围度数值 | save_measurement |
| QUERY_WORKOUT | 用户询问训练记录 | query_workout |
| QUERY_MEASUREMENT | 用户询问围度数据 | query_measurement |
| REVOKE | 用户点击撤销按钮 | (前端直接调用DELETE API) |
| UNKNOWN | 无法判断 | 询问用户澄清 |

### 2. 参数解析规则

#### 训练参数
| 参数 | 必需 | 说明 | 解析示例 |
|------|------|------|---------|
| date | 是 | 训练日期，默认为今天 | "今天"、"昨天"、"上周一" |
| exercises | 是 | 动作数组 | "深蹲"、"跑步"、"卧推" |
| sets | 否 | 组数 | "5组"、"分成5组" |
| reps | 否 | 次数 | "每组8个"、"8次" |
| weight | 否 | 重量(kg) | "100kg"、"100公斤" |
| duration | 否 | 时长(分钟) | "30分钟"、"练了半小时" |
| distance | 否 | 距离(公里) | "5公里"、"跑了5公里" |

#### 围度参数
| 参数 | 必需 | 说明 | 解析示例 |
|------|------|------|---------|
| date | 是 | 测量日期，默认为今天 | "今天"、"昨天" |
| measurements | 是 | 围度数组 | - |
| body_part | 是 | 部位 | "胸围"、"腰围"、"臂围" |
| value | 是 | 数值(cm) | "94"、"94cm" |

### 3. 支持的身体部位映射

| 中文 | 英文enum |
|------|---------|
| 胸围 | chest |
| 腰围 | waist |
| 臀围 | hips |
| 臂围 | biceps |
| 大腿围 | thighs |
| 小腿围 | calves |

### 4. 数据验证规则

| 验证项 | 规则 | 错误处理 |
|-------|------|---------|
| 日期格式 | YYYY-MM-DD | AI自动转换"今天"等表述 |
| 重量 | > 0 且 < 1000 | 询问用户确认 |
| 组数 | > 0 且 < 100 | 询问用户确认 |
| 次数 | > 0 且 < 1000 | 询问用户确认 |
| 时长 | > 0 且 < 600 | 询问用户确认 |
| 距离 | > 0 且 < 100 | 询问用户确认 |
| 围度值 | > 0 且 < 300 | 询问用户确认 |

### 5. 响应格式

#### 保存成功
```
已保存：[动作摘要]
[撤销按钮]
```

#### 保存失败
```
保存失败，请重试
```

#### 查询结果
```
[格式化的查询结果]
```

#### 意图不清
```
没听明白，你要记录还是要查询？请具体说明：
- 记录训练：如"今天深蹲100kg 5组"
- 记录围度：如"今天胸围94"
- 查询训练：如"这周跑了多少次？"
- 查询围度：如"我的围度有什么变化？"
```

---

## 前端交互设计

### 页面布局
```
┌─────────────────────────────────────────────┐
│ FITLC                            [历史][趋势][个人] │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ User: 今天深蹲100kg 5组               │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ AI: 已保存：深蹲 100kg x 5组 x 8次   │   │
│  │                              [撤销]  │   │
│  └─────────────────────────────────────┘   │
│                                             │
├─────────────────────────────────────────────┤
│ [输入消息...]                        [发送] │
└─────────────────────────────────────────────┘
```

### 组件说明
| 组件 | 说明 |
|------|------|
| ChatMessage | 单条对话消息，支持user/assistant角色 |
| ChatInput | 输入框+发送按钮，支持Enter发送 |
| UndoButton | 撤销按钮，仅在保存成功消息中显示 |

### 状态管理
```typescript
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  savedData?: {
    type: 'workout' | 'measurement';
    id: number;
  };
}

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
  undoLastSave: () => Promise<void>;
  clearMessages: () => void;
}
```

---

## 后端实现

### API端点
```
POST /api/chat/message
```

### 请求格式
```json
{
  "message": "今天深蹲100kg 5组每组8个"
}
```

### 响应格式
```json
{
  "reply": "已保存：深蹲 100kg x 5组 x 8次",
  "savedData": {
    "type": "workout",
    "id": 123
  }
}
```

### Tool定义
```javascript
// save_workout
{
  name: "save_workout",
  description: "当用户要记录健身训练时使用",
  parameters: {
    type: "object",
    properties: {
      date: { type: "string" },
      exercises: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            sets: { type: "number" },
            reps: { type: "number" },
            weight: { type: "number" },
            duration: { type: "number" },
            distance: { type: "number" }
          }
        }
      }
    },
    required: ["date", "exercises"]
  }
}

// save_measurement
{
  name: "save_measurement",
  description: "当用户要记录身体围度时使用",
  parameters: {
    type: "object",
    properties: {
      date: { type: "string" },
      measurements: {
        type: "array",
        items: {
          type: "object",
          properties: {
            body_part: { type: "string", enum: ["chest","waist","hips","biceps","thighs","calves"] },
            value: { type: "number" }
          }
        }
      }
    },
    required: ["date", "measurements"]
  }
}

// query_workout
{
  name: "query_workout",
  description: "当用户询问训练记录、训练历史、统计数据时使用",
  parameters: {
    type: "object",
    properties: {
      start_date: { type: "string" },
      end_date: { type: "string" },
      exercise_type: { type: "string" }
    },
    required: ["start_date", "end_date"]
  }
}

// query_measurement
{
  name: "query_measurement",
  description: "当用户询问身体围度、围度变化、对比时使用",
  parameters: {
    type: "object",
    properties: {
      start_date: { type: "string" },
      end_date: { type: "string" },
      body_part: { type: "string" }
    },
    required: ["start_date", "end_date"]
  }
}
```

---

## 错误处理

### 意图识别失败
- AI无法判断保存还是查询 → 询问用户澄清

### 解析失败
- 识别到保存意图，但数据不完整 → 询问补充
- 示例："深蹲记录了，但重量是多少？"

### 保存失败
- 数据库写入错误 → 返回"保存失败，请重试"，记录error log

### 查询无数据
- 查不到结果 → 返回"暂无记录"

### 认证失败
- token无效/过期 → 返回401 Unauthorized

### 撤销失败
- 记录不存在或已删除 → 返回"记录不存在或已撤销"
