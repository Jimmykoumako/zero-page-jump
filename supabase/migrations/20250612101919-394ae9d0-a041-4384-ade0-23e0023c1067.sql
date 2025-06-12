
-- Add missing columns to lyric_sync_data table
ALTER TABLE lyric_sync_data 
ADD COLUMN sync_type text NOT NULL DEFAULT 'line',
ADD COLUMN syllable_index integer,
ADD COLUMN word_index integer;

-- Add check constraint for sync_type values
ALTER TABLE lyric_sync_data 
ADD CONSTRAINT check_sync_type 
CHECK (sync_type IN ('verse', 'line', 'group', 'syllable', 'word'));
