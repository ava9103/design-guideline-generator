import * as cheerio from 'cheerio';
import type { SiteAnalysis } from '@/types';

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

// サイト構造を分析する
export async function analyzeSite(url: string): Promise<SiteAnalysis> {
  try {
    // URLからHTMLを取得
    const response = await fetch(url, {
      headers: getBrowserHeaders(url),
      redirect: 'follow',
    });

    if (!response.ok) {
      // 403/503などのエラーの場合、空の分析結果を返す
      if (response.status === 403 || response.status === 503) {
        console.warn(`Site ${url} returned ${response.status}, returning partial analysis`);
        return createEmptyAnalysis(url, `サイトがアクセスをブロックしています (${response.status})`);
      }
      throw new Error(`Failed to fetch ${url}: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // タイトル
    const title = $('title').text().trim() || '';

    // メタディスクリプション
    const description =
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
      const title =
        $el.find('h2, h3').first().text().trim() || 'Untitled Section';
      const content = $el.text().trim().slice(0, 500);
      if (content.length > 50) {
        sections.push({ title, content });
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
