import type {
  AgentState,
  AgentContext,
  AgentResult,
  ThoughtStep,
  AgentProgressCallback,
  CompetitorDocument,
  CompetitorImportMode,
} from '@/types';
import { callClaude, extractJSON } from '@/lib/claude';
import { getToolByName } from './tools';
import {
  AGENT_SYSTEM_PROMPT,
  createAgentPrompt,
  formatThoughtHistory,
  formatContext,
} from './prompts';

interface AgentAction {
  thought: string;
  action: string | null;
  action_input: Record<string, unknown> | null;
  is_complete: boolean;
  final_summary?: string;
}

const MAX_ITERATIONS = 12;

export class DesignGuidelineAgent {
  private state: AgentState;
  private onProgress?: AgentProgressCallback;

  constructor(
    targetUrl: string,
    options?: {
      industry?: string;
      targetAudience?: string;
      competitorUrls?: string[];
      additionalInfo?: string;
      competitorDocuments?: CompetitorDocument[];
      competitorImportMode?: CompetitorImportMode;
      onProgress?: AgentProgressCallback;
    }
  ) {
    this.state = {
      status: 'idle',
      currentGoal: `「${targetUrl}」のデザインガイドライン生成に必要な情報を収集・分析する`,
      thoughtHistory: [],
      collectedData: {
        targetUrl,
        industry: options?.industry,
        targetAudience: options?.targetAudience,
        competitorUrls: options?.competitorUrls,
        additionalInfo: options?.additionalInfo,
        competitorDocuments: options?.competitorDocuments,
        competitorImportMode: options?.competitorImportMode,
      },
      iteration: 0,
      maxIterations: MAX_ITERATIONS,
    };
    this.onProgress = options?.onProgress;
  }

  private notifyProgress(step: string, thought?: string, action?: string) {
    if (this.onProgress) {
      this.onProgress({
        status: this.state.status,
        currentStep: step,
        thought,
        action,
        iteration: this.state.iteration,
        maxIterations: this.state.maxIterations,
      });
    }
  }

  private addThought(step: ThoughtStep) {
    this.state.thoughtHistory.push(step);
  }

  async run(): Promise<AgentResult> {
    this.state.status = 'thinking';
    this.notifyProgress('エージェント開始', '分析計画を立てています...');

    try {
      while (this.state.iteration < MAX_ITERATIONS) {
        this.state.iteration++;
        
        // 1. LLMに次のアクションを決定させる
        this.state.status = 'thinking';
        this.notifyProgress(
          `ステップ ${this.state.iteration}/${MAX_ITERATIONS}`,
          '次のアクションを決定中...'
        );

        const action = await this.decideNextAction();

        // 思考を記録
        this.addThought({
          type: 'thought',
          content: action.thought,
          timestamp: new Date().toISOString(),
        });

        this.notifyProgress(
          `ステップ ${this.state.iteration}/${MAX_ITERATIONS}`,
          action.thought,
          action.action || undefined
        );

        // 2. 完了チェック
        if (action.is_complete) {
          this.addThought({
            type: 'final_answer',
            content: action.final_summary || '分析完了',
            timestamp: new Date().toISOString(),
          });

          this.state.status = 'completed';
          this.notifyProgress('分析完了', action.final_summary);

          return {
            success: true,
            context: this.state.collectedData,
            thoughtHistory: this.state.thoughtHistory,
            summary: action.final_summary || '分析が完了しました',
          };
        }

        // 3. アクションを実行
        if (action.action && action.action_input) {
          this.state.status = 'executing';
          
          // アクションを記録
          this.addThought({
            type: 'action',
            content: `${action.action} を実行`,
            timestamp: new Date().toISOString(),
            toolCall: {
              name: action.action,
              parameters: action.action_input,
            },
          });

          this.notifyProgress(
            `ツール実行: ${action.action}`,
            undefined,
            action.action
          );

          // ツールを実行
          const result = await this.executeTool(action.action, action.action_input);

          // 観察を記録
          this.addThought({
            type: 'observation',
            content: result.summary,
            timestamp: new Date().toISOString(),
            toolResult: result,
          });

          this.notifyProgress(
            `観察: ${result.success ? '成功' : '失敗'}`,
            result.summary
          );
        }
      }

      // 最大イテレーション到達
      this.state.status = 'completed';
      return {
        success: true,
        context: this.state.collectedData,
        thoughtHistory: this.state.thoughtHistory,
        summary: '最大ステップ数に達したため、収集した情報で分析を完了しました',
      };

    } catch (error) {
      this.state.status = 'error';
      return {
        success: false,
        context: this.state.collectedData,
        thoughtHistory: this.state.thoughtHistory,
        summary: '',
        error: error instanceof Error ? error.message : '不明なエラー',
      };
    }
  }

