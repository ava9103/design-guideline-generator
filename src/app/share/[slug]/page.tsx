'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, AlertTriangle, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { GuidelineReport } from '@/components/report/GuidelineReport';
import { getGuidelineBySlugAsync } from '@/lib/history';
import type { DesignGuideline } from '@/types';

export default function SharePage() {
  const params = useParams();
  const slug = params.slug as string;

  const [guideline, setGuideline] = useState<DesignGuideline | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (slug) {
      // 非同期でローカルとSupabaseの両方を確認
      getGuidelineBySlugAsync(slug)
        .then((data) => {
          setGuideline(data);
          setIsLoaded(true);
        })
        .catch(() => {
          setIsLoaded(true);
        });
    }
  }, [slug]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-slate-500">読み込み中...</div>
      </div>
    );
  }

  if (!guideline) {
    return (
      <div className="min-h-screen bg-white">
        <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500">
                  <Sparkles className="text-white" size={20} />
                </div>
                <h1 className="text-xl font-bold text-slate-800">
                  Design Guideline Generator
                </h1>
              </Link>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto bg-amber-50 border border-amber-200 text-center py-12">
            <AlertTriangle className="mx-auto text-amber-500 mb-4" size={48} />
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              共有リンクが無効です
            </h2>
            <p className="text-slate-600 text-sm mb-6">
              このガイドラインは削除されたか、リンクが無効になっています。
              <br />
              ※ 共有リンクは作成者のブラウザでのみ有効です。
            </p>
            <Link href="/">
              <Button>
                <Sparkles size={16} className="mr-1" />
                自分でガイドラインを作成
              </Button>
            </Link>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500">
                  <Sparkles className="text-white" size={20} />
                </div>
                <h1 className="text-xl font-bold text-slate-800">
                  Design Guideline Generator
                </h1>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 flex items-center gap-1">
                <Share2 size={14} />
                共有ビュー
              </span>
              <Link href="/">
                <Button size="sm">
                  <Sparkles size={16} className="mr-1" />
                  自分で作成
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 共有バナー */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-200">
        <div className="container mx-auto px-4 py-3">
          <p className="text-center text-sm text-purple-600">
            これは共有されたデザインガイドラインです
          </p>
        </div>
      </div>

      {/* メインコンテンツ */}
      <main className="container mx-auto px-4 py-8">
        <GuidelineReport guideline={guideline} />
      </main>

      {/* フッター */}
      <footer className="border-t border-slate-200 py-6">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>Design Guideline Generator - Powered by Llama 3.1</p>
        </div>
      </footer>
    </div>
  );
}
