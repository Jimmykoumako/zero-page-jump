
import { useState } from "react";
import { useFullscreenAudio } from "@/hooks/useFullscreenAudio";
import { useFullscreenControls } from "@/hooks/useFullscreenControls";
import { useFullscreenKeyboard } from "@/hooks/useFullscreenKeyboard";
import { useHymnBuffer } from "@/hooks/useHymnBuffer";
import FullscreenContent from "@/components/fullscreen/FullscreenContent";
import FullscreenAudioControls from "@/components/fullscreen/FullscreenAudioControls";
import FullscreenFontControls from "@/components/fullscreen/FullscreenFontControls";
import FullscreenNavigationControls from "@/components/fullscreen/FullscreenNavigationControls";
import FullscreenSearchButton from "@/components/fullscreen/FullscreenSearchButton";
import FullscreenHymnSearch from "@/components/fullscreen/FullscreenHymnSearch";
import FullscreenHymnBuffer from "@/components/fullscreen/FullscreenHymnBuffer";

interface Hymn {
  id: string;
  number: string;
  title: string;
  author: string;
  verses: string[];
  chorus?: string;
  key: string;
  tempo: number;
}

interface FullscreenPresentationProps {
  hymn: Hymn;
  currentVerse: number;
  onVerseChange: (verse: number) => void;
  onExit: () => void;
}

const FullscreenPresentation = ({ hymn, currentVerse, onVerseChange, onExit }: FullscreenPresentationProps) => {
  const [fontSize, setFontSize] = useState(6);
  const [currentHymn, setCurrentHymn] = useState<Hymn>(hymn);
  const [showSearch, setShowSearch] = useState(false);
  const [showBuffer, setShowBuffer] = useState(false);

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

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 1, fontSizeClasses.length - 1));
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 1, 0));
  };

  // Custom hooks
  const { showControls } = useFullscreenControls();
  const audioHook = useFullscreenAudio(currentHymn.number);
  const hymnBuffer = useHymnBuffer();

  // Handle hymn changes from buffer
  const handleSelectHymnFromBuffer = (selectedHymn: Hymn) => {
    setCurrentHymn(selectedHymn);
    onVerseChange(0); // Reset to first verse
    hymnBuffer.setCurrentHymn(selectedHymn.id);
  };

  // Keyboard controls
  useFullscreenKeyboard({
    hymn: currentHymn,
    currentVerse,
    onVerseChange,
    onExit,
    fontSize,
    increaseFontSize,
    decreaseFontSize,
    currentAudio: audioHook.currentAudio,
    audioFiles: audioHook.audioFiles,
    togglePlayPause: audioHook.togglePlayPause,
    playAudio: audioHook.playAudio,
    stopAudio: audioHook.stopAudio
  });

  // Get current content based on current verse
  const getCurrentContent = () => {
    if (currentVerse < currentHymn.verses.length) {
      return {
        type: 'verse' as const,
        number: currentVerse + 1,
        content: currentHymn.verses[currentVerse]
      };
    } else if (currentHymn.chorus) {
      return {
        type: 'chorus' as const,
        number: null,
        content: currentHymn.chorus
      };
    }
    return null;
  };

  const canGoPrevious = currentVerse > 0;
  const canGoNext = currentVerse < currentHymn.verses.length - 1 || (currentHymn.chorus && currentVerse < currentHymn.verses.length);

  const content = getCurrentContent();
  if (!content) return null;

  return (
    <div className="fixed inset-0 bg-slate-900 text-white z-50 overflow-hidden">
      <FullscreenContent
        title={currentHymn.title}
        content={content}
        fontSizeClass={fontSizeClasses[fontSize]}
        currentVerse={currentVerse}
        totalVerses={currentHymn.verses.length}
        hasChorus={!!currentHymn.chorus}
        isPlayingAudio={audioHook.isPlaying}
      />

      {/* Floating controls */}
      <div 
        className={`fixed inset-0 pointer-events-none transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <FullscreenNavigationControls
          hymn={currentHymn}
          currentVerse={currentVerse}
          content={content}
          canGoPrevious={canGoPrevious}
          canGoNext={canGoNext}
          onVerseChange={onVerseChange}
          onExit={onExit}
          onStopAudio={audioHook.stopAudio}
        />

        <FullscreenFontControls
          fontSize={fontSize}
          maxFontSize={fontSizeClasses.length}
          onIncreaseFontSize={increaseFontSize}
          onDecreaseFontSize={decreaseFontSize}
        />

        <FullscreenAudioControls
          audioFiles={audioHook.audioFiles}
          currentAudioFile={audioHook.currentAudioFile}
          currentAudio={audioHook.currentAudio}
          isPlaying={audioHook.isPlaying}
          loading={audioHook.loading}
          onPlayAudio={audioHook.playAudio}
          onTogglePlayPause={audioHook.togglePlayPause}
          onStopAudio={audioHook.stopAudio}
        />

        <FullscreenSearchButton onOpenSearch={() => setShowSearch(true)} />

        <FullscreenHymnBuffer
          hymnBuffer={hymnBuffer.hymnBuffer}
          currentBufferIndex={hymnBuffer.currentBufferIndex}
          onSelectHymn={handleSelectHymnFromBuffer}
          onRemoveFromBuffer={hymnBuffer.removeFromBuffer}
          isVisible={showBuffer}
          onToggleVisibility={() => setShowBuffer(!showBuffer)}
        />
      </div>

      {/* Search Dialog */}
      <FullscreenHymnSearch
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        onAddToBuffer={hymnBuffer.addToBuffer}
        bufferHymnIds={hymnBuffer.hymnBuffer.map(h => h.id)}
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
