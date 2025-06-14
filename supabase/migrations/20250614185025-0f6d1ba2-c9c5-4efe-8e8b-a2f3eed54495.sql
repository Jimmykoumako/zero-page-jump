
-- Create enhanced audio tracks table
CREATE TABLE public.audio_tracks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  hymn_number TEXT NOT NULL,
  hymn_title TEXT NOT NULL,
  book_id INTEGER DEFAULT 1,
  title TEXT NOT NULL,
  artist_name TEXT,
  album_name TEXT,
  duration INTEGER, -- in seconds
  file_path TEXT NOT NULL, -- path in storage bucket
  file_size BIGINT,
  mime_type TEXT,
  audio_type TEXT DEFAULT 'instrumental', -- 'instrumental', 'vocal', 'accompaniment', 'full'
  tempo INTEGER, -- BPM
  key_signature TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_public BOOLEAN DEFAULT false,
  upload_status TEXT DEFAULT 'processing' -- 'processing', 'ready', 'error'
);

-- Enable RLS on audio_tracks
ALTER TABLE public.audio_tracks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for audio_tracks
CREATE POLICY "Users can view public tracks and own tracks" 
  ON public.audio_tracks 
  FOR SELECT 
  USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can create their own tracks" 
  ON public.audio_tracks 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tracks" 
  ON public.audio_tracks 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tracks" 
  ON public.audio_tracks 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create audio playlists table
CREATE TABLE public.audio_playlists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on audio_playlists
ALTER TABLE public.audio_playlists ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for audio_playlists
CREATE POLICY "Users can view public playlists and own playlists" 
  ON public.audio_playlists 
  FOR SELECT 
  USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can create their own playlists" 
  ON public.audio_playlists 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own playlists" 
  ON public.audio_playlists 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own playlists" 
  ON public.audio_playlists 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create playlist tracks junction table
CREATE TABLE public.playlist_tracks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  playlist_id UUID REFERENCES public.audio_playlists(id) ON DELETE CASCADE NOT NULL,
  track_id UUID REFERENCES public.audio_tracks(id) ON DELETE CASCADE NOT NULL,
  position INTEGER NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(playlist_id, track_id),
  UNIQUE(playlist_id, position)
);

-- Enable RLS on playlist_tracks
ALTER TABLE public.playlist_tracks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for playlist_tracks
CREATE POLICY "Users can view tracks in accessible playlists" 
  ON public.playlist_tracks 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.audio_playlists 
      WHERE id = playlist_id 
      AND (is_public = true OR user_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage tracks in their own playlists" 
  ON public.playlist_tracks 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.audio_playlists 
      WHERE id = playlist_id 
      AND user_id = auth.uid()
    )
  );

-- Create function to update audio track updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_audio_track_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for audio tracks
CREATE TRIGGER update_audio_tracks_updated_at
  BEFORE UPDATE ON public.audio_tracks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_audio_track_updated_at();

-- Create trigger for audio playlists
CREATE TRIGGER update_audio_playlists_updated_at
  BEFORE UPDATE ON public.audio_playlists
  FOR EACH ROW
  EXECUTE FUNCTION public.update_audio_track_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_audio_tracks_hymn_number ON public.audio_tracks(hymn_number);
CREATE INDEX idx_audio_tracks_user_id ON public.audio_tracks(user_id);
CREATE INDEX idx_audio_tracks_is_public ON public.audio_tracks(is_public);
CREATE INDEX idx_audio_playlists_user_id ON public.audio_playlists(user_id);
CREATE INDEX idx_playlist_tracks_playlist_id ON public.playlist_tracks(playlist_id);
CREATE INDEX idx_playlist_tracks_position ON public.playlist_tracks(playlist_id, position);

-- Add storage policies for the existing audio_files bucket if they don't exist
-- Fixed the type casting issues
DO $$
BEGIN
  -- Check if policies exist before creating them
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Audio files public access'
  ) THEN
    CREATE POLICY "Audio files public access" ON storage.objects 
    FOR SELECT USING (bucket_id = 'audio_files');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Audio files authenticated upload'
  ) THEN
    CREATE POLICY "Audio files authenticated upload" ON storage.objects 
    FOR INSERT WITH CHECK (bucket_id = 'audio_files' AND auth.role() = 'authenticated');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Audio files owner update'
  ) THEN
    CREATE POLICY "Audio files owner update" ON storage.objects 
    FOR UPDATE USING (bucket_id = 'audio_files' AND (storage.foldername(name))[1] = auth.uid()::text);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Audio files owner delete'
  ) THEN
    CREATE POLICY "Audio files owner delete" ON storage.objects 
    FOR DELETE USING (bucket_id = 'audio_files' AND (storage.foldername(name))[1] = auth.uid()::text);
  END IF;
END $$;
