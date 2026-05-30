-- 1. Add API key columns to the users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS gemini_api_key TEXT,
ADD COLUMN IF NOT EXISTS openai_api_key TEXT,
ADD COLUMN IF NOT EXISTS anthropic_api_key TEXT;

-- 2. Ensure password_hash is nullable (since we now use native Supabase Auth)
ALTER TABLE public.users 
ALTER COLUMN password_hash DROP NOT NULL;

-- 3. Create the draft_batches table to persist drafts history
CREATE TABLE IF NOT EXISTS public.draft_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    drafts TEXT[] NOT NULL,
    provider TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS) on draft_batches
ALTER TABLE public.draft_batches ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies for draft_batches (safely drop if existing)
DROP POLICY IF EXISTS "Users can insert their own draft batches" ON public.draft_batches;
CREATE POLICY "Users can insert their own draft batches" 
ON public.draft_batches 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own draft batches" ON public.draft_batches;
CREATE POLICY "Users can view their own draft batches" 
ON public.draft_batches 
FOR SELECT 
USING (auth.uid() = user_id);

-- 6. Add is_admin flag to the users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- 7. Grant is_admin access to febcheema@gmail.com
UPDATE public.users 
SET is_admin = TRUE 
WHERE email = 'febcheema@gmail.com';


