import * as React from "react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Wine, Star, Gift, Crown, RotateCcw, Eye } from "lucide-react";
import { CustomerWineSelection } from "./CustomerWineSelection";
import { api } from "../utils/api";

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
    frequency: "Monthly",
    price: 89,
    icon: <Gift className="w-5 h-5" />,
  },
  {
    id: "silver",
    name: "Silver Club", 
    bottles: 6,
    discount: 15,
    frequency: "Monthly",
    price: 165,
    icon: <Star className="w-5 h-5" />,
    popular: true,
  },
  {
    id: "platinum",
    name: "Platinum Club",
    bottles: 12,
    discount: 20,
    frequency: "Monthly",
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
  clubLogo?: string; // Optional club logo URL
  clubName?: string; // Optional club name
  wineClubId: string;
}

export function EmbeddedSignup({ 
  onSignup, 
  isLoading, 
  className = "", 
  clubLogo, 
  clubName = "Our Wine Club",
  wineClubId
}: EmbeddedSignupProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [preferences, setPreferences] = useState<string[]>(["mixed"]);
  const [frequency, setFrequency] = useState<string>("quarterly");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [flippedCards, setFlippedCards] = useState<{[key: string]: boolean}>({});
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [swapPlanId, setSwapPlanId] = useState<string>("");

  const handlePreferenceToggle = (prefId: string) => {
    setPreferences(prev => 
      prev.includes(prefId) 
        ? prev.filter(p => p !== prefId)
        : [...prev, prefId]
    );
  };

  const toggleCardFlip = (planId: string) => {
    setFlippedCards(prev => ({
      ...prev,
      [planId]: !prev[planId]
    }));
  };

  const handleSwapPlan = (planId: string) => {
    setSwapPlanId(planId);
    setSwapModalOpen(true);
  };

  const confirmSwap = (newPlanId: string) => {
    setSelectedPlan(newPlanId);
    setSwapModalOpen(false);
  };

  const handleNextStep = () => {
    if (currentStep === 1 && selectedPlan) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 3) {
      const signupData = {
        ...formData,
        planId: selectedPlan,
        preferences,
        frequency,
      };
      
      // Send welcome email
      try {
        const selectedPlanDetails = PLANS.find(p => p.id === selectedPlan);
        if (selectedPlanDetails) {
          await api.sendWelcomeEmail(
            formData.email,
            formData.name,
            wineClubId,
            selectedPlanDetails.name
          );
        }
      } catch (error) {
        console.error('Welcome email error:', error);
        // Continue with signup even if email fails
      }
      
      onSignup(signupData);
    }
  };

  const selectedPlanDetails = PLANS.find(p => p.id === selectedPlan);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-serif mb-2">Choose Your Plan</h2>
              <p className="text-gray-600">Select the perfect wine club membership for you</p>
            </div>
            
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">
              {PLANS.map((plan) => (
                <div key={plan.id} className="group">
                  <Card 
                    className={`cursor-pointer transition-all w-full overflow-hidden ${
                      selectedPlan === plan.id 
                        ? 'ring-2 ring-primary shadow-lg' 
                        : 'hover:shadow-md'
                    }`}
                  >
                    <div 
                      className="relative h-80 cursor-pointer"
                      onMouseEnter={() => toggleCardFlip(plan.id)}
                      onMouseLeave={() => toggleCardFlip(plan.id)}
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      {/* Front of card */}
                      <div className={`absolute inset-0 transition-transform duration-700 ${
                        flippedCards[plan.id] ? 'rotate-y-180' : ''
                      }`} style={{backfaceVisibility: 'hidden'}}>
                        <div className="h-full bg-gradient-to-br from-amber-50 to-orange-50 p-6 flex flex-col justify-center items-center">
                          {plan.popular && (
                            <Badge className="mb-4 bg-primary text-white">Most Popular</Badge>
                          )}
                          <div className="mb-6 mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                            {plan.icon}
                          </div>
                          <h3 className="text-xl font-serif mb-2 text-center">{plan.name}</h3>
                          <p className="text-sm text-muted-foreground mb-4 text-center">
                            {plan.bottles} bottles, {plan.frequency.toLowerCase()}
                          </p>
                          <p className="text-3xl font-bold text-primary mb-2">
                            ${plan.price}
                          </p>
                          <p className="text-sm text-green-600">
                            {plan.discount}% off retail
                          </p>
                        </div>
                      </div>

                      {/* Back of card - Wine Club Description */}
                      <div className={`absolute inset-0 transition-transform duration-700 ${
                        flippedCards[plan.id] ? 'rotate-y-0' : ''
                      }`} style={{backfaceVisibility: 'hidden', transform: 'rotateY(180deg)'}}>
                        <div className="h-full bg-gradient-to-br from-primary to-primary/80 p-6 text-white flex flex-col justify-center">
                          <h3 className="text-xl font-serif mb-4 text-center">{clubName}</h3>
                          
                          <div className="space-y-3 text-sm">
                            <div>
                              <h4 className="font-medium mb-2 text-primary-foreground/80">About Our Wine Club</h4>
                              <p className="text-primary-foreground/90 leading-relaxed">
                                We curate exceptional wines from renowned vineyards worldwide, 
                                delivering premium selections directly to your door.
                              </p>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2 text-primary-foreground/80">What Makes Us Special</h4>
                              <p className="text-primary-foreground/90 leading-relaxed">
                                Expert sommelier selections, exclusive access to limited releases, 
                                and detailed tasting notes with every bottle.
                              </p>
                            </div>

                            <div className="text-center mt-4">
                              <p className="text-lg font-bold">
                                Join {plan.name} - ${plan.price}/month
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-4 bg-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <Badge variant="outline" className="mb-2">{plan.frequency}</Badge>
                          <p className="text-sm text-muted-foreground">{plan.bottles} bottles</p>
                        </div>
                        <Dialog open={swapModalOpen && swapPlanId === plan.id} onOpenChange={(open) => {
                          setSwapModalOpen(open);
                          if (open) setSwapPlanId(plan.id);
                        }}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSwapPlan(plan.id);
                              }}
                            >
                              <RotateCcw className="h-4 w-4 mr-2" />
                              Swap
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Choose Different Plan</DialogTitle>
                              <DialogDescription>
                                Select an alternative plan for your membership.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 md:grid-cols-3">
                              {PLANS.filter(p => p.id !== plan.id).map((altPlan) => (
                                <Card 
                                  key={altPlan.id} 
                                  className="cursor-pointer hover:shadow-md transition-shadow"
                                  onClick={() => confirmSwap(altPlan.id)}
                                >
                                  <CardContent className="p-4 text-center">
                                    <div className="mb-3 mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                      {altPlan.icon}
                                    </div>
                                    <h4 className="font-medium mb-1">{altPlan.name}</h4>
                                    <p className="text-sm text-muted-foreground mb-2">{altPlan.bottles} bottles</p>
                                    <Badge variant="outline" className="text-xs">{altPlan.frequency}</Badge>
                                    <p className="text-lg font-bold text-primary mt-2">${altPlan.price}</p>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-serif mb-2">Wine Preferences</h2>
              <p className="text-gray-600">Tell us about your wine preferences</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-serif">What types of wine do you enjoy?</h3>
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
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-serif mb-2">Personal Information</h2>
              <p className="text-gray-600">Complete your membership details</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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

              {/* Selected Plan Summary */}
              {selectedPlanDetails && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Your Selection Summary</h4>
                  <div className="text-sm space-y-1">
                    <p><strong>{selectedPlanDetails.name}</strong> - {selectedPlanDetails.bottles} bottles</p>
                    <p>Delivery: {frequency.charAt(0).toUpperCase() + frequency.slice(1)}</p>
                    <p>Preferences: {preferences.map(p => 
                      WINE_PREFERENCES.find(wp => wp.id === p)?.name
                    ).join(", ")}</p>
                    <p className="text-primary font-medium">
                      ${selectedPlanDetails.price} per shipment ({selectedPlanDetails.discount}% off retail)
                    </p>
                  </div>
                </div>
              )}

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

              {/* Preview Customer Selection Process */}
              <div className="mt-6 pt-6 border-t">
                <div className="text-center space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Want to see how the wine selection process works?
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview Customer Selection Process
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[90vw] max-w-4xl h-[80vh] max-h-[800px] overflow-y-auto mx-auto my-auto">
                      <DialogHeader>
                        <DialogTitle>Customer Wine Selection Process</DialogTitle>
                        <DialogDescription>
                          This is how members will select their wines each month
                        </DialogDescription>
                      </DialogHeader>
                      <CustomerWineSelection 
                        memberId="demo-member-id" 
                        onComplete={() => {
                          // Close dialog
                          const closeButton = document.querySelector('[data-state="open"] button[aria-label="Close"]') as HTMLButtonElement;
                          if (closeButton) closeButton.click();
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </form>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`w-full max-w-6xl mx-auto px-4 ${className}`}>
      <Card>
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            {clubLogo ? (
              <img 
                src={clubLogo} 
                alt={`${clubName} Logo`}
                className="max-h-[300px] w-auto object-contain"
                onError={(e) => {
                  // Fallback to default icon if image fails to load
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className={`mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center ${
                clubLogo ? 'hidden' : ''
              }`}
            >
              <Wine className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-serif">Join {clubName}</CardTitle>
          <CardDescription className="text-lg">
            Discover exceptional wines delivered to your door
          </CardDescription>
          
          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === currentStep
                    ? 'bg-primary text-white'
                    : step < currentStep
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          {renderStepContent()}
          
          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            {currentStep < 3 && (
              <Button
                onClick={handleNextStep}
                disabled={currentStep === 1 && !selectedPlan}
                className="w-full"
              >
                Next
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}