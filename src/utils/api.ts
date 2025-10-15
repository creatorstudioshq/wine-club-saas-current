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

  // Global Preferences
  async getGlobalPreferences(wineClubId: string) {
    const res = await fetch(`${BASE_URL}/global-preferences/${wineClubId}`, {
      headers: { Authorization: `Bearer ${publicAnonKey}` },
    });
    if (!res.ok) throw new Error(`Global preferences fetch failed: ${res.status}`);
    return res.json();
  },

  async createGlobalPreference(data: any) {
    const res = await fetch(`${BASE_URL}/global-preferences`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Global preference creation failed: ${res.status}`);
    return res.json();
  },

  // Customer Assignments
  async getCustomerAssignments(wineClubId: string) {
    const res = await fetch(`${BASE_URL}/customer-assignments/${wineClubId}`, {
      headers: { Authorization: `Bearer ${publicAnonKey}` },
    });
    if (!res.ok) throw new Error(`Customer assignments fetch failed: ${res.status}`);
    return res.json();
  },

  async createCustomerAssignment(data: any) {
    const res = await fetch(`${BASE_URL}/customer-assignments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Customer assignment creation failed: ${res.status}`);
    return res.json();
  },

  // Legacy Customer Preferences (for backward compatibility)
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

  // Square Customers
  async getSquareCustomers() {
    const res = await fetch(`${BASE_URL}/square/customers`, {
      headers: { Authorization: `Bearer ${publicAnonKey}` },
    });
    if (!res.ok) throw new Error(`Square customers fetch failed: ${res.status}`);
    return res.json();
  },

  async syncSquareCustomers(wineClubId: string) {
    const res = await fetch(`${BASE_URL}/square/sync-customers`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ wine_club_id: wineClubId }),
    });
    if (!res.ok) throw new Error(`Square customers sync failed: ${res.status}`);
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

  // Shipping Schedule
  async getShippingSchedule(wineClubId: string) {
    const res = await fetch(`${BASE_URL}/shipping-schedule/${wineClubId}`, {
      headers: { Authorization: `Bearer ${publicAnonKey}` },
    });
    if (!res.ok) throw new Error(`Shipping schedule fetch failed: ${res.status}`);
    return res.json();
  },

  async saveShippingSchedule(data: any) {
    const res = await fetch(`${BASE_URL}/shipping-schedule`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Shipping schedule save error:', errorText);
      throw new Error(`Shipping schedule save failed: ${res.status} - ${errorText}`);
    }
    return res.json();
  },

  // Email Service Functions
  async sendMagicLink(email: string, wineClubId: string) {
    const res = await fetch(`${BASE_URL}/email/magic-link`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, wine_club_id: wineClubId }),
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Magic link send failed: ${res.status} - ${errorText}`);
    }
    return res.json();
  },

  async sendWelcomeEmail(email: string, name: string, wineClubId: string, planName: string) {
    const res = await fetch(`${BASE_URL}/email/welcome`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, name, wine_club_id: wineClubId, plan_name: planName }),
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Welcome email send failed: ${res.status} - ${errorText}`);
    }
    return res.json();
  },

  async sendShipmentNotification(email: string, name: string, wineClubId: string, approvalUrl: string, deadline: string) {
    const res = await fetch(`${BASE_URL}/email/shipment-notification`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, name, wine_club_id: wineClubId, approval_url: approvalUrl, deadline }),
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Shipment notification send failed: ${res.status} - ${errorText}`);
    }
    return res.json();
  },

  async sendVerificationEmail(email: string, wineClubId: string, verificationUrl: string) {
    const res = await fetch(`${BASE_URL}/email/verify`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, wine_club_id: wineClubId, verification_url: verificationUrl }),
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Verification email send failed: ${res.status} - ${errorText}`);
    }
    return res.json();
  },

  // Square Customer Groups (Segments) Functions
  async getSquareSegments() {
    const res = await fetch(`${BASE_URL}/square/segments`, {
      headers: { Authorization: `Bearer ${publicAnonKey}` },
    });
    if (!res.ok) throw new Error(`Square segments fetch failed: ${res.status}`);
    return res.json();
  },

  async createSquareSegment(segmentName: string, description?: string) {
    const res = await fetch(`${BASE_URL}/square/segments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ segmentName, description }),
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Square segment creation failed: ${res.status} - ${errorText}`);
    }
    return res.json();
  },

  async addCustomerToSquareSegment(segmentId: string, customerId: string) {
    const res = await fetch(`${BASE_URL}/square/segments/${segmentId}/customers`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ customerId }),
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Add customer to segment failed: ${res.status} - ${errorText}`);
    }
    return res.json();
  },

  async removeCustomerFromSquareSegment(segmentId: string, customerId: string) {
    const res = await fetch(`${BASE_URL}/square/segments/${segmentId}/customers/${customerId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${publicAnonKey}` },
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Remove customer from segment failed: ${res.status} - ${errorText}`);
    }
    return res.json();
  },

  async getCustomersInSquareSegment(segmentId: string) {
    const res = await fetch(`${BASE_URL}/square/segments/${segmentId}/customers`, {
      headers: { Authorization: `Bearer ${publicAnonKey}` },
    });
    if (!res.ok) throw new Error(`Get customers in segment failed: ${res.status}`);
    return res.json();
  },
};
