
export interface GroupSession {
  sessionId: string;
  isLeader: boolean;
}

export interface GroupState {
  currentHymn?: string;
  currentVerse?: number;
  isPlaying?: boolean;
  participants?: string[];
}

export interface GroupActions {
  updateHymn: (hymnId: string) => Promise<void>;
  updateVerse: (verse: number) => Promise<void>;
  updatePlayState: (isPlaying: boolean) => Promise<void>;
}
