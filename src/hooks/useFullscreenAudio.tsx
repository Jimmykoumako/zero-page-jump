
import { useEffect } from "react";
import { useAudioFiles } from "./useAudioFiles";
import { useAudioPlayback } from "./useAudioPlayback";

export const useFullscreenAudio = (hymnNumber: string) => {
  const { audioFiles, loading: audioFilesLoading } = useAudioFiles(hymnNumber);
  const {
    currentAudio,
    isPlaying,
    currentAudioFile,
    loading: playbackLoading,
    playAudio,
    togglePlayPause,
    stopAudio
  } = useAudioPlayback();

  // Cleanup when hymn number changes
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
    };
  }, [hymnNumber, currentAudio]);

  return {
    audioFiles,
    currentAudio,
    isPlaying,
    currentAudioFile,
    loading: audioFilesLoading || playbackLoading,
    playAudio,
    togglePlayPause,
    stopAudio
  };
};
