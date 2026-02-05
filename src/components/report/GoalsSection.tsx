'use client';

import type { Layer1Goals } from '@/types';

interface Props {
  goals: Layer1Goals;
}

export function GoalsSection({ goals }: Props) {
  return (
    <div className="space-y-8">
      {/* 印象キーワード */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          デザインを通して伝えるべき印象キーワード
        </h3>
        <div className="flex flex-wrap gap-3">
          {goals.impressionKeywords.map((keyword, index) => (
            <span
              key={index}
              className="px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>

      {/* 差別化ポイント */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          競合との差別化ポイント
        </h3>
        <div className="space-y-3">
          {goals.differentiationPoints.map((point, index) => (
            <div
              key={index}
              className="p-3 rounded-lg bg-slate-50 border-l-4 border-emerald-500"
            >
              <h4 className="font-medium text-slate-800">{point.title}</h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
