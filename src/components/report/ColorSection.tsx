'use client';

import type { ColorGuideline } from '@/types';
import { EvidencePanel } from './EvidencePanel';

interface Props {
  color: ColorGuideline;
}

// 色の明るさを判定してテキスト色を決定
function getContrastTextColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#1e293b' : '#ffffff';
}

export function ColorSection({ color }: Props) {
  return (
    <div className="space-y-8">
      {/* カラーパレット */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">カラーパレット</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {/* メインカラー */}
          <ColorCard
            label="メインカラー"
            name={color.mainColor.name}
            hex={color.mainColor.hex}
            ratio={color.mainColor.ratio}
            effect={color.mainColor.psychologicalEffect}
            usage={color.mainColor.usage}
          />

          {/* サブカラー */}
          <ColorCard
            label="サブカラー"
            name={color.subColor.name}
            hex={color.subColor.hex}
            ratio={color.subColor.ratio}
            effect={color.subColor.psychologicalEffect}
            usage={color.subColor.usage}
          />

          {/* アクセントカラー */}
          <ColorCard
            label="アクセントカラー"
            name={color.accentColor.name}
            hex={color.accentColor.hex}
            ratio={color.accentColor.ratio}
            effect={color.accentColor.psychologicalEffect}
            usage={color.accentColor.usage}
          />
        </div>
      </div>

      {/* カラー設計エビデンス */}
      <EvidencePanel
        title="カラー設計の根拠"
        evidences={[
          {
            type: 'data',
            title: '60-30-10ルール',
            description: '配色比率を最適化したLPでコンバージョン率18%向上。バランスの取れた配色は「安定感」「信頼感」を生み、情報整理を助けます。',
            impact: 'CVR +18%',
          },
          {
            type: 'psychological',
            title: 'カラー一貫性の効果',
            description: '微妙な色のブレ（#000000と#222222の混在等）で信頼性スコア8%低下。色の統一は「プロフェッショナル感」を高めます。',
          },
          {
            type: 'abtest',
            title: 'CTAカラーの最適化',
            description: 'コントラスト比4.5:1以上で視認性が向上し、クリック率15%改善。アクセントカラーは背景との対比を明確にすることが重要です。',
            impact: 'クリック率 +15%',
          },
        ]}
      />

      {/* 配色比率 */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          配色比率（60-30-10ルール）
        </h3>
        <div className="flex h-10 rounded-lg overflow-hidden border border-slate-200">
          <div
            className="flex items-center justify-center text-xs font-medium"
            style={{
              width: color.subColor.ratio,
              backgroundColor: color.subColor.hex,
              color: getContrastTextColor(color.subColor.hex),
            }}
          >
            {color.subColor.ratio}
          </div>
          <div
            className="flex items-center justify-center text-xs font-medium"
            style={{
              width: color.mainColor.ratio,
              backgroundColor: color.mainColor.hex,
              color: getContrastTextColor(color.mainColor.hex),
            }}
          >
            {color.mainColor.ratio}
          </div>
          <div
            className="flex items-center justify-center text-xs font-medium"
            style={{
              width: color.accentColor.ratio,
              backgroundColor: color.accentColor.hex,
              color: getContrastTextColor(color.accentColor.hex),
            }}
          >
            {color.accentColor.ratio}
          </div>
        </div>
      </div>

      {/* エモーショナルカラー */}
      {color.emotionalColor && (
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            エモーショナルカラー
            <span className="ml-2 text-sm font-normal text-slate-500">
              （心理的刷り込み）
            </span>
          </h3>
          <div className="rounded-lg overflow-hidden bg-slate-50 border border-slate-200">
            <div
              className="h-16 flex items-center justify-center"
              style={{ backgroundColor: color.emotionalColor.hex }}
            >
              <span 
                className="font-mono text-sm px-2 py-1 rounded"
                style={{ 
                  color: getContrastTextColor(color.emotionalColor.hex),
                  backgroundColor: 'rgba(0,0,0,0.2)'
                }}
              >
                {color.emotionalColor.hex}
              </span>
            </div>
            <div className="p-4">
              <h4 className="text-lg font-bold text-slate-800 mb-2">
                {color.emotionalColor.name}
              </h4>
              <div className="space-y-2">
                <div>
                  <span className="text-xs text-slate-500">目的:</span>
                  <p className="text-sm text-slate-700">{color.emotionalColor.purpose}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">心理メカニズム:</span>
                  <p className="text-sm text-slate-700">{color.emotionalColor.mechanism}</p>
                </div>
                {color.emotionalColor.usage && color.emotionalColor.usage.length > 0 && (
                  <div>
                    <span className="text-xs text-slate-500">使用箇所:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {color.emotionalColor.usage.map((u, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-700"
                        >
                          {u}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* カラーシステム設計根拠 */}
      {color.colorSystemRationale && (
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            カラーシステム設計根拠
          </h3>
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
            <p className="text-sm text-slate-700 leading-relaxed">
              {color.colorSystemRationale}
            </p>
          </div>
        </div>
      )}

      {/* テキストカラー */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">テキストカラー</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <TextColorCard
            label="プライマリ"
            hex={color.textColors.primary}
            usage="本文"
          />
          <TextColorCard
            label="セカンダリ"
            hex={color.textColors.secondary}
            usage="キャプション"
          />
          <TextColorCard
            label="ターシャリ"
            hex={color.textColors.tertiary}
            usage="注釈"
          />
          <TextColorCard
            label="反転"
            hex={color.textColors.inverse}
            usage="濃色背景上"
            darkBg
          />
        </div>
      </div>

      {/* 禁止配色 */}
      {color.prohibitedCombinations && color.prohibitedCombinations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-4">禁止配色</h3>
          <div className="space-y-3">
            {color.prohibitedCombinations.map((combo, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-red-50 border border-red-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-red-600 font-medium">✗</span>
                  <div className="flex gap-1">
                    {combo.colors.map((c, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded border border-slate-300"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-slate-600">{combo.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// カラーカードコンポーネント
interface ColorCardProps {
  label: string;
  name: string;
  hex: string;
  ratio: string;
  effect: string;
  usage: string[];
}

function ColorCard({ label, name, hex, ratio, effect, usage }: ColorCardProps) {
  return (
    <div className="rounded-lg overflow-hidden bg-slate-50 border border-slate-200">
      {/* カラープレビュー */}
      <div className="h-24 flex items-end justify-end p-2" style={{ backgroundColor: hex }}>
        <span 
          className="font-mono text-xs px-2 py-1 rounded"
          style={{ 
            color: getContrastTextColor(hex),
            backgroundColor: 'rgba(0,0,0,0.2)'
          }}
        >
          {hex}
        </span>
      </div>

      {/* 情報 */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-500">{label}</span>
        </div>
        <h4 className="text-lg font-bold text-slate-800 mb-2">{name}</h4>
        <p className="text-sm text-slate-600 mb-2">{effect}</p>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-500">使用比率:</span>
          <span className="text-emerald-600 font-medium">{ratio}</span>
        </div>
        <div className="mt-2">
          <span className="text-xs text-slate-500">使用箇所:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {usage.map((u, i) => (
              <span
                key={i}
                className="text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-700"
              >
                {u}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// テキストカラーカードコンポーネント
interface TextColorCardProps {
  label: string;
  hex: string;
  usage: string;
  darkBg?: boolean;
}

function TextColorCard({ label, hex, usage, darkBg }: TextColorCardProps) {
  return (
    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
      <div
        className={`w-full h-10 rounded flex items-center justify-center mb-2 border ${
          darkBg ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}
      >
        <span className="font-medium text-lg" style={{ color: hex }}>
          Aa
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-600">{label}</span>
        <span className="text-xs font-mono text-slate-500">{hex}</span>
      </div>
      <span className="text-xs text-slate-500">{usage}</span>
    </div>
  );
}
