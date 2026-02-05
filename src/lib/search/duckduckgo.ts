/**
 * DuckDuckGo 検索クライアント
 * APIキー不要で使用可能
 */

import { search, SafeSearchType } from 'duck-duck-scrape';

export interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  position: number;
}

export interface SearchOptions {
  region?: string;  // 地域（デフォルト: jp-ja）
  num?: number;     // 結果数（デフォルト: 10）
}

/**
 * DuckDuckGoでWeb検索を実行
 * @param query 検索クエリ
 * @param options 検索オプション
 * @returns 検索結果の配列
 */
export async function searchWithDuckDuckGo(
  query: string,
  options?: SearchOptions
): Promise<SearchResult[]> {
  const { region = 'jp-ja', num = 10 } = options || {};

  try {
    const results = await search(query, {
      safeSearch: SafeSearchType.MODERATE,
      locale: region,
    });

    if (!results.results || results.results.length === 0) {
      console.warn('DuckDuckGo: No results found for query:', query);
      return [];
    }

    return results.results.slice(0, num).map((result, index) => ({
      title: result.title || '',
      link: result.url || '',
      snippet: result.description || '',
      position: index + 1,
    }));
  } catch (error) {
    console.error('DuckDuckGo search error:', error);
    throw error;
  }
}

/**
 * 競合サービスを検索
 * @param industry 業界名
 * @param serviceDescription サービスの説明
 * @returns 検索結果
 */
export async function searchCompetitorsWithDuckDuckGo(
  industry: string,
  serviceDescription: string
): Promise<SearchResult[]> {
  // 複数のクエリで検索して結果をマージ
  const queries = [
    `${industry} サービス 比較`,
    `${industry} おすすめ 企業`,
    `${serviceDescription} 競合`,
  ];

  const allResults: SearchResult[] = [];
  const seenLinks = new Set<string>();

  for (const query of queries) {
    try {
      const results = await searchWithDuckDuckGo(query, { num: 5 });
      for (const result of results) {
        // 重複を排除
        if (!seenLinks.has(result.link)) {
          seenLinks.add(result.link);
          allResults.push(result);
        }
      }
      // レート制限を避けるため少し待機
      await new Promise(resolve => setTimeout(resolve, 500));
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
export async function searchDesignTrendsWithDuckDuckGo(
  industry: string
): Promise<SearchResult[]> {
  const queries = [
    `${industry} LP デザイン トレンド`,
    `${industry} Webデザイン 事例`,
    `${industry} ランディングページ 参考`,
  ];

  const allResults: SearchResult[] = [];
  const seenLinks = new Set<string>();

  for (const query of queries) {
    try {
      const results = await searchWithDuckDuckGo(query, { num: 5 });
      for (const result of results) {
        if (!seenLinks.has(result.link)) {
          seenLinks.add(result.link);
          allResults.push(result);
        }
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Search failed for query "${query}":`, error);
    }
  }

  return allResults;
}
