/**
 * フォント戦略ガイド
 * 
 * 参考: https://conversion-labo.jp/report/lp_design/13649/
 * 「ランディングページの文字デザインのコツ｜読みやすさと視線誘導のポイント」
 * 
 * タイポグラフィとCVR改善の知見を体系化したナレッジベース
 */

export interface FontCategory {
  style: 'mincho' | 'gothic' | 'maru-gothic' | 'display';
  styleName: string;
  psychologicalEffects: string[];
  bestUseCases: string[];
  industriesRecommended: string[];
  fonts: FontRecommendation[];
  cautions?: string[];
  citeId: string;
}

export interface FontRecommendation {
  name: string;
  weights: string[];
  source: 'system' | 'google' | 'adobe' | 'paid';
  googleFontsUrl?: string;
  adobeFontsUrl?: string;
  characteristics: string;
}

export interface JumpRatioGuideline {
  level: 'high' | 'medium' | 'low';
  h1ToBody: number;
  h2ToBody: number;
  description: string;
  psychologicalEffect: string;
  industriesRecommended: string[];
  cvrImpact: string;
  citeId: string;
}

export interface TypographySizeSystem {
  element: string;
  pc: { min: number; max: number };
  sp: { min: number; max: number };
  lineHeight: { min: number; max: number };
  purpose: string;
}

export interface TextLayoutRule {
  rule: string;
  description: string;
  psychologicalEffect: string;
  implementation: string[];
  citeId: string;
}

/**
 * フォントカテゴリ別ガイド
 */
