'use client';

import { useState } from 'react';
import { Lightbulb, ChevronDown, ChevronUp, BarChart3, Brain, TestTube2 } from 'lucide-react';

interface Evidence {
  type: 'psychological' | 'data' | 'abtest' | 'best-practice';
  title: string;
  description: string;
  source?: string;
  impact?: string;
}

interface EvidencePanelProps {
  title?: string;
  evidences: Evidence[];
  defaultExpanded?: boolean;
}

export function EvidencePanel({
  title = 'この設計の根拠',
  evidences,
  defaultExpanded = false,
}: EvidencePanelProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  if (evidences.length === 0) return null;

  const getIcon = (type: Evidence['type']) => {
    switch (type) {
      case 'psychological':
        return <Brain className="text-purple-500" size={16} />;
      case 'data':
        return <BarChart3 className="text-blue-500" size={16} />;
      case 'abtest':
        return <TestTube2 className="text-emerald-500" size={16} />;
      case 'best-practice':
        return <Lightbulb className="text-amber-500" size={16} />;
    }
  };

  const getLabel = (type: Evidence['type']) => {
    switch (type) {
      case 'psychological':
        return '心理効果';
      case 'data':
        return 'データ根拠';
      case 'abtest':
        return 'ABテスト結果';
      case 'best-practice':
        return 'ベストプラクティス';
    }
  };

  const getBgColor = (type: Evidence['type']) => {
    switch (type) {
      case 'psychological':
        return 'bg-purple-50 border-purple-200';
      case 'data':
        return 'bg-blue-50 border-blue-200';
      case 'abtest':
        return 'bg-emerald-50 border-emerald-200';
      case 'best-practice':
        return 'bg-amber-50 border-amber-200';
    }
  };

  return (
    <div className="mt-4 rounded-lg border border-slate-200 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Lightbulb className="text-amber-500" size={18} />
          <span className="text-sm font-medium text-slate-700">{title}</span>
          <span className="text-xs text-slate-500">({evidences.length}件)</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="text-slate-400" size={18} />
        ) : (
          <ChevronDown className="text-slate-400" size={18} />
        )}
      </button>

      {isExpanded && (
        <div className="p-4 space-y-3">
          {evidences.map((evidence, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border ${getBgColor(evidence.type)}`}
            >
              <div className="flex items-start gap-2">
                <div className="mt-0.5">{getIcon(evidence.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-white/50">
                      {getLabel(evidence.type)}
                    </span>
                    <span className="text-sm font-medium text-slate-700">
                      {evidence.title}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{evidence.description}</p>
                  {evidence.impact && (
                    <div className="mt-2 flex items-center gap-1">
                      <span className="text-xs text-emerald-600 font-medium">
                        期待効果:
                      </span>
                      <span className="text-xs text-emerald-700">
                        {evidence.impact}
                      </span>
                    </div>
                  )}
                  {evidence.source && (
                    <div className="mt-1 text-xs text-slate-400">
                      出典: {evidence.source}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * 簡易的なエビデンスバッジ
 * セクション内の各要素に添付するために使用
 */
interface EvidenceBadgeProps {
  type: Evidence['type'];
  text: string;
  tooltip?: string;
}

export function EvidenceBadge({ type, text, tooltip }: EvidenceBadgeProps) {
  const bgColor = {
    psychological: 'bg-purple-100 text-purple-700',
    data: 'bg-blue-100 text-blue-700',
    abtest: 'bg-emerald-100 text-emerald-700',
    'best-practice': 'bg-amber-100 text-amber-700',
  }[type];

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded ${bgColor}`}
      title={tooltip}
    >
      {type === 'psychological' && <Brain size={10} />}
      {type === 'data' && <BarChart3 size={10} />}
      {type === 'abtest' && <TestTube2 size={10} />}
      {type === 'best-practice' && <Lightbulb size={10} />}
      {text}
    </span>
  );
}

/**
 * インラインエビデンス表示
 * テキストの横に小さく表示
 */
interface InlineEvidenceProps {
  rationale: string;
}

export function InlineEvidence({ rationale }: InlineEvidenceProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <span className="relative inline-block">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="ml-1 text-amber-500 hover:text-amber-600"
        title="根拠を表示"
      >
        <Lightbulb size={14} />
      </button>
      {isVisible && (
        <div className="absolute left-0 top-6 z-10 w-64 p-3 rounded-lg bg-amber-50 border border-amber-200 shadow-lg">
          <p className="text-xs text-amber-700">{rationale}</p>
          <button
            onClick={() => setIsVisible(false)}
            className="mt-2 text-xs text-amber-600 hover:underline"
          >
            閉じる
          </button>
        </div>
      )}
    </span>
  );
}
