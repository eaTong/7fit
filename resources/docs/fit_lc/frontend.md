# 七练前端代码分析报告

## 1. 页面清单 (Page Structure)

### 用户主页面（底部 Tab 布局）
| 页面 | 路由 | 功能 |
|------|------|------|
| **Chat** | `/chat` | AI 教练对话界面 - 通过自然语言记录训练/围度 |
| **Exercises** | `/exercises` | 动作库，支持肌肉/器材/难度筛选 |
| **Profile** | `/profile` | 用户画像、徽章、数据快捷入口 |

### 次级页面（无底部 Tab）
| 页面 | 路由 | 功能 |
|------|------|------|
| **Dashboard** | `/dashboard` | 数据看板 - 最近训练、PR、关键围度 |
| **History** | `/history` | 训练记录 - 支持日期范围筛选和删除 |
| **Trends** | `/trends` | 趋势分析 - 围度趋势、训练统计、肌肉群容量图 |
| **Plans** | `/plans` | 计划列表 - 状态标签（全部/草稿/激活/完成/暂停） |
| **PlanGenerate** | `/plans/new` | AI 生成计划表单 |
| **PlanDetail** | `/plans/:id` | 计划详情 - 按星期排列动作 |
| **PlanExecute** | `/plans/:id/execute` | 每日训练执行/打卡 |
| **Measurements** | `/measurements` | 身体围度记录 |
| **Badges** | `/badges` | 成就徽章展示 |
| **Gallery** | `/gallery` | 照片墙 - 按月份组织 |
| **Calendar** | `/calendar` | 月历视图 - 展示训练/围度记录 |
| **ExerciseDetail** | `/exercises/:id` | 动作详情 - 视频、步骤、肌肉、变体 |

### 设置页面
| 页面 | 路由 | 功能 |
|------|------|------|
| **Settings** | `/settings` | 设置中心 |
| **ProfileSettings** | `/settings/profile` | 修改昵称和头像 |
| **BodySettings** | `/settings/body` | 修改身高、体重、体脂 |

### 管理页面（admin 角色）
| 页面 | 路由 | 功能 |
|------|------|------|
| **AdminExercises** | `/admin/exercises` | 动作管理 - CRUD + AI 增强详情 |
| **AdminMuscles** | `/admin/muscles` | 肌肉管理 - CRUD + AI 解剖详情 |

### 认证页面
| 页面 | 路由 | 功能 |
|------|------|------|
| **Login** | `/login` | 邮箱密码登录 |
| **Register** | `/register` | 用户注册 |

---

## 2. API 接口清单

### API 客户端 (`/api/client.ts`)
- Base URL: `/api`
- 请求拦截器：添加 `Authorization: Bearer {token}`
- 响应拦截器：401 重定向到登录页（认证接口除外）、网络错误、API 错误 toast 提示

### 认证接口 (`/api/auth.ts`)

| 方法 | 端点 | 功能 | 请求体 | 响应 |
|------|------|------|--------|------|
| POST | `/auth/register` | 用户注册 | `{email, password}` | `{token, user}` |
| POST | `/auth/login` | 登录 | `{email, password}` | `{token, user}` |
| GET | `/auth/me` | 获取当前用户 | - | `{user}` |

### 用户接口 (`/api/user.ts`)

| 方法 | 端点 | 功能 | 请求参数 | 响应 |
|------|------|------|----------|------|
| GET | `/users/me/profile` | 获取用户资料 | - | `UserProfile` |
| PUT | `/users/me/profile` | 更新资料 | `{nickname?, avatar?, height?}` | `UserProfile` |
| PUT | `/users/me/password` | 修改密码 | `{oldPassword, newPassword}` | - |
| POST | `/upload/image` | 上传头像 | `FormData(file)` | `{url}` |
| GET | `/users/me/metrics` | 获取身体指标 | `?page=1&limit=10` | `{records, total, page, limit}` |
| POST | `/users/me/metrics` | 添加指标 | `{date, weight, bodyFat?}` | `BodyMetric` |
| DELETE | `/users/me/account` | 删除账号 | `{password}` | - |
| GET | `/users/me/measurements/latest` | 获取最新围度 | - | `{measurements: {[bodyPart]: {value, date}}}` |
| GET | `/users/me/measurements/history` | 获取围度历史 | `?bodyPart=x&page=1&limit=10` | `{bodyPart, history[], pagination}` |
| GET | `/users/coach-config` | 获取教练配置 | - | `{enabled, reminderTime, maxDailyMessages}` |
| PUT | `/users/coach-config` | 更新教练配置 | `{enabled?, reminderTime?, maxDailyMessages?}` | `CoachConfig` |

### 记录接口 (`/api/records.ts`)

| 方法 | 端点 | 功能 | 请求参数 | 响应 |
|------|------|------|----------|------|
| GET | `/records/workouts` | 获取训练记录 | `?start=&end=` | `{workouts[]}` |
| GET | `/records/measurements` | 获取围度记录 | `?start=&end=` | `{measurements[]}` |
| DELETE | `/records/workout/:id` | 删除训练 | - | `{success}` |
| DELETE | `/records/measurement/:id` | 删除围度 | - | `{success}` |
| GET | `/records/stats` | 获取周统计 | - | `{weekly: WeeklyStats, changes: ChangeItem[]}` |

### 计划接口 (`/api/plans.ts`)

| 方法 | 端点 | 功能 | 请求体 | 响应 |
|------|------|------|--------|------|
| GET | `/plans` | 获取所有计划 | - | `{plans[]}` |
| GET | `/plans/:id` | 获取计划详情 | - | `{plan}` |
| POST | `/plans/generate` | AI 生成计划 | `{userProfile, exercises?}` | `{plan_id, message}` |
| PUT | `/plans/:id` | 更新计划 | `Partial<Plan>` | `{success}` |
| DELETE | `/plans/:id` | 删除计划 | - | `{success}` |
| POST | `/plans/:id/activate` | 激活计划 | - | `{success}` |
| POST | `/plans/:id/execute` | 记录执行 | `ExecutionInput` | `{id, success}` |
| GET | `/plans/:id/analysis` | 获取计划分析 | - | `ExecutionStats` |

### 动作库接口 (`/api/exercises.ts`)

