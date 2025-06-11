
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Play, Pause, Heart, MoreHorizontal, Music, Users, Clock, TrendingUp, Filter, SortAsc, Grid, List, Download, Share2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import PlaylistCard from '@/components/PlaylistCard';
import TrackList from '@/components/TrackList';
import MusicPlayer from '@/components/MusicPlayer';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Track } from '@/types/track';

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

interface Playlist {
  id: string;
  title: string;
  description: string;
  trackCount: number;
  coverImage?: string;
}

// Audio file type for the track list component - matching the expected interface
interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number; // Changed to number to match Track interface
  hymnNumber?: string;
  album?: string;
  hasLyrics?: boolean;
}

const AudioBrowser = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currentTrack, setCurrentTrack] = useState<LegacyTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState<'recent' | 'title' | 'artist'>('recent');
  const [filterGenre, setFilterGenre] = useState<string>('all');
  const isMobile = useIsMobile();
  const { toast } = useToast();

  useEffect(() => {
    fetchAudioContent();
  }, []);

  const fetchAudioContent = async () => {
    setLoading(true);
    try {
      // Fetch tracks from the Track table
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

      // Transform playlists
      if (playlistResult.data) {
        const transformedPlaylists: Playlist[] = playlistResult.data.map(playlist => ({
          id: playlist.id,
          title: playlist.title,
          description: playlist.description || 'No description',
          trackCount: 0 // We'd need to count tracks in a real implementation
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

  const handlePlayTrack = (trackId: string) => {
    const track = tracks.find(t => t.id === trackId);
    if (!track) return;

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
      }
    }
  };

  const handlePrevious = () => {
    if (currentTrack) {
      const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
      const prevIndex = currentIndex === 0 ? tracks.length - 1 : currentIndex - 1;
      const prevTrack = tracks[prevIndex];
      if (prevTrack) {
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
      }
    }
  };

  const handlePlayPlaylist = (playlistId: string) => {
    // In a real implementation, we'd fetch the playlist tracks
    toast({
      title: "Playlist",
      description: "Playlist playback coming soon!",
    });
  };

  // Enhanced filtering and sorting
  const filteredAndSortedTracks = tracks
    .filter(track => {
      const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.artist_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.hymnTitleNumber?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesGenre = filterGenre === 'all' || true; // We don't have genre data yet
      
      return matchesSearch && matchesGenre;
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

  // Convert Track[] to AudioTrack[] for the TrackList component
  const audioTracks: Track[] = filteredAndSortedTracks.map(track => ({
    ...track,
    // Ensure all required properties are present
    artist: track.artist_name || 'Unknown Artist',
  }));

  const recentTracks = tracks.slice(0, 6);
  const featuredPlaylists = playlists.slice(0, 4);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 mx-auto rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
            <Music className="w-8 h-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary animate-pulse" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Loading Music Library</h3>
            <p className="text-muted-foreground">Discovering your hymns and worship music...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Enhanced Header with Gradient Background */}
      <div className="relative overflow-hidden border-b bg-gradient-to-r from-primary/5 via-background to-accent/5 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 py-8 relative">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-xl p-4 shadow-lg">
                  <Music className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Music Library
                </h1>
                <p className="text-muted-foreground">Discover and enjoy hymns and worship music</p>
              </div>
            </div>

            {/* Enhanced Search with Filters */}
            <div className="flex-1 max-w-2xl">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search hymns, artists, or numbers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 h-12 bg-background/80 backdrop-blur border-2 transition-all duration-200 focus:border-primary/50 focus:bg-background"
                  />
                  {searchQuery && (
                    <Badge variant="secondary" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {filteredAndSortedTracks.length} results
                    </Badge>
                  )}
                </div>

                {/* Filter and Sort Controls */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortBy(sortBy === 'recent' ? 'title' : sortBy === 'title' ? 'artist' : 'recent')}
                    className="flex items-center gap-2"
                  >
                    <SortAsc className="w-4 h-4" />
                    Sort: {sortBy === 'recent' ? 'Recent' : sortBy === 'title' ? 'Title' : 'Artist'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                    className="flex items-center gap-2"
                  >
                    {viewMode === 'list' ? <Grid className="w-4 h-4" /> : <List className="w-4 h-4" />}
                    {viewMode === 'list' ? 'Grid View' : 'List View'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
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

          <TabsContent value="browse" className="space-y-8">
            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent"></div>
                <CardContent className="p-6 relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-blue-600">{tracks.length}</p>
                      <p className="text-sm font-medium text-muted-foreground">Total Tracks</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Music className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent"></div>
                <CardContent className="p-6 relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-green-600">{playlists.length}</p>
                      <p className="text-sm font-medium text-muted-foreground">Playlists</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent"></div>
                <CardContent className="p-6 relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-purple-600">0</p>
                      <p className="text-sm font-medium text-muted-foreground">Favorites</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Heart className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Featured Playlists */}
            {featuredPlaylists.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Featured Playlists</h2>
                  <Button variant="outline" size="sm">View All</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredPlaylists.map((playlist) => (
                    <PlaylistCard
                      key={playlist.id}
                      title={playlist.title}
                      description={playlist.description}
                      trackCount={playlist.trackCount}
                      coverImage={playlist.coverImage}
                      onPlay={() => handlePlayPlaylist(playlist.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* All Tracks Section */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">
                    {searchQuery ? `Search Results` : 'All Tracks'}
                  </h2>
                  <p className="text-muted-foreground">
                    {filteredAndSortedTracks.length} tracks available
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Share</span>
                  </Button>
                </div>
              </div>
              
              {filteredAndSortedTracks.length > 0 ? (
                <TrackList
                  tracks={audioTracks}
                  currentTrack={currentTrack?.id}
                  isPlaying={isPlaying}
                  onPlayTrack={handlePlayTrack}
                />
              ) : (
                <Card className="border-dashed">
                  <CardContent className="p-12 text-center">
                    <div className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
                      <Music className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {searchQuery ? 'No tracks found' : 'No tracks available'}
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      {searchQuery 
                        ? 'Try adjusting your search terms or browse all available content.'
                        : 'Upload some audio files to get started with your music library.'
                      }
                    </p>
                    {searchQuery && (
                      <Button onClick={() => setSearchQuery('')} variant="outline">
                        Clear Search
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
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
                <Card className="border-dashed">
                  <CardContent className="p-12 text-center">
                    <Clock className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">No recent activity</h3>
                    <p className="text-muted-foreground mb-6">
                      Start listening to some tracks and they'll appear here.
                    </p>
                    <Button onClick={() => document.querySelector('[value="browse"]')?.click()}>
                      Browse Music
                    </Button>
                  </CardContent>
                </Card>
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
                    <PlaylistCard
                      key={playlist.id}
                      title={playlist.title}
                      description={playlist.description}
                      trackCount={playlist.trackCount}
                      coverImage={playlist.coverImage}
                      onPlay={() => handlePlayPlaylist(playlist.id)}
                    />
                  ))}
                </div>
              ) : (
                <Card className="border-dashed">
                  <CardContent className="p-12 text-center">
                    <Users className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">No playlists yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Create your first playlist to organize your favorite hymns.
                    </p>
                    <Button className="bg-gradient-to-r from-primary to-accent text-white">
                      Create Your First Playlist
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="trending" className="space-y-6">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Trending Now</h2>
              <Card className="border-dashed">
                <CardContent className="p-12 text-center">
                  <TrendingUp className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Trending feature coming soon</h3>
                  <p className="text-muted-foreground mb-6">
                    We're working on analytics to show you what's popular in the community.
                  </p>
                  <Button variant="outline">Get Notified</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Music Player */}
      {currentTrack && (
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
      )}
    </div>
  );
};

export default AudioBrowser;
