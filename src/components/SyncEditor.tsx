import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Pause, RotateCcw, Save, Plus, Trash2, Clock, Edit, Music, FileText, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Track } from '@/types/track';

interface SyncProject {
  id: string;
  title: string;
  hymn_id?: string;
  track_id?: string;
  sync_data: any;
  created_at: string;
  updated_at: string;
  track?: Track;
}

interface LyricSyncData {
  id?: string;
  line_index: number;
  verse_index: number;
  start_time: number;
  end_time: number;
  text: string;
  sync_type: 'verse' | 'line' | 'group' | 'syllable' | 'word';
  syllable_index?: number;
  word_index?: number;
}

interface SyncEditorProps {
  project: SyncProject;
  onProjectUpdate: (project: SyncProject) => void;
}

// Mock audio files for testing
const mockAudioFiles = [
  {
    id: 'mock-1',
    title: 'Amazing Grace - Traditional',
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', // Mock URL
    duration: 180,
    artist: 'Traditional Hymn'
  },
  {
    id: 'mock-2',
    title: 'How Great Thou Art - Orchestral',
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', // Mock URL
    duration: 240,
    artist: 'Orchestral Version'
  },
  {
    id: 'mock-3',
    title: 'Be Thou My Vision - Acoustic',
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', // Mock URL
    duration: 200,
    artist: 'Acoustic Guitar'
  }
];

