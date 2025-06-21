/*
  # Trigger pentru crearea automată a contului admin
  
  1. Changes
    - Creează un trigger care se execută la fiecare încercare de autentificare
    - Verifică dacă emailul este cel al adminului și confirmă automat emailul
  
  2. Security
    - Această migrare este specifică doar pentru contul admin
    - Trigger-ul se execută doar pentru emailul adminului
*/

-- Creează funcția pentru trigger
CREATE OR REPLACE FUNCTION public.handle_admin_auth()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verifică dacă emailul este cel al adminului
  IF lower(NEW.email) = 'admineatwise@gmail.com' THEN
    -- Confirmă emailul automat
    NEW.email_confirmed_at := COALESCE(NEW.email_confirmed_at, now());
    
    -- Asigură-te că metadatele conțin flag-ul de admin
    IF NEW.raw_user_meta_data IS NULL THEN
      NEW.raw_user_meta_data := '{"is_admin":true}'::jsonb;
    ELSE
      NEW.raw_user_meta_data := jsonb_set(
        COALESCE(NEW.raw_user_meta_data, '{}'::jsonb),
        '{is_admin}',
        'true'::jsonb
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Creează trigger-ul pentru auth.users
DROP TRIGGER IF EXISTS handle_admin_auth_trigger ON auth.users;
CREATE TRIGGER handle_admin_auth_trigger
BEFORE INSERT OR UPDATE ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_admin_auth();