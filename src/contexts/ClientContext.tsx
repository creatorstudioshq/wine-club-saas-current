import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WineClub {
  id: string;
  name: string;
  email: string;
  square_location_id?: string;
  square_access_token?: string;
}

interface ClientContextType {
  currentWineClub: WineClub | null;
  setCurrentWineClub: (club: WineClub | null) => void;
  isLoading: boolean;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export function ClientProvider({ children }: { children: ReactNode }) {
  const [currentWineClub, setCurrentWineClub] = useState<WineClub | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if this is a demo account or real wine club
    // In production, this would come from authentication/user session
    const isDemoAccount = window.location.hostname === 'localhost' || 
                         window.location.hostname.includes('demo') ||
                         localStorage.getItem('demo_mode') === 'true';
    
    if (isDemoAccount) {
      // Demo account for testing
      const demoClub: WineClub = {
        id: "demo", 
        name: "Demo Wine Club",
        email: "demo@wineclub.com"
      };
      
      setTimeout(() => {
        setCurrentWineClub(demoClub);
        setIsLoading(false);
      }, 0);
    } else {
      // Real wine club account (would come from auth)
      // For now, default to wine club #1 for development
      const defaultClub: WineClub = {
        id: "1", // Wine club client #1
        name: "King Frosch Wine Club",
        email: "admin@kingfrosch.com"
      };
      
      setTimeout(() => {
        setCurrentWineClub(defaultClub);
        setIsLoading(false);
      }, 0);
    }
  }, []);

  return (
    <ClientContext.Provider value={{ currentWineClub, setCurrentWineClub, isLoading }}>
      {children}
    </ClientContext.Provider>
  );
}

export function useClient() {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error('useClient must be used within a ClientProvider');
  }
  return context;
}
