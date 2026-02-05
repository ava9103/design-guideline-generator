import { callClaude, extractJSON } from '@/lib/claude';
import { analyzeSite } from '../site-analyzer';
import { searchRelatedSites } from '@/lib/search';
import { parseCompetitorDocuments, convertDocumentsToCompetitors } from './document-parser';
import type { AnalysisContext, CompetitorAnalysis, AnalysisStep, SiteAnalysis, CompetitorDocument } from '@/types';

// 競合を自動検出するプロンプト
const FIND_COMPETITORS_PROMPT = `
以下のサービスサイトの情報をもとに、競合となりそうなサービスを3件推定してください。

【対象サイト情報】
URL: {url}
タイトル: {title}
説明: {description}
業界: {industry}
主要な見出し: {headings}

【出力形式】
JSON配列で、各競合について以下を含めてください：

[
  {
    "name": "商品・サービス名",
    "url": "公式サイトまたはLPのURL",
    "reason": "競合と判断した理由"
  }
]

実在する商品・サービスのみを挙げてください。日本国内で利用可能な商品・サービスを優先してください。
JSONのみを出力してください。
`;

// 競合を詳細分析するプロンプト
const ANALYZE_COMPETITOR_PROMPT = `
以下の競合サイトを詳細分析してください。

【競合サイト情報】
URL: {url}
タイトル: {title}
説明: {description}
見出し: {headings}
CTA: {ctas}
使用フォント: {fonts}
使用カラー: {colors}
メインコンテンツ（抜粋）:
{content}

【対象サイト（比較用）】
URL: {targetUrl}
業界: {industry}

【分析の観点】
競合のポジショニングと訴求軸を把握し、デザインガイドライン策定の判断材料を収集してください。

訴求軸の分類基準：
- price: 安さ、コスパ、割引を強調
- authority: No.1実績、タレント起用、受賞歴、メディア掲載を強調
- design: ブランドイメージ、世界観、独自性を重視
- content: 情報量、網羅性、機能説明の充実
- campaign: 期間限定、特典、緊急性を強調

【出力形式】
以下のJSON形式で競合分析を出力してください：

{
  "name": "サービス名",
  "description": "サービス概要（1-2文）",
  "marketPosition": "リーダー または チャレンジャー または フォロワー または ニッチャー",
  "positioningType": "price または authority または design または content または campaign",
  "strengths": ["強み1", "強み2", "強み3"],
  "weaknesses": ["弱み1", "弱み2"],
  "design": {
    "overallTone": "デザイン全体のトーン（例：高級感、親しみやすさ、先進性、信頼感）",
    "colorScheme": {
      "primary": "#HEX値（メインカラー）",
      "secondary": "#HEX値（サブカラー）",
      "accent": "#HEX値（アクセントカラー）"
    },
    "typography": {
      "headingFont": "見出しフォント名",
      "bodyFont": "本文フォント名",
      "style": "モダン または クラシック または カジュアル"
    },
    "visualStyle": "ビジュアルスタイルの説明",
    "layoutPattern": "レイアウトパターン（例：1カラム、2カラム、カード型）"
  },
  "authorityElements": {
    "hasNo1Badge": true/false（No.1バッジや○○部門1位などの表示があるか）,
    "hasMediaLogos": true/false（TV、雑誌、有名メディアのロゴ掲載があるか）,
    "hasAwards": true/false（受賞歴の掲載があるか）,
    "clientCountDisplay": "number（導入社数を数字で強調）または logos（クライアントロゴ羅列）または none"
  },
  "testimonialStyle": {
    "photoType": "real（実写写真）または stock（素材写真）または icon（アイコン/イラスト）または none（写真なし）",
    "hasVideo": true/false（動画の体験談があるか）,
    "count": 掲載されている体験談の概数
  },
  "cvrElements": {
    "ctaStyle": "CTAのスタイル（例：目立つ色、テキストリンク）",
    "ctaPlacement": ["配置1", "配置2"],
    "ctaButtonStyle": "rounded（角丸）または square（四角）または gradient（グラデーション）または outline（枠線）",
    "hasMicroCopy": true/false（ボタン近くに「30秒で完了」等の補足テキストがあるか）,
    "trustElements": ["信頼性要素1", "信頼性要素2"],
    "urgencyTactics": ["緊急性訴求があれば記載"]
  },
  "differentiators": [
    {
      "category": "価格/品質/体験/信頼性/独自性/ターゲット特化/利便性 から選択",
      "point": "この競合の強み・差別化ポイント（具体的に）",
      "evidence": "LPでどう表現されているか（例：FVに「業界最安値」のバッジ）",
      "threat": "自社にとっての脅威度（high/medium/low）"
    }
  ],
  "weaknesses_detail": [
    {
      "area": "弱みの領域（デザイン/信頼性/価格/UX等）",
      "description": "具体的な弱み",
      "opportunity": "自社がこの弱みをどう攻略できるか"
    }
  ]
}

JSONのみを出力してください。
`;

