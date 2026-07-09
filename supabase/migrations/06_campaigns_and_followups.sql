-- ==========================================
-- CLOVRR SOLUTIONS: CAMPAIGNS & FOLLOW-UPS
-- ==========================================

-- 1. Campaigns Table (For Reactivation Blasts)
CREATE TABLE public.campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    initial_message TEXT NOT NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Add Tracking Columns to Leads
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS last_contacted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_replied_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS followup_count INT DEFAULT 0 NOT NULL;

-- 3. RLS for Campaigns
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role has full access to campaigns" ON public.campaigns USING (true);
