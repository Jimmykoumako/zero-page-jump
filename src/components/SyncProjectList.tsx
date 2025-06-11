
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Calendar, Music, Save, X } from 'lucide-react';
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

interface SyncProjectListProps {
  projects: SyncProject[];
  selectedProject: SyncProject | null;
  onSelectProject: (project: SyncProject) => void;
  onDeleteProject: (projectId: string) => void;
  isCreating: boolean;
  tracks: Track[];
  onCreateProject: (title: string, trackId: string) => void;
  onCancelCreate: () => void;
}

const SyncProjectList = ({
  projects,
  selectedProject,
  onSelectProject,
  onDeleteProject,
  isCreating,
  tracks,
  onCreateProject,
  onCancelCreate
}: SyncProjectListProps) => {
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [selectedTrackId, setSelectedTrackId] = useState('');

  const handleCreateProject = () => {
    if (newProjectTitle.trim() && selectedTrackId) {
      onCreateProject(newProjectTitle.trim(), selectedTrackId);
      setNewProjectTitle('');
      setSelectedTrackId('');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      {/* Create New Project Form */}
      {isCreating && (
        <Card className="border-2 border-dashed border-primary/50">
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold">Create New Sync Project</h3>
            <div className="space-y-3">
              <Input
                placeholder="Project title..."
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
              />
              <Select value={selectedTrackId} onValueChange={setSelectedTrackId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a track..." />
                </SelectTrigger>
                <SelectContent>
                  {tracks.map((track) => (
                    <SelectItem key={track.id} value={track.id}>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{track.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {track.artist_name} • {track.album_name}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button 
                  onClick={handleCreateProject}
                  disabled={!newProjectTitle.trim() || !selectedTrackId}
                  size="sm"
                  className="flex-1"
                >
                  <Save className="w-4 h-4 mr-1" />
                  Create
                </Button>
                <Button 
                  variant="outline" 
                  onClick={onCancelCreate}
                  size="sm"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Project List */}
      {projects.length > 0 ? (
        <div className="space-y-2">
          {projects.map((project) => (
            <Card 
              key={project.id}
              className={`cursor-pointer transition-colors hover:bg-accent/50 ${
                selectedProject?.id === project.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => onSelectProject(project)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{project.title}</h4>
                    {project.track && (
                      <div className="flex items-center gap-1 mt-1">
                        <Music className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground truncate">
                          {project.track.title}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 mt-2">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {formatDate(project.updated_at)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <Badge variant="secondary" className="text-xs">
                      {Object.keys(project.sync_data || {}).length} syncs
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteProject(project.id);
                      }}
                      className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Music className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">No sync projects yet</h3>
          <p className="text-muted-foreground text-sm">
            Create your first sync project to start timing lyrics.
          </p>
        </div>
      )}
    </div>
  );
};

export default SyncProjectList;
