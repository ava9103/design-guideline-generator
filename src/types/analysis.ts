// 分析コンテキスト（全分析結果を統合）
export interface AnalysisContext {
  // ユーザー入力（最小限）
  targetUrl: string;
  industry?: string;
  targetAudience?: string;
  competitorUrls?: string[];
  additionalInfo?: string;

  // 分析結果（自動収集）
  siteAnalysis?: SiteAnalysis;
  businessModel?: BusinessModelAnalysis;
  persona?: PersonaAnalysis;
  competitors?: CompetitorAnalysis[];
  designTrend?: DesignTrendAnalysis;
  cvrElements?: CVRElementsAnalysis;
}

// サイト構造分析
export interface SiteAnalysis {
  url: string;
  title: string;
  description: string;

  // コンテンツ構造
  headings: { level: number; text: string }[];
  sections: { title: string; content: string }[];

  // CTA分析
  ctas: { text: string; type: 'primary' | 'secondary'; location: string }[];

  // 信頼性要素
  trustElements: {
    testimonials: boolean;
    clientLogos: boolean;
    certifications: boolean;
    statistics: boolean;
    mediaFeatures: boolean;
  };

  // ビジュアル要素
  images: { src: string; alt: string; context: string }[];
  videos: boolean;
  animations: boolean;

  // 技術情報
  fonts: string[];
  colors: string[];
  framework?: string;

  // スクリーンショット
  screenshots?: {
    desktop: string;
    mobile?: string;
  };

  // メインコンテンツ
  mainContent: string;
}

// ビジネスモデル分析
export interface BusinessModelAnalysis {
  industry: string;
  subCategory: string;
  serviceType: 'B2B' | 'B2C' | 'B2B2C' | 'C2C';
  revenueModel: string;
  productType: 'サービス' | '商品' | 'SaaS' | 'マーケットプレイス' | 'その他';
  priceRange?: string;
  conversionGoal: string;
  competitiveAdvantage: string[];
}

// ペルソナ分析
export interface PersonaAnalysis {
  primary: {
    name: string;
    age: string;
    gender: string;
    occupation: string;
    income: string;
    lifestyle: string;
    goals: string[];
    painPoints: string[];
    informationSources: string[];
    decisionFactors: string[];
  };
  secondary?: {
    name: string;
    age: string;
    gender: string;
    occupation: string;
    income: string;
    lifestyle: string;
    goals: string[];
    painPoints: string[];
    informationSources: string[];
    decisionFactors: string[];
  };
  psychographics: {
    values: string[];
    concerns: string[];
    motivations: string[];
  };
}

// 競合分析
export interface CompetitorAnalysis {
  name: string;
  url: string;
  description: string;
  marketPosition: 'リーダー' | 'チャレンジャー' | 'フォロワー' | 'ニッチャー';

  strengths: string[];
  weaknesses: string[];

  design: {
    overallTone: string;
    colorScheme: {
      primary: string;
      secondary: string;
      accent: string;
    };
    typography: {
      headingFont: string;
      bodyFont: string;
      style: string;
    };
    visualStyle: string;
    layoutPattern: string;
  };

  cvrElements: {
    ctaStyle: string;
    ctaPlacement: string[];
    trustElements: string[];
    urgencyTactics: string[];
  };

  differentiators: string[];
}

// デザイントレンド分析
export interface DesignTrendAnalysis {
  industry: string;

  trends: {
    colorTrends: string[];
    typographyTrends: string[];
    layoutTrends: string[];
    visualTrends: string[];
  };

  conventions: {
    commonPatterns: string[];
    expectedElements: string[];
    typicalTone: string;
  };

  opportunities: {
    underutilizedApproaches: string[];
    emergingTrends: string[];
    differentiationAngles: string[];
  };

  antiPatterns: string[];
}

// CVR要素分析
export interface CVRElementsAnalysis {
  cta: {
    mainCTA: {
      text: string;
      style: string;
      placement: string;
      effectiveness: 'high' | 'medium' | 'low';
      improvement: string;
    };
    secondaryCTAs: string[];
    recommendedImprovements: string[];
  };

  trustBuilding: {
    existing: string[];
    missing: string[];
    recommendations: string[];
  };

  firstView: {
    headline: string;
    subheadline: string;
    valueProposition: string;
    clarity: 'clear' | 'moderate' | 'unclear';
    recommendations: string[];
  };

  form?: {
    fieldCount: number;
    complexity: 'simple' | 'moderate' | 'complex';
    friction: string[];
    recommendations: string[];
  };

  overallRecommendations: {
    priority: 'high' | 'medium' | 'low';
    recommendation: string;
    expectedImpact: string;
  }[];
}

// 分析ステップ
export interface AnalysisStep {
  name: string;
  description: string;
  isRequired: (context: AnalysisContext) => boolean;
  execute: (context: AnalysisContext) => Promise<Partial<AnalysisContext>>;
}

// 分析進捗
export interface AnalysisProgress {
  currentStep: string;
  completedSteps: string[];
  totalSteps: number;
  progress: number;
}
