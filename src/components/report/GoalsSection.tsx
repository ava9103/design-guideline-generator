'use client';

import type { Layer1Goals } from '@/types';
import { PositioningMap } from './PositioningMap';

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
        <div className="space-y-4">
          {goals.differentiationPoints.map((point, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-slate-50 border-l-4 border-emerald-500"
            >
              <h4 className="font-medium text-slate-800 mb-2">{point.title}</h4>
              <p className="text-slate-600 text-sm">{point.reason}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ポジショニングマップ */}
      {goals.positioningMap && (
        <PositioningMap
          xAxis={goals.positioningMap.xAxis}
          yAxis={goals.positioningMap.yAxis}
          selfPosition={goals.positioningMap.selfPosition}
          competitors={goals.positioningMap.competitors}
        />
      )}

      {/* キーワード詳細 */}
      {goals.keywordDetails && goals.keywordDetails.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            各キーワードの根拠
          </h3>
          <div className="grid gap-4">
            {goals.keywordDetails.map((detail, index) => (
              <div key={index} className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <h4 className="font-medium text-emerald-600 mb-2">
                  {detail.keyword}
                </h4>
                <ul className="space-y-1">
                  {detail.reasons.map((reason, rIndex) => (
                    <li key={rIndex} className="text-slate-700 text-sm flex items-start gap-2">
                      <span className="text-slate-400">・</span>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
