
# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** wine-club-saas-current
- **Date:** 2025-10-17
- **Prepared by:** TestSprite AI Team

---

## 2️⃣ Requirement Validation Summary

#### Test TC001
- **Test Name:** Admin Dashboard Metrics Display
- **Test Code:** [TC001_Admin_Dashboard_Metrics_Display.py](./TC001_Admin_Dashboard_Metrics_Display.py)
- **Test Error:** The admin dashboard displays a persistent Square API Authentication Error (401) indicating the access token is missing or invalid. Clicking the 'Fix Authentication' button does not resolve the issue, and all real-time metrics (total members, new members, revenue, growth indicators) show zero values. Due to this authentication failure, it is not possible to verify the accuracy of the real-time metrics as required. The issue should be addressed by the development team to enable proper data fetching and metric display.
Browser Console Logs:
[ERROR] Failed to load resource: the server responded with a status of 500 () (at https://aammkgdhfmkukpqkdduj.supabase.co/functions/v1/make-server-9d538b9c/square/live-inventory/1?category=all&limit=1:0:0)
[ERROR] Live inventory fetch failed: 500 (at http://localhost:3000/src/utils/api.ts:181:20)
[ERROR] Failed to fetch dashboard data: TypeError: api.getShipments is not a function
    at fetchDashboardData (http://localhost:3000/src/components/Dashboard.tsx:36:25)
    at http://localhost:3000/src/components/Dashboard.tsx:96:9
    at commitHookEffectListMount (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:16963:34)
    at commitPassiveMountOnFiber (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18206:19)
    at commitPassiveMountEffects_complete (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18179:17)
    at commitPassiveMountEffects_begin (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18169:15)
    at commitPassiveMountEffects (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18159:11)
    at flushPassiveEffectsImpl (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19543:11)
    at flushPassiveEffects (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19500:22)
    at commitRootImpl (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19469:13) (at http://localhost:3000/src/components/Dashboard.tsx:84:24)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://aammkgdhfmkukpqkdduj.supabase.co/rest/v1/members?select=*&wine_club_id=eq.1&order=created_at.desc:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b6dbbbdf-01ae-4f20-adce-379641663eba/d8d9cf3b-cbba-4085-a109-96b9ca002b8a
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC002
- **Test Name:** Member Management and Square Customer Sync
- **Test Code:** [TC002_Member_Management_and_Square_Customer_Sync.py](./TC002_Member_Management_and_Square_Customer_Sync.py)
- **Test Error:** Testing stopped due to unresponsive 'Add Member' button on the Member Management page, preventing further verification of member lifecycle management including adding, updating members, and syncing with Square customers.
Browser Console Logs:
[ERROR] Failed to fetch dashboard data: TypeError: api.getShipments is not a function
    at fetchDashboardData (http://localhost:3000/src/components/Dashboard.tsx:36:25)
    at http://localhost:3000/src/components/Dashboard.tsx:96:9
    at commitHookEffectListMount (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:16963:34)
    at commitPassiveMountOnFiber (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18206:19)
    at commitPassiveMountEffects_complete (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18179:17)
    at commitPassiveMountEffects_begin (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18169:15)
    at commitPassiveMountEffects (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18159:11)
    at flushPassiveEffectsImpl (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19543:11)
    at flushPassiveEffects (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19500:22)
    at commitRootImpl (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19469:13) (at http://localhost:3000/src/components/Dashboard.tsx:84:24)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://aammkgdhfmkukpqkdduj.supabase.co/rest/v1/members?select=*&wine_club_id=eq.1&order=created_at.desc:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://aammkgdhfmkukpqkdduj.supabase.co/rest/v1/members?select=*&wine_club_id=eq.1&order=created_at.desc:0:0)
[ERROR] Failed to fetch members data: {code: 22P02, details: null, hint: null, message: invalid input syntax for type uuid: "1"} (at http://localhost:3000/src/components/MembersPage.tsx:42:20)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://aammkgdhfmkukpqkdduj.supabase.co/rest/v1/subscription_plans?select=*&wine_club_id=eq.1&order=created_at.desc:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b6dbbbdf-01ae-4f20-adce-379641663eba/d0e9da90-194d-4316-8357-2ae374401b15
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC003
- **Test Name:** Subscription Plan Creation and Square Customer Group Integration
- **Test Code:** [TC003_Subscription_Plan_Creation_and_Square_Customer_Group_Integration.py](./TC003_Subscription_Plan_Creation_and_Square_Customer_Group_Integration.py)
- **Test Error:** Stopped testing due to missing 'Plan Management' section in the UI, which is critical for the task of validating subscription plan creation and Square customer group synchronization. Please fix the UI to include this section to continue testing.
Browser Console Logs:
[ERROR] Failed to fetch dashboard data: TypeError: api.getShipments is not a function
    at fetchDashboardData (http://localhost:3000/src/components/Dashboard.tsx:36:25)
    at http://localhost:3000/src/components/Dashboard.tsx:96:9
    at commitHookEffectListMount (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:16963:34)
    at commitPassiveMountOnFiber (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18206:19)
    at commitPassiveMountEffects_complete (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18179:17)
    at commitPassiveMountEffects_begin (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18169:15)
    at commitPassiveMountEffects (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18159:11)
    at flushPassiveEffectsImpl (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19543:11)
    at flushPassiveEffects (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19500:22)
    at commitRootImpl (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19469:13) (at http://localhost:3000/src/components/Dashboard.tsx:84:24)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://aammkgdhfmkukpqkdduj.supabase.co/rest/v1/members?select=*&wine_club_id=eq.1&order=created_at.desc:0:0)
[ERROR] Failed to fetch dashboard data: TypeError: api.getShipments is not a function
    at fetchDashboardData (http://localhost:3000/src/components/Dashboard.tsx:36:25)
    at http://localhost:3000/src/components/Dashboard.tsx:96:9
    at commitHookEffectListMount (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:16963:34)
    at commitPassiveMountOnFiber (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18206:19)
    at commitPassiveMountEffects_complete (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18179:17)
    at commitPassiveMountEffects_begin (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18169:15)
    at commitPassiveMountEffects (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18159:11)
    at flushPassiveEffectsImpl (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19543:11)
    at flushPassiveEffects (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19500:22)
    at commitRootImpl (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19469:13) (at http://localhost:3000/src/components/Dashboard.tsx:84:24)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://aammkgdhfmkukpqkdduj.supabase.co/rest/v1/members?select=*&wine_club_id=eq.1&order=created_at.desc:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://aammkgdhfmkukpqkdduj.supabase.co/rest/v1/members?select=*&wine_club_id=eq.1&order=created_at.desc:0:0)
[ERROR] Failed to fetch members data: {code: 22P02, details: null, hint: null, message: invalid input syntax for type uuid: "1"} (at http://localhost:3000/src/components/MembersPage.tsx:42:20)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://aammkgdhfmkukpqkdduj.supabase.co/rest/v1/subscription_plans?select=*&wine_club_id=eq.1&order=created_at.desc:0:0)
[ERROR] Failed to fetch dashboard data: TypeError: api.getShipments is not a function
    at fetchDashboardData (http://localhost:3000/src/components/Dashboard.tsx:36:25)
    at http://localhost:3000/src/components/Dashboard.tsx:96:9
    at commitHookEffectListMount (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:16963:34)
    at commitPassiveMountOnFiber (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18206:19)
    at commitPassiveMountEffects_complete (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18179:17)
    at commitPassiveMountEffects_begin (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18169:15)
    at commitPassiveMountEffects (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18159:11)
    at flushPassiveEffectsImpl (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19543:11)
    at flushPassiveEffects (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19500:22)
    at commitRootImpl (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19469:13) (at http://localhost:3000/src/components/Dashboard.tsx:84:24)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://aammkgdhfmkukpqkdduj.supabase.co/rest/v1/members?select=*&wine_club_id=eq.1&order=created_at.desc:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b6dbbbdf-01ae-4f20-adce-379641663eba/9f5f0aeb-f71e-4832-927b-d1a6002a0765
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC004
- **Test Name:** Club Setup Wizard Functionality and Persistence
- **Test Code:** [TC004_Club_Setup_Wizard_Functionality_and_Persistence.py](./TC004_Club_Setup_Wizard_Functionality_and_Persistence.py)
- **Test Error:** The multi-step club setup wizard fails to save Square credentials due to persistent invalid UUID syntax error for Location ID and Square API Authentication Error (401). The 'Save & Continue' button remains disabled, preventing progress to inventory and shipping configuration steps. Consequently, preference settings, inventory, and shipping configurations cannot be set or verified for persistence on refresh. The task is not fully completed due to these blocking issues.
Browser Console Logs:
[ERROR] Failed to load resource: the server responded with a status of 500 () (at https://aammkgdhfmkukpqkdduj.supabase.co/functions/v1/make-server-9d538b9c/square/live-inventory/1?category=all&limit=1:0:0)
[ERROR] Live inventory fetch failed: 500 (at http://localhost:3000/src/utils/api.ts:181:20)
[ERROR] Failed to fetch dashboard data: TypeError: api.getShipments is not a function
    at fetchDashboardData (http://localhost:3000/src/components/Dashboard.tsx:36:25)
    at http://localhost:3000/src/components/Dashboard.tsx:96:9
    at commitHookEffectListMount (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:16963:34)
    at commitPassiveMountOnFiber (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18206:19)
    at commitPassiveMountEffects_complete (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18179:17)
    at commitPassiveMountEffects_begin (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18169:15)
    at commitPassiveMountEffects (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18159:11)
    at flushPassiveEffectsImpl (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19543:11)
    at flushPassiveEffects (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19500:22)
    at commitRootImpl (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19469:13) (at http://localhost:3000/src/components/Dashboard.tsx:84:24)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://aammkgdhfmkukpqkdduj.supabase.co/rest/v1/members?select=*&wine_club_id=eq.1&order=created_at.desc:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://aammkgdhfmkukpqkdduj.supabase.co/rest/v1/wine_clubs?select=square_location_id%2Csquare_access_token&id=eq.1:0:0)
[ERROR] Error fetching config: {code: 22P02, details: null, hint: null, message: invalid input syntax for type uuid: "1"} (at http://localhost:3000/src/components/SquareConfigPage.tsx:63:24)
[ERROR] Failed to fetch dashboard data: TypeError: api.getShipments is not a function
    at fetchDashboardData (http://localhost:3000/src/components/Dashboard.tsx:36:25)
    at http://localhost:3000/src/components/Dashboard.tsx:96:9
    at commitHookEffectListMount (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:16963:34)
    at commitPassiveMountOnFiber (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18206:19)
    at commitPassiveMountEffects_complete (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18179:17)
    at commitPassiveMountEffects_begin (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18169:15)
    at commitPassiveMountEffects (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18159:11)
    at flushPassiveEffectsImpl (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19543:11)
    at flushPassiveEffects (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19500:22)
    at commitRootImpl (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19469:13) (at http://localhost:3000/src/components/Dashboard.tsx:84:24)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://aammkgdhfmkukpqkdduj.supabase.co/rest/v1/members?select=*&wine_club_id=eq.1&order=created_at.desc:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://aammkgdhfmkukpqkdduj.supabase.co/rest/v1/wine_clubs?select=square_location_id%2Csquare_access_token&id=eq.1:0:0)
[ERROR] Error fetching config: {code: 22P02, details: null, hint: null, message: invalid input syntax for type uuid: "1"} (at http://localhost:3000/src/components/SquareConfigPage.tsx:63:24)
[ERROR] Failed to fetch dashboard data: TypeError: api.getShipments is not a function
    at fetchDashboardData (http://localhost:3000/src/components/Dashboard.tsx:36:25)
    at http://localhost:3000/src/components/Dashboard.tsx:96:9
    at commitHookEffectListMount (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:16963:34)
    at commitPassiveMountOnFiber (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18206:19)
    at commitPassiveMountEffects_complete (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18179:17)
    at commitPassiveMountEffects_begin (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18169:15)
    at commitPassiveMountEffects (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18159:11)
    at flushPassiveEffectsImpl (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19543:11)
    at flushPassiveEffects (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19500:22)
    at commitRootImpl (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19469:13) (at http://localhost:3000/src/components/Dashboard.tsx:84:24)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://aammkgdhfmkukpqkdduj.supabase.co/rest/v1/members?select=*&wine_club_id=eq.1&order=created_at.desc:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://aammkgdhfmkukpqkdduj.supabase.co/rest/v1/wine_clubs?select=square_location_id%2Csquare_access_token&id=eq.1:0:0)
[ERROR] Error fetching config: {code: 22P02, details: null, hint: null, message: invalid input syntax for type uuid: "1"} (at http://localhost:3000/src/components/SquareConfigPage.tsx:63:24)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://aammkgdhfmkukpqkdduj.supabase.co/rest/v1/wine_clubs?id=eq.1&select=*:0:0)
[ERROR] Error saving config: {code: 22P02, details: null, hint: null, message: invalid input syntax for type uuid: "1"} (at http://localhost:3000/src/components/SquareConfigPage.tsx:118:20)
[ERROR] Failed to fetch dashboard data: TypeError: api.getShipments is not a function
    at fetchDashboardData (http://localhost:3000/src/components/Dashboard.tsx:36:25)
    at http://localhost:3000/src/components/Dashboard.tsx:96:9
    at commitHookEffectListMount (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:16963:34)
    at commitPassiveMountOnFiber (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18206:19)
    at commitPassiveMountEffects_complete (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18179:17)
    at commitPassiveMountEffects_begin (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18169:15)
    at commitPassiveMountEffects (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18159:11)
    at flushPassiveEffectsImpl (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19543:11)
    at flushPassiveEffects (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19500:22)
    at commitRootImpl (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19469:13) (at http://localhost:3000/src/components/Dashboard.tsx:84:24)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://aammkgdhfmkukpqkdduj.supabase.co/rest/v1/members?select=*&wine_club_id=eq.1&order=created_at.desc:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://aammkgdhfmkukpqkdduj.supabase.co/rest/v1/wine_clubs?select=square_location_id%2Csquare_access_token&id=eq.1:0:0)
[ERROR] Error fetching config: {code: 22P02, details: null, hint: null, message: invalid input syntax for type uuid: "1"} (at http://localhost:3000/src/components/SquareConfigPage.tsx:63:24)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b6dbbbdf-01ae-4f20-adce-379641663eba/cf3aea6b-7186-426d-bfa6-313b93c13acf
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC005
- **Test Name:** Customer Preferences and Custom Shipment Builder
- **Test Code:** [TC005_Customer_Preferences_and_Custom_Shipment_Builder.py](./TC005_Customer_Preferences_and_Custom_Shipment_Builder.py)
- **Test Error:** Testing stopped due to persistent Square API Authentication Error (401) that blocks all further progress. The 'Fix Authentication' button does not resolve the issue. Please investigate and fix the authentication problem to enable testing of global preferences and custom shipments.
Browser Console Logs:
[ERROR] Failed to load resource: the server responded with a status of 500 () (at https://aammkgdhfmkukpqkdduj.supabase.co/functions/v1/make-server-9d538b9c/square/live-inventory/1?category=all&limit=1:0:0)
[ERROR] Live inventory fetch failed: 500 (at http://localhost:3000/src/utils/api.ts:181:20)
[ERROR] Failed to fetch dashboard data: TypeError: api.getShipments is not a function
    at fetchDashboardData (http://localhost:3000/src/components/Dashboard.tsx:36:25)
    at http://localhost:3000/src/components/Dashboard.tsx:96:9
    at commitHookEffectListMount (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:16963:34)
    at commitPassiveMountOnFiber (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18206:19)
    at commitPassiveMountEffects_complete (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18179:17)
    at commitPassiveMountEffects_begin (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18169:15)
    at commitPassiveMountEffects (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18159:11)
    at flushPassiveEffectsImpl (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19543:11)
    at flushPassiveEffects (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19500:22)
    at commitRootImpl (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19469:13) (at http://localhost:3000/src/components/Dashboard.tsx:84:24)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://aammkgdhfmkukpqkdduj.supabase.co/rest/v1/members?select=*&wine_club_id=eq.1&order=created_at.desc:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://aammkgdhfmkukpqkdduj.supabase.co/rest/v1/wine_clubs?select=square_location_id%2Csquare_access_token&id=eq.1:0:0)
[ERROR] Error fetching config: {code: 22P02, details: null, hint: null, message: invalid input syntax for type uuid: "1"} (at http://localhost:3000/src/components/SquareConfigPage.tsx:63:24)
[ERROR] Failed to fetch dashboard data: TypeError: api.getShipments is not a function
    at fetchDashboardData (http://localhost:3000/src/components/Dashboard.tsx:36:25)
    at http://localhost:3000/src/components/Dashboard.tsx:96:9
    at commitHookEffectListMount (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:16963:34)
    at commitPassiveMountOnFiber (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18206:19)
    at commitPassiveMountEffects_complete (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18179:17)
    at commitPassiveMountEffects_begin (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18169:15)
    at commitPassiveMountEffects (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18159:11)
    at flushPassiveEffectsImpl (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19543:11)
    at flushPassiveEffects (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19500:22)
    at commitRootImpl (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19469:13) (at http://localhost:3000/src/components/Dashboard.tsx:84:24)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://aammkgdhfmkukpqkdduj.supabase.co/rest/v1/members?select=*&wine_club_id=eq.1&order=created_at.desc:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://aammkgdhfmkukpqkdduj.supabase.co/rest/v1/wine_clubs?select=square_location_id%2Csquare_access_token&id=eq.1:0:0)
[ERROR] Error fetching config: {code: 22P02, details: null, hint: null, message: invalid input syntax for type uuid: "1"} (at http://localhost:3000/src/components/SquareConfigPage.tsx:63:24)
[ERROR] Failed to fetch dashboard data: TypeError: api.getShipments is not a function
    at fetchDashboardData (http://localhost:3000/src/components/Dashboard.tsx:36:25)
    at http://localhost:3000/src/components/Dashboard.tsx:96:9
    at commitHookEffectListMount (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:16963:34)
    at commitPassiveMountOnFiber (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18206:19)
    at commitPassiveMountEffects_complete (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18179:17)
    at commitPassiveMountEffects_begin (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18169:15)
    at commitPassiveMountEffects (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18159:11)
    at flushPassiveEffectsImpl (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19543:11)
    at flushPassiveEffects (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19500:22)
    at commitRootImpl (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19469:13) (at http://localhost:3000/src/components/Dashboard.tsx:84:24)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://aammkgdhfmkukpqkdduj.supabase.co/rest/v1/members?select=*&wine_club_id=eq.1&order=created_at.desc:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b6dbbbdf-01ae-4f20-adce-379641663eba/0f6d3eba-c729-4a59-9e7e-9bba6e486f54
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC006
- **Test Name:** Fulfillment Workflow End-to-End
- **Test Code:** [TC006_Fulfillment_Workflow_End_to_End.py](./TC006_Fulfillment_Workflow_End_to_End.py)
- **Test Error:** Testing stopped due to persistent Square API Authentication Error (401) that blocks fulfillment workflow validation. The 'Fix Authentication' button does not resolve the issue. Please fix the authentication to enable further testing.
Browser Console Logs:
[ERROR] Failed to load resource: the server responded with a status of 500 () (at https://aammkgdhfmkukpqkdduj.supabase.co/functions/v1/make-server-9d538b9c/square/live-inventory/1?category=all&limit=1:0:0)
[ERROR] Live inventory fetch failed: 500 (at http://localhost:3000/src/utils/api.ts:181:20)
[ERROR] Failed to fetch dashboard data: TypeError: api.getShipments is not a function
    at fetchDashboardData (http://localhost:3000/src/components/Dashboard.tsx:36:25)
    at http://localhost:3000/src/components/Dashboard.tsx:96:9
    at commitHookEffectListMount (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:16963:34)
    at commitPassiveMountOnFiber (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18206:19)
    at commitPassiveMountEffects_complete (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18179:17)
    at commitPassiveMountEffects_begin (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18169:15)
    at commitPassiveMountEffects (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18159:11)
    at flushPassiveEffectsImpl (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19543:11)
    at flushPassiveEffects (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19500:22)
    at commitRootImpl (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19469:13) (at http://localhost:3000/src/components/Dashboard.tsx:84:24)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://aammkgdhfmkukpqkdduj.supabase.co/rest/v1/members?select=*&wine_club_id=eq.1&order=created_at.desc:0:0)
[ERROR] Failed to fetch dashboard data: TypeError: api.getShipments is not a function
    at fetchDashboardData (http://localhost:3000/src/components/Dashboard.tsx:36:25)
    at http://localhost:3000/src/components/Dashboard.tsx:96:9
    at commitHookEffectListMount (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:16963:34)
    at commitPassiveMountOnFiber (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18206:19)
    at commitPassiveMountEffects_complete (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18179:17)
    at commitPassiveMountEffects_begin (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18169:15)
    at commitPassiveMountEffects (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18159:11)
    at flushPassiveEffectsImpl (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19543:11)
    at flushPassiveEffects (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19500:22)
    at commitRootImpl (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19469:13) (at http://localhost:3000/src/components/Dashboard.tsx:84:24)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://aammkgdhfmkukpqkdduj.supabase.co/rest/v1/members?select=*&wine_club_id=eq.1&order=created_at.desc:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b6dbbbdf-01ae-4f20-adce-379641663eba/63820143-441e-4fbf-aa38-0f611a003a84
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC007
- **Test Name:** Embeddable Signup Widget Display and Functionality
- **Test Code:** [TC007_Embeddable_Signup_Widget_Display_and_Functionality.py](./TC007_Embeddable_Signup_Widget_Display_and_Functionality.py)
- **Test Error:** Testing stopped due to persistent Square API Authentication Error (401) preventing access to real subscription plans and wine previews. The 'Fix Authentication' button does not resolve the issue. Please fix the authentication problem to enable further testing of the embeddable signup widget and successful membership signup flow.
Browser Console Logs:
[ERROR] Failed to load resource: the server responded with a status of 500 () (at https://aammkgdhfmkukpqkdduj.supabase.co/functions/v1/make-server-9d538b9c/square/live-inventory/1?category=all&limit=1:0:0)
[ERROR] Live inventory fetch failed: 500 (at http://localhost:3000/src/utils/api.ts:181:20)
[ERROR] Failed to fetch dashboard data: TypeError: api.getShipments is not a function
    at fetchDashboardData (http://localhost:3000/src/components/Dashboard.tsx:36:25)
    at http://localhost:3000/src/components/Dashboard.tsx:96:9
    at commitHookEffectListMount (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:16963:34)
    at commitPassiveMountOnFiber (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18206:19)
    at commitPassiveMountEffects_complete (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18179:17)
    at commitPassiveMountEffects_begin (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18169:15)
    at commitPassiveMountEffects (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18159:11)
    at flushPassiveEffectsImpl (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19543:11)
    at flushPassiveEffects (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19500:22)
    at commitRootImpl (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19469:13) (at http://localhost:3000/src/components/Dashboard.tsx:84:24)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://aammkgdhfmkukpqkdduj.supabase.co/rest/v1/members?select=*&wine_club_id=eq.1&order=created_at.desc:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b6dbbbdf-01ae-4f20-adce-379641663eba/d2806166-10f1-4396-8989-b85aa8991f54
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC008
- **Test Name:** SaaS Admin Portal Multi-Club Management
- **Test Code:** [TC008_SaaS_Admin_Portal_Multi_Club_Management.py](./TC008_SaaS_Admin_Portal_Multi_Club_Management.py)
- **Test Error:** Testing stopped due to non-responsive 'Add New Club' button preventing further verification of multi-club management and admin user access controls. Issue reported.
Browser Console Logs:
[ERROR] Failed to load resource: the server responded with a status of 500 () (at https://aammkgdhfmkukpqkdduj.supabase.co/functions/v1/make-server-9d538b9c/square/live-inventory/1?category=all&limit=1:0:0)
[ERROR] Live inventory fetch failed: 500 (at http://localhost:3000/src/utils/api.ts:181:20)
[ERROR] Failed to fetch wine clubs data: TypeError: api.getAllWineClubs is not a function
    at fetchAllWineClubs (http://localhost:3000/src/components/SuperadminDashboard.tsx:29:48)
    at http://localhost:3000/src/components/SuperadminDashboard.tsx:89:9
    at commitHookEffectListMount (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:16963:34)
    at commitPassiveMountOnFiber (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18206:19)
    at commitPassiveMountEffects_complete (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18179:17)
    at commitPassiveMountEffects_begin (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18169:15)
    at commitPassiveMountEffects (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18159:11)
    at flushPassiveEffectsImpl (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19543:11)
    at flushPassiveEffects (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19500:22)
    at commitRootImpl (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19469:13) (at http://localhost:3000/src/components/SuperadminDashboard.tsx:81:24)
[ERROR] Failed to fetch wine clubs data: TypeError: api.getAllWineClubs is not a function
    at fetchAllWineClubs (http://localhost:3000/src/components/ClubsOrganizationsPage.tsx:20:48)
    at http://localhost:3000/src/components/ClubsOrganizationsPage.tsx:87:9
    at commitHookEffectListMount (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:16963:34)
    at commitPassiveMountOnFiber (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18206:19)
    at commitPassiveMountEffects_complete (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18179:17)
    at commitPassiveMountEffects_begin (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18169:15)
    at commitPassiveMountEffects (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18159:11)
    at flushPassiveEffectsImpl (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19543:11)
    at flushPassiveEffects (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19500:22)
    at commitRootImpl (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19469:13) (at http://localhost:3000/src/components/ClubsOrganizationsPage.tsx:80:24)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b6dbbbdf-01ae-4f20-adce-379641663eba/ef07245c-4902-4cbf-88ad-bcc304d2f355
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC009
- **Test Name:** User Authentication and Multi-Tenancy Data Isolation
- **Test Code:** [TC009_User_Authentication_and_Multi_Tenancy_Data_Isolation.py](./TC009_User_Authentication_and_Multi_Tenancy_Data_Isolation.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b6dbbbdf-01ae-4f20-adce-379641663eba/d5b6cc0a-f25b-49f5-9752-fccddfca7493
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC010
- **Test Name:** Error Handling on Invalid Square API Credentials
- **Test Code:** [TC010_Error_Handling_on_Invalid_Square_API_Credentials.py](./TC010_Error_Handling_on_Invalid_Square_API_Credentials.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b6dbbbdf-01ae-4f20-adce-379641663eba/10b3ec63-31af-40ff-80fc-70040cca85c6
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC011
- **Test Name:** Graceful Handling of Square API Failures
- **Test Code:** [TC011_Graceful_Handling_of_Square_API_Failures.py](./TC011_Graceful_Handling_of_Square_API_Failures.py)
- **Test Error:** Tested member sync with Square API unreachable scenario. The application shows a persistent Square API Authentication Error (401) on the dashboard and members page. However, clicking 'Sync from Square' does not trigger any visible error notification or UI feedback. This indicates a failure to notify the user clearly about the API failure and a lack of graceful recovery feedback. Testing stopped due to this critical issue.
Browser Console Logs:
[ERROR] Failed to load resource: the server responded with a status of 500 () (at https://aammkgdhfmkukpqkdduj.supabase.co/functions/v1/make-server-9d538b9c/square/live-inventory/1?category=all&limit=1:0:0)
[ERROR] Live inventory fetch failed: 500 (at http://localhost:3000/src/utils/api.ts:181:20)
[ERROR] Failed to fetch dashboard data: TypeError: api.getShipments is not a function
    at fetchDashboardData (http://localhost:3000/src/components/Dashboard.tsx:36:25)
    at http://localhost:3000/src/components/Dashboard.tsx:96:9
    at commitHookEffectListMount (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:16963:34)
    at commitPassiveMountOnFiber (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18206:19)
    at commitPassiveMountEffects_complete (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18179:17)
    at commitPassiveMountEffects_begin (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18169:15)
    at commitPassiveMountEffects (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18159:11)
    at flushPassiveEffectsImpl (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19543:11)
    at flushPassiveEffects (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19500:22)
    at commitRootImpl (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19469:13) (at http://localhost:3000/src/components/Dashboard.tsx:84:24)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://aammkgdhfmkukpqkdduj.supabase.co/rest/v1/members?select=*&wine_club_id=eq.1&order=created_at.desc:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://aammkgdhfmkukpqkdduj.supabase.co/rest/v1/members?select=*&wine_club_id=eq.1&order=created_at.desc:0:0)
[ERROR] Failed to fetch members data: {code: 22P02, details: null, hint: null, message: invalid input syntax for type uuid: "1"} (at http://localhost:3000/src/components/MembersPage.tsx:42:20)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://aammkgdhfmkukpqkdduj.supabase.co/rest/v1/subscription_plans?select=*&wine_club_id=eq.1&order=created_at.desc:0:0)
[ERROR] Failed to load resource: the server responded with a status of 404 () (at https://aammkgdhfmkukpqkdduj.supabase.co/functions/v1/make-server-9d538b9c/square/sync-customers:0:0)
[ERROR] Failed to sync from Square: Error: Square customer sync failed: 404
    at Object.syncSquareCustomers (http://localhost:3000/src/utils/api.ts:200:28)
    at async handleSyncFromSquare (http://localhost:3000/src/components/MembersPage.tsx:91:13) (at http://localhost:3000/src/components/MembersPage.tsx:94:20)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b6dbbbdf-01ae-4f20-adce-379641663eba/3faf37c8-6511-49d9-ac7b-bd740ee1ee63
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC012
- **Test Name:** UI Validation for Required Fields and Input Formats
- **Test Code:** [TC012_UI_Validation_for_Required_Fields_and_Input_Formats.py](./TC012_UI_Validation_for_Required_Fields_and_Input_Formats.py)
- **Test Error:** Stopped testing due to critical UI issue: 'Add Member' form does not open on clicking the button, preventing validation tests on Member Management form. Further testing on Plan Management and Signup Widget forms cannot proceed reliably. Please fix this issue first.
Browser Console Logs:
[ERROR] Failed to load resource: the server responded with a status of 500 () (at https://aammkgdhfmkukpqkdduj.supabase.co/functions/v1/make-server-9d538b9c/square/live-inventory/1?category=all&limit=1:0:0)
[ERROR] Live inventory fetch failed: 500 (at http://localhost:3000/src/utils/api.ts:181:20)
[ERROR] Failed to fetch dashboard data: TypeError: api.getShipments is not a function
    at fetchDashboardData (http://localhost:3000/src/components/Dashboard.tsx:36:25)
    at http://localhost:3000/src/components/Dashboard.tsx:96:9
    at commitHookEffectListMount (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:16963:34)
    at commitPassiveMountOnFiber (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18206:19)
    at commitPassiveMountEffects_complete (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18179:17)
    at commitPassiveMountEffects_begin (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18169:15)
    at commitPassiveMountEffects (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18159:11)
    at flushPassiveEffectsImpl (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19543:11)
    at flushPassiveEffects (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19500:22)
    at commitRootImpl (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19469:13) (at http://localhost:3000/src/components/Dashboard.tsx:84:24)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://aammkgdhfmkukpqkdduj.supabase.co/rest/v1/members?select=*&wine_club_id=eq.1&order=created_at.desc:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://aammkgdhfmkukpqkdduj.supabase.co/rest/v1/subscription_plans?select=*&wine_club_id=eq.1&order=created_at.desc:0:0)
[ERROR] Failed to fetch members data: {code: 22P02, details: null, hint: null, message: invalid input syntax for type uuid: "1"} (at http://localhost:3000/src/components/MembersPage.tsx:42:20)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://aammkgdhfmkukpqkdduj.supabase.co/rest/v1/members?select=*&wine_club_id=eq.1&order=created_at.desc:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b6dbbbdf-01ae-4f20-adce-379641663eba/e0af6c95-edf0-4cc6-912b-f111246cbd08
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC013
- **Test Name:** Real-Time Data Updates on Dashboard
- **Test Code:** [TC013_Real_Time_Data_Updates_on_Dashboard.py](./TC013_Real_Time_Data_Updates_on_Dashboard.py)
- **Test Error:** Testing stopped due to non-functional 'Add Member' button preventing simulation of new member signup. Unable to verify real-time updates on Admin Dashboard. Please fix the issue to continue testing.
Browser Console Logs:
[ERROR] Failed to fetch dashboard data: TypeError: api.getShipments is not a function
    at fetchDashboardData (http://localhost:3000/src/components/Dashboard.tsx:36:25)
    at http://localhost:3000/src/components/Dashboard.tsx:96:9
    at commitHookEffectListMount (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:16963:34)
    at commitPassiveMountOnFiber (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18206:19)
    at commitPassiveMountEffects_complete (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18179:17)
    at commitPassiveMountEffects_begin (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18169:15)
    at commitPassiveMountEffects (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18159:11)
    at flushPassiveEffectsImpl (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19543:11)
    at flushPassiveEffects (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19500:22)
    at commitRootImpl (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19469:13) (at http://localhost:3000/src/components/Dashboard.tsx:84:24)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://aammkgdhfmkukpqkdduj.supabase.co/rest/v1/members?select=*&wine_club_id=eq.1&order=created_at.desc:0:0)
[ERROR] Failed to fetch dashboard data: TypeError: api.getShipments is not a function
    at fetchDashboardData (http://localhost:3000/src/components/Dashboard.tsx:36:25)
    at http://localhost:3000/src/components/Dashboard.tsx:96:9
    at commitHookEffectListMount (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:16963:34)
    at commitPassiveMountOnFiber (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18206:19)
    at commitPassiveMountEffects_complete (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18179:17)
    at commitPassiveMountEffects_begin (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18169:15)
    at commitPassiveMountEffects (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18159:11)
    at flushPassiveEffectsImpl (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19543:11)
    at flushPassiveEffects (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19500:22)
    at commitRootImpl (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19469:13) (at http://localhost:3000/src/components/Dashboard.tsx:84:24)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://aammkgdhfmkukpqkdduj.supabase.co/rest/v1/members?select=*&wine_club_id=eq.1&order=created_at.desc:0:0)
[ERROR] Failed to fetch dashboard data: TypeError: api.getShipments is not a function
    at fetchDashboardData (http://localhost:3000/src/components/Dashboard.tsx:36:25)
    at http://localhost:3000/src/components/Dashboard.tsx:96:9
    at commitHookEffectListMount (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:16963:34)
    at commitPassiveMountOnFiber (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18206:19)
    at commitPassiveMountEffects_complete (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18179:17)
    at commitPassiveMountEffects_begin (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18169:15)
    at commitPassiveMountEffects (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:18159:11)
    at flushPassiveEffectsImpl (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19543:11)
    at flushPassiveEffects (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19500:22)
    at commitRootImpl (http://localhost:3000/node_modules/.vite/deps/chunk-AP6GYKF3.js?v=5bfc5a15:19469:13) (at http://localhost:3000/src/components/Dashboard.tsx:84:24)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://aammkgdhfmkukpqkdduj.supabase.co/rest/v1/members?select=*&wine_club_id=eq.1&order=created_at.desc:0:0)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://aammkgdhfmkukpqkdduj.supabase.co/rest/v1/members?select=*&wine_club_id=eq.1&order=created_at.desc:0:0)
[ERROR] Failed to fetch members data: {code: 22P02, details: null, hint: null, message: invalid input syntax for type uuid: "1"} (at http://localhost:3000/src/components/MembersPage.tsx:42:20)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://aammkgdhfmkukpqkdduj.supabase.co/rest/v1/subscription_plans?select=*&wine_club_id=eq.1&order=created_at.desc:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b6dbbbdf-01ae-4f20-adce-379641663eba/856dcacd-e4a0-4071-8c28-b2b7af7deb9a
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---


## 3️⃣ Coverage & Matching Metrics

- **15.38** of tests passed

| Requirement        | Total Tests | ✅ Passed | ❌ Failed  |
|--------------------|-------------|-----------|------------|
| ...                | ...         | ...       | ...        |
---


## 4️⃣ Key Gaps / Risks
{AI_GNERATED_KET_GAPS_AND_RISKS}
---