const SyncEditor = ({ project, onProjectUpdate }: SyncEditorProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [syncData, setSyncData] = useState<LyricSyncData[]>([]);
  const [newLyricText, setNewLyricText] = useState('');
  const [selectedSync, setSelectedSync] = useState<LyricSyncData | null>(null);
  const [syncType, setSyncType] = useState<'verse' | 'line' | 'group' | 'syllable' | 'word'>('line');
  const [selectedMockAudio, setSelectedMockAudio] = useState<string>('');
  const [currentLyrics, setCurrentLyrics] = useState({
    verse1: "Amazing grace! How sweet the sound\nThat saved a wretch like me!\nI once was lost, but now am found;\nWas blind, but now I see.",
    verse2: "'Twas grace that taught my heart to fear,\nAnd grace my fears relieved;\nHow precious did that grace appear\nThe hour I first believed.",
    chorus: "How sweet the sound\nThat saved a wretch like me!"
  });
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchSyncData();
  }, [project.id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, [selectedMockAudio]);

  const fetchSyncData = async () => {
    try {
      const { data, error } = await supabase
        .from('lyric_sync_data')
        .select('*')
        .eq('sync_project_id', project.id)
        .order('verse_index', { ascending: true })
        .order('line_index', { ascending: true });

      if (error) throw error;
      
      // Ensure the data matches our LyricSyncData interface
      const formattedData: LyricSyncData[] = (data || []).map(item => ({
        id: item.id,
        line_index: item.line_index,
        verse_index: item.verse_index,
        start_time: item.start_time,
        end_time: item.end_time,
        text: item.text,
        sync_type: item.sync_type || 'line',
        syllable_index: item.syllable_index,
        word_index: item.word_index
      }));
      
      setSyncData(formattedData);
    } catch (error) {
      console.error('Error fetching sync data:', error);
    }
  };

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const newTime = (value[0] / 100) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleLoadMockAudio = (audioId: string) => {
    const mockAudio = mockAudioFiles.find(audio => audio.id === audioId);
    if (!mockAudio) return;

    setSelectedMockAudio(audioId);
    
    // Update the audio element
    const audio = audioRef.current;
    if (audio) {
      audio.src = mockAudio.url;
      audio.load();
    }

    toast({
      title: "Mock Audio Loaded",
      description: `Loaded "${mockAudio.title}" for sync testing.`,
    });
  };

  const handleAddSync = async () => {
    if (!newLyricText.trim()) return;

    const newSync: Omit<LyricSyncData, 'id'> = {
      line_index: syncData.filter(s => s.sync_type === syncType).length,
      verse_index: 1,
      start_time: currentTime,
      end_time: currentTime + (syncType === 'syllable' ? 0.5 : syncType === 'word' ? 1 : 3),
      text: newLyricText.trim(),
      sync_type: syncType,
      syllable_index: syncType === 'syllable' ? 0 : undefined,
      word_index: syncType === 'word' ? 0 : undefined
    };

    try {
      const { data, error } = await supabase
        .from('lyric_sync_data')
        .insert({
          sync_project_id: project.id,
          line_index: newSync.line_index,
          verse_index: newSync.verse_index,
          start_time: newSync.start_time,
          end_time: newSync.end_time,
          text: newSync.text,
          sync_type: newSync.sync_type,
          syllable_index: newSync.syllable_index,
          word_index: newSync.word_index
        })
        .select()
        .single();

      if (error) throw error;

      const formattedNewSync: LyricSyncData = {
        id: data.id,
        line_index: data.line_index,
        verse_index: data.verse_index,
        start_time: data.start_time,
        end_time: data.end_time,
        text: data.text,
        sync_type: data.sync_type,
        syllable_index: data.syllable_index,
        word_index: data.word_index
      };

      setSyncData(prev => [...prev, formattedNewSync]);
      setNewLyricText('');
      toast({
        title: "Success",
        description: `${syncType} timing added successfully!`,
      });
    } catch (error) {
      console.error('Error adding sync data:', error);
      toast({
        title: "Error",
        description: "Failed to add lyric timing.",
        variant: "destructive",
      });
    }
  };

  const handleQuickSync = (text: string, type: 'verse' | 'line' | 'group') => {
    setNewLyricText(text);
    setSyncType(type);
  };

  const handleAutoSyncVerse = (verseText: string, verseIndex: number) => {
    const lines = verseText.split('\n').filter(line => line.trim());
    const linesDuration = 3; // 3 seconds per line
    
    lines.forEach((line, index) => {
      const startTime = currentTime + (index * linesDuration);
      const endTime = startTime + linesDuration;
      
      const newSync = {
        line_index: index,
        verse_index: verseIndex,
        start_time: startTime,
        end_time: endTime,
        text: line.trim(),
        sync_type: 'line' as const
      };
      
      supabase
        .from('lyric_sync_data')
        .insert({
          sync_project_id: project.id,
          ...newSync
        })
        .then(() => {
          fetchSyncData();
        });
    });

    toast({
      title: "Auto-sync Complete",
      description: `Synced ${lines.length} lines from verse ${verseIndex}`,
    });
  };

  const getCurrentLyric = () => {
    return syncData.find(sync => 
      currentTime >= sync.start_time && currentTime <= sync.end_time
    );
  };

  const currentLyric = getCurrentLyric();
  const selectedMockAudioData = mockAudioFiles.find(audio => audio.id === selectedMockAudio);

  return (
    <div className="space-y-6">
      {/* Mock Audio Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="w-5 h-5" />
            Mock Audio Files for Testing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockAudioFiles.map((audio) => (
              <Card 
                key={audio.id} 
                className={`cursor-pointer transition-colors ${
                  selectedMockAudio === audio.id ? 'border-primary bg-primary/5' : 'hover:bg-accent/50'
                }`}
                onClick={() => handleLoadMockAudio(audio.id)}
              >
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm">{audio.title}</h3>
                    <p className="text-xs text-muted-foreground">{audio.artist}</p>
                    <p className="text-xs text-muted-foreground">{formatTime(audio.duration)}</p>
                    {selectedMockAudio === audio.id && (
                      <Badge variant="default" className="text-xs">Active</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Audio Player */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{selectedMockAudioData?.title || 'No Audio Selected'}</span>
            <Badge variant="outline">
              {syncData.length} synced items
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <audio
            ref={audioRef}
            src={selectedMockAudioData?.url}
            preload="metadata"
          />
          
          <div className="flex items-center gap-4">
            <Button
              onClick={handlePlayPause}
              variant="outline"
              size="sm"
              disabled={!selectedMockAudio}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            
            <div className="flex-1">
              <Slider
                value={duration ? [(currentTime / duration) * 100] : [0]}
                onValueChange={handleSeek}
                max={100}
                step={0.1}
                className="w-full"
                disabled={!selectedMockAudio}
              />
            </div>
            
            <div className="text-sm text-muted-foreground min-w-[80px]">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          {/* Current Lyric Display */}
          {currentLyric && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Now Playing</span>
                <Badge variant="secondary" className="text-xs">{currentLyric.sync_type}</Badge>
              </div>
              <p className="text-lg font-medium">{currentLyric.text}</p>
              <p className="text-sm text-muted-foreground">
                {formatTime(currentLyric.start_time)} - {formatTime(currentLyric.end_time)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sync Controls */}
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
                  <Select value={syncType} onValueChange={(value: any) => setSyncType(value)}>
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
                  onChange={(e) => setNewLyricText(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <Button 
                onClick={handleAddSync}
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
                        onClick={() => handleQuickSync(text, 'verse')}
                      >
                        <FileText className="w-3 h-3 mr-1" />
                        Verse
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleQuickSync(text.split('\n')[0], 'line')}
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
                    onClick={() => handleAutoSyncVerse(text, index + 1)}
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

      {/* Sync Data List */}
      <Card>
        <CardHeader>
          <CardTitle>Synced Items ({syncData.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {syncData.length > 0 ? (
            <div className="space-y-2">
              {syncData.map((sync, index) => (
                <div
                  key={sync.id}
                  className={`border rounded-lg p-3 transition-colors ${
                    currentLyric?.id === sync.id ? 'bg-primary/10 border-primary' : 'hover:bg-accent/50'
                  }`}
                >
                  {selectedSync?.id === sync.id ? (
                    <SyncEditForm
                      sync={selectedSync}
                      onSave={handleUpdateSync}
                      onCancel={() => setSelectedSync(null)}
                    />
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary" className="text-xs">
                            {sync.sync_type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            V{sync.verse_index} L{sync.line_index}
                          </span>
                        </div>
                        <p className="font-medium">{sync.text}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Start: {formatTime(sync.start_time)}</span>
                          <span>End: {formatTime(sync.end_time)}</span>
                          <span>Duration: {formatTime(sync.end_time - sync.start_time)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedSync(sync)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => sync.id && handleDeleteSync(sync.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2">No synced items yet</h3>
              <p className="text-muted-foreground">
                Load a mock audio file and start syncing lyrics at specific times.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  async function handleUpdateSync(sync: LyricSyncData) {
    if (!sync.id) return;

    try {
      const { error } = await supabase
        .from('lyric_sync_data')
        .update({
          start_time: sync.start_time,
          end_time: sync.end_time,
          text: sync.text,
          verse_index: sync.verse_index,
          line_index: sync.line_index,
          sync_type: sync.sync_type,
          syllable_index: sync.syllable_index,
          word_index: sync.word_index
        })
        .eq('id', sync.id);

      if (error) throw error;

      setSyncData(prev => prev.map(s => s.id === sync.id ? sync : s));
      setSelectedSync(null);
      toast({
        title: "Success",
        description: "Lyric timing updated successfully!",
      });
    } catch (error) {
      console.error('Error updating sync data:', error);
      toast({
        title: "Error",
        description: "Failed to update lyric timing.",
        variant: "destructive",
      });
    }
  }

  async function handleDeleteSync(syncId: string) {
    try {
      const { error } = await supabase
        .from('lyric_sync_data')
        .delete()
        .eq('id', syncId);

      if (error) throw error;

      setSyncData(prev => prev.filter(s => s.id !== syncId));
      toast({
        title: "Success",
        description: "Lyric timing deleted successfully!",
      });
    } catch (error) {
      console.error('Error deleting sync data:', error);
      toast({
        title: "Error",
        description: "Failed to delete lyric timing.",
        variant: "destructive",
      });
    }
  }
};

interface SyncEditFormProps {
  sync: LyricSyncData;
  onSave: (sync: LyricSyncData) => void;
  onCancel: () => void;
}

const SyncEditForm = ({ sync, onSave, onCancel }: SyncEditFormProps) => {
  const [editedSync, setEditedSync] = useState<LyricSyncData>(sync);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs font-medium mb-1 block">Sync Type</label>
          <Select 
            value={editedSync.sync_type} 
            onValueChange={(value: any) => setEditedSync(prev => ({ ...prev, sync_type: value }))}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="verse">Verse</SelectItem>
              <SelectItem value="line">Line</SelectItem>
              <SelectItem value="group">Group</SelectItem>
              <SelectItem value="word">Word</SelectItem>
              <SelectItem value="syllable">Syllable</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium mb-1 block">Verse Index</label>
          <Input
            type="number"
            value={editedSync.verse_index}
            onChange={(e) => setEditedSync(prev => ({ ...prev, verse_index: parseInt(e.target.value) }))}
            className="h-8"
          />
        </div>
      </div>
      
      <Textarea
        value={editedSync.text}
        onChange={(e) => setEditedSync(prev => ({ ...prev, text: e.target.value }))}
        className="min-h-[60px]"
      />
      
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs font-medium mb-1 block">Start Time</label>
          <Input
            type="number"
            step="0.1"
            value={editedSync.start_time}
            onChange={(e) => setEditedSync(prev => ({ ...prev, start_time: parseFloat(e.target.value) }))}
            className="h-8"
          />
        </div>
        <div>
          <label className="text-xs font-medium mb-1 block">End Time</label>
          <Input
            type="number"
            step="0.1"
            value={editedSync.end_time}
            onChange={(e) => setEditedSync(prev => ({ ...prev, end_time: parseFloat(e.target.value) }))}
            className="h-8"
          />
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button onClick={() => onSave(editedSync)} size="sm" className="flex-1">
          <Save className="w-4 h-4 mr-1" />
          Save
        </Button>
        <Button variant="outline" onClick={onCancel} size="sm">
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default SyncEditor;
