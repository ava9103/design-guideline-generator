'use client';

import { FormInput, Square } from 'lucide-react';
import type { UIGuideline } from '@/types';

interface Props {
  ui: UIGuideline;
}

export function UIElementsSection({ ui }: Props) {
  return (
    <div className="space-y-8">
      {/* フォームスタイル */}
      {ui.forms && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <FormInput className="text-emerald-600" size={20} />
            <h3 className="text-lg font-semibold text-slate-800">フォームスタイル</h3>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            {/* フォームプレビュー */}
            <div className="mb-4 max-w-md">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                お名前
              </label>
              <input
                type="text"
                placeholder="山田 太郎"
                className="w-full px-4 py-2 transition-all outline-none"
                style={{
                  borderRadius: ui.forms.borderRadius,
                  border: `1px solid ${ui.forms.borderColor}`,
                }}
              />
            </div>

            {/* スペック */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2 text-sm">
                <SpecRow label="入力スタイル" value={ui.forms.inputStyle} />
                <SpecRow label="角丸" value={ui.forms.borderRadius} />
              </div>
              <div className="space-y-2 text-sm">
                <SpecRow label="ボーダー色" value={ui.forms.borderColor} isColor />
                <SpecRow label="フォーカス色" value={ui.forms.focusColor} isColor />
                <SpecRow label="エラー色" value={ui.forms.errorColor} isColor />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* カードスタイル */}
      {ui.cards && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Square className="text-emerald-600" size={20} />
            <h3 className="text-lg font-semibold text-slate-800">カードスタイル</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* カードプレビュー */}
            <div
              className="p-6"
              style={{
                backgroundColor: ui.cards.backgroundColor,
                borderRadius: ui.cards.borderRadius,
                boxShadow: ui.cards.shadow,
                padding: ui.cards.padding,
              }}
            >
              <h4 className="font-bold text-slate-800 mb-2">カードタイトル</h4>
              <p className="text-slate-600 text-sm">
                これはカードコンポーネントのプレビューです。
                コンテンツはこのように表示されます。
              </p>
            </div>

            {/* スペック */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <h4 className="text-sm font-medium text-slate-600 mb-3">
                Card Specifications
              </h4>
              <div className="space-y-2 text-sm">
                <SpecRow label="背景色" value={ui.cards.backgroundColor} isColor />
                <SpecRow label="角丸" value={ui.cards.borderRadius} />
                <SpecRow label="シャドウ" value={ui.cards.shadow} />
                <SpecRow label="パディング" value={ui.cards.padding} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// スペック行コンポーネント
function SpecRow({
  label,
  value,
  isColor = false,
}: {
  label: string;
  value: string;
  isColor?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-slate-500">{label}</span>
      <div className="flex items-center gap-2">
        {isColor && value.startsWith('#') && (
          <div
            className="w-4 h-4 rounded border border-slate-300"
            style={{ backgroundColor: value }}
          />
        )}
        <span className="text-slate-700 font-mono text-xs">{value}</span>
      </div>
    </div>
  );
}
