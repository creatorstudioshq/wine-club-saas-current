import { serverEnv } from "./env.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

const supabase = createClient(
  serverEnv.SUPABASE_URL,
  serverEnv.SUPABASE_SERVICE_ROLE_KEY,
);

// Get Square configuration for a specific wine club
export async function getSquareConfig(wineClubId: string) {
  try {
    // Get wine club's Square credentials from database
    const { data: wineClub, error } = await supabase
      .from('wine_clubs')
      .select('square_location_id, square_access_token')
      .eq('id', wineClubId)
      .single();

    if (error || !wineClub) {
      return { 
        success: false, 
        error: 'Wine club not found or Square not configured' 
      };
    }

    if (!wineClub.square_location_id || !wineClub.square_access_token) {
      return { 
        success: false, 
        error: 'Square credentials not configured for this wine club' 
      };
    }

    const environment = wineClub.square_access_token.includes('sandbox') ? 'sandbox' : 'production';
    const baseUrl = environment === 'sandbox' 
      ? 'https://connect.squareupsandbox.com' 
      : 'https://connect.squareup.com';

    return { 
      success: true,
      token: wineClub.square_access_token,
      locationId: wineClub.square_location_id,
      environment,
      baseUrl
    };
  } catch (error) {
    return { 
      success: false, 
      error: error.message 
    };
  }
}

// Generate idempotency key
export function generateIdempotencyKey(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(7)}`;
}

// List all customers
export async function listCustomers(wineClubId: string) {
  const configResult = await getSquareConfig(wineClubId);
  
  if (!configResult.success) {
    return { success: false, error: configResult.error };
  }

  const { token, baseUrl } = configResult;
  
  try {
    const response = await fetch(`${baseUrl}/v2/customers`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Square-Version': '2024-01-18',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: errorText };
    }

    const data = await response.json();
    return { success: true, customers: data.customers || [] };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// List customer segments
export async function listCustomerSegments(wineClubId: string) {
  const configResult = await getSquareConfig(wineClubId);
  
  if (!configResult.success) {
    return { success: false, error: configResult.error };
  }

  const { token, baseUrl } = configResult;
  
  try {
    const response = await fetch(`${baseUrl}/v2/customers/segments`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Square-Version': '2024-01-18',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: errorText };
    }

    const data = await response.json();
    return { success: true, segments: data.segments || [] };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Get specific customer segment
export async function getCustomerSegment(wineClubId: string, segmentId: string) {
  const configResult = await getSquareConfig(wineClubId);
  
  if (!configResult.success) {
    return { success: false, error: configResult.error };
  }

  const { token, baseUrl } = configResult;
  
  try {
    const response = await fetch(`${baseUrl}/v2/customers/segments/${segmentId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Square-Version': '2024-01-18',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: errorText };
    }

    const data = await response.json();
    return { success: true, segment: data.segment };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Create customer segment (group)
