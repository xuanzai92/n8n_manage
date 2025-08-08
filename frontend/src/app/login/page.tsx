'use client'

import React, { useState } from 'react'
import { Form, Input, Button, Card, Typography, Space, Divider, message } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuthStore } from '@/lib/store'
import { showError } from '@/lib/store'

const { Title, Text } = Typography

const LoginPage: React.FC = () => {
  const [form] = Form.useForm()
  const router = useRouter()
  const { login, isLoading, error } = useAuthStore()
  const [isRegister, setIsRegister] = useState(false)

  const handleSubmit = async (values: any) => {
    try {
      if (isRegister) {
        await login(values.email, values.password)
      } else {
        await login(values.identifier, values.password)
      }
      message.success('登录成功')
      router.push('/dashboard')
    } catch (error: any) {
      showError('登录失败', error.error?.message || '请检查用户名和密码')
    }
  }

  const handleRegister = async (values: any) => {
    try {
      await login(values.username, values.password)
      message.success('注册成功')
      router.push('/dashboard')
    } catch (error: any) {
      showError('注册失败', error.error?.message || '请检查输入信息')
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Card
        style={{
          width: 400,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
            n8n 管理平台
          </Title>
          <Text type="secondary">
            {isRegister ? '创建新账户' : '登录到您的账户'}
          </Text>
        </div>

        {isRegister ? (
          <Form
            form={form}
            onFinish={handleRegister}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="username"
              label="用户名"
              rules={[
                { required: true, message: '请输入用户名' },
                { min: 3, message: '用户名至少3个字符' },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="请输入用户名"
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="邮箱"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="请输入邮箱"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="密码"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码至少6个字符' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请输入密码"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="确认密码"
              dependencies={['password']}
              rules={[
                { required: true, message: '请确认密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'))
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请确认密码"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                block
              >
                注册
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="identifier"
              label="用户名或邮箱"
              rules={[{ required: true, message: '请输入用户名或邮箱' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="请输入用户名或邮箱"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请输入密码"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                block
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        )}

        <Divider>
          <Text type="secondary">
            {isRegister ? '已有账户？' : '还没有账户？'}
          </Text>
        </Divider>

        <div style={{ textAlign: 'center' }}>
          <Button
            type="link"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? '立即登录' : '立即注册'}
          </Button>
        </div>

        {error && (
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <Text type="danger">{error}</Text>
          </div>
        )}
      </Card>
    </div>
  )
}

export default LoginPage
