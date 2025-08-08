// 用户相关类型
export interface User {
  id: number
  username: string
  email: string
  role: {
    id: number
    name: string
  }
  createdAt: string
  updatedAt: string
}

// n8n 实例相关类型
export interface N8nInstance {
  id: number
  baseUrl: string
  createdAt: string
  updatedAt: string
}

export interface N8nInstanceForm {
  baseUrl: string
  apiKey: string
}

// 工作流相关类型
export interface Workflow {
  id: string
  name: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface WorkflowDetail extends Workflow {
  nodes: WorkflowNode[]
  connections: Record<string, any>
}

export interface WorkflowNode {
  id: string
  name: string
  type: string
  position: [number, number]
}

// 执行相关类型
export interface Execution {
  id: string
  workflowId: string
  status: 'success' | 'error' | 'running'
  startedAt: string
  finishedAt?: string
  duration?: number
  data?: ExecutionData[]
  error?: string
}

export interface ExecutionData {
  node: string
  output: Record<string, any>
}

// API 响应类型
export interface ApiResponse<T = any> {
  data: T
  meta?: {
    total: number
    limit: number
    offset: number
  }
}

export interface ApiError {
  error: {
    status: number
    name: string
    message: string
    details?: Record<string, any>
  }
}

// 认证相关类型
export interface AuthResponse {
  jwt: string
  user: User
}

export interface LoginForm {
  identifier: string
  password: string
}

export interface RegisterForm {
  username: string
  email: string
  password: string
}

// 分页相关类型
export interface PaginationParams {
  limit?: number
  offset?: number
  search?: string
}

export interface WorkflowListParams extends PaginationParams {
  active?: boolean
}

export interface ExecutionListParams extends PaginationParams {
  status?: 'success' | 'error' | 'running'
}

// 审计日志类型
export interface AuditLog {
  id: number
  userId: number
  action: string
  details: Record<string, any>
  ipAddress: string
  userAgent: string
  createdAt: string
}

// 应用状态类型
export interface AppState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// 表单验证类型
export interface ValidationError {
  field: string
  message: string
}

// 通知类型
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  description?: string
  duration?: number
}
