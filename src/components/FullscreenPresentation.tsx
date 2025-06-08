
import { useState } from "react";
import { useFullscreenAudio } from "@/hooks/useFullscreenAudio";
import { useFullscreenControls } from "@/hooks/useFullscreenControls";
import { useFullscreenKeyboard } from "@/hooks/useFullscreenKeyboard";
import FullscreenContent from "@/components/fullscreen/FullscreenContent";
import FullscreenAudioControls from "@/components/fullscreen/FullscreenAudioControls";
import FullscreenFontControls from "@/components/fullscreen/FullscreenFontControls";
import FullscreenNavigationControls from "@/components/fullscreen/FullscreenNavigationControls";

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
  const audioHook = useFullscreenAudio(hymn.number);

  // Keyboard controls
  useFullscreenKeyboard({
    hymn,
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
    if (currentVerse < hymn.verses.length) {
      return {
        type: 'verse' as const,
        number: currentVerse + 1,
        content: hymn.verses[currentVerse]
      };
    } else if (hymn.chorus) {
      return {
        type: 'chorus' as const,
        number: null,
        content: hymn.chorus
      };
    }
    return null;
  };

  const canGoPrevious = currentVerse > 0;
  const canGoNext = currentVerse < hymn.verses.length - 1 || (hymn.chorus && currentVerse < hymn.verses.length);

  const content = getCurrentContent();
  if (!content) return null;

  return (
    <div className="fixed inset-0 bg-slate-900 text-white z-50 overflow-hidden">
      <FullscreenContent
        title={hymn.title}
        content={content}
        fontSizeClass={fontSizeClasses[fontSize]}
        currentVerse={currentVerse}
        totalVerses={hymn.verses.length}
        hasChorus={!!hymn.chorus}
        isPlayingAudio={audioHook.isPlaying}
      />

      {/* Floating controls */}
      <div 
        className={`fixed inset-0 pointer-events-none transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <FullscreenNavigationControls
          hymn={hymn}
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
      </div>

      {/* Help text - only shows when controls are visible */}
      {showControls && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 text-slate-400 text-sm text-center">
          <div>Arrow keys or spacebar to navigate • Up/Down arrows for font size • P to play/pause • S to stop • Home/End for first/last • Esc to exit</div>
        </div>
      )}
    </div>
  );
};

export default FullscreenPresentation;
