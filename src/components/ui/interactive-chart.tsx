'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface ChartData {
  label: string
  value: number
  change?: number
}

interface InteractiveChartProps {
  title: string
  data: ChartData[]
  type?: 'line' | 'bar' | 'area'
  timeRange?: '7d' | '30d' | '90d'
  onTimeRangeChange?: (range: string) => void
}

export function InteractiveChart({
  title,
  data,
  type = 'line',
  timeRange = '7d',
  onTimeRangeChange
}: InteractiveChartProps) {
  const [selectedPoint, setSelectedPoint] = useState<ChartData | null>(null)
  
  const maxValue = Math.max(...data.map(d => d.value))
  
  const timeRangeOptions = [
    { value: '7d', label: '7天' },
    { value: '30d', label: '30天' },
    { value: '90d', label: '90天' },
  ]
  
  const getTrendIcon = (change?: number) => {
    if (!change) return <Minus className="h-3 w-3" />
    if (change > 0) return <TrendingUp className="h-3 w-3 text-green-600" />
    if (change < 0) return <TrendingDown className="h-3 w-3 text-red-600" />
    return <Minus className="h-3 w-3" />
  }
  
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex space-x-1">
          {timeRangeOptions.map((option) => (
            <Button
              key={option.value}
              variant={timeRange === option.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTimeRangeChange?.(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="h-64 relative">
        {/* 简化的图表实现 */}
        <div className="flex items-end justify-between h-full space-x-2">
          {data.map((point, index) => (
            <div
              key={index}
              className="flex-1 flex flex-col items-center cursor-pointer group"
              onClick={() => setSelectedPoint(point)}
            >
              <div
                className="w-full bg-blue-500 hover:bg-blue-600 transition-colors rounded-t"
                style={{
                  height: `${(point.value / maxValue) * 100}%`,
                  minHeight: '4px'
                }}
              />
              <span className="text-xs text-gray-600 mt-2 group-hover:font-medium">
                {point.label}
              </span>
            </div>
          ))}
        </div>
        
        {selectedPoint && (
          <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg border">
            <div className="flex items-center space-x-2">
              <span className="font-medium">{selectedPoint.label}</span>
              {getTrendIcon(selectedPoint.change)}
            </div>
            <div className="text-2xl font-bold">{selectedPoint.value}</div>
            {selectedPoint.change && (
              <div className={`text-sm ${
                selectedPoint.change > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {selectedPoint.change > 0 ? '+' : ''}{selectedPoint.change}%
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}