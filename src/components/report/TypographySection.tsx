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
    </div>
  );
}
