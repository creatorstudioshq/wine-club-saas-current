import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the current user after magic link authentication
        const user = await api.getCurrentUser();
        
        if (user) {
          // Determine which portal to redirect to based on user email
          if (user.email === 'jimmy@arccom.io') {
            navigate('/superadmin');
          } else {
            navigate('/dashboard');
          }
        } else {
          navigate('/auth');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/auth');
      }
    };

    handleAuthCallback();
  }, [navigate]);

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
