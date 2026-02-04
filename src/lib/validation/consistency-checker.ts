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
  category: 'color' | 'typography' | 'accessibility' | 'general';
  title: string;
  description: string;
  recommendation: string;
  affectedElements?: string[];
}

export interface ConsistencyCheckResult {
  isConsistent: boolean;
  score: number; // 0-100
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
 * ガイドライン全体の一貫性をチェック
 */
export function checkGuidelineConsistency(
  guidelines: Layer3Guidelines
): ConsistencyCheckResult {
  const colorWarnings = checkColorConsistency(guidelines.color);
  const typographyWarnings = checkTypographyConsistency(guidelines.typography);

  const allWarnings = [...colorWarnings, ...typographyWarnings];

  // スコア計算
  const errorCount = allWarnings.filter((w) => w.level === 'error').length;
  const warningCount = allWarnings.filter((w) => w.level === 'warning').length;
  const infoCount = allWarnings.filter((w) => w.level === 'info').length;

  let score = 100;
  score -= errorCount * 15;
  score -= warningCount * 5;
  score -= infoCount * 2;
  score = Math.max(0, Math.min(100, score));

  // サマリー生成
  let summary: string;
  if (score >= 90) {
    summary = '非常に一貫性の高いガイドラインです。';
  } else if (score >= 70) {
    summary = '概ね良好ですが、いくつかの改善点があります。';
  } else if (score >= 50) {
    summary = '一貫性に課題があります。警告を確認してください。';
  } else {
    summary = '重要な一貫性の問題があります。エラーを優先的に対処してください。';
  }

  return {
    isConsistent: errorCount === 0,
    score,
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
