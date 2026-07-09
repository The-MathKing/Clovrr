-- ==========================================
-- CLOVRR SOLUTIONS: MVP 1 COMPLETION
-- ==========================================

-- 1. Add Email & Value Tracking to Clients
ALTER TABLE public.clients
ADD COLUMN IF NOT EXISTS sendgrid_api_key TEXT,
ADD COLUMN IF NOT EXISTS sendgrid_from_email TEXT,
ADD COLUMN IF NOT EXISTS avg_policy_value INT DEFAULT 500 NOT NULL;

-- 2. Add Email & Last Inbound to Leads
ALTER TABLE public.leads
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS last_inbound_date TIMESTAMP WITH TIME ZONE;
