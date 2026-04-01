import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PicRemove - 图片背景移除工具",
  description: "轻量级在线图片背景移除工具，一键去除图片背景",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
        {children}
      </body>
    </html>
  );
}
