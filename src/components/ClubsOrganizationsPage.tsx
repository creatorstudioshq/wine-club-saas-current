import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Skeleton } from "./ui/skeleton";
import { Building2, Users, DollarSign, Package, Plus, Eye, Settings } from "lucide-react";
import { api } from "../utils/api";

interface WineClub {
  id: string;
  name: string;
  email: string;
  domain?: string;
  status: 'active' | 'inactive' | 'setup';
  members: number;
  monthlyRevenue: number;
  squareConnected: boolean;
  lastActivity: string;
}

export function ClubsOrganizationsPage() {
  const [wineClubs, setWineClubs] = useState<WineClub[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllWineClubs = async () => {
      try {
        setLoading(true);
        
        // Fetch all wine clubs from Supabase
        const wineClubsRes = await api.getAllWineClubs().catch(() => ({ wineClubs: [] }));
        const allClubs = wineClubsRes.wineClubs || [];
        
        // For each wine club, fetch their data
        const clubsWithData = await Promise.all(
          allClubs.map(async (club: any) => {
            try {
              const [membersRes, plansRes, shipmentsRes] = await Promise.all([
                api.getMembers(club.id).catch(() => ({ members: [] })),
                api.getPlans(club.id).catch(() => ({ plans: [] })),
                api.getShipments(club.id).catch(() => ({ shipments: [] }))
              ]);

              const members = membersRes.members || [];
              const plans = plansRes.plans || [];
              const shipments = shipmentsRes.shipments || [];

              // Calculate real revenue (simplified - would need actual payment data)
              const monthlyRevenue = members.length * 50; // Placeholder calculation

              return {
                id: club.id,
                name: club.name,
                email: club.email,
                domain: club.domain || `${club.name.toLowerCase().replace(/\s+/g, '')}.com`,
                status: club.subscription_status || "active",
                members: members.length,
                monthlyRevenue: monthlyRevenue,
                squareConnected: !!(club.square_location_id && club.square_access_token),
                lastActivity: club.updated_at ? new Date(club.updated_at).toLocaleDateString() : "Never"
              };
            } catch (error) {
              console.error(`Failed to fetch data for club ${club.name}:`, error);
              return {
                id: club.id,
                name: club.name,
                email: club.email,
                domain: club.domain || `${club.name.toLowerCase().replace(/\s+/g, '')}.com`,
                status: "error",
                members: 0,
                monthlyRevenue: 0,
                squareConnected: false,
                lastActivity: "Error"
              };
            }
          })
        );

        setWineClubs(clubsWithData);
        
      } catch (error) {
        console.error('Failed to fetch wine clubs data:', error);
        setWineClubs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllWineClubs();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'setup': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalStats = {
    clubs: wineClubs.length,
    members: wineClubs.reduce((sum, club) => sum + club.members, 0),
    revenue: wineClubs.reduce((sum, club) => sum + club.monthlyRevenue, 0),
    squareConnected: wineClubs.filter(club => club.squareConnected).length
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Clubs</p>
                <p className="text-2xl font-bold">{totalStats.clubs}</p>
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
                <p className="text-2xl font-bold">{totalStats.members}</p>
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
                <p className="text-2xl font-bold">${totalStats.revenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Square Connected</p>
                <p className="text-2xl font-bold">{totalStats.squareConnected}</p>
              </div>
              <Package className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wine Clubs Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Wine Club Organizations</CardTitle>
              <CardDescription>
                Manage all wine club tenants and their connection status
              </CardDescription>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Club
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Square</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wineClubs.map((club) => (
                <TableRow key={club.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{club.name}</div>
                      <div className="text-sm text-muted-foreground">{club.email}</div>
                      <div className="text-sm text-muted-foreground">{club.domain}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(club.status)}>
                      {club.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{club.members}</TableCell>
                  <TableCell>${club.monthlyRevenue.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={club.squareConnected ? "default" : "secondary"}>
                      {club.squareConnected ? "Connected" : "Not Connected"}
                    </Badge>
                  </TableCell>
                  <TableCell>{club.lastActivity}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
