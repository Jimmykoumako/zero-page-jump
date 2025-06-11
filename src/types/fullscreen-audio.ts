
export interface AudioFile {
  id: string;
  url: string;
  audioTypeId: number;
  userId: string;
  createdAt: string;
  hymnTitleNumber?: string;
  bookId?: number;
}

export interface AudioPlaybackState {
  currentAudio: HTMLAudioElement | null;
  isPlaying: boolean;
  currentAudioFile: AudioFile | null;
  loading: boolean;
}
