'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Workflow as WorkflowIcon, Play, Pause, Edit, Trash2, Filter } from 'lucide-react'
import { Workflow, Instance } from '@/types'
import { formatDate } from '@/utils'
import { WorkflowForm } from '@/components/features/workflows/workflow-form'
import { DeleteWorkflowDialog } from '@/components/features/workflows/delete-workflow-dialog'

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [instances, setInstances] = useState<Instance[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  
  // 筛选状态
  const [filters, setFilters] = useState<WorkflowFilters>({
    search: '',
    instanceId: 'all',
    active: 'all',
    project: '',
  })

  // 获取实例列表
  const fetchInstances = async () => {
    try {
      const response = await fetch('/api/instances')
      const data = await response.json()
      if (data.success) {
        setInstances(data.data)
      }
    } catch (error) {
      console.error('获取实例列表失败:', error)
    }
  }

  // 获取工作流列表
  const fetchWorkflows = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.instanceId) params.append('instanceId', filters.instanceId)
      if (filters.active) params.append('active', filters.active)
      if (filters.project) params.append('project', filters.project)
      
      const response = await fetch(`/api/workflows?${params}`)
      const data = await response.json()
      if (data.success) {
        setWorkflows(data.data)
      }
    } catch (error) {
      console.error('获取工作流列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInstances()
  }, [])

  useEffect(() => {
    fetchWorkflows()
  }, [filters])

  const handleCreateSuccess = () => {
    setShowCreateDialog(false)
    fetchWorkflows()
  }

  const handleEditSuccess = () => {
    setShowEditDialog(false)
    setSelectedWorkflow(null)
    fetchWorkflows()
  }

  const handleDeleteSuccess = () => {
    setShowDeleteDialog(false)
    setSelectedWorkflow(null)
    fetchWorkflows()
  }

  const toggleWorkflowStatus = async (workflow: Workflow) => {
    try {
      const response = await fetch(`/api/workflows/${workflow.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !workflow.active })
      })
      
      if (response.ok) {
        fetchWorkflows()
      }
    } catch (error) {
      console.error('切换工作流状态失败:', error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">工作流管理</h1>
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
          <h1 className="text-2xl font-bold text-gray-900">工作流管理</h1>
          <p className="text-gray-600">管理您的 n8n 工作流</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              添加工作流
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>添加工作流</DialogTitle>
            </DialogHeader>
            <WorkflowForm instances={instances} onSuccess={handleCreateSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      {/* 筛选器 */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="搜索工作流名称或ID..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
          <Select
            value={filters.instanceId}
            onValueChange={(value) => setFilters(prev => ({ ...prev, instanceId: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择实例" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有实例</SelectItem>
              {instances.map((instance) => (
                <SelectItem key={instance.id} value={instance.id.toString()}>
                  {instance.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.active}
            onValueChange={(value) => setFilters(prev => ({ ...prev, active: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有状态</SelectItem>
              <SelectItem value="true">活跃</SelectItem>
              <SelectItem value="false">非活跃</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="项目名称..."
            value={filters.project}
            onChange={(e) => setFilters(prev => ({ ...prev, project: e.target.value }))}
          />
        </div>
      </Card>

      {/* 工作流列表 */}
      {workflows.length === 0 ? (
        <Card className="p-12 text-center">
          <WorkflowIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">暂无工作流</h3>
          <p className="text-gray-600 mb-6">开始添加您的第一个工作流</p>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            添加工作流
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflows.map((workflow) => (
            <Card key={workflow.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <WorkflowIcon className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{workflow.name}</h3>
                    <p className="text-sm text-gray-600">{workflow.workflowId}</p>
                  </div>
                </div>
                <Badge 
                  variant={workflow.active ? "default" : "secondary"}
                  className={workflow.active ? "bg-green-100 text-green-800" : ""}
                >
                  {workflow.active ? '活跃' : '非活跃'}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div>实例: {workflow.instance?.name}</div>
                {workflow.project && <div>项目: {workflow.project}</div>}
                {workflow.tags && <div>标签: {workflow.tags}</div>}
                <div>执行次数: {workflow._count?.executions || 0}</div>
                <div>更新时间: {formatDate(workflow.updatedAt)}</div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleWorkflowStatus(workflow)}
                >
                  {workflow.active ? (
                    <><Pause className="mr-1 h-3 w-3" />暂停</>
                  ) : (
                    <><Play className="mr-1 h-3 w-3" />启用</>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedWorkflow(workflow)
                    setShowEditDialog(true)
                  }}
                >
                  <Edit className="mr-1 h-3 w-3" />
                  编辑
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedWorkflow(workflow)
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
            <DialogTitle>编辑工作流</DialogTitle>
          </DialogHeader>
          {selectedWorkflow && (
            <WorkflowForm
              workflow={selectedWorkflow}
              instances={instances}
              onSuccess={handleEditSuccess}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      {selectedWorkflow && (
        <DeleteWorkflowDialog
          workflow={selectedWorkflow}
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  )
}