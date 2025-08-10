'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'card' | 'text' | 'avatar' | 'button'
  lines?: number
}

export function Skeleton({ className, variant = 'text', lines = 1 }: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded'
  
  const variants = {
    card: 'h-32 w-full',
    text: 'h-4 w-full',
    avatar: 'h-10 w-10 rounded-full',
    button: 'h-10 w-24'
  }
  
  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              baseClasses,
              variants.text,
              i === lines - 1 && 'w-3/4',
              className
            )}
          />
        ))}
      </div>
    )
  }
  
  return (
    <div className={cn(baseClasses, variants[variant], className)} />
  )
}