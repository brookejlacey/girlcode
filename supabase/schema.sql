-- Run this in your Supabase SQL editor to create the intake submissions table

CREATE TABLE intake_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  role TEXT,
  service_type TEXT NOT NULL,
  description TEXT NOT NULL,
  budget TEXT NOT NULL,
  timeline TEXT,
  referral_source TEXT,
  status TEXT DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE intake_submissions ENABLE ROW LEVEL SECURITY;

-- Allow inserts from anon key (for the form)
CREATE POLICY "Allow anonymous inserts" ON intake_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Only authenticated users can read (for your dashboard)
CREATE POLICY "Allow authenticated reads" ON intake_submissions
  FOR SELECT
  TO authenticated
  USING (true);
