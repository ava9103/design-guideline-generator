'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  History, 
  Trash2, 
  ExternalLink, 
  Calendar, 
  Globe,
  Sparkles,
  ArrowLeft,
  Share2,
  AlertTriangle,
  Cloud,
  CloudOff,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { 
  getHistoryList, 
  deleteGuideline, 
  clearAllHistory,
  syncUnsyncedGuidelines,
  type GuidelineHistoryItem 
} from '@/lib/history';
import { isSupabaseConfigured } from '@/lib/storage';

export default function HistoryPage() {
  const [history, setHistory] = useState<GuidelineHistoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [cloudEnabled, setCloudEnabled] = useState(false);

  useEffect(() => {
    setHistory(getHistoryList());
    setCloudEnabled(isSupabaseConfigured());
    setIsLoaded(true);
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const result = await syncUnsyncedGuidelines();
      if (result.synced > 0) {
        setHistory(getHistoryList());
        alert(`${result.synced}件のガイドラインをクラウドに同期しました`);
      } else if (result.failed > 0) {
        alert(`同期に失敗しました（${result.failed}件）`);
      } else {
        alert('すべてのガイドラインは既に同期されています');
      }
    } catch (error) {
      console.error('Sync failed:', error);
      alert('同期中にエラーが発生しました');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('このガイドラインを削除しますか？')) {
      deleteGuideline(id);
      setHistory(getHistoryList());
    }
  };

  const handleClearAll = () => {
    clearAllHistory();
    setHistory([]);
    setShowClearConfirm(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.hostname + (parsed.pathname !== '/' ? parsed.pathname.slice(0, 30) + '...' : '');
    } catch {
      return url.slice(0, 40) + '...';
    }
  };

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
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft size={16} className="mr-1" />
                  新規作成
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* ページタイトル */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                <History className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">履歴</h2>
                <p className="text-slate-600 text-sm">
                  過去に作成したガイドラインを参照・共有できます
                </p>
              </div>
            </div>

            {history.length > 0 && (
              <div className="flex items-center gap-2">
                {cloudEnabled && (
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="text-emerald-600 hover:text-emerald-700"
                  >
                    {isSyncing ? (
                      <Loader2 size={16} className="mr-1 animate-spin" />
                    ) : (
                      <RefreshCw size={16} className="mr-1" />
                    )}
                    同期
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowClearConfirm(true)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 size={16} className="mr-1" />
                  すべて削除
                </Button>
              </div>
            )}
          </div>

          {/* 全削除確認モーダル */}
          {showClearConfirm && (
            <Card className="bg-red-50 border border-red-200 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-red-500 flex-shrink-0" size={24} />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-red-600 mb-2">
                    すべての履歴を削除しますか？
                  </h3>
                  <p className="text-slate-600 text-sm mb-4">
                    この操作は取り消せません。すべてのガイドラインデータが削除されます。
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={() => setShowClearConfirm(false)}
                    >
                      キャンセル
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleClearAll}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      すべて削除
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* 履歴一覧 */}
          {!isLoaded ? (
            <div className="text-center py-16">
              <div className="animate-pulse text-slate-500">読み込み中...</div>
            </div>
          ) : history.length === 0 ? (
            <Card className="bg-slate-50 text-center py-16">
              <History className="mx-auto text-slate-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-slate-600 mb-2">
                履歴がありません
              </h3>
              <p className="text-slate-500 text-sm mb-6">
                ガイドラインを生成すると、ここに履歴が表示されます
              </p>
              <Link href="/">
                <Button>
                  <Sparkles size={16} className="mr-2" />
                  新規作成
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <Card 
                  key={item.id} 
                  className="bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <Link href={`/history/${item.id}`}>
                        <h3 className="text-lg font-bold text-slate-800 hover:text-emerald-600 transition-colors truncate">
                          {item.title}
                        </h3>
                      </Link>
                      
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <Globe size={14} />
                          <span className="truncate max-w-[200px]">
                            {formatUrl(item.targetUrl)}
                          </span>
                        </div>
                        
                        {item.industry && (
                          <span className="px-2 py-0.5 bg-slate-100 rounded text-xs text-slate-600">
                            {item.industry}
                          </span>
                        )}
                        
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{formatDate(item.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* クラウド同期ステータス */}
                      {cloudEnabled && (
                        <span 
                          className={`text-xs flex items-center gap-1 ${
                            item.syncedToCloud 
                              ? 'text-emerald-600' 
                              : 'text-slate-400'
                          }`}
                          title={item.syncedToCloud ? 'クラウドに保存済み' : 'ローカルのみ'}
                        >
                          {item.syncedToCloud ? (
                            <Cloud size={12} />
                          ) : (
                            <CloudOff size={12} />
                          )}
                        </span>
                      )}

                      {item.shareSlug && (
                        <span className="text-xs text-emerald-600 flex items-center gap-1">
                          <Share2 size={12} />
                          共有中
                        </span>
                      )}
                      
                      <Link href={`/history/${item.id}`}>
                        <Button variant="secondary" size="sm">
                          <ExternalLink size={14} className="mr-1" />
                          開く
                        </Button>
                      </Link>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        className="text-slate-400 hover:text-red-500 hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* 統計情報 */}
          {history.length > 0 && (
            <div className="mt-8 text-center text-slate-500 text-sm">
              {history.length}件のガイドラインが保存されています
              {cloudEnabled && (
                <span className="ml-2">
                  （クラウド同期: {history.filter(h => h.syncedToCloud).length}/{history.length}）
                </span>
              )}
            </div>
          )}
        </div>
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
