# 部署指南

## 概述

本文档提供了 n8n 管理平台的完整部署指南，包括开发环境、测试环境和生产环境的部署步骤。

## 环境要求

### 系统要求
- Node.js 18+
- PostgreSQL 12+
- Git
- Docker (可选，用于本地开发)

### 云服务要求
- **前端部署**: Vercel 或 Netlify
- **后端部署**: Railway, Render 或 DigitalOcean
- **数据库**: Supabase 或 PlanetScale
- **文件存储**: Supabase Storage 或 AWS S3

## 开发环境部署

### 1. 克隆项目

```bash
git clone <repository-url>
cd n8n_manage_system
```

### 2. 安装依赖

```bash
# 安装根目录依赖
npm install

# 安装前端依赖
cd frontend && npm install

# 安装后端依赖
cd ../backend && npm install
```

### 3. 配置环境变量

#### 后端环境变量 (.env)

```bash
# 数据库配置
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=n8n_manage_system
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password

# JWT 配置
JWT_SECRET=your_jwt_secret_key

# 应用配置
APP_KEYS=your_app_keys
API_TOKEN_SALT=your_api_token_salt
ADMIN_JWT_SECRET=your_admin_jwt_secret

# 服务器配置
HOST=0.0.0.0
PORT=1337
NODE_ENV=development

# CORS 配置
CORS_ORIGIN=http://localhost:3000
```

#### 前端环境变量 (.env.local)

```bash
# API 配置
NEXT_PUBLIC_API_URL=http://localhost:1337
NEXT_PUBLIC_APP_URL=http://localhost:3000

# 认证配置
NEXT_PUBLIC_AUTH_TOKEN_KEY=n8n_auth_token
```

### 4. 启动开发环境

```bash
# 启动后端服务
cd backend && npm run develop

# 启动前端服务
cd frontend && npm run dev
```

访问地址：
- 前端: http://localhost:3000
- 后端管理: http://localhost:1337/admin

## 测试环境部署

### 1. 数据库设置

使用 Supabase 创建测试数据库：

