-- Add RLS policies for authenticated users to read and update their own client data
CREATE POLICY "Users can view their own client data" 
ON public.clients 
FOR SELECT 
USING (auth.jwt()->>'email' = email);

CREATE POLICY "Users can update their own client data" 
ON public.clients 
FOR UPDATE 
USING (auth.jwt()->>'email' = email);

-- Allow authenticated users to insert their own client record on signup
CREATE POLICY "Users can insert their own client data" 
ON public.clients 
FOR INSERT 
WITH CHECK (auth.jwt()->>'email' = email);
