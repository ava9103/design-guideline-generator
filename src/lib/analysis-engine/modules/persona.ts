import { callClaude, extractJSON } from '@/lib/claude';
import type { AnalysisContext, PersonaAnalysis, AnalysisStep } from '@/types';

const PERSONA_PROMPT = `
以下のサイト情報から、想定されるターゲットユーザー（ペルソナ）を推定してください。

【最重要：ユーザー指定情報を基にペルソナを設計】
ユーザーが指定したターゲット: {userTargetAudience}
業界: {industry}
サービスタイプ: {serviceType}

※ユーザーがターゲットを指定している場合は、そのターゲット層を中心にペルソナを設計してください。
※業界・サービスタイプも考慮し、その業界の典型的なターゲット層を反映してください。
サイトコンテンツが取得できなかった場合でも、ユーザー指定と業界情報から適切なペルソナを推定してください。

【業界別の典型的なターゲット層】
- 健康・フィットネス（ピラティス、ヨガ、ジム等）
  → 健康意識の高い一般消費者、20-50代、運動習慣をつけたい人
- 美容サービス（美容室、エステ、ネイル等）
  → 美容に関心のある消費者、20-40代女性中心、自分磨きに投資したい人
- 医療・ヘルスケア（クリニック、歯科、整体等）
  → 健康に悩みを持つ消費者、幅広い年代、専門的なケアを求める人
- 飲食（レストラン、カフェ等）
  → 食に関心のある消費者、幅広い年代、体験や雰囲気を重視する人
- IT・SaaS・ソフトウェア（B2B）
  → 企業の担当者・経営者、効率化・コスト削減を求める人
- コンサルティング（B2B）
  → 企業の経営者・役員、課題解決を求める人

【サイト情報】
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
  const { siteAnalysis, businessModel, industry: userIndustry, targetAudience: userTargetAudience } = context;

  if (!siteAnalysis) {
    throw new Error('Site analysis is required for persona analysis');
  }

  // ユーザー入力の業界を優先、次にビジネスモデル分析結果を使用
  const effectiveIndustry = userIndustry || businessModel?.industry || '不明';
  
  // ユーザー入力のターゲット情報を整形
  const userTargetText = userTargetAudience 
    ? `「${userTargetAudience}」（ユーザーが明示的に指定）`
    : '指定なし（サイト情報と業界から推定してください）';
  
  // デバッグログ
  console.log('ペルソナ分析で使用する情報:', {
    userIndustry,
    userTargetAudience,
    businessModelIndustry: businessModel?.industry,
    effectiveIndustry,
  });

  const prompt = PERSONA_PROMPT
    .replace('{userTargetAudience}', userTargetText)
    .replace('{industry}', effectiveIndustry)
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
  // ユーザーがターゲットを指定していても、詳細なペルソナ情報（goals, painPoints, values等）は
  // 後続のガイドライン生成で必要なため、常に実行する
  isRequired: () => true,

  async execute(context) {
    const persona = await analyzePersona(context);
    
    // ユーザー入力のターゲットがあれば、それを優先して使用
    const effectiveTargetAudience = context.targetAudience || persona.primary.name;
    
    return {
      persona,
      targetAudience: effectiveTargetAudience,
    };
  },
};
