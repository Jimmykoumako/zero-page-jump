
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Search, ArrowLeft, Music, Play, Pause } from "lucide-react";

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

interface HymnLyricsViewerProps {
  onBack: () => void;
  selectedHymnbook?: any;
}

const HymnLyricsViewer = ({ onBack, selectedHymnbook }: HymnLyricsViewerProps) => {
  const [hymns, setHymns] = useState<HymnLyric[]>([]);
  const [selectedHymn, setSelectedHymn] = useState<HymnLyric | null>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [showSyllables, setShowSyllables] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchHymnLyrics();
  }, [selectedHymnbook]);

  const fetchHymnLyrics = async () => {
    try {
      setLoading(true);
      const bookId = selectedHymnbook?.id || 1;

      const { data, error } = await supabase
        .from('HymnLyric')
        .select('*')
        .eq('bookId', bookId)
        .order('hymnTitleNumber');

      if (error) throw error;

      setHymns(data || []);
    } catch (error) {
      console.error('Error fetching hymn lyrics:', error);
      toast({
        title: "Error",
        description: "Failed to load hymn lyrics.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredHymns = hymns.filter(hymn =>
    hymn.hymnTitleNumber.includes(searchTerm) ||
    JSON.stringify(hymn.lyrics).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderLyricsSection = (lines: LyricsLine[], sectionType: 'verse' | 'chorus', index: number) => {
    return (
      <div className={`p-6 rounded-lg mb-4 ${
        sectionType === 'chorus' 
          ? 'bg-blue-50 border-2 border-blue-200' 
          : 'bg-slate-50 border border-slate-200'
      }`}>
        <div className="text-center mb-4">
          <span className={`font-semibold text-lg ${
            sectionType === 'chorus' ? 'text-blue-700' : 'text-slate-700'
          }`}>
            {sectionType === 'chorus' ? 'Chorus' : `Verse ${index + 1}`}
          </span>
        </div>
        <div className="space-y-3">
          {lines.map((line, lineIndex) => (
            <div key={lineIndex} className="text-center">
              <div className="text-xl leading-relaxed text-slate-800 mb-1">
                {line.text}
              </div>
              {showSyllables && (
                <div className="text-sm text-slate-500 font-mono">
                  {line.syllables.join(' • ')}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderOrderedLyrics = (hymn: HymnLyric) => {
    const { lyrics } = hymn;
    
    return (
      <div className="space-y-4">
        {lyrics.order?.map((sectionId, index) => {
          if (sectionId.startsWith('verse')) {
            const verseIndex = parseInt(sectionId.replace('verse', '')) - 1;
            const verse = lyrics.verses?.[verseIndex];
            if (verse) {
              return (
                <div key={`${sectionId}-${index}`}>
                  {renderLyricsSection(verse, 'verse', verseIndex)}
                </div>
              );
            }
          } else if (sectionId.startsWith('chorus')) {
            const chorusIndex = parseInt(sectionId.replace('chorus', '')) - 1;
            const chorus = lyrics.choruses?.[chorusIndex];
            if (chorus) {
              return (
                <div key={`${sectionId}-${index}`}>
                  {renderLyricsSection(chorus, 'chorus', chorusIndex)}
                </div>
              );
            }
          }
          return null;
        })}
      </div>
    );
  };

  const nextSection = () => {
    if (selectedHymn && currentSection < (selectedHymn.lyrics.order?.length || 1) - 1) {
      setCurrentSection(prev => prev + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading hymn lyrics...</p>
        </div>
      </div>
    );
  }

  if (selectedHymn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button onClick={() => setSelectedHymn(null)} variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to List
              </Button>
              <h1 className="text-3xl font-bold text-slate-800">
                Hymn #{selectedHymn.hymnTitleNumber}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowSyllables(!showSyllables)}
                variant="outline"
                size="sm"
              >
                {showSyllables ? 'Hide' : 'Show'} Syllables
              </Button>
              <Button
                onClick={() => setIsPlaying(!isPlaying)}
                variant="outline"
                size="sm"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Lyrics Display */}
          <Card className="p-8 bg-white shadow-xl max-w-4xl mx-auto">
            {renderOrderedLyrics(selectedHymn)}
          </Card>

          {/* Controls */}
          <div className="flex justify-center mt-8">
            <div className="bg-white rounded-xl p-4 shadow-lg flex items-center gap-4">
              <Button 
                onClick={prevSection} 
                disabled={currentSection === 0} 
                size="sm"
              >
                Previous
              </Button>
              <span className="text-sm text-slate-600">
                Section {currentSection + 1} of {selectedHymn.lyrics.order?.length || 1}
              </span>
              <Button 
                onClick={nextSection} 
                disabled={currentSection === (selectedHymn.lyrics.order?.length || 1) - 1} 
                size="sm"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button onClick={onBack} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-slate-800">
              Hymn Lyrics Viewer
            </h1>
          </div>
          {selectedHymnbook && (
            <div className="text-right">
              <h2 className="text-lg font-semibold text-slate-700">
                {selectedHymnbook.name}
              </h2>
              <p className="text-sm text-slate-500">{selectedHymnbook.description}</p>
            </div>
          )}
        </div>

        {/* Search */}
        <Card className="p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search by hymn number or lyrics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        {/* Hymns List */}
        <Card className="p-6">
          {filteredHymns.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              No hymn lyrics found
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHymns.map((hymn) => (
                <div
                  key={hymn.id}
                  className="flex items-start justify-between p-4 cursor-pointer hover:bg-slate-50 rounded-lg transition-colors border border-slate-200"
                  onClick={() => setSelectedHymn(hymn)}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-xl font-bold text-blue-600 w-16">
                      #{hymn.hymnTitleNumber}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">
                        {hymn.lyrics.verses?.[0]?.[0]?.text || 'Untitled Hymn'}
                      </div>
                      <div className="text-sm text-slate-600 mt-1">
                        {hymn.lyrics.verses?.length || 0} verses • {hymn.lyrics.choruses?.length || 0} choruses
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Music className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default HymnLyricsViewer;
