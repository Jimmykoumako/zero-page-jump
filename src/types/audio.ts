
export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  hymnNumber?: string;
  album?: string;
  duration?: string;
  hasLyrics?: boolean;
  lyrics?: any;
}

export interface AudioFile {
  id: string;
  url: string;
  hymnTitleNumber?: string;
  audioTypeId: number;
  userId: string;
  createdAt: string;
  bookId?: number;
}

export interface AudioType {
  id: number;
  type: string;
  description: string;
}
