
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import SyncProjectList from "@/components/SyncProjectList";
import SyncEditor from "@/components/SyncEditor";
import { SyncProject } from "@/types/syncEditor";

const SyncStudio = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<SyncProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<SyncProject[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState<SyncProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const filtered = projects.filter(project =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.track?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.track?.artist_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProjects(filtered);
  }, [projects, searchTerm]);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('sync_projects')
        .select(`
          *,
          track:Track(id, title, artist_name, url, duration)
        `)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const formattedProjects: SyncProject[] = (data || []).map(project => ({
        id: project.id,
        title: project.title,
        name: project.title,
        hymn_id: project.hymn_id || '',
        track_id: project.track_id || '',
        sync_data: project.sync_data,
        syncData: Array.isArray(project.sync_data) ? 
          project.sync_data.map((item: any) => ({
            id: item.id || Math.random().toString(),
            startTime: item.startTime || 0,
            endTime: item.endTime || 0,
            text: item.text || '',
            verseIndex: item.verseIndex,
            lineIndex: item.lineIndex
          })) : [],
        created_at: project.created_at,
        updated_at: project.updated_at,
        lastModified: project.updated_at,
        track: project.track ? {
          id: project.track.id,
          title: project.track.title,
          artist_name: project.track.artist_name,
          url: project.track.url,
          duration: project.track.duration
        } : undefined
      }));

      setProjects(formattedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to fetch sync projects",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createNewProject = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to create projects",
          variant: "destructive",
        });
        return;
      }

      const newProject = {
        title: `New Project ${new Date().toLocaleString()}`,
        user_id: user.id,
        sync_data: []
      };

      const { data, error } = await supabase
        .from('sync_projects')
        .insert(newProject)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "New sync project created",
      });

      fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: "Failed to create sync project",
        variant: "destructive",
      });
    }
  };

  const handleProjectSelect = (project: SyncProject) => {
    setSelectedProject(project);
  };

  const handleBackToList = () => {
    setSelectedProject(null);
    fetchProjects(); // Refresh the list
  };

  if (selectedProject) {
    return <SyncEditor project={selectedProject} onBack={handleBackToList} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => window.history.back()} 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
            <h1 className="text-3xl font-bold text-slate-800">Sync Studio</h1>
          </div>
          <Button onClick={createNewProject} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Search className="w-5 h-5 text-slate-500" />
            <Input
              placeholder="Search projects by title, track, or artist..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
        </Card>

        <SyncProjectList
          projects={filteredProjects}
          onProjectSelect={handleProjectSelect}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default SyncStudio;
