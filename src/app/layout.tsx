import type { Metadata } from "next";
import "./globals.css";
import { MainLayout } from "@/components/layout/main-layout";
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
  title: "n8n 集中管理平台",
  description: "统一管理多个 n8n 实例的工作流和执行记录",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: 'Inter, sans-serif' }}>
        <MainLayout>
          {children}
        </MainLayout>
        <Toaster />
      </body>
    </html>
  )
}
