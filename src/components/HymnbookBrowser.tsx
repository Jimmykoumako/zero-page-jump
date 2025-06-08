import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Book, Users, Lock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Hymnbook {
  id: number;
  name: string;
  description: string;
  category: string;
  accessLevel: 'PRIVATE' | 'PUBLIC';
  addedHymns: number;
}

interface HymnbookBrowserProps {
  onBack: () => void;
  onSelectHymnbook: (hymnbook: Hymnbook) => void;
}

const HymnbookBrowser = ({ onBack, onSelectHymnbook }: HymnbookBrowserProps) => {
  const [hymnbooks, setHymnbooks] = useState<Hymnbook[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchHymnbooks();
  }, []);

  const fetchHymnbooks = async () => {
    try {
      console.log('Fetching hymnbooks...');
      
      // Fetch hymnbooks with their actual hymn counts
      const { data: hymnbooksData, error: hymnbooksError } = await supabase
        .from('HymnBook')
        .select(`
          id,
          name,
          description,
          category,
          accessLevel,
          addedHymns
        `)
        .eq('accessLevel', 'PUBLIC')
        .eq('isActive', true)
        .order('name');

      if (hymnbooksError) {
        console.error('Error fetching hymnbooks:', hymnbooksError);
        throw hymnbooksError;
      }

      console.log('Successfully fetched hymnbooks:', hymnbooksData);
      setHymnbooks(hymnbooksData || []);
    } catch (error) {
      console.error('Error fetching hymnbooks:', error);
      toast({
        title: "Error",
        description: "Failed to load hymnbooks.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading hymnbooks...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button onClick={onBack} variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Book className="w-16 h-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Hymnbook Library</h1>
          <p className="text-slate-600">Browse and select from our collection of hymnbooks</p>
        </div>

        {hymnbooks.length === 0 ? (
          <Card className="p-8 text-center">
            <Book className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No Hymnbooks Available</h3>
            <p className="text-slate-500">There are currently no public hymnbooks to browse.</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hymnbooks.map((hymnbook) => (
              <Card 
                key={hymnbook.id}
                className="p-6 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                onClick={() => onSelectHymnbook(hymnbook)}
              >
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <Book className="w-12 h-12 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">{hymnbook.name}</h3>
                  <p className="text-sm text-slate-600 mb-4">{hymnbook.description}</p>
                  <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {hymnbook.addedHymns} hymns
                    </span>
                    <span className="flex items-center gap-1">
                      {hymnbook.accessLevel === 'PRIVATE' ? (
                        <Lock className="w-3 h-3" />
                      ) : (
                        <Book className="w-3 h-3" />
                      )}
                      {hymnbook.accessLevel}
                    </span>
                  </div>
                  {hymnbook.category && (
                    <div className="mt-2">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {hymnbook.category}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HymnbookBrowser;
