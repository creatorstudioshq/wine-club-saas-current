import { Hono } from "npm:hono";
import { serverEnv } from "./env.tsx";

const squareLiveInventory = new Hono();

// Simple Square API configuration - Production only
function getSquareConfig() {
  const token = serverEnv.SQUARE_ACCESS_TOKEN;
  const locationId = serverEnv.SQUARE_LOCATION_ID;
  const baseUrl = 'https://connect.squareup.com'; // Production only

  console.log('Square Config:', {
    has_token: !!token,
    token_length: token?.length || 0,
    token_prefix: token ? token.substring(0, 10) + '...' : 'none',
    has_location: !!locationId,
    location_id: locationId || 'none',
    environment: 'production',
    base_url: baseUrl
  });

  return { token, locationId, baseUrl };
}

// Helper to extract custom attribute value
function getCustomAttribute(obj: any, attributeName: string): string | null {
  if (!obj?.custom_attribute_values) return null;
  
  // Find the attribute by name
  for (const [key, value] of Object.entries(obj.custom_attribute_values)) {
    const attr: any = value;
    if (attr?.name === attributeName && attr?.string_value) {
      return attr.string_value;
    }
  }
  return null;
}

// Parse the Square catalog response
function parseSquareCatalog(data: any) {
  const objects = data.objects || [];
  
  // Separate objects by type
  const items = objects.filter((o: any) => o.type === 'ITEM');
  const categories = objects.filter((o: any) => o.type === 'CATEGORY');
  const images = objects.filter((o: any) => o.type === 'IMAGE');
  
  console.log(`Catalog contains: ${items.length} items, ${categories.length} categories, ${images.length} images`);
  
  // Build lookup maps
  const categoryMap = new Map();
  categories.forEach((cat: any) => {
    if (cat.category_data?.name) {
      categoryMap.set(cat.id, cat.category_data.name);
    }
  });
  
  const imageMap = new Map();
  images.forEach((img: any) => {
    if (img.image_data?.url) {
      imageMap.set(img.id, img.image_data.url);
    }
  });
  
  // Process items
  const wines = items.map((item: any) => {
    const itemData = item.item_data;
    if (!itemData) return null;
    
    // Get primary category
    let categoryName = 'Uncategorized';
    if (itemData.categories && itemData.categories.length > 0) {
      const firstCategoryId = itemData.categories[0].id;
      categoryName = categoryMap.get(firstCategoryId) || 'Uncategorized';
    }
    
    // Get image URL
    let imageUrl = null;
    if (itemData.image_ids && itemData.image_ids.length > 0) {
      imageUrl = imageMap.get(itemData.image_ids[0]) || null;
    }
    
    // Get variations (prices and inventory)
    const variations = (itemData.variations || []).map((variation: any) => {
      const varData = variation.item_variation_data;
      if (!varData) return null;
      
      const price = varData.price_money?.amount || 0;
      const inventory = varData.inventory_count || 0;
      
      // Extract variation-level attributes (override item-level)
      const varietal = getCustomAttribute(variation, 'Varietal') || getCustomAttribute(item, 'Varietal') || '';
      const sweetness = getCustomAttribute(variation, 'Sweetness') || getCustomAttribute(item, 'Sweetness') || '';
      const color = getCustomAttribute(variation, 'Color') || getCustomAttribute(item, 'Color') || '';
      
      return {
        id: variation.id,
        name: varData.name || 'Standard',
        price: price,
        inventory_count: inventory,
        varietal,
        sweetness,
        color
      };
    }).filter(Boolean);
    
    // Skip items with no variations
    if (variations.length === 0) return null;
    
    // Get item-level attributes as fallback
    const varietal = getCustomAttribute(item, 'Varietal') || variations[0]?.varietal || '';
    const sweetness = getCustomAttribute(item, 'Sweetness') || variations[0]?.sweetness || '';
    const color = getCustomAttribute(item, 'Color') || variations[0]?.color || '';
    
    return {
      square_item_id: item.id,
      name: itemData.name || 'Unknown Wine',
      category_name: categoryName,
      image_url: imageUrl,
      description: itemData.description_plaintext || itemData.description || '',
      varietal,
      sweetness,
      color,
      variations,
      total_inventory: variations.reduce((sum: number, v: any) => sum + v.inventory_count, 0)
    };
  }).filter(Boolean);
  
  return {
    wines,
    availableCategories: Array.from(categoryMap.values()),
    totalItems: wines.length
  };
}

