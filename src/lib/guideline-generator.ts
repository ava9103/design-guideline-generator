import { callClaude, extractJSON } from './claude';
import {
  SYSTEM_PROMPT,
  LAYER1_GOALS_PROMPT,
  LAYER2_CONCEPT_PROMPT,
  LAYER3_GUIDELINES_PROMPT,
  REFERENCES_PROMPT,
} from './prompts/system';
import type {
  AnalysisContext,
  Layer1Goals,
  Layer2Concept,
  Layer3Guidelines,
  References,
  DesignGuideline,
} from '@/types';
import { nanoid } from 'nanoid';

export interface GenerationProgress {
  currentStep: string;
  progress: number;
}

export type GenerationProgressCallback = (progress: GenerationProgress) => void;

// 第1層：デザインゴールを生成
async function generateLayer1Goals(
  context: AnalysisContext
): Promise<Layer1Goals> {
  const { siteAnalysis, businessModel, persona, competitors, designTrend } = context;

  const competitorSummary = competitors
    ?.map(
      (c) =>
        `- ${c.name}: ポジション=${c.marketPosition}, トーン=${c.design.overallTone}, 強み=${c.strengths.join('、')}`
    )
    .join('\n') || 'なし';

  const prompt = LAYER1_GOALS_PROMPT
    .replace('{targetUrl}', siteAnalysis?.url || '')
    .replace('{targetTitle}', siteAnalysis?.title || '')
    .replace('{targetDescription}', siteAnalysis?.description || '')
    .replace('{industry}', businessModel?.industry || context.industry || '不明')
    .replace('{serviceType}', businessModel?.serviceType || '不明')
    .replace('{conversionGoal}', businessModel?.conversionGoal || '不明')
    .replace('{competitiveAdvantage}', businessModel?.competitiveAdvantage?.join('、') || '不明')
    .replace('{personaName}', persona?.primary.name || '不明')
    .replace('{personaAge}', persona?.primary.age || '不明')
    .replace('{personaOccupation}', persona?.primary.occupation || '不明')
    .replace('{personaGoals}', persona?.primary.goals?.join('、') || '不明')
    .replace('{personaPainPoints}', persona?.primary.painPoints?.join('、') || '不明')
    .replace('{personaValues}', persona?.psychographics?.values?.join('、') || '不明')
    .replace('{competitorSummary}', competitorSummary)
    .replace('{conventions}', designTrend?.conventions?.commonPatterns?.join('、') || '不明')
    .replace('{opportunities}', designTrend?.opportunities?.differentiationAngles?.join('、') || '不明')
    .replace('{antiPatterns}', designTrend?.antiPatterns?.join('、') || '不明');

  const response = await callClaude(prompt, {
    maxTokens: 3000,
    systemPrompt: SYSTEM_PROMPT,
  });

  const result = extractJSON<Layer1Goals>(response);
  if (!result) {
    throw new Error('Failed to generate Layer 1 Goals');
  }

  return result;
}

// 第2層：デザインコンセプトを生成
async function generateLayer2Concept(
  context: AnalysisContext,
  layer1Goals: Layer1Goals
): Promise<Layer2Concept> {
  const { siteAnalysis, businessModel, persona, competitors } = context;

  const competitorDesignTones = competitors
    ?.map((c) => `- ${c.name}: ${c.design.overallTone}`)
    .join('\n') || 'なし';

  const prompt = LAYER2_CONCEPT_PROMPT
    .replace('{differentiationPoints}', layer1Goals.differentiationPoints.map((d) => d.title).join('、'))
    .replace('{impressionKeywords}', layer1Goals.impressionKeywords.join(' / '))
    .replace('{targetTitle}', siteAnalysis?.title || '')
    .replace('{industry}', businessModel?.industry || context.industry || '不明')
    .replace('{targetAudience}', persona?.primary.name || context.targetAudience || '不明')
    .replace('{conversionGoal}', businessModel?.conversionGoal || '不明')
    .replace('{competitorDesignTones}', competitorDesignTones);

  const response = await callClaude(prompt, {
    maxTokens: 2500,
    systemPrompt: SYSTEM_PROMPT,
  });

  const result = extractJSON<Layer2Concept>(response);
  if (!result) {
    throw new Error('Failed to generate Layer 2 Concept');
  }

  return result;
}

