# WINE CLUB SAAS MONOREPO TREE STRUCTURE

## 🌳 COMPLETE MONOREPO OVERVIEW

```
wine-club-saas-current/
├── 📁 ROOT CONFIGURATION
│   ├── 📄 package.json                    # Dependencies & scripts
│   ├── 📄 package-lock.json              # Lock file
│   ├── 📄 vite.config.ts                 # Vite build configuration
│   ├── 📄 tailwind.config.js             # Tailwind CSS configuration
│   ├── 📄 postcss.config.js              # PostCSS configuration
│   ├── 📄 eslint.config.js               # ESLint configuration
│   ├── 📄 .eslintrc.json                 # ESLint rules
│   ├── 📄 vercel.json                    # Vercel deployment config
│   ├── 📄 index.html                     # Root HTML template
│   └── 📄 cleanup-duplicates.js          # Cleanup script
│
├── 📁 DOCUMENTATION
│   ├── 📄 README.md                      # Project overview
│   ├── 📄 ROADMAP.md                     # Development roadmap
│   ├── 📄 CHANGELOG.md                   # Version history
│   ├── 📄 database-architecture.md       # Database design docs
│   ├── 📄 complete-database-tree.md      # Complete tree structure
│   ├── 📄 database-tree-ascii.md        # ASCII tree visualization
│   ├── 📄 logical-schema-flow.md         # Schema flow documentation
│   └── 📄 deploy-functions.md            # Deployment guide
│
├── 📁 DATABASE SCHEMAS & MIGRATIONS
│   ├── 📄 database-setup.sql             # Initial database setup
│   ├── 📄 comprehensive-database-fix.sql  # Complete schema fix
│   ├── 📄 clean-logical-schema.sql       # Clean logical schema
│   ├── 📄 fix-database-schema.sql        # Schema type fixes
│   ├── 📄 fix-admin-users-rls.sql        # Admin users RLS fix
│   ├── 📄 immediate-fix.sql               # Immediate RLS fix
│   ├── 📄 cleanup-duplicates.sql         # Duplicate cleanup
│   └── 📄 cleanup-supabase.js            # Supabase cleanup script
│
├── 📁 BUILD OUTPUT
│   └── 📁 build/
│       ├── 📄 index.html                 # Built HTML
│       └── 📁 assets/
│           ├── 📄 index-C-TRKHmS.css     # Built CSS
│           └── 📄 index-bi9GMQbu.js      # Built JavaScript
│
├── 📁 SOURCE CODE
│   └── 📁 src/
│       ├── 📄 main.tsx                   # Application entry point
│       ├── 📄 App.tsx                    # Main App component
│       ├── 📄 index.css                  # Global styles
│       ├── 📄 index.html                 # Dev HTML template
│       ├── 📄 tsconfig.json              # TypeScript configuration
│       └── 📄 vite.config.ts             # Vite configuration
│       │
│       ├── 📁 COMPONENTS
│       │   ├── 📄 AdminLayout.tsx         # Admin layout wrapper
│       │   ├── 📄 AuthPage.tsx            # Authentication page
│       │   ├── 📄 BillingPage.tsx         # Billing management
│       │   ├── 📄 Dashboard.tsx           # Main dashboard
│       │   ├── 📄 FulfillmentPage.tsx     # Fulfillment management
│       │   ├── 📄 InventoryPageSimple.tsx # Inventory management
│       │   ├── 📄 MarketingIntegration.tsx # Marketing tools
│       │   ├── 📄 MembersPage.tsx         # Member management
│       │   ├── 📄 PlansPage.tsx           # Plan management
│       │   ├── 📄 ShipmentBuilderPage.tsx # Shipment builder
│       │   ├── 📄 ShippingSchedulePage.tsx # Shipping schedules
│       │   ├── 📄 SquareConfigPage.tsx    # Square configuration
│       │   ├── 📄 SuperadminDashboard.tsx # SaaS admin dashboard
│       │   ├── 📄 SuperadminLayout.tsx    # SaaS admin layout
│       │   └── 📄 WelcomeToast.tsx        # Welcome notifications
│       │   │
│       │   ├── 📁 SAAS ADMIN COMPONENTS
│       │   │   ├── 📄 ClubsOrganizationsPage.tsx # Wine club management
│       │   │   ├── 📄 ClubsShipmentProfilesPage.tsx # Shipment profiles
│       │   │   └── 📄 ClubsUsersPage.tsx  # User management
│       │   │
│       │   ├── 📁 CUSTOMER COMPONENTS
│       │   │   ├── 📄 CustomerPreferencesPage.tsx # Customer preferences
│       │   │   ├── 📄 CustomerWineSelection.tsx # Wine selection
│       │   │   └── 📄 EmbeddableSignup.tsx # Embeddable signup widget
│       │   │
│       │   ├── 📁 EMBEDDABLE WIDGETS
│       │   │   ├── 📄 EmbeddableSignup.tsx # Main signup widget
│       │   │   └── 📄 EmbeddableSignupPage.tsx # Signup page
│       │   │
│       │   ├── 📁 CUSTOMER FLOW COMPONENTS
│       │   │   └── 📁 customer/
│       │   │       ├── 📄 BonusUpsell.tsx  # Bonus wine upsell
│       │   │       ├── 📄 DeliveryDateConfirmation.tsx # Delivery confirmation
│       │   │       ├── 📄 PaymentCollection.tsx # Payment collection
│       │   │       └── 📄 WineSelectionReview.tsx # Wine selection review
│       │   │
│       │   ├── 📁 FIGMA COMPONENTS
│       │   │   └── 📁 figma/
│       │   │       └── 📄 ImageWithFallback.tsx # Image with fallback
│       │   │
│       │   └── 📁 UI COMPONENTS (Shadcn/ui)
│       │       └── 📁 ui/
│       │           ├── 📄 accordion.tsx    # Accordion component
│       │           ├── 📄 alert-dialog.tsx # Alert dialog
│       │           ├── 📄 alert.tsx        # Alert component
│       │           ├── 📄 aspect-ratio.tsx # Aspect ratio
│       │           ├── 📄 avatar.tsx       # Avatar component
│       │           ├── 📄 badge.tsx        # Badge component
│       │           ├── 📄 breadcrumb.tsx   # Breadcrumb navigation
│       │           ├── 📄 button.tsx       # Button component
│       │           ├── 📄 calendar.tsx     # Calendar component
│       │           ├── 📄 card.tsx         # Card component
│       │           ├── 📄 carousel.tsx     # Carousel component
│       │           ├── 📄 chart.tsx        # Chart component
│       │           ├── 📄 checkbox.tsx     # Checkbox component
│       │           ├── 📄 collapsible.tsx   # Collapsible component
│       │           ├── 📄 command.tsx      # Command component
│       │           ├── 📄 context-menu.tsx  # Context menu
│       │           ├── 📄 dialog.tsx        # Dialog component
│       │           ├── 📄 drawer.tsx        # Drawer component
│       │           ├── 📄 dropdown-menu.tsx # Dropdown menu
│       │           ├── 📄 form.tsx          # Form component
│       │           ├── 📄 hover-card.tsx    # Hover card
│       │           ├── 📄 input-otp.tsx    # OTP input
│       │           ├── 📄 input.tsx         # Input component
│       │           ├── 📄 label.tsx         # Label component
│       │           ├── 📄 menubar.tsx       # Menu bar
│       │           ├── 📄 navigation-menu.tsx # Navigation menu
│       │           ├── 📄 pagination.tsx    # Pagination
│       │           ├── 📄 popover.tsx       # Popover component
│       │           ├── 📄 progress.tsx       # Progress bar
│       │           ├── 📄 radio-group.tsx   # Radio group
│       │           ├── 📄 resizable.tsx     # Resizable component
│       │           ├── 📄 scroll-area.tsx  # Scroll area
│       │           ├── 📄 select.tsx        # Select component
│       │           ├── 📄 separator.tsx      # Separator
│       │           ├── 📄 sheet.tsx         # Sheet component
│       │           ├── 📄 sidebar.tsx        # Sidebar
│       │           ├── 📄 skeleton.tsx      # Skeleton loader
│       │           ├── 📄 slider.tsx        # Slider component
│       │           ├── 📄 sonner.tsx        # Toast notifications
│       │           ├── 📄 switch.tsx        # Switch component
│       │           ├── 📄 table.tsx         # Table component
│       │           ├── 📄 tabs.tsx          # Tabs component
│       │           ├── 📄 textarea.tsx       # Textarea component
│       │           ├── 📄 toggle-group.tsx   # Toggle group
│       │           ├── 📄 toggle.tsx         # Toggle component
│       │           ├── 📄 tooltip.tsx        # Tooltip component
│       │           ├── 📄 use-mobile.ts      # Mobile hook
│       │           └── 📄 utils.ts           # Utility functions
│       │
│       ├── 📁 CONTEXTS
│       │   └── 📄 ClientContext.tsx        # Client context provider
│       │
│       └── 📁 UTILITIES
│           ├── 📄 api.ts                   # API utility functions
│           ├── 📄 client-env.ts            # Client environment
│           ├── 📄 env.ts                   # Environment variables
│           └── 📁 supabase/
│               └── 📄 info.tsx             # Supabase project info
│
├── 📁 SUPABASE BACKEND
│   └── 📁 supabase/
│       ├── 📄 config.toml                  # Supabase configuration
│       └── 📁 functions/
│           └── 📁 make-server-9d538b9c/
│               ├── 📄 index.tsx            # Main Edge Function
│               ├── 📄 database-setup.tsx   # Database setup
│               ├── 📄 email-service.tsx    # Email service
│               ├── 📄 env-status.tsx        # Environment status
│               ├── 📄 env.tsx               # Environment config
│               ├── 📄 kv_store.tsx         # Key-value store
│               ├── 📄 square-helpers.tsx   # Square API helpers
│               └── 📄 square-live-inventory.tsx # Square inventory
│
└── 📁 TESTING & REPORTS
    └── 📁 testsprite_tests/
        ├── 📄 standard_prd.json            # Standard PRD
        ├── 📄 testsprite-mcp-test-report.html # Test report HTML
        ├── 📄 testsprite-mcp-test-report.md # Test report Markdown
        ├── 📄 testsprite_frontend_test_plan.json # Frontend test plan
        └── 📁 tmp/
            ├── 📄 code_summary.json        # Code summary
            ├── 📄 config.json              # Test configuration
            ├── 📄 raw_report.md            # Raw test report
            ├── 📄 test_results.json         # Test results
            └── 📁 prd_files/
                ├── 📄 README.md            # PRD README
                └── 📄 ROADMAP.md           # PRD Roadmap
```