// Helper function to fetch all items with pagination
async function fetchAllSquareItems(token: string, baseUrl: string) {
  const allObjects: any[] = [];
  let cursor: string | null = null;
  let hasMore = true;
  
  while (hasMore) {
    // Build URL with pagination
    let url = `${baseUrl}/v2/catalog/list?types=ITEM%2CCATEGORY%2CIMAGE%2CITEM_VARIATION&include_related_objects=true&limit=100`;
    if (cursor) {
      url += `&cursor=${cursor}`;
    }
    
    console.log(`Fetching Square catalog page: ${url}`);
    
    const response = await fetch(url, {
      headers: { 
        'Authorization': `Bearer ${token}`, 
        'Square-Version': '2024-01-18',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Square API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`Received ${data.objects?.length || 0} objects from Square (page)`);
    
    // Add objects to our collection
    if (data.objects) {
      allObjects.push(...data.objects);
    }
    
    // Check if there are more pages
    hasMore = !!data.cursor;
    cursor = data.cursor || null;
    
    console.log(`Total objects collected so far: ${allObjects.length}, hasMore: ${hasMore}`);
  }
  
  console.log(`Final total objects from Square: ${allObjects.length}`);
  return { objects: allObjects };
}

// Main endpoint - fetch live inventory from Square (production only)
squareLiveInventory.get("/make-server-9d538b9c/square/live-inventory/:wineClubId", async (c) => {
  try {
    const wineClubId = c.req.param('wineClubId');
    const category = c.req.query('category') || 'all';
    const limit = parseInt(c.req.query('limit') || '0', 10);
    
    console.log(`Fetching production inventory for wine club: ${wineClubId}`);
    
    const { token, locationId, baseUrl } = getSquareConfig();
    
    // Return demo data if not configured
    if (!token || !locationId) {
      console.log('Square not configured, returning demo mode');
      return c.json({ 
        error: 'not_configured',
        wines: [],
        isDemoMode: true,
        message: "Configure Square credentials in Client Setup to see live inventory"
      });
    }

    // Fetch ALL items with pagination
    const data = await fetchAllSquareItems(token, baseUrl);
    
    console.log(`Received ${data.objects?.length || 0} objects from Square`);
    
    // Parse the response
    const result = parseSquareCatalog(data);
    
    // Filter by category if requested
    let wines = result.wines;
    if (category && category !== 'all') {
      wines = wines.filter((w: any) => 
        w.category_name.toLowerCase().includes(category.toLowerCase())
      );
    }
    
    // Apply limit if specified (0 means no limit)
    if (limit > 0) {
      wines = wines.slice(0, limit);
    }
    
    console.log(`Returning ${wines.length} wines`);
    
    return c.json({
      wines,
      availableCategories: result.availableCategories,
      totalItems: result.totalItems,
      source: 'square_production',
      environment: 'production',
      message: `Live inventory from Square Production: ${wines.length} items`
    });

  } catch (error) {
    console.error('Error fetching Square inventory:', error);
    return c.json({ 
      error: 'server_error', 
      message: 'Failed to fetch inventory',
      detail: error.message,
      wines: [],
      isDemoMode: true
    }, 500);
  }
});

// Debug endpoint to test connection
squareLiveInventory.get("/make-server-9d538b9c/square/debug/:wineClubId", async (c) => {
  try {
    const { token, locationId, baseUrl } = getSquareConfig();
    
    const result: any = {
      has_token: !!token,
      has_location: !!locationId,
      token_length: token?.length || 0,
      location_id: locationId || 'none',
      environment: 'production',
      base_url: baseUrl
    };

    // Test API call if configured
    if (token) {
      try {
        const testData = await fetchAllSquareItems(token, baseUrl);
        result.api_test = {
          success: true,
          total_objects: testData.objects?.length || 0,
          items_found: testData.objects?.filter((o: any) => o.type === 'ITEM').length || 0
        };
      } catch (testError) {
        result.api_test = {
          success: false,
          error: testError.message
        };
      }
    }
    
    return c.json(result);
  } catch (error) {
    return c.json({ 
      error: error.message 
    }, 500);
  }
});

// Health check endpoint
squareLiveInventory.get("/make-server-9d538b9c/square/health/:wineClubId", async (c) => {
  const { token, locationId } = getSquareConfig();
  
  return c.json({
    configured: !!(token && locationId),
    environment: 'production',
    timestamp: new Date().toISOString()
  });
});

export default squareLiveInventory;
