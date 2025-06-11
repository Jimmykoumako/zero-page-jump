
-- Add missing columns to Track table for Apple Music-style metadata
ALTER TABLE "Track" 
ADD COLUMN IF NOT EXISTS artist_name TEXT,
ADD COLUMN IF NOT EXISTS album_name TEXT,
ADD COLUMN IF NOT EXISTS release_date DATE,
ADD COLUMN IF NOT EXISTS track_number INTEGER,
ADD COLUMN IF NOT EXISTS disc_number INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS explicit BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS cover_image_url TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Add RLS policies for Track table
ALTER TABLE "Track" ENABLE ROW LEVEL SECURITY;

-- Policy for viewing tracks (public for now, can be restricted later)
CREATE POLICY "Anyone can view tracks" 
  ON "Track" 
  FOR SELECT 
  USING (true);

-- Policy for creating tracks (authenticated users only)
CREATE POLICY "Authenticated users can create tracks" 
  ON "Track" 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- Policy for updating tracks (authenticated users only)
CREATE POLICY "Authenticated users can update tracks" 
  ON "Track" 
  FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

-- Policy for deleting tracks (authenticated users only)
CREATE POLICY "Authenticated users can delete tracks" 
  ON "Track" 
  FOR DELETE 
  USING (auth.uid() IS NOT NULL);

-- Create an index for better performance
CREATE INDEX IF NOT EXISTS idx_track_artist_title ON "Track"(artist_name, title);
CREATE INDEX IF NOT EXISTS idx_track_album ON "Track"(album_name);

-- Add trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_track_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER track_updated_at_trigger
  BEFORE UPDATE ON "Track"
  FOR EACH ROW
  EXECUTE FUNCTION update_track_updated_at();
