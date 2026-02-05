'use client';

import { useState } from 'react';
import { Users, Palette, Type, Layout, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

interface CompetitorDesign {
  name: string;
  url?: string;
  marketPosition?: string;
  design: {
    overallTone: string;
    colorScheme: {
      primary: string;
      secondary: string;
      accent: string;
    };
    typography: {
      headingFont: string;
      bodyFont: string;
      style: string;
    };
    visualStyle: string;
  };
  strengths?: string[];
  weaknesses?: string[];
}

interface CompetitorComparisonProps {
  selfName: string;
  selfDesign: {
    overallTone: string;
    colorScheme: {
      primary: string;
      secondary: string;
      accent: string;
    };
    typography: {
      headingFont: string;
      bodyFont: string;
    };
  };
  competitors: CompetitorDesign[];
}

export function CompetitorComparisonSection({
  selfName,
  selfDesign,
  competitors,
}: CompetitorComparisonProps) {
  const [expandedCompetitor, setExpandedCompetitor] = useState<number | null>(null);

  if (competitors.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Users className="text-emerald-600" size={20} />
        <h3 className="text-lg font-semibold text-slate-800">競合デザイン比較</h3>
      </div>

      {/* カラーパレット比較 */}
      <div>
        <h4 className="text-sm font-medium text-slate-600 mb-3 flex items-center gap-2">
          <Palette size={16} />
          カラーパレット比較
        </h4>
        <div className="space-y-2">
          {/* 自社 */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
            <span className="text-sm font-medium text-emerald-700 w-24">{selfName}</span>
            <div className="flex gap-1">
              <ColorBox color={selfDesign.colorScheme.primary} label="Primary" />
              <ColorBox color={selfDesign.colorScheme.secondary} label="Secondary" />
              <ColorBox color={selfDesign.colorScheme.accent} label="Accent" />
            </div>
            <span className="text-xs text-emerald-600 px-2 py-0.5 bg-emerald-100 rounded ml-auto">
              推奨
            </span>
          </div>

          {/* 競合 */}
          {competitors.map((comp, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200"
            >
              <span className="text-sm font-medium text-slate-700 w-24 truncate">
                {comp.name}
              </span>
              <div className="flex gap-1">
                <ColorBox color={comp.design.colorScheme.primary} label="Primary" />
                <ColorBox color={comp.design.colorScheme.secondary} label="Secondary" />
                <ColorBox color={comp.design.colorScheme.accent} label="Accent" />
              </div>
              {comp.marketPosition && (
                <span className="text-xs text-slate-500 px-2 py-0.5 bg-slate-200 rounded ml-auto">
                  {comp.marketPosition}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* タイポグラフィ比較 */}
      <div>
        <h4 className="text-sm font-medium text-slate-600 mb-3 flex items-center gap-2">
          <Type size={16} />
          フォント比較
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 px-3 text-slate-500 font-medium">サービス</th>
                <th className="text-left py-2 px-3 text-slate-500 font-medium">見出しフォント</th>
                <th className="text-left py-2 px-3 text-slate-500 font-medium">本文フォント</th>
                <th className="text-left py-2 px-3 text-slate-500 font-medium">スタイル</th>
              </tr>
            </thead>
            <tbody>
              {/* 自社 */}
              <tr className="bg-emerald-50 border-b border-emerald-200">
                <td className="py-2 px-3 font-medium text-emerald-700">{selfName}</td>
                <td className="py-2 px-3 text-slate-700">{selfDesign.typography.headingFont}</td>
                <td className="py-2 px-3 text-slate-700">{selfDesign.typography.bodyFont}</td>
                <td className="py-2 px-3">
                  <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded">
                    推奨
                  </span>
                </td>
              </tr>
              {/* 競合 */}
              {competitors.map((comp, index) => (
                <tr key={index} className="border-b border-slate-100">
                  <td className="py-2 px-3 font-medium text-slate-700">{comp.name}</td>
                  <td className="py-2 px-3 text-slate-600">{comp.design.typography.headingFont}</td>
                  <td className="py-2 px-3 text-slate-600">{comp.design.typography.bodyFont}</td>
                  <td className="py-2 px-3 text-slate-500">{comp.design.typography.style}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* デザイントーン比較 */}
      <div>
        <h4 className="text-sm font-medium text-slate-600 mb-3 flex items-center gap-2">
          <Layout size={16} />
          デザイントーン比較
        </h4>
        <div className="grid md:grid-cols-2 gap-3">
          {/* 自社 */}
          <div className="p-4 rounded-lg bg-emerald-50 border-2 border-emerald-300">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-emerald-700">{selfName}</span>
              <span className="text-xs bg-emerald-200 text-emerald-700 px-2 py-0.5 rounded">
                推奨
              </span>
            </div>
            <p className="text-sm text-slate-700">{selfDesign.overallTone}</p>
          </div>

          {/* 競合 */}
          {competitors.map((comp, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-slate-50 border border-slate-200"
            >
              <button
                onClick={() => setExpandedCompetitor(expandedCompetitor === index ? null : index)}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-700">{comp.name}</span>
                  {comp.url && (
                    <a
                      href={comp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
                {expandedCompetitor === index ? (
                  <ChevronUp className="text-slate-400" size={16} />
                ) : (
                  <ChevronDown className="text-slate-400" size={16} />
                )}
              </button>
              <p className="text-sm text-slate-600 mt-2">{comp.design.overallTone}</p>

              {expandedCompetitor === index && (
                <div className="mt-3 pt-3 border-t border-slate-200 space-y-2">
                  {comp.strengths && comp.strengths.length > 0 && (
                    <div>
                      <span className="text-xs text-emerald-600 font-medium">強み:</span>
                      <ul className="mt-1 space-y-0.5">
                        {comp.strengths.map((s, i) => (
                          <li key={i} className="text-xs text-slate-600 flex items-start gap-1">
                            <span className="text-emerald-500">+</span>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {comp.weaknesses && comp.weaknesses.length > 0 && (
                    <div>
                      <span className="text-xs text-red-600 font-medium">弱み:</span>
                      <ul className="mt-1 space-y-0.5">
                        {comp.weaknesses.map((w, i) => (
                          <li key={i} className="text-xs text-slate-600 flex items-start gap-1">
                            <span className="text-red-500">-</span>
                            {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <p className="text-xs text-slate-500 mt-2">
                    ビジュアルスタイル: {comp.design.visualStyle}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 差別化サマリー */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200">
        <h4 className="text-sm font-medium text-emerald-700 mb-2">差別化ポイント</h4>
        <p className="text-sm text-slate-700">
          競合{competitors.length}社と比較して、{selfName}は
          <strong className="text-emerald-700">
            独自のカラーパレットとタイポグラフィ
          </strong>
          で差別化を図ります。市場での視覚的なポジショニングを明確にし、
          ターゲットユーザーに対する訴求力を高めます。
        </p>
      </div>
    </div>
  );
}

// カラーボックスコンポーネント
function ColorBox({ color, label }: { color: string; label: string }) {
  return (
    <div className="group relative">
      <div
        className="w-8 h-8 rounded border border-slate-200 shadow-sm"
        style={{ backgroundColor: color }}
      />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-0.5 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {label}: {color}
      </div>
    </div>
  );
}
