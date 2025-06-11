
import { useState } from "react";
import type { HymnPlaybackState, HymnPlaybackActions } from "@/types/hymn-book";

export const useHymnPlayback = (): HymnPlaybackState & HymnPlaybackActions => {
  const [selectedHymn, setSelectedHymn] = useState<string | null>(null);
  const [currentVerse, setCurrentVerse] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const selectHymn = (hymnId: string) => {
    setSelectedHymn(hymnId);
    setCurrentVerse(0);
    setIsPlaying(false);
  };

  const changeVerse = (verse: number) => {
    setCurrentVerse(verse);
  };

  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  const nextVerse = (totalVerses: number) => {
    if (currentVerse < totalVerses - 1) {
      setCurrentVerse(prev => prev + 1);
    }
  };

  const prevVerse = () => {
    if (currentVerse > 0) {
      setCurrentVerse(prev => prev - 1);
    }
  };

  return {
    selectedHymn,
    currentVerse,
    isPlaying,
    selectHymn,
    changeVerse,
    togglePlay,
    nextVerse,
    prevVerse,
    setIsPlaying
  };
};
