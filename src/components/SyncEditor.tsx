
import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { mockAudioFiles } from '@/utils/mockAudio';
import MockAudioSelector from './sync-editor/MockAudioSelector';
import AudioPlayer from './sync-editor/AudioPlayer';
import SyncControls from './sync-editor/SyncControls';
import SyncDataList from './sync-editor/SyncDataList';
import type { LyricSyncData, SyncProject } from '@/types/syncEditor';

interface SyncEditorProps {
  project: SyncProject;
  onProjectUpdate: (project: SyncProject) => void;
}

const SyncEditor = ({ project, onProjectUpdate }: SyncEditorProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [syncData, setSyncData] = useState<LyricSyncData[]>([]);
  const [newLyricText, setNewLyricText] = useState('');
  const [selectedSync, setSelectedSync] = useState<LyricSyncData | null>(null);
  const [syncType, setSyncType] = useState<'verse' | 'line' | 'group' | 'syllable' | 'word'>('line');
  const [selectedMockAudio, setSelectedMockAudio] = useState<string>('');
  const [currentLyrics] = useState({
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

  const handleLoadMockAudio = (audioId: string) => {
    const mockAudio = mockAudioFiles.find(audio => audio.id === audioId);
    if (!mockAudio) return;

    setSelectedMockAudio(audioId);
    
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
    const linesDuration = 3;
    
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

  const handleUpdateSync = async (sync: LyricSyncData) => {
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
  };

  const handleDeleteSync = async (syncId: string) => {
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

      <SyncControls
        syncType={syncType}
        currentTime={currentTime}
        newLyricText={newLyricText}
        selectedMockAudio={selectedMockAudio}
        currentLyrics={currentLyrics}
        onSyncTypeChange={setSyncType}
        onNewLyricTextChange={setNewLyricText}
        onAddSync={handleAddSync}
        onQuickSync={handleQuickSync}
        onAutoSyncVerse={handleAutoSyncVerse}
      />

      <SyncDataList
        syncData={syncData}
        currentLyric={currentLyric}
        selectedSync={selectedSync}
        onSelectSync={setSelectedSync}
        onUpdateSync={handleUpdateSync}
        onDeleteSync={handleDeleteSync}
        onCancelEdit={() => setSelectedSync(null)}
      />
    </div>
  );
};

export default SyncEditor;
