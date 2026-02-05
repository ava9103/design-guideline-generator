'use client';

import type { VisualGuideline } from '@/types';

interface Props {
  visual: VisualGuideline;
}

export function VisualSection({ visual }: Props) {
  return (
    <div className="space-y-6">
      {/* 写真 */}
      <div>
        <h4 className="text-sm font-medium text-slate-600 mb-3">写真</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500">トーン</span>
            <div className="text-sm font-medium text-slate-800 mt-1">{visual.photo.tone}</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500">明るさ</span>
            <div className="text-sm font-medium text-slate-800 mt-1">{visual.photo.brightness}</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500">彩度</span>
            <div className="text-sm font-medium text-slate-800 mt-1">{visual.photo.saturation}</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500">推奨被写体</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {visual.photo.subjects.slice(0, 2).map((subject, index) => (
                <span key={index} className="text-xs text-slate-700">{subject}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* イラスト */}
      <div>
        <h4 className="text-sm font-medium text-slate-600 mb-3">イラスト</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500">スタイル</span>
            <div className="text-sm font-medium text-slate-800 mt-1">{visual.illustration.style}</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500">トーン</span>
            <div className="text-sm font-medium text-slate-800 mt-1">{visual.illustration.tone}</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500">色数</span>
            <div className="text-sm font-medium text-slate-800 mt-1">{visual.illustration.colorCount}</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500">線の太さ</span>
            <div className="text-sm font-medium text-slate-800 mt-1">{visual.illustration.lineWeight}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