## 📊 MONOREPO STRUCTURE BREAKDOWN

### **🏗️ ARCHITECTURE LAYERS**

#### **1. ROOT CONFIGURATION (9 files)**
- **Build Tools**: Vite, Tailwind, PostCSS, ESLint
- **Deployment**: Vercel configuration
- **Dependencies**: package.json, package-lock.json
- **Cleanup**: Duplicate cleanup scripts

#### **2. DOCUMENTATION (8 files)**
- **Project Docs**: README, ROADMAP, CHANGELOG
- **Database Docs**: Architecture, tree structures, schema flows
- **Deployment**: Function deployment guides

#### **3. DATABASE SCHEMAS (8 files)**
- **Setup**: Initial database setup
- **Fixes**: Schema type fixes, RLS fixes
- **Cleanup**: Duplicate cleanup, immediate fixes
- **Logical**: Clean logical schema

#### **4. BUILD OUTPUT (3 files)**
- **Production**: Built HTML, CSS, JavaScript
- **Assets**: Optimized static assets

#### **5. SOURCE CODE (80+ files)**
- **Main App**: Entry point, main component
- **Components**: 25+ React components
- **UI Library**: 40+ Shadcn/ui components
- **Contexts**: Client context provider
- **Utilities**: API, environment, Supabase utilities

