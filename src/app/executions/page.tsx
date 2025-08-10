'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Activity, Search, Filter, Trash2, Eye, Calendar, Clock } from 'lucide-react'
import { Execution, Instance, Workflow, ExecutionFilters, ExecutionPagination } from '@/types'
import { formatDate } from '@/utils'
import { ExecutionDetailDialog } from '@/components/features/executions/execution-detail-dialog'
import { DeleteExecutionDialog } from '@/components/features/executions/delete-execution-dialog'

export default function ExecutionsPage() {
  const [executions, setExecutions] = useState<Execution[]>([])
  const [instances, setInstances] = useState<Instance[]>([])
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<ExecutionPagination>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  })
  const [filters, setFilters] = useState<ExecutionFilters>({})
  const [selectedExecution, setSelectedExecution] = useState<Execution | null>(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const fetchExecutions = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value && value !== 'all')
        )
      })

      const response = await fetch(`/api/executions?${params}`)
      const data = await response.json()
      if (data.success) {
        setExecutions(data.data)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('获取执行记录失败:', error)
    } finally {
      setLoading(false)
    }
  }

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

  const fetchWorkflows = async () => {
    try {
      const response = await fetch('/api/workflows')
      const data = await response.json()
      if (data.success) {
        setWorkflows(data.data)
      }
    } catch (error) {
      console.error('获取工作流列表失败:', error)
    }
  }

  useEffect(() => {
    fetchInstances()
    fetchWorkflows()
  }, [])

  useEffect(() => {
    fetchExecutions()
  }, [pagination.page, filters])

  const handleDeleteSuccess = () => {
    setShowDeleteDialog(false)
    setSelectedExecution(null)
    fetchExecutions()
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

  const formatDuration = (startedAt: string, finishedAt?: string) => {
    if (!finishedAt) return '-'
    const start = new Date(startedAt)
    const end = new Date(finishedAt)
    const duration = end.getTime() - start.getTime()
    return `${(duration / 1000).toFixed(2)}s`
  }

  if (loading && executions.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">执行记录</h1>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">执行记录</h1>
          <p className="text-gray-600">查看工作流执行历史和状态</p>
        </div>
      </div>

      {/* 筛选器 */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Select
            value={filters.instanceId || 'all'}
            onValueChange={(value) => setFilters(prev => ({ ...prev, instanceId: value === 'all' ? undefined : value }))}
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
            value={filters.workflowId || 'all'}
            onValueChange={(value) => setFilters(prev => ({ ...prev, workflowId: value === 'all' ? undefined : value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择工作流" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有工作流</SelectItem>
              {workflows.map((workflow) => (
                <SelectItem key={workflow.id} value={workflow.id.toString()}>
                  {workflow.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={filters.status || 'all'}
            onValueChange={(value) => setFilters(prev => ({ ...prev, status: value === 'all' ? undefined : value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="执行状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有状态</SelectItem>
              <SelectItem value="success">成功</SelectItem>
              <SelectItem value="error">失败</SelectItem>
              <SelectItem value="running">运行中</SelectItem>
              <SelectItem value="waiting">等待中</SelectItem>
            </SelectContent>
          </Select>
          
          <Input
            type="date"
            placeholder="开始日期"
            value={filters.startDate || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
          />
          
          <Input
            type="date"
            placeholder="结束日期"
            value={filters.endDate || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
          />
        </div>
      </Card>

      {/* 执行记录列表 */}
      {executions.length === 0 ? (
        <Card className="p-12 text-center">
          <Activity className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">暂无执行记录</h3>
          <p className="text-gray-600">当工作流开始执行时，记录将显示在这里</p>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {executions.map((execution) => (
              <Card key={execution.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Activity className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {execution.workflow?.name || '未知工作流'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        执行ID: {execution.executionId}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span>实例: {execution.workflow?.instance?.name}</span>
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(execution.startedAt)}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDuration(execution.startedAt, execution.finishedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(execution.status)}
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedExecution(execution)
                          setShowDetailDialog(true)
                        }}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        详情
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedExecution(execution)
                          setShowDeleteDialog(true)
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* 分页 */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700">
                显示第 {(pagination.page - 1) * pagination.limit + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} 条，
                共 {pagination.total} 条记录
              </p>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                >
                  上一页
                </Button>
                
                <span className="text-sm text-gray-700">
                  第 {pagination.page} / {pagination.pages} 页
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                >
                  下一页
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* 执行详情对话框 */}
      {selectedExecution && (
        <ExecutionDetailDialog
          execution={selectedExecution}
          open={showDetailDialog}
          onOpenChange={setShowDetailDialog}
        />
      )}

      {/* 删除确认对话框 */}
      {selectedExecution && (
        <DeleteExecutionDialog
          execution={selectedExecution}
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  )
}