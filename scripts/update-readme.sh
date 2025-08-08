#!/bin/bash

# 更新 README.md 中的项目信息

echo "📝 更新 README.md..."

# 获取当前日期
CURRENT_DATE=$(date +"%Y-%m-%d")

# 更新 README.md
sed -i.bak "s/版本: 1.0.0/版本: 1.0.0 (更新于 $CURRENT_DATE)/" README.md

echo "✅ README.md 已更新"
