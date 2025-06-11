
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import MusicPlayer from '@/components/MusicPlayer';
import { useIsMobile } from '@/hooks/use-mobile';
import AudioBrowserHeader from '@/components/audio-browser/AudioBrowserHeader';
import AudioBrowserTabs from '@/components/audio-browser/AudioBrowserTabs';
import AudioBrowserLoading from '@/components/audio-browser/AudioBrowserLoading';
import { useAudioContent } from '@/hooks/useAudioContent';
import { useTrackPlayback } from '@/hooks/useTrackPlayback';

const AudioBrowser = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'title' | 'artist'>('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const { tracks, playlists, loading } = useAudioContent();
  const {
    currentTrack,
    isPlaying,
    handlePlayTrack,
    handlePlayPause,
    handleNext,
    handlePrevious,
    convertToLegacyTrack
  } = useTrackPlayback(tracks);

  const handlePlayPlaylist = (playlistId: string) => {
    toast({
      title: "Playlist",
      description: "Playlist playback coming soon!",
    });
  };

  const filteredAndSortedTracks = tracks
    .filter(track => {
      const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.artist_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.hymnTitleNumber?.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'artist':
          return (a.artist_name || '').localeCompare(b.artist_name || '');
        case 'recent':
        default:
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      }
    });

  if (loading) {
    return <AudioBrowserLoading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <AudioBrowserHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        filteredTrackCount={filteredAndSortedTracks.length}
      />

      <div className="container mx-auto px-4 py-6">
        <AudioBrowserTabs
          tracks={tracks}
          playlists={playlists}
          filteredAndSortedTracks={filteredAndSortedTracks}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          currentTrack={currentTrack?.id}
          isPlaying={isPlaying}
          onPlayTrack={handlePlayTrack}
          onPlayPlaylist={handlePlayPlaylist}
        />
      </div>

      {currentTrack && (
        <MusicPlayer
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onNext={handleNext}
          onPrevious={handlePrevious}
          playlist={tracks.map(track => convertToLegacyTrack(track))}
        />
      )}
    </div>
  );
};

export default AudioBrowser;
