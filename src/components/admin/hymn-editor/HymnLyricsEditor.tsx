import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface HymnLyricsEditorProps {
  hymn?: any;
  onBack: () => void;
  onSave?: (hymn: any) => void;
  selectedHymnbook: any;
}

const HymnLyricsEditor = ({ hymn, onBack, onSave, selectedHymnbook }: HymnLyricsEditorProps) => {
  const [title, setTitle] = useState("");
  const [number, setNumber] = useState("");
  const [author, setAuthor] = useState("");
  const [composer, setComposer] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [isSaving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (hymn) {
      setTitle(hymn.title || "");
      setNumber(hymn.number?.toString() || "");
      setAuthor(hymn.author || "");
      setComposer(hymn.composer || "");
      setLyrics(hymn.lyrics_plain || "");
    }
  }, [hymn]);

  const handleSave = async () => {
    if (!number.trim() || !title.trim()) {
      toast({
        title: "Error",
        description: "Please enter hymn number and title",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);

      const hymnData = {
        number: parseInt(number),
        title,
        author,
        composer,
        lyrics_plain: lyrics,
        lyrics_lrc: lyrics,
        hymnbook_id: selectedHymnbook?.id
      };

      if (hymn?.id) {
        const { error } = await supabase
          .from('hymns')
          .update(hymnData)
          .eq('id', hymn.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('hymns')
          .insert([hymnData]);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Hymn ${hymn?.id ? 'updated' : 'created'} successfully`,
      });

      onSave?.(hymnData);
    } catch (error) {
      console.error('Error saving hymn:', error);
      toast({
        title: "Error",
        description: "Failed to save hymn lyrics",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button onClick={onBack} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold">
                {hymn ? 'Edit' : 'Create'} Hymn Lyrics
              </h1>
              <p className="text-muted-foreground">
                {selectedHymnbook?.name} - Hymn #{number || 'New'}
              </p>
            </div>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
          >
            {isSaving ? (
              <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Lyrics
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Hymn Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Hymn Number</Label>
                <Input
                  type="number"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="e.g., 1"
                />
              </div>
              <div>
                <Label>Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Hymn title"
                />
              </div>
              <div>
                <Label>Author</Label>
                <Input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Author name"
                />
              </div>
              <div>
                <Label>Composer</Label>
                <Input
                  value={composer}
                  onChange={(e) => setComposer(e.target.value)}
                  placeholder="Composer name"
                />
              </div>
            </div>
            <div>
              <Label>Lyrics</Label>
              <Textarea
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                placeholder="Enter hymn lyrics..."
                rows={15}
                className="font-mono"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HymnLyricsEditor;
