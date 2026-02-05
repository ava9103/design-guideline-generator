/**
 * Brave Search API クライアント
 * 独自インデックスを持つ検索API
 * https://api-dashboard.search.brave.com/
 * 
 * 無料枠: 月2,000クエリ
 */

export interface BraveSearchResult {
  title: string;
  link: string;
  snippet: string;
  position: number;
}

export interface BraveWebResult {
  title: string;
  url: string;
  description: string;
  is_source_local?: boolean;
  is_source_both?: boolean;
}

export interface BraveSearchResponse {
  query: {
    original: string;
    altered?: string;
  };
  web?: {
    results: BraveWebResult[];
  };
  mixed?: {
    main: Array<{ type: string; index: number }>;
  };
}

export interface SearchOptions {
  country?: string;  // 国コード（デフォルト: jp）
  search_lang?: string;  // 言語（デフォルト: jp）※Brave APIは'ja'ではなく'jp'を使用
  count?: number;  // 結果数（デフォルト: 10、最大20）
  freshness?: string;  // 期間フィルター: pd(24h), pw(7d), pm(31d), py(1y)
}

const BRAVE_API_BASE = 'https://api.search.brave.com/res/v1/web/search';

/**
 * Brave Search APIでWeb検索を実行
 * @param query 検索クエリ
 * @param options 検索オプション
 * @returns 検索結果の配列
 */
export async function searchWithBrave(
  query: string,
  options?: SearchOptions
): Promise<BraveSearchResult[]> {
  const apiKey = process.env.BRAVE_API_KEY;

  if (!apiKey) {
    console.warn('BRAVE_API_KEY is not set. Brave Search is disabled.');
    return [];
  }

  const { country = 'jp', search_lang = 'jp', count = 10 } = options || {};

  try {
    const params = new URLSearchParams({
      q: query,
      country,
      search_lang,
      count: String(Math.min(count, 20)),  // 最大20
    });

    if (options?.freshness) {
      params.set('freshness', options.freshness);
    }

    const response = await fetch(`${BRAVE_API_BASE}?${params}`, {
      headers: {
        'X-Subscription-Token': apiKey,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Brave API error: ${response.status} ${response.statusText}`);
    }

    const data: BraveSearchResponse = await response.json();

    if (!data.web?.results) {
      console.warn('Brave Search: No web results found for query:', query);
      return [];
    }

    return data.web.results.map((result, index) => ({
      title: result.title,
      link: result.url,
      snippet: result.description || '',
      position: index + 1,
    }));
  } catch (error) {
    console.error('Brave Search error:', error);
    throw error;
  }
}

/**
 * 類似サイト（競合サイト）を検索
 * related: 演算子を使用してドメインに関連するサイトを取得
 * @param domain 対象ドメイン（URL）
 * @returns 類似サイトのURLリスト
 */
export async function searchRelatedSites(domain: string): Promise<string[]> {
  const apiKey = process.env.BRAVE_API_KEY;

  if (!apiKey) {
    console.warn('BRAVE_API_KEY is not set. Related sites search is disabled.');
    return [];
  }

  try {
    // ドメインからプロトコルとパスを除去
    let cleanDomain = domain;
    try {
      const url = new URL(domain.startsWith('http') ? domain : `https://${domain}`);
      cleanDomain = url.hostname;
    } catch {
      cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    }

    const params = new URLSearchParams({
      q: `related:${cleanDomain}`,
      count: '10',
      country: 'jp',
      search_lang: 'jp',
    });

    const response = await fetch(`${BRAVE_API_BASE}?${params}`, {
      headers: {
        'X-Subscription-Token': apiKey,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`Brave API error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data: BraveSearchResponse = await response.json();

    if (!data.web?.results || data.web.results.length === 0) {
      console.warn('Brave Search: No related sites found for domain:', cleanDomain);
      return [];
    }

    // URLからオリジンを抽出し、自サイトを除外して重複を排除
    const relatedUrls = new Set<string>();

    for (const result of data.web.results) {
      try {
        const resultUrl = new URL(result.url);
        const resultDomain = resultUrl.hostname;

        // 自サイトを除外
        if (!resultDomain.includes(cleanDomain) && !cleanDomain.includes(resultDomain)) {
          relatedUrls.add(resultUrl.origin);
        }
      } catch {
        // 無効なURLはスキップ
        continue;
      }
    }

    return Array.from(relatedUrls).slice(0, 5);
  } catch (error) {
    console.error('Brave Related Sites search error:', error);
    return [];
  }
}

/**
 * 競合サービスを検索
 * @param industry 業界名
 * @param serviceDescription サービスの説明
 * @returns 検索結果
 */
export async function searchCompetitorsWithBrave(
  industry: string,
  serviceDescription: string
): Promise<BraveSearchResult[]> {
  // 複数のクエリで検索して結果をマージ
  const queries = [
    `${industry} サービス 比較`,
    `${industry} おすすめ 企業`,
    `${serviceDescription} 競合`,
  ];

  const allResults: BraveSearchResult[] = [];
  const seenLinks = new Set<string>();

  for (const query of queries) {
    try {
      const results = await searchWithBrave(query, { count: 5 });
      for (const result of results) {
        // 重複を排除
        if (!seenLinks.has(result.link)) {
          seenLinks.add(result.link);
          allResults.push(result);
        }
      }
      // レート制限を避けるため少し待機（無料枠: 1クエリ/秒）
      await new Promise(resolve => setTimeout(resolve, 1100));
    } catch (error) {
      console.error(`Brave Search failed for query "${query}":`, error);
    }
  }

  return allResults;
}

/**
 * 業界のデザイントレンドを検索
 * @param industry 業界名
 * @returns 検索結果
 */
export async function searchDesignTrendsWithBrave(
  industry: string
): Promise<BraveSearchResult[]> {
  const queries = [
    `${industry} LP デザイン トレンド 2024`,
    `${industry} Webデザイン 事例`,
    `${industry} ランディングページ 参考`,
  ];

  const allResults: BraveSearchResult[] = [];
  const seenLinks = new Set<string>();

  for (const query of queries) {
    try {
      const results = await searchWithBrave(query, { count: 5 });
      for (const result of results) {
        if (!seenLinks.has(result.link)) {
          seenLinks.add(result.link);
          allResults.push(result);
        }
      }
      // レート制限を避けるため少し待機
      await new Promise(resolve => setTimeout(resolve, 1100));
    } catch (error) {
      console.error(`Brave Search failed for query "${query}":`, error);
    }
  }

  return allResults;
}
