
-- Add bucket_name column to Track table to specify which bucket the audio file is stored in
ALTER TABLE "Track" ADD COLUMN bucket_name TEXT DEFAULT 'audio_files';

-- Add bucket_name column to AudioFile table 
ALTER TABLE "AudioFile" ADD COLUMN bucket_name TEXT DEFAULT 'audio_files';

-- Add bucket_name column to uploads table
ALTER TABLE uploads ADD COLUMN bucket_name TEXT DEFAULT 'uploads';

-- Add image_bucket_name column to Track table for cover images
ALTER TABLE "Track" ADD COLUMN image_bucket_name TEXT DEFAULT 'album-covers';

-- Update existing records to have proper bucket names
UPDATE "Track" SET bucket_name = 'audio_files' WHERE bucket_name IS NULL;
UPDATE "AudioFile" SET bucket_name = 'audio_files' WHERE bucket_name IS NULL;
UPDATE uploads SET bucket_name = 'uploads' WHERE bucket_name IS NULL;
UPDATE "Track" SET image_bucket_name = 'album-covers' WHERE image_bucket_name IS NULL AND cover_image_url IS NOT NULL;

-- Add bucket_name column to Album table for cover images
ALTER TABLE "Album" ADD COLUMN cover_image_bucket TEXT DEFAULT 'album-covers';
UPDATE "Album" SET cover_image_bucket = 'album-covers' WHERE cover_image_bucket IS NULL AND "coverImage" IS NOT NULL;

-- Create a helper function to get full storage URLs
CREATE OR REPLACE FUNCTION public.get_storage_url(bucket_name TEXT, file_path TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  IF file_path IS NULL OR file_path = '' THEN
    RETURN NULL;
  END IF;
  
  -- Return the full public URL for the file
  RETURN 'https://sqnvnolccwghpqrcezwf.supabase.co/storage/v1/object/public/' || bucket_name || '/' || file_path;
END;
$$;
