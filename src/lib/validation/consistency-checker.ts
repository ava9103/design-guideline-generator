/**
 * デザインガイドラインの一貫性チェック機能
 * 
 * カラー、フォント、その他の要素における「微妙なブレ」を検出し、
 * 品質向上のための警告と提案を生成
 */

import type { ColorGuideline, TypographyGuideline, Layer3Guidelines } from '@/types';

export type WarningLevel = 'error' | 'warning' | 'info';

export interface ConsistencyWarning {
  level: WarningLevel;
  category: 'color' | 'typography' | 'accessibility' | 'general' | 'specificity' | 'psychology';
  title: string;
  description: string;
  recommendation: string;
  affectedElements?: string[];
}

export interface ConsistencyCheckResult {
  isConsistent: boolean;
  score: number; // 0-100
  specificityScore: number; // 具体性スコア 0-100
  psychologyScore: number; // 心理的根拠スコア 0-100
  warnings: ConsistencyWarning[];
  summary: string;
}

/**
 * HEXカラーをRGBに変換
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * 2つの色の類似度を計算（0-100、100が同一）
 */
function calculateColorSimilarity(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);

  if (!rgb1 || !rgb2) return 0;

  const distance = Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) +
      Math.pow(rgb1.g - rgb2.g, 2) +
      Math.pow(rgb1.b - rgb2.b, 2)
  );

  // 最大距離は約441.67（白と黒の距離）
  const maxDistance = 441.67;
  return Math.round((1 - distance / maxDistance) * 100);
}

/**
 * 相対輝度を計算（WCAG基準）
 */
function calculateRelativeLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * コントラスト比を計算（WCAG基準）
 */
