'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Instance } from '@/types'
import { Loader2 } from 'lucide-react'

interface InstanceFormProps {
  instance?: Instance
  onSuccess: () => void
}

export function InstanceForm({ instance, onSuccess }: InstanceFormProps) {
  const [formData, setFormData] = useState({
    name: instance?.name || '',
    apiBaseUrl: instance?.apiBaseUrl || '',
    apiKey: instance?.apiKey || '',
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const url = instance 
        ? `/api/instances/${instance.id}`
        : '/api/instances'
      
      const method = instance ? 'PUT' : 'POST'
      
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
        if (data.error) {
          setErrors({ general: data.error })
        } else if (data.details) {
          setErrors(data.details)
        }
      }
    } catch (error) {
      setErrors({ general: '操作失败，请重试' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.general && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {errors.general}
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="name">实例名称</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="输入实例名称"
          disabled={loading}
        />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="apiBaseUrl">API 地址</Label>
        <Input
          id="apiBaseUrl"
          value={formData.apiBaseUrl}
          onChange={(e) => handleChange('apiBaseUrl', e.target.value)}
          placeholder="https://your-n8n-instance.com"
          disabled={loading}
        />
        {errors.apiBaseUrl && (
          <p className="text-sm text-red-600">{errors.apiBaseUrl}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="apiKey">API Key</Label>
        <Input
          id="apiKey"
          type="password"
          value={formData.apiKey}
          onChange={(e) => handleChange('apiKey', e.target.value)}
          placeholder="输入 API Key"
          disabled={loading}
        />
        {errors.apiKey && (
          <p className="text-sm text-red-600">{errors.apiKey}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="submit"
          disabled={loading}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {instance ? '更新' : '创建'}
        </Button>
      </div>
    </form>
  )
}