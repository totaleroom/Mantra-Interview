
-- Create module_content table
CREATE TABLE public.module_content (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id text NOT NULL UNIQUE,
  title text NOT NULL,
  thesis text NOT NULL,
  sections jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.module_content ENABLE ROW LEVEL SECURITY;

-- Only admins can CRUD directly
CREATE POLICY "Admins can manage module content"
ON public.module_content
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Users access via edge function only, no direct SELECT policy for regular users
