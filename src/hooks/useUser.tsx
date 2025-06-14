
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/user';

interface UseUserReturn {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useUser = (): UseUserReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        throw authError;
      }

      if (authUser) {
        // Fetch additional user data from users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (userError && userError.code !== 'PGRST116') {
          console.error('Error fetching user data:', userError);
        }

        const combinedUser: User = {
          id: authUser.id,
          email: authUser.email || '',
          firstName: userData?.firstName || authUser.user_metadata?.firstName || '',
          lastName: userData?.lastName || authUser.user_metadata?.lastName || '',
          name: userData?.name || authUser.user_metadata?.name || '',
          role: userData?.role || 'VIEWER',
          status: userData?.status || 'ACTIVE',
          avatar: userData?.image || userData?.profilePicture || authUser.user_metadata?.avatar || '',
          profilePicture: userData?.profilePicture || userData?.image || authUser.user_metadata?.avatar || '',
          createdAt: userData?.createdAt || authUser.created_at || '',
          updatedAt: userData?.updatedAt || '',
          preferences: userData?.preferences || {},
          subscription: userData?.subscription || null,
          isVerified: authUser.email_confirmed_at ? true : false,
          lastLogin: authUser.last_sign_in_at || '',
        };

        setUser(combinedUser);
      } else {
        setUser(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = async () => {
    await fetchUser();
  };

  useEffect(() => {
    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          fetchUser();
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { user, isLoading, error, refetch };
};
