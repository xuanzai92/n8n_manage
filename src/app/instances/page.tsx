'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Server, Edit, Trash2, TestTube, ExternalLink } from 'lucide-react'
import { Instance } from '@/types'
import { formatDate } from '@/utils'
import { InstanceForm } from '@/components/features/instances/instance-form'
import { DeleteInstanceDialog } from '@/components/features/instances/delete-instance-dialog'
import { TestConnectionDialog } from '@/components/features/instances/test-connection-dialog'

export default function InstancesPage() {
  const [instances, setInstances] = useState<Instance[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedInstance, setSelectedInstance] = useState<Instance | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showTestDialog, setShowTestDialog] = useState(false)

  // 获取实例列表
  const fetchInstances = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/instances')
      const data = await response.json()
      if (data.success) {
        setInstances(data.data)
      }
    } catch (error) {
      console.error('获取实例列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInstances()
  }, [])

  const handleCreateSuccess = () => {
    setShowCreateDialog(false)
    fetchInstances()
  }

  const handleEditSuccess = () => {
    setShowEditDialog(false)
    setSelectedInstance(null)
    fetchInstances()
  }

  const handleDeleteSuccess = () => {
    setShowDeleteDialog(false)
    setSelectedInstance(null)
    fetchInstances()
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">实例管理</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-full"></div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">实例管理</h1>
          <p className="text-gray-600">管理您的 n8n 实例连接</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              添加实例
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>添加 n8n 实例</DialogTitle>
            </DialogHeader>
            <InstanceForm onSuccess={handleCreateSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      {/* 实例列表 */}
      {instances.length === 0 ? (
        <Card className="p-12 text-center">
          <Server className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">暂无实例</h3>
          <p className="text-gray-600 mb-6">开始添加您的第一个 n8n 实例</p>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            添加实例
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {instances.map((instance) => (
            <Card key={instance.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Server className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{instance.name}</h3>
                    <p className="text-sm text-gray-600">{instance.apiBaseUrl}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-200">
                  活跃
                </Badge>
              </div>
              
              <div className="text-sm text-gray-600 mb-4">
                创建时间: {formatDate(instance.createdAt)}
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedInstance(instance)
                    setShowTestDialog(true)
                  }}
                >
                  <TestTube className="mr-1 h-3 w-3" />
                  测试
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedInstance(instance)
                    setShowEditDialog(true)
                  }}
                >
                  <Edit className="mr-1 h-3 w-3" />
                  编辑
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(instance.apiBaseUrl, '_blank')}
                >
                  <ExternalLink className="mr-1 h-3 w-3" />
                  访问
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedInstance(instance)
                    setShowDeleteDialog(true)
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 编辑对话框 */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑实例</DialogTitle>
          </DialogHeader>
          {selectedInstance && (
            <InstanceForm
              instance={selectedInstance}
              onSuccess={handleEditSuccess}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      {selectedInstance && (
        <DeleteInstanceDialog
          instance={selectedInstance}
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onSuccess={handleDeleteSuccess}
        />
      )}

      {/* 连接测试对话框 */}
      {selectedInstance && (
        <TestConnectionDialog
          instance={selectedInstance}
          open={showTestDialog}
          onOpenChange={setShowTestDialog}
        />
      )}
    </div>
  )
}