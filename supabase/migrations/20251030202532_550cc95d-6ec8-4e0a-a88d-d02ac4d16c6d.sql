-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'uploader', 'proofreader', 'curator', 'reviewer', 'contributor', 'viewer');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Create sync_projects table
CREATE TABLE public.sync_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  hymn_id UUID REFERENCES public.hymns(id) ON DELETE SET NULL,
  track_id UUID,
  sync_data JSONB,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on sync_projects
ALTER TABLE public.sync_projects ENABLE ROW LEVEL SECURITY;

-- RLS policies for sync_projects
CREATE POLICY "Users can view their own sync projects"
ON public.sync_projects
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sync projects"
ON public.sync_projects
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sync projects"
ON public.sync_projects
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sync projects"
ON public.sync_projects
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for updating updated_at on sync_projects
CREATE TRIGGER update_sync_projects_updated_at
BEFORE UPDATE ON public.sync_projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();