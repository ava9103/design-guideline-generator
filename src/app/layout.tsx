import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'LP Design Guideline Generator - AIによるLPデザインガイドライン自動生成',
  description:
    'ランディングページのURLを入力するだけで、競合分析・ペルソナ推定・デザイントレンド分析を自動実行。CVR向上に特化した3層構造のLPデザインガイドラインを生成します。',
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