export const FONT_CATEGORIES: FontCategory[] = [
  {
    style: 'mincho',
    styleName: '明朝体',
    psychologicalEffects: [
      '品格・信頼性・歴史を感じさせる',
      '高額商材に相応しい格調を演出',
      '落ち着き・知性・伝統を伝える',
    ],
    bestUseCases: [
      '見出し（高級感・信頼性重視）',
      'キャッチコピー',
      '企業理念・ブランドメッセージ',
    ],
    industriesRecommended: ['保険・金融', '不動産', '法律・士業', '高級ブランド'],
    fonts: [
      {
        name: '游明朝',
        weights: ['Regular', 'Medium', 'Bold'],
        source: 'system',
        characteristics: 'macOS/Windows標準搭載。上品で読みやすく、Webでも安定した表示',
      },
      {
        name: 'Noto Serif JP',
        weights: ['Regular', 'Medium', 'Bold', 'Black'],
        source: 'google',
        googleFontsUrl: 'https://fonts.google.com/specimen/Noto+Serif+JP',
        characteristics: 'Google Fonts対応。多言語対応で汎用性が高い',
      },
      {
        name: 'Shippori Mincho',
        weights: ['Regular', 'Medium', 'Bold'],
        source: 'google',
        googleFontsUrl: 'https://fonts.google.com/specimen/Shippori+Mincho',
        characteristics: '日本の伝統的な明朝体。格調高い印象',
      },
      {
        name: '凸版明朝',
        weights: ['Regular', 'Bold'],
        source: 'adobe',
        adobeFontsUrl: 'https://fonts.adobe.com/fonts/toppan-bunkyu-mincho',
        characteristics: 'プロ品質の明朝体。高級感・信頼性に優れる',
      },
    ],
    cautions: ['長文には向かない場合がある', '本文には可読性の高いゴシック体を検討'],
    citeId: 'font-strategy-13649',
  },
  {
    style: 'gothic',
    styleName: 'ゴシック体',
    psychologicalEffects: [
      'モダン・洗練・先進性を伝える',
      '可読性が高く、デジタルデバイスに最適',
      'クリーン・シンプル・プロフェッショナル感',
    ],
    bestUseCases: [
      '本文（長文の可読性確保）',
      '見出し（モダン・先進性重視）',
      'UI要素（ボタン・ラベル）',
    ],
    industriesRecommended: ['SaaS・テック', 'EC・通販', '人材・採用', '医療・ヘルスケア'],
    fonts: [
      {
        name: '游ゴシック',
        weights: ['Light', 'Regular', 'Medium', 'Bold'],
        source: 'system',
        characteristics: 'macOS/Windows標準。洗練された印象と高い可読性',
      },
      {
        name: 'Noto Sans JP',
        weights: ['Thin', 'Light', 'Regular', 'Medium', 'Bold', 'Black'],
        source: 'google',
        googleFontsUrl: 'https://fonts.google.com/specimen/Noto+Sans+JP',
        characteristics: 'Google Fonts対応。多ウェイト対応で汎用性が高い',
      },
      {
        name: 'ヒラギノ角ゴ',
        weights: ['W3', 'W4', 'W5', 'W6', 'W7', 'W8'],
        source: 'system',
        characteristics: 'macOS標準。美しく読みやすい日本語フォントの代表格',
      },
      {
        name: 'BIZ UDGothic',
        weights: ['Regular', 'Bold'],
        source: 'google',
        googleFontsUrl: 'https://fonts.google.com/specimen/BIZ+UDGothic',
        characteristics: 'ユニバーサルデザインフォント。視認性・可読性に優れる',
      },
      {
        name: 'Zen Kaku Gothic New',
        weights: ['Regular', 'Medium', 'Bold', 'Black'],
        source: 'google',
        googleFontsUrl: 'https://fonts.google.com/specimen/Zen+Kaku+Gothic+New',
        characteristics: 'モダンで洗練されたゴシック体。見出しにも本文にも',
      },
    ],
    citeId: 'font-strategy-13649',
  },
  {
    style: 'maru-gothic',
    styleName: '丸ゴシック体',
    psychologicalEffects: [
      '親しみやすさ・安心感を与える',
      '柔らかさ・温かみ・優しさを伝える',
      '心理的ハードルを下げる',
    ],
    bestUseCases: [
      '見出し（親しみやすさ重視）',
      '子供・女性向けサービス',
      'カジュアルなトーンのLP',
    ],
    industriesRecommended: ['教育・スクール', '子供向けサービス', '女性向けサービス', 'カジュアルEC'],
    fonts: [
      {
        name: 'Zen Maru Gothic',
        weights: ['Regular', 'Medium', 'Bold', 'Black'],
        source: 'google',
        googleFontsUrl: 'https://fonts.google.com/specimen/Zen+Maru+Gothic',
        characteristics: '柔らかく親しみやすい丸ゴシック。Google Fonts対応',
      },
      {
        name: 'Kosugi Maru',
        weights: ['Regular'],
        source: 'google',
        googleFontsUrl: 'https://fonts.google.com/specimen/Kosugi+Maru',
        characteristics: 'シンプルで読みやすい丸ゴシック',
      },
      {
        name: 'Kiwi Maru',
        weights: ['Light', 'Regular', 'Medium'],
        source: 'google',
        googleFontsUrl: 'https://fonts.google.com/specimen/Kiwi+Maru',
        characteristics: '可愛らしさと読みやすさを両立',
      },
      {
        name: 'ヒラギノ丸ゴ',
        weights: ['W4'],
        source: 'system',
        characteristics: 'macOS標準の丸ゴシック。品質が高い',
      },
    ],
    cautions: ['高級感が求められる業種では避ける', 'BtoBではカジュアルすぎる印象を与える可能性'],
    citeId: 'font-strategy-13649',
  },
  {
    style: 'display',
    styleName: '欧文・数字用フォント',
    psychologicalEffects: [
      '数字の視認性・インパクトを最大化',
      'データの信頼性を演出',
      'モダン・洗練された印象',
    ],
    bestUseCases: [
      '実績数値の強調',
      '価格表示',
      'ロゴ・ブランド名',
    ],
    industriesRecommended: ['すべての業種（数字・英字表示）'],
    fonts: [
      {
        name: 'Montserrat',
        weights: ['Regular', 'Medium', 'SemiBold', 'Bold'],
        source: 'google',
        googleFontsUrl: 'https://fonts.google.com/specimen/Montserrat',
        characteristics: 'モダンで洗練されたサンセリフ。数字の視認性が高い',
      },
      {
        name: 'Inter',
        weights: ['Regular', 'Medium', 'SemiBold', 'Bold'],
        source: 'google',
        googleFontsUrl: 'https://fonts.google.com/specimen/Inter',
        characteristics: 'UIに最適化されたモダンフォント。可読性に優れる',
      },
      {
        name: 'DIN',
        weights: ['Regular', 'Medium', 'Bold'],
        source: 'adobe',
        adobeFontsUrl: 'https://fonts.adobe.com/fonts/din-2014',
        characteristics: '工業的・機能的な印象。数字表示の定番',
      },
      {
        name: 'Roboto',
        weights: ['Regular', 'Medium', 'Bold'],
        source: 'google',
        googleFontsUrl: 'https://fonts.google.com/specimen/Roboto',
        characteristics: 'Googleのデフォルトフォント。汎用性が高い',
      },
      {
        name: 'Poppins',
        weights: ['Regular', 'Medium', 'SemiBold', 'Bold'],
        source: 'google',
        googleFontsUrl: 'https://fonts.google.com/specimen/Poppins',
        characteristics: '幾何学的でモダン。見出し・数字に最適',
      },
    ],
    citeId: 'font-strategy-13649',
  },
];

