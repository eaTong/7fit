# Remotion 3D 渲染深度分析
## Three.js + React Three Fiber 在 Remotion 中的应用

> **调研日期**：2026-06-14
> **基于**：Remotion Skills `3d.md` + Three.js 官方文档

---

## 目录

1. [核心架构](#1-核心架构)
2. [ThreeCanvas 组件](#2-threecanvas-组件)
3. [动画规则（核心约束）](#3-动画规则核心约束)
4. [与 Sequence 集成](#4-与-sequence-集成)
5. [React Three Fiber 兼容性](#5-react-three-fiber-兼容性)
6. [实用场景与代码模板](#6-实用场景与代码模板)
7. [性能注意事项](#7-性能注意事项)
8. [7fit 项目结合分析](#8-7fit-项目结合分析)

---

## 1. 核心架构

Remotion 的 3D 渲染基于 **Three.js** + **React Three Fiber (R3F)**，通过 `@remotion/three` 包集成。

```
@remotion/three
├── ThreeCanvas     # Remotion 的 3D 画布组件
├── useCurrentFrame # 驱动动画的帧号
└── ⚠️ useFrame     # 禁止使用（R3F 的动画钩子）
```

**关键约束**：Remotion 按帧 seek 渲染，动画必须用 `useCurrentFrame()` 驱动，而非 R3F 的 `useFrame()`。

---

## 2. ThreeCanvas 组件

### 2.1 基本结构

```tsx
import { ThreeCanvas } from "@remotion/three";
import { useVideoConfig } from "remotion";

const { width, height } = useVideoConfig();

<ThreeCanvas width={width} height={height}>
  {/* 灯光 */}
  <ambientLight intensity={0.4} />
  <directionalLight position={[5, 5, 5]} intensity={0.8} />

  {/* 3D 对象 */}
  <mesh>
    <sphereGeometry args={[1, 32, 32]} />
    <meshStandardMaterial color="red" />
  </mesh>
</ThreeCanvas>
```

### 2.2 必需元素

- **灯光**：`ambientLight` 至少一个，否则物体全黑
- **width/height**：必须显式传递
- **parent container**：建议包在 `AbsoluteFill` 内

---

## 3. 动画规则（核心约束）

### 3.1 ✅ 正确方式：用 useCurrentFrame 驱动

```tsx
const frame = useCurrentFrame();
const rotationY = frame * 0.02;
const scale = interpolate(frame, [0, 60], [0.5, 1.5], {
  extrapolateRight: "clamp",
});

<mesh rotation={[0, rotationY, 0]} scale={[scale, scale, scale]}>
  <boxGeometry args={[2, 2, 2]} />
  <meshStandardMaterial color="#4a9eff" />
</mesh>
```

### 3.2 ❌ 禁止：useFrame from R3F

```tsx
// ❌ 错误示例
useFrame(({ clock }) => {
  mesh.rotation.y = clock.getElapsedTime(); // 依赖实时时钟，seek 时失效
});
```

**原因**：`useFrame` 依赖 R3F 的实时时钟，Remotion 按帧 seek 时无法正确还原状态。

### 3.3 动画帧驱动模式

| 方案 | 原理 | Remotion seek 支持 |
|---|---|---|
| `useCurrentFrame()` + `interpolate()` | 帧号 → 插值 | ✅ |
| R3F `useFrame()` | 实时时钟 delta | ❌ |
| GSAP | 实时 timeline | ❌ |
| CSS animation | 实时推进 | ❌ |

---

## 4. 与 Sequence 集成

### 4.1 必须加 layout="none"

```tsx
import { Sequence } from "remotion";
import { ThreeCanvas } from "@remotion/three";

<ThreeCanvas width={width} height={height}>
  <Sequence layout="none">
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#4a9eff" />
    </mesh>
  </Sequence>
</ThreeCanvas>
```

### 4.2 本地帧 vs 全局帧

`<Sequence>` 内的 `useCurrentFrame()` 返回**本地帧**（从 0 开始）：

```tsx
<Sequence from={60} durationInFrames={30}>
  <MyComponent />
  {/* 内部 useCurrentFrame() 返回 0-29，不是 60-89 */}
</Sequence>
```

---

## 5. React Three Fiber 兼容性

### 5.1 支持的 R3F 特性

- JSX 语法 (`<mesh>`, `<sphereGeometry>`)
- `args` 传参
- `position`, `rotation`, `scale` 属性
- 灯光组件
- 材质组件 (`meshStandardMaterial`, `meshBasicMaterial`)
- 几何体组件 (`boxGeometry`, `sphereGeometry`, `planeGeometry`)

### 5.2 不支持/禁止的 R3F 特性

| 特性 | 状态 | 原因 |
|---|---|---|
| `useFrame()` | ❌ 禁止 | 依赖实时时钟 |
| `useThree()` | ⚠️ 慎用 | 获取的 camera/renderer 可能有 seek 问题 |
| `useUpdate()` | ❌ 禁止 | 同上 |
| `useLayoutEffect()` | ⚠️ 慎用 | 渲染时序问题 |

### 5.3 与 Three.js 原生混用

```tsx
import * as THREE from "three";

const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshStandardMaterial({ color: "#4a9eff" });
const mesh = new THREE.Mesh(geometry, material);

// 但动画仍需用 useCurrentFrame 驱动
const frame = useCurrentFrame();
mesh.rotation.y = frame * 0.02;
```

---

## 6. 实用场景与代码模板

### 6.1 3D 物体旋转展示

```tsx
import { ThreeCanvas } from "@remotion/three";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

const ProductSpin: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const rotationY = interpolate(frame, [0, 90], [0, Math.PI * 2], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const rotationX = interpolate(frame, [0, 90], [0, Math.PI * 0.3], {
    extrapolateRight: "clamp",
  });

  return (
    <ThreeCanvas width={width} height={height}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <mesh rotation={[rotationX, rotationY, 0]}>
        <torusKnotGeometry args={[1, 0.3, 128, 16]} />
        <meshStandardMaterial color="#FF4500" metalness={0.8} roughness={0.2} />
      </mesh>
    </ThreeCanvas>
  );
};
```

### 6.2 粒子效果

```tsx
const Particles: React.FC<{ count: number }> = ({ count }) => {
  const frame = useCurrentFrame();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, [count]);

  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(frame, [0, 90], [0.5, 1.5], { extrapolateRight: "clamp" });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#FF4500" size={0.1} transparent opacity={opacity} />
    </points>
  );
};
```

### 6.3 3D 文字

```tsx
import { Text } from "@react-three/drei";

const AnimatedTitle: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });

  return (
    <Text
      position={[0, 0, 0]}
      fontSize={1}
      color="#FFFFFF"
      anchorX="center"
      anchorY="middle"
      font="/fonts/Inter-Bold.woff"
      children={text}
    />
  );
};
```

### 6.4 相机移动

```tsx
const CameraFly: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const cameraZ = interpolate(frame, [0, durationInFrames], [10, 3], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <ThreeCanvas width={width} height={height}>
      <perspectiveCamera makeDefault position={[0, 0, cameraZ]} />
      {/* ... */}
    </ThreeCanvas>
  );
};
```

---

## 7. 性能注意事项

### 7.1 渲染配置

3D WebGL 渲染建议用单并发：

```bash
npx remotion render MyComp out/video.mp4 --gl=angle --concurrency=1
```

### 7.2 几何体复杂度

| 复杂度 | 参数 | 性能 |
|---|---|---|
| 简单 | `args={[1, 8, 8]}` | ✅ |
| 中等 | `args={[1, 32, 32]}` | ✅ |
| 高精度 | `args={[1, 128, 128]}` | ⚠️ 降帧 |

### 7.3 材质选择

| 材质 | 性能 | 适用 |
|---|---|---|
| `meshBasicMaterial` | ⭐⭐⭐⭐⭐ | 不需要光照 |
| `meshStandardMaterial` | ⭐⭐⭐⭐ | 金属/粗糙度 |
| `meshPhysicalMaterial` | ⭐⭐⭐ | 高级 PBR（慎用）|

---

## 8. 7fit 项目结合分析

### 8.1 当前 3D 能力现状

项目**完全没有 3D 能力**，但 7fit 视频有潜在需求：
- B 类健身知识视频：动作演示 + 参数 overlay
- 未来可能需要：肌肉解剖 3D 模型
- 3D 粒子效果：数据达成/里程碑庆祝

### 8.2 推荐引入场景

| 场景 | 价值 | 优先级 |
|---|---|---|
| **3D 产品/工具展示** | C 类七练介绍 | 🟡 中 |
| **健身动作 3D 模型** | B 类健身知识 | 🔴 高潜力 |
| **粒子庆祝效果** | A/B 类收尾 | 🟡 中 |
| **3D 背景层** | 科技感氛围 | 🟢 低 |

### 8.3 不推荐场景

| 场景 | 原因 |
|---|---|
| 复杂 3D 动画作为主场景 | 性能压力大，移动端卡顿 |
| 实时物理模拟 | 与帧驱动冲突 |
| 骨骼动画 | 需要 `useFrame`，不兼容 |

### 8.4 引入成本评估

```
安装包：npx remotion add @remotion/three
学习曲线：中等（需理解 Three.js 基本概念）
性能影响：中等（WebGL 渲染）
生产时间：每个 3D 镜头 +1-2 小时
```

**建议**：先在 C 类视频的小场景试点（如 3D 粒子背景），积累经验后再扩展到 B 类。

---

*报告完毕。3D 专题文档已保存。*
