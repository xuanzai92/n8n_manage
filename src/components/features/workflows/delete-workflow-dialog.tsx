'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Loader2, AlertTriangle } from 'lucide-react'
import { Workflow } from '@/types'

interface DeleteWorkflowDialogProps {
  workflow: Workflow
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function DeleteWorkflowDialog({
  workflow,
  open,
  onOpenChange,
  onSuccess,
}: DeleteWorkflowDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDelete = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/workflows/${workflow.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        onSuccess()
      } else {
        setError(data.error || '删除失败')
      }
    } catch (error) {
      setError('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span>删除工作流</span>
          </DialogTitle>
          <DialogDescription>
            您确定要删除工作流 "{workflow.name}" 吗？
            <br />
            <span className="text-red-600 font-medium">
              此操作将同时删除该工作流的所有执行记录，且无法撤销。
            </span>
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-md">
          <div className="text-sm space-y-1">
            <div><span className="font-medium">工作流名称:</span> {workflow.name}</div>
            <div><span className="font-medium">工作流 ID:</span> {workflow.workflowId}</div>
            <div><span className="font-medium">所属实例:</span> {workflow.instance?.name}</div>
            {workflow.project && (
              <div><span className="font-medium">项目:</span> {workflow.project}</div>
            )}
            <div><span className="font-medium">执行次数:</span> {workflow._count?.executions || 0}</div>
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
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            确认删除
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}