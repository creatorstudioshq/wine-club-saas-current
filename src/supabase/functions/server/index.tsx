import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import * as kv from "./kv_store.tsx";
import squareLiveInventory from "./square-live-inventory.tsx";
import envStatusRoutes from "./env-status.tsx";
import { serverEnv } from "./env.tsx";

const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  serverEnv.SUPABASE_URL,
  serverEnv.SUPABASE_SERVICE_ROLE_KEY,
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-9d538b9c/health", (c) => {
  return c.json({ status: "ok" });
});

// Wine Club Management Routes
app.get("/make-server-9d538b9c/wine-clubs", async (c) => {
  try {
    const { data: wineClubs, error } = await supabase
      .from('wine_clubs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return c.json({ error: error.message }, 500);
    }

    return c.json({ wineClubs });
  } catch (error) {
    console.error('Get wine clubs error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Members Management
app.get("/make-server-9d538b9c/members/:wineClubId", async (c) => {
  try {
    const wineClubId = c.req.param('wineClubId');
    
    const { data: members, error } = await supabase
      .from('members')
      .select(`
        *,
        subscription_plans(name, bottle_count, discount_percentage)
      `)
      .eq('wine_club_id', wineClubId)
      .order('created_at', { ascending: false });

    if (error) {
      return c.json({ error: error.message }, 500);
    }

    return c.json({ members });
  } catch (error) {
    console.error('Get members error:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.post("/make-server-9d538b9c/members", async (c) => {
  try {
    const memberData = await c.req.json();
    
    const { data: member, error } = await supabase
      .from('members')
      .insert(memberData)
      .select()
      .single();

    if (error) {
      return c.json({ error: error.message }, 500);
    }

    return c.json({ member });
  } catch (error) {
    console.error('Create member error:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.put("/make-server-9d538b9c/members/:memberId", async (c) => {
  try {
    const memberId = c.req.param('memberId');
    const updateData = await c.req.json();
    
    const { data: member, error } = await supabase
      .from('members')
      .update(updateData)
      .eq('id', memberId)
      .select()
      .single();

    if (error) {
      return c.json({ error: error.message }, 500);
    }

    return c.json({ member });
  } catch (error) {
    console.error('Update member error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Subscription Plans
app.get("/make-server-9d538b9c/plans/:wineClubId", async (c) => {
  try {
    const wineClubId = c.req.param('wineClubId');
    
    const { data: plans, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('wine_club_id', wineClubId)
      .order('bottle_count', { ascending: true });

    if (error) {
      return c.json({ error: error.message }, 500);
    }

    return c.json({ plans });
  } catch (error) {
    console.error('Get plans error:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.post("/make-server-9d538b9c/plans", async (c) => {
  try {
    const planData = await c.req.json();
    
    const { data: plan, error } = await supabase
      .from('subscription_plans')
      .insert(planData)
      .select()
      .single();

    if (error) {
      return c.json({ error: error.message }, 500);
    }

    return c.json({ plan });
  } catch (error) {
    console.error('Create plan error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Shipments
app.get("/make-server-9d538b9c/shipments/:wineClubId", async (c) => {
  try {
    const wineClubId = c.req.param('wineClubId');
    
    const { data: shipments, error } = await supabase
      .from('shipments')
      .select(`
        *,
        shipment_items(
          *,
          subscription_plan:subscription_plans(name)
        )
      `)
      .eq('wine_club_id', wineClubId)
      .order('ship_date', { ascending: false });

    if (error) {
      return c.json({ error: error.message }, 500);
    }

    return c.json({ shipments });
  } catch (error) {
    console.error('Get shipments error:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.post("/make-server-9d538b9c/shipments", async (c) => {
  try {
    const { shipment, items } = await c.req.json();
    
    // Create shipment
    const { data: newShipment, error: shipmentError } = await supabase
      .from('shipments')
      .insert(shipment)
      .select()
      .single();

    if (shipmentError) {
      return c.json({ error: shipmentError.message }, 500);
    }

    // Create shipment items
    const itemsWithShipmentId = items.map((item: any) => ({
      ...item,
      shipment_id: newShipment.id
    }));

    const { data: newItems, error: itemsError } = await supabase
      .from('shipment_items')
      .insert(itemsWithShipmentId)
      .select();

    if (itemsError) {
      return c.json({ error: itemsError.message }, 500);
    }

    return c.json({ shipment: newShipment, items: newItems });
  } catch (error) {
    console.error('Create shipment error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Customer approval workflow
app.get("/make-server-9d538b9c/approval/:token", async (c) => {
  try {
    const token = c.req.param('token');
    
    const { data: selection, error } = await supabase
      .from('member_selections')
      .select(`
        *,
        member:members(*),
        shipment:shipments(
          *,
          shipment_items(
            *,
            product:products(*),
            subscription_plan:subscription_plans(*)
          )
        )
      `)
      .eq('approval_token', token)
      .single();

    if (error) {
      return c.json({ error: "Invalid approval token" }, 404);
    }

    if (selection.status === 'approved') {
      return c.json({ error: "Selection already approved" }, 400);
    }

    return c.json({ selection });
  } catch (error) {
    console.error('Get approval error:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.post("/make-server-9d538b9c/approval/:token", async (c) => {
  try {
    const token = c.req.param('token');
    const { approved, preferences, delivery_date } = await c.req.json();
    
    const updateData: any = {
      status: approved ? 'approved' : 'rejected',
      updated_at: new Date().toISOString()
    };

    if (approved) {
      updateData.approved_at = new Date().toISOString();
      updateData.delivery_date = delivery_date;
      updateData.wine_preferences = preferences;
    }

    const { data: selection, error } = await supabase
      .from('member_selections')
      .update(updateData)
      .eq('approval_token', token)
      .select()
      .single();

    if (error) {
      return c.json({ error: error.message }, 500);
    }

    return c.json({ selection });
  } catch (error) {
    console.error('Update approval error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Customer Preferences Management Routes (stores only IDs and mappings)
app.get("/make-server-9d538b9c/customer-preferences/:wine_club_id", async (c) => {
  try {
    const wineClubId = c.req.param('wine_club_id');
    const preferences = await kv.getByPrefix(`preferences_${wineClubId}_`);
    return c.json({ preferences: preferences || [] });
  } catch (error) {
    console.error('Error fetching customer preferences:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.post("/make-server-9d538b9c/customer-preferences", async (c) => {
  try {
    const body = await c.req.json();
    const { wine_club_id, customer_id, preference_type, category_preferences, custom_wine_assignments, notes } = body;
    
    const preferenceId = `preferences_${wine_club_id}_${customer_id}`;
    const preference = {
      id: preferenceId,
      wine_club_id,
      customer_id, // Square customer ID
      preference_type,
      category_preferences, // e.g. [{ category: "Red Wine", quantity: 3 }]
      custom_wine_assignments, // Array of Square item IDs
      notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    await kv.set(preferenceId, preference);
    return c.json({ preference });
  } catch (error) {
    console.error('Error creating customer preference:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Shipping Schedule Management
app.get("/make-server-9d538b9c/shipping-schedule/:wineClubId", async (c) => {
  try {
    const wineClubId = c.req.param('wineClubId');
    const schedule = await kv.get(`shipping_schedule_${wineClubId}`);
    return c.json({ schedule: schedule || null });
  } catch (error) {
    console.error('Error fetching shipping schedule:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.post("/make-server-9d538b9c/shipping-schedule", async (c) => {
  try {
    const body = await c.req.json();
    const { wine_club_id, shipping_day_of_week, shipping_week_of_month, advance_notice_days, available_days, timezone } = body;
    
    const scheduleId = `shipping_schedule_${wine_club_id}`;
    const schedule = {
      id: scheduleId,
      wine_club_id,
      shipping_day_of_week,
      shipping_week_of_month,
      advance_notice_days,
      available_days,
      timezone,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    await kv.set(scheduleId, schedule);
    return c.json({ schedule });
  } catch (error) {
    console.error('Error saving shipping schedule:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Club Shipments Management (stores only assignments and IDs)
app.get("/make-server-9d538b9c/club-shipments/:wine_club_id", async (c) => {
  try {
    const wineClubId = c.req.param('wine_club_id');
    const shipments = await kv.getByPrefix(`shipments_${wineClubId}_`);
    return c.json({ shipments: shipments || [] });
  } catch (error) {
    console.error('Error fetching club shipments:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.post("/make-server-9d538b9c/club-shipments", async (c) => {
  try {
    const body = await c.req.json();
    const { wine_club_id, name, shipment_date, ship_date, wine_assignments, notes } = body;
    
    const shipmentId = `shipments_${wine_club_id}_${Date.now()}`;
    const shipment = {
      id: shipmentId,
      wine_club_id,
      name,
      shipment_date,
      ship_date,
      status: 'draft',
      wine_assignments, // Array of { customer_id, assigned_square_item_ids[] }
      notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    await kv.set(shipmentId, shipment);
    return c.json({ shipment });
  } catch (error) {
    console.error('Error creating club shipment:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Advanced Square API Routes (for future payment integration)
import * as squareHelpers from "./square-helpers.tsx";

// Email Service Integration
import { 
  sendMagicLink, 
  sendWelcomeEmail, 
  sendShipmentNotification, 
  sendVerificationEmail 
} from "./email-service.tsx";

// List all customers (for importing to wine club)
app.get("/make-server-9d538b9c/square/customers", async (c) => {
  try {
    const result = await squareHelpers.listCustomers();
    return c.json(result);
  } catch (error) {
    console.error('Error listing customers:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Sync Square customers with wine club members
app.post("/make-server-9d538b9c/square/sync-customers", async (c) => {
  try {
    const { wine_club_id } = await c.req.json();
    
    // Get Square customers
    const squareResult = await squareHelpers.listCustomers();
    if (!squareResult.success) {
      return c.json({ error: squareResult.error }, 500);
    }
    
    const squareCustomers = squareResult.customers || [];
    const syncedMembers = [];
    
    // For each Square customer, create or update member
    for (const customer of squareCustomers) {
      if (customer.email_address?.email_address) {
        const memberData = {
          wine_club_id,
          email: customer.email_address.email_address,
          name: customer.given_name && customer.family_name 
            ? `${customer.given_name} ${customer.family_name}`
            : customer.given_name || customer.family_name || 'Unknown',
          phone: customer.phone_number?.phone_number || null,
          square_customer_id: customer.id,
          has_payment_method: customer.cards && customer.cards.length > 0,
          status: 'active'
        };
        
        // Check if member already exists
        const { data: existingMember } = await supabase
          .from('members')
          .select('id')
          .eq('wine_club_id', wine_club_id)
          .eq('square_customer_id', customer.id)
          .single();
        
        if (existingMember) {
          // Update existing member
          const { data: updatedMember, error: updateError } = await supabase
            .from('members')
            .update(memberData)
            .eq('id', existingMember.id)
            .select()
            .single();
          
          if (!updateError) {
            syncedMembers.push(updatedMember);
          }
        } else {
          // Create new member
          const { data: newMember, error: createError } = await supabase
            .from('members')
            .insert(memberData)
            .select()
            .single();
          
          if (!createError) {
            syncedMembers.push(newMember);
          }
        }
      }
    }
    
    return c.json({ 
      success: true, 
      synced_count: syncedMembers.length,
      members: syncedMembers 
    });
  } catch (error) {
    console.error('Error syncing customers:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get customer segments (Gold, Silver, Platinum tiers)
app.get("/make-server-9d538b9c/square/segments", async (c) => {
  try {
    const result = await squareHelpers.listCustomerSegments();
    return c.json(result);
  } catch (error) {
    console.error('Error listing segments:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Create customer segment (group) for a plan
app.post("/make-server-9d538b9c/square/segments", async (c) => {
  try {
    const { segmentName, description } = await c.req.json();
    
    const result = await squareHelpers.createCustomerSegment(segmentName, description);
    if (!result.success) {
      return c.json({ error: result.error }, 500);
    }
    
    return c.json({ 
      success: true, 
      segment: result.segment,
      message: `Customer group "${segmentName}" created successfully`
    });
  } catch (error) {
    console.error('Error creating segment:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Add customer to segment
app.post("/make-server-9d538b9c/square/segments/:segmentId/customers", async (c) => {
  try {
    const segmentId = c.req.param('segmentId');
    const { customerId } = await c.req.json();
    
    const result = await squareHelpers.addCustomerToSegment(customerId, segmentId);
    if (!result.success) {
      return c.json({ error: result.error }, 500);
    }
    
    return c.json({ 
      success: true, 
      customer: result.customer,
      message: "Customer added to group successfully"
    });
  } catch (error) {
    console.error('Error adding customer to segment:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Remove customer from segment
app.delete("/make-server-9d538b9c/square/segments/:segmentId/customers/:customerId", async (c) => {
  try {
    const segmentId = c.req.param('segmentId');
    const customerId = c.req.param('customerId');
    
    const result = await squareHelpers.removeCustomerFromSegment(customerId, segmentId);
    if (!result.success) {
      return c.json({ error: result.error }, 500);
    }
    
    return c.json({ 
      success: true, 
      customer: result.customer,
      message: "Customer removed from group successfully"
    });
  } catch (error) {
    console.error('Error removing customer from segment:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get customers in a specific segment
app.get("/make-server-9d538b9c/square/segments/:segmentId/customers", async (c) => {
  try {
    const segmentId = c.req.param('segmentId');
    
    const result = await squareHelpers.getCustomersInSegment(segmentId);
    if (!result.success) {
      return c.json({ error: result.error }, 500);
    }
    
    return c.json({ 
      success: true, 
      customers: result.customers,
      count: result.customers.length
    });
  } catch (error) {
    console.error('Error getting customers in segment:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get specific segment
app.get("/make-server-9d538b9c/square/segments/:segmentId", async (c) => {
  try {
    const segmentId = c.req.param('segmentId');
    const result = await squareHelpers.getCustomerSegment(segmentId);
    return c.json(result);
  } catch (error) {
    console.error('Error getting segment:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Create a wine club shipment order
app.post("/make-server-9d538b9c/square/create-shipment", async (c) => {
  try {
    const shipmentData = await c.req.json();
    const result = await squareHelpers.createWineClubShipment(shipmentData);
    return c.json(result);
  } catch (error) {
    console.error('Error creating shipment:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Save card on file for customer
app.post("/make-server-9d538b9c/square/save-card", async (c) => {
  try {
    const { customerId, sourceId } = await c.req.json();
    const idempotencyKey = squareHelpers.generateIdempotencyKey();
    const result = await squareHelpers.createCard(customerId, sourceId, idempotencyKey);
    return c.json(result);
  } catch (error) {
    console.error('Error saving card:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Create order (without payment)
app.post("/make-server-9d538b9c/square/create-order", async (c) => {
  try {
    const orderData = await c.req.json();
    const result = await squareHelpers.createOrder({
      ...orderData,
      idempotencyKey: squareHelpers.generateIdempotencyKey(),
    });
    return c.json(result);
  } catch (error) {
    console.error('Error creating order:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Process payment
app.post("/make-server-9d538b9c/square/create-payment", async (c) => {
  try {
    const paymentData = await c.req.json();
    const result = await squareHelpers.createPayment({
      ...paymentData,
      idempotencyKey: squareHelpers.generateIdempotencyKey(),
    });
    return c.json(result);
  } catch (error) {
    console.error('Error creating payment:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Square Configuration Management
app.get("/make-server-9d538b9c/square-config/:wineClubId", async (c) => {
  try {
    const wineClubId = c.req.param('wineClubId');
    const configKey = `square_config_${wineClubId}`;
    
    const config = await kv.get(configKey);
    
    return c.json({ config });
  } catch (error) {
    console.error('Error fetching Square config:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.post("/make-server-9d538b9c/square-config", async (c) => {
  try {
    const { wine_club_id, square_location_id, square_access_token, selected_categories } = await c.req.json();
    const configKey = `square_config_${wine_club_id}`;
    
    const config = {
      wine_club_id,
      square_location_id,
      square_access_token,
      selected_categories: selected_categories || [],
      updated_at: new Date().toISOString()
    };
    
    await kv.set(configKey, config);
    
    return c.json({ 
      success: true, 
      message: "Square configuration saved successfully",
      config: {
        wine_club_id: config.wine_club_id,
        square_location_id: config.square_location_id,
        square_access_token: config.square_access_token ? '***' + config.square_access_token.slice(-4) : null,
        selected_categories: config.selected_categories,
        updated_at: config.updated_at
      }
    });
  } catch (error) {
    console.error('Error saving Square config:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Global Preferences Endpoints
// Create global preference
app.post("/make-server-9d538b9c/global-preferences", async (c) => {
  try {
    const { wine_club_id, name, description, categories } = await c.req.json();
    
    const preferenceData = {
      wine_club_id,
      name,
      description,
      categories,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Store in KV store
    const preferenceKey = `global_preference_${wine_club_id}_${Date.now()}`;
    await kv.set(preferenceKey, preferenceData);
    
    const preference = {
      id: preferenceKey,
      ...preferenceData
    };
    
    return c.json({ 
      success: true, 
      preference,
      message: "Global preference created successfully" 
    });
  } catch (error) {
    console.error('Error creating global preference:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get global preferences for wine club
app.get("/make-server-9d538b9c/global-preferences/:wineClubId", async (c) => {
  try {
    const wineClubId = c.req.param('wineClubId');
    
    // Get all global preferences for this wine club
    const { data: preferences } = await kv.list({
      prefix: `global_preference_${wineClubId}_`
    });
    
    const formattedPreferences = preferences.map(item => ({
      id: item.key,
      ...item.value
    }));
    
    return c.json({ 
      success: true, 
      preferences: formattedPreferences 
    });
  } catch (error) {
    console.error('Error fetching global preferences:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Update global preference
app.put("/make-server-9d538b9c/global-preferences/:preferenceId", async (c) => {
  try {
    const preferenceId = c.req.param('preferenceId');
    const { name, description, categories } = await c.req.json();
    
    // Get existing preference
    const { data: existingPreference } = await kv.get(preferenceId);
    if (!existingPreference) {
      return c.json({ error: "Preference not found" }, 404);
    }
    
    const updatedPreference = {
      ...existingPreference,
      name,
      description,
      categories,
      updated_at: new Date().toISOString()
    };
    
    await kv.set(preferenceId, updatedPreference);
    
    return c.json({ 
      success: true, 
      preference: { id: preferenceId, ...updatedPreference },
      message: "Global preference updated successfully" 
    });
  } catch (error) {
    console.error('Error updating global preference:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Delete global preference
app.delete("/make-server-9d538b9c/global-preferences/:preferenceId", async (c) => {
  try {
    const preferenceId = c.req.param('preferenceId');
    
    await kv.delete(preferenceId);
    
    return c.json({ 
      success: true, 
      message: "Global preference deleted successfully" 
    });
  } catch (error) {
    console.error('Error deleting global preference:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Email Service Endpoints
// Send magic link for authentication
app.post("/make-server-9d538b9c/email/magic-link", async (c) => {
  try {
    const { email, wine_club_id } = await c.req.json();
    
    // Get wine club info
    const configKey = `square_config_${wine_club_id}`;
    const { data: config } = await kv.get(configKey);
    
    if (!config) {
      return c.json({ error: "Wine club not found" }, 404);
    }
    
    const wineClubName = config.wine_club_name || "Wine Club";
    const redirectUrl = `${c.req.url.split('/api')[0]}/auth/callback`;
    
    await sendMagicLink(email, redirectUrl, wineClubName);
    
    return c.json({ 
      success: true, 
      message: "Magic link sent successfully" 
    });
  } catch (error) {
    console.error('Error sending magic link:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Send welcome email for new members
app.post("/make-server-9d538b9c/email/welcome", async (c) => {
  try {
    const { email, name, wine_club_id, plan_name } = await c.req.json();
    
    // Get wine club info
    const configKey = `square_config_${wine_club_id}`;
    const { data: config } = await kv.get(configKey);
    
    if (!config) {
      return c.json({ error: "Wine club not found" }, 404);
    }
    
    const wineClubName = config.wine_club_name || "Wine Club";
    
    await sendWelcomeEmail(email, name, wineClubName, plan_name);
    
    return c.json({ 
      success: true, 
      message: "Welcome email sent successfully" 
    });
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Send shipment notification
app.post("/make-server-9d538b9c/email/shipment-notification", async (c) => {
  try {
    const { email, name, wine_club_id, approval_url, deadline } = await c.req.json();
    
    // Get wine club info
    const configKey = `square_config_${wine_club_id}`;
    const { data: config } = await kv.get(configKey);
    
    if (!config) {
      return c.json({ error: "Wine club not found" }, 404);
    }
    
    const wineClubName = config.wine_club_name || "Wine Club";
    
    await sendShipmentNotification(email, name, wineClubName, approval_url, deadline);
    
    return c.json({ 
      success: true, 
      message: "Shipment notification sent successfully" 
    });
  } catch (error) {
    console.error('Error sending shipment notification:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Send email verification
app.post("/make-server-9d538b9c/email/verify", async (c) => {
  try {
    const { email, wine_club_id, verification_url } = await c.req.json();
    
    // Get wine club info
    const configKey = `square_config_${wine_club_id}`;
    const { data: config } = await kv.get(configKey);
    
    if (!config) {
      return c.json({ error: "Wine club not found" }, 404);
    }
    
    const wineClubName = config.wine_club_name || "Wine Club";
    
    await sendVerificationEmail(email, verification_url, wineClubName);
    
    return c.json({ 
      success: true, 
      message: "Verification email sent successfully" 
    });
  } catch (error) {
    console.error('Error sending verification email:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Mount Square routes
app.route("/", squareLiveInventory);
app.route("/", envStatusRoutes);

Deno.serve(app.fetch);