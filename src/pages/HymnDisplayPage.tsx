import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft } from 'lucide-react';

import HymnLyricsDisplay from '@/components/hymn-lyrics/HymnLyricsDisplay';

// The type for a single hymn's lyrics, based on HymnLyricsDisplay.tsx
interface LyricsLine {
  text: string;
  syllables: string[];
}

interface LyricsData {
  order: string[];
  verses: LyricsLine[][];
  choruses: LyricsLine[][];
}

interface HymnLyric {
  id: number;
  hymnTitleNumber: string;
  lyrics: LyricsData;
  userId: string;
  bookId: number;
}

const HymnDisplayPage: React.FC = () => {
  const { hymnbookId, hymnIdentifier } = useParams<{ hymnbookId: string; hymnIdentifier: string }>(); // hymnIdentifier is the hymn number
  const navigate = useNavigate();
  const { toast } = useToast();

  const [hymnLyric, setHymnLyric] = useState<HymnLyric | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hymnbookId || !hymnIdentifier) return;

    const fetchHymnDetails = async () => {
      setLoading(true);
      try {
        // TODO: Implement actual data fetching logic based on your schema
                const numericHymnbookId = Number(hymnbookId);
        if (isNaN(numericHymnbookId)) {
          throw new Error('Invalid hymnbook ID.');
        }

        // Fetch the hymn lyrics from the HymnLyrics table
        const { data: hymnLyricData, error: hymnLyricError } = await supabase
          .from('HymnLyrics')
          .select('*')
          .eq('bookId', numericHymnbookId)
          .eq('hymnTitleNumber', hymnIdentifier) // hymnIdentifier is the string number from the URL
          .single();

        if (hymnLyricError) throw hymnLyricError;

        if (hymnLyricData) {
          setHymnLyric(hymnLyricData);
        } else {
          throw new Error('Hymn lyrics not found.');
        }

      } catch (error: any) {
        console.error('Error fetching hymn details:', error);
        toast({
          title: "Error Loading Hymn",
          description: error.message || "Failed to load hymn details. Please try again.",
          variant: "destructive",
        });
        // Optionally navigate back
        // navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchHymnDetails();
  }, [hymnbookId, hymnIdentifier, toast]);

  const handleBack = () => {
    navigate(-1); // Go back to the previous page (hymn list)
  };
  
  const handleBackToHymnbooks = () => {
    navigate('/hymnbook'); // Navigate back to the main hymnbook browser
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>Loading hymn...</p>
        {/* Consider adding a spinner component here */}
      </div>
    );
  }

  if (!hymnLyric) {
    return (
      <div className="container mx-auto p-4 text-center">
        <Card>
            <CardHeader>
                <CardTitle>Hymn Not Found</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="mb-4">The requested hymn lyrics could not be found in this hymnbook.</p>
                <Button onClick={handleBack} variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Hymn List
                </Button>
            </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <HymnLyricsDisplay hymn={hymnLyric} onBack={handleBack} />
  );
};

export default HymnDisplayPage;
