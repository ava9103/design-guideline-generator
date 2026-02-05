'use client';

import { Check, X } from 'lucide-react';
import type { VisualGuideline } from '@/types';

interface Props {
  visual: VisualGuideline;
}

export function VisualSection({ visual }: Props) {
  return (
    <div className="space-y-8">
      {/* 写真ガイド */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">📷 写真イメージガイド</h3>

        {/* トーン設定 */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <h4 className="text-sm font-medium text-slate-600 mb-3">トーン設定</h4>
            <div className="space-y-2">
              <ToneRow label="トーン" value={visual.photo.tone} />
              <ToneRow label="明るさ" value={visual.photo.brightness} />
              <ToneRow label="彩度" value={visual.photo.saturation} />
              <ToneRow label="色温度" value={visual.photo.colorTemperature} />
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <h4 className="text-sm font-medium text-slate-600 mb-3">構図ガイド</h4>
            <ul className="space-y-1">
              {visual.photo.composition.map((item, index) => (
                <li key={index} className="text-slate-700 text-sm flex items-start gap-2">
                  <span className="text-emerald-600">・</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 推奨被写体 */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-slate-600 mb-2">推奨被写体</h4>
          <div className="flex flex-wrap gap-2">
            {visual.photo.subjects.map((subject, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm"
              >
                {subject}
              </span>
            ))}
          </div>
        </div>

        {/* NG例 */}
        <div>
          <h4 className="text-sm font-medium text-red-600 mb-2">避けるべき写真</h4>
          <div className="space-y-2">
            {visual.photo.ngExamples.map((example, index) => (
              <div key={index} className="flex items-center gap-2 text-slate-600 text-sm">
                <X size={14} className="text-red-500 flex-shrink-0" />
                {example}
              </div>
            ))}
          </div>
        </div>

        {/* 参考画像 */}
        {visual.photo.referenceImages && visual.photo.referenceImages.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-slate-600 mb-3">参考イメージ</h4>
            <div className="grid grid-cols-3 gap-4">
              {visual.photo.referenceImages.map((img, index) => (
                <a
                  key={index}
                  href={img.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg overflow-hidden hover:opacity-80 transition border border-slate-200"
                >
                  <img
                    src={img.thumbnail || img.url}
                    alt={img.alt}
                    className="w-full h-32 object-cover"
                  />
                  {img.credit && (
                    <div className="p-2 bg-slate-100 text-xs text-slate-600">
                      Photo by {img.credit.name}
                    </div>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* イラストガイド */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">🎨 イラストイメージガイド</h3>

        {/* スタイル設定 */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <h4 className="text-sm font-medium text-slate-600 mb-3">スタイル設定</h4>
            <div className="space-y-2">
              <ToneRow label="スタイル" value={visual.illustration.style} />
              <ToneRow label="トーン" value={visual.illustration.tone} />
              <ToneRow label="色数" value={visual.illustration.colorCount} />
              <ToneRow label="線の太さ" value={visual.illustration.lineWeight} />
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <h4 className="text-sm font-medium text-slate-600 mb-3">具体例</h4>
            <ul className="space-y-1">
              {visual.illustration.examples.map((item, index) => (
                <li key={index} className="text-slate-700 text-sm flex items-start gap-2">
                  <Check size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* NG例 */}
        <div>
          <h4 className="text-sm font-medium text-red-600 mb-2">避けるべきイラスト</h4>
          <div className="space-y-2">
            {visual.illustration.ngExamples.map((example, index) => (
              <div key={index} className="flex items-center gap-2 text-slate-600 text-sm">
                <X size={14} className="text-red-500 flex-shrink-0" />
                {example}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// トーン行コンポーネント
function ToneRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-700">{value}</span>
    </div>
  );
}
