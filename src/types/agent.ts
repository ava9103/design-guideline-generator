// エージェントツールの定義
export interface AgentTool {
  name: string;
  description: string;
  parameters: {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'array' | 'object';
    description: string;
    required: boolean;
  }[];
  execute: (params: Record<string, unknown>, context: AgentContext) => Promise<ToolResult>;
}

// ツール実行結果
export interface ToolResult {
  success: boolean;
  data?: unknown;
  error?: string;
  summary: string; // AI向けの結果サマリー
}

// エージェントの思考ステップ
export interface ThoughtStep {
  type: 'thought' | 'action' | 'observation' | 'final_answer';
  content: string;
  timestamp: string;
  toolCall?: {
    name: string;
    parameters: Record<string, unknown>;
  };
  toolResult?: ToolResult;
}

// エージェントの状態
export interface AgentState {
  status: 'idle' | 'thinking' | 'executing' | 'completed' | 'error';
  currentGoal: string;
  thoughtHistory: ThoughtStep[];
  collectedData: AgentContext;
  iteration: number;
  maxIterations: number;
}

// エージェントのコンテキスト（収集したデータ）
export interface AgentContext {
  targetUrl: string;
  industry?: string;
  targetAudience?: string;
  competitorUrls?: string[];
  additionalInfo?: string;

  // 分析結果
  siteAnalysis?: import('./analysis').SiteAnalysis;
  businessModel?: import('./analysis').BusinessModelAnalysis;
  persona?: import('./analysis').PersonaAnalysis;
  competitors?: import('./analysis').CompetitorAnalysis[];
  designTrend?: import('./analysis').DesignTrendAnalysis;
  cvrElements?: import('./analysis').CVRElementsAnalysis;

  // エージェントが収集した追加情報
  webSearchResults?: WebSearchResult[];
  insights?: string[];
}

// Web検索結果
export interface WebSearchResult {
  query: string;
  results: {
    title: string;
    url: string;
    snippet: string;
  }[];
}

// エージェントの実行結果
export interface AgentResult {
  success: boolean;
  context: AgentContext;
  thoughtHistory: ThoughtStep[];
  summary: string;
  error?: string;
}

// エージェント進捗コールバック
export interface AgentProgress {
  status: AgentState['status'];
  currentStep: string;
  thought?: string;
  action?: string;
  iteration: number;
  maxIterations: number;
}

export type AgentProgressCallback = (progress: AgentProgress) => void;
