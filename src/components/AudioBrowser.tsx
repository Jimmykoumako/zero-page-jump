
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Music, Search, Grid, List, FileText } from 'lucide-react';
import MusicPlayer from '@/components/MusicPlayer';
import PlaylistCard from '@/components/PlaylistCard';
import TrackList from '@/components/TrackList';
import { hymns } from '@/data/hymns';
import type { Track } from '@/types/track';

interface AudioFile {
  id: string;
  url: string;
  hymnTitleNumber: string;
  userId: string;
  audioTypeId: number;
  createdAt: string;
  bookId: number;
}

interface HymnLyric {
  id: number;
  hymnTitleNumber: string;
  lyrics: any;
  bookId: number;
  userId: string;
}

interface LegacyTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  hymnNumber?: string;
  album?: string;
  duration?: string;
  hasLyrics?: boolean;
  lyrics?: any;
}

interface AudioBrowserProps {
  onShowLyrics?: (hymnNumber: string, lyrics: any) => void;
}

const AudioBrowser = ({ onShowLyrics }: AudioBrowserProps) => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [hymnLyrics, setHymnLyrics] = useState<HymnLyric[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [currentTrack, setCurrentTrack] = useState<LegacyTrack | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch audio files and lyrics in parallel
      const [audioResult, lyricsResult] = await Promise.all([
        supabase
          .from('AudioFile')
          .select('*')
          .order('createdAt', { ascending: false }),
        supabase
          .from('HymnLyric')
          .select('*')
      ]);

      if (audioResult.error) {
        console.error('Error fetching audio files:', audioResult.error);
        toast({
          title: "Error",
          description: "Failed to fetch audio files",
          variant: "destructive"
        });
        return;
      }

      if (lyricsResult.error) {
        console.error('Error fetching lyrics:', lyricsResult.error);
      }

      setAudioFiles(audioResult.data || []);
      setHymnLyrics(lyricsResult.data || []);
      
      // Transform to tracks format with hymn titles and lyrics
      const transformedTracks: Track[] = (audioResult.data || []).map(file => {
        // Find matching hymn from the hymns data
        const hymnData = hymns.find(h => h.number.toString() === file.hymnTitleNumber);
        
        // Find matching lyrics
        const lyricsData = (lyricsResult.data || []).find(
          lyric => lyric.hymnTitleNumber === file.hymnTitleNumber && lyric.bookId === file.bookId
        );

        return {
          id: file.id,
          title: hymnData?.title || `Hymn #${file.hymnTitleNumber}`,
          url: getAudioUrl(file.url),
          duration: 225, // Default duration in seconds
          artist_name: hymnData?.author || 'HBC Hymns',
          album_name: `Book ${file.bookId}`,
          hymnTitleNumber: file.hymnTitleNumber,
          bookId: file.bookId,
          disc_number: 1,
          explicit: false,
          cover_image_url: null,
          release_date: null,
          track_number: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      });
      
      setTracks(transformedTracks);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getAudioUrl = (filePath: string) => {
    const { data } = supabase.storage
      .from('audio_files')
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handlePlayTrack = (trackId: string) => {
    const track = tracks.find(t => t.id === trackId);
    if (!track) return;

    const trackIndex = tracks.findIndex(t => t.id === trackId);
    
    // Convert Track to LegacyTrack for the music player
    const legacyTrack: LegacyTrack = {
      id: track.id,
      title: track.title,
      artist: track.artist_name || 'Unknown Artist',
      url: track.url,
      hymnNumber: track.hymnTitleNumber,
      album: track.album_name,
      duration: `${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}`,
      hasLyrics: !!track.hymnTitleNumber
    };
    
    if (currentTrack?.id === trackId) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(legacyTrack);
      setCurrentTrackIndex(trackIndex);
      setIsPlaying(true);
    }
  };

  const handleShowLyrics = (track: Track) => {
    const lyricsData = hymnLyrics.find(
      lyric => lyric.hymnTitleNumber === track.hymnTitleNumber && lyric.bookId === track.bookId
    );
    
    if (lyricsData && onShowLyrics) {
      onShowLyrics(track.hymnTitleNumber || '', lyricsData.lyrics);
    } else {
      // Fallback to hymns data if no custom lyrics
      const hymnData = hymns.find(h => h.number.toString() === track.hymnTitleNumber);
      if (hymnData && onShowLyrics) {
        // Convert hymn data to lyrics format
        const lyricsDataFallback = {
          verses: hymnData.verses,
          chorus: hymnData.chorus
        };
        onShowLyrics(track.hymnTitleNumber || '', lyricsDataFallback);
      } else {
        toast({
          title: "No Lyrics Available",
          description: "Lyrics are not available for this hymn.",
          variant: "default"
        });
      }
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    const nextTrack = tracks[nextIndex];
    const legacyTrack: LegacyTrack = {
      id: nextTrack.id,
      title: nextTrack.title,
      artist: nextTrack.artist_name || 'Unknown Artist',
      url: nextTrack.url,
      hymnNumber: nextTrack.hymnTitleNumber,
      album: nextTrack.album_name,
      duration: `${Math.floor(nextTrack.duration / 60)}:${(nextTrack.duration % 60).toString().padStart(2, '0')}`,
      hasLyrics: !!nextTrack.hymnTitleNumber
    };
    setCurrentTrack(legacyTrack);
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(true);
  };

  const handlePrevious = () => {
    const prevIndex = currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1;
    const prevTrack = tracks[prevIndex];
    const legacyTrack: LegacyTrack = {
      id: prevTrack.id,
      title: prevTrack.title,
      artist: prevTrack.artist_name || 'Unknown Artist',
      url: prevTrack.url,
      hymnNumber: prevTrack.hymnTitleNumber,
      album: prevTrack.album_name,
      duration: `${Math.floor(prevTrack.duration / 60)}:${(prevTrack.duration % 60).toString().padStart(2, '0')}`,
      hasLyrics: !!prevTrack.hymnTitleNumber
    };
    setCurrentTrack(legacyTrack);
    setCurrentTrackIndex(prevIndex);
    setIsPlaying(true);
  };

  const filteredTracks = tracks.filter(track =>
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.hymnTitleNumber?.includes(searchQuery)
  );

  const recentTracks = tracks.slice(0, 10);
  const popularHymns = tracks.filter(track => 
    ['1', '23', '45', '123', '256'].includes(track.hymnTitleNumber || '')
  );
  const tracksWithLyrics = tracks.filter(track => {
    return hymnLyrics.some(lyric => 
      lyric.hymnTitleNumber === track.hymnTitleNumber && lyric.bookId === track.bookId
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Music className="mx-auto h-12 w-12 text-muted-foreground mb-4 animate-pulse" />
          <p className="text-lg">Loading your music library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur border-b border-border z-40 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">HBC Music</h1>
              <p className="text-muted-foreground">Your hymn collection with lyrics</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search hymns, titles, or authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              
              <div className="flex items-center border rounded-lg">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Quick Access Playlists */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <PlaylistCard
              title="Recent Hymns"
              description="Your recently added hymns"
              trackCount={recentTracks.length}
              onPlay={() => {
                if (recentTracks.length > 0) {
                  handlePlayTrack(recentTracks[0].id);
                }
              }}
            />
            <PlaylistCard
              title="Popular Hymns"
              description="Most loved hymns"
              trackCount={popularHymns.length}
              onPlay={() => {
                if (popularHymns.length > 0) {
                  handlePlayTrack(popularHymns[0].id);
                }
              }}
            />
            <PlaylistCard
              title="With Lyrics"
              description="Hymns with lyrics available"
              trackCount={tracksWithLyrics.length}
              onPlay={() => {
                if (tracksWithLyrics.length > 0) {
                  handlePlayTrack(tracksWithLyrics[0].id);
                }
              }}
            />
            <PlaylistCard
              title="All Hymns"
              description="Complete collection"
              trackCount={tracks.length}
              onPlay={() => {
                if (tracks.length > 0) {
                  handlePlayTrack(tracks[0].id);
                }
              }}
            />
          </div>
        </section>

        {/* Main Content */}
        {searchQuery ? (
          <section>
            <h2 className="text-2xl font-bold mb-4">
              Search Results ({filteredTracks.length})
            </h2>
            <TrackList
              tracks={filteredTracks}
              currentTrack={currentTrack?.id}
              isPlaying={isPlaying}
              onPlayTrack={handlePlayTrack}
              onShowLyrics={handleShowLyrics}
            />
          </section>
        ) : (
          <>
            <section>
              <h2 className="text-2xl font-bold mb-4">Recently Added</h2>
              <TrackList
                tracks={recentTracks}
                currentTrack={currentTrack?.id}
                isPlaying={isPlaying}
                onPlayTrack={handlePlayTrack}
                onShowLyrics={handleShowLyrics}
              />
            </section>

            {popularHymns.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Popular Hymns</h2>
                <TrackList
                  tracks={popularHymns}
                  currentTrack={currentTrack?.id}
                  isPlaying={isPlaying}
                  onPlayTrack={handlePlayTrack}
                  onShowLyrics={handleShowLyrics}
                />
              </section>
            )}

            {tracksWithLyrics.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Hymns with Lyrics</h2>
                <TrackList
                  tracks={tracksWithLyrics.slice(0, 10)}
                  currentTrack={currentTrack?.id}
                  isPlaying={isPlaying}
                  onPlayTrack={handlePlayTrack}
                  onShowLyrics={handleShowLyrics}
                />
              </section>
            )}
          </>
        )}

        {tracks.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Music className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Music Found</h3>
              <p className="text-muted-foreground text-center">
                No audio files are currently available in your library.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Music Player */}
      <MusicPlayer
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onNext={handleNext}
        onPrevious={handlePrevious}
        playlist={tracks.map(track => ({
          id: track.id,
          title: track.title,
          artist: track.artist_name || 'Unknown Artist',
          url: track.url,
          hymnNumber: track.hymnTitleNumber,
          album: track.album_name,
          duration: `${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}`,
          hasLyrics: !!track.hymnTitleNumber
        }))}
      />
    </div>
  );
};

export default AudioBrowser;
