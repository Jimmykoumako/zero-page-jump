
export interface AudioTrack {
  id: string;
  user_id: string;
  hymn_number: string;
  hymn_title: string;
  book_id: number;
  title: string;
  artist_name?: string;
  album_name?: string;
  duration: number; // in seconds
  file_path: string;
  file_size?: number;
  mime_type?: string;
  audio_type: 'instrumental' | 'vocal' | 'accompaniment' | 'full';
  tempo?: number;
  key_signature?: string;
  created_at: string;
  updated_at: string;
  is_public: boolean;
  upload_status: 'processing' | 'ready' | 'error';
}

export interface AudioPlaylist {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  tracks?: AudioTrack[];
}

export interface PlaylistTrack {
  id: string;
  playlist_id: string;
  track_id: string;
  position: number;
  added_at: string;
}

export interface AudioUploadData {
  hymn_number: string;
  hymn_title: string;
  book_id: number;
  title: string;
  artist_name?: string;
  album_name?: string;
  audio_type: 'instrumental' | 'vocal' | 'accompaniment' | 'full';
  tempo?: number;
  key_signature?: string;
  is_public: boolean;
}
