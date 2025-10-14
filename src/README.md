# 🍷 Wine Club SaaS Platform

> **Multi-tenant subscription management system for wine clubs with Square Production API integration**

---

## 📋 Table of Contents
- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Purpose & Business Model](#-purpose--business-model)
- [Setup Guide](#-setup-guide-wine-club-admin)
- [Repository Structure](#-repository-structure)
- [Architecture](#-architecture)
- [Features](#-features)

---

## 🎯 Overview

A comprehensive SaaS platform enabling wine clubs to manage subscription-based wine programs with direct Square integration. The system provides both an admin portal for wine club operators and a customer-facing portal for members to review, approve, and customize their wine selections.

**Key Capabilities:**
- **Admin Portal** - Manage members, inventory, plans, preferences, and shipments
- **Customer Portal** - Wine selection review, upsell opportunities, delivery confirmation, payment processing
- **Square Integration** - Live inventory sync, customer management, payment processing
- **Multi-tenant Architecture** - Support multiple wine club brands from a single platform

**Current Client:** King Frosch Wines (MVP deployment)

---

## 🛠 Tech Stack

### Frontend
- **React 18** - Component-based UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS v4** - Utility-first styling with custom wine theme
- **Shadcn/UI** - Accessible component library
- **Lucide React** - Icon library
- **Recharts** - Data visualization

### Backend
- **Supabase** - Backend-as-a-Service (PostgreSQL + Auth + Storage)
- **Hono** - Fast web framework for edge functions
- **Deno** - Secure TypeScript runtime for serverless functions

### External APIs
- **Square Production API** - Catalog, customers, payments, orders
- **Unsplash** - Stock photography for demos

### Deployment
- **Vercel** - Frontend hosting and serverless functions
- **Supabase Edge Functions** - Backend API endpoints

---

## 💡 Purpose & Business Model

### Platform Purpose
Enable small-to-medium wineries to run professional subscription wine clubs without building custom software. The platform handles:

1. **Member Management** - Import from Square or add manually
2. **Subscription Plans** - Flexible tiers (Gold: 3 bottles, Silver: 6 bottles, Platinum: 12 bottles)
3. **Wine Curation** - Admin assigns wines based on customer preferences
4. **Customer Experience** - Email-driven approval flow with swap options
5. **Payment Processing** - Square integration for secure transactions
6. **Shipment Coordination** - CSV export for fulfillment partners

### Business Model

**Subscription Tiers:**
- **Gold Plan** - 3 bottles, 10% discount, 2-6 shipments/year
- **Silver Plan** - 6 bottles, 15% discount, 2-6 shipments/year  
- **Platinum Plan** - 12 bottles, 20% discount, 2-6 shipments/year

**Revenue Streams:**
- Subscription fees collected via Square
- Upsell revenue from bonus bottle purchases
- Regional shipping fees

**Platform Fee Structure (Future):**
- Monthly SaaS fee per wine club tenant
- Transaction percentage on processed orders
- Premium features (advanced analytics, custom branding)

---

## 🚀 Setup Guide: Wine Club Admin

### Initial Configuration

#### Step 1: Access Admin Portal
1. Navigate to the application URL
2. Log in with admin credentials (Supabase auth)
3. You'll land on the Dashboard

#### Step 2: Configure Square API Connection
1. Click **"Client Setup"** in the sidebar
2. Enter your Square Production credentials:
   - **Access Token** - From Square Developer Dashboard
   - **Location ID** - Your primary Square location
3. Click **"Test Connection"**
4. Verify successful authentication (should show item count from catalog)

**Where to get Square credentials:**
- Go to [Square Developer Dashboard](https://developer.squareup.com/apps)
- Select your application
- Copy the **Production Access Token**
- Find your **Location ID** under Locations

#### Step 3: Create Subscription Plans
1. Navigate to **"Plans"** in sidebar
2. Click **"Create New Plan"**
3. Fill in plan details:
   - Name (e.g., "Gold Tier")
   - Bottle count (e.g., 3)
   - Discount percentage (e.g., 10%)
   - Frequency (2, 4, or 6 times per year)
4. Save the plan

#### Step 4: Import or Add Members
1. Go to **"Members"** page
2. **Option A:** Import from Square
   - Click "Import from Square Customers"
   - Select customers to import
3. **Option B:** Add manually
   - Click "Add Member"
   - Enter: name, email, phone, plan selection
4. Assign each member to a subscription plan

#### Step 5: Set Customer Preferences
1. Navigate to **"Preferences"** page
2. For each member, configure:
   - **Wine Categories** - Red, White, Rosé, Sparkling, Dessert
   - **Preferences** - Dry, Semi-Sweet, Sweet
   - **Quantity per category** - How many bottles of each type
3. Save preferences for each member

#### Step 6: Review Live Inventory
1. Go to **"Inventory"** page
2. Browse wines synced from Square catalog
3. Note available categories and stock levels
4. Use filters to view specific wine types

#### Step 7: Build a Shipment
1. Navigate to **"Shipment Builder"**
2. Click **"Create New Shipment"**
3. Set shipment details:
   - Ship date (minimum 2 days ahead)
   - Shipment name (e.g., "Spring 2025 Selection")
4. **Assign wines to members:**
   - For each member, select wines matching their preferences
   - System shows ✅ green check when matched
   - Shows ❌ red X if no wines assigned
5. Use **"Show Unmatched Only"** toggle to see members needing assignment
6. Once all members have wines, click **"Schedule Shipment"**

#### Step 8: Email Notifications (Future)
- Members receive email with unique approval link
- No login required for wine review
- Link expires after shipment confirmation

### Daily Operations

**For each shipment cycle:**
1. Review inventory levels in Square
2. Create new shipment in Shipment Builder
3. Assign wines based on preferences
4. Schedule and send notifications
5. Monitor customer approvals
6. Export confirmed shipments to CSV
7. Send CSV to fulfillment partner

---

## 📁 Repository Structure

```
wine-club-saas/
│
├── 📄 App.tsx                                   # Main application entry point with routing and state management
├── 📄 index.html                                # HTML entry point with Tailwind v4 CDN
├── 📄 vercel.json                               # Vercel deployment configuration
├── 📄 README.md                                 # This file - comprehensive project documentation
├── 📄 STATUS.md                                 # Current project status and Square API integration details
├── 📄 Attributions.md                           # Image and asset credits
│
├── 📂 components/                               # React component library
│   │
│   ├── 🔐 AuthPage.tsx                          # Login page with password and magic link authentication
│   ├── 🏗️  AdminLayout.tsx                      # Main admin sidebar layout wrapper with navigation
│   ├── 📊 Dashboard.tsx                         # Admin dashboard with metrics, charts, and recent activity
│   ├── 👥 MembersPage.tsx                       # Customer management - view, edit, filter wine club members
│   ├── 🍷 InventoryPageSimple.tsx               # Live inventory browser with Square API integration
│   ├── 📋 PlansPage.tsx                         # Subscription plan management (Gold/Silver/Platinum)
│   ├── 🎯 CustomerPreferencesPage.tsx           # Wine preference matching system by category
│   ├── 📦 ShipmentBuilderPage.tsx               # Assign wines to customers and schedule shipments
│   ├── ⚙️  SimpleSetupPage.tsx                  # Square API configuration wizard with connection testing
│   ├── 🔍 SquareAuthDiagnostic.tsx              # Square API troubleshooting and error diagnosis
│   ├── 👑 SuperadminDashboard.tsx               # Multi-tenant management dashboard (future)
│   ├── 📧 MarketingIntegration.tsx              # Email/SMS campaign management (future)
│   ├── 📝 EmbeddedSignup.tsx                    # New member signup form (embeddable widget)
│   ├── 🎉 WelcomeToast.tsx                      # Welcome notification component
│   │
│   ├── 📂 customer/                             # Customer-facing portal components
│   │   ├── 🍇 WineSelectionReview.tsx           # Wine approval flow with swap modal
│   │   ├── 💰 BonusUpsell.tsx                   # Additional bottle purchase upsell interface
│   │   ├── 📅 DeliveryDateConfirmation.tsx      # Shipping date selection and confirmation
│   │   └── 💳 PaymentCollection.tsx             # Square payment method collection form
│   │
│   ├── 📂 figma/                                # Figma integration utilities
│   │   └── 🖼️  ImageWithFallback.tsx            # Image component with graceful error handling
│   │
│   └── 📂 ui/                                   # Shadcn/UI component library (37 components)
│       ├── accordion.tsx                        # Collapsible content sections
│       ├── alert-dialog.tsx                     # Modal confirmation dialogs
│       ├── alert.tsx                            # Notification banners
│       ├── aspect-ratio.tsx                     # Responsive image containers
│       ├── avatar.tsx                           # User profile images
│       ├── badge.tsx                            # Status and category indicators
│       ├── breadcrumb.tsx                       # Navigation breadcrumbs
│       ├── button.tsx                           # Interactive buttons with variants
│       ├── calendar.tsx                         # Date picker for shipment scheduling
│       ├── card.tsx                             # Content cards with headers and footers
│       ├── carousel.tsx                         # Image and content sliders
│       ├── chart.tsx                            # Data visualization components
│       ├── checkbox.tsx                         # Checkbox form inputs
│       ├── collapsible.tsx                      # Expandable panels
│       ├── command.tsx                          # Command palette interface
│       ├── context-menu.tsx                     # Right-click menus
│       ├── dialog.tsx                           # Modal dialog windows
│       ├── drawer.tsx                           # Slide-out side panels
│       ├── dropdown-menu.tsx                    # Dropdown selection menus
│       ├── form.tsx                             # Form validation with React Hook Form
│       ├── hover-card.tsx                       # Hover-triggered content
│       ├── input-otp.tsx                        # One-time password inputs
│       ├── input.tsx                            # Text input fields
│       ├── label.tsx                            # Form field labels
│       ├── menubar.tsx                          # Application menu bars
│       ├── navigation-menu.tsx                  # Navigation components
│       ├── pagination.tsx                       # Page navigation controls
│       ├── popover.tsx                          # Floating content popovers
│       ├── progress.tsx                         # Progress indicators
│       ├── radio-group.tsx                      # Radio button groups
│       ├── resizable.tsx                        # Resizable panel layouts
│       ├── scroll-area.tsx                      # Custom scrollable containers
│       ├── select.tsx                           # Dropdown selection inputs
│       ├── separator.tsx                        # Visual dividers
│       ├── sheet.tsx                            # Side panel sheets
│       ├── sidebar.tsx                          # Navigation sidebar component
│       ├── skeleton.tsx                         # Loading state placeholders
│       ├── slider.tsx                           # Range slider inputs
│       ├── sonner.tsx                           # Toast notification system
│       ├── switch.tsx                           # Toggle switches
│       ├── table.tsx                            # Data tables with sorting
│       ├── tabs.tsx                             # Tabbed interfaces
│       ├── textarea.tsx                         # Multi-line text inputs
│       ├── toggle-group.tsx                     # Toggle button groups
│       ├── toggle.tsx                           # Single toggle buttons
│       ├── tooltip.tsx                          # Hover tooltips
│       ├── use-mobile.ts                        # Mobile device detection hook
│       └── utils.ts                             # UI utility functions
│
├── 📂 styles/                                   # CSS styling
│   └── globals.css                              # Tailwind v4 theme with wine-inspired color palette
│
├── 📂 supabase/functions/server/                # Backend API (Hono edge functions)
│   ├── 🚀 index.tsx                             # Main Hono server with all route definitions
│   ├── 🔌 env.tsx                               # Environment variable configuration and validation
│   ├── 📊 env-status.tsx                        # Environment status check endpoint
│   ├── 🗄️  kv_store.tsx                         # Key-value database operations (DO NOT MODIFY)
│   ├── 🛠️  database-setup.tsx                   # Database initialization and schema setup
│   ├── 🟦 square-live-inventory.tsx             # Live inventory API from Square Production catalog
│   └── 💳 square-helpers.tsx                    # Square payment processing utilities (future)
│
├── 📂 utils/                                    # Frontend utilities
│   ├── 🌐 api.ts                                # Main API client for frontend-backend communication
│   ├── ⚙️  env.ts                                # Environment configuration utilities
│   ├── 🖥️  client-env.ts                        # Client-side environment helpers
│   └── 📂 supabase/
│       └── info.tsx                             # Supabase connection configuration (auto-generated)
│
└── 📂 guidelines/                               # Development standards
    └── Guidelines.md                            # Coding standards and best practices (system file)
```

### Key Files Explained

**Core Application:**
- `App.tsx` - Handles routing between admin/customer portals, auth flow, and demo mode detection
- `index.html` - Entry point with Tailwind v4 CDN and meta tags

**Admin Components:**
- `AdminLayout.tsx` - Sidebar navigation wrapper used by all admin pages
- `Dashboard.tsx` - Overview with member count, revenue, shipment status
- `InventoryPageSimple.tsx` - Paginated grid (24 items/page) of Square wines with filters
- `ShipmentBuilderPage.tsx` - Core shipment assignment interface with preference matching

**Customer Components:**
- `WineSelectionReview.tsx` - Main approval interface with wine swap modal
- `BonusUpsell.tsx` - Upsell interface showing available wines with member discount
- `PaymentCollection.tsx` - Square payment form for first-time payment method setup

**Backend APIs:**
- `square-live-inventory.tsx` - Fetches real-time catalog from Square (production only)
- `square-helpers.tsx` - Payment processing, order creation, customer management
- `index.tsx` - Routes for members, plans, shipments, preferences

**Protected Files (DO NOT MODIFY):**
- `kv_store.tsx` - Database utility layer
- `supabase/info.tsx` - Auto-generated Supabase config
- `ImageWithFallback.tsx` - System component

---

## 🏗️ Architecture

### Three-Tier Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vercel)                 │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Admin Portal │  │Customer Portal│  │ Auth System  │      │
│  │ (10 pages)   │  │  (4 steps)    │  │  (Supabase)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          └──────────────────┴──────────────────┘
                             │
          ┌──────────────────▼──────────────────┐
          │   API LAYER (utils/api.ts)          │
          │   - getLiveInventory()              │
          │   - getMembers()                    │
          │   - createShipment()                │
          └──────────────────┬──────────────────┘
                             │
┌─────────────────────────────▼─────────────────────────────────┐
│              BACKEND (Supabase Edge Functions)                │
│                                                               │
│  ┌────────────────────┐  ┌────────────────────┐             │
│  │ Hono Web Server    │  │  Square API Routes │             │
│  │ (index.tsx)        │  │  (live-inventory)  │             │
│  └────────────────────┘  └────────────────────┘             │
│         │                         │                          │
└─────────┼─────────────────────────┼──────────────────────────┘
          │                         │
    ┌─────▼──────┐           ┌──────▼──────┐
    │  Supabase  │           │   Square    │
    │  Database  │           │ Production  │
    │    (KV)    │           │     API     │
    └────────────┘           └─────────────┘
```

### Data Flow: Live Inventory Approach

**Key Principle:** Square is the single source of truth for wine data

1. **No Local Wine Storage** - We do NOT store wine names, prices, images, or descriptions
2. **Real-time Fetching** - Every inventory view fetches fresh data from Square
3. **ID References Only** - We only store Square item IDs when wines are assigned to shipments
4. **No Sync Issues** - Always current with Square catalog changes

**Why This Approach?**
- Eliminates data staleness (prices always current)
- No sync logic or cron jobs needed
- Automatically reflects Square inventory updates
- Reduces database storage and complexity

---

## ✨ Features

### Admin Portal (10 Pages)

1. **Dashboard** - Overview metrics, recent activity, quick actions
2. **Members** - Customer list with plan assignments and status
3. **Inventory** - Live Square catalog with filters (24 wines per page)
4. **Plans** - Subscription tier management (create/edit/delete)
5. **Preferences** - Customer wine category preferences
6. **Shipment Builder** - Wine assignment interface with matching indicators
7. **Client Setup** - Square API configuration wizard
8. **Square Diagnostic** - API troubleshooting and connection testing
9. **Superadmin** - Multi-tenant management (future)
10. **Marketing** - Email/SMS campaign triggers (future)

### Customer Portal (4 Steps)

1. **Wine Selection Review** - View assigned wines, swap options
2. **Bonus Upsell** - Add extra bottles with member discount
3. **Delivery Confirmation** - Set preferred delivery date
4. **Payment Collection** - Enter payment method (first time only)

### Square Integration Features

- ✅ **Live Inventory** - Real-time catalog sync (production only)
- ✅ **Customer Management** - Import Square customers as members
- ⏳ **Payment Processing** - Square Web Payments SDK (in progress)
- ⏳ **Order Creation** - Generate Square orders from shipments (in progress)
- ⏳ **Email/SMS** - Square Marketing API integration (planned)

### System Features

- **Demo Mode** - Graceful fallback with 24 sample wines when Square not configured
- **Error Handling** - Comprehensive error messages and recovery flows
- **Responsive Design** - Mobile and desktop optimized layouts
- **Wine Theme** - Deep maroon color palette (#722f37)
- **Type Safety** - Full TypeScript implementation

---

## 🔐 Environment Variables

### Required (Production)

```bash
# Supabase (Auto-configured in Figma Make)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Square Production API (Manual Setup Required)
SQUARE_ACCESS_TOKEN=EAAAl...  # Production access token
SQUARE_LOCATION_ID=L123...     # Primary location ID
```

### Optional (Future Features)

```bash
SQUARE_APPLICATION_ID=sq0idp...  # For OAuth (marketplace app)
OPENAI_API_KEY=sk-...            # For AI concierge (future)
```

---

## 🚢 Deployment

### Vercel (Current)
- Frontend: Automatic deployment from Git
- Environment variables set in Vercel dashboard
- Edge functions run globally

### Supabase Edge Functions
- Backend API runs on Supabase infrastructure
- Environment variables set in Supabase dashboard
- Auto-deployed with Git push

---

## 📊 Current Status

**✅ Complete:**
- Admin portal (10 pages)
- Customer portal (4 steps)
- Square Production API integration
- Live inventory with pagination
- Demo mode fallback system
- Member management
- Subscription plans
- Customer preferences
- Shipment builder

**⏳ In Progress:**
- Square payment processing
- Order creation workflow
- Email notification system

**📋 Planned:**
- SMS notifications via Square
- CSV export for shipping labels
- Advanced analytics dashboard
- Multi-tenant billing

---

## 🤝 Support & Documentation

- **STATUS.md** - Current project status and Square API details
- **Square Setup** - Use "Client Setup" page in admin portal
- **Troubleshooting** - Use "Square Diagnostic" page for API issues
- **Demo Mode** - Automatically activates when Square not configured

---

## 📝 License

Proprietary - All Rights Reserved  
© 2025 King Frosch Wines / Fluid Design Agency

Built with ❤️ for wine enthusiasts