  private async decideNextAction(): Promise<AgentAction> {
    const prompt = createAgentPrompt(
      this.state.currentGoal,
      formatContext(this.state.collectedData),
      formatThoughtHistory(this.state.thoughtHistory)
    );

    const response = await callClaude(prompt, {
      maxTokens: 2000,
      systemPrompt: AGENT_SYSTEM_PROMPT,
      temperature: 0.2,
    });

    const action = extractJSON<AgentAction>(response);

    if (!action) {
      // JSONパースに失敗した場合のフォールバック
      console.error('Failed to parse agent response:', response);
      
      // レスポンスから情報を抽出しようとする
      const thoughtMatch = response.match(/thought["\s:]+([^"]+)/i);
      const actionMatch = response.match(/action["\s:]+([^",\s}]+)/i);
      
      return {
        thought: thoughtMatch?.[1] || 'レスポンスの解析に失敗しましたが、分析を続行します',
        action: actionMatch?.[1] || null,
        action_input: null,
        is_complete: this.state.iteration >= MAX_ITERATIONS - 1,
      };
    }

    return action;
  }

  private async executeTool(
    toolName: string,
    params: Record<string, unknown>
  ) {
    const tool = getToolByName(toolName);

    if (!tool) {
      return {
        success: false,
        error: `ツール "${toolName}" が見つかりません`,
        summary: `ツール "${toolName}" は利用できません`,
      };
    }

    try {
      const result = await tool.execute(params, this.state.collectedData);
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '不明なエラー',
        summary: `ツール実行エラー: ${error instanceof Error ? error.message : '不明'}`,
      };
    }
  }

  // 現在の状態を取得
  getState(): AgentState {
    return { ...this.state };
  }

  // 収集したデータを取得
  getCollectedData(): AgentContext {
    return { ...this.state.collectedData };
  }
}

// エージェントを実行するヘルパー関数
export async function runAgent(
  targetUrl: string,
  options?: {
    industry?: string;
    targetAudience?: string;
    competitorUrls?: string[];
    additionalInfo?: string;
    onProgress?: AgentProgressCallback;
  }
): Promise<AgentResult> {
  const agent = new DesignGuidelineAgent(targetUrl, options);
  return agent.run();
}

// SSEストリーミング用のイベント型
export type AgentStreamEvent = 
  | { type: 'thought'; step: ThoughtStep }
  | { type: 'tool_start'; tool: string; params: Record<string, unknown> }
  | { type: 'tool_end'; tool: string; success: boolean; summary: string }
  | { type: 'phase'; phase: string; message: string };

// ストリーミングイベントコールバック型
export type AgentStreamCallback = (event: AgentStreamEvent) => Promise<void> | void;

