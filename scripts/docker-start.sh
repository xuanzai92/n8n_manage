#!/bin/bash

# n8n 管理系统 Docker 启动脚本

set -e

echo "🚀 启动 n8n 管理系统 Docker 环境..."

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

# 检查 Docker Compose 是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose 未安装，请先安装 Docker Compose"
    exit 1
fi

# 检查 Docker 是否运行
if ! docker info &> /dev/null; then
    echo "❌ Docker 未运行，请启动 Docker"
    exit 1
fi

echo "📦 构建 Docker 镜像..."
docker-compose build

echo "🔄 启动服务..."
docker-compose up -d

echo "⏳ 等待服务启动..."
sleep 10

# 检查服务状态
echo "🔍 检查服务状态..."
docker-compose ps

echo "✅ 服务启动完成！"
echo ""
echo "🌐 访问地址："
echo "  前端: http://localhost:3000"
echo "  后端管理: http://localhost:1337/admin"
echo "  数据库: localhost:5432"
echo ""
echo "📋 常用命令："
echo "  查看日志: docker-compose logs -f"
echo "  停止服务: docker-compose down"
echo "  重启服务: docker-compose restart"
echo "  清理数据: docker-compose down -v"
