
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, User, Mail, Calendar, Shield, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { User as SupabaseUser } from "@supabase/supabase-js";

const UserProfile = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasRequestedAdmin, setHasRequestedAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [requestLoading, setRequestLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      setUser(user);

      // Check if user is admin
      const { data: adminCheck } = await supabase.rpc('is_admin', { user_uuid: user.id });
      setIsAdmin(adminCheck || false);

      // Check if user has already requested admin privileges
      // We'll assume this is tracked in a notifications table or similar
      // For now, we'll just check if they have any admin-related notifications
      
    } catch (error) {
      console.error('Error checking user status:', error);
      toast({
        title: "Error",
        description: "Failed to load user information.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const requestAdminAccess = async () => {
    if (!user) return;
    
    setRequestLoading(true);
    try {
      // Create a notification for admin request
      const { error } = await supabase
        .from('notifications')
        .insert({
          userId: user.id,
          type: 'ADMIN_REQUEST',
          message: `User ${user.email} has requested admin privileges.`
        });

      if (error) throw error;

      setHasRequestedAdmin(true);
      toast({
        title: "Request Submitted",
        description: "Your request for admin privileges has been submitted for review.",
      });
    } catch (error: any) {
      console.error('Error requesting admin access:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit admin request.",
        variant: "destructive",
      });
    } finally {
      setRequestLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading user profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="p-8 max-w-md mx-auto text-center">
          <User className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Access Denied</h1>
          <p className="text-slate-600 mb-6">
            Please log in to view your profile.
          </p>
          <Button onClick={() => navigate('/auth')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go to Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">User Profile</h1>
            <p className="text-slate-600">Manage your account information</p>
          </div>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* User Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="text-sm text-slate-500">Member Since</p>
                  <p className="font-medium">
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="text-sm text-slate-500">Account Status</p>
                  <p className="font-medium flex items-center gap-2">
                    {isAdmin ? (
                      <>
                        <span className="text-green-600">Administrator</span>
                        <UserCheck className="w-4 h-4 text-green-600" />
                      </>
                    ) : (
                      <span className="text-blue-600">Regular User</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-5 h-5 flex items-center justify-center">
                  <div className={`w-3 h-3 rounded-full ${user.email_confirmed_at ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Email Status</p>
                  <p className="font-medium">
                    {user.email_confirmed_at ? 'Verified' : 'Pending Verification'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin Request Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Admin Access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isAdmin ? (
                <div className="text-center py-6">
                  <UserCheck className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-green-600 mb-2">
                    You are an Administrator
                  </h3>
                  <p className="text-slate-600 mb-4">
                    You have full access to the admin panel and can manage the application.
                  </p>
                  <Button onClick={() => navigate('/admin')} className="w-full">
                    <Shield className="w-4 h-4 mr-2" />
                    Go to Admin Panel
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Shield className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">
                    Request Admin Access
                  </h3>
                  <p className="text-slate-600 mb-4">
                    If you need administrative privileges, you can submit a request for review.
                  </p>
                  
                  {hasRequestedAdmin ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-yellow-800 font-medium">Request Pending</p>
                      <p className="text-yellow-700 text-sm mt-1">
                        Your admin request has been submitted and is awaiting review.
                      </p>
                    </div>
                  ) : (
                    <Button 
                      onClick={requestAdminAccess}
                      disabled={requestLoading}
                      className="w-full"
                      variant="outline"
                    >
                      {requestLoading ? (
                        "Submitting Request..."
                      ) : (
                        <>
                          <Shield className="w-4 h-4 mr-2" />
                          Request Admin Access
                        </>
                      )}
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Account Security</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">
              Keep your account secure by using a strong password and enabling email verification.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/auth')}>
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
