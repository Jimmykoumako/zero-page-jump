
import { useEffect } from "react";

interface UseRemoteControlProps {
  deviceId: string;
  onHymnSelect: (hymnId: number) => void;
  onNextVerse: () => void;
  onPrevVerse: () => void;
  onTogglePlay: () => void;
}

export const useRemoteControl = ({
  deviceId,
  onHymnSelect,
  onNextVerse,
  onPrevVerse,
  onTogglePlay
}: UseRemoteControlProps) => {
  useEffect(() => {
    const handleRemoteCommand = (event: CustomEvent) => {
      const { command, data } = event.detail;
      
      switch (command) {
        case 'selectHymn':
          if (typeof data.hymnId === 'string') {
            onHymnSelect(parseInt(data.hymnId));
          } else {
            onHymnSelect(data.hymnId);
          }
          break;
        case 'nextVerse':
          onNextVerse();
          break;
        case 'prevVerse':
          onPrevVerse();
          break;
        case 'togglePlay':
          onTogglePlay();
          break;
      }
    };

    window.addEventListener(`remote-${deviceId}` as any, handleRemoteCommand);
    return () => window.removeEventListener(`remote-${deviceId}` as any, handleRemoteCommand);
  }, [deviceId, onHymnSelect, onNextVerse, onPrevVerse, onTogglePlay]);
};
