import { useEffect } from 'react';
import { api } from '../utils/api';

interface AuthCallbackProps {
  onAuthSuccess: (email: string) => void;
  onAuthError: () => void;
}

export function AuthCallback({ onAuthSuccess, onAuthError }: AuthCallbackProps) {
  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the current user after magic link authentication
        const user = await api.getCurrentUser();
        
        if (user) {
          // Call the parent component's auth success handler
          onAuthSuccess(user.email || '');
        } else {
          onAuthError();
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        onAuthError();
      }
    };

    handleAuthCallback();
  }, [onAuthSuccess, onAuthError]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-lg font-medium">Completing sign in...</p>
        <p className="text-sm text-muted-foreground">Please wait while we redirect you.</p>
      </div>
    </div>
  );
}
