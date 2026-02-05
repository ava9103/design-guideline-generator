'use client';

import { Smartphone, Monitor, Tablet } from 'lucide-react';
import type { LayoutGuideline } from '@/types';

interface Props {
  layout: LayoutGuideline;
}

export function LayoutSection({ layout }: Props) {
  return (
    <div className="space-y-6">
      {/* グリッド・スペーシング（シンプル化） */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-xs text-slate-500">カラム数</span>
          <div className="text-lg font-bold text-slate-800 mt-1">{layout.grid.columns}</div>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-xs text-slate-500">ガター</span>
          <div className="text-lg font-bold text-slate-800 mt-1">{layout.grid.gutter}</div>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-xs text-slate-500">マージン</span>
          <div className="text-lg font-bold text-slate-800 mt-1">{layout.grid.margin}</div>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-xs text-slate-500">最大幅</span>
          <div className="text-lg font-bold text-slate-800 mt-1">{layout.maxWidth}</div>
        </div>
      </div>

      {/* スペーシング */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-xs text-slate-500">基本単位</span>
          <div className="text-lg font-bold text-slate-800 mt-1">{layout.spacing.unit}</div>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-xs text-slate-500">セクション間隔</span>
          <div className="text-lg font-bold text-slate-800 mt-1">{layout.spacing.sectionGap}</div>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-xs text-slate-500">要素間隔</span>
          <div className="text-lg font-bold text-slate-800 mt-1">{layout.spacing.elementGap}</div>
        </div>
      </div>

      {/* ブレイクポイント */}
      <div>
        <h4 className="text-sm font-medium text-slate-600 mb-3">ブレイクポイント</h4>
        <div className="space-y-2 bg-slate-50 rounded-lg p-4 border border-slate-200">
          {layout.responsiveBreakpoints.map((bp, index) => {
            const Icon = bp.name.toLowerCase().includes('mobile') 
              ? Smartphone 
              : bp.name.toLowerCase().includes('tablet')
                ? Tablet
                : Monitor;

            return (
              <div key={index} className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-2">
                  <Icon className="text-slate-400" size={16} />
                  <span className="text-sm text-slate-700">{bp.name}</span>
                </div>
                <span className="text-sm font-mono text-slate-500">{bp.minWidth}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
