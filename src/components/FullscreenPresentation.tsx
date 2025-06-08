
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, Home, Square } from "lucide-react";

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
  const [showControls, setShowControls] = useState(true);
  const [isIdle, setIsIdle] = useState(false);

  // Auto-hide controls after 3 seconds of inactivity
  useEffect(() => {
    let idleTimer: NodeJS.Timeout;
    let hideTimer: NodeJS.Timeout;

    const resetTimers = () => {
      setIsIdle(false);
      setShowControls(true);
      
      clearTimeout(idleTimer);
      clearTimeout(hideTimer);
      
      idleTimer = setTimeout(() => {
        setIsIdle(true);
      }, 2000);
      
      hideTimer = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    const handleActivity = () => {
      resetTimers();
    };

    // Initial timer setup
    resetTimers();

    // Listen for user activity
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    return () => {
      clearTimeout(idleTimer);
      clearTimeout(hideTimer);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, []);

  // Enhanced keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          onExit();
          break;
        case 'ArrowRight':
        case ' ':
          event.preventDefault();
          if (currentVerse < hymn.verses.length - 1) {
            onVerseChange(currentVerse + 1);
          } else if (hymn.chorus && currentVerse === hymn.verses.length - 1) {
            onVerseChange(hymn.verses.length); // Show chorus
          }
          break;
        case 'ArrowLeft':
          event.preventDefault();
          if (currentVerse > 0) {
            onVerseChange(currentVerse - 1);
          }
          break;
        case 'Home':
          event.preventDefault();
          onVerseChange(0);
          break;
        case 'End':
          event.preventDefault();
          if (hymn.chorus) {
            onVerseChange(hymn.verses.length); // Go to chorus
          } else {
            onVerseChange(hymn.verses.length - 1);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentVerse, hymn, onVerseChange, onExit]);

  const getCurrentContent = () => {
    if (currentVerse < hymn.verses.length) {
      return {
        type: 'verse',
        number: currentVerse + 1,
        content: hymn.verses[currentVerse]
      };
    } else if (hymn.chorus) {
      return {
        type: 'chorus',
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
      {/* Background gradient for visual appeal */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      
      {/* Main content area */}
      <div className="relative h-full flex flex-col items-center justify-center p-8">
        {/* Hymn title - always visible but subtle */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-300 text-center opacity-70">
            {hymn.title}
          </h1>
        </div>

        {/* Current section indicator */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 mt-8">
          <div className="text-lg md:text-xl text-slate-400 text-center">
            {content.type === 'verse' ? `Verse ${content.number}` : 'Chorus'}
          </div>
        </div>

        {/* Main lyrics display */}
        <div className="flex-1 flex items-center justify-center max-w-6xl w-full">
          <div className="text-center">
            <div className="text-4xl md:text-6xl lg:text-7xl leading-relaxed text-white font-light">
              {content.content.split('\n').map((line, lineIdx) => (
                <div key={lineIdx} className="mb-4 md:mb-6 lg:mb-8">
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="text-slate-400 text-center">
            <div className="text-sm mb-2">
              {content.type === 'verse' ? currentVerse + 1 : 'C'} of {hymn.verses.length}{hymn.chorus ? ' + Chorus' : ''}
            </div>
            <div className="flex gap-1">
              {Array.from({ length: hymn.verses.length + (hymn.chorus ? 1 : 0) }).map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx === currentVerse ? 'bg-white' : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating controls */}
      <div 
        className={`fixed inset-0 pointer-events-none transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Exit button - top right */}
        <Button
          onClick={onExit}
          variant="outline"
          size="sm"
          className="fixed top-6 right-6 pointer-events-auto bg-black/50 border-white/20 text-white hover:bg-black/70 backdrop-blur-sm"
        >
          <X className="w-4 h-4 mr-2" />
          Exit Fullscreen
        </Button>

        {/* Navigation controls - center sides */}
        {canGoPrevious && (
          <Button
            onClick={() => onVerseChange(currentVerse - 1)}
            variant="outline"
            size="lg"
            className="fixed left-6 top-1/2 transform -translate-y-1/2 pointer-events-auto bg-black/50 border-white/20 text-white hover:bg-black/70 backdrop-blur-sm w-12 h-12"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
        )}

        {canGoNext && (
          <Button
            onClick={() => {
              if (currentVerse < hymn.verses.length - 1) {
                onVerseChange(currentVerse + 1);
              } else if (hymn.chorus) {
                onVerseChange(hymn.verses.length);
              }
            }}
            variant="outline"
            size="lg"
            className="fixed right-6 top-1/2 transform -translate-y-1/2 pointer-events-auto bg-black/50 border-white/20 text-white hover:bg-black/70 backdrop-blur-sm w-12 h-12"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        )}

        {/* Quick navigation - bottom center */}
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 pointer-events-auto">
          <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-lg p-2 border border-white/20">
            <Button
              onClick={() => onVerseChange(0)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-2"
              disabled={currentVerse === 0}
            >
              <Home className="w-4 h-4" />
            </Button>
            
            <div className="text-white text-sm px-2 min-w-[80px] text-center">
              {content.type === 'verse' ? `Verse ${content.number}` : 'Chorus'}
            </div>
            
            <Button
              onClick={() => {
                if (hymn.chorus) {
                  onVerseChange(hymn.verses.length);
                } else {
                  onVerseChange(hymn.verses.length - 1);
                }
              }}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-2"
              disabled={!hymn.chorus && currentVerse === hymn.verses.length - 1}
            >
              <Square className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Help text - only shows when controls are visible */}
      {showControls && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 text-slate-400 text-sm text-center">
          <div>Arrow keys or spacebar to navigate • Home/End for first/last • Esc to exit</div>
        </div>
      )}
    </div>
  );
};

export default FullscreenPresentation;
