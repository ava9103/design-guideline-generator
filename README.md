# Design Guideline Generator

AIによるデザインガイドライン自動生成ツール

## 概要

URLを入力するだけで、競合分析・ペルソナ推定・デザイントレンド分析を自動実行し、3層構造の実務的なデザインガイドラインを生成します。

## 機能

### 自動分析機能
- **サイト構造分析**: 対象サイトのコンテンツ、構造、ビジュアル要素を詳細分析
- **ビジネスモデル推定**: 業界、サービス形態、収益モデルを自動推定
- **ペルソナ推定**: サイトコンテンツからターゲットユーザーを推定
- **競合分析**: 競合サイトを自動検出し、デザイン・戦略を詳細分析
- **デザイントレンド分析**: 業界のデザイントレンドと差別化機会を分析
- **CVR要素分析**: コンバージョン要素を分析し、改善提案を生成

### 3層構造のガイドライン
1. **第1層: デザインゴール** - 差別化ポイントと印象キーワード
2. **第2層: デザインコンセプト** - 原則と禁止事項
3. **第3層: デザインガイドライン** - フォント、配色、ビジュアルの具体的指針

### 出力機能
- Web画面表示
- PDF出力（準備中）
- PowerPoint出力（準備中）
- URL共有（準備中）

## 技術スタック

- **フロントエンド**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **バックエンド**: Next.js API Routes
- **AI**: Google Gemini 1.5 Flash（無料）
- **データベース**: Supabase (PostgreSQL + pgvector)
- **ホスティング**: Vercel

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`env.example` を参考に `.env.local` ファイルを作成してください。

```bash
cp env.example .env.local
```

必要な環境変数:

| 変数名 | 説明 |
|--------|------|
| `GOOGLE_GEMINI_API_KEY` | Google Gemini API キー（無料） |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase プロジェクト URL（オプション） |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名キー（オプション） |
| `UNSPLASH_ACCESS_KEY` | Unsplash API キー（参考画像用・オプション） |

### Google Gemini API キーの取得（無料）

1. https://aistudio.google.com/app/apikey にアクセス
2. Googleアカウントでログイン
3. 「Create API Key」をクリック
4. 生成されたAPIキーをコピー

### 3. データベースのセットアップ

Supabaseプロジェクトを作成し、`supabase/migrations/001_initial_schema.sql` を実行してください。

### 4. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 でアプリケーションにアクセスできます。

## 使い方

1. 対象サイトのURLを入力
2. （任意）業界、ターゲット、競合URLを入力
3. 「スマート分析を開始」をクリック
4. AI が自動で分析を実行し、デザインガイドラインを生成
5. 生成されたガイドラインを確認・共有

## ナレッジベース

以下のソースからナレッジを取得しています:

- **カラー戦略ガイド**: https://conversion-labo.jp/report/lp_design/14079/
- **フォント戦略ガイド**: https://conversion-labo.jp/report/lp_design/13649/
- **LP制作実績**: https://conversion-labo.jp/works/

## プロジェクト構造

```
src/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   │   └── generate/         # ガイドライン生成API
│   ├── page.tsx              # メインページ
│   ├── layout.tsx            # レイアウト
│   └── globals.css           # グローバルスタイル
├── components/
│   ├── forms/                # 入力フォーム
│   ├── report/               # レポート表示
│   └── ui/                   # UIコンポーネント
├── lib/
│   ├── analysis-engine/      # 分析エンジン
│   │   ├── modules/          # 各分析モジュール
│   │   ├── site-analyzer.ts  # サイト分析
│   │   └── index.ts          # エンジン統合
│   ├── prompts/              # LLMプロンプト
│   ├── claude.ts             # Claude API クライアント
│   ├── supabase.ts           # Supabase クライアント
│   ├── guideline-generator.ts # ガイドライン生成
│   └── works-scraper.ts      # 実績スクレイピング
└── types/                    # 型定義
```

## ライセンス

Private - All rights reserved
