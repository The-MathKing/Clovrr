-- Migration: Phase 4 Omnichannel Architecture
-- Updates the leads table to support multi-platform contacts

DO $$ 
BEGIN
  -- 1. Rename phone_number to contact_id if it exists
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'phone_number') THEN
    ALTER TABLE leads RENAME COLUMN phone_number TO contact_id;
  END IF;

  -- 2. Add channel if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'channel') THEN
    ALTER TABLE leads ADD COLUMN channel text DEFAULT 'sms';
  END IF;

  -- 3. Add context if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'context') THEN
    ALTER TABLE leads ADD COLUMN context text;
  END IF;
END $$;

-- 4. Update any existing leads to ensure they are marked as sms
UPDATE leads SET channel = 'sms' WHERE channel IS NULL;
