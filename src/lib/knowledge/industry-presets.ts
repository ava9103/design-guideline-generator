/**
 * 業種別デザインプリセット知識ベース
 * 
 * 参考記事:
 * - 14079: 3層カラーシステム（ブランドカラー60%・サブカラー30%・アクションカラー10%）
 * - 13974: トーン&マナー設計（4視点・4ステップ）
 * - 13649: 文字の精密設計（ジャンプ率・業種別フォント選定）
 */

export interface IndustryColorPreset {
  brand: {
    colorFamily: string;
    hexExample: string;
    effect: string;
  };
  sub: {
    colorFamily: string;
    hexExample: string;
    effect: string;
  };
  action: {
    colorFamily: string;
    hexExample: string;
    effect: string;
  };
  emotionalColor?: {
    color: string;
    purpose: string;
    mechanism: string;
  };
}

export interface IndustryFontPreset {
  heading: {
    style: 'mincho' | 'gothic' | 'maru-gothic' | 'display';
    recommendation: string;
    effect: string;
  };
  body: {
    style: 'mincho' | 'gothic' | 'maru-gothic';
    recommendation: string;
    effect: string;
  };
  accent?: {
    style: string;
    recommendation: string;
    usage: string;
  };
}

export interface IndustryTypographyRules {
  pc: {
    h1: string;
    h2: string;
    body: string;
    caption: string;
  };
  sp: {
    h1: string;
    h2: string;
    body: string;
    caption: string;
  };
  jumpRatio: {
    level: 'high' | 'medium' | 'low';
    description: string;
  };
}

export interface IndustryDesignPreset {
  industry: string;
  subCategories: string[];
  color: IndustryColorPreset;
  font: IndustryFontPreset;
  typography: IndustryTypographyRules;
  toneAndManner: {
    keywords: string[];
    avoid: string[];
  };
  rationale: string;
  cvrTips: string[];
}

/**
 * 業種別デザインプリセット
 */
