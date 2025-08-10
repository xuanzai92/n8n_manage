'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Instance } from '@/types'
import { Loader2, AlertTriangle } from 'lucide-react'

interface DeleteInstanceDialogProps {
  instance: Instance
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function DeleteInstanceDialog({
  instance,
  open,
  onOpenChange,
  onSuccess,
}: DeleteInstanceDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDelete = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/instances/${instance.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        onSuccess()
      } else {
        setError(data.error || '删除失败')
      }
    } catch (error) {
      setError('删除失败，请重试')
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
            <span>删除实例</span>
          </DialogTitle>
          <DialogDescription>
            确定要删除实例 &quot;{instance.name}&quot; 吗？
            <br />
            <span className="text-red-600 font-medium">
              此操作将同时删除该实例下的所有工作流和执行记录，且无法恢复。
            </span>
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

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