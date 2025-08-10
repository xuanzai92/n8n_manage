import { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { handleApiError, createApiResponse } from '@/lib/api'

const updateInstanceSchema = z.object({
  name: z.string().min(1, '实例名称不能为空').optional(),
  apiBaseUrl: z.string().url('请输入有效的 URL').optional(),
  apiKey: z.string().min(1, 'API Key 不能为空').optional(),
})

// GET /api/instances/[id] - 获取单个实例详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const instance = await prisma.instance.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        apiBaseUrl: true,
        authType: true,
        createdAt: true,
        updatedAt: true,
        // 不返回 apiKey 保护敏感信息
      }
    })
    
    if (!instance) {
      return createApiResponse(
        { error: '实例不存在' },
        404
      )
    }
    
    return createApiResponse(instance)
  } catch (error) {
    return handleApiError(error)
  }
}

// PUT /api/instances/[id] - 更新实例
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = updateInstanceSchema.parse(body)
    
    // 检查实例是否存在
    const existingInstance = await prisma.instance.findUnique({
      where: { id: params.id }
    })
    
    if (!existingInstance) {
      return createApiResponse(
        { error: '实例不存在' },
        404
      )
    }
    
    // 如果更新名称，检查是否与其他实例重名
    if (validatedData.name && validatedData.name !== existingInstance.name) {
      const nameConflict = await prisma.instance.findFirst({
        where: {
          name: validatedData.name,
          id: { not: params.id }
        }
      })
      
      if (nameConflict) {
        return createApiResponse(
          { error: '实例名称已存在' },
          400
        )
      }
    }
    
    const updatedInstance = await prisma.instance.update({
      where: { id: params.id },
      data: validatedData,
      select: {
        id: true,
        name: true,
        apiBaseUrl: true,
        authType: true,
        createdAt: true,
        updatedAt: true,
      }
    })
    
    return createApiResponse(updatedInstance)
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/instances/[id] - 删除实例
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 检查实例是否存在
    const existingInstance = await prisma.instance.findUnique({
      where: { id: params.id }
    })
    
    if (!existingInstance) {
      return createApiResponse(
        { error: '实例不存在' },
        404
      )
    }
    
    // 删除实例（会级联删除相关的工作流和执行记录）
    await prisma.instance.delete({
      where: { id: params.id }
    })
    
    return createApiResponse(
      { message: '实例删除成功' }
    )
  } catch (error) {
    return handleApiError(error)
  }
}