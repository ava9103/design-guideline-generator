import * as cheerio from 'cheerio';
import type { SiteAnalysis } from '@/types';
import { isFirecrawlAvailable, scrapeUrl as firecrawlScrape } from '@/lib/firecrawl';

// 空の分析結果を生成（エラー時のフォールバック）
function createEmptyAnalysis(url: string, reason?: string): SiteAnalysis {
  return {
    url,
    title: reason || 'サイトを取得できませんでした',
    description: '',
    headings: [],
    sections: [],
    ctas: [],
    trustElements: {
      testimonials: false,
      clientLogos: false,
      certifications: false,
      statistics: false,
      mediaFeatures: false,
    },
    images: [],
    videos: false,
    animations: false,
    fonts: [],
    colors: [],
    mainContent: '',
  };
}

// サイト分析結果の品質スコアを計算（0-100）
export function calculateAnalysisQuality(analysis: SiteAnalysis): {
  score: number;
  issues: string[];
} {
  const issues: string[] = [];
  let score = 100;

  // タイトルのチェック
  if (!analysis.title || analysis.title.includes('取得できませんでした') || analysis.title.includes('分析に失敗')) {
    score -= 30;
    issues.push('サイトタイトルが取得できませんでした');
  }

  // メインコンテンツのチェック
  if (!analysis.mainContent || analysis.mainContent.length < 100) {
    score -= 40;
    issues.push('サイトのメインコンテンツが取得できませんでした（JavaScriptで動的に生成されている可能性があります）');
  } else if (analysis.mainContent.length < 500) {
    score -= 20;
    issues.push('サイトのコンテンツが少なく、分析精度が低下する可能性があります');
  }

  // 見出しのチェック
  if (analysis.headings.length === 0) {
    score -= 15;
    issues.push('見出し（h1-h4）が取得できませんでした');
  }

  // CTAのチェック
  if (analysis.ctas.length === 0) {
    score -= 10;
    issues.push('CTAボタンが検出できませんでした');
  }

  // 説明文のチェック
  if (!analysis.description) {
    score -= 5;
    issues.push('メタディスクリプションが設定されていません');
  }

  return {
    score: Math.max(0, score),
    issues,
  };
}

// ブラウザのようなヘッダーを生成
function getBrowserHeaders(url: string): HeadersInit {
  const referer = new URL(url).origin;
  return {
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept':
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'ja,en-US;q=0.9,en;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"macOS"',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Upgrade-Insecure-Requests': '1',
    'Referer': referer,
  };
}

