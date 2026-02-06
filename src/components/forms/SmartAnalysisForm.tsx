'use client';

import { useState, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Globe, 
  Sparkles, 
  Plus, 
  X,
  Upload,
  FileText,
  Image as ImageIcon,
  File,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card } from '@/components/ui/Card';
import type { DesignGuideline, CompetitorDocument, CompetitorImportMode } from '@/types';

interface Props {
  onGuidelineGenerated: (guideline: DesignGuideline) => void;
}

interface FormData {
  targetUrl: string;
  industry: string;
  targetAudience: string;
  additionalInfo: string;
}

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
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
  
  // 競合分析資料アップロード関連
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [competitorImportMode, setCompetitorImportMode] = useState<CompetitorImportMode>('combine_with_auto');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // フェーズ名をシンプルなメッセージに変換
  const getSimplifiedPhase = (phase: string): string => {
    // ツール名やエラーメッセージを含む詳細を隠す
    if (phase.includes('ファイル') || phase.includes('アップロード') || phase.includes('ドキュメント')) {
      return 'アップロード資料を解析しています...';
    }
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

  // ファイルアップロード処理
  const handleFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const allowedTypes = [
      'image/png', 'image/jpeg', 'image/jpg', 'image/webp',
      'application/pdf',
      'text/plain', 'text/markdown',
    ];

    const newFiles: UploadedFile[] = fileArray
      .filter(file => {
        if (!allowedTypes.includes(file.type)) {
          console.warn(`Unsupported file type: ${file.type}`);
          return false;
        }
        if (file.size > 10 * 1024 * 1024) {
          console.warn(`File too large: ${file.name}`);
          return false;
        }
        return true;
      })
      .map(file => {
        const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const uploadedFile: UploadedFile = {
          id,
          file,
          status: 'pending',
        };

        // 画像の場合はプレビューを生成
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setUploadedFiles(prev => 
              prev.map(f => f.id === id ? { ...f, preview: e.target?.result as string } : f)
            );
          };
          reader.readAsDataURL(file);
        }

        return uploadedFile;
      });

    setUploadedFiles(prev => [...prev, ...newFiles].slice(0, 10)); // 最大10ファイル
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const removeFile = useCallback((id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <ImageIcon size={16} />;
    if (file.type === 'application/pdf') return <FileText size={16} />;
    return <File size={16} />;
  };

  // アップロードファイルをCompetitorDocument形式に変換
  const convertFilesToDocuments = async (): Promise<CompetitorDocument[]> => {
    const documents: CompetitorDocument[] = [];

    for (const uploadedFile of uploadedFiles) {
      const file = uploadedFile.file;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const fileType: 'image' | 'pdf' | 'text' = 
        file.type.startsWith('image/') ? 'image' :
        file.type === 'application/pdf' ? 'pdf' : 'text';

      const doc: CompetitorDocument = {
        id: uploadedFile.id,
        fileName: file.name,
        fileType,
        status: 'pending',
      };

      if (fileType === 'image') {
        doc.imageBase64 = buffer.toString('base64');
      } else if (fileType === 'pdf') {
        doc.content = buffer.toString('base64');
      } else {
        doc.content = buffer.toString('utf-8');
      }

      documents.push(doc);
    }

    return documents;
  };

  const onSubmit = async (data: FormData) => {
    setIsAnalyzing(true);
    setError(null);
    setRealProgress(0);
    setCurrentPhase('開始中...');

    try {
      // アップロードファイルがある場合はドキュメントに変換
      let competitorDocuments: CompetitorDocument[] | undefined;
      if (uploadedFiles.length > 0) {
        setCurrentPhase('ファイルを準備しています...');
        competitorDocuments = await convertFilesToDocuments();
      }

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
          competitorDocuments,
          competitorImportMode: uploadedFiles.length > 0 ? competitorImportMode : undefined,
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
            <h2 className="text-2xl font-bold text-slate-800">デザインガイドライン生成</h2>
            <p className="text-slate-600 text-sm">
              サービス/商品のURLを入力して、効果的なLPを作成するためのデザインガイドラインを生成します
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
                  サービス/商品のウェブサイトURL <span className="text-red-500">*</span>
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
                placeholder="https://example.com"
                error={errors.targetUrl?.message}
              />
              <p className="mt-1 text-xs text-slate-500">
                ※ これからLPを作成するサービス/商品のウェブサイトURLを入力してください
              </p>
            </div>

            {/* 業界選択（必須） */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                業界/カテゴリ <span className="text-red-500">*</span>
              </label>
              <select
                {...register('industry', {
                  required: '業界/カテゴリを選択してください',
                })}
                className={`w-full px-4 py-3 rounded-lg bg-white border text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.industry ? 'border-red-500' : 'border-slate-300'
                }`}
              >
                <option value="">選択してください</option>
                {INDUSTRIES.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
              {errors.industry && (
                <p className="mt-1 text-xs text-red-500">{errors.industry.message}</p>
              )}
            </div>

            {/* ターゲット（任意） */}
            <Input
              {...register('targetAudience')}
              label="ターゲット顧客（任意）"
              placeholder="例: 30-50代の不動産オーナー、相続を検討している方"
              helperText="わかっている範囲で入力してください。空欄の場合は自動推定します。"
            />

            {/* 競合サイト URL（任意） */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                競合サイトのURL（任意・最大3件）
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
                  競合サイトを追加
                </button>
              )}
              <p className="mt-1 text-xs text-slate-500">
                ※ 空欄の場合、AIが自動で競合サイトを検索・分析します
              </p>
            </div>

            {/* 競合分析資料アップロード（任意） */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                競合分析資料のアップロード（任意）
              </label>
              <p className="text-xs text-slate-500 mb-2">
                すでに作成済みの競合分析資料があればアップロードしてください。スクリーンショット、PDF、テキストファイルに対応しています。
              </p>
              
              {/* ドロップゾーン */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                  ${isDragOver 
                    ? 'border-emerald-500 bg-emerald-50' 
                    : 'border-slate-300 hover:border-emerald-400 hover:bg-slate-50'
                  }
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".png,.jpg,.jpeg,.webp,.pdf,.txt,.md"
                  onChange={(e) => e.target.files && handleFiles(e.target.files)}
                  className="hidden"
                />
                <Upload size={32} className="mx-auto text-slate-400 mb-2" />
                <p className="text-sm text-slate-600">
                  ファイルをドラッグ＆ドロップ、またはクリックして選択
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  PNG, JPG, WebP, PDF, TXT, MD（最大10MB、10ファイルまで）
                </p>
              </div>

              {/* アップロード済みファイル一覧 */}
              {uploadedFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                  {uploadedFiles.map((uploadedFile) => (
                    <div
                      key={uploadedFile.id}
                      className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg"
                    >
                      {/* プレビュー or アイコン */}
                      <div className="w-10 h-10 flex-shrink-0 rounded overflow-hidden bg-slate-200 flex items-center justify-center">
                        {uploadedFile.preview ? (
                          <img
                            src={uploadedFile.preview}
                            alt={uploadedFile.file.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-slate-500">
                            {getFileIcon(uploadedFile.file)}
                          </span>
                        )}
                      </div>
                      
                      {/* ファイル情報 */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-700 truncate">
                          {uploadedFile.file.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {(uploadedFile.file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      
                      {/* 削除ボタン */}
                      <button
                        type="button"
                        onClick={() => removeFile(uploadedFile.id)}
                        className="p-1.5 rounded hover:bg-slate-200 text-slate-400 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}

                  {/* インポートモード選択 */}
                  <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                    <label className="block text-xs font-medium text-slate-600 mb-2">
                      競合分析の方法
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="importMode"
                          value="combine_with_auto"
                          checked={competitorImportMode === 'combine_with_auto'}
                          onChange={() => setCompetitorImportMode('combine_with_auto')}
                          className="text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm text-slate-700">
                          アップロード資料 + 自動検出を組み合わせる
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="importMode"
                          value="manual_only"
                          checked={competitorImportMode === 'manual_only'}
                          onChange={() => setCompetitorImportMode('manual_only')}
                          className="text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm text-slate-700">
                          アップロード資料のみ使用（自動検出をスキップ）
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
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
              デザインガイドラインを生成
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
              デザインガイドラインを作成中...
            </h3>
            <p className="text-slate-500 text-center text-sm mb-6">
              入力されたサービス/商品情報をもとに、効果的なLPを作成するためのデザインガイドラインを生成しています
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
