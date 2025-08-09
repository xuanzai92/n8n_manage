import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export function handleApiError(error: unknown) {
  console.error('API Error:', error)
  
  if (error instanceof ZodError) {
    return NextResponse.json(
      { 
        error: '数据验证失败', 
        details: error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      },
      { status: 400 }
    )
  }
  
  if (error instanceof Error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
  
  return NextResponse.json(
    { error: '服务器内部错误' },
    { status: 500 }
  )
}

export function createApiResponse<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status })
}