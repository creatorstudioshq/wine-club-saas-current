import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Skeleton } from "./ui/skeleton";
import { Users, Package, TrendingUp, DollarSign, Wine, Truck } from "lucide-react";
import { api } from "../utils/api";

const KING_FROSCH_ID = "550e8400-e29b-41d4-a716-446655440000";

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [plans, setPlans] = useState([]);
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [membersRes, shipmentsRes, plansRes, inventoryRes] = await Promise.all([
          api.getMembers(KING_FROSCH_ID).catch(() => ({ members: [] })),
          api.getShipments(KING_FROSCH_ID).catch(() => ({ shipments: [] })),
          api.getPlans(KING_FROSCH_ID).catch(() => ({ plans: [] })),
          api.getLiveInventory(KING_FROSCH_ID, 'all', 0).catch(() => ({ wines: [] }))
        ]);

        setMembers(membersRes.members || []);
        setShipments(shipmentsRes.shipments || []);
        setPlans(plansRes.plans || []);
        setInventory(inventoryRes.wines || []);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Graceful fallback
        setMembers([]);
        setShipments([]);
        setPlans([]);
        setInventory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate plan distribution (deduplicate by plan ID)
  const planDistribution = plans.reduce((acc, plan) => {
    // Check if plan already exists in accumulator
    const existingPlan = acc.find(p => p.id === plan.id);
    if (existingPlan) {
      return acc; // Skip duplicates
    }
    
    const planMembers = members.filter(member => member.subscription_plan_id === plan.id);
    const totalMembers = members.length;
    const percentage = totalMembers > 0 ? Math.round((planMembers.length / totalMembers) * 100) : 0;
    
    acc.push({
      id: plan.id,
      plan: plan.name,
      count: planMembers.length,
      percentage
    });
    
    return acc;
  }, [] as Array<{id: string, plan: string, count: number, percentage: number}>);

  // Calculate total bottles in inventory
  const totalBottles = inventory.reduce((sum, wine) => sum + (wine.total_inventory || 0), 0);

  const stats = [
    {
      title: "Total Members",
      value: members.length.toString(),
      change: "+0%",
      changeType: "positive" as const,
      icon: Users,
    },
    {
      title: "Active Shipments",
      value: shipments.filter(s => s.status === 'draft' || s.status === 'scheduled').length.toString(),
      change: "+0%",
      changeType: "positive" as const,
      icon: Truck,
    },
    {
      title: "Wine Inventory",
      value: `${inventory.length} wines`,
      subtitle: `${totalBottles} bottles`,
      change: "+0%",
      changeType: "positive" as const,
      icon: Wine,
    },
    {
      title: "Subscription Plans",
      value: plans.length.toString(),
      change: "+0%",
      changeType: "positive" as const,
      icon: Package,
    },
  ];

  const recentShipments = shipments.slice(0, 4).map(shipment => ({
    id: shipment.id.slice(0, 8),
    name: shipment.name,
    status: shipment.status,
    date: new Date(shipment.ship_date).toLocaleDateString(),
    itemCount: shipment.shipment_items?.length || 0
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1>Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your wine club performance and key metrics.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))
        ) : (
          stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{stat.value}</div>
                {stat.subtitle && (
                  <p className="text-xs text-muted-foreground mb-1">
                    {stat.subtitle}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  <span className={stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}>
                    {stat.change}
                  </span>{' '}
                  from last month
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Shipments */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Shipments</CardTitle>
            <CardDescription>
              Latest wine shipment activities across all plans.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentShipments.length > 0 ? (
              <div className="space-y-4">
                {recentShipments.map((shipment) => (
                  <div key={shipment.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="text-sm">{shipment.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {shipment.itemCount} wine items • {shipment.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={
                          shipment.status === 'delivered' ? 'default' :
                          shipment.status === 'shipped' ? 'secondary' :
                          shipment.status === 'scheduled' ? 'outline' : 'destructive'
                        }
                      >
                        {shipment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No shipments created yet.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Plan Distribution */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Plan Distribution</CardTitle>
            <CardDescription>
              Member distribution across subscription plans.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
              ))
            ) : planDistribution.length > 0 ? (
              planDistribution.map((plan) => (
                <div key={plan.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{plan.plan}</span>
                    <span className="text-sm text-muted-foreground">{plan.count} members</span>
                  </div>
                  <Progress value={plan.percentage} className="h-2" />
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No member data available.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks to manage your wine club operations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
              <Package className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm">Sync Inventory</p>
                <p className="text-xs text-muted-foreground">Update from Square</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
              <TrendingUp className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm">Create Shipment</p>
                <p className="text-xs text-muted-foreground">New wine selection</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm">Import Members</p>
                <p className="text-xs text-muted-foreground">Upload CSV file</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}