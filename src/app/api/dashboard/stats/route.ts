import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // 获取实例统计
    const [totalInstances, activeInstances] = await Promise.all([
      prisma.instance.count(),
      prisma.instance.count({
        where: {
          status: 'active'
        }
      })
    ])

    // 获取工作流统计
    const [totalWorkflows, activeWorkflows] = await Promise.all([
      prisma.workflow.count(),
      prisma.workflow.count({
        where: {
          active: true
        }
      })
    ])

    // 获取今日执行统计
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const [todayExecutions, todaySuccessExecutions] = await Promise.all([
      prisma.execution.count({
        where: {
          startedAt: {
            gte: today,
            lt: tomorrow
          }
        }
      }),
      prisma.execution.count({
        where: {
          startedAt: {
            gte: today,
            lt: tomorrow
          },
          status: 'success'
        }
      })
    ])

    // 计算成功率
    const successRate = todayExecutions > 0 ? (todaySuccessExecutions / todayExecutions * 100).toFixed(1) : '0'

    // 获取最近7天的执行趋势
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const recentExecutions = await prisma.execution.findMany({
      where: {
        startedAt: {
          gte: sevenDaysAgo
        }
      },
      select: {
        startedAt: true,
        status: true
      },
      orderBy: {
        startedAt: 'asc'
      }
    })

    // 按日期分组统计
    const dailyStats = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)
      
      const dayExecutions = recentExecutions.filter(exec => {
        const execDate = new Date(exec.startedAt)
        return execDate >= date && execDate < nextDate
      })
      
      const successCount = dayExecutions.filter(exec => exec.status === 'success').length
      const errorCount = dayExecutions.filter(exec => exec.status === 'error').length
      
      dailyStats.push({
        date: date.toISOString().split('T')[0],
        total: dayExecutions.length,
        success: successCount,
        error: errorCount
      })
    }

    // 获取实例状态分布
    const instanceStats = await prisma.instance.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    })

    // 获取最近执行记录
    const recentExecutionsList = await prisma.execution.findMany({
      take: 5,
      orderBy: {
        startedAt: 'desc'
      },
      include: {
        workflow: {
          include: {
            instance: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalInstances,
          activeInstances,
          totalWorkflows,
          activeWorkflows,
          todayExecutions,
          successRate: `${successRate}%`
        },
        dailyStats,
        instanceStats: instanceStats.map(stat => ({
          status: stat.status,
          count: stat._count.status
        })),
        recentExecutions: recentExecutionsList
      }
    })
  } catch (error) {
    console.error('获取仪表板统计失败:', error)
    return NextResponse.json(
      { success: false, error: '获取统计数据失败' },
      { status: 500 }
    )
  }
}