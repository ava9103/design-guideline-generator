/**
 * PDF出力機能
 * 
 * デザインガイドラインをPDF形式でエクスポートします。
 * jsPDFを使用してクライアントサイドでPDFを生成します。
 */

import { jsPDF } from 'jspdf';
import type { DesignGuideline } from '@/types';

// 日本語フォント用の設定
const FONT_SIZE = {
  title: 24,
  sectionTitle: 16,
  subTitle: 14,
  body: 10,
  small: 8,
};

const COLORS = {
  primary: '#059669',
  text: '#1e293b',
  textSecondary: '#64748b',
  background: '#f8fafc',
  border: '#e2e8f0',
};

/**
 * デザインガイドラインをPDFとしてエクスポート
 */
export async function exportToPDF(guideline: DesignGuideline): Promise<Blob> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let currentY = margin;

  // ヘルパー関数
  const addNewPageIfNeeded = (requiredHeight: number) => {
    if (currentY + requiredHeight > pageHeight - margin) {
      doc.addPage();
      currentY = margin;
    }
  };

  const drawColorBox = (x: number, y: number, color: string, size: number = 8) => {
    doc.setFillColor(color);
    doc.rect(x, y, size, size, 'F');
    doc.setDrawColor(COLORS.border);
    doc.rect(x, y, size, size, 'S');
  };

  // タイトルページ
  doc.setFontSize(FONT_SIZE.title);
  doc.setTextColor(COLORS.text);
  doc.text(guideline.title, pageWidth / 2, 60, { align: 'center' });

  doc.setFontSize(FONT_SIZE.body);
  doc.setTextColor(COLORS.textSecondary);
  doc.text('Design Guideline', pageWidth / 2, 75, { align: 'center' });

  doc.setFontSize(FONT_SIZE.small);
  doc.text(
    `Generated: ${new Date(guideline.createdAt).toLocaleDateString('ja-JP')}`,
    pageWidth / 2,
    pageHeight - 30,
    { align: 'center' }
  );

  // 第1層：デザインゴール
  doc.addPage();
  currentY = margin;

  doc.setFontSize(FONT_SIZE.sectionTitle);
  doc.setTextColor(COLORS.primary);
  doc.text('1. Design Goals', margin, currentY);
  currentY += 15;

  // 印象キーワード
  doc.setFontSize(FONT_SIZE.subTitle);
  doc.setTextColor(COLORS.text);
  doc.text('Impression Keywords', margin, currentY);
  currentY += 8;

  doc.setFontSize(FONT_SIZE.body);
  doc.setTextColor(COLORS.textSecondary);
  const keywords = guideline.layer1Goals.impressionKeywords.join(' / ');
  const keywordLines = doc.splitTextToSize(keywords, contentWidth);
  doc.text(keywordLines, margin, currentY);
  currentY += keywordLines.length * 5 + 10;

  // 差別化ポイント
  addNewPageIfNeeded(40);
  doc.setFontSize(FONT_SIZE.subTitle);
  doc.setTextColor(COLORS.text);
  doc.text('Differentiation Points', margin, currentY);
  currentY += 8;

  doc.setFontSize(FONT_SIZE.body);
  for (const point of guideline.layer1Goals.differentiationPoints) {
    addNewPageIfNeeded(15);
    doc.setTextColor(COLORS.text);
    doc.text(`• ${point.title}`, margin + 5, currentY);
    currentY += 5;
    doc.setTextColor(COLORS.textSecondary);
    const reasonLines = doc.splitTextToSize(point.reason, contentWidth - 10);
    doc.text(reasonLines, margin + 10, currentY);
    currentY += reasonLines.length * 4 + 5;
  }

  // 第2層：デザインコンセプト
  doc.addPage();
  currentY = margin;

  doc.setFontSize(FONT_SIZE.sectionTitle);
  doc.setTextColor(COLORS.primary);
  doc.text('2. Design Concept', margin, currentY);
  currentY += 15;

  // コンセプトステートメント
  doc.setFontSize(FONT_SIZE.subTitle);
  doc.setTextColor(COLORS.text);
  doc.text('Concept Statement', margin, currentY);
  currentY += 8;

  doc.setFontSize(FONT_SIZE.body);
  doc.setTextColor(COLORS.textSecondary);
  const statementLines = doc.splitTextToSize(guideline.layer2Concept.statement, contentWidth);
  doc.text(statementLines, margin, currentY);
  currentY += statementLines.length * 5 + 10;

  // デザイン原則
  addNewPageIfNeeded(40);
  doc.setFontSize(FONT_SIZE.subTitle);
  doc.setTextColor(COLORS.text);
  doc.text('Design Principles', margin, currentY);
  currentY += 8;

  for (const principle of guideline.layer2Concept.principles) {
    addNewPageIfNeeded(15);
    doc.setFontSize(FONT_SIZE.body);
    doc.setTextColor(COLORS.text);
    doc.text(`• ${principle.title}`, margin + 5, currentY);
    currentY += 5;
    doc.setTextColor(COLORS.textSecondary);
    const reasonLines = doc.splitTextToSize(principle.reason, contentWidth - 10);
    doc.text(reasonLines, margin + 10, currentY);
    currentY += reasonLines.length * 4 + 5;
  }

  // 第3層：カラーガイドライン
  doc.addPage();
  currentY = margin;

  doc.setFontSize(FONT_SIZE.sectionTitle);
  doc.setTextColor(COLORS.primary);
  doc.text('3. Color Guidelines', margin, currentY);
  currentY += 15;

  const colors = guideline.layer3Guidelines.color;

  // メインカラー
  doc.setFontSize(FONT_SIZE.subTitle);
  doc.setTextColor(COLORS.text);
  doc.text('Main Color', margin, currentY);
  currentY += 8;

  drawColorBox(margin, currentY, colors.mainColor.hex, 12);
  doc.setFontSize(FONT_SIZE.body);
  doc.setTextColor(COLORS.text);
  doc.text(`${colors.mainColor.name} (${colors.mainColor.hex})`, margin + 18, currentY + 4);
  doc.setTextColor(COLORS.textSecondary);
  doc.text(`Ratio: ${colors.mainColor.ratio}`, margin + 18, currentY + 9);
  currentY += 20;

  // サブカラー
  doc.setFontSize(FONT_SIZE.subTitle);
  doc.setTextColor(COLORS.text);
  doc.text('Sub Color', margin, currentY);
  currentY += 8;

  drawColorBox(margin, currentY, colors.subColor.hex, 12);
  doc.setFontSize(FONT_SIZE.body);
  doc.setTextColor(COLORS.text);
  doc.text(`${colors.subColor.name} (${colors.subColor.hex})`, margin + 18, currentY + 4);
  doc.setTextColor(COLORS.textSecondary);
  doc.text(`Ratio: ${colors.subColor.ratio}`, margin + 18, currentY + 9);
  currentY += 20;

  // アクセントカラー
  doc.setFontSize(FONT_SIZE.subTitle);
  doc.setTextColor(COLORS.text);
  doc.text('Accent Color', margin, currentY);
  currentY += 8;

  drawColorBox(margin, currentY, colors.accentColor.hex, 12);
  doc.setFontSize(FONT_SIZE.body);
  doc.setTextColor(COLORS.text);
  doc.text(`${colors.accentColor.name} (${colors.accentColor.hex})`, margin + 18, currentY + 4);
  doc.setTextColor(COLORS.textSecondary);
  doc.text(`Ratio: ${colors.accentColor.ratio}`, margin + 18, currentY + 9);
  currentY += 20;

  // 第3層：タイポグラフィ
  doc.addPage();
  currentY = margin;

  doc.setFontSize(FONT_SIZE.sectionTitle);
  doc.setTextColor(COLORS.primary);
  doc.text('4. Typography Guidelines', margin, currentY);
  currentY += 15;

  const typography = guideline.layer3Guidelines.typography;

  // メインフォント
  doc.setFontSize(FONT_SIZE.subTitle);
  doc.setTextColor(COLORS.text);
  doc.text('Main Font', margin, currentY);
  currentY += 8;

  doc.setFontSize(FONT_SIZE.body);
  doc.setTextColor(COLORS.text);
  doc.text(`Japanese: ${typography.mainFont.japanese.name}`, margin + 5, currentY);
  currentY += 5;
  doc.setTextColor(COLORS.textSecondary);
  const jpReasonLines = doc.splitTextToSize(typography.mainFont.japanese.reason, contentWidth - 10);
  doc.text(jpReasonLines, margin + 5, currentY);
  currentY += jpReasonLines.length * 4 + 5;

  doc.setTextColor(COLORS.text);
  doc.text(`Western: ${typography.mainFont.western.name}`, margin + 5, currentY);
  currentY += 5;
  doc.setTextColor(COLORS.textSecondary);
  const enReasonLines = doc.splitTextToSize(typography.mainFont.western.reason, contentWidth - 10);
  doc.text(enReasonLines, margin + 5, currentY);
  currentY += enReasonLines.length * 4 + 15;

  // フッター
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(FONT_SIZE.small);
    doc.setTextColor(COLORS.textSecondary);
    doc.text(
      `${guideline.title} - Page ${i}/${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  return doc.output('blob');
}

/**
 * PDFをダウンロード
 */
export async function downloadPDF(guideline: DesignGuideline): Promise<void> {
  const blob = await exportToPDF(guideline);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${guideline.title.replace(/[^a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, '_')}_guideline.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
