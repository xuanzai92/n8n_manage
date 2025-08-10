'use client'

import { cn } from '@/lib/utils'

interface ResponsiveGridProps {
  children: React.ReactNode
  className?: string
  cols?: {
    default: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
}

export function ResponsiveGrid({ children, className, cols = { default: 1 } }: ResponsiveGridProps) {
  const gridClasses = cn(
    'grid gap-4',
    `grid-cols-${cols.default}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
    className
  )
  
  return <div className={gridClasses}>{children}</div>
}