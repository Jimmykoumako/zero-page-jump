
export interface UseRemoteControlProps {
  deviceId: string;
  onHymnSelect: (hymnId: number) => void;
  onNextVerse: () => void;
  onPrevVerse: () => void;
  onTogglePlay: () => void;
}

export interface RemoteCommand {
  command: string;
  data: {
    hymnId?: string | number;
  };
}
