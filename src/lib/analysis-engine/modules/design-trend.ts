import { callClaude, extractJSON } from '@/lib/claude';
import type { AnalysisContext, DesignTrendAnalysis, AnalysisStep } from '@/types';

const DESIGN_TREND_PROMPT = `
以下の情報をもとに、{industry}業界のデザイントレンドを分析してください。

【対象サイト情報】
URL: {targetUrl}
タイトル: {targetTitle}
使用フォント: {targetFonts}
使用カラー: {targetColors}

【競合のデザイン傾向】
{competitorDesigns}

【出力形式】
以下のJSON形式で出力してください：

{
  "industry": "{industry}",
  "trends": {
    "colorTrends": ["この業界で見られるカラートレンド1", "トレンド2", "トレンド3"],
    "typographyTrends": ["フォントトレンド1", "トレンド2"],
    "layoutTrends": ["レイアウトトレンド1", "トレンド2"],
    "visualTrends": ["ビジュアルトレンド1", "トレンド2"]
  },
  "conventions": {
    "commonPatterns": ["業界で当たり前になっているパターン1", "パターン2", "パターン3"],
    "expectedElements": ["ユーザーが期待する必須要素1", "要素2"],
    "typicalTone": "この業界の典型的なデザイントーン"
  },
  "opportunities": {
    "underutilizedApproaches": ["まだ活用されていないアプローチ1", "アプローチ2"],
    "emergingTrends": ["新興トレンド1", "トレンド2"],
    "differentiationAngles": ["差別化の切り口1", "切り口2", "切り口3"]
  },
  "antiPatterns": ["この業界で避けるべきパターン1", "パターン2", "パターン3"]
}

JSONのみを出力してください。
`;

export async function analyzeDesignTrend(
  context: AnalysisContext
): Promise<DesignTrendAnalysis> {
  const { siteAnalysis, businessModel, industry, competitors } = context;

  if (!siteAnalysis) {
    throw new Error('Site analysis is required for design trend analysis');
  }

  const industryName = businessModel?.industry || industry || '不明';

  // 競合のデザイン情報を整理
  const competitorDesigns = competitors
    ?.map(
      (c) =>
        `- ${c.name}: トーン=${c.design.overallTone}, メインカラー=${c.design.colorScheme.primary}, スタイル=${c.design.typography.style}`
    )
    .join('\n') || '競合情報なし';

  const prompt = DESIGN_TREND_PROMPT
    .replace(/{industry}/g, industryName)
    .replace('{targetUrl}', siteAnalysis.url)
    .replace('{targetTitle}', siteAnalysis.title)
    .replace('{targetFonts}', siteAnalysis.fonts.join(', ') || '不明')
    .replace('{targetColors}', siteAnalysis.colors.slice(0, 10).join(', ') || '不明')
    .replace('{competitorDesigns}', competitorDesigns);

  const response = await callClaude(prompt, { maxTokens: 2000 });
  const result = extractJSON<DesignTrendAnalysis>(response);

  if (!result) {
    throw new Error('Failed to parse design trend analysis');
  }

  return result;
}

export const designTrendStep: AnalysisStep = {
  name: 'デザイントレンド分析',
  description: '業界のデザイントレンドと差別化機会を分析',
  isRequired: () => true,

  async execute(context) {
    const designTrend = await analyzeDesignTrend(context);
    return { designTrend };
  },
};
