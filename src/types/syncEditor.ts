
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

export interface SyncProject {
  id: string;
  title: string;
  hymn_id?: string;
  track_id?: string;
  sync_data: any;
  created_at: string;
  updated_at: string;
  track?: any;
}
