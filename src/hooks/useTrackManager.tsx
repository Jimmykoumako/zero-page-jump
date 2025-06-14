
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Track, TrackFormData } from '@/types/track';

export const useTrackManager = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
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
        .select('*, url_with_bucket:get_storage_url(bucket_name, url), cover_image_with_bucket:get_storage_url(image_bucket_name, cover_image_url)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform tracks to use the generated URLs
      const transformedTracks = (data || []).map(track => ({
        ...track,
        url: track.url_with_bucket || track.url,
        cover_image_url: track.cover_image_with_bucket || track.cover_image_url
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

  const createTrack = async (trackData: TrackFormData) => {
    try {
      // Generate a UUID for the track ID
      const trackId = crypto.randomUUID();
      
      // Ensure required fields are present and correctly typed
      const insertData = {
        id: trackId,
        title: trackData.title,
        url: trackData.url,
        duration: trackData.duration,
        artist_name: trackData.artist_name || null,
        album_name: trackData.album_name || null,
        release_date: trackData.release_date || null,
        track_number: trackData.track_number || null,
        disc_number: trackData.disc_number || 1,
        explicit: trackData.explicit || false,
        cover_image_url: trackData.cover_image_url || null,
        hymnTitleNumber: trackData.hymnTitleNumber || null,
        bookId: trackData.bookId || null,
        bucket_name: trackData.bucket_name || 'audio_files',
        image_bucket_name: trackData.image_bucket_name || 'album-covers',
      };

      const { data, error } = await supabase
        .from('Track')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      setTracks(prev => [data, ...prev]);
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

  const updateTrack = async (trackId: string, trackData: TrackFormData) => {
    try {
      const updateData = {
        title: trackData.title,
        url: trackData.url,
        duration: trackData.duration,
        artist_name: trackData.artist_name || null,
        album_name: trackData.album_name || null,
        release_date: trackData.release_date || null,
        track_number: trackData.track_number || null,
        disc_number: trackData.disc_number || 1,
        explicit: trackData.explicit || false,
        cover_image_url: trackData.cover_image_url || null,
        hymnTitleNumber: trackData.hymnTitleNumber || null,
        bookId: trackData.bookId || null,
        bucket_name: trackData.bucket_name || 'audio_files',
        image_bucket_name: trackData.image_bucket_name || 'album-covers',
      };

      const { data, error } = await supabase
        .from('Track')
        .update(updateData)
        .eq('id', trackId)
        .select()
        .single();

      if (error) throw error;

      setTracks(prev => prev.map(track => 
        track.id === trackId ? data : track
      ));
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

  const deleteTrack = async (trackId: string) => {
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

  return {
    tracks,
    loading,
    createTrack,
    updateTrack,
    deleteTrack,
    fetchTracks,
  };
};
