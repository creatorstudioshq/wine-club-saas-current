// Client-side environment helper that safely accesses browser environment
import { projectId, publicAnonKey } from "./supabase/info";

// Safe environment access for client-side code
export const clientEnv = {
  // Supabase configuration (from info file)
  SUPABASE_URL: `https://${projectId}.supabase.co`,
  SUPABASE_ANON_KEY: publicAnonKey,
  
  // App configuration
  APP_URL: typeof window !== 'undefined' 
    ? window.location.origin 
    : 'http://localhost:3000',
    
  // Wine Club ID (constant)
  DEFAULT_WINE_CLUB_ID: '1',
};

// Client-side deployment detection
export const getClientDeployment = () => {
  if (typeof window === 'undefined') return { platform: 'server' };
  
  const hostname = window.location.hostname;
  const isVercel = hostname.includes('.vercel.app') || hostname.includes('.app');
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
  
  return {
    platform: isVercel ? 'vercel' : isLocal ? 'local' : 'unknown',
    isLocal,
    isVercel,
    hostname
  };
};