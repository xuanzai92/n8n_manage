export interface ExportOptions {
  type: 'instances' | 'workflows' | 'executions'
  format: 'json' | 'csv'
  dateRange?: {
    start: string
    end: string
  }
  filters?: Record<string, any>
}

export async function exportData(options: ExportOptions) {
  const { type, format, dateRange, filters } = options
  
  try {
    const params = new URLSearchParams({
      format,
      ...(dateRange && { startDate: dateRange.start, endDate: dateRange.end }),
      ...(filters && Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
      ))
    })
    
    const response = await fetch(`/api/${type}/export?${params}`)
    
    if (!response.ok) {
      throw new Error('导出失败')
    }
    
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${type}_${new Date().toISOString().split('T')[0]}.${format}`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (error) {
    console.error('导出数据失败:', error)
    throw error
  }
}