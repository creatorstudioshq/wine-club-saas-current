import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Plus, Edit, Trash2, Package, Percent, RefreshCw, MapPin, DollarSign } from "lucide-react";
import { api } from "../utils/api";
import { useClient } from "../contexts/ClientContext";

interface Plan {
  id: string;
  name: string;
  bottle_count: number;
  discount_percentage: number;
  frequency_options: number[]; // 2, 4, 6 times per year
  pricing_type: 'discount' | 'fixed_price';
  fixed_price?: number;
  description?: string[];
  icon_url?: string;
  is_active: boolean;
  square_segment_id?: string; // Square customer group ID
}

interface ShippingZone {
  id: string;
  name: string;
  regions: string[];
  cost_per_shipment: number;
  description?: string;
}

const defaultPlans: Plan[] = [
  {
    id: "gold",
    name: "Gold",
    bottle_count: 3,
    discount_percentage: 10,
    frequency_options: [2, 4, 6],
    pricing_type: 'discount',
    description: ["Perfect starter plan for wine enthusiasts", "Curated selection of premium wines", "Monthly tasting notes included"],
    is_active: true
  },
  {
    id: "silver", 
    name: "Silver",
    bottle_count: 6,
    discount_percentage: 15,
    frequency_options: [2, 4, 6],
    pricing_type: 'discount',
    description: ["Great value for regular wine drinkers", "Mix of red and white wines", "Access to member-only events"],
    is_active: true
  },
  {
    id: "platinum",
    name: "Platinum",
    bottle_count: 12,
    discount_percentage: 20,
    frequency_options: [2, 4, 6],
    pricing_type: 'discount',
    description: ["Premium plan for wine connoisseurs", "Rare and limited edition wines", "Personal sommelier consultation", "Priority access to new releases"],
    is_active: true
  }
];

const defaultShippingZones: ShippingZone[] = [
  {
    id: "us-48",
    name: "US 48 States",
    regions: ["Continental United States"],
    cost_per_shipment: 15.00,
    description: "Standard shipping to continental US"
  },
  {
    id: "alaska",
    name: "Alaska",
    regions: ["Alaska"],
    cost_per_shipment: 35.00,
    description: "Shipping to Alaska"
  },
  {
    id: "hawaii",
    name: "Hawaii", 
    regions: ["Hawaii"],
    cost_per_shipment: 35.00,
    description: "Shipping to Hawaii"
  },
  {
    id: "puerto-rico",
    name: "Puerto Rico",
    regions: ["Puerto Rico"],
    cost_per_shipment: 25.00,
    description: "Shipping to Puerto Rico"
  },
  {
    id: "international",
    name: "International",
    regions: ["International"],
    cost_per_shipment: 75.00,
    description: "International shipping (restrictions apply)"
  }
];

