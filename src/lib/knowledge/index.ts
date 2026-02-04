/**
 * 知識ベース エントリーポイント
 */

export {
  INDUSTRY_PRESETS,
  getIndustryPreset,
  formatPresetForPrompt,
  type IndustryDesignPreset,
  type IndustryColorPreset,
  type IndustryFontPreset,
  type IndustryTypographyRules,
} from './industry-presets';

export {
  TYPOGRAPHY_CVR_KNOWLEDGE,
  COLOR_CVR_KNOWLEDGE,
  FIRST_VIEW_CVR_KNOWLEDGE,
  CTA_CVR_KNOWLEDGE,
  FORM_CVR_KNOWLEDGE,
  TRUST_CVR_KNOWLEDGE,
  getAllCVRKnowledge,
  formatCVRKnowledgeForPrompt,
  generateCVRRecommendation,
  type CVRKnowledge,
} from './cvr-knowledge';
