'use client';

import { Check, X } from 'lucide-react';
import type { Layer2Concept } from '@/types';

interface Props {
  concept: Layer2Concept;
}

export function ConceptSection({ concept }: Props) {
  return (
    <div className="space-y-8">
      {/* コンセプトステートメント */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          コンセプトステートメント
        </h3>
        <div className="p-6 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200">
          <p className="text-lg text-slate-800 leading-relaxed font-medium">{concept.statement}</p>
        </div>
      </div>

      {/* 本LPの位置づけ */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">本LPの位置づけ</h3>
        <p className="text-slate-700 leading-relaxed">{concept.positioning}</p>
      </div>

      {/* デザイン原則 */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">デザイン原則</h3>
        <div className="space-y-2">
          {concept.principles.map((principle, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200"
            >
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                <Check className="text-emerald-600" size={12} />
              </div>
              <span className="font-medium text-slate-800">{principle.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 禁止事項 */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">デザイン禁止事項</h3>
        <div className="space-y-2">
          {concept.prohibitions.map((prohibition, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-200"
            >
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                <X className="text-red-600" size={12} />
              </div>
              <span className="font-medium text-red-700">{prohibition.item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
