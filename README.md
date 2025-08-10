# n8n 集中管理平台

一个基于 Next.js 14 构建的现代化 n8n 工作流集中管理平台，支持多实例管理、工作流监控和执行记录追踪。

## ✨ 功能特性

### 🏢 实例管理
- 多 n8n 实例统一管理
- 实例连接状态监控
- 实例配置的增删改查
- API 连接测试功能

### 🔄 工作流管理
- 跨实例工作流浏览
- 工作流状态实时监控
- 工作流启用/禁用控制
- 工作流详情查看

### 📊 执行记录
- 工作流执行历史追踪
- 执行状态实时更新
- 执行结果详情查看
- 失败执行重试功能

### 📈 统一仪表板
- 系统概览统计
- 实例状态总览
- 执行趋势图表
- 快速操作入口

## 🛠 技术栈

### 前端技术
- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **UI 库**: React 18
- **样式**: Tailwind CSS
- **组件**: shadcn/ui
- **状态管理**: TanStack Query (React Query)
- **表单**: React Hook Form + Zod

### 后端技术
- **API**: Next.js API Routes
- **数据库**: PostgreSQL (Supabase/Neon)
- **ORM**: Prisma
- **验证**: Zod
- **认证**: NextAuth.js (可选)

### 部署运维
- **部署平台**: Vercel
- **数据库**: Supabase/Neon PostgreSQL
- **CI/CD**: Vercel 自动部署
- **监控**: Vercel Analytics

## 🚀 快速开始

### 环境要求
- Node.js 18.17 或更高版本
- pnpm 8.0 或更高版本
- PostgreSQL 数据库

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/xuanzai92/n8n_manage.git
cd n8n_manage
```

2. **安装依赖**
```bash
pnpm install
```

3. **环境配置**
```bash
# 复制环境变量模板
cp .env.example .env

# 编辑环境变量
# DATABASE_URL="postgresql://username:password@localhost:5432/n8n_manage"
```

4. **数据库设置**
```bash
# 生成 Prisma 客户端
pnpm prisma generate

# 运行数据库迁移
pnpm prisma db push

# (可选) 填充示例数据
pnpm prisma db seed
```

5. **启动开发服务器**
```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📁 项目结构
n8n_manage/
├── prisma/                 # 数据库模式和迁移
│   └── schema.prisma      # Prisma 数据库模式
├── public/                # 静态资源
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/          # API Routes
│   │   │   ├── instances/    # 实例管理 API
│   │   │   ├── workflows/    # 工作流管理 API
│   │   │   └── executions/   # 执行记录 API
│   │   ├── instances/    # 实例管理页面
│   │   ├── workflows/    # 工作流管理页面
│   │   ├── executions/   # 执行记录页面
│   │   ├── dashboard/    # 仪表板页面
│   │   ├── globals.css   # 全局样式
│   │   ├── layout.tsx    # 根布局
│   │   └── page.tsx      # 首页
│   ├── components/       # React 组件
│   │   ├── ui/          # shadcn/ui 组件
│   │   ├── forms/       # 表单组件
│   │   └── layout/      # 布局组件
│   ├── lib/             # 工具库
│   │   ├── prisma.ts    # Prisma 客户端
│   │   ├── api.ts       # API 工具函数
│   │   └── utils.ts     # 通用工具函数
│   └── types/           # TypeScript 类型定义
├── .env.example         # 环境变量模板
├── next.config.ts       # Next.js 配置
├── tailwind.config.js   # Tailwind CSS 配置
├── tsconfig.json        # TypeScript 配置
└── vercel.json          # Vercel 部署配置



## 🗄 数据库模式

### 实例表 (instances)
```sql
id            SERIAL PRIMARY KEY
name          VARCHAR NOT NULL        -- 实例名称
api_base_url  VARCHAR NOT NULL        -- n8n API 地址
api_key       VARCHAR NOT NULL        -- API 密钥
auth_type     VARCHAR DEFAULT 'API_KEY' -- 认证类型
created_at    TIMESTAMP DEFAULT NOW()
owner_user_id INTEGER                  -- 所有者用户ID
```

### 工作流表 (workflows)
```sql
id           SERIAL PRIMARY KEY
instance_id  INTEGER REFERENCES instances(id)
workflow_id  VARCHAR NOT NULL         -- n8n 工作流ID
name         VARCHAR NOT NULL         -- 工作流名称
active       BOOLEAN DEFAULT FALSE    -- 是否激活
tags         VARCHAR                  -- 标签
project      VARCHAR                  -- 项目
created_at   TIMESTAMP DEFAULT NOW()
updated_at   TIMESTAMP DEFAULT NOW()
```

### 执行记录表 (executions)
```sql
exec_id       SERIAL PRIMARY KEY
instance_id   INTEGER REFERENCES instances(id)
workflow_id   INTEGER REFERENCES workflows(id)
n8n_exec_id   VARCHAR                 -- n8n 执行ID
status        VARCHAR DEFAULT 'running' -- 执行状态
start_time    TIMESTAMP
end_time      TIMESTAMP
duration      INTEGER                 -- 执行时长(毫秒)
input         TEXT                    -- 输入数据(JSON)
output        TEXT                    -- 输出数据(JSON)
error_message TEXT                    -- 错误信息
exec_source   VARCHAR DEFAULT 'manual' -- 执行来源
created_at    TIMESTAMP DEFAULT NOW()
updated_at    TIMESTAMP DEFAULT NOW()
```

## 🔧 API 接口

### 实例管理
- `GET /api/instances` - 获取实例列表
- `POST /api/instances` - 创建新实例
- `PUT /api/instances/[id]` - 更新实例
- `DELETE /api/instances/[id]` - 删除实例
- `POST /api/instances/[id]/test` - 测试实例连接

### 工作流管理
- `GET /api/instances/[id]/workflows` - 获取实例工作流
- `POST /api/workflows/[id]/execute` - 执行工作流
- `GET /api/workflows/[id]/status` - 获取工作流状态

### 执行记录
- `GET /api/executions` - 获取执行记录
- `GET /api/executions/[id]` - 获取执行详情
- `POST /api/executions/[id]/retry` - 重试执行

## 🚀 部署指南

### Vercel 部署

1. **连接 GitHub**
   - 将代码推送到 GitHub
   - 在 Vercel 中导入项目

2. **配置环境变量**
   ```
   DATABASE_URL=postgresql://...
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=https://your-domain.vercel.app
   ```

3. **数据库设置**
   - 使用 Supabase 或 Neon 创建 PostgreSQL 数据库
   - 运行数据库迁移

4. **自动部署**
   - 推送到 main 分支自动触发部署
   - 预览部署支持 PR 预览

### 本地开发

```bash
# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start

# 代码检查
pnpm lint

# 数据库操作
pnpm prisma studio    # 打开数据库管理界面
pnpm prisma migrate    # 运行数据库迁移
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 全栈框架
- [Prisma](https://prisma.io/) - 现代数据库工具包
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [shadcn/ui](https://ui.shadcn.com/) - UI 组件库
- [Vercel](https://vercel.com/) - 部署平台
- [n8n](https://n8n.io/) - 工作流自动化平台

## 📞 联系方式

- 项目地址: [https://github.com/xuanzai92/n8n_manage](https://github.com/xuanzai92/n8n_manage)
- 问题反馈: [Issues](https://github.com/xuanzai92/n8n_manage/issues)

---

**注意**: 本项目仍在开发中，功能可能会有变化。欢迎提交 Issue 和 PR！