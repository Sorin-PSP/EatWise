/*
  # Funcție pentru confirmarea emailului admin
  
  1. Changes
    - Creează o funcție RPC care poate fi apelată din frontend
    - Funcția actualizează direct câmpul email_confirmed_at pentru contul admin
  
  2. Security
    - Funcția este marcată ca SECURITY DEFINER pentru a avea permisiunile necesare
    - Funcția verifică explicit că emailul este cel al adminului
*/

-- Creează funcția RPC pentru confirmarea emailului admin
CREATE OR REPLACE FUNCTION public.confirm_admin_email(admin_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  success BOOLEAN := FALSE;
BEGIN
  -- Verifică dacă emailul este cel al adminului
  IF lower(admin_email) = 'admineatwise@gmail.com' THEN
    -- Actualizează direct înregistrarea în auth.users
    UPDATE auth.users
    SET email_confirmed_at = now()
    WHERE lower(email) = lower(admin_email);
    
    -- Verifică dacă actualizarea a avut succes
    GET DIAGNOSTICS success = ROW_COUNT;
  END IF;
  
  RETURN success;
END;
$$;