
import { useCallback } from "react";
import { Hymn } from "@/types/hymn";
import { useFullscreenPresentation } from "@/contexts/FullscreenPresentationContext";
import { useHymnBuffer } from "./useHymnBuffer";

export const useFullscreenNavigation = () => {
  const { state, dispatch } = useFullscreenPresentation();
  const { addToBuffer } = useHymnBuffer();

  const setCurrentHymn = useCallback((hymnId: string) => {
    dispatch({ type: 'SET_CURRENT_HYMN', payload: hymnId });
  }, [dispatch]);

  const setShowIntroCarousel = useCallback((show: boolean) => {
    dispatch({ type: 'SET_SHOW_INTRO_CAROUSEL', payload: show });
  }, [dispatch]);

  const handleSelectHymn = useCallback((selectedHymn: Hymn) => {
    addToBuffer(selectedHymn);
    setCurrentHymn(selectedHymn.id.toString());
    setShowIntroCarousel(true);
  }, [addToBuffer, setCurrentHymn, setShowIntroCarousel]);

  const handleBufferHymnSelect = useCallback((selectedHymn: Hymn) => {
    setCurrentHymn(selectedHymn.id.toString());
    setShowIntroCarousel(true);
  }, [setCurrentHymn, setShowIntroCarousel]);

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

  // Get current hymn data and navigation info
  const currentHymnData = state.selectedHymnbook?.hymns?.find((h: Hymn) => h.id.toString() === state.currentHymn);
  const displayHymns = state.selectedHymnbook?.hymns || [];
  const currentIndex = displayHymns.findIndex((h: Hymn) => h.id.toString() === state.currentHymn);

  return {
    // State
    currentHymn: state.currentHymn,
    currentHymnData,
    displayHymns,
    currentIndex,
    showIntroCarousel: state.showIntroCarousel,
    
    // Actions
    setCurrentHymn,
    setShowIntroCarousel,
    handleSelectHymn,
    handleBufferHymnSelect,
    handleNavigation,
    
    // Navigation helpers
    canNavigatePrevious: currentIndex > 0,
    canNavigateNext: currentIndex < displayHymns.length - 1,
  };
};
