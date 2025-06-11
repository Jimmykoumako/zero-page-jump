
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Play, Pause, Heart, MoreHorizontal, Music, Users, Clock, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import PlaylistCard from '@/components/PlaylistCard';
import TrackList from '@/components/TrackList';
import MusicPlayer from '@/components/MusicPlayer';
import { AudioFile } from '@/types/fullscreen-audio';

interface Track {
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

const AudioBrowser = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAudioContent();
  }, []);

  const fetchAudioContent = async () => {
    setLoading(true);
    try {
      // Fetch audio files from both AudioFile and uploads tables
      const [audioFileResult, uploadsResult, playlistResult] = await Promise.all([
        supabase
          .from('AudioFile')
          .select('*')
          .order('createdAt', { ascending: false })
          .limit(50),
        supabase
          .from('uploads')
          .select('*')
          .order('createdAt', { ascending: false })
          .limit(50),
        supabase
          .from('Playlist')
          .select('*')
          .limit(20)
      ]);

      // Combine and transform audio files to tracks
      const combinedAudioFiles: AudioFile[] = [];
      
      if (audioFileResult.data) {
        combinedAudioFiles.push(...audioFileResult.data);
      }
      
      if (uploadsResult.data) {
        combinedAudioFiles.push(...uploadsResult.data.map(upload => ({
          id: upload.id,
          url: upload.url,
          audioTypeId: upload.audioTypeId,
          userId: upload.userId,
          createdAt: upload.createdAt,
          hymnTitleNumber: upload.hymnTitle,
          bookId: upload.bookId
        })));
      }

      setAudioFiles(combinedAudioFiles);

      // Transform to tracks format
      const transformedTracks: Track[] = combinedAudioFiles.map(file => ({
        id: file.id,
        title: `Hymn ${file.hymnTitleNumber || 'Unknown'}`,
        artist: 'Unknown Artist',
        url: file.url,
        hymnNumber: file.hymnTitleNumber,
        album: `Book ${file.bookId || 1}`,
        duration: '3:30', // Placeholder
        hasLyrics: true
      }));

      setTracks(transformedTracks);

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
    if (track) {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (currentTrack) {
      const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
      const nextIndex = (currentIndex + 1) % tracks.length;
      setCurrentTrack(tracks[nextIndex]);
    }
  };

  const handlePrevious = () => {
    if (currentTrack) {
      const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
      const prevIndex = currentIndex === 0 ? tracks.length - 1 : currentIndex - 1;
      setCurrentTrack(tracks[prevIndex]);
    }
  };

  const handlePlayPlaylist = (playlistId: string) => {
    // In a real implementation, we'd fetch the playlist tracks
    toast({
      title: "Playlist",
      description: "Playlist playback coming soon!",
    });
  };

  const filteredTracks = tracks.filter(track =>
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.hymnNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recentTracks = tracks.slice(0, 6);
  const featuredPlaylists = playlists.slice(0, 4);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Music className="w-12 h-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">Loading music library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-3">
              <Music className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Music Library</h1>
              <p className="text-muted-foreground">Discover and enjoy hymns and worship music</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search hymns, artists, or numbers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="browse" className="flex items-center gap-2">
              <Music className="w-4 h-4" />
              Browse
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Recent
            </TabsTrigger>
            <TabsTrigger value="playlists" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Playlists
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Trending
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Music className="w-8 h-8 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">{tracks.length}</p>
                      <p className="text-sm text-muted-foreground">Total Tracks</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Users className="w-8 h-8 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">{playlists.length}</p>
                      <p className="text-sm text-muted-foreground">Playlists</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Heart className="w-8 h-8 text-red-500" />
                    <div>
                      <p className="text-2xl font-bold">0</p>
                      <p className="text-sm text-muted-foreground">Favorites</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Featured Playlists */}
            {featuredPlaylists.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Featured Playlists</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

            {/* All Tracks */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {searchQuery ? `Search Results (${filteredTracks.length})` : 'All Tracks'}
                </h2>
                {searchQuery && (
                  <Badge variant="secondary">{filteredTracks.length} results</Badge>
                )}
              </div>
              
              {filteredTracks.length > 0 ? (
                <TrackList
                  tracks={filteredTracks}
                  currentTrack={currentTrack?.id}
                  isPlaying={isPlaying}
                  onPlayTrack={handlePlayTrack}
                />
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Music className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">
                      {searchQuery ? 'No tracks found' : 'No tracks available'}
                    </h3>
                    <p className="text-muted-foreground">
                      {searchQuery 
                        ? 'Try adjusting your search terms or browse all available content.'
                        : 'Upload some audio files to get started with your music library.'
                      }
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="recent" className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Recently Played</h2>
              {recentTracks.length > 0 ? (
                <TrackList
                  tracks={recentTracks}
                  currentTrack={currentTrack?.id}
                  isPlaying={isPlaying}
                  onPlayTrack={handlePlayTrack}
                />
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No recent activity</h3>
                    <p className="text-muted-foreground">
                      Start listening to some tracks and they'll appear here.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="playlists" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Your Playlists</h2>
                <Button>Create Playlist</Button>
              </div>
              
              {playlists.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <Card>
                  <CardContent className="p-8 text-center">
                    <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No playlists yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first playlist to organize your favorite hymns.
                    </p>
                    <Button>Create Your First Playlist</Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="trending" className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Trending Now</h2>
              <Card>
                <CardContent className="p-8 text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Trending feature coming soon</h3>
                  <p className="text-muted-foreground">
                    We're working on analytics to show you what's popular in the community.
                  </p>
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
          playlist={tracks}
        />
      )}
    </div>
  );
};

export default AudioBrowser;
