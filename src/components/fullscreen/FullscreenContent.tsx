
import { useHymnBuffer } from "@/hooks/useHymnBuffer";
import { useFullscreenNavigation } from "@/hooks/useFullscreenNavigation";
import { useFullscreenSearch } from "@/hooks/useFullscreenSearch";
import { useFullscreenDisplay } from "@/hooks/useFullscreenDisplay";
import { useFullscreenSession } from "@/hooks/useFullscreenSession";
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
  
  // Use specialized hooks
  const navigation = useFullscreenNavigation();
  const search = useFullscreenSearch();
  const display = useFullscreenDisplay();
  const session = useFullscreenSession();

  const handlePrevious = () => navigation.handleNavigation('previous');
  const handleNext = () => navigation.handleNavigation('next');

  console.log('FullscreenContent state:', {
    currentHymn: navigation.currentHymn,
    currentHymnData: navigation.currentHymnData,
    selectedHymnbook: search.selectedHymnbook,
    showIntroCarousel: navigation.showIntroCarousel
  });

  return (
    <FullscreenControlsManager>
      {(showControls) => (
        <FullscreenMainContent
          currentHymnData={navigation.currentHymnData}
          showControls={showControls}
          onExitFullscreen={onExitFullscreen}
        >
          {/* Keyboard Handler */}
          <FullscreenKeyboardHandler
            isSearchOpen={search.isSearchOpen}
            isBufferVisible={search.isBufferVisible}
            setIsSearchOpen={search.setIsSearchOpen}
            setIsBufferVisible={search.setIsBufferVisible}
            onExitFullscreen={onExitFullscreen}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onPlayPause={onPlayPause}
            fontSize={display.fontSize}
            setFontSize={display.setFontSize}
            isAutoScrollEnabled={display.isAutoScrollEnabled}
            setIsAutoScrollEnabled={display.setIsAutoScrollEnabled}
          />

          {/* Auto Scroll */}
          <FullscreenAutoScroll
            isAutoScrollEnabled={display.isAutoScrollEnabled}
            autoScrollSpeed={display.autoScrollSpeed}
          />

          {/* Search Modal */}
          {search.isSearchOpen && (
            <FullscreenHymnSearch
              selectedHymnbook={search.selectedHymnbook}
              onSelectHymn={navigation.handleSelectHymn}
              onClose={search.closeSearch}
            />
          )}

          {/* Buffer Modal */}
          {search.isBufferVisible && (
            <FullscreenHymnBuffer
              buffer={buffer}
              onSelectHymn={navigation.handleBufferHymnSelect}
              onRemoveFromBuffer={removeFromBuffer}
              onClearBuffer={clearBuffer}
              onClose={search.closeBuffer}
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
                    currentIndex={navigation.currentIndex}
                    totalHymns={navigation.displayHymns.length}
                    onSearchClick={search.openSearch}
                    onBufferClick={search.openBuffer}
                    bufferCount={buffer.length}
                  />
                </div>
                
                <div className="flex items-center gap-4">
                  <FullscreenFontControls
                    fontSize={display.fontSize}
                    setFontSize={display.setFontSize}
                    isAutoScrollEnabled={display.isAutoScrollEnabled}
                    setIsAutoScrollEnabled={display.setIsAutoScrollEnabled}
                    autoScrollSpeed={display.autoScrollSpeed}
                    setAutoScrollSpeed={display.setAutoScrollSpeed}
                  />
                  
                  {session.groupSession && (
                    <FullscreenSessionControls
                      groupSession={session.groupSession}
                      currentHymn={parseInt(navigation.currentHymn)}
                      setCurrentHymn={(id) => navigation.handleNavigation('next')}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Hymn Display */}
          {navigation.currentHymnData && (
            <FullscreenHymnDisplay
              hymn={navigation.currentHymnData}
              fontSize={display.fontSize}
              showIntroCarousel={navigation.showIntroCarousel}
              setShowIntroCarousel={navigation.setShowIntroCarousel}
            />
          )}

          {/* Bottom Audio Controls */}
          <div className={`fixed bottom-0 left-0 right-0 z-50 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}>
            <FullscreenAudioControls
              playingHymn={null}
              currentAudio={null}
              isPlaying={false}
              currentTime={0}
              duration={0}
              volume={1}
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
