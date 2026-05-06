
-- Create prompts table
CREATE TABLE public.prompts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category text NOT NULL,
  title text NOT NULL,
  prompt_text text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS but NO direct access policies (access via edge function only)
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

-- Admin-only policy for management
CREATE POLICY "Admins can manage prompts"
ON public.prompts
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));
