import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Upload, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface BulkOperationsProps {
  lyricsData?: any;
  onLyricsChange?: (data: any) => void;
  selectedHymnbook: any;
}

const BulkOperations = ({ selectedHymnbook }: BulkOperationsProps) => {
  const [bulkText, setBulkText] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const handleBulkImport = async () => {
    if (!bulkText.trim()) {
      toast({
        title: "Error",
        description: "Please enter some lyrics to import",
        variant: "destructive",
      });
      return;
    }

    if (!selectedHymnbook?.id) {
      toast({
        title: "Error",
        description: "Please select a hymnbook first",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);

    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        toast({
          title: "Error",
          description: "You must be logged in to save lyrics",
          variant: "destructive",
        });
        return;
      }

      // Parse the bulk text - expecting format like:
      // [NUMBER] Title
      // Author: Author Name
      // Composer: Composer Name
      // Lyrics here...
      //
      // [NEXT NUMBER] Next Title
      // etc.

      const hymnSections = bulkText.split(/\n\s*\n/);
      const hymnsToInsert = [];

      for (const section of hymnSections) {
        const lines = section.trim().split('\n');
        if (lines.length === 0) continue;

        const firstLine = lines[0];
        const numberMatch = firstLine.match(/^\[(\d+)\]\s*(.+)$/);
        
        if (!numberMatch) continue;

        const number = parseInt(numberMatch[1]);
        const title = numberMatch[2].trim();
        
        let author = '';
        let composer = '';
        let lyricsStart = 1;

        if (lines[1]?.startsWith('Author:')) {
          author = lines[1].replace('Author:', '').trim();
          lyricsStart = 2;
        }
        
        if (lines[lyricsStart]?.startsWith('Composer:')) {
          composer = lines[lyricsStart].replace('Composer:', '').trim();
          lyricsStart++;
        }

        const lyrics = lines.slice(lyricsStart).join('\n').trim();

        hymnsToInsert.push({
          number,
          title,
          author,
          composer,
          lyrics_plain: lyrics,
          lyrics_lrc: lyrics,
          hymnbook_id: selectedHymnbook.id
        });
      }

      if (hymnsToInsert.length === 0) {
        toast({
          title: "Error",
          description: "No valid hymns found to import. Please check the format.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('hymns')
        .insert(hymnsToInsert);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Successfully imported ${hymnsToInsert.length} hymn(s)`,
      });

      setBulkText("");
    } catch (error) {
      console.error('Error importing lyrics:', error);
      toast({
        title: "Error",
        description: "Failed to import lyrics",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Bulk Import
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Paste Hymns</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Format: [Number] Title, Author: Name, Composer: Name, Lyrics
              </p>
              <Textarea
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder={`[1] Amazing Grace
Author: John Newton
Composer: William Walker
Amazing grace how sweet the sound
That saved a wretch like me

[2] How Great Thou Art
Author: Carl Boberg
Composer: Stuart K. Hine
O Lord my God, when I in awesome wonder`}
                className="min-h-[300px] font-mono text-sm"
              />
            </div>
            
            <Button onClick={handleBulkImport} disabled={isImporting || !bulkText.trim()}>
              {isImporting ? (
                <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
              ) : (
                <FileText className="w-4 h-4 mr-2" />
              )}
              Import Hymns
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkOperations;
