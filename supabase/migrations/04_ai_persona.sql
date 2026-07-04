-- Migration: Phase 5 AI Persona
-- Add AI configuration fields to the clients table

DO $$ 
BEGIN
  -- 1. Add system_prompt if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'system_prompt') THEN
    ALTER TABLE clients ADD COLUMN system_prompt text;
  END IF;
  
  -- Set a default prompt for existing users if any
  UPDATE clients SET system_prompt = 'You are a helpful and professional AI receptionist for a small business. Your goal is to answer basic questions and encourage the user to book an appointment using the provided Calendly link.' WHERE system_prompt IS NULL;
END $$;
