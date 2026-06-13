# 3.3 肌肉库 - 详情页

## 功能概述

肌肉库采用两层层级结构：肌肉群（Level 1）→ 主肌肉（Level 2），为动作库提供肌肉分类基础，支持训练计划生成和动作关联。

---

## 数据模型

### Muscle 模型
```prisma
model Muscle {
  id        Int   @id @default(autoincrement())
  name      String @db.VarChar(100)
  group     MuscleGroup
  parentId  Int?  // 指向肌肉群，null=肌肉群本身
  sortOrder Int   @default(0)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  // 肌肉详情（AI增强）
  origin        String?  @db.Text  // 起点
  insertion     String?  @db.Text  // 止点
  function      String?  @db.Text  // 功能
  trainingTips  String?  @db.Text  // 训练技巧

  parent    Muscle?  @relation("MuscleHierarchy", fields: [parentId], references: [id])
  children  Muscle[] @relation("MuscleHierarchy")
  exercises ExerciseMuscle[]

  @@index([group])
  @@index([parentId])
  @@map("muscles")
}

enum MuscleGroup { chest back legs shoulders arms core }
```

---

## 肌肉层级结构

### 完整肌肉树
```
胸部 (chest)
├── 胸大肌 (Pectoralis Major)
├── 胸小肌 (Pectoralis Minor)
└── 前锯肌 (Serratus Anterior)

背部 (back)
├── 背阔肌 (Latissimus Dorsi)
├── 中下斜方肌 (Trapezius)
├── 大圆肌 (Teres Major)
├── 小圆肌 (Teres Minor)
└── 竖脊肌 (Erector Spinae)

腿部 (legs)
├── 股四头肌 (Quadriceps)
├── 腘绳肌 (Hamstrings)
├── 臀大肌 (Gluteus Maximus)
└── 小腿肌群 (Calf Muscles)

肩部 (shoulders)
├── 三角肌 (Deltoid)
└── 肩袖肌群 (Rotator Cuff)

手臂 (arms)
├── 肱二头肌 (Biceps Brachii)
├── 肱三头肌 (Triceps Brachii)
└── 前臂肌群 (Forearm Muscles)

核心 (core)
├── 腹直肌 (Rectus Abdominis)
├── 腹斜肌 (Obliques)
├── 腹横肌 (Transverse Abdominis)
└── 下背肌群 (Lower Back Muscles)
```

### 肌肉群分类
| 肌肉群 | 英文 | 主肌肉数量 |
|--------|------|-----------|
| 胸部 | chest | 3 |
| 背部 | back | 5 |
| 腿部 | legs | 4 |
| 肩部 | shoulders | 2 |
| 手臂 | arms | 3 |
| 核心 | core | 4 |
| **合计** | | **21** |

---

## 肌肉详情字段

### AI增强生成字段
| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| origin | TEXT | 肌肉起点 | "锁骨内侧半侧、胸骨柄" |
| insertion | TEXT | 肌肉止点 | "肱骨大结节嵴" |
| function | TEXT | 肌肉功能 | "肩关节屈曲、内收、内旋" |
| trainingTips | TEXT | 训练技巧 | "训练时注意顶峰收缩" |

### 肌肉详解示例（胸大肌）
```json
{
  "name": "胸大肌",
  "group": "chest",
  "origin": "锁骨内侧半侧、胸骨柄、第1-6肋软骨",
  "insertion": "肱骨大结节嵴",
  "function": "肩关节屈曲、内收、内旋；用力吸气辅助",
  "trainingTips": "1. 卧推时保持肩胛骨稳定\n2. 注意胸大肌的拉伸感\n3. 顶峰收缩1-2秒"
}
```

---

## 前端展示

### 肌肉层级树
```
┌─────────────────────────────────────────────┐
│ 肌肉库                                      │
├─────────────────────────────────────────────┤
│ ▼ 胸部 (chest)                              │
│   ├── 胸大肌                                │
│   ├── 胸小肌                                │
│   └── 前锯肌                                │
│ ▼ 背部 (back)                               │
│   ├── 背阔肌                                │
│   ├── 中下斜方肌                            │
│   ├── 大圆肌                                │
│   ├── 小圆肌                                │
│   └── 竖脊肌                                │
└─────────────────────────────────────────────┘
```

### 肌肉详情卡
```
┌─────────────────────────────────────────────┐
│ 胸大肌 (Pectoralis Major)                   │
├─────────────────────────────────────────────┤
│ 起点: 锁骨内侧半侧、胸骨柄、第1-6肋软骨       │
│ 止点: 肱骨大结节嵴                           │
│ 功能: 肩关节屈曲、内收、内旋                 │
│ 训练技巧:                                    │
│ 1. 卧推时保持肩胛骨稳定                     │
│ 2. 注意胸大肌的拉伸感                       │
│ 3. 顶峰收缩1-2秒                            │
├─────────────────────────────────────────────┤
│ 相关动作: 杠铃卧推、哑铃飞鸟、俯卧撑         │
└─────────────────────────────────────────────┘
```

---

## 管理功能

### 肌肉列表
- 层级树展示
- 按肌肉群筛选
- 排序：sortOrder字段

### 肌肉编辑
- 名称编辑
- 肌肉群重选（不可跨群移动）
- 排序调整
- 详情字段编辑

### 肌肉详情AI生成
管理员可使用AI自动生成肌肉的起点、止点、功能、训练技巧。

```javascript
// AI生成提示词
`给定肌肉信息：
- 名称：${muscle.name}
- 肌肉群：${muscle.group}

请生成以下信息（JSON格式）：
{
  "origin": "起点描述",
  "insertion": "止点描述",
  "function": "功能描述",
  "trainingTips": "训练技巧（3-5条）"
}`
```

---

## 与动作库的关系

### 关联查询
```javascript
// 获取胸大肌相关的所有动作
prisma.exercise.findMany({
  where: {
    muscles: {
      some: {
        muscleId: 2, // 胸大肌ID
        role: 'primary'
      }
    }
  }
})
```

### 肌肉详情展示位置
1. 肌肉库页面 - 独立详情展示
2. 动作详情页 - 作为动作的关联肌肉展示
3. AI生成计划页 - 作为计划配置选项