| 方法 | 端点 | 功能 | 请求参数 | 响应 |
|------|------|------|----------|------|
| GET | `/exercises` | 获取动作列表 | `?category=&equipment=&difficulty=&status=` | `{exercises[]}` |
| GET | `/exercises/:id` | 获取动作详情 | - | `{exercise}` |
| POST | `/exercises` | 创建动作 | `ExerciseFormData` | `{exercise}` |
| PUT | `/exercises/:id` | 更新动作 | `Partial<ExerciseFormData>` | `{exercise}` |
| DELETE | `/exercises/:id` | 删除动作 | - | `{success}` |

### 肌肉库接口 (`/api/muscles.ts`)

| 方法 | 端点 | 功能 | 请求参数 | 响应 |
|------|------|------|----------|------|
| GET | `/muscles` | 获取所有肌肉 | - | `{muscles[]}` |
| GET | `/muscles/hierarchy` | 获取肌肉层级树 | - | `{hierarchy[]}` |
| GET | `/muscles/:id` | 获取肌肉详情 | - | `{muscle}` |
| POST | `/muscles` | 创建肌肉 | `{name, group, parentId?, ...}` | `{muscle}` |
| PUT | `/muscles/:id` | 更新肌肉 | `Partial<Muscle>` | `{muscle}` |
| DELETE | `/muscles/:id` | 删除肌肉 | - | `{success}` |

### 对话接口 (`/api/chat.ts`)

| 方法 | 端点 | 功能 | 请求体 | 响应 |
|------|------|------|--------|------|
| POST | `/chat/message` | 发送消息 | `{message, historyMessages[], imageUrls[]}` | `{reply, savedData?}` |
| GET | `/chat/messages` | 获取最近消息 | `?limit=20` | `{messages[]}` |

### 相册接口 (`/api/album.ts`)

| 方法 | 端点 | 功能 | 请求参数 | 响应 |
|------|------|------|----------|------|
| GET | `/album/photos` | 获取照片 | `?year=&month=` | `PhotosByMonth` 或 `AlbumPhoto[]` |
| DELETE | `/album/photos/:id` | 删除照片 | - | - |

### 成就接口 (`/api/achievement.ts`)

| 方法 | 端点 | 功能 | 请求参数 | 响应 |
|------|------|------|----------|------|
| GET | `/achievements/personal-records` | 获取个人纪录 | - | `{personalRecords[]}` |
| GET | `/achievements/personal-records/top` | 获取 Top PR | `?limit=10` | `{personalRecords[]}` |
| GET | `/achievements/badges` | 获取徽章 | - | `{badges[]}` |
| GET | `/achievements/milestones` | 获取里程碑 | - | `{milestones[]}` |
| GET | `/achievements/stats` | 获取成就统计 | - | `{stats}` |
| POST | `/achievements/check` | 检查成就 | `{type, data?}` | `{badges[], milestones[]}` |
| GET | `/achievements/muscle-volume` | 获取肌肉容量 | `?start=&end=` | `{muscleGroups[]}` |

### 管理接口 (`/api/admin.ts`)

| 方法 | 端点 | 功能 | 请求体 | 响应 |
|------|------|------|--------|------|
| GET | `/admin/exercises` | 列出动作 | - | `Exercise[]` |
| POST | `/admin/exercises` | 创建动作 | `ExerciseFormData` | `{exercise}` |
| PUT | `/admin/exercises/:id` | 更新动作 | `ExerciseFormData` | `{exercise}` |
| DELETE | `/admin/exercises/:id` | 删除动作 | - | - |
| PATCH | `/admin/exercises/:id/publish` | 发布动作 | - | - |
| POST | `/admin/exercises/generate` | AI 生成动作 | `{name, category, equipment, difficulty, targetMuscles?}` | `details` |
| GET | `/admin/exercises/:id/variants` | 获取变体 | - | `{asSource[], asTarget[]}` |
| POST | `/admin/exercises/:id/variants` | 创建变体 | `{variantId, variantType, differenceNotes?}` | - |
| PUT | `/admin/exercises/variants/:id` | 更新变体 | `{variantType?, differenceNotes?}` | - |
| DELETE | `/admin/exercises/variants/:id` | 删除变体 | - | - |
| GET | `/admin/muscles` | 列出肌肉 | - | `Muscle[]` |
| POST | `/admin/muscles` | 创建肌肉 | `Omit<Muscle, 'id'>` | `{muscle}` |
| PUT | `/admin/muscles/:id` | 更新肌肉 | `Partial<Muscle>` | `{muscle}` |
| DELETE | `/admin/muscles/:id` | 删除肌肉 | - | - |
| POST | `/admin/muscles/generate` | AI 生成肌肉 | `{name, group, parentMuscleName?}` | `details` |

### 语音接口 (`/api/voice.ts`)

| 方法 | 端点 | 功能 | 请求体 | 响应 |
|------|------|------|--------|------|
| POST | `/voice/transcribe` | 语音转文字 | `FormData(audio)` | `{success, text?, error?}` |

### 上传接口 (`/api/upload.ts`)

| 方法 | 端点 | 功能 | 请求体 | 响应 |
|------|------|------|--------|------|
| POST | `/upload/image` | 上传图片 | `FormData(file)` | `{url}` |

---

## 3. Store 状态管理

### useAuthStore (`/stores/authStore.ts`)

```typescript
interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  coachConfig: CoachConfig | null;

  // 方法
  login(email, password): Promise<void>
  register(email, password): Promise<void>
  logout(): void
  checkAuth(): Promise<void>
  fetchCoachConfig(): Promise<void>
  updateCoachConfig(config): Promise<void>
}
```

### useChatStore (`/stores/chatStore.ts`)

```typescript
interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  revokedMessageIds: Set<string>;
  lastUserMessageContent: string | null;

  // 方法
  sendMessage(content, historyMessages?, imageUrls?): Promise<void>
  loadLatestMessages(limit?): Promise<void>
  clearMessages(): void
  removeLastSavedData(): SavedData | undefined
  markMessageAsRevoked(messageId): string | null
}
```

### useRecordsStore (`/stores/recordsStore.ts`)

```typescript
interface RecordsState {
  workouts: Workout[];
  recentWorkouts: Workout[];
  latestMeasurement: Measurement | null;
  measurements: Measurement[];
  isLoading: boolean;
  error: string | null;

  // 方法
  fetchWorkouts(start?, end?): Promise<void>
  fetchMeasurements(start?, end?): Promise<void>
  deleteWorkout(id): Promise<void>
  deleteMeasurement(id): Promise<void>
}
```

### usePlanStore (`/stores/planStore.ts`)

