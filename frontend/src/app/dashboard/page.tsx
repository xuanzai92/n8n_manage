'use client'

import React, { useEffect, useState } from 'react'
import { Card, Row, Col, Statistic, Table, Button, Space, Typography, Spin } from 'antd'
import {
  ApiOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import { useAuthStore } from '@/lib/store'
import { apiClient } from '@/lib/api'
import type { Workflow, Execution } from '@/types'
import AppLayout from '@/components/Layout/AppLayout'

const { Title } = Typography

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalWorkflows: 0,
    activeWorkflows: 0,
    totalExecutions: 0,
    successExecutions: 0,
    errorExecutions: 0,
    runningExecutions: 0,
  })
  const [recentWorkflows, setRecentWorkflows] = useState<Workflow[]>([])
  const [recentExecutions, setRecentExecutions] = useState<Execution[]>([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // 获取工作流列表
      const workflowsResponse = await apiClient.getWorkflows({ limit: 100 })
      const workflows = workflowsResponse.data
      
      // 获取最近的执行记录
      const executionsResponse = await apiClient.getExecutions('all', { limit: 10 })
      const executions = executionsResponse.data

      // 计算统计数据
      const activeWorkflows = workflows.filter(w => w.active).length
      const successExecutions = executions.filter(e => e.status === 'success').length
      const errorExecutions = executions.filter(e => e.status === 'error').length
      const runningExecutions = executions.filter(e => e.status === 'running').length

      setStats({
        totalWorkflows: workflows.length,
        activeWorkflows,
        totalExecutions: executions.length,
        successExecutions,
        errorExecutions,
        runningExecutions,
      })

      setRecentWorkflows(workflows.slice(0, 5))
      setRecentExecutions(executions.slice(0, 5))
    } catch (error) {
      console.error('加载仪表板数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const workflowColumns = [
    {
      title: '工作流名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '状态',
      dataIndex: 'active',
      key: 'active',
      render: (active: boolean) => (
        <span style={{ color: active ? '#52c41a' : '#ff4d4f' }}>
          {active ? '激活' : '停用'}
        </span>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString(),
    },
  ]

  const executionColumns = [
    {
      title: '工作流',
      dataIndex: 'workflowId',
      key: 'workflowId',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          success: { color: '#52c41a', icon: <CheckCircleOutlined />, text: '成功' },
          error: { color: '#ff4d4f', icon: <ExclamationCircleOutlined />, text: '失败' },
          running: { color: '#1890ff', icon: <ClockCircleOutlined />, text: '运行中' },
        }
        const config = statusConfig[status as keyof typeof statusConfig]
        return (
          <span style={{ color: config.color }}>
            {config.icon} {config.text}
          </span>
        )
      },
    },
    {
      title: '开始时间',
      dataIndex: 'startedAt',
      key: 'startedAt',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '持续时间',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration: number) => duration ? `${Math.round(duration / 1000)}s` : '-',
    },
  ]

  if (loading) {
    return (
      <AppLayout>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>加载中...</div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div>
        <Title level={2}>仪表板</Title>
        <p>欢迎回来，{user?.username}！</p>

        {/* 统计卡片 */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="总工作流"
                value={stats.totalWorkflows}
                prefix={<ApiOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="激活工作流"
                value={stats.activeWorkflows}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="总执行次数"
                value={stats.totalExecutions}
                prefix={<PlayCircleOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="成功执行"
                value={stats.successExecutions}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
        </Row>

        {/* 最近工作流 */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} lg={12}>
            <Card
              title="最近工作流"
              extra={
                <Button type="link" href="/workflows">
                  查看全部
                </Button>
              }
            >
              <Table
                dataSource={recentWorkflows}
                columns={workflowColumns}
                pagination={false}
                size="small"
                rowKey="id"
              />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card
              title="最近执行"
              extra={
                <Button type="link" href="/executions">
                  查看全部
                </Button>
              }
            >
              <Table
                dataSource={recentExecutions}
                columns={executionColumns}
                pagination={false}
                size="small"
                rowKey="id"
              />
            </Card>
          </Col>
        </Row>

        {/* 快速操作 */}
        <Card title="快速操作">
          <Space wrap>
            <Button type="primary" href="/workflows">
              <ApiOutlined /> 管理工作流
            </Button>
            <Button href="/executions">
              <PlayCircleOutlined /> 查看执行历史
            </Button>
            <Button href="/settings">
              <ApiOutlined /> n8n 设置
            </Button>
          </Space>
        </Card>
      </div>
    </AppLayout>
  )
}

export default DashboardPage
