'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import type { ColorGuideline } from '@/types';
import { EvidencePanel } from './EvidencePanel';

interface Props {
  color: ColorGuideline;
}

// HEXをRGBに変換
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

// 色の明るさを判定してテキスト色を決定
function getContrastTextColor(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#1e293b' : '#ffffff';
}

// メインカラーから派生色を生成
function generatePrimaryVariants(baseHex: string): { hex: string }[] {
  const { r, g, b } = hexToRgb(baseHex);
  
  // 明るいバリエーション
  const lighter = {
    r: Math.min(255, r + Math.round((255 - r) * 0.4)),
    g: Math.min(255, g + Math.round((255 - g) * 0.4)),
    b: Math.min(255, b + Math.round((255 - b) * 0.4)),
  };
  
  // 暗いバリエーション
  const darker = {
    r: Math.round(r * 0.7),
    g: Math.round(g * 0.7),
    b: Math.round(b * 0.7),
  };
  
  const toHex = (c: { r: number; g: number; b: number }) =>
    `#${c.r.toString(16).padStart(2, '0')}${c.g.toString(16).padStart(2, '0')}${c.b.toString(16).padStart(2, '0')}`;
  
  return [
    { hex: baseHex },
    { hex: toHex(lighter) },
    { hex: toHex(darker) },
  ];
}

// セカンダリカラーから派生色を生成
function generateSecondaryVariants(baseHex: string, accentHex: string): { hex: string }[] {
  const { r, g, b } = hexToRgb(baseHex);
  const accent = hexToRgb(accentHex);
  
  // 彩度を下げたバリエーション
  const muted = {
    r: Math.round(r * 0.8 + 128 * 0.2),
    g: Math.round(g * 0.8 + 128 * 0.2),
    b: Math.round(b * 0.8 + 128 * 0.2),
  };
  
  const toHex = (c: { r: number; g: number; b: number }) =>
    `#${c.r.toString(16).padStart(2, '0')}${c.g.toString(16).padStart(2, '0')}${c.b.toString(16).padStart(2, '0')}`;
  
  return [
    { hex: baseHex },
    { hex: toHex(muted) },
    { hex: accentHex },
  ];
}

// ニュートラルカラーを生成
function generateNeutralColors(): { hex: string }[] {
  return [
    { hex: '#f4f5f6' },
    { hex: '#dfe0e2' },
    { hex: '#7b858e' },
    { hex: '#31383f' },
  ];
}

