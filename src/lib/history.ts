'use client';

import type { DesignGuideline } from '@/types';
import {
  isSupabaseConfigured,
  saveGuidelineToSupabase,
  getGuidelineFromSupabase,
  getGuidelineBySlugFromSupabase,
  deleteGuidelineFromSupabase,
  updateShareSlugInSupabase,
} from './storage';

const HISTORY_KEY = 'design_guideline_history';
const MAX_HISTORY_ITEMS = 50;

export interface GuidelineHistoryItem {
  id: string;
  title: string;
  targetUrl: string;
  industry?: string;
  createdAt: string;
  updatedAt: string;
  shareSlug?: string;
  syncedToCloud?: boolean;
}

/**
 * 履歴一覧を取得（ローカルストレージから）
 */
export function getHistoryList(): GuidelineHistoryItem[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    if (!data) return [];
    
    const history = JSON.parse(data) as GuidelineHistoryItem[];
    // 新しい順にソート
    return history.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch {
    console.error('履歴の取得に失敗しました');
    return [];
  }
}

/**
 * ガイドライン詳細を取得（ローカル→Supabaseの順でフォールバック）
 */
export function getGuidelineById(id: string): DesignGuideline | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const key = `guideline_${id}`;
    const data = localStorage.getItem(key);
    if (!data) return null;
    
    return JSON.parse(data) as DesignGuideline;
  } catch {
    console.error('ガイドラインの取得に失敗しました');
    return null;
  }
}

/**
 * ガイドライン詳細を取得（非同期版、Supabaseも試す）
 */
export async function getGuidelineByIdAsync(id: string): Promise<DesignGuideline | null> {
  // まずローカルを確認
  const localGuideline = getGuidelineById(id);
  if (localGuideline) return localGuideline;
  
  // ローカルになければSupabaseを確認
  if (isSupabaseConfigured()) {
    const supabaseGuideline = await getGuidelineFromSupabase(id);
    if (supabaseGuideline) {
      // ローカルにキャッシュ
      saveGuidelineToLocal(supabaseGuideline);
      return supabaseGuideline;
    }
  }
  
  return null;
}

/**
 * ガイドラインをローカルストレージに保存（内部用）
 */
function saveGuidelineToLocal(guideline: DesignGuideline, syncedToCloud = false): void {
  if (typeof window === 'undefined') return;
  
  try {
    // ガイドライン本体を保存
    const guidelineKey = `guideline_${guideline.id}`;
    localStorage.setItem(guidelineKey, JSON.stringify(guideline));
    
    // 履歴一覧を更新
    const historyItem: GuidelineHistoryItem = {
      id: guideline.id,
      title: guideline.title,
      targetUrl: guideline.input.targetUrl,
      industry: guideline.input.industry,
      createdAt: guideline.createdAt,
      updatedAt: guideline.updatedAt,
      shareSlug: guideline.shareSlug,
      syncedToCloud,
    };
    
    const history = getHistoryList();
    
    // 既存のアイテムを削除
    const filteredHistory = history.filter(item => item.id !== guideline.id);
    
    // 新しいアイテムを先頭に追加
    const newHistory = [historyItem, ...filteredHistory];
    
    // 最大件数を超えた場合は古いものを削除
    if (newHistory.length > MAX_HISTORY_ITEMS) {
      const removedItems = newHistory.splice(MAX_HISTORY_ITEMS);
      // 削除されたアイテムのデータも削除
      removedItems.forEach(item => {
        localStorage.removeItem(`guideline_${item.id}`);
      });
    }
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  } catch (error) {
    console.error('ガイドラインの保存に失敗しました:', error);
  }
}

/**
 * ガイドラインを履歴に保存（ローカル + Supabase）
 */
export function saveGuideline(guideline: DesignGuideline): void {
  // まずローカルに保存
  saveGuidelineToLocal(guideline, false);
  
  // Supabaseが設定されていれば非同期でクラウド保存
  if (isSupabaseConfigured()) {
    saveGuidelineToSupabase(guideline)
      .then((result) => {
        if (result.success) {
          // クラウド保存成功をマーク
          const history = getHistoryList();
          const updatedHistory = history.map((item) =>
            item.id === guideline.id ? { ...item, syncedToCloud: true } : item
          );
          localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
        }
      })
      .catch((error) => {
        console.error('Supabaseへの保存に失敗:', error);
      });
  }
}

