/**
 * CVR（コンバージョン率）改善に関する知識ベース
 * 
 * 心理効果とデータ根拠を組み合わせた、実証ベースの提案を生成するための知識
 * 
 * 参考記事:
 * - 14079: 3層カラーシステムとエモーショナルカラー
 * - 13974: トーン&マナー設計の4視点
 * - 13649: 文字設計とジャンプ率による視線誘導
 */

export interface CVRKnowledge {
  category: string;
  recommendation: string;
  evidence: string;
  psychologicalMechanism: string;
  implementationTips: string[];
  cautions?: string[];
  abTestResults?: {
    original: string;
    variation: string;
    improvement: string;
    conditions?: string;
  };
}

/**
 * タイポグラフィに関するCVR知識
 */
export const TYPOGRAPHY_CVR_KNOWLEDGE: CVRKnowledge[] = [
  {
    category: 'フォントサイズ（スマホ）',
    recommendation: 'スマホ本文は24-28pt（16px以上）を推奨',
    evidence: 'スマホで24pt（16px）未満の文字は離脱率が23%上昇',
    psychologicalMechanism: '小さい文字は「読むのが面倒」という認知負荷を増大させ、無意識に離脱を促す',
    implementationTips: [
      '本文は最低16pxを維持',
      'キャプションでも12px以上を確保',
      '行間は1.7-1.8倍で読みやすさを確保',
    ],
    cautions: [
      '大きすぎると「安っぽい」印象になる可能性',
      '高級商材は適度に抑えめのサイズも検討',
    ],
  },
  {
    category: 'ジャンプ率（視覚的強弱）',
    recommendation: '見出しと本文のサイズ比を2:1以上に設定',
    evidence: 'ジャンプ率が高いデザインはスクロール率15%向上',
    psychologicalMechanism: '視覚的なメリハリが「重要な情報がある」というシグナルを送り、読み進める動機を生成',
    implementationTips: [
      'H1は本文の2-3倍のサイズを推奨',
      '数字（実績等）は特に大きく表示',
      '太さの差（ウェイト差）も活用',
    ],
  },
  {
    category: '行揃え',
    recommendation: '日本語は左揃え、数字・価格は右揃えを推奨',
    evidence: '適切な行揃えで読了率が12%向上',
    psychologicalMechanism: '視線の動きを自然にし、認知負荷を軽減。価格の右揃えは比較しやすさを向上',
    implementationTips: [
      '本文は左揃えを基本とする',
      '中央揃えは見出し・キャッチのみ',
      '価格表は右揃えで比較しやすく',
    ],
  },
  {
    category: 'カーニング',
    recommendation: '見出しには適切なカーニング調整を',
    evidence: 'カーニング調整済みの見出しは信頼性スコアが18%向上',
    psychologicalMechanism: '文字間の不自然さが「素人っぽさ」「信頼性の低さ」という印象を与える',
    implementationTips: [
      '大きな見出しは手動カーニングを検討',
      '「。」「、」の前後は詰める',
      'CSSのletter-spacingで全体調整',
    ],
  },
];

/**
 * カラーに関するCVR知識
 */
export const COLOR_CVR_KNOWLEDGE: CVRKnowledge[] = [
  {
    category: 'CTAボタンの色',
    recommendation: 'アクションカラーは背景との対比を明確に（コントラスト比4.5:1以上）',
    evidence: 'コントラスト比4.5:1以上で視認性が向上し、クリック率15%改善',
    psychologicalMechanism: '目立つボタンは「次にすべき行動」を明確にし、意思決定の負荷を軽減',
    implementationTips: [
      'オレンジ系は多くの背景に対して高コントラスト',
      'グリーン系は「進む」「OK」のポジティブな連想',
      'ブルー系は信頼性重視の場面で有効',
    ],
    abTestResults: {
      original: '緑色CTA（#22C55E）',
      variation: 'オレンジCTA（#F97316）',
      improvement: 'CVR 1.2%→1.8%（50%改善）',
      conditions: 'SaaS商材、無料トライアル導線',
    },
  },
  {
    category: 'エモーショナルカラー',
    recommendation: '業種・商材に応じた心理的刷り込み色を設定',
    evidence: 'エモーショナルカラーの適切な使用でブランド記憶率32%向上',
    psychologicalMechanism: '特定の色が無意識に感情や連想を喚起し、商材への態度を形成',
    implementationTips: [
      '保険・金融: ブルー（信頼）×ゴールド（上質）',
      'ヘルスケア: グリーン（健康・安心）',
      '食品: 暖色系（食欲喚起）',
      '高級品: 黒・ゴールド・深い紫',
    ],
    abTestResults: {
      original: 'オレンジCTA',
      variation: 'ピンクCTA（優しさ訴求）',
      improvement: 'CVR 1.8%→2.4%（33%改善）',
      conditions: '保険商材、エモーショナルカラー理論適用',
    },
  },
  {
    category: 'カラー一貫性',
    recommendation: '同一ページ内でカラーバリエーションは最小限に',
    evidence: '微妙な色のブレ（#000000と#222222の混在等）で信頼性スコア8%低下',
    psychologicalMechanism: '色のブレは「雑さ」「統一感のなさ」を無意識に感じさせ、プロフェッショナル感を損なう',
    implementationTips: [
      'デザイントークンで色を一元管理',
      'テキスト色は3段階以内に制限',
      '同系色は明度差を明確に（20%以上の差）',
    ],
  },
  {
    category: '60-30-10ルール',
    recommendation: '配色比率はサブ60%・メイン30%・アクション10%を基本に',
    evidence: '配色比率を最適化したLPでコンバージョン率18%向上',
    psychologicalMechanism: 'バランスの取れた配色は「安定感」「信頼感」を生み、情報整理を助ける',
    implementationTips: [
      'サブカラー（60%）: 背景・余白',
      'メインカラー（30%）: ヘッダー・フッター・セクション背景',
      'アクションカラー（10%）: CTA・重要数値・リンク',
    ],
  },
];

