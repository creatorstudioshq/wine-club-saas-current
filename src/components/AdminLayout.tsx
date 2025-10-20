import * as React from "react";
import { 
  Home, 
  Users, 
  Package, 
  CreditCard, 
  Truck, 
  Settings,
  Wine,
  ChevronDown,
  Building,
  Heart,
  Mail,
  Shield,
  Calendar,
  Code,
  ToggleLeft,
  ToggleRight,
  Sparkles
} from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { useClient } from "../contexts/ClientContext";

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
  onLogout: () => void;
}

const navigation = [
  { name: "Dashboard", icon: Home, id: "dashboard" },
  { name: "Members", icon: Users, id: "members" },
  { name: "Shipments", icon: Truck, id: "shipments" },
  { name: "Fulfillment", icon: Package, id: "fulfillment" },
  { name: "Marketing", icon: Mail, id: "marketing" },
  { name: "Club Setup", icon: Settings, id: "square-config" },
  { name: "Shipping Schedule", icon: Calendar, id: "shipping-schedule" },
  { name: "Embeddable Signup", icon: Code, id: "embeddable-signup" },
];

export function AdminLayout({ children, currentPage, onPageChange, onLogout }: AdminLayoutProps) {
  const { currentWineClub } = useClient();
  const [isDemoMode, setIsDemoMode] = React.useState(
    localStorage.getItem('demo_mode') === 'true' || 
    window.location.hostname === 'localhost'
  );

  const toggleDemoMode = () => {
    const newDemoMode = !isDemoMode;
    setIsDemoMode(newDemoMode);
    localStorage.setItem('demo_mode', newDemoMode.toString());
    
    // Reload the page to apply the new demo mode
    window.location.reload();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader className="border-b border-sidebar-border p-4">
            <div className="flex items-center gap-2">
              <Wine className="h-8 w-8 text-primary" />
              <div>
                <h2>{currentWineClub?.name || "Wine Club"}</h2>
                <p className="text-sm text-muted-foreground">Wine Club Manager (Portal)</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onPageChange(item.id)}
                    isActive={currentPage === item.id}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="border-t border-sidebar-border p-4">
            {/* Demo Mode Toggle - Admin Only */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">Demo Mode</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleDemoMode}
                  className="flex items-center space-x-1 h-6 px-2"
                >
                  {isDemoMode ? (
                    <>
                      <ToggleRight className="h-3 w-3 text-green-600" />
                      <span className="text-xs text-green-600 font-medium">ON</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">OFF</span>
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {isDemoMode ? "Using demo data" : "Using real wine club data"}
              </p>
            </div>

            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton>
                      <Settings className="h-4 w-4" />
                      <span>Client Setup</span>
                      <ChevronDown className="h-4 w-4 ml-auto" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => onPageChange("square-config")}>
                      <Building className="h-4 w-4 mr-2" />
                      Configure {currentWineClub?.name}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onPageChange("superadmin")}>
                      <Shield className="h-4 w-4 mr-2" />
                      SaaS Admin
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onPageChange("embedded-signup")}>
                      <Users className="h-4 w-4 mr-2" />
                      Embedded Signup
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
            <div className="flex h-14 items-center gap-4 px-4">
              <SidebarTrigger />
              <div className="ml-auto flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={onLogout}>
                  Logout
                </Button>
              </div>
            </div>
          </header>
          
          <div className="flex-1 p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}