
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, FileText, Zap } from 'lucide-react';
import { formatTime } from '@/utils/mockAudio';

interface SyncControlsProps {
  syncType: 'verse' | 'line' | 'group' | 'syllable' | 'word';
  currentTime: number;
  newLyricText: string;
  selectedMockAudio: string;
  currentLyrics: Record<string, string>;
  onSyncTypeChange: (value: 'verse' | 'line' | 'group' | 'syllable' | 'word') => void;
  onNewLyricTextChange: (value: string) => void;
  onAddSync: () => void;
  onQuickSync: (text: string, type: 'verse' | 'line' | 'group') => void;
  onAutoSyncVerse: (verseText: string, verseIndex: number) => void;
}

const SyncControls = ({
  syncType,
  currentTime,
  newLyricText,
  selectedMockAudio,
  currentLyrics,
  onSyncTypeChange,
  onNewLyricTextChange,
  onAddSync,
  onQuickSync,
  onAutoSyncVerse
}: SyncControlsProps) => {
  return (
    <Tabs defaultValue="manual" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="manual">Manual Sync</TabsTrigger>
        <TabsTrigger value="quick">Quick Sync</TabsTrigger>
        <TabsTrigger value="auto">Auto Sync</TabsTrigger>
      </TabsList>

      <TabsContent value="manual" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Manual Lyric Timing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Sync Type</label>
                <Select value={syncType} onValueChange={onSyncTypeChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="verse">Entire Verse</SelectItem>
                    <SelectItem value="line">Single Line</SelectItem>
                    <SelectItem value="group">Group of Lines</SelectItem>
                    <SelectItem value="word">Individual Word</SelectItem>
                    <SelectItem value="syllable">Syllable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Current Time</label>
                <Input 
                  value={formatTime(currentTime)} 
                  readOnly 
                  className="bg-muted"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Lyric Text</label>
              <Textarea
                placeholder="Enter lyric text..."
                value={newLyricText}
                onChange={(e) => onNewLyricTextChange(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <Button 
              onClick={onAddSync}
              disabled={!newLyricText.trim() || !selectedMockAudio}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add {syncType} at {formatTime(currentTime)}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="quick" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Quick Sync with Sample Lyrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(currentLyrics).map(([key, text]) => (
              <div key={key} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium capitalize">{key.replace(/(\d+)/, ' $1')}</h3>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onQuickSync(text, 'verse')}
                    >
                      <FileText className="w-3 h-3 mr-1" />
                      Verse
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onQuickSync(text.split('\n')[0], 'line')}
                    >
                      <Zap className="w-3 h-3 mr-1" />
                      Line
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{text}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="auto" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Auto-Sync Verses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Auto-sync will automatically create line-by-line timings with 3-second intervals starting from the current time.
            </p>
            {Object.entries(currentLyrics).map(([key, text], index) => (
              <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h3 className="font-medium capitalize">{key.replace(/(\d+)/, ' $1')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {text.split('\n').length} lines
                  </p>
                </div>
                <Button
                  onClick={() => onAutoSyncVerse(text, index + 1)}
                  disabled={!selectedMockAudio}
                  size="sm"
                >
                  <Zap className="w-4 h-4 mr-1" />
                  Auto-Sync
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default SyncControls;
