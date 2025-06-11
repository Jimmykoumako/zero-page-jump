
import { useEffect } from "react";
import type { UseRemoteControlProps, RemoteCommand } from "@/types/remote-control";

export const useRemoteControl = ({
  deviceId,
  onHymnSelect,
  onNextVerse,
  onPrevVerse,
  onTogglePlay
}: UseRemoteControlProps) => {
  useEffect(() => {
    const handleRemoteCommand = (event: CustomEvent<RemoteCommand>) => {
      const { command, data } = event.detail;
      
      switch (command) {
        case 'selectHymn':
          if (typeof data.hymnId === 'string') {
            onHymnSelect(parseInt(data.hymnId));
          } else if (typeof data.hymnId === 'number') {
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
