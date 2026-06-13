# 2. 用户角色与权限 (RBAC) - 详情页

## 功能概述

基于角色的访问控制（RBAC）系统，支持管理员和普通用户两种角色，控制对动作库、肌肉库等管理功能的访问。

---

## 角色定义

### 角色类型
| 角色 | 名称 | 说明 |
|------|------|------|
| admin | 管理员 | 系统管理员，可管理动作库、肌肉库，执行AI增强 |
| normal | 普通用户 | 一般用户，使用AI对话、查看记录和趋势 |

### 默认角色分配
- 新用户注册 → 自动分配 `normal` 角色
- 管理员角色 → 需通过数据库手动分配

---

## 数据库设计

### 数据模型
```prisma
model Role {
  id        Int       @id @default(autoincrement())
  name      String    @unique @map("name") @db.VarChar(50)
  createdAt DateTime  @default(now()) @map("created_at")

  users     UserRole[]

  @@map("roles")
}

model UserRole {
  id        Int      @id @default(autoincrement())
  userId    Int      @map("user_id")
  roleId    Int      @map("role_id")
  createdAt DateTime @default(now()) @map("created_at")

  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  role     Role     @relation(fields: [roleId], references: [id])

  @@unique([userId, roleId])
  @@map("user_roles")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique @map("email") @db.VarChar(255)
  password  String   @map("password") @db.VarChar(255)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  roles     UserRole[]

  @@map("users")
}
```

### 预置数据
```sql
INSERT INTO roles (name, created_at) VALUES ('admin', NOW()), ('normal', NOW());
```

---

## 权限矩阵

### 功能权限表
| 功能模块 | normal | admin |
|---------|--------|-------|
| **认证** | | |
| 用户注册 | ✓ | ✓ |
| 用户登录 | ✓ | ✓ |
| 获取当前用户 | ✓ | ✓ |
| **AI对话** | | |
| 发送消息 | ✓ | ✓ |
| 撤销记录 | ✓ | ✓ |
| **历史记录** | | |
| 查看训练历史 | ✓ | ✓ |
| 查看围度历史 | ✓ | ✓ |
| 删除训练 | ✓ | ✓ |
| 删除围度 | ✓ | ✓ |
| 恢复记录 | ✓ | ✓ |
| **动作库** | | |
| 动作列表/详情 | ✓ | ✓ |
| 动作库维护(CRUD) | - | ✓ |
| 动作AI增强 | - | ✓ |
| 动作批量发布 | - | ✓ |
| **肌肉库** | | |
| 肌肉列表/详情 | ✓ | ✓ |
| 肌肉库维护(CRUD) | - | ✓ |
| 肌肉AI增强 | - | ✓ |
| **趋势分析** | | |
| 围度趋势图 | ✓ | ✓ |
| 训练统计图 | ✓ | ✓ |

---

## 后端实现

### JWT Token 扩展

#### Token Payload
```json
{
  "userId": 123,
  "email": "user@example.com",
  "roles": ["normal"],
  "exp": 1234567890
}
```

#### 登录时获取角色
```javascript
// authService.login
const userRoles = await roleRepository.findByUserId(userId);
const roles = userRoles.map(ur => ur.role.name);
const token = jwt.sign(
  { userId, email, roles },
  JWT_SECRET,
  { expiresIn: '7d' }
);
```

### 中间件实现

#### Auth Middleware
```javascript
export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      roles: decoded.roles || []
    };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
```

#### Role Check Middleware
```javascript
export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user?.roles?.includes(role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}
```

### 路由保护示例
```javascript
// 公开路由 - 无需认证
app.use('/api/auth', authRoutes);

// 需认证路由 - 只需登录
app.use('/api/chat', authMiddleware, chatRoutes);
app.use('/api/records', authMiddleware, recordsRoutes);

// 管理员路由 - 需admin角色
app.use('/api/admin/exercises', authMiddleware, requireRole('admin'), adminExercisesRouter);
app.use('/api/admin/muscles', authMiddleware, requireRole('admin'), adminMusclesRouter);
```

---

## 前端实现

### 用户状态类型
```typescript
interface User {
  id: number;
  email: string;
  roles: string[];
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (email, password) => Promise<void>;
  logout: () => void;
}
```

### Token解析
```typescript
// 从JWT获取roles
const payload = JSON.parse(atob(token.split('.')[1]));
const roles = payload.roles || [];
```

### 菜单权限控制
```tsx
const user = useAuthStore((s) => s.user);
const isAdmin = user?.roles?.includes('admin');

const navItems = [
  { path: '/chat', label: '对话' },
  { path: '/history', label: '历史' },
  { path: '/trends', label: '趋势' },
  { path: '/profile', label: '个人' },
  { path: '/muscles', label: '肌肉' },
  { path: '/exercises', label: '动作' },
];

const adminItems = [
  { path: '/admin/exercises', label: '动作库维护' },
  { path: '/admin/muscles', label: '肌肉库维护' },
];

// 动态渲染菜单
{navItems.map(item => <Link key={item.path} to={item.path}>{item.label}</Link>)}
{isAdmin && adminItems.map(item => <Link key={item.path} to={item.path}>{item.label}</Link>)}
```

### 路由守卫
```tsx
function AdminRoute({ component }: { component: ReactNode }) {
  const user = useAuthStore((s) => s.user);
  if (!user?.roles?.includes('admin')) {
    return <Navigate to="/chat" />;
  }
  return component;
}

// 使用
<Route path="/admin/exercises" element={<AdminRoute component={<AdminExercises />} />} />
```

---

## 安全考虑

### 前端安全
- 菜单隐藏 ≠ 安全（可绕过）
- 后端必须做权限验证
- 前端路由守卫仅为用户体验

### 后端安全
- 所有admin API必须经过 `requireRole('admin')` 中间件
- 401/403 错误码区分（未认证/无权限）
- JWT过期时间7天，过期需重新登录

### 权限变更
- 如果管理员权限在数据库中被修改，已签发的JWT在过期前仍保有旧权限
- 接受这个限制直到token过期
- 如需立即生效，需用户重新登录
