import { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { handleApiError, createApiResponse } from '@/lib/api'

const createInstanceSchema = z.object({
  name: z.string().min(1, '实例名称不能为空'),
  apiBaseUrl: z.string().url('请输入有效的 URL'),
  apiKey: z.string().min(1, 'API Key 不能为空'),
})

const updateInstanceSchema = z.object({
  name: z.string().min(1, '实例名称不能为空').optional(),
  apiBaseUrl: z.string().url('请输入有效的 URL').optional(),
  apiKey: z.string().min(1, 'API Key 不能为空').optional(),
})

// GET /api/instances - 获取所有实例
export async function GET() {
  try {
    const instances = await prisma.instance.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        apiBaseUrl: true,
        authType: true,
        createdAt: true,
        // 不返回 apiKey 保护敏感信息
      }
    })
    return createApiResponse(instances)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/instances - 创建新实例
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createInstanceSchema.parse(body)
    
    // 检查是否已存在相同名称的实例
    const existingInstance = await prisma.instance.findFirst({
      where: { name: validatedData.name }
    })
    
    if (existingInstance) {
      return createApiResponse(
        { error: '实例名称已存在' },
        400
      )
    }
    
    const instance = await prisma.instance.create({
      data: {
        ...validatedData,
        authType: 'API_KEY'
      },
      select: {
        id: true,
        name: true,
        apiBaseUrl: true,
        authType: true,
        createdAt: true,
      }
    })
    
    return createApiResponse(instance, 201)
  } catch (error) {
    return handleApiError(error)
  }
}