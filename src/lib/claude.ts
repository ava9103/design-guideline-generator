import Anthropic from '@anthropic-ai/sdk';

// Anthropic Claude API
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

// リトライロジック付きのAPI呼び出し
async function callWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 2000
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
  const { temperature = 0.3, systemPrompt, maxTokens = 4096 } = options || {};

  return callWithRetry(async () => {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      temperature: temperature,
      system: systemPrompt || '',
      messages: [
        { role: 'user', content: prompt }
      ],
    });

    const content = response.content[0];
    if (content.type === 'text') {
      return content.text;
    }
    return '';
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
  const { temperature = 0.3, systemPrompt, maxTokens = 4096 } = options || {};

  return callWithRetry(async () => {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      temperature: temperature,
      system: systemPrompt || '',
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    const content = response.content[0];
    if (content.type === 'text') {
      return content.text;
    }
    return '';
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
