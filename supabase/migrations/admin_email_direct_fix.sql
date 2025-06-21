/*
  # Soluție directă pentru confirmarea emailului admin
  
  1. Changes
    - Actualizează direct înregistrarea adminului în tabela auth.users
    - Setează email_confirmed_at la data curentă
    - Adaugă un trigger pentru a confirma automat emailul adminului la înscriere
  
  2. Security
    - Această soluție este specifică doar pentru contul admin
    - Folosește privilegii de sistem pentru a modifica tabela auth.users
*/

-- Actualizare directă pentru contul admin existent
UPDATE auth.users
SET email_confirmed_at = now()
WHERE email = 'AdminEatWise@gmail.com';

-- Creează un trigger pentru a confirma automat emailul adminului la înscriere
CREATE OR REPLACE FUNCTION public.auto_confirm_admin_email()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email = 'AdminEatWise@gmail.com' THEN
    NEW.email_confirmed_at := now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verifică dacă triggerul există deja și dacă nu, îl creează
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'confirm_admin_email_trigger'
  ) THEN
    CREATE TRIGGER confirm_admin_email_trigger
    BEFORE INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.auto_confirm_admin_email();
  END IF;
END
$$;