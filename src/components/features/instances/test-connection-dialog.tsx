'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Instance } from '@/types'
import { Loader2, CheckCircle, XCircle, TestTube } from 'lucide-react'

interface TestConnectionDialogProps {
  instance: Instance
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface TestResult {
  status: 'success' | 'error'
  message: string
  details?: string
  responseTime?: number
}

export function TestConnectionDialog({
  instance,
  open,
  onOpenChange,
}: TestConnectionDialogProps) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<TestResult | null>(null)

  const handleTest = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch(`/api/instances/${instance.id}/test`, {
        method: 'POST',
      })

      const data = await response.json()
      setResult(data.data || data)
    } catch (error) {
      setResult({
        status: 'error',
        message: '测试请求失败',
        details: error instanceof Error ? error.message : '未知错误'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setResult(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <TestTube className="h-5 w-5 text-blue-600" />
            <span>连接测试</span>
          </DialogTitle>
          <DialogDescription>
            测试与实例 "{instance.name}" 的连接状态
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 space-y-1">
              <div><strong>实例名称:</strong> {instance.name}</div>
              <div><strong>API 地址:</strong> {instance.apiBaseUrl}</div>
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">正在测试连接...</span>
            </div>
          )}

          {result && (
            <div className={`p-4 rounded-lg border ${
              result.status === 'success' 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                {result.status === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span className={`font-medium ${
                  result.status === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {result.message}
                </span>
              </div>
              
              {result.responseTime && (
                <div className="text-sm text-green-700">
                  响应时间: {Date.now() - result.responseTime}ms
                </div>
              )}
              
              {result.details && (
                <div className="mt-2 text-sm text-gray-600">
                  <strong>详细信息:</strong>
                  <pre className="mt-1 p-2 bg-white rounded text-xs overflow-auto">
                    {result.details}
                  </pre>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleClose}>
              关闭
            </Button>
            <Button onClick={handleTest} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {result ? '重新测试' : '开始测试'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}