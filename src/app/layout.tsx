import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MainLayout } from "@/components/layout/main-layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "n8n 集中管理平台",
  description: "统一管理多个 n8n 实例的工作流和执行记录",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className} suppressHydrationWarning={true}>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