interface CompetitorSuggestion {
  name: string;
  url: string;
  reason: string;
}

export async function findCompetitors(
  siteAnalysis: SiteAnalysis,
  industry: string
): Promise<CompetitorSuggestion[]> {
  const prompt = FIND_COMPETITORS_PROMPT
    .replace('{url}', siteAnalysis.url)
    .replace('{title}', siteAnalysis.title)
    .replace('{description}', siteAnalysis.description)
    .replace('{industry}', industry)
    .replace('{headings}', siteAnalysis.headings.map((h) => h.text).join(', '));

  const response = await callClaude(prompt, { maxTokens: 1500 });
  const result = extractJSON<CompetitorSuggestion[]>(response);

  return result || [];
}

export async function analyzeCompetitor(
  competitorSite: SiteAnalysis,
  context: AnalysisContext
): Promise<CompetitorAnalysis> {
  const { siteAnalysis, businessModel, industry } = context;

  const prompt = ANALYZE_COMPETITOR_PROMPT
    .replace('{url}', competitorSite.url)
    .replace('{title}', competitorSite.title)
    .replace('{description}', competitorSite.description)
    .replace('{headings}', competitorSite.headings.map((h) => h.text).join(', '))
    .replace('{ctas}', competitorSite.ctas.map((c) => c.text).join(', '))
    .replace('{fonts}', competitorSite.fonts.join(', ') || '不明')
    .replace('{colors}', competitorSite.colors.slice(0, 10).join(', ') || '不明')
    .replace('{content}', competitorSite.mainContent.slice(0, 2000))
    .replace('{targetUrl}', siteAnalysis?.url || '')
    // ユーザー指定の業界を優先
    .replace('{industry}', industry || businessModel?.industry || '不明');

  const response = await callClaude(prompt, { maxTokens: 2500 });
  const result = extractJSON<Omit<CompetitorAnalysis, 'url'>>(response);

  if (!result) {
    throw new Error('Failed to parse competitor analysis');
  }

  return {
    ...result,
    url: competitorSite.url,
  };
}