```typescript
interface PlanState {
  plans: Plan[];
  currentPlan: Plan | null;
  isLoading: boolean;
  error: string | null;
  analysis: ExecutionStats | null;

  // 方法
  fetchPlans(): Promise<void>
  fetchPlan(id): Promise<void>
  generatePlan(userProfile, exercises): Promise<{plan_id, message}>
  updatePlan(id, updates): Promise<void>
  deletePlan(id): Promise<void>
  activatePlan(id): Promise<void>
  recordExecution(planId, execution): Promise<void>
  fetchAnalysis(planId): Promise<void>
}
```

### useExerciseStore (`/stores/exerciseStore.ts`)

```typescript
interface ExerciseState {
  exercises: Exercise[];
  currentExercise: Exercise | null;
  isLoading: boolean;
  error: string | null;
  filters: { category, equipment, difficulty, status };

  // 方法
  fetchExercises(): Promise<void>
  fetchExercise(id): Promise<void>
  createExercise(data): Promise<Exercise>
  updateExercise(id, data): Promise<void>
  deleteExercise(id): Promise<void>
  setFilters(filters): void
}
```

### useMuscleStore (`/stores/muscleStore.ts`)

```typescript
interface MuscleState {
  muscles: Muscle[];
  hierarchy: MuscleGroup[];
  isLoading: boolean;
  error: string | null;

  // 方法
  fetchMuscles(): Promise<void>
  fetchHierarchy(): Promise<void>
  createMuscle(data): Promise<Muscle>
  updateMuscle(id, data): Promise<void>
  deleteMuscle(id): Promise<void>
}
```

### useAchievementStore (`/stores/achievementStore.ts`)

```typescript
interface AchievementState {
  personalRecords: PersonalRecord[];
  badges: Badge[];
  milestones: Milestone[];
  stats: Stats;
  newAchievements: { badges, milestones };
  isLoading: boolean;
  error: string | null;

  // 方法
  fetchPersonalRecords(): Promise<void>
  fetchBadges(): Promise<void>
  fetchMilestones(): Promise<void>
  fetchStats(): Promise<void>
  checkAchievements(type, data?): Promise<void>
  clearNewAchievements(): void
}
```

### useAlbumStore (`/stores/albumStore.ts`)

```typescript
interface AlbumState {
  photosByMonth: PhotosByMonth;
  loading: boolean;
  error: string | null;
  viewerPhoto: AlbumPhoto | null;

  // 方法
  loadPhotos(): Promise<void>
  deletePhoto(id): Promise<void>
  openViewer(photo): void
  closeViewer(): void
}
```

### useToastStore (`/stores/toastStore.ts`)

```typescript
interface ToastState {
  toasts: Toast[];

  // 方法
  addToast(message, type, status?): void
  removeToast(id): void
}
```

### useTriggerStore (`/stores/triggerStore.ts`)

```typescript
interface TriggerState {
  history: TriggerEvent[];
  isLoading: boolean;
  error: string | null;

  // 方法
  fetchHistory(limit?): Promise<void>
  recordTrigger(triggerType, triggerKey, payload?): Promise<boolean>
  shouldTrigger(triggerType, triggerKey): Promise<boolean>
  deleteTrigger(id): Promise<void>
}
```

---

## 4. 组件关系图

```
App.tsx
├── BrowserRouter
│   ├── Routes
│   │   ├── /login → Login
│   │   ├── /register → Register
│   │   ├── UserLayout (认证包装)
│   │   │   ├── BottomTabLayout (移动端底部导航布局)
│   │   │   │   ├── Header
│   │   │   │   ├── Outlet
│   │   │   │   │   ├── /chat → Chat
│   │   │   │   │   ├── /exercises → Exercises
│   │   │   │   │   └── /profile → Profile
│   │   │   │   └── BottomTabBar
│   │   │   ├── SecondaryPageLayout (无底部 Tab)
│   │   │   │   └── Outlet
│   │   │   │       ├── /history → History
│   │   │   │       ├── /trends → Trends
│   │   │   │       ├── /plans → Plans
│   │   │   │       ├── /plans/new → PlanGenerate
│   │   │   │       ├── /plans/:id → PlanDetail
│   │   │   │       ├── /plans/:id/execute → PlanExecute
│   │   │   │       ├── /gallery → Gallery
│   │   │   │       ├── /exercises/:id → ExerciseDetail
│   │   │   │       ├── /measurements → Measurements
│   │   │   │       └── /badges → Badges
│   │   │   ├── SettingsLayout
│   │   │   │   └── Outlet
│   │   │   │       ├── /settings → Settings
│   │   │   │       ├── /settings/profile → ProfileSettings
│   │   │   │       ├── /settings/body → BodySettings
│   │   │   │       └── /calendar → Calendar
│   │   │   └── AdminLayout (admin 角色校验)
│   │   │       ├── SidebarLayout
│   │   │       │   ├── SidebarNav
│   │   │       │   └── Outlet
│   │   │       │       ├── /admin/exercises → AdminExercises
│   │   │       │       └── /admin/muscles → AdminMuscles
│   │   └── ErrorBoundary
│   ├── ToastContainer → Toast
│   └── AppTipBanner
```

### 主要组件层级

```
Chat
├── ChatMessage (支持 savedData 撤销)
├── ChatInput
├── VoiceRecordButton
└── FirstTimeCelebration

Exercises
├── (左侧) Muscle 筛选列表
└── (右侧) 动作卡片网格

PlanDetail
└── PlanExecute (每日训练执行)

Dashboard
├── StatCard
├── RecentWorkoutItem
├── KeyMeasurementsPanel
├── PRCard
└── CumulativeStatsCard

Calendar
├── CalendarGrid
└── CalendarDetail

Gallery
└── PhotoViewer (模态框)

Measurements
├── MeasurementCard
└── MeasurementHistoryModal

Trends
├── AIInsightSummary
├── TrendChart
├── MuscleGroupChart
└── DateRangePicker
```

---

## 5. 类型定义 (`/types/index.ts`)

### 核心类型

