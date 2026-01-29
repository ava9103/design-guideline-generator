import { callClaude, extractJSON } from '@/lib/claude';
import type { AnalysisContext, PersonaAnalysis, AnalysisStep } from '@/types';

const PERSONA_PROMPT = `
以下のサイト情報から、想定されるターゲットユーザー（ペルソナ）を推定してください。

【サイト情報】
業界: {industry}
サービスタイプ: {serviceType}
コンバージョン目標: {conversionGoal}
タイトル: {title}
説明: {description}
主要見出し: {headings}
CTA: {ctas}
メインコンテンツ（抜粋）:
{content}

【出力形式】
以下のJSON形式で出力してください：

{
  "primary": {
    "name": "ペルソナ名（例：経営者 田中さん、30代主婦 佐藤さん）",
    "age": "年齢層（例：30-40代）",
    "gender": "性別または傾向（例：男性、女性、どちらも）",
    "occupation": "職業・役職（例：中小企業経営者、マーケティング担当者）",
    "income": "想定年収帯（例：500-800万円）",
    "lifestyle": "ライフスタイルの特徴（例：多忙で効率重視、情報収集に熱心）",
    "goals": ["達成したいこと1", "達成したいこと2", "達成したいこと3"],
    "painPoints": ["課題1", "課題2", "課題3"],
    "informationSources": ["情報収集チャネル1", "情報収集チャネル2"],
    "decisionFactors": ["意思決定要因1", "意思決定要因2", "意思決定要因3"]
  },
  "psychographics": {
    "values": ["価値観1", "価値観2"],
    "concerns": ["懸念事項1", "懸念事項2"],
    "motivations": ["動機1", "動機2"]
  }
}

JSONのみを出力してください。
`;

export async function analyzePersona(
  context: AnalysisContext
): Promise<PersonaAnalysis> {
  const { siteAnalysis, businessModel, industry } = context;

  if (!siteAnalysis) {
    throw new Error('Site analysis is required for persona analysis');
  }

  const prompt = PERSONA_PROMPT
    .replace('{industry}', businessModel?.industry || industry || '不明')
    .replace('{serviceType}', businessModel?.serviceType || '不明')
    .replace('{conversionGoal}', businessModel?.conversionGoal || '不明')
    .replace('{title}', siteAnalysis.title)
    .replace('{description}', siteAnalysis.description)
    .replace('{headings}', siteAnalysis.headings.map((h) => h.text).join(', '))
    .replace('{ctas}', siteAnalysis.ctas.map((c) => c.text).join(', '))
    .replace('{content}', siteAnalysis.mainContent.slice(0, 2000));

  const response = await callClaude(prompt, { maxTokens: 2000 });
  const result = extractJSON<PersonaAnalysis>(response);

  if (!result) {
    throw new Error('Failed to parse persona analysis');
  }

  return result;
}

export const personaStep: AnalysisStep = {
  name: 'ペルソナ推定',
  description: 'サイトコンテンツからターゲットユーザーを推定',
  isRequired: (context) => !context.targetAudience,

  async execute(context) {
    const persona = await analyzePersona(context);
    return {
      persona,
      targetAudience: persona.primary.name,
    };
  },
};
