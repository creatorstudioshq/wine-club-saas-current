import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Skeleton } from "./ui/skeleton";
import { Search, Upload, UserPlus, Filter, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { api } from "../utils/api";

const KING_FROSCH_ID = "550e8400-e29b-41d4-a716-446655440000";

export function MembersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("all");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [membersRes, plansRes] = await Promise.all([
        api.getMembers(KING_FROSCH_ID),
        api.getPlans(KING_FROSCH_ID)
      ]);
      
      setMembers(membersRes.members || []);
      setPlans(plansRes.plans || []);
      
      // Debug: Log the actual member data
      console.log('Members data:', membersRes.members);
      console.log('Plans data:', plansRes.plans);
    } catch (error) {
      console.error('Failed to fetch members data:', error);
      // Graceful fallback - continue with empty arrays
      setMembers([]);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleEditMember = (member) => {
    setEditingMember(member);
    setIsEditModalOpen(true);
  };

  const handleUpdateMember = async () => {
    try {
      console.log('Updating member:', editingMember);
      
      // Ensure we have the required fields
      const updateData = {
        name: editingMember.name,
        email: editingMember.email,
        phone: editingMember.phone || null,
        subscription_plan_id: editingMember.subscription_plan_id || null,
        status: editingMember.status || 'active',
        updated_at: new Date().toISOString()
      };
      
      console.log('Sending update data:', updateData);
      
      const result = await api.updateMember(editingMember.id, updateData);
      console.log('Update result:', result);
      
      await fetchData();
      setIsEditModalOpen(false);
      setEditingMember(null);
      
      // Show success message
      alert('Member updated successfully!');
    } catch (error) {
      console.error('Failed to update member:', error);
      alert('Failed to update member: ' + error.message);
    }
  };

  const handleSyncFromSquare = async () => {
    try {
      setRefreshing(true);
      await api.syncSquareCustomers(KING_FROSCH_ID);
      await fetchData(); // Refresh the members list
      alert('Successfully synced members from Square!');
    } catch (error) {
      console.error('Failed to sync from Square:', error);
      alert('Failed to sync from Square. Check console for details.');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const planName = member.subscription_plans?.name || '';
    const matchesPlan = selectedPlan === "all" || planName === selectedPlan;
    return matchesSearch && matchesPlan;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Wine Club Members</h1>
          <p className="text-muted-foreground">
            Manage wine club members linked to Square customers. Member data synced with Square customer profiles.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={handleSyncFromSquare}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Sync from Square
          </Button>
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import Members
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Members</DialogTitle>
                <DialogDescription>
                  Upload a CSV file to import multiple members at once.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="csv-file">CSV File</Label>
                  <Input id="csv-file" type="file" accept=".csv" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Expected columns: Name, Email, Plan, Phone (optional)
                  </p>
                </div>
                <div>
                  <Label htmlFor="import-notes">Import Notes</Label>
                  <Textarea 
                    id="import-notes"
                    placeholder="Optional notes about this import..."
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsImportModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsImportModalOpen(false)}>
                    Import Members
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Member Directory</CardTitle>
          <CardDescription>
            View and manage all wine club members across different plans.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedPlan} onValueChange={setSelectedPlan}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                {plans.reduce((acc, plan) => {
                  // Deduplicate plans by name
                  if (!acc.find(p => p.name === plan.name)) {
                    acc.push(plan);
                  }
                  return acc;
                }, []).map(plan => (
                  <SelectItem key={plan.id} value={plan.name}>
                    {plan.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Members Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-12" /></TableCell>
                  </TableRow>
                ))
              ) : (
                filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {member.id.slice(0, 8)}...
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          member.subscription_plans?.name === 'Platinum' ? 'default' :
                          member.subscription_plans?.name === 'Gold' ? 'secondary' : 'outline'
                        }
                      >
                        {member.subscription_plans?.name || 'No Plan'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {member.has_payment_method ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-green-600">Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-red-600" />
                            <span className="text-sm text-red-600">Missing</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(member.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={member.status === 'active' ? 'default' : 'destructive'}>
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditMember(member)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {filteredMembers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No members found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Member Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="w-[90vw] max-w-md h-auto max-h-[80vh] overflow-y-auto mx-auto my-auto">
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
            <DialogDescription>
              Update member details and subscription plan.
            </DialogDescription>
          </DialogHeader>
          {editingMember && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={editingMember.name || ''}
                  onChange={(e) => setEditingMember({...editingMember, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  value={editingMember.email || ''}
                  onChange={(e) => setEditingMember({...editingMember, email: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="plan" className="text-right">
                  Plan
                </Label>
                <Select 
                  value={editingMember.subscription_plan_id || ''} 
                  onValueChange={(value) => setEditingMember({...editingMember, subscription_plan_id: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {plans.reduce((acc, plan) => {
                      // Deduplicate plans by name
                      if (!acc.find(p => p.name === plan.name)) {
                        acc.push(plan);
                      }
                      return acc;
                    }, []).map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.name} - {plan.bottle_count} bottles
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select 
                  value={editingMember.status || 'active'} 
                  onValueChange={(value) => setEditingMember({...editingMember, status: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateMember}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}