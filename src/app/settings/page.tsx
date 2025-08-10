'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Settings, Bell, Database, Shield, Download, Upload } from 'lucide-react'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    autoRefresh: true,
    refreshInterval: 30,
    notifications: true,
    emailNotifications: false,
    dataRetention: 30,
    maxExecutions: 1000
  })

  const handleSave = async () => {
    // 保存设置逻辑
    console.log('保存设置:', settings)
  }

  const handleExport = () => {
    // 导出数据逻辑
    console.log('导出数据')
  }

  const handleImport = () => {
    // 导入数据逻辑
    console.log('导入数据')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">系统设置</h1>
        <p className="text-gray-600">配置系统参数和偏好设置</p>
      </div>

      {/* 常规设置 */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Settings className="h-5 w-5" />
          <h2 className="text-lg font-semibold">常规设置</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-refresh">自动刷新</Label>
              <p className="text-sm text-gray-500">启用数据自动刷新功能</p>
            </div>
            <Switch
              id="auto-refresh"
              checked={settings.autoRefresh}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoRefresh: checked }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="refresh-interval">刷新间隔（秒）</Label>
            <Input
              id="refresh-interval"
              type="number"
              value={settings.refreshInterval}
              onChange={(e) => setSettings(prev => ({ ...prev, refreshInterval: parseInt(e.target.value) }))}
              className="w-32"
            />
          </div>
        </div>
      </Card>

      {/* 通知设置 */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Bell className="h-5 w-5" />
          <h2 className="text-lg font-semibold">通知设置</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notifications">浏览器通知</Label>
              <p className="text-sm text-gray-500">启用浏览器推送通知</p>
            </div>
            <Switch
              id="notifications"
              checked={settings.notifications}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, notifications: checked }))}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications">邮件通知</Label>
              <p className="text-sm text-gray-500">发送执行失败邮件通知</p>
            </div>
            <Switch
              id="email-notifications"
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
            />
          </div>
        </div>
      </Card>

      {/* 数据管理 */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Database className="h-5 w-5" />
          <h2 className="text-lg font-semibold">数据管理</h2>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="data-retention">数据保留天数</Label>
            <Input
              id="data-retention"
              type="number"
              value={settings.dataRetention}
              onChange={(e) => setSettings(prev => ({ ...prev, dataRetention: parseInt(e.target.value) }))}
              className="w-32"
            />
            <p className="text-sm text-gray-500">执行记录保留天数，超过将自动清理</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="max-executions">最大执行记录数</Label>
            <Input
              id="max-executions"
              type="number"
              value={settings.maxExecutions}
              onChange={(e) => setSettings(prev => ({ ...prev, maxExecutions: parseInt(e.target.value) }))}
              className="w-32"
            />
            <p className="text-sm text-gray-500">单个工作流最大执行记录数</p>
          </div>
          
          <Separator />
          
          <div className="flex space-x-4">
            <Button onClick={handleExport} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              导出数据
            </Button>
            <Button onClick={handleImport} variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              导入数据
            </Button>
          </div>
        </div>
      </Card>

      {/* 系统信息 */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="h-5 w-5" />
          <h2 className="text-lg font-semibold">系统信息</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>版本信息</Label>
            <p className="text-sm text-gray-600">v1.0.0</p>
          </div>
          <div>
            <Label>数据库状态</Label>
            <Badge variant="default" className="bg-green-100 text-green-800">正常</Badge>
          </div>
          <div>
            <Label>最后更新</Label>
            <p className="text-sm text-gray-600">{new Date().toLocaleString()}</p>
          </div>
          <div>
            <Label>运行时间</Label>
            <p className="text-sm text-gray-600">2天 3小时 45分钟</p>
          </div>
        </div>
      </Card>

      {/* 保存按钮 */}
      <div className="flex justify-end">
        <Button onClick={handleSave}>
          保存设置
        </Button>
      </div>
    </div>
  )
}