export async function createCustomerSegment(wineClubId: string, segmentName: string, description?: string) {
  const configResult = await getSquareConfig(wineClubId);
  
  if (!configResult.success) {
    return { success: false, error: configResult.error };
  }

  const { token, baseUrl } = configResult;

  try {
    const response = await fetch(`${baseUrl}/v2/customers/segments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Square-Version': '2024-01-18',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        segment: {
          name: segmentName,
          description: description || `Customer group for ${segmentName} plan`
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: errorText };
    }

    const data = await response.json();
    return { success: true, segment: data.segment };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Add customer to segment
export async function addCustomerToSegment(wineClubId: string, customerId: string, segmentId: string) {
  const configResult = await getSquareConfig(wineClubId);
  
  if (!configResult.success) {
    return { success: false, error: configResult.error };
  }

  const { token, baseUrl } = configResult;

  try {
    // First, get the customer to update their segment_ids
    const customerResponse = await fetch(`${baseUrl}/v2/customers/${customerId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Square-Version': '2024-01-18',
        'Content-Type': 'application/json'
      }
    });

    if (!customerResponse.ok) {
      const errorText = await customerResponse.text();
      return { success: false, error: errorText };
    }

    const customerData = await customerResponse.json();
    const customer = customerData.customer;
    
    // Add segment to existing segments
    const currentSegments = customer.segment_ids || [];
    const updatedSegments = [...currentSegments, segmentId];

    // Update customer with new segment
    const updateResponse = await fetch(`${baseUrl}/v2/customers/${customerId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Square-Version': '2024-01-18',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        customer: {
          ...customer,
          segment_ids: updatedSegments
        }
      })
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      return { success: false, error: errorText };
    }

    const updateData = await updateResponse.json();
    return { success: true, customer: updateData.customer };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Remove customer from segment
export async function removeCustomerFromSegment(customerId: string, segmentId: string) {
  const { token, baseUrl } = getSquareConfig();
  
  if (!token) {
    return { success: false, error: 'Square API not configured' };
  }

  try {
    // First, get the customer to update their segment_ids
    const customerResponse = await fetch(`${baseUrl}/v2/customers/${customerId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Square-Version': '2024-01-18',
        'Content-Type': 'application/json'
      }
    });

    if (!customerResponse.ok) {
      const errorText = await customerResponse.text();
      return { success: false, error: errorText };
    }

    const customerData = await customerResponse.json();
    const customer = customerData.customer;
    
    // Remove segment from existing segments
    const currentSegments = customer.segment_ids || [];
    const updatedSegments = currentSegments.filter(id => id !== segmentId);

    // Update customer with updated segments
    const updateResponse = await fetch(`${baseUrl}/v2/customers/${customerId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Square-Version': '2024-01-18',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        customer: {
          ...customer,
          segment_ids: updatedSegments
        }
      })
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      return { success: false, error: errorText };
    }

    const updateData = await updateResponse.json();
    return { success: true, customer: updateData.customer };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Get customers in a specific segment
export async function getCustomersInSegment(segmentId: string) {
  const { token, baseUrl } = getSquareConfig();
  
  if (!token) {
    return { success: false, error: 'Square API not configured' };
  }

  try {
    const response = await fetch(`${baseUrl}/v2/customers/search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Square-Version': '2024-01-18',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: {
          filter: {
            segment_ids: {
              all: [segmentId]
            }
          }
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: errorText };
    }

    const data = await response.json();
    return { success: true, customers: data.customers || [] };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Create order
export async function createOrder(orderData: any) {
  const { token, locationId, baseUrl } = getSquareConfig();
  
  if (!token || !locationId) {
    return { success: false, error: 'Square API not configured' };
  }

  try {
    const response = await fetch(`${baseUrl}/v2/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Square-Version': '2024-01-18',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        idempotency_key: orderData.idempotencyKey,
        order: {
          location_id: locationId,
          ...orderData.order
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: errorText };
    }

    const data = await response.json();
    return { success: true, order: data.order };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Create payment
export async function createPayment(paymentData: any) {
  const { token, locationId, baseUrl } = getSquareConfig();
  
  if (!token || !locationId) {
    return { success: false, error: 'Square API not configured' };
  }

  try {
    const response = await fetch(`${baseUrl}/v2/payments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Square-Version': '2024-01-18',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        idempotency_key: paymentData.idempotencyKey,
        amount_money: paymentData.amountMoney,
        source_id: paymentData.sourceId,
        customer_id: paymentData.customerId,
        location_id: locationId,
        ...paymentData
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: errorText };
    }

    const data = await response.json();
    return { success: true, payment: data.payment };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Create card on file
export async function createCard(customerId: string, sourceId: string, idempotencyKey: string) {
  const { token, baseUrl } = getSquareConfig();
  
  if (!token) {
    return { success: false, error: 'Square API not configured' };
  }

  try {
    const response = await fetch(`${baseUrl}/v2/cards`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Square-Version': '2024-01-18',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        idempotency_key: idempotencyKey,
        source_id: sourceId,
        card: {
          customer_id: customerId
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: errorText };
    }

    const data = await response.json();
    return { success: true, card: data.card };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Create wine club shipment
export async function createWineClubShipment(shipmentData: any) {
  const { token, locationId, baseUrl } = getSquareConfig();
  
  if (!token || !locationId) {
    return { success: false, error: 'Square API not configured' };
  }

  try {
    // Create order for the shipment
    const orderResponse = await fetch(`${baseUrl}/v2/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Square-Version': '2024-01-18',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        idempotency_key: generateIdempotencyKey(),
        order: {
          location_id: locationId,
          customer_id: shipmentData.customerId,
          line_items: shipmentData.lineItems,
          ...shipmentData.orderData
        }
      })
    });

    if (!orderResponse.ok) {
      const errorText = await orderResponse.text();
      return { success: false, error: errorText };
    }

    const orderData = await orderResponse.json();
    return { success: true, order: orderData.order };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
