#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 运行 postinstall 脚本...');

try {
  // 检查是否在 macOS ARM64 架构上
  const platform = process.platform;
  const arch = process.arch;
  
  console.log(`检测到平台: ${platform} ${arch}`);
  
  if (platform === 'darwin' && arch === 'arm64') {
    console.log('检测到 macOS ARM64，尝试修复 sharp 安装...');
    
    // 尝试重新安装 sharp
    try {
      console.log('重新安装 sharp...');
      execSync('npm rebuild sharp', { stdio: 'inherit' });
    } catch (error) {
      console.log('sharp 重新安装失败，尝试使用预构建版本...');
      try {
        execSync('npm install sharp --ignore-scripts', { stdio: 'inherit' });
      } catch (error2) {
        console.log('sharp 安装失败，但可以继续使用其他功能...');
      }
    }
  }
  
  console.log('✅ postinstall 脚本完成');
} catch (error) {
  console.error('❌ postinstall 脚本失败:', error.message);
  // 不退出，让安装继续
}
