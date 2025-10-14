import { projectId, publicAnonKey } from './supabase/info';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-9d538b9c`;

export const api = {
  // Environment & Health
  async getEnvironmentStatus() {
    const res = await fetch(`${BASE_URL}/env-status`, {
      headers: { Authorization: `Bearer ${publicAnonKey}` },
    });
    if (!res.ok) throw new Error(`Environment status check failed: ${res.status}`);
    return res.json();
  },

  // Square Live Inventory (real-time from Square Production API)
  async getLiveInventory(
    wineClubId: string,
    category: string = 'all',
    limit: number = 100
  ) {
    const params = new URLSearchParams({
      category,
      limit: String(limit),
    });

    const res = await fetch(`${BASE_URL}/square/live-inventory/${wineClubId}?${params}`, {
      headers: { Authorization: `Bearer ${publicAnonKey}` },
    });

    if (!res.ok) {
      console.error(`Live inventory fetch failed: ${res.status}`);
      throw new Error(`Live inventory fetch failed: ${res.status}`);
    }

    return res.json();
  },

  // Members
  async getMembers(wineClubId: string) {
    const res = await fetch(`${BASE_URL}/members/${wineClubId}`, {
      headers: { Authorization: `Bearer ${publicAnonKey}` },
    });
    if (!res.ok) throw new Error(`Members fetch failed: ${res.status}`);
    return res.json();
  },

  async createMember(data: any) {
    const res = await fetch(`${BASE_URL}/members`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Member creation failed: ${res.status}`);
    return res.json();
  },

  async updateMember(memberId: string, data: any) {
    const res = await fetch(`${BASE_URL}/members/${memberId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Member update failed: ${res.status}`);
    return res.json();
  },

  // Plans
  async getPlans(wineClubId: string) {
    const res = await fetch(`${BASE_URL}/plans/${wineClubId}`, {
      headers: { Authorization: `Bearer ${publicAnonKey}` },
    });
    if (!res.ok) throw new Error(`Plans fetch failed: ${res.status}`);
    return res.json();
  },

  async createPlan(data: any) {
    const res = await fetch(`${BASE_URL}/plans`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Plan creation failed: ${res.status}`);
    return res.json();
  },

  // Shipments
  async getShipments(wineClubId: string) {
    const res = await fetch(`${BASE_URL}/shipments/${wineClubId}`, {
      headers: { Authorization: `Bearer ${publicAnonKey}` },
    });
    if (!res.ok) throw new Error(`Shipments fetch failed: ${res.status}`);
    return res.json();
  },

  async getClubShipments(wineClubId: string) {
    return this.getShipments(wineClubId);
  },

  async createClubShipment(data: any) {
    const res = await fetch(`${BASE_URL}/shipments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Shipment creation failed: ${res.status}`);
    return res.json();
  },

  // Customer Preferences
  async getCustomerPreferences(wineClubId: string) {
    const res = await fetch(`${BASE_URL}/preferences/${wineClubId}`, {
      headers: { Authorization: `Bearer ${publicAnonKey}` },
    });
    if (!res.ok) throw new Error(`Preferences fetch failed: ${res.status}`);
    return res.json();
  },

  async createCustomerPreference(data: any) {
    const res = await fetch(`${BASE_URL}/preferences`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Preference creation failed: ${res.status}`);
    return res.json();
  },

  // Square Configuration
  async getSquareConfig(wineClubId: string) {
    const res = await fetch(`${BASE_URL}/square-config/${wineClubId}`, {
      headers: { Authorization: `Bearer ${publicAnonKey}` },
    });
    if (!res.ok) throw new Error(`Square config fetch failed: ${res.status}`);
    return res.json();
  },

  async saveSquareConfig(data: any) {
    const res = await fetch(`${BASE_URL}/square-config`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Square config save error:', errorText);
      throw new Error(`Square config save failed: ${res.status} - ${errorText}`);
    }
    return res.json();
  },
};
