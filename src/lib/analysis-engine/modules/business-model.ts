import { callClaude, extractJSON } from '@/lib/claude';
import type { AnalysisContext, BusinessModelAnalysis, AnalysisStep } from '@/types';

const BUSINESS_MODEL_PROMPT = `
以下のサイト情報から、ビジネスモデルを推定してください。

【サイト情報】
URL: {url}
タイトル: {title}
説明: {description}
主要見出し: {headings}
CTA: {ctas}
メインコンテンツ（抜粋）:
{content}

【出力形式】
以下のJSON形式で出力してください：

{
  "industry": "業界名（例：IT・情報通信、金融・証券・保険、不動産、人材・採用、教育など）",
  "subCategory": "サブカテゴリ（例：SaaS、転職支援、資産運用など）",
  "serviceType": "B2B または B2C または B2B2C または C2C",
  "revenueModel": "収益モデルの説明（例：月額課金、成果報酬、広告収益など）",
  "productType": "サービス または 商品 または SaaS または マーケットプレイス または その他",
  "priceRange": "価格帯（推定可能な場合。例：月額1万円〜、無料プランあり）",
  "conversionGoal": "想定されるコンバージョン目標（例：資料請求、無料相談申込、会員登録）",
  "competitiveAdvantage": ["競合優位性1", "競合優位性2", "競合優位性3"]
}

JSONのみを出力してください。
`;

export async function analyzeBusinessModel(
  context: AnalysisContext
): Promise<BusinessModelAnalysis> {
  const { siteAnalysis } = context;

  if (!siteAnalysis) {
    throw new Error('Site analysis is required for business model analysis');
  }

  const prompt = BUSINESS_MODEL_PROMPT
    .replace('{url}', siteAnalysis.url)
    .replace('{title}', siteAnalysis.title)
    .replace('{description}', siteAnalysis.description)
    .replace('{headings}', siteAnalysis.headings.map((h) => h.text).join(', '))
    .replace('{ctas}', siteAnalysis.ctas.map((c) => c.text).join(', '))
    .replace('{content}', siteAnalysis.mainContent.slice(0, 3000));

  const response = await callClaude(prompt, { maxTokens: 2000 });
  const result = extractJSON<BusinessModelAnalysis>(response);

  if (!result) {
    throw new Error('Failed to parse business model analysis');
  }

  return result;
}

export const businessModelStep: AnalysisStep = {
  name: 'ビジネスモデル推定',
  description: '業界、サービス形態、収益モデルを自動推定',
  isRequired: (context) => !context.industry,

  async execute(context) {
    const businessModel = await analyzeBusinessModel(context);
    return {
      businessModel,
      industry: businessModel.industry,
    };
  },
};
