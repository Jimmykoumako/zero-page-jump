
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Music, Search, Calendar, Hash } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import TrackForm from './TrackForm';
import TrackCard from './TrackCard';

interface Track {
  id: string;
  title: string;
  url: string;
  duration: number;
  artist_name?: string;
  album_name?: string;
  release_date?: string;
  track_number?: number;
  disc_number?: number;
  explicit?: boolean;
  cover_image_url?: string;
  hymnTitleNumber?: string;
  bookId?: number;
  created_at?: string;
  updated_at?: string;
}

const TrackManager = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTracks();
  }, []);

  const fetchTracks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('Track')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTracks(data || []);
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

  const handleCreateTrack = async (trackData: Partial<Track>) => {
    try {
      const { data, error } = await supabase
        .from('Track')
        .insert([trackData])
        .select()
        .single();

      if (error) throw error;

      setTracks(prev => [data, ...prev]);
      setIsFormOpen(false);
      toast({
        title: "Success",
        description: "Track created successfully!",
      });
    } catch (error) {
      console.error('Error creating track:', error);
      toast({
        title: "Error",
        description: "Failed to create track.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTrack = async (trackData: Partial<Track>) => {
    if (!selectedTrack) return;

    try {
      const { data, error } = await supabase
        .from('Track')
        .update(trackData)
        .eq('id', selectedTrack.id)
        .select()
        .single();

      if (error) throw error;

      setTracks(prev => prev.map(track => 
        track.id === selectedTrack.id ? data : track
      ));
      setIsFormOpen(false);
      setIsEditing(false);
      setSelectedTrack(null);
      toast({
        title: "Success",
        description: "Track updated successfully!",
      });
    } catch (error) {
      console.error('Error updating track:', error);
      toast({
        title: "Error",
        description: "Failed to update track.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTrack = async (trackId: string) => {
    try {
      const { error } = await supabase
        .from('Track')
        .delete()
        .eq('id', trackId);

      if (error) throw error;

      setTracks(prev => prev.filter(track => track.id !== trackId));
      toast({
        title: "Success",
        description: "Track deleted successfully!",
      });
    } catch (error) {
      console.error('Error deleting track:', error);
      toast({
        title: "Error",
        description: "Failed to delete track.",
        variant: "destructive",
      });
    }
  };

  const filteredTracks = tracks.filter(track =>
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.album_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openCreateForm = () => {
    setSelectedTrack(null);
    setIsEditing(false);
    setIsFormOpen(true);
  };

  const openEditForm = (track: Track) => {
    setSelectedTrack(track);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Music className="w-12 h-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">Loading tracks...</p>
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
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg p-3">
                <Music className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Track Manager</h1>
                <p className="text-muted-foreground">Manage your music library with Apple Music-style metadata</p>
              </div>
            </div>
            <Button onClick={openCreateForm} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Track
            </Button>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tracks, artists, or albums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Statistics */}
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
                <Hash className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {new Set(tracks.map(t => t.artist_name).filter(Boolean)).size}
                  </p>
                  <p className="text-sm text-muted-foreground">Artists</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {new Set(tracks.map(t => t.album_name).filter(Boolean)).size}
                  </p>
                  <p className="text-sm text-muted-foreground">Albums</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Music className="w-8 h-8 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {Math.floor(tracks.reduce((sum, track) => sum + track.duration, 0) / 60)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Minutes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Track List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                {searchQuery ? `Search Results (${filteredTracks.length})` : 'All Tracks'}
              </span>
              {searchQuery && (
                <Badge variant="secondary">{filteredTracks.length} results</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredTracks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTracks.map((track) => (
                  <TrackCard
                    key={track.id}
                    track={track}
                    onEdit={() => openEditForm(track)}
                    onDelete={() => handleDeleteTrack(track.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Music className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">
                  {searchQuery ? 'No tracks found' : 'No tracks available'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery 
                    ? 'Try adjusting your search terms.'
                    : 'Create your first track to get started.'
                  }
                </p>
                {!searchQuery && (
                  <Button onClick={openCreateForm}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Track
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Form Dialog */}
      {isFormOpen && (
        <TrackForm
          track={selectedTrack}
          isEditing={isEditing}
          onSubmit={isEditing ? handleUpdateTrack : handleCreateTrack}
          onCancel={() => {
            setIsFormOpen(false);
            setSelectedTrack(null);
            setIsEditing(false);
          }}
        />
      )}
    </div>
  );
};

export default TrackManager;
