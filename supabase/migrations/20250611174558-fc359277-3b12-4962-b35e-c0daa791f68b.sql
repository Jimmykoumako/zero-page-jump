
-- Create a table for sync projects
CREATE TABLE public.sync_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  hymn_id TEXT,
  track_id TEXT REFERENCES public."Track"(id),
  sync_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for lyric sync timing data
CREATE TABLE public.lyric_sync_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sync_project_id UUID REFERENCES public.sync_projects(id) ON DELETE CASCADE NOT NULL,
  line_index INTEGER NOT NULL,
  verse_index INTEGER NOT NULL,
  start_time DECIMAL NOT NULL,
  end_time DECIMAL NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.sync_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lyric_sync_data ENABLE ROW LEVEL SECURITY;

-- Create policies for sync_projects
CREATE POLICY "Users can view their own sync projects" 
  ON public.sync_projects 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sync projects" 
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

-- Create policies for lyric_sync_data
CREATE POLICY "Users can view sync data for their projects" 
  ON public.lyric_sync_data 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.sync_projects 
    WHERE id = sync_project_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can create sync data for their projects" 
  ON public.lyric_sync_data 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.sync_projects 
    WHERE id = sync_project_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can update sync data for their projects" 
  ON public.lyric_sync_data 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.sync_projects 
    WHERE id = sync_project_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can delete sync data for their projects" 
  ON public.lyric_sync_data 
  FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.sync_projects 
    WHERE id = sync_project_id AND user_id = auth.uid()
  ));

-- Create indexes for better performance
CREATE INDEX idx_sync_projects_user_id ON public.sync_projects(user_id);
CREATE INDEX idx_lyric_sync_data_project_id ON public.lyric_sync_data(sync_project_id);
CREATE INDEX idx_lyric_sync_data_timing ON public.lyric_sync_data(start_time, end_time);
