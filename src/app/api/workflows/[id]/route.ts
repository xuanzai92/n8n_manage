import { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { handleApiError, createApiResponse } from '@/lib/api'

const updateWorkflowSchema = z.object({
  name: z.string().min(1, '工作流名称不能为空').optional(),
  active: z.boolean().optional(),
  tags: z.string().optional(),
  project: z.string().optional(),
})

// GET /api/workflows/[id] - 获取单个工作流
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    const workflow = await prisma.workflow.findUnique({
      where: { id },
      include: {
        instance: {
          select: {
            id: true,
            name: true,
            apiBaseUrl: true,
          }
        },
        executions: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            status: true,
            startTime: true,
            endTime: true,
            duration: true,
            createdAt: true,
          }
        }
      }
    })
    
    if (!workflow) {
      return createApiResponse(
        { error: '工作流不存在' },
        404
      )
    }
    
    return createApiResponse(workflow)
  } catch (error) {
    return handleApiError(error)
  }
}

// PUT /api/workflows/[id] - 更新工作流
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()
    const validatedData = updateWorkflowSchema.parse(body)
    
    const workflow = await prisma.workflow.update({
      where: { id },
      data: validatedData,
      include: {
        instance: {
          select: {
            id: true,
            name: true,
            apiBaseUrl: true,
          }
        }
      }
    })
    
    return createApiResponse(workflow)
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/workflows/[id] - 删除工作流
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    await prisma.workflow.delete({
      where: { id }
    })
    
    return createApiResponse({ message: '工作流删除成功' })
  } catch (error) {
    return handleApiError(error)
  }
}