
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Save, 
  Download,
  Edit3,
  Eye,
  EyeOff
} from 'lucide-react';
import { SyncProject, SyncPoint, SyncData } from '@/types/syncEditor';
import AudioPlayer from './sync-editor/AudioPlayer';
import SyncControls from './sync-editor/SyncControls';
import SyncDataList from './sync-editor/SyncDataList';
import SyncEditForm from './sync-editor/SyncEditForm';
import MockAudioSelector from './sync-editor/MockAudioSelector';

interface SyncEditorProps {
  project: SyncProject;
  onProjectUpdate: (updatedProject: SyncProject) => void;
}

const SyncEditor: React.FC<SyncEditorProps> = ({ project, onProjectUpdate }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [selectedSyncPoint, setSelectedSyncPoint] = useState<SyncPoint | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [syncData, setSyncData] = useState<SyncData[]>(project.sync_data || []);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Audio control functions
  const handlePlay = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const handleStop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, []);

  const handleSeek = useCallback((value: number[]) => {
    if (audioRef.current && duration > 0) {
      const time = (value[0] / 100) * duration;
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, [duration]);

  const handleVolumeChange = useCallback((newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  }, []);

  const handlePlaybackRateChange = useCallback((rate: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  }, []);

  // Sync point management
  const handleAddSyncPoint = useCallback(() => {
    const newSyncPoint: SyncPoint = {
      id: `sync_${Date.now()}`,
      timestamp: currentTime,
      text: '',
      type: 'line' as const,
      metadata: {}
    };
    
    const newSyncData: SyncData = {
      id: `data_${Date.now()}`,
      syncPoints: [newSyncPoint],
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
    
    const updatedSyncData = [...syncData, newSyncData];
    setSyncData(updatedSyncData);
    
    const updatedProject = {
      ...project,
      sync_data: updatedSyncData,
      lastModified: new Date().toISOString()
    };
    
    onProjectUpdate(updatedProject);
    setSelectedSyncPoint(newSyncPoint);
    setIsEditing(true);
    
    toast({
      title: "Sync Point Added",
      description: `Added sync point at ${currentTime.toFixed(2)}s`
    });
  }, [currentTime, project, syncData, onProjectUpdate, toast]);

  const handleEditSyncPoint = useCallback((syncPoint: SyncPoint) => {
    setSelectedSyncPoint(syncPoint);
    setIsEditing(true);
  }, []);

  const handleUpdateSyncPoint = useCallback((updatedSyncPoint: SyncPoint) => {
    const updatedSyncData = syncData.map(data => ({
      ...data,
      syncPoints: data.syncPoints.map(point => 
        point.id === updatedSyncPoint.id ? updatedSyncPoint : point
      )
    }));
    
    setSyncData(updatedSyncData);
    
    const updatedProject = {
      ...project,
      sync_data: updatedSyncData,
      lastModified: new Date().toISOString()
    };
    
    onProjectUpdate(updatedProject);
    setIsEditing(false);
    setSelectedSyncPoint(null);
    
    toast({
      title: "Sync Point Updated",
      description: "Sync point has been updated successfully"
    });
  }, [syncData, project, onProjectUpdate, toast]);

  const handleDeleteSyncPoint = useCallback((syncPointId: string) => {
    const updatedSyncData = syncData.map(data => ({
      ...data,
      syncPoints: data.syncPoints.filter(point => point.id !== syncPointId)
    })).filter(data => data.syncPoints.length > 0);
    
    setSyncData(updatedSyncData);
    
    const updatedProject = {
      ...project,
      sync_data: updatedSyncData,
      lastModified: new Date().toISOString()
    };
    
    onProjectUpdate(updatedProject);
    
    if (selectedSyncPoint?.id === syncPointId) {
      setSelectedSyncPoint(null);
      setIsEditing(false);
    }
    
    toast({
      title: "Sync Point Deleted",
      description: "Sync point has been removed"
    });
  }, [syncData, project, onProjectUpdate, selectedSyncPoint, toast]);

  const handleJumpToSyncPoint = useCallback((timestamp: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = timestamp;
      setCurrentTime(timestamp);
    }
  }, []);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{project.title}</h2>
          <p className="text-muted-foreground">
            Last modified: {new Date(project.updated_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </Button>
          <Button variant="outline" size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Left Column - Audio Player & Controls */}
        <div className="space-y-6">
          <MockAudioSelector />
          
          <AudioPlayer
            audioRef={audioRef}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            volume={volume}
            playbackRate={playbackRate}
            onPlay={handlePlay}
            onStop={handleStop}
            onSeek={handleSeek}
            onVolumeChange={handleVolumeChange}
            onPlaybackRateChange={handlePlaybackRateChange}
          />

          <SyncControls
            currentTime={currentTime}
            formatTime={formatTime}
            onAddSyncPoint={handleAddSyncPoint}
          />
        </div>

        {/* Middle Column - Sync Data List */}
        <div>
          <SyncDataList
            syncData={syncData}
            selectedSyncPoint={selectedSyncPoint}
            onEditSyncPoint={handleEditSyncPoint}
            onDeleteSyncPoint={handleDeleteSyncPoint}
            onJumpToSyncPoint={handleJumpToSyncPoint}
            formatTime={formatTime}
          />
        </div>

        {/* Right Column - Edit Form */}
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit3 className="w-5 h-5" />
                {isEditing ? 'Edit Sync Point' : 'Sync Point Details'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedSyncPoint && isEditing ? (
                <SyncEditForm
                  syncPoint={selectedSyncPoint}
                  onUpdate={handleUpdateSyncPoint}
                  onCancel={() => {
                    setIsEditing(false);
                    setSelectedSyncPoint(null);
                  }}
                />
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <Edit3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a sync point to edit its properties</p>
                  <p className="text-sm mt-2">
                    Use the controls on the left to add new sync points while playing audio
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SyncEditor;
