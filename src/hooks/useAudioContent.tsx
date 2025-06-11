
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Track } from '@/types/track';

interface Playlist {
  id: string;
  title: string;
  description: string;
  trackCount: number;
  coverImage?: string;
}

export const useAudioContent = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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

  useEffect(() => {
    fetchAudioContent();
  }, []);

  return { tracks, playlists, loading, fetchAudioContent };
};
