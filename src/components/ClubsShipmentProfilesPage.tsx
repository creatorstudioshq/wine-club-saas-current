import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Skeleton } from "./ui/skeleton";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Package, Search, Plus, Eye, Edit, Truck, Calendar, MapPin } from "lucide-react";
// import { api } from "../utils/api"; // TODO: Implement shipment profiles API

interface ShipmentProfile {
  id: string;
  wine_club_id: string;
  wine_club_name?: string;
  name: string;
  description?: string;
  frequency: string;
  shipping_zones: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function ClubsShipmentProfilesPage() {
  const [shipmentProfiles, setShipmentProfiles] = useState<ShipmentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchShipmentProfiles = async () => {
      try {
        setLoading(true);
        
        // For now, we'll create mock data since we don't have a specific API endpoint
        // In a real implementation, this would fetch from a shipment_profiles table
        const mockProfiles: ShipmentProfile[] = [
          {
            id: "1",
            wine_club_id: "550e8400-e29b-41d4-a716-446655440000",
            wine_club_name: "King Frosch Wine Club",
            name: "Monthly Premium",
            description: "Monthly shipment of premium wines",
            frequency: "Monthly",
            shipping_zones: ["US", "Canada"],
            is_active: true,
            created_at: "2024-01-15T00:00:00Z",
            updated_at: "2024-01-15T00:00:00Z"
          },
          {
            id: "2",
            wine_club_id: "550e8400-e29b-41d4-a716-446655440000",
            wine_club_name: "King Frosch Wine Club",
            name: "Bi-Monthly Classic",
            description: "Bi-monthly shipment of classic wines",
            frequency: "Bi-Monthly",
            shipping_zones: ["US"],
            is_active: true,
            created_at: "2024-01-20T00:00:00Z",
            updated_at: "2024-01-20T00:00:00Z"
          }
        ];
        
        setShipmentProfiles(mockProfiles);
        
      } catch (error) {
        console.error('Failed to fetch shipment profiles:', error);
        setShipmentProfiles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchShipmentProfiles();
  }, []);

  const filteredProfiles = shipmentProfiles.filter(profile => {
    const matchesSearch = profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.wine_club_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && profile.is_active) ||
                         (statusFilter === "inactive" && !profile.is_active);
    return matchesSearch && matchesStatus;
  });

  const profileStats = {
    total: shipmentProfiles.length,
    active: shipmentProfiles.filter(p => p.is_active).length,
    inactive: shipmentProfiles.filter(p => !p.is_active).length,
    monthly: shipmentProfiles.filter(p => p.frequency === "Monthly").length,
    biMonthly: shipmentProfiles.filter(p => p.frequency === "Bi-Monthly").length
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => (
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Profiles</p>
                <p className="text-2xl font-bold">{profileStats.total}</p>
              </div>
              <Package className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{profileStats.active}</p>
              </div>
              <Package className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Inactive</p>
                <p className="text-2xl font-bold">{profileStats.inactive}</p>
              </div>
              <Package className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly</p>
                <p className="text-2xl font-bold">{profileStats.monthly}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bi-Monthly</p>
                <p className="text-2xl font-bold">{profileStats.biMonthly}</p>
              </div>
              <Truck className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Shipment Profiles</CardTitle>
              <CardDescription>
                Manage shipment profiles and shipping configurations across wine clubs
              </CardDescription>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Profile
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search profiles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Profile Name</TableHead>
                <TableHead>Wine Club</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Shipping Zones</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProfiles.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell>
                    <div className="font-medium">{profile.name}</div>
                  </TableCell>
                  <TableCell>
                    {profile.wine_club_name}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground max-w-xs truncate">
                      {profile.description || 'No description'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      <Calendar className="h-3 w-3 mr-1" />
                      {profile.frequency}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {profile.shipping_zones.map((zone, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          <MapPin className="h-3 w-3 mr-1" />
                          {zone}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={profile.is_active ? "default" : "secondary"}>
                      {profile.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(profile.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
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
