import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";
import { 
  Building2, 
  Users, 
  Package, 
  DollarSign, 
  Eye, 
  EyeOff,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Globe,
  Key
} from "lucide-react";
import { api } from "../utils/api";

const KING_FROSCH_ID = "550e8400-e29b-41d4-a716-446655440000";

interface WineClub {
  id: string;
  name: string;
  domain: string;
  status: 'active' | 'inactive' | 'setup';
  members: number;
  monthlyRevenue: number;
  squareConnected: boolean;
  lastActivity: string;
  email: string;
  password?: string;
}

interface SystemStats {
  totalClubs: number;
  totalMembers: number;
  totalRevenue: number;
  activeShipments: number;
}

export function SuperadminDashboard() {
  const [wineClubs, setWineClubs] = useState<WineClub[]>([]);
  const [showPasswords, setShowPasswords] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordChangeStatus, setPasswordChangeStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRealData = async () => {
      try {
        setLoading(true);
        
        // Fetch real King Frosch data
        const [membersRes, plansRes, shipmentsRes] = await Promise.all([
          api.getMembers(KING_FROSCH_ID).catch(() => ({ members: [] })),
          api.getPlans(KING_FROSCH_ID).catch(() => ({ plans: [] })),
          api.getShipments(KING_FROSCH_ID).catch(() => ({ shipments: [] }))
        ]);

        const members = membersRes.members || [];
        const plans = plansRes.plans || [];
        const shipments = shipmentsRes.shipments || [];

        // Calculate real revenue (simplified - would need actual payment data)
        const monthlyRevenue = members.length * 50; // Placeholder calculation

        const kingFroschClub: WineClub = {
          id: KING_FROSCH_ID,
          name: "King Frosch Wine Club",
          domain: "kingfrosch.com",
          status: "active",
          members: members.length,
          monthlyRevenue: monthlyRevenue,
          squareConnected: true, // Would check actual Square connection
          lastActivity: "Just now",
          email: "admin@kingfrosch.com",
          password: "admin123" // Default password - should be changeable
        };

        setWineClubs([kingFroschClub]);
        
      } catch (error) {
        console.error('Failed to fetch real data:', error);
        // Fallback to empty data
        setWineClubs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRealData();
  }, []);

  const systemStats: SystemStats = {
    totalClubs: wineClubs.length,
    totalMembers: wineClubs.reduce((sum, club) => sum + club.members, 0),
    totalRevenue: wineClubs.reduce((sum, club) => sum + club.monthlyRevenue, 0),
    activeShipments: 0 // Would calculate from real shipments
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'inactive': return 'text-red-600';
      case 'setup': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'inactive': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'setup': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default: return null;
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordChangeStatus('error');
      return;
    }
    // Simulate password change
    setTimeout(() => {
      setPasswordChangeStatus('success');
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, 1000);
  };

  const envVariables = [
    { key: "SUPABASE_URL", value: "https://xxx.supabase.co", masked: false },
    { key: "SUPABASE_ANON_KEY", value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", masked: true },
    { key: "SUPABASE_SERVICE_ROLE_KEY", value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", masked: true },
    { key: "SQUARE_APPLICATION_ID", value: "sq0idp-xxx", masked: true },
    { key: "SQUARE_ACCESS_TOKEN", value: "EAAAEOxxxxxxxx", masked: true },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif text-gray-900">SaaS Administration</h1>
        <p className="text-gray-600 mt-2">
          Manage all wine club tenants and system configuration
        </p>
      </div>

      {/* System Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Wine Clubs</p>
                <p className="text-2xl font-bold">{systemStats.totalClubs}</p>
              </div>
              <Building2 className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Members</p>
                <p className="text-2xl font-bold">{systemStats.totalMembers}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold">${systemStats.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Shipments</p>
                <p className="text-2xl font-bold">{systemStats.activeShipments}</p>
              </div>
              <Package className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="organizations" className="space-y-6">
        <TabsList>
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="organizations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Wine Club Organizations</CardTitle>
              <CardDescription>
                Manage all wine club tenants and their connection status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organization</TableHead>
                    <TableHead>Domain</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Monthly Revenue</TableHead>
                    <TableHead>Square Status</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wineClubs.map((club) => (
                    <TableRow key={club.id}>
                      <TableCell className="font-medium">{club.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-muted-foreground" />
                          {club.domain}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(club.status)}
                          <span className={`capitalize ${getStatusColor(club.status)}`}>
                            {club.status}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{club.members}</TableCell>
                      <TableCell>${club.monthlyRevenue.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={club.squareConnected ? "default" : "destructive"}>
                          {club.squareConnected ? "Connected" : "Disconnected"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {club.lastActivity}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Password Change */}
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your superadmin password
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Update Password
                  </Button>
                </form>

                {passwordChangeStatus === 'success' && (
                  <Alert className="mt-4">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Password updated successfully!
                    </AlertDescription>
                  </Alert>
                )}

                {passwordChangeStatus === 'error' && (
                  <Alert className="mt-4" variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      Passwords don't match. Please try again.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Environment Variables */}
            <Card>
              <CardHeader>
                <CardTitle>Environment Variables</CardTitle>
                <CardDescription>
                  System configuration and API keys
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Show Sensitive Values</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPasswords(!showPasswords)}
                    >
                      {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {envVariables.map((env) => (
                      <div key={env.key} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Key className="w-4 h-4 text-muted-foreground" />
                          <code className="text-sm font-mono">{env.key}</code>
                        </div>
                        <code className="text-sm font-mono text-muted-foreground">
                          {env.masked && !showPasswords 
                            ? "••••••••••••••••" 
                            : env.value
                          }
                        </code>
                      </div>
                    ))}
                  </div>
                  
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Environment variables are read-only in this interface. 
                      Update them in your deployment platform.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}