-- Auth tables (created by Supabase automatically)
-- No need to create auth.users, auth.sessions, etc.

-- Diagnoses table
CREATE TABLE IF NOT EXISTS public.diagnoses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  symptoms TEXT NOT NULL,
  diagnosis_data JSONB NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Shared Reports table
CREATE TABLE IF NOT EXISTS public.shared_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  diagnosis_id UUID NOT NULL REFERENCES public.diagnoses(id) ON DELETE CASCADE,
  share_token TEXT NOT NULL UNIQUE,
  access TEXT NOT NULL DEFAULT 'public',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP + INTERVAL '30 days')
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS diagnoses_user_id_idx ON public.diagnoses(user_id);
CREATE INDEX IF NOT EXISTS diagnoses_created_at_idx ON public.diagnoses(created_at);
CREATE INDEX IF NOT EXISTS shared_reports_share_token_idx ON public.shared_reports(share_token);
CREATE INDEX IF NOT EXISTS shared_reports_diagnosis_id_idx ON public.shared_reports(diagnosis_id);

-- Enable RLS (Row Level Security)
ALTER TABLE public.diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for diagnoses table
CREATE POLICY "Users can view their own diagnoses"
  ON public.diagnoses
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own diagnoses"
  ON public.diagnoses
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own diagnoses"
  ON public.diagnoses
  FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for shared_reports table
CREATE POLICY "Anyone can view shared reports"
  ON public.shared_reports
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create shared reports for their diagnoses"
  ON public.shared_reports
  FOR INSERT
  WITH CHECK (
    diagnosis_id IN (
      SELECT id FROM public.diagnoses WHERE user_id = auth.uid()
    )
  );

-- Demo user (optional)
-- Email: demo@medai.health
-- Password: demo1234
-- Note: Create this in Supabase Dashboard manually or via auth API
