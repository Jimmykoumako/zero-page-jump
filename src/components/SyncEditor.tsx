
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Play, Pause, Save, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SyncProject, SyncData } from "@/types/syncEditor";
import SyncDataList from "@/components/sync-editor/SyncDataList";
import SyncControls from "@/components/sync-editor/SyncControls";
import AudioPlayer from "@/components/sync-editor/AudioPlayer";

interface SyncEditorProps {
  project: SyncProject;
  onBack: () => void;
}

const SyncEditor = ({ project, onBack }: SyncEditorProps) => {
  const { toast } = useToast();
  const [title, setTitle] = useState(project.title);
  const [syncData, setSyncData] = useState<SyncData[]>(project.syncData || []);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [selectedSyncIndex, setSelectedSyncIndex] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const saveProject = async () => {
    try {
      const { error } = await supabase
        .from('sync_projects')
        .update({
          title,
          sync_data: syncData,
          updated_at: new Date().toISOString()
        })
        .eq('id', project.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project saved successfully",
      });
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        title: "Error",
        description: "Failed to save project",
        variant: "destructive",
      });
    }
  };

  const addSyncPoint = () => {
    const newSyncPoint: SyncData = {
      id: Math.random().toString(),
      startTime: currentTime,
      endTime: currentTime + 5,
      text: "New sync point",
      verseIndex: 0,
      lineIndex: syncData.length
    };

    setSyncData([...syncData, newSyncPoint].sort((a, b) => a.startTime - b.startTime));
  };

  const updateSyncPoint = (index: number, updates: Partial<SyncData>) => {
    const updated = [...syncData];
    updated[index] = { ...updated[index], ...updates };
    setSyncData(updated);
  };

  const deleteSyncPoint = (index: number) => {
    setSyncData(syncData.filter((_, i) => i !== index));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button onClick={onBack} variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
            </Button>
            <div>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-2xl font-bold bg-transparent border-none p-0 h-auto"
              />
              <p className="text-slate-600 text-sm mt-1">
                Track: {project.track?.title || 'No track selected'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={addSyncPoint} variant="outline" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Sync Point
            </Button>
            <Button onClick={saveProject} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Project
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Audio Player</h3>
              <AudioPlayer
                audioUrl={project.track?.url}
                currentTime={currentTime}
                duration={duration}
                isPlaying={isPlaying}
                onTimeUpdate={setCurrentTime}
                onDurationChange={setDuration}
                onPlayPause={setIsPlaying}
                audioRef={audioRef}
              />
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Sync Controls</h3>
              <SyncControls
                currentTime={currentTime}
                formatTime={formatTime}
                onAddSyncPoint={addSyncPoint}
              />
            </Card>
          </div>

          <div>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Sync Points</h3>
              <SyncDataList
                syncData={syncData}
                selectedIndex={selectedSyncIndex}
                onSelect={setSelectedSyncIndex}
                onUpdate={updateSyncPoint}
                onDelete={deleteSyncPoint}
                formatTime={formatTime}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyncEditor;
