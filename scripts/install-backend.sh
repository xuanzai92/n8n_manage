#!/bin/bash

# 后端安装脚本，处理 sharp 等原生模块问题

echo "🔧 安装后端依赖..."

cd backend

# 清理之前的安装
echo "🧹 清理之前的安装..."
rm -rf node_modules package-lock.json

# 尝试正常安装
echo "📦 尝试正常安装..."
if npm install; then
    echo "✅ 安装成功！"
else
    echo "⚠️  正常安装失败，尝试忽略脚本安装..."
    
    # 使用 --ignore-scripts 安装
    if npm install --ignore-scripts; then
        echo "✅ 忽略脚本安装成功！"
        echo ""
        echo "💡 注意：某些功能可能受限，但基本功能可用"
    else
        echo "❌ 安装失败"
        echo ""
        echo "🔧 尝试修复 sharp 模块..."
        chmod +x ../scripts/fix-sharp.sh
        ../scripts/fix-sharp.sh
        
        if [ $? -eq 0 ]; then
            echo "✅ sharp 修复成功！"
        else
            echo "❌ sharp 修复失败"
            echo ""
            echo "🔧 尝试其他解决方案："
            echo "1. 安装 Xcode 命令行工具："
            echo "   xcode-select --install"
            echo ""
            echo "2. 使用 Docker 开发环境："
            echo "   docker-compose up -d"
            echo ""
            echo "3. 使用 Node.js 20 版本："
            echo "   nvm install 20"
            echo "   nvm use 20"
            echo "   npm install"
            exit 1
        fi
    fi
fi

cd ..

echo ""
echo "✅ 后端安装完成！"
echo ""
echo "🚀 现在可以启动后端："
echo "cd backend && npm run develop"