export const INDUSTRY_PRESETS: Record<string, IndustryDesignPreset> = {
  '保険・金融': {
    industry: '保険・金融',
    subCategories: ['生命保険', '損害保険', '資産運用', '証券', '銀行', 'クレジットカード'],
    color: {
      brand: {
        colorFamily: 'blue',
        hexExample: '#003D7A',
        effect: '信頼感・安定感・誠実さを伝え、高額商材への心理的ハードルを下げる',
      },
      sub: {
        colorFamily: 'gold/ivory',
        hexExample: '#F5F0E6',
        effect: '上質感・安心感を醸成し、ブランドの格を伝える',
      },
      action: {
        colorFamily: 'vivid_orange',
        hexExample: '#E67E22',
        effect: '緊張感を回避しつつ行動喚起。赤よりも「前向きな一歩」を促す',
      },
      emotionalColor: {
        color: 'soft_green',
        purpose: '安心・成長のイメージ',
        mechanism: '「守られている」「増えていく」という無意識の連想を促進',
      },
    },
    font: {
      heading: {
        style: 'mincho',
        recommendation: '游明朝 / リュウミン / A-OTF 見出ミンMA31',
        effect: '品格・信頼性・歴史を感じさせ、高額商材に相応しい格調を演出',
      },
      body: {
        style: 'gothic',
        recommendation: '游ゴシック Medium / Noto Sans JP',
        effect: '可読性を確保しつつ、明朝との対比で情報のメリハリを出す',
      },
      accent: {
        style: 'serif-western',
        recommendation: 'Garamond / Times New Roman',
        usage: '数字・金額表示',
      },
    },
    typography: {
      pc: {
        h1: '36-42px',
        h2: '28-32px',
        body: '16-17px',
        caption: '13-14px',
      },
      sp: {
        h1: '28-32px',
        h2: '22-26px',
        body: '16px',
        caption: '12-13px',
      },
      jumpRatio: {
        level: 'medium',
        description: '過度に目立たせず、落ち着いた印象で信頼性を担保',
      },
    },
    toneAndManner: {
      keywords: ['信頼', '安心', '堅実', '誠実', '上質', '専門性'],
      avoid: ['派手な色使い', '過度な煽り', 'カジュアルすぎる表現', '安売り感'],
    },
    rationale: '高額商材のため信頼性重視。ブルーで信頼、ゴールドで上質感、オレンジCTAで緊張感を緩和しつつ行動を促す',
    cvrTips: [
      'CTAは「お申し込み」より「無料で相談する」等、ハードルを下げる文言が効果的',
      'ファーストビューに具体的な数字（実績・利率等）を配置',
      '顔写真付きの担当者紹介で人間味を出す',
    ],
  },

  'SaaS・テック': {
    industry: 'SaaS・テック',
    subCategories: ['BtoB SaaS', 'クラウドサービス', 'AI/ML', 'セキュリティ', 'マーケティングツール'],
    color: {
      brand: {
        colorFamily: 'deep_blue/purple',
        hexExample: '#2563EB',
        effect: '先進性・専門性・信頼性を同時に伝える',
      },
      sub: {
        colorFamily: 'neutral_gray',
        hexExample: '#F8FAFC',
        effect: '洗練感・クリーンさを演出、情報の可読性を高める',
      },
      action: {
        colorFamily: 'electric_blue/green',
        hexExample: '#10B981',
        effect: '先進性・成長・ポジティブなアクションを促す',
      },
      emotionalColor: {
        color: 'gradient_purple_blue',
        purpose: 'イノベーション・未来感',
        mechanism: 'グラデーションによる動的な印象で「進化し続ける」イメージを訴求',
      },
    },
    font: {
      heading: {
        style: 'gothic',
        recommendation: 'Noto Sans JP Bold / Inter Bold',
        effect: 'モダンで洗練された印象、読みやすさと先進性を両立',
      },
      body: {
        style: 'gothic',
        recommendation: 'Noto Sans JP Regular / Inter Regular',
        effect: '高い可読性とデジタルネイティブな印象',
      },
      accent: {
        style: 'monospace',
        recommendation: 'JetBrains Mono / Fira Code',
        usage: 'コードサンプル・技術的な数値',
      },
    },
    typography: {
      pc: {
        h1: '40-52px',
        h2: '28-36px',
        body: '16-18px',
        caption: '14px',
      },
      sp: {
        h1: '28-36px',
        h2: '22-28px',
        body: '16px',
        caption: '13px',
      },
      jumpRatio: {
        level: 'high',
        description: '大胆なコントラストでキャッチーに。数字は特に大きく表示',
      },
    },
    toneAndManner: {
      keywords: ['先進的', '効率的', 'シンプル', 'スマート', '革新', 'プロフェッショナル'],
      avoid: ['古臭いデザイン', '複雑すぎる装飾', '曖昧な表現', '素人っぽさ'],
    },
    rationale: '洗練感と先進性を両立し、理系・テック系ユーザーに訴求。余白を活かしたクリーンなデザインで製品の使いやすさも暗示',
    cvrTips: [
      '「無料トライアル」「デモを見る」等の低リスクCTAが効果的',
      '導入企業ロゴを早い段階で表示（社会的証明）',
      '具体的な数値（削減時間・ROI等）を大きく表示',
    ],
  },

  '教育・スクール': {
    industry: '教育・スクール',
    subCategories: ['プログラミングスクール', '英会話', '資格取得', 'オンライン学習', '塾・予備校'],
    color: {
      brand: {
        colorFamily: 'blue/teal',
        hexExample: '#0EA5E9',
        effect: '知性・成長・可能性を感じさせる',
      },
      sub: {
        colorFamily: 'warm_white',
        hexExample: '#FFFBF5',
        effect: '温かみがありつつクリーンな学習環境をイメージ',
      },
      action: {
        colorFamily: 'orange/yellow',
        hexExample: '#F59E0B',
        effect: '希望・エネルギー・前向きなアクションを促す',
      },
      emotionalColor: {
        color: 'green_accent',
        purpose: '成長・達成感',
        mechanism: '「学んで成長する」プロセスへのポジティブな連想',
      },
    },
    font: {
      heading: {
        style: 'maru-gothic',
        recommendation: 'rounded-mplus-1c / ヒラギノ丸ゴ',
        effect: '親しみやすさ・安心感を与え、学習への心理的ハードルを下げる',
      },
      body: {
        style: 'gothic',
        recommendation: 'Noto Sans JP / 游ゴシック',
        effect: '読みやすさを確保し、長文の説明も苦にならない',
      },
    },
    typography: {
      pc: {
        h1: '36-44px',
        h2: '26-32px',
        body: '16-17px',
        caption: '14px',
      },
      sp: {
        h1: '26-32px',
        h2: '20-24px',
        body: '16px',
        caption: '13px',
      },
      jumpRatio: {
        level: 'medium',
        description: '適度なメリハリで情報を整理、疲れにくい設計',
      },
    },
    toneAndManner: {
      keywords: ['成長', '可能性', '親しみやすい', 'サポート', '安心', '達成'],
      avoid: ['威圧的な表現', '難しそうな印象', '冷たい印象', '詰め込みすぎ'],
    },
    rationale: '学習への不安を取り除き、「自分にもできそう」と思わせることが重要。丸ゴシックで親しみやすさを、青系で知性を演出',
    cvrTips: [
      '受講生の声・ビフォーアフターを具体的に',
      '講師の顔写真と経歴で安心感を',
      '「まずは無料体験」等の低コミットメントCTA',
    ],
  },

  '不動産': {
    industry: '不動産',
    subCategories: ['住宅販売', '賃貸', '投資用不動産', 'リフォーム', '建築'],
    color: {
      brand: {
        colorFamily: 'navy/brown',
        hexExample: '#1E3A5F',
        effect: '信頼・安定・高級感を演出',
      },
      sub: {
        colorFamily: 'beige/cream',
        hexExample: '#F5F1EB',
        effect: '温かみ・居心地の良さ・ホーム感を演出',
      },
      action: {
        colorFamily: 'gold/orange',
        hexExample: '#D97706',
        effect: '高級感を損なわず行動を促す',
      },
    },
    font: {
      heading: {
        style: 'mincho',
        recommendation: '游明朝 / 凸版明朝',
        effect: '格調高さ・信頼性を演出',
      },
      body: {
        style: 'gothic',
        recommendation: '游ゴシック / Noto Sans JP',
        effect: '物件情報の可読性を確保',
      },
    },
    typography: {
      pc: {
        h1: '36-48px',
        h2: '28-34px',
        body: '15-16px',
        caption: '13px',
      },
      sp: {
        h1: '28-34px',
        h2: '22-26px',
        body: '15-16px',
        caption: '12px',
      },
      jumpRatio: {
        level: 'medium',
        description: '落ち着いた印象で高額商材に相応しい格調を維持',
      },
    },
    toneAndManner: {
      keywords: ['信頼', '安心', '高品質', '暮らし', '夢', '理想'],
      avoid: ['安売り感', 'チープな印象', '押し売り感', '派手すぎる装飾'],
    },
    rationale: '人生最大の買い物をサポートする信頼性が最重要。落ち着いた色調で安心感を、写真の質で物件の魅力を伝える',
    cvrTips: [
      '大きく美しい物件写真が最重要',
      '資料請求・内見予約への導線を明確に',
      'ローンシミュレーション等の実用ツールで滞在時間UP',
    ],
  },

  'EC・通販': {
    industry: 'EC・通販',
    subCategories: ['ファッション', '食品', 'コスメ', '家電', 'インテリア', 'D2C'],
    color: {
      brand: {
        colorFamily: 'varies_by_product',
        hexExample: '#000000',
        effect: '商品カテゴリに応じて変動（ファッション→黒/白、食品→暖色系等）',
      },
      sub: {
        colorFamily: 'white/light_gray',
        hexExample: '#FAFAFA',
        effect: '商品を引き立てるクリーンな背景',
      },
      action: {
        colorFamily: 'red/orange',
        hexExample: '#EF4444',
        effect: '購買意欲を刺激、「今すぐ」のアクションを促す',
      },
      emotionalColor: {
        color: 'category_specific',
        purpose: '商品の世界観を強化',
        mechanism: '食品→暖色（食欲）、コスメ→ピンク/パープル（美意識）等',
      },
    },
    font: {
      heading: {
        style: 'gothic',
        recommendation: 'Noto Sans JP / Hiragino Sans',
        effect: 'モダンで汎用性が高く、商品を邪魔しない',
      },
      body: {
        style: 'gothic',
        recommendation: 'Noto Sans JP Light-Regular',
        effect: 'スッキリとした可読性、商品情報を読みやすく',
      },
    },
    typography: {
      pc: {
        h1: '32-40px',
        h2: '24-28px',
        body: '14-16px',
        caption: '12-13px',
      },
      sp: {
        h1: '24-30px',
        h2: '18-22px',
        body: '14-15px',
        caption: '11-12px',
      },
      jumpRatio: {
        level: 'high',
        description: '価格・セール情報を目立たせ、購買を促進',
      },
    },
    toneAndManner: {
      keywords: ['お得', '限定', '人気', '品質', 'トレンド', '特別'],
      avoid: ['信頼性を損なう表現', '情報過多', '安っぽすぎる印象'],
    },
    rationale: '商品が主役。デザインは商品を引き立てる黒子に徹しつつ、購買行動を促すCTAは明確に',
    cvrTips: [
      '商品画像の質が売上に直結',
      'レビュー・評価を目立つ位置に',
      '「残りわずか」「期間限定」等の緊急性表示が効果的',
      'カート追加後のクロスセル提案',
    ],
  },

  '人材・採用': {
    industry: '人材・採用',
    subCategories: ['転職エージェント', '求人サイト', '採用LP', '人材派遣'],
    color: {
      brand: {
        colorFamily: 'blue/green',
        hexExample: '#0891B2',
        effect: '信頼・成長・新しいスタートを感じさせる',
      },
      sub: {
        colorFamily: 'light_gray/white',
        hexExample: '#F9FAFB',
        effect: 'クリーンで公正な印象、情報の可読性確保',
      },
      action: {
        colorFamily: 'orange/green',
        hexExample: '#22C55E',
        effect: 'ポジティブなアクション、「応募する」「登録する」を促す',
      },
    },
    font: {
      heading: {
        style: 'gothic',
        recommendation: 'Noto Sans JP Bold / 游ゴシック Bold',
        effect: '力強さと信頼性、キャリアの可能性を感じさせる',
      },
      body: {
        style: 'gothic',
        recommendation: 'Noto Sans JP / 游ゴシック',
        effect: '求人情報の可読性を確保',
      },
    },
    typography: {
      pc: {
        h1: '36-44px',
        h2: '26-32px',
        body: '15-16px',
        caption: '13px',
      },
      sp: {
        h1: '26-32px',
        h2: '20-24px',
        body: '15px',
        caption: '12px',
      },
      jumpRatio: {
        level: 'medium',
        description: '年収等の重要数値は大きく、詳細情報は読みやすく',
      },
    },
    toneAndManner: {
      keywords: ['成長', 'キャリア', '可能性', 'サポート', '信頼', '実績'],
      avoid: ['押し付けがましさ', '不安を煽る表現', 'ブラック企業感'],
    },
    rationale: '転職は人生の大きな決断。信頼感と可能性を同時に伝え、不安を払拭しながら行動を促す',
    cvrTips: [
      '転職成功事例・年収UP実績を具体的に',
      'エージェントの顔写真で安心感を',
      '会員登録のハードルを下げる（1分で完了等）',
    ],
  },

  '医療・ヘルスケア': {
    industry: '医療・ヘルスケア',
    subCategories: ['クリニック', '美容医療', 'ヘルスケアサービス', '医療機器', '介護'],
    color: {
      brand: {
        colorFamily: 'blue/green',
        hexExample: '#0EA5E9',
        effect: '清潔感・信頼・安心を伝える',
      },
      sub: {
        colorFamily: 'white/light_blue',
        hexExample: '#F0F9FF',
        effect: '清潔感・クリニカルな印象',
      },
      action: {
        colorFamily: 'teal/soft_orange',
        hexExample: '#14B8A6',
        effect: '安心感を損なわず予約を促す',
      },
    },
    font: {
      heading: {
        style: 'gothic',
        recommendation: '游ゴシック Medium / Noto Sans JP',
        effect: 'クリーンで読みやすく、専門性を感じさせる',
      },
      body: {
        style: 'gothic',
        recommendation: '游ゴシック / Noto Sans JP Light',
        effect: '医療情報の可読性を確保',
      },
    },
    typography: {
      pc: {
        h1: '32-40px',
        h2: '24-30px',
        body: '15-16px',
        caption: '13px',
      },
      sp: {
        h1: '26-32px',
        h2: '20-24px',
        body: '15px',
        caption: '12px',
      },
      jumpRatio: {
        level: 'low',
        description: '落ち着いた印象で安心感を優先、過度な強調は避ける',
      },
    },
    toneAndManner: {
      keywords: ['安心', '清潔', '専門', '信頼', 'ケア', 'サポート'],
      avoid: ['不安を煽る表現', '過度な宣伝', '素人っぽさ', '不衛生な印象'],
    },
    rationale: '健康に関わる分野のため、清潔感と専門性、安心感が最重要。過度な装飾や煽りは逆効果',
    cvrTips: [
      '医師・スタッフの写真で安心感を',
      '症例写真（ビフォーアフター）は効果的だが、適切な配慮を',
      'Web予約の利便性をアピール',
    ],
  },
};

