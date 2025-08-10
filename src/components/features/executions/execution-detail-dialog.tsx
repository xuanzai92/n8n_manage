'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Activity, Calendar, Clock, Server, Workflow, AlertCircle, CheckCircle } from 'lucide-react'
import { Execution } from '@/types'
import { formatDate } from '@/utils'

interface ExecutionDetailDialogProps {
  execution: Execution
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ExecutionDetailDialog({ execution, open, onOpenChange }: ExecutionDetailDialogProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'running':
        return <Activity className="h-4 w-4 text-blue-600 animate-spin" />
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />
    }
  }

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
        {getStatusIcon(status)}
        <span className="ml-1">{config.text}</span>
      </Badge>
    )
  }

  const formatDuration = (startedAt: string, finishedAt?: string) => {
    if (!finishedAt) return '-'
    const start = new Date(startedAt)
    const end = new Date(finishedAt)
    const duration = end.getTime() - start.getTime()
    return `${(duration / 1000).toFixed(2)}s`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>执行详情</span>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6">
            {/* 基本信息 */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center">
                <Workflow className="h-4 w-4 mr-2" />
                基本信息
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">执行ID</label>
                  <p className="font-mono text-sm">{execution.executionId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">状态</label>
                  <div className="mt-1">
                    {getStatusBadge(execution.status)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">工作流</label>
                  <p>{execution.workflow?.name || '未知工作流'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">实例</label>
                  <p className="flex items-center">
                    <Server className="h-3 w-3 mr-1" />
                    {execution.workflow?.instance?.name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">开始时间</label>
                  <p className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(execution.startedAt)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">结束时间</label>
                  <p className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {execution.finishedAt ? formatDate(execution.finishedAt) : '未完成'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">执行时长</label>
                  <p className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDuration(execution.startedAt, execution.finishedAt)}
                  </p>
                </div>
              </div>
            </Card>

            {/* 错误信息 */}
            {execution.error && (
              <Card className="p-4 border-red-200">
                <h3 className="font-semibold mb-3 flex items-center text-red-700">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  错误信息
                </h3>
                <div className="bg-red-50 p-3 rounded-md">
                  <pre className="text-sm text-red-800 whitespace-pre-wrap">{execution.error}</pre>
                </div>
              </Card>
            )}

            {/* 执行数据 */}
            {execution.data && (
              <Card className="p-4">
                <h3 className="font-semibold mb-3">执行数据</h3>
                <div className="bg-gray-50 p-3 rounded-md">
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap overflow-x-auto">
                    {JSON.stringify(execution.data, null, 2)}
                  </pre>
                </div>
              </Card>
            )}

            {/* 工作流信息 */}
            {execution.workflow && (
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center">
                  <Workflow className="h-4 w-4 mr-2" />
                  工作流信息
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">工作流ID</label>
                    <p className="font-mono text-sm">{execution.workflow.workflowId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">项目</label>
                    <p>{execution.workflow.project || '默认项目'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">标签</label>
                    <p>{execution.workflow.tags || '无标签'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">状态</label>
                    <Badge variant={execution.workflow.active ? 'default' : 'secondary'}>
                      {execution.workflow.active ? '启用' : '禁用'}
                    </Badge>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}