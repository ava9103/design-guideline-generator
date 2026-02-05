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

export {
  COLOR_PSYCHOLOGY,
  COLOR_LAYER_SYSTEM,
  COLOR_COMBINATIONS,
  COLOR_CHECKLIST,
  formatColorStrategyForPrompt,
  getColorCombinationForIndustry,
  getColorPsychology,
  type ColorPsychology,
  type ColorLayerSystem,
  type ColorCombination,
} from './color-strategy';

export {
  FONT_CATEGORIES,
  JUMP_RATIO_GUIDELINES,
  TYPOGRAPHY_SIZE_SYSTEM,
  TEXT_LAYOUT_RULES,
  FONT_CHECKLIST,
  formatFontStrategyForPrompt,
  getFontCategoryForIndustry,
  getJumpRatioGuideline,
  getGoogleFontsRecommendations,
  type FontCategory,
  type FontRecommendation,
  type JumpRatioGuideline,
  type TypographySizeSystem,
  type TextLayoutRule,
} from './font-strategy';
