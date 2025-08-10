'use client'

import { useState, useCallback } from 'react'
import { useNotifications } from './useNotifications'

interface UseOptimisticDataOptions<T> {
  initialData?: T[]
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

export function useOptimisticData<T extends { id: string | number }>(
  options: UseOptimisticDataOptions<T> = {}
) {
  const [data, setData] = useState<T[]>(options.initialData || [])
  const [loading, setLoading] = useState(false)
  const { addNotification } = useNotifications()

  const optimisticUpdate = useCallback(async (
    updateFn: () => Promise<T>,
    optimisticData: T,
    action: 'add' | 'update' | 'delete'
  ) => {
    // 乐观更新
    if (action === 'add') {
      setData(prev => [optimisticData, ...prev])
    } else if (action === 'update') {
      setData(prev => prev.map(item => 
        item.id === optimisticData.id ? optimisticData : item
      ))
    } else if (action === 'delete') {
      setData(prev => prev.filter(item => item.id !== optimisticData.id))
    }

    try {
      const result = await updateFn()
      options.onSuccess?.(result)
      
      addNotification({
        type: 'success',
        title: '操作成功',
        message: `${action === 'add' ? '添加' : action === 'update' ? '更新' : '删除'}成功`
      })
    } catch (error) {
      // 回滚乐观更新
      if (action === 'add') {
        setData(prev => prev.filter(item => item.id !== optimisticData.id))
      } else if (action === 'delete') {
        setData(prev => [optimisticData, ...prev])
      }
      
      options.onError?.(error as Error)
      addNotification({
        type: 'error',
        title: '操作失败',
        message: (error as Error).message
      })
    }
  }, [addNotification, options])

  return {
    data,
    setData,
    loading,
    setLoading,
    optimisticUpdate
  }
}