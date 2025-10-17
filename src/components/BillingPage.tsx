import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Skeleton } from "./ui/skeleton";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { CreditCard, Search, Plus, Eye, DollarSign, Calendar, AlertCircle, CheckCircle } from "lucide-react";
import { api } from "../utils/api";

interface BillingPlan {
  id: string;
  wine_club_id: string;
  wine_club_name: string;
  plan_name: string;
  price: number;
  billing_cycle: 'monthly' | 'yearly';
  status: 'active' | 'cancelled' | 'past_due';
  stripe_subscription_id?: string;
  stripe_customer_id?: string;
  current_period_start: string;
  current_period_end: string;
  created_at: string;
}

interface BillingStats {
  totalRevenue: number;
  monthlyRecurring: number;
  activeSubscriptions: number;
  cancelledSubscriptions: number;
  overdueSubscriptions: number;
}

export function BillingPage() {
  const [billingPlans, setBillingPlans] = useState<BillingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        setLoading(true);
        
        // Mock billing data - in real implementation, this would fetch from Stripe API
        const mockBillingPlans: BillingPlan[] = [
          {
            id: "1",
            wine_club_id: "550e8400-e29b-41d4-a716-446655440000",
            wine_club_name: "King Frosch Wine Club",
            plan_name: "Premium Plan",
            price: 99,
            billing_cycle: 'monthly',
            status: 'active',
            stripe_subscription_id: 'sub_1234567890',
            stripe_customer_id: 'cus_1234567890',
            current_period_start: '2024-01-01T00:00:00Z',
            current_period_end: '2024-02-01T00:00:00Z',
            created_at: '2024-01-01T00:00:00Z'
          },
          {
            id: "2",
            wine_club_id: "550e8400-e29b-41d4-a716-446655440001",
            wine_club_name: "Napa Valley Wine Club",
            plan_name: "Standard Plan",
            price: 49,
            billing_cycle: 'monthly',
            status: 'active',
            stripe_subscription_id: 'sub_0987654321',
            stripe_customer_id: 'cus_0987654321',
            current_period_start: '2024-01-15T00:00:00Z',
            current_period_end: '2024-02-15T00:00:00Z',
            created_at: '2024-01-15T00:00:00Z'
          }
        ];
        
        setBillingPlans(mockBillingPlans);
        
      } catch (error) {
        console.error('Failed to fetch billing data:', error);
        setBillingPlans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBillingData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'past_due': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      case 'past_due': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const filteredPlans = billingPlans.filter(plan => {
    const matchesSearch = plan.wine_club_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.plan_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || plan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const billingStats: BillingStats = {
    totalRevenue: billingPlans.reduce((sum, plan) => sum + plan.price, 0),
    monthlyRecurring: billingPlans.filter(p => p.status === 'active').reduce((sum, plan) => sum + plan.price, 0),
    activeSubscriptions: billingPlans.filter(p => p.status === 'active').length,
    cancelledSubscriptions: billingPlans.filter(p => p.status === 'cancelled').length,
    overdueSubscriptions: billingPlans.filter(p => p.status === 'past_due').length
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
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${billingStats.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Recurring</p>
                <p className="text-2xl font-bold">${billingStats.monthlyRecurring.toLocaleString()}</p>
              </div>
              <CreditCard className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{billingStats.activeSubscriptions}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cancelled</p>
                <p className="text-2xl font-bold">{billingStats.cancelledSubscriptions}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold">{billingStats.overdueSubscriptions}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Billing Plans Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Club Billing Plans</CardTitle>
              <CardDescription>
                Manage Stripe subscriptions and billing for wine clubs
              </CardDescription>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Plan
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search plans..."
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
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="past_due">Past Due</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Wine Club</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Billing Cycle</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Current Period</TableHead>
                <TableHead>Stripe ID</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell>
                    <div className="font-medium">{plan.wine_club_name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{plan.plan_name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">${plan.price}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      <Calendar className="h-3 w-3 mr-1" />
                      {plan.billing_cycle}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(plan.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(plan.status)}
                        {plan.status.replace('_', ' ')}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{new Date(plan.current_period_start).toLocaleDateString()}</div>
                      <div className="text-muted-foreground">to {new Date(plan.current_period_end).toLocaleDateString()}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-mono">
                      {plan.stripe_subscription_id ? plan.stripe_subscription_id.substring(0, 12) + '...' : 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <CreditCard className="h-4 w-4" />
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
