import { GoogleGenerativeAI } from '@google/generative-ai';
import { callClaude, extractJSON } from '@/lib/claude';
import type { CompetitorDocument, CompetitorAnalysis } from '@/types';

// Gemini Vision API クライアント
function getGeminiClient() {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_GEMINI_API_KEY is not set');
  }
  return new GoogleGenerativeAI(apiKey);
}

// 競合情報抽出プロンプト
const EXTRACT_COMPETITOR_INFO_PROMPT = `
以下の競合分析資料から、競合サービスの情報を抽出してJSON形式で出力してください。

【資料内容】
{content}

【出力形式】
{
  "name": "サービス名（推測可能な場合）",
  "description": "サービス概要",
  "marketPosition": "リーダー または チャレンジャー または フォロワー または ニッチャー",
  "strengths": ["強み1", "強み2"],
  "weaknesses": ["弱み1", "弱み2"],
  "design": {
    "overallTone": "デザイン全体のトーン（例：高級感、親しみやすさ、先進性）",
    "colorScheme": {
      "primary": "#HEX値（推測）",
      "secondary": "#HEX値（推測）",
      "accent": "#HEX値（推測）"
    },
    "typography": {
      "headingFont": "見出しフォント（推測）",
      "bodyFont": "本文フォント（推測）",
      "style": "モダン または クラシック または カジュアル"
    },
    "visualStyle": "ビジュアルスタイルの説明",
    "layoutPattern": "レイアウトパターン"
  },
  "differentiators": ["差別化ポイント1", "差別化ポイント2"]
}

資料から読み取れる情報のみを抽出してください。不明な場合は「不明」と記載してください。
JSONのみを出力してください。
`;

// 画像解析プロンプト（Gemini Vision用）
const ANALYZE_IMAGE_PROMPT = `
この画像は競合サービスのWebサイトまたはLP（ランディングページ）のスクリーンショットです。
以下の観点で詳細に分析してください：

1. **サービス概要**: 何のサービス/商品か
2. **デザインの印象**: 全体的なトーン（高級感、親しみやすさ、先進性など）
3. **カラースキーム**: 使用されている主要な色（可能ならHEX値を推測）
4. **タイポグラフィ**: フォントの雰囲気、見出しと本文の関係
5. **レイアウト**: ページ構成、セクションの配置
6. **CTA（行動喚起）**: ボタンのデザイン、配置、テキスト
7. **信頼性要素**: 実績、お客様の声、認証バッジなど
8. **特徴的な要素**: 他と差別化されている点

できるだけ具体的に、デザイナーが参考にできる情報を抽出してください。
`;

/**
 * 画像を解析して競合情報を抽出
 */
export async function parseImage(
  imageBase64: string,
  mimeType: string = 'image/png'
): Promise<string> {
  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent([
      ANALYZE_IMAGE_PROMPT,
      {
        inlineData: {
          data: imageBase64,
          mimeType,
        },
      },
    ]);

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Image parsing error:', error);
    throw new Error(`画像の解析に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
  }
}

/**
 * PDFを解析して競合情報を抽出
 * 注意: pdf-parseパッケージが必要
 */
export async function parsePDF(pdfBuffer: Buffer): Promise<string> {
  try {
    // pdf-parseは動的インポート（サーバーサイドのみ）
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require('pdf-parse') as (buffer: Buffer) => Promise<{ text: string }>;
    const data = await pdfParse(pdfBuffer);
    
    // テキストが少ない場合（画像主体のPDF）は警告
    if (data.text.trim().length < 100) {
      console.warn('PDF contains minimal text, may be image-based');
    }
    
    return data.text;
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error(`PDFの解析に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
  }
}

/**
 * テキスト/Markdownを解析
 */
export function parseText(content: string): string {
  // Markdownの場合、コードブロックや特殊記法を処理
  let cleanContent = content
    .replace(/```[\s\S]*?```/g, '') // コードブロック除去
    .replace(/!\[.*?\]\(.*?\)/g, '') // 画像リンク除去
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // リンクをテキストに
    .replace(/#{1,6}\s+/g, '') // 見出し記号除去
    .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, '$1') // 太字/斜体除去
    .trim();

  return cleanContent;
}

