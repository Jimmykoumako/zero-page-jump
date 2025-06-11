
export interface Track {
  id: string;
  title: string;
  url: string;
  duration: number;
  artist_name?: string;
  album_name?: string;
  release_date?: string;
  track_number?: number;
  disc_number?: number;
  explicit?: boolean;
  cover_image_url?: string;
  hymnTitleNumber?: string;
  bookId?: number;
  genreId?: number;
  albumId?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TrackFormData {
  title: string;
  url: string;
  duration: number;
  artist_name?: string;
  album_name?: string;
  release_date?: string;
  track_number?: number;
  disc_number?: number;
  explicit?: boolean;
  cover_image_url?: string;
  hymnTitleNumber?: string;
  bookId?: number;
}

export interface TrackManagerProps {
  tracks: Track[];
  onCreateTrack: (track: TrackFormData) => Promise<void>;
  onUpdateTrack: (id: string, track: Partial<TrackFormData>) => Promise<void>;
  onDeleteTrack: (id: string) => Promise<void>;
}
