# 微前端管理系统 (Turbo + qiankun)

基于 Turbo monorepo 和 qiankun 微前端架构的企业级管理系统 Demo。

## 项目结构

```
monorepo-qiankun-web/
├── apps/
│   ├── main-app/          # 主应用 (Vue 3 + Element Plus)
│   ├── shop-app/          # 商城子应用 (Nuxt 3)
│   ├── role-app/          # 角色管理子应用 (Vue 3 + TDesign + ECharts)
│   └── user-app/          # 用户管理子应用 (React + Ant Design)
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## 技术栈

| 应用       | 技术栈                                   | 端口 |
| ---------- | ---------------------------------------- | ---- |
| 主应用     | Vue 3 + Vite + Element Plus + qiankun    | 8000 |
| 商城子应用 | Nuxt 3 + Element Plus + Pinia            | 8001 |
| 角色管理   | Vue 3 + Vite + TDesign + Pinia + ECharts | 8002 |
| 用户管理   | React 18 + Vite + Ant Design             | 8003 |

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### 安装依赖

```bash
# 安装 pnpm（如未安装）
npm install -g pnpm

# 安装所有依赖
pnpm install
```

### 启动开发服务

```bash
# 启动所有应用（使用 turbo）
pnpm dev

# 或单独启动某个应用
pnpm --filter main-app dev
pnpm --filter shop-app dev
pnpm --filter role-app dev
pnpm --filter user-app dev
```

### 访问地址

- **主应用**: http://localhost:8000
- **商城子应用**: http://localhost:8001 (独立访问)
- **角色管理**: http://localhost:8002 (独立访问)
- **用户管理**: http://localhost:8003 (独立访问)

## 项目特性

### 主应用 (main-app)

- 基于 Vue 3 + Vite 构建
- 使用 Element Plus 组件库
- 集成 qiankun 微前端框架
- 提供统一的布局和导航

### 商城子应用 (shop-app)

- 基于 Nuxt 3 构建
- 使用 Element Plus 组件库
- 集成 Pinia 状态管理
- 包含商品管理、订单统计等功能

### 角色管理 (role-app)

- 基于 Vue 3 + Vite 构建
- 使用 TDesign Vue Next 组件库
- 集成 Pinia 状态管理
- 使用 ECharts 展示数据图表
- 包含角色列表、权限管理等功能

### 用户管理 (user-app)

- 基于 React 18 + Vite 构建
- 使用 Ant Design 5.x 组件库
- 使用 React Router 6 路由管理
- 包含用户列表、用户统计等功能

## 构建部署

```bash
# 构建所有应用
pnpm build

# 构建单个应用
pnpm --filter main-app build
```

## 目录说明

```
apps/
├── main-app/                # 主应用
│   ├── src/
│   │   ├── main.ts         # 入口文件，注册微应用
│   │   ├── App.vue         # 根组件，包含布局
│   │   ├── router/         # 路由配置
│   │   └── views/          # 页面组件
│   └── ...
│
├── shop-app/                # 商城子应用
│   ├── pages/              # Nuxt 页面
│   ├── plugins/            # qiankun 生命周期插件
│   ├── stores/             # Pinia 状态
│   └── nuxt.config.ts      # Nuxt 配置
│
├── role-app/                # 角色管理子应用
│   ├── src/
│   │   ├── main.ts         # 入口，qiankun 生命周期
│   │   ├── router/         # 路由
│   │   ├── stores/         # Pinia 状态
│   │   └── views/          # 页面（含 ECharts 图表）
│   └── ...
│
└── user-app/                # 用户管理子应用
    ├── src/
    │   ├── main.tsx        # 入口，qiankun 生命周期
    │   ├── App.tsx         # 根组件
    │   └── pages/          # 页面组件
    └── ...
```

## 微前端通信

子应用可以通过 `props` 接收主应用传递的数据：

```typescript
// 主应用注册时传递
registerMicroApps([
  {
    name: 'shop-app',
    props: {
      mainApp: 'main-app',
      // 可以传递更多数据
    }
  }
])

// 子应用接收
mount(props) {
  console.log(props.mainApp)
}
```

## License

MIT
