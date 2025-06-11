
import { useState } from "react";
import { useHymnData } from "@/hooks/useHymnData";
import { useHymnPlayback } from "@/hooks/useHymnPlayback";
import { useHymnGroupSync } from "@/hooks/useHymnGroupSync";
import { useRemoteControl } from "@/hooks/useRemoteControl";
import HymnBookLoading from "./hymn-book/HymnBookLoading";
import HymnListView from "./hymn-book/HymnListView";
import HymnDisplayView from "./hymn-book/HymnDisplayView";
import type { HymnBookProps } from "@/types/hymn-book";

const HymnBook = ({ mode, deviceId, onBack, selectedHymnbook, groupSession }: HymnBookProps) => {
  const [showQR, setShowQR] = useState(false);
  const [userId] = useState(() => Math.random().toString(36).substr(2, 9)); // Simulated user ID

  // Custom hooks
  const { hymns, loading } = useHymnData(selectedHymnbook);
  const {
    selectedHymn,
    currentVerse,
    isPlaying,
    selectHymn,
    changeVerse,
    togglePlay,
    nextVerse,
    prevVerse,
    setIsPlaying
  } = useHymnPlayback();

  // Group synchronization
  const {
    groupState,
    groupActions,
    broadcastHymnChange,
    broadcastVerseChange,
    broadcastPlayState
  } = useHymnGroupSync({
    groupSession,
    userId,
    onHymnSelect: (hymnId: string) => selectHymn(hymnId),
    onVerseChange: changeVerse,
    onPlayChange: setIsPlaying
  });

  // Enhanced handlers with group sync
  const handleHymnSelect = async (hymnId: number) => {
    const hymnIdStr = hymnId.toString();
    selectHymn(hymnIdStr);
    await broadcastHymnChange(hymnIdStr);
  };

  const handleVerseChange = async (verse: number) => {
    changeVerse(verse);
    await broadcastVerseChange(verse);
  };

  const handleNextVerse = async () => {
    if (selectedHymn !== null) {
      const hymn = hymns.find(h => h.id.toString() === selectedHymn);
      if (hymn && currentVerse < hymn.verses.length - 1) {
        const newVerse = currentVerse + 1;
        changeVerse(newVerse);
        await broadcastVerseChange(newVerse);
      }
    }
  };

  const handlePrevVerse = async () => {
    if (currentVerse > 0) {
      const newVerse = currentVerse - 1;
      changeVerse(newVerse);
      await broadcastVerseChange(newVerse);
    }
  };

  const handleTogglePlay = async () => {
    togglePlay();
    await broadcastPlayState(!isPlaying);
  };

  // Remote control integration
  useRemoteControl({
    deviceId,
    onHymnSelect: (hymnId: number) => handleHymnSelect(hymnId),
    onNextVerse: handleNextVerse,
    onPrevVerse: handlePrevVerse,
    onTogglePlay: handleTogglePlay
  });

  if (loading) {
    return <HymnBookLoading />;
  }

  if (selectedHymn === null) {
    return (
      <HymnListView
        hymns={hymns}
        mode={mode}
        deviceId={deviceId}
        showQR={showQR}
        selectedHymnbook={selectedHymnbook}
        groupSession={groupSession}
        onBack={onBack}
        onToggleQR={() => setShowQR(!showQR)}
        onHymnSelect={handleHymnSelect}
      />
    );
  }

  const selectedHymnData = hymns.find(h => h.id.toString() === selectedHymn);
  if (!selectedHymnData) return null;

  console.log('Rendering hymn:', selectedHymnData);

  return (
    <HymnDisplayView
      hymn={selectedHymnData}
      currentVerse={currentVerse}
      isPlaying={isPlaying}
      mode={mode}
      deviceId={deviceId}
      showQR={showQR}
      groupSession={groupSession}
      groupState={groupState}
      groupActions={groupActions}
      onBack={() => selectHymn(null)}
      onToggleQR={() => setShowQR(!showQR)}
      onVerseChange={handleVerseChange}
      onPrevVerse={handlePrevVerse}
      onNextVerse={handleNextVerse}
      onTogglePlay={handleTogglePlay}
    />
  );
};

export default HymnBook;
