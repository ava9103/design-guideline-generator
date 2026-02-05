import { callClaude, extractJSON } from './claude';
import {
  SYSTEM_PROMPT,
  LAYER1_GOALS_PROMPT,
  LAYER2_CONCEPT_PROMPT,
  LAYER3_GUIDELINES_PROMPT,
  REFERENCES_PROMPT,
} from './prompts/system';
import { getIndustryPreset, formatPresetForPrompt } from './knowledge';
import { checkGuidelineConsistency, formatWarningsForDisplay } from './validation';
import { getPhotoReferenceImages, getIllustrationReferenceImages } from './image-search';
import { scrapeGallerySites } from './gallery-scraper';
import type {
  AnalysisContext,
  Layer1Goals,
  Layer2Concept,
  Layer3Guidelines,
  References,
  DesignGuideline,
  CompetitorAnalysis,
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
  const { siteAnalysis, businessModel, persona, competitors } = context;

  const competitorDesigns = competitors
    ?.map(
      (c) =>
        `- ${c.name}: メインカラー=${c.design.colorScheme.primary}, フォント=${c.design.typography.headingFont}, スタイル=${c.design.typography.style}`
    )
    .join('\n') || 'なし';

  // 業種別プリセットを取得
  const industry = businessModel?.industry || context.industry || '';
  const industryPreset = getIndustryPreset(industry);
  const industryPresetText = industryPreset
    ? formatPresetForPrompt(industryPreset)
    : '【業種別プリセット】\n該当する業種プリセットはありません。一般的なベストプラクティスに従ってください。';

  // ブランド固有情報を準備
  const serviceName = siteAnalysis?.title || '不明';
  const serviceDescription = siteAnalysis?.description || 
    (siteAnalysis?.headings?.slice(0, 5).map(h => h.text).join('、')) || 
    '不明';
  const differentiationPoints = layer1Goals.differentiationPoints
    ?.map(d => `${d.title}（${d.reason}）`)
    .join('\n') || '不明';

  const prompt = LAYER3_GUIDELINES_PROMPT
    .replace('{serviceName}', serviceName)
    .replace('{serviceDescription}', serviceDescription)
    .replace('{differentiationPoints}', differentiationPoints)
    .replace('{conceptStatement}', layer2Concept.statement)
    .replace('{conceptPrinciples}', layer2Concept.principles.map((p) => p.title).join('、'))
    .replace('{positioning}', layer2Concept.positioning)
    .replace('{impressionKeywords}', layer1Goals.impressionKeywords.join(' / '))
    .replace('{industry}', industry || '不明')
    .replace('{targetAudience}', persona?.primary.name || context.targetAudience || '不明')
    .replace('{competitorDesigns}', competitorDesigns)
    .replace('{industryPreset}', industryPresetText);

  const response = await callClaude(prompt, {
    maxTokens: 5000,
    systemPrompt: SYSTEM_PROMPT,
    temperature: 0.7, // 多様性を確保
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

export interface GuidelineGenerationResult {
  guideline: DesignGuideline;
  consistencyCheck: {
    isConsistent: boolean;
    score: number;
    summary: string;
    warnings: string;
  };
}

// デザインガイドラインを生成（メイン関数）
export async function generateDesignGuideline(
  context: AnalysisContext,
  worksData?: string,
  onProgress?: GenerationProgressCallback
): Promise<DesignGuideline> {
  const steps = [
    { name: 'デザインゴール生成', progress: 15 },
    { name: 'デザインコンセプト生成', progress: 30 },
    { name: 'デザインガイドライン生成', progress: 50 },
    { name: '参考画像取得', progress: 65 },
    { name: '参考実例生成', progress: 80 },
    { name: 'ギャラリー事例取得', progress: 90 },
    { name: '一貫性チェック', progress: 100 },
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
  let layer3Guidelines = await generateLayer3Guidelines(context, layer1Goals, layer2Concept);
  onProgress?.({ currentStep: steps[2].name, progress: steps[2].progress });

  // 参考画像を取得してビジュアルガイドラインに追加
  onProgress?.({ currentStep: steps[3].name, progress: steps[2].progress });
  try {
    const industry = context.businessModel?.industry || context.industry || '';
    const [photoImages, illustrationImages] = await Promise.all([
      getPhotoReferenceImages(
        layer3Guidelines.visual.photo.tone,
        layer3Guidelines.visual.photo.subjects.slice(0, 3),
        { count: 3 }
      ),
      getIllustrationReferenceImages(
        layer3Guidelines.visual.illustration.style,
        layer3Guidelines.visual.illustration.tone,
        { count: 3 }
      ),
    ]);

    // 参考画像をガイドラインに追加
    layer3Guidelines = {
      ...layer3Guidelines,
      visual: {
        ...layer3Guidelines.visual,
        photo: {
          ...layer3Guidelines.visual.photo,
          referenceImages: photoImages,
        },
        illustration: {
          ...layer3Guidelines.visual.illustration,
          referenceImages: illustrationImages,
        },
      },
    };
  } catch (error) {
    console.warn('参考画像の取得に失敗しました:', error);
  }
  onProgress?.({ currentStep: steps[3].name, progress: steps[3].progress });

  // 参考実例
  onProgress?.({ currentStep: steps[4].name, progress: steps[3].progress });
  let references = await generateReferences(context, layer1Goals, layer2Concept, worksData);
  onProgress?.({ currentStep: steps[4].name, progress: steps[4].progress });

  // ギャラリーサイトから実際の事例を取得
  onProgress?.({ currentStep: steps[5].name, progress: steps[4].progress });
  try {
    const industry = context.businessModel?.industry || context.industry || '';
    const galleryItems = await scrapeGallerySites({ industry, limit: 6 });
    
    if (galleryItems.length > 0) {
      // ギャラリー事例を参考実例に追加
      const gallerySites = galleryItems.map(item => ({
        title: item.title,
        url: item.url,
        source: item.source,
        similarity: item.industry || 'デザイン参考',
        applicableElements: ['レイアウト', 'カラー使い', 'ビジュアル表現'],
      }));

      references = {
        ...references,
        gallerySites: [...(references.gallerySites || []), ...gallerySites],
      };
    }
  } catch (error) {
    console.warn('ギャラリー事例の取得に失敗しました:', error);
  }
  onProgress?.({ currentStep: steps[5].name, progress: steps[5].progress });

  // 一貫性チェック
  onProgress?.({ currentStep: steps[6].name, progress: steps[5].progress });
  const consistencyResult = checkGuidelineConsistency(layer3Guidelines);
  
  // 警告があればコンソールに出力（デバッグ用）
  if (consistencyResult.warnings.length > 0) {
    console.log('Consistency Check Results:');
    console.log(formatWarningsForDisplay(consistencyResult.warnings));
  }
  
  onProgress?.({ currentStep: '完了', progress: 100 });

  // 競合分析データを構築
  let competitorAnalysis: CompetitorAnalysis[] | undefined;
  if (context.competitors && context.competitors.length > 0) {
    competitorAnalysis = context.competitors.map((comp) => ({
      name: comp.name,
      url: comp.url,
      marketPosition: comp.marketPosition,
      design: {
        overallTone: comp.design.overallTone,
        colorScheme: {
          primary: comp.design.colorScheme.primary,
          secondary: comp.design.colorScheme.secondary,
          accent: comp.design.colorScheme.accent,
        },
        typography: {
          headingFont: comp.design.typography.headingFont,
          bodyFont: comp.design.typography.bodyFont,
          style: comp.design.typography.style,
        },
        visualStyle: comp.design.visualStyle,
      },
      strengths: comp.strengths,
      weaknesses: comp.weaknesses,
    }));
  }

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
    competitorAnalysis,
  };

  return guideline;
}

// 一貫性チェック結果付きでガイドラインを生成
export async function generateDesignGuidelineWithValidation(
  context: AnalysisContext,
  worksData?: string,
  onProgress?: GenerationProgressCallback
): Promise<GuidelineGenerationResult> {
  const guideline = await generateDesignGuideline(context, worksData, onProgress);
  
  const consistencyResult = checkGuidelineConsistency(guideline.layer3Guidelines);
  
  return {
    guideline,
    consistencyCheck: {
      isConsistent: consistencyResult.isConsistent,
      score: consistencyResult.score,
      summary: consistencyResult.summary,
      warnings: formatWarningsForDisplay(consistencyResult.warnings),
    },
  };
}
