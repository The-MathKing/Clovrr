DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='clients' AND column_name='twilio_account_sid') THEN 
    ALTER TABLE public.clients ADD COLUMN twilio_account_sid text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='clients' AND column_name='twilio_auth_token') THEN 
    ALTER TABLE public.clients ADD COLUMN twilio_auth_token text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='clients' AND column_name='sendgrid_api_key') THEN 
    ALTER TABLE public.clients ADD COLUMN sendgrid_api_key text;
  END IF;
END $$;
