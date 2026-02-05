/**
 * カラー戦略ガイド
 * 
 * 参考: https://conversion-labo.jp/report/lp_design/14079/
 * 「ランディングページにおける色（カラー）の戦略と設計方法」
 * 
 * 色彩心理学とCVR改善の知見を体系化したナレッジベース
 */

export interface ColorPsychology {
  color: string;
  colorFamily: string;
  hexExamples: string[];
  psychologicalEffects: string[];
  bestUseCases: string[];
  industriesRecommended: string[];
  cautions?: string[];
  citeId: string;
}

export interface ColorLayerSystem {
  layer: 'brand' | 'sub' | 'action' | 'emotional';
  ratio: string;
  purpose: string;
  guidelines: string[];
  examples: { color: string; hex: string; usage: string }[];
  citeId: string;
}

export interface ColorCombination {
  name: string;
  colors: { role: string; hex: string; name: string }[];
  industries: string[];
  psychologicalEffect: string;
  cvrImpact?: string;
  citeId: string;
}

/**
 * 色彩心理学データベース
 */
export const COLOR_PSYCHOLOGY: ColorPsychology[] = [
  {
    color: '青（ブルー）',
    colorFamily: 'blue',
    hexExamples: ['#003D7A', '#2563EB', '#0EA5E9', '#1E40AF'],
    psychologicalEffects: [
      '信頼感・安定感・誠実さを伝える',
      '冷静さ・知性・専門性を感じさせる',
      '高額商材への心理的ハードルを下げる',
    ],
    bestUseCases: [
      'ブランドカラー（信頼性重視の業種）',
      'ヘッダー・フッター',
      '見出しテキスト',
    ],
    industriesRecommended: ['保険・金融', '医療・ヘルスケア', 'SaaS・テック', '人材・採用'],
    cautions: ['冷たい印象になりすぎないよう、暖色のアクセントを加える'],
    citeId: 'color-strategy-14079',
  },
  {
    color: '緑（グリーン）',
    colorFamily: 'green',
    hexExamples: ['#10B981', '#22C55E', '#14B8A6', '#059669'],
    psychologicalEffects: [
      '安心感・安全・自然を連想させる',
      '成長・健康・調和を感じさせる',
      'ポジティブなアクション（進む・OK）を促す',
    ],
    bestUseCases: [
      'CTAボタン（ポジティブなアクション）',
      '成功・達成の表現',
      'エモーショナルカラー（成長・安心）',
    ],
    industriesRecommended: ['医療・ヘルスケア', '教育・スクール', '環境・エコ', '人材・採用'],
    citeId: 'color-strategy-14079',
  },
  {
    color: 'オレンジ',
    colorFamily: 'orange',
    hexExamples: ['#E67E22', '#F97316', '#EA580C', '#D97706'],
    psychologicalEffects: [
      '行動喚起・活力・エネルギーを伝える',
      '緊急性を煽りすぎず前向きなアクションを促す',
      '親しみやすさ・温かみを感じさせる',
    ],
    bestUseCases: [
      'CTAボタン（申込み・購入）',
      '限定・特典の強調',
      'アクセントカラー',
    ],
    industriesRecommended: ['保険・金融', '教育・スクール', 'EC・通販', '不動産'],
    cautions: ['赤より柔らかいが、使いすぎると安売り感が出る'],
    citeId: 'color-strategy-14079',
  },
  {
    color: '赤（レッド）',
    colorFamily: 'red',
    hexExamples: ['#EF4444', '#DC2626', '#B91C1C', '#E11D48'],
    psychologicalEffects: [
      '緊急性・重要性を強調',
      '購買意欲を刺激',
      '情熱・エネルギー・行動力を伝える',
    ],
    bestUseCases: [
      'セール・限定の強調',
      'CTAボタン（EC・通販）',
      '警告・エラー表示',
    ],
    industriesRecommended: ['EC・通販', '飲食・フード'],
    cautions: [
      '使いすぎると安っぽく見える',
      '高級感が求められる業種では避ける',
      '攻撃的な印象を与える可能性がある',
    ],
    citeId: 'color-strategy-14079',
  },
  {
    color: 'ゴールド・ベージュ',
    colorFamily: 'gold',
    hexExamples: ['#F5F0E6', '#D4AF37', '#B8860B', '#F5E6D3'],
    psychologicalEffects: [
      '高級感・上質感・ステータスを演出',
      '信頼・歴史・実績を感じさせる',
      '温かみ・安心感を与える',
    ],
    bestUseCases: [
      'サブカラー（背景・余白）',
      '高級感の演出',
      'アイコン・装飾',
    ],
    industriesRecommended: ['保険・金融', '不動産', '高級ブランド', '美容・コスメ'],
    citeId: 'color-strategy-14079',
  },
  {
    color: '紫（パープル）',
    colorFamily: 'purple',
    hexExamples: ['#7C3AED', '#8B5CF6', '#A855F7', '#6D28D9'],
    psychologicalEffects: [
      '高級感・神秘性・創造性を感じさせる',
      'イノベーション・先進性を伝える',
      '女性らしさ・美意識を連想',
    ],
    bestUseCases: [
      'ブランドカラー（美容・クリエイティブ）',
      'グラデーション（テック系）',
      'アクセントカラー',
    ],
    industriesRecommended: ['美容・コスメ', 'SaaS・テック', 'クリエイティブ'],
    citeId: 'color-strategy-14079',
  },
  {
    color: 'ピンク',
    colorFamily: 'pink',
    hexExamples: ['#EC4899', '#F472B6', '#DB2777', '#FDA4AF'],
    psychologicalEffects: [
      'やさしさ・幸福感・愛情を伝える',
      '女性らしさ・可愛らしさを演出',
      '安心感・リラックスを促す',
    ],
    bestUseCases: [
      'エモーショナルカラー（女性向け）',
      '保険商材のCTA（優しさ訴求）',
      'アクセントカラー',
    ],
    industriesRecommended: ['美容・コスメ', '女性向けサービス', '保険・金融（女性向け）'],
    citeId: 'color-strategy-14079',
  },
  {
    color: '黒（ブラック）',
    colorFamily: 'black',
    hexExamples: ['#000000', '#111827', '#1F2937', '#171717'],
    psychologicalEffects: [
      '高級感・重厚感・フォーマル感を演出',
      'プロフェッショナル・洗練を伝える',
      '力強さ・権威を感じさせる',
    ],
    bestUseCases: [
      'ブランドカラー（高級品・ファッション）',
      'テキストカラー',
      'ヘッダー・フッター',
    ],
    industriesRecommended: ['高級ブランド', 'ファッション', '建築・デザイン'],
    cautions: ['使いすぎると重すぎる印象に'],
    citeId: 'color-strategy-14079',
  },
  {
    color: '白・オフホワイト',
    colorFamily: 'white',
    hexExamples: ['#FFFFFF', '#FAFAFA', '#F9FAFB', '#FFFBF5'],
    psychologicalEffects: [
      '清潔感・シンプルさ・余白の美学',
      '情報の可読性を高める',
      'プロフェッショナル感・洗練を演出',
    ],
    bestUseCases: [
      '背景色（メイン）',
      '余白の確保',
      'テキストの反転時',
    ],
    industriesRecommended: ['すべての業種'],
    citeId: 'color-strategy-14079',
  },
];

