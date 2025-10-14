import { Hono } from "npm:hono@4.6.11";
import { serverEnv, isServerEnvConfigured, getSquareEnvironment } from "./env.tsx";

const envStatus = new Hono();

// Environment status endpoint for debugging
envStatus.get("/make-server-9d538b9c/env-status", async (c) => {
  try {
    const squareToken = serverEnv.SQUARE_ACCESS_TOKEN;
    const squareLocation = serverEnv.SQUARE_LOCATION_ID;
    const detectedEnvironment = getSquareEnvironment();
    
    const envVars = {
      SUPABASE_URL: !!serverEnv.SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: !!serverEnv.SUPABASE_SERVICE_ROLE_KEY,
      SQUARE_ACCESS_TOKEN: !!squareToken,
      SQUARE_ACCESS_TOKEN_LENGTH: squareToken?.length || 0,
      SQUARE_ACCESS_TOKEN_PREFIX: squareToken ? squareToken.substring(0, 25) + '...' : 'none',
      SQUARE_APPLICATION_ID: !!serverEnv.SQUARE_APPLICATION_ID,
      SQUARE_APPLICATION_SECRET: !!serverEnv.SQUARE_APPLICATION_SECRET,
      SQUARE_LOCATION_ID: !!squareLocation,
      SQUARE_LOCATION_VALUE: squareLocation || 'none',
      SQUARE_ENVIRONMENT_DETECTED: detectedEnvironment
    };

    const squareConfigured = !!(squareToken && squareLocation);
    const baseUrl = detectedEnvironment === 'sandbox' 
      ? 'https://connect.squareupsandbox.com' 
      : 'https://connect.squareup.com';

    return c.json({
      status: "Environment variables status",
      environment: envVars,
      configured: isServerEnvConfigured,
      square: {
        configured: squareConfigured,
        environment: detectedEnvironment,
        base_url: baseUrl,
        ready_for_api: squareConfigured
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Environment status error:', error);
    return c.json({ error: error.message }, 500);
  }
});

export default envStatus;