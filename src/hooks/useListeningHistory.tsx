
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ListeningHistoryEntry {
  id: string;
  user_id: string;
  hymn_id: string;
  hymn_title: string;
  artist_name?: string;
  album_name?: string;
  played_at: string;
  duration?: number;
  hymn_number?: string;
  book_id?: number;
}

export const useListeningHistory = () => {
  const [history, setHistory] = useState<ListeningHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data, error } = await supabase
        .from('listening_history')
        .select('*')
        .eq('user_id', user.id)
        .order('played_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error fetching listening history:', error);
        return;
      }

      setHistory(data || []);
    } catch (error) {
      console.error('Error in fetchHistory:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const recordListeningSession = async (
    hymnId: string,
    hymnTitle: string,
    options?: {
      artistName?: string;
      albumName?: string;
      duration?: number;
      hymnNumber?: string;
      bookId?: number;
    }
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('No user found, cannot record listening session');
        return;
      }

      const historyEntry = {
        user_id: user.id,
        hymn_id: hymnId,
        hymn_title: hymnTitle,
        artist_name: options?.artistName || 'Unknown Artist',
        album_name: options?.albumName,
        duration: options?.duration,
        hymn_number: options?.hymnNumber,
        book_id: options?.bookId
      };

      const { error } = await supabase
        .from('listening_history')
        .insert([historyEntry]);

      if (error) {
        console.error('Error recording listening session:', error);
        return;
      }

      // Update local state
      const newEntry: ListeningHistoryEntry = {
        ...historyEntry,
        id: Date.now().toString(),
        played_at: new Date().toISOString()
      };
      
      setHistory(prev => [newEntry, ...prev.slice(0, 99)]);

      console.log('Listening session recorded successfully');
    } catch (error) {
      console.error('Error in recordListeningSession:', error);
    }
  };

  const getRecentlyPlayed = (limit: number = 20) => {
    return history.slice(0, limit);
  };

  const getMostPlayedHymns = () => {
    const playCount = history.reduce((acc, entry) => {
      acc[entry.hymn_id] = (acc[entry.hymn_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(playCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([hymnId, count]) => {
        const entry = history.find(h => h.hymn_id === hymnId);
        return {
          hymnId,
          count,
          hymnTitle: entry?.hymn_title || 'Unknown',
          hymnNumber: entry?.hymn_number,
          lastPlayed: entry?.played_at
        };
      });
  };

  const clearHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { error } = await supabase
        .from('listening_history')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error clearing history:', error);
        toast({
          title: "Error",
          description: "Failed to clear listening history.",
          variant: "destructive",
        });
        return;
      }

      setHistory([]);
      toast({
        title: "Success",
        description: "Listening history cleared successfully.",
      });
    } catch (error) {
      console.error('Error in clearHistory:', error);
    }
  };

  return {
    history,
    isLoading,
    recordListeningSession,
    getRecentlyPlayed,
    getMostPlayedHymns,
    clearHistory,
    refreshHistory: fetchHistory
  };
};
