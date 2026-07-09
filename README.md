# Monster 怪物计数器

一个基于 React + TypeScript + Vite 的本地怪物计数管理工具，所有数据通过 localForage 持久化到浏览器，无需后端服务。

## 项目背景

用于本地记录不同日期下怪物击杀数量、类型与计时。支持按日期拆分文件，方便按天复盘统计。

## 技术栈

- **框架**：React 19（启用 React Compiler）
- **语言**：TypeScript 6
- **构建工具**：Vite 8
- **UI 组件库**：Ant Design 6
- **本地持久化**：localForage
- **代码规范**：ESLint + typescript-eslint

## 安装与启动

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 构建

```bash
# 类型检查 + 生产构建
npm run build

# 本地预览生产包
npm run preview
```

## 代码检查

```bash
npm run lint
```

## 项目结构

```
src/
  components/   # UI 组件（表格、表单、统计卡片、选择器、弹窗等）
  hooks/        # 业务逻辑 Hook（存储、页面、计时器）
  services/     # 持久化服务抽象与 localForage 实现
  utils/        # 工具函数（计算、输入归一化、校验规则）
  configs/      # 常量与配置
  types/        # 全局类型定义
```

## 数据持久化

数据保存在浏览器本地，localForage 会按以下优先级选择底层存储：

1. IndexedDB
2. WebSQL
3. LocalStorage

关键存储键：

- 日期索引：`"dates"` —— 存储所有已存在的日期字符串数组。
- 每日数据：`"file:YYYY-MM-DD"` —— 存储对应日期的怪物记录数组。

## 核心功能

- 按日期文件管理怪物记录，支持切换日期。
- 怪物类型区分为「小怪」与「精英怪」。
- 实时统计各类怪物总数。
- 内置计时器记录击杀耗时。
- 新增、编辑、删除单条怪物记录。
- 自动持久化到浏览器本地存储。

## 未来规划

- [ ] 数据导入 / 导出（JSON / CSV）
- [ ] 统计图表可视化
- [ ] 多语言支持

## 贡献指南

1. Fork 本仓库。
2. 从 `main` 分支创建 `feature/xxx` 或 `fix/xxx` 分支。
3. 提交前执行 `npm run lint`，确保无 ESLint 告警。
4. 发起 Pull Request 并描述变更内容。
