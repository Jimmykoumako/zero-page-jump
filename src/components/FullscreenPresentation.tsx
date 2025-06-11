
import { useState } from "react";
import { useFullscreenAudio } from "@/hooks/useFullscreenAudio";
import { useFullscreenControls } from "@/hooks/useFullscreenControls";
import { FullscreenPresentationProvider } from "@/contexts/FullscreenPresentationContext";
import FullscreenContent from "@/components/fullscreen/FullscreenContent";
import { Hymn } from "@/types/hymn";

interface FullscreenPresentationProps {
  hymn: Hymn;
  currentVerse: number;
  onVerseChange: (verse: number) => void;
  onExit: () => void;
}

const FullscreenPresentation = ({ hymn, currentVerse, onVerseChange, onExit }: FullscreenPresentationProps) => {
  const [fontSize, setFontSize] = useState(6);
  const [currentHymn, setCurrentHymn] = useState<Hymn>(hymn);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBufferVisible, setIsBufferVisible] = useState(false);
  const [showIntroCarousel, setShowIntroCarousel] = useState(true);

  // Custom hooks
  const { showControls } = useFullscreenControls();
  const audioHook = useFullscreenAudio(currentHymn.number.toString());

  // Handle hymn changes from buffer
  const handleSelectHymnFromBuffer = (selectedHymn: Hymn) => {
    setCurrentHymn(selectedHymn);
    onVerseChange(0); // Reset to first verse
  };

  // Create mock selected hymnbook structure
  const mockSelectedHymnbook = {
    hymns: [currentHymn]
  };

  // Initial data for the context provider
  const initialData = {
    currentHymn: currentHymn.id.toString(),
    showIntroCarousel,
    selectedHymnbook: mockSelectedHymnbook,
    fontSize,
    isSearchOpen,
    isBufferVisible,
    playingHymn: null,
    currentAudio: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isAutoScrollEnabled: false,
    autoScrollSpeed: 50,
    groupSession: null,
  };

  return (
    <div className="fixed inset-0 bg-slate-900 text-white z-50 overflow-hidden">
      <FullscreenPresentationProvider initialData={initialData}>
        <FullscreenContent
          onBack={onExit}
          onSettingsClick={() => {}}
          onExitFullscreen={onExit}
          onPlayPause={() => {}}
          onVolumeChange={() => {}}
          onSeek={() => {}}
          onTrackSelect={() => {}}
          onPrevious={() => {}}
          onNext={() => {}}
        />
      </FullscreenPresentationProvider>

      {/* Help text - only shows when controls are visible */}
      {showControls && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 text-slate-400 text-sm text-center z-50">
          <div>Arrow keys or spacebar to navigate • Up/Down arrows for font size • P to play/pause • S to stop • Home/End for first/last • Esc to exit</div>
          <div className="text-xs mt-1">Search button (bottom right) • Buffer (top right) for hymn queue</div>
        </div>
      )}
    </div>
  );
};

export default FullscreenPresentation;
