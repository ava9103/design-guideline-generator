import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Design Guideline Generator - AIによるデザインガイドライン自動生成',
  description:
    'URLを入力するだけで、競合分析・ペルソナ推定・デザイントレンド分析を自動実行。3層構造の実務的なデザインガイドラインを生成します。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={inter.variable}>
      <body className="font-sans antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
