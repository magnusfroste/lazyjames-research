-- Make years_active nullable in lab_company_profiles
ALTER TABLE lab_company_profiles 
ALTER COLUMN years_active DROP NOT NULL;

-- Update existing empty string values to NULL
UPDATE lab_company_profiles 
SET years_active = NULL 
WHERE years_active = '';