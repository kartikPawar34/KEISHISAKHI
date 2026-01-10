-- Fix farmer_profiles security: Make user_id non-nullable and add unique constraint

-- First, delete any orphaned records without a user_id
DELETE FROM public.farmer_profiles WHERE user_id IS NULL;

-- Make user_id NOT NULL to prevent unprotected records
ALTER TABLE public.farmer_profiles 
  ALTER COLUMN user_id SET NOT NULL;

-- Add unique constraint to ensure one profile per user (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'farmer_profiles_user_id_unique'
  ) THEN
    ALTER TABLE public.farmer_profiles
      ADD CONSTRAINT farmer_profiles_user_id_unique 
      UNIQUE (user_id);
  END IF;
END $$;

-- Explicitly ensure RLS is enabled
ALTER TABLE public.farmer_profiles ENABLE ROW LEVEL SECURITY;