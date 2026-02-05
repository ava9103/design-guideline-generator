import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { parseCompetitorDocuments } from '@/lib/analysis-engine/modules';
import type { CompetitorDocument } from '@/types';

// 最大ファイルサイズ: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// 対応ファイル形式
const ALLOWED_TYPES: Record<string, 'image' | 'pdf' | 'text'> = {
  'image/png': 'image',
  'image/jpeg': 'image',
  'image/jpg': 'image',
  'image/webp': 'image',
  'application/pdf': 'pdf',
  'text/plain': 'text',
  'text/markdown': 'text',
};

interface UploadedFile {
  id: string;
  fileName: string;
  fileType: 'image' | 'pdf' | 'text';
  content?: string;
  imageBase64?: string;
  size: number;
}

/**
 * 競合分析資料のアップロードと解析
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'ファイルがアップロードされていません' },
        { status: 400 }
      );
    }

    // ファイル数制限
    if (files.length > 10) {
      return NextResponse.json(
        { error: '一度にアップロードできるファイルは10件までです' },
        { status: 400 }
      );
    }

    const uploadedFiles: UploadedFile[] = [];
    const errors: { fileName: string; error: string }[] = [];

    for (const file of files) {
      // ファイルサイズチェック
      if (file.size > MAX_FILE_SIZE) {
        errors.push({
          fileName: file.name,
          error: `ファイルサイズが大きすぎます（最大10MB）`,
        });
        continue;
      }

      // ファイル形式チェック
      const fileType = ALLOWED_TYPES[file.type];
      if (!fileType) {
        errors.push({
          fileName: file.name,
          error: `未対応のファイル形式です: ${file.type}`,
        });
        continue;
      }

      try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadedFile: UploadedFile = {
          id: nanoid(),
          fileName: file.name,
          fileType,
          size: file.size,
        };

        if (fileType === 'image') {
          // 画像はBase64エンコード
          uploadedFile.imageBase64 = buffer.toString('base64');
        } else if (fileType === 'pdf') {
          // PDFはBase64エンコード（後でパースする）
          uploadedFile.content = buffer.toString('base64');
        } else {
          // テキストはそのまま
          uploadedFile.content = buffer.toString('utf-8');
        }

        uploadedFiles.push(uploadedFile);
      } catch (error) {
        errors.push({
          fileName: file.name,
          error: `ファイルの読み込みに失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`,
        });
      }
    }

    if (uploadedFiles.length === 0) {
      return NextResponse.json(
        {
          error: 'アップロードできたファイルがありません',
          details: errors,
        },
        { status: 400 }
      );
    }

    // CompetitorDocument形式に変換
    const documents: CompetitorDocument[] = uploadedFiles.map((file) => ({
      id: file.id,
      fileName: file.fileName,
      fileType: file.fileType,
      content: file.content,
      imageBase64: file.imageBase64,
      status: 'pending' as const,
    }));

    // 解析を実行（parseOnlyパラメータがfalseの場合のみ）
    const parseOnly = formData.get('parseOnly') === 'false' ? false : true;
    
    if (parseOnly) {
      // 解析せずにドキュメント情報のみ返す
      return NextResponse.json({
        success: true,
        documents,
        errors: errors.length > 0 ? errors : undefined,
      });
    }

    // 解析を実行
    const parsedDocuments = await parseCompetitorDocuments(documents);

    return NextResponse.json({
      success: true,
      documents: parsedDocuments,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      {
        error: 'アップロードに失敗しました',
        details: error instanceof Error ? error.message : '不明なエラー',
      },
      { status: 500 }
    );
  }
}

/**
 * アップロード済みドキュメントの解析
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { documents } = body as { documents: CompetitorDocument[] };

    if (!documents || documents.length === 0) {
      return NextResponse.json(
        { error: 'ドキュメントが指定されていません' },
        { status: 400 }
      );
    }

    // 解析を実行
    const parsedDocuments = await parseCompetitorDocuments(documents);

    // 成功した解析の数をカウント
    const successCount = parsedDocuments.filter((d) => d.status === 'completed').length;
    const errorCount = parsedDocuments.filter((d) => d.status === 'error').length;

    return NextResponse.json({
      success: true,
      documents: parsedDocuments,
      summary: {
        total: documents.length,
        success: successCount,
        error: errorCount,
      },
    });
  } catch (error) {
    console.error('Parse error:', error);
    return NextResponse.json(
      {
        error: '解析に失敗しました',
        details: error instanceof Error ? error.message : '不明なエラー',
      },
      { status: 500 }
    );
  }
}