export function ColorSection({ color }: Props) {
  // カラーデータが不完全な場合のフォールバック
  const mainColor = color.mainColor || { name: 'メインカラー', hex: '#333333', psychologicalEffect: '', usage: [], ratio: '30%' };
  const subColor = color.subColor || { name: 'サブカラー', hex: '#F5F5F5', psychologicalEffect: '', usage: [], ratio: '60%' };
  const accentColor = color.accentColor || { name: 'アクセントカラー', hex: '#D97706', psychologicalEffect: '', usage: [], ratio: '10%' };
  const textColors = color.textColors || { primary: '#333333', secondary: '#666666', tertiary: '#999999', inverse: '#FFFFFF' };

  // カラーパレットを取得（拡張パレットがあればそれを使用、なければ自動生成）
  const primaryColors = color.primaryColors && color.primaryColors.length > 0
    ? color.primaryColors
    : generatePrimaryVariants(mainColor.hex);
  
  const secondaryColors = color.secondaryColors && color.secondaryColors.length > 0
    ? color.secondaryColors
    : generateSecondaryVariants(subColor.hex, accentColor.hex);
  
  const neutralColors = color.neutralColors && color.neutralColors.length > 0
    ? color.neutralColors
    : generateNeutralColors();

  return (
    <div className="space-y-8">
      {/* 生成されたパレット */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-800">生成されたパレット</h3>
        </div>

        {/* メインカラー */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-slate-600 mb-3">メインカラー</h4>
          <div className="grid grid-cols-3 gap-4">
            {primaryColors.map((c, index) => (
              <PaletteColorCard
                key={index}
                hex={c.hex}
                label={`Primary ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* セカンダリカラー */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-slate-600 mb-3">セカンダリカラー</h4>
          <div className="grid grid-cols-3 gap-4">
            {secondaryColors.map((c, index) => (
              <PaletteColorCard
                key={index}
                hex={c.hex}
                label={`Secondary ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* ニュートラルカラー */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-slate-600 mb-3">ニュートラルカラー</h4>
          <div className="grid grid-cols-4 gap-4">
            {neutralColors.map((c, index) => (
              <PaletteColorCard
                key={index}
                hex={c.hex}
                label={`Neutral ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* 使用例プレビュー */}
        <div>
          <h4 className="text-sm font-medium text-slate-600 mb-3">使用例プレビュー</h4>
          <div className="rounded-lg border border-slate-200 p-6 bg-slate-50">
            <div className="border-l-4 pl-4" style={{ borderColor: primaryColors[0]?.hex }}>
              <h5 
                className="text-xl font-bold mb-2"
                style={{ color: primaryColors[0]?.hex }}
              >
                サンプルヘッドライン
              </h5>
              <p className="text-slate-600 mb-4">
                これはカラーパレットの使用例です。メインカラーとセカンダリカラーを組み合わせることで、ブランドイメージに合ったデザインを作成できます。
              </p>
              <div className="flex gap-3">
                <button
                  className="px-4 py-2 rounded-md text-sm font-medium text-white"
                  style={{ backgroundColor: primaryColors[0]?.hex }}
                >
                  プライマリボタン
                </button>
                <button
                  className="px-4 py-2 rounded-md text-sm font-medium text-white"
                  style={{ backgroundColor: secondaryColors[0]?.hex }}
                >
                  セカンダリボタン
                </button>
              </div>
            </div>
          </div>
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
        <div className="flex h-12 rounded-lg overflow-hidden border border-slate-200">
          <div
            className="flex items-center justify-center text-sm font-medium transition-all"
            style={{
              width: subColor.ratio,
              backgroundColor: subColor.hex,
              color: getContrastTextColor(subColor.hex),
            }}
          >
            {subColor.ratio}
          </div>
          <div
            className="flex items-center justify-center text-sm font-medium transition-all"
            style={{
              width: mainColor.ratio,
              backgroundColor: mainColor.hex,
              color: getContrastTextColor(mainColor.hex),
            }}
          >
            {mainColor.ratio}
          </div>
          <div
            className="flex items-center justify-center text-sm font-medium transition-all"
            style={{
              width: accentColor.ratio,
              backgroundColor: accentColor.hex,
              color: getContrastTextColor(accentColor.hex),
            }}
          >
            {accentColor.ratio}
          </div>
        </div>
        <div className="flex mt-2 text-xs text-slate-500">
          <div style={{ width: subColor.ratio }} className="text-center">
            ベースカラー
          </div>
          <div style={{ width: mainColor.ratio }} className="text-center">
            メインカラー
          </div>
          <div style={{ width: accentColor.ratio }} className="text-center">
            アクセント
          </div>
        </div>
      </div>

      {/* カラー詳細情報 */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">カラー詳細</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <ColorDetailCard
            label="メインカラー"
            name={mainColor.name}
            hex={mainColor.hex}
            effect={mainColor.psychologicalEffect}
            usage={mainColor.usage}
          />
          <ColorDetailCard
            label="サブカラー"
            name={subColor.name}
            hex={subColor.hex}
            effect={subColor.psychologicalEffect}
            usage={subColor.usage}
          />
          <ColorDetailCard
            label="アクセントカラー"
            name={accentColor.name}
            hex={accentColor.hex}
            effect={accentColor.psychologicalEffect}
            usage={accentColor.usage}
          />
        </div>
      </div>

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
            hex={textColors.primary}
            usage="本文"
          />
          <TextColorCard
            label="セカンダリ"
            hex={textColors.secondary}
            usage="キャプション"
          />
          <TextColorCard
            label="ターシャリ"
            hex={textColors.tertiary}
            usage="注釈"
          />
          <TextColorCard
            label="反転"
            hex={textColors.inverse}
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

// パレットカラーカードコンポーネント（図のような表示）
interface PaletteColorCardProps {
  hex: string;
  label: string;
}

function PaletteColorCard({ hex, label }: PaletteColorCardProps) {
  const [copied, setCopied] = useState(false);
  const rgb = hexToRgb(hex);
  const textColor = getContrastTextColor(hex);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(hex.toLowerCase());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  return (
    <div 
      className="group rounded-lg overflow-hidden bg-white border border-slate-200 shadow-sm cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
      onClick={handleCopy}
      title="クリックでHEXをコピー"
    >
      {/* カラープレビュー */}
      <div 
        className="h-24 relative flex items-center justify-center"
        style={{ backgroundColor: hex }}
      >
        {copied ? (
          <Check className="w-6 h-6" style={{ color: textColor }} />
        ) : (
          <Copy className="w-6 h-6 opacity-0 group-hover:opacity-70 transition-opacity" style={{ color: textColor }} />
        )}
        {copied && (
          <span 
            className="absolute bottom-2 text-xs font-medium px-2 py-1 rounded"
            style={{ color: textColor, backgroundColor: 'rgba(0,0,0,0.2)' }}
          >
            コピーしました
          </span>
        )}
      </div>
      
      {/* 情報 */}
      <div className="p-3">
        <span className="text-xs text-slate-500">{label}</span>
        <div className="font-mono text-sm font-semibold text-slate-800 mt-1">
          {hex.toLowerCase()}
        </div>
        <div className="text-xs text-slate-500 mt-0.5">
          RGB({rgb.r}, {rgb.g}, {rgb.b})
        </div>
      </div>
    </div>
  );
}

// カラー詳細カードコンポーネント
interface ColorDetailCardProps {
  label: string;
  name: string;
  hex: string;
  effect: string;
  usage: string[];
}

function ColorDetailCard({ label, name, hex, effect, usage }: ColorDetailCardProps) {
  return (
    <div className="rounded-lg overflow-hidden bg-slate-50 border border-slate-200">
      <div className="h-4" style={{ backgroundColor: hex }} />
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-500">{label}</span>
          <span className="text-xs font-mono text-slate-500">{hex}</span>
        </div>
        <h4 className="text-base font-bold text-slate-800 mb-2">{name}</h4>
        <p className="text-sm text-slate-600 mb-3 leading-relaxed">{effect}</p>
        <div>
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
