# Wine Club SaaS Platform

## Overview

A comprehensive SaaS platform for wine clubs integrated with Square API. This platform enables wine club owners to manage memberships, shipments, payments, and customer preferences through a modern web interface.

## Architecture

**Technology Stack:**
- **Frontend**: Vite + React + TypeScript
- **UI Components**: Shadcn/ui + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **API Integration**: Square API (Payments, Customers, Inventory)
- **Email Service**: Resend
- **Deployment**: Vercel

## Project Structure

```
wine-club-saas-current/
├── src/
│   ├── components/           # React components
│   │   ├── ui/              # Shadcn/ui components
│   │   ├── customer/        # Customer-facing components
│   │   └── *.tsx           # Admin components
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

## Key Features

### Wine Club Management
- **Multi-tenant SaaS architecture** - Each wine club has isolated data
- **Square API integration** - Real-time inventory, customers, payments
- **Member management** - Signup, preferences, payment methods
- **Plan management** - Flexible subscription plans with Square groups
- **Shipment builder** - Create custom wine selections
- **Customer portal** - Self-service wine selection and preferences

### Admin Dashboard
- **Real-time metrics** - Member counts, plan distribution, inventory
- **Club setup wizard** - Multi-step configuration process
- **Square configuration** - API credentials and category selection
- **Global preferences** - Wine category groupings
- **Inventory management** - Opt-out wines from shipments

### Customer Experience
- **Embedded signup** - Seamless integration with Square sites
- **Wine selection process** - Interactive wine swapping and filtering
- **Delivery scheduling** - Flexible delivery date selection
- **Payment processing** - Square Web Payments integration
- **Email notifications** - Resend-powered transactional emails

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account
- Square Developer account
- Resend account (for emails)

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
   - Configure Supabase, Square, and Resend credentials

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Open `http://localhost:3000`
   - Use admin credentials or sign up as a new wine club

## Square API Integration

### Key Integration Points
1. **Inventory Management** - Real-time wine catalog from Square
2. **Customer Management** - Square customer groups for plan management
3. **Payment Processing** - Square Web Payments for subscriptions
4. **Order Management** - Shipment creation and tracking

### Configuration
- Square Location ID and Access Token stored per wine club
- Customer segments created for each subscription plan
- Payment methods stored in Square customer profiles

## SaaS Architecture

### Multi-Tenancy
- Each wine club has isolated data in Supabase
- Square credentials stored per wine club
- Global preferences and plans scoped to wine club
- Member data associated with specific wine club

### Data Flow
1. **Wine Club Setup** → Square credentials → Category selection
2. **Member Signup** → Square customer creation → Plan assignment
3. **Shipment Creation** → Wine selection → Square order creation
4. **Payment Processing** → Square payment → Database record

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

**Note**: This is a SaaS platform designed for multiple wine clubs. King Frosch Wine Club is the initial client for testing and validation.