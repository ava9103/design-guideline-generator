import type { AnalysisContext, AnalysisStep, AnalysisProgress, CompetitorDocument, CompetitorImportMode } from '@/types';
import { analyzeSite, calculateAnalysisQuality } from './site-analyzer';
import {
  businessModelStep,
  personaStep,
  competitorStep,
  designTrendStep,
} from './modules';

// 分析ステップの定義（実行順序）
const ANALYSIS_STEPS: AnalysisStep[] = [
  // サイト分析ステップ（常に実行）
  {
    name: 'サイト構造分析',
    description: '対象サイトのコンテンツ、構造、ビジュアル要素を詳細分析',
    isRequired: () => true,
    async execute(context) {
      const siteAnalysis = await analyzeSite(context.targetUrl);
      
      // 分析品質チェック
      const quality = calculateAnalysisQuality(siteAnalysis);
      if (quality.score < 70) {
        console.warn(`⚠️ サイト分析品質が低い可能性があります (スコア: ${quality.score}/100)`);
        console.warn('問題点:');
        quality.issues.forEach(issue => console.warn(`  - ${issue}`));
        console.warn('※ URLとタイトルを基に分析を続行しますが、結果の精度に影響する可能性があります。');
      }
      
      // デバッグ用: 分析結果の概要をログ出力
      console.log('サイト分析結果:', {
        url: siteAnalysis.url,
        title: siteAnalysis.title,
        description: siteAnalysis.description?.substring(0, 100) + '...',
        headingsCount: siteAnalysis.headings.length,
        ctasCount: siteAnalysis.ctas.length,
        mainContentLength: siteAnalysis.mainContent.length,
        qualityScore: quality.score,
      });
      
      return { siteAnalysis };
    },
  },
  businessModelStep,
  personaStep,
  competitorStep,
  designTrendStep,
];

export type ProgressCallback = (progress: AnalysisProgress) => void;

export async function runAnalysisEngine(
  input: {
    targetUrl: string;
    industry?: string;
    targetAudience?: string;
    competitorUrls?: string[];
    additionalInfo?: string;
    competitorDocuments?: CompetitorDocument[];
    competitorImportMode?: CompetitorImportMode;
  },
  onProgress?: ProgressCallback
): Promise<AnalysisContext> {
  // 初期コンテキスト
  let context: AnalysisContext = {
    targetUrl: input.targetUrl,
    industry: input.industry,
    targetAudience: input.targetAudience,
    competitorUrls: input.competitorUrls,
    additionalInfo: input.additionalInfo,
    competitorDocuments: input.competitorDocuments,
    competitorImportMode: input.competitorImportMode,
  };

  const completedSteps: string[] = [];
  const totalSteps = ANALYSIS_STEPS.length;

  // 各ステップを順次実行
  for (let i = 0; i < ANALYSIS_STEPS.length; i++) {
    const step = ANALYSIS_STEPS[i];

    // 実行条件チェック
    if (!step.isRequired(context)) {
      console.log(`Skipping ${step.name}: not required`);
      continue;
    }

    // プログレス通知
    if (onProgress) {
      onProgress({
        currentStep: step.name,
        completedSteps: [...completedSteps],
        totalSteps,
        progress: Math.round((i / totalSteps) * 100),
      });
    }

    console.log(`Executing ${step.name}...`);

    try {
      // ステップ実行
      const result = await step.execute(context);

      // コンテキスト更新
      context = { ...context, ...result };

      completedSteps.push(step.name);
    } catch (error) {
      console.error(`Error in ${step.name}:`, error);
      // エラーでも続行（部分的な分析結果を返す）
    }
  }

  // 完了通知
  if (onProgress) {
    onProgress({
      currentStep: '完了',
      completedSteps,
      totalSteps,
      progress: 100,
    });
  }

  return context;
}

// 分析ステップ名の一覧を取得
export function getAnalysisStepNames(): string[] {
  return ANALYSIS_STEPS.map((step) => step.name);
}

// 個別のモジュールもエクスポート
export { analyzeSite, analyzeSites } from './site-analyzer';
export * from './modules';
