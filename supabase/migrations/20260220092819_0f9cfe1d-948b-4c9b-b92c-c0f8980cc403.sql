-- Allow users to view only the license key assigned to them
CREATE POLICY "Users can view their own license key"
ON public.license_keys
FOR SELECT
TO authenticated
USING (used_by = auth.uid());