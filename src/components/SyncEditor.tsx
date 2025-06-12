
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Play, Pause, Plus, Save, Trash2, Download, Upload, Clock, Music } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatTime, mockAudioFiles } from '@/utils/mockAudio';
import type { LyricSyncData, SyncProject } from '@/types/syncEditor';
import MockAudioSelector from './sync-editor/MockAudioSelector';
import AudioPlayer from './sync-editor/AudioPlayer';

const SyncEditor = () => {
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [selectedMockAudio, setSelectedMockAudio] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [syncData, setSyncData] = useState<LyricSyncData[]>([]);
  const [currentLyric, setCurrentLyric] = useState<LyricSyncData | undefined>();
  const [newLyric, setNewLyric] = useState({
    text: '',
    start_time: 0,
    end_time: 0,
    sync_type: 'line' as const,
    line_index: 0,
    verse_index: 0,
    syllable_index: 0,
    word_index: 0
  });

  const selectedMockAudioData = mockAudioFiles.find(audio => audio.id === selectedMockAudio);

  const mockSyncData: LyricSyncData[] = [
    {
      id: '1',
      line_index: 0,
      verse_index: 0,
      start_time: 5.2,
      end_time: 8.7,
      text: 'Amazing grace, how sweet the sound',
      sync_type: 'line' as const,
      syllable_index: 0,
      word_index: 0
    },
    {
      id: '2',
      line_index: 1,
      verse_index: 0,
      start_time: 9.1,
      end_time: 12.5,
      text: 'That saved a wretch like me',
      sync_type: 'line' as const,
      syllable_index: 0,
      word_index: 0
    },
    {
      id: '3',
      line_index: 2,
      verse_index: 0,
      start_time: 13.0,
      end_time: 16.8,
      text: 'I once was lost, but now am found',
      sync_type: 'line' as const,
      syllable_index: 0,
      word_index: 0
    }
  ];

  useEffect(() => {
    if (selectedMockAudio && mockSyncData.length > 0) {
      setSyncData(mockSyncData);
    }
  }, [selectedMockAudio]);

  const handleLoadMockAudio = (audioId: string) => {
    setSelectedMockAudio(audioId);
    setIsPlaying(false);
    setCurrentTime(0);
    
    toast({
      title: "Mock Audio Loaded",
      description: `Loaded ${mockAudioFiles.find(a => a.id === audioId)?.title}`,
    });
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    if (!audioRef.current || !duration) return;
    
    const newTime = (value[0] / 100) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleAddSync = () => {
    const newSync: LyricSyncData = {
      id: Date.now().toString(),
      ...newLyric
    };
    
    setSyncData([...syncData, newSync]);
    setNewLyric({
      text: '',
      start_time: currentTime,
      end_time: currentTime + 3,
      sync_type: 'line' as const,
      line_index: syncData.length,
      verse_index: 0,
      syllable_index: 0,
      word_index: 0
    });
    
    toast({
      title: "Sync Point Added",
      description: `Added sync for: "${newSync.text}"`,
    });
  };

  const handleDeleteSync = (id: string) => {
    setSyncData(syncData.filter(sync => sync.id !== id));
    toast({
      title: "Sync Point Deleted",
      description: "Sync point removed successfully",
    });
  };

  const handleSetCurrentTime = () => {
    setNewLyric({
      ...newLyric,
      start_time: currentTime
    });
  };

  const handleSetEndTime = () => {
    setNewLyric({
      ...newLyric,
      end_time: currentTime
    });
  };

  const handleSyncTypeChange = (value: string) => {
    if (value === 'verse' || value === 'line' || value === 'group' || value === 'syllable' || value === 'word') {
      setNewLyric({
        ...newLyric,
        sync_type: value
      });
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [selectedMockAudio]);

  useEffect(() => {
    const current = syncData.find(sync => 
      currentTime >= sync.start_time && currentTime <= sync.end_time
    );
    setCurrentLyric(current);
  }, [currentTime, syncData]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sync Studio</h1>
          <p className="text-muted-foreground">Synchronize lyrics with audio tracks</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import Project
          </Button>
          <Button>
            <Save className="w-4 h-4 mr-2" />
            Save Project
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <MockAudioSelector 
            selectedMockAudio={selectedMockAudio}
            onLoadMockAudio={handleLoadMockAudio}
          />
          
          <AudioPlayer
            audioRef={audioRef}
            selectedMockAudio={selectedMockAudio}
            selectedMockAudioData={selectedMockAudioData}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            syncData={syncData}
            currentLyric={currentLyric}
            onPlayPause={handlePlayPause}
            onSeek={handleSeek}
          />
        </div>

        <div className="space-y-6">
          {/* Add New Sync Point */}
          <Card>
            <CardHeader>
              <CardTitle>Add Sync Point</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="lyric-text">Lyric Text</Label>
                <Input
                  id="lyric-text"
                  value={newLyric.text}
                  onChange={(e) => setNewLyric({ ...newLyric, text: e.target.value })}
                  placeholder="Enter lyric text..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Time</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      step="0.1"
                      value={newLyric.start_time}
                      onChange={(e) => setNewLyric({ ...newLyric, start_time: parseFloat(e.target.value) || 0 })}
                    />
                    <Button size="sm" variant="outline" onClick={handleSetCurrentTime}>
                      <Clock className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label>End Time</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      step="0.1"
                      value={newLyric.end_time}
                      onChange={(e) => setNewLyric({ ...newLyric, end_time: parseFloat(e.target.value) || 0 })}
                    />
                    <Button size="sm" variant="outline" onClick={handleSetEndTime}>
                      <Clock className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <Label>Sync Type</Label>
                <Select value={newLyric.sync_type} onValueChange={handleSyncTypeChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="verse">Verse</SelectItem>
                    <SelectItem value="line">Line</SelectItem>
                    <SelectItem value="group">Group</SelectItem>
                    <SelectItem value="syllable">Syllable</SelectItem>
                    <SelectItem value="word">Word</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleAddSync} className="w-full" disabled={!newLyric.text.trim()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Sync Point
              </Button>
            </CardContent>
          </Card>

          {/* Sync Data List */}
          <Card>
            <CardHeader>
              <CardTitle>Sync Points ({syncData.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {syncData.map((sync) => (
                  <div
                    key={sync.id}
                    className={`p-3 rounded-lg border ${
                      currentLyric?.id === sync.id ? 'border-primary bg-primary/10' : 'border-border'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{sync.text}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{formatTime(sync.start_time)} - {formatTime(sync.end_time)}</span>
                          <Badge variant="secondary" className="text-xs">{sync.sync_type}</Badge>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => sync.id && handleDeleteSync(sync.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SyncEditor;
