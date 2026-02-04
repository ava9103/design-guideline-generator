# Tech Stack

## デザインガイドライン生成エージェント

| Layer | Technology | Version | 備考 |
|-------|------------|---------|------|
| **Framework** | Next.js (App Router) | 16.1.6 | Server Components/Actions対応 |
| **Language** | TypeScript | 5.x | 型安全性確保 |
| **UI** | Tailwind CSS | 4.x | 最新版使用中 |
| **Components** | Lucide React | 0.563.0 | アイコン（shadcn/ui追加推奨） |
| **Forms** | React Hook Form | 7.71.1 | フォーム管理 |
| **Validation** | Zod | 4.3.6 | スキーマバリデーション |
| **Database** | Supabase (PostgreSQL) | 2.93.2 | BaaS + Vector Store対応 |
| **AI (Primary)** | Anthropic Claude | 0.71.2 | 高品質なガイドライン生成 |
| **AI (Secondary)** | HuggingFace + Novita | 4.13.10 | Llama-3.1-8B（軽量タスク用） |
| **AI (Vision)** | Google Generative AI | 0.24.1 | 画像解析・デザイン分析 |
| **Scraping** | Cheerio + Puppeteer | latest | LP分析・スクリーンショット |
| **Auth** | NextAuth | 4.24.13 | 認証 |
| **Export** | jspdf + pptxgenjs | latest | PDF/PPT出力 |

---

## 補足

### なぜこの構成？

| 選択 | 理由 |
|------|------|
| **Next.js 16 App Router** | Server Components でAI処理をサーバーサイドで実行、ストリーミングレスポンス対応 |
| **Supabase** | PostgreSQL + pgvector でナレッジベースのベクトル検索が可能。Prismaより設定が軽量 |
| **マルチAIプロバイダー** | Claude（高品質生成）、Gemini（Vision/画像分析）、Llama（軽量タスク）を用途別に使い分け |
| **Puppeteer + Cheerio** | 競合LPのスクリーンショット取得・DOM解析に必須 |
| **Zod + React Hook Form** | 型安全なフォームバリデーション、AIレスポンスのスキーマ検証 |
| **jspdf + pptxgenjs** | クライアント向けにガイドラインをPDF/PPTで出力可能 |

---

### 追加推奨

| 追加候補 | 理由 |
|----------|------|
| **shadcn/ui (Radix UI)** | アクセシブルで統一感のあるUIコンポーネント。現在はカスタムコンポーネントのみ |
| **Zustand** | クライアント側の状態管理（ガイドライン編集状態、ステップ進捗など） |
| **Vercel AI SDK** | ストリーミングレスポンスをより簡単に実装可能。現在のリトライロジックを置き換え可能 |

---

## AI活用のアーキテクチャ

```
┌─────────────────────────────────────────────────────────────┐
│                      AI Layer 構成                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   Claude    │    │   Gemini    │    │   Llama     │     │
│  │  (Primary)  │    │  (Vision)   │    │  (Light)    │     │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘     │
│         │                  │                  │             │
│         ▼                  ▼                  ▼             │
│  ┌──────────────────────────────────────────────────┐      │
│  │              用途別ルーティング                   │      │
│  ├──────────────────────────────────────────────────┤      │
│  │ • ガイドライン生成 → Claude（高品質・論理的）    │      │
│  │ • LP画像分析 → Gemini Vision（画像認識）         │      │
│  │ • 軽量分類タスク → Llama（コスト効率）           │      │
│  └──────────────────────────────────────────────────┘      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 依存関係一覧

### Production Dependencies

```json
{
  "@anthropic-ai/sdk": "^0.71.2",
  "@google/generative-ai": "^0.24.1",
  "@huggingface/inference": "^4.13.10",
  "@sparticuz/chromium": "^143.0.4",
  "@supabase/supabase-js": "^2.93.2",
  "cheerio": "^1.2.0",
  "groq-sdk": "^0.37.0",
  "html2canvas": "^1.4.1",
  "jspdf": "^4.0.0",
  "lucide-react": "^0.563.0",
  "marked": "^17.0.1",
  "nanoid": "^5.1.6",
  "next": "16.1.6",
  "next-auth": "^4.24.13",
  "pptxgenjs": "^4.0.1",
  "puppeteer-core": "^24.36.1",
  "react": "19.2.3",
  "react-dom": "19.2.3",
  "react-hook-form": "^7.71.1",
  "zod": "^4.3.6"
}
```

### Dev Dependencies

```json
{
  "@tailwindcss/postcss": "^4",
  "@types/node": "^20",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "eslint": "^9",
  "eslint-config-next": "16.1.6",
  "tailwindcss": "^4",
  "typescript": "^5"
}
```
