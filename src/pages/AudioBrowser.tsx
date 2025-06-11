
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, TrendingUp, Users, Music } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import TrackList from '@/components/TrackList';
import MusicPlayer from '@/components/MusicPlayer';
import { useIsMobile } from '@/hooks/use-mobile';
import AudioBrowserHeader from '@/components/audio-browser/AudioBrowserHeader';
import BrowseTabContent from '@/components/audio-browser/BrowseTabContent';
import EmptyStateCard from '@/components/audio-browser/EmptyStateCard';
import AudioBrowserLoading from '@/components/audio-browser/AudioBrowserLoading';
import type { Track } from '@/types/track';
import type { LegacyTrack } from '@/types/legacy-track';

interface Playlist {
  id: string;
  title: string;
  description: string;
  trackCount: number;
  coverImage?: string;
}

const AudioBrowser = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currentTrack, setCurrentTrack] = useState<LegacyTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'recent' | 'title' | 'artist'>('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const isMobile = useIsMobile();
  const { toast } = useToast();

  useEffect(() => {
    fetchAudioContent();
  }, []);

  const fetchAudioContent = async () => {
    setLoading(true);
    try {
      const [trackResult, playlistResult] = await Promise.all([
        supabase
          .from('Track')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50),
        supabase
          .from('Playlist')
          .select('*')
          .limit(20)
      ]);

      if (trackResult.data) {
        setTracks(trackResult.data);
      }

      if (playlistResult.data) {
        const transformedPlaylists: Playlist[] = playlistResult.data.map(playlist => ({
          id: playlist.id,
          title: playlist.title,
          description: playlist.description || 'No description',
          trackCount: 0
        }));
        setPlaylists(transformedPlaylists);
      }

    } catch (error) {
      console.error('Error fetching audio content:', error);
      toast({
        title: "Error",
        description: "Failed to load audio content.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

  const recentTracks = tracks.slice(0, 6);

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
        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto p-1 bg-muted/50 backdrop-blur">
            <TabsTrigger value="browse" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Music className="w-4 h-4" />
              <span className="hidden sm:inline">Browse</span>
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Recent</span>
            </TabsTrigger>
            <TabsTrigger value="playlists" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Playlists</span>
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Trending</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse">
            <BrowseTabContent
              tracks={filteredAndSortedTracks}
              playlists={playlists}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              currentTrack={currentTrack?.id}
              isPlaying={isPlaying}
              onPlayTrack={handlePlayTrack}
              onPlayPlaylist={handlePlayPlaylist}
            />
          </TabsContent>

          <TabsContent value="recent" className="space-y-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Recently Played</h2>
                <Button variant="outline" size="sm">Clear History</Button>
              </div>
              {recentTracks.length > 0 ? (
                <TrackList
                  tracks={recentTracks}
                  currentTrack={currentTrack?.id}
                  isPlaying={isPlaying}
                  onPlayTrack={handlePlayTrack}
                />
              ) : (
                <EmptyStateCard
                  icon={Clock}
                  title="No recent activity"
                  description="Start listening to some tracks and they'll appear here."
                  actionText="Browse Music"
                  onAction={() => {
                    const browseTab = document.querySelector('[value="browse"]') as HTMLElement;
                    browseTab?.click();
                  }}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="playlists" className="space-y-6">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold">Your Playlists</h2>
                <Button className="bg-gradient-to-r from-primary to-accent text-white shadow-lg hover:shadow-xl transition-all duration-200">
                  Create Playlist
                </Button>
              </div>
              
              {playlists.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {playlists.map((playlist) => (
                    <Card key={playlist.id} className="group cursor-pointer hover:bg-muted/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="aspect-square bg-muted rounded-lg mb-4 relative overflow-hidden">
                          <div className="w-full h-full flex items-center justify-center">
                            <Music className="h-12 w-12 text-muted-foreground" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold truncate mb-1">{playlist.title}</h3>
                          <p className="text-sm text-muted-foreground truncate mb-1">{playlist.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {playlist.trackCount} {playlist.trackCount === 1 ? 'hymn' : 'hymns'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <EmptyStateCard
                  icon={Users}
                  title="No playlists yet"
                  description="Create your first playlist to organize your favorite hymns."
                  actionText="Create Your First Playlist"
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="trending" className="space-y-6">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Trending Now</h2>
              <EmptyStateCard
                icon={TrendingUp}
                title="Trending feature coming soon"
                description="We're working on analytics to show you what's popular in the community."
                actionText="Get Notified"
              />
            </div>
          </TabsContent>
        </Tabs>
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
