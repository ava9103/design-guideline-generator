// デザインガイドライン（3層構造）
export interface DesignGuideline {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  userId?: string;

  // 入力データ
  input: GuidelineInput;

  // 第1層：デザインゴール
  layer1Goals: Layer1Goals;

  // 第2層：デザインコンセプト
  layer2Concept: Layer2Concept;

  // 第3層：デザインガイドライン
  layer3Guidelines: Layer3Guidelines;

  // 参考実例
  references: References;

  // 競合分析データ（オプション）
  competitorAnalysis?: CompetitorAnalysis[];

  // 共有設定
  shareSettings?: ShareSettings;
  shareSlug?: string;
}

// 競合分析データ
export interface CompetitorAnalysis {
  name: string;
  url?: string;
  marketPosition?: string;
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
  };
  strengths?: string[];
  weaknesses?: string[];
}

// 入力データ
export interface GuidelineInput {
  targetUrl: string;
  industry?: string;
  targetAudience?: string;
  competitorUrls?: string[];
  additionalInfo?: string;
  uploadedFiles?: string[];
}

// 差別化カテゴリの型定義
export type DifferentiationCategory = 
  | 'price_value'        // 価格・コスパでの優位性
  | 'quality_expertise'  // 品質・専門性での優位性
  | 'experience_ux'      // 体験・UXでの優位性
  | 'trust_credibility'  // 信頼性・実績での優位性
  | 'unique_proposition' // 独自の価値提案
  | 'target_focus'       // ターゲット特化
  | 'convenience';       // 利便性での優位性

// 第1層：デザインゴール
export interface Layer1Goals {
  differentiationPoints: {
    category?: DifferentiationCategory;
    title: string;
    reason?: string;
    competitorGap?: string;       // 競合との具体的な差
    designImplication?: string;    // デザインで表現するための具体的施策
    expectedImpact?: string;       // CVRへの期待効果
  }[];

  impressionKeywords: string[];

  keywordDetails: {
    keyword: string;
    reasons: string[];
  }[];

  positioningMap?: {
    xAxis: { label: string; leftLabel: string; rightLabel: string };
    yAxis: { label: string; topLabel: string; bottomLabel: string };
    selfPosition: { x: number; y: number; description: string };
    competitors: { name: string; x: number; y: number; description: string }[];
  };

  // ゴール全体のサマリー
  summary?: string;
}

// 第2層：デザインコンセプト
export interface Layer2Concept {
  statement: string;

  principles: {
    title: string;
    reason?: string;
    implementation?: string;  // 具体的な実装方法
  }[];

  positioning: string;

  keyVisualStrategy?: {
    heroSection: string;     // FVで最も強調すべき要素
    trustSignals: string;    // 信頼性を示す要素
    ctaStrategy: string;     // CTA戦略
  };

  prohibitions: {
    item: string;
    reason?: string;
  }[];
}

// 第3層：デザインガイドライン
export interface Layer3Guidelines {
  typography: TypographyGuideline;
  color: ColorGuideline;
  visual: VisualGuideline;
  layout: LayoutGuideline;
  ui: UIGuideline;
}

// タイポグラフィガイドライン
export interface TypographyGuideline {
  mainFont: {
    japanese: {
      name: string;
      reason: string;
      weights: { use: string; weight: string }[];
      googleFontsUrl?: string;
      adobeFontsUrl?: string;
    };
    western: {
      name: string;
      reason: string;
      googleFontsUrl?: string;
      adobeFontsUrl?: string;
    };
  };

  subFont: {
    japanese: {
      name: string;
      reason: string;
      googleFontsUrl?: string;
      adobeFontsUrl?: string;
    };
    western: {
      name: string;
      reason: string;
      googleFontsUrl?: string;
      adobeFontsUrl?: string;
    };
  };

  numberFont?: {
    name: string;
    reason: string;
    googleFontsUrl?: string;
  };

  sizeSystem: {
    element: string;
    pc: string;
    sp: string;
    lineHeight: string;
    usage: string;
  }[];

