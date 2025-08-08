# n8n 管理平台

基于 Strapi 的 n8n 工作流管理系统，提供多租户、多用户的工作流管理、执行监控和审计功能。

## 🚀 项目概述

n8n 管理平台是一个企业级的工作流管理系统，允许用户绑定自己的 n8n 实例，通过统一的 Web 界面管理工作流、监控执行状态、查看历史记录。

### 核心功能

- **用户管理**: 用户注册、登录、权限控制
- **n8n 实例绑定**: 用户绑定自己的 n8n 服务
- **工作流管理**: 查看、筛选、搜索工作流
- **执行控制**: 触发工作流执行、查看执行状态
- **历史记录**: 查看执行历史、详细日志
- **审计日志**: 记录用户操作、系统事件
- **多租户支持**: 组织级别的数据隔离

## 🏗️ 架构设计

### 技术栈

**前端**: Next.js 14 + React 18 + Ant Design + TypeScript
**后端**: Strapi 4.x + PostgreSQL + JWT 认证
**数据库**: Supabase PostgreSQL
**部署**: Vercel (前端) + Railway (后端)

## 📁 项目结构

```
n8n_manage_system/
├── frontend/                 # 前端应用
├── backend/                  # Strapi 后端
├── docs/                     # 文档
├── scripts/                  # 脚本文件
└── README.md
```

## 🛠️ 开发路径

### 第一阶段：基础架构搭建 (1-2周)
- 项目初始化和环境配置
- Strapi 后端基础搭建
- Next.js 前端基础搭建

### 第二阶段：核心功能开发 (3-4周)
- 用户认证系统
- n8n 实例管理
- 工作流管理功能

### 第三阶段：执行控制功能 (2-3周)
- 工作流执行触发
- 执行状态监控
- 历史记录管理

### 第四阶段：管理功能 (2-3周)
- 审计日志系统
- 管理员功能界面

### 第五阶段：多租户支持 (2-3周)
- 租户模型设计
- 多租户数据隔离

### 第六阶段：优化和部署 (1-2周)
- 性能优化
- 生产环境部署

## 🚀 快速开始

### 环境要求
- Node.js 18+
- PostgreSQL 数据库
- Git

### 本地开发

1. **克隆项目**
```bash
git clone <repository-url>
cd n8n_manage_system
```

2. **安装依赖**
```bash
npm install
cd frontend && npm install
cd ../backend && npm install
```

3. **启动开发环境**
```bash
# 启动后端
cd backend && npm run develop

# 启动前端
cd frontend && npm run dev
```

## �� 许可证

MIT License
