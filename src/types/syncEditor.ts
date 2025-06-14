
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
    title: string;
    artist_name?: string;
    url: string;
  };
}

export interface SyncEditorProps {
  onBack: () => void;
}
