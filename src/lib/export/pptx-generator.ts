/**
 * PowerPoint出力機能
 * 
 * デザインガイドラインをPowerPoint形式でエクスポートします。
 * pptxgenjsを使用してクライアントサイドでPPTXを生成します。
 */

import PptxGenJS from 'pptxgenjs';
import type { DesignGuideline } from '@/types';

// スライドのスタイル設定
const COLORS = {
  primary: '059669',
  primaryDark: '047857',
  text: '1e293b',
  textSecondary: '64748b',
  background: 'FFFFFF',
  backgroundAlt: 'f8fafc',
  white: 'FFFFFF',
};

const FONT = {
  title: 'Noto Sans JP',
  body: 'Noto Sans JP',
};

/**
 * デザインガイドラインをPowerPointとしてエクスポート
 */
export async function exportToPPTX(guideline: DesignGuideline): Promise<Blob> {
  const pptx = new PptxGenJS();

  // プレゼンテーション設定
  pptx.author = 'Design Guideline Generator';
  pptx.title = guideline.title;
  pptx.subject = 'Design Guideline';

  // マスタースライドの設定
  pptx.defineSlideMaster({
    title: 'MASTER_SLIDE',
    background: { color: COLORS.background },
  });

  // タイトルスライド
  const titleSlide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
  
  // 背景グラデーション風
  titleSlide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: '100%',
    h: '40%',
    fill: { color: COLORS.primary },
  });

  titleSlide.addText(guideline.title, {
    x: 0.5,
    y: 1.5,
    w: 9,
    h: 1.5,
    fontSize: 36,
    fontFace: FONT.title,
    color: COLORS.white,
    bold: true,
  });

  titleSlide.addText('Design Guideline', {
    x: 0.5,
    y: 3.2,
    w: 9,
    fontSize: 18,
    fontFace: FONT.body,
    color: COLORS.textSecondary,
  });

  titleSlide.addText(`Generated: ${new Date(guideline.createdAt).toLocaleDateString('ja-JP')}`, {
    x: 0.5,
    y: 5,
    w: 9,
    fontSize: 12,
    fontFace: FONT.body,
    color: COLORS.textSecondary,
  });

  // 目次スライド
  const tocSlide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
  addSectionHeader(tocSlide, 'Contents');

  const tocItems = [
    '1. Design Goals（デザインゴール）',
    '2. Design Concept（デザインコンセプト）',
    '3. Color Guidelines（カラーガイドライン）',
    '4. Typography（タイポグラフィ）',
    '5. Visual Guidelines（ビジュアルガイドライン）',
    '6. References（参考実例）',
  ];

  tocSlide.addText(
    tocItems.map((item, i) => ({
      text: item,
      options: {
        fontSize: 18,
        fontFace: FONT.body,
        color: COLORS.text,
        bullet: false,
        breakLine: true,
        paraSpaceBefore: i === 0 ? 0 : 10,
      },
    })),
    {
      x: 0.5,
      y: 1.5,
      w: 9,
      h: 4,
    }
  );

  // 第1層：デザインゴール
  const goalsSlide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
  addSectionHeader(goalsSlide, '1. Design Goals');

  // 印象キーワード
  goalsSlide.addText('Impression Keywords', {
    x: 0.5,
    y: 1.3,
    w: 9,
    fontSize: 14,
    fontFace: FONT.body,
    color: COLORS.primary,
    bold: true,
  });

  goalsSlide.addText(guideline.layer1Goals.impressionKeywords.join('  |  '), {
    x: 0.5,
    y: 1.7,
    w: 9,
    fontSize: 20,
    fontFace: FONT.body,
    color: COLORS.text,
    bold: true,
  });

  // 差別化ポイント
  goalsSlide.addText('Differentiation Points', {
    x: 0.5,
    y: 2.5,
    w: 9,
    fontSize: 14,
    fontFace: FONT.body,
    color: COLORS.primary,
    bold: true,
  });

  const diffPoints = guideline.layer1Goals.differentiationPoints.map((point) => ({
    text: `${point.title}\n`,
    options: {
      fontSize: 14,
      fontFace: FONT.body,
      color: COLORS.text,
      bold: true,
      bullet: { type: 'bullet' as const },
    },
  }));

  goalsSlide.addText(diffPoints, {
    x: 0.5,
    y: 2.9,
    w: 9,
    h: 2.5,
  });

  // 第2層：デザインコンセプト
  const conceptSlide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
  addSectionHeader(conceptSlide, '2. Design Concept');

  conceptSlide.addText('Concept Statement', {
    x: 0.5,
    y: 1.3,
    w: 9,
    fontSize: 14,
    fontFace: FONT.body,
    color: COLORS.primary,
    bold: true,
  });

  conceptSlide.addShape(pptx.ShapeType.rect, {
    x: 0.5,
    y: 1.6,
    w: 9,
    h: 1.2,
    fill: { color: COLORS.backgroundAlt },
    line: { color: COLORS.primary, width: 2 },
  });

  conceptSlide.addText(guideline.layer2Concept.statement, {
    x: 0.7,
    y: 1.7,
    w: 8.6,
    h: 1,
    fontSize: 16,
    fontFace: FONT.body,
    color: COLORS.text,
    valign: 'middle',
  });

  // デザイン原則
  conceptSlide.addText('Design Principles', {
    x: 0.5,
    y: 3.0,
    w: 9,
    fontSize: 14,
    fontFace: FONT.body,
    color: COLORS.primary,
    bold: true,
  });

  const principles = guideline.layer2Concept.principles.map((p) => ({
    text: `${p.title}: ${p.reason}\n`,
    options: {
      fontSize: 12,
      fontFace: FONT.body,
      color: COLORS.text,
      bullet: { type: 'bullet' as const },
    },
  }));

  conceptSlide.addText(principles, {
    x: 0.5,
    y: 3.4,
    w: 9,
    h: 2,
  });

  // 第3層：カラーガイドライン
  const colorSlide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
  addSectionHeader(colorSlide, '3. Color Guidelines');

  const colors = guideline.layer3Guidelines.color;

  // カラーパレット
  const colorBoxY = 1.5;
  const colorBoxSize = 1;
  const colorGap = 0.3;

  // メインカラー
  colorSlide.addShape(pptx.ShapeType.rect, {
    x: 0.5,
    y: colorBoxY,
    w: colorBoxSize,
    h: colorBoxSize,
    fill: { color: colors.mainColor.hex.replace('#', '') },
    line: { color: 'e2e8f0', width: 1 },
  });
  colorSlide.addText(`Main Color\n${colors.mainColor.name}\n${colors.mainColor.hex}\n${colors.mainColor.ratio}`, {
    x: 0.5,
    y: colorBoxY + colorBoxSize + 0.1,
    w: 2,
    fontSize: 10,
    fontFace: FONT.body,
    color: COLORS.text,
    align: 'left',
  });

  // サブカラー
  colorSlide.addShape(pptx.ShapeType.rect, {
    x: 0.5 + colorBoxSize + colorGap + 1.5,
    y: colorBoxY,
    w: colorBoxSize,
    h: colorBoxSize,
    fill: { color: colors.subColor.hex.replace('#', '') },
    line: { color: 'e2e8f0', width: 1 },
  });
  colorSlide.addText(`Sub Color\n${colors.subColor.name}\n${colors.subColor.hex}\n${colors.subColor.ratio}`, {
    x: 0.5 + colorBoxSize + colorGap + 1.5,
    y: colorBoxY + colorBoxSize + 0.1,
    w: 2,
    fontSize: 10,
    fontFace: FONT.body,
    color: COLORS.text,
    align: 'left',
  });

  // アクセントカラー
  colorSlide.addShape(pptx.ShapeType.rect, {
    x: 0.5 + (colorBoxSize + colorGap + 1.5) * 2,
    y: colorBoxY,
    w: colorBoxSize,
    h: colorBoxSize,
    fill: { color: colors.accentColor.hex.replace('#', '') },
    line: { color: 'e2e8f0', width: 1 },
  });
  colorSlide.addText(`Accent Color\n${colors.accentColor.name}\n${colors.accentColor.hex}\n${colors.accentColor.ratio}`, {
    x: 0.5 + (colorBoxSize + colorGap + 1.5) * 2,
    y: colorBoxY + colorBoxSize + 0.1,
    w: 2,
    fontSize: 10,
    fontFace: FONT.body,
    color: COLORS.text,
    align: 'left',
  });

  // 心理効果
  colorSlide.addText('Psychological Effects', {
    x: 0.5,
    y: 3.5,
    w: 9,
    fontSize: 14,
    fontFace: FONT.body,
    color: COLORS.primary,
    bold: true,
  });

  colorSlide.addText(
    `• Main: ${colors.mainColor.psychologicalEffect}\n• Sub: ${colors.subColor.psychologicalEffect}\n• Accent: ${colors.accentColor.psychologicalEffect}`,
    {
      x: 0.5,
      y: 3.9,
      w: 9,
      fontSize: 11,
      fontFace: FONT.body,
      color: COLORS.text,
    }
  );

  // 第3層：タイポグラフィ
  const typographySlide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
  addSectionHeader(typographySlide, '4. Typography');

  const typography = guideline.layer3Guidelines.typography;

  // メインフォント
  typographySlide.addText('Main Font', {
    x: 0.5,
    y: 1.3,
    w: 4,
    fontSize: 14,
    fontFace: FONT.body,
    color: COLORS.primary,
    bold: true,
  });

  typographySlide.addText(
    `Japanese: ${typography.mainFont.japanese.name}\n${typography.mainFont.japanese.reason}`,
    {
      x: 0.5,
      y: 1.7,
      w: 4.2,
      fontSize: 11,
      fontFace: FONT.body,
      color: COLORS.text,
    }
  );

  typographySlide.addText(
    `Western: ${typography.mainFont.western.name}\n${typography.mainFont.western.reason}`,
    {
      x: 0.5,
      y: 2.5,
      w: 4.2,
      fontSize: 11,
      fontFace: FONT.body,
      color: COLORS.text,
    }
  );

  // サブフォント
  typographySlide.addText('Sub Font', {
    x: 5,
    y: 1.3,
    w: 4,
    fontSize: 14,
    fontFace: FONT.body,
    color: COLORS.primary,
    bold: true,
  });

  typographySlide.addText(
    `Japanese: ${typography.subFont.japanese.name}\n${typography.subFont.japanese.reason}`,
    {
      x: 5,
      y: 1.7,
      w: 4.5,
      fontSize: 11,
      fontFace: FONT.body,
      color: COLORS.text,
    }
  );

  // フォントサイズシステム
  typographySlide.addText('Size System', {
    x: 0.5,
    y: 3.5,
    w: 9,
    fontSize: 14,
    fontFace: FONT.body,
    color: COLORS.primary,
    bold: true,
  });

  const sizeData = typography.sizeSystem.slice(0, 5).map((s) => [
    s.element,
    s.pc,
    s.sp,
    s.lineHeight,
  ]);

  typographySlide.addTable(
    [['Element', 'PC', 'SP', 'Line Height'], ...sizeData],
    {
      x: 0.5,
      y: 3.9,
      w: 9,
      fontSize: 10,
      fontFace: FONT.body,
      color: COLORS.text,
      border: { type: 'solid', color: 'e2e8f0', pt: 0.5 },
      fill: { color: COLORS.backgroundAlt },
    }
  );

  // 第3層：ビジュアルガイドライン
  const visualSlide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
  addSectionHeader(visualSlide, '5. Visual Guidelines');

  const visual = guideline.layer3Guidelines.visual;

  // 写真ガイド
  visualSlide.addText('Photo Guidelines', {
    x: 0.5,
    y: 1.3,
    w: 4.2,
    fontSize: 14,
    fontFace: FONT.body,
    color: COLORS.primary,
    bold: true,
  });

  visualSlide.addText(
    `Tone: ${visual.photo.tone}\nBrightness: ${visual.photo.brightness}\nSaturation: ${visual.photo.saturation}\nColor Temperature: ${visual.photo.colorTemperature}`,
    {
      x: 0.5,
      y: 1.7,
      w: 4.2,
      fontSize: 11,
      fontFace: FONT.body,
      color: COLORS.text,
    }
  );

  // イラストガイド
  visualSlide.addText('Illustration Guidelines', {
    x: 5,
    y: 1.3,
    w: 4.5,
    fontSize: 14,
    fontFace: FONT.body,
    color: COLORS.primary,
    bold: true,
  });

  visualSlide.addText(
    `Style: ${visual.illustration.style}\nTone: ${visual.illustration.tone}\nColor Count: ${visual.illustration.colorCount}\nLine Weight: ${visual.illustration.lineWeight}`,
    {
      x: 5,
      y: 1.7,
      w: 4.5,
      fontSize: 11,
      fontFace: FONT.body,
      color: COLORS.text,
    }
  );

  // 推奨被写体
  visualSlide.addText('Recommended Subjects', {
    x: 0.5,
    y: 3.3,
    w: 9,
    fontSize: 12,
    fontFace: FONT.body,
    color: COLORS.primary,
    bold: true,
  });

  visualSlide.addText(visual.photo.subjects.join(' / '), {
    x: 0.5,
    y: 3.7,
    w: 9,
    fontSize: 11,
    fontFace: FONT.body,
    color: COLORS.text,
  });

  // 参考実例スライド
  const referencesSlide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
  addSectionHeader(referencesSlide, '6. References');

  if (guideline.references.postscapeWorks.length > 0) {
    referencesSlide.addText('Similar Works', {
      x: 0.5,
      y: 1.3,
      w: 9,
      fontSize: 14,
      fontFace: FONT.body,
      color: COLORS.primary,
      bold: true,
    });

    const worksText = guideline.references.postscapeWorks
      .slice(0, 5)
      .map((w) => `• ${w.title}\n  ${w.url}`)
      .join('\n\n');

    referencesSlide.addText(worksText, {
      x: 0.5,
      y: 1.7,
      w: 9,
      fontSize: 10,
      fontFace: FONT.body,
      color: COLORS.text,
    });
  }

  // 終了スライド
  const endSlide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
  
  endSlide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: '100%',
    h: '100%',
    fill: { color: COLORS.primary },
  });

  endSlide.addText('Thank You', {
    x: 0,
    y: 2,
    w: '100%',
    fontSize: 48,
    fontFace: FONT.title,
    color: COLORS.white,
    bold: true,
    align: 'center',
  });

  endSlide.addText('Generated by Design Guideline Generator', {
    x: 0,
    y: 3.5,
    w: '100%',
    fontSize: 14,
    fontFace: FONT.body,
    color: COLORS.white,
    align: 'center',
  });

  // Blobとして出力
  const data = await pptx.write({ outputType: 'blob' });
  return data as Blob;
}

/**
 * セクションヘッダーを追加
 */
function addSectionHeader(slide: PptxGenJS.Slide, title: string): void {
  slide.addShape('rect', {
    x: 0,
    y: 0,
    w: '100%',
    h: 1,
    fill: { color: COLORS.primary },
  });

  slide.addText(title, {
    x: 0.5,
    y: 0.3,
    w: 9,
    fontSize: 24,
    fontFace: FONT.title,
    color: COLORS.white,
    bold: true,
  });
}

/**
 * PowerPointをダウンロード
 */
export async function downloadPPTX(guideline: DesignGuideline): Promise<void> {
  const blob = await exportToPPTX(guideline);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${guideline.title.replace(/[^a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, '_')}_guideline.pptx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
