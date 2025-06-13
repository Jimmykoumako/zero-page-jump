import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// Placeholder for Supabase client import - adjust path as per your project structure
import { supabase } from '@/integrations/supabase/client'; // Adjust path as needed - UNCOMMENT AND VERIFY
import { toast } from 'sonner';

// Assuming User interface is similar to the one in AuthenticatedLanding
// If it's defined globally or in a types file, import it from there.
interface User {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  pseudoName?: string | null;
  name?: string | null; // Could be a display name or concatenation
  profilePicture?: string | null; // URL for avatar
  image?: string | null; // Another image URL, e.g., cover photo
  bio?: string | null;
  role?: "ADMIN" | "UPLOADER" | "PROOFREADER" | "CURATOR" | "REVIEWER" | "CONTRIBUTOR" | "VIEWER";
  status?: "ACTIVE" | "INACTIVE" | "PENDING" | "SUSPENDED" | "DELETED";
  createdAt?: string; // Timestamps are often strings from APIs
  updatedAt?: string;
  lastLogin?: string;
}

// Fetches the current user's data from Supabase
const getCurrentUser = async (setIsLoading: (isLoading: boolean) => void): Promise<User | null> => {
  setIsLoading(true);
  try {
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error('Error fetching authenticated user:', authError);
      return null;
    }
    if (!authUser) {
      console.log('No authenticated user found.');
      return null;
    }

    const userIdAsText = authUser.id;

    console.log(`Fetching profile for user ID (text): ${userIdAsText}`);
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userIdAsText)
      .single();

    if (profileError) {
      console.error('Error fetching user profile from public.users:', profileError);
      return { id: userIdAsText, email: authUser.email } as User;
    }

    if (!userProfile) {
      console.warn(`Profile not found in public.users for ID: ${userIdAsText}. This might happen if the backfill/trigger hasn't run or failed.`);
      return { id: userIdAsText, email: authUser.email } as User;
    }
    
    console.log('User profile fetched:', userProfile);
    return userProfile as User;

  } catch (error) {
    console.error('Unexpected error in getCurrentUser:', error);
    return null;
  } finally {
    setIsLoading(false);
  }
};

const updateCurrentUser = async (userData: Partial<User>): Promise<User | null> => {
  console.log('Attempting to update user with:', userData);
  try {
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    if (authError || !authUser) {
      console.error('Error fetching authenticated user or no user found:', authError);
      toast.error('You must be logged in to update your profile.');
      return null;
    }

    const userIdAsText = authUser.id;

    // Prepare the data for update. 
    // We explicitly pick the fields we want to update from userData.
    const updatePayload: Partial<User> = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      pseudoName: userData.pseudoName,
      bio: userData.bio,
      // Only include profilePicture if it's explicitly passed in userData 
      // (which means it was either newly uploaded or confirmed existing)
      ...(userData.profilePicture !== undefined && { profilePicture: userData.profilePicture }),
    };

    // Remove undefined fields from payload to avoid sending them to Supabase if they weren't changed
    Object.keys(updatePayload).forEach(key => updatePayload[key as keyof typeof updatePayload] === undefined && delete updatePayload[key as keyof typeof updatePayload]);

    console.log(`Updating profile for user ID (text): ${userIdAsText} with payload:`, updatePayload);

    const { data: updatedUserProfile, error: updateError } = await supabase
      .from('users') // Your table name
      .update(updatePayload)
      .eq('id', userIdAsText)
      .select()
      .single(); // Use single() if you expect one row to be updated and returned

    if (updateError) {
      console.error('Error updating user profile:', updateError);
      toast.error(`Error updating profile: ${updateError.message}`);
      return null;
    }

    console.log('User profile updated successfully:', updatedUserProfile);
    toast.success('Profile updated successfully!');
    return updatedUserProfile as User;

  } catch (error) {
    console.error('Unexpected error in updateCurrentUser:', error);
    alert('An unexpected error occurred. Please try again.');
    return null;
  }
};

const AccountPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // This state will be managed by useEffect and getCurrentUser
  const [formData, setFormData] = useState<Partial<User>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadUser = async () => {
      // getCurrentUser now handles setIsLoading internally
      const fetchedUser = await getCurrentUser(setIsLoading);
      setUser(fetchedUser);
      if (fetchedUser) {
        // Initialize formData with fetched user data
        setFormData({
          firstName: fetchedUser.firstName || '',
          lastName: fetchedUser.lastName || '',
          pseudoName: fetchedUser.pseudoName || '',
          bio: fetchedUser.bio || '',
          profilePicture: fetchedUser.profilePicture || '',
        });
        if (fetchedUser.profilePicture) {
          setPreviewUrl(fetchedUser.profilePicture);
        }
      }
      // getCurrentUser now handles setIsLoading(false) in its finally block
    };
    loadUser();
  }, []); // Empty dependency array means this runs once on mount

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditToggle = () => {
    if (isEditing && user) {
      // Reset form data to current user state if cancelling
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        pseudoName: user.pseudoName || '',
        bio: user.bio || '',
        profilePicture: user.profilePicture || '',
      });
    }
    setIsEditing(!isEditing);
    // Clear file selection when toggling edit mode if no upload happened
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    let uploadedProfilePictureUrl = formData.profilePicture; // Default to existing or null from formData

    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    if (authError || !authUser) {
      console.error('User not authenticated for profile update/upload:', authError);
      toast.error('You must be logged in to update your profile.');
      setIsLoading(false);
      return;
    }
    const userId = authUser.id;

    if (selectedFile) {
      console.log('Uploading file:', selectedFile.name);
      const fileExt = selectedFile.name.split('.').pop();
      const uniqueFileName = `${Date.now()}.${fileExt}`;
      const filePath = `public/${userId}/${uniqueFileName}`; // User-specific folder

      try {
        // 1. Upload the file
        const { error: uploadError } = await supabase.storage
          .from('avatars') // Your bucket name
          .upload(filePath, selectedFile, {
            cacheControl: '3600',
            upsert: false, // false: error if file exists, true: overwrite. uniqueFileName makes this safer.
          });

        if (uploadError) {
          console.error('Error uploading profile picture:', uploadError);
          toast.error(`Error uploading image: ${uploadError.message}`);
          setIsLoading(false);
          return;
        }

        // 2. Get the public URL of the uploaded file
        const { data: publicUrlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        if (!publicUrlData || !publicUrlData.publicUrl) {
          console.error('Image uploaded, but could not retrieve its public URL.');
          toast.warning('Image uploaded, but its URL could not be retrieved. Profile picture may not update immediately.');
          // uploadedProfilePictureUrl will remain as the old one or null, or you could try to construct it if your bucket is public
        } else {
          uploadedProfilePictureUrl = publicUrlData.publicUrl;
          console.log('File uploaded successfully. Public URL:', uploadedProfilePictureUrl);
        }

      } catch (error) {
        console.error('Unexpected error during file upload:', error);
        toast.error('An unexpected error occurred during file upload. Please try again.');
        setIsLoading(false);
        return;
      }
    }

    // Prepare all data to be updated, including the new profile picture URL
    const dataToUpdateWithPicture: Partial<User> = {
      ...formData,
      profilePicture: uploadedProfilePictureUrl,
    };

    const updatedUser = await updateCurrentUser(dataToUpdateWithPicture);

    if (updatedUser) {
      setUser(updatedUser);
      setFormData({
        firstName: updatedUser.firstName || '',
        lastName: updatedUser.lastName || '',
        pseudoName: updatedUser.pseudoName || '',
        bio: updatedUser.bio || '',
        profilePicture: updatedUser.profilePicture || '',
      });
      if (updatedUser.profilePicture) {
        setPreviewUrl(updatedUser.profilePicture);
      }
      setSelectedFile(null); // Clear selected file input
      toast.success('Profile updated successfully!');
    }
    setIsEditing(false);
    setIsLoading(false);
  };

  if (isLoading && !user) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading account details...</div>;
  }

  if (!user) {
    return <div className="container mx-auto px-4 py-12 text-center">Could not load user information. Please try again.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="shadow-xl overflow-hidden">
          <CardHeader className="bg-gray-50 border-b">
            <div className="flex items-center space-x-4">
              {/* Placeholder for Avatar - to be implemented */}
              <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-2xl text-white font-semibold">
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
                ) : (
                  <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-2xl text-white font-semibold">
                    {user.firstName?.[0] || ''}{user.lastName?.[0] || ''}
                  </div>
                )}
              </div>
              <div>
                <CardTitle className="text-3xl font-bold text-gray-800">
                  {isEditing ? 'Edit Profile' : 'My Account'}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {isEditing ? 'Update your personal details below.' : 'View and manage your account details.'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            {!isEditing ? (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="firstNameDisplay" className="text-sm font-medium text-gray-500">First Name</Label>
                  <p id="firstNameDisplay" className="text-lg text-gray-800 mt-1">{user.firstName || 'Not set'}</p>
                </div>
                <div>
                  <Label htmlFor="lastNameDisplay" className="text-sm font-medium text-gray-500">Last Name</Label>
                  <p id="lastNameDisplay" className="text-lg text-gray-800 mt-1">{user.lastName || 'Not set'}</p>
                </div>
                <div>
                  <Label htmlFor="emailDisplay" className="text-sm font-medium text-gray-500">Email Address</Label>
                  <p id="emailDisplay" className="text-lg text-gray-800 mt-1">{user.email}</p>
                </div>
                <div>
                  <Label htmlFor="pseudoNameDisplay" className="text-sm font-medium text-gray-500">Display Name</Label>
                  <p id="pseudoNameDisplay" className="text-lg text-gray-800 mt-1">{user.pseudoName || 'Not set'}</p>
                </div>
                <div>
                  <Label htmlFor="bioDisplay" className="text-sm font-medium text-gray-500">Bio</Label>
                  <p id="bioDisplay" className="text-lg text-gray-800 mt-1 whitespace-pre-wrap">{user.bio || 'No bio set.'}</p>
                </div>
                {user.profilePicture && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Current Profile Picture</Label>
                    <img src={user.profilePicture} alt="Current Avatar" className="mt-1 w-24 h-24 rounded-md object-cover"/>
                  </div>
                )}
                <div className="pt-4">
                  <Button onClick={handleEditToggle} className="w-full md:w-auto" disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Edit Profile'}
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName" className="font-medium">First Name</Label>
                    <Input 
                      id="firstName" 
                      name="firstName" 
                      type="text" 
                      value={formData.firstName || ''} 
                      onChange={handleInputChange} 
                      className="mt-1" 
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="font-medium">Last Name</Label>
                    <Input 
                      id="lastName" 
                      name="lastName" 
                      type="text" 
                      value={formData.lastName || ''} 
                      onChange={handleInputChange} 
                      className="mt-1" 
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="pseudoName" className="font-medium">Display Name (Pseudo)</Label>
                  <Input 
                    id="pseudoName" 
                    name="pseudoName" 
                    type="text" 
                    value={formData.pseudoName || ''} 
                    onChange={handleInputChange} 
                    className="mt-1" 
                    placeholder="Enter your display name"
                  />
                </div>
                <div>
                  <Label htmlFor="bio" className="font-medium">Bio</Label>
                  <textarea 
                    id="bio" 
                    name="bio" 
                    rows={3}
                    value={formData.bio || ''} 
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))} 
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    placeholder="Tell us a little about yourself"
                  />
                </div>
                <div>
                  <Label htmlFor="profilePicture" className="font-medium">Profile Picture URL</Label>
                  <Input 
                    id="profilePicture" 
                    name="profilePicture" 
                    type="text" 
                    value={formData.profilePicture || ''} 
                    onChange={handleInputChange} 
                    className="mt-1" 
                    placeholder="https://example.com/your-image.png"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter the URL of your profile picture. Upload functionality coming soon!</p>
                </div>
                
                <div>
                  <Label htmlFor="email" className="font-medium">Email Address</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={user.email} 
                    disabled 
                    className="mt-1 bg-gray-100 cursor-not-allowed" 
                  />
                  <p className="text-xs text-gray-500 mt-1">Email address cannot be changed here.</p>
                </div>
                
                {/* Profile Picture Upload Section */}
                <div>
                  <Label htmlFor="profilePictureFile" className="font-medium">Change Profile Picture</Label>
                  <div className="mt-1 flex items-center gap-4">
                    {previewUrl ? (
                      <img src={previewUrl} alt="New profile preview" className="w-20 h-20 rounded-full object-cover" />
                    ) : user.profilePicture ? (
                      <img src={user.profilePicture} alt="Current profile" className="w-20 h-20 rounded-full object-cover" />
                    ) : (
                      <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-lg text-white font-semibold">
                        {formData.firstName?.[0] || ''}{formData.lastName?.[0] || ''}
                      </div>
                    )}
                    <input 
                      type="file" 
                      id="profilePictureFile" 
                      name="profilePictureFile"
                      accept="image/png, image/jpeg, image/gif"
                      ref={fileInputRef}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          setSelectedFile(file);
                          setPreviewUrl(URL.createObjectURL(file));
                          // Optionally, immediately update formData.profilePicture if you intend to save this preview URL
                          // or wait for an explicit upload action.
                        }
                      }}
                      className="hidden"
                    />
                    <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                      Choose Image
                    </Button>
                    {previewUrl && (
                       <Button type="button" variant="ghost" size="sm" onClick={() => { setSelectedFile(null); setPreviewUrl(null); if(fileInputRef.current) fileInputRef.current.value = ''; }}>
                         Clear
                       </Button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Select a new image to upload (PNG, JPG, GIF).</p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 pt-6">
                  <Button type="submit" className="w-full md:w-auto" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleEditToggle} className="w-full md:w-auto" disabled={isLoading}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountPage;