// 第3層：デザインガイドラインを生成
async function generateLayer3Guidelines(
  context: AnalysisContext,
  layer1Goals: Layer1Goals,
  layer2Concept: Layer2Concept
): Promise<Layer3Guidelines> {
  const { businessModel, persona, competitors } = context;

  const competitorDesigns = competitors
    ?.map(
      (c) =>
        `- ${c.name}: メインカラー=${c.design.colorScheme.primary}, フォント=${c.design.typography.headingFont}, スタイル=${c.design.typography.style}`
    )
    .join('\n') || 'なし';

  const prompt = LAYER3_GUIDELINES_PROMPT
    .replace('{conceptStatement}', layer2Concept.statement)
    .replace('{conceptPrinciples}', layer2Concept.principles.map((p) => p.title).join('、'))
    .replace('{positioning}', layer2Concept.positioning)
    .replace('{impressionKeywords}', layer1Goals.impressionKeywords.join(' / '))
    .replace('{industry}', businessModel?.industry || context.industry || '不明')
    .replace('{targetAudience}', persona?.primary.name || context.targetAudience || '不明')
    .replace('{competitorDesigns}', competitorDesigns);

  const response = await callClaude(prompt, {
    maxTokens: 4000,
    systemPrompt: SYSTEM_PROMPT,
  });

  const result = extractJSON<Layer3Guidelines>(response);
  if (!result) {
    throw new Error('Failed to generate Layer 3 Guidelines');
  }

  return result;
}

// 参考実例を生成
async function generateReferences(
  context: AnalysisContext,
  layer1Goals: Layer1Goals,
  layer2Concept: Layer2Concept,
  worksData: string = ''
): Promise<References> {
  const { businessModel, competitors } = context;

  const competitorDesigns = competitors
    ?.map((c) => `- ${c.name}: ${c.design.overallTone}、${c.design.visualStyle}`)
    .join('\n') || 'なし';

  const prompt = REFERENCES_PROMPT
    .replace('{impressionKeywords}', layer1Goals.impressionKeywords.join(' / '))
    .replace('{conceptStatement}', layer2Concept.statement)
    .replace('{industry}', businessModel?.industry || context.industry || '不明')
    .replace('{worksData}', worksData || 'ポストスケイプの実績情報は現在取得できません')
    .replace('{competitorDesigns}', competitorDesigns);

  const response = await callClaude(prompt, {
    maxTokens: 2000,
    systemPrompt: SYSTEM_PROMPT,
  });

  const result = extractJSON<References>(response);
  if (!result) {
    return {
      postscapeWorks: [],
      gallerySites: [],
    };
  }

  return result;
}

// デザインガイドラインを生成（メイン関数）
export async function generateDesignGuideline(
  context: AnalysisContext,
  worksData?: string,
  onProgress?: GenerationProgressCallback
): Promise<DesignGuideline> {
  const steps = [
    { name: 'デザインゴール生成', progress: 25 },
    { name: 'デザインコンセプト生成', progress: 50 },
    { name: 'デザインガイドライン生成', progress: 75 },
    { name: '参考実例生成', progress: 100 },
  ];

  // 第1層：デザインゴール
  onProgress?.({ currentStep: steps[0].name, progress: 0 });
  const layer1Goals = await generateLayer1Goals(context);
  onProgress?.({ currentStep: steps[0].name, progress: steps[0].progress });

  // 第2層：デザインコンセプト
  onProgress?.({ currentStep: steps[1].name, progress: steps[0].progress });
  const layer2Concept = await generateLayer2Concept(context, layer1Goals);
  onProgress?.({ currentStep: steps[1].name, progress: steps[1].progress });

  // 第3層：デザインガイドライン
  onProgress?.({ currentStep: steps[2].name, progress: steps[1].progress });
  const layer3Guidelines = await generateLayer3Guidelines(context, layer1Goals, layer2Concept);
  onProgress?.({ currentStep: steps[2].name, progress: steps[2].progress });

  // 参考実例
  onProgress?.({ currentStep: steps[3].name, progress: steps[2].progress });
  const references = await generateReferences(context, layer1Goals, layer2Concept, worksData);
  onProgress?.({ currentStep: '完了', progress: 100 });

  // ガイドラインオブジェクトを構築
  const guideline: DesignGuideline = {
    id: nanoid(),
    title: context.siteAnalysis?.title || 'デザインガイドライン',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    input: {
      targetUrl: context.targetUrl,
      industry: context.industry || context.businessModel?.industry,
      targetAudience: context.targetAudience || context.persona?.primary.name,
      competitorUrls: context.competitorUrls,
      additionalInfo: context.additionalInfo,
    },
    layer1Goals,
    layer2Concept,
    layer3Guidelines,
    references,
  };

  return guideline;
}
