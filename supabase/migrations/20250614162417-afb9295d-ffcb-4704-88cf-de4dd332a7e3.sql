
-- Create test views to help debug permission issues (fixed column naming)
CREATE OR REPLACE VIEW public.test_hymn_lyric_access AS
SELECT 
  'HymnLyric' as table_name,
  id,
  "hymnTitleNumber",
  "bookId",
  "userId",
  CASE 
    WHEN "userId" = auth.uid()::text THEN 'owned_by_current_user'
    ELSE 'owned_by_other_user'
  END as ownership_status,
  auth.uid()::text as current_user_id
FROM public."HymnLyric"
LIMIT 10;

-- Create a view to test auth state
CREATE OR REPLACE VIEW public.test_auth_state AS
SELECT 
  auth.uid() as current_user_id,
  auth.role() as current_role,
  now() as check_time;

-- Create a view to test user roles access
CREATE OR REPLACE VIEW public.test_user_roles_access AS
SELECT 
  'user_roles' as table_name,
  id,
  user_id,
  role,
  CASE 
    WHEN user_id = auth.uid() THEN 'current_user'
    ELSE 'other_user'
  END as user_relation,
  auth.uid() as current_auth_uid
FROM public.user_roles
LIMIT 10;

-- Create a view to test sync projects access
CREATE OR REPLACE VIEW public.test_sync_projects_access AS
SELECT 
  'sync_projects' as table_name,
  id,
  title,
  user_id,
  CASE 
    WHEN user_id = auth.uid() THEN 'owned_by_current_user'
    ELSE 'owned_by_other_user'
  END as ownership_status,
  auth.uid() as current_user_id
FROM public.sync_projects
LIMIT 10;

-- Create a view to test general table permissions
CREATE OR REPLACE VIEW public.test_table_permissions AS
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled,
  CASE 
    WHEN rowsecurity THEN 'RLS_ENABLED'
    ELSE 'RLS_DISABLED'
  END as security_status
FROM pg_tables 
WHERE schemaname = 'public'
  AND tablename IN ('HymnLyric', 'sync_projects', 'user_roles', 'HymnTitle', 'HymnBook')
ORDER BY tablename;

-- Create a comprehensive test view for debugging
CREATE OR REPLACE VIEW public.debug_permissions AS
SELECT 
  'Current User Info' as test_category,
  auth.uid()::text as user_id,
  auth.role() as role,
  null::text as table_name,
  null::bigint as record_count,
  'Check if user is authenticated' as description
UNION ALL
SELECT 
  'HymnLyric Access',
  auth.uid()::text,
  auth.role(),
  'HymnLyric',
  (SELECT COUNT(*) FROM public."HymnLyric")::bigint,
  'Total records accessible in HymnLyric table'
UNION ALL
SELECT 
  'User Roles Access',
  auth.uid()::text,
  auth.role(),
  'user_roles',
  (SELECT COUNT(*) FROM public.user_roles)::bigint,
  'Total records accessible in user_roles table'
UNION ALL
SELECT 
  'Sync Projects Access',
  auth.uid()::text,
  auth.role(),
  'sync_projects',
  (SELECT COUNT(*) FROM public.sync_projects)::bigint,
  'Total records accessible in sync_projects table';

-- Grant access to these test views for authenticated users
GRANT SELECT ON public.test_hymn_lyric_access TO authenticated;
GRANT SELECT ON public.test_auth_state TO authenticated;
GRANT SELECT ON public.test_user_roles_access TO authenticated;
GRANT SELECT ON public.test_sync_projects_access TO authenticated;
GRANT SELECT ON public.test_table_permissions TO authenticated;
GRANT SELECT ON public.debug_permissions TO authenticated;

-- Also grant to anon role for testing unauthenticated access
GRANT SELECT ON public.test_table_permissions TO anon;
GRANT SELECT ON public.test_auth_state TO anon;
