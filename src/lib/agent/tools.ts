import type { AgentTool, AgentContext, ToolResult, CompetitorDocument } from '@/types';
import { analyzeSite } from '@/lib/analysis-engine/site-analyzer';
import { callClaude, extractJSON } from '@/lib/claude';
import { searchWeb, searchCompetitors as searchCompetitorsApi, searchDesignTrends } from '@/lib/search';
import { scrapeGallerySites, findSimilarGalleryExamples, type GalleryItem } from '@/lib/gallery-scraper';
import { parseCompetitorDocument, convertDocumentsToCompetitors } from '@/lib/analysis-engine/modules/document-parser';

// ツール定義
export const AGENT_TOOLS: AgentTool[] = [
  // Web検索ツール（汎用）
  {
    name: 'web_search',
    description: 'Google検索を実行し、最新の情報を取得します。競合調査、業界トレンド、デザイン事例などの情報収集に使用してください。',
    parameters: [
      {
        name: 'query',
        type: 'string',
        description: '検索クエリ（日本語可）',
        required: true,
      },
      {
        name: 'num_results',
        type: 'number',
        description: '取得する結果数（デフォルト: 10、最大: 20）',
        required: false,
      },
    ],
    async execute(params): Promise<ToolResult> {
      try {
        const query = params.query as string;
        const numResults = Math.min((params.num_results as number) || 10, 20);

        const results = await searchWeb(query, { num: numResults });

        if (results.length === 0) {
          return {
            success: false,
            error: 'Web検索が利用できません。SERPER_API_KEYが設定されていない可能性があります。',
            summary: 'Web検索機能が無効です',
          };
        }

        const formattedResults = results.map((r, i) => 
          `${i + 1}. ${r.title}\n   URL: ${r.link}\n   概要: ${r.snippet}`
        ).join('\n\n');

        return {
          success: true,
          data: results,
          summary: `「${query}」で${results.length}件の検索結果を取得しました:\n${formattedResults.slice(0, 1000)}`,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Web検索に失敗しました',
          summary: 'Web検索に失敗しました',
        };
      }
    },
  },


  // サイト分析ツール
  {
    name: 'analyze_site',
    description: 'URLからWebサイトの構造、コンテンツ、デザイン要素を詳細に分析します。対象サイトや競合サイトの分析に使用してください。',
    parameters: [
      {
        name: 'url',
        type: 'string',
        description: '分析対象のWebサイトURL',
        required: true,
      },
    ],
    async execute(params, context): Promise<ToolResult> {
      try {
        const url = params.url as string;
        const analysis = await analyzeSite(url);
        
        // 対象サイトの場合はコンテキストに保存
        if (url === context.targetUrl) {
          context.siteAnalysis = analysis;
        }

        return {
          success: true,
          data: analysis,
          summary: `サイト「${analysis.title}」を分析しました。見出し${analysis.headings.length}件、CTA${analysis.ctas.length}件、画像${analysis.images.length}件を検出。`,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'サイト分析に失敗しました',
          summary: `サイト分析に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`,
        };
      }
    },
  },

  // ビジネスモデル推定ツール
  {
    name: 'estimate_business_model',
    description: 'サイト分析結果からビジネスモデル（業界、サービス形態、ターゲット）を推定します。',
    parameters: [
      {
        name: 'site_analysis_summary',
        type: 'string',
        description: 'サイト分析の要約（タイトル、説明、主な見出し、コンテンツ概要）',
        required: true,
      },
    ],
    async execute(params, context): Promise<ToolResult> {
      try {
        const summary = params.site_analysis_summary as string;
        
        // ユーザー指定の業界情報を取得
        const userIndustry = context.industry;
        const userIndustryText = userIndustry 
          ? `「${userIndustry}」（ユーザーが明示的に指定 - これを最優先で使用してください）`
          : '指定なし（サイト情報から推定してください）';
        
        const prompt = `
以下のサイト情報から、ビジネスモデルを推定してJSON形式で出力してください：

【最重要：ユーザー指定の業界情報】
ユーザーが指定した業界: ${userIndustryText}

※ユーザーが業界を指定している場合は、その業界を必ず使用してください。
サイトコンテンツと異なっていても、ユーザー指定を最優先します。

【サイト情報】
${summary}

【業界別の典型的なビジネスモデル】
- ピラティス・ヨガ・フィットネス・パーソナルジム・美容サービス
  → 業界: 健康・フィットネス または 美容・ヘルスケアサービス, B2C
- クリニック・歯科・整体・医療
  → 業界: 医療・ヘルスケア, B2C
- IT・SaaS・ソフトウェア
  → 業界: IT・情報通信, B2B/B2C
- コンサルティング
  → 業界: 経営・コンサルティング, B2B

【出力形式】
{
  "industry": "業界名（ユーザー指定があればそれを使用）",
  "subCategory": "サブカテゴリ",
  "serviceType": "B2B または B2C または B2B2C または C2C",
  "revenueModel": "収益モデル",
  "productType": "サービス または 商品 または SaaS または マーケットプレイス または その他",
  "conversionGoal": "主なコンバージョン目標",
  "competitiveAdvantage": ["競合優位性1", "競合優位性2"]
}

JSONのみを出力してください。
`;

        const response = await callClaude(prompt, { maxTokens: 1000 });
        const businessModel = extractJSON(response);

        if (!businessModel) {
          throw new Error('ビジネスモデルの解析に失敗しました');
        }

        // ユーザー指定の業界を強制的に上書き（最優先）
        const typedBusinessModel = businessModel as typeof context.businessModel;
        if (userIndustry && typedBusinessModel) {
          typedBusinessModel.industry = userIndustry;
        }
        
        context.businessModel = typedBusinessModel;

        return {
          success: true,
          data: context.businessModel,
          summary: `ビジネスモデルを推定しました：業界「${context.businessModel?.industry}」、形態「${context.businessModel?.serviceType}」`,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'ビジネスモデル推定に失敗しました',
          summary: 'ビジネスモデル推定に失敗しました',
        };
      }
    },
  },

  // ペルソナ推定ツール
  {
    name: 'estimate_persona',
    description: 'サイト情報とビジネスモデルからターゲットペルソナを推定します。',
    parameters: [
      {
        name: 'context_summary',
        type: 'string',
        description: 'サイト情報とビジネスモデルの要約',
        required: true,
      },
    ],
    async execute(params, context): Promise<ToolResult> {
      try {
        const summary = params.context_summary as string;

        const prompt = `
以下の情報からターゲットペルソナを推定してJSON形式で出力してください：

${summary}

【出力形式】
{
  "primary": {
    "name": "ペルソナ名（例：経営課題に悩む中小企業経営者）",
    "age": "年齢層",
    "gender": "性別",
    "occupation": "職業",
    "income": "年収帯",
    "lifestyle": "ライフスタイル",
    "goals": ["目標1", "目標2"],
    "painPoints": ["課題1", "課題2"],
    "informationSources": ["情報源1", "情報源2"],
    "decisionFactors": ["意思決定要因1", "意思決定要因2"]
  },
  "psychographics": {
    "values": ["価値観1", "価値観2"],
    "concerns": ["関心事1", "関心事2"],
    "motivations": ["動機1", "動機2"]
  }
}

JSONのみを出力してください。
`;

        const response = await callClaude(prompt, { maxTokens: 1500 });
        const persona = extractJSON(response);

        if (!persona) {
          throw new Error('ペルソナの解析に失敗しました');
        }

        context.persona = persona as typeof context.persona;

        return {
          success: true,
          data: persona,
          summary: `ペルソナを推定しました：「${context.persona?.primary.name}」（${context.persona?.primary.age}、${context.persona?.primary.occupation}）`,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'ペルソナ推定に失敗しました',
          summary: 'ペルソナ推定に失敗しました',
        };
      }
    },
  },

  // 競合検索ツール（Web検索ベース）
  {
    name: 'search_competitors',
    description: '業界とサービス内容から競合サービスをWeb検索で発見します。実際のGoogle検索結果に基づいて競合を特定します。',
    parameters: [
      {
        name: 'industry',
        type: 'string',
        description: '業界名',
        required: true,
      },
      {
        name: 'service_description',
        type: 'string',
        description: 'サービスの説明',
        required: true,
      },
    ],
    async execute(params, context): Promise<ToolResult> {
      try {
        const { industry, service_description } = params as { industry: string; service_description: string };

        // Serper APIで実際のWeb検索を実行
        const searchResults = await searchCompetitorsApi(industry, service_description);

        if (searchResults.length === 0) {
          // Web検索が利用できない場合はLLMにフォールバック
          console.warn('Web検索が利用できないため、LLMによる推定を使用します');
          
          const prompt = `
以下の業界とサービスに対する競合を3件推定してJSON形式で出力してください：

業界: ${industry}
サービス: ${service_description}

【出力形式】
[
  {
    "name": "サービス名",
    "url": "公式サイトURL",
    "reason": "競合と判断した理由",
    "source": "LLM推定"
  }
]

実在するサービスのみを挙げてください。日本国内で利用可能なサービスを優先してください。
JSONのみを出力してください。
`;

          const response = await callClaude(prompt, { maxTokens: 1000 });
          const competitors = extractJSON<{ name: string; url: string; reason: string; source: string }[]>(response);

          if (!competitors) {
            throw new Error('競合の検索に失敗しました');
          }

          context.competitorUrls = competitors.map(c => c.url);

          return {
            success: true,
            data: competitors,
            summary: `競合を${competitors.length}件推定しました（LLM推定）：${competitors.map(c => c.name).join('、')}`,
          };
        }

        // Web検索結果からLLMで競合を特定
        const searchResultsSummary = searchResults
          .slice(0, 15)
          .map((r, i) => `${i + 1}. ${r.title}\n   URL: ${r.link}\n   概要: ${r.snippet}`)
          .join('\n\n');

        const prompt = `
以下はGoogle検索結果です。この中から「${service_description}」の競合となりうるサービス・企業を3件選んでJSON形式で出力してください。

【検索結果】
${searchResultsSummary}

【出力形式】
[
  {
    "name": "サービス名/企業名",
    "url": "公式サイトURL（検索結果から抽出）",
    "reason": "競合と判断した理由",
    "source": "Google検索"
  }
]

検索結果に含まれるサービス・企業のみを選んでください。比較サイトやまとめ記事ではなく、実際のサービス提供企業を選んでください。
JSONのみを出力してください。
`;

        const response = await callClaude(prompt, { maxTokens: 1500 });
        const competitors = extractJSON<{ name: string; url: string; reason: string; source: string }[]>(response);

        if (!competitors) {
          throw new Error('競合の特定に失敗しました');
        }

        // コンテキストに競合URLを保存
        context.competitorUrls = competitors.map(c => c.url);

        return {
          success: true,
          data: {
            competitors,
            rawSearchResults: searchResults.slice(0, 10),
          },
          summary: `Web検索により競合を${competitors.length}件発見しました：${competitors.map(c => c.name).join('、')}`,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : '競合検索に失敗しました',
          summary: '競合検索に失敗しました',
        };
      }
    },
  },

  // 競合詳細分析ツール
  {
    name: 'analyze_competitor',
    description: '競合サイトのデザインと戦略を詳細分析します。',
    parameters: [
      {
        name: 'competitor_url',
        type: 'string',
        description: '競合サイトのURL',
        required: true,
      },
      {
        name: 'target_context',
        type: 'string',
        description: '対象サイトのコンテキスト情報（比較用）',
        required: true,
      },
    ],
    async execute(params, context): Promise<ToolResult> {
      try {
        const { competitor_url, target_context } = params as { competitor_url: string; target_context: string };

        // まずサイトを分析
        const siteAnalysis = await analyzeSite(competitor_url);

        const prompt = `
以下の競合サイトを詳細分析してください：

【競合サイト情報】
URL: ${siteAnalysis.url}
タイトル: ${siteAnalysis.title}
説明: ${siteAnalysis.description}
見出し: ${siteAnalysis.headings.map(h => h.text).slice(0, 10).join(', ')}
CTA: ${siteAnalysis.ctas.map(c => c.text).slice(0, 5).join(', ')}
使用フォント: ${siteAnalysis.fonts.join(', ') || '不明'}
使用カラー: ${siteAnalysis.colors.slice(0, 10).join(', ') || '不明'}

【対象サイト（比較用）】
${target_context}

【出力形式】
{
  "name": "サービス名",
  "description": "サービス概要",
  "marketPosition": "リーダー または チャレンジャー または フォロワー または ニッチャー",
  "strengths": ["強み1", "強み2"],
  "weaknesses": ["弱み1", "弱み2"],
  "design": {
    "overallTone": "デザイン全体のトーン",
    "colorScheme": {
      "primary": "#HEX値",
      "secondary": "#HEX値",
      "accent": "#HEX値"
    },
    "typography": {
      "headingFont": "見出しフォント",
      "bodyFont": "本文フォント",
      "style": "モダン または クラシック または カジュアル"
    },
    "visualStyle": "ビジュアルスタイル",
    "layoutPattern": "レイアウトパターン"
  },
  "differentiators": ["差別化ポイント1", "差別化ポイント2"]
}

JSONのみを出力してください。
`;

        const response = await callClaude(prompt, { maxTokens: 2000 });
        const analysis = extractJSON(response);

        if (!analysis) {
          throw new Error('競合分析の解析に失敗しました');
        }

        // コンテキストに追加
        const competitorAnalysis = {
          ...(analysis as object),
          url: competitor_url,
        };
        
        if (!context.competitors) {
          context.competitors = [];
        }
        context.competitors.push(competitorAnalysis as typeof context.competitors[0]);

        return {
          success: true,
          data: competitorAnalysis,
          summary: `競合「${(analysis as { name: string }).name}」を分析しました：ポジション「${(analysis as { marketPosition: string }).marketPosition}」、トーン「${(analysis as { design: { overallTone: string } }).design.overallTone}」`,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : '競合分析に失敗しました',
          summary: '競合分析に失敗しました',
        };
      }
    },
  },

  // デザイントレンド分析ツール
  {
    name: 'analyze_design_trends',
    description: '業界のデザイントレンドと差別化機会を分析します。',
    parameters: [
      {
        name: 'industry',
        type: 'string',
        description: '業界名',
        required: true,
      },
      {
        name: 'competitor_designs',
        type: 'string',
        description: '競合のデザイン情報の要約',
        required: true,
      },
    ],
    async execute(params, context): Promise<ToolResult> {
      try {
        const { industry, competitor_designs } = params as { industry: string; competitor_designs: string };

        const prompt = `
以下の業界のデザイントレンドと差別化機会を分析してJSON形式で出力してください：

業界: ${industry}
競合のデザイン情報:
${competitor_designs}

【出力形式】
{
  "industry": "${industry}",
  "trends": {
    "colorTrends": ["カラートレンド1", "カラートレンド2"],
    "typographyTrends": ["フォントトレンド1", "フォントトレンド2"],
    "layoutTrends": ["レイアウトトレンド1", "レイアウトトレンド2"],
    "visualTrends": ["ビジュアルトレンド1", "ビジュアルトレンド2"]
  },
  "conventions": {
    "commonPatterns": ["一般的なパターン1", "一般的なパターン2"],
    "expectedElements": ["期待される要素1", "期待される要素2"],
    "typicalTone": "典型的なトーン"
  },
  "opportunities": {
    "underutilizedApproaches": ["活用されていないアプローチ1"],
    "emergingTrends": ["新興トレンド1"],
    "differentiationAngles": ["差別化の角度1", "差別化の角度2"]
  },
  "antiPatterns": ["避けるべきパターン1", "避けるべきパターン2"]
}

JSONのみを出力してください。
`;

        const response = await callClaude(prompt, { maxTokens: 2000 });
        const trends = extractJSON(response);

        if (!trends) {
          throw new Error('デザイントレンド分析の解析に失敗しました');
        }

        context.designTrend = trends as typeof context.designTrend;

        return {
          success: true,
          data: trends,
          summary: `デザイントレンドを分析しました。差別化機会：${context.designTrend?.opportunities.differentiationAngles.slice(0, 2).join('、')}`,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'デザイントレンド分析に失敗しました',
          summary: 'デザイントレンド分析に失敗しました',
        };
      }
    },
  },

  // ギャラリーサイト検索ツール
  {
    name: 'search_gallery_examples',
    description: 'LPギャラリーサイト（LPアーカイブ、LP POCKET等）から参考デザイン事例を検索します。業界やスタイルでフィルタリング可能です。',
    parameters: [
      {
        name: 'industry',
        type: 'string',
        description: '業界名（IT・情報通信・アプリ、小売・消費財・商品、金融・証券・保険など）',
        required: false,
      },
      {
        name: 'concept_keywords',
        type: 'string',
        description: 'デザインコンセプトのキーワード（カンマ区切り）',
        required: false,
      },
      {
        name: 'limit',
        type: 'number',
        description: '取得件数（デフォルト: 10、最大: 20）',
        required: false,
      },
    ],
    async execute(params, context): Promise<ToolResult> {
      try {
        const industry = params.industry as string | undefined;
        const conceptKeywordsStr = params.concept_keywords as string | undefined;
        const limit = Math.min((params.limit as number) || 10, 20);

        let items: GalleryItem[];

        if (conceptKeywordsStr) {
          const keywords = conceptKeywordsStr.split(',').map(k => k.trim());
          items = await findSimilarGalleryExamples(industry || '', keywords, { limit });
        } else {
          items = await scrapeGallerySites({ industry, limit });
        }

        if (items.length === 0) {
          return {
            success: false,
            error: 'ギャラリーサイトから事例を取得できませんでした',
            summary: '参考事例の取得に失敗しました',
          };
        }

        // コンテキストにギャラリー事例を保存
        if (!context.galleryExamples) {
          context.galleryExamples = [];
        }
        context.galleryExamples.push(...items);

        const formattedResults = items
          .map((item, i) => 
            `${i + 1}. ${item.title}\n   URL: ${item.url}\n   出典: ${item.source}${item.industry ? `\n   業界: ${item.industry}` : ''}`
          )
          .join('\n\n');

        return {
          success: true,
          data: items,
          summary: `ギャラリーサイトから${items.length}件の参考事例を取得しました:\n${formattedResults.slice(0, 1500)}`,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'ギャラリー検索に失敗しました',
          summary: 'ギャラリー検索に失敗しました',
        };
      }
    },
  },

  // 思考・推論ツール
  {
    name: 'think',
    description: '収集した情報を整理し、次のアクションを決定するために使用します。分析の途中経過や気づきを記録します。',
    parameters: [
      {
        name: 'thought',
        type: 'string',
        description: '現在の思考や気づき',
        required: true,
      },
    ],
    async execute(params, context): Promise<ToolResult> {
      const thought = params.thought as string;
      
      if (!context.insights) {
        context.insights = [];
      }
      context.insights.push(thought);

      return {
        success: true,
        data: { thought },
        summary: `思考を記録しました：${thought.slice(0, 100)}...`,
      };
    },
  },

  // 分析完了ツール
  {
    name: 'complete_analysis',
    description: '十分な情報が収集できたと判断した時に使用します。収集した情報の要約を出力します。',
    parameters: [
      {
        name: 'summary',
        type: 'string',
        description: '分析結果の要約',
        required: true,
      },
      {
        name: 'ready_for_guideline',
        type: 'boolean',
        description: 'ガイドライン生成の準備ができているかどうか',
        required: true,
      },
    ],
    async execute(params): Promise<ToolResult> {
      const { summary, ready_for_guideline } = params as { summary: string; ready_for_guideline: boolean };

      return {
        success: true,
        data: { summary, ready_for_guideline },
        summary: ready_for_guideline 
          ? `分析完了：${summary}` 
          : `追加分析が必要：${summary}`,
      };
    },
  },

  // 競合分析資料解析ツール
  {
    name: 'analyze_competitor_document',
    description: 'ユーザーがアップロードした競合分析資料（画像、PDF、テキスト）から情報を抽出し、競合分析データに変換します。',
    parameters: [
      {
        name: 'document_id',
        type: 'string',
        description: '解析対象ドキュメントのID',
        required: true,
      },
    ],
    async execute(params, context): Promise<ToolResult> {
      try {
        const documentId = params.document_id as string;

        // コンテキストからドキュメントを取得
        if (!context.competitorDocuments || context.competitorDocuments.length === 0) {
          return {
            success: false,
            error: 'アップロードされた競合分析資料がありません',
            summary: '競合分析資料がありません',
          };
        }

        const document = context.competitorDocuments.find((doc: CompetitorDocument) => doc.id === documentId);
        if (!document) {
          return {
            success: false,
            error: `ドキュメントが見つかりません: ${documentId}`,
            summary: 'ドキュメントが見つかりません',
          };
        }

        // ドキュメントを解析
        const parsedDoc = await parseCompetitorDocument(document);

        // コンテキストを更新
        const docIndex = context.competitorDocuments.findIndex((doc: CompetitorDocument) => doc.id === documentId);
        if (docIndex !== -1) {
          context.competitorDocuments[docIndex] = parsedDoc;
        }

        if (parsedDoc.status === 'error') {
          return {
            success: false,
            error: parsedDoc.error || '解析に失敗しました',
            summary: `ドキュメント「${document.fileName}」の解析に失敗しました`,
          };
        }

        // 解析済みドキュメントから競合分析データを生成
        const competitors = convertDocumentsToCompetitors([parsedDoc]);
        if (competitors.length > 0) {
          if (!context.competitors) {
            context.competitors = [];
          }
          context.competitors.push(...competitors);
        }

        return {
          success: true,
          data: parsedDoc.extractedInfo,
          summary: `ドキュメント「${document.fileName}」を解析しました。競合「${parsedDoc.extractedInfo?.name || '不明'}」の情報を抽出しました。`,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : '競合分析資料の解析に失敗しました',
          summary: '競合分析資料の解析に失敗しました',
        };
      }
    },
  },

  // 全競合分析資料一括解析ツール
  {
    name: 'analyze_all_competitor_documents',
    description: 'ユーザーがアップロードした全ての競合分析資料を一括で解析し、競合分析データに変換します。',
    parameters: [],
    async execute(_params, context): Promise<ToolResult> {
      try {
        // コンテキストからドキュメントを取得
        if (!context.competitorDocuments || context.competitorDocuments.length === 0) {
          return {
            success: false,
            error: 'アップロードされた競合分析資料がありません',
            summary: '競合分析資料がありません',
          };
        }

        // 未解析のドキュメントのみを対象
        const pendingDocs = context.competitorDocuments.filter(
          (doc: CompetitorDocument) => doc.status === 'pending'
        );

        if (pendingDocs.length === 0) {
          return {
            success: true,
            data: { message: 'すべてのドキュメントは解析済みです' },
            summary: 'すべてのドキュメントは解析済みです',
          };
        }

        // 各ドキュメントを解析
        const results: { success: number; error: number; names: string[] } = {
          success: 0,
          error: 0,
          names: [],
        };

        for (const doc of pendingDocs) {
          const parsedDoc = await parseCompetitorDocument(doc);
          
          // コンテキストを更新
          const docIndex = context.competitorDocuments.findIndex(
            (d: CompetitorDocument) => d.id === doc.id
          );
          if (docIndex !== -1) {
            context.competitorDocuments[docIndex] = parsedDoc;
          }

          if (parsedDoc.status === 'completed') {
            results.success++;
            results.names.push(parsedDoc.extractedInfo?.name || doc.fileName);
            
            // 競合分析データを追加
            const competitors = convertDocumentsToCompetitors([parsedDoc]);
            if (competitors.length > 0) {
              if (!context.competitors) {
                context.competitors = [];
              }
              context.competitors.push(...competitors);
            }
          } else {
            results.error++;
          }
        }

        return {
          success: true,
          data: results,
          summary: `${pendingDocs.length}件のドキュメントを解析しました。成功: ${results.success}件、エラー: ${results.error}件。競合: ${results.names.join('、')}`,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : '競合分析資料の一括解析に失敗しました',
          summary: '競合分析資料の一括解析に失敗しました',
        };
      }
    },
  },
];

// ツール名から実行関数を取得
export function getToolByName(name: string): AgentTool | undefined {
  return AGENT_TOOLS.find(tool => tool.name === name);
}

// ツール定義をLLM向けの形式に変換
export function getToolsForLLM(): string {
  return AGENT_TOOLS.map(tool => {
    const params = tool.parameters
      .map(p => `  - ${p.name} (${p.type}${p.required ? ', 必須' : ', 任意'}): ${p.description}`)
      .join('\n');
    
    return `### ${tool.name}
${tool.description}

パラメータ:
${params}`;
  }).join('\n\n');
}
