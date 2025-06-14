
-- Create a table for remote control devices
CREATE TABLE public.remote_devices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  device_code TEXT NOT NULL UNIQUE,
  device_name TEXT NOT NULL,
  user_id UUID REFERENCES auth.users,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for remote devices
ALTER TABLE public.remote_devices ENABLE ROW LEVEL SECURITY;

-- Create policies for remote devices
CREATE POLICY "Users can view their own remote devices" 
  ON public.remote_devices 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own remote devices" 
  ON public.remote_devices 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own remote devices" 
  ON public.remote_devices 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view active remote devices by code" 
  ON public.remote_devices 
  FOR SELECT 
  USING (is_active = true);

-- Create a table for remote control commands
CREATE TABLE public.remote_commands (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  device_code TEXT NOT NULL,
  command_type TEXT NOT NULL,
  command_data JSONB,
  executed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for remote commands
ALTER TABLE public.remote_commands ENABLE ROW LEVEL SECURITY;

-- Create policies for remote commands
CREATE POLICY "Anyone can create remote commands" 
  ON public.remote_commands 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can view commands for their device" 
  ON public.remote_commands 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can update command execution status" 
  ON public.remote_commands 
  FOR UPDATE 
  USING (true);

-- Enable realtime for the tables
ALTER TABLE public.group_sessions REPLICA IDENTITY FULL;
ALTER TABLE public.session_participants REPLICA IDENTITY FULL;
ALTER TABLE public.remote_devices REPLICA IDENTITY FULL;
ALTER TABLE public.remote_commands REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.session_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.remote_devices;
ALTER PUBLICATION supabase_realtime ADD TABLE public.remote_commands;
