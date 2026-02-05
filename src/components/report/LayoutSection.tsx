'use client';

import { Grid3X3, Maximize2, Smartphone, Monitor, Tablet } from 'lucide-react';
import type { LayoutGuideline } from '@/types';

interface Props {
  layout: LayoutGuideline;
}

export function LayoutSection({ layout }: Props) {
  return (
    <div className="space-y-8">
      {/* グリッドシステム */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Grid3X3 className="text-emerald-600" size={20} />
          <h3 className="text-lg font-semibold text-slate-800">グリッドシステム</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-sm text-slate-500 mb-1">カラム数</div>
            <div className="text-2xl font-bold text-slate-800">
              {layout.grid.columns}
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-sm text-slate-500 mb-1">ガター</div>
            <div className="text-2xl font-bold text-slate-800">
              {layout.grid.gutter}
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-sm text-slate-500 mb-1">マージン</div>
            <div className="text-2xl font-bold text-slate-800">
              {layout.grid.margin}
            </div>
          </div>
        </div>

        {/* グリッドビジュアライゼーション */}
        <div className="mt-4 p-4 rounded-lg bg-slate-100 border border-slate-200">
          <div className="text-xs text-slate-500 mb-2">グリッドプレビュー</div>
          <div 
            className="flex gap-1 h-16"
            style={{ gap: '4px' }}
          >
            {Array.from({ length: Math.min(layout.grid.columns, 12) }).map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-emerald-100 border border-emerald-300 rounded"
              />
            ))}
          </div>
        </div>
      </div>

      {/* スペーシング */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Maximize2 className="text-emerald-600" size={20} />
          <h3 className="text-lg font-semibold text-slate-800">スペーシング</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-sm text-slate-500 mb-1">基本単位</div>
            <div className="text-xl font-bold text-slate-800">
              {layout.spacing.unit}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              すべてのスペーシングの基準
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-sm text-slate-500 mb-1">セクション間隔</div>
            <div className="text-xl font-bold text-slate-800">
              {layout.spacing.sectionGap}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              大きなセクション間のスペース
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-sm text-slate-500 mb-1">要素間隔</div>
            <div className="text-xl font-bold text-slate-800">
              {layout.spacing.elementGap}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              コンポーネント間のスペース
            </div>
          </div>
        </div>
      </div>

      {/* 最大幅 */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Monitor className="text-emerald-600" size={20} />
          <h3 className="text-lg font-semibold text-slate-800">コンテンツ最大幅</h3>
        </div>

        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 inline-block">
          <div className="text-3xl font-bold text-emerald-600">
            {layout.maxWidth}
          </div>
          <div className="text-sm text-slate-500 mt-1">
            メインコンテンツエリアの最大幅
          </div>
        </div>
      </div>

      {/* レスポンシブブレイクポイント */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Smartphone className="text-emerald-600" size={20} />
          <h3 className="text-lg font-semibold text-slate-800">
            レスポンシブブレイクポイント
          </h3>
        </div>

        <div className="space-y-3">
          {layout.responsiveBreakpoints.map((bp, index) => {
            const Icon = bp.name.toLowerCase().includes('mobile') 
              ? Smartphone 
              : bp.name.toLowerCase().includes('tablet')
                ? Tablet
                : Monitor;

            return (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200"
              >
                <Icon className="text-slate-400" size={24} />
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-slate-800">{bp.name}</span>
                    <span className="text-sm text-emerald-600 font-mono">
                      {bp.minWidth}
                    </span>
                  </div>
                  <div className="text-sm text-slate-500">{bp.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
