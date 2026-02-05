/**
 * Serper API クライアント
 * Google検索結果を取得するためのAPI
 * https://serper.dev/
 */

export interface SerperSearchResult {
  title: string;
  link: string;
  snippet: string;
  position: number;
}

export interface SerperOrganicResult {
  title: string;
  link: string;
  snippet: string;
  position: number;
  sitelinks?: {
    title: string;
    link: string;
  }[];
}

export interface SerperKnowledgeGraph {
  title?: string;
  type?: string;
  description?: string;
  attributes?: Record<string, string>;
}

export interface SerperResponse {
  searchParameters: {
    q: string;
    gl: string;
    hl: string;
    num: number;
  };
  organic: SerperOrganicResult[];
  knowledgeGraph?: SerperKnowledgeGraph;
  relatedSearches?: { query: string }[];
}

export interface SearchOptions {
  gl?: string;  // 国コード（デフォルト: jp）
  hl?: string;  // 言語（デフォルト: ja）
  num?: number; // 結果数（デフォルト: 10）
}

/**
 * Web検索を実行
 * @param query 検索クエリ
 * @param options 検索オプション
 * @returns 検索結果の配列
 */
export async function searchWeb(
  query: string,
  options?: SearchOptions
): Promise<SerperSearchResult[]> {
  const apiKey = process.env.SERPER_API_KEY;

  if (!apiKey) {
    console.warn('SERPER_API_KEY is not set. Web search is disabled.');
    return [];
  }

  const { gl = 'jp', hl = 'ja', num = 10 } = options || {};

  try {
    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: query,
        gl,
        hl,
        num,
      }),
    });

    if (!response.ok) {
      throw new Error(`Serper API error: ${response.status} ${response.statusText}`);
    }

    const data: SerperResponse = await response.json();

    return data.organic.map((result) => ({
      title: result.title,
      link: result.link,
      snippet: result.snippet,
      position: result.position,
    }));
  } catch (error) {
    console.error('Web search error:', error);
    throw error;
  }
}

/**
 * 競合サービスを検索
 * @param industry 業界名
 * @param serviceDescription サービスの説明
 * @returns 検索結果
 */
export async function searchCompetitors(
  industry: string,
  serviceDescription: string
): Promise<SerperSearchResult[]> {
  // 複数のクエリで検索して結果をマージ
  const queries = [
    `${industry} サービス 比較`,
    `${industry} おすすめ 企業`,
    `${serviceDescription} 競合`,
  ];

  const allResults: SerperSearchResult[] = [];
  const seenLinks = new Set<string>();

  for (const query of queries) {
    try {
      const results = await searchWeb(query, { num: 5 });
      for (const result of results) {
        // 重複を排除
        if (!seenLinks.has(result.link)) {
          seenLinks.add(result.link);
          allResults.push(result);
        }
      }
    } catch (error) {
      console.error(`Search failed for query "${query}":`, error);
    }
  }

  return allResults;
}

/**
 * 業界のデザイントレンドを検索
 * @param industry 業界名
 * @returns 検索結果
 */
export async function searchDesignTrends(
  industry: string
): Promise<SerperSearchResult[]> {
  const queries = [
    `${industry} LP デザイン トレンド 2024`,
    `${industry} Webデザイン 事例`,
    `${industry} ランディングページ 参考`,
  ];

  const allResults: SerperSearchResult[] = [];
  const seenLinks = new Set<string>();

  for (const query of queries) {
    try {
      const results = await searchWeb(query, { num: 5 });
      for (const result of results) {
        if (!seenLinks.has(result.link)) {
          seenLinks.add(result.link);
          allResults.push(result);
        }
      }
    } catch (error) {
      console.error(`Search failed for query "${query}":`, error);
    }
  }

  return allResults;
}

/**
 * 企業・サービス情報を検索
 * @param companyName 企業名またはサービス名
 * @returns 検索結果
 */
export async function searchCompanyInfo(
  companyName: string
): Promise<SerperSearchResult[]> {
  return searchWeb(`${companyName} 公式サイト`, { num: 5 });
}
