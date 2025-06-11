
import HymnHeader from "../HymnHeader";
import QRCodeDisplay from "../QRCodeDisplay";
import HymnDisplay from "../HymnDisplay";
import HymnControls from "../HymnControls";
import type { Hymn } from "@/types/hymn";

interface HymnDisplayViewProps {
  hymn: Hymn;
  currentVerse: number;
  isPlaying: boolean;
  mode: 'hymnal' | 'display';
  deviceId: string;
  showQR: boolean;
  groupSession?: {sessionId: string, isLeader: boolean} | null;
  groupState: any;
  groupActions: any;
  onBack: () => void;
  onToggleQR: () => void;
  onVerseChange: (verse: number) => void;
  onPrevVerse: () => void;
  onNextVerse: () => void;
  onTogglePlay: () => void;
}

const HymnDisplayView = ({
  hymn,
  currentVerse,
  isPlaying,
  mode,
  deviceId,
  showQR,
  groupSession,
  groupState,
  groupActions,
  onBack,
  onToggleQR,
  onVerseChange,
  onPrevVerse,
  onNextVerse,
  onTogglePlay
}: HymnDisplayViewProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <HymnHeader 
          onBack={onBack}
          mode={mode}
          showQR={showQR}
          onToggleQR={onToggleQR}
          groupSession={groupSession}
        />

        {showQR && mode === 'display' && (
          <QRCodeDisplay deviceId={deviceId} />
        )}

        <HymnDisplay 
          hymn={hymn}
          currentVerse={currentVerse}
          isPlaying={isPlaying}
          mode={mode}
          onVerseChange={onVerseChange}
        />

        {mode === 'hymnal' && (
          <HymnControls 
            currentVerse={currentVerse}
            totalVerses={hymn.verses.length}
            isPlaying={isPlaying}
            onPrevVerse={onPrevVerse}
            onNextVerse={onNextVerse}
            onTogglePlay={onTogglePlay}
            isGroupLeader={groupSession?.isLeader}
            isCoLeader={groupState.isCoLeader}
            isFollowingLeader={groupState.isFollowingLeader}
            onToggleFollowLeader={groupActions.toggleFollowLeader}
          />
        )}
      </div>
    </div>
  );
};

export default HymnDisplayView;
