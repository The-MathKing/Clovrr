-- Migration: Phase 4 Omnichannel Architecture
-- Updates the leads table to support multi-platform contacts

-- 1. Rename phone_number to contact_id
ALTER TABLE leads RENAME COLUMN phone_number TO contact_id;

-- 2. Add new columns for omnichannel routing and personalization
ALTER TABLE leads 
  ADD COLUMN channel text DEFAULT 'sms',
  ADD COLUMN name text,
  ADD COLUMN context text;

-- 3. Update any existing leads to ensure they are marked as sms
UPDATE leads SET channel = 'sms' WHERE channel IS NULL;
