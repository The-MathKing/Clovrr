-- Add tier and is_admin to clients table
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'Free';
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Ensure all existing clients are set to Free (resets everyone)
UPDATE public.clients SET tier = 'Free';

-- Elevate specific email to admin
UPDATE public.clients SET is_admin = true WHERE email = 'aryan.r.padarthi@gmail.com';
