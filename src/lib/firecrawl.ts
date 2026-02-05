import Firecrawl from '@mendable/firecrawl-js';

// Firecrawlクライアントのシングルトンインスタンス
let firecrawlClient: Firecrawl | null = null;

/**
 * Firecrawlクライアントを取得
 * FIRECRAWL_API_KEYが設定されていない場合はnullを返す
 */
export function getFirecrawlClient(): Firecrawl | null {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  
  if (!apiKey) {
    return null;
  }
  
  if (!firecrawlClient) {
    firecrawlClient = new Firecrawl({ apiKey });
  }
  
  return firecrawlClient;
}

/**
 * Firecrawlが利用可能かどうかを確認
 */
export function isFirecrawlAvailable(): boolean {
  return !!process.env.FIRECRAWL_API_KEY;
}

export interface FirecrawlScrapeResult {
  success: boolean;
  markdown?: string;
  html?: string;
  metadata?: {
    title?: string;
    description?: string;
    language?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    [key: string]: unknown;
  };
  error?: string;
}

/**
 * URLからコンテンツをスクレイピング
 * JavaScript動的コンテンツにも対応
 */
export async function scrapeUrl(url: string): Promise<FirecrawlScrapeResult> {
  const client = getFirecrawlClient();
  
  if (!client) {
    return {
      success: false,
      error: 'FIRECRAWL_API_KEY is not configured',
    };
  }
  
  try {
    // Firecrawl v4+ uses 'scrape' instead of 'scrapeUrl' and returns Document directly
    const result = await client.scrape(url, {
      formats: ['markdown', 'html'],
    });
    
    // v4+ API returns the document directly, or throws on error
    return {
      success: true,
      markdown: result.markdown,
      html: result.html,
      metadata: result.metadata as FirecrawlScrapeResult['metadata'],
    };
  } catch (error) {
    console.error(`Firecrawl scraping error for ${url}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 複数のURLを並行してスクレイピング
 */
export async function scrapeUrls(urls: string[]): Promise<FirecrawlScrapeResult[]> {
  const results = await Promise.allSettled(
    urls.map((url) => scrapeUrl(url))
  );
  
  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    }
    return {
      success: false,
      error: `Failed to scrape ${urls[index]}: ${result.reason}`,
    };
  });
}
