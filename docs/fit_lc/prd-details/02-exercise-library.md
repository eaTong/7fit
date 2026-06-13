# 3.2 训练动作库 - 详情页

## 功能概述

训练动作库是FitLC的核心数据资产，包含500+结构化的健身动作，支持按肌肉群、器械、难度筛选，用于AI生成健身计划和用户动作选择。

---

## 数据模型

### Exercise 模型
```prisma
model Exercise {
  id              Int     @id @default(autoincrement())
  name            String  @db.VarChar(200)
  category        MuscleGroup  // chest/back/legs/shoulders/arms/core
  equipment       Equipment    // barbell/dumbbell/cable/machine/bodyweight/other
  difficulty      Difficulty   // beginner/intermediate/advanced
  description     String? @db.Text
  adjustmentNotes String? @db.Text
  videoUrl        String? @db.VarChar(500)
  isVariant       Boolean @default(false)
  parentId        Int?    // 变体所属主动作
  tags            Json?
  status          ExerciseStatus @default(draft)

  // AI增强字段
  steps           String?  @db.Text
  safetyNotes     String?  @db.Text
  commonMistakes  String?  @db.Text
  exerciseType    String? // compound/isolation
  variantType     String? // equipment/difficulty/posture
  conversionGuide Json?

  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  parent    Exercise?        @relation("ExerciseVariant", fields: [parentId], references: [id])
  variants  Exercise[]        @relation("ExerciseVariant")
  muscles   ExerciseMuscle[]

  @@index([category])
  @@index([equipment])
  @@index([difficulty])
  @@index([status])
  @@map("exercises")
}

model ExerciseMuscle {
  id         Int        @id @default(autoincrement())
  exerciseId Int        @map("exercise_id")
  muscleId   Int        @map("muscle_id")
  role       MuscleRole // primary/secondary

  exercise   Exercise @relation(fields: [exerciseId], references: [id], onDelete: Cascade)
  muscle     Muscle   @relation(fields: [muscleId], references: [id])

  @@unique([exerciseId, muscleId, role])
  @@index([muscleId])
  @@map("exercise_muscles")
}
```

### 枚举定义
```prisma
enum MuscleGroup { chest back legs shoulders arms core }
enum Equipment { barbell dumbbell cable machine bodyweight other }
enum Difficulty { beginner intermediate advanced }
enum MuscleRole { primary secondary }
enum ExerciseStatus { draft published }
```

---

## 动作属性说明

### 基础字段
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | VARCHAR(200) | 是 | 动作名称，如"杠铃卧推" |
| category | ENUM | 是 | 所属肌肉群 |
| equipment | ENUM | 是 | 使用器械 |
| difficulty | ENUM | 是 | 难度级别 |
| status | ENUM | 是 | draft/published |

### 描述字段
| 字段 | 类型 | 说明 |
|------|------|------|
| description | TEXT | 动作完整说明（Markdown格式） |
| adjustmentNotes | TEXT | 细节调整要点（Markdown格式） |
| videoUrl | VARCHAR(500) | 视频教程链接 |

### AI增强字段
| 字段 | 类型 | 说明 |
|------|------|------|
| steps | TEXT | 详细动作步骤（4-6步） |
| safetyNotes | TEXT | 安全注意事项（2-3条） |
| commonMistakes | TEXT | 常见错误（2-3条） |
| exerciseType | STRING | compound(复合动作)/isolation(孤立动作) |
| variantType | STRING | 变体类型：equipment / difficulty / posture |
| conversionGuide | JSON | 变体转换指南 |

### 变体字段
| 字段 | 类型 | 说明 |
|------|------|------|
| isVariant | BOOLEAN | 是否是变体动作 |
| parentId | INT | 所属主动作ID（null=主动作） |

### 关联字段
| 字段 | 类型 | 说明 |
|------|------|------|
| tags | JSON | 自定义标签数组 |
| muscles | Relation | 关联肌肉（通过ExerciseMuscle） |

---

## 器械类型说明

| 器械 | 说明 | 示例动作 |
|------|------|---------|
| barbell | 杠铃 | 杠铃卧推、杠铃深蹲 |
| dumbbell | 哑铃 | 哑铃弯举、哑铃飞鸟 |
| cable | 绳索 | 绳索下压、高位下拉 |
| machine | 器械 | 腿举机、蝴蝶机 |
| bodyweight | 自重 | 俯卧撑、引体向上 |
| other | 其他 | 弹力带、TRX等 |

