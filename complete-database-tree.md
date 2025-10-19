# COMPLETE WINE CLUB SAAS DATABASE TREE STRUCTURE

## 🏗️ FULL HIERARCHICAL TREE VIEW

```
WINE CLUBS (Root Entity - VARCHAR(50) ID)
├── 📊 SUBSCRIPTION PLANS (UUID ID)
│   ├── 👥 MEMBERS (UUID ID)
│   │   ├── 🍷 CUSTOM PREFERENCES (UUID ID)
│   │   └── 📦 MEMBER SELECTIONS (UUID ID)
│   ├── 🎯 PLAN PREFERENCE MATRIX (UUID ID)
│   └── 🍾 PLAN WINE ASSIGNMENTS (UUID ID)
├── 📦 SHIPMENTS (UUID ID)
│   ├── 📋 SHIPMENT ITEMS (UUID ID)
│   └── 📦 MEMBER SELECTIONS (UUID ID) [Shared with Members]
├── 🌍 GLOBAL PREFERENCES (UUID ID)
├── 👨‍💼 ADMIN USERS (UUID ID)
└── 🔑 KV STORE (TEXT Key)
```

## 📊 DETAILED TABLE STRUCTURE

### **LEVEL 1: WINE CLUBS (Root Entity)**
```
wine_clubs
├── id: VARCHAR(50) [PRIMARY KEY] - Sequential: "1", "2", "3"...
├── name: VARCHAR(255)
├── email: VARCHAR(255)
├── domain: VARCHAR(255)
├── square_location_id: VARCHAR(255)
├── square_access_token: VARCHAR(255)
├── branding_logo_url: TEXT
├── created_at: TIMESTAMP WITH TIME ZONE
└── updated_at: TIMESTAMP WITH TIME ZONE
```

### **LEVEL 2: DIRECT FROM WINE CLUBS**

#### **SUBSCRIPTION PLANS**
```
subscription_plans
├── id: UUID [PRIMARY KEY]
├── wine_club_id: VARCHAR(50) [FK → wine_clubs.id]
├── name: VARCHAR(255)
├── bottle_count: INTEGER
├── frequency: VARCHAR(255)
├── discount_percentage: NUMERIC
├── description: TEXT
├── square_segment_id: VARCHAR(255)
├── created_at: TIMESTAMP WITH TIME ZONE
└── updated_at: TIMESTAMP WITH TIME ZONE
```

#### **MEMBERS**
```
members
├── id: UUID [PRIMARY KEY]
├── wine_club_id: VARCHAR(50) [FK → wine_clubs.id]
├── subscription_plan_id: UUID [FK → subscription_plans.id]
├── email: VARCHAR(255)
├── name: VARCHAR(255)
├── square_customer_id: VARCHAR(255)
├── last_payment_method: VARCHAR(255)
├── status: VARCHAR(255)
├── created_at: TIMESTAMP WITH TIME ZONE
└── updated_at: TIMESTAMP WITH TIME ZONE
```

#### **SHIPMENTS**
```
shipments
├── id: UUID [PRIMARY KEY]
├── wine_club_id: VARCHAR(50) [FK → wine_clubs.id]
├── member_id: UUID [FK → members.id]
├── shipment_date: DATE
├── status: VARCHAR(255)
├── tracking_number: VARCHAR(255)
├── created_at: TIMESTAMP WITH TIME ZONE
└── updated_at: TIMESTAMP WITH TIME ZONE
```

#### **GLOBAL PREFERENCES**
```
global_preferences
├── id: UUID [PRIMARY KEY]
├── wine_club_id: VARCHAR(50) [FK → wine_clubs.id]
├── name: VARCHAR(255)
├── description: TEXT
├── wine_categories: ARRAY
├── created_at: TIMESTAMP WITH TIME ZONE
└── updated_at: TIMESTAMP WITH TIME ZONE
```

#### **ADMIN USERS**
```
admin_users
├── id: UUID [PRIMARY KEY]
├── wine_club_id: VARCHAR(50) [FK → wine_clubs.id] [NULLABLE]
├── email: VARCHAR(255) [UNIQUE]
├── name: VARCHAR(255)
├── role: VARCHAR(255) [DEFAULT 'admin']
├── is_active: BOOLEAN [DEFAULT true]
├── last_login: TIMESTAMP WITH TIME ZONE
├── created_at: TIMESTAMP WITH TIME ZONE
└── updated_at: TIMESTAMP WITH TIME ZONE
```

#### **KV STORE**
```
kv_store_9d538b9c
├── key: TEXT [PRIMARY KEY]
├── value: JSONB
├── wine_club_id: VARCHAR(50) [FK → wine_clubs.id]
├── created_at: TIMESTAMP WITH TIME ZONE
└── updated_at: TIMESTAMP WITH TIME ZONE
```

### **LEVEL 3: FROM SUBSCRIPTION PLANS**

#### **PLAN PREFERENCE MATRIX**
```
plan_preference_matrix
├── id: UUID [PRIMARY KEY]
├── subscription_plan_id: UUID [FK → subscription_plans.id]
├── preference_id: UUID [FK → wine_preferences.id]
├── created_at: TIMESTAMP WITH TIME ZONE
└── updated_at: TIMESTAMP WITH TIME ZONE
```

#### **PLAN WINE ASSIGNMENTS**
```
plan_wine_assignments
├── id: UUID [PRIMARY KEY]
├── subscription_plan_id: UUID [FK → subscription_plans.id]
├── preference_id: UUID [FK → wine_preferences.id]
├── square_item_id: VARCHAR(255)
├── quantity: INTEGER
├── created_at: TIMESTAMP WITH TIME ZONE
└── updated_at: TIMESTAMP WITH TIME ZONE
```