export const competitorStep: AnalysisStep = {
  name: '競合分析',
  description: '競合サイトを自動検出し、デザイン・戦略を詳細分析（手動資料にも対応）',
  isRequired: () => true,

  async execute(context) {
    const { 
      siteAnalysis, 
      businessModel, 
      industry, 
      competitorUrls,
      competitorDocuments,
      competitorImportMode,
    } = context;

    if (!siteAnalysis) {
      throw new Error('Site analysis is required for competitor analysis');
    }

    const competitors: CompetitorAnalysis[] = [];

    // Step 1: 手動アップロード資料の処理
    if (competitorDocuments && competitorDocuments.length > 0) {
      console.log(`Processing ${competitorDocuments.length} uploaded competitor documents...`);
      
      // 未解析のドキュメントを解析
      const pendingDocs = competitorDocuments.filter(
        (doc: CompetitorDocument) => doc.status === 'pending'
      );
      
      if (pendingDocs.length > 0) {
        const parsedDocs = await parseCompetitorDocuments(pendingDocs);
        
        // コンテキストのドキュメントを更新
        for (const parsedDoc of parsedDocs) {
          const index = competitorDocuments.findIndex(
            (doc: CompetitorDocument) => doc.id === parsedDoc.id
          );
          if (index !== -1) {
            competitorDocuments[index] = parsedDoc;
          }
        }
      }

      // 解析済みドキュメントから競合情報を抽出
      const docsForConversion = competitorDocuments.filter(
        (doc: CompetitorDocument) => doc.status === 'completed'
      );
      const docCompetitors = convertDocumentsToCompetitors(docsForConversion);
      competitors.push(...docCompetitors);

      console.log(`Extracted ${docCompetitors.length} competitors from uploaded documents`);
    }

    // Step 2: 手動資料のみモードの場合はここで終了
    if (competitorImportMode === 'manual_only') {
      console.log('Manual-only mode: skipping automatic competitor detection');
      return { 
        competitors,
        competitorDocuments, // 更新されたドキュメントを返す
      };
    }

    // Step 3: 自動検出（combine_with_autoモードまたはデフォルト）
    // 競合URLが指定されていない場合は自動検出
    let urlsToAnalyze = competitorUrls || [];

    // 既に十分な競合情報がある場合はスキップ
    const maxAutoCompetitors = 3 - competitors.length;
    if (maxAutoCompetitors <= 0) {
      console.log('Sufficient competitors from documents, skipping auto-detection');
      return { 
        competitors,
        competitorDocuments,
      };
    }

    if (urlsToAnalyze.length === 0) {
      // ユーザー指定の業界を優先（context.industryが先）
      const industryName = industry || businessModel?.industry || '不明';
      
      // まずBrave APIで類似サイトを検索（related:演算子を使用）
      console.log('Searching for related sites via Brave API...');
      const relatedSites = await searchRelatedSites(siteAnalysis.url);
      
      if (relatedSites.length > 0) {
        console.log(`Found ${relatedSites.length} related sites via Brave API`);
        urlsToAnalyze = relatedSites.slice(0, maxAutoCompetitors);
      }
      
      // Brave APIで見つからない、または不足分がある場合はClaude推定で補完
      if (urlsToAnalyze.length < maxAutoCompetitors) {
        console.log('Falling back to Claude for competitor suggestions...');
        const suggestions = await findCompetitors(siteAnalysis, industryName);
        const suggestedUrls = suggestions.map((s) => s.url);
        
        // 既存のURLと重複しないものを追加
        for (const url of suggestedUrls) {
          if (urlsToAnalyze.length >= maxAutoCompetitors) break;
          if (!urlsToAnalyze.includes(url)) {
            urlsToAnalyze.push(url);
          }
        }
      }
    } else {
      // 指定されたURLも制限
      urlsToAnalyze = urlsToAnalyze.slice(0, maxAutoCompetitors);
    }

    // 各競合サイトをスクレイピング
    const competitorSites: SiteAnalysis[] = [];
    for (const url of urlsToAnalyze) {
      try {
        const site = await analyzeSite(url);
        competitorSites.push(site);
      } catch (error) {
        console.error(`Failed to analyze competitor ${url}:`, error);
      }
    }

    // 各競合を詳細分析
    for (const site of competitorSites) {
      try {
        const analysis = await analyzeCompetitor(site, context);
        competitors.push(analysis);
      } catch (error) {
        console.error(`Failed to analyze competitor ${site.url}:`, error);
      }
    }

    return { 
      competitors,
      competitorDocuments, // 更新されたドキュメントを返す
    };
  },
};
