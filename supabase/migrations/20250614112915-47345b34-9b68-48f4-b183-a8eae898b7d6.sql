
-- Create enhanced sync project tables for lyric synchronization
CREATE TABLE IF NOT EXISTS public.lyric_sync_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  hymn_id TEXT,
  track_id TEXT REFERENCES public."Track"(id),
  sync_data JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for detailed sync points
CREATE TABLE IF NOT EXISTS public.sync_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.lyric_sync_projects(id) ON DELETE CASCADE NOT NULL,
  timestamp NUMERIC NOT NULL,
  text TEXT NOT NULL,
  verse_index INTEGER,
  line_index INTEGER,
  word_index INTEGER,
  syllable_index INTEGER,
  sync_type TEXT DEFAULT 'line' CHECK (sync_type IN ('verse', 'line', 'word', 'syllable')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create enhanced group sessions table for live projection
CREATE TABLE IF NOT EXISTS public.projection_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  leader_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  current_hymn_id TEXT,
  current_verse INTEGER DEFAULT 0,
  font_size INTEGER DEFAULT 6,
  background_color TEXT DEFAULT '#1e293b',
  text_color TEXT DEFAULT '#ffffff',
  is_active BOOLEAN DEFAULT true,
  is_live BOOLEAN DEFAULT false,
  password_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for session participants with enhanced features
CREATE TABLE IF NOT EXISTS public.projection_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.projection_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  device_name TEXT,
  device_type TEXT DEFAULT 'web',
  is_co_presenter BOOLEAN DEFAULT false,
  permissions JSONB DEFAULT '{"canControl": false, "canChangeHymns": false}'::jsonb,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT now(),
  connection_status TEXT DEFAULT 'connected'
);

-- Create table for session activity logs
CREATE TABLE IF NOT EXISTS public.projection_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.projection_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  action_data JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for projection templates
CREATE TABLE IF NOT EXISTS public.projection_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  template_data JSONB NOT NULL,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for hymn queue management
CREATE TABLE IF NOT EXISTS public.hymn_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.projection_sessions(id) ON DELETE CASCADE NOT NULL,
  hymn_id TEXT NOT NULL,
  position INTEGER NOT NULL,
  added_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for security
ALTER TABLE public.lyric_sync_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projection_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projection_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projection_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projection_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hymn_queue ENABLE ROW LEVEL SECURITY;

-- RLS policies for lyric_sync_projects
CREATE POLICY "Users can manage their own sync projects" ON public.lyric_sync_projects
  FOR ALL USING (auth.uid() = user_id);

-- RLS policies for sync_points
CREATE POLICY "Users can manage sync points of their projects" ON public.sync_points
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.lyric_sync_projects 
      WHERE id = sync_points.project_id AND user_id = auth.uid()
    )
  );

-- RLS policies for projection_sessions
CREATE POLICY "Users can manage their own projection sessions" ON public.projection_sessions
  FOR ALL USING (auth.uid() = leader_id);

CREATE POLICY "Participants can view projection sessions" ON public.projection_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projection_participants 
      WHERE session_id = projection_sessions.id AND user_id = auth.uid()
    )
  );

-- RLS policies for projection_participants
CREATE POLICY "Session leaders can manage participants" ON public.projection_participants
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.projection_sessions 
      WHERE id = projection_participants.session_id AND leader_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own participation" ON public.projection_participants
  FOR SELECT USING (auth.uid() = user_id);

-- RLS policies for projection_activity_logs
CREATE POLICY "Session participants can view activity logs" ON public.projection_activity_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projection_participants 
      WHERE session_id = projection_activity_logs.session_id AND user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.projection_sessions 
      WHERE id = projection_activity_logs.session_id AND leader_id = auth.uid()
    )
  );

-- RLS policies for projection_templates
CREATE POLICY "Users can manage their own templates" ON public.projection_templates
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view public templates" ON public.projection_templates
  FOR SELECT USING (is_public = true OR auth.uid() = user_id);

-- RLS policies for hymn_queue
CREATE POLICY "Session participants can manage hymn queue" ON public.hymn_queue
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.projection_participants 
      WHERE session_id = hymn_queue.session_id AND user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.projection_sessions 
      WHERE id = hymn_queue.session_id AND leader_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lyric_sync_projects_user_id ON public.lyric_sync_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_sync_points_project_id ON public.sync_points(project_id);
CREATE INDEX IF NOT EXISTS idx_projection_sessions_leader_id ON public.projection_sessions(leader_id);
CREATE INDEX IF NOT EXISTS idx_projection_participants_session_id ON public.projection_participants(session_id);
CREATE INDEX IF NOT EXISTS idx_projection_activity_logs_session_id ON public.projection_activity_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_hymn_queue_session_id ON public.hymn_queue(session_id);

-- Create triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_lyric_sync_projects_updated_at BEFORE UPDATE
    ON public.lyric_sync_projects FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_projection_sessions_updated_at BEFORE UPDATE
    ON public.projection_sessions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_projection_templates_updated_at BEFORE UPDATE
    ON public.projection_templates FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Update participant last_seen trigger
CREATE OR REPLACE FUNCTION update_participant_last_seen()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_seen = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projection_participants_last_seen BEFORE UPDATE
    ON public.projection_participants FOR EACH ROW EXECUTE PROCEDURE update_participant_last_seen();
