import { NextRequest, NextResponse } from 'next/server';
import { runAnalysisEngine } from '@/lib/analysis-engine';
import { generateDesignGuideline } from '@/lib/guideline-generator';
import { getWorksDataForPrompt } from '@/lib/works-scraper';

export const maxDuration = 300; // 5分のタイムアウト

interface GenerateRequest {
  targetUrl: string;
  industry?: string;
  targetAudience?: string;
  competitorUrls?: string[];
  additionalInfo?: string;
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

    // 分析エンジンを実行
    const analysisContext = await runAnalysisEngine({
      targetUrl: body.targetUrl,
      industry: body.industry,
      targetAudience: body.targetAudience,
      competitorUrls: body.competitorUrls?.filter((url) => url.trim() !== ''),
      additionalInfo: body.additionalInfo,
    });

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
        industry: analysisContext.businessModel?.industry || analysisContext.industry,
        serviceType: analysisContext.businessModel?.serviceType,
        targetAudience: analysisContext.persona?.primary.name || analysisContext.targetAudience,
        competitorsAnalyzed: analysisContext.competitors?.length || 0,
      },
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
