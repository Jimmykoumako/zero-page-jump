import React, { useEffect, useState, useMemo } from 'react';
import { PostgrestError } from '@supabase/supabase-js'; // Import for explicit error typing if needed
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft } from 'lucide-react';

// Define a type for individual hymns - adjust as per your actual hymn data structure
interface Hymn {
  id: string; // The ID will be the hymn number as a string
  title: string; // We'll extract the first title from the 'titles' array
  number: string; // Hymn number within the hymnbook
  titles: string[]; // The raw titles array from Supabase
  bookId: number; // Foreign key to HymnBook
}

// Define a type for Hymnbook details if needed, e.g., to display the hymnbook title
interface HymnbookDetails {
  id: number;
  name: string;
  // other hymnbook fields
}

interface HymnTitleDataEntry {
  number: string; // The hymn number can be a string (e.g., '1', '1a')
  titles: string[];
  bookId: number;
}

const HymnListPage: React.FC = () => {
  const { hymnbookId } = useParams<{ hymnbookId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [hymns, setHymns] = useState<Hymn[]>([]);
  const [hymnbookDetails, setHymnbookDetails] = useState<HymnbookDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!hymnbookId) return;

    const fetchHymnbookData = async () => {
      const numericHymnbookId: number = Number(hymnbookId);
      if (isNaN(numericHymnbookId)) {
        toast({
          title: "Error",
          description: "Invalid hymnbook ID provided.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        // Fetch hymnbook details (optional, but good for context)
        const { data: bookDetails, error: bookError } = await supabase
          .from('HymnBook') // Assuming your table is HymnBook
          .select('id, name')
          .eq('id', numericHymnbookId)
          .single();

        if (bookError) throw bookError;
        setHymnbookDetails(bookDetails);

        // Define the expected type for items from HymnTitle query
        // Fetch hymns for the hymnbook
        const { data: hymnData, error: hymnError } = await supabase
          .from('HymnTitle')
          .select('number, titles, bookId')
          .eq('bookId', numericHymnbookId) // Use numericHymnbookId here as well
          .order('number');

        if (hymnError) throw hymnError;

        // Explicitly type hymnData before mapping to help TypeScript
        const validHymnData: HymnTitleDataEntry[] = (hymnData || []) as HymnTitleDataEntry[];

        const transformedHymns: Hymn[] = validHymnData.map((hymnEntry): Hymn => ({
          id: hymnEntry.number,
          title: hymnEntry.titles && hymnEntry.titles.length > 0 ? hymnEntry.titles[0] : 'Untitled',
          number: hymnEntry.number,
          titles: hymnEntry.titles,
          bookId: hymnEntry.bookId,
        }));

        // Sort hymns numerically on the client-side to fix text-based sorting from DB
        transformedHymns.sort((a, b) => Number(a.number) - Number(b.number));

        setHymns(transformedHymns);

      } catch (error) {
        console.error('Error fetching hymnbook data:', error);
        toast({
          title: "Error",
          description: "Failed to load hymn list. Please try again.",
          variant: "destructive",
        });
        // Optionally navigate back or to an error page
        // navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchHymnbookData();
  }, [hymnbookId, toast]);

  const filteredHymns = useMemo(() => {
    if (!searchTerm) {
      return hymns;
    }
    return hymns.filter(hymn => 
      hymn.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(hymn.number).includes(searchTerm)
    );
  }, [hymns, searchTerm]);

  const handleSelectHymn = (hymn: Hymn) => {
    // Navigate to the specific hymn display page
    // hymn.id here is actually the hymn number from the HymnTitle table, used as hymnIdentifier
    navigate(`/hymnbook/${hymnbookId}/hymn/${hymn.id}`);
  };

  const handleBack = () => {
    navigate(-1); // Go back to the hymnbook browser
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>Loading hymns...</p>
        {/* Consider adding a spinner component here */}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Button onClick={handleBack} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          {hymnbookDetails && (
            <h1 className="text-3xl font-bold text-slate-800 text-center">{hymnbookDetails.name}</h1>
          )}
          {/* This div is a spacer to help with centering the title */}
          <div style={{ width: '86px' }}></div>
        </div>

        <div className="mb-6">
          <Input 
            type="search"
            placeholder="Search by title or number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        {filteredHymns.length > 0 ? (
          <ul className="space-y-3">
            {filteredHymns.map((hymn) => (
              <li key={hymn.id}>
                <Card 
                  className="p-4 hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => handleSelectHymn(hymn)}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-slate-700">
                      {hymn.number ? `${hymn.number}. ` : ''}{hymn.title}
                    </span>
                    {/* Optionally add more details like first line, etc. */}
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8">
            <p className="text-xl text-slate-500">{searchTerm ? 'No hymns match your search.' : 'No hymns found in this hymnbook.'}</p>
            <p className="text-slate-400 mt-2">{searchTerm ? 'Try a different search term.' : 'This hymnbook might be empty or is currently being updated.'}</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default HymnListPage;
