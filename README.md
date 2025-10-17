# Wine Club SaaS Platform

## Overview

A comprehensive **multi-tenant SaaS platform** for wine clubs that integrates with Square API to provide end-to-end wine club management. This platform enables wine club owners to manage memberships, create subscription plans, build shipments, and process payments while providing customers with an intuitive wine selection and delivery experience.

## Platform Purpose

### **For Wine Club Owners (Admin Portal)**
- **Multi-tenant architecture** - Each wine club operates independently with isolated data
- **Square API integration** - Real-time inventory, customer management, and payment processing
- **Member management** - Complete lifecycle from signup to shipment delivery
- **Plan management** - Flexible subscription tiers with automatic Square customer group creation
- **Shipment builder** - Intelligent wine assignment based on customer taste preferences
- **Analytics dashboard** - Real-time metrics on members, plans, and revenue

### **For Wine Club Members (Customer Portal)**
- **Embedded signup widget** - Seamless integration with Square-powered websites
- **Interactive wine selection** - Swap wines, filter by preferences, and customize shipments
- **Flexible delivery** - Choose delivery dates and manage shipping preferences
- **Payment management** - Secure payment processing through Square
- **Order history** - Track past shipments and manage preferences

### **For SaaS Platform Administrators**
- **Multi-club management** - Oversee multiple wine clubs from a single dashboard
- **User management** - Create and manage admin users across all wine clubs
- **Billing integration** - Stripe integration for platform subscription management
- **Analytics & reporting** - Platform-wide metrics and performance insights

## Applications & Components

### **1. Admin Portal** (`/admin`)
**Purpose**: Wine club management dashboard for club owners and staff

**Key Features**:
- **Dashboard** - Real-time metrics, member distribution, plan analytics
- **Members Management** - Add/edit members, assign plans, sync with Square
- **Plans Management** - Create subscription tiers, manage Square customer groups
- **Club Setup** - Multi-step wizard for Square integration and preferences
- **Inventory Management** - Opt-out wines, manage wine categories
- **Shipment Builder** - Create shipments, assign wines to member preferences
- **Marketing Integration** - Email campaigns, member communication

### **2. Customer Portal** (`/customer`)
**Purpose**: Self-service portal for wine club members

**Key Features**:
- **Wine Selection Process** - Interactive wine swapping and filtering
- **Delivery Scheduling** - Choose delivery dates and manage preferences
- **Payment Collection** - Secure payment processing and method management
- **Order History** - View past shipments and track delivery status
- **Preference Management** - Update wine preferences and subscription settings

### **3. SaaS Admin Portal** (`/superadmin`)
**Purpose**: Platform management for SaaS administrators

**Key Features**:
- **Organizations Dashboard** - Manage all wine clubs and their metrics
- **Users Management** - Create admin users, manage permissions
- **Billing Management** - Stripe integration for platform subscriptions
- **Settings** - Platform configuration and system settings

### **4. Embedded Widget** (`/signup`)
**Purpose**: Embeddable signup widget for Square websites

**Key Features**:
- **Seamless Integration** - Embed directly into Square-powered websites
- **Plan Selection** - Visual plan comparison and selection
- **Wine Preview** - Preview the wine selection process
- **Mobile Responsive** - Optimized for all device sizes

## Architecture

**Technology Stack:**
- **Frontend**: Vite + React + TypeScript
- **UI Components**: Shadcn/ui + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **API Integration**: Square API (Payments, Customers, Inventory)
- **Email Service**: Supabase Auth (magic links, verification)
- **Deployment**: Vercel

## Project Structure

```
wine-club-saas-current/
├── src/
│   ├── components/           # React components
│   │   ├── ui/              # Shadcn/ui components
│   │   ├── customer/        # Customer-facing components
│   │   └── *.tsx           # Admin components
│   ├── contexts/            # React contexts (ClientContext)
│   ├── supabase/
│   │   └── functions/server/ # Edge Functions
│   ├── utils/               # API utilities
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Vite entry point
│   └── index.html          # HTML template
├── package.json            # Dependencies
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
├── README.md               # This file
├── ROADMAP.md              # Development roadmap
└── CHANGELOG.md            # Change log
```

## Multi-Tenant Architecture

### **Wine Club Clients**
- **Wine Club #1** - King Frosch Wine Club (ID: "1")
- **Wine Club #2** - Future client (ID: "2")
- **Wine Club #3** - Future client (ID: "3")

### **Data Isolation**
- Each wine club has isolated data in Supabase
- Square credentials stored per wine club
- Global preferences and plans scoped to wine club
- Member data associated with specific wine club
- RLS (Row Level Security) policies ensure data separation

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account
- Square Developer account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/creatorstudioshq/wine-club-saas-current.git
   cd wine-club-saas-current
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   - Copy `.env.example` to `.env.local`
   - Configure Supabase and Square credentials

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Open `http://localhost:3000`
   - Use demo credentials or sign up as a new wine club

## Square API Integration

### Key Integration Points
1. **Inventory Management** - Real-time wine catalog from Square
2. **Customer Management** - Square customer groups for plan management
3. **Payment Processing** - Square Web Payments for subscriptions
4. **Order Management** - Shipment creation and tracking

### Configuration
- Square Location ID and Access Token stored per wine club
- Customer groups created in Square when plans are created
- Payment methods stored in Square customer profiles
- Payments processed through Square for each wine shipment

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Structure
- **Components**: Reusable UI components in `/src/components`
- **Pages**: Main application pages (Dashboard, Members, etc.)
- **Utils**: API calls and utility functions
- **Supabase**: Edge Functions for backend logic
- **Contexts**: React contexts for state management

## Deployment

The application is deployed on Vercel with automatic deployments from the main branch.

**Live Site**: `square-wine-club.vercel.app`

## Contributing

1. Read the ROADMAP.md for current development priorities
2. Follow the existing code structure and patterns
3. Test all Square API integrations thoroughly
4. Update CHANGELOG.md for significant changes

## License

[Add license information here]

---

**Note**: This is a SaaS platform designed for multiple wine clubs. King Frosch Wine Club (Wine Club #1) is the initial client for testing and validation.