```typescript
interface User {
  id: number;
  email: string;
  roles?: string[];
}

interface AuthResponse {
  token: string;
  user: User;
}

interface WorkoutSet {
  setNumber: number;
  reps: number;
  weight: number;
}

interface WorkoutExercise {
  id: number;
  exerciseName: string;
  duration?: number;
  distance?: number;
  sets: WorkoutSet[];
}

interface Workout {
  id: number;
  date: string;
  exercises: WorkoutExercise[];
}

type BodyPart = 'chest' | 'waist' | 'hips' | 'biceps' | 'thighs' | 'calves' | 'weight' | 'bodyFat' | 'other';

interface MeasurementItem {
  bodyPart: BodyPart;
  value: number;
}

interface Measurement {
  id: number;
  date: string;
  items: MeasurementItem[];
}

type ToolType = 'workout' | 'measurement' | 'plan' | 'adjustment' | 'query' | 'analysis';

interface SavedData {
  type: ToolType;
  id?: number;
  meta?: QueryMeta | AnalysisMeta;
}

interface PlanExercise {
  id?: number;
  plan_id?: number;
  day_of_week: number;
  exercise_name: string;
  sets: number;
  reps: string;
  weight?: number;
  duration?: number;
  rest_seconds?: number;
  order_index: number;
}

interface Plan {
  id: number;
  user_id: number;
  name: string;
  goal: 'bulk' | 'cut' | 'maintain';
  frequency: number;
  experience: 'beginner' | 'intermediate' | 'advanced';
  equipment: string;
  conditions?: string;
  body_weight?: number;
  body_fat?: number;
  height?: number;
  duration_weeks: number;
  status: 'draft' | 'active' | 'completed' | 'paused';
  exercises?: PlanExercise[];
  created_at: string;
}

interface UserProfile {
  name?: string;
  goal: 'bulk' | 'cut' | 'maintain';
  frequency: number;
  experience: 'beginner' | 'intermediate' | 'advanced';
  equipment: string;
  conditions?: string;
  body_weight: number;
  body_fat?: number;
  height: number;
  duration_weeks: number;
}

interface ExecutionInput {
  plan_exercise_id: number;
  scheduled_date: string;
  completed_reps?: number;
  completed_weight?: number;
  status: 'completed' | 'skipped';
  notes?: string;
}

interface ExecutionStats {
  total: number;
  completed: number;
  skipped: number;
  pending: number;
  completionRate: number;
  suggestions: string[];
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  imageUrls?: string[];
  timestamp: Date;
  savedData?: SavedData;
  isFromCoach?: boolean;
  coachMessageType?: 'reminder' | 'achievement' | 'encouragement' | 'checkin';
}

interface Muscle {
  id: number;
  name: string;
  group: string;
  parent_muscle_id?: number;
}

type MuscleRole = 'agonist' | 'synergist' | 'antagonist' | 'stabilizer';

interface Exercise {
  id?: number;
  name: string;
  category: ExerciseCategory;
  equipment: Equipment;
  difficulty: Difficulty;
  description?: string;
  steps?: string;
  safetyNotes?: string;
  commonMistakes?: string;
  adjustmentNotes?: string;
  exerciseType?: ExerciseType;
  variantType?: VariantType;
  status: ExerciseStatus;
  muscles?: ExerciseMuscle[];
}

type ExerciseCategory = 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core';
type Equipment = 'barbell' | 'dumbbell' | 'cable' | 'machine' | 'bodyweight' | 'kettlebell' | 'bands' | 'other';
type Difficulty = 'beginner' | 'intermediate' | 'advanced';
type ExerciseType = 'compound' | 'isolation';
type VariantType = 'equipment' | 'difficulty' | 'posture';
type ExerciseStatus = 'draft' | 'published';
```

---

## 7. 页面布局详解

### 7.1 布局组件架构

前端采用 **嵌套路由 + 组合模式** 实现布局复用：

```
App.tsx (BrowserRouter)
├── Routes
│   ├── 公开路由 (无需布局)
│   │   ├── /login → Login
│   │   └── /register → Register
│   │
│   ├── UserLayout (认证包装)
│   │   ├── 嵌套布局A: BottomTabLayout
│   │   │   └── 子页面: /chat, /exercises, /profile
│   │   │
│   │   ├── 嵌套布局B: SecondaryPageLayout
│   │   │   └── 子页面: /history, /trends, /plans, /plans/new, /plans/:id, /plans/:id/execute,
│   │   │                          /gallery, /exercises/:id, /measurements, /badges
│   │   │
│   │   └── 嵌套布局C: SettingsLayout
│   │       └── 子页面: /settings, /settings/profile, /settings/body, /calendar
│   │
│   └── AdminLayout (admin 角色校验)
│       └── SidebarLayout
│           └── /admin/exercises, /admin/muscles
```

### 7.2 布局组件说明

| 布局组件 | 文件 | 结构 | 适用场景 |
|----------|------|------|----------|
| **BottomTabLayout** | `layouts/BottomTabLayout.tsx` | Header + Outlet + BottomTabBar | 主页面（移动端底部导航） |
| **SecondaryPageLayout** | `layouts/SecondaryPageLayout.tsx` | 返回按钮 + Outlet | 次级页面（无底部 Tab） |
| **SettingsLayout** | `layouts/SettingsLayout.tsx` | 返回按钮 + Logo + Outlet | 设置/日历页面 |
| **SidebarLayout** | `layouts/SidebarLayout.tsx` | 固定侧边栏 + 主内容区 | 管理后台 |
| **SubPageLayout** | `layouts/SubPageLayout.tsx` | 返回按钮 + 标题 + 内容 | 通用子页面包装 |

### 7.3 各页面布局图与逻辑

---

#### Login (`/login`)

```
┌─────────────────────────────────┐
│           空 header             │
├─────────────────────────────────┤
│                                 │
│         ┌─────────────┐         │
│         │  FITLC      │         │
│         │  Logo       │         │
│         └─────────────┘         │
│                                 │
│    ┌───────────────────────┐    │
│    │  邮箱输入              │    │
│    └───────────────────────┘    │
│                                 │
│    ┌───────────────────────┐    │
│    │  密码输入              │    │
│    └───────────────────────┘    │
│                                 │
│    ┌───────────────────────┐    │
│    │      登录按钮          │    │
│    └───────────────────────┘    │
│                                 │
│      还没有账号？注册          │
│                                 │
└─────────────────────────────────┘

布局逻辑:
- 无布局包装 (公开路由)
- 单列居中表单
- useAuthStore.login() 提交
```

---

#### Register (`/register`)

```
┌─────────────────────────────────┐
│           空 header             │
├─────────────────────────────────┤
│                                 │
│         ┌─────────────┐         │
│         │  FITLC      │         │
│         │  Logo       │         │
│         └─────────────┘         │
│                                 │
│    ┌───────────────────────┐    │
│    │  邮箱输入              │    │
│    └───────────────────────┘    │
│                                 │
│    ┌───────────────────────┐    │
│    │  密码输入              │    │
│    └───────────────────────┘    │
│                                 │
│    ┌───────────────────────┐    │
│    │  确认密码              │    │
│    └───────────────────────┘    │
│                                 │
│    ┌───────────────────────┐    │
│    │      注册按钮          │    │
│    └───────────────────────┘    │
│                                 │
│      已有账号？登录            │
│                                 │
└─────────────────────────────────┘

布局逻辑:
- 无布局包装 (公开路由)
- 与 Login 结构类似，多一个确认密码字段
- useAuthStore.register() 提交
```

