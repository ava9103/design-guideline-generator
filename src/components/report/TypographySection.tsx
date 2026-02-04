'use client';

import { ExternalLink } from 'lucide-react';
import type { TypographyGuideline } from '@/types';

interface Props {
  typography: TypographyGuideline;
}

export function TypographySection({ typography }: Props) {
  return (
    <div className="space-y-8">
      {/* メインフォント */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">
          メインフォント（見出し用）
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {/* 和文 */}
          <div className="p-4 rounded-lg bg-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">和文</span>
              <div className="flex gap-2">
                {typography.mainFont.japanese.googleFontsUrl && (
                  <a
                    href={typography.mainFont.japanese.googleFontsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    Google Fonts <ExternalLink size={12} />
                  </a>
                )}
                {typography.mainFont.japanese.adobeFontsUrl && (
                  <a
                    href={typography.mainFont.japanese.adobeFontsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  >
                    Adobe Fonts <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
            <h4 className="text-xl font-bold text-white mb-2">
              {typography.mainFont.japanese.name}
            </h4>
            <p className="text-sm text-slate-400 mb-3">
              {typography.mainFont.japanese.reason}
            </p>
            {typography.mainFont.japanese.weights && (
              <div className="space-y-1">
                {typography.mainFont.japanese.weights.map((w, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-slate-400">{w.use}</span>
                    <span className="text-slate-300">{w.weight}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 欧文 */}
          <div className="p-4 rounded-lg bg-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">欧文</span>
              {typography.mainFont.western.googleFontsUrl && (
                <a
                  href={typography.mainFont.western.googleFontsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  Google Fonts <ExternalLink size={12} />
                </a>
              )}
            </div>
            <h4 className="text-xl font-bold text-white mb-2">
              {typography.mainFont.western.name}
            </h4>
            <p className="text-sm text-slate-400">
              {typography.mainFont.western.reason}
            </p>
          </div>
        </div>
      </div>

      {/* サブフォント */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">
          サブフォント（本文用）
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {/* 和文 */}
          <div className="p-4 rounded-lg bg-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">和文</span>
              {typography.subFont.japanese.googleFontsUrl && (
                <a
                  href={typography.subFont.japanese.googleFontsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  Google Fonts <ExternalLink size={12} />
                </a>
              )}
            </div>
            <h4 className="text-xl font-bold text-white mb-2">
              {typography.subFont.japanese.name}
            </h4>
            <p className="text-sm text-slate-400">
              {typography.subFont.japanese.reason}
            </p>
          </div>

          {/* 欧文 */}
          <div className="p-4 rounded-lg bg-slate-700/50">
            <span className="text-sm text-slate-400">欧文</span>
            <h4 className="text-xl font-bold text-white mb-2 mt-2">
              {typography.subFont.western.name}
            </h4>
            <p className="text-sm text-slate-400">
              {typography.subFont.western.reason}
            </p>
          </div>
        </div>
      </div>

      {/* 数字フォント */}
      {typography.numberFont && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            数字強調用フォント
          </h3>
          <div className="p-4 rounded-lg bg-slate-700/50 max-w-md">
            <h4 className="text-xl font-bold text-white mb-2">
              {typography.numberFont.name}
            </h4>
            <p className="text-sm text-slate-400">{typography.numberFont.reason}</p>
          </div>
        </div>
      )}

      {/* サイズシステム */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">
          フォントサイズシステム
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">要素</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">PC</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">SP</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">行間</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">用途</th>
              </tr>
            </thead>
            <tbody>
              {typography.sizeSystem.map((row, index) => (
                <tr key={index} className="border-b border-slate-700/50">
                  <td className="py-3 px-4 text-white font-medium">{row.element}</td>
                  <td className="py-3 px-4 text-slate-300">{row.pc}</td>
                  <td className="py-3 px-4 text-slate-300">{row.sp}</td>
                  <td className="py-3 px-4 text-slate-300">{row.lineHeight}</td>
                  <td className="py-3 px-4 text-slate-400">{row.usage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ジャンプ率 */}
      {typography.jumpRatio && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            ジャンプ率（視覚的強弱）
          </h3>
          <div className="p-4 rounded-lg bg-slate-700/50">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm">レベル:</span>
                <span
                  className={`px-2 py-1 rounded text-sm font-medium ${
                    typography.jumpRatio.level === 'high'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : typography.jumpRatio.level === 'medium'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-slate-500/20 text-slate-400'
                  }`}
                >
                  {typography.jumpRatio.level === 'high'
                    ? '高'
                    : typography.jumpRatio.level === 'medium'
                    ? '中'
                    : '低'}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-slate-400">
                  H1/本文: <span className="text-white font-medium">{typography.jumpRatio.h1ToBody}:1</span>
                </span>
                <span className="text-slate-400">
                  H2/本文: <span className="text-white font-medium">{typography.jumpRatio.h2ToBody}:1</span>
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-300 mb-2">{typography.jumpRatio.description}</p>
            <p className="text-sm text-slate-400 italic">{typography.jumpRatio.rationale}</p>
          </div>
        </div>
      )}

      {/* 業種別コンテキスト */}
      {typography.industryContext && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            業種別フォント選定根拠
          </h3>
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-1 rounded text-xs font-medium bg-blue-500/20 text-blue-400">
                {typography.industryContext.industry}
              </span>
              <span className="text-sm text-slate-400">
                フォントスタイル:{' '}
                <span className="text-white">
                  {typography.industryContext.fontStyle === 'mincho'
                    ? '明朝体系'
                    : typography.industryContext.fontStyle === 'gothic'
                    ? 'ゴシック体系'
                    : typography.industryContext.fontStyle === 'maru-gothic'
                    ? '丸ゴシック系'
                    : 'ミックス'}
                </span>
              </span>
            </div>
            <div className="space-y-2">
              <div>
                <span className="text-xs text-slate-400">心理効果:</span>
                <p className="text-sm text-slate-300">{typography.industryContext.psychologicalEffect}</p>
              </div>
              <div>
                <span className="text-xs text-slate-400">CVRへの影響:</span>
                <p className="text-sm text-slate-300">{typography.industryContext.cvrImpact}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
