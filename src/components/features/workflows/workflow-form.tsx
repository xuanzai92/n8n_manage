'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import { Workflow, Instance, WorkflowFormData } from '@/types'

interface WorkflowFormProps {
  workflow?: Workflow
  instances: Instance[]
  onSuccess: () => void
}

export function WorkflowForm({ workflow, instances, onSuccess }: WorkflowFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<WorkflowFormData>({
    instanceId: workflow?.instanceId || 0,
    workflowId: workflow?.workflowId || '',
    name: workflow?.name || '',
    active: workflow?.active || false,
    tags: workflow?.tags || '',
    project: workflow?.project || '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const url = workflow ? `/api/workflows/${workflow.id}` : '/api/workflows'
      const method = workflow ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        onSuccess()
      } else {
        if (data.errors) {
          setErrors(data.errors)
        } else {
          setErrors({ general: data.error || '操作失败' })
        }
      }
    } catch (error) {
      setErrors({ general: '网络错误，请重试' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.general && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
          {errors.general}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="instanceId">选择实例 *</Label>
        <Select
          value={formData.instanceId.toString()}
          onValueChange={(value) => setFormData(prev => ({ ...prev, instanceId: parseInt(value) }))}
          disabled={!!workflow} // 编辑时不允许修改实例
        >
          <SelectTrigger>
            <SelectValue placeholder="请选择实例" />
          </SelectTrigger>
          <SelectContent>
            {instances.map((instance) => (
              <SelectItem key={instance.id} value={instance.id.toString()}>
                {instance.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.instanceId && (
          <p className="text-sm text-red-600">{errors.instanceId}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="workflowId">工作流 ID *</Label>
        <Input
          id="workflowId"
          value={formData.workflowId}
          onChange={(e) => setFormData(prev => ({ ...prev, workflowId: e.target.value }))}
          placeholder="输入 n8n 工作流 ID"
          disabled={!!workflow} // 编辑时不允许修改工作流ID
        />
        {errors.workflowId && (
          <p className="text-sm text-red-600">{errors.workflowId}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">工作流名称 *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="输入工作流名称"
        />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="project">项目名称</Label>
        <Input
          id="project"
          value={formData.project}
          onChange={(e) => setFormData(prev => ({ ...prev, project: e.target.value }))}
          placeholder="输入项目名称（可选）"
        />
        {errors.project && (
          <p className="text-sm text-red-600">{errors.project}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">标签</Label>
        <Textarea
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
          placeholder="输入标签，用逗号分隔（可选）"
          rows={3}
        />
        {errors.tags && (
          <p className="text-sm text-red-600">{errors.tags}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="active"
          checked={formData.active}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
        />
        <Label htmlFor="active">启用工作流</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="submit"
          disabled={loading || !formData.instanceId || !formData.workflowId || !formData.name}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {workflow ? '更新工作流' : '创建工作流'}
        </Button>
      </div>
    </form>
  )
}