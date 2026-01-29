'use client';

import { useState } from 'react';
import { SmartAnalysisForm } from '@/components/forms/SmartAnalysisForm';
import { GuidelineReport } from '@/components/report/GuidelineReport';
import type { DesignGuideline } from '@/types';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Home() {
  const [guideline, setGuideline] = useState<DesignGuideline | null>(null);

  const handleReset = () => {
    setGuideline(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* ヘッダー */}
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500">
                <Sparkles className="text-white" size={20} />
              </div>
              <h1 className="text-xl font-bold text-white">
                Design Guideline Generator
              </h1>
            </div>

            {guideline && (
              <Button variant="ghost" size="sm" onClick={handleReset}>
                <ArrowLeft size={16} className="mr-1" />
                新規作成
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container mx-auto px-4 py-8">
        {!guideline ? (
          <SmartAnalysisForm onGuidelineGenerated={setGuideline} />
        ) : (
          <GuidelineReport guideline={guideline} />
        )}
      </main>

      {/* フッター */}
      <footer className="border-t border-slate-700/50 py-6">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>Design Guideline Generator - Powered by Llama 3.1</p>
        </div>
      </footer>
    </div>
  );
}
