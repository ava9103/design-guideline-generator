import * as cheerio from 'cheerio';

/**
 * ギャラリーサイトからLP参考事例を収集するスクレイパー
 * 
 * 対応サイト:
 * - LPアーカイブ (https://rdlp.jp/lp-archive)
 * - LP POCKET (https://lp-pocket.com/)
 * - LP advance (https://lp-advance.com/)
 */

export interface GalleryItem {
  title: string;
  url: string;
  thumbnailUrl?: string;
  source: string;
  industry?: string;
  style?: string;
  color?: string;
  description?: string;
}

export interface GallerySearchOptions {
  industry?: string;
  style?: string;
  color?: string;
  limit?: number;
}

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

/**
 * LPアーカイブから事例を取得
 */
async function scrapeLPArchive(options: GallerySearchOptions = {}): Promise<GalleryItem[]> {
  try {
    // 業界でフィルタリング可能なURL構築
    let url = 'https://rdlp.jp/lp-archive';
    const params = new URLSearchParams();
    
    if (options.industry) {
      // 業界名をカテゴリに変換
      const industryMap: Record<string, string> = {
        'IT・情報通信・アプリ': 'it-web',
        '小売・消費財・商品': 'ec-retail',
        '金融・証券・保険': 'finance',
        '不動産': 'real-estate',
        '病院・クリニック・サロン': 'beauty-health',
        '教育': 'education',
        '人材・採用': 'hr',
      };
      const category = industryMap[options.industry] || '';
      if (category) {
        params.append('category', category);
      }
    }
    
    if (options.color) {
      params.append('color', options.color);
    }
    
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    const response = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
    });

    if (!response.ok) {
      console.warn(`LPアーカイブの取得に失敗: ${response.status}`);
      return [];
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const items: GalleryItem[] = [];

    // LP事例アイテムを抽出
    $('.lp-item, .archive-item, article, [class*="card"]').each((_, el) => {
      const $el = $(el);
      
      const linkEl = $el.find('a').first();
      const link = linkEl.attr('href') || '';
      
      const titleEl = $el.find('h2, h3, .title, [class*="title"]').first();
      const title = titleEl.text().trim() || linkEl.attr('title') || '';
      
      const imgEl = $el.find('img').first();
      const thumbnailUrl = imgEl.attr('src') || imgEl.attr('data-src') || '';
      
      const categoryEl = $el.find('.category, [class*="category"], .tag').first();
      const industry = categoryEl.text().trim();

      if (title && link) {
        items.push({
          title,
          url: link.startsWith('http') ? link : `https://rdlp.jp${link}`,
          thumbnailUrl: thumbnailUrl.startsWith('http') ? thumbnailUrl : thumbnailUrl ? `https://rdlp.jp${thumbnailUrl}` : undefined,
          source: 'LPアーカイブ',
          industry,
        });
      }
    });

    return items.slice(0, options.limit || 10);
  } catch (error) {
    console.error('LPアーカイブのスクレイピングエラー:', error);
    return [];
  }
}

/**
 * LP POCKETから事例を取得
 */
async function scrapeLPPocket(options: GallerySearchOptions = {}): Promise<GalleryItem[]> {
  try {
    let url = 'https://lp-pocket.com/';
    
    if (options.industry) {
      // 業界名でカテゴリページを構築
      const industryMap: Record<string, string> = {
        'IT・情報通信・アプリ': 'it-saas',
        '小売・消費財・商品': 'ec',
        '金融・証券・保険': 'finance',
        '建築・不動産': 'real-estate',
        '病院・クリニック・サロン': 'beauty',
        '学校・資格・教育': 'education',
      };
      const category = industryMap[options.industry];
      if (category) {
        url += `category/${category}/`;
      }
    }

    const response = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
    });

    if (!response.ok) {
      console.warn(`LP POCKETの取得に失敗: ${response.status}`);
      return [];
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const items: GalleryItem[] = [];

    $('.post-item, article, .lp-card, [class*="entry"]').each((_, el) => {
      const $el = $(el);
      
      const linkEl = $el.find('a').first();
      const link = linkEl.attr('href') || '';
      
      const titleEl = $el.find('h2, h3, .title, .entry-title').first();
      const title = titleEl.text().trim();
      
      const imgEl = $el.find('img').first();
      const thumbnailUrl = imgEl.attr('src') || imgEl.attr('data-lazy-src') || '';

      if (title && link) {
        items.push({
          title,
          url: link.startsWith('http') ? link : `https://lp-pocket.com${link}`,
          thumbnailUrl: thumbnailUrl.startsWith('http') ? thumbnailUrl : undefined,
          source: 'LP POCKET',
        });
      }
    });

    return items.slice(0, options.limit || 10);
  } catch (error) {
    console.error('LP POCKETのスクレイピングエラー:', error);
    return [];
  }
}

