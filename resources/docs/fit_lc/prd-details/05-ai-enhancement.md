# 4. AI增强功能 - 详情页

## 功能概述

AI增强功能为管理员提供自动生成动作详情和肌肉详情的能力，大幅降低手工录入工作量，提高数据完整性。

---

## 动作详情AI生成

### 生成字段
| 字段 | 类型 | 说明 |
|------|------|------|
| steps | TEXT | 动作步骤说明（4-6步详细步骤） |
| safetyNotes | TEXT | 安全注意事项（2-3条） |
| commonMistakes | TEXT | 常见错误（2-3条） |
| adjustmentNotes | TEXT | 调整说明 |
| exerciseType | STRING | 'compound'复合动作 / 'isolation'孤立动作 |
| conversionGuide | JSON | 变体转换指南 |
| suggestedMuscles | JSON | 建议关联的肌肉列表 |

### 肌肉关联关系类型
| 关系 | 说明 | 示例（杠铃卧推） |
|------|------|----------------|
| agonist | 主发力肌肉 | 胸大肌 |
| synergist | 协同肌肉 | 肱三头肌、三角肌前束 |
| antagonist | 拮抗肌 | 背阔肌 |
| stabilizer | 稳定肌 | 前锯肌 |

### AI提示词设计
```
给定动作信息：
- 名称：${exercise.name}
- 肌肉群：${exercise.category}
- 器材：${exercise.equipment}
- 难度：${exercise.difficulty}
${targetMuscles ? `- 目标肌肉：${targetMuscles.map(m => m.name).join('、')}` : ''}

请为这个动作生成以下信息（JSON格式）：
{
  "steps": "动作步骤说明",
  "safetyNotes": "安全注意事项",
  "commonMistakes": "常见错误",
  "adjustmentNotes": "调整说明",
  "exerciseType": "compound 或 isolation",
  "conversionGuide": { "变体类型": "转换建议" },
  "suggestedMuscles": [
    { "name": "肌肉名称", "role": "agonist/synergist/antagonist/stabilizer" }
  ]
}

要求：
- 用中文回答
- steps包含4-6步详细动作步骤
- safetyNotes包含2-3条安全提示
- commonMistakes包含2-3条常见错误
- exerciseType为'compound'（复合动作）或'isolation'（孤立动作）
- suggestedMuscles根据动作类型推荐相关肌肉
- 只返回JSON，不要其他内容
```

### 响应格式
```json
{
  "steps": "1. 仰卧在卧推凳上，双脚踩实地面... 2. 握距略宽于肩...",
  "safetyNotes": "1. 确保杠铃握紧，避免滑落... 2. 不要憋气...",
  "commonMistakes": "1. 臀部下沉导致腰部过度弯曲... 2. 肩部前伸...",
  "adjustmentNotes": "握距过宽会增加肩部压力，建议与肩同宽或略宽",
  "exerciseType": "compound",
  "conversionGuide": {
    "barbell_to_dumbbell": "哑铃重量约为杠铃的50-60%，每侧单独计算"
  },
  "suggestedMuscles": [
    {"name": "胸大肌", "role": "agonist"},
    {"name": "肱三头肌", "role": "synergist"},
    {"name": "三角肌前束", "role": "synergist"},
    {"name": "前锯肌", "role": "stabilizer"}
  ]
}
```

---

## 肌肉详情AI生成

### 生成字段
| 字段 | 类型 | 说明 |
|------|------|------|
| origin | TEXT | 肌肉起点 |
| insertion | TEXT | 肌肉止点 |
| function | TEXT | 肌肉功能 |
| trainingTips | TEXT | 训练技巧 |

### AI提示词设计
```
给定肌肉信息：
- 名称：${muscle.name}
- 肌肉群：${muscle.group}

请生成以下信息（JSON格式）：
{
  "origin": "起点描述",
  "insertion": "止点描述",
  "function": "功能描述",
  "trainingTips": "训练技巧（3-5条）"
}

要求：
- 用中文回答
- origin和insertion使用解剖学标准描述
- function描述肌肉的主要功能
- trainingTips给出实际训练建议
- 只返回JSON，不要其他内容
```

### 响应格式
```json
{
  "origin": "锁骨内侧半侧、胸骨柄、第1-6肋软骨",
  "insertion": "肱骨大结节嵴",
  "function": "肩关节屈曲、内收、内旋；用力吸气时辅助提升胸廓",
  "trainingTips": "1. 训练时注意胸大肌的拉伸感\n2. 卧推动作保持肩胛骨稳定贴凳\n3. 推起时注重胸大肌的顶峰收缩\n4. 控制离心收缩阶段，不要自由落体\n5. 可以通过调整角度针对不同区域"
}
```

