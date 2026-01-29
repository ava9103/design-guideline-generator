import * as cheerio from 'cheerio';

const WORKS_URL = 'https://conversion-labo.jp/works/';

export interface WorkItem {
  title: string;
  url: string;
  description: string;
  industry?: string;
  serviceType?: string;
  thumbnailUrl?: string;
}

// ポストスケイプの実績をスクレイピング
export async function scrapePostscapeWorks(): Promise<WorkItem[]> {
  try {
    const response = await fetch(WORKS_URL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${WORKS_URL}: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const works: WorkItem[] = [];

    // 実績アイテムを抽出
    $('article, .work-item, [class*="work"], [class*="case"]').each((_, el) => {
      const $el = $(el);

      // タイトル
      const titleEl = $el.find('h2, h3, .title, [class*="title"]').first();
      const title = titleEl.text().trim();

      // リンク
      const linkEl = $el.find('a').first();
      const url = linkEl.attr('href') || '';

      // 説明
      const descEl = $el.find('p, .description, .text, [class*="desc"]').first();
      const description = descEl.text().trim();

      // サムネイル
      const imgEl = $el.find('img').first();
      const thumbnailUrl = imgEl.attr('src') || imgEl.attr('data-src') || '';

      if (title && title.length > 5) {
        works.push({
          title,
          url: url.startsWith('http') ? url : `https://conversion-labo.jp${url}`,
          description: description.slice(0, 300),
          thumbnailUrl: thumbnailUrl.startsWith('http')
            ? thumbnailUrl
            : thumbnailUrl
              ? `https://conversion-labo.jp${thumbnailUrl}`
              : undefined,
        });
      }
    });

    // 重複を除去
    const uniqueWorks = works.filter(
      (work, index, self) =>
        index === self.findIndex((w) => w.title === work.title)
    );

    return uniqueWorks;
  } catch (error) {
    console.error('Error scraping Postscape works:', error);
    return [];
  }
}

// 実績データをテキスト形式で取得（プロンプト用）
export async function getWorksDataForPrompt(): Promise<string> {
  const works = await scrapePostscapeWorks();

  if (works.length === 0) {
    return 'ポストスケイプの実績情報を取得できませんでした。';
  }

  return works
    .slice(0, 20)
    .map(
      (w, i) =>
        `${i + 1}. ${w.title}\n   URL: ${w.url}\n   概要: ${w.description || '説明なし'}`
    )
    .join('\n\n');
}
