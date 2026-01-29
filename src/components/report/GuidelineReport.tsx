'use client';

import { useState } from 'react';
import { FileText, Presentation, Link, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import type { DesignGuideline } from '@/types';
import { GoalsSection } from './GoalsSection';
import { ConceptSection } from './ConceptSection';
import { TypographySection } from './TypographySection';
import { ColorSection } from './ColorSection';
import { VisualSection } from './VisualSection';
import { ReferencesSection } from './ReferencesSection';

interface Props {
  guideline: DesignGuideline;
}

export function GuidelineReport({ guideline }: Props) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    goals: true,
    concept: true,
    typography: true,
    color: true,
    visual: true,
    references: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleExportPDF = () => {
    // PDF出力機能（将来実装）
    alert('PDF出力機能は準備中です');
  };

  const handleExportPPTX = () => {
    // PowerPoint出力機能（将来実装）
    alert('PowerPoint出力機能は準備中です');
  };

  const handleShare = () => {
    // 共有機能（将来実装）
    alert('共有機能は準備中です');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* ヘッダー */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              デザインガイドライン
            </h1>
            <p className="text-slate-400">{guideline.title}</p>
          </div>

          {/* エクスポートボタン */}
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={handleExportPDF}>
              <FileText size={16} className="mr-1" />
              PDF
            </Button>
            <Button variant="secondary" size="sm" onClick={handleExportPPTX}>
              <Presentation size={16} className="mr-1" />
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

        {/* 第3層：デザインガイドライン - タイポグラフィ */}
        <ReportSection
          title="第3層：フォントガイド"
          icon="🔤"
          isExpanded={expandedSections.typography}
          onToggle={() => toggleSection('typography')}
        >
          <TypographySection typography={guideline.layer3Guidelines.typography} />
        </ReportSection>

        {/* 第3層：デザインガイドライン - カラー */}
        <ReportSection
          title="第3層：カラーガイド"
          icon="🎨"
          isExpanded={expandedSections.color}
          onToggle={() => toggleSection('color')}
        >
          <ColorSection color={guideline.layer3Guidelines.color} />
        </ReportSection>

        {/* 第3層：デザインガイドライン - ビジュアル */}
        <ReportSection
          title="第3層：ビジュアルガイド"
          icon="📸"
          isExpanded={expandedSections.visual}
          onToggle={() => toggleSection('visual')}
        >
          <VisualSection visual={guideline.layer3Guidelines.visual} />
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
        className="w-full flex items-center justify-between p-4 hover:bg-slate-700/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        {isExpanded ? (
          <ChevronUp className="text-slate-400" size={24} />
        ) : (
          <ChevronDown className="text-slate-400" size={24} />
        )}
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 border-t border-slate-700">
          <div className="pt-4">{children}</div>
        </div>
      )}
    </Card>
  );
}
