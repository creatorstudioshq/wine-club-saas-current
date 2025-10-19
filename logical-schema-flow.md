# CLEAN LOGICAL DATABASE SCHEMA FLOW

## 🏗️ LEFT-TO-RIGHT HIERARCHICAL FLOW

```
WINE CLUBS (Root Entity)
    ↓
    ├── SUBSCRIPTION PLANS
    │   ├── MEMBERS
    │   │   ├── CUSTOM PREFERENCES
    │   │   └── MEMBER SELECTIONS
    │   ├── PLAN PREFERENCE MATRIX
    │   └── PLAN WINE ASSIGNMENTS
    ├── SHIPMENTS
    │   ├── SHIPMENT ITEMS
    │   └── MEMBER SELECTIONS
    ├── GLOBAL PREFERENCES
    ├── ADMIN USERS
    └── KV STORE
```

## 📊 DETAILED RELATIONSHIP FLOW

### **LEVEL 1: WINE CLUBS (Root)**
- **Primary Key**: `id VARCHAR(50)` (1, 2, 3...)
- **Purpose**: Wine club organizations
- **Children**: All other tables reference this

### **LEVEL 2: DIRECT FROM WINE CLUBS**
- **SUBSCRIPTION PLANS** → `wine_club_id VARCHAR(50)`
- **MEMBERS** → `wine_club_id VARCHAR(50)`
- **SHIPMENTS** → `wine_club_id VARCHAR(50)`
- **GLOBAL PREFERENCES** → `wine_club_id VARCHAR(50)`
- **ADMIN USERS** → `wine_club_id VARCHAR(50)` (nullable)
- **KV STORE** → `wine_club_id VARCHAR(50)`

### **LEVEL 3: FROM SUBSCRIPTION PLANS**
- **MEMBERS** → `subscription_plan_id UUID`
- **SHIPMENT ITEMS** → `subscription_plan_id UUID`
- **PLAN PREFERENCE MATRIX** → `subscription_plan_id UUID`
- **PLAN WINE ASSIGNMENTS** → `subscription_plan_id UUID`

### **LEVEL 4: FROM MEMBERS**
- **CUSTOM PREFERENCES** → `member_id UUID`
- **MEMBER SELECTIONS** → `member_id UUID`

### **LEVEL 5: FROM SHIPMENTS**
- **SHIPMENT ITEMS** → `shipment_id UUID`
- **MEMBER SELECTIONS** → `shipment_id UUID`

### **LEVEL 6: FROM WINE PREFERENCES (Global Reference)**
- **PLAN PREFERENCE MATRIX** → `preference_id UUID`
- **PLAN WINE ASSIGNMENTS** → `preference_id UUID`

## 🔄 LOGICAL DATA FLOW

### **1. WINE CLUB SETUP**
```
Wine Club Created (id: "1")
    ↓
Square Config Stored (kv_store)
    ↓
Global Preferences Created
    ↓
Subscription Plans Created
    ↓
Admin Users Added
```

### **2. MEMBER ONBOARDING**
```
Member Signs Up
    ↓
Member Assigned to Plan
    ↓
Custom Preferences Created
    ↓
Square Customer Created
```

### **3. SHIPMENT PROCESS**
```
Shipment Created
    ↓
Shipment Items Added (from Plans)
    ↓
Member Selections Made
    ↓
Approval Process
    ↓
Tracking Added
```

## 🎯 BENEFITS OF THIS FLOW

### **✅ CLEAR HIERARCHY**
- Wine Clubs at the top
- Plans and Members at level 2
- Shipments and Preferences at level 3
- Items and Selections at level 4

### **✅ LOGICAL RELATIONSHIPS**
- No crossing lines in the diagram
- Clear parent-child relationships
- Easy to understand data flow

### **✅ CONSISTENT DATA TYPES**
- Wine Club IDs: `VARCHAR(50)` everywhere
- All other IDs: `UUID` everywhere
- Proper foreign key constraints

### **✅ MULTI-TENANT ISOLATION**
- All data filtered by `wine_club_id`
- Clear data boundaries
- Easy to add new wine clubs

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

## 📈 RESULT

This clean schema provides:
- **Logical left-to-right flow**
- **Clear hierarchical relationships**
- **Consistent data types**
- **Proper multi-tenancy**
- **Easy to understand and maintain**
