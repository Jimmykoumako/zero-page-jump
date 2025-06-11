
import { useEffect } from "react";
import { useHymnBuffer } from "@/hooks/useHymnBuffer";
import { useFullscreenPresentationActions } from "@/hooks/useFullscreenPresentationActions";
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
import FullscreenMainContent from "./FullscreenMainContent";

interface FullscreenContentProps {
  onBack: () => void;
  onSettingsClick: () => void;
  onExitFullscreen: () => void;
  onPlayPause: () => void;
  onVolumeChange: (volume: number) => void;
  onSeek: (time: number) => void;
  onTrackSelect: (hymn: any) => void;
  onPrevious: () => void;
  onNext: () => void;
}

const FullscreenContent = ({ 
  onBack, 
  onSettingsClick, 
  onExitFullscreen,
  onPlayPause,
  onVolumeChange,
  onSeek,
  onTrackSelect,
  onPrevious,
  onNext
}: FullscreenContentProps) => {
  const { buffer, removeFromBuffer, clearBuffer } = useHymnBuffer();
  const {
    state,
    handleSelectHymn,
    handleBufferHymnSelect,
    handleNavigation,
    setIsSearchOpen,
    setIsBufferVisible,
    setFontSize,
    setIsAutoScrollEnabled,
    setAutoScrollSpeed,
    setShowIntroCarousel
  } = useFullscreenPresentationActions();

  // Hymn data and display logic
  const currentHymnData = state.selectedHymnbook?.hymns?.find((h: any) => h.id.toString() === state.currentHymn);
  const displayHymns = state.selectedHymnbook?.hymns || [];
  const currentIndex = displayHymns.findIndex((h: any) => h.id.toString() === state.currentHymn);

  const handlePrevious = () => handleNavigation('previous');
  const handleNext = () => handleNavigation('next');

  console.log('FullscreenContent state:', {
    currentHymn: state.currentHymn,
    currentHymnData,
    selectedHymnbook: state.selectedHymnbook,
    showIntroCarousel: state.showIntroCarousel
  });

  return (
    <FullscreenControlsManager>
      {(showControls) => (
        <FullscreenMainContent
          currentHymnData={currentHymnData}
          showControls={showControls}
          onExitFullscreen={onExitFullscreen}
        >
          {/* Keyboard Handler */}
          <FullscreenKeyboardHandler
            isSearchOpen={state.isSearchOpen}
            isBufferVisible={state.isBufferVisible}
            setIsSearchOpen={setIsSearchOpen}
            setIsBufferVisible={setIsBufferVisible}
            onExitFullscreen={onExitFullscreen}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onPlayPause={onPlayPause}
            fontSize={state.fontSize}
            setFontSize={setFontSize}
            isAutoScrollEnabled={state.isAutoScrollEnabled}
            setIsAutoScrollEnabled={setIsAutoScrollEnabled}
          />

          {/* Auto Scroll */}
          <FullscreenAutoScroll
            isAutoScrollEnabled={state.isAutoScrollEnabled}
            autoScrollSpeed={state.autoScrollSpeed}
          />

          {/* Search Modal */}
          {state.isSearchOpen && (
            <FullscreenHymnSearch
              selectedHymnbook={state.selectedHymnbook}
              onSelectHymn={handleSelectHymn}
              onClose={() => setIsSearchOpen(false)}
            />
          )}

          {/* Buffer Modal */}
          {state.isBufferVisible && (
            <FullscreenHymnBuffer
              buffer={buffer}
              onSelectHymn={handleBufferHymnSelect}
              onRemoveFromBuffer={removeFromBuffer}
              onClearBuffer={clearBuffer}
              onClose={() => setIsBufferVisible(false)}
            />
          )}

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
                    fontSize={state.fontSize}
                    setFontSize={setFontSize}
                    isAutoScrollEnabled={state.isAutoScrollEnabled}
                    setIsAutoScrollEnabled={setIsAutoScrollEnabled}
                    autoScrollSpeed={state.autoScrollSpeed}
                    setAutoScrollSpeed={setAutoScrollSpeed}
                  />
                  
                  {state.groupSession && (
                    <FullscreenSessionControls
                      groupSession={state.groupSession}
                      currentHymn={parseInt(state.currentHymn)}
                      setCurrentHymn={(id) => handleNavigation('next')}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Hymn Display */}
          {currentHymnData && (
            <FullscreenHymnDisplay
              hymn={currentHymnData}
              fontSize={state.fontSize}
              showIntroCarousel={state.showIntroCarousel}
              setShowIntroCarousel={setShowIntroCarousel}
            />
          )}

          {/* Bottom Audio Controls */}
          <div className={`fixed bottom-0 left-0 right-0 z-50 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}>
            <FullscreenAudioControls
              playingHymn={state.playingHymn}
              currentAudio={state.currentAudio}
              isPlaying={state.isPlaying}
              currentTime={state.currentTime}
              duration={state.duration}
              volume={state.volume}
              onPlayPause={onPlayPause}
              onVolumeChange={onVolumeChange}
              onSeek={onSeek}
              onTrackSelect={onTrackSelect}
              onPrevious={onPrevious}
              onNext={onNext}
            />
          </div>
        </FullscreenMainContent>
      )}
    </FullscreenControlsManager>
  );
};

export default FullscreenContent;
