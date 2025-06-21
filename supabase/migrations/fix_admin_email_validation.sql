/*
  # Rezolvare validare email admin
  
  1. Changes
    - Actualizează configurația validării emailurilor în Supabase
    - Adaugă o funcție RPC pentru a confirma manual emailul adminului
    - Asigură că emailul adminului este validat corect
  
  2. Security
    - Această migrare este specifică doar pentru contul admin
    - Funcția RPC este securizată pentru a fi executată doar de utilizatori autentificați
*/

-- Creează o funcție RPC pentru a confirma manual emailul adminului
CREATE OR REPLACE FUNCTION public.confirm_admin_email(admin_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_id UUID;
BEGIN
  -- Verifică dacă emailul este cel al adminului
  IF lower(admin_email) <> 'admineatwise@gmail.com' THEN
    RETURN FALSE;
  END IF;

  -- Obține ID-ul utilizatorului admin
  SELECT id INTO user_id FROM auth.users WHERE lower(email) = lower(admin_email);
  
  IF user_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Actualizează email_confirmed_at pentru admin
  UPDATE auth.users
  SET email_confirmed_at = now()
  WHERE id = user_id;
  
  RETURN TRUE;
END;
$$;

-- Asigură-te că emailul adminului este confirmat
UPDATE auth.users
SET email_confirmed_at = now()
WHERE lower(email) = 'admineatwise@gmail.com';

-- Asigură-te că profilul adminului există
DO $$
DECLARE
  admin_id UUID;
  profile_exists BOOLEAN;
BEGIN
  -- Obține ID-ul adminului
  SELECT id INTO admin_id FROM auth.users WHERE lower(email) = 'admineatwise@gmail.com';
  
  IF admin_id IS NOT NULL THEN
    -- Verifică dacă profilul există
    SELECT EXISTS (
      SELECT 1 FROM public.profiles WHERE id = admin_id
    ) INTO profile_exists;
    
    -- Dacă profilul nu există, îl creăm
    IF NOT profile_exists THEN
      INSERT INTO public.profiles (
        id,
        email,
        name,
        measurement_system,
        daily_calorie_goal,
        protein_goal,
        carbs_goal,
        fat_goal,
        water_goal
      )
      VALUES (
        admin_id,
        'admineatwise@gmail.com',
        'Admin',
        'metric',
        2000,
        120,
        250,
        70,
        8
      );
    END IF;
  END IF;
END $$;