  // ジャンプ率（視覚的強弱）設定
  jumpRatio?: {
    level: 'high' | 'medium' | 'low';
    h1ToBody: number; // H1と本文のサイズ比
    h2ToBody: number; // H2と本文のサイズ比
    description: string;
    rationale: string; // なぜこのジャンプ率を選んだか
  };

  // 業種別フォント推奨理由
  industryContext?: {
    industry: string;
    fontStyle: 'mincho' | 'gothic' | 'maru-gothic' | 'mixed';
    psychologicalEffect: string;
    cvrImpact: string;
  };
}

// カラーガイドライン
export interface ColorGuideline {
  mainColor: {
    name: string;
    hex: string;
    psychologicalEffect: string;
    usage: string[];
    ratio: string;
  };

  subColor: {
    name: string;
    hex: string;
    psychologicalEffect: string;
    usage: string[];
    ratio: string;
  };

  accentColor: {
    name: string;
    hex: string;
    psychologicalEffect: string;
    usage: string[];
    ratio: string;
  };

  // 拡張カラーパレット（図のような表示用）
  primaryColors?: {
    hex: string;
    name?: string;
  }[];

  secondaryColors?: {
    hex: string;
    name?: string;
  }[];

  neutralColors?: {
    hex: string;
    name?: string;
  }[];

  textColors: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
  };

  // カラーシステム全体の設計根拠
  colorSystemRationale?: string;

  sectionColors?: {
    section: string;
    background: string;
    text: string;
    accent: string;
  }[];

  prohibitedCombinations?: {
    colors: string[];
    reason: string;
  }[];
}

// ビジュアルガイドライン
export interface VisualGuideline {
  photo: {
    tone: string;
    brightness: string;
    saturation: string;
    colorTemperature: string;
    subjects: string[];
    composition: string[];
    ngExamples: string[];
    referenceImages?: {
      url: string;
      thumbnail: string;
      alt: string;
      credit?: { name: string; link: string };
    }[];
  };

  illustration: {
    style: string;
    tone: string;
    colorCount: string;
    lineWeight: string;
    examples: string[];
    ngExamples: string[];
    referenceImages?: {
      url: string;
      thumbnail: string;
      alt: string;
      credit?: { name: string; link: string };
    }[];
  };
}

// レイアウトガイドライン
export interface LayoutGuideline {
  grid: {
    columns: number;
    gutter: string;
    margin: string;
  };

  spacing: {
    unit: string;
    sectionGap: string;
    elementGap: string;
  };

  maxWidth: string;

  responsiveBreakpoints: {
    name: string;
    minWidth: string;
    description: string;
  }[];
}

// UIガイドライン
export interface UIGuideline {
  buttons: {
    primary: {
      backgroundColor: string;
      textColor: string;
      borderRadius: string;
      padding: string;
      fontSize: string;
      hoverEffect: string;
      psychologicalRationale?: string; // このCTAデザインが行動を促す理由
    };
    secondary: {
      backgroundColor: string;
      textColor: string;
      borderRadius: string;
      padding: string;
      fontSize: string;
      hoverEffect: string;
    };
  };

  // CTA改善提案
  ctaRecommendations?: {
    recommendation: string;
    evidence: string;
    expectedImpact: string;
  }[];

  forms?: {
    inputStyle: string;
    borderRadius: string;
    borderColor: string;
    focusColor: string;
    errorColor: string;
  };

  cards?: {
    backgroundColor: string;
    borderRadius: string;
    shadow: string;
    padding: string;
  };
}

// 参考実例
export interface References {
  postscapeWorks: {
    title: string;
    url: string;
    similarity: string;
    applicableElements: string[];
  }[];

  gallerySites?: {
    title: string;
    url: string;
    source: string;
    similarity: string;
    applicableElements: string[];
  }[];
}

// 共有設定
export interface ShareSettings {
  visibility: 'team' | 'public' | 'password';
  password?: string;
  expiresAt?: string;
}

// フォントリンク
export interface FontLinks {
  googleFonts: string | null;
  adobeFonts: string | null;
}
