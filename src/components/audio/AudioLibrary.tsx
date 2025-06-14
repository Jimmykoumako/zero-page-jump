
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Music, Play, MoreVertical, Trash2, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AudioTrack } from '@/types/audio-track';
import AudioUpload from './AudioUpload';
import AudioPlayer from './AudioPlayer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const AudioLibrary = () => {
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [filteredTracks, setFilteredTracks] = useState<AudioTrack[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTracks();
  }, []);

  useEffect(() => {
    const filtered = tracks.filter(track =>
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.hymn_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.album_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTracks(filtered);
  }, [tracks, searchQuery]);

  const fetchTracks = async () => {
    try {
      const { data, error } = await supabase
        .from('audio_tracks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type assertion to ensure audio_type matches our union type
      const typedTracks = (data || []).map(track => ({
        ...track,
        audio_type: track.audio_type as 'instrumental' | 'vocal' | 'accompaniment' | 'full'
      })) as AudioTrack[];
      
      setTracks(typedTracks);
    } catch (error) {
      console.error('Error fetching tracks:', error);
      toast({
        title: "Error",
        description: "Failed to load audio tracks.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrack = async (trackId: string) => {
    try {
      const track = tracks.find(t => t.id === trackId);
      if (!track) return;

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('audio_files')
        .remove([track.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('audio_tracks')
        .delete()
        .eq('id', trackId);

      if (dbError) throw dbError;

      setTracks(prev => prev.filter(t => t.id !== trackId));
      if (currentTrack?.id === trackId) {
        setCurrentTrack(null);
      }

      toast({
        title: "Track deleted",
        description: "The audio track has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting track:', error);
      toast({
        title: "Error",
        description: "Failed to delete the track.",
        variant: "destructive",
      });
    }
  };

  const handlePlayTrack = (track: AudioTrack) => {
    setCurrentTrack(track);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getAudioTypeColor = (type: string) => {
    switch (type) {
      case 'instrumental': return 'bg-blue-100 text-blue-800';
      case 'vocal': return 'bg-green-100 text-green-800';
      case 'accompaniment': return 'bg-yellow-100 text-yellow-800';
      case 'full': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Audio Library</h1>
          <p className="text-gray-600">Manage your hymn audio tracks</p>
        </div>
        <Button onClick={() => setShowUpload(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Upload Track
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search tracks, hymns, artists..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{tracks.length}</p>
                <p className="text-sm text-gray-600">Total Tracks</p>
              </div>
              <Music className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {new Set(tracks.map(t => t.hymn_number)).size}
                </p>
                <p className="text-sm text-gray-600">Unique Hymns</p>
              </div>
              <Music className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {new Set(tracks.map(t => t.artist_name).filter(Boolean)).size}
                </p>
                <p className="text-sm text-gray-600">Artists</p>
              </div>
              <Music className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {Math.floor(tracks.reduce((sum, track) => sum + track.duration, 0) / 60)}
                </p>
                <p className="text-sm text-gray-600">Total Minutes</p>
              </div>
              <Music className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Track List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {searchQuery ? `Search Results (${filteredTracks.length})` : 'All Tracks'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTracks.length > 0 ? (
            <div className="space-y-3">
              {filteredTracks.map((track) => (
                <div
                  key={track.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePlayTrack(track)}
                      className="p-2"
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{track.title}</h3>
                      <p className="text-sm text-gray-500 truncate">
                        {track.artist_name || 'Unknown Artist'} • {track.hymn_title} (#{track.hymn_number})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Badge className={getAudioTypeColor(track.audio_type)}>
                      {track.audio_type}
                    </Badge>
                    
                    <span className="text-sm text-gray-500">
                      {formatDuration(track.duration)}
                    </span>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteTrack(track.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Music className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery ? 'No tracks found' : 'No audio tracks yet'}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery 
                  ? 'Try adjusting your search terms.'
                  : 'Upload your first audio track to get started.'
                }
              </p>
              {!searchQuery && (
                <Button onClick={() => setShowUpload(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Upload First Track
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Audio Player */}
      {currentTrack && (
        <div className="fixed bottom-4 left-4 right-4 z-40">
          <AudioPlayer
            track={currentTrack}
            playlist={filteredTracks}
            onTrackChange={setCurrentTrack}
          />
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <AudioUpload
          onUploadComplete={() => {
            setShowUpload(false);
            fetchTracks();
          }}
          onCancel={() => setShowUpload(false)}
        />
      )}
    </div>
  );
};

export default AudioLibrary;
