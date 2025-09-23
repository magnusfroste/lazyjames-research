-- Update webhook URL to POC endpoint
UPDATE webhook_testing 
SET webhook_url = 'https://agent.froste.eu/webhook/exploration', 
    updated_at = now() 
WHERE is_active = true;