#!/bin/bash

# 修复 Strapi 版本问题的脚本

echo "🔧 修复 Strapi 版本问题..."

# 检查是否在项目根目录
if [ ! -f "backend/package.json" ]; then
    echo "❌ 请在项目根目录运行此脚本"
    exit 1
fi

# 备份原始文件
echo "📋 备份原始文件..."
cp backend/package.json backend/package.json.backup

# 更新 Strapi 版本
echo "🔄 更新 Strapi 版本到 4.20.0..."

# 使用 sed 更新版本号
sed -i.bak 's/"@strapi\/strapi": "4\.15\.0"/"@strapi\/strapi": "4.20.0"/g' backend/package.json
sed -i.bak 's/"@strapi\/plugin-users-permissions": "4\.15\.0"/"@strapi\/plugin-users-permissions": "4.20.0"/g' backend/package.json
sed -i.bak 's/"@strapi\/plugin-i18n": "4\.15\.0"/"@strapi\/plugin-i18n": "4.20.0"/g' backend/package.json
sed -i.bak 's/"eslint-config-strapi": "\^4\.15\.0"/"eslint-config-strapi": "^4.20.0"/g' backend/package.json
sed -i.bak 's/"eslint-plugin-strapi": "\^4\.15\.0"/"eslint-plugin-strapi": "^4.20.0"/g' backend/package.json

# 移除 @strapi/plugin-cloud 依赖
echo "🗑️  移除不必要的 @strapi/plugin-cloud 依赖..."
sed -i.bak '/"@strapi\/plugin-cloud": "4\.15\.0",/d' backend/package.json

# 移除不存在的 ESLint 配置包
echo "🗑️  移除不存在的 ESLint 配置包..."
sed -i.bak '/"eslint-config-strapi": "\^4\.20\.0",/d' backend/package.json
sed -i.bak '/"eslint-plugin-strapi": "\^4\.20\.0",/d' backend/package.json

# 清理临时文件
rm -f backend/package.json.bak

echo "✅ Strapi 版本修复完成！"
echo ""
echo "📋 修复内容："
echo "- 更新 Strapi 版本到 4.20.0"
echo "- 移除 @strapi/plugin-cloud 依赖"
echo "- 确保所有 Strapi 相关包版本一致"
echo ""
echo "🔄 现在可以重新安装依赖："
echo "cd backend && npm install"
echo ""
echo "💡 如果还有问题，可以恢复备份："
echo "cp backend/package.json.backup backend/package.json"