export function PlansPage() {
  const { currentWineClub } = useClient();
  const [activeTab, setActiveTab] = useState("plans");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>(defaultShippingZones);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [squareGroupCounts, setSquareGroupCounts] = useState<{[key: string]: number}>({});
  
  // Plan creation/edit modal state
  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState(false);
  const [isEditPlanOpen, setIsEditPlanOpen] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [newPlan, setNewPlan] = useState<Partial<Plan>>({
    name: "",
    bottle_count: 3,
    discount_percentage: 10,
    frequency_options: [2, 4, 6],
    pricing_type: 'discount',
    description: [],
    icon_url: "",
    is_active: true
  });

  // Shipping zone creation/edit modal state
  const [isCreateShippingOpen, setIsCreateShippingOpen] = useState(false);
  const [isEditShippingOpen, setIsEditShippingOpen] = useState(false);
  const [editingZoneId, setEditingZoneId] = useState<string | null>(null);
  const [newShippingZone, setNewShippingZone] = useState<Partial<ShippingZone>>({
    name: "",
    regions: [],
    cost_per_shipment: 15.00,
    description: ""
  });

  const fetchData = async () => {
    if (!currentWineClub) return;
    
    try {
      setLoading(true);
      
      // Fetch plans from database
      const plansRes = await api.getPlans(currentWineClub.id).catch(() => ({ plans: [] }));
      setPlans(plansRes.plans || []);
      
      // Fetch members
      const membersRes = await api.getMembers(currentWineClub.id).catch(() => ({ members: [] }));
      setMembers(membersRes.members || []);
      
      // Fetch Square group member counts for each plan
      const groupCounts: {[key: string]: number} = {};
      for (const plan of plansRes.plans || []) {
        if (plan.square_segment_id) {
          try {
                 const segmentRes = await api.getCustomersInSquareSegment(plan.square_segment_id, currentWineClub.id);
            if (segmentRes.success) {
              groupCounts[plan.id] = segmentRes.count || 0;
            }
          } catch (error) {
            console.error(`Failed to fetch members for ${plan.name} group:`, error);
            groupCounts[plan.id] = 0;
          }
        } else {
          groupCounts[plan.id] = 0;
        }
      }
      setSquareGroupCounts(groupCounts);
    } catch (error) {
      console.error('Failed to fetch plans data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleCreatePlan = async () => {
    const plan: Plan = {
      id: Date.now().toString(),
      name: newPlan.name!,
      bottle_count: newPlan.bottle_count!,
      discount_percentage: newPlan.discount_percentage!,
      frequency_options: newPlan.frequency_options!,
      pricing_type: newPlan.pricing_type!,
      fixed_price: newPlan.fixed_price,
      description: newPlan.description,
      is_active: true
    };

    // Create Square customer group for this plan
    try {
      if (!currentWineClub) throw new Error('No wine club selected');
      
      const segmentResult = await api.createSquareSegment(
        `${newPlan.name} Plan Members`,
        `Customer group for ${newPlan.name} subscription plan members`,
        currentWineClub.id
      );
      
      if (segmentResult.success) {
        // Add Square segment ID to plan
        plan.square_segment_id = segmentResult.segment.id;
        console.log(`Created Square group for ${newPlan.name} plan:`, segmentResult.segment.id);
      }
    } catch (error) {
      console.error('Failed to create Square group for plan:', error);
      // Continue with plan creation even if Square group creation fails
    }

    // Save plan to database
    try {
      const planData = {
        wine_club_id: currentWineClub.id,
        name: plan.name,
        bottle_count: plan.bottle_count,
        discount_percentage: plan.discount_percentage,
        frequency_options: plan.frequency_options,
        pricing_type: plan.pricing_type,
        fixed_price: plan.fixed_price,
        description: plan.description,
        is_active: plan.is_active,
        square_segment_id: plan.square_segment_id
      };
      
      const response = await api.createPlan(planData, currentWineClub.id);
      if (response.plan) {
        plan.id = response.plan.id; // Use database ID
        setPlans([...plans, plan]);
      } else {
        // Fallback to local state if API fails
        setPlans([...plans, plan]);
      }
    } catch (error) {
      console.error('Failed to save plan to database:', error);
      // Fallback to local state
      setPlans([...plans, plan]);
    }

    setIsCreatePlanOpen(false);
    setNewPlan({
      name: "",
      bottle_count: 3,
      discount_percentage: 10,
      frequency_options: [2, 4, 6],
      pricing_type: 'discount',
      description: [],
      icon_url: "",
      is_active: true
    });
  };

  const handleCreateShippingZone = () => {
    const zone: ShippingZone = {
      id: Date.now().toString(),
      name: newShippingZone.name!,
      regions: newShippingZone.regions!,
      cost_per_shipment: newShippingZone.cost_per_shipment!,
      description: newShippingZone.description
    };

    setShippingZones([...shippingZones, zone]);
    setIsCreateShippingOpen(false);
    setNewShippingZone({
      name: "",
      regions: [],
      cost_per_shipment: 15.00,
      description: ""
    });
  };

  const handleEditPlan = (plan: Plan) => {
    setNewPlan(plan);
    setEditingPlanId(plan.id);
    setIsEditPlanOpen(true);
  };

  const handleUpdatePlan = () => {
    setPlans(plans.map(p => p.id === editingPlanId ? { ...newPlan as Plan, id: editingPlanId } : p));
    setIsEditPlanOpen(false);
    setEditingPlanId(null);
    setNewPlan({
      name: "",
      bottle_count: 3,
      discount_percentage: 10,
      frequency_options: [2, 4, 6],
      pricing_type: 'discount',
      description: [],
      icon_url: "",
      is_active: true
    });
  };

  const handleDeletePlan = (planId: string) => {
    if (confirm('Are you sure you want to delete this plan? Members using this plan will need to be reassigned.')) {
      setPlans(plans.filter(p => p.id !== planId));
    }
  };

  const handleEditShippingZone = (zone: ShippingZone) => {
    setNewShippingZone(zone);
    setEditingZoneId(zone.id);
    setIsEditShippingOpen(true);
  };

  const handleUpdateShippingZone = () => {
    setShippingZones(shippingZones.map(z => z.id === editingZoneId ? { ...newShippingZone as ShippingZone, id: editingZoneId } : z));
    setIsEditShippingOpen(false);
    setEditingZoneId(null);
    setNewShippingZone({
      name: "",
      regions: [],
      cost_per_shipment: 15.00,
      description: ""
    });
  };

  const handleDeleteShippingZone = (zoneId: string) => {
    if (confirm('Are you sure you want to delete this shipping zone?')) {
      setShippingZones(shippingZones.filter(z => z.id !== zoneId));
    }
  };

  useEffect(() => {
    if (currentWineClub) {
      fetchData();
    }
  }, [currentWineClub]);

  // Calculate stats
  const planStats = plans.map(plan => ({
    ...plan,
    memberCount: squareGroupCounts[plan.id] || 0 // Use Square group count instead of local members
  }));

  const totalMembers = members.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Subscription Plans & Shipping</h1>
          <p className="text-muted-foreground">
            Manage wine club subscription plans, pricing tiers, and shipping zones.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
          <TabsTrigger value="shipping">Shipping Zones</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-6">
          {/* Plans Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Total Plans</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{plans.length}</div>
                <p className="text-xs text-muted-foreground">
                  Active subscription plans
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Total Members</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{totalMembers}</div>
                <p className="text-xs text-muted-foreground">
                  Across all plans
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Avg Discount</CardTitle>
                <Percent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">
                  {plans.length > 0 
                    ? `${(plans.reduce((sum, plan) => sum + plan.discount_percentage, 0) / plans.length).toFixed(1)}%`
                    : '0%'
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  Average member discount
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Avg Bottles/Shipment</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">
                  {plans.length > 0 
                    ? (plans.reduce((sum, plan) => sum + plan.bottle_count, 0) / plans.length).toFixed(1)
                    : '0'
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  Across all plans
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Subscription Plans</CardTitle>
                <CardDescription>
                  Configure wine club subscription tiers with bottle counts, discounts, and frequency options.
                </CardDescription>
              </div>
              <Dialog open={isCreatePlanOpen} onOpenChange={setIsCreatePlanOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Plan
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[90vw] max-w-lg h-auto max-h-[80vh] overflow-y-auto mx-auto my-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Subscription Plan</DialogTitle>
                    <DialogDescription>
                      Set up a new wine club subscription tier.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="plan-name">Plan Name</Label>
                      <Input
                        id="plan-name"
                        value={newPlan.name || ""}
                        onChange={(e) => setNewPlan({...newPlan, name: e.target.value})}
                        placeholder="e.g. Gold, Silver, Platinum"
                      />
                    </div>

                    <div>
                      <Label htmlFor="plan-description">Plan Description</Label>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Add multiple description lines for this plan:
                        </p>
                        {(newPlan.description || []).map((desc, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={desc}
                              onChange={(e) => {
                                const newDesc = [...(newPlan.description || [])];
                                newDesc[index] = e.target.value;
                                setNewPlan({...newPlan, description: newDesc});
                              }}
                              placeholder={`Description line ${index + 1}`}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const newDesc = [...(newPlan.description || [])];
                                newDesc.splice(index, 1);
                                setNewPlan({...newPlan, description: newDesc});
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setNewPlan({
                              ...newPlan, 
                              description: [...(newPlan.description || []), ""]
                            });
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Description Line
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="plan-icon">Plan Icon (Optional)</Label>
                      <div className="space-y-2">
                        <div className="flex items-center gap-4">
                          {newPlan.icon_url ? (
                            <div className="flex items-center gap-2">
                              <img 
                                src={newPlan.icon_url} 
                                alt="Plan icon" 
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setNewPlan({...newPlan, icon_url: ""})}
                              >
                                Remove
                              </Button>
                            </div>
                          ) : (
                            <div className="w-12 h-12 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                              <Package className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                          <div className="flex-1">
                            <Input
                              id="plan-icon"
                              value={newPlan.icon_url || ""}
                              onChange={(e) => setNewPlan({...newPlan, icon_url: e.target.value})}
                              placeholder="Enter image URL or upload file"
                            />
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Enter an image URL or upload a file to customize the plan icon
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="bottles">Bottles per Shipment</Label>
                        <Select 
                          value={newPlan.bottle_count?.toString() || "3"} 
                          onValueChange={(value) => setNewPlan({...newPlan, bottle_count: parseInt(value)})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(num => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} bottle{num !== 1 ? 's' : ''}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="pricing-type">Pricing Type</Label>
                        <Select 
                          value={newPlan.pricing_type || "discount"} 
                          onValueChange={(value: 'discount' | 'fixed_price') => setNewPlan({...newPlan, pricing_type: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="discount">Percentage Discount</SelectItem>
                            <SelectItem value="fixed_price">Fixed Price</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {newPlan.pricing_type === 'discount' ? (
                      <div>
                        <Label htmlFor="discount">Discount Percentage</Label>
                        <Input
                          id="discount"
                          type="number"
                          value={newPlan.discount_percentage || 10}
                          onChange={(e) => setNewPlan({...newPlan, discount_percentage: parseInt(e.target.value) || 0})}
                          min="0"
                          max="50"
                          placeholder="10"
                        />
                      </div>
                    ) : (
                      <div>
                        <Label htmlFor="fixed-price">Fixed Price per Shipment</Label>
                        <Input
                          id="fixed-price"
                          type="number"
                          step="0.01"
                          value={newPlan.fixed_price || 0}
                          onChange={(e) => setNewPlan({...newPlan, fixed_price: parseFloat(e.target.value) || 0})}
                          min="0"
                          placeholder="99.99"
                        />
                      </div>
                    )}

                    <div>
                      <Label>Frequency Options (times per year)</Label>
                      <div className="flex items-center gap-4 mt-2">
                        {[2, 4, 6].map(freq => (
                          <label key={freq} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={newPlan.frequency_options?.includes(freq) || false}
                              onChange={(e) => {
                                const current = newPlan.frequency_options || [];
                                if (e.target.checked) {
                                  setNewPlan({...newPlan, frequency_options: [...current, freq].sort()});
                                } else {
                                  setNewPlan({...newPlan, frequency_options: current.filter(f => f !== freq)});
                                }
                              }}
                              className="rounded border-gray-300"
                            />
                            <span className="text-sm">{freq}x/year</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsCreatePlanOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreatePlan} disabled={!newPlan.name}>
                        Create Plan
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Edit Plan Dialog */}
              <Dialog open={isEditPlanOpen} onOpenChange={setIsEditPlanOpen}>
                <DialogContent className="w-[90vw] max-w-lg h-auto max-h-[80vh] overflow-y-auto mx-auto my-auto">
                  <DialogHeader>
                    <DialogTitle>Edit Subscription Plan</DialogTitle>
                    <DialogDescription>
                      Update the details of this subscription tier.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edit-plan-name">Plan Name</Label>
                      <Input
                        id="edit-plan-name"
                        value={newPlan.name || ""}
                        onChange={(e) => setNewPlan({...newPlan, name: e.target.value})}
                        placeholder="e.g. Gold, Silver, Platinum"
                      />
                    </div>

                    <div>
                      <Label htmlFor="edit-plan-description">Plan Description</Label>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Add multiple description lines for this plan:
                        </p>
                        {(newPlan.description || []).map((desc, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={desc}
                              onChange={(e) => {
                                const newDesc = [...(newPlan.description || [])];
                                newDesc[index] = e.target.value;
                                setNewPlan({...newPlan, description: newDesc});
                              }}
                              placeholder={`Description line ${index + 1}`}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const newDesc = [...(newPlan.description || [])];
                                newDesc.splice(index, 1);
                                setNewPlan({...newPlan, description: newDesc});
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setNewPlan({
                              ...newPlan, 
                              description: [...(newPlan.description || []), ""]
                            });
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Description Line
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="edit-plan-icon">Plan Icon (Optional)</Label>
                      <div className="space-y-2">
                        <div className="flex items-center gap-4">
                          {newPlan.icon_url ? (
                            <div className="flex items-center gap-2">
                              <img 
                                src={newPlan.icon_url} 
                                alt="Plan icon" 
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setNewPlan({...newPlan, icon_url: ""})}
                              >
                                Remove
                              </Button>
                            </div>
                          ) : (
                            <div className="w-12 h-12 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                              <Package className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                          <div className="flex-1">
                            <Input
                              id="edit-plan-icon"
                              value={newPlan.icon_url || ""}
                              onChange={(e) => setNewPlan({...newPlan, icon_url: e.target.value})}
                              placeholder="Enter image URL or upload file"
                            />
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Enter an image URL or upload a file to customize the plan icon
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit-bottles">Bottles per Shipment</Label>
                        <Select 
                          value={newPlan.bottle_count?.toString() || "3"} 
                          onValueChange={(value) => setNewPlan({...newPlan, bottle_count: parseInt(value)})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 bottle</SelectItem>
                            <SelectItem value="3">3 bottles</SelectItem>
                            <SelectItem value="6">6 bottles</SelectItem>
                            <SelectItem value="12">12 bottles</SelectItem>
                            <SelectItem value="24">24 bottles</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="edit-pricing-type">Pricing Type</Label>
                        <Select 
                          value={newPlan.pricing_type || "discount"} 
                          onValueChange={(value: 'discount' | 'fixed_price') => setNewPlan({...newPlan, pricing_type: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="discount">Percentage Discount</SelectItem>
                            <SelectItem value="fixed_price">Fixed Price</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {newPlan.pricing_type === 'discount' ? (
                      <div>
                        <Label htmlFor="edit-discount">Discount Percentage</Label>
                        <Input
                          id="edit-discount"
                          type="number"
                          value={newPlan.discount_percentage || 10}
                          onChange={(e) => setNewPlan({...newPlan, discount_percentage: parseInt(e.target.value) || 0})}
                          min="0"
                          max="50"
                          placeholder="10"
                        />
                      </div>
                    ) : (
                      <div>
                        <Label htmlFor="edit-fixed-price">Fixed Price per Shipment</Label>
                        <Input
                          id="edit-fixed-price"
                          type="number"
                          step="0.01"
                          value={newPlan.fixed_price || 0}
                          onChange={(e) => setNewPlan({...newPlan, fixed_price: parseFloat(e.target.value) || 0})}
                          min="0"
                          placeholder="99.99"
                        />
                      </div>
                    )}

                    <div>
                      <Label>Frequency Options (times per year)</Label>
                      <div className="flex items-center gap-4 mt-2">
                        {[2, 4, 6].map(freq => (
                          <label key={freq} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={newPlan.frequency_options?.includes(freq) || false}
                              onChange={(e) => {
                                const current = newPlan.frequency_options || [];
                                if (e.target.checked) {
                                  setNewPlan({...newPlan, frequency_options: [...current, freq].sort()});
                                } else {
                                  setNewPlan({...newPlan, frequency_options: current.filter(f => f !== freq)});
                                }
                              }}
                              className="rounded border-gray-300"
                            />
                            <span className="text-sm">{freq}x/year</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsEditPlanOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleUpdatePlan} disabled={!newPlan.name}>
                        Update Plan
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan Name</TableHead>
                    <TableHead>Bottles</TableHead>
                    <TableHead>Pricing</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {planStats.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {plan.icon_url ? (
                            <img 
                              src={plan.icon_url} 
                              alt={`${plan.name} icon`} 
                              className="w-8 h-8 rounded object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                              <Package className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{plan.name}</p>
                            {plan.description && plan.description.length > 0 && (
                              <div className="text-sm text-muted-foreground">
                                {plan.description.map((desc, index) => (
                                  <p key={index}>{desc}</p>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          {plan.bottle_count}
                        </div>
                      </TableCell>
                      <TableCell>
                        {plan.pricing_type === 'discount' ? (
                          <Badge variant="outline">{plan.discount_percentage}% off</Badge>
                        ) : (
                          <Badge variant="outline">${plan.fixed_price?.toFixed(2)}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {plan.frequency_options.map(freq => (
                            <Badge key={freq} variant="secondary" className="text-xs">
                              {freq}x
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{plan.memberCount}</p>
                          <p className="text-xs text-muted-foreground">active</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={plan.is_active ? "default" : "secondary"}>
                          {plan.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditPlan(plan)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeletePlan(plan.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping" className="space-y-6">
          {/* Shipping Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Shipping Zones</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{shippingZones.length}</div>
                <p className="text-xs text-muted-foreground">
                  Active shipping zones
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Avg Shipping Cost</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">
                  ${shippingZones.length > 0 
                    ? (shippingZones.reduce((sum, zone) => sum + zone.cost_per_shipment, 0) / shippingZones.length).toFixed(2)
                    : '0.00'
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  Per shipment
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Cost Range</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">
                  {shippingZones.length > 0 
                    ? `$${Math.min(...shippingZones.map(z => z.cost_per_shipment)).toFixed(0)} - $${Math.max(...shippingZones.map(z => z.cost_per_shipment)).toFixed(0)}`
                    : '$0 - $0'
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  Min - Max shipping
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Shipping Zones</CardTitle>
                <CardDescription>
                  Manage shipping costs by geographic region.
                </CardDescription>
              </div>
              <Dialog open={isCreateShippingOpen} onOpenChange={setIsCreateShippingOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Zone
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[90vw] max-w-lg h-auto max-h-[80vh] overflow-y-auto mx-auto my-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Shipping Zone</DialogTitle>
                    <DialogDescription>
                      Define shipping costs for a geographic region.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="zone-name">Zone Name</Label>
                      <Input
                        id="zone-name"
                        value={newShippingZone.name || ""}
                        onChange={(e) => setNewShippingZone({...newShippingZone, name: e.target.value})}
                        placeholder="e.g. US 48 States, International"
                      />
                    </div>

                    <div>
                      <Label htmlFor="cost">Cost per Shipment</Label>
                      <Input
                        id="cost"
                        type="number"
                        step="0.01"
                        value={newShippingZone.cost_per_shipment || 15.00}
                        onChange={(e) => setNewShippingZone({...newShippingZone, cost_per_shipment: parseFloat(e.target.value) || 0})}
                        min="0"
                        placeholder="15.00"
                      />
                    </div>

                    <div>
                      <Label htmlFor="zone-description">Description (Optional)</Label>
                      <Input
                        id="zone-description"
                        value={newShippingZone.description || ""}
                        onChange={(e) => setNewShippingZone({...newShippingZone, description: e.target.value})}
                        placeholder="Brief description or restrictions"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsCreateShippingOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateShippingZone} disabled={!newShippingZone.name}>
                        Create Zone
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Edit Shipping Zone Dialog */}
              <Dialog open={isEditShippingOpen} onOpenChange={setIsEditShippingOpen}>
                <DialogContent className="w-[90vw] max-w-lg h-auto max-h-[80vh] overflow-y-auto mx-auto my-auto">
                  <DialogHeader>
                    <DialogTitle>Edit Shipping Zone</DialogTitle>
                    <DialogDescription>
                      Update shipping costs for this geographic region.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edit-zone-name">Zone Name</Label>
                      <Input
                        id="edit-zone-name"
                        value={newShippingZone.name || ""}
                        onChange={(e) => setNewShippingZone({...newShippingZone, name: e.target.value})}
                        placeholder="e.g. US 48 States, International"
                      />
                    </div>

                    <div>
                      <Label htmlFor="edit-cost">Cost per Shipment</Label>
                      <Input
                        id="edit-cost"
                        type="number"
                        step="0.01"
                        value={newShippingZone.cost_per_shipment || 15.00}
                        onChange={(e) => setNewShippingZone({...newShippingZone, cost_per_shipment: parseFloat(e.target.value) || 0})}
                        min="0"
                        placeholder="15.00"
                      />
                    </div>

                    <div>
                      <Label htmlFor="edit-zone-description">Description (Optional)</Label>
                      <Input
                        id="edit-zone-description"
                        value={newShippingZone.description || ""}
                        onChange={(e) => setNewShippingZone({...newShippingZone, description: e.target.value})}
                        placeholder="Brief description or restrictions"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsEditShippingOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleUpdateShippingZone} disabled={!newShippingZone.name}>
                        Update Zone
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Zone Name</TableHead>
                    <TableHead>Cost per Shipment</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shippingZones.map((zone) => (
                    <TableRow key={zone.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{zone.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          {zone.cost_per_shipment.toFixed(2)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {zone.description || "No description"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditShippingZone(zone)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteShippingZone(zone.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}