/**
 * 業種名から最適なプリセットを取得
 */
export function getIndustryPreset(industry: string): IndustryDesignPreset | null {
  // 完全一致
  if (INDUSTRY_PRESETS[industry]) {
    return INDUSTRY_PRESETS[industry];
  }

  // 部分一致を試みる
  const industryLower = industry.toLowerCase();
  for (const [key, preset] of Object.entries(INDUSTRY_PRESETS)) {
    if (
      key.includes(industry) ||
      industry.includes(key) ||
      preset.subCategories.some(
        (sub) => sub.includes(industry) || industry.includes(sub)
      )
    ) {
      return preset;
    }
  }

  // キーワードマッチング
  const keywordMap: Record<string, string> = {
    '保険': '保険・金融',
    '金融': '保険・金融',
    '銀行': '保険・金融',
    '証券': '保険・金融',
    'SaaS': 'SaaS・テック',
    'IT': 'SaaS・テック',
    'テック': 'SaaS・テック',
    'ソフトウェア': 'SaaS・テック',
    'クラウド': 'SaaS・テック',
    '教育': '教育・スクール',
    'スクール': '教育・スクール',
    '塾': '教育・スクール',
    '学習': '教育・スクール',
    '不動産': '不動産',
    '住宅': '不動産',
    'マンション': '不動産',
    'EC': 'EC・通販',
    '通販': 'EC・通販',
    'ショップ': 'EC・通販',
    '人材': '人材・採用',
    '採用': '人材・採用',
    '転職': '人材・採用',
    '医療': '医療・ヘルスケア',
    'クリニック': '医療・ヘルスケア',
    '病院': '医療・ヘルスケア',
    'ヘルスケア': '医療・ヘルスケア',
  };

  for (const [keyword, presetKey] of Object.entries(keywordMap)) {
    if (industryLower.includes(keyword.toLowerCase())) {
      return INDUSTRY_PRESETS[presetKey];
    }
  }

  return null;
}

