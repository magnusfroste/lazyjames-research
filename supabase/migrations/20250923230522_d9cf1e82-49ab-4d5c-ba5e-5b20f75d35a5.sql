-- Add unique constraints for proper upsert functionality and update RLS policies for demo
ALTER TABLE public.lab_company_profiles ADD CONSTRAINT unique_company_profile_per_user UNIQUE (user_id);
ALTER TABLE public.lab_user_profiles ADD CONSTRAINT unique_user_profile_per_user UNIQUE (user_id);

-- Update RLS policies to allow demo usage with dummy user ID
DROP POLICY IF EXISTS "Users can manage their own company profiles" ON public.lab_company_profiles;
DROP POLICY IF EXISTS "Users can manage their own user profiles" ON public.lab_user_profiles;
DROP POLICY IF EXISTS "Users can manage their own research" ON public.lab_prospect_research;

-- Create demo-friendly policies that allow operations with dummy user ID
CREATE POLICY "Allow demo operations on company profiles" 
ON public.lab_company_profiles 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow demo operations on user profiles" 
ON public.lab_user_profiles 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow demo operations on research" 
ON public.lab_prospect_research 
FOR ALL 
USING (true) 
WITH CHECK (true);