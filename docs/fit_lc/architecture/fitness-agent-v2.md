# FitnessAgent V2 架构文档

## 1. 概述

FitnessAgent V2 是基于 LangChain 的 AI 健身助手核心引擎，提供自然语言健身数据记录、查询、计划生成等功能。

**版本：** 2.0.0
**状态：** 已启用（生产环境）

## 2. 核心流程

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FitnessAgentV2 运行流程                      │
└─────────────────────────────────────────────────────────────────────┘

  用户输入
     │
     ▼
┌──────────────┐    ┌────────────────┐    ┌──────────────────────────┐
│  Vision 预处理 │ → │  构建消息      │ → │  LLM 首次调用            │
│ (图片分析)     │    │ (Prompt+历史)  │    │ (提取工具调用)           │
└──────────────┘    └────────────────┘    └──────────────────────────┘
                                                     │
                    ┌────────────────────────────────┼────────────────────────────────┐
                    │                                │                                │
                    ▼                                ▼                                ▼
           ┌─────────────────┐              ┌─────────────────┐              ┌─────────────────┐
           │ 有工具调用      │              │ 无工具 → Fallback│              │ 无工具 → 文本回复│
           │                 │              │                 │              │                 │
           │ 执行工具        │              │ 解析文本数据    │              │ 直接返回        │
           │ (批量并行)      │              │ (围度/训练)     │              │                 │
           └─────────────────┘              └─────────────────┘              └─────────────────┘
                    │                                │
                    ▼                                ▼
           ┌─────────────────┐              ┌─────────────────┐
           │ 工具执行结果    │              │ Fallback 成功？ │
           │                 │              │                 │
           └─────────────────┘              └─────────────────┘
                    │                                │
                    └────────────┬───────────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────────┐
                    │  LLM 二次调用                 │
                    │  (工具结果注入上下文)          │
                    └──────────────────────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────────┐
                    │  返回最终回复                  │
                    │  { reply, toolData, errors } │
                    └──────────────────────────────┘
```

## 3. 组件架构

### 3.1 核心文件

| 文件 | 职责 |
|------|------|
| `fitnessAgentV2.ts` | 主入口，协调各组件 |
| `promptBuilder.ts` | 统一构建系统提示词 |
| `toolExecutor.ts` | 批量执行工具，支持重试 |
| `fallbackHandler.ts` | LLM 未调用工具时的兜底解析 |
| `circuitBreaker.ts` | 熔断器，防止雪崩 |
| `validation.ts` | 统一输入校验 |

### 3.2 工具清单

| 工具 | 功能 | 类别 |
|------|------|------|
| `save_workout` | 保存训练记录 | save |
| `save_measurement` | 保存围度记录 | save |
| `query_workout` | 查询训练历史 | query |
| `query_measurement` | 查询围度历史 | query |
| `generate_plan` | AI 生成计划 | plan |
| `adjust_plan` | 调整计划 | plan |
| `analyze_execution` | 分析执行情况 | analyze |

## 4. 详细设计

### 4.1 Prompt 构建 (`promptBuilder.ts`)

统一管理 AI 私教人设、用户上下文、日期语义。

```
系统提示词结构：
1. AI 私教人设 - 小七（性格、对话策略、反馈模板）
2. 用户背景（目标、经验、体重、当前计划）
3. 日期参考（今天/昨天/上周等相对日期计算规则）
4. 工具调用规则（触发词、调用格式）
```

### 4.2 工具执行 (`toolExecutor.ts`)

**批量并行执行：**
- 按类别分组（save/query/plan/analyze）
- 同类别工具并行执行
- 不同类别并行执行

**重试机制：**
- 最多 3 次尝试（1 + 2 次重试）
- 指数退避：1s → 2s → 4s
- 验证错误不重试

**校验流程：**
```
工具输入 → validateToolInput() → 预校验
                                  ↓ 通过
                            熔断器检查
                                  ↓ 通过
                            执行工具
                                  ↓ 成功
                            记录成功 → 返回
                                  ↓ 失败
                            记录失败 → 重试或返回
```

### 4.3 熔断器 (`circuitBreaker.ts`)

**三态机：**
```
CLOSED (正常) ──(连续5次失败)──→ OPEN (熔断)
    ↑                              │
    │                         (30秒后)
    │                              ↓
    │                      HALF_OPEN (试探)
    │                              │
    │                         (成功/失败)
    │                        ┌─────┴─────┐
    │                        ↓           ↓
    └────────────────── CLOSED         OPEN