/**
 * 抽出したテキストから競合情報を構造化
 */
export async function extractCompetitorInfo(
  content: string,
  sourceType: 'image' | 'pdf' | 'text'
): Promise<Partial<CompetitorAnalysis>> {
  const prompt = EXTRACT_COMPETITOR_INFO_PROMPT.replace('{content}', content.slice(0, 8000));

  const response = await callClaude(prompt, { maxTokens: 2000 });
  const result = extractJSON<Partial<CompetitorAnalysis>>(response);

  if (!result) {
    throw new Error('競合情報の構造化に失敗しました');
  }

  return result;
}

/**
 * ドキュメントを解析して競合情報を抽出するメイン関数
 */
export async function parseCompetitorDocument(
  document: CompetitorDocument
): Promise<CompetitorDocument> {
  try {
    let extractedText: string;

    switch (document.fileType) {
      case 'image':
        if (!document.imageBase64) {
          throw new Error('画像データがありません');
        }
        // Base64からMIMEタイプを推測
        const mimeType = document.fileName.endsWith('.png')
          ? 'image/png'
          : document.fileName.endsWith('.webp')
          ? 'image/webp'
          : 'image/jpeg';
        extractedText = await parseImage(document.imageBase64, mimeType);
        break;

      case 'pdf':
        if (!document.content) {
          throw new Error('PDFデータがありません');
        }
        // Base64からBufferに変換
        const pdfBuffer = Buffer.from(document.content, 'base64');
        extractedText = await parsePDF(pdfBuffer);
        break;

      case 'text':
        if (!document.content) {
          throw new Error('テキストデータがありません');
        }
        extractedText = parseText(document.content);
        break;

      default:
        throw new Error(`未対応のファイル形式: ${document.fileType}`);
    }

    // 抽出したテキストから競合情報を構造化
    const extractedInfo = await extractCompetitorInfo(extractedText, document.fileType);

    return {
      ...document,
      content: extractedText,
      extractedInfo,
      status: 'completed',
    };
  } catch (error) {
    console.error(`Document parsing error for ${document.fileName}:`, error);
    return {
      ...document,
      status: 'error',
      error: error instanceof Error ? error.message : '不明なエラー',
    };
  }
}

/**
 * 複数のドキュメントを並行して解析
 */
export async function parseCompetitorDocuments(
  documents: CompetitorDocument[]
): Promise<CompetitorDocument[]> {
  const results = await Promise.allSettled(
    documents.map((doc) => parseCompetitorDocument(doc))
  );

  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      return {
        ...documents[index],
        status: 'error' as const,
        error: result.reason?.message || '解析に失敗しました',
      };
    }
  });
}

/**
 * 解析済みドキュメントからCompetitorAnalysis配列を生成
 */
export function convertDocumentsToCompetitors(
  documents: CompetitorDocument[]
): CompetitorAnalysis[] {
  return documents
    .filter((doc) => doc.status === 'completed' && doc.extractedInfo)
    .map((doc) => {
      const info = doc.extractedInfo!;
      return {
        name: info.name || doc.fileName.replace(/\.[^.]+$/, ''),
        url: info.url || '',
        description: info.description || '',
        marketPosition: info.marketPosition || 'フォロワー',
        strengths: info.strengths || [],
        weaknesses: info.weaknesses || [],
        design: info.design || {
          overallTone: '不明',
          colorScheme: { primary: '#000000', secondary: '#ffffff', accent: '#0066cc' },
          typography: { headingFont: '不明', bodyFont: '不明', style: 'モダン' },
          visualStyle: '不明',
          layoutPattern: '不明',
        },
        cvrElements: info.cvrElements || {
          ctaStyle: '不明',
          ctaPlacement: [],
          trustElements: [],
          urgencyTactics: [],
        },
        differentiators: info.differentiators || [],
      } as CompetitorAnalysis;
    });
}
