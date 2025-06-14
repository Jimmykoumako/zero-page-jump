
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Music, Play } from 'lucide-react';
import { SyncProject } from '@/types/syncEditor';

interface SyncProjectListProps {
  projects: SyncProject[];
  onSelect: (project: SyncProject) => void;
  isLoading: boolean;
}

const SyncProjectList = ({ projects, onSelect, isLoading }: SyncProjectListProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Music className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-semibold mb-2">No sync projects yet</h3>
        <p className="text-gray-600 mb-4">
          Create your first sync project to start synchronizing lyrics with audio tracks.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Card 
          key={project.id} 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onSelect(project)}
        >
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="truncate">{project.title}</span>
              <Badge variant="outline" className="ml-2">
                {project.syncData?.length || 0} points
              </Badge>
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>
                {new Date(project.lastModified).toLocaleDateString()}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-gray-500" />
                <span className="text-sm truncate">
                  {project.track?.title || 'No track selected'}
                </span>
              </div>
              {project.track?.artist_name && (
                <div className="text-sm text-gray-600 truncate">
                  by {project.track.artist_name}
                </div>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-3"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(project);
                }}
              >
                <Play className="w-4 h-4 mr-2" />
                Open Project
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SyncProjectList;
