import * as React from "react";
import { 
  Home, 
  Building2, 
  Users, 
  CreditCard, 
  Settings,
  Shield,
  ChevronDown
} from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface SuperadminLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
  onLogout: () => void;
}

const superadminNavigation = [
  { name: "Dashboard", icon: Home, id: "saas-dashboard" },
  { 
    name: "Organizations", 
    icon: Building2, 
    id: "organizations"
  },
  { name: "Users", icon: Users, id: "users" },
  { name: "Billing", icon: CreditCard, id: "billing" },
  { name: "Settings", icon: Settings, id: "settings" },
];

export function SuperadminLayout({ children, currentPage, onPageChange, onLogout }: SuperadminLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader className="border-b border-sidebar-border p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h2>Wine Club SaaS</h2>
                <p className="text-sm text-muted-foreground">SaaS Parent Admin</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarMenu>
              {superadminNavigation.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onPageChange(item.id)}
                    isActive={currentPage === item.id}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
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
                    <SidebarMenuButton className="w-full justify-between">
                      <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      SaaS Parent Admin
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => onPageChange("dashboard")}>
                      <Building2 className="h-4 w-4 mr-2" />
                      Switch to Wine Club Admin
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onLogout}>
                      <Settings className="h-4 w-4 mr-2" />
                      Logout
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
                  <AvatarFallback>SA</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm">SaaS Parent Admin</p>
                  <p className="text-xs text-muted-foreground">Platform Management</p>
                </div>
              </div>
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
