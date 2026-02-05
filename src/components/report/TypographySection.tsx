'use client';

import { ExternalLink } from 'lucide-react';
import type { TypographyGuideline } from '@/types';
import { EvidencePanel } from './EvidencePanel';

interface Props {
  typography: TypographyGuideline;
}

export function TypographySection({ typography }: Props) {
  // フォント名を結合（和文, 欧文）
  const headingFont = `${typography.mainFont.japanese.name}, ${typography.mainFont.western.name}`;
  const bodyFont = `${typography.subFont.japanese.name}, ${typography.subFont.western.name}`;

  // 選定理由をまとめる（長文化を避けるため、メインの理由のみ）
  const fontRationale = typography.mainFont.japanese.reason;

  return (
    <div className="space-y-8">
      {/* フォント表示（シンプル化） */}
      <div className="space-y-4">
        <div>
          <span className="text-sm text-slate-500">見出しフォント</span>
          <div className="text-xl font-bold text-slate-800 mt-1">{headingFont}</div>
        </div>
        <div>
          <span className="text-sm text-slate-500">本文フォント</span>
          <div className="text-xl font-bold text-slate-800 mt-1">{bodyFont}</div>
        </div>
        {typography.numberFont && (
          <div>
            <span className="text-sm text-slate-500">数字強調用</span>
            <div className="text-xl font-bold text-slate-800 mt-1">{typography.numberFont.name}</div>
          </div>
        )}
        
        {/* フォントリンク */}
        <div className="flex flex-wrap gap-3 mt-2">
          {typography.mainFont.japanese.googleFontsUrl && (
            <a
              href={typography.mainFont.japanese.googleFontsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Google Fonts <ExternalLink size={12} />
            </a>
          )}
          {typography.mainFont.japanese.adobeFontsUrl && (
            <a
              href={typography.mainFont.japanese.adobeFontsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1"
            >
              Adobe Fonts <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>

      {/* サイズスケール */}
      <div>
        <h3 className="text-sm font-medium text-slate-600 mb-3">サイズスケール</h3>
        <div className="space-y-2 bg-slate-50 rounded-lg p-4 border border-slate-200">
          {typography.sizeSystem.map((row, index) => (
            <div key={index} className="flex justify-between text-sm py-1 border-b border-slate-100 last:border-0">
              <span className="text-slate-700">{row.element}</span>
              <span className="text-slate-500 font-mono">{row.pc}/{row.lineHeight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 書体について（簡潔な説明を1箇所に集約） */}
      {fontRationale && (
        <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">書体について</h4>
          <p className="text-sm text-slate-700 leading-relaxed">
            {fontRationale}
          </p>
        </div>
      )}

      {/* タイポグラフィ設計エビデンス */}
      <EvidencePanel
        title="タイポグラフィ設計の根拠"
        evidences={[
          {
            type: 'data',
            title: 'スマホ本文サイズ',
            description: 'スマホで24pt（16px）未満の文字は離脱率が23%上昇。小さい文字は「読むのが面倒」という認知負荷を増大させます。',
            impact: '離脱率 -23%',
          },
          {
            type: 'psychological',
            title: 'ジャンプ率の効果',
            description: 'ジャンプ率が高いデザインはスクロール率15%向上。視覚的なメリハリが「重要な情報がある」というシグナルを送ります。',
            impact: 'スクロール率 +15%',
          },
          {
            type: 'abtest',
            title: 'カーニング調整',
            description: 'カーニング調整済みの見出しは信頼性スコアが18%向上。文字間の自然さが「プロフェッショナル」な印象を与えます。',
            impact: '信頼性 +18%',
          },
        ]}
      />
    </div>
  );
}