---

#### Chat (`/chat`) - BottomTabLayout

```
┌─────────────────────────────────┐
│ Header: FITLC Logo    user@email│ ← 固定顶部
├─────────────────────────────────┤
│                                 │
│  ┌───────────────────────────┐  │
│  │ 🤖 AI: 欢迎使用 FitLC...  │  │ ← 可滚动消息列表
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 👤 用户: 今天练了胸部     │  │
│  │    ✓ 已保存训练记录       │  │ ← savedData 撤销按钮
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 🤖 AI: 很棒！继续加油...  │  │
│  └───────────────────────────┘  │
│                                 │
│  ...                            │
│                                 │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │ ← 输入区域
│ │ 输入框...          🎤 📷   │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│  🏠 首页  │  💪 动作  │  👤 我的  │ ← 固定底部 Tab
└─────────────────────────────────┘

布局逻辑:
- BottomTabLayout 包装
- 消息列表: flex-1 可滚动，ChatMessage 组件
- 输入区: ChatInput + VoiceRecordButton
- 首次使用: FirstTimeCelebration 弹窗
- 状态: useChatStore (messages, isLoading)
- 底部 pb-16 避免 Tab 遮挡
```

---

#### Exercises (`/exercises`) - BottomTabLayout

```
┌─────────────────────────────────┐
│ Header: FITLC Logo    user@email│
├─────────────────────────────────┤
│ ┌─────────┬───────────────────┐ │
│ │ 肌肉筛选│  🔍 搜索          │ │ ← 过滤器栏
│ │         │  器材 ▼ 难度 ▼   │ │
│ ├─────────┼───────────────────┤ │
│ │ 胸部     │ ┌─────┐ ┌─────┐  │ │
│ │ ├ 上胸   │ │动作1│ │动作2│  │ │ ← 动作卡片网格
│ │ ├ 中胸   │ └─────┘ └─────┘  │ │
│ │ └ 下胸   │ ┌─────┐ ┌─────┐  │ │
│ │背部      │ │动作3│ │动作4│  │ │
│ │ ├ 背阔   │ └─────┘ └─────┘  │ │
│ │ └ ...    │                   │ │
│ └─────────┴───────────────────┘ │
├─────────────────────────────────┤
│  🏠 首页  │  💪 动作  │  👤 我的  │
└─────────────────────────────────┘

布局逻辑:
- BottomTabLayout
- 左侧: MuscleFilterList (可折叠肌肉层级)
- 右侧: FilterBar (搜索框、器材筛选、难度筛选) + ExerciseGrid
- 状态: useExerciseStore (exercises, filters), useMuscleStore (hierarchy)
- 点击动作卡片 → /exercises/:id
```

---

#### Profile (`/profile`) - BottomTabLayout

```
┌─────────────────────────────────┐
│ Header: FITLC Logo    user@email│
├─────────────────────────────────┤
│                                 │
│       ┌────────┐               │
│       │ 头像   │  昵称         │ ← 用户信息行
│       │        │  邮箱         │
│       └────────┘               │
│                                 │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐  │ ← 统计卡片行
│  │12  │ │3.2T│ │5天 │ │8   │  │
│  │训练 │ │容量│ │连续│ │徽章│  │
│  └────┘ └────┘ └────┘ └────┘  │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 🏋️ 体重: 75kg   更新于5天前│ │ ← 身体指标
│  │ 📏 体脂: 18%             │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌───────┐ ┌───────┐ ┌───────┐│ ← 快捷入口网格
│  │训练记录│ │围度记录│ │训练计划││
│  └───────┘ └───────┘ └───────┘│
│  ┌───────┐ ┌───────┐ ┌───────┐│
│  │照片墙 │ │成就徽章│ │动作库 ││
│  └───────┘ └───────┘ └───────┘│
│                                 │
├─────────────────────────────────┤
│  🏠 首页  │  💪 动作  │  👤 我的  │
└─────────────────────────────────┘

布局逻辑:
- BottomTabLayout
- 数据来源: useAuthStore.user, useAchievementStore.stats, useRecordsStore.latestMeasurement
- useEffect 加载: loadStats(), fetchLatestMeasurement()
- 快捷入口点击 → 对应页面
```

---

#### Dashboard (`/dashboard`) - SecondaryPageLayout

```
┌─────────────────────────────────┐
│ ← 返回            空              │ ← SecondaryPageLayout Header
├─────────────────────────────────┤
│                                 │
│  欢迎回来，用户名                 │
│                                 │
│  ┌─────────────────────────┐   │
│  │  🔥 最近训练              │   │ ← 卡片
│  │  胸部 + 肱二头肌          │   │
│  │  2026/05/01 14:30        │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌────────┐ ┌────────┐         │
│  │ 本周   │ │ 较上周  │         │ ← 统计卡
│  │ 3次    │ │ +1次    │         │
│  └────────┘ └────────┘         │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 📊 个人纪录 (PR)         │   │
│  │ 卧推: 100kg × 5         │   │
│  │ 深蹲: 140kg × 3         │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 📏 关键围度             │   │
│  │ 胸围: 102cm  腰围: 78cm │   │
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘

布局逻辑:
- SecondaryPageLayout (返回按钮)
- useEffect → loadProfile(), loadStats(), fetchRecentWorkouts(), fetchLatestMeasurement()
- StatCard 组件展示统计数据
- RecentWorkoutItem 展示最近训练
- KeyMeasurementsPanel 展示最新围度
```

---

#### History (`/history`) - SecondaryPageLayout

```
┌─────────────────────────────────┐
│ ← 返回            空              │
├─────────────────────────────────┤
│                                 │
│  [全部] [2026年5月] [筛选]       │ ← TabSwitcher + DateRangePicker
│                                 │
│  ┌─────────────────────────┐   │
│  │ 🏋️ 胸部 + 肱二头肌       │   │
│  │ 2026/05/01 14:30        │   │ ← WorkoutRecordCard
│  │ [上胸 4×12] [中胸 4×10]  │   │
│  │              [🗑️ 删除]  │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 🏋️ 背部 + 肱三头肌       │   │
│  │ 2026/04/28 10:00        │   │
│  │ [高位下拉 4×12] ...     │   │
│  │              [🗑️ 删除]  │
│  └─────────────────────────┘   │
│                                 │
│  ...                            │
│                                 │
└─────────────────────────────────┘

布局逻辑:
- SecondaryPageLayout
- 状态: useRecordsStore.workouts
- useEffect: fetchWorkouts(start, end)
- TabSwitcher 切换日期范围
- 删除按钮: ConfirmDialog 确认 → deleteWorkout(id)
```