---

## 前端AI增强交互

### 管理员动作编辑页
```
┌─────────────────────────────────────────────┐
│ 添加/编辑动作                                │
├─────────────────────────────────────────────┤
│ 动作名称: [杠铃卧推_______] [AI增强]         │
│                                             │
│ 分类:      [胸部 ▼]                         │
│ 器材:      [杠铃 ▼]                         │
│ 难度:      [中级 ▼]                         │
│                                             │
│ 动作步骤:                                   │
│ [____________________________________________] │
│ [____________________________________________] │
│                                             │
│ 注意事项:                                   │
│ [____________________________________________] │
│                                             │
│ 常见错误:                                   │
│ [____________________________________________] │
│                                             │
│ 动作类型: [复合动作 ▼]                      │
│                                             │
│ 关联肌肉:                                   │
│ ☑ 胸大肌 (主要)                             │
│ ☑ 肱三头肌 (辅助)                           │
│ ☐ 三角肌前束 (辅助)                          │
│                                             │
│                    [取消]  [保存]            │
└─────────────────────────────────────────────┘
```

### AI增强按钮状态
| 状态 | 显示 | 说明 |
|------|------|------|
| 默认 | "AI增强" | 可点击 |
| 生成中 | "生成中..." | 禁用，不可点击 |
| 成功 | "AI增强" | 重新可用 |
| 失败 | "AI增强" | 重新可用，显示错误提示 |

### 生成后处理
1. AI返回数据 → 自动填充表单字段
2. 管理员确认字段内容
3. 肌肉关联建议 → 以勾选列表展示，管理员可调整
4. 保存提交

---

## 批量生成脚本

### 功能特性
- 支持断点续传
- 每生成一条即保存进度
- 遇到错误继续处理下一条
- 生成结果输出为JSON文件

### 脚本结构
```javascript
// backend/scripts/ai-generate-exercise-details.js

const OUTPUT_DIR = './output';

async function main() {
  // 1. 获取所有待处理动作
  const exercises = await prisma.exercise.findMany({
    orderBy: [{ category: 'asc' }, { name: 'asc' }],
  });

  // 2. 加载已有结果（断点续传）
  const completedIds = loadExistingResults();
  const results = loadExistingResults().all;

  // 3. 逐个生成
  for (const exercise of exercises) {
    if (completedIds.has(exercise.id)) {
      console.log(`跳过(已完成): ${exercise.name}`);
      continue;
    }

    const details = await exerciseAIService.generateExerciseDetails(exercise);
    results.push({ id: exercise.id, ...details });

    // 每条即保存
    saveResults(results);
  }
}
```

### 输出文件
```
backend/output/
├── exercise-details-2026-04-25.json
└── muscle-details-2026-04-25.json
```

### JSON输出格式
```json
{
  "generatedAt": "2026-04-25",
  "exercises": [
    {
      "id": 1,
      "name": "杠铃卧推",
      "category": "chest",
      "equipment": "barbell",
      "difficulty": "intermediate",
      "steps": "...",
      "safetyNotes": "...",
      "commonMistakes": "...",
      "adjustmentNotes": "...",
      "exerciseType": "compound",
      "conversionGuide": {...},
      "suggestedMuscles": [
        {"name": "胸大肌", "role": "agonist"}
      ]
    }
  ]
}
```

---

## API接口

### 单个生成接口

#### POST /api/admin/exercises/generate
```json
// Request
{
  "name": "杠铃卧推",
  "category": "chest",
  "equipment": "barbell",
  "difficulty": "intermediate",
  "targetMuscles": [{"id": 1, "name": "胸大肌"}]
}

// Response
{
  "steps": "...",
  "safetyNotes": "...",
  "commonMistakes": "...",
  "adjustmentNotes": "...",
  "exerciseType": "compound",
  "conversionGuide": {...},
  "suggestedMuscles": [...]
}
```

#### POST /api/admin/muscles/generate
```json
// Request
{
  "name": "胸大肌",
  "group": "chest"
}

// Response
{
  "origin": "...",
  "insertion": "...",
  "function": "...",
  "trainingTips": "..."
}
```

---

## 错误处理

### AI调用失败
| 错误类型 | 处理方式 |
|---------|---------|
| 网络超时 | 重试3次，每次间隔2秒 |
| API限流 | 等待1秒后重试 |
| 解析失败 | 返回错误提示，记录日志 |

### 单个生成接口错误
- AI返回非JSON格式 → 返回错误提示"生成失败，请重试"
- 网络错误 → 返回错误提示，前端显示重试按钮

### 批量脚本错误
- 单条错误不影响整体
- 错误记录到日志文件
- 继续处理下一条
- 最终汇总错误数量供管理员查看