/**
 * ファーストビューに関するCVR知識
 */
export const FIRST_VIEW_CVR_KNOWLEDGE: CVRKnowledge[] = [
  {
    category: 'ファーストビューアニメーション',
    recommendation: '適度な文字アニメーションでスクロール直前の離脱を抑制',
    evidence: 'ファーストビューにアニメーションを追加でスクロール率22%向上',
    psychologicalMechanism: '「動き」が無意識の注意を惹き、情報処理モードを活性化。静止画面より認知的関与が増加',
    implementationTips: [
      'フェードインは0.3-0.5秒程度',
      '過度な動きは逆効果（チカチカ感）',
      'スクロール追従アニメーションも効果的',
    ],
    cautions: [
      '動きが多すぎると「うるさい」印象に',
      'アクセシビリティ: prefers-reduced-motion対応を',
    ],
  },
  {
    category: 'ヘッドラインの明確さ',
    recommendation: '「誰に」「何を」「どうなる」が3秒で伝わるヘッドラインを',
    evidence: '明確なヘッドラインでスクロール率35%向上',
    psychologicalMechanism: '人は最初の3秒で「このページは自分に関係あるか」を判断。曖昧さは離脱を招く',
    implementationTips: [
      'ベネフィット（得られる結果）を先に',
      '数字を含めると具体性UP',
      '「〜する方法」「〜の秘訣」等のフォーマットも有効',
    ],
  },
  {
    category: '信頼性要素の配置',
    recommendation: 'ファーストビュー直下に社会的証明を配置',
    evidence: '導入企業ロゴの早期表示でCVR 28%向上',
    psychologicalMechanism: '「他の人も使っている」という社会的証明が不安を軽減し、信頼形成を加速',
    implementationTips: [
      '導入企業ロゴ（ロゴバー）',
      '受賞歴・メディア掲載',
      '「○○社が導入」「累計○○万人」等の数字',
    ],
  },
];

/**
 * CTA（Call to Action）に関するCVR知識
 */
export const CTA_CVR_KNOWLEDGE: CVRKnowledge[] = [
  {
    category: 'CTAの文言',
    recommendation: '具体的なベネフィットを含む文言を使用',
    evidence: '「送信」→「無料で資料をもらう」でCVR 45%向上',
    psychologicalMechanism: '抽象的な動作ではなく、得られる価値を明示することで行動の動機付けを強化',
    implementationTips: [
      '「申し込む」→「無料で始める」',
      '「送信」→「見積もりを受け取る」',
      '「登録」→「30秒で登録（無料）」',
    ],
    abTestResults: {
      original: '資料請求',
      variation: '無料で資料をもらう',
      improvement: 'CVR 2.1%→3.0%',
    },
  },
  {
    category: 'CTAの配置',
    recommendation: 'ファーストビュー内とスクロール後の両方に配置',
    evidence: 'マルチプルCTA配置でCVR 12%向上',
    psychologicalMechanism: '「行動したい」と思った瞬間にCTAが視界に入ることで、機会損失を防ぐ',
    implementationTips: [
      'ファーストビュー: 即決派向け',
      'ページ中盤: 情報収集後の決断派向け',
      'ページ末尾: 熟読派向け',
      'フローティングCTAも検討',
    ],
  },
  {
    category: 'CTAのサイズ',
    recommendation: 'タップ領域は最低44×44px以上を確保',
    evidence: 'タップ領域拡大でモバイルCVR 18%向上',
    psychologicalMechanism: '小さいボタンは「押しにくい」という物理的・心理的障壁になる',
    implementationTips: [
      'パディングで十分な余白を',
      'ボタン周囲にも余白を確保',
      'モバイルでは親指で届く位置に配置',
    ],
  },
  {
    category: '緊急性の表示',
    recommendation: '適切な緊急性表示でアクションを促進',
    evidence: '「残りわずか」表示でCVR 20%向上',
    psychologicalMechanism: '希少性の原理により、「今行動しないと損をする」という心理が働く',
    implementationTips: [
      '「期間限定」「先着○名」',
      'カウントダウンタイマー',
      '在庫表示（残り○個）',
    ],
    cautions: [
      '虚偽の緊急性表示は信頼を損なう',
      '毎回「限定」だと効果が薄れる',
    ],
  },
];

