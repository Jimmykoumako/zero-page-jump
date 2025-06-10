
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Hymn } from "@/data/hymns";

export const useHymnData = (selectedHymnbook?: any) => {
  const [hymns, setHymns] = useState<Hymn[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchHymns = async () => {
    try {
      setLoading(true);
      
      // If a hymnbook is selected, fetch hymns from that book
      const bookId = selectedHymnbook?.id || 1; // Default to book 1 if no hymnbook selected
      
      // Only fetch from active hymnbooks
      const { data: hymnbookData, error: hymnbookError } = await supabase
        .from('HymnBook')
        .select('is_active')
        .eq('id', bookId)
        .single();

      if (hymnbookError) throw hymnbookError;
      
      if (!hymnbookData?.is_active) {
        toast({
          title: "Notice",
          description: "This hymnbook is currently inactive.",
          variant: "destructive",
        });
        return;
      }
      
      // Fetch hymn titles for the selected book
      const { data: hymnTitles, error: titlesError } = await supabase
        .from('HymnTitle')
        .select('number, titles')
        .eq('bookId', bookId)
        .order('number');

      if (titlesError) throw titlesError;

      // Fetch hymn lyrics for the selected book
      const { data: hymnLyrics, error: lyricsError } = await supabase
        .from('HymnLyric')
        .select('hymnTitleNumber, lyrics')
        .eq('bookId', bookId);

      if (lyricsError) throw lyricsError;

      // Combine titles and lyrics
      const combinedHymns: Hymn[] = hymnTitles.map(title => {
        const lyrics = hymnLyrics.find(l => l.hymnTitleNumber === title.number);
        const lyricsData = lyrics?.lyrics as any;
        
        console.log(`Processing hymn ${title.number}:`, lyricsData);
        
        // Extract verses from the structured lyrics data
        const verses = [];
        if (lyricsData?.verses && Array.isArray(lyricsData.verses)) {
          // Handle array format where each verse is an array of lines
          lyricsData.verses.forEach((verse: any, index: number) => {
            if (Array.isArray(verse)) {
              // Convert array of line objects to text
              const verseText = verse.map((line: any) => line.text || line).join('\n');
              verses.push(verseText);
            } else if (typeof verse === 'string') {
              verses.push(verse);
            }
          });
        } else if (lyricsData?.verses && typeof lyricsData.verses === 'object') {
          // Handle object format with verse1, verse2, etc.
          for (let i = 1; i <= 10; i++) {
            const verseKey = `verse${i}`;
            if (lyricsData.verses[verseKey]) {
              const verse = lyricsData.verses[verseKey];
              if (Array.isArray(verse)) {
                const verseText = verse.map((line: any) => line.text || line).join('\n');
                verses.push(verseText);
              } else if (typeof verse === 'string') {
                verses.push(verse);
              }
            }
          }
        }

        // Extract chorus
        let chorus = undefined;
        if (lyricsData?.choruses && Array.isArray(lyricsData.choruses) && lyricsData.choruses[0]) {
          const chorusData = lyricsData.choruses[0];
          if (Array.isArray(chorusData)) {
            chorus = chorusData.map((line: any) => line.text || line).join('\n');
          } else if (typeof chorusData === 'string') {
            chorus = chorusData;
          }
        } else if (lyricsData?.chorus) {
          chorus = lyricsData.chorus;
        }

        console.log(`Hymn ${title.number} processed:`, { verses, chorus });

        return {
          id: parseInt(`${bookId}${title.number.toString().padStart(3, '0')}`), // Create unique numeric id
          number: parseInt(title.number), // Convert to number
          title: title.titles?.[0] || 'Untitled Hymn',
          author: lyricsData?.author || 'Unknown',
          verses: verses.length > 0 ? verses : ['No lyrics available'],
          chorus: chorus,
          key: lyricsData?.key || 'C',
          tempo: lyricsData?.tempo || 120
        };
      });

      console.log('All processed hymns:', combinedHymns);
      setHymns(combinedHymns);
    } catch (error) {
      console.error('Error fetching hymns:', error);
      toast({
        title: "Error",
        description: "Failed to load hymns.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHymns();
  }, [selectedHymnbook]);

  return { hymns, loading, refetch: fetchHymns };
};
