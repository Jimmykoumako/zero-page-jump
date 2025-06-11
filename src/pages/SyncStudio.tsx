import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Music, Search, Play, Pause, Save, RotateCcw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/useUser';
import SyncProjectList from '@/components/SyncProjectList';
import SyncEditor from '@/components/SyncEditor';
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

const SyncStudio = () => {
  const [projects, setProjects] = useState<SyncProject[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedProject, setSelectedProject] = useState<SyncProject | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch sync projects and tracks in parallel
      const [projectsResult, tracksResult] = await Promise.all([
        supabase
          .from('sync_projects')
          .select(`
            *,
            Track (*)
          `)
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false }),
        supabase
          .from('Track')
          .select('*')
          .order('title', { ascending: true })
      ]);

      if (projectsResult.error) {
        console.error('Error fetching sync projects:', projectsResult.error);
        toast({
          title: "Error",
          description: "Failed to load sync projects.",
          variant: "destructive",
        });
        return;
      }

      if (tracksResult.error) {
        console.error('Error fetching tracks:', tracksResult.error);
        toast({
          title: "Error",
          description: "Failed to load tracks.",
          variant: "destructive",
        });
        return;
      }

      setProjects(projectsResult.data || []);
      setTracks(tracksResult.data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (title: string, trackId: string) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('sync_projects')
        .insert({
          title,
          track_id: trackId,
          sync_data: {},
          user_id: user.id
        })
        .select(`
          *,
          Track (*)
        `)
        .single();

      if (error) throw error;

      setProjects(prev => [data, ...prev]);
      setIsCreating(false);
      setSelectedProject(data);
      toast({
        title: "Success",
        description: "Sync project created successfully!",
      });
    } catch (error) {
      console.error('Error creating sync project:', error);
      toast({
        title: "Error",
        description: "Failed to create sync project.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('sync_projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      setProjects(prev => prev.filter(p => p.id !== projectId));
      if (selectedProject?.id === projectId) {
        setSelectedProject(null);
      }
      toast({
        title: "Success",
        description: "Sync project deleted successfully!",
      });
    } catch (error) {
      console.error('Error deleting sync project:', error);
      toast({
        title: "Error",
        description: "Failed to delete sync project.",
        variant: "destructive",
      });
    }
  };

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.track?.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Music className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Please sign in to access the sync studio.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Music className="w-12 h-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">Loading sync studio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg p-3">
                <Music className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Sync Studio</h1>
                <p className="text-muted-foreground">Create timed lyrics synchronization for your hymns</p>
              </div>
            </div>
            <Button 
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search sync projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Project List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Sync Projects ({filteredProjects.length})</span>
                  {searchQuery && (
                    <Badge variant="secondary">{filteredProjects.length} results</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SyncProjectList
                  projects={filteredProjects}
                  selectedProject={selectedProject}
                  onSelectProject={setSelectedProject}
                  onDeleteProject={handleDeleteProject}
                  isCreating={isCreating}
                  tracks={tracks}
                  onCreateProject={handleCreateProject}
                  onCancelCreate={() => setIsCreating(false)}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sync Editor */}
          <div className="lg:col-span-2">
            {selectedProject ? (
              <SyncEditor
                project={selectedProject}
                onProjectUpdate={(updatedProject) => {
                  setProjects(prev => prev.map(p => 
                    p.id === updatedProject.id ? updatedProject : p
                  ));
                  setSelectedProject(updatedProject);
                }}
              />
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Music className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Project Selected</h3>
                  <p className="text-muted-foreground text-center mb-6">
                    Select a sync project from the list or create a new one to start synchronizing lyrics.
                  </p>
                  <Button onClick={() => setIsCreating(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Project
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyncStudio;
