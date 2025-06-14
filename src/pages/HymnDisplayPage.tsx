
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Share2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";

interface HymnLyric {
  id: number;
  hymnTitleNumber: string;
  lyrics: any;
  userId: string;
  bookId: number;
}

interface HymnTitle {
  number: string;
  titles: string[] | null;
  bookId: number;
}

const HymnDisplayPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUser();
  const [hymnLyric, setHymnLyric] = useState<HymnLyric | null>(null);
  const [hymnTitle, setHymnTitle] = useState<HymnTitle | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentVerse, setCurrentVerse] = useState(0);

  useEffect(() => {
    const fetchHymn = async () => {
      if (!id) return;

      try {
        setLoading(true);
        
        // First fetch the hymn title
        const { data: titleData, error: titleError } = await supabase
          .from('HymnTitle')
          .select('number, titles, bookId')
          .eq('number', id)
          .single();

        if (titleError) throw titleError;
        setHymnTitle(titleData);

        // Then fetch the hymn lyrics
        const { data: lyricData, error: lyricError } = await supabase
          .from('HymnLyric')
          .select('*')
          .eq('hymnTitleNumber', id)
          .single();

        if (lyricError) {
          console.error('Error fetching lyrics:', lyricError);
          // If no lyrics found, still show the title
          setHymnLyric(null);
        } else {
          setHymnLyric(lyricData);
        }

      } catch (error) {
        console.error('Error fetching hymn:', error);
        toast({
          title: "Error",
          description: "Failed to load hymn. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHymn();
  }, [id, toast]);

  const handleShare = async () => {
    if (navigator.share && hymnTitle) {
      try {
        await navigator.share({
          title: hymnTitle.titles?.[0] || `Hymn ${hymnTitle.number}`,
          text: 'Check out this hymn',
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to copying URL to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied",
          description: "Hymn link copied to clipboard",
        });
      } catch (error) {
        console.error('Error copying to clipboard:', error);
      }
    }
  };

  const handleLike = async () => {
    if (!user || !hymnTitle) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to like hymns",
        variant: "destructive",
      });
      return;
    }

    // This would need a likes table - for now just show a toast
    toast({
      title: "Feature Coming Soon",
      description: "Hymn liking functionality will be available soon!",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!hymnTitle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Hymn not found</h2>
          <Button onClick={() => navigate('/hymnbook')}>Back to Hymnbook</Button>
        </div>
      </div>
    );
  }

  // Extract verses from lyrics data
  const verses = [];
  if (hymnLyric?.lyrics?.verses) {
    if (Array.isArray(hymnLyric.lyrics.verses)) {
      hymnLyric.lyrics.verses.forEach((verse: any) => {
        if (Array.isArray(verse)) {
          const verseText = verse.map((line: any) => line.text || line).join('\n');
          verses.push(verseText);
        } else if (typeof verse === 'string') {
          verses.push(verse);
        }
      });
    } else if (typeof hymnLyric.lyrics.verses === 'object') {
      for (let i = 1; i <= 10; i++) {
        const verseKey = `verse${i}`;
        if (hymnLyric.lyrics.verses[verseKey]) {
          const verse = hymnLyric.lyrics.verses[verseKey];
          if (Array.isArray(verse)) {
            const verseText = verse.map((line: any) => line.text || line).join('\n');
            verses.push(verseText);
          } else if (typeof verse === 'string') {
            verses.push(verse);
          }
        }
      }
    }
  }

  const chorus = hymnLyric?.lyrics?.chorus || 
    (hymnLyric?.lyrics?.choruses && Array.isArray(hymnLyric.lyrics.choruses) && hymnLyric.lyrics.choruses[0]) ||
    null;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {hymnTitle.titles?.[0] || `Hymn ${hymnTitle.number}`}
              </h1>
              <p className="text-gray-600">Hymn #{hymnTitle.number}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleLike} variant="outline" size="sm">
              <Heart className="w-4 h-4" />
            </Button>
            <Button onClick={handleShare} variant="outline" size="sm">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Lyrics Display */}
        {verses.length > 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Verse Navigation */}
            {verses.length > 1 && (
              <div className="flex gap-2 mb-6 overflow-x-auto">
                {verses.map((_, index) => (
                  <Button
                    key={index}
                    onClick={() => setCurrentVerse(index)}
                    variant={currentVerse === index ? "default" : "outline"}
                    size="sm"
                  >
                    Verse {index + 1}
                  </Button>
                ))}
                {chorus && (
                  <Button
                    onClick={() => setCurrentVerse(verses.length)}
                    variant={currentVerse === verses.length ? "default" : "outline"}
                    size="sm"
                  >
                    Chorus
                  </Button>
                )}
              </div>
            )}

            {/* Current Verse/Chorus */}
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                {currentVerse < verses.length ? `Verse ${currentVerse + 1}` : 'Chorus'}
              </h2>
              <div className="text-lg leading-relaxed text-gray-800 whitespace-pre-line">
                {currentVerse < verses.length ? verses[currentVerse] : chorus}
              </div>
            </div>

            {/* Navigation Buttons */}
            {(verses.length > 1 || chorus) && (
              <div className="flex justify-between mt-8">
                <Button
                  onClick={() => setCurrentVerse(Math.max(0, currentVerse - 1))}
                  disabled={currentVerse === 0}
                  variant="outline"
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setCurrentVerse(Math.min((chorus ? verses.length : verses.length - 1), currentVerse + 1))}
                  disabled={currentVerse >= (chorus ? verses.length : verses.length - 1)}
                  variant="outline"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">No Lyrics Available</h2>
            <p className="text-gray-600">Lyrics for this hymn have not been added yet.</p>
          </div>
        )}

        {/* Hymn Info */}
        {hymnLyric?.lyrics && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Hymn Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {hymnLyric.lyrics.author && (
                <div>
                  <span className="font-medium">Author:</span> {hymnLyric.lyrics.author}
                </div>
              )}
              {hymnLyric.lyrics.key && (
                <div>
                  <span className="font-medium">Key:</span> {hymnLyric.lyrics.key}
                </div>
              )}
              {hymnLyric.lyrics.tempo && (
                <div>
                  <span className="font-medium">Tempo:</span> {hymnLyric.lyrics.tempo} BPM
                </div>
              )}
              <div>
                <span className="font-medium">Verses:</span> {verses.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HymnDisplayPage;
