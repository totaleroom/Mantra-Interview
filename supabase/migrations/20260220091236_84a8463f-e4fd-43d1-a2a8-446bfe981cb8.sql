
-- Step 1: Add cv_name column to cv_data
ALTER TABLE public.cv_data ADD COLUMN IF NOT EXISTS cv_name TEXT;

-- Step 2: Function to enforce max 3 drafts per user
CREATE OR REPLACE FUNCTION public.check_cv_draft_limit()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF (SELECT COUNT(*) FROM public.cv_data WHERE user_id = NEW.user_id) >= 3 THEN
    RAISE EXCEPTION 'Maximum 3 CV drafts allowed per user';
  END IF;
  RETURN NEW;
END;
$$;

-- Step 3: Trigger on insert
DROP TRIGGER IF EXISTS enforce_cv_draft_limit ON public.cv_data;
CREATE TRIGGER enforce_cv_draft_limit
  BEFORE INSERT ON public.cv_data
  FOR EACH ROW EXECUTE FUNCTION public.check_cv_draft_limit();
