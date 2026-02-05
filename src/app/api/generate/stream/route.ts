import { NextRequest } from 'next/server';
import { runAnalysisEngine } from '@/lib/analysis-engine';
import { runAgentWithStream, type AgentStreamEvent } from '@/lib/agent';
import { generateDesignGuideline, type GenerationProgress } from '@/lib/guideline-generator';
import { getWorksDataForPrompt } from '@/lib/works-scraper';
import type { AnalysisContext, ThoughtStep } from '@/types';

export const maxDuration = 300; // 5分のタイムアウト

interface GenerateRequest {
  targetUrl: string;
  industry?: string;
  targetAudience?: string;
  competitorUrls?: string[];
  additionalInfo?: string;
  useAgent?: boolean;
}

// SSEエンコーダー
function encodeSSE(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();

    if (!body.targetUrl) {
      return new Response(
        JSON.stringify({ error: '対象サイトURLが必要です' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // URL形式の検証
    try {
      new URL(body.targetUrl);
    } catch {
      return new Response(
        JSON.stringify({ error: '有効なURLを入力してください' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // SSEストリームを作成
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    const encoder = new TextEncoder();

    // 非同期で処理を実行
    (async () => {
      try {
        let analysisContext: AnalysisContext;
        const thoughtHistory: ThoughtStep[] = [];

        // 開始イベントを送信
        await writer.write(
          encoder.encode(encodeSSE('start', { 
            message: '分析を開始しています...',
            phase: 'init',
          }))
        );

        if (body.useAgent) {
          // エージェントモード：ストリーミング対応
          const onAgentEvent = async (event: AgentStreamEvent) => {
            if (event.type === 'thought') {
              thoughtHistory.push(event.step);
              await writer.write(
                encoder.encode(encodeSSE('thought', {
                  step: event.step,
                  totalSteps: thoughtHistory.length,
                }))
              );
            } else if (event.type === 'tool_start') {
              await writer.write(
                encoder.encode(encodeSSE('tool_start', {
                  tool: event.tool,
                  params: event.params,
                }))
              );
            } else if (event.type === 'tool_end') {
              await writer.write(
                encoder.encode(encodeSSE('tool_end', {
                  tool: event.tool,
                  success: event.success,
                  summary: event.summary,
                }))
              );
            } else if (event.type === 'phase') {
              await writer.write(
                encoder.encode(encodeSSE('phase', {
                  phase: event.phase,
                  message: event.message,
                }))
              );
            }
          };

          const agentResult = await runAgentWithStream(
            body.targetUrl,
            {
              industry: body.industry,
              targetAudience: body.targetAudience,
              competitorUrls: body.competitorUrls?.filter((url) => url.trim() !== ''),
              additionalInfo: body.additionalInfo,
            },
            onAgentEvent
          );

          if (!agentResult.success) {
            throw new Error(agentResult.error || 'エージェント分析に失敗しました');
          }

          analysisContext = agentResult.context as AnalysisContext;
        } else {
          // 従来モード
          await writer.write(
            encoder.encode(encodeSSE('phase', {
              phase: 'analysis',
              message: 'サイトを分析しています...',
            }))
          );

          analysisContext = await runAnalysisEngine({
            targetUrl: body.targetUrl,
            industry: body.industry,
            targetAudience: body.targetAudience,
            competitorUrls: body.competitorUrls?.filter((url) => url.trim() !== ''),
            additionalInfo: body.additionalInfo,
          });
        }

        // ガイドライン生成フェーズ
        await writer.write(
          encoder.encode(encodeSSE('phase', {
            phase: 'generation',
            message: 'ガイドラインを生成しています...',
          }))
        );

        // ポストスケイプの実績データを取得
        let worksData: string | undefined;
        try {
          worksData = await getWorksDataForPrompt();
        } catch (error) {
          console.error('Failed to fetch works data:', error);
        }

        // デザインガイドラインを生成（進捗コールバック付き）
        const guideline = await generateDesignGuideline(
          analysisContext,
          worksData,
          async (progress: GenerationProgress) => {
            await writer.write(
              encoder.encode(encodeSSE('progress', {
                currentStep: progress.currentStep,
                progress: progress.progress,
              }))
            );
          }
        );

        // 完了イベントを送信
        await writer.write(
          encoder.encode(encodeSSE('complete', {
            success: true,
            guideline,
            analysisContext: {
              industry: analysisContext.businessModel?.industry || analysisContext.industry,
              serviceType: analysisContext.businessModel?.serviceType,
              targetAudience: analysisContext.persona?.primary.name || analysisContext.targetAudience,
              competitorsAnalyzed: analysisContext.competitors?.length || 0,
            },
            agentInfo: body.useAgent ? {
              thoughtHistory,
              stepsCount: thoughtHistory.length,
            } : undefined,
          }))
        );
      } catch (error) {
        console.error('Stream error:', error);
        await writer.write(
          encoder.encode(encodeSSE('error', {
            error: error instanceof Error ? error.message : '予期しないエラーが発生しました',
          }))
        );
      } finally {
        await writer.close();
      }
    })();

    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Generate stream API error:', error);
    return new Response(
      JSON.stringify({
        error: 'ガイドライン生成中にエラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
