/*
  # Crearea contului de admin
  
  1. Changes
    - Creează contul de admin dacă nu există
    - Setează email_confirmed_at pentru a permite autentificarea fără confirmare prin email
  
  2. Security
    - Această migrare este specifică doar pentru contul admin
    - Folosește o parolă hash predefinită pentru contul admin
*/

-- Verifică dacă contul admin există deja
DO $$
DECLARE
  admin_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'AdminEatWise@gmail.com'
  ) INTO admin_exists;
  
  -- Dacă admin nu există, îl creăm
  IF NOT admin_exists THEN
    -- Creează contul admin cu o parolă hash predefinită
    -- Notă: Aceasta este o parolă hash pentru '1234EatWise-16634160/2025'
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'AdminEatWise@gmail.com',
      '$2a$10$Xt9Hn8QpNP8nT5zYvOXSLuOhOTUObVJbvL7.IcMp/J.Rllr7ZdKBC',
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"is_admin":true}'
    );
  ELSE
    -- Dacă admin există, ne asigurăm că email_confirmed_at este setat
    UPDATE auth.users
    SET email_confirmed_at = now()
    WHERE email = 'AdminEatWise@gmail.com' AND email_confirmed_at IS NULL;
  END IF;
END $$;

-- Verifică dacă profilul admin există și îl creează dacă nu
DO $$
DECLARE
  admin_id UUID;
  profile_exists BOOLEAN;
BEGIN
  -- Obține ID-ul adminului
  SELECT id INTO admin_id FROM auth.users WHERE email = 'AdminEatWise@gmail.com';
  
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
        'AdminEatWise@gmail.com',
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