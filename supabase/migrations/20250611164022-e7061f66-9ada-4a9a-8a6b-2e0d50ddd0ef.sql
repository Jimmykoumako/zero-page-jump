
-- Create listening_history table to track user's hymn listening activity
CREATE TABLE public.listening_history (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  hymn_id text NOT NULL,
  hymn_title text NOT NULL,
  artist_name text,
  album_name text,
  hymn_number text,
  book_id integer,
  duration integer,
  played_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.listening_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for listening_history
CREATE POLICY "Users can view their own listening history" 
  ON public.listening_history 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own listening history" 
  ON public.listening_history 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own listening history" 
  ON public.listening_history 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own listening history" 
  ON public.listening_history 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create index for performance
CREATE INDEX idx_listening_history_user_played_at ON public.listening_history(user_id, played_at DESC);
CREATE INDEX idx_listening_history_hymn_id ON public.listening_history(hymn_id);
