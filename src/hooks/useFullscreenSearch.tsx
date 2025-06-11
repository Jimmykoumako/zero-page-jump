
import { useCallback } from "react";
import { useFullscreenPresentation } from "@/contexts/FullscreenPresentationContext";

export const useFullscreenSearch = () => {
  const { state, dispatch } = useFullscreenPresentation();

  const setIsSearchOpen = useCallback((open: boolean) => {
    dispatch({ type: 'SET_IS_SEARCH_OPEN', payload: open });
  }, [dispatch]);

  const setIsBufferVisible = useCallback((visible: boolean) => {
    dispatch({ type: 'SET_IS_BUFFER_VISIBLE', payload: visible });
  }, [dispatch]);

  const openSearch = useCallback(() => {
    setIsSearchOpen(true);
  }, [setIsSearchOpen]);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
  }, [setIsSearchOpen]);

  const toggleSearch = useCallback(() => {
    setIsSearchOpen(!state.isSearchOpen);
  }, [state.isSearchOpen, setIsSearchOpen]);

  const openBuffer = useCallback(() => {
    setIsBufferVisible(true);
  }, [setIsBufferVisible]);

  const closeBuffer = useCallback(() => {
    setIsBufferVisible(false);
  }, [setIsBufferVisible]);

  const toggleBuffer = useCallback(() => {
    setIsBufferVisible(!state.isBufferVisible);
  }, [state.isBufferVisible, setIsBufferVisible]);

  return {
    // State
    isSearchOpen: state.isSearchOpen,
    isBufferVisible: state.isBufferVisible,
    selectedHymnbook: state.selectedHymnbook,
    
    // Actions
    setIsSearchOpen,
    setIsBufferVisible,
    openSearch,
    closeSearch,
    toggleSearch,
    openBuffer,
    closeBuffer,
    toggleBuffer,
  };
};
