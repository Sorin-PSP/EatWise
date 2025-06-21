/*
  # Disable email confirmation requirement
  
  1. Changes
    - Adds a trigger to automatically confirm email addresses for new users
    - This allows users to sign in without email verification
  
  2. Security
    - This is a development-only solution
    - In production, proper email verification should be implemented
*/

-- Create a function to automatically confirm email addresses
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  -- Set email_confirmed to true for all new users
  UPDATE auth.users
  SET email_confirmed_at = now()
  WHERE id = NEW.id AND email_confirmed_at IS NULL;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to run the function after a new user is inserted
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();