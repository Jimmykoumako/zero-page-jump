
import { useState } from "react";
import { useFullscreenAudio } from "@/hooks/useFullscreenAudio";
import { useFullscreenControls } from "@/hooks/useFullscreenControls";
import { useHymnBuffer } from "@/hooks/useHymnBuffer";
import FullscreenContent from "@/components/fullscreen/FullscreenContent";
import { Hymn } from "@/data/hymns";

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

  // Font size classes array for easy indexing
  const fontSizeClasses = [
    'text-xl',    // 0
    'text-2xl',   // 1
    'text-3xl',   // 2
    'text-4xl',   // 3
    'text-5xl',   // 4
    'text-6xl',   // 5
    'text-7xl',   // 6
    'text-8xl',   // 7
    'text-9xl'    // 8
  ];

  // Custom hooks
  const { showControls } = useFullscreenControls();
  const audioHook = useFullscreenAudio(currentHymn.number.toString());
  const hymnBuffer = useHymnBuffer();

  // Handle hymn changes from buffer
  const handleSelectHymnFromBuffer = (selectedHymn: Hymn) => {
    setCurrentHymn(selectedHymn);
    onVerseChange(0); // Reset to first verse
    hymnBuffer.setCurrentHymn(selectedHymn.id);
  };

  // Create mock selected hymnbook structure to match FullscreenContent expectations
  const mockSelectedHymnbook = {
    hymns: [currentHymn] // For now, just include the current hymn
  };

  return (
    <div className="fixed inset-0 bg-slate-900 text-white z-50 overflow-hidden">
      <FullscreenContent
        selectedHymnbook={mockSelectedHymnbook}
        groupSession={null}
        onBack={onExit}
        onSettingsClick={() => {}}
        onExitFullscreen={onExit}
        currentHymn={currentHymn.id.toString()}
        setCurrentHymn={(hymnId: string) => {
          const selectedHymn = mockSelectedHymnbook.hymns.find(h => h.id.toString() === hymnId);
          if (selectedHymn) {
            setCurrentHymn(selectedHymn);
          }
        }}
        showIntroCarousel={showIntroCarousel}
        setShowIntroCarousel={setShowIntroCarousel}
        playingHymn={null}
        currentAudio={null}
        isPlaying={false}
        currentTime={0}
        duration={0}
        volume={1}
        onPlayPause={() => {}}
        onVolumeChange={() => {}}
        onSeek={() => {}}
        onTrackSelect={() => {}}
        onPrevious={() => {}}
        onNext={() => {}}
        fontSize={fontSize}
        setFontSize={setFontSize}
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
        isBufferVisible={isBufferVisible}
        setIsBufferVisible={setIsBufferVisible}
      />

      {/* Help text - only shows when controls are visible */}
      {showControls && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 text-slate-400 text-sm text-center">
          <div>Arrow keys or spacebar to navigate • Up/Down arrows for font size • P to play/pause • S to stop • Home/End for first/last • Esc to exit</div>
          <div className="text-xs mt-1">Search button (bottom right) • Buffer (top right) for hymn queue</div>
        </div>
      )}
    </div>
  );
};

export default FullscreenPresentation;
