import { HfInference } from '@huggingface/inference';

// HuggingFace Inference API（無料）
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

// リトライロジック付きのAPI呼び出し
async function callWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 5000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log(`API Error (attempt ${i + 1}/${maxRetries}): ${errorMessage}`);
      
      if (i < maxRetries - 1) {
        console.log(`Retrying in ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
        delayMs *= 1.5;
      } else {
        throw error;
      }
    }
  }
  throw new Error('Max retries exceeded');
}

export async function callClaude(
  prompt: string,
  options?: {
    maxTokens?: number;
    temperature?: number;
    systemPrompt?: string;
  }
): Promise<string> {
  const { temperature = 0.3, systemPrompt, maxTokens = 1500 } = options || {};

  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [];
  
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  messages.push({ role: 'user', content: prompt });

  return callWithRetry(async () => {
    // Novita AIプロバイダーを使用（無料・安定）
    const response = await hf.chatCompletion({
      model: 'meta-llama/Llama-3.1-8B-Instruct',
      messages: messages,
      max_tokens: maxTokens,
      temperature: temperature,
      provider: 'novita',
    });
    
    return response.choices[0]?.message?.content || '';
  });
}

export async function callClaudeWithHistory(
  messages: ClaudeMessage[],
  options?: {
    maxTokens?: number;
    temperature?: number;
    systemPrompt?: string;
  }
): Promise<string> {
  const { temperature = 0.3, systemPrompt, maxTokens = 1500 } = options || {};

  const chatMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [];
  
  if (systemPrompt) {
    chatMessages.push({ role: 'system', content: systemPrompt });
  }
  
  for (const msg of messages) {
    chatMessages.push({ role: msg.role, content: msg.content });
  }

  return callWithRetry(async () => {
    const response = await hf.chatCompletion({
      model: 'meta-llama/Llama-3.1-8B-Instruct',
      messages: chatMessages,
      max_tokens: maxTokens,
      temperature: temperature,
      provider: 'novita',
    });
    
    return response.choices[0]?.message?.content || '';
  });
}

// JSONを抽出するヘルパー
export function extractJSON<T>(text: string): T | null {
  let cleanText = text
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();

  const objectMatch = cleanText.match(/\{[\s\S]*\}/);
  if (objectMatch) {
    try {
      return JSON.parse(objectMatch[0]) as T;
    } catch {
      // 配列を試す
    }
  }

  const arrayMatch = cleanText.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    try {
      return JSON.parse(arrayMatch[0]) as T;
    } catch {
      return null;
    }
  }

  return null;
}
