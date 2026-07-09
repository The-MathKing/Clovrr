-- ==========================================
-- CLOVRR SOLUTIONS: CRM INTEGRATIONS
-- ==========================================

-- 1. Add GoHighLevel & HubSpot credentials to Clients
ALTER TABLE public.clients
ADD COLUMN IF NOT EXISTS ghl_api_key TEXT,
ADD COLUMN IF NOT EXISTS ghl_location_id TEXT,
ADD COLUMN IF NOT EXISTS hubspot_access_token TEXT;