```

**配置：**
- `failureThreshold`: 5 次
- `recoveryTimeout`: 30000ms
- `halfOpenMaxAttempts`: 1

### 4.4 Fallback 机制 (`fallbackHandler.ts`)

当 LLM 未返回工具调用时，尝试解析文本中的结构化数据。

**优先级：**
1. **围度数据** - 正则匹配胸围/腰围/体重等
2. **训练数据** - 使用动作库解析
3. **无法解析** - 返回空

**示例：**
```
用户: "今天胸围94，腰围78"
     ↓ 正则匹配
parseResult: [{ body_part: 'chest', value: 94 }, { body_part: 'waist', value: 78 }]
     ↓ 调用 saveService.saveMeasurement()
返回: { success: true, reply: '已记录围度：胸围94、腰围78' }
```

### 4.5 历史消息压缩 (`historyCompressor.ts`)

Hybrid 方案，在保留关键信息和控制 token 成本之间取得平衡。

**压缩策略：**
```
消息数量 ≤ 10 → 直接返回（快速路径）
消息数量 > 10 且 token 超限 → 压缩
```

**保留优先级：**
1. 最近 10 条消息
2. 最近 5 条工具调用结果（关键数据）
3. 更早的消息 → 提取关键信息生成摘要

**关键信息识别：**
- 训练记录（动作名、重量、组数）
- 围度数据（胸围/腰围/体重等）
- 成就（PR、徽章、里程碑）
- 用户目标/问题

**摘要格式：**
```
【训练】卧推80kg、深蹲100kg | 【围度】体重70kg | 【成就】突破个人最佳
```

**配置：**
```typescript
{
  maxRecentMessages: 10,    // 保留最近 10 条
  maxTokens: 3500,         // 最大 3500 token
  enableSummarization: true,
  preserveToolResults: 5   // 保留最近 5 条工具结果
}
```

### 4.6 统一校验 (`validation.ts`)

所有工具执行前必须通过 `validateToolInput()` 校验：

| 工具 | 必填字段 |
|------|----------|
| `save_workout` | date, exercises[].name |
| `save_measurement` | measurements[].body_part, measurements[].value |
| `query_workout` | start_date, end_date |
| `query_measurement` | start_date, end_date |
| `generate_plan` | user_profile.goal, frequency, experience, body_weight |
| `adjust_plan` | plan_id, adjustment |
| `analyze_execution` | planId |

**返回格式：**
```typescript
interface ValidationResult {
  valid: boolean;
  missingFields: { field: string; label: string; hint: string }[];
  errors?: string[];
}
```

## 5. 工具响应格式

所有工具返回统一 JSON 格式：

```typescript
{
  aiReply: string;      // AI 对话回复（展示给用户）
  dataType: string;    // 数据类型标识
  status?: 'success' | 'needs_more_info' | 'error';
  result?: any;        // 结构化数据
  missingFields?: any; // 信息不完整时
}
```

## 6. 调用示例

```typescript
import { runAgentV2 } from './agents/fitnessAgentV2';

const result = await runAgentV2(
  userId: 1,
  message: '今天卧推80kg 5组每组8个',
  userContext: { context_text: '...', profile_snapshot: '...' },
  historyMessages: [{ role: 'user', content: '...' }],
  imageUrls: []
);

console.log(result.reply);    // '训练记录已保存！...'
console.log(result.toolData); // { dataType: 'workout', result: {...} }
```

## 7. 版本对比

| 特性 | V1 (fitnessAgent.ts) | V2 (fitnessAgentV2.ts) |
|------|----------------------|------------------------|
| 工具执行 | 串行 | 批量并行 |
| 校验 | 分散在工具内部 | 统一校验层 |
| 重试 | 无 | 3次重试+指数退避 |
| Fallback | 内联简单逻辑 | 独立模块 |
| 熔断 | 无 | 有 |
| Prompt | 内联 | 独立模块 |
| 历史压缩 | 无 | Hybrid 方案 |
| 代码行数 | ~530 | ~240（更简洁） |

## 8. 文件索引

```
backend/src/
├── agents/
│   ├── fitnessAgent.ts          # V1 (deprecated, 保留兼容)
│   ├── fitnessAgentV2.ts       # V2 主入口
│   ├── promptBuilder.ts        # Prompt 构建
│   ├── toolExecutor.ts         # 工具执行器
│   ├── fallbackHandler.ts      # Fallback 兜底
│   ├── circuitBreaker.ts       # 熔断器
│   ├── historyCompressor.ts    # 历史消息压缩
│   ├── chatFactory.ts          # Chat 模型工厂
│   └── plugins/
│       └── visionPreprocessor.ts  # 图片预处理
└── tools/
    ├── utils/
    │   └── validation.ts        # 统一校验
    ├── saveWorkout.ts
    ├── saveMeasurement.ts
    ├── queryWorkout.ts
    ├── queryMeasurement.ts
    ├── generatePlan.ts
    ├── adjustPlan.ts
    └── analyzeExecution.ts
```