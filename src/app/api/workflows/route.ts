import { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { handleApiError, createApiResponse } from '@/lib/api'
import { Prisma } from '@prisma/client'

const createWorkflowSchema = z.object({
  instanceId: z.number().int().positive('请选择实例'),
  workflowId: z.string().min(1, '工作流 ID 不能为空'),
  name: z.string().min(1, '工作流名称不能为空'),
  active: z.boolean().default(false),
  tags: z.string().optional(),
  project: z.string().optional(),
})

const updateWorkflowSchema = z.object({
  name: z.string().min(1, '工作流名称不能为空').optional(),
  active: z.boolean().optional(),
  tags: z.string().optional(),
  project: z.string().optional(),
})

// GET /api/workflows - 获取所有工作流
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const instanceId = searchParams.get('instanceId')
    const active = searchParams.get('active')
    const project = searchParams.get('project')
    
    // 使用正确的 Prisma 类型替代 any
    const where: Prisma.WorkflowWhereInput = {}
    if (instanceId) where.instanceId = parseInt(instanceId)
    if (active !== null) where.active = active === 'true'
    if (project) where.project = project
    
    const workflows = await prisma.workflow.findMany({
      where,
      include: {
        instance: {
          select: {
            id: true,
            name: true,
            apiBaseUrl: true,
          }
        },
        _count: {
          select: {
            executions: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    })
    
    return createApiResponse(workflows)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/workflows - 创建新工作流
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createWorkflowSchema.parse(body)
    
    // 检查实例是否存在
    const instance = await prisma.instance.findUnique({
      where: { id: validatedData.instanceId }
    })
    
    if (!instance) {
      return createApiResponse(
        { error: '指定的实例不存在' },
        404
      )
    }
    
    // 检查是否已存在相同的工作流ID
    const existingWorkflow = await prisma.workflow.findFirst({
      where: {
        instanceId: validatedData.instanceId,
        workflowId: validatedData.workflowId
      }
    })
    
    if (existingWorkflow) {
      return createApiResponse(
        { error: '该实例中已存在相同的工作流 ID' },
        400
      )
    }
    
    const workflow = await prisma.workflow.create({
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
    
    return createApiResponse(workflow, 201)
  } catch (error) {
    return handleApiError(error)
  }
}