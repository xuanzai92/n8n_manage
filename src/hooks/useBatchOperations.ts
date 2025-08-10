'use client'

import { useState, useCallback } from 'react'
import { useNotifications } from './useNotifications'

interface BatchOperationOptions<T> {
  onSuccess?: (results: T[]) => void
  onError?: (error: Error) => void
  onProgress?: (completed: number, total: number) => void
}

export function useBatchOperations<T>(options: BatchOperationOptions<T> = {}) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState({ completed: 0, total: 0 })
  const { addNotification } = useNotifications()

  const toggleSelection = useCallback((id: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }, [])

  const selectAll = useCallback((ids: string[]) => {
    setSelectedItems(new Set(ids))
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedItems(new Set())
  }, [])

  const executeBatch = useCallback(async (
    operation: (id: string) => Promise<T>,
    confirmMessage?: string
  ) => {
    if (selectedItems.size === 0) {
      addNotification({
        type: 'warning',
        title: '未选择项目',
        message: '请先选择要操作的项目'
      })
      return
    }

    if (confirmMessage && !window.confirm(confirmMessage)) {
      return
    }

    setIsProcessing(true)
    setProgress({ completed: 0, total: selectedItems.size })

    const results: T[] = []
    const errors: Error[] = []
    let completed = 0

    for (const id of selectedItems) {
      try {
        const result = await operation(id)
        results.push(result)
      } catch (error) {
        errors.push(error as Error)
      } finally {
        completed++
        setProgress({ completed, total: selectedItems.size })
        options.onProgress?.(completed, selectedItems.size)
      }
    }

    setIsProcessing(false)
    setSelectedItems(new Set())

    if (errors.length === 0) {
      addNotification({
        type: 'success',
        title: '批量操作成功',
        message: `成功处理 ${results.length} 个项目`
      })
      options.onSuccess?.(results)
    } else {
      addNotification({
        type: 'error',
        title: '批量操作部分失败',
        message: `成功: ${results.length}, 失败: ${errors.length}`
      })
      options.onError?.(errors[0])
    }
  }, [selectedItems, addNotification, options])

  return {
    selectedItems,
    isProcessing,
    progress,
    toggleSelection,
    selectAll,
    clearSelection,
    executeBatch,
    hasSelection: selectedItems.size > 0,
    selectionCount: selectedItems.size
  }
}