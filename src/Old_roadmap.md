# Wine Club SaaS - Project Export & Setup Roadmap

## 📦 Exporting This Project

Since Figma Make doesn't have a built-in export/download feature, here are your options to get the code:

### Option 1: GitHub Integration (Recommended)
If this project is connected to a Git repository:
1. Go to your GitHub/GitLab repository
2. Click the green **"Code"** button
3. Select **"Download ZIP"**
4. Extract and you're ready to go!

### Option 2: Manual Export
Copy all files from Figma Make to your local machine:
1. Create the folder structure below
2. Copy each file's content from Figma Make
3. Paste into corresponding local files
4. Follow the setup instructions below

### Option 3: Vercel Git Connection
If deployed via Vercel:
1. Go to Vercel Dashboard → Your Project
2. Navigate to **Settings** → **Git**
3. Clone the connected repository
4. Pull the latest code

---

## 📂 Complete File Structure

```
wine-club-saas/
├── App.tsx                          # Main application entry point
├── index.html                       # HTML entry point
├── package.json                     # Dependencies (see below)
├── tsconfig.json                    # TypeScript configuration
├── vercel.json                      # Vercel deployment config
├── .env.local                       # Local environment variables (create this)
├── .gitignore                       # Git ignore rules
├── README.md                        # Project documentation
├── STATUS.md                        # Development status
├── ROADMAP.md                       # This file
├── Attributions.md                  # Third-party attributions
│
├── styles/
│   └── globals.css                  # Tailwind V4 custom styles
│
├── components/
│   ├── AdminLayout.tsx              # Admin panel layout wrapper
│   ├── AuthPage.tsx                 # Login/authentication page
│   ├── Dashboard.tsx                # Main admin dashboard
│   ├── MembersPage.tsx              # Member management
│   ├── InventoryPageSimple.tsx      # Live inventory from Square
│   ├── PlansPage.tsx                # Subscription plans & shipping
│   ├── CustomerPreferencesPage.tsx  # Customer wine preferences
│   ├── ShipmentBuilderPage.tsx      # Shipment creation tool
│   ├── SimpleSetupPage.tsx          # Initial setup wizard
│   ├── SquareAuthDiagnostic.tsx     # Square API troubleshooting
│   ├── SuperadminDashboard.tsx      # Multi-tenant management
│   ├── MarketingIntegration.tsx     # Email marketing tools
│   ├── EmbeddedSignup.tsx           # Customer signup flow
│   ├── WelcomeToast.tsx             # Welcome notification
│   │
│   ├── customer/                    # Customer portal components
│   │   ├── WineSelectionReview.tsx  # Wine approval interface
│   │   ├── BonusUpsell.tsx          # Add-on bottle upsell
│   │   ├── DeliveryDateConfirmation.tsx
│   │   └── PaymentCollection.tsx    # Square payment collection
│   │
│   ├── figma/
│   │   └── ImageWithFallback.tsx    # Protected utility component
│   │
│   └── ui/                          # shadcn/ui component library
│       ├── accordion.tsx
│       ├── alert-dialog.tsx
│       ├── alert.tsx
│       ├── aspect-ratio.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── breadcrumb.tsx
│       ├── button.tsx
│       ├── calendar.tsx
│       ├── card.tsx
│       ├── carousel.tsx
│       ├── chart.tsx
│       ├── checkbox.tsx
│       ├── collapsible.tsx
│       ├── command.tsx
│       ├── context-menu.tsx
│       ├── dialog.tsx
│       ├── drawer.tsx
│       ├── dropdown-menu.tsx
│       ├── form.tsx
│       ├── hover-card.tsx
│       ├── input-otp.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── menubar.tsx
│       ├── navigation-menu.tsx
│       ├── pagination.tsx
│       ├── popover.tsx
│       ├── progress.tsx
│       ├── radio-group.tsx
│       ├── resizable.tsx
│       ├── scroll-area.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       ├── sidebar.tsx
│       ├── skeleton.tsx
│       ├── slider.tsx
│       ├── sonner.tsx
│       ├── switch.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       ├── textarea.tsx
│       ├── toggle-group.tsx
│       ├── toggle.tsx
│       ├── tooltip.tsx
│       ├── use-mobile.ts
│       └── utils.ts
│
├── utils/
│   ├── api.ts                       # Frontend API client
│   ├── client-env.ts                # Client-side environment
│   ├── env.ts                       # Environment utilities
│   └── supabase/
│       └── info.tsx                 # Supabase connection info
│
├── supabase/
│   └── functions/
│       └── server/                  # Supabase Edge Functions (Deno)
│           ├── index.tsx            # Main Hono server
│           ├── database-setup.tsx   # DB initialization
│           ├── env-status.tsx       # Environment checker
│           ├── env.tsx              # Server environment vars
│           ├── kv_store.tsx         # Key-value storage (PROTECTED)
│           ├── square-helpers.tsx   # Square API utilities
│           └── square-live-inventory.tsx
│
└── guidelines/
    └── Guidelines.md                # Development guidelines
```