---

#### Trends (`/trends`) - SecondaryPageLayout

```
┌─────────────────────────────────┐
│ ← 返回            空              │
├─────────────────────────────────┤
│                                 │
│  ┌─────────────────────────┐   │
│  │ 💡 AI 洞察摘要          │   │ ← AIInsightSummary
│  │ 您的胸部训练有所进步... │   │
│  └─────────────────────────┘   │
│                                 │
│  [围度] [训练] [肌肉群]         │ ← Tab 切换图表类型
│                                 │
│  ┌─────────────────────────┐   │
│  │      📈 围度趋势图       │   │ ← Recharts LineChart
│  │   105├──────────        │   │
│  │   100├─────●────        │   │
│  │    95├─●────────        │   │
│  │      └───────→          │   │
│  │       4月 5月 6月       │   │
│  └─────────────────────────┘   │
│                                 │
│  日期范围选择                    │
│  [2026-03-01] ～ [2026-05-01]   │
│                                 │
└─────────────────────────────────┘

布局逻辑:
- SecondaryPageLayout
- TabSwitcher 切换: measurements | workouts | muscles
- AIInsightSummary: AI 生成洞察文字
- TrendChart / MuscleGroupChart: Recharts 图表
- DateRangePicker 选择日期范围
- useRecordsStore / useAchievementStore 获取数据
```

---

#### Plans (`/plans`) - SecondaryPageLayout

```
┌─────────────────────────────────┐
│ ← 返回            [+] 创建       │ ← Header + 新建按钮
├─────────────────────────────────┤
│                                 │
│  [全部] [草稿] [激活] [完成] [暂停]│ ← TabSwitcher 状态筛选
│                                 │
│  ┌─────────────────────────┐   │
│  │ 📋 增肌计划              │   │
│  │ 每周4次 · 12周           │   │ ← PlanCard
│  │ 进度: 60% (18/30天)      │   │
│  │ [查看] [执行]            │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 📋 减脂计划              │   │
│  │ 每周3次 · 8周            │   │
│  │ 状态: 草稿               │   │
│  │ [编辑] [删除]           │   │
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘

布局逻辑:
- SecondaryPageLayout
- usePlanStore.plans 状态
- useEffect → fetchPlans()
- TabSwitcher 按 status 筛选
- PlanCard 展示: name, frequency, duration, progress
- 按钮: 查看 → /plans/:id, 执行 → /plans/:id/execute
- 新建 → /plans/new
- ConfirmDialog 确认删除
```

---

#### PlanGenerate (`/plans/new`) - SecondaryPageLayout

```
┌─────────────────────────────────┐
│ ← 返回            空              │
├─────────────────────────────────┤
│                                 │
│  AI 生成训练计划                 │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 目标:                   │   │
│  │ ○ 增肌  ○ 减脂  ○ 保持  │   │ ← RadioGroup
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 训练频率: [每周 3-5 次] │   │ ← NumberInput
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 经验水平:               │   │
│  │ ▼ 初学者                │   │ ← Select
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 可用器材:               │   │
│  │ □ 哑铃 □ 杠铃 □ 拉力架  │   │ ← CheckboxGroup
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 计划周期: [12] 周        │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │     生成计划              │   │ ← Primary Button
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘

布局逻辑:
- SecondaryPageLayout
- PlanForm 组件: 收集用户健身目标/经验/器材等信息
- 本地 useState 管理表单数据
- 提交 → usePlanStore.generatePlan(userProfile)
- 成功后跳转到 /plans/:plan_id
```

---

#### PlanDetail (`/plans/:id`) - SecondaryPageLayout

```
┌─────────────────────────────────┐
│ ← 返回      [编辑] [删除]        │
├─────────────────────────────────┤
│                                 │
│  增肌计划                        │
│  每周4次 · 12周 · 初学者        │
│  状态: 🔵 激活                   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 周一: 胸部 + 肱二头肌    │   │
│  │  ├ 卧推 4×10 @ 60kg     │   │ ← PlanExerciseCard
│  │  ├ 上胸 4×12            │   │
│  │  └ 哑铃弯举 3×12        │   │
│  ├─────────────────────────┤   │
│  │ 周三: 背部 + 肱三头肌    │   │
│  │  ├ ...                  │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │     [激活计划]           │   │ ← 状态为草稿时显示
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │     [开始今日训练]       │   │ ← 状态为激活时显示
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘

布局逻辑:
- SecondaryPageLayout
- useParams 获取 planId
- useEffect → fetchPlan(id)
- usePlanStore.currentPlan 展示
- 动作按 day_of_week 分组显示
- PlanExecute 是独立页面，不是嵌套
```

---

#### PlanExecute (`/plans/:id/execute`) - SecondaryPageLayout

```
┌─────────────────────────────────┐
│ ← 返回     周一训练              │
├─────────────────────────────────┤
│                                 │
│  今日动作: 3 个                 │
│                                 │
│  ┌─────────────────────────┐   │
│  │ ☑ 卧推                  │   │
│  │ 计划: 4×10 @ 60kg       │   │ ← 可勾选卡片
│  │ 完成: [___] kg × [___]  │   │ ← 输入实际重量/次数
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ ☐ 上胸哑铃飞鸟          │   │
│  │ 计划: 3×12             │   │
│  │ 完成: [___] kg × [___]  │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ ☐ 哑铃弯举              │   │
│  │ 计划: 3×12             │   │
│  │ 完成: [___] kg × [___]  │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │      提交打卡            │   │
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘

布局逻辑:
- SecondaryPageLayout
- useParams 获取 planId
- useEffect → fetchPlan(id) + 获取今日应该执行的 exercises
- 本地 useState 管理每个动作的完成状态
- 提交 → usePlanStore.recordExecution(planId, execution)
- 执行成功 → toast 提示 + 跳转 /plans/:id
```

---

#### ExerciseDetail (`/exercises/:id`) - SecondaryPageLayout