/**
 * 3層カラーシステム（60-30-10ルール）
 */
export const COLOR_LAYER_SYSTEM: ColorLayerSystem[] = [
  {
    layer: 'sub',
    ratio: '60%',
    purpose: '背景・余白に使用し、安定感・信頼感を醸成',
    guidelines: [
      '白・オフホワイト・ライトグレーが基本',
      'ブランドカラーの極薄バージョンも可',
      '目に優しく、長時間の閲覧でも疲れにくい色を選ぶ',
      '情報の可読性を最優先',
    ],
    examples: [
      { color: 'ピュアホワイト', hex: '#FFFFFF', usage: '汎用的な背景' },
      { color: 'オフホワイト', hex: '#FAFAFA', usage: 'やや温かみのある背景' },
      { color: 'アイボリー', hex: '#F5F0E6', usage: '高級感・温かみ' },
      { color: 'ライトグレー', hex: '#F3F4F6', usage: 'モダン・クリーン' },
    ],
    citeId: 'color-strategy-14079',
  },
  {
    layer: 'brand',
    ratio: '30%',
    purpose: 'ブランドの「顔」となり、LP全体の基調を決定',
    guidelines: [
      '企業のブランドカラーまたは業種に適した色を選定',
      'ヘッダー・フッター・セクション背景に使用',
      '信頼性・専門性を伝える色を選ぶ',
      '競合との差別化を意識',
    ],
    examples: [
      { color: 'ディープブルー', hex: '#003D7A', usage: '信頼・堅実（金融・保険）' },
      { color: 'ネイビー', hex: '#1E3A5F', usage: '高級感・信頼（不動産）' },
      { color: 'テックブルー', hex: '#2563EB', usage: '先進性・専門性（SaaS）' },
      { color: 'ティール', hex: '#0EA5E9', usage: '知性・成長（教育）' },
    ],
    citeId: 'color-strategy-14079',
  },
  {
    layer: 'action',
    ratio: '10%',
    purpose: '「申込む」などの行動を促すボタンに限定的に使用',
    guidelines: [
      '背景との対比を明確に（コントラスト比4.5:1以上）',
      'CTAボタン・重要数値・リンクに限定',
      '緊急性を煽りすぎない色を選ぶ',
      '業種に応じた適切な色を選定',
    ],
    examples: [
      { color: 'アクションオレンジ', hex: '#E67E22', usage: '前向きな行動喚起（保険・金融）' },
      { color: 'グロースグリーン', hex: '#22C55E', usage: 'ポジティブなアクション（SaaS）' },
      { color: 'アクセントレッド', hex: '#EF4444', usage: '購買促進（EC・通販）' },
      { color: 'ソフトティール', hex: '#14B8A6', usage: '安心感を損なわない行動喚起（医療）' },
    ],
    citeId: 'color-strategy-14079',
  },
  {
    layer: 'emotional',
    ratio: '補助的',
    purpose: '信頼感、安心感、やさしさなどの心理的イメージを付与',
    guidelines: [
      '無意識に働きかける心理的刷り込み色',
      'グラフ・チャート・アイコンなどに使用',
      'ブランドカラーを補完する色を選定',
      '業種・ターゲットに応じた感情を喚起',
    ],
    examples: [
      { color: 'セーフティグリーン', hex: '#10B981', usage: '安心・成長（保険・教育）' },
      { color: 'ウォームベージュ', hex: '#D4AF37', usage: '上質・信頼（金融・不動産）' },
      { color: 'イノベーションパープル', hex: '#7C3AED', usage: '先進性・創造（SaaS）' },
      { color: 'ケアピンク', hex: '#FDA4AF', usage: 'やさしさ・幸福（女性向け）' },
    ],
    citeId: 'color-strategy-14079',
  },
];