function calculateContrastRatio(hex1: string, hex2: string): number {
  const l1 = calculateRelativeLuminance(hex1);
  const l2 = calculateRelativeLuminance(hex2);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * カラーの一貫性をチェック
 */
export function checkColorConsistency(color: ColorGuideline): ConsistencyWarning[] {
  const warnings: ConsistencyWarning[] = [];

  // 1. 類似色の混在チェック（#000000と#222222など）
  const allColors = [
    { name: 'メインカラー', hex: color.mainColor.hex },
    { name: 'サブカラー', hex: color.subColor.hex },
    { name: 'アクセントカラー', hex: color.accentColor.hex },
    { name: 'プライマリテキスト', hex: color.textColors.primary },
    { name: 'セカンダリテキスト', hex: color.textColors.secondary },
    { name: 'ターシャリテキスト', hex: color.textColors.tertiary },
  ];

  for (let i = 0; i < allColors.length; i++) {
    for (let j = i + 1; j < allColors.length; j++) {
      const similarity = calculateColorSimilarity(
        allColors[i].hex,
        allColors[j].hex
      );

      // 類似度が90%以上だが同一ではない場合
      if (similarity > 90 && similarity < 100) {
        warnings.push({
          level: 'warning',
          category: 'color',
          title: '類似色の混在',
          description: `${allColors[i].name}（${allColors[i].hex}）と${allColors[j].name}（${allColors[j].hex}）が非常に類似しています（類似度${similarity}%）`,
          recommendation:
            '意図的でない場合は、どちらかに統一するか、明確な差をつけることを推奨します（明度差20%以上）',
          affectedElements: [allColors[i].name, allColors[j].name],
        });
      }
    }
  }

  // 2. CTAボタン（アクセントカラー）のコントラスト比チェック
  const accentOnWhiteContrast = calculateContrastRatio(
    color.accentColor.hex,
    '#FFFFFF'
  );
  const accentOnSubContrast = calculateContrastRatio(
    color.accentColor.hex,
    color.subColor.hex
  );

  if (accentOnWhiteContrast < 4.5) {
    warnings.push({
      level: 'error',
      category: 'accessibility',
      title: 'CTAボタンのコントラスト不足',
      description: `アクセントカラー（${color.accentColor.hex}）と白背景のコントラスト比が${accentOnWhiteContrast.toFixed(2)}:1です。WCAG AA基準（4.5:1）を下回っています`,
      recommendation:
        'CTAボタン上のテキストが読みにくくなる可能性があります。より暗いアクセントカラーを検討してください',
      affectedElements: ['アクセントカラー', 'CTAボタン'],
    });
  }

  if (accentOnSubContrast < 3) {
    warnings.push({
      level: 'warning',
      category: 'accessibility',
      title: 'CTAの視認性',
      description: `アクセントカラーとサブカラー（背景）のコントラスト比が${accentOnSubContrast.toFixed(2)}:1です。CTAボタンが目立ちにくい可能性があります`,
      recommendation:
        'アクセントカラーとサブカラーの明度差を大きくすることで、CTAの視認性が向上します',
      affectedElements: ['アクセントカラー', 'サブカラー'],
    });
  }

  // 3. テキストカラーの段階的な差チェック
  const primarySecondaryDiff = calculateColorSimilarity(
    color.textColors.primary,
    color.textColors.secondary
  );
  const secondaryTertiaryDiff = calculateColorSimilarity(
    color.textColors.secondary,
    color.textColors.tertiary
  );

  if (primarySecondaryDiff > 95) {
    warnings.push({
      level: 'info',
      category: 'color',
      title: 'テキスト色の差が小さい',
      description:
        'プライマリテキストとセカンダリテキストの差がほとんどありません',
      recommendation:
        '情報の優先度を視覚的に伝えるため、明度に20%以上の差をつけることを推奨します',
      affectedElements: ['プライマリテキスト', 'セカンダリテキスト'],
    });
  }

  // 4. メインカラーとアクセントカラーが近すぎる場合
  const mainAccentSimilarity = calculateColorSimilarity(
    color.mainColor.hex,
    color.accentColor.hex
  );
  if (mainAccentSimilarity > 80) {
    warnings.push({
      level: 'warning',
      category: 'color',
      title: 'メインカラーとアクセントカラーが類似',
      description: `メインカラーとアクセントカラーの類似度が${mainAccentSimilarity}%です。CTAが十分に目立たない可能性があります`,
      recommendation:
        'アクセントカラーは行動喚起のため、メインカラーと明確に異なる色相を推奨します',
      affectedElements: ['メインカラー', 'アクセントカラー'],
    });
  }

  return warnings;
}

/**
 * タイポグラフィの一貫性をチェック
 */
export function checkTypographyConsistency(
  typography: TypographyGuideline
): ConsistencyWarning[] {
  const warnings: ConsistencyWarning[] = [];

  // 1. フォントサイズの解析
  const parseFontSize = (size: string): number => {
    const match = size.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  // 2. スマホ本文サイズのチェック
  for (const sizeItem of typography.sizeSystem) {
    const spSize = parseFontSize(sizeItem.sp);

    if (sizeItem.element.includes('本文') && spSize < 16) {
      warnings.push({
        level: 'error',
        category: 'typography',
        title: 'スマホ本文サイズが小さすぎる',
        description: `スマホの本文サイズが${spSize}pxです。16px未満は離脱率が23%上昇するというデータがあります`,
        recommendation:
          'スマホの本文サイズは最低16px（24pt相当）を推奨します',
        affectedElements: [sizeItem.element],
      });
    }

    if (sizeItem.element.includes('キャプション') && spSize < 12) {
      warnings.push({
        level: 'warning',
        category: 'typography',
        title: 'スマホキャプションサイズ',
        description: `スマホのキャプションサイズが${spSize}pxです`,
        recommendation:
          '可読性を確保するため、キャプションでも12px以上を推奨します',
        affectedElements: [sizeItem.element],
      });
    }
  }

  // 3. ジャンプ率のチェック（H1とH2の差）
  const h1Item = typography.sizeSystem.find(
    (s) => s.element.includes('H1') || s.element.includes('大見出し')
  );
  const h2Item = typography.sizeSystem.find(
    (s) => s.element.includes('H2') || s.element.includes('中見出し')
  );
  const bodyItem = typography.sizeSystem.find(
    (s) => s.element.includes('本文')
  );

  if (h1Item && bodyItem) {
    const h1Size = parseFontSize(h1Item.pc);
    const bodySize = parseFontSize(bodyItem.pc);
    const jumpRatio = h1Size / bodySize;

    if (jumpRatio < 1.5) {
      warnings.push({
        level: 'warning',
        category: 'typography',
        title: 'ジャンプ率が低い',
        description: `H1と本文のサイズ比が${jumpRatio.toFixed(1)}:1です。視覚的なメリハリが不足している可能性があります`,
        recommendation:
          'ジャンプ率を2:1以上にすることで、スクロール率が15%向上するというデータがあります',
        affectedElements: ['H1', '本文'],
      });
    }
  }

  // 4. line-heightのチェック
  for (const sizeItem of typography.sizeSystem) {
    const lineHeight = parseFloat(sizeItem.lineHeight);

    if (sizeItem.element.includes('本文') && lineHeight < 1.5) {
      warnings.push({
        level: 'warning',
        category: 'typography',
        title: '本文の行間が狭い',
        description: `本文の行間（line-height: ${lineHeight}）が狭めです`,
        recommendation:
          '日本語の本文は1.7-1.8倍の行間を推奨します。読みやすさが向上します',
        affectedElements: [sizeItem.element],
      });
    }
  }

  return warnings;
}

/**
 * 具体性チェック - 抽象的な表現ではなく具体的な値が使われているか
 */
export function checkSpecificity(
  guidelines: Layer3Guidelines
): { score: number; warnings: ConsistencyWarning[] } {
  const warnings: ConsistencyWarning[] = [];
  let specificityPoints = 0;
  let maxPoints = 0;

  // 禁止ワード（抽象的な表現）
  const abstractTerms = [
    '明るい色', '暗い色', '目立つ色', '落ち着いた色',
    'ゴシック体', '明朝体', 'サンセリフ', 'セリフ体',
    '大きめ', '小さめ', '太め', '細め',
    '適切な', '最適な', '良い感じ', 'いい感じ',
    '自然な', 'シンプルな', 'モダンな', 'クリーンな'
  ];

  // 具体的なフォント名パターン
  const specificFontPatterns = [
    /noto\s*sans/i, /noto\s*serif/i, /source\s*han/i,
    /游ゴシック/i, /游明朝/i, /ヒラギノ/i, /hiragino/i,
    /meiryo/i, /メイリオ/i, /roboto/i, /inter/i,
    /poppins/i, /montserrat/i, /open\s*sans/i, /lato/i,
    /manrope/i, /plus\s*jakarta/i
  ];

  // HEXカラーパターン
  const hexColorPattern = /#[0-9A-Fa-f]{6}/;

  // 1. フォント名の具体性チェック
  const fontNames = [
    guidelines.typography.mainFont.japanese.name,
    guidelines.typography.mainFont.western.name,
    guidelines.typography.subFont.japanese.name,
    guidelines.typography.subFont.western.name,
  ];

  for (const fontName of fontNames) {
    maxPoints += 10;
    const isSpecific = specificFontPatterns.some(pattern => pattern.test(fontName));
    const isAbstract = abstractTerms.some(term => fontName.includes(term));

    if (isSpecific && !isAbstract) {
      specificityPoints += 10;
    } else if (isAbstract) {
      warnings.push({
        level: 'warning',
        category: 'specificity',
        title: '抽象的なフォント名',
        description: `「${fontName}」は抽象的です。具体的なフォント名（例: Noto Sans JP）を使用してください`,
        recommendation: 'Google FontsやAdobe Fontsから具体的なフォント名を指定してください',
        affectedElements: ['フォント設定'],
      });
    } else {
      specificityPoints += 5; // 部分的に具体的
    }
  }

  // 2. カラー値の具体性チェック
  const colorValues = [
    { name: 'メインカラー', value: guidelines.color.mainColor.hex },
    { name: 'サブカラー', value: guidelines.color.subColor.hex },
    { name: 'アクセントカラー', value: guidelines.color.accentColor.hex },
  ];

  for (const color of colorValues) {
    maxPoints += 10;
    if (hexColorPattern.test(color.value)) {
      specificityPoints += 10;
    } else {
      warnings.push({
        level: 'error',
        category: 'specificity',
        title: '非具体的なカラー値',
        description: `${color.name}の値「${color.value}」が具体的なHEX値ではありません`,
        recommendation: '#3B82F6のような6桁のHEXカラーコードを使用してください',
        affectedElements: [color.name],
      });
    }
  }

  // 3. サイズ値の具体性チェック（pxやremの数値が含まれているか）
  const sizePattern = /\d+\s*(px|rem|em|pt|%)/i;
  for (const sizeItem of guidelines.typography.sizeSystem) {
    maxPoints += 5;
    if (sizePattern.test(sizeItem.pc) && sizePattern.test(sizeItem.sp)) {
      specificityPoints += 5;
    } else {
      warnings.push({
        level: 'warning',
        category: 'specificity',
        title: '非具体的なサイズ値',
        description: `${sizeItem.element}のサイズ値が具体的ではありません（PC: ${sizeItem.pc}, SP: ${sizeItem.sp}）`,
        recommendation: '「36px」「1.5rem」のような具体的な単位付き数値を使用してください',
        affectedElements: [sizeItem.element],
      });
    }
  }

  // 4. 抽象的な表現が説明文に含まれていないかチェック
  const descriptions = [
    guidelines.color.mainColor.psychologicalEffect,
    guidelines.color.subColor.psychologicalEffect,
    guidelines.color.accentColor.psychologicalEffect,
    guidelines.typography.mainFont.japanese.reason,
  ];

  for (const desc of descriptions) {
    maxPoints += 5;
    const hasAbstractTerm = abstractTerms.some(term => desc?.includes(term));
    if (!hasAbstractTerm && desc && desc.length > 20) {
      specificityPoints += 5;
    } else if (hasAbstractTerm) {
      specificityPoints += 2;
    }
  }

  const score = maxPoints > 0 ? Math.round((specificityPoints / maxPoints) * 100) : 100;

  return { score, warnings };
}

/**
 * 心理的根拠チェック - 選択理由に心理的効果の説明があるか
 */
export function checkPsychologicalRationale(
  guidelines: Layer3Guidelines
): { score: number; warnings: ConsistencyWarning[] } {
  const warnings: ConsistencyWarning[] = [];
  let psychologyPoints = 0;
  let maxPoints = 0;

  // 心理効果に関連するキーワード
  const psychologyKeywords = [
    '信頼', '安心', '安全', '期待', '興奮', '行動',
    '購買意欲', 'CVR', 'コンバージョン', '離脱率',
    '視線誘導', '注目', '認知', '記憶', '印象',
    '高級感', '親しみ', 'カジュアル', 'プロフェッショナル',
    '清潔感', 'モダン', '伝統', '革新',
    '緊急性', '希少性', '権威性', '社会的証明',
    '心理', '効果', '影響', '促す', '誘導',
    '視覚的', '直感的', '感情的', '論理的'
  ];

  // 1. カラーの心理的根拠チェック
  const colorPsychology = [
    { name: 'メインカラー', effect: guidelines.color.mainColor.psychologicalEffect },
    { name: 'サブカラー', effect: guidelines.color.subColor.psychologicalEffect },
    { name: 'アクセントカラー', effect: guidelines.color.accentColor.psychologicalEffect },
  ];

  for (const item of colorPsychology) {
    maxPoints += 15;
    if (!item.effect || item.effect.length < 10) {
      warnings.push({
        level: 'warning',
        category: 'psychology',
        title: '心理的根拠が不足',
        description: `${item.name}に心理的効果の説明がありません`,
        recommendation: 'なぜこの色を選んだのか、ターゲットにどのような心理効果を与えるかを説明してください',
        affectedElements: [item.name],
      });
    } else {
      const hasPsychologyKeyword = psychologyKeywords.some(kw => item.effect?.includes(kw));
      if (hasPsychologyKeyword) {
        psychologyPoints += 15;
      } else if (item.effect.length > 30) {
        psychologyPoints += 10;
      } else {
        psychologyPoints += 5;
        warnings.push({
          level: 'info',
          category: 'psychology',
          title: '心理的根拠を強化可能',
          description: `${item.name}の心理効果説明をより具体的にできます`,
          recommendation: '「信頼感を醸成」「購買意欲を高める」など具体的な心理効果を追記してください',
          affectedElements: [item.name],
        });
      }
    }
  }

  // 2. フォント選択の心理的根拠チェック
  const fontReasons = [
    { name: '日本語メインフォント', reason: guidelines.typography.mainFont.japanese.reason },
    { name: '欧文メインフォント', reason: guidelines.typography.mainFont.western.reason },
  ];

  for (const item of fontReasons) {
    maxPoints += 10;
    if (!item.reason || item.reason.length < 10) {
      warnings.push({
        level: 'warning',
        category: 'psychology',
        title: 'フォント選択理由が不足',
        description: `${item.name}を選んだ理由が不明確です`,
        recommendation: 'フォントが与える印象と、なぜそれがターゲットに適しているかを説明してください',
        affectedElements: [item.name],
      });
    } else {
      const hasPsychologyKeyword = psychologyKeywords.some(kw => item.reason?.includes(kw));
      if (hasPsychologyKeyword || item.reason.length > 30) {
        psychologyPoints += 10;
      } else {
        psychologyPoints += 5;
      }
    }
  }

  // 3. CTAボタンの心理的根拠チェック
  maxPoints += 15;
  const ctaRationale = guidelines.ui.buttons.primary.psychologicalRationale;
  if (!ctaRationale || ctaRationale.length < 10) {
    warnings.push({
      level: 'warning',
      category: 'psychology',
      title: 'CTAの心理的根拠が不足',
      description: 'CTAボタンがユーザーの行動を促す理由が説明されていません',
      recommendation: 'ボタンの色・サイズ・配置がどのようにクリックを誘導するか説明してください',
      affectedElements: ['CTAボタン'],
    });
  } else {
    const hasPsychologyKeyword = psychologyKeywords.some(kw => ctaRationale?.includes(kw));
    if (hasPsychologyKeyword) {
      psychologyPoints += 15;
    } else {
      psychologyPoints += 8;
    }
  }

  // 4. ジャンプ率の根拠チェック
  maxPoints += 10;
  if (guidelines.typography.jumpRatio && guidelines.typography.jumpRatio.rationale) {
    const rationale = guidelines.typography.jumpRatio.rationale;
    if (rationale.length > 20) {
      psychologyPoints += 10;
    } else {
      psychologyPoints += 5;
    }
  }

  const score = maxPoints > 0 ? Math.round((psychologyPoints / maxPoints) * 100) : 100;

  return { score, warnings };
}

/**
 * ガイドライン全体の一貫性をチェック
 */
export function checkGuidelineConsistency(
  guidelines: Layer3Guidelines
): ConsistencyCheckResult {
  const colorWarnings = checkColorConsistency(guidelines.color);
  const typographyWarnings = checkTypographyConsistency(guidelines.typography);
  const specificityResult = checkSpecificity(guidelines);
  const psychologyResult = checkPsychologicalRationale(guidelines);

  const allWarnings = [
    ...colorWarnings, 
    ...typographyWarnings, 
    ...specificityResult.warnings,
    ...psychologyResult.warnings,
  ];

  // スコア計算
  const errorCount = allWarnings.filter((w) => w.level === 'error').length;
  const warningCount = allWarnings.filter((w) => w.level === 'warning').length;
  const infoCount = allWarnings.filter((w) => w.level === 'info').length;

  let score = 100;
  score -= errorCount * 15;
  score -= warningCount * 5;
  score -= infoCount * 2;
  score = Math.max(0, Math.min(100, score));

  // 具体性・心理的根拠スコアも総合スコアに反映
  const adjustedScore = Math.round(
    score * 0.5 + specificityResult.score * 0.25 + psychologyResult.score * 0.25
  );

  // サマリー生成
  let summary: string;
  if (adjustedScore >= 90) {
    summary = '非常に高品質なガイドラインです。具体性と心理的根拠が十分です。';
  } else if (adjustedScore >= 70) {
    summary = '概ね良好ですが、具体性や心理的根拠に改善の余地があります。';
  } else if (adjustedScore >= 50) {
    summary = '品質に課題があります。抽象的な表現を避け、心理的根拠を追加してください。';
  } else {
    summary = '重要な品質問題があります。具体的な値と選択理由を必ず記載してください。';
  }

  return {
    isConsistent: errorCount === 0,
    score: adjustedScore,
    specificityScore: specificityResult.score,
    psychologyScore: psychologyResult.score,
    warnings: allWarnings,
    summary,
  };
}

/**
 * 警告を人間が読みやすい形式でフォーマット
 */
export function formatWarningsForDisplay(
  warnings: ConsistencyWarning[]
): string {
  if (warnings.length === 0) {
    return '✅ 一貫性チェック完了: 問題は検出されませんでした';
  }

  const grouped = {
    error: warnings.filter((w) => w.level === 'error'),
    warning: warnings.filter((w) => w.level === 'warning'),
    info: warnings.filter((w) => w.level === 'info'),
  };

  const sections: string[] = [];

  if (grouped.error.length > 0) {
    sections.push('🔴 **エラー**');
    grouped.error.forEach((w) => {
      sections.push(`  - ${w.title}: ${w.description}`);
      sections.push(`    → ${w.recommendation}`);
    });
  }

  if (grouped.warning.length > 0) {
    sections.push('\n🟡 **警告**');
    grouped.warning.forEach((w) => {
      sections.push(`  - ${w.title}: ${w.description}`);
      sections.push(`    → ${w.recommendation}`);
    });
  }

  if (grouped.info.length > 0) {
    sections.push('\n🔵 **情報**');
    grouped.info.forEach((w) => {
      sections.push(`  - ${w.title}: ${w.description}`);
      sections.push(`    → ${w.recommendation}`);
    });
  }

  return sections.join('\n');
}
