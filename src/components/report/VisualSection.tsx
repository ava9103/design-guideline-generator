'use client';

import type { VisualGuideline } from '@/types';

interface Props {
  visual: VisualGuideline;
}

export function VisualSection({ visual }: Props) {
  return (
    <div className="space-y-6">
      {/* 写真ガイド */}
      <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
        <h4 className="font-medium text-slate-800 mb-3">📷 写真</h4>
        <div className="space-y-2 text-sm">
          <p className="text-slate-700">
            <span className="font-medium">トーン:</span> {visual.photo.tone}（{visual.photo.brightness}、{visual.photo.saturation}）
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="text-slate-500">推奨被写体:</span>
            {visual.photo.subjects.map((subject, index) => (
              <span
                key={index}
                className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-xs"
              >
                {subject}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* イラストガイド */}
      <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
        <h4 className="font-medium text-slate-800 mb-3">🎨 イラスト</h4>
        <div className="space-y-2 text-sm">
          <p className="text-slate-700">
            <span className="font-medium">スタイル:</span> {visual.illustration.style}（{visual.illustration.tone}）
          </p>
          <p className="text-slate-700">
            <span className="font-medium">色数:</span> {visual.illustration.colorCount}、
            <span className="font-medium">線:</span> {visual.illustration.lineWeight}
          </p>
        </div>
      </div>
    </div>
  );
}
