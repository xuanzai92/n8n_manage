import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import type {
  ApiResponse,
  ApiError,
  AuthResponse,
  LoginForm,
  RegisterForm,
  User,
  N8nInstance,
  N8nInstanceForm,
  Workflow,
  WorkflowDetail,
  Execution,
  WorkflowListParams,
  ExecutionListParams,
  AuditLog,
} from '@/types'

class ApiClient {
  private client: AxiosInstance
  private baseURL: string

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // 请求拦截器
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.removeAuthToken()
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  // 认证相关方法
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'n8n_auth_token')
  }

  private setAuthToken(token: string): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'n8n_auth_token', token)
  }

  private removeAuthToken(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'n8n_auth_token')
  }

  // 通用请求方法
  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client(config)
      return response.data
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data as ApiError
      }
      throw {
        error: {
          status: 500,
          name: 'NetworkError',
          message: '网络请求失败',
        },
      } as ApiError
    }
  }

  // 认证 API
  async register(data: RegisterForm): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>({
      method: 'POST',
      url: '/api/auth/local/register',
      data,
    })
    this.setAuthToken(response.jwt)
    return response
  }

  async login(data: LoginForm): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>({
      method: 'POST',
      url: '/api/auth/local',
      data,
    })
    this.setAuthToken(response.jwt)
    return response
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>({
      method: 'GET',
      url: '/api/users/me',
    })
  }

  logout(): void {
    this.removeAuthToken()
  }

  // n8n 实例 API
  async getN8nInstance(): Promise<N8nInstance> {
    return this.request<N8nInstance>({
      method: 'GET',
      url: '/api/my-n8n',
    })
  }

  async createN8nInstance(data: N8nInstanceForm): Promise<N8nInstance> {
    return this.request<N8nInstance>({
      method: 'POST',
      url: '/api/my-n8n',
      data,
    })
  }

  async updateN8nInstance(data: N8nInstanceForm): Promise<N8nInstance> {
    return this.request<N8nInstance>({
      method: 'PUT',
      url: '/api/my-n8n',
      data,
    })
  }

  async testN8nConnection(): Promise<{ success: boolean; message: string; workflowCount?: number }> {
    return this.request<{ success: boolean; message: string; workflowCount?: number }>({
      method: 'POST',
      url: '/api/my-n8n/test',
    })
  }

  // 工作流 API
  async getWorkflows(params?: WorkflowListParams): Promise<ApiResponse<Workflow[]>> {
    const searchParams = new URLSearchParams()
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.offset) searchParams.append('offset', params.offset.toString())
    if (params?.search) searchParams.append('search', params.search)
    if (params?.active !== undefined) searchParams.append('active', params.active.toString())

    return this.request<ApiResponse<Workflow[]>>({
      method: 'GET',
      url: `/api/workflows?${searchParams.toString()}`,
    })
  }

  async getWorkflow(id: string): Promise<WorkflowDetail> {
    return this.request<WorkflowDetail>({
      method: 'GET',
      url: `/api/workflows/${id}`,
    })
  }

  async executeWorkflow(id: string, data?: Record<string, any>): Promise<{
    success: boolean
    executionId: string
    message: string
    status: string
  }> {
    return this.request<{
      success: boolean
      executionId: string
      message: string
      status: string
    }>({
      method: 'POST',
      url: `/api/workflows/${id}/execute`,
      data: { data },
    })
  }

  // 执行历史 API
  async getExecutions(workflowId: string, params?: ExecutionListParams): Promise<ApiResponse<Execution[]>> {
    const searchParams = new URLSearchParams()
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.offset) searchParams.append('offset', params.offset.toString())
    if (params?.status) searchParams.append('status', params.status)

    return this.request<ApiResponse<Execution[]>>({
      method: 'GET',
      url: `/api/workflows/${workflowId}/executions?${searchParams.toString()}`,
    })
  }

  async getExecution(executionId: string): Promise<Execution> {
    return this.request<Execution>({
      method: 'GET',
      url: `/api/executions/${executionId}`,
    })
  }

  // 管理员 API
  async getUsers(params?: { limit?: number; offset?: number; search?: string; role?: string }): Promise<ApiResponse<User[]>> {
    const searchParams = new URLSearchParams()
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.offset) searchParams.append('offset', params.offset.toString())
    if (params?.search) searchParams.append('search', params.search)
    if (params?.role) searchParams.append('role', params.role)

    return this.request<ApiResponse<User[]>>({
      method: 'GET',
      url: `/api/admin/users?${searchParams.toString()}`,
    })
  }

  async getAuditLogs(params?: {
    limit?: number
    offset?: number
    userId?: number
    action?: string
    startDate?: string
    endDate?: string
  }): Promise<ApiResponse<AuditLog[]>> {
    const searchParams = new URLSearchParams()
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.offset) searchParams.append('offset', params.offset.toString())
    if (params?.userId) searchParams.append('userId', params.userId.toString())
    if (params?.action) searchParams.append('action', params.action)
    if (params?.startDate) searchParams.append('startDate', params.startDate)
    if (params?.endDate) searchParams.append('endDate', params.endDate)

    return this.request<ApiResponse<AuditLog[]>>({
      method: 'GET',
      url: `/api/admin/audit-logs?${searchParams.toString()}`,
    })
  }
}

// 创建单例实例
export const apiClient = new ApiClient()

// 导出类型
export type { ApiResponse, ApiError }