/**
 * ジャンプ率（視覚的強弱）ガイドライン
 */
export const JUMP_RATIO_GUIDELINES: JumpRatioGuideline[] = [
  {
    level: 'high',
    h1ToBody: 2.5,
    h2ToBody: 1.8,
    description: '大胆なコントラストでキャッチーに。数字は特に大きく表示',
    psychologicalEffect: '視覚的なメリハリが「重要な情報がある」というシグナルを送り、読み進める動機を生成',
    industriesRecommended: ['SaaS・テック', 'EC・通販', 'スタートアップ'],
    cvrImpact: 'ジャンプ率が高いデザインはスクロール率15%向上',
    citeId: 'font-strategy-13649',
  },
  {
    level: 'medium',
    h1ToBody: 2.0,
    h2ToBody: 1.5,
    description: '適度なメリハリで情報を整理、疲れにくい設計',
    psychologicalEffect: 'バランスの取れた視覚的階層で、信頼感を損なわずに情報を伝達',
    industriesRecommended: ['保険・金融', '教育・スクール', '不動産', '人材・採用'],
    cvrImpact: '信頼性と可読性のバランスが取れた設計',
    citeId: 'font-strategy-13649',
  },
  {
    level: 'low',
    h1ToBody: 1.7,
    h2ToBody: 1.4,
    description: '落ち着いた印象で高額商材に相応しい格調を維持',
    psychologicalEffect: '控えめな強調が「押し売り」感を排除し、上質・専門的な印象を与える',
    industriesRecommended: ['医療・ヘルスケア', '法律・士業', '高級ブランド'],
    cvrImpact: '高額・専門サービスでは過度な強調が逆効果になる場合がある',
    citeId: 'font-strategy-13649',
  },
];

/**
 * タイポグラフィサイズシステム
 */
export const TYPOGRAPHY_SIZE_SYSTEM: TypographySizeSystem[] = [
  {
    element: 'H1（大見出し）',
    pc: { min: 36, max: 52 },
    sp: { min: 24, max: 36 },
    lineHeight: { min: 1.2, max: 1.4 },
    purpose: 'メインメッセージ。ファーストビューで最も目立つ要素',
  },
  {
    element: 'H2（中見出し）',
    pc: { min: 24, max: 36 },
    sp: { min: 20, max: 28 },
    lineHeight: { min: 1.3, max: 1.5 },
    purpose: 'セクション見出し。ページの構造を明確にする',
  },
  {
    element: 'H3（小見出し）',
    pc: { min: 20, max: 28 },
    sp: { min: 18, max: 24 },
    lineHeight: { min: 1.3, max: 1.5 },
    purpose: 'サブセクション。詳細情報の区切り',
  },
  {
    element: '本文',
    pc: { min: 15, max: 18 },
    sp: { min: 16, max: 16 },
    lineHeight: { min: 1.7, max: 1.9 },
    purpose: '通常テキスト。可読性が最優先',
  },
  {
    element: 'キャプション',
    pc: { min: 12, max: 14 },
    sp: { min: 12, max: 14 },
    lineHeight: { min: 1.5, max: 1.7 },
    purpose: '注釈・補足。目立たせすぎない',
  },
  {
    element: '数値強調',
    pc: { min: 48, max: 72 },
    sp: { min: 32, max: 56 },
    lineHeight: { min: 1.0, max: 1.2 },
    purpose: '実績データ。インパクトを最大化',
  },
];

