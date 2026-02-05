import { NextRequest, NextResponse } from 'next/server';
import { runAnalysisEngine } from '@/lib/analysis-engine';
import { runAgent } from '@/lib/agent';
import { generateDesignGuideline } from '@/lib/guideline-generator';
import { getWorksDataForPrompt } from '@/lib/works-scraper';
import type { AnalysisContext, ThoughtStep } from '@/types';

export const maxDuration = 300; // 5分のタイムアウト

interface GenerateRequest {
  targetUrl: string;
  industry?: string;
  targetAudience?: string;
  competitorUrls?: string[];
  additionalInfo?: string;
  useAgent?: boolean; // エージェントモードを使用するかどうか
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();

    if (!body.targetUrl) {
      return NextResponse.json(
        { error: '対象サイトURLが必要です' },
        { status: 400 }
      );
    }

    // URL形式の検証
    try {
      new URL(body.targetUrl);
    } catch {
      return NextResponse.json(
        { error: '有効なURLを入力してください' },
        { status: 400 }
      );
    }

    console.log('Starting analysis for:', body.targetUrl);
    console.log('Agent mode:', body.useAgent ? 'enabled' : 'disabled');

    let analysisContext: AnalysisContext;
    let thoughtHistory: ThoughtStep[] = [];

    if (body.useAgent) {
      // エージェントモード：AIが自律的に分析を実行
      console.log('Running agent mode...');
      
      const agentResult = await runAgent(body.targetUrl, {
        industry: body.industry,
        targetAudience: body.targetAudience,
        competitorUrls: body.competitorUrls?.filter((url) => url.trim() !== ''),
        additionalInfo: body.additionalInfo,
      });

      if (!agentResult.success) {
        return NextResponse.json(
          { 
            error: 'エージェント分析に失敗しました',
            details: agentResult.error,
          },
          { status: 500 }
        );
      }

      analysisContext = agentResult.context as AnalysisContext;
      thoughtHistory = agentResult.thoughtHistory;

      console.log('Agent analysis completed:', agentResult.summary);
      console.log('Steps taken:', agentResult.thoughtHistory.length);

    } else {
      // 従来モード：固定パイプライン
      console.log('Running pipeline mode...');
      
      analysisContext = await runAnalysisEngine({
        targetUrl: body.targetUrl,
        industry: body.industry,
        targetAudience: body.targetAudience,
        competitorUrls: body.competitorUrls?.filter((url) => url.trim() !== ''),
        additionalInfo: body.additionalInfo,
      });
    }

    console.log('Analysis completed, generating guidelines...');

    // ポストスケイプの実績データを取得
    let worksData: string | undefined;
    try {
      worksData = await getWorksDataForPrompt();
    } catch (error) {
      console.error('Failed to fetch works data:', error);
    }

    // デザインガイドラインを生成
    const guideline = await generateDesignGuideline(analysisContext, worksData);

    console.log('Guideline generated:', guideline.id);

    return NextResponse.json({
      success: true,
      guideline,
      analysisContext: {
        // ユーザー指定の業界を優先
        industry: analysisContext.industry || analysisContext.businessModel?.industry,
        serviceType: analysisContext.businessModel?.serviceType,
        targetAudience: analysisContext.persona?.primary.name || analysisContext.targetAudience,
        competitorsAnalyzed: analysisContext.competitors?.length || 0,
      },
      // エージェントモードの場合は思考履歴も返す
      ...(body.useAgent && {
        agentInfo: {
          thoughtHistory,
          stepsCount: thoughtHistory.length,
        },
      }),
    });
  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json(
      {
        error: 'ガイドライン生成中にエラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
