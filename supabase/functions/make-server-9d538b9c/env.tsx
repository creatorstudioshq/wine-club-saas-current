// Server-side environment configuration helper
// Access to all environment variables including sensitive ones
export const serverEnv = {
  // Supabase (server-side access)
  SUPABASE_URL: Deno.env.get("SUPABASE_URL") || '',
  SUPABASE_ANON_KEY: Deno.env.get("SUPABASE_ANON_KEY") || '',
  SUPABASE_SERVICE_ROLE_KEY: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || '',
  SUPABASE_DB_URL: Deno.env.get("SUPABASE_DB_URL") || '',

  // Square API (supports multiple naming conventions)
  SQUARE_APPLICATION_ID: Deno.env.get("SQUARE_APPLICATION_ID") || Deno.env.get("SQUARE_SANDBOX_APPLICATION_ID") || '',
  SQUARE_APPLICATION_SECRET: Deno.env.get("SQUARE_APPLICATION_SECRET") || Deno.env.get("SQUARE_SANDBOX_APPLICATION_SECRET") || '',
  SQUARE_ACCESS_TOKEN: Deno.env.get("SQUARE_ACCESS_TOKEN") || Deno.env.get("SQUARE_SANDBOX_ACCESS_TOKEN") || '',
  SQUARE_LOCATION_ID: Deno.env.get("SQUARE_LOCATION_ID") || Deno.env.get("SQUARE_SANDBOX_LOCATION_ID") || '',
  SQUARE_WEBHOOK_SIGNATURE_KEY: Deno.env.get("SQUARE_WEBHOOK_SIGNATURE_KEY") || '',

  // Wine Club
  KING_FROSCH_WINE_CLUB_ID: Deno.env.get("KING_FROSCH_WINE_CLUB_ID") || '550e8400-e29b-41d4-a716-446655440000',

  // Optional: Email/SMS
  SENDGRID_API_KEY: Deno.env.get("SENDGRID_API_KEY") || '',
  TWILIO_ACCOUNT_SID: Deno.env.get("TWILIO_ACCOUNT_SID") || '',
  TWILIO_AUTH_TOKEN: Deno.env.get("TWILIO_AUTH_TOKEN") || '',
  TWILIO_PHONE_NUMBER: Deno.env.get("TWILIO_PHONE_NUMBER") || '',
};

// Helper to check if server environment is properly configured
export const isServerEnvConfigured = {
  supabase: !!(serverEnv.SUPABASE_URL && serverEnv.SUPABASE_ANON_KEY && serverEnv.SUPABASE_SERVICE_ROLE_KEY),
  square: !!((serverEnv.SQUARE_APPLICATION_ID || serverEnv.SQUARE_APPLICATION_SECRET) && serverEnv.SQUARE_ACCESS_TOKEN && serverEnv.SQUARE_LOCATION_ID),
  email: !!serverEnv.SENDGRID_API_KEY,
  sms: !!(serverEnv.TWILIO_ACCOUNT_SID && serverEnv.TWILIO_AUTH_TOKEN),
};

// Auto-detect Square environment based on variable names
export const getSquareEnvironment = () => {
  const hasSandboxVars = !!(
    Deno.env.get("SQUARE_SANDBOX_APPLICATION_ID") || 
    Deno.env.get("SQUARE_SANDBOX_APPLICATION_SECRET") ||
    Deno.env.get("SQUARE_SANDBOX_ACCESS_TOKEN") ||
    Deno.env.get("SQUARE_SANDBOX_LOCATION_ID")
  );
  
  return hasSandboxVars ? 'sandbox' : 'production';
};

// Get Square environment URL
export const getSquareEnvironmentUrl = () => {
  return getSquareEnvironment() === 'production' 
    ? 'https://connect.squareup.com'
    : 'https://connect.squareupsandbox.com';
};

// Deployment detection for server
export const getServerDeploymentInfo = () => {
  return {
    isLocal: !Deno.env.get("VERCEL"),
    isVercel: !!Deno.env.get("VERCEL"),
    isSupabase: !!serverEnv.SUPABASE_URL,
    platform: Deno.env.get("VERCEL") ? 'vercel' : 'local'
  };
};