1. 登录 [Supabase](https://supabase.com)
2. 创建新项目
3. 获取数据库连接信息

### 2. 后端部署 (Railway)

1. **连接 GitHub 仓库**
   - 登录 [Railway](https://railway.app)
   - 创建新项目
   - 选择 "Deploy from GitHub repo"

2. **配置环境变量**
   ```bash
   DATABASE_CLIENT=postgres
   DATABASE_HOST=your_supabase_host
   DATABASE_PORT=5432
   DATABASE_NAME=postgres
   DATABASE_USERNAME=postgres
   DATABASE_PASSWORD=your_supabase_password
   DATABASE_SSL=true
   
   JWT_SECRET=your_jwt_secret_key
   APP_KEYS=your_app_keys
   API_TOKEN_SALT=your_api_token_salt
   ADMIN_JWT_SECRET=your_admin_jwt_secret
   
   HOST=0.0.0.0
   PORT=1337
   NODE_ENV=production
   
   CORS_ORIGIN=https://your-frontend-domain.vercel.app
   ```

3. **部署配置**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Root Directory: `backend`

### 3. 前端部署 (Vercel)

1. **连接 GitHub 仓库**
   - 登录 [Vercel](https://vercel.com)
   - 创建新项目
   - 导入 GitHub 仓库

2. **配置环境变量**
   ```bash
   NEXT_PUBLIC_API_URL=https://your-backend-domain.railway.app
   NEXT_PUBLIC_APP_URL=https://your-frontend-domain.vercel.app
   NEXT_PUBLIC_AUTH_TOKEN_KEY=n8n_auth_token
   ```

3. **部署配置**
   - Framework Preset: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`

## 生产环境部署

### 1. 数据库配置

#### 使用 Supabase (推荐)

1. 创建生产环境项目
2. 配置数据库备份策略
3. 设置数据库连接池
4. 配置数据库监控

#### 使用 PlanetScale (备选)

1. 创建生产数据库
2. 配置分支管理
3. 设置自动备份
4. 配置连接池

### 2. 后端部署

#### 选项 1: Railway (推荐)

```bash
# 配置生产环境变量
DATABASE_CLIENT=postgres
DATABASE_HOST=your_production_db_host
DATABASE_PORT=5432
DATABASE_NAME=postgres
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_production_password
DATABASE_SSL=true

JWT_SECRET=your_production_jwt_secret
APP_KEYS=your_production_app_keys
API_TOKEN_SALT=your_production_api_token_salt
ADMIN_JWT_SECRET=your_production_admin_jwt_secret

HOST=0.0.0.0
PORT=1337
NODE_ENV=production

CORS_ORIGIN=https://your-production-domain.com
```

#### 选项 2: DigitalOcean App Platform

1. 创建 App Platform 应用
2. 配置环境变量
3. 设置自动部署
4. 配置自定义域名

#### 选项 3: 自托管 (Docker)

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 1337

CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "1337:1337"
    environment:
      - DATABASE_CLIENT=postgres
      - DATABASE_HOST=postgres
      - DATABASE_PORT=5432
      - DATABASE_NAME=n8n_manage_system
      - DATABASE_USERNAME=postgres
      - DATABASE_PASSWORD=your_password
      - JWT_SECRET=your_jwt_secret
      - NODE_ENV=production
    depends_on:
      - postgres

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=n8n_manage_system
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=your_password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### 3. 前端部署

#### Vercel 生产部署

1. **配置生产环境变量**
   ```bash
   NEXT_PUBLIC_API_URL=https://your-production-backend.com
   NEXT_PUBLIC_APP_URL=https://your-production-domain.com
   NEXT_PUBLIC_AUTH_TOKEN_KEY=n8n_auth_token
   ```

2. **配置自定义域名**
   - 在 Vercel 中添加自定义域名
   - 配置 DNS 记录
   - 启用 HTTPS

3. **性能优化**
   - 启用 CDN
   - 配置缓存策略
   - 启用图片优化

### 4. 监控和日志

#### 错误监控 (Sentry)

1. 创建 Sentry 项目
2. 配置错误监控
3. 设置告警规则

#### 性能监控

1. 配置 Vercel Analytics
2. 设置 Core Web Vitals 监控
3. 配置 API 响应时间监控

#### 日志管理

1. 配置结构化日志
2. 设置日志轮转
3. 配置日志聚合

## 安全配置

### 1. 环境变量安全

- 使用强密码和密钥
- 定期轮换密钥
- 使用密钥管理服务

### 2. 数据库安全

- 启用 SSL 连接
- 配置防火墙规则
- 定期备份数据

### 3. 应用安全

- 启用 HTTPS
- 配置 CORS 策略
- 实施速率限制
- 启用 CSP 头

### 4. 监控和告警

- 配置系统监控
- 设置异常告警
- 监控 API 使用情况

## CI/CD 配置

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd backend && npm ci
      - run: cd backend && npm run build
      # 部署到 Railway 或其他平台

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd frontend && npm ci
      - run: cd frontend && npm run build
      # 部署到 Vercel
```

## 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查数据库配置
   - 验证网络连接
   - 确认防火墙设置

2. **CORS 错误**
   - 检查 CORS_ORIGIN 配置
   - 验证前端域名
   - 确认 HTTPS 设置

3. **JWT 认证失败**
   - 检查 JWT_SECRET 配置
   - 验证 Token 格式
   - 确认时间同步

4. **n8n API 连接失败**
   - 验证 n8n 实例 URL
   - 检查 API Key 配置
   - 确认 n8n 服务状态

### 调试工具

1. **后端调试**
   - 启用详细日志
   - 使用 Strapi 管理界面
   - 检查数据库连接

2. **前端调试**
   - 使用浏览器开发者工具
   - 检查网络请求
   - 验证环境变量

## 维护和更新

### 1. 定期维护

- 更新依赖包
- 备份数据库
- 清理日志文件
- 监控系统性能

### 2. 版本更新

- 测试新版本功能
- 准备回滚方案
- 更新文档
- 通知用户

### 3. 性能优化

- 监控响应时间
- 优化数据库查询
- 实施缓存策略
- 优化前端加载

## 备份和恢复

### 1. 数据库备份

```bash
# PostgreSQL 备份
pg_dump -h host -U username -d database > backup.sql

# 恢复备份
psql -h host -U username -d database < backup.sql
```

### 2. 文件备份

- 备份上传的文件
- 备份配置文件
- 备份日志文件

### 3. 恢复流程

1. 恢复数据库
2. 恢复文件
3. 验证系统功能
4. 通知用户

## 成本估算

### 月度成本 (预估)

- **Vercel**: $20-50 (取决于使用量)
- **Railway**: $5-20 (取决于资源使用)
- **Supabase**: $25-100 (取决于数据量和用户数)
- **监控服务**: $10-30
- **域名和 SSL**: $10-20

**总计**: $70-220/月

### 成本优化建议

1. 使用免费额度
2. 选择合适的套餐
3. 监控资源使用
4. 优化应用性能
