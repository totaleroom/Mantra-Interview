-- Remove the overly permissive policy that exposes all license keys to anyone
DROP POLICY IF EXISTS "Anyone can check license key validity" ON public.license_keys;