import { callClaude, extractJSON } from '@/lib/claude';
import { formatCVRKnowledgeForPrompt, getIndustryPreset } from '@/lib/knowledge';
import type { AnalysisContext, CVRElementsAnalysis, AnalysisStep } from '@/types';

const CVR_ANALYSIS_SYSTEM_PROMPT = `あなたはCVR（コンバージョン率）改善の専門家です。
以下の知識ベースを参照し、心理的根拠とデータに基づいた分析・提案を行ってください。

{cvrKnowledge}

分析・提案の際は以下を必ず含めてください：
1. 現状の問題点とその心理的メカニズム
2. 具体的な改善提案
3. 期待される効果（可能であれば数値根拠付き）
`;

const CVR_ANALYSIS_PROMPT = `
以下のサイト情報から、コンバージョン率（CVR）に影響する要素を分析してください。

【サイト情報】
URL: {url}
タイトル: {title}
説明: {description}
業界: {industry}

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

{industryContext}

【出力形式】
以下のJSON形式で出力してください。
すべての提案に「心理的根拠」「期待効果（可能であれば数値付き）」を含めてください：

{
  "cta": {
    "mainCTA": {
      "text": "メインCTAのテキスト",
      "style": "CTAのスタイル（例：目立つ色のボタン、テキストリンク）",
      "placement": "配置場所（例：ファーストビュー下、ページ末尾）",
      "effectiveness": "high または medium または low",
      "improvement": "改善提案",
      "psychologicalRationale": "この改善が効果的な心理的理由"
    },
    "secondaryCTAs": ["サブCTA1", "サブCTA2"],
    "recommendedImprovements": [
      {
        "improvement": "改善内容",
        "rationale": "心理的根拠",
        "expectedImpact": "期待効果（例：CVR 20%向上）"
      }
    ],
    "colorRecommendation": {
      "currentIssue": "現在のCTAカラーの問題点（該当する場合）",
      "recommendation": "推奨カラー",
      "rationale": "推奨理由（エモーショナルカラー理論等）"
    }
  },
  "trustBuilding": {
    "existing": ["既存の信頼性要素1", "要素2"],
    "missing": ["不足している信頼性要素1", "要素2"],
    "recommendations": [
      {
        "element": "追加すべき要素",
        "rationale": "心理的根拠",
        "expectedImpact": "期待効果"
      }
    ]
  },
  "firstView": {
    "headline": "ファーストビューのヘッドライン",
    "subheadline": "サブヘッドライン",
    "valueProposition": "価値提案の要約",
    "clarity": "clear または moderate または unclear",
    "hasAnimation": "あり または なし または 不明",
    "recommendations": [
      {
        "improvement": "改善内容",
        "rationale": "心理的根拠",
        "expectedImpact": "期待効果"
      }
    ]
  },
  "typography": {
    "fontSizeIssues": [
      {
        "issue": "問題点（例：スマホ本文が14pxで小さすぎる）",
        "recommendation": "推奨サイズ",
        "rationale": "根拠（例：16px未満は離脱率23%上昇）"
      }
    ],
    "jumpRatioAssessment": {
      "current": "現状評価（high/medium/low）",
      "recommendation": "推奨",
      "rationale": "根拠"
    }
  },
  "overallRecommendations": [
    {
      "priority": "high または medium または low",
      "recommendation": "改善提案の内容",
      "psychologicalMechanism": "心理メカニズム",
      "expectedImpact": "期待される効果（数値があれば）",
      "evidence": "根拠となるデータや研究"
    }
  ]
}

JSONのみを出力してください。
`;

export async function analyzeCVRElements(
  context: AnalysisContext
): Promise<CVRElementsAnalysis> {
  const { siteAnalysis, businessModel } = context;

  if (!siteAnalysis) {
    throw new Error('Site analysis is required for CVR analysis');
  }

  // 業種情報を取得
  const industry = businessModel?.industry || context.industry || '不明';
  const industryPreset = getIndustryPreset(industry);
  
  // 業種別コンテキストを生成
  let industryContext = '';
  if (industryPreset) {
    industryContext = `
【業種別CVR向上のポイント（${industry}）】
${industryPreset.cvrTips.map((tip) => `・${tip}`).join('\n')}

【推奨カラーシステム】
・アクションカラー: ${industryPreset.color.action.colorFamily}（${industryPreset.color.action.effect}）
`;
  }

  // CVR知識ベースをシステムプロンプトに含める
  const cvrKnowledge = formatCVRKnowledgeForPrompt(['cta', 'firstView', 'typography', 'trust']);
  const systemPrompt = CVR_ANALYSIS_SYSTEM_PROMPT.replace('{cvrKnowledge}', cvrKnowledge);

  const prompt = CVR_ANALYSIS_PROMPT
    .replace('{url}', siteAnalysis.url)
    .replace('{title}', siteAnalysis.title)
    .replace('{description}', siteAnalysis.description)
    .replace('{industry}', industry)
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
    .replace('{content}', siteAnalysis.mainContent.slice(0, 2000))
    .replace('{industryContext}', industryContext);

  const response = await callClaude(prompt, { 
    maxTokens: 3000,
    systemPrompt,
  });
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
