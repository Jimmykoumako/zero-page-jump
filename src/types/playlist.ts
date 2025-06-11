
export interface PlaylistCardProps {
  title: string;
  description: string;
  trackCount: number;
  coverImage?: string;
  onPlay: () => void;
}

export interface TrackListProps {
  tracks: Track[];
  currentTrack?: string;
  isPlaying: boolean;
  onPlayTrack: (trackId: string) => void;
  onShowLyrics?: (track: Track) => void;
}
