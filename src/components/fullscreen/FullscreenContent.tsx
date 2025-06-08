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
  hymn: Hymn;
  onExit: () => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  currentVerseIndex: number;
  onVerseChange: (index: number) => void;
}

const FullscreenContent = ({
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

  const handleSelectHymn = (selectedHymn: Hymn) => {
    addToBuffer(selectedHymn);
    setCurrentHymn(selectedHymn.id);
    setIsSearchOpen(false);
  };

  const handleBufferHymnSelect = (selectedHymn: Hymn) => {
    setCurrentHymn(selectedHymn.id);
    // This would need to be handled by parent component to actually change the hymn
    // For now, we'll just close the buffer
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
          currentVerseIndex={currentVerseIndex}
          totalVerses={hymn.verses.length + (hymn.chorus ? 1 : 0)}
          onVerseChange={onVerseChange}
          onPreviousHymn={() => {
            const prevHymn = moveToPrevious();
            if (prevHymn) {
              // Handle hymn change in parent component
            }
          }}
          onNextHymn={() => {
            const nextHymn = moveToNext();
            if (nextHymn) {
              // Handle hymn change in parent component
            }
          }}
        />

        {/* Font controls */}
        <FullscreenFontControls
          fontSize={fontSize}
          onFontSizeChange={onFontSizeChange}
        />
      </div>

      {/* Main content */}
      <div className="flex items-center justify-center h-full p-8">
        <div className="max-w-4xl w-full text-center space-y-8">
          {/* Hymn header */}
          <div className="space-y-2">
            <h1 
              className="font-bold text-blue-300"
              style={{ fontSize: `${fontSize * 0.6}px` }}
            >
              #{hymn.number}
            </h1>
            <h2 
              className="font-bold leading-tight"
              style={{ fontSize: `${fontSize * 0.8}px` }}
            >
              {hymn.title}
            </h2>
            <p 
              className="text-slate-300"
              style={{ fontSize: `${fontSize * 0.4}px` }}
            >
              {hymn.author}
            </p>
          </div>

          {/* Current verse/chorus */}
          <div className="space-y-6">
            {currentVerseIndex < hymn.verses.length ? (
              <div>
                <h3 
                  className="text-blue-300 mb-4"
                  style={{ fontSize: `${fontSize * 0.5}px` }}
                >
                  Verse {currentVerseIndex + 1}
                </h3>
                <p 
                  className="leading-relaxed whitespace-pre-line"
                  style={{ fontSize: `${fontSize}px`, lineHeight: '1.6' }}
                >
                  {hymn.verses[currentVerseIndex]}
                </p>
              </div>
            ) : hymn.chorus && currentVerseIndex === hymn.verses.length ? (
              <div>
                <h3 
                  className="text-blue-300 mb-4"
                  style={{ fontSize: `${fontSize * 0.5}px` }}
                >
                  Chorus
                </h3>
                <p 
                  className="leading-relaxed whitespace-pre-line"
                  style={{ fontSize: `${fontSize}px`, lineHeight: '1.6' }}
                >
                  {hymn.chorus}
                </p>
              </div>
            ) : null}
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
          onSelectHymn={handleSelectHymn}
          onClose={() => setIsSearchOpen(false)}
        />
      )}
    </div>
  );
};

export default FullscreenContent;
