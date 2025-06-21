/*
  # Normalizare email admin
  
  1. Changes
    - Actualizează toate aparițiile emailului admin pentru a folosi lowercase
    - Asigură consistența între diferite tabele și funcții
  
  2. Security
    - Această migrare este specifică doar pentru contul admin
*/

-- Actualizează emailul admin în auth.users pentru a folosi lowercase
UPDATE auth.users
SET email = 'admineatwise@gmail.com'
WHERE lower(email) = 'admineatwise@gmail.com';

-- Actualizează emailul admin în profiles pentru a folosi lowercase
UPDATE public.profiles
SET email = 'admineatwise@gmail.com'
WHERE lower(email) = 'admineatwise@gmail.com';

-- Verifică dacă contul admin există și îl creează dacă nu
DO $$
DECLARE
  admin_exists BOOLEAN;
BEGIN
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
    );
  END IF;
END $$;