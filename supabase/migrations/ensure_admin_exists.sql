/*
  # Asigurare existență cont admin
  
  1. Changes
    - Verifică dacă contul admin există și îl creează dacă nu
    - Asigură că emailul admin este confirmat
    - Verifică existența profilului admin și îl creează dacă nu există
  
  2. Security
    - Această migrare este specifică doar pentru contul admin
*/

-- Verifică și creează contul admin dacă nu există
DO $$
DECLARE
  admin_exists BOOLEAN;
  admin_id UUID;
  profile_exists BOOLEAN;
BEGIN
  -- Verifică dacă contul admin există
  SELECT EXISTS (
    SELECT 1 FROM auth.users WHERE lower(email) = 'admineatwise@gmail.com'
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
      'admineatwise@gmail.com',
      '$2a$10$Xt9Hn8QpNP8nT5zYvOXSLuOhOTUObVJbvL7.IcMp/J.Rllr7ZdKBC',
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"is_admin":true}'
    )
    RETURNING id INTO admin_id;
  ELSE
    -- Obține ID-ul adminului existent
    SELECT id INTO admin_id FROM auth.users WHERE lower(email) = 'admineatwise@gmail.com';
    
    -- Asigură-te că emailul este confirmat
    UPDATE auth.users
    SET email_confirmed_at = COALESCE(email_confirmed_at, now())
    WHERE id = admin_id;
  END IF;
  
  -- Verifică dacă profilul admin există
  IF admin_id IS NOT NULL THEN
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