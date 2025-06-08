import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import HymnDisplay from "./HymnDisplay";
import QRCodeDisplay from "./QRCodeDisplay";
import FullscreenButton from "./FullscreenButton";

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
  const [showQR, setShowQR] = useState(mode === 'display');
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
          <div className="flex items-center justify-between mb-8">
            <Button onClick={onBack} variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
            <div className="flex gap-2">
              {mode === 'display' && (
                <Button 
                  onClick={() => setShowQR(!showQR)} 
                  variant="outline"
                >
                  {showQR ? 'Hide QR' : 'Show QR'}
                </Button>
              )}
              <FullscreenButton />
            </div>
          </div>

          {showQR && mode === 'display' && (
            <QRCodeDisplay deviceId={deviceId} />
          )}

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-800 mb-2">
              {selectedHymnbook ? selectedHymnbook.name : 
                (mode === 'display' ? 'Presentation Mode' : 'Hymn Selection')}
            </h1>
            <p className="text-slate-600">
              {selectedHymnbook ? selectedHymnbook.description :
                (mode === 'display' 
                  ? 'Select a hymn to begin group singing' 
                  : 'Choose a hymn to practice'
                )}
            </p>
          </div>

          {hymns.length === 0 ? (
            <Card className="p-8 text-center">
              <h3 className="text-xl font-semibold text-slate-600 mb-2">No Hymns Available</h3>
              <p className="text-slate-500">
                {selectedHymnbook 
                  ? `No hymns found in ${selectedHymnbook.name}` 
                  : 'No hymns available in this collection'
                }
              </p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hymns.map((hymn) => (
                <Card 
                  key={hymn.id}
                  className="p-6 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                  onClick={() => handleHymnSelect(hymn.id)}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">#{hymn.number}</div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">{hymn.title}</h3>
                    <p className="text-sm text-slate-600 mb-4">{hymn.author}</p>
                    <div className="text-xs text-slate-500">
                      {hymn.verses.length} verses • {hymn.key} • {hymn.tempo} BPM
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  const selectedHymnData = hymns.find(h => h.id === selectedHymn);
  if (!selectedHymnData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button onClick={() => setSelectedHymn(null)} variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Hymns
          </Button>
          <div className="flex gap-2">
            {mode === 'display' && (
              <Button 
                onClick={() => setShowQR(!showQR)} 
                variant="outline"
              >
                {showQR ? 'Hide QR' : 'Show QR'}
              </Button>
            )}
            <FullscreenButton />
          </div>
        </div>

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
          <div className="flex justify-center mt-8">
            <div className="bg-white rounded-xl p-4 shadow-lg flex items-center gap-4">
              <Button onClick={prevVerse} disabled={currentVerse === 0} size="sm">
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button onClick={togglePlay} size="sm">
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button 
                onClick={nextVerse} 
                disabled={currentVerse === selectedHymnData.verses.length - 1} 
                size="sm"
              >
                <SkipForward className="w-4 h-4" />
              </Button>
              <div className="text-sm text-slate-600 ml-4">
                Verse {currentVerse + 1} of {selectedHymnData.verses.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HymnBook;
