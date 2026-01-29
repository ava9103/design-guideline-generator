import { callClaude, extractJSON } from '@/lib/claude';
import type { AnalysisContext, CVRElementsAnalysis, AnalysisStep } from '@/types';

const CVR_ANALYSIS_PROMPT = `
以下のサイト情報から、コンバージョン率（CVR）に影響する要素を分析してください。

【サイト情報】
URL: {url}
タイトル: {title}
説明: {description}

【CTA情報】
{ctas}

【信頼性要素】
- 顧客の声・レビュー: {testimonials}
- クライアントロゴ: {clientLogos}
- 資格・認証: {certifications}
- 実績数値: {statistics}
- メディア掲載: {mediaFeatures}

【見出し構成】
{headings}

【メインコンテンツ（抜粋）】
{content}

【出力形式】
以下のJSON形式で出力してください：

{
  "cta": {
    "mainCTA": {
      "text": "メインCTAのテキスト",
      "style": "CTAのスタイル（例：目立つ色のボタン、テキストリンク）",
      "placement": "配置場所（例：ファーストビュー下、ページ末尾）",
      "effectiveness": "high または medium または low",
      "improvement": "改善提案"
    },
    "secondaryCTAs": ["サブCTA1", "サブCTA2"],
    "recommendedImprovements": ["CTA改善提案1", "改善提案2"]
  },
  "trustBuilding": {
    "existing": ["既存の信頼性要素1", "要素2"],
    "missing": ["不足している信頼性要素1", "要素2"],
    "recommendations": ["追加すべき信頼性要素1", "要素2"]
  },
  "firstView": {
    "headline": "ファーストビューのヘッドライン",
    "subheadline": "サブヘッドライン",
    "valueProposition": "価値提案の要約",
    "clarity": "clear または moderate または unclear",
    "recommendations": ["ファーストビュー改善提案1", "提案2"]
  },
  "overallRecommendations": [
    {
      "priority": "high または medium または low",
      "recommendation": "改善提案の内容",
      "expectedImpact": "期待される効果"
    }
  ]
}

JSONのみを出力してください。
`;

export async function analyzeCVRElements(
  context: AnalysisContext
): Promise<CVRElementsAnalysis> {
  const { siteAnalysis } = context;

  if (!siteAnalysis) {
    throw new Error('Site analysis is required for CVR analysis');
  }

  const prompt = CVR_ANALYSIS_PROMPT
    .replace('{url}', siteAnalysis.url)
    .replace('{title}', siteAnalysis.title)
    .replace('{description}', siteAnalysis.description)
    .replace(
      '{ctas}',
      siteAnalysis.ctas.map((c) => `- ${c.text} (${c.type})`).join('\n') || 'なし'
    )
    .replace('{testimonials}', siteAnalysis.trustElements.testimonials ? 'あり' : 'なし')
    .replace('{clientLogos}', siteAnalysis.trustElements.clientLogos ? 'あり' : 'なし')
    .replace('{certifications}', siteAnalysis.trustElements.certifications ? 'あり' : 'なし')
    .replace('{statistics}', siteAnalysis.trustElements.statistics ? 'あり' : 'なし')
    .replace('{mediaFeatures}', siteAnalysis.trustElements.mediaFeatures ? 'あり' : 'なし')
    .replace(
      '{headings}',
      siteAnalysis.headings.map((h) => `${'#'.repeat(h.level)} ${h.text}`).join('\n')
    )
    .replace('{content}', siteAnalysis.mainContent.slice(0, 2000));

  const response = await callClaude(prompt, { maxTokens: 2000 });
  const result = extractJSON<CVRElementsAnalysis>(response);

  if (!result) {
    throw new Error('Failed to parse CVR analysis');
  }

  return result;
}

export const cvrAnalysisStep: AnalysisStep = {
  name: 'CVR要素分析',
  description: 'コンバージョン要素を分析し、改善提案を生成',
  isRequired: () => true,

  async execute(context) {
    const cvrElements = await analyzeCVRElements(context);
    return { cvrElements };
  },
};
