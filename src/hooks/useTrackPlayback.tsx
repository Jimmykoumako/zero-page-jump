
import { useState } from 'react';
import type { Track } from '@/types/track';
import type { LegacyTrack } from '@/types/legacy-track';

export const useTrackPlayback = (tracks: Track[]) => {
  const [currentTrack, setCurrentTrack] = useState<LegacyTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const convertToLegacyTrack = (track: Track): LegacyTrack => {
    return {
      id: track.id,
      title: track.title,
      artist: track.artist_name || 'Unknown Artist',
      url: track.url,
      hymnNumber: track.hymnTitleNumber,
      album: track.album_name,
      duration: `${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}`,
      hasLyrics: !!track.hymnTitleNumber
    };
  };

  const handlePlayTrack = (trackId: string) => {
    const track = tracks.find(t => t.id === trackId);
    if (!track) return;

    const legacyTrack = convertToLegacyTrack(track);
    setCurrentTrack(legacyTrack);
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (currentTrack) {
      const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
      const nextIndex = (currentIndex + 1) % tracks.length;
      const nextTrack = tracks[nextIndex];
      if (nextTrack) {
        const legacyTrack = convertToLegacyTrack(nextTrack);
        setCurrentTrack(legacyTrack);
      }
    }
  };

  const handlePrevious = () => {
    if (currentTrack) {
      const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
      const prevIndex = currentIndex === 0 ? tracks.length - 1 : currentIndex - 1;
      const prevTrack = tracks[prevIndex];
      if (prevTrack) {
        const legacyTrack = convertToLegacyTrack(prevTrack);
        setCurrentTrack(legacyTrack);
      }
    }
  };

  return {
    currentTrack,
    isPlaying,
    handlePlayTrack,
    handlePlayPause,
    handleNext,
    handlePrevious,
    convertToLegacyTrack
  };
};
