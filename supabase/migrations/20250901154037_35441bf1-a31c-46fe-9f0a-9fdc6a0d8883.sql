-- Create table for prompt evaluations
CREATE TABLE public.prompt_evaluations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT,
  industry TEXT,
  company_size TEXT,
  target_audience TEXT,
  user_prompt TEXT NOT NULL,
  master_prompt TEXT NOT NULL,
  webhook_url TEXT NOT NULL,
  evaluation_results JSONB,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.prompt_evaluations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own evaluations" 
ON public.prompt_evaluations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own evaluations" 
ON public.prompt_evaluations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own evaluations" 
ON public.prompt_evaluations 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own evaluations" 
ON public.prompt_evaluations 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_prompt_evaluations_updated_at
BEFORE UPDATE ON public.prompt_evaluations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();