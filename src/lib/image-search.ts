/**
 * 参考画像検索サービス
 * 
 * Unsplash APIを使用して、デザインガイドラインに適した参考画像を取得します。
 * APIキーがない場合はプレースホルダー画像を返します。
 */

export interface ReferenceImage {
  url: string;
  thumbnail: string;
  alt: string;
  credit?: {
    name: string;
    link: string;
  };
}

export interface ImageSearchOptions {
  query: string;
  count?: number;
  orientation?: 'landscape' | 'portrait' | 'squarish';
}

const UNSPLASH_API_URL = 'https://api.unsplash.com';

/**
 * Unsplash APIで画像を検索
 */
async function searchUnsplash(
  query: string,
  options: { count?: number; orientation?: string } = {}
): Promise<ReferenceImage[]> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  
  if (!accessKey) {
    console.warn('UNSPLASH_ACCESS_KEY が設定されていません。プレースホルダー画像を使用します。');
    return generatePlaceholderImages(query, options.count || 3);
  }

  try {
    const params = new URLSearchParams({
      query,
      per_page: String(options.count || 3),
      orientation: options.orientation || 'landscape',
    });

    const response = await fetch(
      `${UNSPLASH_API_URL}/search/photos?${params}`,
      {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
        },
      }
    );

    if (!response.ok) {
      console.error('Unsplash API error:', response.status);
      return generatePlaceholderImages(query, options.count || 3);
    }

    const data = await response.json();
    
    return data.results.map((photo: UnsplashPhoto) => ({
      url: photo.urls.regular,
      thumbnail: photo.urls.small,
      alt: photo.alt_description || query,
      credit: {
        name: photo.user.name,
        link: photo.user.links.html,
      },
    }));
  } catch (error) {
    console.error('Unsplash search error:', error);
    return generatePlaceholderImages(query, options.count || 3);
  }
}

interface UnsplashPhoto {
  urls: {
    regular: string;
    small: string;
  };
  alt_description: string | null;
  user: {
    name: string;
    links: {
      html: string;
    };
  };
}

/**
 * プレースホルダー画像を生成
 * APIキーがない場合のフォールバック
 */
function generatePlaceholderImages(query: string, count: number): ReferenceImage[] {
  const placeholders: ReferenceImage[] = [];
  
  // Picsum Photosを使用（APIキー不要）
  for (let i = 0; i < count; i++) {
    const seed = encodeURIComponent(`${query}-${i}`);
    placeholders.push({
      url: `https://picsum.photos/seed/${seed}/800/600`,
      thumbnail: `https://picsum.photos/seed/${seed}/400/300`,
      alt: `${query} 参考イメージ ${i + 1}`,
      credit: {
        name: 'Lorem Picsum',
        link: 'https://picsum.photos/',
      },
    });
  }
  
  return placeholders;
}

/**
 * 写真トーンに基づいて参考画像を取得
 */
export async function getPhotoReferenceImages(
  tone: string,
  subjects: string[],
  options: { count?: number } = {}
): Promise<ReferenceImage[]> {
  // トーンとサブジェクトを組み合わせた検索クエリを構築
  const query = `${tone} ${subjects.slice(0, 2).join(' ')}`;
  
  return searchUnsplash(query, {
    count: options.count || 3,
    orientation: 'landscape',
  });
}

/**
 * イラストスタイルに基づいて参考画像を取得
 * （Unsplashはイラストに弱いため、スタイルキーワードで検索）
 */
export async function getIllustrationReferenceImages(
  style: string,
  tone: string,
  options: { count?: number } = {}
): Promise<ReferenceImage[]> {
  // イラストに適した検索クエリを構築
  const query = `${style} illustration ${tone} graphic design`;
  
  return searchUnsplash(query, {
    count: options.count || 3,
    orientation: 'squarish',
  });
}

/**
 * 業界・コンセプトに基づいて参考画像を取得
 */
export async function getConceptReferenceImages(
  industry: string,
  conceptKeywords: string[],
  options: { count?: number } = {}
): Promise<ReferenceImage[]> {
  const keywords = conceptKeywords.slice(0, 3).join(' ');
  const query = `${industry} ${keywords} professional`;
  
  return searchUnsplash(query, {
    count: options.count || 6,
    orientation: 'landscape',
  });
}

/**
 * カラーに基づいて参考画像を取得
 */
export async function getColorReferenceImages(
  primaryColor: string,
  industry: string,
  options: { count?: number } = {}
): Promise<ReferenceImage[]> {
  // 色名を抽出（例: "#3B82F6" から "blue" を推測）
  const colorName = getColorName(primaryColor);
  const query = `${colorName} ${industry} design`;
  
  return searchUnsplash(query, {
    count: options.count || 3,
    orientation: 'landscape',
  });
}

/**
 * HEX色コードから色名を推測
 */
function getColorName(hex: string): string {
  const colors: Record<string, { r: number; g: number; b: number; name: string }[]> = {
    red: [{ r: 255, g: 0, b: 0, name: 'red' }],
    blue: [{ r: 0, g: 0, b: 255, name: 'blue' }],
    green: [{ r: 0, g: 128, b: 0, name: 'green' }],
    yellow: [{ r: 255, g: 255, b: 0, name: 'yellow' }],
    orange: [{ r: 255, g: 165, b: 0, name: 'orange' }],
    purple: [{ r: 128, g: 0, b: 128, name: 'purple' }],
    pink: [{ r: 255, g: 192, b: 203, name: 'pink' }],
    teal: [{ r: 0, g: 128, b: 128, name: 'teal' }],
    brown: [{ r: 139, g: 69, b: 19, name: 'brown' }],
    gray: [{ r: 128, g: 128, b: 128, name: 'gray' }],
    black: [{ r: 0, g: 0, b: 0, name: 'dark' }],
    white: [{ r: 255, g: 255, b: 255, name: 'light' }],
  };

  // HEXをRGBに変換
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return 'colorful';

  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);

  // 最も近い色を見つける
  let minDistance = Infinity;
  let closestColor = 'colorful';

  for (const [colorName, variations] of Object.entries(colors)) {
    for (const color of variations) {
      const distance = Math.sqrt(
        Math.pow(r - color.r, 2) +
        Math.pow(g - color.g, 2) +
        Math.pow(b - color.b, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestColor = color.name;
      }
    }
  }

  return closestColor;
}

/**
 * ムードボード用の画像セットを取得
 */
export async function getMoodboardImages(
  industry: string,
  conceptKeywords: string[],
  photoTone: string,
  illustrationStyle: string,
  primaryColor: string
): Promise<{
  concept: ReferenceImage[];
  photo: ReferenceImage[];
  illustration: ReferenceImage[];
  color: ReferenceImage[];
}> {
  const [concept, photo, illustration, color] = await Promise.all([
    getConceptReferenceImages(industry, conceptKeywords, { count: 4 }),
    getPhotoReferenceImages(photoTone, [industry], { count: 3 }),
    getIllustrationReferenceImages(illustrationStyle, photoTone, { count: 3 }),
    getColorReferenceImages(primaryColor, industry, { count: 2 }),
  ]);

  return { concept, photo, illustration, color };
}
