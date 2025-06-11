
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, RotateCcw, Save, Plus, Trash2, Clock, Edit } from 'lucide-react';
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
}

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
  }, []);

  const fetchSyncData = async () => {
    try {
      const { data, error } = await supabase
        .from('lyric_sync_data')
        .select('*')
        .eq('sync_project_id', project.id)
        .order('verse_index', { ascending: true })
        .order('line_index', { ascending: true });

      if (error) throw error;
      setSyncData(data || []);
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

  const handleAddSync = async () => {
    if (!newLyricText.trim()) return;

    const newSync: Omit<LyricSyncData, 'id'> = {
      line_index: syncData.length,
      verse_index: 1,
      start_time: currentTime,
      end_time: currentTime + 3, // Default 3 second duration
      text: newLyricText.trim()
    };

    try {
      const { data, error } = await supabase
        .from('lyric_sync_data')
        .insert({
          sync_project_id: project.id,
          ...newSync
        })
        .select()
        .single();

      if (error) throw error;

      setSyncData(prev => [...prev, data]);
      setNewLyricText('');
      toast({
        title: "Success",
        description: "Lyric timing added successfully!",
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
          line_index: sync.line_index
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

  return (
    <div className="space-y-6">
      {/* Audio Player */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{project.track?.title || 'Unknown Track'}</span>
            <Badge variant="outline">
              {syncData.length} synced lyrics
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <audio
            ref={audioRef}
            src={project.track?.url}
            preload="metadata"
          />
          
          <div className="flex items-center gap-4">
            <Button
              onClick={handlePlayPause}
              variant="outline"
              size="sm"
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
              </div>
              <p className="text-lg font-medium">{currentLyric.text}</p>
              <p className="text-sm text-muted-foreground">
                {formatTime(currentLyric.start_time)} - {formatTime(currentLyric.end_time)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add New Sync */}
      <Card>
        <CardHeader>
          <CardTitle>Add Lyric Timing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter lyric text..."
              value={newLyricText}
              onChange={(e) => setNewLyricText(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleAddSync}
              disabled={!newLyricText.trim()}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add at {formatTime(currentTime)}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sync Data List */}
      <Card>
        <CardHeader>
          <CardTitle>Synced Lyrics ({syncData.length})</CardTitle>
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
              <h3 className="font-semibold mb-2">No synced lyrics yet</h3>
              <p className="text-muted-foreground">
                Start playing the audio and add lyrics at specific times.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
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
      <Textarea
        value={editedSync.text}
        onChange={(e) => setEditedSync(prev => ({ ...prev, text: e.target.value }))}
        className="min-h-[60px]"
      />
      <div className="grid grid-cols-2 gap-2">
        <Input
          type="number"
          step="0.1"
          value={editedSync.start_time}
          onChange={(e) => setEditedSync(prev => ({ ...prev, start_time: parseFloat(e.target.value) }))}
          placeholder="Start time"
        />
        <Input
          type="number"
          step="0.1"
          value={editedSync.end_time}
          onChange={(e) => setEditedSync(prev => ({ ...prev, end_time: parseFloat(e.target.value) }))}
          placeholder="End time"
        />
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
