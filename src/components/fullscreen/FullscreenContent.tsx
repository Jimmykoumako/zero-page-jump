import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Hymn } from "@/types/hymn";
import { useHymnBuffer } from "@/hooks/useHymnBuffer";
import FullscreenHymnSearch from "./FullscreenHymnSearch";
import FullscreenHymnBuffer from "./FullscreenHymnBuffer";
import FullscreenNavigationControls from "./FullscreenNavigationControls";
import FullscreenFontControls from "./FullscreenFontControls";
import FullscreenExitControls from "./FullscreenExitControls";
import FullscreenAudioControls from "./FullscreenAudioControls";
import FullscreenSessionControls from "./FullscreenSessionControls";

interface FullscreenContentProps {
  selectedHymnbook: any;
  groupSession: { sessionId: string; isLeader: boolean } | null;
  onBack: () => void;
  onSettingsClick: () => void;
  onExitFullscreen: () => void;
  currentHymn: string;
  setCurrentHymn: (hymnId: string) => void;
  showIntroCarousel: boolean;
  setShowIntroCarousel: (show: boolean) => void;
  playingHymn: Hymn | null;
  currentAudio: HTMLAudioElement | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  onPlayPause: () => void;
  onVolumeChange: (volume: number) => void;
  onSeek: (time: number) => void;
  onTrackSelect: (hymn: Hymn) => void;
  onPrevious: () => void;
  onNext: () => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isBufferVisible: boolean;
  setIsBufferVisible: (visible: boolean) => void;
}

