import { clientEnv } from './client-env';

// Re-export client environment for backward compatibility
export const env = clientEnv;

// Helper to check if client-side environment is properly configured
export const isEnvConfigured = {
  supabase: !!(clientEnv.SUPABASE_URL && clientEnv.SUPABASE_ANON_KEY),
  // Square configuration is checked server-side
  square: false, // Will be determined by server API calls
  email: false, // Server-side only
  sms: false, // Server-side only
};

import { getClientDeployment } from './client-env';

// Re-export for backward compatibility  
export const getDeploymentInfo = getClientDeployment;

// Square environment detection is handled server-side
// Client-side doesn't have access to Square credentials for security