/**
 * テキストレイアウトルール
 */
export const TEXT_LAYOUT_RULES: TextLayoutRule[] = [
  {
    rule: '行揃え',
    description: '日本語は左揃え、数字・価格は右揃えを推奨',
    psychologicalEffect: '視線の動きを自然にし、認知負荷を軽減。価格の右揃えは比較しやすさを向上',
    implementation: [
      '本文は左揃えを基本とする',
      '中央揃えは見出し・キャッチのみ',
      '価格表は右揃えで比較しやすく',
    ],
    citeId: 'font-strategy-13649',
  },
  {
    rule: 'カーニング（字詰め）',
    description: '見出しには適切なカーニング調整を',
    psychologicalEffect: '文字間の不自然さが「素人っぽさ」「信頼性の低さ」という印象を与える',
    implementation: [
      '大きな見出しは手動カーニングを検討',
      '「。」「、」の前後は詰める',
      'CSSのletter-spacingで全体調整',
    ],
    citeId: 'font-strategy-13649',
  },
  {
    rule: '行間',
    description: '日本語本文の行間は1.7-1.8倍を推奨',
    psychologicalEffect: '適切な行間は可読性を高め、長文の読了率を向上させる',
    implementation: [
      '本文：1.7-1.8倍',
      '見出し：1.2-1.4倍',
      'キャプション：1.5-1.7倍',
    ],
    citeId: 'font-strategy-13649',
  },
  {
    rule: 'スマホ本文サイズ',
    description: 'スマホ本文は16px（24pt）以上を厳守',
    psychologicalEffect: '小さい文字は「読むのが面倒」という認知負荷を増大させ、無意識に離脱を促す',
    implementation: [
      '本文は最低16pxを維持',
      'フォーム入力欄は16px以上（iOSの自動ズーム防止）',
      'キャプションでも12px以上を確保',
    ],
    citeId: 'font-strategy-13649',
  },
];

/**
 * フォント選定チェックリスト
 */
export const FONT_CHECKLIST = {
  heading: [
    '業種・サービスのトーンに合っているか',
    'ブランドの印象を適切に表現しているか',
    'ターゲットユーザーに受け入れられる書体か',
    '数字の視認性は十分か',
  ],
  body: [
    '長文でも読みやすいか',
    'スマホ表示で16px以上を確保しているか',
    '行間は1.7-1.8倍あるか',
    '見出しフォントとの相性は良いか',
  ],
  overall: [
    'フォント数は2-3種類に抑えられているか',
    'ウェイトの使い分けで階層が明確か',
    'Web Fontのロード時間は許容範囲か',
    'フォールバックフォントを設定しているか',
  ],
  citeId: 'font-strategy-13649',
};

/**
 * フォント戦略ガイドをプロンプト用テキストに変換
 */
export function formatFontStrategyForPrompt(): string {
  const categories = FONT_CATEGORIES.map(cat => 
    `■ ${cat.styleName}
  心理効果: ${cat.psychologicalEffects[0]}
  推奨業種: ${cat.industriesRecommended.join('、')}
  推奨フォント: ${cat.fonts.slice(0, 3).map(f => f.name).join('、')}`
  ).join('\n\n');

  const jumpRatios = JUMP_RATIO_GUIDELINES.map(jr =>
    `・${jr.level === 'high' ? '高' : jr.level === 'medium' ? '中' : '低'}ジャンプ率: H1/本文=${jr.h1ToBody}倍
    ${jr.description}
    CVR効果: ${jr.cvrImpact}`
  ).join('\n');

  return `
【フォント戦略ガイド】
参照元: https://conversion-labo.jp/report/lp_design/13649/

## フォントカテゴリ別ガイド

${categories}

## ジャンプ率（視覚的強弱）

${jumpRatios}

## 重要な原則

1. **スマホ本文16px以上**: 16px未満は離脱率23%上昇
2. **行間1.7-1.8倍**: 日本語の可読性を最適化
3. **フォント数制限**: 2-3種類に抑えて統一感を維持
`.trim();
}

