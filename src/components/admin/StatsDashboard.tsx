import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { BarChart3, Music, Volume2, Users, BookOpen } from "lucide-react";

interface DashboardStats {
  totalHymnbooks: number;
  totalHymns: number;
  totalAudioFiles: number;
  totalUserRoles: number;
}

const StatsDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalHymnbooks: 0,
    totalHymns: 0,
    totalAudioFiles: 0,
    totalUserRoles: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      const { count: hymnbooksCount, error: hymnbooksError } = await supabase
        .from('hymnbooks')
        .select('*', { count: 'exact', head: true });

      if (hymnbooksError) throw hymnbooksError;

      const { count: hymnsCount, error: hymnsError } = await supabase
        .from('hymns')
        .select('*', { count: 'exact', head: true });

      if (hymnsError) throw hymnsError;

      const { count: audioCount, error: audioError } = await supabase
        .from('audio_tracks')
        .select('*', { count: 'exact', head: true });

      if (audioError) throw audioError;

      const { count: userRolesCount, error: userRolesError } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true });

      if (userRolesError) throw userRolesError;

      setStats({
        totalHymnbooks: hymnbooksCount || 0,
        totalHymns: hymnsCount || 0,
        totalAudioFiles: audioCount || 0,
        totalUserRoles: userRolesCount || 0
      });

    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="text-center">Loading dashboard statistics...</div>
      </Card>
    );
  }

  const statCards = [
    {
      title: "Total Hymnbooks",
      value: stats.totalHymnbooks,
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Total Hymns",
      value: stats.totalHymns,
      icon: Music,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Audio Files",
      value: stats.totalAudioFiles,
      icon: Volume2,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "User Roles",
      value: stats.totalUserRoles,
      icon: Users,
      color: "text-rose-600",
      bgColor: "bg-rose-50"
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">System Overview</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className={`p-4 ${stat.bgColor} border-0`}>
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm">{stat.title}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default StatsDashboard;
