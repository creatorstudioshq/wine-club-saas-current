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
import { Plus, Edit, Trash2, Wine, User, Settings, RefreshCw, UserCheck, Search, Package, Minus, Save } from "lucide-react";
import { api } from "../utils/api";
import { useClient } from "../contexts/ClientContext";

interface GlobalPreference {
  id: string;
  name: string;
  description: string;
  categories: string[];
  created_at: string;
  updated_at: string;
}

interface Member {
  id: string;
  name: string;
  email: string;
  subscription_plan_id: string;
  plan_name: string;
  bottle_count: number;
}

interface Wine {
  id: string;
  name: string;
  category_name: string;
  varietal: string;
  color: string;
  sweetness: string;
  total_inventory: number;
  square_item_id: string;
}

interface CustomWineAssignment {
  wine_id: string;
  wine_name: string;
  quantity: number;
}

interface CustomPreference {
  id: string;
  member_id: string;
  member_name: string;
  wine_assignments: CustomWineAssignment[];
  total_bottles: number;
  created_at: string;
  updated_at: string;
}

export function CustomerPreferencesPage() {
  const { currentWineClub } = useClient();
  const [activeTab, setActiveTab] = useState("global-preferences");
  
  // Global Preferences
  const [globalPreferences, setGlobalPreferences] = useState<GlobalPreference[]>([]);
  const [isCreateGlobalModalOpen, setIsCreateGlobalModalOpen] = useState(false);
  const [newGlobalPreference, setNewGlobalPreference] = useState<Partial<GlobalPreference>>({
    name: "",
    description: "",
    categories: []
  });

  // Custom Shipments
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [memberSearch, setMemberSearch] = useState("");
  const [wines, setWines] = useState<Wine[]>([]);
  const [wineSearch, setWineSearch] = useState("");
  const [customWineAssignments, setCustomWineAssignments] = useState<CustomWineAssignment[]>([]);
  const [customPreferences, setCustomPreferences] = useState<CustomPreference[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    if (!currentWineClub) return;
    
    try {
      setLoading(true);
      
      // Fetch global preferences
      const globalPrefs = await api.getGlobalPreferences(currentWineClub.id);
      setGlobalPreferences(globalPrefs || []);
      
      // Fetch members with their plans
      const membersData = await api.getMembers(currentWineClub.id);
      const plansData = await api.getPlans(currentWineClub.id);
      
      const membersWithPlans = membersData.map(member => {
        const plan = plansData.find(p => p.id === member.subscription_plan_id);
        return {
          id: member.id,
          name: member.name,
          email: member.email,
          subscription_plan_id: member.subscription_plan_id || '',
          plan_name: plan?.name || 'No Plan',
          bottle_count: plan?.bottle_count || 0
        };
      });
      setMembers(membersWithPlans);
      
      // Fetch wines from Square inventory
      const inventoryRes = await api.getLiveInventory(currentWineClub.id, 'all', 0);
      const winesWithInventory = inventoryRes.wines?.filter(wine => {
        const hasInventory = wine.total_inventory && wine.total_inventory > 0;
        const isNotUncategorized = wine.category_name && 
          wine.category_name.toLowerCase() !== 'uncategorized' &&
          wine.category_name.toLowerCase() !== 'uncat' &&
          wine.category_name.toLowerCase() !== 'misc' &&
          wine.category_name.toLowerCase() !== 'other';
        return hasInventory && isNotUncategorized;
      }) || [];
      
      setWines(winesWithInventory);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentWineClub]);

  // Filter members based on search
  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    member.email.toLowerCase().includes(memberSearch.toLowerCase())
  );

  // Filter wines based on search
  const filteredWines = wines.filter(wine =>
    wine.name.toLowerCase().includes(wineSearch.toLowerCase()) ||
    wine.category_name.toLowerCase().includes(wineSearch.toLowerCase()) ||
    wine.varietal.toLowerCase().includes(wineSearch.toLowerCase())
  );

  // Calculate total bottles assigned
  const totalAssignedBottles = customWineAssignments.reduce((sum, assignment) => sum + assignment.quantity, 0);

  // Add wine to custom assignments
  const addWineToAssignments = (wine: Wine) => {
    const existingAssignment = customWineAssignments.find(a => a.wine_id === wine.id);
    if (existingAssignment) {
      // Increase quantity if wine already exists
      updateWineQuantity(wine.id, existingAssignment.quantity + 1);
    } else {
      // Add new wine assignment
      const newAssignment: CustomWineAssignment = {
        wine_id: wine.id,
        wine_name: wine.name,
        quantity: 1
      };
      setCustomWineAssignments([...customWineAssignments, newAssignment]);
    }
  };

  // Update wine quantity
  const updateWineQuantity = (wineId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      // Remove wine if quantity is 0 or less
      setCustomWineAssignments(customWineAssignments.filter(a => a.wine_id !== wineId));
      return;
    }

    // Check if we exceed the plan limit
    if (selectedMember && newQuantity > selectedMember.bottle_count) {
      alert(`Cannot exceed ${selectedMember.bottle_count} bottles for ${selectedMember.plan_name} plan`);
      return;
    }

    setCustomWineAssignments(customWineAssignments.map(a => 
      a.wine_id === wineId ? { ...a, quantity: newQuantity } : a
    ));
  };

  // Remove wine from assignments
  const removeWineFromAssignments = (wineId: string) => {
    setCustomWineAssignments(customWineAssignments.filter(a => a.wine_id !== wineId));
  };

  // Save custom preference
  const saveCustomPreference = async () => {
    if (!selectedMember || customWineAssignments.length === 0) {
      alert('Please select a member and add wines to their assignment');
      return;
    }

    try {
      setSaving(true);
      
      const customPreference: CustomPreference = {
        id: `custom_${selectedMember.id}_${Date.now()}`,
        member_id: selectedMember.id,
        member_name: selectedMember.name,
        wine_assignments: customWineAssignments,
        total_bottles: totalAssignedBottles,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Save to backend (this would be an API call)
      // await api.saveCustomPreference(currentWineClub.id, customPreference);
      
      // For now, add to local state
      setCustomPreferences([...customPreferences, customPreference]);
      
      // Reset form
      setSelectedMember(null);
      setCustomWineAssignments([]);
      setMemberSearch("");
      
      alert('Custom preference saved successfully!');
      
    } catch (error) {
      console.error('Error saving custom preference:', error);
      alert('Error saving custom preference');
    } finally {
      setSaving(false);
    }
  };

  // Create global preference
  const handleCreateGlobalPreference = async () => {
    if (!newGlobalPreference.name || !newGlobalPreference.description) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const preference = await api.createGlobalPreference({
        wine_club_id: currentWineClub?.id || "",
        name: newGlobalPreference.name,
        description: newGlobalPreference.description,
        categories: newGlobalPreference.categories || []
      });

      setGlobalPreferences([...globalPreferences, preference]);
      setNewGlobalPreference({ name: "", description: "", categories: [] });
      setIsCreateGlobalModalOpen(false);
      
    } catch (error) {
      console.error('Error creating global preference:', error);
      alert('Error creating global preference');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Customer Preferences</h2>
          <p className="text-muted-foreground">
            Manage global preferences and create custom wine assignments for members
          </p>
        </div>
        <Button onClick={fetchData} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="global-preferences">Global Preferences</TabsTrigger>
          <TabsTrigger value="custom-shipments">Custom Shipments</TabsTrigger>
        </TabsList>

        {/* Global Preferences Tab */}
        <TabsContent value="global-preferences">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Global Wine Preferences</CardTitle>
                  <CardDescription>
                    Create preference templates that can be assigned to multiple members
                  </CardDescription>
                </div>
                <Dialog open={isCreateGlobalModalOpen} onOpenChange={setIsCreateGlobalModalOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Preference
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Global Preference</DialogTitle>
                      <DialogDescription>
                        Create a new wine preference template
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="preference-name">Preference Name</Label>
                        <Input
                          id="preference-name"
                          value={newGlobalPreference.name || ""}
                          onChange={(e) => setNewGlobalPreference({...newGlobalPreference, name: e.target.value})}
                          placeholder="e.g., Red Wine Lover"
                        />
                      </div>
                      <div>
                        <Label htmlFor="preference-description">Description</Label>
                        <Input
                          id="preference-description"
                          value={newGlobalPreference.description || ""}
                          onChange={(e) => setNewGlobalPreference({...newGlobalPreference, description: e.target.value})}
                          placeholder="e.g., Prefers bold red wines"
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsCreateGlobalModalOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateGlobalPreference}>
                          Create Preference
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {globalPreferences.length === 0 ? (
                <div className="text-center py-8">
                  <Wine className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Global Preferences</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first global preference template
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Categories</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {globalPreferences.map((preference) => (
                      <TableRow key={preference.id}>
                        <TableCell className="font-medium">{preference.name}</TableCell>
                        <TableCell>{preference.description}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {preference.categories.map((category) => (
                              <Badge key={category} variant="secondary">
                                {category}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(preference.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Custom Shipments Tab */}
        <TabsContent value="custom-shipments">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Member Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Member</CardTitle>
                <CardDescription>
                  Search and select a member to create custom wine assignments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search members..."
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                {selectedMember && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900">{selectedMember.name}</h4>
                    <p className="text-sm text-blue-800">{selectedMember.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{selectedMember.plan_name}</Badge>
                      <Badge variant="secondary">{selectedMember.bottle_count} bottles</Badge>
                    </div>
                  </div>
                )}

                <div className="max-h-60 overflow-y-auto">
                  {filteredMembers.map((member) => (
                    <div
                      key={member.id}
                      className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                        selectedMember?.id === member.id ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                      onClick={() => setSelectedMember(member)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="mb-1">{member.plan_name}</Badge>
                          <p className="text-sm text-muted-foreground">{member.bottle_count} bottles</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Wine Assignment */}
            <Card>
              <CardHeader>
                <CardTitle>Wine Assignment</CardTitle>
                <CardDescription>
                  {selectedMember ? (
                    `Assign wines to ${selectedMember.name} (${totalAssignedBottles}/${selectedMember.bottle_count} bottles)`
                  ) : (
                    'Select a member to assign wines'
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedMember && (
                  <>
                    {/* Assigned Wines */}
                    <div className="space-y-2">
                      <h4 className="font-medium">Assigned Wines</h4>
                      {customWineAssignments.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No wines assigned yet</p>
                      ) : (
                        <div className="space-y-2">
                          {customWineAssignments.map((assignment) => (
                            <div key={assignment.wine_id} className="flex items-center justify-between p-2 border rounded">
                              <div className="flex-1">
                                <p className="font-medium">{assignment.wine_name}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateWineQuantity(assignment.wine_id, assignment.quantity - 1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center">{assignment.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateWineQuantity(assignment.wine_id, assignment.quantity + 1)}
                                  disabled={totalAssignedBottles >= selectedMember.bottle_count}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeWineFromAssignments(assignment.wine_id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Wine Search */}
                    <div className="space-y-2">
                      <h4 className="font-medium">Add Wines</h4>
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search wines..."
                          value={wineSearch}
                          onChange={(e) => setWineSearch(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      
                      <div className="max-h-40 overflow-y-auto">
                        {filteredWines.slice(0, 10).map((wine) => (
                          <div
                            key={wine.id}
                            className="flex items-center justify-between p-2 border rounded hover:bg-gray-50"
                          >
                            <div className="flex-1">
                              <p className="font-medium">{wine.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {wine.category_name} • {wine.varietal}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => addWineToAssignments(wine)}
                              disabled={totalAssignedBottles >= selectedMember.bottle_count}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Save Button */}
                    <Button
                      onClick={saveCustomPreference}
                      disabled={customWineAssignments.length === 0 || saving}
                      className="w-full"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? 'Saving...' : 'Save Custom Preference'}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Custom Preferences Table */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Custom Preferences</CardTitle>
              <CardDescription>
                View and manage all custom wine assignments
              </CardDescription>
            </CardHeader>
            <CardContent>
              {customPreferences.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Custom Preferences</h3>
                  <p className="text-muted-foreground">
                    Create custom wine assignments for members
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Wines</TableHead>
                      <TableHead>Total Bottles</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customPreferences.map((preference) => (
                      <TableRow key={preference.id}>
                        <TableCell className="font-medium">{preference.member_name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {members.find(m => m.id === preference.member_id)?.plan_name || 'Unknown'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {preference.wine_assignments.map((assignment, index) => (
                              <div key={index} className="text-sm">
                                {assignment.wine_name} ({assignment.quantity})
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{preference.total_bottles}</Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(preference.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}