'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SmartAnalysisForm } from '@/components/forms/SmartAnalysisForm';
import { GuidelineReport } from '@/components/report/GuidelineReport';
import type { DesignGuideline } from '@/types';
import { ArrowLeft, Sparkles, History, Share2, Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { saveGuideline, generateShareSlug } from '@/lib/history';

export default function Home() {
  const [guideline, setGuideline] = useState<DesignGuideline | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  // GuidelineReportからの共有イベントをリッスン
  useEffect(() => {
    const handleOpenShareModal = () => {
      handleShare();
    };

    window.addEventListener('openShareModal', handleOpenShareModal);
    return () => {
      window.removeEventListener('openShareModal', handleOpenShareModal);
    };
  }, [guideline]);

  const handleGuidelineGenerated = (newGuideline: DesignGuideline) => {
    // 履歴に保存
    saveGuideline(newGuideline);
    setGuideline(newGuideline);
  };

  const handleReset = () => {
    setGuideline(null);
  };

  const handleShare = () => {
    if (!guideline) return;
    const slug = generateShareSlug(guideline.id);
    const url = `${window.location.origin}/share/${slug}`;
    setShareUrl(url);
    setShowShareModal(true);
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500">
                <Sparkles className="text-white" size={20} />
              </div>
              <h1 className="text-xl font-bold text-slate-800">
                LP Design Guideline Generator
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/history">
                <Button variant="ghost" size="sm">
                  <History size={16} className="mr-1" />
                  履歴
                </Button>
              </Link>

              {guideline && (
                <>
                  <Button variant="secondary" size="sm" onClick={handleShare}>
                    <Share2 size={16} className="mr-1" />
                    共有
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleReset}>
                    <ArrowLeft size={16} className="mr-1" />
                    新規作成
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container mx-auto px-4 py-8">
        {!guideline ? (
          <SmartAnalysisForm onGuidelineGenerated={handleGuidelineGenerated} />
        ) : (
          <GuidelineReport guideline={guideline} />
        )}

        {/* 共有モーダル */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="bg-white max-w-md w-full shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500">
                  <Share2 className="text-white" size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-800">ガイドラインを共有</h3>
              </div>
              
              <p className="text-slate-600 text-sm mb-4">
                以下のURLを共有すると、このガイドラインを他の人と共有できます。
              </p>
              
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-4 py-2 rounded-lg bg-slate-100 border border-slate-300 text-slate-800 text-sm"
                />
                <Button onClick={handleCopyUrl}>
                  {copied ? (
                    <>
                      <Check size={16} className="mr-1" />
                      コピー済み
                    </>
                  ) : (
                    <>
                      <Copy size={16} className="mr-1" />
                      コピー
                    </>
                  )}
                </Button>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  variant="secondary" 
                  onClick={() => setShowShareModal(false)}
                >
                  閉じる
                </Button>
              </div>
            </Card>
          </div>
        )}
      </main>

      {/* フッター */}
      <footer className="border-t border-slate-200 py-6">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>LP Design Guideline Generator - Powered by Llama 3.1</p>
        </div>
      </footer>
    </div>
  );
}
