# 🍷 Wine Club SaaS - Project Status

**Version:** 1.0.0  
**Last Updated:** October 10, 2025  
**Environment:** Production-only Square API integration

---

## 📊 Current Implementation Status

### ✅ Completed Features

**Admin Portal (10 Pages)**
- Dashboard with metrics and analytics
- Members management (view, edit, filter)
- Live inventory from Square Production API
- Subscription plans (Gold/Silver/Platinum)
- Customer preferences management
- Shipment builder with wine assignment
- Client setup wizard for Square configuration
- Square authentication diagnostic tool
- Superadmin dashboard (multi-tenant placeholder)
- Marketing integration (placeholder for future)

**Customer Portal (4 Steps)**
- Wine selection review with swap modal
- Bonus upsell interface
- Delivery date confirmation
- Payment method collection

**System Features**
- Demo mode with 24 sample wines
- Production-only Square API integration
- Comprehensive error handling
- Mobile-responsive design
- Wine-themed UI (#722f37 deep maroon)

---

## 🟦 Square API Integration

### Overview
The application uses **Square Production API exclusively** for all wine catalog and customer data. This eliminates environment switching complexity and ensures live, accurate inventory data.

### Square API Architecture

**Integration Approach: Live Inventory**
- Square is the single source of truth for wine data
- No local storage of wine names, prices, images, or descriptions
- Only Square item IDs are stored when wines are assigned to shipments
- Real-time fetching on every inventory view

**Benefits:**
- Always current with Square catalog updates
- No data sync issues or stale information
- Automatic price and inventory updates
- Simplified database schema

### Square API Files

#### Backend (Supabase Edge Functions)

**`/supabase/functions/server/square-live-inventory.tsx`**
- **Purpose:** Fetches live wine inventory from Square Production catalog
- **Endpoints:**
  - `GET /square/live-inventory/:wineClubId` - Returns wines with filters
  - `GET /square/debug/:wineClubId` - Connection testing and diagnostics
  - `GET /square/health/:wineClubId` - Quick health check
- **Data Returned:**
  - Wine items with variations (sizes, prices)
  - Categories (excluding "Uncategorized")
  - Images from Square catalog
  - Total inventory counts
- **Key Functions:**
  - `getSquareConfig()` - Loads Square credentials (production only)
  - `parseSquareCatalog()` - Transforms Square API response to app format
  - `getCustomAttribute()` - Extracts wine attributes (varietal, sweetness, color)

**`/supabase/functions/server/square-helpers.tsx`**
- **Purpose:** Square payment and order processing utilities (future payment integration)
- **Functions:**
  - `listCustomers()` - Fetch Square customers for import
  - `listCustomerSegments()` - Get customer groups (Gold/Silver/Platinum)
  - `getCustomerSegment()` - Retrieve specific segment details
  - `createWineClubShipment()` - Generate Square order from shipment
  - Payment processing utilities (planned)
- **Status:** Ready for payment integration, not yet connected to frontend

**`/supabase/functions/server/index.tsx`**
- **Purpose:** Main Hono server with route definitions
- **Square Routes:**
  - `/square/live-inventory/:wineClubId` - Proxied to square-live-inventory.tsx
  - `/square/customers` - List all Square customers
  - `/square/segments` - Get customer segments
  - `/square/segments/:segmentId` - Get specific segment
  - `/square/create-shipment` - Create order in Square

#### Frontend

**`/utils/api.ts`**
- **Purpose:** Frontend API wrapper for all backend calls
- **Square Functions:**
  - `getLiveInventory(wineClubId, category, limit)` - Fetch wines from Square
  - Returns: `{ wines[], availableCategories[], totalItems, source, environment, message, isDemoMode? }`
- **Demo Mode Handling:**
  - Automatically falls back to demo data if Square API returns error
  - Shows banner in admin UI when in demo mode
  - Provides refresh button to retry Square connection

#### Components Using Square API

**`/components/InventoryPageSimple.tsx`**
- Displays paginated wine inventory (24 items per page)
- Filters by category
- Shows wine images, names, prices, inventory counts
- Excludes "Uncategorized" wines

**`/components/Dashboard.tsx`**
- Fetches inventory count for dashboard metrics
- Displays total wine count in statistics card

**`/components/ShipmentBuilderPage.tsx`**
- Loads available wines for assignment
- Filters wines when assigning to customers
- Uses wine data in shipment builder interface

**`/components/CustomerPreferencesPage.tsx`**
- Loads Square categories for preference selection
- Displays available wine categories from catalog

**`/components/SimpleSetupPage.tsx`**
- Tests Square API connection
- Displays connection status and error messages
- Shows environment (production) and item count on success

**`/components/SquareAuthDiagnostic.tsx`**
- Comprehensive Square API troubleshooting
- Tests authentication with detailed error analysis
- Provides step-by-step fix instructions

### Square API Configuration

**Required Environment Variables:**
```bash
SQUARE_ACCESS_TOKEN=EAAAl...     # Production access token
SQUARE_LOCATION_ID=L123...       # Primary location ID
```

**Configuration Steps:**
1. Get credentials from [Square Developer Dashboard](https://developer.squareup.com/)
2. Add to Supabase environment variables or Figma Make secrets
3. Test connection via "Client Setup" page in admin portal
4. Verify with "Square Diagnostic" page if issues occur

### Square API Response Format

**Catalog List Response:**
```json
{
  "objects": [
    {
      "type": "ITEM",
      "id": "ITEM_ID",
      "item_data": {
        "name": "Wine Name",
        "description": "Wine description",
        "categories": [{ "id": "CATEGORY_ID" }],
        "image_ids": ["IMAGE_ID"],
        "variations": [
          {
            "id": "VARIATION_ID",
            "item_variation_data": {
              "name": "750ml",
              "price_money": { "amount": 2999 },
              "inventory_count": 24
            }
          }
        ]
      }
    },
    {
      "type": "CATEGORY",
      "id": "CATEGORY_ID",
      "category_data": { "name": "Red Wine" }
    },
    {
      "type": "IMAGE",
      "id": "IMAGE_ID",
      "image_data": { "url": "https://..." }
    }
  ]
}
```

**App Transformed Format:**
```json
{
  "wines": [
    {
      "square_item_id": "ITEM_ID",
      "name": "Wine Name",
      "category_name": "Red Wine",
      "image_url": "https://...",
      "description": "Wine description",
      "varietal": "Cabernet",
      "sweetness": "Dry",
      "color": "Red",
      "variations": [
        {
          "id": "VARIATION_ID",
          "name": "750ml",
          "price": 2999,
          "inventory_count": 24
        }
      ],
      "total_inventory": 24
    }
  ],
  "availableCategories": ["Red Wine", "White Wine", "Rosé"],
  "totalItems": 42,
  "source": "square_production",
  "environment": "production"
}
```

---

## ⏳ Pending: Customer Embedded Flow

### Overview
The customer-facing experience will be delivered via **embedded scripts** on the wine club's Square website, allowing seamless integration without redirecting users to a separate domain.

### Required Setup: Two Authorized Domains

Each wine club will need to authorize **two domains** in the Square application settings:

1. **Square Subdomain** - For testing and Square Online Store integration
   - Example: `kingfrosch.square.site`
   - Used during initial setup and development

2. **Custom Domain** - For production customer experience
   - Example: `club.kingfroschwines.com` or `www.kingfroschwines.com`
   - Used for final customer-facing embedded scripts

**Why Two Domains?**
- Square Online Store has built-in subdomain
- Custom domain provides professional branding
- Both need CORS authorization for embedded scripts to work

### Embedded Script 1: Wine Club Signup

**Purpose:** Allow customers to join the wine club directly from the winery's website

**User Flow:**
1. Customer visits winery website
2. Clicks "Join Wine Club" button (embedded widget)
3. **Signup Modal Opens:**
   - Select subscription plan (Gold/Silver/Platinum)
   - Enter personal information (name, email, phone)
   - Set wine preferences (categories, quantities)
   - Enter payment method via Square Web Payments SDK
4. **Account Creation:**
   - Creates Supabase user account (auth)
   - Stores member record in database
   - Creates Square customer profile
   - Saves payment method on file in Square
5. **Confirmation:**
   - Welcome message with next shipment date
   - Email confirmation sent
   - Access to member portal

**Technical Implementation:**
```html
<!-- Embedded on winery website -->
<script src="https://wine-club-app.vercel.app/embed/signup.js"></script>
<div id="wine-club-signup" data-club-id="king-frosch"></div>
```

**Free Signup with Payment Method:**
- No charge at signup (free to join)
- Payment method required and stored for future shipments
- First charge occurs when customer approves first shipment
- Square securely stores payment token (PCI compliant)

### Embedded Script 2: Member Login Portal

**Purpose:** Allow existing members to log in and manage their preferences

**User Flow:**
1. Customer clicks "Member Login" on website
2. **Login Modal Opens:**
   - Enter email and password
   - Or use magic link (passwordless)
   - Supabase authentication
3. **Member Portal Dashboard:**
   - View current subscription plan
   - See wine preferences
   - View upcoming shipment date
   - Modify preferences if needed
   - View past receipts/order history
   - Cancel subscription (with confirmation)
4. **Preference Management:**
   - Update category selections (Red/White/Rosé/etc.)
   - Change quantities per category
   - Modify delivery address
   - Update payment method

**Technical Implementation:**
```html
<!-- Embedded on winery website -->
<script src="https://wine-club-app.vercel.app/embed/login.js"></script>
<div id="wine-club-login" data-club-id="king-frosch"></div>
```

**Portal Features:**
- **Preferences:** Adjust wine categories and quantities
- **Receipts:** View past shipment invoices (from Square)
- **Subscription:** View plan details, pause, or cancel
- **Payment Method:** Update credit card on file
- **Delivery Address:** Manage shipping addresses

### Embedded Script 3: Wine Selection (No-Login)

**Purpose:** Allow customers to approve/modify shipments via email link without logging in

**User Flow:**
1. Admin schedules shipment in admin portal
2. **Email Sent to Customer:**
   - Unique tokenized link (e.g., `https://club.kingfrosch.com/approve?token=abc123`)
   - No login required (token provides authentication)
   - Link expires after shipment confirmed or deadline passes
3. **Wine Selection Page Opens:**
   - Shows assigned wines for upcoming shipment
   - Displays wine images, names, descriptions, prices
   - Shows member discount applied
   - Total price calculated
4. **Customer Actions:**
   - ✅ **Approve Selection** - Proceed with assigned wines
   - 🔄 **Swap Wines** - Open modal to choose different wines
     - Filter by color (Red/White/Rosé)
     - Filter by sweetness (Dry/Semi-Sweet/Sweet)
     - Shows wines matching preferences pre-selected
     - Select replacement wines
   - ➕ **Add Bonus Bottles** - Upsell opportunity with member discount
5. **Delivery Confirmation:**
   - Select preferred delivery date (from available options)
   - Confirm shipping address
6. **Payment Processing:**
   - If payment method on file: Charge automatically
   - If no payment method: Show Square payment form
   - Apply member discount
   - Display final total
7. **Confirmation:**
   - Order confirmed in Square
   - Confirmation email sent
   - Admin can export shipment to CSV for fulfillment

**Technical Implementation:**
```html
<!-- Embedded page (accessed via email link) -->
<script src="https://wine-club-app.vercel.app/embed/selection.js"></script>
<div id="wine-selection" data-token="abc123"></div>
```

**Security:**
- Unique token per customer per shipment
- Token includes customer ID and shipment ID (encrypted)
- Token expires after confirmation or deadline
- No sensitive data exposed in URL

### Implementation Status

**✅ Built (Not Yet Embedded):**
- Wine selection review interface
- Bonus upsell modal
- Delivery date confirmation
- Payment collection form

**⏳ Pending Development:**
- Embeddable script generation
- CORS configuration for custom domains
- Token-based authentication for no-login flow
- Email template with tokenized links
- Square domain authorization setup

**📋 Required for Launch:**
1. Generate embed code for each script type
2. Add domain authorization in Square Developer Dashboard
3. Configure CORS headers for customer domains
4. Set up email service (Square Marketing API or SendGrid)
5. Test embedded widgets on Square Online Store
6. Test embedded widgets on custom domain
7. Implement token expiration logic
8. Add analytics tracking for embedded flows

### Domain Setup Guide (For Wine Clubs)

**Step 1: Authorize Domains in Square**
1. Go to Square Developer Dashboard
2. Select your application
3. Navigate to OAuth → Redirect URLs
4. Add both domains:
   - `https://yourclub.square.site`
   - `https://www.yourcustomdomain.com`

**Step 2: Configure Custom Domain**
1. Point DNS records to application server
2. Add SSL certificate (automatic with Vercel)
3. Test CORS with embedded scripts

**Step 3: Embed Scripts on Website**
1. Add signup widget to homepage
2. Add member login to header/footer
3. Configure email template with selection link

---

## 🎯 Next Milestones

### Immediate (Week 1-2)
- [ ] Complete Square payment processing integration
- [ ] Implement order creation workflow
- [ ] Build email notification system

### Short-term (Week 3-4)
- [ ] Create embeddable script framework
- [ ] Implement token-based authentication
- [ ] Set up email templates with approval links
- [ ] Test on Square Online Store subdomain

### Medium-term (Month 2)
- [ ] Configure custom domain support
- [ ] Add SMS notification option
- [ ] Build CSV export for shipping labels
- [ ] Implement analytics tracking

### Long-term (Month 3+)
- [ ] Multi-tenant billing system
- [ ] Advanced analytics dashboard
- [ ] Square Marketplace app submission
- [ ] White-label branding options

---

## 🐛 Known Issues

**Demo Mode Behavior:**
- When Square API is not configured, app falls back to demo mode
- Demo mode shows 24 sample wines (not from Square)
- Red banner appears at top of admin portal
- "Fix Authentication" button redirects to Square Diagnostic page

**Resolution:** Configure Square credentials in "Client Setup" page

---

## 📞 Support

**For Square API Issues:**
- Use "Square Diagnostic" page in admin portal
- Check environment variables in Vercel/Supabase dashboard
- Verify token is Production (not Sandbox)

**For Development Questions:**
- See README.md for detailed setup guide
- Review repository structure for file purposes
- Check inline comments in code

---

**Last Updated:** October 10, 2025  
**Next Review:** After customer embedded flow completion
