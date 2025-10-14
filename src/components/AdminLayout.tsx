import { useState } from "react";
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
  AlertCircle,
  Calendar
} from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const navigation = [
  { name: "Dashboard", icon: Home, id: "dashboard" },
  { name: "Members", icon: Users, id: "members" },
  { name: "Inventory", icon: Package, id: "inventory" },
  { name: "Plans", icon: CreditCard, id: "plans" },
  { name: "Preferences", icon: Heart, id: "preferences" },
  { name: "Shipments", icon: Truck, id: "shipments" },
  { name: "Marketing", icon: Mail, id: "marketing" },
  { name: "Square Config", icon: Settings, id: "square-config" },
  { name: "Shipping Schedule", icon: Calendar, id: "shipping-schedule" },
];

const mockClients = [
  { id: "king-frosch", name: "King Frosch Wine Club", logo: "KF" },
  { id: "vintage-valley", name: "Vintage Valley", logo: "VV" },
  { id: "noble-wines", name: "Noble Wines", logo: "NW" },
];

export function AdminLayout({ children, currentPage, onPageChange }: AdminLayoutProps) {
  const [selectedClient, setSelectedClient] = useState("king-frosch");
  const currentClient = mockClients.find(c => c.id === selectedClient);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader className="border-b border-sidebar-border p-4">
            <div className="flex items-center gap-2">
              <Wine className="h-8 w-8 text-primary" />
              <div>
                <h2>Wine Club SaaS</h2>
                <p className="text-sm text-muted-foreground">Admin Panel</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <div className="mb-6">
              <label className="text-sm text-muted-foreground mb-2 block">Select Client</label>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mockClients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">{client.logo}</AvatarFallback>
                        </Avatar>
                        {client.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
                      Configure {currentClient?.name}
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
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{currentClient?.logo}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm">{currentClient?.name}</p>
                  <p className="text-xs text-muted-foreground">Wine Club Management</p>
                </div>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => onPageChange("customer-portal")}>
                  View Customer Portal
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