/**
 * LP advanceから事例を取得
 */
async function scrapeLPAdvance(options: GallerySearchOptions = {}): Promise<GalleryItem[]> {
  try {
    let url = 'https://lp-advance.com/';
    
    if (options.industry) {
      const industryMap: Record<string, string> = {
        'IT・情報通信・アプリ': 'service',
        '小売・消費財・商品': 'product',
        '金融・証券・保険': 'finance',
        '病院・クリニック・サロン': 'beauty',
      };
      const category = industryMap[options.industry];
      if (category) {
        url += `category/${category}/`;
      }
    }

    const response = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
    });

    if (!response.ok) {
      console.warn(`LP advanceの取得に失敗: ${response.status}`);
      return [];
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const items: GalleryItem[] = [];

    $('article, .lp-item, [class*="post"]').each((_, el) => {
      const $el = $(el);
      
      const linkEl = $el.find('a').first();
      const link = linkEl.attr('href') || '';
      
      const titleEl = $el.find('h2, h3, .title').first();
      const title = titleEl.text().trim();
      
      const imgEl = $el.find('img').first();
      const thumbnailUrl = imgEl.attr('src') || imgEl.attr('data-src') || '';

      if (title && link) {
        items.push({
          title,
          url: link.startsWith('http') ? link : `https://lp-advance.com${link}`,
          thumbnailUrl: thumbnailUrl.startsWith('http') ? thumbnailUrl : undefined,
          source: 'LP advance',
        });
      }
    });

    return items.slice(0, options.limit || 10);
  } catch (error) {
    console.error('LP advanceのスクレイピングエラー:', error);
    return [];
  }
}

/**
 * 複数のギャラリーサイトから事例を並列取得
 */
export async function scrapeGallerySites(
  options: GallerySearchOptions = {}
): Promise<GalleryItem[]> {
  const limitPerSource = Math.ceil((options.limit || 15) / 3);
  
  const [lpArchive, lpPocket, lpAdvance] = await Promise.all([
    scrapeLPArchive({ ...options, limit: limitPerSource }),
    scrapeLPPocket({ ...options, limit: limitPerSource }),
    scrapeLPAdvance({ ...options, limit: limitPerSource }),
  ]);

  // 結果をマージして重複を除去
  const allItems = [...lpArchive, ...lpPocket, ...lpAdvance];
  const uniqueItems = allItems.filter(
    (item, index, self) =>
      index === self.findIndex((i) => i.url === item.url || i.title === item.title)
  );

  return uniqueItems.slice(0, options.limit || 15);
}

/**
 * 業界とコンセプトに基づいて類似のギャラリー事例を検索
 */
export async function findSimilarGalleryExamples(
  industry: string,
  conceptKeywords: string[],
  options: GallerySearchOptions = {}
): Promise<GalleryItem[]> {
  const items = await scrapeGallerySites({
    ...options,
    industry,
    limit: options.limit || 10,
  });

  // キーワードとのマッチングでスコアリング
  const scoredItems = items.map((item) => {
    let score = 0;
    const searchText = `${item.title} ${item.industry || ''} ${item.style || ''}`.toLowerCase();
    
    for (const keyword of conceptKeywords) {
      if (searchText.includes(keyword.toLowerCase())) {
        score += 1;
      }
    }
    
    // 同じ業界はボーナススコア
    if (item.industry && industry.includes(item.industry)) {
      score += 2;
    }
    
    return { ...item, score };
  });

  // スコア順にソート
  return scoredItems
    .sort((a, b) => b.score - a.score)
    .slice(0, options.limit || 10);
}

/**
 * ギャラリー事例をプロンプト用のテキストに変換
 */
export async function getGalleryDataForPrompt(
  industry?: string,
  limit: number = 10
): Promise<string> {
  const items = await scrapeGallerySites({ industry, limit });

  if (items.length === 0) {
    return 'ギャラリーサイトからの参考事例を取得できませんでした。';
  }

  return items
    .map(
      (item, i) =>
        `${i + 1}. ${item.title}\n   URL: ${item.url}\n   出典: ${item.source}${item.industry ? `\n   業界: ${item.industry}` : ''}`
    )
    .join('\n\n');
}
