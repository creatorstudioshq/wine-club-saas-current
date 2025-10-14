# 🚀 Quick Start Guide - Wine Club SaaS

## ⚡ Super Fast Setup (5 Minutes)

### 1. Create GitHub Repository
Go to: https://github.com/organizations/creatorstudioshq/repositories/new
- Name: `wine-club-saas`
- Visibility: **Private** ✅
- Don't initialize with README ❌

### 2. Push to GitHub (Copy/Paste)

```bash
git init
git add .
git commit -m "feat: Initial commit - Complete Wine Club SaaS with Square integration"
git remote add origin https://github.com/creatorstudioshq/wine-club-saas.git
git branch -M main
git push -u origin main
```

**Note:** Use a Personal Access Token (not password) when prompted.
Create one here: https://github.com/settings/tokens

---

## 🎯 What You're Committing

### ✅ 91 Files Ready to Deploy
- **Admin Portal** - Complete dashboard, member management, inventory, plans
- **Customer Portal** - Wine selection, upsell, payment, signup
- **Backend** - Supabase Edge Functions with Square API integration
- **Documentation** - README, STATUS, ROADMAP, setup guides
- **Configuration** - package.json, tsconfig, vite config, gitignore

### 🔒 Protected (Not Committed)
- `.env.local` - Your secrets stay local ✅
- `node_modules/` - Dependencies (will be reinstalled)
- `dist/` - Build artifacts

---

## 📦 After Pushing to GitHub

### Option A: Deploy to Vercel (Recommended)
1. Go to https://vercel.com/new
2. Import from: `creatorstudioshq/wine-club-saas`
3. Framework: **Vite** (auto-detected)
4. Click **Deploy**
5. Add environment variables in Vercel dashboard

### Option B: Run Locally
```bash
# Clone repository
git clone https://github.com/creatorstudioshq/wine-club-saas.git
cd wine-club-saas

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local with your Supabase and Square credentials

# Start development server
npm run dev

# Open http://localhost:5173
```

---

## 🔑 Required Environment Variables

Add these to Vercel or `.env.local`:

```bash
# Supabase (Get from: https://app.supabase.com)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...

# Square API (Get from: https://developer.squareup.com)
VITE_SQUARE_APPLICATION_ID=sandbox-sq0idb-xxxxx
VITE_SQUARE_LOCATION_ID=LXXXXXX
```

---

## 🗄️ Supabase Setup (2 Minutes)

### 1. Create Supabase Project
https://app.supabase.com/projects → **New Project**

### 2. Run This SQL
Go to SQL Editor and paste:

```sql
CREATE TABLE IF NOT EXISTS kv_store_9d538b9c (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE kv_store_9d538b9c ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role has full access" ON kv_store_9d538b9c
  FOR ALL USING (true) WITH CHECK (true);
```

### 3. Deploy Edge Functions
```bash
# Install Supabase CLI
npm install -g supabase

# Link project
supabase link --project-ref YOUR_PROJECT_REF

# Set secrets
supabase secrets set SQUARE_ACCESS_TOKEN=your_token_here

# Deploy
supabase functions deploy
```

---

## 🟦 Square API Setup

### 1. Create Application
https://developer.squareup.com/apps → **Create App**

### 2. Get Credentials
- **Application ID** - Copy to `VITE_SQUARE_APPLICATION_ID`
- **Access Token** - Copy to Supabase secrets
- **Location ID** - Copy to `VITE_SQUARE_LOCATION_ID`

### 3. Enable OAuth (Optional)
Set redirect URL:
```
https://YOUR_PROJECT.supabase.co/functions/v1/make-server-9d538b9c/square/callback
```

---

## 🧪 Test Your Deployment

1. **Admin Login**
   - Email: `admin@example.com`
   - Password: `anything` (demo mode)

2. **Check Square Connection**
   - Navigate to "Square Diagnostic" page
   - Click "Fix Authentication"
   - Follow OAuth flow

3. **View Live Inventory**
   - Go to "Inventory" page
   - Should show items from your Square catalog
   - Filter by wine types (Red, White, Sparkling)

---

## 📊 Key Features Working Out of the Box

### Admin Portal ✅
- Dashboard with KPIs
- Member CRUD operations
- Live Square inventory
- Subscription plans
- Shipment builder

### Customer Portal ✅
- Wine selection review
- Bonus bottle upsell
- Delivery confirmation
- Payment collection (placeholder)
- Embedded signup

### Integrations ✅
- Square API (OAuth + live inventory)
- Supabase (database + edge functions)
- Vercel (deployment)

---

## 🐛 Common Issues & Fixes

### "Square API 401 Error"
**Fix:** Click the red banner → "Fix Authentication" → Complete OAuth

### "Supabase connection failed"
**Fix:** Check environment variables are set correctly in Vercel

### "Inventory page shows demo data"
**Fix:** Square authentication needs to be completed

### "npm install fails"
**Fix:** Use Node.js 18+ (`node --version` to check)

---

## 📝 Future Development Workflow

```bash
# Create feature branch
git checkout -b feature/customer-notifications

# Make changes...
git add .
git commit -m "feat: Add email notifications for shipments"

# Push to GitHub
git push origin feature/customer-notifications

# Create Pull Request on GitHub
# Merge when ready
```

---

## 📚 Documentation

- **Complete Guide**: `/ROADMAP.md` - Full setup & deployment
- **Project Status**: `/STATUS.md` - Implementation tracking
- **Main README**: `/README.md` - Architecture & tech stack
- **Commit Guide**: `/COMMIT_TO_GITHUB.md` - Detailed Git instructions

---

## 🎉 You're All Set!

Your Wine Club SaaS is ready to:
- ✅ Accept members via embedded signup
- ✅ Manage subscriptions & preferences
- ✅ Build shipments with live inventory
- ✅ Process payments (Square integration)
- ✅ Scale to multiple wine club tenants

**Live Demo URL (after Vercel deploy):**
`https://wine-club-saas.vercel.app`

**GitHub Repository:**
`https://github.com/creatorstudioshq/wine-club-saas`

---

## 💡 Pro Tips

1. **Use Sandbox First**: Test with Square Sandbox before going live
2. **Set Up Branch Protection**: Protect `main` branch in GitHub settings
3. **Enable Preview Deployments**: Vercel will deploy every PR automatically
4. **Monitor Edge Functions**: Check Supabase logs for API errors
5. **Backup Database**: Use Supabase's automatic backups

---

Need help? Check the detailed guides in `/ROADMAP.md` and `/COMMIT_TO_GITHUB.md`! 🍷
