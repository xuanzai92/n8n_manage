#!/bin/bash

# 修复 sharp 模块的脚本

echo "🔧 修复 sharp 模块..."

cd backend

# 方案1: 重新安装 sharp
echo "📦 方案1: 重新安装 sharp..."
npm uninstall sharp
npm install sharp --ignore-scripts=false

if [ $? -eq 0 ]; then
    echo "✅ sharp 安装成功！"
    exit 0
fi

# 方案2: 使用预构建版本
echo "📦 方案2: 使用预构建版本..."
npm uninstall sharp
npm install sharp --platform=darwin --arch=arm64v8

if [ $? -eq 0 ]; then
    echo "✅ sharp 预构建版本安装成功！"
    exit 0
fi

# 方案3: 禁用图片处理插件
echo "📦 方案3: 禁用图片处理功能..."
echo "💡 这将禁用图片上传和处理功能，但其他功能正常"

# 创建禁用图片插件的配置
cat > config/plugins.js << 'EOF'
module.exports = {
  upload: {
    config: {
      provider: 'local',
      providerOptions: {
        sizeLimit: 100000,
      },
    },
  },
  'strapi-plugin-upload': {
    enabled: false,
  },
};
EOF

echo "✅ 已禁用图片处理插件"
echo "💡 现在可以启动 Strapi，但图片上传功能将被禁用"

cd ..
