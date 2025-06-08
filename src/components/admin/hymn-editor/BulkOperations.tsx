
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Upload, Download, FileText, Trash2, Copy, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface LyricsLine {
  text: string;
  syllables: string[];
}

interface LyricsData {
  order: string[];
  verses: LyricsLine[][];
  choruses: LyricsLine[][];
}

interface BulkOperationsProps {
  lyricsData: LyricsData;
  onLyricsChange: (data: LyricsData) => void;
  selectedHymnbook: any;
}

const BulkOperations = ({ lyricsData, onLyricsChange, selectedHymnbook }: BulkOperationsProps) => {
  const [bulkImportText, setBulkImportText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [operationType, setOperationType] = useState<'find-replace' | 'uppercase' | 'lowercase' | 'title-case' | 'trim'>('find-replace');
  const { toast } = useToast();

  const handleBulkImport = async () => {
    if (!bulkImportText.trim()) {
      toast({
        title: "Error",
        description: "Please enter text to import",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      
      // Parse multiple hymns from text
      const hymns = parseBulkText(bulkImportText);
      
      if (hymns.length === 0) {
        toast({
          title: "Error",
          description: "No valid hymns found in the text",
          variant: "destructive",
        });
        return;
      }

      // Import each hymn
      for (const hymn of hymns) {
        const { error } = await supabase
          .from('HymnLyric')
          .insert([{
            hymnTitleNumber: hymn.number,
            lyrics: hymn.lyrics,
            bookId: selectedHymnbook?.id || 1,
            userId: (await supabase.auth.getUser()).data.user?.id || "",
          }]);

        if (error) {
          console.error('Error importing hymn:', hymn.number, error);
        }
      }

      toast({
        title: "Success",
        description: `Imported ${hymns.length} hymns successfully`,
      });

      setBulkImportText("");
    } catch (error) {
      console.error('Error in bulk import:', error);
      toast({
        title: "Error",
        description: "Failed to import hymns",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const parseBulkText = (text: string) => {
    const hymns: Array<{ number: string; lyrics: LyricsData }> = [];
    const sections = text.split(/(?=HYMN\s+\d+|#\d+)/i).filter(section => section.trim());

    sections.forEach(section => {
      const lines = section.split('\n').map(line => line.trim()).filter(line => line);
      if (lines.length === 0) return;

      // Extract hymn number
      const hymnMatch = lines[0].match(/(?:HYMN\s+|#)(\d+)/i);
      if (!hymnMatch) return;

      const hymnNumber = hymnMatch[1];
      const lyricsLines = lines.slice(1);

      // Parse lyrics
      const parsedLyrics = parseHymnLyrics(lyricsLines);
      if (parsedLyrics.order.length > 0) {
        hymns.push({ number: hymnNumber, lyrics: parsedLyrics });
      }
    });

    return hymns;
  };

  const parseHymnLyrics = (lines: string[]): LyricsData => {
    const lyricsData: LyricsData = {
      order: [],
      verses: [],
      choruses: []
    };

    let currentSection: LyricsLine[] = [];
    let currentSectionType: 'verse' | 'chorus' | null = null;

    lines.forEach(line => {
      const sectionMatch = line.match(/^(Verse|Chorus|Refrain)\s*(\d+)?/i);
      
      if (sectionMatch) {
        // Save previous section
        if (currentSection.length > 0 && currentSectionType) {
          if (currentSectionType === 'verse') {
            lyricsData.verses.push([...currentSection]);
            lyricsData.order.push(`verse${lyricsData.verses.length}`);
          } else {
            lyricsData.choruses.push([...currentSection]);
            lyricsData.order.push(`chorus${lyricsData.choruses.length}`);
          }
        }

        // Start new section
        const sectionName = sectionMatch[1].toLowerCase();
        currentSectionType = sectionName === 'verse' ? 'verse' : 'chorus';
        currentSection = [];
      } else if (line && currentSectionType) {
        const syllables = line.split(/[-\s]+/).filter(s => s.length > 0);
        currentSection.push({ text: line, syllables });
      }
    });

    // Save last section
    if (currentSection.length > 0 && currentSectionType) {
      if (currentSectionType === 'verse') {
        lyricsData.verses.push([...currentSection]);
        lyricsData.order.push(`verse${lyricsData.verses.length}`);
      } else {
        lyricsData.choruses.push([...currentSection]);
        lyricsData.order.push(`chorus${lyricsData.choruses.length}`);
      }
    }

    return lyricsData;
  };

  const handleTextOperation = () => {
    if (!lyricsData.order.length) {
      toast({
        title: "Error",
        description: "No lyrics to process",
        variant: "destructive",
      });
      return;
    }

    const processedData = { ...lyricsData };
    
    // Process verses
    processedData.verses = processedData.verses.map(verse => 
      verse.map(line => {
        let processedText = line.text;
        
        switch (operationType) {
          case 'find-replace':
            if (findText) {
              processedText = processedText.replace(new RegExp(findText, 'gi'), replaceText);
            }
            break;
          case 'uppercase':
            processedText = processedText.toUpperCase();
            break;
          case 'lowercase':
            processedText = processedText.toLowerCase();
            break;
          case 'title-case':
            processedText = processedText.replace(/\w\S*/g, (txt) => 
              txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
            );
            break;
          case 'trim':
            processedText = processedText.trim();
            break;
        }
        
        const syllables = processedText.split(/[-\s]+/).filter(s => s.length > 0);
        return { text: processedText, syllables };
      })
    );

    // Process choruses
    processedData.choruses = processedData.choruses.map(chorus => 
      chorus.map(line => {
        let processedText = line.text;
        
        switch (operationType) {
          case 'find-replace':
            if (findText) {
              processedText = processedText.replace(new RegExp(findText, 'gi'), replaceText);
            }
            break;
          case 'uppercase':
            processedText = processedText.toUpperCase();
            break;
          case 'lowercase':
            processedText = processedText.toLowerCase();
            break;
          case 'title-case':
            processedText = processedText.replace(/\w\S*/g, (txt) => 
              txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
            );
            break;
          case 'trim':
            processedText = processedText.trim();
            break;
        }
        
        const syllables = processedText.split(/[-\s]+/).filter(s => s.length > 0);
        return { text: processedText, syllables };
      })
    );

    onLyricsChange(processedData);
    
    toast({
      title: "Success",
      description: "Text operation applied successfully",
    });
  };

  const handleExportAll = async () => {
    try {
      const { data: hymns, error } = await supabase
        .from('HymnLyric')
        .select('*')
        .eq('bookId', selectedHymnbook?.id || 1);

      if (error) throw error;

      const exportData = {
        hymnbook: selectedHymnbook,
        hymns: hymns,
        exportedAt: new Date().toISOString(),
        totalHymns: hymns?.length || 0
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedHymnbook?.name || 'hymnbook'}-complete-export.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: `Exported ${hymns?.length || 0} hymns`,
      });
    } catch (error) {
      console.error('Error exporting hymns:', error);
      toast({
        title: "Error",
        description: "Failed to export hymns",
        variant: "destructive",
      });
    }
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all current lyrics? This cannot be undone.')) {
      onLyricsChange({
        order: [],
        verses: [],
        choruses: []
      });
      
      toast({
        title: "Success",
        description: "All lyrics cleared",
      });
    }
  };

  const handleDuplicate = () => {
    const duplicatedData = {
      order: [...lyricsData.order, ...lyricsData.order],
      verses: [...lyricsData.verses, ...lyricsData.verses],
      choruses: [...lyricsData.choruses, ...lyricsData.choruses]
    };
    
    onLyricsChange(duplicatedData);
    
    toast({
      title: "Success",
      description: "Lyrics duplicated",
    });
  };

  return (
    <div className="space-y-6">
      {/* Bulk Import */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Bulk Import
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="bulk-import">Multiple Hymns Text</Label>
            <Textarea
              id="bulk-import"
              value={bulkImportText}
              onChange={(e) => setBulkImportText(e.target.value)}
              placeholder={`Enter multiple hymns in this format:

HYMN 1
Verse 1
Amazing grace, how sweet the sound
That saved a wretch like me

Chorus
How sweet the sound
How sweet the sound

HYMN 2
Verse 1
Silent night, holy night
All is calm, all is bright`}
              className="min-h-[200px] font-mono text-sm"
            />
          </div>
          <Button 
            onClick={handleBulkImport} 
            disabled={isProcessing || !bulkImportText.trim()}
            className="w-full"
          >
            {isProcessing ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Upload className="w-4 h-4 mr-2" />
            )}
            Import Multiple Hymns
          </Button>
        </CardContent>
      </Card>

      {/* Text Operations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Text Operations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="operation-type">Operation Type</Label>
            <Select value={operationType} onValueChange={(value: any) => setOperationType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="find-replace">Find & Replace</SelectItem>
                <SelectItem value="uppercase">Convert to UPPERCASE</SelectItem>
                <SelectItem value="lowercase">Convert to lowercase</SelectItem>
                <SelectItem value="title-case">Convert to Title Case</SelectItem>
                <SelectItem value="trim">Trim Whitespace</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {operationType === 'find-replace' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="find-text">Find Text</Label>
                <Input
                  id="find-text"
                  value={findText}
                  onChange={(e) => setFindText(e.target.value)}
                  placeholder="Text to find"
                />
              </div>
              <div>
                <Label htmlFor="replace-text">Replace With</Label>
                <Input
                  id="replace-text"
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  placeholder="Replacement text"
                />
              </div>
            </div>
          )}

          <Button 
            onClick={handleTextOperation}
            disabled={!lyricsData.order.length}
            className="w-full"
          >
            Apply Operation
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={handleExportAll} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export All Hymns
            </Button>
            <Button onClick={handleDuplicate} variant="outline" disabled={!lyricsData.order.length}>
              <Copy className="w-4 h-4 mr-2" />
              Duplicate Lyrics
            </Button>
            <Button onClick={handleClearAll} variant="destructive" disabled={!lyricsData.order.length}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkOperations;
