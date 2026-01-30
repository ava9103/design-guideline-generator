import { getToolsForLLM } from './tools';

export const AGENT_SYSTEM_PROMPT = `あなたはデザインガイドライン生成のためのAIエージェントです。
与えられた目標を達成するために、利用可能なツールを使って自律的に情報収集と分析を行います。

## 行動原則

1. **計画的に行動**: まず全体の計画を立て、段階的に情報を収集します
2. **効率的なツール使用**: 必要な情報を効率的に収集するため、適切なツールを選択します
3. **分析と統合**: 収集した情報を分析し、デザインガイドラインに必要な洞察を導き出します
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

- 必ず最初に対象サイトを分析してください（analyze_site）
- ビジネスモデルとペルソナの推定は、サイト分析後に行ってください
- 競合分析は、業界が判明してから行ってください
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

export function formatContext(context: Record<string, unknown>): string {
  const parts: string[] = [];

  if (context.targetUrl) {
    parts.push(`対象URL: ${context.targetUrl}`);
  }

  if (context.industry) {
    parts.push(`業界（ユーザー指定）: ${context.industry}`);
  }

  if (context.targetAudience) {
    parts.push(`ターゲット（ユーザー指定）: ${context.targetAudience}`);
  }

  if (context.siteAnalysis) {
    const site = context.siteAnalysis as { title: string; description: string };
    parts.push(`サイト分析済み: ${site.title} - ${site.description}`);
  }

  if (context.businessModel) {
    const biz = context.businessModel as { industry: string; serviceType: string };
    parts.push(`ビジネスモデル推定済み: ${biz.industry}（${biz.serviceType}）`);
  }

  if (context.persona) {
    const persona = context.persona as { primary: { name: string } };
    parts.push(`ペルソナ推定済み: ${persona.primary.name}`);
  }

  if (context.competitors) {
    const competitors = context.competitors as Array<{ name: string }>;
    parts.push(`競合分析済み: ${competitors.map(c => c.name).join('、')}`);
  }

  if (context.designTrend) {
    parts.push(`デザイントレンド分析済み`);
  }

  return parts.join('\n') || '情報なし';
}
