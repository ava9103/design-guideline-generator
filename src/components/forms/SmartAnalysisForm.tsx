'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Loader2, 
  Globe, 
  Sparkles, 
  CheckCircle, 
  Circle, 
  Plus, 
  X, 
  Brain, 
  Zap,
  MessageSquare,
  Wrench,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card } from '@/components/ui/Card';
import type { DesignGuideline, ThoughtStep } from '@/types';

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
  'IT・情報通信・アプリ',
  '小売・消費財・商品',
  'ライフイベント',
  '暮らし・レジャー',
  '学校・資格・教育',
  '建築・不動産',
  '人材・採用',
  '病院・クリニック・サロン',
  '広告・放送・出版',
  '金融・証券・保険',
  'ビジネスサービス',
  'その他',
];

const PIPELINE_STEPS = [
  { id: 'site', name: 'サイト構造分析', description: '対象サイトのコンテンツと構造を解析中...' },
  { id: 'business', name: 'ビジネスモデル推定', description: '業界とビジネスモデルを推定中...' },
  { id: 'persona', name: 'ペルソナ推定', description: 'ターゲットユーザーを推定中...' },
  { id: 'competitor', name: '競合分析', description: '競合サイトを検出・分析中...' },
  { id: 'trend', name: 'デザイントレンド分析', description: '業界のデザイントレンドを分析中...' },
  { id: 'cvr', name: 'CVR要素分析', description: 'コンバージョン要素を分析中...' },
  { id: 'guideline', name: 'ガイドライン生成', description: 'デザインガイドラインを生成中...' },
];

