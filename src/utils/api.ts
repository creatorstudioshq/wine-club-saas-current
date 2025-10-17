import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aammkgdhfmkukpqkdduj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhbW1rZ2RoZm1rdWtwcWtkZHVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MzgxNTIsImV4cCI6MjA3NTAxNDE1Mn0.V-9vkcctLQ8flXrdc50c3ghIHhxnNGsKl6HfvXHzlY8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const api = {
  // Wine Clubs
  async getWineClubs() {
    const { data, error } = await supabase
      .from('wine_clubs')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getWineClub(id: string) {
    const { data, error } = await supabase
      .from('wine_clubs')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateWineClub(id: string, updates: any) {
    const { data, error } = await supabase
      .from('wine_clubs')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Subscription Plans
  async getPlans(wineClubId: string) {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('wine_club_id', wineClubId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createPlan(planData: any) {
    const { data, error } = await supabase
      .from('subscription_plans')
      .insert(planData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updatePlan(id: string, updates: any) {
    const { data, error } = await supabase
      .from('subscription_plans')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deletePlan(id: string) {
    const { error } = await supabase
      .from('subscription_plans')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  },

  // Members
  async getMembers(wineClubId: string) {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('wine_club_id', wineClubId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createMember(memberData: any) {
    const { data, error } = await supabase
      .from('members')
      .insert(memberData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateMember(id: string, updates: any) {
    const { data, error } = await supabase
      .from('members')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteMember(id: string) {
    const { error } = await supabase
      .from('members')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  },

  // Square Configuration (stored in wine_clubs table)
  async getSquareConfig(wineClubId: string) {
    const { data, error } = await supabase
      .from('wine_clubs')
      .select('square_location_id, square_access_token')
      .eq('id', wineClubId)
      .single();
    
    if (error) throw error;
    return {
      wine_club_id: wineClubId,
      square_location_id: data?.square_location_id || '',
      square_access_token: data?.square_access_token || ''
    };
  },

  async saveSquareConfig(configData: any) {
    const { wine_club_id, square_location_id, square_access_token, selected_categories } = configData;
    
    const { data, error } = await supabase
      .from('wine_clubs')
      .update({
        square_location_id,
        square_access_token,
        updated_at: new Date().toISOString()
      })
      .eq('id', wine_club_id)
      .select()
      .single();
    
    if (error) throw error;
    return {
      success: true,
      message: "Square configuration saved successfully",
      config: {
        wine_club_id,
        square_location_id,
        square_access_token: square_access_token ? '***' + square_access_token.slice(-4) : null,
        selected_categories: selected_categories || [],
        updated_at: new Date().toISOString()
      }
    };
  },

  // Global Preferences (stored in KV-like structure using JSONB)
  async getGlobalPreferences(wineClubId: string) {
    // For now, return empty array - we'll implement this later
    return [];
  },

  async createGlobalPreference(preferenceData: any) {
    // For now, return mock data - we'll implement this later
    return {
      id: `pref_${Date.now()}`,
      ...preferenceData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  },

  async updateGlobalPreference(id: string, updates: any) {
    // For now, return mock data - we'll implement this later
    return {
      id,
      ...updates,
      updated_at: new Date().toISOString()
    };
  },

  async deleteGlobalPreference(id: string) {
    // For now, return success - we'll implement this later
    return { success: true };
  },

  // Custom Preferences
  async getCustomPreferences(wineClubId: string) {
    const { data, error } = await supabase
      .from('custom_preferences')
      .select('*')
      .eq('wine_club_id', wineClubId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createCustomPreference(preferenceData: any) {
    const { data, error } = await supabase
      .from('custom_preferences')
      .insert(preferenceData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateCustomPreference(id: string, updates: any) {
    const { data, error } = await supabase
      .from('custom_preferences')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteCustomPreference(id: string) {
    const { error } = await supabase
      .from('custom_preferences')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  },

  // Square Live Inventory (still use Edge Function for this complex operation)
  async getLiveInventory(
    wineClubId: string,
    category: string = 'all',
    limit: number = 100
  ) {
    const BASE_URL = `https://aammkgdhfmkukpqkdduj.supabase.co/functions/v1/make-server-9d538b9c`;
    const params = new URLSearchParams({
      category,
      limit: String(limit),
    });

    const res = await fetch(`${BASE_URL}/square/live-inventory/${wineClubId}?${params}`, {
      headers: { Authorization: `Bearer ${supabaseAnonKey}` },
    });

    if (!res.ok) {
      console.error(`Live inventory fetch failed: ${res.status}`);
      throw new Error(`Live inventory fetch failed: ${res.status}`);
    }

    return res.json();
  },

  // Square Customer Sync (still use Edge Function for this complex operation)
  async syncSquareCustomers(wineClubId: string) {
    const BASE_URL = `https://aammkgdhfmkukpqkdduj.supabase.co/functions/v1/make-server-9d538b9c`;
    const res = await fetch(`${BASE_URL}/square/sync-customers`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ wine_club_id: wineClubId }),
    });

    if (!res.ok) throw new Error(`Square customer sync failed: ${res.status}`);
    return res.json();
  },

  // Square Customer Groups (still use Edge Function for this complex operation)
  async getSquareSegments(wineClubId: string) {
    const BASE_URL = `https://aammkgdhfmkukpqkdduj.supabase.co/functions/v1/make-server-9d538b9c`;
    const res = await fetch(`${BASE_URL}/square/segments`, {
      headers: { Authorization: `Bearer ${supabaseAnonKey}` },
    });
    if (!res.ok) throw new Error(`Square segments fetch failed: ${res.status}`);
    return res.json();
  },

  async createSquareSegment(segmentData: any) {
    const BASE_URL = `https://aammkgdhfmkukpqkdduj.supabase.co/functions/v1/make-server-9d538b9c`;
    const res = await fetch(`${BASE_URL}/square/segments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(segmentData),
    });
    if (!res.ok) throw new Error(`Square segment creation failed: ${res.status}`);
    return res.json();
  },

  async addCustomerToSquareSegment(segmentId: string, customerId: string) {
    const BASE_URL = `https://aammkgdhfmkukpqkdduj.supabase.co/functions/v1/make-server-9d538b9c`;
    const res = await fetch(`${BASE_URL}/square/segments/${segmentId}/customers`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ customer_id: customerId }),
    });
    if (!res.ok) throw new Error(`Add customer to segment failed: ${res.status}`);
    return res.json();
  },

  async removeCustomerFromSquareSegment(segmentId: string, customerId: string) {
    const BASE_URL = `https://aammkgdhfmkukpqkdduj.supabase.co/functions/v1/make-server-9d538b9c`;
    const res = await fetch(`${BASE_URL}/square/segments/${segmentId}/customers/${customerId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${supabaseAnonKey}` },
    });
    if (!res.ok) throw new Error(`Remove customer from segment failed: ${res.status}`);
    return res.json();
  },

  async getCustomersInSquareSegment(segmentId: string) {
    const BASE_URL = `https://aammkgdhfmkukpqkdduj.supabase.co/functions/v1/make-server-9d538b9c`;
    const res = await fetch(`${BASE_URL}/square/segments/${segmentId}/customers`, {
      headers: { Authorization: `Bearer ${supabaseAnonKey}` },
    });
    if (!res.ok) throw new Error(`Get customers in segment failed: ${res.status}`);
    return res.json();
  },

  // Email Services (still use Edge Function for this complex operation)
  async sendMagicLink(email: string, wineClubId: string) {
    const BASE_URL = `https://aammkgdhfmkukpqkdduj.supabase.co/functions/v1/make-server-9d538b9c`;
    const res = await fetch(`${BASE_URL}/email/magic-link`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, wine_club_id: wineClubId }),
    });
    if (!res.ok) throw new Error(`Magic link send failed: ${res.status}`);
    return res.json();
  },

  async sendWelcomeEmail(email: string, wineClubId: string) {
    const BASE_URL = `https://aammkgdhfmkukpqkdduj.supabase.co/functions/v1/make-server-9d538b9c`;
    const res = await fetch(`${BASE_URL}/email/welcome`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, wine_club_id: wineClubId }),
    });
    if (!res.ok) throw new Error(`Welcome email send failed: ${res.status}`);
    return res.json();
  },

  // Cleanup functions
  async cleanupDuplicatePlans(wineClubId: string) {
    const BASE_URL = `https://aammkgdhfmkukpqkdduj.supabase.co/functions/v1/make-server-9d538b9c`;
    const res = await fetch(`${BASE_URL}/plans/cleanup-duplicates`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ wine_club_id: wineClubId }),
    });
    if (!res.ok) throw new Error(`Cleanup duplicates failed: ${res.status}`);
    return res.json();
  }
};