/**
 * 推奨カラーコンビネーション
 */
export const COLOR_COMBINATIONS: ColorCombination[] = [
  {
    name: '信頼×上質（保険・金融向け）',
    colors: [
      { role: 'brand', hex: '#003D7A', name: 'ディープブルー' },
      { role: 'sub', hex: '#F5F0E6', name: 'アイボリー' },
      { role: 'action', hex: '#E67E22', name: 'アクションオレンジ' },
      { role: 'emotional', hex: '#10B981', name: 'セーフティグリーン' },
    ],
    industries: ['保険・金融', '証券', '資産運用'],
    psychologicalEffect: 'ブルーで信頼感、ゴールド系で上質感、オレンジで緊張感を緩和しつつ行動を促す',
    cvrImpact: 'ABテストでオレンジCTAがピンクCTAに変更でCVR 1.8%→2.4%（33%改善）',
    citeId: 'color-strategy-14079',
  },
  {
    name: '先進×洗練（SaaS・テック向け）',
    colors: [
      { role: 'brand', hex: '#2563EB', name: 'テックブルー' },
      { role: 'sub', hex: '#F8FAFC', name: 'クールグレー' },
      { role: 'action', hex: '#10B981', name: 'グロースグリーン' },
      { role: 'emotional', hex: '#7C3AED', name: 'イノベーションパープル' },
    ],
    industries: ['SaaS', 'テック', 'クラウドサービス', 'AI'],
    psychologicalEffect: 'ブルー×パープルのグラデーションでイノベーション感、グリーンで成長・成功を暗示',
    citeId: 'color-strategy-14079',
  },
  {
    name: '成長×親しみ（教育・スクール向け）',
    colors: [
      { role: 'brand', hex: '#0EA5E9', name: 'スカイブルー' },
      { role: 'sub', hex: '#FFFBF5', name: 'ウォームホワイト' },
      { role: 'action', hex: '#F59E0B', name: 'サンシャインオレンジ' },
      { role: 'emotional', hex: '#22C55E', name: 'グロースグリーン' },
    ],
    industries: ['教育・スクール', 'オンライン学習', '資格取得'],
    psychologicalEffect: '明るいブルーで知性、オレンジで希望、グリーンで成長を表現し、学習への前向きな姿勢を促す',
    citeId: 'color-strategy-14079',
  },
  {
    name: '高級×安心（不動産向け）',
    colors: [
      { role: 'brand', hex: '#1E3A5F', name: 'ダークネイビー' },
      { role: 'sub', hex: '#F5F1EB', name: 'クリームベージュ' },
      { role: 'action', hex: '#D97706', name: 'アンバー' },
      { role: 'emotional', hex: '#8B7355', name: 'アースブラウン' },
    ],
    industries: ['不動産', '住宅販売', '建築'],
    psychologicalEffect: 'ネイビーで信頼・高級感、ベージュで温かみ・居心地良さ、ブラウンで土地・家への親和性を表現',
    citeId: 'color-strategy-14079',
  },
  {
    name: '清潔×専門（医療・ヘルスケア向け）',
    colors: [
      { role: 'brand', hex: '#0EA5E9', name: 'メディカルブルー' },
      { role: 'sub', hex: '#F0F9FF', name: 'アイスブルー' },
      { role: 'action', hex: '#14B8A6', name: 'ヒーリングティール' },
      { role: 'emotional', hex: '#22C55E', name: 'ヘルシーグリーン' },
    ],
    industries: ['医療', 'クリニック', 'ヘルスケア'],
    psychologicalEffect: 'ブルー系で清潔感と専門性、ティールで安心感を損なわない行動喚起、グリーンで健康・回復を暗示',
    citeId: 'color-strategy-14079',
  },
];

