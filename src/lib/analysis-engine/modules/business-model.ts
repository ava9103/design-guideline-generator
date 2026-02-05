import { callClaude, extractJSON } from '@/lib/claude';
import type { AnalysisContext, BusinessModelAnalysis, AnalysisStep } from '@/types';

const BUSINESS_MODEL_PROMPT = `
以下のサイト情報から、ビジネスモデルを推定してください。

【最重要：ユーザー指定の業界情報】
ユーザーが指定した業界: {userIndustry}

※ユーザーが業界を指定している場合は、その業界を最優先で尊重してください。
サイトコンテンツが取得できなかった場合でも、指定された業界の典型的なビジネスモデルを推定してください。

【分析の優先順位】
1. ユーザー指定の業界（最優先）
2. URLに含まれるキーワード（pilates, yoga, gym, clinic等）
3. サイトタイトル
4. メインコンテンツ

【サイト情報】
URL: {url}
タイトル: {title}
説明: {description}
主要見出し: {headings}
CTA: {ctas}
メインコンテンツ（抜粋）:
{content}

【業界別の典型的なビジネスモデル】
- ピラティス・ヨガ・フィットネス・パーソナルジム
  → 業界: 健康・フィットネス, B2C, 月謝制/回数券, CV目標: 体験レッスン申込
- 美容室・エステ・ネイル
  → 業界: 美容サービス, B2C, 都度払い/回数券, CV目標: 予約・カウンセリング
- クリニック・歯科・整体
  → 業界: 医療・ヘルスケア, B2C, 都度払い/保険診療, CV目標: 予約・問い合わせ
- 飲食店・レストラン
  → 業界: 飲食, B2C, 都度払い, CV目標: 予約・来店
- IT・SaaS・ソフトウェア
  → 業界: IT・情報通信, B2B/B2C, サブスクリプション, CV目標: 無料トライアル・資料請求
- コンサルティング
  → 業界: 経営・コンサルティング, B2B, プロジェクト/顧問契約, CV目標: 問い合わせ・資料請求

【出力形式】
以下のJSON形式で出力してください：

{
  "industry": "業界名（ユーザー指定があれば必ずそれを使用、なければURLとタイトルから推定）",
  "subCategory": "サブカテゴリ（例：マシンピラティス、パーソナルトレーニング等）",
  "serviceType": "B2B または B2C または B2B2C または C2C",
  "revenueModel": "収益モデルの説明（例：月謝制、回数券、成果報酬など）",
  "productType": "サービス または 商品 または SaaS または マーケットプレイス または その他",
  "priceRange": "価格帯（推定可能な場合。例：月額1万円〜、無料プランあり）",
  "conversionGoal": "想定されるコンバージョン目標（例：体験レッスン申込、無料カウンセリング、資料請求）",
  "competitiveAdvantage": ["競合優位性1", "競合優位性2", "競合優位性3"]
}

JSONのみを出力してください。
`;

export async function analyzeBusinessModel(
  context: AnalysisContext
): Promise<BusinessModelAnalysis> {
  const { siteAnalysis, industry: userIndustry } = context;

  if (!siteAnalysis) {
    throw new Error('Site analysis is required for business model analysis');
  }

  // ユーザー入力の業界情報を整形
  const userIndustryText = userIndustry 
    ? `「${userIndustry}」（ユーザーが明示的に指定）`
    : '指定なし（サイト情報から推定してください）';

  const prompt = BUSINESS_MODEL_PROMPT
    .replace('{userIndustry}', userIndustryText)
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
  // ユーザーが業界を入力していても、serviceType, conversionGoal等の詳細情報は必要なため常に実行
  isRequired: () => true,

  async execute(context) {
    const businessModel = await analyzeBusinessModel(context);
    
    // ユーザー入力の業界があれば、それを優先して使用
    const effectiveIndustry = context.industry || businessModel.industry;
    
    return {
      businessModel: {
        ...businessModel,
        industry: effectiveIndustry, // ユーザー入力を優先
      },
      industry: effectiveIndustry,
    };
  },
};
