import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { User, AppState, Notification } from '@/types'
import { apiClient } from './api'

interface AuthState extends AppState {
  // Actions
  login: (identifier: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  getCurrentUser: () => Promise<void>
  clearError: () => void
}

interface NotificationState {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

// 认证状态管理
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        login: async (identifier: string, password: string) => {
          set({ isLoading: true, error: null })
          try {
            const response = await apiClient.login({ identifier, password })
            set({
              user: response.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })
          } catch (error: any) {
            set({
              isLoading: false,
              error: error.error?.message || '登录失败',
            })
            throw error
          }
        },

        register: async (username: string, email: string, password: string) => {
          set({ isLoading: true, error: null })
          try {
            const response = await apiClient.register({ username, email, password })
            set({
              user: response.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })
          } catch (error: any) {
            set({
              isLoading: false,
              error: error.error?.message || '注册失败',
            })
            throw error
          }
        },

        logout: () => {
          apiClient.logout()
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          })
        },

        getCurrentUser: async () => {
          set({ isLoading: true })
          try {
            const user = await apiClient.getCurrentUser()
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
            })
          } catch (error) {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            })
          }
        },

        clearError: () => {
          set({ error: null })
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  )
)

// 通知状态管理
export const useNotificationStore = create<NotificationState>()(
  devtools((set) => ({
    notifications: [],

    addNotification: (notification) => {
      const id = Math.random().toString(36).substr(2, 9)
      const newNotification: Notification = {
        id,
        ...notification,
      }
      set((state) => ({
        notifications: [...state.notifications, newNotification],
      }))

      // 自动移除通知
      if (notification.duration !== 0) {
        setTimeout(() => {
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          }))
        }, notification.duration || 5000)
      }
    },

    removeNotification: (id) => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }))
    },

    clearNotifications: () => {
      set({ notifications: [] })
    },
  }))
)

// 工具函数
export const showNotification = (
  type: Notification['type'],
  message: string,
  description?: string,
  duration?: number
) => {
  useNotificationStore.getState().addNotification({
    type,
    message,
    description,
    duration,
  })
}

export const showSuccess = (message: string, description?: string) => {
  showNotification('success', message, description)
}

export const showError = (message: string, description?: string) => {
  showNotification('error', message, description)
}

export const showWarning = (message: string, description?: string) => {
  showNotification('warning', message, description)
}

export const showInfo = (message: string, description?: string) => {
  showNotification('info', message, description)
}
