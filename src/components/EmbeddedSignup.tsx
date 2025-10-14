import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { Wine, Star, Gift, Crown } from "lucide-react";

interface Plan {
  id: string;
  name: string;
  bottles: number;
  discount: number;
  frequency: string;
  price: number;
  icon: React.ReactNode;
  popular?: boolean;
}

interface WinePreference {
  id: string;
  name: string;
  description: string;
}

const PLANS: Plan[] = [
  {
    id: "gold",
    name: "Gold Club",
    bottles: 3,
    discount: 10,
    frequency: "Quarterly",
    price: 89,
    icon: <Gift className="w-5 h-5" />,
  },
  {
    id: "silver",
    name: "Silver Club", 
    bottles: 6,
    discount: 15,
    frequency: "Bi-Annual",
    price: 165,
    icon: <Star className="w-5 h-5" />,
    popular: true,
  },
  {
    id: "platinum",
    name: "Platinum Club",
    bottles: 12,
    discount: 20,
    frequency: "Annual",
    price: 300,
    icon: <Crown className="w-5 h-5" />,
  },
];

const WINE_PREFERENCES: WinePreference[] = [
  { id: "red", name: "Reds Only", description: "Cabernet, Merlot, Pinot Noir" },
  { id: "white", name: "Whites Only", description: "Chardonnay, Sauvignon Blanc, Riesling" },
  { id: "mixed", name: "Mixed Selection", description: "Variety of reds and whites" },
  { id: "dry", name: "Dry Wines", description: "Low residual sugar wines" },
  { id: "sweet", name: "Sweet Wines", description: "Dessert and off-dry wines" },
  { id: "sparkling", name: "Sparkling", description: "Champagne, Prosecco, Cava" },
];

interface EmbeddedSignupProps {
  onSignup: (data: {
    name: string;
    email: string;
    phone: string;
    planId: string;
    preferences: string[];
    frequency: string;
  }) => void;
  isLoading?: boolean;
  className?: string;
}

export function EmbeddedSignup({ onSignup, isLoading, className = "" }: EmbeddedSignupProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>("silver");
  const [preferences, setPreferences] = useState<string[]>(["mixed"]);
  const [frequency, setFrequency] = useState<string>("quarterly");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handlePreferenceToggle = (prefId: string) => {
    setPreferences(prev => 
      prev.includes(prefId) 
        ? prev.filter(p => p !== prefId)
        : [...prev, prefId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignup({
      ...formData,
      planId: selectedPlan,
      preferences,
      frequency,
    });
  };

  const selectedPlanDetails = PLANS.find(p => p.id === selectedPlan);

  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mb-4">
            <Wine className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-serif">Join Our Wine Club</CardTitle>
          <CardDescription className="text-lg">
            Discover exceptional wines delivered to your door
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Plan Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-serif">Choose Your Plan</h3>
              <div className="grid gap-4 md:grid-cols-3">
                {PLANS.map((plan) => (
                  <Card 
                    key={plan.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedPlan === plan.id 
                        ? 'ring-2 ring-primary shadow-md' 
                        : ''
                    }`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    <CardContent className="p-6 text-center">
                      {plan.popular && (
                        <Badge className="mb-2">Most Popular</Badge>
                      )}
                      <div className="mb-4 mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        {plan.icon}
                      </div>
                      <h4 className="font-serif text-lg mb-2">{plan.name}</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        {plan.bottles} bottles, {plan.frequency.toLowerCase()}
                      </p>
                      <p className="text-2xl font-bold text-primary mb-2">
                        ${plan.price}
                      </p>
                      <p className="text-sm text-green-600">
                        {plan.discount}% off retail
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Frequency Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-serif">Delivery Frequency</h3>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly (3 months)</SelectItem>
                  <SelectItem value="biannual">Bi-Annual (6 months)</SelectItem>
                  <SelectItem value="annual">Annual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Wine Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-serif">Wine Preferences</h3>
              <p className="text-sm text-muted-foreground">
                Select all that apply - we'll curate your selections accordingly
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                {WINE_PREFERENCES.map((pref) => (
                  <div key={pref.id} className="flex items-start space-x-3">
                    <Checkbox
                      id={pref.id}
                      checked={preferences.includes(pref.id)}
                      onCheckedChange={() => handlePreferenceToggle(pref.id)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label 
                        htmlFor={pref.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {pref.name}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {pref.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-serif">Contact Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">
                  For SMS updates about your shipments
                </p>
              </div>
            </div>

            {/* Summary & Submit */}
            <div className="border-t pt-6">
              <div className="bg-muted/50 rounded-lg p-4 mb-6">
                <h4 className="font-medium mb-2">Your Selection Summary</h4>
                <div className="text-sm space-y-1">
                  <p><strong>{selectedPlanDetails?.name}</strong> - {selectedPlanDetails?.bottles} bottles</p>
                  <p>Delivery: {frequency.charAt(0).toUpperCase() + frequency.slice(1)}</p>
                  <p>Preferences: {preferences.map(p => 
                    WINE_PREFERENCES.find(wp => wp.id === p)?.name
                  ).join(", ")}</p>
                  <p className="text-primary font-medium">
                    ${selectedPlanDetails?.price} per shipment ({selectedPlanDetails?.discount}% off retail)
                  </p>
                </div>
              </div>
              
              <Button 
                type="submit" 
                size="lg" 
                className="w-full" 
                disabled={isLoading || !formData.name || !formData.email}
              >
                {isLoading ? "Processing..." : "Join Wine Club - Add Payment Method"}
              </Button>
              
              <p className="text-xs text-center text-muted-foreground mt-4">
                You'll add your payment method securely with Square on the next step.
                No charges until your first shipment ships.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}