---

## 🛠 Local Development Setup

### 1. Install Dependencies

Create `package.json` in your project root:

```json
{
  "name": "wine-club-saas",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "supabase:serve": "supabase functions serve",
    "supabase:deploy": "supabase functions deploy"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@supabase/supabase-js": "^2.39.0",
    "lucide-react": "^0.344.0",
    "recharts": "^2.10.3",
    "date-fns": "^3.0.0",
    "sonner": "^1.3.1",
    "react-day-picker": "^8.10.0",
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "@radix-ui/react-aspect-ratio": "^1.0.3",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-checkbox": "^1.0.4",
    "@radix-ui/react-collapsible": "^1.0.3",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-hover-card": "^1.0.7",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-menubar": "^1.0.4",
    "@radix-ui/react-navigation-menu": "^1.1.4",
    "@radix-ui/react-popover": "^1.0.7",
    "@radix-ui/react-progress": "^1.0.3",
    "@radix-ui/react-radio-group": "^1.1.3",
    "@radix-ui/react-scroll-area": "^1.0.5",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-separator": "^1.0.3",
    "@radix-ui/react-slider": "^1.1.2",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-switch": "^1.0.3",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "@radix-ui/react-toggle": "^1.0.3",
    "@radix-ui/react-toggle-group": "^1.0.4",
    "@radix-ui/react-tooltip": "^1.0.7",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "cmdk": "^0.2.0",
    "embla-carousel-react": "^8.0.0",
    "input-otp": "^1.2.4",
    "react-resizable-panels": "^2.0.0",
    "tailwind-merge": "^2.2.0",
    "vaul": "^0.9.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.55",
    "@types/react-dom": "^18.2.19",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.2.2",
    "vite": "^5.1.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/vite": "^4.0.0",
    "autoprefixer": "^10.4.17"
  }
}
```

Install:
```bash
npm install
```

### 2. Create Configuration Files

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules", "supabase/functions"]
}
```

**vite.config.ts:**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});
```

**.gitignore:**
```
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Production
dist/
build/

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Supabase
.supabase/
```

### 3. Environment Variables

Create `.env.local`:
```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Square API (Sandbox for testing)
VITE_SQUARE_APPLICATION_ID=sandbox-sq0idb-xxxxx
VITE_SQUARE_LOCATION_ID=your_location_id

# Server-side only (DO NOT prefix with VITE_)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SQUARE_ACCESS_TOKEN=your_square_access_token
SQUARE_SANDBOX_APPLICATION_SECRET=your_app_secret
SQUARE_SANDBOX_REDIRECT_URL=http://localhost:54321/functions/v1/make-server-9d538b9c/square/callback
```

---

## 🗄️ Supabase Setup

### 1. Create Supabase Project
1. Go to https://supabase.com
2. Create a new project
3. Copy your project URL and anon key to `.env.local`

### 2. Initialize Database
The app uses a pre-configured key-value table. Run this SQL in Supabase SQL Editor:

```sql
-- Create the key-value store table
CREATE TABLE IF NOT EXISTS kv_store_9d538b9c (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE kv_store_9d538b9c ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role full access
CREATE POLICY "Service role has full access" ON kv_store_9d538b9c
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create index for prefix searches
CREATE INDEX IF NOT EXISTS kv_store_prefix_idx 
  ON kv_store_9d538b9c (key text_pattern_ops);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_kv_store_updated_at
  BEFORE UPDATE ON kv_store_9d538b9c
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 3. Deploy Edge Functions
```bash
# Install Supabase CLI
npm install -g supabase

# Link your project
supabase link --project-ref your-project-ref

# Set secrets
supabase secrets set SQUARE_ACCESS_TOKEN=your_token
supabase secrets set SQUARE_SANDBOX_APPLICATION_SECRET=your_secret
supabase secrets set SQUARE_SANDBOX_REDIRECT_URL=your_callback_url

