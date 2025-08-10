// 实例相关类型
export interface Instance {
  id: string;
  name: string;
  apiBaseUrl: string;
  apiKey: string;
  authType: 'API_KEY' | 'BASIC_AUTH';
  status: 'active' | 'inactive' | 'error';
  createdAt: string;
  updatedAt: string;
  ownerUserId?: string;
}

// 工作流相关类型
export interface Workflow {
  id: number
  instanceId: number
  workflowId: string
  name: string
  active: boolean
  tags?: string
  project?: string
  createdAt: string
  updatedAt: string
  instance?: {
    id: number
    name: string
    apiBaseUrl: string
  }
  executions?: Execution[]
  _count?: {
    executions: number
  }
}

export interface WorkflowFormData {
  instanceId: number
  workflowId: string
  name: string
  active: boolean
  tags?: string
  project?: string
}

export interface WorkflowFilters {
  instanceId?: number
  active?: boolean
  project?: string
  search?: string
}

// 执行记录相关类型
export interface Execution {
  id: number
  executionId: string
  workflowId: number
  status: 'success' | 'error' | 'waiting' | 'running'
  startedAt: string
  finishedAt?: string
  executionTime?: number
  data?: any
  error?: string
  createdAt: string
  updatedAt: string
  workflow?: Workflow
}

export interface ExecutionFilters {
  workflowId?: string
  instanceId?: string
  status?: string
  startDate?: string
  endDate?: string
}

export interface ExecutionPagination {
  page: number
  limit: number
  total: number
  pages: number
}

// API 响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 分页类型
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 添加 API 响应状态类型
export interface ConnectionTestResult {
  status: 'success' | 'error'
  message: string
  details?: string
  responseTime?: number
}

// 表单错误类型
export interface FormErrors {
  [key: string]: string
}

// 仪表板统计类型
export interface DashboardOverview {
  totalInstances: number
  activeInstances: number
  totalWorkflows: number
  activeWorkflows: number
  todayExecutions: number
  successRate: string
}

export interface DailyStats {
  date: string
  total: number
  success: number
  error: number
}

export interface InstanceStats {
  status: string
  count: number
}

export interface DashboardStats {
  overview: DashboardOverview
  dailyStats: DailyStats[]
  instanceStats: InstanceStats[]
  recentExecutions: Execution[]
}