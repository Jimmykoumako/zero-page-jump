
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
import FullscreenHymnDisplay from "./FullscreenHymnDisplay";
import FullscreenKeyboardHandler from "./FullscreenKeyboardHandler";
import FullscreenAutoScroll from "./FullscreenAutoScroll";
import FullscreenControlsManager from "./FullscreenControlsManager";

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
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(false);
  const [autoScrollSpeed, setAutoScrollSpeed] = useState(50);
  
  const { buffer, addToBuffer, removeFromBuffer, clearBuffer } = useHymnBuffer();

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
    <FullscreenControlsManager>
      {(showControls) => (
        <div className="fixed inset-0 bg-black text-white z-50 overflow-auto">
          {/* Keyboard Handler */}
          <FullscreenKeyboardHandler
            isSearchOpen={isSearchOpen}
            isBufferVisible={isBufferVisible}
            setIsSearchOpen={setIsSearchOpen}
            setIsBufferVisible={setIsBufferVisible}
            onExitFullscreen={onExitFullscreen}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onPlayPause={onPlayPause}
            fontSize={fontSize}
            setFontSize={setFontSize}
            isAutoScrollEnabled={isAutoScrollEnabled}
            setIsAutoScrollEnabled={setIsAutoScrollEnabled}
          />

          {/* Auto Scroll */}
          <FullscreenAutoScroll
            isAutoScrollEnabled={isAutoScrollEnabled}
            autoScrollSpeed={autoScrollSpeed}
          />

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

            {/* Hymn Display */}
            <FullscreenHymnDisplay
              hymn={currentHymnData}
              fontSize={fontSize}
              showIntroCarousel={showIntroCarousel}
              setShowIntroCarousel={setShowIntroCarousel}
            />

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
      )}
    </FullscreenControlsManager>
  );
};

export default FullscreenContent;
