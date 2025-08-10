'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Trash2, Loader2 } from 'lucide-react'
import { Execution } from '@/types'
import { formatDate } from '@/utils'

interface DeleteExecutionDialogProps {
  execution: Execution
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function DeleteExecutionDialog({ execution, open, onOpenChange, onSuccess }: DeleteExecutionDialogProps) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/executions/${execution.id}`, {
        method: 'DELETE',
      })
      
      const data = await response.json()
      if (data.success) {
        onSuccess()
      } else {
        console.error('删除执行记录失败:', data.error)
      }
    } catch (error) {
      console.error('删除执行记录失败:', error)
    } finally {
      setLoading(false)
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
        {config.text}
      </Badge>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-red-700">
            <AlertTriangle className="h-5 w-5" />
            <span>删除执行记录</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-sm text-red-800 mb-3">
              您确定要删除这条执行记录吗？此操作无法撤销。
            </p>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">执行ID:</span>
                <span className="font-mono">{execution.executionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">工作流:</span>
                <span>{execution.workflow?.name || '未知工作流'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">实例:</span>
                <span>{execution.workflow?.instance?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">状态:</span>
                {getStatusBadge(execution.status)}
              </div>
              <div className="flex justify-between">
                <span className="font-medium">开始时间:</span>
                <span>{formatDate(execution.startedAt)}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <strong>注意:</strong> 删除执行记录将永久移除所有相关数据，包括执行日志和结果数据。
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            取消
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                删除中...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                确认删除
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}