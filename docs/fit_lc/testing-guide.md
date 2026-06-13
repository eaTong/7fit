# 七练自动化测试指南

## 测试结构

```
fit_lc/
├── backend/
│   └── tests/
│       ├── unit/
│       │   ├── repositories/
│       │   │   ├── workoutRepository.test.ts
│       │   │   └── measurementRepository.test.ts
│       │   ├── services/
│       │   │   └── saveService.test.ts
│       │   └── utils/
│       │       └── dateUtils.test.ts
│       └── integration/
│           └── workoutRepository.int.test.ts    # SQLite 集成测试
│
├── frontend/
│   └── tests/
│       ├── unit/
│       │   ├── stores/
│       │   │   ├── authStore.test.ts
│       │   │   └── chatStore.test.ts
│       │   └── utils/
│       │       └── transformRecords.test.ts
│       └── e2e/                               # Playwright E2E 测试
│           ├── playwright.config.ts
│           ├── specs/
│           │   ├── auth.spec.ts
│           │   ├── chat.spec.ts
│           │   ├── records.spec.ts
│           │   ├── trends.spec.ts
│           │   ├── workout-plan.spec.ts
│           │   ├── exercises.spec.ts
│           │   ├── muscles.spec.ts
│           │   ├── profile.spec.ts
│           │   ├── admin-exercises.spec.ts
│           │   ├── admin-muscles.spec.ts
│           │   └── edge-cases.spec.ts
│           └── page-objects/
│               ├── BasePage.ts
│               ├── LoginPage.ts
│               ├── ChatPage.ts
│               ├── HistoryPage.ts
│               └── ExercisesPage.ts
```

## 运行测试

### 后端测试

```bash
cd backend

# 运行所有后端测试
npm test

# 运行单元测试
npm test -- --testPathPattern="unit"

# 运行集成测试
npm test -- --testPathPattern="integration"

# 运行指定测试
npm test -- tests/unit/utils/dateUtils.test.ts
```

### 前端测试

```bash
cd frontend

# 运行 Vitest 单元测试
npm test

# 运行 E2E 测试
npx playwright test

# 运行特定 E2E 测试
npx playwright test --grep "@auth"
npx playwright test --grep "@chat"
```

## 测试金字塔

```
        /\
       /E2E\        <- 58 tests，覆盖核心用户流程
      /------\
     /Integration\   <- 8 tests，使用真实 SQLite 数据库
    /------------\
   /  Unit Tests  \  <- 50+ tests，快速，测试隔离的业务逻辑
  /----------------\
```

## 测试覆盖矩阵

| 功能模块 | 单元测试 | 集成测试 | E2E | 说明 |
|---------|---------|---------|-----|------|
| 认证 (注册/登录) | ✅ | - | ✅ | JWT, bcrypt, 路由验证 |
| AI 对话 | ✅ | - | ✅ | 消息处理, 工具调用 |
| 训练记录 | ✅ | ✅ | ✅ | CRUD, 软删除 |
| 围度记录 | ✅ | ✅ | ✅ | CRUD, 软删除 |
| 健身计划 | - | - | ✅ | CRUD, 激活, 执行 |
| 动作库 | - | - | ✅ | 筛选, 详情 |
| 肌肉库 | - | - | ✅ | 层级, 详情 |
| 撤销功能 | - | ✅ | ✅ | 回滚逻辑 |
| 边界情况 | - | - | ✅ | 网络错误, 超时, 空数据 |

## E2E 测试统计

| 模块 | 测试数 | 标签 |
|------|--------|------|
| 认证 | 5 | @auth |
| AI对话 | 6 | @chat |
| 历史记录 | 4 | @records |
| 趋势分析 | 3 | @trends |
| 健身计划 | 4 | @plans |
| 动作库 | 7 | @exercises |
| 肌肉库 | 5 | @muscles |
| 个人中心 | 6 | @profile |
| 管理员-动作 | 6 | @admin |
| 管理员-肌肉 | 6 | @admin |
| 边界情况 | 6 | @edge |
| **总计** | **58** | |

## 覆盖率目标

| 层级 | 目标 |
|------|------|
| 后端单元测试 | 80%+ |
| 后端集成测试 | 核心 API 100% |
| 前端单元测试 | 70%+ |
| E2E 测试 | 核心用户流程 100% |