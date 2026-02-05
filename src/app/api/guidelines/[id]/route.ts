import { NextRequest, NextResponse } from 'next/server';
import { getGuidelineBySlugServer } from '@/lib/storage';

// 共有スラグでガイドラインを取得（サーバーサイド用）
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // IDがスラグ形式かどうかを判断（UUIDではない場合はスラグとして扱う）
    const isSlug = !id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

    if (isSlug) {
      const guideline = await getGuidelineBySlugServer(id);

      if (!guideline) {
        return NextResponse.json(
          { error: 'Guideline not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ guideline });
    }

    // UUID形式の場合はIDとして検索（将来の拡張用）
    return NextResponse.json(
      { error: 'Direct ID access not implemented' },
      { status: 501 }
    );
  } catch (error) {
    console.error('Failed to get guideline:', error);
    return NextResponse.json(
      { error: 'Failed to get guideline' },
      { status: 500 }
    );
  }
}
