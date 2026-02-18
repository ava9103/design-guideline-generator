import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Sparkles,
  Clock,
  UserX,
  Unlink,
  Search,
  Globe,
  Brain,
  Layers,
  FileText,
  Share2,
  Database,
  Zap,
  ArrowRight,
  Target,
  Lightbulb,
  Palette,
} from 'lucide-react';
import { FadeIn } from '@/components/ui/FadeIn';

export const metadata: Metadata = {
  title: 'LP Design Guideline Generator - AIによるLPデザインガイドライン自動生成',
  description:
    'URLを入力するだけで、競合分析・ペルソナ推定・デザイントレンド分析をAIが自動実行。根拠に基づいた3層構造のデザインガイドラインを生成し、制作プロセスの属人化を解消します。',
  openGraph: {
    title: 'LP Design Guideline Generator',
    description:
      'URLを入力するだけで、論理的なLPデザインガイドラインを自動生成。Web制作の提案力を高めるAIツール。',
    type: 'website',
  },
};

const painPoints = [
  {
    icon: Clock,
    title: 'ガイドライン策定に時間がかかる',
    description:
      '競合調査からデザイン方針の策定まで、毎回膨大な時間を費やしていませんか。',
  },
  {
    icon: UserX,
    title: 'デザイナーの経験に属人化',
    description:
      'ガイドラインの品質が担当者のスキルや経験に左右され、標準化が難しい。',
  },
  {
    icon: Unlink,
    title: '調査とデザインの接続が曖昧',
    description:
      '競合調査の結果をデザインに落とし込む過程で、根拠が薄れてしまう。',
  },
  {
    icon: Search,
    title: '参考事例探しに手間がかかる',
    description:
      'コンセプトに合った参考デザインを見つけるだけで、貴重な時間が消えていく。',
  },
];

const steps = [
  {
    number: '01',
    icon: Globe,
    title: 'URLを入力',
    description:
      '対象サイトのURLと業界カテゴリを入力。競合URLやターゲット情報も任意で追加できます。',
  },
  {
    number: '02',
    icon: Brain,
    title: 'AIが自動分析',
    description:
      'サイト構造分析、ビジネスモデル推定、ペルソナ推定、競合分析、トレンド分析を一括実行。',
  },
  {
    number: '03',
    icon: Layers,
    title: 'ガイドラインを生成',
    description:
      '分析結果に基づき、3層構造のデザインガイドラインをリアルタイムで生成します。',
  },
];

const layers = [
  {
    layer: 'Layer 1',
    icon: Target,
    title: 'デザインゴール',
    description: '競合との差別化ポイント、印象キーワード、ポジショニングマップ',
    detail: 'デザインで何を達成すべきかを明確化し、チーム全体の方向性を統一します。',
  },
  {
    layer: 'Layer 2',
    icon: Lightbulb,
    title: 'デザインコンセプト',
    description: 'コンセプトステートメント、設計原則、禁止事項',
    detail: 'ゴールを実現するための具体的な設計方針と、やるべきでないことを定義します。',
  },
  {
    layer: 'Layer 3',
    icon: Palette,
    title: 'デザインガイドライン',
    description: 'タイポグラフィ、カラー、ビジュアル、レイアウト、UIコンポーネント',
    detail: 'フォント名・HEX値・px値まで具体的に指定。そのまま制作に着手できます。',
  },
];

