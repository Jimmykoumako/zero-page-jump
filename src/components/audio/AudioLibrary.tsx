import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Music, Plus, Upload, Play, Pause, Download } from 'lucide-react';
import { AudioTrack } from '@/types/audio-track';

const AudioLibrary = () => {
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTracks();
  }, []);

  const fetchTracks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('audio_tracks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match AudioTrack interface and ensure upload_status is properly typed
      const transformedTracks: AudioTrack[] = (data || []).map(track => ({
        ...track,
        upload_status: (track.upload_status === 'processing' || track.upload_status === 'ready' || track.upload_status === 'error') 
          ? track.upload_status as 'processing' | 'ready' | 'error'
          : 'ready'
      }));
      
      setTracks(transformedTracks);
    } catch (error) {
      console.error('Error fetching tracks:', error);
      toast({
        title: "Error",
        description: "Failed to load tracks.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'Unknown';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const getAudioTypeColor = (type: string) => {
    switch (type) {
      case 'instrumental': return 'bg-blue-100 text-blue-800';
      case 'vocal': return 'bg-green-100 text-green-800';
      case 'accompaniment': return 'bg-purple-100 text-purple-800';
      case 'full': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Music className="w-12 h-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">Loading audio library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-3">
                <Music className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Audio Library</h1>
                <p className="text-muted-foreground">Browse and manage uploaded audio tracks</p>
              </div>
            </div>
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Upload Audio
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
                <Upload className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {tracks.filter(t => t.upload_status === 'ready').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Ready</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Play className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {new Set(tracks.map(t => t.hymn_number)).size}
                  </p>
                  <p className="text-sm text-muted-foreground">Hymns</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Download className="w-8 h-8 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {Math.floor(tracks.reduce((sum, track) => sum + (track.duration || 0), 0) / 60)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Minutes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tracks Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Audio Tracks</CardTitle>
          </CardHeader>
          <CardContent>
            {tracks.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {tracks.map((track) => (
                  <Card key={track.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate" title={track.title}>
                              {track.title}
                            </h3>
                            <p className="text-sm text-muted-foreground truncate" title={track.hymn_title}>
                              Hymn: {track.hymn_title} #{track.hymn_number}
                            </p>
                          </div>
                          <Badge className={getStatusColor(track.upload_status)}>
                            {track.upload_status}
                          </Badge>
                        </div>

                        {/* Artist and Album */}
                        {track.artist_name && (
                          <p className="text-sm text-muted-foreground truncate">
                            Artist: {track.artist_name}
                          </p>
                        )}
                        {track.album_name && (
                          <p className="text-sm text-muted-foreground truncate">
                            Album: {track.album_name}
                          </p>
                        )}

                        {/* Audio Type and Duration */}
                        <div className="flex items-center gap-2 text-xs">
                          <Badge className={getAudioTypeColor(track.audio_type)}>
                            {track.audio_type}
                          </Badge>
                          <span className="text-muted-foreground">
                            {formatDuration(track.duration)}
                          </span>
                          {track.file_size && (
                            <span className="text-muted-foreground">
                              • {formatFileSize(track.file_size)}
                            </span>
                          )}
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                // Toggle play/pause logic would go here
                                setCurrentlyPlaying(
                                  currentlyPlaying === track.id ? null : track.id
                                );
                              }}
                              className="h-8 w-8 p-0"
                            >
                              {currentlyPlaying === track.id ? (
                                <Pause className="w-4 h-4" />
                              ) : (
                                <Play className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                // Download logic would go here
                                window.open(track.file_path, '_blank');
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <div className="text-xs text-muted-foreground">
                            {new Date(track.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Music className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No audio tracks found</h3>
                <p className="text-muted-foreground mb-4">
                  Upload your first audio track to get started.
                </p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Audio
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AudioLibrary;