/**
 * カラー選定のチェックリスト
 */
export const COLOR_CHECKLIST = {
  brandColor: [
    '業種・サービスに適した色か',
    '競合との差別化ができているか',
    'ターゲットユーザーの価値観に合っているか',
    'ブランドの核となる価値を表現しているか',
  ],
  subColor: [
    'ブランドカラーを引き立てているか',
    '可読性を確保できているか',
    '目に優しい色か',
    '適切な余白感を演出できているか',
  ],
  actionColor: [
    '背景との対比が十分か（コントラスト比4.5:1以上）',
    '行動を促す色か',
    '緊急性を煽りすぎていないか',
    'ブランドカラーと調和しているか',
  ],
  overall: [
    '60-30-10のバランスが取れているか',
    '色の統一感があるか（微妙なブレがないか）',
    'アクセシビリティに配慮しているか',
    '印刷・デバイス間で見え方が変わりすぎないか',
  ],
  citeId: 'color-strategy-14079',
};

/**
 * カラー戦略ガイドをプロンプト用テキストに変換
 */
export function formatColorStrategyForPrompt(): string {
  const layers = COLOR_LAYER_SYSTEM.filter(layer => layer.layer !== 'emotional').map(layer => 
    `■ ${layer.layer === 'brand' ? 'メインカラー' : layer.layer === 'sub' ? 'サブカラー' : 'アクションカラー'}（${layer.ratio}）
  目的: ${layer.purpose}
  ガイドライン:
${layer.guidelines.map(g => `    ・${g}`).join('\n')}`
  ).join('\n\n');

  const psychology = COLOR_PSYCHOLOGY.slice(0, 5).map(p =>
    `・${p.color}: ${p.psychologicalEffects[0]}`
  ).join('\n');

  return `
【カラー戦略ガイド】
参照元: https://conversion-labo.jp/report/lp_design/14079/

## 3層カラーシステム（60-30-10ルール）

${layers}

## 色彩心理学の基本

${psychology}

## 重要な原則

1. **コントラスト比**: CTAボタンと背景のコントラスト比は4.5:1以上を確保
2. **色の統一性**: 同一ページ内で微妙な色のブレ（#000000と#222222の混在等）を避ける
`.trim();
}

