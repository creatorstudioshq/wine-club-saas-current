# Wine Club SaaS Database Architecture

## 🏗️ ARCHITECTURAL DESIGN PRINCIPLES

### **Wine Club IDs: Sequential (1, 2, 3...)**
- **Purpose**: Easy reference and human-readable
- **Type**: `VARCHAR(50)` 
- **Examples**: "1", "2", "3", "king-frosch", "napa-valley-club"
- **Benefits**: 
  - Easy to remember and reference
  - No UUID complexity for wine club identification
  - Simple multi-tenant data isolation

### **All Other Tables: UUID Primary Keys**
- **Purpose**: Security and RLS (Row Level Security)
- **Type**: `UUID` with `uuid_generate_v4()`
- **Benefits**:
  - Prevents enumeration attacks
  - Better RLS performance
  - Standard UUID practices for sensitive data

### **Foreign Key Strategy**
- **Wine Club References**: Always `VARCHAR(50)` to match wine_clubs.id
- **Other References**: Always `UUID` to match respective table IDs
- **Example**: `members.wine_club_id` → `VARCHAR(50)`, `members.subscription_plan_id` → `UUID`

## 📊 TABLE STRUCTURE OVERVIEW

### **Core Tables**
| Table | Primary Key | wine_club_id | Purpose |
|-------|-------------|--------------|---------|
| `wine_clubs` | VARCHAR(50) | N/A | Wine club organizations |
| `subscription_plans` | UUID | VARCHAR(50) | Membership plans |
| `members` | UUID | VARCHAR(50) | Wine club members |
| `shipments` | UUID | VARCHAR(50) | Wine shipments |
| `admin_users` | UUID | VARCHAR(50) | Admin users (nullable for SaaS admin) |

### **Preference Tables**
| Table | Primary Key | wine_club_id | Purpose |
|-------|-------------|--------------|---------|
| `global_preferences` | UUID | VARCHAR(50) | Club-wide wine preferences |
| `custom_preferences` | UUID | VARCHAR(50) | Member-specific wine assignments |
| `wine_preferences` | UUID | N/A | Global wine preference reference |

### **Operational Tables**
| Table | Primary Key | wine_club_id | Purpose |
|-------|-------------|--------------|---------|
| `shipment_items` | UUID | N/A | Items in shipments |
| `member_selections` | UUID | N/A | Member wine selections |
| `plan_preference_matrix` | UUID | N/A | Plan-preference relationships |
| `plan_wine_assignments` | UUID | N/A | Plan-specific wine assignments |
| `kv_store_9d538b9c` | TEXT | VARCHAR(50) | Key-value storage |

## 🔒 ROW LEVEL SECURITY (RLS)

### **Current Implementation**
- **All tables**: RLS enabled
- **Policies**: Simple permissive policies (`FOR ALL USING (true)`)
- **Future**: Can be tightened to proper multi-tenant isolation

### **Multi-Tenant Data Isolation**
- **Primary Key**: Wine club ID filters all queries
- **Foreign Keys**: Ensure data stays within wine club boundaries
- **RLS Policies**: Can be enhanced to enforce wine_club_id matching

## 🚀 BENEFITS OF THIS ARCHITECTURE

### **1. Simplicity**
- Wine clubs use simple sequential IDs (1, 2, 3...)
- Easy to reference in URLs, APIs, and documentation
- No UUID complexity for wine club identification

### **2. Security**
- All sensitive data uses UUID primary keys
- Prevents enumeration attacks on members, plans, etc.
- Better RLS performance with UUID-based policies

### **3. Scalability**
- UUID primary keys handle high-volume operations
- Sequential wine club IDs are easy to manage
- Proper indexing for performance

### **4. Multi-Tenancy**
- Clear data isolation through wine_club_id foreign keys
- Easy to add new wine clubs
- Simple tenant switching in application logic

## 🔧 FIXES IMPLEMENTED

### **1. Global Preferences**
- ✅ Removed sample data
- ✅ Proper wine_club_id VARCHAR(50) references
- ✅ Real data from wine club setup process

### **2. KV Store**
- ✅ Fixed wine_club_id from UUID to VARCHAR(50)
- ✅ Proper foreign key to wine_clubs table
- ✅ Sample Square configuration data

### **3. Members Table**
- ✅ wine_club_id as VARCHAR(50) not UUID
- ✅ Proper foreign key relationships
- ✅ All associated tables use UUID primary keys

### **4. Wine Clubs**
- ✅ Sequential IDs (1, 2, 3...)
- ✅ VARCHAR(50) primary key
- ✅ All foreign key references updated

## 📈 PERFORMANCE CONSIDERATIONS

### **Indexes Created**
- All wine_club_id foreign keys indexed
- Email addresses indexed for lookups
- Composite indexes for common query patterns

### **Query Patterns**
- Wine club data: Filter by wine_club_id VARCHAR
- Member data: Filter by UUID primary key
- Cross-club queries: Use wine_club_id joins

## 🎯 RESULT

This architecture provides:
- **Simple wine club identification** (1, 2, 3...)
- **Secure data handling** (UUID primary keys)
- **Proper multi-tenancy** (VARCHAR wine_club_id references)
- **Clean data relationships** (consistent foreign key types)
- **TestSprite compatibility** (no more UUID syntax errors)