const FullscreenContent = ({ 
  selectedHymnbook, 
  groupSession, 
  onBack, 
  onSettingsClick, 
  onExitFullscreen,
  currentHymn,
  setCurrentHymn,
  showIntroCarousel,
  setShowIntroCarousel,
  playingHymn,
  currentAudio,
  isPlaying,
  currentTime,
  duration,
  volume,
  onPlayPause,
  onVolumeChange,
  onSeek,
  onTrackSelect,
  onPrevious,
  onNext,
  fontSize,
  setFontSize,
  isSearchOpen,
  setIsSearchOpen,
  isBufferVisible,
  setIsBufferVisible
}: FullscreenContentProps) => {
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(false);
  const [autoScrollSpeed, setAutoScrollSpeed] = useState(50);
  
  const { buffer, addToBuffer, removeFromBuffer, clearBuffer } = useHymnBuffer();

  // Auto-hide controls on inactivity
  useEffect(() => {
    const resetTimeout = () => {
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
      
      setShowControls(true);
      const timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
      
      setControlsTimeout(timeout);
    };

    const handleMouseMove = () => resetTimeout();
    const handleKeyPress = () => resetTimeout();

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('click', handleMouseMove);

    resetTimeout();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('click', handleMouseMove);
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, [controlsTimeout]);

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoScrollEnabled) return;

    const scrollInterval = setInterval(() => {
      window.scrollBy({
        top: 1,
        behavior: 'smooth'
      });
    }, 100 - autoScrollSpeed);

    return () => clearInterval(scrollInterval);
  }, [isAutoScrollEnabled, autoScrollSpeed]);

  // Hymn data and display logic
  const currentHymnData = selectedHymnbook?.hymns?.find((h: Hymn) => h.id.toString() === currentHymn);
  
  const displayHymns = selectedHymnbook?.hymns || [];
  const currentIndex = displayHymns.findIndex((h: Hymn) => h.id.toString() === currentHymn);
  
  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevHymn = displayHymns[currentIndex - 1];
      setCurrentHymn(prevHymn.id.toString());
      setShowIntroCarousel(true);
    }
  };

  const handleNext = () => {
    if (currentIndex < displayHymns.length - 1) {
      const nextHymn = displayHymns[currentIndex + 1];
      setCurrentHymn(nextHymn.id.toString());
      setShowIntroCarousel(true);
    }
  };

  const handleSelectHymn = (selectedHymn: Hymn) => {
    addToBuffer(selectedHymn);
    setCurrentHymn(selectedHymn.id.toString());
    setIsSearchOpen(false);
    setShowIntroCarousel(true);
  };

  const handleBufferHymnSelect = (selectedHymn: Hymn) => {
    setCurrentHymn(selectedHymn.id.toString());
    setIsBufferVisible(false);
    setShowIntroCarousel(true);
  };

  // Keyboard shortcuts
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
          handlePrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNext();
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
  }, [isSearchOpen, isBufferVisible, onExitFullscreen, handlePrevious, handleNext, onPlayPause, fontSize, setFontSize, isAutoScrollEnabled]);

  if (!currentHymnData) {
    return (
      <div className="fixed inset-0 bg-black text-white flex items-center justify-center z-50">
        <div className="text-center">
          <h2 className="text-2xl mb-4">No hymn selected</h2>
          <Button onClick={onExitFullscreen} variant="outline">
            <X className="w-4 h-4 mr-2" />
            Exit Fullscreen
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black text-white z-50 overflow-auto">
      {/* Search Modal */}
      {isSearchOpen && (
        <FullscreenHymnSearch
          selectedHymnbook={selectedHymnbook}
          onSelectHymn={handleSelectHymn}
          onClose={() => setIsSearchOpen(false)}
        />
      )}

      {/* Buffer Modal */}
      {isBufferVisible && (
        <FullscreenHymnBuffer
          buffer={buffer}
          onSelectHymn={handleBufferHymnSelect}
          onRemoveFromBuffer={removeFromBuffer}
          onClearBuffer={clearBuffer}
          onClose={() => setIsBufferVisible(false)}
        />
      )}

      {/* Main Content */}
      <div className="min-h-screen flex flex-col">
        {/* Top Controls */}
        <div className={`fixed top-0 left-0 right-0 z-50 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
          <div className="bg-black/80 backdrop-blur-sm p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <FullscreenExitControls onExitFullscreen={onExitFullscreen} />
                <FullscreenNavigationControls
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                  currentIndex={currentIndex}
                  totalHymns={displayHymns.length}
                  onSearchClick={() => setIsSearchOpen(true)}
                  onBufferClick={() => setIsBufferVisible(true)}
                  bufferCount={buffer.length}
                />
              </div>
              
              <div className="flex items-center gap-4">
                <FullscreenFontControls
                  fontSize={fontSize}
                  setFontSize={setFontSize}
                  isAutoScrollEnabled={isAutoScrollEnabled}
                  setIsAutoScrollEnabled={setIsAutoScrollEnabled}
                  autoScrollSpeed={autoScrollSpeed}
                  setAutoScrollSpeed={setAutoScrollSpeed}
                />
                
                {groupSession && (
                  <FullscreenSessionControls
                    groupSession={groupSession}
                    currentHymn={parseInt(currentHymn)}
                    setCurrentHymn={(id) => setCurrentHymn(id.toString())}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Hymn Content */}
        <div className="flex-1 pt-20 pb-32 px-8">
          {/* Hymn Header */}
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold mb-4" style={{ fontSize: `${fontSize + 12}px` }}>
              {currentHymnData.number}. {currentHymnData.title}
            </h1>
            {currentHymnData.subtitle && (
              <h2 className="text-3xl text-gray-300 mb-2" style={{ fontSize: `${fontSize + 4}px` }}>
                {currentHymnData.subtitle}
              </h2>
            )}
            {currentHymnData.author && (
              <p className="text-xl text-gray-400" style={{ fontSize: `${fontSize}px` }}>
                by {currentHymnData.author}
              </p>
            )}
          </div>

          {/* Intro Carousel */}
          {showIntroCarousel && (
            <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-40">
              <div className="text-center max-w-4xl px-8">
                <h1 className="text-8xl font-bold mb-6 text-white">
                  {currentHymnData.number}
                </h1>
                <h2 className="text-5xl font-bold mb-4 text-white">
                  {currentHymnData.title}
                </h2>
                {currentHymnData.subtitle && (
                  <h3 className="text-3xl text-gray-300 mb-6">
                    {currentHymnData.subtitle}
                  </h3>
                )}
                {currentHymnData.author && (
                  <p className="text-2xl text-gray-400 mb-8">
                    by {currentHymnData.author}
                  </p>
                )}
                <Button
                  onClick={() => setShowIntroCarousel(false)}
                  size="lg"
                  className="bg-white text-black hover:bg-gray-200"
                >
                  Begin Singing
                </Button>
              </div>
            </div>
          )}

          {/* Lyrics */}
          {!showIntroCarousel && (
            <div className="max-w-4xl mx-auto">
              {currentHymnData.verses?.map((verse, index) => (
                <div key={index} className="mb-12">
                  <div className="text-center leading-relaxed">
                    {verse.split('\n').map((line, lineIndex) => (
                      <div
                        key={lineIndex}
                        className="mb-2"
                        style={{ fontSize: `${fontSize}px` }}
                      >
                        {line || '\u00A0'}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {currentHymnData.chorus && (
                <div className="mb-12 border-l-4 border-blue-500 pl-8">
                  <h3 className="text-2xl font-bold mb-4 text-blue-400">Chorus</h3>
                  <div className="text-center leading-relaxed">
                    {currentHymnData.chorus.split('\n').map((line, lineIndex) => (
                      <div
                        key={lineIndex}
                        className="mb-2"
                        style={{ fontSize: `${fontSize}px` }}
                      >
                        {line || '\u00A0'}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Audio Controls */}
        <div className={`fixed bottom-0 left-0 right-0 z-50 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
          <FullscreenAudioControls
            playingHymn={playingHymn}
            currentAudio={currentAudio}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            volume={volume}
            onPlayPause={onPlayPause}
            onVolumeChange={onVolumeChange}
            onSeek={onSeek}
            onTrackSelect={onTrackSelect}
            onPrevious={onPrevious}
            onNext={onNext}
          />
        </div>
      </div>
    </div>
  );
};

export default FullscreenContent;
