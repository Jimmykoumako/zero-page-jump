
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { User, Save } from "lucide-react";
import ImageUpload from "@/components/ui/image-upload";

interface UserProfileFormProps {
  user: any;
  onClose?: () => void;
}

const UserProfileForm = ({ user, onClose }: UserProfileFormProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [pseudoName, setPseudoName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user?.id) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('display_name, avatar_url, email')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (profile) {
        const nameParts = profile.display_name?.split(' ') || ['', ''];
        setFirstName(nameParts[0] || '');
        setLastName(nameParts.slice(1).join(' ') || '');
        setPseudoName(profile.display_name || '');
        setBio('');
        setProfilePicture(profile.avatar_url || '');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile information.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: pseudoName || `${firstName} ${lastName}`.trim(),
          avatar_url: profilePicture || null
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Profile updated!",
        description: "Your profile information has been saved successfully.",
      });

      if (onClose) {
        onClose();
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleProfileImageUpload = (fileName: string, originalName: string) => {
    setProfilePicture(fileName);
  };

  const getProfileImageUrl = () => {
    if (profilePicture) {
      return `https://sqnvnolccwghpqrcezwf.supabase.co/storage/v1/object/public/album-covers/${profilePicture}`;
    }
    return '';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Edit Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pseudoName">Display Name</Label>
              <Input
                id="pseudoName"
                value={pseudoName}
                onChange={(e) => setPseudoName(e.target.value)}
                placeholder="How others will see you in sessions"
              />
              <p className="text-xs text-muted-foreground">
                This will be your public display name in group sessions
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">About You</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about your role in worship, musical background, or anything you'd like to share..."
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                This helps us personalize your experience and helps others know your role in worship
              </p>
            </div>
          </div>

          <div>
            <ImageUpload
              bucketName="album-covers"
              onUploadComplete={handleProfileImageUpload}
              label="Profile Picture"
              currentImageUrl={getProfileImageUrl()}
              maxFileSizeMB={2}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={handleSave} disabled={saving} className="flex-1">
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Profile"}
          </Button>
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileForm;