/**
 * 業種プリセットをプロンプト用のテキストに変換
 */
export function formatPresetForPrompt(preset: IndustryDesignPreset): string {
  return `
【業種別推奨設定: ${preset.industry}】

■ カラーシステム（60-30-10ルール）
・ブランドカラー（30%）: ${preset.color.brand.colorFamily}
  例: ${preset.color.brand.hexExample}
  効果: ${preset.color.brand.effect}
  
・サブカラー（60%）: ${preset.color.sub.colorFamily}
  例: ${preset.color.sub.hexExample}
  効果: ${preset.color.sub.effect}
  
・アクションカラー（10%）: ${preset.color.action.colorFamily}
  例: ${preset.color.action.hexExample}
  効果: ${preset.color.action.effect}

${preset.color.emotionalColor ? `・エモーショナルカラー: ${preset.color.emotionalColor.color}
  目的: ${preset.color.emotionalColor.purpose}
  心理メカニズム: ${preset.color.emotionalColor.mechanism}` : ''}

■ フォント推奨
・見出し: ${preset.font.heading.recommendation}（${preset.font.heading.effect}）
・本文: ${preset.font.body.recommendation}（${preset.font.body.effect}）
${preset.font.accent ? `・アクセント: ${preset.font.accent.recommendation}（${preset.font.accent.usage}）` : ''}

■ タイポグラフィルール
・PC: H1=${preset.typography.pc.h1}, H2=${preset.typography.pc.h2}, 本文=${preset.typography.pc.body}
・SP: H1=${preset.typography.sp.h1}, H2=${preset.typography.sp.h2}, 本文=${preset.typography.sp.body}
・ジャンプ率: ${preset.typography.jumpRatio.level}（${preset.typography.jumpRatio.description}）

■ トーン&マナー
・推奨キーワード: ${preset.toneAndManner.keywords.join('、')}
・避けるべき表現: ${preset.toneAndManner.avoid.join('、')}

■ 設計根拠
${preset.rationale}

■ CVR向上のポイント
${preset.cvrTips.map((tip) => `・${tip}`).join('\n')}
`.trim();
}