/**
 * フォームの業界選択肢からフォントカテゴリ検索用キーワードへのマッピング
 */
const FORM_INDUSTRY_TO_FONT_KEYWORDS: Record<string, string[]> = {
  // 物販系 → EC・通販（ゴシック体）
  '美容・健康': ['EC・通販', '美容', '女性向け'],
  'ファッション・アクセサリー': ['EC・通販', '高級ブランド', 'ファッション'],
  '食品・飲料': ['EC・通販', 'カジュアル'],
  '家電・デジタル': ['EC・通販', 'SaaS・テック'],
  '生活用品': ['EC・通販'],
  'ホビー・その他物販': ['EC・通販'],
  // サービス系
  '美容・ヘルスケアサービス': ['医療・ヘルスケア', '女性向け'],
  '教育・スクール': ['教育・スクール', '子供向け'],
  'エンタメ・サブスク': ['EC・通販', 'カジュアル'],
  'ライフイベント・冠婚葬祭': ['保険・金融', '高級ブランド'],
  '旅行・レジャー': ['教育・スクール', 'カジュアル'],
  '生活サービス': ['EC・通販'],
  // 高額商材・契約系
  '金融': ['保険・金融', '法律・士業'],
  '不動産・住宅': ['不動産', '保険・金融'],
  '自動車': ['不動産', '高級ブランド'],
  '通信・インターネット回線': ['SaaS・テック'],
  // BtoB・専門サービス
  '人材・キャリア': ['人材・採用', 'SaaS・テック'],
  '法律・士業サービス': ['法律・士業', '保険・金融'],
  'BtoB・IT・SaaS': ['SaaS・テック'],
  '医療・ヘルスケア': ['医療・ヘルスケア'],
  'その他専門サービス': ['SaaS・テック'],
};

/**
 * 業種に基づいて推奨フォントカテゴリを取得
 */
export function getFontCategoryForIndustry(industry: string): FontCategory | null {
  // フォームの業界選択肢からの直接マッピング（最優先）
  const keywords = FORM_INDUSTRY_TO_FONT_KEYWORDS[industry];
  if (keywords) {
    for (const keyword of keywords) {
      for (const category of FONT_CATEGORIES) {
        if (category.industriesRecommended.some(ind => 
          ind.toLowerCase().includes(keyword.toLowerCase()) || keyword.toLowerCase().includes(ind.toLowerCase())
        )) {
          return category;
        }
      }
    }
  }
  
  // 通常のマッチング
  const industryLower = industry.toLowerCase();
  
  for (const category of FONT_CATEGORIES) {
    if (category.industriesRecommended.some(ind => 
      industryLower.includes(ind.toLowerCase()) || ind.toLowerCase().includes(industryLower)
    )) {
      return category;
    }
  }
  
  // デフォルトはゴシック体
  return FONT_CATEGORIES.find(c => c.style === 'gothic') || null;
}

/**
 * ジャンプ率ガイドラインを取得
 */
export function getJumpRatioGuideline(level: 'high' | 'medium' | 'low'): JumpRatioGuideline | null {
  return JUMP_RATIO_GUIDELINES.find(jr => jr.level === level) || null;
}

/**
 * 推奨フォントを取得（Google Fonts対応のみ）
 */
export function getGoogleFontsRecommendations(style: 'mincho' | 'gothic' | 'maru-gothic'): FontRecommendation[] {
  const category = FONT_CATEGORIES.find(c => c.style === style);
  if (!category) return [];
  
  return category.fonts.filter(f => f.source === 'google');
}
