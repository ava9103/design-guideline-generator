'use client';

import { MousePointer2, FormInput, Square, Lightbulb } from 'lucide-react';
import type { UIGuideline } from '@/types';

interface Props {
  ui: UIGuideline;
}

export function UIElementsSection({ ui }: Props) {
  return (
    <div className="space-y-8">
      {/* CTAボタン */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <MousePointer2 className="text-emerald-600" size={20} />
          <h3 className="text-lg font-semibold text-slate-800">CTAボタン</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* プライマリボタン */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <h4 className="text-sm font-medium text-slate-600 mb-3">
              Primary Button
            </h4>
            
            {/* ボタンプレビュー */}
            <div className="mb-4">
              <button
                className="px-6 py-3 font-medium transition-all"
                style={{
                  backgroundColor: ui.buttons.primary.backgroundColor,
                  color: ui.buttons.primary.textColor,
                  borderRadius: ui.buttons.primary.borderRadius,
                  padding: ui.buttons.primary.padding,
                  fontSize: ui.buttons.primary.fontSize,
                }}
              >
                お問い合わせはこちら
              </button>
            </div>
            
            {/* スペック */}
            <div className="space-y-2 text-sm">
              <SpecRow label="背景色" value={ui.buttons.primary.backgroundColor} isColor />
              <SpecRow label="文字色" value={ui.buttons.primary.textColor} isColor />
              <SpecRow label="角丸" value={ui.buttons.primary.borderRadius} />
              <SpecRow label="パディング" value={ui.buttons.primary.padding} />
              <SpecRow label="フォントサイズ" value={ui.buttons.primary.fontSize} />
              <SpecRow label="ホバー効果" value={ui.buttons.primary.hoverEffect} />
            </div>

            {/* 心理的根拠 */}
            {ui.buttons.primary.psychologicalRationale && (
              <div className="mt-4 p-3 rounded bg-amber-50 border border-amber-200">
                <div className="flex items-start gap-2">
                  <Lightbulb className="text-amber-500 flex-shrink-0 mt-0.5\" size={16} />
                  <div>
                    <div className="text-xs font-medium text-amber-700 mb-1">
                      設計根拠
                    </div>
                    <p className="text-xs text-amber-600">
                      {ui.buttons.primary.psychologicalRationale}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* セカンダリボタン */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <h4 className="text-sm font-medium text-slate-600 mb-3">
              Secondary Button
            </h4>
            
            {/* ボタンプレビュー */}
            <div className="mb-4">
              <button
                className="px-6 py-3 font-medium transition-all border-2"
                style={{
                  backgroundColor: ui.buttons.secondary.backgroundColor,
                  color: ui.buttons.secondary.textColor,
                  borderRadius: ui.buttons.secondary.borderRadius,
                  padding: ui.buttons.secondary.padding,
                  fontSize: ui.buttons.secondary.fontSize,
                  borderColor: ui.buttons.secondary.textColor,
                }}
              >
                詳しく見る
              </button>
            </div>
            
            {/* スペック */}
            <div className="space-y-2 text-sm">
              <SpecRow label="背景色" value={ui.buttons.secondary.backgroundColor} isColor />
              <SpecRow label="文字色" value={ui.buttons.secondary.textColor} isColor />
              <SpecRow label="角丸" value={ui.buttons.secondary.borderRadius} />
              <SpecRow label="パディング" value={ui.buttons.secondary.padding} />
              <SpecRow label="フォントサイズ" value={ui.buttons.secondary.fontSize} />
              <SpecRow label="ホバー効果" value={ui.buttons.secondary.hoverEffect} />
            </div>
          </div>
        </div>
      </div>

      {/* CTA改善提案 */}
      {ui.ctaRecommendations && ui.ctaRecommendations.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="text-amber-500" size={20} />
            <h3 className="text-lg font-semibold text-slate-800">CTA改善提案</h3>
          </div>

          <div className="space-y-3">
            {ui.ctaRecommendations.map((rec, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-amber-50 border border-amber-200"
              >
                <h4 className="font-medium text-amber-800 mb-2">
                  {rec.recommendation}
                </h4>
                <div className="grid md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-amber-600 font-medium">根拠:</span>
                    <span className="text-amber-700 ml-1">{rec.evidence}</span>
                  </div>
                  <div>
                    <span className="text-emerald-600 font-medium">期待効果:</span>
                    <span className="text-emerald-700 ml-1">{rec.expectedImpact}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
