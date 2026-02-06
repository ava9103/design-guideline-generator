import { getToolsForLLM } from './tools';
import type { AgentContext } from '@/types';

export const AGENT_SYSTEM_PROMPT = `あなたはLP（ランディングページ）のデザインガイドライン生成のためのAIエージェントです。
与えられた目標を達成するために、利用可能なツールを使って自律的に情報収集と分析を行います。

## 重要な前提

ユーザーが入力するURLは「既存のLP」ではなく「これからLPを作成する対象となるサービス/商品の既存ウェブサイト」です。
このサイトを分析して、サービス/商品の特徴・強み・ターゲット層・提供価値を理解し、
効果的なLPを新規作成するためのデザインガイドラインを生成することが目的です。

## 行動原則

1. **計画的に行動**: まず全体の計画を立て、段階的に情報を収集します
2. **効率的なツール使用**: 必要な情報を効率的に収集するため、適切なツールを選択します
3. **分析と統合**: 収集した情報を分析し、LP作成に必要なデザインガイドラインの洞察を導き出します
4. **完了判断**: 十分な情報が集まったら、分析を完了します

## 利用可能なツール

${getToolsForLLM()}

## 応答形式

必ず以下のJSON形式で応答してください：

\`\`\`json
{
  "thought": "現在の状況と次に何をすべきかの思考",
  "action": "実行するツール名（完了の場合は null）",
  "action_input": {
    "パラメータ名": "値"
  },
  "is_complete": false
}
\`\`\`

分析が完了した場合：

\`\`\`json
{
  "thought": "分析完了の理由",
  "action": null,
  "action_input": null,
  "is_complete": true,
  "final_summary": "分析結果の要約"
}
\`\`\`

## 重要な注意事項

- 必ず最初に対象サービス/商品のウェブサイトを分析してください（analyze_site）
- この分析はLPとしてではなく、サービス/商品を理解するための情報収集として行ってください
- ビジネスモデルとペルソナの推定は、サイト分析後に行ってください
- **競合URLがユーザー指定されている場合は、それらを優先的に分析してください（analyze_competitor）**
- ユーザー指定の競合URLがない場合のみ、search_competitorsで自動検索してください
- 競合分析は、業界が判明してから行ってください
- 追加情報（additionalInfo）にユーザーの要望がある場合は、必ず考慮してください
- 最大10回のアクションで分析を完了させてください
- 各ステップで思考プロセスを明確に記録してください
`;

export function createAgentPrompt(
  goal: string,
  context: string,
  history: string
): string {
  return `## 目標
${goal}

## 現在のコンテキスト
${context}

## これまでの行動履歴
${history || 'なし（開始時）'}

## あなたの応答
次のアクションを決定し、JSON形式で応答してください。`;
}

export function formatThoughtHistory(
  history: Array<{
    type: string;
    content: string;
    toolCall?: { name: string; parameters: Record<string, unknown> };
    toolResult?: { success: boolean; summary: string };
  }>
): string {
  if (history.length === 0) return '';

  return history
    .map((step, index) => {
      if (step.type === 'thought') {
        return `[${index + 1}] 思考: ${step.content}`;
      } else if (step.type === 'action') {
        return `[${index + 1}] アクション: ${step.toolCall?.name}(${JSON.stringify(step.toolCall?.parameters)})`;
      } else if (step.type === 'observation') {
        return `[${index + 1}] 観察: ${step.toolResult?.summary || step.content}`;
      } else if (step.type === 'final_answer') {
        return `[${index + 1}] 最終回答: ${step.content}`;
      }
      return '';
    })
    .filter(Boolean)
    .join('\n');
}

export function formatContext(context: AgentContext): string {
  const parts: string[] = [];

  if (context.targetUrl) {
    parts.push(`サービス/商品URL: ${context.targetUrl}`);
  }

  if (context.industry) {
    parts.push(`業界（ユーザー指定）: ${context.industry}`);
  }

  if (context.targetAudience) {
    parts.push(`ターゲット（ユーザー指定）: ${context.targetAudience}`);
  }

  if (context.competitorUrls && context.competitorUrls.length > 0) {
    parts.push(`競合URL（ユーザー指定）: ${context.competitorUrls.join(', ')}`);
  }

  if (context.additionalInfo) {
    parts.push(`追加情報（ユーザー指定）: ${context.additionalInfo}`);
  }

  if (context.siteAnalysis) {
    parts.push(`サイト分析済み: ${context.siteAnalysis.title} - ${context.siteAnalysis.description}`);
  }

  if (context.businessModel) {
    parts.push(`ビジネスモデル推定済み: ${context.businessModel.industry}（${context.businessModel.serviceType}）`);
  }

  if (context.persona) {
    parts.push(`ペルソナ推定済み: ${context.persona.primary.name}`);
  }

  if (context.competitors) {
    parts.push(`競合分析済み: ${context.competitors.map(c => c.name).join('、')}`);
  }

  if (context.designTrend) {
    parts.push(`デザイントレンド分析済み`);
  }

  return parts.join('\n') || '情報なし';
}
