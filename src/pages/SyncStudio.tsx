
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Plus, ArrowLeft, LayoutDashboard, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";
import { SyncProject } from "@/types/syncEditor";

const SyncStudio = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [projects, setProjects] = useState<SyncProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sync_projects')
        .select(`
          *,
          track:Track(*)
        `)
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match the expected SyncProject interface
      const transformedProjects: SyncProject[] = (data || []).map(project => ({
        id: project.id,
        title: project.title,
        name: project.title, // Use title as name for compatibility
        hymn_id: project.hymn_id,
        track_id: project.track_id,
        sync_data: project.sync_data,
        syncData: project.sync_data ? [project.sync_data] : [], // Wrap in array for compatibility
        created_at: project.created_at,
        updated_at: project.updated_at,
        lastModified: project.updated_at, // Use updated_at as lastModified
        track: project.track
      }));

      setProjects(transformedProjects);
    } catch (error) {
      console.error('Error fetching sync projects:', error);
      toast({
        title: "Error",
        description: "Failed to load sync projects.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createNewProject = async () => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to create sync projects.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('sync_projects')
        .insert({
          title: `New Sync Project ${new Date().toLocaleDateString()}`,
          user_id: user.id,
          sync_data: {}
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Project Created",
        description: "New sync project created successfully.",
      });

      // Navigate to the sync editor with the new project
      navigate(`/sync-editor/${data.id}`);
    } catch (error) {
      console.error('Error creating sync project:', error);
      toast({
        title: "Error",
        description: "Failed to create sync project.",
        variant: "destructive",
      });
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('sync_projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      setProjects(prev => prev.filter(p => p.id !== projectId));
      toast({
        title: "Project Deleted",
        description: "Sync project deleted successfully.",
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
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Please sign in to access Sync Studio</h2>
          <Button onClick={() => navigate('/auth')}>Sign In</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600 rounded-lg">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Sync Studio</h1>
                <p className="text-gray-600">Create synchronized lyric-audio experiences</p>
              </div>
            </div>
          </div>
          <Button onClick={createNewProject} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search sync projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card 
                key={project.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-purple-200"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg line-clamp-2">{project.title}</CardTitle>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => navigate(`/sync-editor/${project.id}`)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteProject(project.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Created: {new Date(project.created_at).toLocaleDateString()}</div>
                    <div>Modified: {new Date(project.updated_at).toLocaleDateString()}</div>
                    {project.track && (
                      <div>Track: {project.track.title}</div>
                    )}
                    {project.hymn_id && (
                      <div>Hymn: #{project.hymn_id}</div>
                    )}
                  </div>
                  <Button 
                    className="w-full mt-4"
                    onClick={() => navigate(`/sync-editor/${project.id}`)}
                  >
                    Open Project
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <LayoutDashboard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? "No projects found" : "No sync projects yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? "Try adjusting your search terms" 
                : "Create your first sync project to get started"
              }
            </p>
            {!searchTerm && (
              <Button onClick={createNewProject} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create Your First Project
              </Button>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="mt-12 bg-white rounded-lg p-6 border">
          <h3 className="text-lg font-semibold mb-4">How Sync Studio Works</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Getting Started</h4>
              <ul className="space-y-1">
                <li>• Create a new sync project</li>
                <li>• Upload or select an audio track</li>
                <li>• Choose hymn lyrics to sync</li>
                <li>• Set timing markers for each line</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Features</h4>
              <ul className="space-y-1">
                <li>• Precise timing controls</li>
                <li>• Real-time preview</li>
                <li>• Export synchronized data</li>
                <li>• Collaborate with others</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyncStudio;
