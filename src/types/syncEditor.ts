
export interface LyricSyncData {
  id?: string;
  line_index: number;
  verse_index: number;
  start_time: number;
  end_time: number;
  text: string;
  sync_type: 'verse' | 'line' | 'group' | 'syllable' | 'word';
  syllable_index?: number;
  word_index?: number;
}

export interface SyncPoint {
  id: string;
  timestamp: number;
  text: string;
  type: 'verse' | 'line' | 'group' | 'syllable' | 'word';
  metadata: Record<string, any>;
}

export interface SyncData {
  id: string;
  syncPoints: SyncPoint[];
  metadata: {
    createdAt: string;
    updatedAt: string;
  };
}

export interface SyncProject {
  id: string;
  title: string;
  name: string;
  hymn_id?: string;
  track_id?: string;
  sync_data: any;
  syncData?: SyncData[];
  created_at: string;
  updated_at: string;
  lastModified: string;
  track?: any;
}
