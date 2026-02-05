import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Supabaseが設定されているかチェック
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// クライアント側用（環境変数が設定されていない場合はnull）
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

// サーバー側用（サービスロールキー使用）
export function createServerSupabaseClient(): SupabaseClient | null {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Supabase is not configured. Some features may be unavailable.');
    return null;
  }
  return createClient(supabaseUrl, supabaseServiceKey);
}

// データベース型定義
export interface Database {
  public: {
    Tables: {
      knowledge_base: {
        Row: {
          id: string;
          source_type: 'color' | 'font' | 'works';
          source_url: string | null;
          title: string | null;
          content: string;
          embedding: number[] | null;
          metadata: Record<string, unknown> | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          source_type: 'color' | 'font' | 'works';
          source_url?: string | null;
          title?: string | null;
          content: string;
          embedding?: number[] | null;
          metadata?: Record<string, unknown> | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          source_type?: 'color' | 'font' | 'works';
          source_url?: string | null;
          title?: string | null;
          content?: string;
          embedding?: number[] | null;
          metadata?: Record<string, unknown> | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      guidelines: {
        Row: {
          id: string;
          user_id: string | null;
          title: string;
          input_data: Record<string, unknown>;
          layer1_goals: Record<string, unknown> | null;
          layer2_concept: Record<string, unknown> | null;
          layer3_guidelines: Record<string, unknown> | null;
          references: Record<string, unknown> | null;
          share_settings: Record<string, unknown>;
          share_slug: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          title: string;
          input_data: Record<string, unknown>;
          layer1_goals?: Record<string, unknown> | null;
          layer2_concept?: Record<string, unknown> | null;
          layer3_guidelines?: Record<string, unknown> | null;
          references?: Record<string, unknown> | null;
          share_settings?: Record<string, unknown>;
          share_slug?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          title?: string;
          input_data?: Record<string, unknown>;
          layer1_goals?: Record<string, unknown> | null;
          layer2_concept?: Record<string, unknown> | null;
          layer3_guidelines?: Record<string, unknown> | null;
          references?: Record<string, unknown> | null;
          share_settings?: Record<string, unknown>;
          share_slug?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          role: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          role?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          role?: string;
          created_at?: string;
        };
      };
      works_cache: {
        Row: {
          id: string;
          title: string;
          url: string;
          description: string | null;
          industry: string | null;
          service_type: string | null;
          thumbnail_url: string | null;
          scraped_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          url: string;
          description?: string | null;
          industry?: string | null;
          service_type?: string | null;
          thumbnail_url?: string | null;
          scraped_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          url?: string;
          description?: string | null;
          industry?: string | null;
          service_type?: string | null;
          thumbnail_url?: string | null;
          scraped_at?: string;
        };
      };
    };
  };
}
