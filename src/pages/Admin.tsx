
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Plus, Users, Book, Music, Upload } from "lucide-react";
import HymnbookManager from "@/components/admin/HymnbookManager";
import HymnManager from "@/components/admin/HymnManager";
import AudioManager from "@/components/admin/AudioManager";
import UserRoleManager from "@/components/admin/UserRoleManager";

const Admin = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Access Denied",
          description: "You must be logged in to access the admin panel.",
          variant: "destructive",
        });
        return;
      }

      setCurrentUser(user);

      // Check if user is admin
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin');

      if (roles && roles.length > 0) {
        setIsAdmin(true);
      } else {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      toast({
        title: "Error",
        description: "Failed to check admin access.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Checking admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="p-8 max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Access Denied</h1>
          <p className="text-slate-600 mb-6">
            You don't have permission to access the admin panel.
          </p>
          <Button onClick={() => window.location.href = '/'}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Card>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Users },
    { id: 'hymnbooks', label: 'Hymnbooks', icon: Book },
    { id: 'hymns', label: 'Hymns', icon: Music },
    { id: 'audio', label: 'Audio Files', icon: Upload },
    { id: 'users', label: 'User Roles', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">Admin Dashboard</h1>
            <p className="text-slate-600">Manage hymns, hymnbooks, and audio files</p>
          </div>
          <Button onClick={() => window.location.href = '/'} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </Button>
              );
            })}
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'overview' && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Dashboard Overview</h2>
                <p className="text-slate-600 mb-6">
                  Welcome to the admin dashboard. Use the navigation on the left to manage different aspects of the hymnal system.
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="p-4 text-center">
                    <Book className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-semibold">Hymnbooks</h3>
                    <p className="text-sm text-slate-600">Manage collections</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <Music className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-semibold">Hymns</h3>
                    <p className="text-sm text-slate-600">Add and edit hymns</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <Upload className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <h3 className="font-semibold">Audio Files</h3>
                    <p className="text-sm text-slate-600">Upload recordings</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <Users className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <h3 className="font-semibold">User Roles</h3>
                    <p className="text-sm text-slate-600">Manage permissions</p>
                  </Card>
                </div>
              </Card>
            )}

            {activeTab === 'hymnbooks' && <HymnbookManager />}
            {activeTab === 'hymns' && <HymnManager />}
            {activeTab === 'audio' && <AudioManager />}
            {activeTab === 'users' && <UserRoleManager />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
