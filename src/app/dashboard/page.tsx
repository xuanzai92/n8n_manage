'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Server, Workflow, Activity, CheckCircle, TrendingUp, Clock, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/utils'

interface DashboardStats {
  overview: {
    totalInstances: number
    activeInstances: number
    totalWorkflows: number
    activeWorkflows: number
    todayExecutions: number
    successRate: string
  }
  dailyStats: Array<{
    date: string
    total: number
    success: number
    error: number
  }>
  instanceStats: Array<{
    status: string
    count: number
  }>
  recentExecutions: Array<{
    id: number
    executionId: string
    status: string
    startedAt: string
    workflow?: {
      name: string
      instance?: {
        name: string
      }
    }
  }>
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/dashboard/stats')
      
      // 添加这个检查
      if (!response.ok) {
        const text = await response.text()
        console.error('API响应错误:', text)
        return
      }
      
      const data = await response.json()
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('获取仪表板数据失败:', error)
      // 添加更详细的错误信息
      if (error instanceof SyntaxError) {
        console.error('JSON解析错误，可能API返回了HTML页面')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      success: { variant: 'default' as const, className: 'bg-green-100 text-green-800', text: '成功' },
      error: { variant: 'destructive' as const, className: '', text: '失败' },
      waiting: { variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800', text: '等待中' },
      running: { variant: 'default' as const, className: 'bg-blue-100 text-blue-800', text: '运行中' },
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.waiting
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.text}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">仪表板</h1>
          <p className="text-gray-600">n8n 实例统一管理概览</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">仪表板</h1>
        <p className="text-gray-600">n8n 实例统一管理概览</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">总实例数</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.overview.totalInstances || 0}</p>
              <p className="text-xs text-gray-500 mt-1">
                活跃: {stats?.overview.activeInstances || 0}
              </p>
            </div>
            <Server className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">工作流</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.overview.totalWorkflows || 0}</p>
              <p className="text-xs text-gray-500 mt-1">
                活跃: {stats?.overview.activeWorkflows || 0}
              </p>
            </div>
            <Workflow className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">今日执行</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.overview.todayExecutions || 0}</p>
              <p className="text-xs text-gray-500 mt-1">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                执行次数
              </p>
            </div>
            <Activity className="h-8 w-8 text-purple-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">今日成功率</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.overview.successRate || '--'}</p>
              <p className="text-xs text-gray-500 mt-1">
                执行成功率
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-emerald-600" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最近7天执行趋势 */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">最近7天执行趋势</h2>
          <div className="space-y-3">
            {stats?.dailyStats.map((day, index) => (
              <div key={day.date} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600 w-16">
                    {index === 6 ? '今天' : new Date(day.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">{day.success}</span>
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-red-600">{day.error}</span>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">{day.total}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* 最近执行记录 */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">最近执行</h2>
            <Link href="/executions">
              <Button variant="outline" size="sm">
                查看全部
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {stats?.recentExecutions.length === 0 ? (
              <p className="text-gray-500 text-center py-4">暂无执行记录</p>
            ) : (
              stats?.recentExecutions.map((execution) => (
                <div key={execution.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Activity className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {execution.workflow?.name || '未知工作流'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {execution.workflow?.instance?.name} • {formatDate(execution.startedAt)}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(execution.status)}
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* 实例状态分布 */}
      {stats?.instanceStats && stats.instanceStats.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">实例状态分布</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.instanceStats.map((stat) => (
              <div key={stat.status} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                <p className="text-sm text-gray-600 capitalize">
                  {stat.status === 'active' ? '活跃' : stat.status === 'inactive' ? '非活跃' : '错误'}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 快速操作 */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">快速开始</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/instances" className="block">
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="flex items-center space-x-3 mb-2">
                <Server className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium text-gray-900">管理实例</h3>
              </div>
              <p className="text-sm text-gray-600">添加和管理 n8n 实例</p>
            </div>
          </Link>
          
          <Link href="/workflows" className="block">
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="flex items-center space-x-3 mb-2">
                <Workflow className="h-5 w-5 text-green-600" />
                <h3 className="font-medium text-gray-900">工作流管理</h3>
              </div>
              <p className="text-sm text-gray-600">查看和管理工作流</p>
            </div>
          </Link>
          
          <Link href="/executions" className="block">
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="flex items-center space-x-3 mb-2">
                <Activity className="h-5 w-5 text-purple-600" />
                <h3 className="font-medium text-gray-900">执行记录</h3>
              </div>
              <p className="text-sm text-gray-600">监控执行状态和历史</p>
            </div>
          </Link>
        </div>
      </Card>
    </div>
  )
}