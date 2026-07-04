-- ==========================================
-- CLOVRR SOLUTIONS: INITIAL SCHEMA
-- ==========================================

-- 1. Clients Table (The Agency Owners)
CREATE TABLE public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    stripe_customer_id TEXT UNIQUE,
    stripe_subscription_id TEXT,
    twilio_number TEXT UNIQUE, -- The Twilio number assigned to them
    calendly_link TEXT, -- Their booking link the bot will hand out
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Leads Table (The people texting the Twilio number)
CREATE TABLE public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    name TEXT, -- Might be null initially until bot asks
    phone_number TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'qualified', 'booked', 'disqualified')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(client_id, phone_number) -- A lead is unique per client by phone number
);

-- 3. Conversations Table (The memory for the LLM)
CREATE TABLE public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('system', 'user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Setup Row Level Security (RLS) - Secure by default
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Create policies for service role to bypass RLS (since we use service_role in API routes)
-- Client-side doesn't need direct DB access for this architecture.
CREATE POLICY "Service role has full access to clients" ON public.clients USING (true);
CREATE POLICY "Service role has full access to leads" ON public.leads USING (true);
CREATE POLICY "Service role has full access to conversations" ON public.conversations USING (true);
