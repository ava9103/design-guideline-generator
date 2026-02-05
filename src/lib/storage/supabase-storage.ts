import { supabase, createServerSupabaseClient, isSupabaseConfigured as checkSupabaseConfigured } from '@/lib/supabase';
import type { DesignGuideline } from '@/types';

// Supabaseが利用可能かどうかをチェック
export function isSupabaseConfigured(): boolean {
  return checkSupabaseConfigured;
}

// ガイドラインをSupabaseに保存
export async function saveGuidelineToSupabase(
  guideline: DesignGuideline
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!isSupabaseConfigured() || !supabase) {
      return { success: false, error: 'Supabase is not configured' };
    }

    const { error } = await supabase.from('guidelines').upsert({
      id: guideline.id,
      title: guideline.title,
      input_data: guideline.input,
      layer1_goals: guideline.layer1Goals,
      layer2_concept: guideline.layer2Concept,
      layer3_guidelines: guideline.layer3Guidelines,
      references: guideline.references,
      share_slug: guideline.shareSlug,
      share_settings: guideline.shareSettings || { visibility: 'team' },
      status: 'published',
      created_at: guideline.createdAt,
      updated_at: guideline.updatedAt,
    });

    if (error) {
      console.error('Failed to save guideline to Supabase:', error.message);
      return { success: false, error: error.message || 'Database error' };
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to save guideline to Supabase:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// IDでガイドラインを取得
export async function getGuidelineFromSupabase(
  id: string
): Promise<DesignGuideline | null> {
  try {
    if (!isSupabaseConfigured() || !supabase) {
      return null;
    }

    const { data, error } = await supabase
      .from('guidelines')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return convertToDesignGuideline(data);
  } catch (error) {
    console.error('Failed to get guideline from Supabase:', error);
    return null;
  }
}

// 共有スラグでガイドラインを取得
export async function getGuidelineBySlugFromSupabase(
  slug: string
): Promise<DesignGuideline | null> {
  try {
    if (!isSupabaseConfigured() || !supabase) {
      return null;
    }

    const { data, error } = await supabase
      .from('guidelines')
      .select('*')
      .eq('share_slug', slug)
      .single();

    if (error || !data) {
      return null;
    }

    return convertToDesignGuideline(data);
  } catch (error) {
    console.error('Failed to get guideline by slug from Supabase:', error);
    return null;
  }
}

// ガイドライン一覧を取得
export async function getGuidelinesFromSupabase(options?: {
  limit?: number;
  offset?: number;
  userId?: string;
}): Promise<{ guidelines: DesignGuideline[]; total: number }> {
  try {
    if (!isSupabaseConfigured() || !supabase) {
      return { guidelines: [], total: 0 };
    }

    let query = supabase
      .from('guidelines')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (options?.userId) {
      query = query.eq('user_id', options.userId);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 50) - 1);
    }

    const { data, error, count } = await query;

    if (error || !data) {
      return { guidelines: [], total: 0 };
    }

    const guidelines = data.map(convertToDesignGuideline);
    return { guidelines, total: count || 0 };
  } catch (error) {
    console.error('Failed to get guidelines from Supabase:', error);
    return { guidelines: [], total: 0 };
  }
}

// ガイドラインを削除
export async function deleteGuidelineFromSupabase(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!isSupabaseConfigured() || !supabase) {
      return { success: false, error: 'Supabase is not configured' };
    }

    const { error } = await supabase.from('guidelines').delete().eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to delete guideline from Supabase:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// 共有スラグを更新
export async function updateShareSlugInSupabase(
  id: string,
  slug: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!isSupabaseConfigured() || !supabase) {
      return { success: false, error: 'Supabase is not configured' };
    }

    const { error } = await supabase
      .from('guidelines')
      .update({ share_slug: slug, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to update share slug in Supabase:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// サーバーサイドでガイドラインを取得（共有ページ用）
export async function getGuidelineBySlugServer(
  slug: string
): Promise<DesignGuideline | null> {
  try {
    const supabaseServer = createServerSupabaseClient();
    
    if (!supabaseServer) {
      console.warn('Supabase is not configured for server-side access.');
      return null;
    }

    const { data, error } = await supabaseServer
      .from('guidelines')
      .select('*')
      .eq('share_slug', slug)
      .single();

    if (error || !data) {
      return null;
    }

    return convertToDesignGuideline(data);
  } catch (error) {
    console.error('Failed to get guideline by slug (server):', error);
    return null;
  }
}

// データベースレコードをDesignGuidelineに変換
function convertToDesignGuideline(data: Record<string, unknown>): DesignGuideline {
  return {
    id: data.id as string,
    title: data.title as string,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string,
    userId: data.user_id as string | undefined,
    input: data.input_data as DesignGuideline['input'],
    layer1Goals: data.layer1_goals as DesignGuideline['layer1Goals'],
    layer2Concept: data.layer2_concept as DesignGuideline['layer2Concept'],
    layer3Guidelines: data.layer3_guidelines as DesignGuideline['layer3Guidelines'],
    references: data.references as DesignGuideline['references'],
    shareSlug: data.share_slug as string | undefined,
    shareSettings: data.share_settings as DesignGuideline['shareSettings'],
    competitorAnalysis: (data.layer1_goals as Record<string, unknown>)?.competitorAnalysis as DesignGuideline['competitorAnalysis'],
  };
}
