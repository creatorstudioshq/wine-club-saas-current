# Deploy Supabase Edge Functions

## Manual Deployment Steps:

### 1. Go to Supabase Dashboard
- Visit: https://supabase.com/dashboard/project/aammkgdhfmkukpqkdduj
- Go to "Edge Functions" section

### 2. Create New Function
- Click "Create a new function"
- Name: `make-server-9d538b9c`
- Copy the contents from `supabase/functions/make-server-9d538b9c/index.tsx`

### 3. Deploy Function
- Click "Deploy" button
- Wait for deployment to complete

### 4. Test Function
- Test the endpoint: `https://aammkgdhfmkukpqkdduj.supabase.co/functions/v1/make-server-9d538b9c/`

## Alternative: Use Supabase CLI with Token

If you have a Supabase access token:
```bash
export SUPABASE_ACCESS_TOKEN=your_token_here
supabase functions deploy make-server-9d538b9c
```

## Files to Deploy:
- `supabase/functions/make-server-9d538b9c/index.tsx` (main function)
- `supabase/functions/make-server-9d538b9c/kv_store.tsx`
- `supabase/functions/make-server-9d538b9c/square-helpers.tsx`
- `supabase/functions/make-server-9d538b9c/square-live-inventory.tsx`
- `supabase/functions/make-server-9d538b9c/env.tsx`
- `supabase/functions/make-server-9d538b9c/env-status.tsx`
- `supabase/functions/make-server-9d538b9c/database-setup.tsx`
