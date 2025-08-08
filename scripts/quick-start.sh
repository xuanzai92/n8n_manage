#!/bin/bash

# n8n 管理平台快速启动脚本

set -e

echo "🚀 n8n 管理平台快速启动"
echo "================================"

# 检查 Node.js 版本
echo "📋 检查环境..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js 18+"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2)
NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1)
echo "当前 Node.js 版本: $NODE_VERSION"

if [ "$NODE_MAJOR" -lt 18 ]; then
    echo "❌ Node.js 版本过低，需要 18+ 版本"
    exit 1
elif [ "$NODE_MAJOR" -gt 20 ]; then
    echo "⚠️  Node.js 版本过高 ($NODE_VERSION)，Strapi 推荐使用 18-20 版本"
    echo "💡 建议使用 nvm 切换到 Node.js 20:"
    echo "   nvm install 20"
    echo "   nvm use 20"
    echo ""
    echo "是否继续？(y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "安装已取消"
        exit 1
    fi
else
    echo "✅ Node.js 版本检查通过"
fi

# 检查 Docker
if command -v docker &> /dev/null; then
    echo "✅ Docker 已安装"
    USE_DOCKER=true
else
    echo "⚠️  Docker 未安装，将使用本地环境"
    USE_DOCKER=false
fi

# 安装依赖
echo ""
echo "📦 安装依赖..."
if [ ! -d "node_modules" ]; then
    npm install
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "安装前端依赖..."
    cd frontend && npm install && cd ..
fi

if [ ! -d "backend/node_modules" ]; then
    echo "安装后端依赖..."
    chmod +x scripts/install-backend.sh
    ./scripts/install-backend.sh
fi

# 创建环境变量文件
echo ""
echo "⚙️  配置环境变量..."

if [ ! -f "frontend/.env.local" ]; then
    echo "创建前端环境变量文件..."
    cp frontend/.env.example frontend/.env.local
fi

if [ ! -f "backend/.env" ]; then
    echo "创建后端环境变量文件..."
    cp backend/.env.example backend/.env
fi

# 启动服务
echo ""
echo "🎯 启动服务..."

if [ "$USE_DOCKER" = true ]; then
    echo "使用 Docker 启动..."
    docker-compose up -d
    echo ""
    echo "✅ 服务已启动！"
    echo "📱 前端: http://localhost:3000"
    echo "🔧 后端管理: http://localhost:1337/admin"
    echo ""
    echo "💡 提示："
    echo "- 首次访问后端管理界面需要创建管理员账户"
    echo "- 前端需要配置 n8n 实例才能正常工作"
    echo "- 查看日志: docker-compose logs -f"
    echo "- 停止服务: docker-compose down"
else
    echo "使用本地环境启动..."
    echo ""
    echo "请手动启动服务："
    echo "1. 启动后端: cd backend && npm run develop"
    echo "2. 启动前端: cd frontend && npm run dev"
    echo ""
    echo "或者使用: npm run dev"
fi

echo ""
echo "📚 相关文档："
echo "- 开发指南: docs/development/development-guide.md"
echo "- API 设计: docs/api/api-design.md"
echo "- 部署指南: docs/deployment/deployment-guide.md"
echo "- 开发路径: docs/development/roadmap.md"
echo ""
echo "🎉 项目启动完成！"