// ストリーミング対応エージェント実行
export async function runAgentWithStream(
  targetUrl: string,
  options: {
    industry?: string;
    targetAudience?: string;
    competitorUrls?: string[];
    additionalInfo?: string;
    competitorDocuments?: CompetitorDocument[];
    competitorImportMode?: CompetitorImportMode;
  },
  onEvent: AgentStreamCallback
): Promise<AgentResult> {
  const state: AgentState = {
    status: 'idle',
    currentGoal: `「${targetUrl}」のデザインガイドライン生成に必要な情報を収集・分析する`,
    thoughtHistory: [],
    collectedData: {
      targetUrl,
      industry: options.industry,
      targetAudience: options.targetAudience,
      competitorUrls: options.competitorUrls,
      additionalInfo: options.additionalInfo,
      competitorDocuments: options.competitorDocuments,
      competitorImportMode: options.competitorImportMode,
    },
    iteration: 0,
    maxIterations: MAX_ITERATIONS,
  };

  const addThought = async (step: ThoughtStep) => {
    state.thoughtHistory.push(step);
    await onEvent({ type: 'thought', step });
  };

  try {
    await onEvent({
      type: 'phase',
      phase: 'init',
      message: 'エージェント分析を開始しています...',
    });

    while (state.iteration < MAX_ITERATIONS) {
      state.iteration++;
      state.status = 'thinking';

      await onEvent({
        type: 'phase',
        phase: `step-${state.iteration}`,
        message: `ステップ ${state.iteration}/${MAX_ITERATIONS}: 次のアクションを決定中...`,
      });

      // LLMに次のアクションを決定させる
      const prompt = createAgentPrompt(
        state.currentGoal,
        formatContext(state.collectedData),
        formatThoughtHistory(state.thoughtHistory)
      );

      const response = await callClaude(prompt, {
        maxTokens: 2000,
        systemPrompt: AGENT_SYSTEM_PROMPT,
        temperature: 0.2,
      });

      const action = extractJSON<AgentAction>(response);

      if (!action) {
        console.error('Failed to parse agent response:', response);
        continue;
      }

      // 思考を記録・通知
      await addThought({
        type: 'thought',
        content: action.thought,
        timestamp: new Date().toISOString(),
      });

      // 完了チェック
      if (action.is_complete) {
        await addThought({
          type: 'final_answer',
          content: action.final_summary || '分析完了',
          timestamp: new Date().toISOString(),
        });

        state.status = 'completed';

        return {
          success: true,
          context: state.collectedData,
          thoughtHistory: state.thoughtHistory,
          summary: action.final_summary || '分析が完了しました',
        };
      }

      // アクションを実行
      if (action.action && action.action_input) {
        state.status = 'executing';

        await onEvent({
          type: 'tool_start',
          tool: action.action,
          params: action.action_input,
        });

        // アクションを記録
        await addThought({
          type: 'action',
          content: `${action.action} を実行`,
          timestamp: new Date().toISOString(),
          toolCall: {
            name: action.action,
            parameters: action.action_input,
          },
        });

        // ツールを実行
        const tool = getToolByName(action.action);
        let result;

        if (!tool) {
          result = {
            success: false,
            error: `ツール "${action.action}" が見つかりません`,
            summary: `ツール "${action.action}" は利用できません`,
          };
        } else {
          try {
            result = await tool.execute(action.action_input, state.collectedData);
          } catch (error) {
            result = {
              success: false,
              error: error instanceof Error ? error.message : '不明なエラー',
              summary: `ツール実行エラー: ${error instanceof Error ? error.message : '不明'}`,
            };
          }
        }

        await onEvent({
          type: 'tool_end',
          tool: action.action,
          success: result.success,
          summary: result.summary,
        });

        // 観察を記録
        await addThought({
          type: 'observation',
          content: result.summary,
          timestamp: new Date().toISOString(),
          toolResult: result,
        });
      }
    }

    // 最大イテレーション到達
    state.status = 'completed';
    return {
      success: true,
      context: state.collectedData,
      thoughtHistory: state.thoughtHistory,
      summary: '最大ステップ数に達したため、収集した情報で分析を完了しました',
    };

  } catch (error) {
    state.status = 'error';
    return {
      success: false,
      context: state.collectedData,
      thoughtHistory: state.thoughtHistory,
      summary: '',
      error: error instanceof Error ? error.message : '不明なエラー',
    };
  }
}