// HTMLをパースして分析結果を抽出する共通関数
function parseHtmlContent(
  url: string,
  html: string,
  metadata?: { title?: string; description?: string }
): SiteAnalysis {
  const $ = cheerio.load(html);

  // タイトル（メタデータがあれば優先）
  const title = metadata?.title || $('title').text().trim() || '';

  // メタディスクリプション（メタデータがあれば優先）
  const description =
    metadata?.description ||
    $('meta[name="description"]').attr('content')?.trim() ||
    $('meta[property="og:description"]').attr('content')?.trim() ||
    '';

  // 見出し抽出
  const headings: { level: number; text: string }[] = [];
  $('h1, h2, h3, h4').each((_, el) => {
    const $el = $(el);
    const text = $el.text().trim();
    if (text && text.length < 200) {
      const tagName = el.tagName.toLowerCase();
      const level = parseInt(tagName.replace('h', ''), 10);
      headings.push({ level, text });
    }
  });

  // セクション抽出
  const sections: { title: string; content: string }[] = [];
  $('section, .section, [class*="section"], article').each((_, el) => {
    const $el = $(el);
    const sectionTitle =
      $el.find('h2, h3').first().text().trim() || 'Untitled Section';
    const content = $el.text().trim().slice(0, 500);
    if (content.length > 50) {
      sections.push({ title: sectionTitle, content });
    }
  });

  // CTA抽出
  const ctas: { text: string; type: 'primary' | 'secondary'; location: string }[] = [];
  const ctaSelectors =
    'button, .btn, .cta, [class*="button"], [class*="btn"], a[href*="contact"], a[href*="apply"], a[href*="signup"], a[href*="register"]';
  $(ctaSelectors).each((_, el) => {
    const $el = $(el);
    const text = $el.text().trim();
    if (text && text.length < 50 && text.length > 1) {
      const isPrimary =
        $el.hasClass('primary') ||
        $el.hasClass('main') ||
        $el.attr('class')?.includes('primary');
      ctas.push({
        text,
        type: isPrimary ? 'primary' : 'secondary',
        location: 'body',
      });
    }
  });

  // 信頼性要素
  const trustElements = {
    testimonials:
      $('[class*="testimonial"], [class*="review"], [class*="voice"]')
        .length > 0,
    clientLogos:
      $('[class*="client"], [class*="partner"], [class*="logo"]').length > 0,
    certifications:
      $('[class*="certif"], [class*="award"], [class*="badge"]').length > 0,
    statistics:
      $('[class*="stat"], [class*="number"], [class*="achievement"]').length >
      0,
    mediaFeatures:
      $('[class*="media"], [class*="press"], [class*="feature"]').length > 0,
  };

  // 画像抽出
  const images: { src: string; alt: string; context: string }[] = [];
  $('img').each((_, el) => {
    const $el = $(el);
    const src = $el.attr('src') || $el.attr('data-src') || '';
    const alt = $el.attr('alt') || '';
    if (src && !src.includes('data:image')) {
      images.push({
        src: src.startsWith('http') ? src : new URL(src, url).href,
        alt,
        context: $el.parent().text().trim().slice(0, 100),
      });
    }
  });

  // ビデオ存在チェック
  const videos =
    $('video, iframe[src*="youtube"], iframe[src*="vimeo"]').length > 0;

  // アニメーション存在チェック
  const animations =
    $('[class*="animate"], [class*="motion"], [class*="fade"]').length > 0;

  // フォント抽出（CSSから）
  const fonts: string[] = [];
  $('link[href*="fonts.google"], link[href*="typekit"]').each((_, el) => {
    const href = $(el).attr('href') || '';
    const fontMatch = href.match(/family=([^&:]+)/);
    if (fontMatch) {
      fonts.push(decodeURIComponent(fontMatch[1].replace(/\+/g, ' ')));
    }
  });

  // スタイルタグからフォントを探す
  $('style').each((_, el) => {
    const styleContent = $(el).html() || '';
    const fontFamilyMatch = styleContent.match(
      /font-family:\s*['"]?([^'";,}]+)/g
    );
    if (fontFamilyMatch) {
      fontFamilyMatch.forEach((match) => {
        const fontName = match.replace(/font-family:\s*['"]?/, '').trim();
        if (fontName && !fonts.includes(fontName)) {
          fonts.push(fontName);
        }
      });
    }
  });

  // カラー抽出（限定的）
  const colors: string[] = [];
  const colorPatterns = /#[0-9A-Fa-f]{3,6}|rgb\([^)]+\)|rgba\([^)]+\)/g;
  $('style').each((_, el) => {
    const styleContent = $(el).html() || '';
    const colorMatches = styleContent.match(colorPatterns);
    if (colorMatches) {
      colorMatches.forEach((color) => {
        if (!colors.includes(color)) {
          colors.push(color);
        }
      });
    }
  });

  // メインコンテンツ
  const mainContent =
    $('main, article, .content, #content, .main').text().trim() ||
    $('body').text().trim();

  return {
    url,
    title,
    description,
    headings: headings.slice(0, 30),
    sections: sections.slice(0, 10),
    ctas: [...new Map(ctas.map((c) => [c.text, c])).values()].slice(0, 15),
    trustElements,
    images: images.slice(0, 20),
    videos,
    animations,
    fonts: [...new Set(fonts)].slice(0, 10),
    colors: [...new Set(colors)].slice(0, 30),
    mainContent: mainContent.slice(0, 10000),
  };
}

// 従来のfetch+cheerioでスクレイピング（フォールバック用）
async function fetchWithCheerio(url: string): Promise<{ html: string } | null> {
  try {
    const response = await fetch(url, {
      headers: getBrowserHeaders(url),
      redirect: 'follow',
    });

    if (!response.ok) {
      if (response.status === 403 || response.status === 503) {
        console.warn(`Site ${url} returned ${response.status}`);
        return null;
      }
      throw new Error(`Failed to fetch ${url}: ${response.status}`);
    }

    const html = await response.text();
    return { html };
  } catch (error) {
    console.error(`Fetch error for ${url}:`, error);
    return null;
  }
}

// サイト構造を分析する
export async function analyzeSite(url: string): Promise<SiteAnalysis> {
  try {
    // Firecrawlが利用可能な場合は優先的に使用
    if (isFirecrawlAvailable()) {
      console.log(`Using Firecrawl for ${url}`);
      const firecrawlResult = await firecrawlScrape(url);
      
      if (firecrawlResult.success && firecrawlResult.html) {
        console.log(`Firecrawl successfully scraped ${url}`);
        return parseHtmlContent(url, firecrawlResult.html, {
          title: firecrawlResult.metadata?.title || firecrawlResult.metadata?.ogTitle,
          description: firecrawlResult.metadata?.description || firecrawlResult.metadata?.ogDescription,
        });
      } else {
        console.warn(`Firecrawl failed for ${url}: ${firecrawlResult.error}, falling back to fetch`);
      }
    }

    // Firecrawlが利用できない、または失敗した場合は従来の方法を使用
    console.log(`Using fetch+cheerio for ${url}`);
    const fetchResult = await fetchWithCheerio(url);
    
    if (!fetchResult) {
      return createEmptyAnalysis(url, 'サイトの取得に失敗しました');
    }

    return parseHtmlContent(url, fetchResult.html);
  } catch (error) {
    console.error(`Error analyzing site ${url}:`, error);
    // エラーが発生しても処理を継続できるよう、空の分析結果を返す
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return createEmptyAnalysis(url, `分析に失敗: ${errorMessage}`);
  }
}

// 複数のURLを並行して分析
export async function analyzeSites(urls: string[]): Promise<SiteAnalysis[]> {
  const results = await Promise.allSettled(urls.map((url) => analyzeSite(url)));

  return results
    .filter(
      (result): result is PromiseFulfilledResult<SiteAnalysis> =>
        result.status === 'fulfilled'
    )
    .map((result) => result.value);
}
