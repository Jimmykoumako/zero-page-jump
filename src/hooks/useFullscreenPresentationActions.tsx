
import { useCallback } from "react";
import { Hymn } from "@/types/hymn";
import { useFullscreenPresentation } from "@/contexts/FullscreenPresentationContext";
import { useHymnBuffer } from "./useHymnBuffer";

export const useFullscreenPresentationActions = () => {
  const { state, dispatch } = useFullscreenPresentation();
  const { addToBuffer } = useHymnBuffer();

  // Hymn navigation actions
  const setCurrentHymn = useCallback((hymnId: string) => {
    dispatch({ type: 'SET_CURRENT_HYMN', payload: hymnId });
  }, [dispatch]);

  const setShowIntroCarousel = useCallback((show: boolean) => {
    dispatch({ type: 'SET_SHOW_INTRO_CAROUSEL', payload: show });
  }, [dispatch]);

  // Audio actions
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

  // UI actions
  const setFontSize = useCallback((size: number) => {
    dispatch({ type: 'SET_FONT_SIZE', payload: size });
  }, [dispatch]);

  const setIsSearchOpen = useCallback((open: boolean) => {
    dispatch({ type: 'SET_IS_SEARCH_OPEN', payload: open });
  }, [dispatch]);

  const setIsBufferVisible = useCallback((visible: boolean) => {
    dispatch({ type: 'SET_IS_BUFFER_VISIBLE', payload: visible });
  }, [dispatch]);

  const setIsAutoScrollEnabled = useCallback((enabled: boolean) => {
    dispatch({ type: 'SET_IS_AUTO_SCROLL_ENABLED', payload: enabled });
  }, [dispatch]);

  const setAutoScrollSpeed = useCallback((speed: number) => {
    dispatch({ type: 'SET_AUTO_SCROLL_SPEED', payload: speed });
  }, [dispatch]);

  // Complex actions
  const handleSelectHymn = useCallback((selectedHymn: Hymn) => {
    addToBuffer(selectedHymn);
    setCurrentHymn(selectedHymn.id.toString());
    setIsSearchOpen(false);
    setShowIntroCarousel(true);
  }, [addToBuffer, setCurrentHymn, setIsSearchOpen, setShowIntroCarousel]);

  const handleBufferHymnSelect = useCallback((selectedHymn: Hymn) => {
    setCurrentHymn(selectedHymn.id.toString());
    setIsBufferVisible(false);
    setShowIntroCarousel(true);
  }, [setCurrentHymn, setIsBufferVisible, setShowIntroCarousel]);

  const handleNavigation = useCallback((direction: 'previous' | 'next') => {
    const displayHymns = state.selectedHymnbook?.hymns || [];
    const currentIndex = displayHymns.findIndex((h: Hymn) => h.id.toString() === state.currentHymn);
    
    if (direction === 'previous' && currentIndex > 0) {
      const prevHymn = displayHymns[currentIndex - 1];
      setCurrentHymn(prevHymn.id.toString());
      setShowIntroCarousel(true);
    } else if (direction === 'next' && currentIndex < displayHymns.length - 1) {
      const nextHymn = displayHymns[currentIndex + 1];
      setCurrentHymn(nextHymn.id.toString());
      setShowIntroCarousel(true);
    }
  }, [state.selectedHymnbook, state.currentHymn, setCurrentHymn, setShowIntroCarousel]);

  return {
    // State
    state,
    
    // Basic actions
    setCurrentHymn,
    setShowIntroCarousel,
    setPlayingHymn,
    setCurrentAudio,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    setVolume,
    setFontSize,
    setIsSearchOpen,
    setIsBufferVisible,
    setIsAutoScrollEnabled,
    setAutoScrollSpeed,
    
    // Complex actions
    handleSelectHymn,
    handleBufferHymnSelect,
    handleNavigation,
  };
};
