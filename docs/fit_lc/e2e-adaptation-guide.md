# E2E 测试适配指南

## 问题分析

Playwright E2E 测试选择器与前端 UI 不匹配，导致测试超时。

### 当前错误

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log: waiting for getByLabel('邮箱')
```

### 原因

`getByLabel('邮箱')` 查找 HTML `<label>` 元素的文本，但页面加载超时或选择器不正确。

---

## 适配步骤

### 1. 查看实际页面元素

检查 `src/pages/` 中的 React 组件，了解：
- 表单的 `action` 属性
- Input 组件的 `name`、`placeholder`、`data-testid`
- Button 组件的文本和 `data-testid`

### 2. 常用选择器

| 场景 | 选择器 | 示例 |
|------|--------|------|
| 按标签文本 | `getByText()` | `getByText('登录')` |
| 按占位符 | `getByPlaceholder()` | `getByPlaceholder('your@email.com')` |
| 按角色 | `getByRole()` | `getByRole('button', { name: '登录' })` |
| 按测试ID | `data-testid` | `getByTestId('login-btn')` |
| CSS选择器 | `locator()` | `locator('input[type="email"]')` |

### 3. 登录页适配示例

**前端 Login.tsx:**
```tsx
<form onSubmit={handleSubmit}>
  <Input type="email" label="邮箱" placeholder="your@email.com" />
  <Input type="password" label="密码" placeholder="••••••••" />
  <Button type="submit">{isLoading ? '登录中...' : '登录'}</Button>
</form>
```

**错误选择器 (超时):**
```typescript
await this.page.getByLabel('邮箱').fill(email);  // ❌ 超时
```

**正确选择器:**
```typescript
// 方式1: 使用占位符
await this.page.getByPlaceholder('your@email.com').fill(email);

// 方式2: 使用 type 属性
await this.page.locator('input[type="email"]').fill(email);

// 方式3: 使用 role + name
await this.page.getByRole('textbox', { name: '邮箱' }).fill(email);

// 方式4: 结合 label 文本和 input
await this.page.locator('label:has-text("邮箱") + input').fill(email);
```

---

## 测试用例适配清单

对每个测试文件，按以下步骤修改：

### Step 1: 识别页面元素

```typescript
// 检查页面源码，确定选择器
import { test, expect } from '@playwright/test';

test('示例', async ({ page }) => {
  await page.goto('/login');
  // 使用 Playwright 截图或 HTML 检查元素
  await page.screenshot('login-page.png');
  // 或获取页面 HTML
  const html = await page.content();
});
```

### Step 2: 更新 Page Objects

修改 `tests/e2e/page-objects/` 中的选择器：

```typescript
// LoginPage.ts - 修复后
export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page, '/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.open();
    // 使用占位符而非 label
    await this.page.getByPlaceholder('your@email.com').fill(email);
    await this.page.getByPlaceholder('••••••••').fill(password);
    await this.page.getByRole('button', { name: '登录' }).click();
  }
}
```

### Step 3: 增加等待和调试

```typescript
test('示例 - 带调试', async ({ page }) => {
  await page.goto('/login');
  // 等待页面加载
  await page.waitForLoadState('networkidle');
  // 等待元素可见
  await page.waitForSelector('input[type="email"]', { timeout: 5000 });
  // 然后再操作
});
```

---

## 各页面适配指南

### 登录页 (/login)

| 测试 | 当前选择器 | 正确选择器 |
|------|-----------|------------|
| 邮箱输入 | `getByLabel('邮箱')` | `getByPlaceholder('your@email.com')` |
| 密码输入 | `getByLabel('密码')` | `getByPlaceholder('••••••••')` |
| 登录按钮 | `getByRole('button', { name: '登录' })` | ✅ 正确 |

### 注册页 (/register)

| 测试 | 当前选择器 | 正确选择器 |
|------|-----------|------------|
| 邮箱输入 | `getByLabel('邮箱')` | `getByPlaceholder('your@email.com')` |
| 密码输入 | `getByLabel('密码')` | `getByPlaceholder('••••••••')` |
| 确认密码 | `getByLabel('确认密码')` | `getByPlaceholder('••••••••')` |
| 注册按钮 | `getByRole('button', { name: '注册' })` | ✅ 正确 |

### 聊天页 (/chat)

| 测试 | 当前选择器 | 正确选择器 |
|------|-----------|------------|
| 消息输入 | `getByPlaceholder('输入消息...')` | ✅ 需验证 |
| 发送按钮 | `getByRole('button', { name: '发送' })` | ✅ 需验证 |

---

## 快速修复命令

```bash
# 运行单个测试文件并查看截图
npx playwright test auth.spec.ts --grep "@auth" --debug

# 列出所有测试（验证配置正确）
npx playwright test --list

# 运行测试并生成报告
npx playwright test --reporter=html
```

---

## 下一步

1. 运行 `npx playwright test --debug` 查看页面实际内容
2. 根据实际 HTML 更新选择器
3. 更新 `page-objects/` 文件
4. 重新运行测试验证