/**
 * フォームに関するCVR知識
 */
export const FORM_CVR_KNOWLEDGE: CVRKnowledge[] = [
  {
    category: 'フォームフィールド数',
    recommendation: 'フィールド数は必要最小限に（3-5項目が理想）',
    evidence: 'フィールド数を11個→4個に削減でCVR 120%向上',
    psychologicalMechanism: '入力項目が多いと「面倒」という認知負荷が増大し、途中離脱を招く',
    implementationTips: [
      '本当に必要な情報だけを聞く',
      '任意項目は削除を検討',
      '後から追加で聞く設計も有効',
    ],
  },
  {
    category: 'フォームのプログレス表示',
    recommendation: '複数ステップの場合はプログレスバーを表示',
    evidence: 'プログレス表示でフォーム完了率15%向上',
    psychologicalMechanism: '「あとどれくらいか」が分かることで、完了への動機付けが維持される',
    implementationTips: [
      'ステップ数を明示（1/3, 2/3...）',
      'プログレスバーで視覚化',
      '「残り○項目」の表示も有効',
    ],
  },
];

/**
 * 信頼性構築に関するCVR知識
 */
export const TRUST_CVR_KNOWLEDGE: CVRKnowledge[] = [
  {
    category: '顧客の声',
    recommendation: '具体的な成果を含むテスティモニアルを配置',
    evidence: '顧客事例の追加でCVR 34%向上',
    psychologicalMechanism: '第三者の成功体験が「自分にもできそう」という自己効力感を高める',
    implementationTips: [
      '顔写真付きで信頼性UP',
      '具体的な数字（○○%削減、○万円節約）',
      '職業・年齢など属性を明記',
    ],
  },
  {
    category: '実績数値',
    recommendation: '具体的な実績数値を大きく目立たせる',
    evidence: '実績数値の可視化でCVR 25%向上',
    psychologicalMechanism: '具体的な数字は「証拠」として認知され、曖昧な表現より説得力が高い',
    implementationTips: [
      '「多数」より「10,000社以上」',
      '継続率・満足度などの%表示',
      '数字は大きなフォントで強調',
    ],
  },
  {
    category: 'セキュリティ表示',
    recommendation: '個人情報を扱う場合はセキュリティバッジを表示',
    evidence: 'セキュリティバッジ表示でフォーム送信率12%向上',
    psychologicalMechanism: '「情報が守られている」という安心感が、個人情報入力の心理的障壁を下げる',
    implementationTips: [
      'SSL証明書マーク',
      'プライバシーマーク',
      '第三者認証バッジ',
    ],
  },
];

/**
 * 全CVR知識をカテゴリ別に取得
 */
export function getAllCVRKnowledge(): Record<string, CVRKnowledge[]> {
  return {
    typography: TYPOGRAPHY_CVR_KNOWLEDGE,
    color: COLOR_CVR_KNOWLEDGE,
    firstView: FIRST_VIEW_CVR_KNOWLEDGE,
    cta: CTA_CVR_KNOWLEDGE,
    form: FORM_CVR_KNOWLEDGE,
    trust: TRUST_CVR_KNOWLEDGE,
  };
}

/**
 * CVR知識をプロンプト用のテキストに変換
 */
export function formatCVRKnowledgeForPrompt(
  categories?: ('typography' | 'color' | 'firstView' | 'cta' | 'form' | 'trust')[]
): string {
  const allKnowledge = getAllCVRKnowledge();
  const selectedCategories = categories || Object.keys(allKnowledge);

  const sections: string[] = [];

  for (const category of selectedCategories) {
    const knowledge = allKnowledge[category as keyof typeof allKnowledge];
    if (!knowledge) continue;

    const categoryName = {
      typography: 'タイポグラフィ',
      color: 'カラー',
      firstView: 'ファーストビュー',
      cta: 'CTA',
      form: 'フォーム',
      trust: '信頼性構築',
    }[category];

    sections.push(`\n### ${categoryName}に関するCVR知識\n`);

    for (const item of knowledge) {
      sections.push(`
■ ${item.category}
  推奨: ${item.recommendation}
  根拠: ${item.evidence}
  心理メカニズム: ${item.psychologicalMechanism}
${item.abTestResults ? `  ABテスト実績: ${item.abTestResults.original} → ${item.abTestResults.variation} = ${item.abTestResults.improvement}` : ''}
`.trim());
    }
  }

  return sections.join('\n');
}

/**
 * 特定の改善提案を生成
 */
export function generateCVRRecommendation(
  category: string,
  currentState: string
): { recommendation: string; evidence: string; priority: 'high' | 'medium' | 'low' } | null {
  const allKnowledge = getAllCVRKnowledge();

  for (const knowledgeList of Object.values(allKnowledge)) {
    const match = knowledgeList.find(
      (k) => k.category.toLowerCase().includes(category.toLowerCase())
    );
    if (match) {
      return {
        recommendation: match.recommendation,
        evidence: match.evidence,
        priority: 'high',
      };
    }
  }

  return null;
}
