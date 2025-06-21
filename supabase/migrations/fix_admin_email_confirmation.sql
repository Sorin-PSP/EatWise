/*
  # Fix admin email confirmation
  
  1. Changes
    - Directly updates the admin user's email_confirmed_at field in the auth.users table
    - This ensures the admin account can log in without email verification
  
  2. Security
    - This is a targeted fix for the admin account only
    - The existing trigger will handle future user registrations
*/

-- Update the admin user's email_confirmed_at field
DO $$
BEGIN
  UPDATE auth.users
  SET email_confirmed_at = now()
  WHERE email = 'AdminEatWise@gmail.com' AND email_confirmed_at IS NULL;
END $$;