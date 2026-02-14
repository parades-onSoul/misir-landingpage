-- Add source column to waitlist table
ALTER TABLE waitlist 
ADD COLUMN IF NOT EXISTS source text;
