'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowLeft, 
  History, 
  Share2, 
  Check, 
  Copy,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { GuidelineReport } from '@/components/report/GuidelineReport';
import { getGuidelineById, deleteGuideline, generateShareSlug } from '@/lib/history';
import type { DesignGuideline } from '@/types';

export default function HistoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [guideline, setGuideline] = useState<DesignGuideline | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (id) {
      const data = getGuidelineById(id);
      setGuideline(data);
      setIsLoaded(true);
    }
  }, [id]);

  const handleShare = () => {
    const slug = generateShareSlug(id);
    const url = `${window.location.origin}/share/${slug}`;
    setShareUrl(url);
    setShowShareModal(true);
    
    // ガイドラインを再取得して状態を更新
    const updated = getGuidelineById(id);
    setGuideline(updated);
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // フォールバック
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

  const handleDelete = () => {
    deleteGuideline(id);
    router.push('/history');
  };

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
              ガイドラインが見つかりません
            </h2>
            <p className="text-slate-600 text-sm mb-6">
              このガイドラインは削除されたか、存在しません
            </p>
            <div className="flex justify-center gap-2">
              <Link href="/history">
                <Button variant="secondary">
                  <History size={16} className="mr-1" />
                  履歴一覧
                </Button>
              </Link>
              <Link href="/">
                <Button>
                  <Sparkles size={16} className="mr-1" />
                  新規作成
                </Button>
              </Link>
            </div>
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
              <Link href="/history">
                <Button variant="ghost" size="sm">
                  <ArrowLeft size={16} className="mr-1" />
                  履歴一覧
                </Button>
              </Link>
              
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={handleShare}
              >
                <Share2 size={16} className="mr-1" />
                共有
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                className="text-slate-400 hover:text-red-400 hover:bg-red-500/10"
              >
                <Trash2 size={16} />
              </Button>
              
              <Link href="/">
                <Button size="sm">
                  <Sparkles size={16} className="mr-1" />
                  新規作成
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

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

      {/* 削除確認モーダル */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-white max-w-md w-full shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-red-500" size={24} />
              <h3 className="text-lg font-bold text-slate-800">ガイドラインを削除</h3>
            </div>
            
            <p className="text-slate-600 text-sm mb-6">
              「{guideline.title}」を削除しますか？この操作は取り消せません。
            </p>
            
            <div className="flex justify-end gap-2">
              <Button 
                variant="secondary" 
                onClick={() => setShowDeleteConfirm(false)}
              >
                キャンセル
              </Button>
              <Button 
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600"
              >
                削除
              </Button>
            </div>
          </Card>
        </div>
      )}

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