/**
 * ガイドラインを削除（ローカル + Supabase）
 */
export function deleteGuideline(id: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    // ガイドライン本体を削除
    localStorage.removeItem(`guideline_${id}`);
    
    // 履歴一覧から削除
    const history = getHistoryList();
    const newHistory = history.filter(item => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    
    // Supabaseからも削除
    if (isSupabaseConfigured()) {
      deleteGuidelineFromSupabase(id).catch((error) => {
        console.error('Supabaseからの削除に失敗:', error);
      });
    }
  } catch {
    console.error('ガイドラインの削除に失敗しました');
  }
}

/**
 * 共有スラグを生成・設定（ローカル + Supabase）
 */
export function generateShareSlug(id: string): string {
  if (typeof window === 'undefined') return '';
  
  const guideline = getGuidelineById(id);
  if (!guideline) return '';
  
  // 既に共有スラグがある場合はそれを返す
  if (guideline.shareSlug) return guideline.shareSlug;
  
  // ランダムなスラグを生成
  const slug = `${id.slice(0, 8)}-${Date.now().toString(36)}`;
  
  // ガイドラインを更新
  guideline.shareSlug = slug;
  guideline.updatedAt = new Date().toISOString();
  saveGuideline(guideline);
  
  // Supabaseにも保存
  if (isSupabaseConfigured()) {
    updateShareSlugInSupabase(id, slug).catch((error) => {
      console.error('Supabaseへのスラグ保存に失敗:', error);
    });
  }
  
  return slug;
}

/**
 * 共有スラグからガイドラインを取得（ローカル優先）
 */
export function getGuidelineBySlug(slug: string): DesignGuideline | null {
  if (typeof window === 'undefined') return null;
  
  const history = getHistoryList();
  const item = history.find(h => h.shareSlug === slug);
  
  if (!item) return null;
  
  return getGuidelineById(item.id);
}

/**
 * 共有スラグからガイドラインを取得（非同期版、Supabaseも試す）
 */
export async function getGuidelineBySlugAsync(slug: string): Promise<DesignGuideline | null> {
  // まずローカルを確認
  const localGuideline = getGuidelineBySlug(slug);
  if (localGuideline) return localGuideline;
  
  // ローカルになければSupabaseを確認
  if (isSupabaseConfigured()) {
    const supabaseGuideline = await getGuidelineBySlugFromSupabase(slug);
    if (supabaseGuideline) {
      // ローカルにキャッシュ
      saveGuidelineToLocal(supabaseGuideline);
      return supabaseGuideline;
    }
  }
  
  return null;
}

/**
 * すべての履歴をクリア（ローカルのみ、クラウドは保持）
 */
export function clearAllHistory(): void {
  if (typeof window === 'undefined') return;
  
  try {
    const history = getHistoryList();
    
    // すべてのガイドラインデータを削除
    history.forEach(item => {
      localStorage.removeItem(`guideline_${item.id}`);
    });
    
    // 履歴一覧を削除
    localStorage.removeItem(HISTORY_KEY);
  } catch {
    console.error('履歴のクリアに失敗しました');
  }
}

/**
 * 未同期のガイドラインをSupabaseに同期
 */
export async function syncUnsyncedGuidelines(): Promise<{ synced: number; failed: number }> {
  if (typeof window === 'undefined' || !isSupabaseConfigured()) {
    return { synced: 0, failed: 0 };
  }
  
  const history = getHistoryList();
  const unsyncedItems = history.filter(item => !item.syncedToCloud);
  
  let synced = 0;
  let failed = 0;
  
  for (const item of unsyncedItems) {
    const guideline = getGuidelineById(item.id);
    if (guideline) {
      const result = await saveGuidelineToSupabase(guideline);
      if (result.success) {
        synced++;
        // syncedフラグを更新
        const updatedHistory = getHistoryList().map(h =>
          h.id === item.id ? { ...h, syncedToCloud: true } : h
        );
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
      } else {
        failed++;
      }
    }
  }
  
  return { synced, failed };
}
