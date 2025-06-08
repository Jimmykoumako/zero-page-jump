
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import FullscreenSearchButton from "./FullscreenSearchButton";
import FullscreenHymnSearch from "./FullscreenHymnSearch";
import FullscreenNavigationControls from "./FullscreenNavigationControls";
import FullscreenFontControls from "./FullscreenFontControls";
import FullscreenHymnBuffer from "./FullscreenHymnBuffer";
import FullscreenAudioControls from "./FullscreenAudioControls";
import { useHymnBuffer } from "@/hooks/useHymnBuffer";

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

interface FullscreenContentProps {
  title: string;
  content: {
    type: 'verse' | 'chorus';
    number: number | null;
    content: string;
  };
  fontSizeClass: string;
  currentVerse: number;
  totalVerses: number;
  hasChorus: boolean;
  isPlayingAudio: boolean;
  hymn: Hymn;
  onExit: () => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  currentVerseIndex: number;
  onVerseChange: (index: number) => void;
}

const FullscreenContent = ({
  title,
  content,
  fontSizeClass,
  currentVerse,
  totalVerses,
  hasChorus,
  isPlayingAudio,
  hymn,
  onExit,
  fontSize,
  onFontSizeChange,
  currentVerseIndex,
  onVerseChange
}: FullscreenContentProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBufferVisible, setIsBufferVisible] = useState(false);
  const [isAudioVisible, setIsAudioVisible] = useState(false);
  
  const {
    hymnBuffer,
    currentBufferIndex,
    addToBuffer,
    removeFromBuffer,
    moveToNext,
    moveToPrevious,
    setCurrentHymn
  } = useHymnBuffer();

  // Add current hymn to buffer when component mounts
  useEffect(() => {
    addToBuffer(hymn);
  }, [hymn, addToBuffer]);

  // Debug logging
  useEffect(() => {
    console.log('FullscreenContent Debug:', {
      title,
      content,
      hymn,
      currentVerseIndex,
      fontSize
    });
  }, [title, content, hymn, currentVerseIndex, fontSize]);

  const handleSelectHymn = (selectedHymn: Hymn) => {
    addToBuffer(selectedHymn);
    setCurrentHymn(selectedHymn.id);
    setIsSearchOpen(false);
  };

  const handleBufferHymnSelect = (selectedHymn: Hymn) => {
    setCurrentHymn(selectedHymn.id);
    setIsBufferVisible(false);
  };

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        onVerseChange(Math.min(currentVerseIndex + 1, hymn.verses.length - 1 + (hymn.chorus ? 1 : 0)));
      } else if (event.key === 'ArrowLeft') {
        onVerseChange(Math.max(currentVerseIndex - 1, 0));
      } else if (event.key === 'Escape') {
        onExit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentVerseIndex, hymn, onExit, onVerseChange]);

  // Convert fontSize number to pixel value
  const baseFontSize = 24; // Base size in pixels
  const fontSizeInPx = baseFontSize + (fontSize * 8); // Each step adds 8px

  // Ensure we have valid content
  if (!content || !content.content) {
    console.log('No content available:', { content, hymn });
    return (
      <div className="fixed inset-0 bg-black text-white z-50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-900" />
        
        <Button
          onClick={onExit}
          variant="ghost"
          size="sm"
          className="fixed top-6 right-6 text-white hover:bg-white/20 backdrop-blur-sm"
        >
          <X className="w-5 h-5" />
        </Button>

        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">No Content Available</h2>
            <p className="text-xl text-slate-400">Please select a hymn to display</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black text-white z-50 overflow-hidden">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-900" />
      
      {/* Controls overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Exit button */}
        <Button
          onClick={onExit}
          variant="ghost"
          size="sm"
          className="fixed top-6 right-6 pointer-events-auto text-white hover:bg-white/20 backdrop-blur-sm"
        >
          <X className="w-5 h-5" />
        </Button>

        {/* Search button */}
        <FullscreenSearchButton onOpenSearch={() => setIsSearchOpen(true)} />

        {/* Audio controls */}
        <FullscreenAudioControls
          hymnNumber={hymn.number}
          isVisible={isAudioVisible}
          onToggleVisibility={() => setIsAudioVisible(!isAudioVisible)}
        />

        {/* Buffer controls */}
        <FullscreenHymnBuffer
          hymnBuffer={hymnBuffer}
          currentBufferIndex={currentBufferIndex}
          onSelectHymn={handleBufferHymnSelect}
          onRemoveFromBuffer={removeFromBuffer}
          isVisible={isBufferVisible}
          onToggleVisibility={() => setIsBufferVisible(!isBufferVisible)}
        />

        {/* Navigation controls */}
        <FullscreenNavigationControls
          hymn={hymn}
          currentVerse={currentVerseIndex}
          content={content}
          canGoPrevious={currentVerseIndex > 0}
          canGoNext={currentVerseIndex < hymn.verses.length - 1 || (hymn.chorus && currentVerseIndex < hymn.verses.length)}
          onVerseChange={onVerseChange}
          onExit={onExit}
          onStopAudio={() => {}}
        />

        {/* Font controls */}
        <FullscreenFontControls
          fontSize={fontSize}
          maxFontSize={9}
          onIncreaseFontSize={() => onFontSizeChange(Math.min(fontSize + 1, 8))}
          onDecreaseFontSize={() => onFontSizeChange(Math.max(fontSize - 1, 0))}
        />
      </div>

      {/* Main content */}
      <div className="flex items-center justify-center h-full p-8 relative z-10">
        <div className="max-w-4xl w-full text-center space-y-8">
          {/* Hymn header */}
          <div className="space-y-2">
            <h1 
              className="font-bold text-blue-300"
              style={{ fontSize: `${Math.floor(fontSizeInPx * 0.6)}px` }}
            >
              #{hymn.number}
            </h1>
            <h2 
              className="font-bold leading-tight"
              style={{ fontSize: `${Math.floor(fontSizeInPx * 0.8)}px` }}
            >
              {title}
            </h2>
            <p 
              className="text-slate-300"
              style={{ fontSize: `${Math.floor(fontSizeInPx * 0.4)}px` }}
            >
              {hymn.author}
            </p>
          </div>

          {/* Current verse/chorus */}
          <div className="space-y-6">
            <div>
              <h3 
                className="text-blue-300 mb-4"
                style={{ fontSize: `${Math.floor(fontSizeInPx * 0.5)}px` }}
              >
                {content.type === 'verse' ? `Verse ${content.number}` : 'Chorus'}
              </h3>
              <p 
                className="leading-relaxed whitespace-pre-line"
                style={{ fontSize: `${fontSizeInPx}px`, lineHeight: '1.6' }}
              >
                {content.content}
              </p>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="flex justify-center space-x-2">
            {Array.from({ length: hymn.verses.length + (hymn.chorus ? 1 : 0) }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === currentVerseIndex ? 'bg-blue-400' : 'bg-slate-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Search overlay */}
      {isSearchOpen && (
        <FullscreenHymnSearch
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onAddToBuffer={addToBuffer}
          bufferHymnIds={hymnBuffer.map(h => h.id)}
        />
      )}
    </div>
  );
};

export default FullscreenContent;