# Deploy functions
supabase functions deploy make-server-9d538b9c --no-verify-jwt
```

---

## 🟦 Square API Setup

### 1. Create Square Developer Account
1. Go to https://developer.squareup.com
2. Create an application
3. Get your Sandbox credentials:
   - Application ID
   - Access Token
   - Location ID

### 2. Enable OAuth (Optional - for embedded signup)
1. In Square Developer Dashboard → OAuth
2. Set Redirect URL: `https://[your-project].supabase.co/functions/v1/make-server-9d538b9c/square/callback`
3. Enable required permissions:
   - `ITEMS_READ`
   - `INVENTORY_READ`
   - `MERCHANT_PROFILE_READ`
   - `PAYMENTS_WRITE`

### 3. Test Connection
1. Start dev server: `npm run dev`
2. Navigate to "Square Diagnostic" page
3. Click "Fix Authentication"
4. Follow the OAuth flow

---

## 🚀 Deployment to Vercel

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Configure vercel.json
Already included in the project:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 3. Deploy
```bash
# Login
vercel login

# Deploy to production
vercel --prod
```

### 4. Set Environment Variables in Vercel
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add all variables from `.env.local`
3. Make sure to prefix client-side vars with `VITE_`

---

## 🏃 Running Locally

### Start Development Server
```bash
npm run dev
```

Access at: http://localhost:5173

### Start Supabase Functions Locally
```bash
supabase start
supabase functions serve
```

Functions available at: http://localhost:54321/functions/v1/make-server-9d538b9c

---

## 🎯 Key Features Implemented

### Admin Portal
- ✅ Dashboard with KPIs and analytics
- ✅ Member management (CRUD operations)
- ✅ Live inventory from Square API
- ✅ Subscription plans configuration
- ✅ Customer preferences management
- ✅ Shipment builder with wine assignment
- ✅ Square OAuth integration
- ✅ Multi-tenant support (Superadmin)
- ✅ Email marketing integration placeholder

### Customer Portal
- ✅ Wine selection review & approval
- ✅ Bonus bottle upsell flow
- ✅ Delivery date confirmation
- ✅ Payment collection (Square Web SDK)
- ✅ Embedded signup flow

### Technical Architecture
- ✅ React + TypeScript + Vite
- ✅ Tailwind CSS V4 with custom wine theme
- ✅ shadcn/ui component library
- ✅ Supabase backend (Edge Functions + Database)
- ✅ Square API integration (live inventory)
- ✅ Vercel-ready deployment

---

## 📋 Next Steps (Future Enhancements)

### Phase 1: Customer Flow Completion
- [ ] Complete Square Web Payments SDK integration
- [ ] Email/SMS notification system (Twilio/SendGrid)
- [ ] Customer authentication (magic links)
- [ ] Preference selection persistence

### Phase 2: Advanced Features
- [ ] Automated shipment scheduling
- [ ] Inventory reservation system
- [ ] Customer communication logs
- [ ] Advanced reporting & analytics

### Phase 3: Multi-Tenant
- [ ] Tenant onboarding wizard
- [ ] Custom branding per tenant
- [ ] Role-based access control (RBAC)
- [ ] Billing & subscription management

---

## 🐛 Troubleshooting

### Issue: Square API returns 401
**Solution:** 
1. Go to Square Diagnostic page in admin
2. Click "Fix Authentication"
3. Complete OAuth flow
4. Access token will be stored in environment variables

### Issue: Supabase functions not working locally
**Solution:**
```bash
supabase stop
supabase start
supabase functions serve --env-file .env.local
```

### Issue: Tailwind styles not loading
**Solution:**
- Ensure `@tailwindcss/vite` is in `vite.config.ts`
- Check that `styles/globals.css` is imported in `App.tsx`
- Restart dev server

### Issue: TypeScript errors in UI components
**Solution:**
```bash
rm -rf node_modules
npm install
```

---

## 📞 Support & Resources

- **Supabase Docs:** https://supabase.com/docs
- **Square API Docs:** https://developer.squareup.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **Tailwind V4:** https://tailwindcss.com/docs
- **shadcn/ui:** https://ui.shadcn.com

---

## 🎉 You're All Set!

Your Wine Club SaaS application should now be running locally. The core admin features are fully functional, and the customer portal foundation is in place.

**Default Login (Demo Mode):**
- Email: Any email
- Password: Any password
- Note: Real auth requires Supabase Auth configuration

**Architecture Highlights:**
- **Frontend → Server → Database** (3-tier architecture)
- **Live Inventory:** Always fetches fresh data from Square API
- **No Data Sync:** Only stores Square item IDs, not full product data
- **Scalable:** Multi-tenant ready with Superadmin dashboard

Happy coding! 🍷
