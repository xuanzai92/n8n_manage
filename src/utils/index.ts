import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 格式化日期
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

// 格式化持续时间
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  if (ms < 3600000) return `${(ms / 60000).toFixed(1)}m`;
  return `${(ms / 3600000).toFixed(1)}h`;
}

// 状态颜色映射
export function getStatusColor(status: string): string {
  const colors = {
    active: 'text-green-600 bg-green-50',
    inactive: 'text-gray-600 bg-gray-50',
    error: 'text-red-600 bg-red-50',
    running: 'text-blue-600 bg-blue-50',
    success: 'text-green-600 bg-green-50',
    waiting: 'text-yellow-600 bg-yellow-50',
  };
  return colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-50';
}