### **LEVEL 3: FROM MEMBERS**

#### **CUSTOM PREFERENCES**
```
custom_preferences
├── id: UUID [PRIMARY KEY]
├── wine_club_id: VARCHAR(50) [FK → wine_clubs.id]
├── member_id: UUID [FK → members.id]
├── wine_assignments: JSONB
├── created_at: TIMESTAMP WITH TIME ZONE
└── updated_at: TIMESTAMP WITH TIME ZONE
```

### **LEVEL 3: FROM SHIPMENTS**

#### **SHIPMENT ITEMS**
```
shipment_items
├── id: UUID [PRIMARY KEY]
├── shipment_id: UUID [FK → shipments.id]
├── square_item_id: VARCHAR(255)
├── quantity: INTEGER
├── created_at: TIMESTAMP WITH TIME ZONE
└── updated_at: TIMESTAMP WITH TIME ZONE
```

### **LEVEL 4: CROSS-REFERENCE TABLES**

#### **MEMBER SELECTIONS (From Members + Shipments)**
```
member_selections
├── id: UUID [PRIMARY KEY]
├── member_id: UUID [FK → members.id]
├── shipment_id: UUID [FK → shipments.id]
├── approved_at: TIMESTAMP WITH TIME ZONE
├── delivery_date: DATE
├── wine_preferences: JSONB
├── approval_token: UUID [DEFAULT uuid_generate_v4()]
├── status: VARCHAR(255) [DEFAULT 'pending']
├── created_at: TIMESTAMP WITH TIME ZONE
└── updated_at: TIMESTAMP WITH TIME ZONE
```

#### **WINE PREFERENCES (Global Reference)**
```
wine_preferences
├── id: UUID [PRIMARY KEY]
├── name: VARCHAR(255)
├── label: VARCHAR(255)
├── description: TEXT
├── created_at: TIMESTAMP WITH TIME ZONE
└── updated_at: TIMESTAMP WITH TIME ZONE
```

## 🔄 DATA FLOW PATTERNS

### **1. WINE CLUB SETUP FLOW**
```
Wine Club Created (id: "1")
    ↓
Square Config → kv_store_9d538b9c
    ↓
Global Preferences → global_preferences
    ↓
Subscription Plans → subscription_plans
    ↓
Admin Users → admin_users
```

### **2. MEMBER ONBOARDING FLOW**
```
Member Signs Up
    ↓
Member Assigned → members
    ↓
Custom Preferences → custom_preferences
    ↓
Square Customer Created
```

### **3. SHIPMENT PROCESS FLOW**
```
Shipment Created → shipments
    ↓
Shipment Items → shipment_items
    ↓
Member Selections → member_selections
    ↓
Approval Process
    ↓
Tracking Added
```

## 🎯 KEY RELATIONSHIPS

### **PRIMARY RELATIONSHIPS**
- **wine_clubs** → **subscription_plans** (1:many)
- **wine_clubs** → **members** (1:many)
- **wine_clubs** → **shipments** (1:many)
- **wine_clubs** → **global_preferences** (1:many)
- **wine_clubs** → **admin_users** (1:many)
- **wine_clubs** → **kv_store_9d538b9c** (1:many)

### **SECONDARY RELATIONSHIPS**
- **subscription_plans** → **members** (1:many)
- **subscription_plans** → **plan_preference_matrix** (1:many)
- **subscription_plans** → **plan_wine_assignments** (1:many)
- **members** → **custom_preferences** (1:1)
- **members** → **member_selections** (1:many)
- **shipments** → **shipment_items** (1:many)
- **shipments** → **member_selections** (1:many)

### **REFERENCE RELATIONSHIPS**
- **wine_preferences** → **plan_preference_matrix** (1:many)
- **wine_preferences** → **plan_wine_assignments** (1:many)

## 📈 BENEFITS OF THIS TREE STRUCTURE

### **✅ CLEAR HIERARCHY**
- **Wine Clubs** at the root
- **Plans and Members** at level 2
- **Shipments and Preferences** at level 3
- **Items and Selections** at level 4

### **✅ LOGICAL FLOW**
- **Left-to-right** data flow
- **Clear parent-child** relationships
- **Easy to understand** dependencies

### **✅ MULTI-TENANT ISOLATION**
- **All data** filtered by wine_club_id
- **Clear boundaries** between wine clubs
- **Easy to add** new wine clubs

### **✅ CONSISTENT DATA TYPES**
- **Wine Club IDs**: VARCHAR(50) everywhere
- **All other IDs**: UUID everywhere
- **Proper foreign key** constraints

## 🚀 IMPLEMENTATION ORDER

### **Phase 1: Core Tables**
1. `wine_clubs` (root)
2. `subscription_plans`
3. `members`
4. `admin_users`

### **Phase 2: Preference Tables**
5. `global_preferences`
6. `custom_preferences`
7. `wine_preferences`

### **Phase 3: Operational Tables**
8. `shipments`
9. `shipment_items`
10. `member_selections`

### **Phase 4: Configuration Tables**
11. `plan_preference_matrix`
12. `plan_wine_assignments`
13. `kv_store_9d538b9c`

## 🎯 RESULT

This complete tree structure provides:
- **Clear hierarchical organization**
- **Logical data flow patterns**
- **Proper multi-tenant architecture**
- **Consistent data type strategy**
- **Easy to understand and maintain**
