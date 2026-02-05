'use client';

import { useState } from 'react';
import { FileText, Presentation, Link, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import type { DesignGuideline } from '@/types';
import { GoalsSection } from './GoalsSection';
import { ConceptSection } from './ConceptSection';
import { TypographySection } from './TypographySection';
import { ColorSection } from './ColorSection';
import { VisualSection } from './VisualSection';
import { ReferencesSection } from './ReferencesSection';
import { downloadPDF } from '@/lib/export/pdf-generator';
import { downloadPPTX } from '@/lib/export/pptx-generator';

interface Props {
  guideline: DesignGuideline;
}

export function GuidelineReport({ guideline }: Props) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    goals: true,
    concept: true,
    typography: true,
    references: true,
  });
  const [isExporting, setIsExporting] = useState<'pdf' | 'pptx' | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleExportPDF = async () => {
    try {
      setIsExporting('pdf');
      await downloadPDF(guideline);
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('PDFの出力に失敗しました。');
    } finally {
      setIsExporting(null);
    }
  };

  const handleExportPPTX = async () => {
    try {
      setIsExporting('pptx');
      await downloadPPTX(guideline);
    } catch (error) {
      console.error('PPTX export failed:', error);
      alert('PowerPointの出力に失敗しました。');
    } finally {
      setIsExporting(null);
    }
  };

  const handleShare = () => {
    // 共有機能はpage.tsxで実装済み
    const shareEvent = new CustomEvent('openShareModal');
    window.dispatchEvent(shareEvent);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* ヘッダー */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              {guideline.title}
            </h1>
            <p className="text-slate-600">デザインガイドライン</p>
          </div>

          {/* エクスポートボタン */}
          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={handleExportPDF}
              disabled={isExporting !== null}
            >
              {isExporting === 'pdf' ? (
                <Loader2 size={16} className="mr-1 animate-spin" />
              ) : (
                <FileText size={16} className="mr-1" />
              )}
              PDF
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={handleExportPPTX}
              disabled={isExporting !== null}
            >
              {isExporting === 'pptx' ? (
                <Loader2 size={16} className="mr-1 animate-spin" />
              ) : (
                <Presentation size={16} className="mr-1" />
              )}
              PPTX
            </Button>
            <Button variant="primary" size="sm" onClick={handleShare}>
              <Link size={16} className="mr-1" />
              共有
            </Button>
          </div>
        </div>

        {/* 生成日時 */}
        <p className="text-sm text-slate-500">
          生成日時: {new Date(guideline.createdAt).toLocaleString('ja-JP')}
        </p>
      </div>

      {/* レポート本体 */}
      <div className="space-y-6">
        {/* 第1層：デザインゴール */}
        <ReportSection
          title="第1層：デザインで達成すべきゴール"
          icon="🎯"
          isExpanded={expandedSections.goals}
          onToggle={() => toggleSection('goals')}
        >
          <GoalsSection goals={guideline.layer1Goals} />
        </ReportSection>

        {/* 第2層：デザインコンセプト */}
        <ReportSection
          title="第2層：デザインコンセプト"
          icon="💡"
          isExpanded={expandedSections.concept}
          onToggle={() => toggleSection('concept')}
        >
          <ConceptSection concept={guideline.layer2Concept} />
        </ReportSection>

        {/* 第3層：デザインガイドライン（統合） */}
        <ReportSection
          title="第3層：デザインガイドライン"
          icon="🎨"
          isExpanded={expandedSections.typography}
          onToggle={() => toggleSection('typography')}
        >
          <div className="space-y-10">
            {/* カラー */}
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span>🎨</span> カラー
              </h3>
              <ColorSection color={guideline.layer3Guidelines.color} />
            </div>

            {/* タイポグラフィ */}
            <div className="border-t border-slate-200 pt-10">
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span>🔤</span> フォント
              </h3>
              <TypographySection typography={guideline.layer3Guidelines.typography} />
            </div>

            {/* ビジュアル */}
            <div className="border-t border-slate-200 pt-10">
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span>📸</span> ビジュアル
              </h3>
              <VisualSection visual={guideline.layer3Guidelines.visual} />
            </div>

          </div>
        </ReportSection>

        {/* 参考実例 */}
        <ReportSection
          title="参考実例"
          icon="📚"
          isExpanded={expandedSections.references}
          onToggle={() => toggleSection('references')}
        >
          <ReferencesSection references={guideline.references} />
        </ReportSection>
      </div>
    </div>
  );
}

// セクションコンポーネント
interface ReportSectionProps {
  title: string;
  icon: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function ReportSection({
  title,
  icon,
  isExpanded,
  onToggle,
  children,
}: ReportSectionProps) {
  return (
    <Card className="overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
        </div>
        {isExpanded ? (
          <ChevronUp className="text-slate-500" size={24} />
        ) : (
          <ChevronDown className="text-slate-500" size={24} />
        )}
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 border-t border-slate-200">
          <div className="pt-4">{children}</div>
        </div>
      )}
    </Card>
  );
}
