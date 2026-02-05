'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Globe, 
  Sparkles, 
  Plus, 
  X
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card } from '@/components/ui/Card';
import type { DesignGuideline } from '@/types';

interface Props {
  onGuidelineGenerated: (guideline: DesignGuideline) => void;
}

interface FormData {
  targetUrl: string;
  industry: string;
  targetAudience: string;
  additionalInfo: string;
}

const INDUSTRIES = [
  // 物販系
  '美容・健康',
  'ファッション・アクセサリー',
  '食品・飲料',
  '家電・デジタル',
  '生活用品',
  'ホビー・その他物販',
  // サービス系（個人向け）
  '美容・ヘルスケアサービス',
  '教育・スクール',
  'エンタメ・サブスク',
  'ライフイベント・冠婚葬祭',
  '旅行・レジャー',
  '生活サービス',
  // 高額商材・契約系
  '金融',
  '不動産・住宅',
  '自動車',
  '通信・インターネット回線',
  // BtoB・専門サービス
  '人材・キャリア',
  '法律・士業サービス',
  'BtoB・IT・SaaS',
  '医療・ヘルスケア',
  'その他専門サービス',
];

export function SmartAnalysisForm({ onGuidelineGenerated }: Props) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [competitorUrls, setCompetitorUrls] = useState<string[]>(['']);
  const [error, setError] = useState<string | null>(null);
  const [realProgress, setRealProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('');

  // フェーズ名をシンプルなメッセージに変換
  const getSimplifiedPhase = (phase: string): string => {
    // ツール名やエラーメッセージを含む詳細を隠す
    if (phase.includes('analyze_site') || phase.includes('サイト分析')) {
      return 'サイトを分析しています...';
    }
    if (phase.includes('search_competitors') || phase.includes('競合')) {
      return '市場を調査しています...';
    }
    if (phase.includes('estimate_business') || phase.includes('ビジネス')) {
      return 'ビジネスモデルを分析しています...';
    }
    if (phase.includes('estimate_persona') || phase.includes('ペルソナ')) {
      return 'ターゲット層を分析しています...';
    }
    if (phase.includes('design_trend') || phase.includes('トレンド')) {
      return 'デザイントレンドを調査しています...';
    }
    if (phase.includes('ツール') || phase.includes('実行中')) {
      return '情報を収集しています...';
    }
    if (phase.includes('生成中') || phase.includes('Layer')) {
      return 'ガイドラインを生成しています...';
    }
    if (phase.includes('完了')) {
      return '完了しました';
    }
    // デフォルト: 汎用的なメッセージ
    return '処理中...';
  };

  // SSEから実際の進捗を受け取るので、シミュレーションは不要

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const addCompetitorUrl = () => {
    if (competitorUrls.length < 3) {
      setCompetitorUrls([...competitorUrls, '']);
    }
  };

  const removeCompetitorUrl = (index: number) => {
    setCompetitorUrls(competitorUrls.filter((_, i) => i !== index));
  };

  const updateCompetitorUrl = (index: number, value: string) => {
    const updated = [...competitorUrls];
    updated[index] = value;
    setCompetitorUrls(updated);
  };

  const onSubmit = async (data: FormData) => {
    setIsAnalyzing(true);
    setError(null);
    setRealProgress(0);
    setCurrentPhase('開始中...');

    try {
      // SSEストリーミングを使用
      const response = await fetch('/api/generate/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUrl: data.targetUrl,
          industry: data.industry || undefined,
          targetAudience: data.targetAudience || undefined,
          competitorUrls: competitorUrls.filter((url) => url.trim() !== ''),
          additionalInfo: data.additionalInfo || undefined,
          useAgent: true,
        }),
      });

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.error || 'ガイドライン生成に失敗しました');
      }

      // SSEストリームを処理
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('ストリームの読み取りに失敗しました');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('event: ')) {
            // イベントタイプは次のdata行で処理
            continue;
          }
          
          if (line.startsWith('data: ')) {
            try {
              const eventData = JSON.parse(line.substring(6));
              
              // イベントタイプに応じた処理
              if (eventData.step) {
                // thoughtイベント：エージェントの思考ステップ（進捗のみ更新）
                const agentProgress = Math.min(50, eventData.totalSteps * 4);
                setRealProgress(agentProgress);
              } else if (eventData.progress !== undefined) {
                // progressイベント：ガイドライン生成進捗（50-100%）
                const adjustedProgress = 50 + (eventData.progress / 2);
                setRealProgress(adjustedProgress);
                setCurrentPhase(eventData.currentStep || '生成中...');
              } else if (eventData.phase) {
                // phaseイベント：フェーズ変更
                setCurrentPhase(eventData.message || eventData.phase);
              } else if (eventData.tool) {
                // tool_startまたはtool_endイベント
                if (eventData.summary) {
                  setCurrentPhase(`ツール完了: ${eventData.tool}`);
                } else {
                  setCurrentPhase(`実行中: ${eventData.tool}`);
                }
              } else if (eventData.guideline) {
                // completeイベント：完了
                setRealProgress(100);
                setCurrentPhase('完了');
                setIsAnalyzing(false);
                setTimeout(() => {
                  onGuidelineGenerated(eventData.guideline);
                }, 300);
                return;
              } else if (eventData.error) {
                // errorイベント
                throw new Error(eventData.error);
              }
            } catch (parseError) {
              // JSONパースエラーがerrorイベントからのものでなければ無視
              if (parseError instanceof SyntaxError) {
                console.warn('Failed to parse SSE data:', line.substring(6));
              } else {
                throw parseError;
              }
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期しないエラーが発生しました');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // SSEからのリアルタイム進捗を使用
  const progress = realProgress;

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-white border border-slate-200 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500">
            <Sparkles className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">LPデザインガイドライン生成</h2>
            <p className="text-slate-600 text-sm">
              LPのURLと情報を入力して、CVR向上に最適なデザインガイドラインを作成します
            </p>
          </div>
        </div>

        {!isAnalyzing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* URL入力 */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Globe size={18} className="text-emerald-600" />
                <label className="text-sm font-medium text-slate-700">
                  対象LP（ランディングページ）のURL <span className="text-red-500">*</span>
                </label>
              </div>
              <Input
                {...register('targetUrl', {
                  required: 'URLを入力してください',
                  pattern: {
                    value: /^https?:\/\/.+/,
                    message: '有効なURLを入力してください（http:// または https:// で始まる）',
                  },
                })}
                type="url"
                placeholder="https://example.com/lp"
                error={errors.targetUrl?.message}
              />
              <p className="mt-1 text-xs text-slate-500">
                ※ デザインガイドラインを作成したいLPのURLを入力してください
              </p>
            </div>

            {/* 業界選択（任意） */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                業界/カテゴリ（任意）
              </label>
              <select
                {...register('industry')}
                className="w-full px-4 py-3 rounded-lg bg-white border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">自動推定する</option>
                {INDUSTRIES.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-slate-500">
                ※ 空欄の場合、AIが自動で業界を推定します
              </p>
            </div>

            {/* ターゲット（任意） */}
            <Input
              {...register('targetAudience')}
              label="ターゲット顧客（任意）"
              placeholder="例: 30-50代の不動産オーナー、相続を検討している方"
              helperText="わかっている範囲で入力してください。空欄の場合は自動推定します。"
            />

            {/* 競合LP URL（任意） */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                競合LPのURL（任意・最大3件）
              </label>
              <div className="space-y-2">
                {competitorUrls.map((url, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={url}
                      onChange={(e) => updateCompetitorUrl(index, e.target.value)}
                      placeholder="https://competitor.com/lp"
                      className="flex-1"
                    />
                    {competitorUrls.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCompetitorUrl(index)}
                        className="p-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {competitorUrls.length < 3 && (
                <button
                  type="button"
                  onClick={addCompetitorUrl}
                  className="mt-2 flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700"
                >
                  <Plus size={16} />
                  競合LPを追加
                </button>
              )}
              <p className="mt-1 text-xs text-slate-500">
                ※ 空欄の場合、AIが自動で競合LPを検索・分析します
              </p>
            </div>

            {/* 追加情報（任意） */}
            <Textarea
              {...register('additionalInfo')}
              label="追加情報（任意）"
              placeholder="その他、デザインに関する要望や補足情報があれば入力してください"
              rows={3}
            />

            {/* エラー表示 */}
            {error && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-600">
                {error}
              </div>
            )}

            {/* 送信ボタン */}
            <Button type="submit" className="w-full py-4 text-lg font-bold">
              LPデザインガイドラインを生成
            </Button>
          </form>
        ) : (
          /* 分析中の表示（シンプル版） */
          <div className="py-12">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-slate-200">
                  <div 
                    className="w-24 h-24 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin absolute inset-0"
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-emerald-600">
                    {Math.round(progress)}%
                  </span>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold text-center text-slate-800 mb-3">
              LPデザインガイドラインを作成中...
            </h3>
            <p className="text-slate-500 text-center text-sm mb-6">
              入力情報をもとに、CVR向上に最適なLPデザインガイドラインを生成しています
            </p>

            {/* プログレスバー */}
            <div className="w-full max-w-md mx-auto bg-slate-200 rounded-full h-2 mb-4">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* 現在のフェーズをシンプルに表示 */}
            {currentPhase && (
              <p className="text-slate-400 text-center text-xs">
                {getSimplifiedPhase(currentPhase)}
              </p>
            )}

            {/* ヒント */}
            <div className="mt-8 text-center">
              <p className="text-slate-400 text-xs">
                通常1〜2分程度で完了します
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
