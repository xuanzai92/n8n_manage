#!/bin/bash

# n8n 管理平台项目初始化脚本

set -e

echo "🚀 开始初始化 n8n 管理平台项目..."

# 创建目录结构
echo "📁 创建项目目录结构..."
mkdir -p frontend/src/{app,components,hooks,lib,types,utils}
mkdir -p frontend/public
mkdir -p backend/src/{api,components,extensions,plugins,policies}
mkdir -p backend/config
mkdir -p docs/{api,deployment,development}
mkdir -p scripts

# 创建前端基础文件
echo "📝 创建前端基础文件..."

# 创建 Next.js 配置文件
cat > frontend/next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
}

module.exports = nextConfig
EOF

# 创建 TypeScript 配置
cat > frontend/tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"],
      "@/utils/*": ["./src/utils/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF

# 创建 ESLint 配置
cat > frontend/.eslintrc.json << 'EOF'
{
  "extends": ["next/core-web-vitals", "next/typescript"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
EOF

# 创建 Prettier 配置
cat > frontend/.prettierrc << 'EOF'
{
  "semi": false,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
EOF

# 创建环境变量模板
cat > frontend/.env.example << 'EOF'
# API 配置
NEXT_PUBLIC_API_URL=http://localhost:1337
NEXT_PUBLIC_APP_URL=http://localhost:3000

# 认证配置
NEXT_PUBLIC_AUTH_TOKEN_KEY=n8n_auth_token
EOF

# 创建后端基础文件
echo "📝 创建后端基础文件..."

# 创建 Strapi 配置文件
cat > backend/config/database.js << 'EOF'
module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', 'localhost'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'n8n_manage_system'),
      user: env('DATABASE_USERNAME', 'postgres'),
      password: env('DATABASE_PASSWORD', ''),
      ssl: env.bool('DATABASE_SSL', false) ? {
        rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
      } : false,
    },
  },
});
EOF

# 创建服务器配置
cat > backend/config/server.js << 'EOF'
module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});
EOF

# 创建中间件配置
cat > backend/config/middlewares.js << 'EOF'
module.exports = [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'https:'],
          'media-src': ["'self'", 'data:', 'blob:', 'https:'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
EOF

# 创建环境变量模板
cat > backend/.env.example << 'EOF'
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
EOF

# 创建 Docker 配置
echo "🐳 创建 Docker 配置..."

cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: n8n_manage_system
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

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
      - DATABASE_PASSWORD=postgres
      - JWT_SECRET=your_jwt_secret_key
      - APP_KEYS=your_app_keys
      - API_TOKEN_SALT=your_api_token_salt
      - ADMIN_JWT_SECRET=your_admin_jwt_secret
      - HOST=0.0.0.0
      - PORT=1337
      - NODE_ENV=development
      - CORS_ORIGIN=http://localhost:3000
    depends_on:
      - postgres
    volumes:
      - ./backend:/app
      - /app/node_modules

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:1337
      - NEXT_PUBLIC_APP_URL=http://localhost:3000
      - NEXT_PUBLIC_AUTH_TOKEN_KEY=n8n_auth_token
    depends_on:
      - backend
    volumes:
      - ./frontend:/app
      - /app/node_modules

volumes:
  postgres_data:
EOF

# 创建 Git 忽略文件
echo "📝 创建 Git 忽略文件..."

cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
.next/
out/
build/
dist/

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output/

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# Strapi
.tmp/
.cache/
exports/
*.cache

# Database
*.db
*.sqlite
*.sqlite3

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
EOF

# 创建 README 更新脚本
cat > scripts/update-readme.sh << 'EOF'
#!/bin/bash

# 更新 README.md 中的项目信息

echo "📝 更新 README.md..."

# 获取当前日期
CURRENT_DATE=$(date +"%Y-%m-%d")

# 更新 README.md
sed -i.bak "s/版本: 1.0.0/版本: 1.0.0 (更新于 $CURRENT_DATE)/" README.md

echo "✅ README.md 已更新"
EOF

chmod +x scripts/update-readme.sh

# 创建开发日志
echo "📝 创建开发日志..."

cat > log.md << 'EOF'
# 开发日志

## 2024-01-01 - 项目初始化

### 完成的工作
- [x] 创建项目目录结构
- [x] 配置前端开发环境 (Next.js + TypeScript)
- [x] 配置后端开发环境 (Strapi)
- [x] 创建 Docker 开发环境
- [x] 设置 Git 忽略文件
- [x] 创建环境变量模板
- [x] 配置 ESLint 和 Prettier

### 下一步计划
- [ ] 初始化 Strapi 项目
- [ ] 创建数据模型
- [ ] 设置用户认证
- [ ] 创建前端基础组件

### 技术决策
- 使用 Next.js 14 作为前端框架
- 使用 Strapi 4.x 作为后端 CMS
- 使用 PostgreSQL 作为数据库
- 使用 Docker Compose 进行本地开发

### 遇到的问题
- 无

### 解决方案
- 无

---
EOF

echo "✅ 项目初始化完成！"
echo ""
echo "📋 下一步操作："
echo "1. 运行 'npm install' 安装依赖"
echo "2. 配置环境变量文件"
echo "3. 启动开发环境：'npm run dev'"
echo ""
echo "📚 相关文档："
echo "- 开发指南: docs/development/development-guide.md"
echo "- API 设计: docs/api/api-design.md"
echo "- 部署指南: docs/deployment/deployment-guide.md"
echo "- 开发路径: docs/development/roadmap.md"
echo ""
echo "🚀 开始开发吧！"