export function SmartAnalysisForm({ onGuidelineGenerated }: Props) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [useAgentMode, setUseAgentMode] = useState(true); // デフォルトでエージェントモードON
  const [currentStep, setCurrentStep] = useState('');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [competitorUrls, setCompetitorUrls] = useState<string[]>(['']);
  const [error, setError] = useState<string | null>(null);
  const [agentThoughts, setAgentThoughts] = useState<ThoughtStep[]>([]);

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

  const simulateProgress = () => {
    if (useAgentMode) return () => {}; // エージェントモードでは使用しない
    
    const steps = PIPELINE_STEPS.map((s) => s.id);
    let index = 0;

    const interval = setInterval(() => {
      if (index < steps.length) {
        setCurrentStep(steps[index]);
        if (index > 0) {
          setCompletedSteps((prev) => [...prev, steps[index - 1]]);
        }
        index++;
      } else {
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  };

  const onSubmit = async (data: FormData) => {
    setIsAnalyzing(true);
    setError(null);
    setCompletedSteps([]);
    setAgentThoughts([]);
    setCurrentStep(useAgentMode ? 'agent_thinking' : PIPELINE_STEPS[0].id);

    // プログレスシミュレーション開始（パイプラインモードのみ）
    const cleanup = simulateProgress();

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUrl: data.targetUrl,
          industry: data.industry || undefined,
          targetAudience: data.targetAudience || undefined,
          competitorUrls: competitorUrls.filter((url) => url.trim() !== ''),
          additionalInfo: data.additionalInfo || undefined,
          useAgent: useAgentMode,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'ガイドライン生成に失敗しました');
      }

      // エージェントの思考履歴を保存
      if (result.agentInfo?.thoughtHistory) {
        setAgentThoughts(result.agentInfo.thoughtHistory);
      }

      // 全ステップ完了
      setCompletedSteps(PIPELINE_STEPS.map((s) => s.id));
      setCurrentStep('complete');

      // 少し待ってから結果を表示
      setTimeout(() => {
        onGuidelineGenerated(result.guideline);
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期しないエラーが発生しました');
    } finally {
      cleanup();
      setIsAnalyzing(false);
    }
  };

  const progress = useAgentMode 
    ? (agentThoughts.length / 12) * 100  // エージェントは最大12ステップ
    : (completedSteps.length / PIPELINE_STEPS.length) * 100;

  const getThoughtIcon = (type: ThoughtStep['type']) => {
    switch (type) {
      case 'thought':
        return <Brain className="text-purple-400" size={16} />;
      case 'action':
        return <Wrench className="text-yellow-400" size={16} />;
      case 'observation':
        return <Eye className="text-blue-400" size={16} />;
      case 'final_answer':
        return <CheckCircle2 className="text-emerald-400" size={16} />;
      default:
        return <MessageSquare className="text-slate-400" size={16} />;
    }
  };

  const getThoughtLabel = (type: ThoughtStep['type']) => {
    switch (type) {
      case 'thought':
        return '思考';
      case 'action':
        return 'アクション';
      case 'observation':
        return '観察';
      case 'final_answer':
        return '完了';
      default:
        return '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-slate-800/80 backdrop-blur">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500">
            <Sparkles className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">スマート分析モード</h2>
            <p className="text-slate-400 text-sm">
              URLを入力するだけで、AIが自動的に分析を実行します
            </p>
          </div>
        </div>

        {!isAnalyzing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* エージェントモード切り替え */}
            <div className="p-4 rounded-lg bg-slate-700/50 border border-slate-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${useAgentMode ? 'bg-purple-500/20' : 'bg-slate-600/50'}`}>
                    {useAgentMode ? (
                      <Brain className="text-purple-400" size={20} />
                    ) : (
                      <Zap className="text-slate-400" size={20} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      {useAgentMode ? 'エージェントモード' : 'パイプラインモード'}
                    </p>
                    <p className="text-xs text-slate-400">
                      {useAgentMode 
                        ? 'AIが自律的に分析計画を立て、必要な情報を収集します'
                        : '固定の順序で分析を実行します'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setUseAgentMode(!useAgentMode)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    useAgentMode ? 'bg-purple-500' : 'bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      useAgentMode ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* URL入力 */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Globe size={18} className="text-emerald-400" />
                <label className="text-sm font-medium text-slate-300">
                  対象サイトURL <span className="text-red-400">*</span>
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
            </div>

            {/* 業界選択（任意） */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                業界/カテゴリ（任意）
              </label>
              <select
                {...register('industry')}
                className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">自動推定する</option>
                {INDUSTRIES.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-slate-400">
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

            {/* 競合URL（任意） */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                競合サイトURL（任意・最大3件）
              </label>
              <div className="space-y-2">
                {competitorUrls.map((url, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={url}
                      onChange={(e) => updateCompetitorUrl(index, e.target.value)}
                      placeholder="https://competitor.com"
                      className="flex-1"
                    />
                    {competitorUrls.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCompetitorUrl(index)}
                        className="p-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white"
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
                  className="mt-2 flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300"
                >
                  <Plus size={16} />
                  競合を追加
                </button>
              )}
              <p className="mt-1 text-xs text-slate-400">
                ※ 空欄の場合、AIが自動で競合を検出・分析します
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
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
                {error}
              </div>
            )}

            {/* 送信ボタン */}
            <Button type="submit" className="w-full py-4 text-lg font-bold">
              {useAgentMode ? '🤖 エージェント分析を開始' : '🚀 スマート分析を開始'}
            </Button>
          </form>
        ) : (
          /* 分析中の表示 */
          <div className="py-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Loader2 className="animate-spin text-emerald-400" size={56} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-emerald-400">
                    {Math.round(progress)}%
                  </span>
                </div>
              </div>
            </div>

            {useAgentMode ? (
              /* エージェントモードの表示 */
              <>
                <h3 className="text-xl font-bold text-center text-white mb-2">
                  <Brain className="inline-block mr-2 text-purple-400" size={24} />
                  エージェントが分析中...
                </h3>
                <p className="text-slate-400 text-center mb-6">
                  AIが自律的に分析計画を立て、情報を収集しています
                </p>

                {/* プログレスバー */}
                <div className="w-full bg-slate-700 rounded-full h-2 mb-6">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* エージェントの思考履歴 */}
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {agentThoughts.length === 0 ? (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-700/50 animate-pulse">
                      <Brain className="text-purple-400" size={20} />
                      <span className="text-purple-300">分析計画を立てています...</span>
                    </div>
                  ) : (
                    agentThoughts.map((thought, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-3 px-4 py-3 rounded-lg ${
                          thought.type === 'thought' ? 'bg-purple-500/10 border border-purple-500/30' :
                          thought.type === 'action' ? 'bg-yellow-500/10 border border-yellow-500/30' :
                          thought.type === 'observation' ? 'bg-blue-500/10 border border-blue-500/30' :
                          'bg-emerald-500/10 border border-emerald-500/30'
                        }`}
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          {getThoughtIcon(thought.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-medium ${
                              thought.type === 'thought' ? 'text-purple-400' :
                              thought.type === 'action' ? 'text-yellow-400' :
                              thought.type === 'observation' ? 'text-blue-400' :
                              'text-emerald-400'
                            }`}>
                              {getThoughtLabel(thought.type)}
                            </span>
                            {thought.toolCall && (
                              <span className="text-xs text-slate-500 bg-slate-700 px-2 py-0.5 rounded">
                                {thought.toolCall.name}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-300 break-words">
                            {thought.content.length > 150 
                              ? thought.content.slice(0, 150) + '...' 
                              : thought.content}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              /* パイプラインモードの表示 */
              <>
                <h3 className="text-xl font-bold text-center text-white mb-2">
                  {PIPELINE_STEPS.find((s) => s.id === currentStep)?.name || '分析中...'}
                </h3>
                <p className="text-slate-400 text-center mb-8">
                  {PIPELINE_STEPS.find((s) => s.id === currentStep)?.description}
                </p>

                {/* プログレスバー */}
                <div className="w-full bg-slate-700 rounded-full h-2 mb-8">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* ステップ一覧 */}
                <div className="space-y-3">
                  {PIPELINE_STEPS.map((step) => {
                    const isCompleted = completedSteps.includes(step.id);
                    const isCurrent = currentStep === step.id;

                    return (
                      <div
                        key={step.id}
                        className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                          isCurrent ? 'bg-slate-700/50' : ''
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="text-emerald-400 flex-shrink-0" size={20} />
                        ) : isCurrent ? (
                          <Loader2 className="animate-spin text-yellow-400 flex-shrink-0" size={20} />
                        ) : (
                          <Circle className="text-slate-600 flex-shrink-0" size={20} />
                        )}
                        <span
                          className={
                            isCompleted
                              ? 'text-emerald-400'
                              : isCurrent
                                ? 'text-yellow-400'
                                : 'text-slate-500'
                          }
                        >
                          {step.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
