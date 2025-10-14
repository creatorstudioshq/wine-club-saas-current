import { useState } from "react";
import { Card, CardContent, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Alert, AlertDescription } from "./ui/alert";
import { 
  Wine, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft,
  Copy,
  Eye,
  Code,
  Settings
} from "lucide-react";

// Multi-step signup flow for embedding
export function EmbeddableSignup({ 
  clubName = "Wine Club",
  clubLogo = null,
  primaryColor = "#92400e",
  secondaryColor = "#fef3c7"
}: {
  clubName?: string;
  clubLogo?: string | null;
  primaryColor?: string;
  secondaryColor?: string;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [flippedCards, setFlippedCards] = useState<{[key: string]: boolean}>({});
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [swapPlanId, setSwapPlanId] = useState<string | null>(null);
  const [preferences, setPreferences] = useState({
    redWine: false,
    whiteWine: false,
    roseWine: false,
    sparkling: false,
    frequency: "monthly"
  });
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });

  const PLANS = [
    {
      id: "bronze",
      name: "Bronze",
      bottles: 3,
      frequency: "Monthly",
      price: 89,
      discount: 15,
      popular: false,
      icon: <Wine className="w-8 h-8 text-amber-600" />
    },
    {
      id: "silver", 
      name: "Silver",
      bottles: 6,
      frequency: "Monthly",
      price: 159,
      discount: 20,
      popular: true,
      icon: <Wine className="w-8 h-8 text-gray-400" />
    },
    {
      id: "gold",
      name: "Gold", 
      bottles: 12,
      frequency: "Monthly",
      price: 299,
      discount: 25,
      popular: false,
      icon: <Wine className="w-8 h-8 text-yellow-500" />
    }
  ];

  const toggleCardFlip = (planId: string) => {
    setFlippedCards(prev => ({
      ...prev,
      [planId]: !prev[planId]
    }));
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSwapPlan = (planId: string) => {
    setSwapPlanId(planId);
    setSwapModalOpen(true);
  };

  const confirmSwap = (newPlanId: string) => {
    setSelectedPlan(newPlanId);
    setSwapModalOpen(false);
  };

  const handleSubmit = () => {
    // In production, this would submit to your API
    console.log("Signup submitted:", {
      plan: selectedPlan,
      preferences,
      personalInfo
    });
    alert("Signup submitted! (This is a demo)");
  };

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
                    style={{ '--primary': primaryColor } as React.CSSProperties}
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
                        <div 
                          className="h-full p-6 flex flex-col justify-center items-center"
                          style={{ 
                            background: `linear-gradient(135deg, ${secondaryColor}, ${primaryColor}20)`
                          }}
                        >
                          {plan.popular && (
                            <Badge 
                              className="mb-4 text-white"
                              style={{ backgroundColor: primaryColor }}
                            >
                              Most Popular
                            </Badge>
                          )}
                          <div 
                            className="mb-6 mx-auto w-16 h-16 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${primaryColor}20` }}
                          >
                            {plan.icon}
                          </div>
                          <h3 className="text-xl font-serif mb-2 text-center">{plan.name}</h3>
                          <p className="text-sm text-muted-foreground mb-4 text-center">
                            {plan.bottles} bottles, {plan.frequency.toLowerCase()}
                          </p>
                          <p 
                            className="text-3xl font-bold mb-2"
                            style={{ color: primaryColor }}
                          >
                            ${plan.price}
                          </p>
                          <p className="text-sm text-green-600">
                            {plan.discount}% off retail
                          </p>
                        </div>
                      </div>

                      {/* Back of card - Details */}
                      <div className={`absolute inset-0 transition-transform duration-700 ${
                        flippedCards[plan.id] ? 'rotate-y-0' : ''
                      }`} style={{backfaceVisibility: 'hidden', transform: 'rotateY(180deg)'}}>
                        <div 
                          className="h-full p-6 text-white flex flex-col justify-center"
                          style={{ 
                            background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}80)`
                          }}
                        >
                          <h3 className="text-xl font-serif mb-4 text-center">{plan.name}</h3>
                          
                          <div className="space-y-3 text-sm">
                            <div>
                              <h4 className="font-medium mb-2 text-white/80">What's Included</h4>
                              <p className="text-white/90 leading-relaxed">
                                {plan.bottles} carefully curated bottles delivered {plan.frequency.toLowerCase()}
                              </p>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2 text-white/80">Member Benefits</h4>
                              <p className="text-white/90 leading-relaxed">
                                {plan.discount}% discount on all wines, exclusive tastings, and priority access to limited releases.
                              </p>
                            </div>

                            <div className="text-center mt-4">
                              <p className="text-lg font-bold">
                                ${plan.price} per shipment
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
                                    <div 
                                      className="mb-3 mx-auto w-12 h-12 rounded-lg flex items-center justify-center"
                                      style={{ backgroundColor: `${primaryColor}10` }}
                                    >
                                      {altPlan.icon}
                                    </div>
                                    <h4 className="font-medium mb-1">{altPlan.name}</h4>
                                    <p className="text-sm text-muted-foreground mb-2">{altPlan.bottles} bottles</p>
                                    <Badge variant="outline" className="text-xs">{altPlan.frequency}</Badge>
                                    <p 
                                      className="text-lg font-bold mt-2"
                                      style={{ color: primaryColor }}
                                    >
                                      ${altPlan.price}
                                    </p>
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
              <p className="text-gray-600">Tell us what you love to drink</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium mb-3 block">Wine Types</Label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: 'redWine', label: 'Red Wine' },
                    { key: 'whiteWine', label: 'White Wine' },
                    { key: 'roseWine', label: 'Rosé Wine' },
                    { key: 'sparkling', label: 'Sparkling' }
                  ].map((type) => (
                    <div key={type.key} className="flex items-center space-x-2">
                      <Checkbox
                        id={type.key}
                        checked={preferences[type.key as keyof typeof preferences] as boolean}
                        onCheckedChange={(checked) => 
                          setPreferences(prev => ({ ...prev, [type.key]: checked }))
                        }
                      />
                      <Label htmlFor={type.key} className="text-sm font-medium">
                        {type.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium mb-3 block">Delivery Frequency</Label>
                <Select 
                  value={preferences.frequency} 
                  onValueChange={(value) => setPreferences(prev => ({ ...prev, frequency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="bi-monthly">Bi-Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 3:
        const selectedPlanData = PLANS.find(p => p.id === selectedPlan);
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-serif mb-2">Personal Information</h2>
              <p className="text-gray-600">Complete your membership</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={personalInfo.firstName}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="John"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={personalInfo.lastName}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={personalInfo.phone}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            {/* Order Summary */}
            {selectedPlanData && (
              <Card className="bg-gray-50">
                <CardContent className="p-6">
                  <h3 className="font-serif text-lg mb-4">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>{selectedPlanData.name} Plan</span>
                      <span>${selectedPlanData.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{selectedPlanData.bottles} bottles, {selectedPlanData.frequency.toLowerCase()}</span>
                      <span></span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Member Discount ({selectedPlanData.discount}%)</span>
                      <span>-${(selectedPlanData.price * selectedPlanData.discount / 100).toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>${(selectedPlanData.price * (1 - selectedPlanData.discount / 100)).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {/* Header */}
          <div className="bg-white border-b p-6">
            <div className="flex justify-center mb-4">
              {clubLogo ? (
                <img 
                  src={clubLogo} 
                  alt={`${clubName} Logo`}
                  className="max-h-[300px] w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
                  clubLogo ? 'hidden' : ''
                }`}
                style={{ 
                  background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}80)`
                }}
              >
                <Wine className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-serif text-center">Join {clubName}</CardTitle>
          </div>

          {/* Progress Steps */}
          <div className="bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= step 
                        ? 'text-white' 
                        : 'bg-gray-300 text-gray-600'
                    }`}
                    style={currentStep >= step ? { backgroundColor: primaryColor } : {}}
                  >
                    {step}
                  </div>
                  {step < 3 && (
                    <div 
                      className={`w-12 h-1 mx-2 ${
                        currentStep > step ? '' : 'bg-gray-300'
                      }`}
                      style={currentStep > step ? { backgroundColor: primaryColor } : {}}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center mt-2">
              <p className="text-sm text-gray-600">
                Step {currentStep} of 3: {
                  currentStep === 1 ? 'Choose Plan' :
                  currentStep === 2 ? 'Set Preferences' : 'Personal Info'
                }
              </p>
            </div>
          </div>

          {/* Step Content */}
          <div className="p-6">
            {renderStepContent()}
          </div>

          {/* Navigation */}
          <div className="bg-gray-50 px-6 py-4 flex justify-between">
            <Button 
              variant="outline" 
              onClick={handlePrevStep}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            {currentStep < 3 ? (
              <Button 
                onClick={handleNextStep}
                disabled={currentStep === 1 && !selectedPlan}
                style={{ backgroundColor: primaryColor }}
                className="text-white hover:opacity-90"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={!personalInfo.firstName || !personalInfo.lastName || !personalInfo.email}
                style={{ backgroundColor: primaryColor }}
                className="text-white hover:opacity-90"
              >
                Complete Signup
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