/**
 * フォームの業界選択肢からカラーコンビネーション検索用キーワードへのマッピング
 */
const FORM_INDUSTRY_TO_COLOR_KEYWORDS: Record<string, string[]> = {
  // 物販系 → EC・通販
  '美容・健康': ['EC・通販', 'EC', '通販', '美容'],
  'ファッション・アクセサリー': ['EC・通販', 'EC', '高級ブランド', 'ファッション'],
  '食品・飲料': ['EC・通販', 'EC', '飲食'],
  '家電・デジタル': ['EC・通販', 'EC', 'テック'],
  '生活用品': ['EC・通販', 'EC'],
  'ホビー・その他物販': ['EC・通販', 'EC'],
  // サービス系
  '美容・ヘルスケアサービス': ['医療', 'ヘルスケア', '美容'],
  '教育・スクール': ['教育', 'スクール', '学習'],
  'エンタメ・サブスク': ['EC・通販', 'SaaS'],
  'ライフイベント・冠婚葬祭': ['保険・金融', '不動産'],
  '旅行・レジャー': ['教育', 'EC・通販'],
  '生活サービス': ['EC・通販'],
  // 高額商材・契約系
  '金融': ['保険・金融', '金融', '保険', '証券'],
  '不動産・住宅': ['不動産', '住宅', '建築'],
  '自動車': ['不動産', '高級ブランド'],
  '通信・インターネット回線': ['SaaS', 'テック'],
  // BtoB・専門サービス
  '人材・キャリア': ['人材・採用', '人材'],
  '法律・士業サービス': ['保険・金融', '法律'],
  'BtoB・IT・SaaS': ['SaaS', 'テック', 'クラウド', 'AI'],
  '医療・ヘルスケア': ['医療', 'ヘルスケア', 'クリニック'],
  'その他専門サービス': ['SaaS', 'テック'],
};

/**
 * 業種に基づいて推奨カラーコンビネーションを取得
 */
export function getColorCombinationForIndustry(industry: string): ColorCombination | null {
  // フォームの業界選択肢からの直接マッピング（最優先）
  const keywords = FORM_INDUSTRY_TO_COLOR_KEYWORDS[industry];
  if (keywords) {
    for (const keyword of keywords) {
      for (const combination of COLOR_COMBINATIONS) {
        if (combination.industries.some(ind => 
          ind.toLowerCase().includes(keyword.toLowerCase()) || keyword.toLowerCase().includes(ind.toLowerCase())
        )) {
          return combination;
        }
      }
    }
  }
  
  // 通常のマッチング
  const industryLower = industry.toLowerCase();
  
  for (const combination of COLOR_COMBINATIONS) {
    if (combination.industries.some(ind => 
      industryLower.includes(ind.toLowerCase()) || ind.toLowerCase().includes(industryLower)
    )) {
      return combination;
    }
  }
  
  return null;
}

/**
 * 色彩心理効果を取得
 */
export function getColorPsychology(colorFamily: string): ColorPsychology | null {
  return COLOR_PSYCHOLOGY.find(p => p.colorFamily === colorFamily) || null;
}
