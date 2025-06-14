
export interface SyncPoint {
  id: string;
  timestamp: number;
  text: string;
  verse_index?: number;
  line_index?: number;
  word_index?: number;
  syllable_index?: number;
  type: 'verse' | 'line' | 'word' | 'syllable';
}

export interface LyricSyncData {
  id: string;
  project_id: string;
  syncPoints: SyncPoint[];
  hymn_id?: string;
  created_at: string;
}

export interface SyncData {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  verseIndex?: number;
  lineIndex?: number;
}

export interface SyncProject {
  id: string;
  title: string;
  name: string;
  hymn_id?: string;
  track_id?: string;
  sync_data: any;
  syncData: SyncData[];
  created_at: string;
  updated_at: string;
  lastModified: string;
  track?: {
    id: string;
    title: string;
    artist_name?: string;
    url: string;
    duration: number;
  };
}

export interface SyncEditorProps {
  onBack: () => void;
}
