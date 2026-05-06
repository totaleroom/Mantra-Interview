
-- Fix function search path mutable warning for check_cv_draft_limit
CREATE OR REPLACE FUNCTION public.check_cv_draft_limit()
RETURNS trigger LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF (SELECT COUNT(*) FROM public.cv_data WHERE user_id = NEW.user_id) >= 3 THEN
    RAISE EXCEPTION 'Maximum 3 CV drafts allowed per user';
  END IF;
  RETURN NEW;
END;
$$;
