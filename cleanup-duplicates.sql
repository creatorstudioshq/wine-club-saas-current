-- Cleanup Duplicate Plans for King Frosch Wine Club
-- This will remove the older duplicate plans and keep the newer ones with descriptions

-- Delete duplicate plans (older ones without descriptions)
DELETE FROM subscription_plans WHERE id = 'a9a924e9-d954-4a39-a8e2-f45b8373a3bb';
DELETE FROM subscription_plans WHERE id = '3caacf9d-a6df-40eb-9cad-658c6b69f2f2';
DELETE FROM subscription_plans WHERE id = '99adf485-098b-40d3-986f-21df5a7a02ab';

-- Verify the cleanup
SELECT COUNT(*) as remaining_plans FROM subscription_plans WHERE wine_club_id = '550e8400-e29b-41d4-a716-446655440000';