---

## 动作变体关系

### 变体类型
| 类型 | 说明 | 示例 |
|------|------|------|
| equipment | 器械变体 | 杠铃卧推 → 哑铃卧推 |
| difficulty | 难度变体 | 标准俯卧撑 → 跪姿俯卧撑 |
| posture | 姿势变体 | 平板卧推 → 上斜卧推 |

### 变体数据结构
```json
{
  "sourceEquipment": "barbell",
  "targetEquipment": "dumbbell",
  "formula": "哑铃重量约为杠铃的50-60%，每侧单独计算"
}
```

---

## 动作-肌肉关联

### 关联角色
| 角色 | 说明 | 示例（杠铃卧推） |
|------|------|----------------|
| primary | 主要发力肌肉 | 胸大肌 |
| secondary | 辅助肌肉 | 肱三头肌、三角肌前束 |

### 关联规则
- 每个动作至少关联1个主要肌肉(primary)
- 可选关联0-3个辅助肌肉(secondary)
- 肌肉关联到Level 2主肌肉（不是肌肉群）

---

## 审核流程

### 状态流转
```
draft ──[管理员审核]──> published
```

### 状态说明
| 状态 | 说明 | 可用范围 |
|------|------|---------|
| draft | 待审核 | 仅管理员可见 |
| published | 已发布 | 所有用户可用 |

### 操作权限
| 操作 | 权限 |
|------|------|
| 创建动作 | admin |
| 编辑动作 | admin |
| 删除动作 | admin |
| 发布动作 | admin |
| 查看动作 | 登录用户（published） |

---

## 动作库批量生成

### 分批计划
| 批次 | 肌肉群 | 主肌肉数 | 预估动作数 |
|------|--------|----------|-----------|
| 1 | 胸部 (chest) | 3 | 50-70 |
| 2 | 背部 (back) | 5 | 80-100 |
| 3 | 腿部 (legs) | 4 | 80-100 |
| 4 | 肩部 (shoulders) | 2 | 40-60 |
| 5 | 手臂 (arms) | 3 | 60-80 |
| 6 | 核心 (core) | 4 | 50-70 |

### 生成流程
```
1. AI按muscleId分批生成动作JSON
     ↓
2. 转换为SQL seed文件
     ↓
3. 执行SQL导入数据库
     ↓
4. 在管理页面审核
     ↓
5. 状态 draft → published
```

### 输出格式
```json
{
  "generatedAt": "2026-04-25",
  "exercises": [
    {
      "name": "杠铃卧推",
      "category": "chest",
      "equipment": "barbell",
      "difficulty": "intermediate",
      "steps": "1. 仰卧在卧推凳上...\n2. 握距略宽于肩...",
      "safetyNotes": "1. 确保杠铃握紧...\n2. 不要憋气...",
      "commonMistakes": "1. 臀部下沉...\n2. 肩部前伸...",
      "exerciseType": "compound",
      "suggestedMuscles": [
        {"id": 1, "name": "胸大肌", "role": "primary"},
        {"id": 5, "name": "肱三头肌", "role": "secondary"}
      ]
    }
  ]
}
```

---

## 管理功能

### 动作列表页
- 筛选条件：分类、器械、难度、状态
- 排序：名称、创建时间
- 分页：每页20条

### 动作编辑
- 基础信息编辑
- 肌肉关联设置（多选+角色标注）
- AI增强生成

### 批量操作
- 批量发布
- 批量删除
- 批量导出

---

## 查询场景

### 按肌肉群查询
```
prisma.exercise.findMany({
  where: {
    muscles: {
      some: {
        muscle: { group: 'chest' }
      }
    }
  }
})
```

### 按难度和器械查询
```
prisma.exercise.findMany({
  where: {
    difficulty: 'beginner',
    equipment: 'bodyweight'
  }
})
```

### 获取动作详情（含关联肌肉）
```
prisma.exercise.findUnique({
  where: { id: 1 },
  include: {
    muscles: {
      include: { muscle: true }
    }
  }
})
```
