
export interface HymnBookProps {
  mode: 'hymnal' | 'display';
  deviceId: string;
  onBack: () => void;
  selectedHymnbook?: any;
  groupSession?: GroupSession | null;
}

export interface HymnPlaybackState {
  selectedHymn: string | null;
  currentVerse: number;
  isPlaying: boolean;
}

export interface HymnPlaybackActions {
  selectHymn: (hymnId: string) => void;
  changeVerse: (verse: number) => void;
  togglePlay: () => void;
  nextVerse: (totalVerses: number) => void;
  prevVerse: () => void;
  setIsPlaying: (isPlaying: boolean) => void;
}
