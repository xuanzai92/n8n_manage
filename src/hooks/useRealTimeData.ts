import { useState, useEffect, useCallback } from 'react'

interface UseRealTimeDataOptions {
  url: string
  interval?: number
  enabled?: boolean
}

export function useRealTimeData<T>(options: UseRealTimeDataOptions) {
  const { url, interval = 30000, enabled = true } = options
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setError(null)
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      if (result.success) {
        setData(result.data)
        setLastUpdated(new Date())
      } else {
        throw new Error(result.error || '获取数据失败')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误')
    } finally {
      setLoading(false)
    }
  }, [url])

  useEffect(() => {
    if (!enabled) return

    fetchData()
    const intervalId = setInterval(fetchData, interval)

    return () => clearInterval(intervalId)
  }, [fetchData, interval, enabled])

  const refresh = useCallback(() => {
    setLoading(true)
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh
  }
}