# WINE CLUB SAAS DATABASE TREE - ASCII VISUAL

## 🌳 COMPLETE TREE STRUCTURE

```
WINE_CLUBS (Root Entity)
│
├── 📊 SUBSCRIPTION_PLANS
│   │
│   ├── 👥 MEMBERS
│   │   │
│   │   ├── 🍷 CUSTOM_PREFERENCES
│   │   │
│   │   └── 📦 MEMBER_SELECTIONS
│   │
│   ├── 🎯 PLAN_PREFERENCE_MATRIX
│   │
│   └── 🍾 PLAN_WINE_ASSIGNMENTS
│
├── 📦 SHIPMENTS
│   │
│   ├── 📋 SHIPMENT_ITEMS
│   │
│   └── 📦 MEMBER_SELECTIONS (shared)
│
├── 🌍 GLOBAL_PREFERENCES
│
├── 👨‍💼 ADMIN_USERS
│
└── 🔑 KV_STORE_9D538B9C
```

## 📊 DETAILED RELATIONSHIP TREE

```
WINE_CLUBS (VARCHAR(50) ID)
│
├── SUBSCRIPTION_PLANS (UUID ID)
│   │   wine_club_id: VARCHAR(50) → wine_clubs.id
│   │
│   ├── MEMBERS (UUID ID)
│   │   │   wine_club_id: VARCHAR(50) → wine_clubs.id
│   │   │   subscription_plan_id: UUID → subscription_plans.id
│   │   │
│   │   ├── CUSTOM_PREFERENCES (UUID ID)
│   │   │   │   wine_club_id: VARCHAR(50) → wine_clubs.id
│   │   │   │   member_id: UUID → members.id
│   │   │   │
│   │   │   └── wine_assignments: JSONB
│   │   │
│   │   └── MEMBER_SELECTIONS (UUID ID)
│   │       │   member_id: UUID → members.id
│   │       │   shipment_id: UUID → shipments.id
│   │       │
│   │       └── wine_preferences: JSONB
│   │
│   ├── PLAN_PREFERENCE_MATRIX (UUID ID)
│   │   │   subscription_plan_id: UUID → subscription_plans.id
│   │   │   preference_id: UUID → wine_preferences.id
│   │   │
│   │   └── category_ids: ARRAY
│   │
│   └── PLAN_WINE_ASSIGNMENTS (UUID ID)
│       │   subscription_plan_id: UUID → subscription_plans.id
│       │   preference_id: UUID → wine_preferences.id
│       │
│       ├── square_item_id: VARCHAR(255)
│       └── quantity: INTEGER
│
├── SHIPMENTS (UUID ID)
│   │   wine_club_id: VARCHAR(50) → wine_clubs.id
│   │   member_id: UUID → members.id
│   │
│   ├── SHIPMENT_ITEMS (UUID ID)
│   │   │   shipment_id: UUID → shipments.id
│   │   │
│   │   ├── square_item_id: VARCHAR(255)
│   │   └── quantity: INTEGER
│   │
│   └── MEMBER_SELECTIONS (UUID ID) [Shared with Members]
│       │   member_id: UUID → members.id
│       │   shipment_id: UUID → shipments.id
│       │
│       ├── approved_at: TIMESTAMP
│       ├── delivery_date: DATE
│       ├── wine_preferences: JSONB
│       ├── approval_token: UUID
│       └── status: VARCHAR(255)
│
├── GLOBAL_PREFERENCES (UUID ID)
│   │   wine_club_id: VARCHAR(50) → wine_clubs.id
│   │
│   ├── name: VARCHAR(255)
│   ├── description: TEXT
│   └── wine_categories: ARRAY
│
├── ADMIN_USERS (UUID ID)
│   │   wine_club_id: VARCHAR(50) → wine_clubs.id [NULLABLE]
│   │
│   ├── email: VARCHAR(255) [UNIQUE]
│   ├── name: VARCHAR(255)
│   ├── role: VARCHAR(255)
│   ├── is_active: BOOLEAN
│   └── last_login: TIMESTAMP
│
├── KV_STORE_9D538B9C (TEXT Key)
│   │   wine_club_id: VARCHAR(50) → wine_clubs.id
│   │
│   ├── key: TEXT [PRIMARY KEY]
│   ├── value: JSONB
│   └── created_at: TIMESTAMP
│
└── WINE_PREFERENCES (UUID ID) [Global Reference]
    │   [Referenced by plan_preference_matrix and plan_wine_assignments]
    │
    ├── name: VARCHAR(255)
    ├── label: VARCHAR(255)
    └── description: TEXT
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

## 🎯 KEY RELATIONSHIP SUMMARY

### **PRIMARY RELATIONSHIPS (1:Many)**
- **wine_clubs** → **subscription_plans**
- **wine_clubs** → **members**
- **wine_clubs** → **shipments**
- **wine_clubs** → **global_preferences**
- **wine_clubs** → **admin_users**
- **wine_clubs** → **kv_store_9d538b9c**

### **SECONDARY RELATIONSHIPS (1:Many)**
- **subscription_plans** → **members**
- **subscription_plans** → **plan_preference_matrix**
- **subscription_plans** → **plan_wine_assignments**
- **members** → **custom_preferences**
- **members** → **member_selections**
- **shipments** → **shipment_items**
- **shipments** → **member_selections**

### **REFERENCE RELATIONSHIPS (1:Many)**
- **wine_preferences** → **plan_preference_matrix**
- **wine_preferences** → **plan_wine_assignments**

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
