
import { useCallback } from "react";
import { useFullscreenPresentation } from "@/contexts/FullscreenPresentationContext";

export const useFullscreenDisplay = () => {
  const { state, dispatch } = useFullscreenPresentation();

  const setFontSize = useCallback((size: number) => {
    dispatch({ type: 'SET_FONT_SIZE', payload: size });
  }, [dispatch]);

  const setIsAutoScrollEnabled = useCallback((enabled: boolean) => {
    dispatch({ type: 'SET_IS_AUTO_SCROLL_ENABLED', payload: enabled });
  }, [dispatch]);

  const setAutoScrollSpeed = useCallback((speed: number) => {
    dispatch({ type: 'SET_AUTO_SCROLL_SPEED', payload: speed });
  }, [dispatch]);

  const increaseFontSize = useCallback(() => {
    setFontSize(Math.min(state.fontSize + 2, 32));
  }, [state.fontSize, setFontSize]);

  const decreaseFontSize = useCallback(() => {
    setFontSize(Math.max(state.fontSize - 2, 12));
  }, [state.fontSize, setFontSize]);

  const toggleAutoScroll = useCallback(() => {
    setIsAutoScrollEnabled(!state.isAutoScrollEnabled);
  }, [state.isAutoScrollEnabled, setIsAutoScrollEnabled]);

  const resetFontSize = useCallback(() => {
    setFontSize(18);
  }, [setFontSize]);

  return {
    // State
    fontSize: state.fontSize,
    isAutoScrollEnabled: state.isAutoScrollEnabled,
    autoScrollSpeed: state.autoScrollSpeed,
    
    // Actions
    setFontSize,
    setIsAutoScrollEnabled,
    setAutoScrollSpeed,
    increaseFontSize,
    decreaseFontSize,
    toggleAutoScroll,
    resetFontSize,
  };
};
