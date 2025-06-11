
import { useCallback } from "react";
import { Hymn } from "@/types/hymn";
import { useFullscreenPresentation } from "@/contexts/FullscreenPresentationContext";

export const useFullscreenAudioControls = () => {
  const { state, dispatch } = useFullscreenPresentation();

  const setPlayingHymn = useCallback((hymn: Hymn | null) => {
    dispatch({ type: 'SET_PLAYING_HYMN', payload: hymn });
  }, [dispatch]);

  const setCurrentAudio = useCallback((audio: HTMLAudioElement | null) => {
    dispatch({ type: 'SET_CURRENT_AUDIO', payload: audio });
  }, [dispatch]);

  const setIsPlaying = useCallback((playing: boolean) => {
    dispatch({ type: 'SET_IS_PLAYING', payload: playing });
  }, [dispatch]);

  const setCurrentTime = useCallback((time: number) => {
    dispatch({ type: 'SET_CURRENT_TIME', payload: time });
  }, [dispatch]);

  const setDuration = useCallback((duration: number) => {
    dispatch({ type: 'SET_DURATION', payload: duration });
  }, [dispatch]);

  const setVolume = useCallback((volume: number) => {
    dispatch({ type: 'SET_VOLUME', payload: volume });
  }, [dispatch]);

  const togglePlayPause = useCallback(() => {
    if (state.currentAudio) {
      if (state.isPlaying) {
        state.currentAudio.pause();
      } else {
        state.currentAudio.play().catch(error => {
          console.error('Error playing audio:', error);
        });
      }
    }
  }, [state.currentAudio, state.isPlaying]);

  const stopAudio = useCallback(() => {
    if (state.currentAudio) {
      state.currentAudio.pause();
      state.currentAudio.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [state.currentAudio, setIsPlaying, setCurrentTime]);

  const seekTo = useCallback((time: number) => {
    if (state.currentAudio) {
      state.currentAudio.currentTime = time;
      setCurrentTime(time);
    }
  }, [state.currentAudio, setCurrentTime]);

  const setVolumeLevel = useCallback((volume: number) => {
    if (state.currentAudio) {
      state.currentAudio.volume = volume;
    }
    setVolume(volume);
  }, [state.currentAudio, setVolume]);

  return {
    // State
    playingHymn: state.playingHymn,
    currentAudio: state.currentAudio,
    isPlaying: state.isPlaying,
    currentTime: state.currentTime,
    duration: state.duration,
    volume: state.volume,
    
    // Actions
    setPlayingHymn,
    setCurrentAudio,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    setVolume,
    togglePlayPause,
    stopAudio,
    seekTo,
    setVolumeLevel,
  };
};
