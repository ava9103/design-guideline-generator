'use client';

import type { UIGuideline } from '@/types';

interface Props {
  ui: UIGuideline;
}

export function UIElementsSection({ ui }: Props) {
  return (
    <div className="space-y-6">
      {/* フォームスタイル */}
      {ui.forms && (
        <div>
          <h4 className="text-sm font-medium text-slate-600 mb-3">フォーム</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500">スタイル</span>
              <div className="text-sm font-medium text-slate-800 mt-1">{ui.forms.inputStyle}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500">角丸</span>
              <div className="text-sm font-medium text-slate-800 mt-1">{ui.forms.borderRadius}</div>
            </div>
            <ColorSpec label="ボーダー" hex={ui.forms.borderColor} />
            <ColorSpec label="フォーカス" hex={ui.forms.focusColor} />
            <ColorSpec label="エラー" hex={ui.forms.errorColor} />
          </div>
        </div>
      )}

      {/* カードスタイル */}
      {ui.cards && (
        <div>
          <h4 className="text-sm font-medium text-slate-600 mb-3">カード</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <ColorSpec label="背景" hex={ui.cards.backgroundColor} />
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500">角丸</span>
              <div className="text-sm font-medium text-slate-800 mt-1">{ui.cards.borderRadius}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500">パディング</span>
              <div className="text-sm font-medium text-slate-800 mt-1">{ui.cards.padding}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500">シャドウ</span>
              <div className="text-xs font-mono text-slate-600 mt-1 truncate">{ui.cards.shadow}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// カラー表示コンポーネント
function ColorSpec({ label, hex }: { label: string; hex: string }) {
  return (
    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
      <span className="text-xs text-slate-500">{label}</span>
      <div className="flex items-center gap-2 mt-1">
        {hex.startsWith('#') && (
          <div
            className="w-4 h-4 rounded border border-slate-300"
            style={{ backgroundColor: hex }}
          />
        )}
        <span className="text-xs font-mono text-slate-700">{hex}</span>
      </div>
    </div>
  );
}
