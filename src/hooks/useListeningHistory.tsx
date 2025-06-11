
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ListeningHistoryEntry {
  id: string;
  hymnId: string;
  hymnTitle: string;
  artistName?: string;
  albumName?: string;
  playedAt: string;
  duration?: number;
  userId: string;
  hymnNumber?: string;
  bookId?: number;
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
        .eq('userId', user.id)
        .order('playedAt', { ascending: false })
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

      const historyEntry: Omit<ListeningHistoryEntry, 'id'> = {
        hymnId,
        hymnTitle,
        artistName: options?.artistName || 'Unknown Artist',
        albumName: options?.albumName,
        playedAt: new Date().toISOString(),
        duration: options?.duration,
        userId: user.id,
        hymnNumber: options?.hymnNumber,
        bookId: options?.bookId
      };

      const { error } = await supabase
        .from('listening_history')
        .insert([historyEntry]);

      if (error) {
        console.error('Error recording listening session:', error);
        return;
      }

      // Update local state
      setHistory(prev => [
        { ...historyEntry, id: Date.now().toString() },
        ...prev.slice(0, 99) // Keep only the latest 100 entries
      ]);

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
      acc[entry.hymnId] = (acc[entry.hymnId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(playCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([hymnId, count]) => {
        const entry = history.find(h => h.hymnId === hymnId);
        return {
          hymnId,
          count,
          hymnTitle: entry?.hymnTitle || 'Unknown',
          hymnNumber: entry?.hymnNumber,
          lastPlayed: entry?.playedAt
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
        .eq('userId', user.id);

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
