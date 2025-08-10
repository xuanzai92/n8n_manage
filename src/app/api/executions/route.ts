import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const querySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('20'),
  workflowId: z.string().optional(),
  instanceId: z.string().optional(),
  status: z.enum(['success', 'error', 'waiting', 'running']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = querySchema.parse(Object.fromEntries(searchParams))
    
    const page = parseInt(query.page)
    const limit = parseInt(query.limit)
    const skip = (page - 1) * limit

    // 构建查询条件
    const where: any = {}
    
    if (query.workflowId) {
      where.workflowId = parseInt(query.workflowId)
    }
    
    if (query.instanceId) {
      where.workflow = {
        instanceId: parseInt(query.instanceId)
      }
    }
    
    if (query.status) {
      where.status = query.status
    }
    
    if (query.startDate || query.endDate) {
      where.startedAt = {}
      if (query.startDate) {
        where.startedAt.gte = new Date(query.startDate)
      }
      if (query.endDate) {
        where.startedAt.lte = new Date(query.endDate)
      }
    }

    // 获取执行记录
    const [executions, total] = await Promise.all([
      prisma.execution.findMany({
        where,
        include: {
          workflow: {
            include: {
              instance: true
            }
          }
        },
        orderBy: {
          startedAt: 'desc'
        },
        skip,
        take: limit,
      }),
      prisma.execution.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: executions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('获取执行记录失败:', error)
    return NextResponse.json(
      { success: false, error: '获取执行记录失败' },
      { status: 500 }
    )
  }
}