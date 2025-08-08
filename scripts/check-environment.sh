#!/bin/bash

# 环境检查和修复脚本

echo "🔍 检查开发环境..."

# 检查 Node.js 版本
echo "📋 检查 Node.js 版本..."
NODE_VERSION=$(node -v | cut -d'v' -f2)
NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1)

echo "当前 Node.js 版本: $NODE_VERSION"

if [ "$NODE_MAJOR" -lt 18 ]; then
    echo "❌ Node.js 版本过低，需要 18+ 版本"
    echo "💡 建议使用 nvm 安装 Node.js 18:"
    echo "   nvm install 18"
    echo "   nvm use 18"
    exit 1
elif [ "$NODE_MAJOR" -gt 20 ]; then
    echo "⚠️  Node.js 版本过高 ($NODE_VERSION)，Strapi 4.20.0 推荐使用 18-20 版本"
    echo "💡 建议使用 nvm 切换到 Node.js 20:"
    echo "   nvm install 20"
    echo "   nvm use 20"
    echo ""
    echo "是否继续安装？(y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "安装已取消"
        exit 1
    fi
else
    echo "✅ Node.js 版本检查通过"
fi

# 检查 Xcode 命令行工具
echo ""
echo "📋 检查 Xcode 命令行工具..."
if ! command -v xcodebuild &> /dev/null; then
    echo "❌ 未找到 Xcode 命令行工具"
    echo "💡 请安装 Xcode 命令行工具:"
    echo "   xcode-select --install"
    echo ""
    echo "安装完成后重新运行此脚本"
    exit 1
else
    echo "✅ Xcode 命令行工具已安装"
fi

# 检查 Homebrew
echo ""
echo "📋 检查 Homebrew..."
if ! command -v brew &> /dev/null; then
    echo "⚠️  Homebrew 未安装，某些依赖可能需要手动安装"
else
    echo "✅ Homebrew 已安装"
fi

# 检查 Python
echo ""
echo "📋 检查 Python..."
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 未安装"
    echo "💡 请安装 Python 3:"
    echo "   brew install python@3"
    exit 1
else
    echo "✅ Python 3 已安装"
fi

echo ""
echo "✅ 环境检查完成！"
echo ""
echo "🔄 现在可以安装依赖："
echo "cd backend && npm install"
echo ""
echo "💡 如果遇到编译问题，可以尝试："
echo "   npm install --ignore-scripts"
echo "   或者使用 Docker 开发环境"
