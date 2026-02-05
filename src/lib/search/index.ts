/**
 * 検索プロバイダーの抽象化レイヤー
 * 
 * 優先順位:
 * 1. Serper API (SERPER_API_KEY が設定されている場合)
 * 2. DuckDuckGo (APIキー不要、フォールバック)
 */

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
export function getSearchProvider(): 'serper' | 'duckduckgo' {
  return process.env.SERPER_API_KEY ? 'serper' : 'duckduckgo';
}

/**
 * Web検索を実行
 * Serper APIが設定されていればSerperを使用、なければDuckDuckGoを使用
 */
export async function searchWeb(
  query: string,
  options?: SearchOptions
): Promise<SearchResult[]> {
  const provider = getSearchProvider();
  
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
  
  if (provider === 'serper') {
    return searchCompanyInfoWithSerper(companyName);
  }
  
  // DuckDuckGoの場合は汎用検索を使用
  return searchWithDuckDuckGo(`${companyName} 公式サイト`, { num: 5 });
}

// 型のエクスポート
export type { SerperSearchResult, DuckDuckGoSearchResult };