```
┌─────────────────────────────────┐
│ ← 返回            空              │
├─────────────────────────────────┤
│                                 │
│  ┌─────────────────────────┐   │
│  │      视频区域            │   │ ← Video 组件或图片
│  │      [播放按钮]          │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 卧推 (Barbell Bench     │   │
│  │ Press)                  │   │
│  │                          │   │
│  │ 类别: 胸部               │   │
│  │ 器材: 杠铃               │   │
│  │ 难度: 中级               │   │
│  │ 类型: 复合动作           │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 💪 目标肌肉             │   │
│  │ 主肌: 胸大肌 (上/中/下) │   │
│  │ 协同: 肱三头肌、三角肌  │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 📝 动作步骤             │   │
│  │ 1. 躺在平板凳上...      │   │
│  │ 2. 握距略宽于肩...      │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ ⚠️ 安全提示             │   │
│  │ • 确保握距正确          │   │
│  │ • 保护人员可协助        │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 🔄 变体动作             │   │
│  │ • 哑铃卧推              │   │
│  │ • 上斜卧推              │   │
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘

布局逻辑:
- SecondaryPageLayout
- useParams 获取 exerciseId
- useEffect → fetchExercise(id)
- useExerciseStore.currentExercise 展示
- 视频/图片区 + InfoCard + MuscleSection + StepsSection + SafetySection + VariantsSection
```

---

#### Measurements (`/measurements`) - SecondaryPageLayout

```
┌─────────────────────────────────┐
│ ← 返回            空              │
├─────────────────────────────────┤
│                                 │
│  身体围度记录                    │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 上身围度               │   │
│  │  ┌─────┐ ┌─────┐       │   │
│  │  │胸围 │ │腰围 │       │   │ ← Card 布局
│  │  │102cm│ │78cm │       │   │
│  │  └─────┘ └─────┘       │   │
│  │  ┌─────┐               │   │
│  │  │臀围 │               │   │
│  │  │95cm │               │   │
│  │  └─────┘               │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 臂部围度               │   │
│  │  ┌─────┐ ┌─────┐       │   │
│  │  │左臂 │ │右臂 │       │   │
│  │  │32cm │ │32cm │       │   │
│  │  └─────┘ └─────┘       │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 腿部围度               │   │
│  │  ┌─────┐ ┌─────┐       │   │
│  │  │大腿 │ │小腿 │       │   │
│  │  │58cm │ │38cm │       │   │
│  │  └─────┘ └─────┘       │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │    添加新记录            │   │ ← Primary Button
│  └─────────────────────────┘   │
│                                 │
│  [历史记录 Modal]               │
│  ┌─────────────────────────┐   │
│  │ 2026-05-01: 胸102 腰78  │   │
│  │ 2026-04-25: 胸101 腰79  │   │ ← MeasurementHistoryModal
│  │ ...                      │   │
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘

布局逻辑:
- SecondaryPageLayout
- useRecordsStore.latestMeasurement 展示最新围度
- 围度按 bodyPart 分组显示 (上身/臂部/腿部)
- 点击 "添加新记录" → 弹出表单 (或跳转聊天页面记录)
- 点击卡片 → MeasurementHistoryModal 显示历史
```

---

#### Badges (`/badges`) - SecondaryPageLayout

```
┌─────────────────────────────────┐
│ ← 返回            空              │
├─────────────────────────────────┤
│                                 │
│  成就徽章                        │
│                                 │
│  ┌─────────────────────────┐   │
│  │  🏆 已获得 (8)           │   │
│  │ ┌────┐ ┌────┐ ┌────┐   │   │
│  │ │🏅  │ │🏅  │ │🏅  │   │ │ ← BadgeGrid
│  │ │初学者│ │5次  │ │10次 │   │ │
│  │ └────┘ └────┘ └────┘   │   │
│  │                        │   │
│  │ ┌────┐ ┌────┐ ┌────┐   │   │
│  │ │... │ │... │ │... │   │   │
│  │ └────┘ └────┘ └────┘   │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 🔒 未解锁 (12)           │   │
│  │ ┌────┐ ┌────┐ ┌────┐   │   │
│  │ │ ？  │ │ ？  │ │ ？  │   │ │ ← 灰色遮罩
│  │ │??? │ │??? │ │??? │   │   │
│  │ └────┘ └────┘ └────┘   │   │
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘

布局逻辑:
- SecondaryPageLayout
- useAchievementStore.badges 状态
- useEffect → fetchBadges()
- BadgeGrid 组件: 已获得(彩色) / 未解锁(灰色?)
- 徽章详情可点击查看
```

---

#### Gallery (`/gallery`) - SecondaryPageLayout

```
┌─────────────────────────────────┐
│ ← 返回            空              │
├─────────────────────────────────┤
│                                 │
│  照片墙         [按月份 ▾]        │ ← 年月筛选
│                                 │
│  2026年5月                       │
│  ┌────┐ ┌────┐ ┌────┐          │
│  │ 📷 │ │ 📷 │ │ 📷 │          │ ← PhotoGrid
│  └────┘ └────┘ └────┘          │
│  ┌────┐ ┌────┐                  │
│  │ 📷 │ │ 📷 │                  │
│  └────┘ └────┘                  │
│                                 │
│  2026年4月                       │
│  ┌────┐ ┌────┐ ┌────┐          │
│  │ 📷 │ │ 📷 │ │ 📷 │          │
│  └────┘ └────┘ └────┘          │
│                                 │
└─────────────────────────────────┘

布局逻辑:
- SecondaryPageLayout
- useAlbumStore.photosByMonth 状态
- useRef 防止重复加载 (loaded.current)
- PhotoGrid 按月份分组显示
- 点击图片 → PhotoViewer 模态框
- PhotoViewer: 大图预览 + 删除按钮
```

---

#### Calendar (`/calendar`) - SettingsLayout

```
┌─────────────────────────────────┐
│ ← 返回   FITLC Logo → /profile  │ ← SettingsLayout Header
├─────────────────────────────────┤
│                                 │
│      [<] 2026年5月 [>]          │ ← 月份导航
│                                 │
│  日  一  二  三  四  五  六     │ ← CalendarGrid
│ ┌──┬──┬──┬──┬──┬──┬──┐        │
│ │  │   │   │   │ 1 │ 2 │ 3 │   │
│ ├──┼──┼──┼──┼──┼──┼──┼──┤        │
│ │ 4│ 5│ 6│ 7│ 8│ 9 │10 │        │ ← 有记录的日期高亮
│ ├──┼──┼──┼──┼──┼──┼──┼──┤        │
│ │11│12│13│14│15│16│17 │        │
│ ...                             │
│ └──┴──┴──┴──┴──┴──┴──┘        │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 📋 5月1日               │   │ ← CalendarDetail
│  │ 🏋️ 胸部 + 肱二头肌      │   │   显示选中日期详情
│  │ 📏 围度更新: 胸102 腰78 │   │
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘

布局逻辑:
- SettingsLayout
- 本地 useState 管理当前月份
- CalendarGrid 展示月历，带训练/围度标记
- CalendarDetail 显示选中日期的运动和围度记录
- 点击日期 → 更新 CalendarDetail
```

