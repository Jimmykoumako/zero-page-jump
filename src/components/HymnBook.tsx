
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import HymnDisplay from "./HymnDisplay";
import QRCodeDisplay from "./QRCodeDisplay";
import HymnList from "./HymnList";
import HymnControls from "./HymnControls";
import HymnHeader from "./HymnHeader";
import HymnPageHeader from "./HymnPageHeader";

interface Hymn {
  id: string;
  number: string;
  title: string;
  author: string;
  verses: string[];
  chorus?: string;
  key: string;
  tempo: number;
}

interface HymnBookProps {
  mode: 'hymnal' | 'display';
  deviceId: string;
  onBack: () => void;
  selectedHymnbook?: any;
}

const HymnBook = ({ mode, deviceId, onBack, selectedHymnbook }: HymnBookProps) => {
  const [hymns, setHymns] = useState<Hymn[]>([]);
  const [selectedHymn, setSelectedHymn] = useState<string | null>(null);
  const [currentVerse, setCurrentVerse] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showQR, setShowQR] = useState(false); // Changed from mode === 'display' to false
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchHymns();
  }, [selectedHymnbook]);

  const fetchHymns = async () => {
    try {
      setLoading(true);
      
      // If a hymnbook is selected, fetch hymns from that book
      const bookId = selectedHymnbook?.id || 1; // Default to book 1 if no hymnbook selected
      
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
        
        // Extract verses from lyrics data
        const verses = [];
        if (lyricsData?.verses) {
          for (let i = 1; i <= 10; i++) {
            if (lyricsData.verses[`verse${i}`]) {
              verses.push(lyricsData.verses[`verse${i}`]);
            }
          }
        }

        return {
          id: `${bookId}-${title.number}`,
          number: title.number,
          title: title.titles?.[0] || 'Untitled Hymn',
          author: lyricsData?.author || 'Unknown',
          verses: verses.length > 0 ? verses : ['No lyrics available'],
          chorus: lyricsData?.chorus || undefined,
          key: lyricsData?.key || 'C',
          tempo: lyricsData?.tempo || 120
        };
      });

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

  // Listen for remote control commands
  useEffect(() => {
    const handleRemoteCommand = (event: CustomEvent) => {
      const { command, data } = event.detail;
      
      switch (command) {
        case 'selectHymn':
          setSelectedHymn(data.hymnId);
          setCurrentVerse(0);
          break;
        case 'nextVerse':
          if (selectedHymn !== null) {
            const hymn = hymns.find(h => h.id === selectedHymn);
            if (hymn && currentVerse < hymn.verses.length - 1) {
              setCurrentVerse(prev => prev + 1);
            }
          }
          break;
        case 'prevVerse':
          if (currentVerse > 0) {
            setCurrentVerse(prev => prev - 1);
          }
          break;
        case 'togglePlay':
          setIsPlaying(prev => !prev);
          break;
      }
    };

    window.addEventListener(`remote-${deviceId}` as any, handleRemoteCommand);
    return () => window.removeEventListener(`remote-${deviceId}` as any, handleRemoteCommand);
  }, [deviceId, selectedHymn, currentVerse, hymns]);

  const handleHymnSelect = (hymnId: string) => {
    setSelectedHymn(hymnId);
    setCurrentVerse(0);
    setIsPlaying(false);
  };

  const nextVerse = () => {
    if (selectedHymn !== null) {
      const hymn = hymns.find(h => h.id === selectedHymn);
      if (hymn && currentVerse < hymn.verses.length - 1) {
        setCurrentVerse(prev => prev + 1);
      }
    }
  };

  const prevVerse = () => {
    if (currentVerse > 0) {
      setCurrentVerse(prev => prev - 1);
    }
  };

  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading hymns...</p>
        </div>
      </div>
    );
  }

  if (selectedHymn === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <HymnPageHeader 
            onBack={onBack}
            mode={mode}
            showQR={showQR}
            onToggleQR={() => setShowQR(!showQR)}
            selectedHymnbook={selectedHymnbook}
          />

          {showQR && mode === 'display' && (
            <QRCodeDisplay deviceId={deviceId} />
          )}

          <HymnList 
            hymns={hymns}
            onHymnSelect={handleHymnSelect}
            selectedHymnbook={selectedHymnbook}
          />
        </div>
      </div>
    );
  }

  const selectedHymnData = hymns.find(h => h.id === selectedHymn);
  if (!selectedHymnData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <HymnHeader 
          onBack={() => setSelectedHymn(null)}
          mode={mode}
          showQR={showQR}
          onToggleQR={() => setShowQR(!showQR)}
        />

        {showQR && mode === 'display' && (
          <QRCodeDisplay deviceId={deviceId} />
        )}

        <HymnDisplay 
          hymn={selectedHymnData}
          currentVerse={currentVerse}
          isPlaying={isPlaying}
          mode={mode}
        />

        {mode === 'hymnal' && (
          <HymnControls 
            currentVerse={currentVerse}
            totalVerses={selectedHymnData.verses.length}
            isPlaying={isPlaying}
            onPrevVerse={prevVerse}
            onNextVerse={nextVerse}
            onTogglePlay={togglePlay}
          />
        )}
      </div>
    </div>
  );
};

export default HymnBook;
