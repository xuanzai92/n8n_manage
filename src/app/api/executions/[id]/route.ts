import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const execution = await prisma.execution.findUnique({
      where: {
        id: parseInt(params.id)
      },
      include: {
        workflow: {
          include: {
            instance: true
          }
        }
      }
    })

    if (!execution) {
      return NextResponse.json(
        { success: false, error: '执行记录不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: execution
    })
  } catch (error) {
    console.error('获取执行记录详情失败:', error)
    return NextResponse.json(
      { success: false, error: '获取执行记录详情失败' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const execution = await prisma.execution.findUnique({
      where: {
        id: parseInt(params.id)
      }
    })

    if (!execution) {
      return NextResponse.json(
        { success: false, error: '执行记录不存在' },
        { status: 404 }
      )
    }

    await prisma.execution.delete({
      where: {
        id: parseInt(params.id)
      }
    })

    return NextResponse.json({
      success: true,
      message: '执行记录删除成功'
    })
  } catch (error) {
    console.error('删除执行记录失败:', error)
    return NextResponse.json(
      { success: false, error: '删除执行记录失败' },
      { status: 500 }
    )
  }
}