/**
 * 検索プロバイダーの抽象化レイヤー
 * 
 * 優先順位:
 * 1. Brave Search API (BRAVE_API_KEY が設定されている場合) - 無料枠: 月2,000クエリ
 * 2. Serper API (SERPER_API_KEY が設定されている場合)
 * 3. DuckDuckGo (APIキー不要、フォールバック)
 */

import {
  searchWithBrave,
  searchRelatedSites as searchRelatedSitesWithBrave,
  searchCompetitorsWithBrave,
  searchDesignTrendsWithBrave,
  type BraveSearchResult,
  type SearchOptions as BraveSearchOptions,
} from './brave';

import {
  searchWeb as searchWithSerper,
  searchCompetitors as searchCompetitorsWithSerper,
  searchDesignTrends as searchDesignTrendsWithSerper,
  searchCompanyInfo as searchCompanyInfoWithSerper,
  type SerperSearchResult,
  type SearchOptions as SerperSearchOptions,
} from './serper';

import {
  searchWithDuckDuckGo,
  searchCompetitorsWithDuckDuckGo,
  searchDesignTrendsWithDuckDuckGo,
  type SearchResult as DuckDuckGoSearchResult,
  type SearchOptions as DuckDuckGoSearchOptions,
} from './duckduckgo';

// 統一された検索結果の型
export interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  position: number;
}

export interface SearchOptions {
  num?: number;
}

// 使用中の検索プロバイダーを取得
export function getSearchProvider(): 'brave' | 'serper' | 'duckduckgo' {
  if (process.env.BRAVE_API_KEY) return 'brave';
  if (process.env.SERPER_API_KEY) return 'serper';
  return 'duckduckgo';
}

/**
 * Web検索を実行
 * Brave > Serper > DuckDuckGo の優先順位で使用
 */
export async function searchWeb(
  query: string,
  options?: SearchOptions
): Promise<SearchResult[]> {
  const provider = getSearchProvider();
  
  if (provider === 'brave') {
    return searchWithBrave(query, options as BraveSearchOptions);
  }
  
  if (provider === 'serper') {
    return searchWithSerper(query, options as SerperSearchOptions);
  }
  
  return searchWithDuckDuckGo(query, options as DuckDuckGoSearchOptions);
}

/**
 * 競合サービスを検索
 */
export async function searchCompetitors(
  industry: string,
  serviceDescription: string
): Promise<SearchResult[]> {
  const provider = getSearchProvider();
  
  if (provider === 'brave') {
    return searchCompetitorsWithBrave(industry, serviceDescription);
  }
  
  if (provider === 'serper') {
    return searchCompetitorsWithSerper(industry, serviceDescription);
  }
  
  return searchCompetitorsWithDuckDuckGo(industry, serviceDescription);
}

/**
 * デザイントレンドを検索
 */
export async function searchDesignTrends(
  industry: string
): Promise<SearchResult[]> {
  const provider = getSearchProvider();
  
  if (provider === 'brave') {
    return searchDesignTrendsWithBrave(industry);
  }
  
  if (provider === 'serper') {
    return searchDesignTrendsWithSerper(industry);
  }
  
  return searchDesignTrendsWithDuckDuckGo(industry);
}

/**
 * 企業・サービス情報を検索
 */
export async function searchCompanyInfo(
  companyName: string
): Promise<SearchResult[]> {
  const provider = getSearchProvider();
  
  if (provider === 'brave') {
    return searchWithBrave(`${companyName} 公式サイト`, { count: 5 });
  }
  
  if (provider === 'serper') {
    return searchCompanyInfoWithSerper(companyName);
  }
  
  // DuckDuckGoの場合は汎用検索を使用
  return searchWithDuckDuckGo(`${companyName} 公式サイト`, { num: 5 });
}

/**
 * 類似サイト（競合サイト）を検索
 * Brave APIの related: 演算子を使用
 * @param domain 対象ドメイン（URL）
 * @returns 類似サイトのURLリスト
 */
export async function searchRelatedSites(domain: string): Promise<string[]> {
  // Brave APIが設定されている場合のみ利用可能
  if (process.env.BRAVE_API_KEY) {
    return searchRelatedSitesWithBrave(domain);
  }
  
  // Brave API未設定の場合は空配列を返す（フォールバックはClaude推定を使用）
  console.warn('BRAVE_API_KEY is not set. Related sites search requires Brave API.');
  return [];
}

// 型のエクスポート
export type { BraveSearchResult, SerperSearchResult, DuckDuckGoSearchResult };
