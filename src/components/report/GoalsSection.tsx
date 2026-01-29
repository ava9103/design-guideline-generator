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
        <h3 className="text-lg font-semibold text-white mb-4">
          デザインを通して伝えるべき印象キーワード
        </h3>
        <div className="flex flex-wrap gap-3">
          {goals.impressionKeywords.map((keyword, index) => (
            <span
              key={index}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400 font-medium"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>

      {/* 差別化ポイント */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">
          競合との差別化ポイント
        </h3>
        <div className="space-y-4">
          {goals.differentiationPoints.map((point, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-slate-700/50 border-l-4 border-emerald-500"
            >
              <h4 className="font-medium text-white mb-2">{point.title}</h4>
              <p className="text-slate-400 text-sm">{point.reason}</p>
            </div>
          ))}
        </div>
      </div>

      {/* キーワード詳細 */}
      {goals.keywordDetails && goals.keywordDetails.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            各キーワードの根拠
          </h3>
          <div className="grid gap-4">
            {goals.keywordDetails.map((detail, index) => (
              <div key={index} className="p-4 rounded-lg bg-slate-700/30">
                <h4 className="font-medium text-emerald-400 mb-2">
                  {detail.keyword}
                </h4>
                <ul className="space-y-1">
                  {detail.reasons.map((reason, rIndex) => (
                    <li key={rIndex} className="text-slate-300 text-sm flex items-start gap-2">
                      <span className="text-slate-500">・</span>
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
