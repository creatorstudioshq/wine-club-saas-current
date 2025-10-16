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
    // For now, default to King Frosch for development
    // In production, this would come from authentication
    const defaultClub: WineClub = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: "King Frosch Wine Club",
      email: "admin@kingfrosch.com"
    };
    
    setCurrentWineClub(defaultClub);
    setIsLoading(false);
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
