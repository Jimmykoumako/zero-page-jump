
import { useEffect } from "react";

interface FullscreenKeyboardHandlerProps {
  isSearchOpen: boolean;
  isBufferVisible: boolean;
  setIsSearchOpen: (open: boolean) => void;
  setIsBufferVisible: (visible: boolean) => void;
  onExitFullscreen: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onPlayPause: () => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  isAutoScrollEnabled: boolean;
  setIsAutoScrollEnabled: (enabled: boolean) => void;
}

const FullscreenKeyboardHandler = ({
  isSearchOpen,
  isBufferVisible,
  setIsSearchOpen,
  setIsBufferVisible,
  onExitFullscreen,
  onPrevious,
  onNext,
  onPlayPause,
  fontSize,
  setFontSize,
  isAutoScrollEnabled,
  setIsAutoScrollEnabled
}: FullscreenKeyboardHandlerProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      
      switch (e.key) {
        case 'Escape':
          if (isSearchOpen) {
            setIsSearchOpen(false);
          } else if (isBufferVisible) {
            setIsBufferVisible(false);
          } else {
            onExitFullscreen();
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          onPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          onNext();
          break;
        case ' ':
          e.preventDefault();
          onPlayPause();
          break;
        case 's':
        case 'S':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            setIsSearchOpen(!isSearchOpen);
          }
          break;
        case 'b':
        case 'B':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            setIsBufferVisible(!isBufferVisible);
          }
          break;
        case '+':
        case '=':
          e.preventDefault();
          setFontSize(Math.min(fontSize + 2, 32));
          break;
        case '-':
          e.preventDefault();
          setFontSize(Math.max(fontSize - 2, 12));
          break;
        case 'a':
        case 'A':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            setIsAutoScrollEnabled(!isAutoScrollEnabled);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [
    isSearchOpen,
    isBufferVisible,
    onExitFullscreen,
    onPrevious,
    onNext,
    onPlayPause,
    fontSize,
    setFontSize,
    isAutoScrollEnabled,
    setIsAutoScrollEnabled,
    setIsSearchOpen,
    setIsBufferVisible
  ]);

  return null; // This component only handles keyboard events
};

export default FullscreenKeyboardHandler;