---

#### Settings (`/settings`) - SettingsLayout

```
┌─────────────────────────────────┐
│ ← 返回   FITLC Logo → /profile  │
├─────────────────────────────────┤
│                                 │
│  设置                            │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 👤 个人资料              │   │
│  │ 修改昵称、头像            │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ ⚖️ 身体数据              │   │
│  │ 身高、体重、体脂          │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 📅 日历                  │   │
│  │ 查看训练日历              │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 🔔 AI 教练设置           │   │
│  │ 提醒时间、最大消息数     │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 🚪 退出登录              │   │
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘

布局逻辑:
- SettingsLayout
- Link 列表跳转到子页面
- useNavigate 编程导航
- "退出登录" → useAuthStore.logout() → /login
```

---

#### ProfileSettings (`/settings/profile`) - SettingsLayout 嵌套

```
┌─────────────────────────────────┐
│ ← 返回   FITLC Logo → /profile  │
├─────────────────────────────────┤
│                                 │
│  修改个人资料                    │
│                                 │
│       ┌────────┐                │
│       │ 头像   │                │ ← AvatarUpload
│       │ [上传] │                │
│       └────────┘                │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 昵称: [___________]     │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │     保存                │   │
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘

布局逻辑:
- SettingsLayout (嵌套路由)
- useLocation 判断当前子路由
- AvatarUpload: 点击上传 → POST /upload/image
- 昵称输入: 本地 useState
- 保存 → PUT /users/me/profile
```

---

#### BodySettings (`/settings/body`) - SettingsLayout 嵌套

```
┌─────────────────────────────────┐
│ ← 返回   FITLC Logo → /profile  │
├─────────────────────────────────┤
│                                 │
│  身体数据                        │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 身高 (cm): [___170____] │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 体重 (kg): [___75____] │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 体脂 (%): [___18_____]  │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │     保存                │   │
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘

布局逻辑:
- SettingsLayout (嵌套路由)
- 初始值从 useAuthStore.user 或 API 获取
- 本地 useState 管理表单
- 保存 → POST /users/me/metrics (体重/体脂) + PUT /users/me/profile (身高)
```

---

#### AdminExercises (`/admin/exercises`) - SidebarLayout

```
┌────────┬───────────────────────────────┐
│        │  动作库维护                     │
│ FITLC  ├───────────────────────────────┤
│        │                               │
│ ┌────┐ │  [+ 添加动作] [AI 生成]        │
│ │💪  │ │                               │
│ │动作 │ │  ┌─────────────────────────┐  │
│ └────┘ │  │ ▼ 卧推                   │  │ ← 可展开卡片
│ ┌────┐ │  │   胸部 | 杠铃 | 中级    │  │
│ │🍖  │ │  │   [编辑] [变体] [发布]  │  │
│ │肌肉 │ │  ├─────────────────────────┤  │
│ └────┘ │  │ ▶ 哑铃飞鸟               │  │
│        │  │   胸部 | 哑铃 | 中级    │  │
│        │  └─────────────────────────┘  │
│        │                               │
│ [退出] │                               │
└────────┴───────────────────────────────┘

布局逻辑:
- SidebarLayout (固定侧边栏 + 主内容)
- SidebarNav: 动作库 / 肌肉库 切换
- useAdminStore 或直接调用 API
- 展开/收起: ExerciseCard expand/collapse
- Modal: AddEditExerciseModal, VariantModal
- AI 生成: POST /admin/exercises/generate
```

---

#### AdminMuscles (`/admin/muscles`) - SidebarLayout

```
┌────────┬───────────────────────────────┐
│        │  肌肉库维护                     │
│ FITLC  ├───────────────────────────────┤
│        │                               │
│ ┌────┐ │  [+ 添加肌肉] [AI 生成]        │
│ │💪  │ │                               │
│ │动作 │ │  ┌─────────────────────────┐  │
│ └────┘ │  │ ▼ 胸部                   │  │ ← 可展开节点树
│ ┌────┐ │  │   ├ 上胸                 │  │
│ │🍖  │ │  │   ├ 中胸                 │  │ ← 层级树结构
│ │肌肉 │ │  │   └ 下胸                 │  │
│ └────┘ │  ├─────────────────────────┤  │
│        │  │ ▶ 背部                   │  │
│ [退出] │  │   ├ 背阔肌               │  │
│        │  │   └ ...                 │  │
│        │  └─────────────────────────┘  │
└────────┴───────────────────────────────┘

布局逻辑:
- SidebarLayout
- 肌肉以层级树展示 (parent_muscle_id)
- 展开/收起节点
- Modal: AddEditMuscleModal
- AI 生成: POST /admin/muscles/generate
```

---

### 7.4 数据获取模式总结

| 模式 | 使用场景 | 示例页面 |
|------|----------|----------|
| **useEffect + store action** | 大多数页面 | Chat, Exercises, Profile |
| **useEffect + 直接 API** | 不常用 store 时 | Dashboard, Calendar |
| **useRef 防重载** | 需要严格控制加载时机 | Gallery |
| **本地 useState** | 纯表单页面 | PlanGenerate, ProfileSettings |
| **useParams + store** | 需要路由参数时 | PlanDetail, PlanExecute |

### 7.5 UI 组件库

| 组件 | 文件 | 用途 |
|------|------|------|
| Button | `components/ui/Button` | variants: primary/secondary/outline/danger, sizes: sm/lg |
| Card | `components/ui/Card` | 容器卡片, bg-tertiary + 圆角 + 边框 |
| Input | `components/ui/Input` | 表单输入, 带 label |
| Modal | `components/ui/Modal` | 弹窗遮罩 |
| TabSwitcher | `components/ui/TabSwitcher` | 水平 Tab 切换 |
| ConfirmDialog | `components/ui/ConfirmDialog` | 确认对话框 |
| DateRangePicker | `components/ui/DateRangePicker` | 日期范围选择 |
| Toast | `components/ui/Toast` | 轻提示 |

---

*文档生成时间: 2026/05/01*