#### **6. SUPABASE BACKEND (8 files)**
- **Edge Functions**: 7 serverless functions
- **Configuration**: Supabase config
- **Services**: Database, email, Square integration

#### **7. TESTING & REPORTS (10 files)**
- **TestSprite**: Automated testing reports
- **PRD**: Product requirements documents
- **Test Plans**: Frontend test plans

## 🎯 KEY FEATURES BY DIRECTORY

### **📁 src/components/**
- **Admin Components**: Layout, dashboard, management pages
- **Customer Components**: Preferences, wine selection, signup
- **SaaS Admin**: Multi-tenant wine club management
- **UI Components**: Complete Shadcn/ui library
- **Customer Flow**: Complete customer journey components

### **📁 supabase/functions/**
- **Database**: Setup and management
- **Email**: Transactional email service
- **Square**: API integration and inventory
- **KV Store**: Key-value storage
- **Environment**: Configuration management

### **📁 testsprite_tests/**
- **Automated Testing**: Frontend test execution
- **Reports**: Comprehensive test reports
- **PRD**: Product requirements documentation
- **Test Plans**: Detailed test scenarios

## 🚀 DEVELOPMENT WORKFLOW

### **1. LOCAL DEVELOPMENT**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
```

### **2. DATABASE MANAGEMENT**
```bash
# Run schema fixes in Supabase SQL Editor
comprehensive-database-fix.sql
clean-logical-schema.sql
```

### **3. TESTING**
```bash
# Run TestSprite automated tests
testsprite_tests/standard_prd.json
testsprite_tests/testsprite_frontend_test_plan.json
```

### **4. DEPLOYMENT**
```bash
# Deploy to Vercel
vercel deploy
```

## 📈 MONOREPO BENEFITS

### **✅ ORGANIZED STRUCTURE**
- **Clear separation** of concerns
- **Logical grouping** of related files
- **Easy navigation** and maintenance

### **✅ SCALABLE ARCHITECTURE**
- **Modular components** for easy extension
- **Reusable UI library** (Shadcn/ui)
- **Clean API layer** for backend integration

### **✅ COMPREHENSIVE TESTING**
- **Automated testing** with TestSprite
- **Comprehensive reports** and documentation
- **PRD-driven development**

### **✅ PRODUCTION READY**
- **Build optimization** with Vite
- **Deployment configuration** for Vercel
- **Database schema** management
- **Edge functions** for serverless backend

## 🎯 RESULT

This monorepo provides:
- **Complete Wine Club SaaS platform**
- **Multi-tenant architecture**
- **Comprehensive testing suite**
- **Production-ready deployment**
- **Scalable and maintainable codebase**