const features = [
  {
    icon: Brain,
    title: '7ステップAI分析',
    description: 'サイト構造からトレンドまで、7つの分析を自動実行',
  },
  {
    icon: Search,
    title: '競合サイト自動発見',
    description: 'Web検索APIで競合を自動特定し、デザイン戦略を比較分析',
  },
  {
    icon: Database,
    title: '24業種のナレッジベース',
    description: '業種別の最適なカラー・フォント・レイアウト戦略を内蔵',
  },
  {
    icon: Zap,
    title: 'リアルタイム生成',
    description: 'SSEストリーミングで分析の進捗をリアルタイムに表示',
  },
  {
    icon: FileText,
    title: 'PDF / PPTX エクスポート',
    description: '生成したガイドラインをPDFやPowerPointで即座にダウンロード',
  },
  {
    icon: Share2,
    title: '共有URL・履歴管理',
    description: 'ワンクリックで共有URLを発行。過去のガイドラインも一覧管理',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ──────── Header ──────── */}
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500">
              <Sparkles className="text-white" size={18} />
            </div>
            <span className="text-lg font-bold text-slate-800">
              LP Design Guideline Generator
            </span>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-lg transition-all"
          >
            無料で試す
            <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      {/* ──────── Hero ──────── */}
      <section className="py-24 md:py-32 lg:py-40">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <p className="text-sm font-medium text-emerald-600 tracking-wide mb-6">
              AI-Powered Design Guideline Generator
            </p>
          </FadeIn>
          <FadeIn delay={100}>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-tight">
              URLを入力するだけで、
              <br />
              論理的なデザインガイドラインを
              <br />
              <span className="gradient-text">自動生成</span>
            </h1>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="mt-8 text-base md:text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">
              競合分析・ペルソナ推定・デザイントレンド分析をAIが自動実行。
              <br className="hidden md:block" />
              根拠に基づいた3層構造のガイドラインを生成し、
              <br className="hidden md:block" />
              制作プロセスの属人化を解消します。
            </p>
          </FadeIn>
          <FadeIn delay={300}>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-lg transition-all shadow-lg shadow-emerald-500/20"
              >
                無料で試す
                <ArrowRight size={16} />
              </Link>
              <a
                href="#how-it-works"
                className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
              >
                使い方を見る
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ──────── Pain Points ──────── */}
      <section className="py-20 md:py-28 bg-slate-50/60">
        <div className="max-w-5xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-sm font-medium text-emerald-600 tracking-wide mb-3">
                Problem
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                デザインガイドライン策定の課題
              </h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {painPoints.map((point, i) => (
              <FadeIn key={point.title} delay={i * 100}>
                <div className="bg-white rounded-xl border border-slate-200 p-6 h-full">
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-lg bg-slate-100 shrink-0">
                      <point.icon size={20} className="text-slate-500" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-slate-800 mb-1.5">
                        {point.title}
                      </h3>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        {point.description}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── How It Works ──────── */}
      <section id="how-it-works" className="py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-sm font-medium text-emerald-600 tracking-wide mb-3">
                How It Works
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                3ステップで完了
              </h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step, i) => (
              <FadeIn key={step.number} delay={i * 150}>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 mb-5">
                    <step.icon size={24} className="text-white" />
                  </div>
                  <div className="text-xs font-bold text-emerald-500 tracking-widest mb-2">
                    STEP {step.number}
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── 3-Layer Output ──────── */}
      <section className="py-20 md:py-28 bg-slate-50/60">
        <div className="max-w-4xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-sm font-medium text-emerald-600 tracking-wide mb-3">
                Output
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                3層構造のデザインガイドライン
              </h2>
              <p className="mt-4 text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
                抽象的なゴールから具体的な数値指定まで、段階的にブレイクダウン。
                そのまま制作に着手できる精度で出力します。
              </p>
            </div>
          </FadeIn>

          <div className="space-y-4">
            {layers.map((layer, i) => (
              <FadeIn key={layer.layer} delay={i * 150}>
                <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                    <div className="flex items-center gap-3 md:w-56 shrink-0">
                      <div className="p-2.5 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500">
                        <layer.icon size={20} className="text-white" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-emerald-500 tracking-wider">
                          {layer.layer}
                        </div>
                        <h3 className="text-base font-bold text-slate-800">
                          {layer.title}
                        </h3>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-500 leading-relaxed mb-2">
                        {layer.detail}
                      </p>
                      <p className="text-xs text-slate-400">
                        {layer.description}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── Features ──────── */}
      <section className="py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-sm font-medium text-emerald-600 tracking-wide mb-3">
                Features
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                主要機能
              </h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <FadeIn key={feature.title} delay={i * 80}>
                <div className="rounded-xl border border-slate-200 p-6 h-full">
                  <div className="p-2.5 rounded-lg bg-emerald-50 w-fit mb-4">
                    <feature.icon size={20} className="text-emerald-600" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── CTA ──────── */}
      <section className="py-20 md:py-28 bg-slate-50/60">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
              デザインガイドラインの策定を、
              <br />
              もっと速く、もっと論理的に。
            </h2>
            <p className="text-sm text-slate-500 mb-10 max-w-lg mx-auto leading-relaxed">
              URLを入力するだけで、競合分析に基づいた3層構造のガイドラインを自動生成。
              提案の説得力を高め、制作の効率化を実現します。
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-lg transition-all shadow-lg shadow-emerald-500/20"
            >
              無料で試す
              <ArrowRight size={16} />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ──────── Footer ──────── */}
      <footer className="border-t border-slate-200 py-8">
        <div className="max-w-5xl mx-auto px-6 text-center text-slate-400 text-sm">
          <p>LP Design Guideline Generator</p>
        </div>
      </footer>
    </div>
  );
}
