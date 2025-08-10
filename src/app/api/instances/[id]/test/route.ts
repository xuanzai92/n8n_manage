import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { handleApiError, createApiResponse } from '@/lib/api'

// POST /api/instances/[id]/test - 测试实例连接
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 获取实例信息
    const instance = await prisma.instance.findUnique({
      where: { id: params.id }
    })
    
    if (!instance) {
      return createApiResponse(
        { error: '实例不存在' },
        404
      )
    }
    
    // 测试连接到 n8n API
    const testUrl = `${instance.apiBaseUrl}/rest/active-workflows`
    
    try {
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'X-N8N-API-KEY': instance.apiKey,
          'Content-Type': 'application/json',
        },
        // 设置超时时间
        signal: AbortSignal.timeout(10000)
      })
      
      if (response.ok) {
        return createApiResponse({
          status: 'success',
          message: '连接测试成功',
          responseTime: Date.now()
        })
      } else {
        return createApiResponse({
          status: 'error',
          message: `连接失败: ${response.status} ${response.statusText}`,
          details: await response.text()
        }, 400)
      }
    } catch (fetchError: any) {
      return createApiResponse({
        status: 'error',
        message: '连接超时或网络错误',
        details: fetchError.message
      }, 400)
    }
  } catch (error) {
    return handleApiError(error)
  }
}